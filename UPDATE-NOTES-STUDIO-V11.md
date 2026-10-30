# v11.0 — Student Toolkit + premium layout layer (2026-10-30)

## নতুন: Student Toolkit (`#/toolkit`)
৯টি নতুন টুল (সব ক্লায়েন্ট-সাইড, লগইন লাগে না): Molar Mass, Vector Calculator, Matrix Calculator (2×2/3×3), Statistics, Quadratic Solver (জটিল মূলসহ), Base Converter (2–36), Sig-Fig & Scientific, Percent & Ratio, Focus Sounds.
টুলগুলো Student Hub-এর টাইল তালিকা, মেনু (Toolkit) ও ফুটারেও যুক্ত।

## ডিজাইন ও লেআউট
- `assets/css/studio.css` (সবার শেষে লোড): Hub টাইল এক মাপে ও এক অ্যালাইনমেন্টে (পুরনো প্যাচে তিনটি টাইল আলাদা ছোট হয়ে যাচ্ছিল), অপ্রয়োজনীয় তীর-আইকন বাদ, নেভ লেবেল ভাঙা বন্ধ, হেডিং ফন্ট একই পরিবার, হালকা হেয়ারলাইন বর্ডার, Sign up বাটনের নিয়ন গ্লো কমানো।
- বটম নেভ লেবেল ছোট: Labs / Graphs / Hub। Toolkit ও Solver পেজে Hub ট্যাব সক্রিয় দেখায়।

## ফাইল
নতুন: `assets/js/studio.js`, `assets/css/studio.css`। পরিবর্তিত: `index.html`, `assets/js/hub.js` (টাইল তালিকা), `assets/js/app.js` (নেভ অ্যাক্টিভ স্টেট), `sw.js` (ক্যাশ ভার্সন)। `dist/` রিবিল্ড করা হয়েছে।

## v11.1 ফিক্স (2026-10-30)
- নতুন ৯টি টুল এখন Student Hub-এর ভেতরে (`#/hub/<tool>`): ভেতরে ঢুকে ফিরলে Student Hub-এ যায়। পুরনো `#/toolkit` লিংক স্বয়ংক্রিয়ভাবে Hub-এ পাঠায়; আলাদা "Toolkit" মেনু/ফুটার লিংক সরানো হয়েছে।
- নতুন টুলগুলো হোমের Quick Access ও থ্রি-লাইন মেনুর "STUDENT HUB · ALL TOOLS" অংশে যুক্ত।
- বটম নেভে "Chapters" সহ সব লেবেল পুরো দেখায় (320–430px পরীক্ষিত)।
- Explore Chapters: ফিল্টার চিপ এক সারিতে (Higher Math), ফাঁক কমানো, চ্যাপ্টার কার্ড থেকে সাবজেক্টের নাম-ব্যাজ বাদ, চ্যাপ্টারের নাম সব জায়গায় একই sky blue (#38bdf8), কার্ডের "কনসেপ্টগুলো দেখুন" এক লাইনে।
