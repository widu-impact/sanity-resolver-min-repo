## Sanity Studio

Minimal Studio configured with multiple workspaces to reproduce Presentation Tool behavior for two localization strategies: single-domain and hybrid (domain-per-locale + route-based).s

### Install

```bash
pnpm install
```

### Environment

Required envs (validated via `valibot` in `src/env.ts`):

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_PROJECT_DATASET` (one of `development|production`)
- `SANITY_STUDIO_HOST_NAME` (currently supports `brand-1`)
- `SANITY_STUDIO_GROUP` (e.g. `brand-1`)
- `SANITY_STUDIO_ENV_NAME` (one of `production|staging|development`)

Example `.env` for local dev:

```bash
SANITY_STUDIO_PROJECT_ID=yourProjectId
SANITY_STUDIO_PROJECT_DATASET=development
SANITY_STUDIO_HOST_NAME=brand-1
SANITY_STUDIO_GROUP=brand-1
SANITY_STUDIO_ENV_NAME=development
```

### Workspaces and scenarios

Workspaces are generated in `src/workspaces.ts` and consumed by `sanity.config.ts`.

- **Hybrid** (`/hybrid`):
  - Default language: `sv` //in the hybrid scenario is not relevant
  - Languages: `sv`, `no`, `en`
  - Each language points to a different local storefront URL:
    - `sv`: `http://localhost:3000`
    - `en`: `http://localhost:3001`
    - `no`: `http://localhost:3002`

- **Single** (`/single`):
  - Default language: `en`
  - Languages: `sv`, `no`, `en`
  - All languages point to a single storefront URL (route-based localization):
    - `http://localhost:3000` (with prefixes like `/sv-se`, `/no-no`; `en` is default)

### Presentation Tool configuration

See `src/presentation.ts`.

- `allowOrigins` is populated from workspace language `storefrontUrl`s.
- `previewUrl` points to the first language URL and draft mode endpoints:
  - Enable: `/api/draft-mode/enable`
  - Disable: `/api/draft-mode/disable`
- `mainDocuments` resolution:
  - `/:locale/:slug` — resolves a `P060StandardPage` for the given locale/slug.
  - `/:localeOrSlug` — resolves either a `P020HomePage` when the param is a locale, or a `P060StandardPage` in default language when it is a slug.
  - `/` — resolves a `P020HomePage` in the workspace default language.

Issue reproduced for the hybrid case: `origin` in the resolver is always `undefined`, so we cannot disambiguate which domain the preview is on to derive the correct language when the path alone is ambiguous.

### Dataset for testing

There is a compressed dataset in `dataset/` to quickly seed content:

- File: `dataset/example-18-08-2025-10-24.tar.gz`

Import (from the `studio` folder):

```bash
npx sanity dataset import ./dataset/example-18-08-2025-10-24.tar.gz development
```

### Run

```bash
pnpm dev
```

Studio will be available at `http://localhost:3333`. Workspaces mount at:

- Hybrid: `http://localhost:3333/hybrid`
- Single: `http://localhost:3333/single`

Make sure corresponding storefront(s) are running and that the URLs match those generated in `src/workspaces.ts`.
