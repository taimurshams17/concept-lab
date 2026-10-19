# ConceptLab v7.4 — Student Hub refinements

- HSC GPA Calculator subject boxes/selects made more compact, with two columns on typical mobile screens and one column on very narrow screens.
- Removed Math Sprint and Admission Prep Checklist from the Student Hub tab navigation as requested.
- Expanded Formula Sheet substantially with additional HSC-level Physics, Chemistry and Mathematics formulas; existing search filters the expanded list.
- Changed Student Hub homepage entry from a large teaser card into a button alongside the hero actions. On mobile it spans the available width beneath Explore Simulations; on desktop it sits inline where space permits.

Validation: `node --check assets/js/hub.js` passed; `npm run build` passed. Visual testing in a real browser is still recommended after deployment.
