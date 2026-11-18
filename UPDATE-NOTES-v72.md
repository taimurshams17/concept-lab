# ConceptLab v72 — Student Hub Semantic Icon Pass

## Included updates
- Added a precise route/ID-to-icon map for every Student Hub tool tile, including core planners, revision tools, wellbeing tools, science and mathematics tools, and resource shortcuts.
- Replaced broad chemistry/lab text matching that could assign a flask icon to unrelated cards. A tool description mentioning chemistry or a lab no longer overrides that tool's own icon.
- Added dedicated line-icon artwork for a clipboard, matrix grid, checklist, moon, eye, flashcards, percentage, and summation.
- Updated fallback glyphs for symbolic tools so every tile can still display a sensible icon before the monochrome icon layer runs.
- Bumped the icon asset URL and service-worker cache version.

## Icon principles
- Planner and schedule tools use calendar, clock, checklist, or clipboard symbols.
- Notes and revision tools use note, book, flashcard, or brain symbols.
- Progress tools use chart, target, or medal symbols.
- Mathematics tools use calculator, function, grid, compass, dice, or summation symbols.
- Chemistry-specific tools use balance, atom, or droplet symbols; unrelated tools do not use flask/beaker artwork.

## Validation
- JavaScript syntax check for all project scripts.
- Static build.
- Route coverage check for the Student Hub icon map.
- Game integrity check.
