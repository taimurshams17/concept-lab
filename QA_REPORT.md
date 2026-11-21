# Admission Questions — QA & implementation report

## Current update — 2.24

- Library unit selection is wired after rendering and immediately redraws the filtered words.
- BCS practice setup opens with its own title and BCS English question source; DU IBA source data remains independent.
- 43 multi-word BCS Vocabulary profiles are temporarily excluded; the BCS source question bank is unchanged.
- Admission bank navigation is topic-first; source question references remain in each question card.
- Learning-rhythm and session score charts include dates on the bottom axis; mastery distribution is displayed as horizontal bars.
- Validation: JavaScript syntax and JSON data checks passed. Chromium headless launch timed out in this environment; no browser-level end-to-end test is claimed.

# Admission Questions — QA ও পরিবর্তন প্রতিবেদন

## Current update — 2.22 · BCS Vocabulary and exam setup

- Library: 2,261 unique vocabulary records in the full dataset, including 224 BCS Vocabulary profiles. The 224 BCS profiles have Bengali meanings, parts of speech, IPA, contextual example sentences, translations and source-question references.
- BCS question source: 485 English bank records; 484 are scoreable. Q368 remains visible in the archive but is excluded from scored practice because the required passage is missing. The original file contains 38 question records whose displayed references name other exams; these references remain unchanged and are not relabelled.
- Source separation: the DU IBA-only question pool is restricted to `IBA_Q`; BCS, DU ABCD and HSC are kept in their separate arrays. Mixed practice is available only through the explicit `All Sources` choice.
- Exam setup: selectable question-count tiles include 3 questions. Unavailable level/count combinations are disabled and the round falls back to the largest available level/pool when required. Mistakes Exam also uses count tiles.
- Static checks: JavaScript syntax checks passed for the main application and question-bank scripts; JSON files parsed successfully; canonical, offline embedded and dedicated BCS vocabulary datasets have matching counts.
- Browser visual walkthrough was not completed in this environment, so this report does not claim full browser-level end-to-end validation.


## চূড়ান্ত সাজানো প্রশ্নসংখ্যা
| বিশ্ববিদ্যালয়/ক্যাটাগরি | রাখা হয়েছে |
|---|---:|
| DU IBA · BBA | 152 |
| DU A/B/C/D | 423 |
| Medical Admission | 109 |
| CKRUET · RUET / KUET / CUET | 156 |
| **মোট** | **840** |

- অপশনসহ ক্লিকযোগ্য MCQ: **795**
- অপশনবিহীন উৎস-প্রশ্ন: **45** — এগুলোকে জোর করে MCQ বানানো হয়নি; উত্তর ও ব্যাখ্যা খুলে দেখা যাবে।
- সব retained MCQ-তে সঠিক উত্তরটি প্রদত্ত অপশনের সঙ্গে মেলে কি না, তা ডেটা-লেভেলে যাচাই করা হয়েছে।

## কী পরিবর্তন করা হয়েছে
1. Admission Questions-এ চারটি প্রতিষ্ঠান/ক্যাটাগরি রাখা হয়েছে; প্রতিটি প্রতিষ্ঠানের প্রশ্ন সাল/সেশন অনুযায়ী ফোল্ডারে সাজানো।
2. প্রশ্নের অপশন থাকলে A/B/C/D বাটনে ক্লিক করা যায়। উত্তর দেওয়ার সঙ্গে সঙ্গে সঠিক/ভুল অবস্থা, সঠিক উত্তর ও ব্যাখ্যা দেখায়।
3. সংশ্লিষ্ট Vocabulary Profile পাওয়া গেলে সেটিতে যাওয়ার লিংক দেখায়।
4. প্রশ্নের ক্যাটাগরি ও মূল সোর্স রেফারেন্স কার্ডে রাখা হয়েছে।
5. মোবাইল স্ক্রিনে অপশনগুলো এক কলামে সাজানো হয়েছে।
6. Admission archive-এর হোম ব্যানারে চারটি প্রতিষ্ঠানের সঠিক প্রশ্নসংখ্যা দেখানো হয়েছে।

