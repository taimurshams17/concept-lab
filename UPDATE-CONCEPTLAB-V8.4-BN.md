# ConceptLab v8.4 — Explore Chapters ও Message Centre

## পরিবর্তন
- Explore Chapters-এর All, Higher Mathematics, Chemistry ও Physics ফিল্টারগুলো এখন একই `data-chf` state ব্যবহার করে অধ্যায় তালিকা ফিল্টার করে।
- প্রতিটি subject filter-এ শুধু ১ম পত্রের নির্ধারিত বাংলা অধ্যায়গুলো দেখানো হয়।
- মোবাইল স্ক্রিনে ফিল্টার বাটনগুলো ছোট, চার-কলামের গ্রিডে সাজানো হয়েছে; সার্চ বক্স পূর্ণ প্রস্থ নেয়।
- Message Centre আইকন এখন নোটিশ প্রকাশিত না থাকলেও সব পেজে দৃশ্যমান। আইকনে ক্লিক করলে মেসেজ প্যানেল খোলে; নতুন নোটিশ থাকলে glow এবং unread indicator দেখায়।
- মেসেজ ট্রিগার `document.body`-তে যুক্ত করা হয়েছে, যাতে app/page transform-এর কারণে fixed-positioning আটকে না যায়।

## যাচাই
- `node --check assets/js/app.js`
- `node --check assets/js/hub.js`
- `npm run build`
