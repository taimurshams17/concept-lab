# VocabHub 2.14 — ইউনিট, প্রিমিয়াম ড্রপডাউন, মোবাইল মেনু ফিক্স ও হোম প্রোমো

## ১. ইউনিট অনুসারে শব্দ (Library)
- ENGLISH FOR TODAY (Class XI–XII) 2026 Section-এর ৭২৬টি শব্দে ইউনিট ট্যাগ (`u26`) যোগ হয়েছে (সোর্স: `data/sources/English-for-Today-Class-XI-XII-2026-Full-Vocabulary.txt`)। একটি শব্দ একাধিক ইউনিটে থাকলে (১৭টি) দুই ইউনিটেই দেখায়।
- Library-তে শুধু ওই Section বাছাই করলেই "ইউনিট বেছে নাও" প্যানেল আসে। অন্য Section-এ প্যানেল লুকানো থাকে।
- ১২টি ইউনিট-কার্ডে শব্দসংখ্যা ও শেখার অগ্রগতি দেখায়। কার্ডে চাপলে শুধু সেই ইউনিটের শব্দ আসে। "এই ইউনিটে প্র্যাকটিস" বোতামও আছে।
- ২০১৮ Key Words Section-এও আগে থেকে ইউনিট তথ্য ছিল, তাই সেখানেও একই ইউনিট প্যানেল চালু হয়েছে (১৫টি ইউনিট)।
- প্র্যাকটিস/গেম সেটআপে Section বাছলে "Unit" ড্রপডাউন আসে। শুধু নির্দিষ্ট ইউনিটের শব্দ দিয়ে গেম খেলা যায়।

## ২. প্রিমিয়াম ড্রপডাউন
- Library-র Section, Status ও Level, History-র Exam type এবং Admin-এর Level ড্রপডাউন গেম-সেটআপের মতো প্রিমিয়াম ডিজাইনে (কাউন্টসহ, Level-এ প্রগ্রেস বার) করা হয়েছে।
- বাকি সাধারণ `<select>`-গুলোতেও একই থিমের কাস্টম তীর ও ফোকাস রিং যোগ হয়েছে।

## ৩. মোবাইল মেনু ফিক্স
- কারণ: নিচের ডকের (`#nav`) `backdrop-filter` থাকায় ভেতরের `position:fixed` মেনু প্যানেল ডকের ৬৬px বক্সের ভেতরে আটকে যাচ্ছিল। তাই প্যানেল পুরো স্ক্রিনে খুলছিল না।
- সমাধান: মেনু প্যানেলকে `#nav`-এর বাইরে আলাদা `#drawer`-এ সরানো হয়েছে। এখন মেনু বোতামে চাপলে ডান পাশ থেকে সব ১৬টি ট্যাব (Workspace / Your progress / Account & tools) গ্রুপ করে খোলে।
- ট্যাবে চাপলে মেনু বন্ধ হয়। ব্যাকড্রপ বা ✕ বা Esc দিয়েও বন্ধ হয়।

## ৪. হোম পেজের বিজ্ঞাপন
- English for Today 2026 ফিচার ব্যানার: ১২টি ইউনিট-চিপ, সরাসরি ইউনিট খোলে।
- ১২টি প্রোমো টাইল: Practice, Arcade, Levels, Library, Revision, Mistakes, Missions, Achievements, Analytics, History, Leaderboard, Profile। প্রতিটিতে নিজস্ব রঙ ও লাইভ সংখ্যা (due, to fix, XP ইত্যাদি) আছে।

## ৫. অন্যান্য
- `script.js`-এর ভেতরের শব্দতালিকা (আগে ৮৯৪টি) এখন পুরো ১,৪৭৫টি। তাই ফাইল সরাসরি খুললেও ২০২৬ Section কাজ করবে।
- নতুন আইকন: Leaderboard (podium)।


## ৬. Medical Admission Vocabulary — v2.15
- Library-তে নতুন **Medical Admission Vocabulary** Section যোগ হয়েছে; দেওয়া উত্তরসহ ডকুমেন্ট থেকে ১০৯টি আলাদা word/phrase profile তৈরি।
- ১১১টি প্রশ্ন মূল প্রশ্ন নম্বর, অপশন, উত্তর ও সংকলিত ব্যাখ্যাসহ রাখা হয়েছে।
- Practice-এ Medical Admission Question Practice এবং Arcade-এ Medical Admission Quiz Game যুক্ত।
- কোনো শব্দের Profile-এ সেই শব্দ-সংশ্লিষ্ট Original Question Reference দেখায়; সেখান থেকেই প্রশ্ন অনুশীলন করা যায়।
- প্রশ্নগুলো Word Meaning, Synonym–Antonym, Idioms–Phrases এবং Spelling–Word Forms বিভাগে সাজানো।
- উৎস ডকুমেন্টে ৩৬১ প্রশ্নের প্রশ্নব্যাংক থেকে ১১১টি vocabulary-focused প্রশ্ন সংকলিত ছিল; নতুন সেকশনে ওই ফাইলের প্রশ্নগুলোই ব্যবহার করা হয়েছে।
