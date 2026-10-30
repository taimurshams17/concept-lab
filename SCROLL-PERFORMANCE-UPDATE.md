# Simulation alignment and scrolling performance update

## Simulation subject selector
- Subject icons, labels and simulation counts are vertically centered.
- On mobile, each selector remains a compact flex row with a flexible subject label and a constrained count label.

## Scroll performance
- The decorative full-screen starfield canvas stops drawing during active scrolling and resumes after a short idle pause.
- Canvas pixel density and frame rate are capped more conservatively, especially on mobile.
- Ambient motion and backdrop blur on fixed navigation elements are temporarily reduced while scrolling.
- All decorative effects resume when scrolling stops; simulation interactions and page functionality are unchanged.
