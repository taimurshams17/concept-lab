# ConceptLab v60 — Concept Lens (Dark hero animation)

- Replaced the Dark-theme hero animation under the "CONCEPTLAB / INTERACTIVE LEARNING · LIVE EXPLORATION" bar with **Concept Lens**: a glowing Σ core, one orbit carrying three subject chips (Physics · Chemistry · Higher Math), a counter-rotating ring with a warm spark, soft sonar pulses and four quiet stars.
- Fixes the old art: cards no longer get clipped by the circular mask, the tiny `CONCEPTLAB` label no longer overlaps the Σ, and chip text is larger (9–14px instead of 5–7px).
- Performance: only `transform` and `opacity` are animated (no blur filters, canvas or JS timers). Chips counter-rotate so they always stay upright. Low-end/phone profile (`cl-low-power`) slows the orbit and drops the second pulse and stars. Animation pauses off-screen / in hidden tabs and is disabled for `prefers-reduced-motion`.
- Cleanup: removed generated `dist/` (rebuilt by `npm run build` on Netlify), old `UPDATE-NOTES-v48…v59`, and the dead `concept-orbit-v58.css` / `concept-atlas-v59.css` hero styles. The still-needed v59 homepage rules were kept in `home-scroll-fix-v59.css`.
- Updated asset versions and the service-worker cache version.
