# ConceptLab v8.9.5 — Desktop & Mobile Balance

- `বাংলায় ধারণা-ভিত্তিক পাঠ` badge-এর উপরে/হেডার থেকে ছোট, নির্দিষ্ট gap রাখা হয়েছে; desktop-এ আগের অতিরিক্ত top spacing কমানো হয়েছে।
- Desktop primary navigation থেকে Home, Explore Chapters, Games, Simulations লুকানো হয়েছে; mobile menu portal এবং bottom navigation-এর লিংক অক্ষুণ্ণ।
- Desktop hero, section spacing, headings ও cards-এর আকার কমিয়ে max-width এবং density নিয়ন্ত্রণ করা হয়েছে, যাতে layout অতিরিক্ত বড়/চ্যাপ্টা না লাগে।
- Mobile Arcade ও Simulations cards এক কলামে সাজানো হয়েছে; প্রতিটি কার্ডের উচ্চতা নিয়ন্ত্রিত, আইকন-বাম ও লেখা-ডান layout এবং মাঝারি vertical spacing রাখা হয়েছে।
- Responsive CSS overrides যোগ করা হয়েছে; source files ও existing feature code অক্ষুণ্ণ রাখা হয়েছে।

## QA
- Build command: `npm run build`
- Browser/device screenshot testing এখনও বাস্তব ডিভাইসে সম্পন্ন করা প্রয়োজন।
