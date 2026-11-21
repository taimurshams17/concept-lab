# VocabHub 2.17.2 — Practice ফিক্স ও Library পরিষ্কার

## ১. Practice ট্যাব ঠিক করা হয়েছে
- কারণ: HSC প্রশ্নের ধরন (`hsc`) `IBA_MAP`/`IBA_BN`-এ ছিল না, তাই Practice পেজ রেন্ডার করতে গিয়ে JavaScript error হচ্ছিল এবং পেজ ফাঁকা থাকত।
- এখন Practice-এর সব মোড (MCQ, Fill, Matching, Synonym, Flashcard, Mixed, DU IBA) এবং HSC Academic কার্ড চলে।
- DU IBA-র "সব ধরন" মিক্সে আর HSC প্রশ্ন ঢোকে না; HSC প্রশ্ন শুধু HSC কার্ড/ধরন থেকে আসে।

## ২. Library থেকে বাড়তি এন্ট্রি বাদ
- HSC Academic-এর জন্য স্বয়ংক্রিয়ভাবে বানানো ১৪২টি শব্দ/বাক্য-এন্ট্রি Library থেকে সরানো হয়েছে (এর মধ্যে "An Addiction To Junk Food May Even…" ধরনের পুরো বাক্যও ছিল)।
- আগে থেকে থাকা ৮৮টি শব্দ থেকে HSC Section ট্যাগ ও HSC reference সরানো হয়েছে।
- Library-র Section ড্রপডাউন থেকে "English 1st Paper HSC Academic" বাদ। শব্দসংখ্যা: ১,৯৭৪ → ১,৮৩২।

## ৩. HSC প্রশ্ন
- ৩০৭টি HSC প্রশ্ন Practice-এ আছে। যে প্রশ্নের শব্দ-প্রোফাইল আর নেই, সেখানে প্রশ্ন ও ব্যাখ্যা দেখায়, কিন্তু কোনো শব্দের অগ্রগতি/Mistakes-এ কিছু জমে না।

## ফাইল
বদলেছে: `script.js`, `vocabulary.json`, `data/vocabulary.json`
