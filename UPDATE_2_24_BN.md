# VocabHub 2.24 — Library filtering, BCS setup, charts and Admission topics

## User-requested changes

- **Immediate unit filtering:** fixed the Library unit selector event binding. The hidden value field now receives its change listener after the custom dropdown is rendered; changing the unit updates the Library results immediately. The current selection and “All units” option are preserved.
- **Temporarily remove phrase profiles:** removed 43 multi-word entries from the BCS Vocabulary Library profile set, reducing the full dataset from 2,261 to 2,218 profiles and the dedicated BCS Library set from 224 to 181. This is a vocabulary-profile change only: BCS exam questions and their original stems/references remain in the question bank.
- **BCS practice title/source:** added a dedicated BCS source option independent of DU IBA session metadata. The BCS shortcut now opens “BCS Preliminary past questions” and preselects “BCS Preliminary · English”. The title also follows a source change within the setup dialog.
- **English UI labels:** changed prominent generic question-count labels (including All, Max available, available counts and question type counts) to English. Admission question bank cards now show “questions”.
- **Modern charts:** the learning-rhythm and recent-exam score trends use dated line charts; the x-axis displays dates. Mastery distribution uses horizontal bars rather than a line connecting unrelated categories. Chart spacing and mobile sizing have also been refined.
- **Admission archive:** question banks are organized into topic sections instead of year/session folders. Each question card continues to display its original question number and source reference; original years/session data are preserved in those references.

## Validation

- `node --check script.js` passed.
- JSON parsing and item-count parity are checked across the canonical, data-copy, dedicated BCS and embedded offline vocabulary stores.
- BCS phrase-profile count is checked against the 43 temporarily excluded multi-word profiles.
- BCS question-bank source records are retained and remain independent from the DU IBA source array.
- Chromium headless launch did not complete in this environment, so a browser screenshot/interaction test is not claimed. Static checks passed; visual end-to-end QA remains outstanding.
