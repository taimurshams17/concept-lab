# ConceptLab Game Academy Update

## What's changed

- Reworked the Games / Arcade page into a subject-first catalogue: Physics, Chemistry, Higher Mathematics, and mixed challenge games.
- Added chapter-based grouping with paper (1st/2nd paper) sections, plus search across game names, chapter names, and descriptions.
- Preserved the existing game catalogue and mapped existing games to relevant subjects and chapters where possible.
- Added 45 playable question-based games across Physics, Chemistry, and Higher Mathematics. The catalogue merges these with the 38 default games, producing 83 default playable games before considering saved/custom games.
- The catalogue covers 51 chapters across the three subjects; each chapter currently has at least one game mapped to it.
- Every standard quiz game opens a level chooser:
  1. Level 1 — Concept
  2. Level 2 — Board Challenge
  3. Level 3 — Admission Challenge
  4. Boss Level
  5. Mistake Review
- Question pools are staged by difficulty where tier metadata is available; other quiz pools use progressively larger/different subsets, and timers are adjusted for level-based MCQs.
- Wrong answers and explanations are stored in local browser storage for per-game Mistake Review. Review entries can be cleared from the review page.
- Existing Chemistry interactive labs, including the Ion Detective workflow, are retained; these continue to use their custom in-game modes.
- Updated the service-worker cache version and shell to include the new Game Academy catalogue.
- Added responsive styling for the chapter catalogue and level pages, including mobile layouts.

## Main files changed

- `assets/js/game-academy.js` — chapter metadata, new games, subject/chapter mapping, and challenge-level metadata.
- `assets/js/app.js` — new Games page, chapter grouping, level chooser, routing, progress and mistake review.
- `assets/js/games.js` — challenge-round adjustments and mistake capture for selected existing games.
- `assets/css/main.css` — Game Academy, level cards, review page, and responsive styles.
- `index.html` — loaded the new catalogue script and updated the bottom navigation label.
- `sw.js` — new cache version and `game-academy.js` in the offline shell.

## Validation performed

- JavaScript syntax checks for the changed scripts.
- Catalogue test for duplicate game IDs, chapter coverage, question answer indexes, option arrays, explanations, and level tags.
- The browser UI was not fully exercised in an interactive browser in this build environment, so please test the deployed GitHub Pages site on desktop and mobile before announcing the update.

## Deploy

1. Extract the ZIP and keep the `ConceptLab/` directory structure intact.
2. Replace the corresponding website files in the GitHub Pages repository, or copy the updated contents into the repository root according to your current deployment setup.
3. Commit and push to GitHub Pages.
4. Hard-refresh the site; if an older page persists on a device, close/reopen it once so the service-worker update can activate.

## Syllabus note

The chapter grouping follows the commonly used HSC chapter structure. Before treating a question as an official board/admission question, check it against the applicable year's NCTB syllabus and textbook. The added MCQs are original practice items, not claims that those exact questions appeared in an exam.
