# VocabHub 2.26 — Admission Navigation Hotfix

## Fixed

- Fixed the homepage Admission Questions shortcut buttons. The selected bank is now stored and the app navigates to the Admission Questions page before rendering it. Previously the helper re-rendered the current page, so a click from the homepage appeared to do nothing.
- Added cache-busting version parameters to the main stylesheet and application script so replacing files in an existing extracted folder does not keep using an older cached JS/CSS asset.

## Retained from 2.25

- Learning metric icons and compact Review these word cards.
- Mistakes difficulty and question-count selectors.
- Seven-day daily study-time summary based on recorded session durations.
- Updated vocabulary JSON and offline embedded vocabulary bundle.

## Validation

- JavaScript syntax check (`node --check script.js`).
- JSON parse and word-count parity checks.
- ZIP integrity test.
- Static check that all five homepage shortcuts call `openAdmissionBank(...)` and that `openAdmissionBank` navigates to `#admission` through `go('admission')`.

A full browser visual test remains unavailable in this environment; no browser interaction test is claimed.
