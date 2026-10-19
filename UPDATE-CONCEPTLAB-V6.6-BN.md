# ConceptLab v6.6 — Navigation and Motion Fix

## প্রধান পরিবর্তন

1. **হ্যামবার্গার মেনু পোর্টাল:** মেনু খোলার সময় `#nav`-কে সাময়িকভাবে `body`-এর সরাসরি সন্তান করা হয়। ফলে sticky header, `backdrop-filter` বা ancestor stacking context মেনুকে clip করতে পারবে না। বন্ধ হলে নেভিগেশন আগের DOM অবস্থানে ফিরে যায়।
2. **Viewport-anchored placement:** মেনুর অবস্থান বর্তমান viewport-এ হ্যামবার্গার বাটনের অবস্থান থেকে নির্ধারিত হয়; উচ্চতা সীমিত, overflow scrollable এবং mobile safe-area বিবেচনায় রাখা হয়েছে।
3. **Backdrop:** পুরো viewport জুড়ে blur/dim overlay; menu/backdrop layer-এর z-index আলাদা করে নির্ধারিত।
4. **Scroll-triggered reveal:** Ayat/Hadith ও Daily Inspiration section স্ক্রল করে দৃশ্যমান হলে fade + lift motion চালায়। হোমপেজের অন্যান্য নির্দিষ্ট section, simulation/game area, এবং অন্যান্য পেজের cards/sections-এও reveal animation যুক্ত হয়েছে।
5. **গেম কার্ডের আইকন:** Games তালিকায় কার্ড-ভিত্তিক আলাদা emoji palette ব্যবহার করা হয়েছে, যাতে পাশাপাশি একাধিক গেমে একই আইকন পুনরাবৃত্তির সম্ভাবনা কমে। গেমের নিজস্ব data/icon পরিবর্তন করা হয়নি।
6. **Accessibility:** `Escape`, backdrop click, reduced-motion preference এবং menu `aria-expanded`/`aria-hidden` state বজায় রাখা হয়েছে।

## যাচাই

- সব `assets/js/*.js`, `admin/admin.js`, `scripts/build-static.js`, `netlify/functions/api.mjs`-এ `node --check` চালানো হয়েছে।
- `npm run build` সফল হয়েছে।
- ZIP integrity check চালানো হয়েছে।

বাস্তব Android/desktop browser-এ হাতে স্ক্রল-ভিত্তিক QA এখানে সম্পন্ন হয়নি; ডিপ্লয়মেন্টের পর বিভিন্ন scroll position থেকে menu open/close যাচাই করুন।
