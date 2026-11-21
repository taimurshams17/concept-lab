# ConceptLab v82 — Chapter Question Floors & Wider Explanations

## Chapter quiz question counts
- Removed the previous 40–100 cap. Existing chapter question banks are no longer sliced/truncated to a display target.
- All 51 syllabus chapters receive a chapter-specific target strictly above 80 (target distribution 84–196), and the quiz keeps every existing native question even when that bank already exceeds the target.
- Qualitative Chemistry is restored from its 31 legacy concept groups: 310 stored rows yield 238 distinct native question stems after de-duplication. Added 33 additional authored conceptual MCQs on quantum numbers, electron configuration, line spectra, UV/IR/MRI, flame tests, Ksp/common-ion effects, crystallization, separation methods and chromatography. This gives at least 271 distinct authored/native question stems in that chapter before any other mapped game questions are counted.

## Explanation layout
- Explanation sections and prose now stretch across the full available quiz-card width with reduced side padding.
- The former step-style explanation no longer converts every sentence into a numbered-looking item. It is displayed as a coherent paragraph; list styling is reserved for actual key-point lists.
- Mobile font size, line-height and paragraph spacing were tuned for readable full-width explanations.

## Validation
- `npm run check`: JavaScript syntax passed.
- `npm run check:games`: 193 active games, 17 game types, 18 registered handlers passed.
- `npm run build`: static production build succeeded.
- Source syllabus contains 51 chapters; every chapter has at least 4 syllabus topics available to the question generator.
