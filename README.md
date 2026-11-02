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

## Premium refresh (2026-11)

### What changed
- Refined the shared visual layer with a restrained gold/champagne accent, calmer surfaces, more deliberate hover/focus states, and responsive layouts.
- Restyled the three-line navigation menu without changing the hamburger's intended dimensions.
- Replaced the default button-tap and navigation tones with shorter, softer synthesized sounds. Sound settings and the sound toggle still work as before.
- Rebuilt **My Progress → Chapters** as compact subject-wise lists. Each row shows only the chapter name, progress bar, and completed stage count; concept names are not shown.
- Upgraded **Student Hub → Base Converter** with source/target base selection (2–36), negative integer support, swap controls, quick examples, copy-result action, common-base outputs, 4-bit binary grouping, bit length, and a short conversion-method explanation.

### How to use Base Converter
1. Open **Student Hub** from the main menu or bottom navigation.
2. Open **Base Converter**.
3. Enter an integer. Use `0–9` and `A–Z` as valid for the selected source base (`FF` is valid in base 16).
4. Choose **From base** and **To base**. Results update automatically.
5. Use **Swap bases** to reverse the conversion, **Quick examples** to load a sample, and **Copy result** to copy the main converted value.
6. Expand **How was it converted?** for the method summary.

**Current limitation:** Base Converter handles integers only; fractional values are not supported yet. The layout is responsive and includes mobile-specific spacing rules.

### Verification
- `npm run check` — JavaScript syntax checks.
- `npm run check:games` — arcade registry integrity.
- `npm run build` — static build.
