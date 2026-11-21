# VocabHub — BCS Vocabulary & separated admission sources

## Latest update — 2.27 · mobile-first UI polish & feedback
- Added an **Admission Questions** shortcut alongside **Start a session** and **Play word arcade** on the homepage, with responsive sizing for narrow screens.
- Rebuilt the Analytics activity calendar as a date-labelled monthly calendar with weekday headings, active-day/session/study-time summaries, and graded activity intensity.
- Removed **Score trend** from Exam history while retaining the learning snapshot and individual session list.
- Increased the size, spacing and visual clarity of the **I know this**, **Need more practice**, **Play again**, **Exam history** and **Back** actions.
- Added a **Feedback** tab for errors/corrections, suggestions and appreciation. Feedback is saved locally in the current browser and can be copied or downloaded; this static edition does not send it to a server.
- Updated mobile layout rules for the homepage actions, feedback form, activity calendar and result controls.
- See `UPDATE_2_27_BN.md` for implementation and validation details.


A local-first English–Bengali vocabulary learning studio. Open `index.html` directly or publish the folder with GitHub Pages, Netlify, or another static host.

## Latest update — 2.24 · Library filtering, BCS practice fix & topic-based archive
- Fixed the Library unit selector: choosing a unit now immediately refreshes the visible word list; the custom dropdown listener is attached after the selector is rendered.
- Corrected the BCS Preliminary shortcut so its setup opens with the dedicated **BCS Preliminary past questions** title and **BCS Preliminary · English** source, rather than falling back to DU IBA.
- Held back **43 multi-word BCS Vocabulary phrase profiles** from the Library for now. The individual BCS exam questions and their source references remain in the BCS question bank.
- Reorganized Admission Questions into topic-first sections. Questions retain their original question number, year/session and source reference in the question card.
- Modernized dated trend charts, added calendar dates along the bottom axis, and separated mastery distribution into horizontal bar charts.
- Replaced the most prominent generic Bengali count labels with English labels such as **All**, **Max available**, and **questions**.
- See `UPDATE_2_24_BN.md` for implementation details and validation notes.

## Previous update — 2.22 · BCS Vocabulary, source separation & resilient exams
- Added a dedicated **BCS Vocabulary** Library section with **224 distinct word/phrase profiles** extracted from the BCS English question bank. Profiles include Bengali meaning, part of speech, IPA, contextual examples and original BCS question/source references; existing learner progress is preserved.
- The profile collection contains **2,218 vocabulary entries** across all integrated Library sections after 43 multi-word BCS phrase profiles were temporarily held back from the Library. New BCS entries are available in offline mode and in the hosted JSON copies.
- Fixed the source-mixing bug: BCS questions no longer enter the DU IBA-only pool. DU IBA, DU A/B/C/D, HSC Academic and BCS are separate sources; a deliberate **All Sources** option remains available for mixed practice.
- The supplied BCS English bank contains **485 questions**; **484** have usable answer keys for scored practice. The passage-dependent Q368 remains visible in the archive but is excluded from scoring because its passage is absent. Three non-English medical/biology items were not imported into the English bank.
- Replaced question-count dropdowns with compact selectable tiles, including **3 questions**. Difficulty levels that cannot supply the selected count are disabled; the setup adjusts to an available level/count or falls back to a broader vocabulary pool rather than blocking a round.
- The same count tiles are used in the separate Mistakes Exam setup. Timed challenges continue to use duration choices.
- See `UPDATE_2_22_BN.md`, `BCS_VOCABULARY_INTEGRATION_BN.md`, `BCS_INTEGRATION_NOTES_BN.md` and `BCS_QUESTION_KEY_REVIEW.tsv` for implementation details and source caveats.

## Previous update — 2.21 · BCS English question bank
- Added **485 English questions** from the supplied BCS question-bank text to the source-based Admission Questions archive.
- Prepared answers for **484 questions**; one passage-dependent question remains visible but unscored because its passage was not supplied. Three non-English medical/biology questions were excluded.
- Preserved question numbers, four options and source references; less-certain answer keys display a review warning.
- See `BCS_INTEGRATION_NOTES_BN.md` and `BCS_QUESTION_KEY_REVIEW.tsv` for category mapping, source caveats and answer-key review list.

