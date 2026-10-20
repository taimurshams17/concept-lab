# ConceptLab v8.7 — Monochrome Icon Update

- Added a lightweight SVG icon layer that replaces decorative emoji in rendered site and admin UI with distinct white/monochrome outline icons.
- Added semantic mappings for games, simulations, science tools, progress, learning, navigation, and common status glyphs.
- Uses inline SVG and local assets; no new external icon dependency.
- Dynamic UI is covered by a MutationObserver, including route-rendered game and simulation cards.
- Added compact responsive sizing via `assets/css/mono-icons.css`.

## Notes
Icons inherit `currentColor` to maintain contrast with existing themes. Text content inside code/pre/input/textarea/script/style is intentionally not modified.
