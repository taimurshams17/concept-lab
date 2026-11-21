# Concept Lab v77 — Arcade Quiz & Responsive Game UI

## Arcade Quiz
- Arcade-এর Quiz view-তে chapter-wise একটি করে consolidated quiz card দেখানো হয়।
- Physics, Chemistry ও Higher Mathematics-এর মোট ৫১টি chapter-এর জন্য একটি করে chapter quiz তৈরি হয়।
- বিদ্যমান quiz banks থেকে ৮৬৪টি প্রশ্ন একত্র করা হয়েছে। MCQ, True/False, Odd One Out, Step Order, Word Scramble, Equation Balancing, Flame Test এবং generated element/trend questions সমন্বিত chapter quiz-এ রূপান্তরিত হয়।
- প্রশ্নের অপশন, সঠিক উত্তর ও ব্যাখ্যা বজায় রাখা হয়েছে; duplicate prompt একই chapter-এ একাধিকবার যোগ হয় না।
- Chapter quiz-এ পুরো প্রশ্নব্যাংক সম্পন্ন করা যায়; ভুল উত্তরেও পরের প্রশ্ন চালু থাকে এবং সঠিক উত্তর ও ব্যাখ্যা দেখায়।
- Chapter quiz-এর জন্য আলাদা introduction, progress indicator, question counter এবং mistake review navigation যোগ করা হয়েছে।

## Quiz and game interface
- Chapter quiz card, intro screen, answer state এবং feedback panel-এর visual hierarchy উন্নত করা হয়েছে।
- Correct answer সবুজ এবং incorrect selection লাল দিয়ে স্পষ্টভাবে দেখানো হয়।
- Arcade game canvas, cards, controls, HUD, buttons এবং text containers-এ responsive spacing, padding, wrapping ও grid adjustments যোগ করা হয়েছে।
- ছোট মোবাইল স্ক্রিনসহ desktop layout-এ text ও interactive controls-এর clipping/edge collision কমানোর জন্য breakpoint-specific styles যোগ করা হয়েছে।

## Cache and validation
- নতুন stylesheet ও সংশোধিত JavaScript ফাইল index এবং service-worker shell cache-এ যুক্ত; cache version v137-এ bump করা হয়েছে।
- Validation: `npm run check` passed (42 JavaScript files); `npm run check:games` passed (193 active games, 17 types, 18 registered handlers).
- Chapter quiz data check: 51 chapter quizzes, 864 total questions, 0 empty chapters, 0 invalid question/answer records.
