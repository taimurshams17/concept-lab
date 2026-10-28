# ConceptLab

Concept-first lessons in Higher Mathematics, Chemistry and Physics, with interactive simulations, mini-games, student accounts, learning progress, and a content-management admin panel.

## Recommended hosting: GitHub + Netlify

This project is prepared for Git-based deployment on **Netlify**. The site is built from the source files, and the admin API uses Netlify Functions with Netlify Blobs for persistent content, admin accounts, student accounts, uploads, and revision history.

- Public site: `/`
- Admin panel: `/admin/`
- API: `/api/*`
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

Follow [`NETLIFY-DEPLOY.md`](./NETLIFY-DEPLOY.md) before the first production deploy. In particular, set the `CONCEPTLAB_ADMIN_SETUP_KEY` environment variable before creating the first admin account. Do not commit environment files or secrets to GitHub.

## Main source files

- `index.html` and `assets/`: public website
- `assets/js/defaults.js`: built-in lesson, game, simulation, and home-page content
- `assets/js/app.js`, `assets/js/sims.js`, `assets/js/games.js`: main app, simulations, and games
- `admin/`: browser-based admin panel
- `netlify/functions/api.mjs`: authenticated API and persistent storage access
- `scripts/build-static.js`: creates the deployment-ready `dist/` folder

## Local checks

```bash
npm install
npm run check
npm run build
```

To test the full API locally, install the Netlify CLI and run `npm run dev`. Netlify Blobs production persistence is provided by Netlify; use the production site for the final admin setup.

## Deployment notes

`dist/` is generated at build time and is intentionally ignored by Git. Push source files to GitHub and let Netlify run the build. Netlify's site-wide Blobs stores persist across production deploys, so content saved in the admin panel is not lost when the code is redeployed. Avoid editing content from deploy-preview environments because Netlify Blobs stores are site-wide for the project.

The admin panel edits published content; application code, styles, and new functionality still require a Git commit and a new deployment.

See `CHANGELOG.md` for feature history and other update notes for recent content changes.
