# ConceptLab UI polish update

## Changes in this package

- Graph Tab chapter headings now display the chapter name only. Each subject is shown once as a heading above its group of chapters, and the subject selector remains at the top.
- Games Tab mode labels such as “Interactive Simulation” and “Interactive Game” no longer inherit the fixed 23 × 23 size used for small level icons. They now wrap naturally and remain readable on desktop and mobile layouts.
- Simulation Tab cards and the simulation detail header now use monochrome white line icons on a neutral background. Icon selection uses simulation titles and subject-specific terms, rather than displaying brightly colored emoji.
- Service-worker cache version bumped to `conceptlab-v10.2.1-ui-polish` so deployed browsers can pick up the new interface assets.

## Build and validation

- Rebuilt `dist/` with `npm run build`.
- JavaScript syntax checks passed for `assets/js/graphs.js`, `assets/js/app.js`, and `assets/js/mono-icons.js`, including their generated `dist/` copies.

## Publishing

Upload/commit the updated project to the same GitHub repository and publish the updated `dist/` folder if the site is configured to deploy from `dist/`. The live GitHub Pages site is not automatically changed by editing this local package.
