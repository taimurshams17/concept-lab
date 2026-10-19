# ConceptLab v6.8 — Arcade, XP ও Cosmos Polish

## এই আপডেটে

1. **Arcade carousel-এর কেন্দ্র ঠিক করা হয়েছে।** আগের `offsetLeft`-ভিত্তিক scroll calculation ও scroll-event update একই অবস্থান নির্দেশ না করায় নির্বাচিত কার্ড দৃশ্যত বাম দিকে চলে যাচ্ছিল। এখন `getBoundingClientRect()` দিয়ে কার্ড ও ট্র্যাকের বাস্তব viewport-center তুলনা করা হয়; প্রাথমিক লোড, আগের/পরের তীর, কার্ডে ক্লিক এবং swipe/scroll-এর নির্বাচিত অবস্থা একইভাবে সমন্বয় হয়। সক্রিয় কার্ডে `aria-current`-ও সেট হয়।
2. **দুই পাশের কার্ডকে secondary appearance দেওয়া হয়েছে।** মাঝের সক্রিয় কার্ড পরিষ্কার ও বড় থাকবে; পাশের কার্ডগুলো তুলনামূলক স্বচ্ছ, হালকা blurred এবং ছোট থাকবে। ডেস্কটপ ও মোবাইলের জন্য আলাদা মাপ রাখা হয়েছে।
3. **XP toast ছোট ও রেসপনসিভ করা হয়েছে।** XP সংগ্রহের বার্তায় নির্দিষ্ট `xp` class যোগ হয়েছে। মোবাইলে এটি নিচের দিকে কেন্দ্রীভূত, কম padding-যুক্ত এবং viewport-এর প্রস্থ অনুযায়ী সীমাবদ্ধ থাকবে, যাতে লম্বা বার্তা পুরো স্ক্রিন দখল না করে।
4. **নীল ওঠা particle কমানো হয়েছে।** আগের সর্বোচ্চ ৬০টি particle থেকে এখন সর্বোচ্চ ২৬টি; viewport-ছোট হলে আরও কম হবে।
5. **Cosmos background সমৃদ্ধ করা হয়েছে।** ৩টির বদলে ৮টি সূক্ষ্ম গ্রহ/উপগ্রহ এবং ১টির বদলে ৩টি কম-opacity spiral galaxy যুক্ত হয়েছে। অতিরিক্ত বস্তুগুলো ব্যাকগ্রাউন্ডে থাকবে, কনটেন্ট বা কন্ট্রোল ঢাকবে না।
6. **মোবাইল rendering-এর কাজ কমানো হয়েছে।** star সংখ্যা কমানো হয়েছে এবং background canvas-এর animation loop সর্বোচ্চ প্রায় ৪৫ FPS-এ সীমিত করা হয়েছে। `prefers-reduced-motion` অনুযায়ী carousel animation-ও বন্ধ হতে পারবে।

## করা যাচাই

- `node --check` দিয়ে `assets/js/*.js`, `admin/*.js` এবং `scripts/*.js` পরীক্ষা — সফল।
- `npm run build` — সফল।
- `index.html`, `404.html`, `admin/index.html` এবং generated `dist` HTML-এর স্থানীয় asset/link path পরীক্ষা — কোনো missing local reference পাওয়া যায়নি।
- প্যাচের নির্দিষ্ট regression checks — carousel viewport geometry, arrow handler, XP class, lower particle count, ৮টি planet entry, ৩টি galaxy entry, animation frame cap ও mobile toast style — সফল।

## সীমাবদ্ধতা

এই রানটাইমে Chromium-এর মাধ্যমে পেজ খুলে automated visual smoke test করার চেষ্টা `ERR_BLOCKED_BY_ADMINISTRATOR`-এর কারণে বাধাপ্রাপ্ত হয়েছে। তাই syntax/build/static-path checks পাস করলেও বাস্তব PC ও মোবাইল ব্রাউজারে carousel centering, toast placement এবং frame-rate আচরণ ডিপ্লয় করার পর সরাসরি যাচাই করা প্রয়োজন।
