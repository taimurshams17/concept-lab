# ConceptLab v33 — Premium Dark & Simulation Update

## Visual design
- Reworked the default dark background into a layered midnight-navy surface with restrained blue, violet and teal atmospheric lighting.
- Kept existing motion and animation systems; no broad animation shutdown was introduced.

## Mobile performance
- Deferred painting of off-screen simulation, game, chapter and review cards with `content-visibility`.
- Reduced expensive card shadows and header blur on low-power/mobile layouts while keeping the site's existing animation lifecycle and scroll-aware pause behavior.

## Simulation catalogue
- Moved all 80 built-in Arcade `simExplorer` simulations into the main Simulations catalogue, grouped by Physics, Chemistry and Higher Math.
- Removed those simulation entries from the Arcade game list; Arcade remains focused on games and quizzes.
- Imported simulations use their existing interactive engine, so their live model, formulas, metrics and experiment journal remain available.

## Simulation controls and layout
- Added exact numeric inputs (alongside sliders) to the Arcade simulation engine and three quick presets: low, starting and high values.
- Improved numeric editing so decimal values can be typed without being interrupted mid-entry.
- Added direct numeric editors to legacy slider controls where an equivalent number field was not already present.
- Rebalanced the mobile simulation view: more room for the visual model, compact text and controls, tighter spacing, and easier-to-use parameter inputs.

## Validation
- `npm run check` — passed.
- `npm run check:games` — passed.
- `npm run build` — passed.

Mobile performance changes are code-level optimizations; final speed still depends on the phone, browser, and deployed hosting environment.
