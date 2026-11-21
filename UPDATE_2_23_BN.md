# VocabHub 2.23 — BCS tab, count tiles ও Library unit dropdown

## ব্যবহারকারীর রিপোর্ট অনুযায়ী সংশোধন
- DU IBA-এর session metadata থেকে `BCS English Bank` বাদ দেওয়া হয়েছে। BCS আর DU IBA session/year list-এ ঢুকবে না।
- Practice studio-তে `DU IBA past questions` নামটি শুধু DU IBA-এর জন্য নির্দিষ্ট করা হয়েছে; BCS-এর আলাদা `BCS Preliminary English · আলাদা ট্যাব` shortcut রয়েছে।
- Admission Questions archive-এ BCS নিজস্ব bank (`id: bcs`) হিসেবেই আলাদা university/source card-এ থাকবে; এর প্রশ্ন `BCS_Q` থেকেই আসে।
- IBA question-type map থেকে BCS type সরানো হয়েছে, যাতে BCS type-গুলো IBA-এর সঙ্গে মিশে না যায়। `All Sources` কেবল ব্যবহারকারী নিজে নির্বাচন করলে mixed pool তৈরি করে।
- Library-তে unit-গুলো বড় card grid হিসেবে নয়, compact dropdown হিসেবে দেখানো হয়। Unit নির্বাচন করলে আগের মতোই সেই unit-এর শব্দ filter হবে; `All units`-ও থাকবে।
- Exam setup-এর Number of questions control ছোট selectable tile হিসেবেই রাখা ও দৃশ্যমানতা উন্নত করা হয়েছে। ৩ প্রশ্নের tile আছে; pool-এ ৩টির কম থাকলে অপ্রাপ্য সংখ্যা disabled, উপলভ্য সংখ্যা নির্বাচনযোগ্য।

## যাচাই
- JavaScript syntax check: `node --check script.js`
- JSON data parse এবং archive file integrity যাচাই করা হয়েছে।
- Browser visual walkthrough এখনো আলাদাভাবে করা হয়নি।
