# ConceptLab changelog

---

## CHANGELOG-v9.9.3

ConceptLab v9.9.3 — Simulation controls and mechanics fixes

- Simulation catalog no longer adds empty chapter placeholders; spacing between available chapters is tighter and content is visible immediately without scrolling to trigger reveal effects.
- Added a “সব সিমুলেশন একসাথে দেখুন” button and labeled Physics, Chemistry and Higher Mathematics as ১ম পত্র beside each subject.
- Added editable numeric inputs paired with simulation sliders; values stay synchronized with the live model.
- Increased the available boat-speed, river-current and river-width ranges, with direct numeric entry.
- The boat model now explains when the current cannot be cancelled because the stream is at least as fast as the boat; preset-driven slider values keep numeric fields synchronized.
- Reworked Free-Body Diagram, Connected Bodies & Pulley, and Elevator & Apparent Weight as live physics diagrams with calculated readouts and clear sign conventions.
- Corrected “পড়ন্ত বনাম নিক্ষিপ্ত বস্তু” to compare free fall from a height with a vertical throw launched from the ground.
- Added zoom/mobile responsive rules for the simulation catalog and controls; bumped the service-worker cache to v9.9.3.

---

## CHANGELOG-v9.9.2

ConceptLab v9.9.2

- 'Chapters planned' in the At a Glance panel now shows 25.
- Service worker cache bumped to v9.9.2.

---

## CHANGELOG-v9.9.1

ConceptLab v9.9.1 — Home copy and headline

- Restored the hero line: "Physics, Chemistry ও Higher Math -এর প্রতিটি চ্যাপ্টার চারটি ধাপে শেখানো হয়েছে।"
- Headline changed to "ConceptLab: মুখস্থ নয়, কনসেপ্ট বুঝুন" and reduced in size on desktop and mobile.
- Service worker cache bumped to v9.9.1.

---

## CHANGELOG-v9.9.0

ConceptLab v9.9.0 — Home refresh

- Shortened the hero lead to one line: "প্রতিটি চ্যাপ্টার চারটি ধাপে: উদাহরণ, সিমুলেশন, গেম ও কুইজসহ।"
- Shortened the mission copy and bullet points.
- "আমাদের উদ্দেশ্য" block is now centred: pill, heading, short lead, sub line and pill-style list.
- Deeper black base with a faint grid behind the hero, inspired by the reference layout.
- Feature cards ("কেন ConceptLab?") arranged as a bento grid; first card spans two columns on desktop.
- Visible keyboard focus rings on the home page.
- Service worker cache bumped to v9.9.0 so returning visitors receive the update.

---

## CHANGELOG-v9.8.1

ConceptLab v9.8.1 — Editorial Glass Premium Redesign

- Rebuilt the home hero into a centered, editorial layout inspired by the supplied reference: a larger gradient headline without the trailing danda, the requested subject order in the description, and a framed glass science visual.
- Kept the two hero CTA buttons out of the home hero.
- Added a consistent premium glass visual system for navigation, content cards, feature tiles, forms, tabs, buttons, progress views, games and simulation panels.
- Applied a matching premium visual treatment to the Admin workspace.
- Tuned the background and accent colors toward restrained midnight blue, ice-blue and lavender while preserving existing page routes and interactions.
- Added responsive and reduced-motion rules; retained the existing interactive page templates and content.
- Bumped the service-worker cache to v9.8.1 so returning visitors can receive the updated UI.

---

## CHANGELOG-v9.8.0

ConceptLab v9.8.0 — Glass & Premium UI

