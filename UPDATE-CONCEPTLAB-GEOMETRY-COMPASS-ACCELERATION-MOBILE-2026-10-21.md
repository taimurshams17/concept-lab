# ConceptLab Update — Geometry Compass, Acceleration Controls & Responsive UI

**Date:** 21 October 2026

## Changes

### Scientific Calculator
- Preserved the fx-991ES PLUS-inspired five-column function/key layout and calculation functions.
- Refreshed the screen and keypad styling with a modern dark shell, higher-contrast LCD, distinct SHIFT/ALPHA/operator keys, consistent spacing, focus states, and touch-friendly key sizes.
- Added narrow-screen breakpoints so key labels and buttons remain within the phone viewport; calculator width is capped on larger displays.

### Student Tools / Geometry Drawing Board
- Added a real-compass-style interaction: set the fixed pivot, set the radius/pencil endpoint, enable “lower pencil”, then drag to draw an arc with a constant radius.
- Added a separate lift/lower pencil toggle, reset-compass action, and full-circle shortcut.
- Kept ruler/straight line, freehand pencil, points, angle construction/measurement, quick circle, eraser, undo, and clear-board tools.
- Added touch-safe canvas sizing and responsive tool/action layouts.

### Tiger & Deer simulation
- Added independent acceleration sliders for tiger and deer in m/s².
- Updated positions to `x = ut + 1/2 at²` and recomputes relative speed, current separation, relative acceleration, and catch time from the selected parameters.

### Bus & Train simulation
- Added independent acceleration sliders for bus and train in m/s², alongside direction, initial speeds, distance and simulation time.
- Updated displacement, instantaneous speed, relative speed and meeting-time calculations for constant acceleration.

### Responsive layout
- Added desktop/tablet/mobile breakpoints for Student Hub cards, tabs, geometry tools, converter and simulation controls.
- Slider controls become one-column on very narrow screens and two-column on typical phone sizes; result cards wrap to avoid horizontal overflow.

## Validation
- `node --check assets/js/hub.js`
- `node --check assets/js/sims.js`
- `npm run build`
- ZIP integrity check (`unzip -t`)

A full interactive browser/device screenshot test was not possible in the build environment. The generated build and static checks passed; final physical-device visual verification is still recommended before publishing.
