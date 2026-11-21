# ConceptLab v81 — Arcade Quiz Layout Refinement

## Changes
- Chapter quiz totals now vary deterministically by chapter across 40, 42, 48, 55, 60, 68, 72, 80, 90 and 100 questions instead of presenting a uniform 50-question count. Questions are topped up only from that chapter's syllabus topics; oversized pools are trimmed to that chapter's selected total.
- Explanation content now uses full available width in the answer panel. The previous narrow centered inner content has been removed; mobile and desktop padding are reduced while retaining readable line spacing.
- Explanation paragraphs are presented as paragraphs by default. Numbered lists are no longer applied to every sentence; formula and short-summary callouts remain separate. This keeps point-style formatting for genuinely important facts rather than turning the whole explanation into a numbered list.
- Question text is slightly smaller and more balanced on mobile.
- Question count is aligned on the left and the difficulty badge on the right on the same row. The topic label is shown beneath that row.
- Cache-busting versions updated for the changed assets.

## Validation
- `node --check` passed for `assets/js/app.js`, `assets/js/games.js`, and the syllabus question bank.
- Arcade integrity check passed: 193 active games, 17 game types, 18 registered handlers.
- Static production build completed successfully (`npm run build`).
