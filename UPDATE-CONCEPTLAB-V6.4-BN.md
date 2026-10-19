# ConceptLab — Update v6.4

## Navigation ও UI
- ডেস্কটপের ডান পাশের তিন-ডট আইকনকে তিন-লাইন হ্যামবার্গার মেনু করা হয়েছে।
- মোবাইল ও ডেস্কটপে মেনু খুললে পেছনের কনটেন্ট ডার্ক ও ব্লার হয়; ব্যাকড্রপে ক্লিক বা Escape চাপলে মেনু বন্ধ হয়।
- `Pages & Tabs` নামে অ্যাডমিন বিভাগ যোগ হয়েছে: প্রধান ট্যাবের লেবেল, দৃশ্যমানতা ও ক্রম বদলানো যায় এবং সংশ্লিষ্ট কনটেন্ট এডিটরে যাওয়া যায়।
- কাস্টম পেজ তৈরি, সম্পাদনা, প্রকাশ/আড়াল, URL slug এবং মুছে ফেলার ব্যবস্থা যোগ হয়েছে। কাস্টম পেজের কনটেন্ট plain text হিসেবে রেন্ডার হয়।

## About, ফন্ট ও অ্যানিমেশন
- About-এর নির্মাতা অংশে `Taimur Shams & Moshiur Rahman Araf` উল্লেখ করা হয়েছে। পুরোনো ডিফল্ট About পরিচিতি থাকলে সেটিও নতুন নামের সঙ্গে মাইগ্রেট হয়; কাস্টম লেখা অক্ষত থাকে।
- ইংরেজি UI-এর জন্য Inter; Daily Inspiration উদ্ধৃতির জন্য Lora যোগ করা হয়েছে। বাংলা ফন্ট Hind Siliguri রাখা হয়েছে।
- পেজ বদলানো, হোম হিরো এবং স্ক্রল-রিভিল অ্যানিমেশন উন্নত করা হয়েছে; reduced-motion সেটিংস সম্মান করা হয়।
- Ayat/Hadith ও Daily Inspiration-এর দূরত্ব বাড়ানো এবং উদ্ধৃতির আকার/ফন্ট উন্নত করা হয়েছে।
- মোবাইলে Arcade-এর গেম কার্ড কমপ্যাক্ট করা হয়েছে।

## শিক্ষামূলক গেম
- ১৪টি নতুন গেম যোগ হয়েছে: Physics Formula Sprint, Chemistry Ion Challenge, Math Concept Scramble, Physics Unit Rush, Reaction Reality Check, Math Truth Arena, Formula Pair Cosmos, HSC Term Scramble, Physics Odd-One Lab, Math Step Builder, Chem Lab Sequence, Flame Colour Detective, Projectile Range Challenge এবং Line Slope Challenge।
- নতুন গেমগুলো বিদ্যমান ইন্টারঅ্যাকটিভ গেম ইঞ্জিন ব্যবহার করে; পুরোনো সেভ করা কনটেন্টের সঙ্গে গেম/নেভিগেশন মাইগ্রেশনও যোগ করা হয়েছে।

## যাচাই
- JavaScript syntax checks পাস করেছে।
- ডিফল্ট কনফিগারেশন পরীক্ষা করে ১৪টি নতুন গেম ও ১১টি প্রধান নেভিগেশন ট্যাব নিশ্চিত করা হয়েছে।
- `npm run build` দিয়ে `dist/` তৈরি করা হয়েছে।
