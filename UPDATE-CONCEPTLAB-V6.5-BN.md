# ConceptLab v6.5 — UI polish update

- Fixed the navigation dropdown to anchor to the viewport below the sticky header on desktop and mobile, rather than the page's scroll position. Added a viewport-based maximum height and independent vertical scrolling so menu links remain visible from any scroll position.
- Refined mobile arcade cards: consistent icon tiles, removed excessive emoji glow, shorter/clamped descriptions, improved typography and spacing, compact XP metadata, responsive two-column layout with a single-column fallback on very narrow screens.
- Updated the Daily Inspiration quote typography to a more editorial Lora/Georgia serif stack, with improved weight, line-height and subtle decorative quote treatment.
- Added entrance motion to Ayat/Hadith and Daily Inspiration, plus more consistent transitions for page cards and navigation.
- Kept reduced-motion accessibility preferences respected.

Validation: `node --check assets/js/app.js`, `node --check assets/js/games.js`, and `npm run build` completed successfully. The ZIP contains the source project and refreshed `dist/` output.
