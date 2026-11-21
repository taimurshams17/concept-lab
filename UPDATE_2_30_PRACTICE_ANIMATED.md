# v2.30 — Animated Practice cards

- Practice modes now use themed launcher cards (same shell as the Arcade cards) with a mechanic-specific animation each:
  Multiple choice (option scan → correct answer locks green), Fill in the blanks (chip lifts into the gap),
  Word matching (lines connect English → Bengali), Synonym & antonym (similar words drift left, opposites right),
  Flashcard recall (card flips, "Got it" pulses), Mixed practice (shuffling deck of question types),
  DU IBA past questions (exam sheet stamped with 2019 / 2021 / 2023).
- Exam tracks: SSC (unit pips + progress bar), Admission Question Bank (source tags light in turn),
  BCS (rotating topics), HSC Academic (vocabulary underline + rising accuracy bars).
- Question-type map cards get a mini animated glyph (fill, synonym, antonym, odd word, analogy, usage, idiom, affix, HSC, BCS).
- Mistakes banner gets a subtle sheen + icon ping.
- Only transform/opacity are animated; off-screen cards pause; `prefers-reduced-motion` shows static resolved art.
- Behaviour, answer keys, scoring and Arcade are unchanged (cards call the same configureGame / configureIba / openSscTraining actions).