- Removed the bottom "bubble" effects: the blue glow blobs rising from the bottom of the page (.horizon) and the floating ember dots in the background canvas (fx.js). The starfield, galaxies and planets are unchanged.
- Added frosted-glass styling to the header, three-line menu panel and its tiles, bottom navigation bar, cards, pills, secondary buttons and the Message Centre panel.
- Redesigned the header buttons: Sign up (glass pill with soft sky-blue tint and sheen on hover), notification bell (36px glass circle, finer icon, gradient count badge) and the menu button (glass squircle with three fine lines that animate to a cross).
- Primary buttons: refined gradient with inner highlight; the constant shine loop now plays once on hover only.
- All changes are in the last block of assets/css/premium.css (v9.8.0) so they are easy to tweak or remove. Reduced-motion and no-backdrop-filter fallbacks included.
- Bumped service worker cache to v9.8.0 so returning visitors receive the new look.

---

## CHANGELOG-v9.7.3

ConceptLab v9.7.3

- Fixed Tiger & Deer animation: unique HTML actor IDs, URL-resolved animal assets, explicit image sizing/stacking and visible fallback characters.
- Expanded the chapter-wise Shortcut Tricks catalogue from 123 items with 150 additional condition-aware tips across Physics, Chemistry and Higher Math.
- Moved Graph Lab under EXPLORE & LEARN and Shortcut Tricks under YOUR LEARNING SPACE in the three-line menu.
- Removed redundant Student Hub helper/privacy note and the extra Student Hub tool-page pill.
- Highlighted the Shortcut Tricks tile in Student Hub.
- Bumped service worker cache version to v9.7.3 for update refresh.
- Removed redundant Student Hub explanatory text; omitted email/institute display from the local profile summary to reduce unnecessary personal-data exposure in the UI (stored account data is not deleted).

---

## CHANGELOG-v9.7.2

ConceptLab v9.7.2 — Student Hub, Graph Lab & Simulation Repair

- Replaced the Student Hub tool tabs on the landing view with one responsive tile box containing the 13 study tools, Shortcut Tricks, Formula Solver, Reference Shelf and Progress Card.
- Removed Settings from the Student Hub tile box; Settings remain accessible through the main navigation.
- Rebuilt Tiger & Deer drawing with HTML WebP images, emoji fallback and responsive overlay positioning so animal art is visible across mobile browsers; adjusted the chase spacing and movement.
- Expanded each Graph Lab detail with X/Y axis bounds, model parameter, sample density, animation speed/play/pause, hover/touch readout, editable user data, model visibility, connect-points control, CSV export, PNG export and reset.
- Added responsive graph controls and visible wrapping buttons for narrow mobile screens.
- Added an explicit close (✕) button to the navigation drawer.
- Bumped service worker cache to v9.7.2 and precached tiger/deer image assets.

Validation: JavaScript syntax checks and static build passed. Browser screenshot checks are performed where possible; no claim is made for real-device testing.

---

## CHANGELOG-v9.7.1

ConceptLab v9.7.1 — Subject selection, chapter maps & shortcut tricks

- Simulation page now starts with only three subject choices: Physics, Chemistry and Higher Mathematics.
- Physics simulations are grouped into the supplied HSC 1st-paper ten chapters. Chemistry and Higher Mathematics are grouped into their provided 5- and 10-chapter lists.
- Added catalog cards for the pre-existing Free Fall, dropped-vs-horizontal-projectile comparison, and gun-bullet recoil models. The existing renderer functions are reused rather than duplicated.
- Updated vector addition card to explicitly advertise Triangle, Parallelogram, Polygon and Components modes.
- Added the new Shortcut Tricks page with chapter-specific revision formulas for all 25 supplied chapters and searchable subject filtering.
- Tiger-Deer chase now shows a small, non-graphic red impact flash and catch label; no gore or injury detail is displayed.
- Added shortcuts.js to the app and service-worker shell cache; cache version bumped to v9.7.1.
- Build: npm run build.

---

## CHANGELOG-v9.7.0

ConceptLab v9.7.0 — HSC Physics I Simulation & Graph Lab expansion

