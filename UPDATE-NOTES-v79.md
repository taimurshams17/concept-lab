# Arcade Quiz Syllabus Update — v79

## What changed

- Rebuilt the Arcade chapter-quiz catalog around the uploaded HSC syllabus TXT. The quiz catalog now has 51 chapter entries: Physics (21), Chemistry (10), and Higher Mathematics (20).
- Ensured every chapter has at least 50 questions. The validated combined chapter bank contains 2,785 questions; Physics 1st Paper, Chapter 1 has 69 individually authored questions and replaces the previously mixed legacy pool.
- Tightened question-to-chapter routing. Unscoped mixed-subject word games are excluded from chapter quizzes; multi-chapter quiz banks are routed using the question stem rather than explanations or distractors; single-chapter course mappings are retained. Physics second-paper concepts such as AC, magnetism, optics, quantum physics, nuclear physics, semiconductors, and astronomy are routed to their matching chapters.
- Corrected legacy chapter aliases for Periodic Motion and Ideal Gas / Kinetic Theory, and aligned Higher Mathematics 2nd Paper chapter mappings with the uploaded syllabus order.
- Added chapter-specific supplement questions from each chapter's own TXT topic list, with four labelled difficulty levels (easy, medium, hard, deep thinking) and topic-focused explanations, simpler summaries, and formulas where applicable.
- Chapter quiz answers now reveal a collapsible explanation panel after each answer. The panel stays closed after a correct answer and opens automatically after an incorrect answer. The learner can read the explanation before choosing the next question.
- Added distinct chapter icons. Validation confirms all 51 chapter quiz cards use different icons.
- Updated the chapter-quiz question interface and mobile styling, including answer spacing, progress, difficulty labels, formula panels, and explanation accordion spacing.
- Bumped the service-worker cache version and added the new syllabus data scripts to its offline shell list.

## Validation

- Chapter inventory: 51 chapters.
- Questions: 2,785 total; minimum 50 in every chapter.
- Physics 1st Paper, Chapter 1: 69 questions; the mixed cross-chapter question pool is no longer used there.
- Chapter icons: 51 unique icons for 51 chapters.
- `npm run check`: passed (JavaScript syntax checks).
- `npm run check:games`: passed (193 active Arcade games; all registered handlers present).
- `npm run build`: passed.

The project has not been deployed to the live Netlify site. Upload/deploy this source package through the usual GitHub/Netlify workflow to publish it.
