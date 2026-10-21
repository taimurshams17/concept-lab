# ConceptLab Arcade ও HUD আপডেট — ২১ অক্টোবর ২০২৬

## পরিবর্তন
- Games পেজে বিষয়ভিত্তিক গ্রুপিং, Simulation Lab ও Smart Practice-এর দ্রুত লিংক, আরও পরিষ্কার গেম কার্ড এবং মোবাইলের জন্য দুই-কলামের compact grid যোগ করা হয়েছে।
- MCQ গেমগুলোর Score / Combo / Lives / Time HUD চারটি সমান, ছোট বক্সে এক লাইনে রাখার CSS যোগ করা হয়েছে; ছোট স্ক্রিনেও চার কলাম থাকবে।
- নতুন গেম যোগ: Organic Conversion Map, Electron Configuration Lab, Stoichiometry Game এবং Virtual Lab Escape Room।
- বিদ্যমান Stoichiometry, pH, Electrochemical Cell, Reaction Energy এবং Ion Detective কনটেন্ট পুনরায় simulation হিসেবে যোগ করা হয়নি।
- নতুন গেমগুলো বিদ্যমান `stepOrder` ও `blitz` ইঞ্জিন ব্যবহার করে, যাতে আলাদা ডুপ্লিকেট গেম ইঞ্জিন তৈরি না হয়।
- `assets/js/defaults.js`, `assets/js/app.js`, `assets/css/main.css` পরিবর্তন করা হয়েছে।

## যাচাই
- `node --check assets/js/defaults.js`
- `node --check assets/js/app.js`
- `node --check assets/js/games.js`
- `node scripts/build-static.js`

সিনট্যাক্স চেক ও static build সফল। পূর্ণ browser interaction/regression test এই build-এ চালানো হয়নি; প্রকাশের আগে গেমগুলো মোবাইল ও ডেস্কটপে পরীক্ষা করুন।
