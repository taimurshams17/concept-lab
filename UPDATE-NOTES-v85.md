# Concept Lab v85 — HSC Conceptual Quiz Quality Update

## Arcade / Physics Formula Sprint
- Removed both `physics-formula-sprint` entries from the active Arcade catalog and home-game carousel, including daily-game selection.
- Removed the chapter-topic label line from chapter quiz screens so headings such as `পদার্থবিজ্ঞানে ক্যালকুলাস ও ভেক্টর ক্যালকুলাস` are not repeated above every question.
- Shortened topic-derived supplementary option labels elsewhere by removing long enumerations after colons, em dashes, and parenthetical expansions. This specifically prevents a choice such as `ভেক্টরের প্রকারভেদ: ...` from displaying an entire list of subtypes as a single option.

## Physics 1st Paper — Chapter 2: Vector
- Replaced the generated topic-title question pool with 111 individually authored, syllabus-aligned HSC conceptual questions.
- Coverage includes vector and scalar reasoning, reference frames, vector types, axial/polar vectors, zero/unit/position/displacement vectors, geometric addition and subtraction, 2D/3D components, direction cosines, dot/cross products, work and torque, angular momentum, differentiation/integration of position/velocity/acceleration, scalar/vector fields, gradient, divergence, and curl.
- Mixed difficulty levels from foundational through deep reasoning; questions include multi-step reasoning, calculations, interpretation, and boundary/limiting cases.
- Each item has four distinct options, one validated answer index, and an explanation. The bank validation found 111 unique stems, 0 duplicate/empty option sets, 0 invalid answer indices, and no missing explanations.
- Numerical corrections were applied while validating: vector product angle ambiguity (30° or 150°), displacement from velocity integration, force resultant magnitude, dot product value, and divergence values.

## Validation
- `npm run check`: passed (JavaScript syntax check)
- `npm run check:games`: passed (Arcade integrity check)
- `npm run build`: passed (static production build)

## Scope note
This update fully replaces the Physics 1st Paper Chapter 2 bank and removes the named sprint/topic-label clutter. The other chapter banks retain their prior content; supplementary topic labels were compacted, but every question in every other chapter has not yet been individually rewritten to the same authored standard as the new Vector bank.
