# ConceptLab v8.9.1 — Mobile layout stabilization

## সংশোধন
- পুরো পেজে horizontal overflow বন্ধ এবং flex/grid children-এ `min-width: 0`-ভিত্তিক সুরক্ষা যোগ করা হয়েছে।
- ছোট ফোনে হেডার, ব্র্যান্ড, অ্যাকাউন্ট বাটন ও hamburger-এর জায়গা নির্দিষ্ট করে দেওয়া হয়েছে।
- hamburger menu-কে viewport-এর ভেতরে রাখা, scrollable করা এবং menu tile-এর লেখা ভেঙে দেখানোর নিয়ম যোগ হয়েছে।
- Home launchpad-এ ফোনের জন্য দুই-কলাম feature grid, এক-কলাম subject cards এবং দুই-কলাম tool grid রাখা হয়েছে; 380px-এর নিচে feature cards এক কলামে যায়।
- ছয়টি bottom navigation item-কে সমান grid cell, ছোট responsive label, safe-area-aware bottom position ও পর্যাপ্ত body padding দেওয়া হয়েছে।
- প্রধান card, image, form control ও page container-এ overflow containment যোগ করা হয়েছে।

## QA
- `npm run build` সফল হয়েছে।
- JS syntax ও static source checks সম্পন্ন।
- Chromium headless screenshot নেওয়ার চেষ্টা করা হয়েছে, কিন্তু এই runtime-এ browser process সময়সীমা পেরিয়ে যায়; তাই বাস্তব ডিভাইসের screenshot/interaction QA নিশ্চিত করা যাচ্ছে না। Android/iOS ফোনে deploy preview খুলে যাচাই করার পরামর্শ দেওয়া হচ্ছে।
