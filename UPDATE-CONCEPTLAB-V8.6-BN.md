# ConceptLab v8.6 — Header Message Bell

- Replaced the header Level/XP chip with the Message Centre bell.
- Moved Message Centre from the fixed bottom corner into the top header beside the account controls/menu.
- Replaced the emoji with a small white outlined SVG bell, centred in a smaller circular button.
- Kept the unread-message glow and count badge.
- Hides the message button while the hamburger navigation is open, then restores it when the menu closes.
- Reduced the message panel width and visual footprint for mobile screens.
- Rebuilt `dist/` using `npm run build`.

Validation: `node --check assets/js/app.js` and static build passed. Live browser/device testing was not performed.
