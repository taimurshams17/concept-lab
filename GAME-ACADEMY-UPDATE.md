# ConceptLab Game Academy Update

## What's changed

- Reworked the Games / Arcade page into a subject-first catalogue: Physics, Chemistry, Higher Mathematics, and mixed challenge games.
- Added chapter-based grouping with paper (1st/2nd paper) sections, plus search across game names, chapter names, and descriptions.
- Preserved the existing game catalogue and mapped existing games to relevant subjects and chapters where possible.
- Added 45 playable question-based games across Physics, Chemistry, and Higher Mathematics. Added 80 new interactive, parameter-driven simulations (32 Physics, 22 Chemistry, 26 Higher Mathematics), for 163 built-in playable games before considering saved/custom games.
- The catalogue covers 51 chapters across the three subjects; each chapter currently has at least one game mapped to it.
- Only quiz/puzzle games open a level chooser:
  1. Level 1 — Concept
  2. Level 2 — Board Challenge
  3. Level 3 — Admission Challenge
  4. Boss Level
  5. Mistake Review
- Question pools are staged by difficulty where tier metadata is available; other quiz pools use progressively larger/different subsets, and timers are adjusted for level-based MCQs.
- Wrong answers and explanations are stored in local browser storage for per-game Mistake Review. Review entries can be cleared from the review page.
- Existing Chemistry interactive labs, Mass Atlas, Periodic Quest, and other exploratory games launch directly without quiz stages. New simulation games have adjustable sliders and number inputs, live outputs/visuals, and a three-observation experiment journal. Existing Chemistry interactive labs, including the Ion Detective workflow, are retained; these continue to use their custom in-game modes.
- Updated the service-worker cache version and shell to include the new Game Academy catalogue.
- Added responsive styling for the chapter catalogue and level pages, including mobile layouts.

## Main files changed

- `assets/js/game-academy.js` — chapter metadata, quiz games, 80 new interactive simulations, subject/chapter mapping, and challenge-level metadata.
- `assets/js/app.js` — new Games page, chapter grouping, level chooser, routing, progress and mistake review.
- `assets/js/games.js` — challenge-round adjustments, mistake capture, and the reusable parameter-driven simulation explorer.
- `assets/css/main.css` — Game Academy, level cards, review page, and responsive styles.
- `index.html` — loaded the new catalogue script and updated the bottom navigation label.
- `sw.js` — new cache version and `game-academy.js` in the offline shell.

## Validation performed

- Rebuilt the static site successfully and ran JavaScript syntax checks on the changed source and generated files.
- Catalogue check: 163 active games, 80 new simulations, no duplicate game IDs, and valid chapter mappings for every new simulation.
- Simulation-engine smoke test: all 80 games produced a live model/metrics, and the three-observation journal completed successfully in the test harness.
- The full browser UI was not verified interactively in a real user session in this environment. Please test the deployed GitHub Pages site on desktop and mobile before announcing the update.

## Deploy

1. Extract the ZIP and keep the `ConceptLab/` directory structure intact.
2. Replace the corresponding website files in the GitHub Pages repository, or copy the updated contents into the repository root according to your current deployment setup.
3. Commit and push to GitHub Pages.
4. Hard-refresh the site; if an older page persists on a device, close/reopen it once so the service-worker update can activate.

## Syllabus note

The chapter grouping follows the commonly used HSC chapter structure. Before treating a question as an official board/admission question, check it against the applicable year's NCTB syllabus and textbook. The added MCQs are original practice items, not claims that those exact questions appeared in an exam.


## Simulation expansion

- Game catalogue: 163 built-in games (83 existing + 80 simulations).
- Added 32 Physics simulations, 22 Chemistry simulations, and 26 Higher Mathematics simulations.
- Simulations support live sliders and editable numeric fields, calculated outputs, a changing visual model, reset controls, and a three-experiment observation journal.
- Staged levels and Mistake Review are shown only for question/puzzle-type games. Simulation/exploration games open directly.