## Previous update — 2.20 · vocabulary profile enrichment
- Updated all **2,077 vocabulary profiles** across the integrated Library sections.
- Completed missing Bengali meanings, meaning breakdowns, parts of speech, learning levels, synonyms, pronunciation and dictionary lookup references; every entry now has a Section value.
- Capitalized the first letter of every headword word and corrected source spelling/meaning errors where identified.
- Reclassified **236 learning-level assignments** across Beginner, Elementary, Intermediate, Advanced and Expert; the numeric `difficulty` and displayed `level` are synchronized.
- Added IPA for every entry using CMU Pronouncing Dictionary data where available and eSpeak as a fallback; the pronunciation source/dialect is recorded per entry.
- Added Cambridge Dictionary and Oxford Learner’s Dictionaries lookup links to every entry. These are lookup links, not a claim that every dictionary page was individually reviewed.
- Kept antonyms empty where no reliable direct opposite exists rather than inventing one. Updated the online JSON, data copy and embedded offline vocabulary together.
- See `UPDATE_2_20_BN.md` and `VOCABULARY_REVIEW_2_20_BN.md` for the detailed review notes and limitations.

## Previous update — Admission archive redesign

- Removed only the standalone CKRUET Bank navigation item and the Library promotional banner. CKRUET questions, 79 vocabulary profiles, data, and practice/game functionality remain in the website.
- Rebuilt Admission Questions as a university-first archive: choose DU IBA, DU A/B/C/D, Medical Admission, or CKRUET (RUET/KUET/CUET), then open the relevant year/session folder.
- All questions for a selected year/session appear together inside that folder.
- Year/session groups containing only one or two questions are merged into **Other sessions** instead of creating tiny folders.
- Medical questions are kept together in one clearly labelled folder because the supplied question source does not provide exam years. CKRUET year/session folders are grouped from their original source references.
- Added responsive, premium-style university and folder cards for desktop and mobile.

## What's new in 2.11.1 — Smart Revision and mobile navigation
- Reworked Smart Revision guidance so the three queues are clearly explained: Due for revision, Difficult words, and Learned words.
- Clarified the spaced-repetition intervals (1, 2, 4, 7, 15, 30 and 60 days) and the two flashcard self-check actions.
- Fixed revision sessions so their selected queue is not filtered by normal practice round history; due, difficult and learned words can all be reviewed as intended.
- Fixed the revision-session review counter so correctly recalled due words are counted before their next review date is advanced.
- Added an accessible mobile slide-in menu with every secondary section, a close button, tap-outside dismissal, Escape-key dismissal and active-page indication.
- Kept the bottom navigation focused on Home, Practice, Arcade, Library and Profile.
- Removed the repeated partner promotional badge from the non-home navigation/footer; the homepage remains the promotional placement.
- Preserved the vocabulary database, word IDs, local learning-progress structure, images and branding assets.

## What's new in 2.10 — two-section library and session filters
- Consolidated the library into exactly two vocabulary sections: **With Clues** (the existing 529 words) and **English 1st Paper (Class XI–XII) — 2018 Key Words** (429 source-list words).
- The 64 overlapping words belong to both sections; the 365 new entries were added from the supplied unit-wise text file, preserving its Bengali meanings, parts of speech, synonyms, antonyms, examples, translations and unit labels.
- The library defaults to **All sections** and can filter to either section. Previous topic/category filters are removed from the library.
- Practice and arcade setup now includes section, difficulty and question-count (or challenge-duration/pair-count) choices. Section-aware rounds avoid repeating a word until the selected section's round is complete.
- New Class XI–XII entries default to Intermediate difficulty so they can be practised immediately; existing difficulty assignments are retained for overlapping words.

## What's new in 2.6 — vocabulary review
- Reviewed all **529 original headwords** for Bengali meaning, part of speech, synonyms and antonyms.
- Corrected mistranslations and unclear meanings; retained multiple Bengali senses where useful.
- Added part-of-speech labels and at least two relevant synonyms for every entry.
- Added antonyms where a reliable opposite exists. An empty antonym list is intentional for words without a natural direct opposite; the data does not invent one merely to fill the field.
- Preserved all 529 original IDs, categories, difficulty levels, IPA, reference links, and existing example sentences.
- Updated the vocabulary in all three runtime locations: `vocabulary.json`, `data/vocabulary.json`, and the embedded offline fallback in `script.js`.
- Existing saved browser vocabulary is refreshed from the bundled reviewed entries at startup. Learner progress, favourites, sessions, achievements, and locally added words remain intact.
- Hosted copies refresh from the project-root `vocabulary.json`; direct `file://` opening and offline use the embedded fallback.

