# v2.29 — Arcade কার্ড অ্যানিমেশন

Arcade-এর প্রতিটি গেম কার্ড এখন বাইরে থেকেই নিজের থিম দেখায় (শুধু CSS `transform`/`opacity` অ্যানিমেশন, ৬০fps-বান্ধব)।

- ১৩টি গেম + BCS Speed Sprint + HSC Challenge — প্রতিটির নিজস্ব অ্যানিমেটেড আর্ট, mode ট্যাগ, difficulty pips ও অ্যানিমেটেড PLAY বাটন।
- Hover-এ 3D tilt, থিম-রঙের glow, parallax ও shine; টাচে press-feedback।
- স্ক্রিনের বাইরের কার্ডের অ্যানিমেশন IntersectionObserver দিয়ে থামে (মোবাইল ব্যাটারি/পারফরম্যান্স)।
- `prefers-reduced-motion: reduce` চালু থাকলে সব কার্ড স্থির, পুরোপুরি পড়ার যোগ্য অবস্থায় দেখায়।
- গেম লজিক, ডেটা, Practice পেজ ও অন্য সব সেকশন অপরিবর্তিত। কার্ডে ক্লিক করলে আগের মতোই `configureGame(...)` / `configureIba(...)` খোলে।

পরিবর্তিত ফাইল: `script.js` (arcCards + ARC_ART), `style.css` (শেষের "Arcade game cards" ব্লক), `index.html` (cache version 2.29)।
