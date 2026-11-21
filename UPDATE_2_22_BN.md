# VocabHub 2.22 — BCS Vocabulary ও পরীক্ষার সেটআপ আপডেট

## ১. Library-তে আলাদা BCS Vocabulary
- BCS English Question Bank থেকে পাওয়া **২২৪টি স্বতন্ত্র headword/phrase** নিয়ে `BCS Vocabulary` নামে নতুন Library section যোগ করা হয়েছে।
- প্রতিটি প্রোফাইলে শব্দ/phrase, বাংলা অর্থ, part of speech, IPA pronunciation, contextual English example ও বাংলা অনুবাদ এবং Cambridge/Oxford dictionary lookup link আছে।
- সংশ্লিষ্ট BCS প্রশ্ন নম্বর ও উৎস-রেফারেন্স Word Profile-এ দেখা যায়; সেখান থেকেই যুক্ত BCS প্রশ্নে practice শুরু করা যায়।
- কোনো শব্দের নির্ভরযোগ্য সরাসরি synonym/antonym না থাকলে সেটি জোর করে যোগ করা হয়নি।
- BCS-এর নতুন profile data root `vocabulary.json`, `data/vocabulary.json`, offline embedded data এবং `data/bcs-vocabulary.json`-এ সমন্বিত। বিদ্যমান saved learner progress রাখা হয়।

## ২. DU IBA ও BCS source আলাদা
আগের source initialization-এ DU ABCD, HSC এবং BCS question array-কে `IBA_Q`-এর সঙ্গে append করা হয়েছিল। ফলে DU IBA-only practice-ও অন্য পরীক্ষার প্রশ্ন পেয়ে যাচ্ছিল। এই merge সরানো হয়েছে।

এখন আলাদা source:
- DU IBA — নিজস্ব IBA প্রশ্ন
- DU ABCD — নিজস্ব A/B/C/D প্রশ্ন
- HSC Academic — নিজস্ব HSC English 1st Paper প্রশ্ন
- BCS English Bank — নিজস্ব BCS Preliminary English প্রশ্ন
- All Sources — ব্যবহারকারী স্পষ্টভাবে নির্বাচন করলে কেবল mixed practice

BCS bank-এ **৪৮৫টি English question** আছে। এর মধ্যে **৪৮৪টি** answerable প্রশ্ন scored practice-এ যায়। ২১তম BCS-এর Q368 passage ছাড়া উত্তর নির্ভরযোগ্যভাবে যাচাই করা যায় না, তাই এটি archive-এ দেখা যায় কিন্তু scoreable pool-এ নেই। তিনটি non-English medical/biology item English bank-এ অন্তর্ভুক্ত হয়নি।

## ৩. Question-count tiles ও difficulty availability
- `Number of questions` dropdown-এর বদলে ছোট selectable tile ব্যবহার করা হয়েছে।
- ৩, ৫, ১০, ২০, ৩০ এবং উপলভ্য সর্বোচ্চ/সবগুলো—প্রাসঙ্গিক tile দেখানো হয়।
- নির্বাচিত section/unit/mode-এ নির্দিষ্ট level-এ চাওয়া সংখ্যক উপযোগী শব্দ না থাকলে সেই level disabled থাকে।
- নির্বাচিত count-এর জন্য কোনো level যথেষ্ট না হলে সবচেয়ে বড় উপলভ্য level/সংখ্যায় স্বয়ংক্রিয়ভাবে নামানো হয়। প্রয়োজন হলে একই section-এর অন্য unit বা সব section fallback হয়।
- ১–২টি উপযোগী item থাকলেও ছোট round শুরু হতে পারে; আগের ন্যূনতম ৩ শব্দের বাধা সরানো হয়েছে।
- Mistakes Exam-এও dropdown সরিয়ে একই tile control দেওয়া হয়েছে; ৩ প্রশ্নের অপশন সেখানেও আছে। Timed challenge-এ সময়ের dropdown অপরিবর্তিত।

## ৪. যাচাই
- `script.js`, `iba-data.js`, `du-abcd-data.js`, `hsc-data.js` ও `bcs-data.js`-এর JavaScript syntax check পাস করেছে।
- JSON parse validation পাস করেছে। Root ও `data/` vocabulary export-এ ২,২৬১ entry এবং ২২৪টি BCS profile রয়েছে; offline embedded vocabulary-তেও একই সংখ্যা।
- BCS source pool-এ ৪৮৫টি record, এর মধ্যে ৪৮৪টি scoreable। DU IBA-only pool-এ BCS/DU ABCD/HSC record নেই।
- Browser-based visual walkthrough সম্পন্ন করা যায়নি; এই build-এর যাচাই static syntax, data integrity এবং source-pool integration-এ সীমাবদ্ধ।
