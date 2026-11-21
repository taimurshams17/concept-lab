# VocabHub 2.27 — Mobile UX, activity calendar & feedback

## Updated

- Added **Admission Questions** beside the two primary homepage actions: **Start a session** and **Play word arcade**.
- Replaced the 28-day unlabelled activity strip with a month-view calendar. Dates align under weekdays; active days show session counts and graded activity intensity. Monthly active days, sessions and study time are summarized above the calendar.
- Removed the **Score trend** chart from Exam history. Session totals, average/best score and the full session list remain available.
- Increased tap-target size, spacing and visual hierarchy for Flashcard **I know this** / **Need more practice** and completed-session **Play again** / **Exam history** / **Back** controls.
- Added a **Feedback** page with types for error/correction, suggestion/improvement, appreciation and other notes. It stores up to 30 entries in this browser and supports copy/download for sharing.
- Added the Feedback page to desktop Tools navigation and the mobile More drawer.
- Added responsive layouts for small screens and cache-busted the new JS/CSS version.

## Feedback delivery limitation

This project is a static, local-first website with no configured feedback API or server. Feedback submissions are saved in the current browser only; the UI explicitly explains this and offers copy/download actions. They are not automatically sent to the site owner.

## Validation

- JavaScript syntax check (`node --check script.js`).
- JSON parsing and source data count/parity checks.
- ZIP integrity test.
- Static responsive-layout review for homepage, Analytics, Feedback, Exam history and Flashcard/Result screens. A headless Chromium visual run was attempted but did not complete in this environment, so full interactive browser verification is not claimed.
- No user learning progress schema or vocabulary records were intentionally changed.