- Reorganized the Simulation Lab into the 10 HSC Physics I chapter groups, while retaining non-Physics labs under their existing subject/chapter groupings.
- Added 43 unique interactive Physics models for measurement uncertainty, dimensional analysis, unit conversion, vector equilibrium/components, motion graphs/free fall, free-body diagrams, pulleys, apparent weight, collisions, impulse, vertical circular motion, work/energy/power, gravitation/orbits/escape speed, elasticity, fluids, SHM energy/phase, wave superposition/resonance/beats/Doppler/sound intensity and gas kinetic/thermodynamic models.
- Reused existing models for the previously available vector, river crossing, projectile, relative motion, Newton's law, inclined plane, circular motion, spring, pendulum, wave, standing-wave, gas, vernier calipers and screw gauge concepts rather than creating redundant cards.
- Added a new Graphs navigation tab with 76 graph labs grouped by the 10 chapters. Every graph has a thumbnail, formula/relationship, interactive parameter control and detailed graph view.
- Added dedicated icon metadata, responsive styling, graph filtering/search and updated offline-shell assets/service-worker version.

---

## CHANGELOG-v9.6.5

ConceptLab v9.6.5 — Font settings fix

- Fixed the built/distribution copy so deployed builds show the separate font controls.
- Settings now provide independent Bengali and English font selectors.
- Bengali font selection uses Bengali-specific glyph fallback; English font selection is independent.
- Expanded web font choices for Bengali and English.

---

## CHANGELOG-v9.6.4

ConceptLab v9.6.4 — Independent Bengali and English font controls

- Added separate Bengali font and English font selectors in Settings.
- Bengali font choice is used as the Bengali glyph fallback; English/Latin glyphs keep the selected English font.
- Added web-hosted Bengali families: Anek Bangla, Atma, Baloo Da 2, Mina, Tiro Bangla and Galada.
- Kept Kalpurush and SolaimanLipi as local-font options with sensible fallback stacks.
- Settings preferences remain saved in the current browser.

---

## CHANGELOG-v9.6.3

ConceptLab v9.6.3 — Unified Settings

- Removed the separate Appearance Studio option and merged all appearance controls into Settings.
- Added Bengali font choices: Hind Siliguri, Noto Sans Bengali, Noto Serif Bengali, Kalpurush and SolaimanLipi (fallback stacks included).
- Added English font choices: Manrope, Inter, Roboto, Poppins, Lora, classic serif and system default.
- Added reading line spacing and interface language preference controls.
- Kept text scale, accent colors, compact layout, content width, corner style, animation, calm mode, contrast, reset, and install-app guidance in Settings.
- Removed Appearance Studio links from the main menu surfaces, Student Hub cards, profile shortcuts, and footer.
- Preferences remain stored locally in this browser.

---

## CHANGELOG-v9.6.2

ConceptLab v9.6.2 — Student Hub homepage integration

- Added Formula Solver, Reference Shelf, Progress Card, Appearance Studio and Settings to the existing Student Hub Toolkit grid on the home page. They use direct, working destinations like the existing tool cards.
- Added the same new options to the existing “STUDENT HUB · ALL TOOLS” group in the three-line menu, alongside all current Student Hub tools.
- Completed hamburger-menu coverage for Spaced Review and Backup & Restore, which were already part of the Student Hub toolkit.
- Kept the new links grouped together instead of leaving them only in a separate “new tools” strip.
- Bumped the service-worker cache version so returning visitors can receive the update.

Validation: static build and JavaScript syntax checks completed; homepage and menu link targets were checked against the current route structure.

---

## CHANGELOG-v9.6.1

ConceptLab v9.6.1 — Mobile-friendly premium update

