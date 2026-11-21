# VocabHub 2.25 — Dashboard UX, Mistake Filters, Daily Study Time & Profile Enrichment

## Implemented

- Homepage Admission Questions shortcuts are real keyboard-accessible buttons. Each one opens its matching bank (DU IBA, DU A/B/C/D, BCS, Medical or CKRUET); the main archive CTA remains available.
- Added matching inline SVG icons to learning metrics in the dashboard, profile snapshot, Mistakes, results and Analytics.
- Rebuilt results “Review these” as compact clickable word previews with part of speech, short Bengali meaning and up to two synonyms; click a preview to open the full profile.
- Mistakes exam now offers custom Difficulty Level and Number of Questions dropdowns. The question-count choices and available-word count refresh when the chosen difficulty changes. A level with no weak words produces a clear message instead of silently switching levels.
- Added a daily study-time view for the last seven local calendar days, based only on session-duration values already recorded in the browser.
- Filled missing example fields in the 2,218-word library using exact 2018 textbook examples and source-linked admission-question sentences where available; remaining gaps receive explicitly labelled suggested editorial examples.
- Added curated synonyms for incomplete profiles where a reliable lexical equivalent is appropriate. Profiles with no natural direct synonym are labelled instead of receiving a misleading entry. Empty antonyms remain intentional where no reliable direct opposite is available.
- Synchronized the canonical JSON, data copy, dedicated BCS and DU A/B/C/D profile copies, and the embedded offline word bundle. Completed the remaining DU idiom profile metadata (word class and an explicitly approximate eSpeak phrase IPA).

## Lexical-data transparency

Suggested example sentences and context glosses are visibly marked as suggested in the word profile. Lookup links are not represented as line-by-line dictionary certification. Antonyms are not fabricated merely to fill a field.

## Validation

- `node --check script.js`
- JSON parsing of all updated data files
- Exact word-count parity across canonical, offline embedded and data JSON copies
- Audit of remaining intentionally blank synonym/antonym fields
- Archive listing and integrity test after packaging

A full browser visual interaction test is not claimed because the headless browser did not complete reliably in this environment.
