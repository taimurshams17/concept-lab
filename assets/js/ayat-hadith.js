/* Daily Qur'an ayah / authentic hadith card for ConceptLab.
 * Full Qur'an text + Bengali meaning are requested from AlQuran Cloud at runtime.
 * The local fallback keeps the homepage useful when an API is unavailable.
 */
(function () {
  'use strict';
  var STORAGE_KEY = 'cl_revelation_seen_v1';
  var LAST_KIND_KEY = 'cl_revelation_last_kind_v1';
  var current = null;
  var remoteReady = false;
  var library = [];
  var fallback = [
    {id:'q:96:1',kind:'ayah',arabic:'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',meaning:'পড়ুন আপনার প্রতিপালকের নামে, যিনি সৃষ্টি করেছেন।',ref:'সূরা আল-আলাক, ৯৬:১',topic:'ইলম ও শিক্ষা'},
    {id:'q:96:2',kind:'ayah',arabic:'خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ',meaning:'তিনি মানুষকে সৃষ্টি করেছেন জমাটবদ্ধ বস্তু থেকে।',ref:'সূরা আল-আলাক, ৯৬:২',topic:'সৃষ্টি ও জ্ঞান'},
    {id:'q:96:3',kind:'ayah',arabic:'اقْرَأْ وَرَبُّكَ الْأَكْرَمُ',meaning:'পড়ুন; আর আপনার প্রতিপালক মহামহিমান্বিত।',ref:'সূরা আল-আলাক, ৯৬:৩',topic:'ইলম ও শিক্ষা'},
    {id:'q:96:4',kind:'ayah',arabic:'الَّذِي عَلَّمَ بِالْقَلَمِ',meaning:'যিনি কলমের সাহায্যে শিক্ষা দিয়েছেন।',ref:'সূরা আল-আলাক, ৯৬:৪',topic:'লেখা ও শিক্ষা'},
    {id:'q:96:5',kind:'ayah',arabic:'عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ',meaning:'মানুষকে তিনি শিখিয়েছেন, যা সে জানত না।',ref:'সূরা আল-আলাক, ৯৬:৫',topic:'ইলম ও শিক্ষা'},
    {id:'q:20:114',kind:'ayah',arabic:'رَبِّ زِدْنِي عِلْمًا',meaning:'হে আমার প্রতিপালক, আমার জ্ঞান বৃদ্ধি করুন।',ref:'সূরা ত্বা-হা, ২০:১১৪',topic:'জ্ঞান'},
    {id:'q:58:11',kind:'ayah',arabic:'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ',meaning:'তোমাদের মধ্যে যারা ঈমান এনেছে এবং যাদের জ্ঞান দান করা হয়েছে, আল্লাহ তাদের মর্যাদা উন্নত করেন।',ref:'সূরা আল-মুজাদালাহ, ৫৮:১১',topic:'জ্ঞান ও মর্যাদা'},
    {id:'q:39:9',kind:'ayah',arabic:'قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ',meaning:'বলুন, যারা জানে আর যারা জানে না—তারা কি সমান?',ref:'সূরা আয-যুমার, ৩৯:৯',topic:'জ্ঞান'},
    {id:'q:17:36',kind:'ayah',arabic:'وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ ۚ إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَٰئِكَ كَانَ عَنْهُ مَسْئُولًا',meaning:'যে বিষয়ে তোমার নিশ্চিত জ্ঞান নেই, তার অনুসরণ করো না। কান, চোখ ও অন্তর—এসবের প্রত্যেকটি সম্পর্কে জিজ্ঞাসা করা হবে।',ref:'সূরা আল-ইসরা, ১৭:৩৬',topic:'যাচাই ও দায়িত্ব'},
    {id:'q:16:90',kind:'ayah',arabic:'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ',meaning:'আল্লাহ ন্যায়বিচার, সদাচরণ ও আত্মীয়কে দানের নির্দেশ দেন; আর অশ্লীলতা, মন্দ কাজ ও সীমালঙ্ঘন নিষেধ করেন।',ref:'সূরা আন-নাহল, ১৬:৯০',topic:'নৈতিকতা ও সমাজ'},
    {id:'q:4:135',kind:'ayah',arabic:'يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ شُهَدَاءَ لِلَّهِ وَلَوْ عَلَىٰ أَنفُسِكُمْ',meaning:'হে মুমিনগণ, ন্যায়ের ওপর দৃঢ়ভাবে প্রতিষ্ঠিত থাকো এবং আল্লাহর জন্য সাক্ষ্য দাও—তা নিজের বিরুদ্ধেও হলেও।',ref:'সূরা আন-নিসা, ৪:১৩৫',topic:'ন্যায়বিচার'},
    {id:'q:5:8',kind:'ayah',arabic:'اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَىٰ ۖ وَاتَّقُوا اللَّهَ',meaning:'ন্যায়বিচার করো; সেটিই তাকওয়ার অধিক নিকটবর্তী। আল্লাহকে ভয় করো।',ref:'সূরা আল-মায়িদাহ, ৫:৮',topic:'ন্যায় ও নিরপেক্ষতা'},
    {id:'q:5:2',kind:'ayah',arabic:'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ',meaning:'সৎকর্ম ও তাকওয়ার কাজে একে অন্যকে সহযোগিতা করো; পাপ ও সীমালঙ্ঘনের কাজে সহযোগিতা করো না।',ref:'সূরা আল-মায়িদাহ, ৫:২',topic:'সহযোগিতা'},
    {id:'q:49:13',kind:'ayah',arabic:'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا',meaning:'হে মানুষ, আমি তোমাদের এক পুরুষ ও এক নারী থেকে সৃষ্টি করেছি এবং বিভিন্ন জাতি ও গোত্র করেছি, যাতে তোমরা পরস্পর পরিচিত হতে পারো।',ref:'সূরা আল-হুজুরাত, ৪৯:১৩',topic:'সমাজ ও পারস্পরিক পরিচয়'},
    {id:'q:3:159',kind:'ayah',arabic:'فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ ۖ فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الْأَمْرِ',meaning:'আল্লাহর অনুগ্রহে আপনি তাদের প্রতি কোমল হয়েছেন। কঠোর হলে তারা দূরে সরে যেত। তাই তাদের ক্ষমা করুন, তাদের জন্য ক্ষমা প্রার্থনা করুন এবং কাজে তাদের সঙ্গে পরামর্শ করুন।',ref:'সূরা আলে ইমরান, ৩:১৫৯',topic:'নেতৃত্ব ও পরামর্শ'},
    {id:'q:42:38',kind:'ayah',arabic:'وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ',meaning:'তাদের পারস্পরিক কাজকর্ম পরামর্শের ভিত্তিতে সম্পন্ন হয়।',ref:'সূরা আশ-শূরা, ৪২:৩৮',topic:'পরামর্শ ও দলগত কাজ'},
    {id:'q:2:153',kind:'ayah',arabic:'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',meaning:'হে মুমিনগণ, ধৈর্য ও সালাতের মাধ্যমে সাহায্য চাও। নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সঙ্গে আছেন।',ref:'সূরা আল-বাকারা, ২:১৫৩',topic:'ধৈর্য'},
    {id:'q:94:5',kind:'ayah',arabic:'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',meaning:'নিশ্চয়ই কষ্টের সঙ্গে স্বস্তি রয়েছে।',ref:'সূরা আশ-শারহ, ৯৪:৫',topic:'আশা ও অধ্যবসায়'},
    {id:'q:94:6',kind:'ayah',arabic:'إِنَّ مَعَ الْعُسْرِ يُسْرًا',meaning:'নিশ্চয়ই কষ্টের সঙ্গে স্বস্তি রয়েছে।',ref:'সূরা আশ-শারহ, ৯৪:৬',topic:'আশা ও অধ্যবসায়'},
    {id:'q:29:69',kind:'ayah',arabic:'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ',meaning:'যারা আমার পথে সাধনা ও প্রচেষ্টা করে, আমি অবশ্যই তাদের আমার পথসমূহে পরিচালিত করব। নিশ্চয়ই আল্লাহ সৎকর্মশীলদের সঙ্গে আছেন।',ref:'সূরা আল-আনকাবুত, ২৯:৬৯',topic:'সৎ প্রচেষ্টা ও অধ্যবসায়'},
    {id:'q:22:78',kind:'ayah',arabic:'وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ',meaning:'আল্লাহর পথে যথাযথ প্রচেষ্টা করো।',ref:'সূরা আল-হাজ্জ, ২২:৭৮',topic:'আত্মশুদ্ধি ও প্রচেষ্টা'},
    {id:'q:3:134',kind:'ayah',arabic:'وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ',meaning:'যারা রাগ সংবরণ করে এবং মানুষকে ক্ষমা করে—আল্লাহ সৎকর্মশীলদের ভালোবাসেন।',ref:'সূরা আলে ইমরান, ৩:১৩৪',topic:'আত্মসংযম ও ক্ষমা'},
    {id:'q:49:10',kind:'ayah',arabic:'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ',meaning:'মুমিনরা পরস্পর ভাই ভাই। তাই তোমাদের দুই ভাইয়ের মধ্যে মীমাংসা করে দাও।',ref:'সূরা আল-হুজুরাত, ৪৯:১০',topic:'সম্প্রীতি ও মীমাংসা'},
    {id:'q:49:11',kind:'ayah',arabic:'لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ عَسَىٰ أَن يَكُونُوا خَيْرًا مِّنْهُمْ',meaning:'কোনো সম্প্রদায় যেন অন্য সম্প্রদায়কে উপহাস না করে; হতে পারে তারা তাদের চেয়ে উত্তম।',ref:'সূরা আল-হুজুরাত, ৪৯:১১',topic:'সম্মান ও সহমর্মিতা'},
    {id:'q:49:12',kind:'ayah',arabic:'اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ إِنَّ بَعْضَ الظَّنِّ إِثْمٌ ۖ وَلَا تَجَسَّسُوا وَلَا يَغْتَب بَّعْضُكُم بَعْضًا',meaning:'অনেক অনুমান থেকে বেঁচে থাকো—কিছু অনুমান পাপ। একে অন্যের গোপন বিষয় খোঁজো না এবং পরনিন্দা করো না।',ref:'সূরা আল-হুজুরাত, ৪৯:১২',topic:'সামাজিক শিষ্টাচার'},
    {id:'q:2:83',kind:'ayah',arabic:'وَقُولُوا لِلنَّاسِ حُسْنًا',meaning:'মানুষের সঙ্গে সুন্দর ও ভালো কথা বলো।',ref:'সূরা আল-বাকারা, ২:৮৩',topic:'সুন্দর আচরণ'},
    {id:'q:33:70',kind:'ayah',arabic:'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا',meaning:'হে মুমিনগণ, আল্লাহকে ভয় করো এবং সঠিক ও ন্যায়সংগত কথা বলো।',ref:'সূরা আল-আহযাব, ৩৩:৭০',topic:'সত্য ও দায়িত্বশীল কথা'},
    {id:'q:4:58',kind:'ayah',arabic:'إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ',meaning:'আল্লাহ তোমাদের আমানত তার হকদারের কাছে পৌঁছে দিতে এবং মানুষের মধ্যে বিচার করলে ন্যায়ের সঙ্গে বিচার করতে নির্দেশ দেন।',ref:'সূরা আন-নিসা, ৪:৫৮',topic:'আমানত ও ন্যায়বিচার'},
    {id:'q:16:125',kind:'ayah',arabic:'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ',meaning:'প্রজ্ঞা ও উত্তম উপদেশের মাধ্যমে তোমার প্রতিপালকের পথে আহ্বান করো।',ref:'সূরা আন-নাহল, ১৬:১২৫',topic:'প্রজ্ঞা ও সুন্দর উপদেশ'},
    {id:'q:41:34',kind:'ayah',arabic:'ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ فَإِذَا الَّذِي بَيْنَكَ وَبَيْنَهُ عَدَاوَةٌ كَأَنَّهُ وَلِيٌّ حَمِيمٌ',meaning:'মন্দকে এমন পন্থায় প্রতিহত করো যা উত্তম; তখন যার সঙ্গে শত্রুতা আছে, সে ঘনিষ্ঠ বন্ধুর মতো হয়ে যেতে পারে।',ref:'সূরা ফুসসিলাত, ৪১:৩৪',topic:'সংঘাত নিরসন'},
    {id:'q:2:195',kind:'ayah',arabic:'وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ',meaning:'সৎকর্ম করো; নিশ্চয়ই আল্লাহ সৎকর্মশীলদের ভালোবাসেন।',ref:'সূরা আল-বাকারা, ২:১৯৫',topic:'সৎকর্ম'},
    {id:'q:2:286',kind:'ayah',arabic:'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',meaning:'আল্লাহ কাউকে তার সাধ্যের বাইরে দায়িত্ব দেন না।',ref:'সূরা আল-বাকারা, ২:২৮৬',topic:'সক্ষমতা ও ধৈর্য'},
    {id:'q:2:269',kind:'ayah',arabic:'وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا',meaning:'যাকে প্রজ্ঞা দান করা হয়েছে, তাকে অবশ্যই প্রচুর কল্যাণ দান করা হয়েছে।',ref:'সূরা আল-বাকারা, ২:২৬৯',topic:'প্রজ্ঞা'},
    {id:'q:18:109',kind:'ayah',arabic:'قُل لَّوْ كَانَ الْبَحْرُ مِدَادًا لِّكَلِمَاتِ رَبِّي لَنَفِدَ الْبَحْرُ قَبْلَ أَن تَنفَدَ كَلِمَاتُ رَبِّي',meaning:'বলুন, আমার প্রতিপালকের বাণী লেখার কালি হিসেবে সমুদ্র ব্যবহৃত হলেও তাঁর বাণী শেষ হওয়ার আগেই সমুদ্র নিঃশেষ হয়ে যাবে।',ref:'সূরা আল-কাহফ, ১৮:১০৯',topic:'জ্ঞান ও সৃষ্টির ব্যাপ্তি'},
    {id:'q:31:27',kind:'ayah',arabic:'وَلَوْ أَنَّمَا فِي الْأَرْضِ مِن شَجَرَةٍ أَقْلَامٌ وَالْبَحْرُ يَمُدُّهُ مِن بَعْدِهِ سَبْعَةُ أَبْحُرٍ مَّا نَفِدَتْ كَلِمَاتُ اللَّهِ',meaning:'পৃথিবীর সব গাছ কলম হলেও এবং সমুদ্রের সঙ্গে আরও সাত সমুদ্র কালি হিসেবে যোগ হলেও আল্লাহর বাণী শেষ হবে না।',ref:'সূরা লুকমান, ৩১:২৭',topic:'জ্ঞান ও সৃষ্টির ব্যাপ্তি'},
    {id:'q:35:28',kind:'ayah',arabic:'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',meaning:'আল্লাহর বান্দাদের মধ্যে জ্ঞানীরাই তাঁকে যথার্থভাবে ভয় করে।',ref:'সূরা ফাতির, ৩৫:২৮',topic:'জ্ঞান ও বিনয়'},
    {id:'q:16:43',kind:'ayah',arabic:'فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ',meaning:'তোমরা না জানলে জ্ঞানীদের জিজ্ঞাসা করো।',ref:'সূরা আন-নাহল, ১৬:৪৩',topic:'প্রশ্ন ও জ্ঞান অর্জন'},
    {id:'q:53:39',kind:'ayah',arabic:'وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ',meaning:'মানুষের জন্য তাই রয়েছে, যার জন্য সে চেষ্টা করেছে।',ref:'সূরা আন-নাজম, ৫৩:৩৯',topic:'পরিশ্রম ও অধ্যবসায়'},
    {id:'q:13:11',kind:'ayah',arabic:'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ',meaning:'কোনো জাতি নিজেদের অবস্থা পরিবর্তন না করা পর্যন্ত আল্লাহ তাদের অবস্থা পরিবর্তন করেন না।',ref:'সূরা আর-রা‘দ, ১৩:১১',topic:'আত্মোন্নয়ন'},
    {id:'q:17:23',kind:'ayah',arabic:'وَبِالْوَالِدَيْنِ إِحْسَانًا',meaning:'পিতা-মাতার সঙ্গে সদ্ব্যবহার করো।',ref:'সূরা আল-ইসরা, ১৭:২৩',topic:'পরিবার ও দায়িত্ব'},
    {id:'q:4:36',kind:'ayah',arabic:'وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا ۖ وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينِ وَالْجَارِ ذِي الْقُرْبَىٰ وَالْجَارِ الْجُنُبِ',meaning:'পিতা-মাতা, আত্মীয়স্বজন, এতিম, অভাবগ্রস্ত, নিকট ও দূরের প্রতিবেশীসহ মানুষের প্রতি সদাচরণ করো।',ref:'সূরা আন-নিসা, ৪:৩৬',topic:'সমাজ ও সহমর্মিতা'},
    {id:'q:8:46',kind:'ayah',arabic:'وَلَا تَنَازَعُوا فَتَفْشَلُوا وَتَذْهَبَ رِيحُكُمْ ۖ وَاصْبِرُوا',meaning:'পরস্পর বিবাদে লিপ্ত হয়ো না, তাহলে সাহস হারাবে ও শক্তি ক্ষয় হবে। ধৈর্য ধরো।',ref:'সূরা আল-আনফাল, ৮:৪৬',topic:'দলগত কাজ ও ধৈর্য'},
    {id:'q:2:148',kind:'ayah',arabic:'فَاسْتَبِقُوا الْخَيْرَاتِ',meaning:'তোমরা সৎকর্মে অগ্রণী হও।',ref:'সূরা আল-বাকারা, ২:১৪৮',topic:'সৎকর্মে অগ্রগামী হওয়া'},
    {id:'q:61:2',kind:'ayah',arabic:'يَا أَيُّهَا الَّذِينَ آمَنُوا لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ',meaning:'হে মুমিনগণ, তোমরা যা করো না, তা কেন বলো?',ref:'সূরা আস-সাফ, ৬১:২',topic:'কথা ও কাজের সামঞ্জস্য'},
    {id:'q:103:3',kind:'ayah',arabic:'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',meaning:'তারা ছাড়া, যারা ঈমান আনে, সৎকর্ম করে এবং পরস্পরকে সত্য ও ধৈর্যের উপদেশ দেয়।',ref:'সূরা আল-আসর, ১০৩:৩',topic:'সত্য, সৎকর্ম ও ধৈর্য'}
  ];

  /* Some offline fallback lines are intentionally short ayah excerpts rather than complete long verses. Label them explicitly so they are not mistaken for the full ayah text. Online API items contain the full verse. */
  var excerptKeys = {
    'q:58:11':1,'q:39:9':1,'q:16:90':1,'q:4:135':1,'q:5:8':1,'q:5:2':1,'q:49:13':1,'q:3:159':1,'q:42:38':1,
    'q:22:78':1,'q:3:134':1,'q:49:10':1,'q:49:11':1,'q:49:12':1,'q:2:83':1,'q:33:70':1,'q:4:58':1,'q:16:125':1,
    'q:41:34':1,'q:2:195':1,'q:2:286':1,'q:2:269':1,'q:18:109':1,'q:31:27':1,'q:35:28':1,'q:16:43':1,'q:13:11':1,
    'q:17:23':1,'q:4:36':1,'q:8:46':1,'q:2:148':1
  };
  fallback.forEach(function (item) { if (excerptKeys[item.id]) item.excerpt = true; });

  /* Short, well-known narrations from canonical collections. Hadith numbers follow common printed/Sunnah.com numbering; editions can differ. */
  var hadiths = [
    {id:'h:bukhari:1',kind:'hadith',arabic:'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',meaning:'কাজের প্রতিদান নিয়তের ওপর নির্ভরশীল; প্রত্যেক ব্যক্তি তাই পাবে, যা সে নিয়ত করেছে।',ref:'সহিহ আল-বুখারি, হাদিস ১',topic:'নিয়ত ও সততা'},
    {id:'h:bukhari:71',kind:'hadith',arabic:'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ',meaning:'আল্লাহ যার কল্যাণ চান, তাকে দ্বীনের সঠিক বুঝ দান করেন।',ref:'সহিহ আল-বুখারি, হাদিস ৭১',topic:'জ্ঞান ও বোঝাপড়া'},
    {id:'h:bukhari:5027',kind:'hadith',arabic:'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',meaning:'তোমাদের মধ্যে উত্তম সে, যে কুরআন শেখে এবং অন্যকে শেখায়।',ref:'সহিহ আল-বুখারি, হাদিস ৫০২৭',topic:'শেখা ও শেখানো'},
    {id:'h:muslim:2699',kind:'hadith',arabic:'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',meaning:'যে ব্যক্তি জ্ঞান অর্জনের পথে চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।',ref:'সহিহ মুসলিম, হাদিস ২৬৯৯',topic:'ইলম ও অধ্যবসায়'},
    {id:'h:bukhari:3461',kind:'hadith',arabic:'بَلِّغُوا عَنِّي وَلَوْ آيَةً',meaning:'আমার পক্ষ থেকে একটি আয়াত হলেও পৌঁছে দাও।',ref:'সহিহ আল-বুখারি, হাদিস ৩৪৬১',topic:'জ্ঞান ভাগ করে নেওয়া'},
    {id:'h:bukhari:6018',kind:'hadith',arabic:'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',meaning:'যে আল্লাহ ও শেষ দিবসে বিশ্বাস করে, সে যেন ভালো কথা বলে অথবা নীরব থাকে।',ref:'সহিহ আল-বুখারি, হাদিস ৬০১৮',topic:'কথার আদব'},
    {id:'h:bukhari:13',kind:'hadith',arabic:'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّىٰ يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',meaning:'তোমাদের কেউ পূর্ণ মুমিন হতে পারে না, যতক্ষণ না সে নিজের জন্য যা ভালোবাসে, ভাইয়ের জন্যও তা ভালোবাসে।',ref:'সহিহ আল-বুখারি, হাদিস ১৩',topic:'সহমর্মিতা'},
    {id:'h:bukhari:10',kind:'hadith',arabic:'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',meaning:'প্রকৃত মুসলিম সে, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।',ref:'সহিহ আল-বুখারি, হাদিস ১০',topic:'নিরাপত্তা ও আচরণ'},
    {id:'h:muslim:55',kind:'hadith',arabic:'الدِّينُ النَّصِيحَةُ',meaning:'দ্বীন হলো আন্তরিক কল্যাণকামিতা ও সৎ উপদেশ।',ref:'সহিহ মুসলিম, হাদিস ৫৫',topic:'সৎ উপদেশ'},
    {id:'h:muslim:1009',kind:'hadith',arabic:'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',meaning:'ভালো কথা বলাও সদকা।',ref:'সহিহ মুসলিম, হাদিস ১০০৯',topic:'সুন্দর কথা'},
    {id:'h:muslim:2586',kind:'hadith',arabic:'مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ',meaning:'পারস্পরিক ভালোবাসা, দয়া ও সহমর্মিতায় মুমিনদের উদাহরণ একটি দেহের মতো।',ref:'সহিহ মুসলিম, হাদিস ২৫৮৬',topic:'সমাজ ও সহমর্মিতা'},
    {id:'h:muslim:2588',kind:'hadith',arabic:'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',meaning:'সদকা সম্পদ কমায় না।',ref:'সহিহ মুসলিম, হাদিস ২৫৮৮',topic:'দান ও উদারতা'},
    {id:'h:muslim:223',kind:'hadith',arabic:'الطُّهُورُ شَطْرُ الْإِيمَانِ',meaning:'পবিত্রতা ঈমানের অর্ধেক।',ref:'সহিহ মুসলিম, হাদিস ২২৩',topic:'পরিচ্ছন্নতা'},
    {id:'h:bukhari:69',kind:'hadith',arabic:'يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا',meaning:'সহজ করো, কঠিন করো না; সুসংবাদ দাও, বিমুখ করো না।',ref:'সহিহ আল-বুখারি, হাদিস ৬৯',topic:'শিক্ষাদান ও সদাচরণ'},
    {id:'h:bukhari:6019',kind:'hadith',arabic:'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ جَارَهُ',meaning:'যে আল্লাহ ও শেষ দিবসে বিশ্বাস করে, সে যেন তার প্রতিবেশীকে সম্মান করে।',ref:'সহিহ আল-বুখারি, হাদিস ৬০১৯',topic:'প্রতিবেশীর অধিকার'},
    {id:'h:bukhari:893',kind:'hadith',arabic:'كُلُّكُمْ رَاعٍ وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ',meaning:'তোমাদের প্রত্যেকেই দায়িত্বশীল, এবং প্রত্যেককে তার দায়িত্ব সম্পর্কে জিজ্ঞাসা করা হবে।',ref:'সহিহ আল-বুখারি, হাদিস ৮৯৩',topic:'দায়িত্ব ও নেতৃত্ব'},
    {id:'h:bukhari:2443',kind:'hadith',arabic:'انْصُرْ أَخَاكَ ظَالِمًا أَوْ مَظْلُومًا',meaning:'তোমার ভাইকে সাহায্য করো—সে জুলুমের শিকার হোক বা জুলুম করুক; জালিমকে সাহায্য করার অর্থ তাকে জুলুম থেকে বিরত রাখা।',ref:'সহিহ আল-বুখারি, হাদিস ২৪৪৩',topic:'ন্যায় ও অন্যায় প্রতিরোধ'},
    {id:'h:muslim:1955',kind:'hadith',arabic:'إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَىٰ كُلِّ شَيْءٍ',meaning:'আল্লাহ প্রতিটি বিষয়ে উত্তম আচরণ ও উৎকর্ষ অবলম্বন করার নির্দেশ দিয়েছেন।',ref:'সহিহ মুসলিম, হাদিস ১৯৫৫',topic:'কাজে উৎকর্ষ'},
    {id:'h:muslim:101',kind:'hadith',arabic:'مَنْ غَشَّنَا فَلَيْسَ مِنَّا',meaning:'যে প্রতারণা করে, সে আমাদের আদর্শের অনুসারী নয়।',ref:'সহিহ মুসলিম, হাদিস ১০১',topic:'সততা ও নৈতিকতা'}
  ];

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function loadSeen() {
    try { var v = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function saveSeen(seen) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seen.slice(-12000))); } catch (e) {}
  }
  function poolNow() { return library.length ? library : fallback.concat(hadiths); }
  function chooseNext() {
    var pool = poolNow();
    if (!pool.length) return null;
    var seen = loadSeen(), seenMap = Object.create(null);
    seen.forEach(function (id) { seenMap[id] = true; });
    var candidates = pool.filter(function (item) { return !seenMap[item.id]; });
    /* Balance the feed: alternate ayah and hadith whenever unseen items of both types remain. */
    var lastKind = '';
    try { lastKind = localStorage.getItem(LAST_KIND_KEY) || ''; } catch (e) {}
    var wantedKind = lastKind === 'hadith' ? 'ayah' : 'hadith';
    var preferred = candidates.filter(function (item) { return item.kind === wantedKind; });
    if (preferred.length) candidates = preferred;
    if (!candidates.length) {
      seen = current ? [current.id] : [];
      saveSeen(seen);
      candidates = pool.filter(function (item) { return !current || item.id !== current.id; });
      if (!candidates.length) candidates = pool;
    }
    var next = candidates[Math.floor(Math.random() * candidates.length)];
    current = next;
    try { localStorage.setItem(LAST_KIND_KEY, next.kind); } catch (e) {}
    seen.push(next.id);
    saveSeen(seen);
    return next;
  }
  function numberBangla(value) {
    return String(value).replace(/[0-9]/g, function (n) { return '০১২৩৪৫৬৭৮৯'[Number(n)]; });
  }
  function getPoolLabel() {
    var size = poolNow().length;
    try { size = size.toLocaleString('bn-BD'); } catch (e) { size = numberBangla(size); }
    return size + 'টি নির্বাচিত আয়াত/হাদিস';
  }
  function renderCard(item) {
    if (!item) return '<div class="ah-loading">আয়াত/হাদিস লোড হচ্ছে…</div>';
    var isHadith = item.kind === 'hadith';
    var kind = isHadith ? 'হাদিস' : (item.excerpt ? 'কুরআনের আয়াতের অংশ' : 'কুরআনের আয়াত');
    var meaningHeading = isHadith ? 'বাংলা অর্থ' : (item.remote ? 'বাংলা অনুবাদ' : 'ভাবার্থ');
    return '<div class="ah-card-top"><span class="ah-kind">' + kind + '</span><span class="ah-topic">' + escapeHTML(item.topic || (isHadith ? 'হাদিস থেকে শিক্ষা' : 'কুরআনের বাণী')) + '</span></div>' +
      '<div class="ah-arabic" dir="rtl" lang="ar">' + escapeHTML(item.arabic) + '</div>' +
      '<div class="ah-meaning"><span>' + meaningHeading + '</span><p>' + escapeHTML(item.meaning) + '</p></div>' +
      '<div class="ah-card-footer"><div class="ah-reference"><span>সূত্র</span><strong>' + escapeHTML(item.ref) + '</strong></div><button class="btn pri ah-next" type="button" data-revelation-next>আরেকটি দেখুন <span aria-hidden="true">→</span></button></div>' +
      '<div class="ah-footnote">' + (isHadith ? 'প্রসিদ্ধ হাদিসগ্রন্থ থেকে সংক্ষিপ্ত উদ্ধৃতি। নম্বর প্রকাশিত প্রচলিত নম্বরায়ন অনুযায়ী; সংস্করণভেদে ভিন্ন হতে পারে।' : (item.remote ? 'আরবি পাঠ ও বাংলা অনুবাদ: AlQuran Cloud API · বাংলা অনুবাদ: মুহিউদ্দীন খান।' : 'বাংলা ভাবার্থ সহজবোধ্যতার জন্য সংক্ষেপে লেখা হয়েছে; পূর্ণ তাফসিরের বিকল্প নয়।')) + '</div>';
  }
  function updateCard() {
    var node = document.getElementById('dailyRevelationCard');
    if (!node || !current) return;
    node.innerHTML = renderCard(current);
    var count = document.getElementById('dailyRevelationCount');
    if (count) count.textContent = remoteReady ? getPoolLabel() : (getPoolLabel() + ' · পূর্ণ অনলাইন ভাণ্ডার লোড হলে সংখ্যা বাড়বে');
  }
  function renderSection(section) {
    section = section || {};
    if (!current) chooseNext();
    return '<section class="ayat-hadith-section" aria-labelledby="homeAyatHadithTitle"><div class="w"><div class="c sh2 ah-section-head">' +
      (section.pill ? '<span class="pill"><i></i>' + escapeHTML(section.pill) + '</span>' : '') +
      '<h2 id="homeAyatHadithTitle">' + escapeHTML(section.h || 'আয়াত/হাদিস') + '</h2>' +
      (section.p ? '<p>' + escapeHTML(section.p) + '</p>' : '') +
      '</div><article id="dailyRevelationCard" class="card ah-card" aria-live="polite" aria-atomic="true">' + renderCard(current) +
      '</article><div id="dailyRevelationCount" class="ah-count" aria-live="polite">' + escapeHTML(remoteReady ? getPoolLabel() : (getPoolLabel() + ' · পূর্ণ অনলাইন ভাণ্ডার লোড হলে সংখ্যা বাড়বে')) + '</div></div></section>';
  }
  function addTopic(meaning) {
    var t = String(meaning || '').toLowerCase();
    var tests = [
      [/জ্ঞান|শিক্ষা|শিখ|কলম|পড়|পাঠ|জান|জ্ঞা/, 'ইলম ও শিক্ষা'],
      [/ন্যায়|বিচার|ইনসাফ|আমানত|সাক্ষ্য/, 'ন্যায় ও দায়িত্ব'],
      [/ধৈর্য|সবর|চেষ্টা|প্রচেষ্টা|পরিশ্রম|সৎকর্ম|সৎ কাজ/, 'অধ্যবসায় ও সৎকর্ম'],
      [/দয়া|করুণা|ক্ষমা|সহমর্মিতা|প্রতিবেশী|এতিম|দরিদ্র|দান/, 'সহমর্মিতা ও সমাজ'],
      [/মানুষ|সম্প্রদায়|সমাজ|পরামর্শ|ভ্রাতৃত্ব|মঙ্গল|অঙ্গীকার/, 'সমাজ ও নৈতিকতা'],
      [/সত্য|মিথ্যা|কথা|জিহ্বা|উপহাস|পরনিন্দা|অন্যায়/, 'আচরণ ও সততা'],
      [/আকাশ|পৃথিবী|সৃষ্টি|চিন্তা|বিবেচনা|শুন|দেখ|হৃদয়/, 'সৃষ্টি নিয়ে চিন্তা']
    ];
    for (var i = 0; i < tests.length; i++) if (tests[i][0].test(t)) return tests[i][1];
    return 'কুরআনের বাণী';
  }
  function loadFullQuran() {
    if (!window.fetch) return;
    var base = 'https://api.alquran.cloud/v1/quran/';
    Promise.all([
      fetch(base + 'quran-uthmani', {cache:'force-cache'}).then(function (r) { if (!r.ok) throw new Error('Arabic Quran feed unavailable'); return r.json(); }),
      fetch(base + 'bn.bengali', {cache:'force-cache'}).then(function (r) { if (!r.ok) throw new Error('Bengali translation feed unavailable'); return r.json(); })
    ]).then(function (responses) {
      var arabic = responses[0] && responses[0].data && responses[0].data.surahs;
      var bengali = responses[1] && responses[1].data && responses[1].data.surahs;
      if (!Array.isArray(arabic) || !Array.isArray(bengali)) throw new Error('Unexpected Quran API response');
      var arabicByNumber = Object.create(null), translatedByNumber = Object.create(null), all = [];
      arabic.forEach(function (surah) { (surah.ayahs || []).forEach(function (ayah) { arabicByNumber[ayah.number] = {ayah:ayah,surah:surah}; }); });
      bengali.forEach(function (surah) { (surah.ayahs || []).forEach(function (ayah) { translatedByNumber[ayah.number] = {ayah:ayah,surah:surah}; }); });
      Object.keys(arabicByNumber).forEach(function (key) {
        var ar = arabicByNumber[key], bn = translatedByNumber[key];
        if (!bn || !String(ar.ayah.text || '').trim() || !String(bn.ayah.text || '').trim()) return;
        var verseKey = String(ar.surah.number || ar.ayah.surah && ar.ayah.surah.number || '') + ':' + String(ar.ayah.numberInSurah || '');
        var meaning = String(bn.ayah.text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        all.push({
          id:'q:' + verseKey, kind:'ayah', arabic:String(ar.ayah.text).trim(), meaning:meaning,
          ref:'সূরা ' + String(ar.surah.englishName || ar.surah.name || ('নম্বর ' + ar.surah.number)) + ' (' + numberBangla(ar.surah.number) + '), আয়াত ' + numberBangla(ar.ayah.numberInSurah),
          topic:addTopic(meaning), remote:true
        });
      });
      if (all.length < 500) return;
      var keywordPattern = /জ্ঞান|শিক্ষা|শিখ|কলম|পড়|পাঠ|জ্ঞানী|ধৈর্য|সবর|ন্যায়|বিচার|ইনসাফ|আমানত|মানুষ|সম্প্রদায়|সমাজ|পরামর্শ|অঙ্গীকার|সৎকর্ম|সৎ কাজ|সদকা|দান|এতিম|দরিদ্র|প্রতিবেশী|ক্ষমা|করুণা|দয়া|শান্তি|সত্য|মিথ্যা|উপদেশ|কাজ|কর্ম|চেষ্টা|প্রচেষ্টা|পরিশ্রম|ঈমান|বিশ্বাস|কৃতজ্ঞ|অন্যায়|অপরাধ|উপহাস|অহংকার|অপচয়|পিতা|মাতা|শিশু|সৃষ্টি|আকাশ|পৃথিবী|চিন্তা|বিবেচনা|হৃদয়|কান|চোখ|সৎ|মঙ্গল|কল্যাণ|ধর্ম|পরিষ্কার|পবিত্র|দায়িত্ব|ন্যায়পরায়ণ|শ্রেষ্ঠ|গুণ|পাপ|পুণ্য|যিকির|প্রজ্ঞা|জিহাদ|আল্লাহর পথে|হেদায়েত|দায়িত্ব|সহযোগিতা|মুমিন|অঙ্গীকার|প্রতারণা|উত্তম|ভালো|ভাল|ঋণ|চুক্তি|লিখ|লেখ|সময়|সফল|সংশোধন|অভিভাবক|পরোপকার|সংযম|ক্রোধ|মীমাংসা|রহমত|অত্যাচার|সালাত|প্রার্থনা|সৎপথ|উপকারী|অবিচার|আলেম|কিতাব|আয়াত|আমল|অবাধ্য|সহযোগ|সুন্দর|অভিযোগ|প্রমাণ|উপলব্ধি|অভিজ্ঞতা|শপথ|ন্যায্য|সাম্য|উদার|অভ্যাস|আচরণ|বাণী|পরীক্ষা|অসহায়|সম্পদ|অর্থ|পরিবার|আত্মীয়|সাহায্য|সম্পর্ক|বন্ধু|শত্রু|বিরোধ|বিবাদ|সমঝোতা|অবদান|উদ্দেশ্য|নিয়ত|সুশৃঙ্খল|দুর্বল|শক্তি|সাধনা|সংগ্রাম/;
      var relevant = all.filter(function (item) { return keywordPattern.test(item.meaning); });
      var verses = relevant.length >= 500 ? relevant : all;
      library = verses.concat(hadiths);
      remoteReady = true;
      /* Keep this page's initial offline card from appearing again after the API pool has loaded. */
      if (!current || !current.remote) chooseNext();
      updateCard();
    }).catch(function () {
      remoteReady = false;
      /* Offline fallback is intentionally retained; do not block the homepage on third-party APIs. */
      updateCard();
    });
  }
  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest ? event.target.closest('[data-revelation-next]') : null;
    if (!button) return;
    event.preventDefault();
    chooseNext();
    updateCard();
  });
  window.CL_AH = { render: renderSection, next: function () { chooseNext(); updateCard(); }, count: function () { return poolNow().length; } };
  loadFullQuran();
})();
