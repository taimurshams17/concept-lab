# ConceptLab v6.7 — Home Layout & Motion Fix

## Changes
- Centered the Interactive Playground heading, description, and tags on desktop and mobile.
- Corrected the Arcade carousel's default selected game to the middle card (including even game counts), and re-centers it after layout settles to avoid left-biased initial selection.
- Added subtle science-themed motion accents to lower homepage sections and selected learning pages: orbit rings, floating formula marks, and animated energy lines.
- Added responsive sizing and reduced-motion support for the new visual effects.
- Kept existing content and game routes intact.

## Validation
- `node --check assets/js/app.js` passed.
- `npm run build` passed.
- ZIP integrity check passed.

Browser testing on real devices is still recommended, particularly to verify carousel centering at different desktop widths.
