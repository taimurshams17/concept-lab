# ConceptLab premium website fix

## Included changes
- Prevents the home page from flashing at the footer before returning to the top; disables browser scroll restoration for the home route while preserving normal in-app route behavior.
- Refines footer typography and spacing, keeps the “NEW” labels off footer links, and adds an animated formula ribbon immediately above the footer.
- Fixes mobile spacing in Student Hub cards and learning content.
- Updates Brain Sprint wording to “Five quick HSC Level questions in English.” and animates the subject icon/art when the subject selection changes.
- Condenses Daily Reflection copy and restyles Daily Inspiration as a more premium card.
- Replaces the old roadmap with a four-step learning flow: Discover → Understand → Experiment → Master.
- Shows Physics (10 chapters), Chemistry (5 chapters), and Higher Mathematics (10 chapters) with a total of 25 chapters, without concepts counts.
- Places FAQ at the bottom of the home page, before the animated formula ribbon and footer.
- Fixes a fatal malformed concatenation in the lesson-stage HTML and a mobile simulation-control insertion error.
- Bumps the service-worker cache version so the browser can pick up the current assets.

## Validation performed
- `npm run build` succeeded.
- `node --check` passed for every `assets/js/*.js` file and `sw.js`.
- Source-render browser harness: homepage starts at scroll position 0; FAQ is the final home section; no footer `NEW` badges; 25 chapter total; no horizontal overflow at a 390px mobile viewport.
- Student Hub mobile layout tested at 390px without horizontal overflow.
- All 105 enabled simulation routes rendered their detail page without the generic error, and the follow-up run recorded no JavaScript console errors.
- Both ZIP archives checked for integrity before delivery.

## Publishing
Upload the project to the GitHub repository and publish the rebuilt `dist` folder if the Pages workflow deploys from `dist`. The live site is not automatically published by this archive.
