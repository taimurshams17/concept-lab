# ConceptLab v8.9 — Physicsverse-inspired discoverability update

## কী পরিবর্তন হয়েছে

- হোমপেজের Hero অংশ থেকে `Explore Chapters`, `Play games`, `Explore Simulations` এবং `Student Hub` CTA সরানো হয়েছে।
- Hero-এর পর নতুন Quick Access launchpad যোগ করা হয়েছে, যাতে Chapters, Arcade, Simulations, Student Hub, Smart Practice, Study Space, Daily Missions ও My Progress-এ সরাসরি যাওয়া যায়।
- Higher Mathematics, Chemistry ও Physics-এর আলাদা subject card-এ অধ্যায়/কনসেপ্ট সংখ্যা দেখানো হয়েছে।
- Student Hub-এর ১১টি টুল—Focus Timer, Exam Countdown, GPA Calculator, Study Planner, Flashcards, Quick Notes, Revision Tracker, Syllabus Tracker, Formula Sheet, Daily Habits ও Admission Prep—হোমপেজ এবং তিন-লাইনের মেনু থেকে আলাদাভাবে খোলা যায়।
- হ্যামবার্গার মেনুকে গ্রুপভিত্তিক কার্ড লেআউটে সাজানো হয়েছে; প্রতিটি আইটেমে monochrome icon, সংক্ষিপ্ত বিবরণ ও hover/focus state আছে।
- নিচে স্থায়ী ছয়-আইটেমের নেভিগেশন যোগ হয়েছে: Home, Chapters, Arcade, Simulations, Student Hub ও About। বর্তমান পেজ অনুসারে সক্রিয় আইটেম হাইলাইট হয়।
- মেনু ও নিচের নেভিগেশনের আইকনগুলো ConceptLab-এর monochrome SVG icon layer ব্যবহার করে।
- ফোনের safe-area, ছোট পর্দা, reduced-motion preference এবং scroll space-এর জন্য responsive CSS যোগ করা হয়েছে।

## ডিজাইন নোট

Physicsverse-এর দ্রুত-প্রবেশ, প্র্যাকটিস, ল্যাব, গেম এবং learning-progress-কে হোমপেজে সামনে রাখার ধারণা নেওয়া হয়েছে। ConceptLab-এর নিজস্ব কালো/আকাশি রঙ, existing route ও তিন বিষয়ের কাঠামো বজায় রাখা হয়েছে; কপি বা হুবহু layout করা হয়নি।

## যাচাই

- JavaScript syntax check: `assets/js/app.js`, `assets/js/hub.js`, `assets/js/mono-icons.js`
- Static build: `npm run build`
- Browser automation was attempted, but the runtime blocked Chromium navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`); live interaction testing therefore remains unverified.
