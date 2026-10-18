# আপডেট নোট — ConceptLab

- Admin Panel-এর Footer text হুবহু রাখা হয়; `Moshiur Rahman Araf`-কে ভুল করে `Taimur Shams` দিয়ে প্রতিস্থাপন করা বন্ধ করা হয়েছে।
- Admin content-এ থাকা simulation entries-এর সঙ্গে built-in simulation catalogue ID অনুযায়ী merge হয়, তাই পুরোনো/অসম্পূর্ণ CMS তালিকায় শুধু ১৪টি entry থাকলেও বাকি built-in entries হারিয়ে যায় না। Admin-এর existing entry ও visibility setting অগ্রাধিকার পায়।
- Concept-এর Stage 3 (Interactive Simulation)-এ দৃশ্যমান Next button যোগ করা হয়েছে, যা Stage 4 quiz-এ নিয়ে যায়। বোতামে চাপ দিলে Stage 3 progress-ও সংরক্ষণ হয়।
- Responsive Stage 3 Next button styling যোগ করা হয়েছে।

Build এবং JavaScript syntax checks চালানো হয়েছে। লাইভ Netlify deployment-এর পর admin save, footer display, simulation count ও stage transition হাতে পরীক্ষা করতে হবে।
