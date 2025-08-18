## Storefront (standalone)

Minimal Next.js app used to reproduce Sanity Presentation Tool behavior across two localization scenarios: single-domain (route-based) and hybrid (domain-per-locale + route-based).

### Install
```bash
pnpm install
```

### Environment
This app reads public and server envs via `valibot` schemas. Required variables:

- Public (client + server):
  - `NEXT_PUBLIC_APP_ENV`: one of `local|development|staging|production`
  - `NEXT_PUBLIC_BRAND`: e.g. `brand-1`
  - `NEXT_PUBLIC_CONTEXT_ENV`: JSON string with intl config
    - `NEXT_PUBLIC_INTL_LOCALES`: array of locales, e.g. `["en","sv","no"]`
    - `NEXT_PUBLIC_INTL_DEFAULT_LOCALE`: e.g. `en`
    - `NEXT_PUBLIC_INTL_DOMAINS`: array of domain mappings used by `next-intl`
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_PROJECT_DATASET`

- Server-only:
  - `REVALIDATE_CACHE_SECRET`
  - `SANITY_API_TOKEN`
  - `SANITY_LIVE_API_TOKEN`
  - `SANITY_PERSPECTIVE` (string)
  - `SANITY_STUDIO_URL` (URL to the Studio workspace, e.g. `http://localhost:3333/hybrid`)
  - `SANITY_PRESENTATION_TOOL_ENABLED` (optional: `0` or `1`)
  - `STORE_ID` (number)

#### Example: Single-domain (route-based) .env
```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_BRAND=brand-1
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_PROJECT_DATASET=development

# One domain, route-based locales (default locale not prefixed)
NEXT_PUBLIC_CONTEXT_ENV={"NEXT_PUBLIC_INTL_LOCALES":["en","sv","no"],"NEXT_PUBLIC_INTL_DEFAULT_LOCALE":"en","NEXT_PUBLIC_INTL_DOMAINS":[{"domain":"localhost:3000","locales":["en","sv","no"],"defaultLocale":"en"}]}

REVALIDATE_CACHE_SECRET=dev-secret
SANITY_API_TOKEN=yourApiToken
SANITY_LIVE_API_TOKEN=yourLiveToken
SANITY_PERSPECTIVE=previewDrafts
SANITY_STUDIO_URL=http://localhost:3333/single
SANITY_PRESENTATION_TOOL_ENABLED=1
STORE_ID=1
```

Start the app (port 3000):
```bash
pnpm dev
```

#### Example: Hybrid (domain-per-locale) .env
For local development, the Studio workspace points each language to a different port. Configure domains accordingly and run multiple dev servers.

```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_BRAND=brand-1
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_PROJECT_DATASET=development

# Map locales to different local "domains" (ports)
NEXT_PUBLIC_CONTEXT_ENV={"NEXT_PUBLIC_INTL_LOCALES":["sv","en","no"],"NEXT_PUBLIC_INTL_DEFAULT_LOCALE":"sv","NEXT_PUBLIC_INTL_DOMAINS":[{"domain":"localhost:3000","locales":["sv"],"defaultLocale":"sv"},{"domain":"localhost:3001","locales":["en"],"defaultLocale":"en"},{"domain":"localhost:3002","locales":["no"],"defaultLocale":"no"}]}

REVALIDATE_CACHE_SECRET=dev-secret
SANITY_API_TOKEN=yourApiToken
SANITY_LIVE_API_TOKEN=yourLiveToken
SANITY_PERSPECTIVE=previewDrafts
SANITY_STUDIO_URL=http://localhost:3333/hybrid
SANITY_PRESENTATION_TOOL_ENABLED=1
STORE_ID=1
```

Run three instances in separate terminals:
```bash
# Swedish (default)
pnpm dev --port 3000

# English
pnpm dev --port 3001

# Norwegian
pnpm dev --port 3002
```

The Studio workspace will reference:
- Hybrid: `http://localhost:3000` (sv), `http://localhost:3001` (en), `http://localhost:3002` (no)
- Single: `http://localhost:3000` (default `en`), with prefixes like `/sv-se`, `/no-no`

### Visual Editing / Presentation Tool
- Visual Editing is wired via `next-sanity` and enabled only when Next.js draft mode is on.
- Draft mode endpoints:
  - Enable: `/api/draft-mode/enable`
  - Disable: `/api/draft-mode/disable`
- When enabled, `src/features/content/PresentationToolProvider.tsx` renders `<SanityLive />` and `<VisualEditing />`.

### Webhooks and Cache Invalidation (optional)
- Sanity webhook endpoint: `POST /api/webhook/sanity`
  - Uses `REVALIDATE_CACHE_SECRET` and invalidates Next.js tags for pages/frames/translations.
- Manual invalidation:
  - `POST /api/cache/invalidate-frames` with header `x-invalidate-cache-secret`
  - `POST /api/cache/invalidate-pages` with header `x-invalidate-cache-secret`

### Notes
- `next-intl` routing is configured in `src/features/intl/config/routing.ts` using env-driven locales/domains.
- This app is intentionally minimal to reproduce Presentation Tool behavior with both single and hybrid setups.