## বাদ দেওয়া / সংশোধন করা প্রশ্ন
- DU IBA: ibaq-1, ibaq-30, ibaq-93, ibaq-146 — উত্তর/ব্যাখ্যায় অস্পষ্টতা বা একাধিক গ্রহণযোগ্য বিকল্প থাকায় Admission তালিকা থেকে বাদ।
- DU IBA: ibaq-54-এ `out`-এর বদলে `off` বসানো হয়েছে (`pass oneself off as`); ibaq-77-এর উত্তর `contrive` করা হয়েছে; ibaq-20-এ `averse` বানানটি `adverse` করা হয়েছে।
- DU A/B/C/D: চারটি figure-of-speech প্রশ্ন Vocabulary-focused Admission তালিকা থেকে বাদ; উত্তর-সূচকবিহীন dua-199 ও dua-523 বাদ।
- Medical: med-q32 (দুটি সম্ভাব্য বিপরীতার্থক বিকল্প) এবং med-q65 (প্রদত্ত অপশনে নির্ভরযোগ্য antonym নেই) বাদ।
- CKRUET: Gender/Plural/Noun Types এবং Parts of Speech/Word Class-এর 43টি প্রশ্ন বাদ। ckruet-q034-এর odd-one-out উত্তর ও অপশন স্বাভাবিক করা হয়েছে। ckruet-q137-এ ভুল অপশন `over`-এর বদলে সঠিক dependent preposition `on` বসানো হয়েছে।

## মূল ওয়েবসাইট সংরক্ষণ
এই আপডেটে `script.js` ও `style.css`-এ Admission archive-সংক্রান্ত পরিবর্তন করা হয়েছে। Home, Library, Practice, Arcade, Profile, Navigation, XP/progress, themes, assets ও অন্যান্য বিদ্যমান ফিচারের মূল কাঠামো অপরিবর্তিত রাখা হয়েছে।

## যাচাইয়ের সীমা
উত্তর-সূচক, অপশন-ম্যাচ, উৎস-রেফারেন্স, স্পষ্ট অসঙ্গতি ও চিহ্নিত অনিশ্চিত প্রশ্নগুলো পরীক্ষা করা হয়েছে। এটি প্রতিটি প্রশ্নের জন্য পৃথক পরীক্ষক/বোর্ডের আনুষ্ঠানিক answer-key certification নয়; তাই উৎসেই দ্ব্যর্থতা বা ভুল অপশন থাকা প্রশ্ন বাদ দেওয়া হয়েছে, অনুমান করে উত্তর বসানো হয়নি।


## Vocabulary Library — Update 2.20

- মোট unique vocabulary profile: **2,077**।
- বাংলা অর্থ, Part of Speech, Synonyms, IPA, Dictionary References, Section ও Learning Level field-এ কোনো ফাঁকা entry নেই।
- Antonyms: **1,181টি** profile-এ নির্ভরযোগ্য antonym আছে; **896টি** ক্ষেত্রে স্বাভাবিক direct opposite না থাকায় list ফাঁকা রাখা হয়েছে।
- 236টি learning-level assignment পুনর্বিন্যাস করা হয়েছে; `difficulty` ও `level` একসঙ্গে sync করা।
- Root JSON, `data/vocabulary.json` এবং embedded offline data একই dataset ব্যবহার করে।
- Headword capitalization, medical question `wordIds`, duplicate spelling-profile merge এবং JavaScript syntax পরীক্ষা করা হয়েছে।

**সীমাবদ্ধতা:** এই pass-এ dictionary lookup link প্রতিটি entry-তে নিশ্চিত করা হয়েছে; Cambridge/Oxford-এর প্রত্যেকটি definition page আলাদাভাবে যাচাই করা হয়নি। IPA automated pronunciation source থেকে এসেছে। Learning Level-গুলো internal editorial band, official CEFR certification নয়।


## 2.21 — BCS English Question Bank

- [x] 488 numbered source blocks parsed; four options present for each source block.
- [x] 485 English question records integrated; 3 medical/biology items excluded from the English bank.
- [x] 484 answer-bearing questions available to existing practice and timed sprint; Q368 excluded from scoring due to missing passage.
- [x] 27 uncertain answer keys marked for review and visible in feedback.
- [x] Question archive retains source references and original question numbers.
- [x] Existing game/practice routes reused; no new game or practice engine added.
- [x] JavaScript syntax checked with Node.js after integration.