**Editorial limitation:** this is an editorial review pass, not a native lexicographer's sign-off or a complete word-by-word audit against Cambridge/Oxford. Reference links are supplied for further verification. A word can have different Bengali equivalents in different contexts; the entry gives the main learning sense(s) selected for this collection. Empty antonyms are deliberate where no good direct opposite exists.

## What's included
- 2,218 vocabulary entries across all integrated sections, including **BCS Vocabulary** and **DU A,B,C,D**; five difficulty levels are available. Multi-word BCS phrase profiles are temporarily excluded from Library display.
- Practice, revision, XP, achievements, themes, backup and restore.
- Word profile with pronunciation (where available), Bengali meanings, part of speech, synonyms, antonyms and dictionary references.
- Practice modes, matching, word games, analytics and local-first progress tracking.
- Existing creator and partner branding, photos, design, and learning progress architecture are retained.

## Files to publish
Upload the **contents of this folder** to the static site host. The supplied fixed ZIP has `index.html` at its root, so it can also be uploaded directly to hosts that expect a root-level entry file. Keep the following files at the same relative locations:
- `index.html`
- `script.js`
- `iba-data.js`, `du-abcd-data.js`, `hsc-data.js`, `ckruet-data.js` and `bcs-data.js` (question-bank data loaded before `script.js`)
- `data/bcs-vocabulary.json` (dedicated BCS vocabulary profile export)
- `style.css`
- `vocabulary.json` (canonical hosted data source)
- `data/vocabulary.json` (maintained bundled data copy)
- `assets/` (logos, icons and portraits)

If your current host/repository serves the site from a nested folder, place `vocabulary.json` beside `index.html` and `script.js` in that folder as shown above.

## Photos
Put portraits in `assets/photos/` named `araf.jpg` and `shahed.jpg`. `.jpg`, `.jpeg`, `.png` and `.webp` are accepted; placeholders are used if a portrait is not present.

## Data and privacy
Learning progress is stored in this browser on this device. Use Settings → Backup & restore before clearing browser data. The vocabulary can refresh from the local project-root JSON file when hosted, while `file://` and offline sessions use the embedded fallback.

## Previous updates
- **2.5:** richer optional profile, learning / arcade separation, updated word-profile cards, improved analytics and responsive styling.
- **2.4:** achievements and analytics improvements.
- **2.3:** additional vocabulary games, mistake tracking and practice refinements.
- **2.2:** matching, exam history, word progress and game improvements.


## 2.14
Unit browsing for the 2026 book (and 2018 key words), premium dropdowns, mobile menu fix (drawer moved outside #nav), home-page promos for every tab. See UPDATE_2_14_BN.md.


## What's new in 2.15 — Medical Admission Vocabulary
- Added **Medical Admission Vocabulary** as a separate Library section, with 109 word/phrase profiles derived from the supplied answered question document.
- Added 111 source-linked vocabulary questions grouped into Word Meaning, Synonym–Antonym, Idioms–Phrases and Spelling–Word Forms.
- Added a Medical Admission question-practice page and quiz-game entry points from Practice and Arcade.
- Word profiles show related original question numbers and let learners practise those exact source questions.
- Original source question numbers, options, answers and supplied explanations are retained. The supplied document contains 111 vocabulary-focused questions selected from a 361-question source bank.

## 2.16
DU IBA Vocabulary section + 155 real IBA MCQs merged on top of the Medical Admission build. See UPDATE_2_16_BN.md and IBA_QUESTION_MAP_BN.md.


## CKRUET Collection (added)

See `CKRUET_INTEGRATION_BN.md` for the full source-based integration. The Library includes a CKRUET vocabulary section with 79 indexed profiles, and Practice/Arcade link to the 199-question searchable source bank.


## DU A,B,C,D integration
See `DU_ABCD_INTEGRATION_BN.md` for source counts, references, profile coverage and the two unscored source items.


## CKRUET access
- CKRUET is intentionally absent from the desktop sidebar and mobile navigation menu only.
- Open Admission Questions → CKRUET · RUET / KUET / CUET to browse its year/session folders.
- The original CKRUET Library profiles and dedicated browse/practice/game page are retained; the dedicated page is reachable from a CKRUET year folder.
