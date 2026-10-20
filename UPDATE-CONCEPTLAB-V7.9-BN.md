# ConceptLab v7.9 — Projectile Motion simulation replacement

- Replaced the old `S.projectile` simulation UI with a scenario-driven interactive model.
- Added four selectable cases: ground-to-ground, horizontal launch from height, upward launch from height, and downward launch from height.
- Added controls for initial speed, angle, launch height, and gravity; angle/height controls adapt to the selected scenario.
- Added live trajectory drawing, animation, component velocities, flight time, range, maximum height, and impact speed.
- Added scenario-specific formula explanations, universal method, assumptions, and common mistakes within the simulation interface.
- Removed the separately appended `projectileTheory()` section from the lab page; the old simulation is no longer followed by a second text-only lesson.
- `npm run build` and `node --check` passed. Visual verification in a live browser has not been performed.
