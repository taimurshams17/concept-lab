# DU A,B,C,D Integration

- Library section: **DU A,B,C,D**.
- Source questions imported: **429** (A: 128, B: 114, C: 114, D: 73).
- Questions use the existing past-question MCQ runner in Practice and the existing Speed Sprint runner in Arcade; no new practice mode or game engine was created.
- The original source reference line, unit, question number, four options and answer index are retained in `data/du-abcd-questions.json`.
- Word/phrase profiles are indexed in `data/du-abcd-word-profiles.json`; each profile links back to its original question(s).
- Three source entries had no printed answer line (A 477, A 489, A 533). They are included with inferred answers and marked `conf: inferred`; verify these before relying on them. Two entries (A 199, A 523) are explicitly identified by the source as having no correct supplied option; they remain in the source JSON but are excluded from scored practice/game rounds.
- Some passage-based prompts do not identify a single standalone headword. Such questions remain in the question bank but do not receive an invented word profile. Profiles whose Bengali meaning or word class could not be confidently established are explicitly marked for lexical review.
