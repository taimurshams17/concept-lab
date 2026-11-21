# ConceptLab v84 — Question Bank Floor & Explanation Width

## Question bank
- All 51 syllabus chapters use chapter-specific targets above 80 questions (minimum configured target: 110), calculated from the chapter's TXT topic breadth plus a deterministic chapter-specific variation.
- Existing native chapter questions are preserved; banks are never truncated to hit a display target.
- Qualitative Chemistry receives a dedicated 285–315 target before its separately authored deep conceptual question set is added. Existing legacy/native questions are deduplicated by question stem rather than discarded by a fixed 100-question cap.
- Question difficulty remains mixed across easy, medium, hard and deep-reasoning tiers.

## Explanation layout
- Removed narrow max-width constraints from explanation section wrappers and their nested content.
- Explanation sections now stretch across the full available quiz-card width, with balanced inner padding, readable line height and paragraph spacing.
- Actual key-point lists remain lists; explanatory prose is not converted wholesale into numbered points.

## Validation
- `npm run check`: passed.
- `npm run check:games`: passed (193 active games, 17 game types, 18 registered handlers).
- `npm run build`: passed.
- Source syllabus: 51 chapters; chapter targets are configured above 80 and existing question banks are preserved without truncation.
