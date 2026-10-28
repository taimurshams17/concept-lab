# ConceptLab deployment and Admin Panel setup

**Recommended: Cloudflare Pages.** Use [`CLOUDFLARE-SETUP.md`](./CLOUDFLARE-SETUP.md) for a step-by-step guide to connect GitHub, create D1/R2 bindings and deploy the website plus its API. This build is configured for Pages Functions; do not upload only the `dist` folder if you need the Admin Panel to save content.

The Admin Panel is part of ConceptLab. After deployment, open `https://YOUR-PROJECT.pages.dev/admin/`. It lets you edit the content types available in the existing editor. Supported content and image edits are persisted to D1/R2 and do not require a code deployment; new application logic still needs a code update.

The legacy Netlify implementation remains in `netlify/functions/api.mjs`. The Cloudflare implementation is in `cloudflare/api.mjs`, routed by `functions/api/[[path]].js`.
