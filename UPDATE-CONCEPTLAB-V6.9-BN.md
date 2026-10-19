# ConceptLab v6.9 — Orb Softening & Science Outro

## পরিবর্তন
- হোমপেজের Hero SVG-তে বড় কেন্দ্রীয় orb/glow ছোট ও মৃদু করা হয়েছে; রকেট, atom, flask, wave ও formula-ভিত্তিক মূল চিত্র রাখা হয়েছে।
- ব্যাকগ্রাউন্ডে বড়/উজ্জ্বল bubble-এর অনুভূতি কমাতে particle সংখ্যা কমানো হয়েছে (সর্বোচ্চ 26 থেকে desktop-এ প্রায় 11, mobile-এ প্রায় 6), star count সীমিত করা হয়েছে এবং decorative planet-এর আকার/উজ্জ্বলতা কমানো হয়েছে।
- হোমপেজের একদম নিচে চলমান formula ticker যোগ করা হয়েছে।
- Formula ticker-এর পর নতুন responsive Science Outro panel যোগ করা হয়েছে; এতে line-art atom, flask, waveform ও moving orbit/path animation রয়েছে। এটি desktop ও mobile layout-এ মানিয়ে নেবে।
- বড় section pseudo-orb-গুলোকে ছোট, ম্লান orbital outline-এ রূপান্তর করা হয়েছে।
- `prefers-reduced-motion` চালু থাকলে নতুন animation বন্ধ থাকবে।

## যাচাই
- সব `assets/js/*.js` এবং `admin/*.js` ফাইলের `node --check` সফল।
- `npm run build` সফল; `dist/` পুনরায় তৈরি হয়েছে।
- Browser-based visual test এই পরিবেশে চালানো হয়নি; deploy-এর পরে desktop ও mobile-এ যাচাই করা উচিত।