- Removed the large promotional call-to-action banner from the public footer.
- Removed the floating plus/dock UI; added all new tool destinations to the admin-managed three-line menu.
- Added compact links for Formula Solver, Reference Shelf, Progress Card, Appearance Studio and Settings to Student Hub, visible across hub tabs.
- Tightened premium-tool panels, preference controls, menu tiles, and Student Hub cards for mobile screens.
- Added a public Settings page that works without signing in by default. Visitors can choose accent colour, font, text scale, density, content width, corner style, background motion, calm mode and contrast. Preferences are saved locally in the browser.
- Kept Appearance Studio as a standalone option and added links to it from Settings and signed-in profiles. Renamed the account editor route to Edit Profile to avoid colliding with public Settings.
- Added admin controls for tool page headings/descriptions, navigation labels/descriptions/visibility/order, guest Settings, and default font/scale/layout/accent/motion/contrast.
- Added a direct Website Settings & Appearance Defaults shortcut to the admin dashboard.
- Bumped the service-worker cache version so browsers fetch the updated assets.

Validation: static build completed and JavaScript syntax checks passed for app.js, hub.js, premium.js, defaults.js and admin.js.

---

## CHANGELOG-v9.6.0

ConceptLab v9.6.0 - Premium student layer + premium footer

New pages
- #/solver      Formula Solver: 41 formulas (Physics, Chemistry, Higher Math), solve for any variable, rearranged + substituted steps, history.
- #/reference   Reference Shelf: constants, SI prefixes, Greek letters, common ions, maths identities; search + copy.
- #/share-card  Progress Card: downloadable/shareable PNG built from level, XP, streak, sims, games, badges.
- #/appearance  Appearance Studio: accent colour, background effects, calm mode, install-as-app.

Extras
- Scroll progress bar, floating quick-tools dock, home "Student power tools" strip, menu group "STUDENT POWER TOOLS".
- PWA: manifest.webmanifest, sw.js (network-first, offline fallback), icons.
- Footer redesigned (animated CTA banner, 3 link columns, subject pills, back-to-top). Existing admin footer fields still drive it.

Admin
- Website Settings: toggles for dock / progress bar / home strip.
- Footer & Social Media: CTA banner headline (use | to split), text, button label, button link.

Code touched: index.html, app.js (CL_API helpers only), admin.js, build-static.js, netlify.toml. New: premium.js, premium.css, sw.js, manifest.
Note: (c) symbol is auto-converted to an icon by mono-icons.js, so the footer uses "ConceptLab - year".

---

## RELEASE-NOTES-v9.5.0

ConceptLab v9.5.0 — Homepage Refinement

Requested changes
1. Moved Brain Sprint off the top of the homepage. The challenge is retained and now appears immediately before the Interactive Playground section titled “Don’t just read it. Play with the idea.”
2. Moved the configurable animated formula marquee to sit between the hero and Quick Access.
3. Redesigned homepage statistics as one premium panel with aligned metric cards: 4 across on desktop and 2 × 2 on smaller screens.
4. Kept statistics data-driven so counts update from the current chapter, active simulation, active game, and saved XP data when the site reloads/renders.
5. Removed the separate hard-coded formula ticker at the bottom so the animated formula strip is not duplicated.

Validation performed
- Node syntax validation for all site JavaScript and admin JavaScript.
- Static checks confirm Brain Sprint remains present, is not rendered in the top hero section, and is inserted before the Interactive Playground section.
- Static checks confirm formula ticker rendering occurs before Quick Access in homepage composition.
- Build run to recreate dist/ from source.
- Source/deployment asset synchronization and ZIP integrity checks.

Note
The updated project is packaged but not deployed to the live site. Full cross-device visual verification still needs to be performed after publishing in the target hosting environment.

---

## CHANGELOG-v9.5.0

ConceptLab v9.5.0

Homepage refinements
- Moved Brain Sprint away from the top of the homepage and placed it immediately before the Interactive Playground section headed “Don’t just read it. Play with the idea.”
- Moved the admin-configurable formula marquee to immediately after the hero and directly above Quick Access.
- Removed the second hard-coded formula ticker at the bottom to prevent duplicate formula strips.
- Rebuilt the homepage learning statistics as a compact panel with responsive side-by-side metrics.
- Kept metric values data-driven: chapter count derives from chapter content, simulation and game totals derive from active catalogue entries, and XP derives from the student's saved progress.
- Rebuilt dist/ from the updated source.

---

