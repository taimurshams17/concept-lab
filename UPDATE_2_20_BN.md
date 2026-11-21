# VocabHub Update 2.20 — Vocabulary Profile Enrichment

## কী পরিবর্তন করা হয়েছে

- Library-র **2,077টি শব্দ/phrase profile** একত্রে পরীক্ষা করে ফাঁকা profile field পূরণ করা হয়েছে।
- প্রতিটি profile-এ বাংলা অর্থ, Part of Speech, Section, Learning Level, Synonyms, Pronunciation (IPA) ও Dictionary References রাখা হয়েছে। Meaning Breakdown এখন `/`, `;` এবং `|`—তিন ধরনের separator দিয়ে আলাদা sense দেখাতে পারে।
- সব headword-এর প্রতিটি শব্দের প্রথম অক্ষর Capital করা হয়েছে; ID অক্ষত রাখা হয়েছে যাতে learner progress ও favourites-এর key না বদলায়।
- চিহ্নিত ভুল/placeholder বাংলা অর্থ ও কয়েকটি source spelling error সংশোধন করা হয়েছে। `seperate` বানান-প্রশ্নটি সঠিক `Separate` profile-এর সঙ্গে যুক্ত করা হয়েছে; duplicate typo profile বাদ দেওয়ায় মোট unique entry 2,077 হয়েছে।
- 236টি Learning Level পুনর্বিন্যাস করা হয়েছে এবং `difficulty` ও `level` field একই স্তরে রাখা হয়েছে।
- অনুপস্থিত IPA-র ক্ষেত্রে CMU Pronouncing Dictionary ব্যবহার করা হয়েছে; সেখানে না থাকলে eSpeak-এর British pronunciation model fallback হিসেবে ব্যবহৃত হয়েছে। প্রতিটি entry-তে pronunciation dialect/source metadata আছে।
- সব profile-এ Cambridge Dictionary এবং Oxford Learner’s Dictionaries-এর lookup reference link যোগ/নিশ্চিত করা হয়েছে।
- যেখানে নির্ভরযোগ্য direct antonym নেই, সেখানে antonym list ফাঁকা রাখা হয়েছে। 1,181টি profile-এ অন্তত একটি antonym আছে; 896টি profile-এ কৃত্রিম বিপরীতার্থক যোগ করা হয়নি।
- Root `vocabulary.json`, `data/vocabulary.json` এবং `script.js`-এর offline embedded vocabulary একই 2,077টি profile দিয়ে sync করা হয়েছে।

## Learning Level সম্পর্কে

Beginner, Elementary, Intermediate, Advanced ও Expert হলো এই Library-র editorial learning bands; এগুলো official CEFR certification নয়। CEFR ভাষা-দক্ষতার স্তর নির্ধারণ করে। Oxford-এর 3000/5000 word lists শব্দের corpus frequency ও learner relevance ধরে CEFR-এর সঙ্গে aligned, কিন্তু প্রতিটি শব্দের CEFR level সরলভাবে এই পাঁচটি internal band-এর সমতুল্য নয়। তাই এই build-এ শব্দের পরিচিতি, ব্যবহারিক প্রেক্ষাপট ও lexical complexity ধরে editorial level দেওয়া হয়েছে।

## তথ্য-উৎস ও যাচাইয়ের সীমা

- Cambridge ও Oxford-এর link-গুলো সরাসরি শব্দ খোঁজার lookup link; প্রতিটি entry-র dictionary page আলাদাভাবে খুলে যাচাই করা হয়েছে—এমন দাবি নয়।
- IPA automated pronunciation source থেকে transcribed/generated; accent ও dictionary ভেদে উচ্চারণে পার্থক্য হতে পারে। বিশেষায়িত নাম, বিরল শব্দ ও phrase-এর উচ্চারণ শিক্ষক/অভিধান দিয়ে যাচাই করা ভালো।
- আগে থেকে থাকা বাংলা অর্থগুলোর সবগুলোকে নতুন করে প্রতিটি অভিধানে মিলিয়ে দেখা হয়নি। চিহ্নিত placeholder/স্পষ্ট ভুল অর্থ সংশোধন করা হয়েছে; প্রসঙ্গভেদে অন্য বাংলা প্রতিশব্দও গ্রহণযোগ্য হতে পারে।
- সব entry-তে example sentence যোগ করা হয়নি; এই update-এ examples-এর ঘাটতি পূরণ scope-এর বাইরে রাখা হয়েছে।

## Runtime QA

- `vocabulary.json` ও `data/vocabulary.json`-এ 2,077টি entry আছে এবং দুটি file content-identical।
- `script.js`-এর embedded offline data একই 2,077টি entry-র সঙ্গে মিলে।
- বাংলা অর্থ, POS, synonym, IPA, source references, section এবং level field ফাঁকা নেই।
- `difficulty` ↔ `level` mapping পরীক্ষা করা হয়েছে; invalid level নেই।
- JavaScript syntax check (`node --check script.js`) সফল।
