# ConceptLab Update — Casio-style Scientific Calculator & Geometry Tools

Date: 21 October 2026

## Scientific Calculator
- Replaced the generic 4-column calculator with a 5-column, hardware-inspired keypad layout patterned after the Casio fx-991ES PLUS.
- Added calculator casing/display styling, small secondary key labels, SHIFT inverse trigonometric functions, DEG/RAD mode, and NORM/SCI/FIX output formats.
- Added square/cube roots, reciprocal, powers, factorial, logarithms, exponentials, scientific notation input, Ans, constants, memory add/recall, nCr, nPr and calculation history.
- Fixed answer display so a successful calculation appears on the calculator LCD panel.
- Uses responsive key sizing and small-screen breakpoints to avoid horizontal overflow.

## Geometry Drawing Board
- Removed the unrequested device-orientation/digital compass from Student Tools Zone.
- Replaced the ineffective angle-only slider with an interactive geometry board with a grid and scale marks.
- Geometry Compass: tap centre and radius point to draw a circle.
- Ruler: tap two endpoints to draw a straight line.
- Protractor: tap vertex, first arm endpoint and second arm endpoint to draw and measure an angle.
- Pencil: freehand drawing; Point: place points; Eraser: remove nearby objects.
- Exact-angle construction accepts a degree value between 0° and 180°; Undo, Finish and Clear controls are provided.
- Stopwatch and unit converter remain available below the geometry board.

## Access
- Scientific Calculator and Geometry Tools stay inside Student Hub and can be opened using their Student Hub tabs.
- Direct Home Page launch links and the three-line navigation menu route to `#/hub/calculator` and `#/hub/tools`.

## Validation performed
- `node --check assets/js/hub.js`
- `node --check assets/js/app.js`
- `npm run build`
- Calculator evaluator checks: arithmetic, DEG trigonometry, square root, power, factorial, reciprocal, scientific exponent, natural log, combinations and permutations.
- Generated route markup checks: Casio-style shell, 50 keypad keys, no old 4-column keypad, geometry canvas, exact-angle control, six geometry tools, and no digital compass content.

A full interactive browser/device visual QA run was unavailable in this environment; final rendering should still be checked on a real mobile browser before publishing.
