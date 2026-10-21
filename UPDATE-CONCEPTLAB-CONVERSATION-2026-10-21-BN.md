# ConceptLab Update — Conversation Bundle (2026-10-21)

## Implemented
- Added four non-duplicate games to the existing Games catalog:
  - Organic Pathway (step-order puzzle)
  - Stoichiometry Sprint (timed chemistry MCQ)
  - Molecular Shape Match (formula/shape memory game)
  - HSC Boss Battle (mixed Physics, Chemistry and Higher Math quiz)
- Added these game IDs to the saved-catalog merge allowlist so existing browser-saved catalogs can receive them without resetting saved data.
- Added three new Chemistry simulations: Molecular Polarity Lab, Reaction Energy Lab, and Functional Group Detective.
- Expanded the existing River Boat and Projectile Motion simulation descriptions/tips to foreground relative velocity, launch parameters and exam-relevant outcomes.
- Enforced unique icon glyphs across icon entries in defaults.js and assigned the runtime Ion Detective override its own glyph.
- Preserved existing game and simulation implementations rather than creating duplicate copies of existing Periodic Quest, Projectile Cannon, River Boat, Ion Identification, Rutherford, pH, Stoichiometry, and related simulations.

## Notes
- New games reuse existing tested game engines where possible; no new duplicate engine was created.
- Syllabus-specific reaction pathways should be reviewed against the applicable NCTB/HSC textbook before publication.
- Build output is generated in `dist/` by `node scripts/build-static.js`.
