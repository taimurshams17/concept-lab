# ConceptLab v7.1 — Visual animation update

## Homepage
- Added a new animated “SCIENCE IN MOTION” section directly below “THE BEAUTY OF DISCOVERY”.
- Added three lightweight animated visual panels: wave patterns, orbital motion, and magnetic field lines.
- Preserved the existing homepage sequence: Discovery section → new science motion section → Explore Chapters CTA → final animated formula ticker.

## Other tabs
- Added restrained page-heading entrance animations across non-auth pages.
- Added subtle orbital/diagram accents to Chapters, Arcade, Lab, Daily, Leaderboard, Study Space, and About pages.
- Improved card hover transitions while avoiding oversized glowing spheres.
- Added responsive mobile layout for the new motion cards.
- Respects `prefers-reduced-motion` to disable decorative movement when requested by the device.

## Validation
- `node --check assets/js/app.js`: passed.
- `npm run build`: passed.
- ZIP integrity check: passed.
- Browser-based visual testing was not available; verify the final layout on desktop and mobile after deployment.
