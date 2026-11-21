# v2.31 — Homepage polish

- Homepage (`V.dash`) now uses the Arcade/Practice motion language: one-time staggered reveal (opacity + translateY, 45ms stagger, `cubic-bezier(.2,.8,.2,1)`), progress bars fill via `scaleX`, gentle tile/chip/stat lift + border highlight on hover-capable pointers, press feedback on touch.
- Hero loops calmed (slower orbit, smaller float, no tilt) and paused when the hero is off-screen (`.in-view`).
- Mobile (≤560px): readable hero/banner type, 44–46px tap targets, 2×2 stats, single-column spotlight/dashboard cards, no horizontal overflow at 360–480px.
- `prefers-reduced-motion: reduce` shows everything static (no hidden states, no loops).
- Only `style.css` (end of file), a small block in `script.js` (home reveal observer) and cache-bust `?v=2.31` changed.

## v2.31b — animated tile art
- The 12 "everything in one place" tiles now each carry a themed animated stage built on the same `.arc-stage` shell as Arcade/Practice.
  Reused art: Smart practice (mixed deck), Word arcade (memory flip), Library (fill-in-blank), Revision (flashcard), Mistakes (true/false), Missions (daily calendar), Exam history (IBA sheet).
  New small art: Levels (rising steps), Analytics (bars + line draw), Achievements (badges light in turn), Leaderboard (rank swap), Profile (progress ring).
- Stats count up on reveal; daily-goal ring and weekly chart bars grow in; banner kicker dots ping; level / leaderboard icons pulse gently; "Daily word" badge gets a slow sheen.
- Off-screen tiles pause (`.in-view`); reduced-motion shows static resolved art.
