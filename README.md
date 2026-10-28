## Recommended deployment: Cloudflare Pages

This archive includes a Cloudflare Pages Functions API route and D1/R2 bindings for the `/admin/` content editor. Setup guide: [`CLOUDFLARE-SETUP.md`](./CLOUDFLARE-SETUP.md). Before the first deployment, create D1 and R2 resources, replace the D1 database ID in `wrangler.jsonc`, and apply `cloudflare/migrations/0001_initial.sql`. Do not deploy only `dist` if you need Admin login and content/image saving.

The Cloudflare runtime adapter is `cloudflare/api.mjs` + `cloudflare/storage.mjs`; Pages routes `/api/*` through `functions/api/[[path]].js`. The older Netlify implementation is retained in `netlify/functions/api.mjs` for reference/legacy use.

# ConceptLab

Concept-first lessons in Higher Math, Chemistry and Physics, explained in Bengali.
Black theme with a sky-blue glow, animations, 8 mini-games, 14 simulations, XP / levels / badges, and an admin panel at `/admin/`.

- `index.html`, `assets/` public site (vanilla JS, hash routing)
  - `assets/js/defaults.js` built-in content (home sections, chapters, games, simulations, badges)
  - `assets/js/sims.js` simulations, `assets/js/games.js` mini-games, `assets/js/fx.js` effects
- `admin/` admin panel: Home sections, Chapters, Games, Simulations, XP & Badges, Subjects, All Texts, Media, Theme, Settings, Team
- `netlify/functions/api.mjs` API (auth + content storage in Netlify Blobs)
- `scripts/build-static.js` copies the site into `dist/`

Saved admin content overrides the built-in content. See SETUP-GUIDE.md to deploy.


## HSC concept simulation pack
- The built-in content now includes 36 additional HSC topic-labelled simulation entries across Physics, Chemistry and Higher Mathematics.
- In Admin > Simulations (Lab), choose **Add missing HSC simulation pack**, then review entries and press **Save changes**. Existing IDs are skipped, so it is safe to run again.
- The home-page simulation carousel cycles through visible entries (not only unique engine types), so topic-specific entries appear in the left/right showcase.
- Admin > Chapters > edit a concept lets you choose an interactive simulation engine for Stage 3.
- New interactive engines include qualitative models for reaction kinetics, equilibrium, pH, titration, electrochemistry, thin-lens optics, magnetic field, periodic trends, bond polarity and stoichiometry. These are learning models, not substitutes for lab measurements or a verified official syllabus checklist.


## ConceptLab v8.9 update
- Added a homepage Quick Access launchpad for the core features, all three subjects, and the Student Hub tools.
- Added a card-based three-line menu with monochrome icons, short descriptions, and direct links to all 11 Student Hub tools.
- Added a persistent bottom navigation: Home, Chapters, Arcade, Simulations, Student Hub, and About.


## ConceptLab v9.4 update
- Removed the homepage Universal Learning Finder, its Ctrl/Cmd+K shortcut, the Daily Discovery lab rotation, and resource counters.
- Replaced the previous home learning desk with Brain Sprint: a timed five-question quiz for Physics, Chemistry, Higher Mathematics, or mixed subjects.
- Added answer explanations, a visible timer/progress indicator, and personal-best records saved locally per selected subject.
- Preserved the existing Student Hub, chapter, simulation, and game routes.
- See `CHANGELOG.md` for details.
