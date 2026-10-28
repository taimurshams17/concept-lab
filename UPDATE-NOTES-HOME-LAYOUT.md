# ConceptLab Home Layout Update

## Changes
- Reduced the Home page ARCADE game carousel cards, icons, descriptions, and controls so the game list feels more compact on desktop and mobile.
- Added more breathing room between the Home page's purpose/features, Daily Reflection, Daily Inspiration, learning flow, subject selection, and Science in Motion sections.
- Centered the subject-selection heading and supporting description.
- Centered the Daily Inspiration artwork, heading, quotation, and attribution on desktop and mobile.
- Rebuilt the ConceptLab Learning Flow as a vertical flowchart with numbered stages and downward arrows. Removed all visible Done / In progress / next status labels and stage-state styling.
- Updated the service-worker cache version to ensure the changes are fetched after deployment.

## Validation
- `node --check` passed for `assets/js/app.js`, `assets/js/defaults.js`, and `sw.js`.
- Static site build completed successfully into `dist/`.
## Subject chooser and Quick Access refinement
- Removed the redundant “THREE SUBJECTS · 25 CHAPTERS / বিষয় বেছে শুরু করুন” mini-section from the Quick Access launchpad while preserving the Student Hub tools and adding a clear spacer before that group.
- Moved the main “বিষয়সমূহ / আপনার শেখার বিষয় বেছে নিন” section directly below “CONCEPTLAB AT A GLANCE”.
- Removed the example-concept descriptions from Physics, Chemistry, and Higher Mathematics cards; subject labels, chapter counts, and Explore actions remain.
- Reduced the subject cards moderately, including padding, icon size, heading scale, and gaps; mobile cards remain comfortable to tap and read.
