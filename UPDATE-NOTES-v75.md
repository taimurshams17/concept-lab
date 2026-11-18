# ConceptLab v75 — homepage carousel and upload-package cleanup

- Fixed the homepage Interactive Simulations carousel so only the active simulation card is visible. The carousel already had next/previous and swipe navigation; a more-specific CSS rule now ensures hidden cards stay hidden.
- Enlarged the Student Hub Toolkit previous/next controls to match the circular Arcade carousel controls and raised them slightly on desktop. Mobile keeps its existing horizontal swipe behavior.
- Added accessible `aria-controls` links from the Toolkit arrows to their scroll rail.
- The GitHub upload ZIP is source-only: generated `dist/` is excluded because Netlify rebuilds it through `npm run build`. This removes the duplicate generated copy of the site while preserving the full source project.

## Validation

- `npm run check`
- `npm run check:games`
- `npm run build`