## RELEASE-NOTES-v9.4.0

ConceptLab Enhanced v9.4.0

Homepage changes
- Removed Universal Learning Finder, global Ctrl/Cmd+K finder shortcut, and all related home search controls/results.
- Removed Daily Discovery date-based lab recommendation and homepage counts for concepts, labs, and games.
- Added Brain Sprint, a fully interactive knowledge challenge with Physics, Chemistry, Higher Math, or mixed-subject selection. Each run contains five multiple-choice questions and a 60-second timer.
- Answers reveal the correct option and a short explanation. Scores are shown at the end and the best score for each subject selection is saved locally in this browser.
- Responsive styling and reduced-motion support included. Existing learning routes are preserved.

Validation
- JavaScript syntax validation and static build passed.
- Targeted challenge data checks verify 15 unique questions (5 per subject), four answers per question, and valid correct-answer indexes.
- Full live-host/browser verification remains a deployment-time check.

---

## CHANGELOG-v9.4.0

ConceptLab v9.4.0 — Brain Sprint home experience

- Removed the homepage Universal Learning Finder and its Ctrl/Cmd+K, Enter, and Escape behavior.
- Removed the Daily Discovery rotation and homepage live resource counters.
- Replaced the old learning desk with Brain Sprint: an interactive five-question, 60-second quiz for Physics, Chemistry, Higher Mathematics, or mixed subjects.
- Added immediate answer feedback, short worked explanations, per-session score and progress, a countdown, and a locally saved personal best for each subject selection.
- Added responsive and reduced-motion styles for the new challenge arena.
- Preserved existing chapter, simulation, game, and Student Hub routes.

---

## RELEASE-NOTES-v9.3.0

ConceptLab Enhanced v9.3.0

Highlights
1. Spaced Review — rate how well you remember a flashcard. Review spacing adapts to the rating, while local due counts, reviews completed and 21+ day intervals provide an at-a-glance view. An 18-card science starter deck is available.
2. Scientific Unit Converter — includes 18 categories and standard unit conversions for mechanics, heat, electricity, chemistry and measurements. Temperature conversions correctly handle Celsius, Fahrenheit and Kelvin.
3. Backup & Restore — download a JSON backup of Student Hub data and import it later on the same or another browser. The site never sends the backup file to a server. Imported files are size-limited and schema-checked.
4. Reliability repair — defined the conversion functions that the existing Geometry/Units tool already expected, preventing its conversion controls from failing.

Files
- Student-Hub-Enhanced-v9.3.0.zip: complete project, source files, admin panel and freshly rebuilt dist/ deployment copy.
- RELEASE-NOTES-v9.3.0.txt: this release summary.

Compatibility
- Static site, no new external API or package dependency.
- Student Hub backup restore requires a modern browser with FileReader and Blob support.
- Live deployment/API behavior should still be verified after publishing.

---

## CHANGELOG-v9.3.0

ConceptLab v9.3.0 — premium study tools and reliability fixes

New features
- Added Spaced Review for flashcards with Again / Hard / Good / Easy ratings and due dates stored locally.
- Added an optional 18-card starter deck for Physics, Chemistry and Higher Mathematics. Existing cards are preserved; duplicate starter questions are skipped.
- Added Student Hub Backup & Restore: export an editable JSON archive and restore it locally with schema checks, size limits, data sanitization and an explicit overwrite warning.
- Added home finder entries and Student Hub shortcuts for Spaced Review, the expanded Unit Converter, and Backup & Restore.
- Expanded the Unit Converter to include length, area, volume, mass, time, speed, acceleration, force, energy, power, pressure, temperature, frequency, current, charge, voltage, resistance and density.

Bug fixes and quality
- Implemented missing unit-option population and conversion routines called by the existing Geometry/Units page.
- Added affine Celsius/Fahrenheit/Kelvin conversions and absolute-zero validation instead of treating temperature as a simple linear scale.
- Added flashcard ID migration so review scheduling remains associated with specific cards.
- Added responsive review/backup layouts, keyboard focus styling, accessible status messages, and reduced-motion-safe transitions.
- Rebuilt dist/ from source.

