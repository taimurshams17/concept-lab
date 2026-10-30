# Desktop layout correction — v11.4

This update corrects the previous desktop layout patch at its source and forces browsers to fetch the updated assets.

- The account Sign in / Sign up switch is limited to a centered 420px width on desktop.
- Student Hub tool pages are limited to an 840px centered reading column; the Student Hub dashboard is limited to 940px.
- These width rules apply only at viewport widths of 900px and above. Existing mobile layout rules are unchanged.
- The significant-figures shortcut now uses the Unicode superscript-n character (`10ⁿ`). The previous HTML `<sup>` was a separate CSS Grid item inside the icon box, which could place `n` on a lower row.
- The stylesheet/script query versions and service-worker cache version have been updated so old cached assets cannot mask the fixes.

Netlify builds the static deployment from the repository root with `npm run build`, publishing `dist/`. After pushing the updated files, wait for the deployment to finish. If an installed PWA remains open, close and reopen it once so the new service worker can activate.
