# ConceptLab v48 — Arcade layout recovery

- Fixed the Arcade card header sizing conflict that squeezed game titles and the QUIZ CHALLENGE kicker into single-character columns.
- Rebuilt the header layout with explicit icon, title, and XP grid areas; XP is placed on its own row on narrow screens so the title retains readable width.
- Kept the two-column Arcade game catalogue on mobile while tightening card padding, brief text, stats, and action layout.
- Kept the All / Games / Quiz segmented control centered and prevented its labels from wrapping.
- Preserved the v47 Dark intro animation refinement.
- Incremented the service-worker cache version and added the v48 stylesheet to the shell precache.