Data and privacy
- Spaced-review ratings and Student Hub data remain local unless the student explicitly downloads or restores a backup. Restoring replaces the current Student Hub data on the device.

---

## CHANGELOG-v9.2.0

ConceptLab v9.2.0 — Learning desk and quality pass

- Reordered the homepage discovery sequence so visual science previews lead naturally into the final lab call to action.
- Switched English UI typography to Manrope and retained Hind Siliguri for Bengali text.
- Added responsive layouts, clearer search states, visible keyboard focus, and reduced-motion handling for the new experience.
- Rebuilt the deployment folder from the updated source during packaging.

Verification: all JavaScript files passed syntax checks; homepage and major routes were smoke-tested in Chromium using inline assets, with no runtime console errors. Search queries, route navigation, duplicate homepage IDs, and mobile horizontal overflow were checked. Direct localhost/file URL navigation was blocked by the runner, so the live deployment and server-backed API flows were not tested.

---

## CHANGELOG-v9.1.0

ConceptLab v9.1.0 — Interactive Labs & Footer Refresh

- Added Slide Calipers Lab with schematic instrument scales, live main/vernier readings, selectable least count, adjustable specimen, zero-error correction, sample presets, guided mode and measurement challenges.
- Added Screw Gauge Lab with selectable screw pitch/circular divisions, live sleeve/circular-scale reading, zero-error correction, sample presets, guided mode and measurement challenges.
- Added Young’s Double-Slit Experiment to explore wavelength, slit separation, screen distance, fringe spacing and idealized intensity patterns.
- Added RC Circuit Charging & Discharging Lab with live time-constant, voltage, current and stored-charge values.
- Added Precision Lab Mastery timed quiz and Photon Fringe Detective step-order game.
- Rebuilt the footer around the existing ConceptLab logo, with Explore/Learning navigation, social links and a responsive copyright row.
- Improved mobile behavior so nested metrology labs do not receive an out-of-position generic “go to controls” button.
- Added both simulation and game definitions to the static build; retained saved-catalog compatibility for new games.

Validation:
- JavaScript syntax checks passed for the modified app, defaults and simulation scripts.
- Built the deployable static site with `npm run build`.
- Catalog checks confirmed all four new simulation handlers and both game entries are registered, with unique game IDs.
- Static HTML/CSS checks confirmed unique element IDs, a valid logo asset path and no top-level CSS parse errors.

---

## CHANGELOG-v9.0.5

ConceptLab v9.0.5
- Removed the scientific calculator option from Student Hub tabs and shortcut/navigation lists.
- Retained GPA Calculator and other Student Hub tools.

---

## CHANGELOG-v9.0.4

ConceptLab v9.0.4
- Removed the visible Calculation History panel from the scientific calculator.
- Tightened calculator spacing for mobile and desktop layouts.
- Added a numerical one-variable equation solver supporting equations such as x+1/x=5, with configurable search range and scan resolution.
- Synced updated CSS/JavaScript into dist.

---

## CHANGELOG-v9.0.3

ConceptLab v9.0.3
- Student Hub calculator: compact centered fx-991ES PLUS-inspired casing and more Casio-like 45-key order; dark grey buttons, light LCD, green DEL/AC keys, tighter five-column spacing across phones and desktops.
- Calculator functions: added HYP mode with sinh/cosh/tanh and inverse hyperbolic functions, kept DEG/RAD/GRA and Norm/Fix/Sci setup, memory, factorial, nPr/nCr, root input, Ans, EXP, random, SHIFT and ALPHA behavior; retained the separate advanced calculator tabs.
- Tiger & Deer simulation: replaced vector/cartoon animals with realistic transparent cutout images. The rendered gap is now calculated from animal body edges; at the catch time the tiger lunges and the deer reacts without the sprites occupying the same position.
- Home page: increased the mobile-only ConceptLab headline size so it is more legible without changing the desktop layout.

