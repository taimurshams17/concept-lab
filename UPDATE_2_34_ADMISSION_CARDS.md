# v2.34 — Admission Questions: institution photo cards
- Each question-bank card on the Admission Questions page now uses the same animated card shell as Arcade / Practice
  (tilt on hover, glow, entrance animation, off-screen pause) and shows the institution's photo:
  DU IBA → IBA building, DU A/B/C/D → Curzon Hall, Medical → Dhaka Medical College gate, CKRUET → CUET / RUET / KUET logos.
- Photo animation: slow Ken Burns drift (staggered per card), a periodic light sweep, floating short-code badge
  (IBA / DU / MEDICAL / CKRUET / BCS), pulsing "QUESTION BANK" dot, and the question total counts up once when the card appears.
- BCS has no photo yet, so it keeps its existing animated art. To add one later: put `bcs.jpg` in `assets/institutions/`
  and add `img:'assets/institutions/bcs.jpg'` to the `bcs` entry in `V.admission` (script.js).
- Photos: `assets/institutions/{iba,du,medical,ckruet}.jpg` (optimised, 50–190 KB each). If an image fails to load the card falls back to the dark gradient.
- Only transform/opacity are animated; `prefers-reduced-motion` shows static photos and skips the count-up.
- Questions, answers, source references, topic folders and scoring are untouched. Cache-busting query bumped to `?v=2.34`.
