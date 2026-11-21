# Vocabulary library review — Update 2.20

## কী সংশোধন করা হয়েছে
- লাইব্রেরির সব headword-এর প্রথম অক্ষর বড় হাতের করা হয়েছে; ID অপরিবর্তিত রাখা হয়েছে যাতে learner progress/favourites-এর key না বদলায়।
- ফাঁকা বা placeholder Part of Speech-গুলো পূরণ/স্বাভাবিক করা হয়েছে।
- অনুপস্থিত pronunciation-এর জন্য CMU Pronouncing Dictionary-ভিত্তিক General American IPA ব্যবহার করা হয়েছে; সেখানে headword না থাকলে eSpeak-এর British pronunciation model দিয়ে fallback করা হয়েছে। প্রতিটি entry-তে ব্যবহৃত dialect/source আলাদা করে রাখা হয়েছে।
- প্রতিটি শব্দে Cambridge Dictionary এবং Oxford Learner’s Dictionaries-এর lookup link নিশ্চিত করা হয়েছে। এগুলো সরাসরি dictionary lookup reference; প্রতিটি পৃষ্ঠার সংজ্ঞা আলাদাভাবে যাচাই করা হয়েছে—এমন দাবি নয়।
- DU A/B/C/D, CKRUET ও Medical Admission-এর source-indexed/default Intermediate শব্দগুলোর কয়েকটি স্তর পুনর্বিন্যাস করা হয়েছে। `difficulty` এবং `level` একসঙ্গে sync রাখা হয়েছে।
- ভুল/placeholder বাংলা অর্থ এবং কয়েকটি source typo সংশোধন করা হয়েছে; `seperate`-এর প্রশ্ন-রেফারেন্স সঠিক `Separate` প্রোফাইলে যুক্ত করা হয়েছে।
- নির্ভরযোগ্য বিপরীতার্থক না থাকা শব্দে অ্যান্টোনিম জোর করে বসানো হয়নি।
- Meaning Breakdown-এ slash ছাড়াও semicolon ও pipe-কে sense separator হিসেবে দেখানো হয়েছে।

## Learning level নির্দেশিকা
এই প্রকল্পের পাঁচ স্তর Beginner, Elementary, Intermediate, Advanced, Expert—এগুলো Oxford/CEFR স্তরের হুবহু সমার্থক নয়। Oxford-এর প্রকাশিত নির্দেশনা অনুযায়ী CEFR হলো ভাষা-দক্ষতার স্তর; Oxford 3000/5000-এ vocabulary item-কে corpus frequency ও learner relevance ধরে CEFR-এ aligned করা হয়। এই আপডেটে তাই উৎসের প্রেক্ষাপট, শব্দের ব্যবহারিক পরিচিতি ও lexical complexity ধরে editorial classification করা হয়েছে; প্রতিটি শব্দে সরকারি CEFR certification দাবি করা হচ্ছে না।

## যাচাইয়ের সীমা
- Cambridge/Oxford link যোগ করা মানেই প্রতিটি entry-র page-by-page dictionary review নয়।
- IPA স্বয়ংক্রিয় pronunciation source থেকে এসেছে; বিশেষায়িত নাম, বিরল রূপ ও phrase-এর উচ্চারণে শিক্ষক/অভিধান দিয়ে চূড়ান্ত যাচাই উপকারী।
- বহু-অর্থবিশিষ্ট শব্দে বাংলা অর্থ প্রসঙ্গনির্ভর।
- কোনো noun বা abstract term-এর স্বাভাবিক direct antonym না থাকলে `ant` খালি রাখা হয়েছে।