---

## CHANGELOG-v9.0.2

ConceptLab v9.0.2
- Student Hub > fx-991ES PLUS calculator rebuilt in a Casio-style layout (assets/js/casio991.js):
  SHIFT (yellow) and ALPHA (red) labels, x⁻¹ x² xʸ √ (−) log ln ( ) , sin cos tan a b/c %,
  nPr / nCr, ∛, ʸ√, 10ˣ, eˣ, inverse trig, EXP, Ans, π, e, x!, M+ / M− / RCL / STO,
  DEG / RAD / GRA and Norm / Fix / Sci setup from MODE, S⇔D fraction toggle, history,
  keyboard input (Enter, Backspace, Esc, arrows). Other Student Hub calculator tools are unchanged.
- Tiger & Deer simulation: emoji replaced by drawn tiger and deer artwork, larger stage,
  bounding stride animation whose speed follows each animal's speed.

---

## CHANGELOG-v9.0.1

ConceptLab v9.0.1 hotfix
- Fixes the actual #nav.nav-portal mobile drawer width and text wrapping, not just notification-like selectors.
- Narrows simulation icon matching to each card title to reduce accidental matches against nearby card content.
- Browser visual verification is still required after deployment.

## v9.9.4 — mobile layout, motion clarity, circuit puzzle
- Forced the simulation catalogue cards and subject groups to remain visible without scroll-triggered reveal delays.
- Tightened small-screen Student Hub spacing and made cards, labels, fields and actions fit inside the viewport.
- Rebuilt Inclined Plane with Friction drawing so the block moves down the incline when the force balance predicts sliding; added R = mg cosθ, mg sinθ, mg cosθ, adjustable g and direct force results.
- Bus/train simulation now starts in a readable stationary state and explains same-direction versus opposite-direction relative speed before the user starts motion.
- Added Circuit Logic Scramble, an original seven-gate logic puzzle with binary switches, live output LED, target matching, hints, truth tables and ten progressive missions, inspired by the general educational puzzle format of Circuit Scramble without copying its assets or levels.
- Cache name updated to v9.9.4.

## v9.9.5 — Simulation direction and compact mobile controls
- Fixed Inclined Plane with Friction animation direction: the block now starts near the top of the slope and moves down the incline when sliding; animation stops at the lower end.
- Reduced mobile spacing, control-panel padding, range-control height, result-card gaps, and button sizing without removing controls.
- Mobile control-jump label now uses ↑ when the controls are above the visualization and ↓ when they are below; no jump control is added when no actual controls are present.
- Vertically centered subject selector labels and slightly increased the chapter-group spacing compared with the previous compressed layout.

## 2026-10-27 — Game Academy chapter and level overhaul

- Rebuilt the Games page around subject → paper → chapter → game navigation.
- Added the Game Academy catalogue and 45 chapter-mapped practice games, bringing the default merged catalogue to 83 playable games while preserving existing games.
- Added Concept, Board Challenge, Admission Challenge, Boss Level, and Mistake Review navigation to standard quiz games.
- Added local mistake storage/review and staged quiz pools, timers, and round counts.
- Added responsive Game Academy styling and bumped the service-worker cache version.
- See `GAME-ACADEMY-UPDATE.md` for deployment and validation details.


## 2026-10-28 — Bottom-nav, creator photo, and mobile stage fixes

- Forced bottom navigation icons to render monochrome white from first paint, including emoji fallbacks and injected SVG icons.
- Preloaded both creator portraits and removed reveal/entrance delay from the creator section; kept photos and names side-by-side on small mobile screens.
- Removed the decorative sparkle from the four-stage cards and the right-side ornament from the ConceptLab purpose cards.
- Prevented the `UNDERSTAND · বুঝুন` eyebrow from breaking inside a word on narrow mobile screens.
- Bumped the service-worker cache version so the updated assets replace older cached bundles.
