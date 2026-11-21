# BCS English Question Bank Integration — 2.21

## Source and selection

- The supplied `note.txt` yielded **488 numbered questions**.
- **485 English questions** were added to the site. Three questions (145–147) concern medical/biological subject matter rather than English and were left out of the English bank.
- **484 questions have a prepared answer key** and are available in the existing MCQ runner. Question 368 is retained in the archive but not scored: its answer depends on a reading passage that is not present in the supplied text.
- The source text also contains **38 entries whose displayed source reference names another exam** rather than BCS. They are retained because they occur in the supplied BCS question-bank extract, but the original reference is displayed as written; they are not relabelled as official BCS exam items.
- Original question numbering, four options and reference strings are retained. OCR-style duplicated/letter-spaced fragments were cleaned where the readable text was repeated immediately in the source.

## Existing features used (no new practice or game mode)

- **Practice:** BCS question types launch through the existing Multiple Choice / past-question practice runner.
- **Arcade:** BCS questions launch through the existing timed past-question Speed Sprint (30, 60 or 120 seconds).
- **Question Bank:** BCS Preliminary · English is added as a source bank in the existing Admission Questions archive, grouped by BCS year when the reference includes one and otherwise by “অন্যান্য রেফারেন্স”.
- **Existing question-type filters:** 12 BCS content labels are used for category selection. The labels are editorial classification from each question's wording; the source extract did not provide a per-question topic label.

## Answer key and review limits

- Answers and concise Bengali/English rule notes are model-prepared from the question, its options and standard English usage. The uploaded extract did not include an official answer key or original explanations.
- **27 scored questions** carry a “verify once” marker because an option set or wording is ambiguous, context-dependent or imperfect. The warning is shown in the practice feedback and is documented in `BCS_QUESTION_KEY_REVIEW.tsv`.
- Question 368 is unscored because the reading passage needed to answer it is missing.
- The review TSV lists all imported English questions, their category, keyed option, answer text, displayed source and any review note for manual checking.

## Category mapping to existing formats

| BCS question type | Existing practice/game fit |
|---|---|
| Vocabulary, spelling, synonyms and antonyms | Synonym & Antonym / MCQ / Speed Sprint |
| Fill in the blanks and prepositions | Fill in the Blanks / MCQ / Speed Sprint |
| Idioms and proverbs | Idioms & Phrases / MCQ / Speed Sprint |
| Parts of speech, subject–verb agreement, clauses, tense, voice, narration, sentence correction and transformation | Multiple Choice / Speed Sprint |
| Composition and paragraph terminology | Multiple Choice |

No vocabulary profiles, new game mechanics, or new practice modes were created.


## Later update — 2.22 vocabulary profiles
The initial 2.21 import added only question-bank access. The subsequent 2.22 update adds the separate `BCS Vocabulary` Library section with 224 linked word/phrase profiles and a profile-to-question practice action. See `BCS_VOCABULARY_INTEGRATION_BN.md` for the profile fields and extraction notes.
