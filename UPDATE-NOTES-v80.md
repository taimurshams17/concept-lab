# Arcade Quiz UI & Explanation Update — v80

## Changes

- Removed the English promotional labels “ONE CHAPTER · ONE COMPLETE QUIZ”, “COMPLETE CHAPTER PRACTICE”, and “COMPLETE CHAPTER QUIZ” from the chapter quiz intro and play header. Chapter title, subject/paper, question count, and quiz actions remain.
- Preserved the existing per-chapter question banks without enforcing an exact 50-question cap. The chapter quiz continues to display all questions mapped to that chapter; the previously validated syllabus bank remains 2,785 questions across 51 chapters, with 50 or more in every chapter and 69 questions in Physics 1st Paper, Chapter 1.
- Fixed the chapter quiz Next Question handler: default/bubbling behavior is prevented, the old button is blurred before its DOM is replaced, and the page scrolls back to the new question heading after each transition. The final question now reaches the results state instead of allowing the pool to reshuffle.
- Tightened the vertical spacing between A/B/C/D options while keeping each option comfortable to tap on mobile.
- Rebuilt explanation presentation into four alternating, per-question layouts: concept-first, numbered reasoning steps, numbered analysis points, and concept-to-conclusion. The underlying explanation, easy-language summary, and formula/rule text are preserved as source data.
- Expanded explanation content to full available width, removed narrow centered text constraints, increased paragraph line-height and spacing, and added clearly styled headings, highlighted key lines, numbered points, a blue formula panel, and a green simple-summary panel. Added matching light-theme styles and responsive mobile spacing.
- Bumped asset URLs and the service-worker cache version to ensure v80 files are fetched after deployment.

## Validation

- `npm run check`: passed (45 JavaScript files).
- `npm run check:games`: passed (193 active games, 17 game types, 18 registered handlers).
- `npm run build`: passed.
- `arcade-refinement-v77.css`: parsed with zero CSS syntax errors.
- Project source has no remaining runtime occurrences of the removed chapter quiz promotional labels.

The live Netlify site has not been deployed. Upload the v80 source ZIP through the existing GitHub/Netlify deployment workflow.
