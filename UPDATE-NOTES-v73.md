# ConceptLab v73 — Bengali Simulation Details & Wider Cards

## Simulation card content
- Removed the chapter/concept metadata chip from each simulation card (including the featured homepage simulation carousel).
- Added Bengali simulation titles and informative Bengali explanations for the complete 89-entry built-in renderer catalogue, including canonical simulations that replace earlier duplicate renderers.
- The same Bengali explanation is used on each simulation's detail page. English-only legacy tip text is replaced by a Bengali learner instruction so the detail header and helper text remain readable in Bengali.
- For admin-added simulations without a specific Bengali description, the site uses a Bengali fallback explanation; an explicit `descriptionBn`, `description_bn`, or `dBn` field takes priority.

## Card layout and widths
- Simulation cards are flex columns with natural, unclamped Bengali descriptions.
- The “সিমুলেশন খুলুন” action uses automatic top spacing so it stays at the bottom of each card; cards in the same grid row stretch to equal height.
- Added a final-priority Simulation catalog stylesheet to resolve conflicting legacy `.w`, `.pgw`, and `.lab-page` widths/paddings.
- On mobile, the Simulation page uses a viewport-width layout with 8px outer gutters and a consistent two-column grid, so the left card reaches farther left and the right card reaches farther right. The one-column rule on narrow phones is overridden for this catalogue only.
- Desktop keeps a wider centered container and a three-column grid.

## Validation
- `npm run check` — passed.
- `npm run check:games` — passed (193 active games, 17 game types, 18 registered handlers).
- `npm run build` — passed.
- Built-in simulation catalogue coverage — 89 unique active renderer entries; all have Bengali title and description mappings.
- New CSS brace balance and dist copies — verified.
