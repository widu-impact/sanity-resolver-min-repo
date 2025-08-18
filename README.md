## Widforss Sanity Studio Context – Minimal Reproduction

This repository contains two minimal apps used to reproduce an issue with the Sanity Presentation Tool when using different localization strategies.

- `storefront-standalone/`: Next.js storefront with `next-intl` routing and `next-sanity` Visual Editing
- `studio/`: Sanity Studio with multiple workspaces (single vs hybrid) and Presentation Tool configuration

### Scenarios

- **Single-domain (route-based)**: one domain, locales in the URL; default locale not prefixed.
- **Hybrid**: mix of domain-per-locale and route-based localization.

The reproduction shows that, in Hybrid, the Presentation Tool resolver receives `origin` as `undefined`, making it hard to determine the current storefront domain and thereby resolve `mainDocuments` correctly when the path alone is ambiguous.

### Setup

1. See `storefront-standalone/README.md` for envs and how to run 1 (single) or multiple (hybrid) storefront instances.
2. See `studio/README.md` for Studio envs, workspaces, Presentation Tool details, and dataset import.

### Dataset

A test dataset is provided at `studio/dataset/example-18-08-2025-10-24.tar.gz`. Import into the `development` dataset:

```bash
cd studio
npx sanity dataset import ./dataset/example-18-08-2025-10-24.tar.gz development
```
