# v64 — Speed pass
- Sections appear instantly (no reveal delay/stagger) in every theme.
- "ConceptLab at a Glance" counters: start earlier, ~0.65s, smoother easing.
- Mobile: removed backdrop blur, blend modes, will-change overload, blurred decorative glows; dark starfield canvas off on phones.
- Scroll motion-governor no longer measures layout while scrolling.
- Intro shortened (~2.4s min, was 4.3s).
- New file: assets/css/speed-v64.css (loaded last).
- v65: Dark/Violet home sections, card grids, footer no longer use content-visibility:auto (they were rendered only when scrolled into view); now always rendered in place like Light.
- v66: Arcade premium layout — new assets/css/arcade-premium-v66.css (3-column compact cards on PC, 2 on mobile, refined headers/buttons, dark + light).
