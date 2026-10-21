# ConceptLab v9.0.6 — mobile layout, duplicate cleanup and Bengali lab labels

## Updates in this release
- Removed simulation cards that reused an identical simulation renderer under different names. The remaining catalog keeps one canonical lab for every reused renderer and removes duplicate renderer keys from custom/saved catalogs as well.
- Consolidated subject-specific Word Scramble variants into the single Bengali “শব্দ সাজাও” game and merged their word banks.
- Kept “Slope Sniper” and removed the duplicate “Line Slope Challenge”.
- Renamed the qualitative wet-chemical lab to “সিক্ত পরীক্ষা” and improved the ion-identification workflow with reagent selection, observations, evidence history, a final ion guess, and reset controls.
- Added live animation controls to the tiger–deer chase and bus–train relative-motion models; corrected the bus/train initial-gap pixel conversion and made animation time controls smoother.
- Moved the mobile navigation overlay to the top of the webpage viewport to remove the large blank lead-in.
- Applied explicit SVG dimensions at icon creation time and in the tip card so the bulb/help icon cannot expand to the browser's default SVG size.
- Applied mobile flex ordering to make simulation controls actually appear before larger stages, with compact spacing and responsive About page cards.

## Verification
- JavaScript syntax checks passed for `app.js`, `defaults.js`, `sims.js`, and `mono-icons.js`.
- Static build completed using `npm run build`.
- ZIP integrity checked with `unzip -t`.
- Browser/device manual QA was not completed in this environment; test the deployed mobile view and use each interactive simulation once before publishing.
