# VocabHub v2.4 — Achievements & Analytics Update

## Achievement cards
- Redesigned as premium milestone cards with distinct icon treatments, unlocked/locked states, watermark artwork, earned dates, and progress bars for locked milestones.
- Added a collection summary with unlocked count and completion percentage.
- Existing achievement rules and local progress keys are preserved.

## Analytics
- Added total learning XP and learner level summary.
- Added sessions, correct answers, overall accuracy, practice time, words attempted, vocabulary completion, active days, and mastered words.
- Added average session accuracy, best session accuracy, most-used activity, revision answers, weekly session and answer counts, and week-over-week correct-answer comparison.
- Added progress by difficulty and category, including learned/mastered counts.
- Improved the 28-day activity calendar with session-count tooltips.
- Metrics are calculated from the existing local session and word-progress data; no new account or server is required.

## Compatibility / validation
- Preserved the existing 529 bundled vocabulary entries.
- Preserved the existing localStorage key and data model.
- JavaScript syntax checked with `node --check`.
- Responsive styling added for desktop and mobile, retaining both existing themes.
