(function(){
'use strict';
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))},app=$('#app');
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function clone(o){return JSON.parse(JSON.stringify(o))}
function ok(v){return v!==false&&v!=='0'&&v!=='false'&&v!==0}
function safeLink(l){l=String(l||'').trim();return /^(#\/|https?:\/\/|\/)/.test(l)?l:'#/'}
function labSubject(s){var v=String(s||'').trim().toLowerCase();if(/^(phy|physics|phys)$/.test(v)||/পদার্থবিজ্ঞান|পদার্থ/.test(v))return 'পদার্থবিজ্ঞান';if(/^(chem|chemistry)$/.test(v)||/রসায়ন|রসায়ন|chem/.test(v))return 'রসায়ন';if(/math|mathematics|higher|উচ্চতর গণিত|গণিত/.test(v))return 'উচ্চতর গণিত';return s||'অন্যান্য'}
var DEF=window.CL_DEF,DX={};(window.CL_TXT||[]).forEach(function(g){g[1].forEach(function(t){DX[t[0]]=t[2]})});
DX.rs_done='Done';DX.rs_now='In progress';DX.rs_next='Coming next';DX.nav_leaderboard='Leaderboard';
var D,S,SUB,C,L,CHL,HOME,GAMES,LABS,GAM,ST=[];
function X(k){var v=((D&&D.texts)||{})[k];return v==null||v===''?DX[k]:v}
var DROP_GAME_IDS={
 'formula-pair-cosmos':1,'edu-formula-pair-cosmos':1,'edu-flame-colour-detective':1,'edu-physics-unit-rush':1,
 'edu-physics-formula-sprint':1,'edu-chemistry-ion-challenge':1,'edu-math-concept-scramble':1,'edu-hsc-term-scramble':1,
 'edu-physics-odd-one':1,'edu-math-step-order':1,'edu-math-truth-arena':1,'edu-projectile-range-challenge':1,'edu-line-slope-challenge':1,
 'math-concept-scramble':1,'hsc-term-scramble':1
};
var GAME_ICON_BY_ID={
 "blitz":"⚡",
 "memory":"🧠",
 "tf":"✅",
 "scramble":"🔤",
 "balance":"⚖️",
 "cannon":"🎯",
 "slope":"✏️",
 "flame":"🔥",
 "physics-formula-sprint":"📝",
 "chemistry-ion-challenge":"🧪",
 "math-concept-scramble":"🧮",
 "physics-unit-rush":"🔢",
 "chem-reaction-race":"💥",
 "math-truth-arena":"📚",
 "hsc-term-scramble":"📜",
 "periodic-quest":"🧬",
 "mass-atlas":"🏋️",
 "element-sprint":"🏃",
 "trend-duel":"⚔️",
 "odd-one-phy":"🧲",
 "odd-one-chem":"🥽",
 "odd-one-math":"∑",
 "step-order-phy":"🪜",
 "step-order-chem":"🧤",
 "step-order-math":"🧩",
 "edu-chem-reaction-race":"🧯",
 "edu-chem-lab-sequence":"🧰"
};
var GAME_TITLE_BN={
 "blitz":"Quick Quiz Blitz",
 "memory":"Formula Memory",
 "tf":"True or False",
 "scramble":"Term Scramble",
 "balance":"Equation Balance",
 "cannon":"Projectile Target",
 "slope":"Slope Shot",
 "flame":"Flame Test Detective",
 "physics-formula-sprint":"Physics Formula Sprint",
 "chemistry-ion-challenge":"Ion Detective",
 "math-concept-scramble":"Math Concept Scramble",
 "physics-unit-rush":"Physics Unit Rush",
 "chem-reaction-race":"Chemical Reaction Race",
 "math-truth-arena":"Math Truth Arena",
 "hsc-term-scramble":"HSC Term Scramble",
 "periodic-quest":"Periodic Table Quest",
 "mass-atlas":"Mass Atlas",
 "element-sprint":"Element Sprint",
 "trend-duel":"Periodic Trends Duel",
 "odd-one-phy":"Physics Odd One Out",
 "odd-one-chem":"Chemistry Odd One Out",
 "odd-one-math":"Math Odd One Out",
 "step-order-phy":"Physics Step Order",
 "step-order-chem":"Chemistry Step Order",
 "step-order-math":"Math Step Order",
 "edu-chem-reaction-race":"Reaction Race",
 "edu-chem-lab-sequence":"Chemistry Lab Sequence",
 "chem-organic-conversion-map":"Organic Conversion Map",
 "chem-electron-configuration-challenge":"Electron Configuration Challenge",
 "chem-stoichiometry-game":"Stoichiometry Challenge",
 "virtual-lab-escape-room":"Virtual Lab Escape Room"
};
var GAME_ICON_FALLBACK=['🗝️','🪁','🛞','🪶','🪴','🪸','🪷','🦜','🦋','🦉','🪺','🪵','🪬','🪭','🪄','🪅','🪆','🪇','🪈','🪉','🪏','🪐','🫧','🫙','🫚','🫛','🫜','🫟','🧿','🪬','🪻','🪸','🦤','🦩','🦚','🦥','🦦','🦨','🦫','🦮','🪽','🪿','🪹','🪴','🪨'];
function gameIcon(g){return g&&(GAME_ICON_BY_ID[g.id]||g.icon)||'🎮'}
function gameTitle(g){return g&&(GAME_TITLE_BN[g.id]||g.t||g.title)||'গেম'}
function iconHue(key){var h=0;String(key||'concept').split('').forEach(function(c){h=(h*31+c.charCodeAt(0))%360});return 22+(h%310)}
var PHYSICS_UNIT_RUSH_MORE=[
 {q:'বলের মাত্রা কোনটি?',o:['MLT⁻²','ML²T⁻²','ML⁻¹T⁻²','MLT⁻¹'],a:0,e:'F = ma; তাই মাত্রা MLT⁻²।'},
 {q:'চাপের SI একক কী?',o:['নিউটন','পাস্কাল','জুল','ওয়াট'],a:1,e:'চাপ = বল/ক্ষেত্রফল; SI একক Pa বা N/m²।'},
 {q:'ঘনত্বের SI একক কোনটি?',o:['kg/m³','kg·m/s','N/m²','J/s'],a:0,e:'ঘনত্ব = ভর/আয়তন, তাই kg/m³।'},
 {q:'ঘাত (Impulse)-এর মাত্রা কোনটি?',o:['MLT⁻¹','MLT⁻²','ML²T⁻²','M⁰LT⁻¹'],a:0,e:'Impulse = বল × সময় = ভরবেগের পরিবর্তন।'},
 {q:'টর্কের SI একক কোনটি?',o:['N·m','N/m','kg/m³','W/s'],a:0,e:'টর্ক = বল × লম্ব দূরত্ব; একক N·m।'},
 {q:'স্প্রিংয়ে সঞ্চিত স্থিতিস্থাপক বিভবশক্তি কোনটি?',o:['kx','½kx²','mv','mgh²'],a:1,e:'স্প্রিং ধ্রুবক k এবং প্রসারণ x হলে U = ½kx²।'},
 {q:'বৃত্তাকার গতিতে কেন্দ্রমুখী ত্বরণ কোনটি?',o:['vr','v²/r','r/v²','ω/r'],a:1,e:'কেন্দ্রমুখী ত্বরণ a = v²/r।'},
 {q:'সমবেগে বৃত্তাকার গতিতে বেগ বদলায় কেন?',o:['শুধু মান বদলায়','দিক বদলায়','ভর বদলায়','সময় থেমে যায়'],a:1,e:'দ্রুতির মান ধ্রুব হলেও বেগের দিক ক্রমাগত পরিবর্তিত হয়।'},
 {q:'বেগ-সময় গ্রাফের ঢাল কী?',o:['সরণ','ত্বরণ','ভরবেগ','কাজ'],a:1,e:'বেগের সময়-অনুসারে পরিবর্তনের হার হলো ত্বরণ।'},
 {q:'সরণ-সময় গ্রাফের ঢাল কী নির্দেশ করে?',o:['বেগ','বল','ক্ষমতা','ভর'],a:0,e:'সরণ/সময়ের পরিবর্তনের হার বেগ।'},
 {q:'সমবেগে ত্বরণ কত?',o:['শূন্য','g','v/t সবসময়','অসীম'],a:0,e:'বেগের মান ও দিক ধ্রুব থাকলে ত্বরণ শূন্য।'},
 {q:'গতির তৃতীয় সমীকরণ কোনটি?',o:['v = u + at','s = vt','v² = u² + 2as','F = mv'],a:2,e:'ধ্রুব ত্বরণে v² = u² + 2as।'},
 {q:'প্রক্ষেপণের সর্বাধিক পাল্লা (একই উচ্চতায় পতন) আদর্শভাবে কোন কোণে?',o:['৩০°','৪৫°','৬০°','৯০°'],a:1,e:'বায়ুর বাধা উপেক্ষা করে একই উচ্চতায় নামলে ৪৫°-এ পাল্লা সর্বাধিক।'},
 {q:'সর্বোচ্চ বিন্দুতে প্রক্ষেপণের উল্লম্ব বেগ কত?',o:['শূন্য','সর্বাধিক','g','প্রাথমিক বেগের সমান'],a:0,e:'সর্বোচ্চ বিন্দুতে উল্লম্ব বেগের উপাংশ মুহূর্তের জন্য শূন্য।'},
 {q:'ভরবেগ সংরক্ষিত থাকে কখন?',o:['বাহ্যিক লব্ধি বল শূন্য হলে','ঘর্ষণ সর্বদা থাকলে','বেগ শূন্য হলেই','ভর পরিবর্তিত হলে'],a:0,e:'বিচ্ছিন্ন সিস্টেমে মোট বাহ্যিক বল শূন্য হলে মোট ভরবেগ সংরক্ষিত থাকে।'},
 {q:'নিউটনের তৃতীয় সূত্রে ক্রিয়া-প্রতিক্রিয়া বল—',o:['একই বস্তুর ওপর লাগে','ভিন্ন দুটি বস্তুর ওপর সমান ও বিপরীতভাবে লাগে','সবসময় বাতিল হয়','একটি বড় হয়'],a:1,e:'ক্রিয়া ও প্রতিক্রিয়া ভিন্ন বস্তুর ওপর কাজ করে।'},
 {q:'কাজ শূন্য হতে পারে কোন ক্ষেত্রে?',o:['বল সরণের লম্ব হলে','বল ও সরণ একই দিকে হলে','সরণ বলের দিকে হলে','শক্তি থাকলেই'],a:0,e:'W = Fs cosθ; θ = 90° হলে কাজ শূন্য।'},
 {q:'ঘর্ষণ সহগের একক কী?',o:['N','m/s','কোনো একক নেই','kg'],a:2,e:'ঘর্ষণ সহগ μ = ঘর্ষণ বল/লম্ব প্রতিক্রিয়া; দুটি বলের অনুপাত।'},
 {q:'পৃষ্ঠটানের SI একক কোনটি?',o:['N/m','N·m','Pa','kg/m³'],a:0,e:'পৃষ্ঠটান = বল/দৈর্ঘ্য; একক N/m।'},
 {q:'সান্দ্রতার গতিশীল সহগের SI একক কী?',o:['Pa·s','N/m','W','C'],a:0,e:'Dynamic viscosity-এর SI একক Pa·s।'},
 {q:'তরঙ্গের বেগ, কম্পাঙ্ক ও তরঙ্গদৈর্ঘ্যের সম্পর্ক কোনটি?',o:['v = fλ','v = f/λ','v = λ/f','v = f + λ'],a:0,e:'তরঙ্গের বেগ v = fλ।'},
 {q:'পর্যায়কাল T ও কম্পাঙ্ক f-এর সম্পর্ক কী?',o:['T = f','T = 1/f','T = f²','T = 2f'],a:1,e:'কম্পাঙ্ক f = 1/T, তাই T = 1/f।'},
 {q:'শব্দ চলাচলের জন্য কী প্রয়োজন?',o:['একটি মাধ্যম','শুধু শূন্যস্থান','শুধু আলো','চৌম্বক ক্ষেত্র'],a:0,e:'শব্দ যান্ত্রিক তরঙ্গ; চলতে পদার্থগত মাধ্যম লাগে।'},
 {q:'প্রতিসরাঙ্ক n-এর একটি সম্পর্ক কোনটি?',o:['n = c/v','n = v/c','n = cv','n = c + v'],a:0,e:'প্রতিসরাঙ্ক n = শূন্যস্থানে আলোর বেগ/মাধ্যমে আলোর বেগ।'},
 {q:'বিদ্যুৎ ক্ষমতার সূত্র কোনটি?',o:['P = VI','P = V/I','P = IR','P = Q/t²'],a:0,e:'বৈদ্যুতিক ক্ষমতা P = VI; ওহমের সূত্রে P = I²R = V²/R।'},
 {q:'সমান্তরাল সংযোগে প্রতিটি রোধের দুই প্রান্তে কী সমান থাকে?',o:['বিদ্যুৎ প্রবাহ','বিভব পার্থক্য','রোধ','ক্ষমতা'],a:1,e:'সমান্তরাল শাখাগুলো একই দুই নোডে যুক্ত, তাই ভোল্টেজ সমান।'},
 {q:'শ্রেণি সংযোগে প্রতিটি রোধে কোনটি সমান?',o:['বিদ্যুৎ প্রবাহ','বিভব পার্থক্য','রোধ','ক্ষমতা'],a:0,e:'একটি পথ থাকায় শ্রেণি বর্তনীতে একই প্রবাহ যায়।'},
 {q:'বৈদ্যুতিক আধানের SI একক কী?',o:['কুলম্ব','অ্যাম্পিয়ার','ভোল্ট','ফ্যারাড'],a:0,e:'আধানের একক কুলম্ব (C)।'},
 {q:'ধারকের ধারকত্বের SI একক কী?',o:['ফ্যারাড','ওয়েবার','টেসলা','হেনরি'],a:0,e:'Capacitance-এর SI একক ফ্যারাড (F)।'},
 {q:'চৌম্বক ফ্লাক্সের SI একক কোনটি?',o:['ওয়েবার','টেসলা','অ্যাম্পিয়ার','কুলম্ব'],a:0,e:'চৌম্বক ফ্লাক্সের একক ওয়েবার (Wb)।'},
 {q:'তাপের পরিমাণের সরল সূত্র কোনটি?',o:['Q = mcΔT','Q = m/cT','Q = mv','Q = P/t'],a:0,e:'অবস্থার পরিবর্তন না হলে Q = mcΔT।'},
 {q:'তাপগতীয় সমীকরণ PV = nRT-এ T কোন স্কেলে?',o:['সেলসিয়াস','কেলভিন','ফারেনহাইট','ডিগ্রি কোণ'],a:1,e:'আদর্শ গ্যাস সমীকরণে তাপমাত্রা পরম স্কেল কেলভিনে বসাতে হয়।'},
 {q:'মহাকর্ষীয় বিভবশক্তির নিকট-পৃথিবী পৃষ্ঠের সূত্র কোনটি?',o:['mgh','½mv²','F/a','mv'],a:0,e:'পৃষ্ঠের কাছাকাছি উচ্চতা h হলে U = mgh।'},
 {q:'যান্ত্রিক দক্ষতার সূত্র কোনটি?',o:['উপযোগী আউটপুট/ইনপুট × ১০০%','ইনপুট/আউটপুট','ভর × বেগ','বল/সময়'],a:0,e:'দক্ষতা = উপযোগী শক্তি-আউটপুট ÷ শক্তি-ইনপুট × ১০০%।'},
 {q:'বস্তুর ঘূর্ণন জড়তার SI একক কী?',o:['kg·m²','kg/m²','N/m','J/s'],a:0,e:'ঘূর্ণন জড়তা I = Σmr², তাই একক kg·m²।'},
 {q:'লেন্সের ক্ষমতার একক ডাইঅপ্টার হলে ফোকাল দৈর্ঘ্য কোন এককে নিতে হয়?',o:['মিটার','সেন্টিমিটার','কিলোমিটার','মিলিমিটার'],a:0,e:'P = 1/f; ফোকাল দৈর্ঘ্য মিটারে নিলে ক্ষমতা diopter-এ হয়।'},
 {q:'গোলীয় দর্পণের বক্রতার ব্যাসার্ধ R ও ফোকাল দৈর্ঘ্য f-এর সম্পর্ক কী?',o:['f = R/2','f = 2R','f = R²','f = 1/R²'],a:0,e:'প্যারাক্সিয়াল রশ্মির জন্য গোলীয় দর্পণে f = R/2।'},
 {q:'সমতাপীয় প্রক্রিয়ায় আদর্শ গ্যাসের কোন রাশি ধ্রুব?',o:['তাপমাত্রা','চাপ ও আয়তন দুটোই','ভরবেগ','তাপমাত্রা সবসময় বাড়ে'],a:0,e:'সমতাপীয় (isothermal) প্রক্রিয়ায় তাপমাত্রা ধ্রুব থাকে।'},
 {q:'অর্ধায়ু বলতে কী বোঝায়?',o:['নমুনার অর্ধেক নিউক্লিয়াস ক্ষয় হতে প্রয়োজনীয় সময়','সম্পূর্ণ ক্ষয়ের সময়','বেগ অর্ধেক হওয়ার সময়','তাপমাত্রা দ্বিগুণের সময়'],a:0,e:'একটি তেজস্ক্রিয় নমুনার নিউক্লিয়াসের সংখ্যা অর্ধেক হতে যে সময় লাগে সেটি অর্ধায়ু।'},
 {q:'ফোটনের শক্তির সম্পর্ক কোনটি?',o:['E = hf','E = h/f','E = mv','E = mc'],a:0,e:'ফোটনের শক্তি E = hf, যেখানে h প্ল্যাঙ্ক ধ্রুবক।'},
 {q:'দুটি সমান ও বিপরীত সমান্তরাল বলের যুগল কী সৃষ্টি করে?',o:['টর্ক','শুধু সরলরৈখিক ত্বরণ','শূন্য ভর','তরঙ্গদৈর্ঘ্য'],a:0,e:'বল-যুগল লব্ধি বল শূন্য হলেও একটি টর্ক সৃষ্টি করে।'}
];
var ION_CHALLENGE_MORE=[
 {q:'ধনায়ন (cation) কোন আধান বহন করে?',o:['ধনাত্মক','ঋণাত্মক','আধানহীন','পরিবর্তনশীল নিউট্রন আধান'],a:0,e:'ইলেকট্রন হারালে সাধারণত ধনাত্মক আয়ন তৈরি হয়।'},
 {q:'সালফেট আয়নের সংকেত কোনটি?',o:['SO₄²⁻','SO₃²⁻','S²⁻','HSO₃⁻'],a:0,e:'সালফেট হলো SO₄²⁻।'},
 {q:'অ্যামোনিয়াম আয়নের সংকেত কী?',o:['NH₄⁺','NO₃⁻','NH₂⁻','N³⁻'],a:0,e:'অ্যামোনিয়াম একটি বহুপারমাণবিক ধনায়ন: NH₄⁺।'},
 {q:'ক্লোরিন সাধারণত কোন আয়ন গঠন করে?',o:['Cl⁻','Cl⁺','Cl²⁺','Cl²⁻ সবসময়'],a:0,e:'একটি ইলেকট্রন গ্রহণ করে ক্লোরাইড Cl⁻ তৈরি হয়।'},
 {q:'আয়নের নিট আধান নির্ভর করে কোন পার্থক্যের ওপর?',o:['প্রোটন ও ইলেকট্রনের সংখ্যা','শুধু নিউট্রন সংখ্যা','শুধু ভর','শুধু নিউক্লিয়াসের ব্যাস'],a:0,e:'নিট আধান = প্রোটনের ধনাত্মক আধান ও ইলেকট্রনের ঋণাত্মক আধানের যোগফল।'},
 {q:'গ্রুপ ১-এর মৌল সাধারণত কী ধরনের আয়ন গঠন করে?',o:['+1','−1','+2','−2'],a:0,e:'ক্ষার ধাতুরা সাধারণত একটি ইলেকট্রন হারিয়ে +1 আয়ন হয়।'},
 {q:'গ্রুপ ১৭-এর হ্যালোজেন সাধারণত কী আয়ন গঠন করে?',o:['−1','+1','+2','−3'],a:0,e:'বহিঃস্ত স্তরে একটি ইলেকট্রন গ্রহণ করে সাধারণত −1 আয়ন গঠন করে।'},
 {q:'অ্যালুমিনিয়াম আয়নের সংকেত কী?',o:['Al³⁺','Al⁺','Al²⁻','Al³⁻'],a:0,e:'অ্যালুমিনিয়াম সাধারণত তিনটি ইলেকট্রন হারিয়ে Al³⁺ হয়।'},
 {q:'MgCl₂-এ ম্যাগনেসিয়াম আয়নের আধান কত?',o:['+2','+1','−1','−2'],a:0,e:'Mg²⁺-এর আধান +2; দুটি Cl⁻-এর মোট −2 আধান সেটিকে সাম্য করে।'},
 {q:'অম্লে কার্বনেট যোগ করলে কোন গ্যাস নির্গত হয়?',o:['CO₂','O₂','H₂','NH₃'],a:0,e:'কার্বনেট ও অম্ল থেকে কার্বন ডাই-অক্সাইড তৈরি হয়।'},
 {q:'ক্লোরাইড শনাক্তকরণে AgNO₃ যোগে সাধারণত কী দেখা যায়?',o:['সাদা AgCl অবক্ষেপ','নীল দ্রবণ','বেগুনি শিখা','হলুদ গ্যাস'],a:0,e:'অম্লায়িত নমুনায় Ag⁺ ক্লোরাইডের সঙ্গে সাদা AgCl অবক্ষেপ তৈরি করে।'},
 {q:'সালফেট শনাক্তে অম্লীয় দ্রবণে BaCl₂ যোগে কোন অবক্ষেপ হয়?',o:['সাদা BaSO₄','নীল Cu(OH)₂','বাদামি Fe(OH)₃','AgCl কালো'],a:0,e:'Ba²⁺ ও SO₄²⁻ অদ্রবণীয় সাদা BaSO₄ দেয়।'},
 {q:'Cu²⁺-এর সঙ্গে NaOH যোগে কোন অবক্ষেপ হয়?',o:['নীল Cu(OH)₂','সাদা AgCl','সবুজ গ্যাস','লাল Cu₂O সবসময়'],a:0,e:'কপার(II) হাইড্রোক্সাইড সাধারণত নীল অবক্ষেপ।'},
 {q:'Fe³⁺-এর সঙ্গে NaOH যোগে সাধারণত কী হয়?',o:['লালচে-বাদামি অবক্ষেপ','নীল শিখা','অক্সিজেন গ্যাস','সাদা AgCl'],a:0,e:'Fe(OH)₃ লালচে-বাদামি অবক্ষেপ তৈরি করে।'},
 {q:'pH = 3 হলে পানিভিত্তিক দ্রবণটি সাধারণত—',o:['অম্লীয়','নিরপেক্ষ','ক্ষারীয়','অবশ্যই pH 7'],a:0,e:'২৫°C-এ pH 7-এর কম হলে দ্রবণ অম্লীয়।'},
 {q:'আয়নিক বন্ধন সাধারণত কীভাবে গঠিত হয়?',o:['ইলেকট্রন স্থানান্তর ও বিপরীত আয়নের আকর্ষণে','শুধু নিউট্রন ভাগে','শুধু তাপ দিয়ে','আধান মুছে দিয়ে'],a:0,e:'ইলেকট্রন স্থানান্তরের পর বিপরীত আধানযুক্ত আয়নের তড়িৎস্থির আকর্ষণে আয়নিক বন্ধন গঠিত হয়।'},
 {q:'Na₂SO₄ সূত্রে মোট ধনাত্মক আধানের মান কত?',o:['+2','+1','−2','+4'],a:0,e:'দুটি Na⁺-এর মোট আধান +2; SO₄²⁻-এর −2 আধানের সঙ্গে সাম্য হয়।'},
 {q:'হ্রাস (reduction) বলতে আধুনিক ইলেকট্রন ধারণায় কী বোঝায়?',o:['ইলেকট্রন গ্রহণ','ইলেকট্রন ত্যাগ','প্রোটন সবসময় হারানো','নিউট্রন নির্গমন'],a:0,e:'OIL RIG: Oxidation Is Loss, Reduction Is Gain of electrons।'},
 {q:'কোনটি পলিআটমিক আয়ন?',o:['NH₄⁺','Na⁺','Cl⁻','Mg²⁺'],a:0,e:'NH₄⁺ একাধিক পরমাণু নিয়ে গঠিত একটি আয়ন।'}
];
var CANONICAL_SIM_ID_BY_KEY={
 wave:'wave',projectile:'hsc-phy-projectile',pendulum:'hsc-phy-periodic',spring:'hsc-phy-spring',circuit:'hsc-phy-circuit',gas:'hsc-phy-gas',
 force:'hsc-phy-newton',vectors:'hsc-math-vectors',unit:'hsc-math-trig',tangent:'hsc-math-diff',matrix:'hsc-math-matrix',circle:'hsc-math-circle',line:'hsc-math-line',
 flame:'hsc-chem-flame',kinetics:'hsc-chem-kinetics',electrochem:'hsc-chem-electrochem'
};
function normalizeCatalog(){
 var allGames=D.games||[],primaryScramble=allGames.filter(function(g){return g&&g.id==='scramble'})[0];
 if(primaryScramble){primaryScramble.data=primaryScramble.data||{};var wordBank=Array.isArray(primaryScramble.data.words)?primaryScramble.data.words.slice():[],wordSeen=Object.create(null);wordBank.forEach(function(w){wordSeen[String(w.w||'').toUpperCase()]=1});
  allGames.filter(function(g){return g&&['math-concept-scramble','hsc-term-scramble','edu-math-concept-scramble','edu-hsc-term-scramble'].indexOf(g.id)>=0}).forEach(function(g){((g.data||{}).words||[]).forEach(function(w){var k=String(w.w||'').toUpperCase();if(k&&!wordSeen[k]){wordSeen[k]=1;wordBank.push(w)}})});
  primaryScramble.data.words=wordBank;
 }
 var kept=[],titles=Object.create(null),seenIcons=Object.create(null);
 (D.games||[]).forEach(function(g){if(!g||!g.id||DROP_GAME_IDS[g.id])return;var raw=String(GAME_TITLE_BN[g.id]||g.t||g.title||g.id).toLowerCase().normalize('NFKD');var title=raw.replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,'');if(!title)title=String(g.id).toLowerCase();if(title==='flamecolourdetective'||title==='formulapaircosmos')return;if(titles[title])return;titles[title]=1;kept.push(g)});
 (D.labs||[]).forEach(function(l,i){var ico=SIM_ICON_BY_ID[l.id]||l.icon||'🧩';if(seenIcons[ico]){var j=0;while(j<GAME_ICON_FALLBACK.length&&seenIcons[GAME_ICON_FALLBACK[j]])j++;ico=GAME_ICON_FALLBACK[j]||('🔹'+(i+1));if(!SIM_ICON_BY_ID[l.id])l.icon=ico;}seenIcons[ico]=1});
 kept.forEach(function(g,i){var ico=GAME_ICON_BY_ID[g.id]||g.icon||GAME_ICON_FALLBACK[i%GAME_ICON_FALLBACK.length];if(seenIcons[ico]){var j=0;while(j<GAME_ICON_FALLBACK.length&&seenIcons[GAME_ICON_FALLBACK[j]])j++;ico=GAME_ICON_FALLBACK[j]||('🔹'+(i+1))}g.icon=ico;seenIcons[ico]=1});
 kept.sort(function(a,b){return a.id==='chemistry-ion-challenge'?-1:b.id==='chemistry-ion-challenge'?1:0});D.games=kept;
 var rawLabs=D.labs||[],seenSimRenderers=Object.create(null);
 D.labs=rawLabs.filter(function(l){if(!l)return false;if(l.id==='pendulum'||l.id==='hsc-phy-magnetic')return false;var canonical=CANONICAL_SIM_ID_BY_KEY[l.sim];if(canonical&&l.id!==canonical)return false;var renderer=String(l.sim||'').trim();if(renderer&&seenSimRenderers[renderer])return false;if(renderer)seenSimRenderers[renderer]=l.id||true;return true});
 D.labs.forEach(function(l){if(l.id==='wave'||l.id==='projectile'||l.id==='flame')l.on=true});
 var rush=kept.filter(function(g){return g.id==='physics-unit-rush'})[0];if(rush){rush.t='Physics Unit Rush';rush.d='HSC পদার্থবিজ্ঞানের SI একক, মাত্রা, সূত্র ও মৌলিক ধারণা নিয়ে দ্রুত MCQ চ্যালেঞ্জ। চারটি বিকল্প থেকে সঠিক উত্তর বেছে নিন; ভুল হলে ব্যাখ্যা দেখুন।';rush.data=rush.data||{};rush.data.time=Math.max(70,+rush.data.time||50);rush.data.useChapters='0';var qs=rush.data.q||[],have=Object.create(null);qs.forEach(function(q){have[String(q.q||'').trim().toLowerCase()]=1});PHYSICS_UNIT_RUSH_MORE.forEach(function(q){var k=q.q.trim().toLowerCase();if(!have[k]){qs.push(q);have[k]=1}});rush.data.q=qs}
 var ion=kept.filter(function(g){return g.id==='chemistry-ion-challenge'})[0];if(ion){ion.type='ionDetective';ion.on=true;ion.icon='🛟';ion.t='Ion Detective: আয়ন শনাক্তকরণ';ion.d='ভার্চুয়াল ল্যাবে বিকারক যোগ, পর্যবেক্ষণ নোট, ধনায়ন-ঋণায়ন শনাক্তকরণ, শিখা ও অধঃক্ষেপ পরীক্ষা এবং ভর্তি-ধাঁচের চ্যালেঞ্জ।';ion.diff='Medium';ion.xp=Math.max(50,+ion.xp||50);ion.data=ion.data||{};ion.data.time=Math.max(60,+ion.data.time||60);ion.data.useChapters='0';var iq=ion.data.q||[],ih=Object.create(null);iq.forEach(function(q){ih[String(q.q||'').trim().toLowerCase()]=1});ION_CHALLENGE_MORE.forEach(function(q){var k=q.q.trim().toLowerCase();if(!ih[k]){iq.push(q);ih[k]=1}});ion.data.q=iq}
 var priority=['river-boat','hsc-phy-projectile','projectile','hsc-phy-optics','mirror-optics','tiger-deer','bus-train-motion','inclined-plane-friction','force','hsc-phy-vectors','hsc-phy-newton','hsc-phy-work-energy','hsc-phy-gravity'];var pri=Object.create(null);priority.forEach(function(id,i){pri[id]=i});D.labs=(D.labs||[]).slice().sort(function(a,b){var ai=Object.prototype.hasOwnProperty.call(pri,a.id)?pri[a.id]:1000,bi=Object.prototype.hasOwnProperty.call(pri,b.id)?pri[b.id]:1000;return ai-bi});
}

/* ------------------------------------------------------------ content */
function load(d){
 d=d||{};var def=clone(DEF);
 D={settings:Object.assign({},def.settings,d.settings||{}),theme:Object.assign({},def.theme,d.theme||{}),texts:d.texts||{},
  subjects:(d.subjects&&d.subjects.length)?d.subjects:def.subjects,
  chapters:(function(){var defaults=def.chapters||[],saved=Array.isArray(d.chapters)?d.chapters:[],byId={};saved.forEach(function(x){if(x&&x.id)byId[x.id]=x});var merged=defaults.map(function(x){var old=byId[x.id];if(!old)return x;var out=Object.assign({},x,old);if(/^qc-\d+$/.test(x.id)&&x.sim)out.sim=x.sim;
    /* Migrate old saved qualitative-chemistry mappings that predated the topic-specific simulation set. */
    if(x.id==='qc-01'&&['dalton','bohr'].indexOf(out.sim)>=0)out.sim='atomBasics';
    if(x.id==='qc-03'&&out.sim==='bohr')out.sim='thomson';
    if(x.id==='qc-04'&&['bohr','rutherford'].indexOf(out.sim)>=0)out.sim='rutherfordModel';
    if(x.id==='qc-05'&&['bohr','cathode'].indexOf(out.sim)>=0)out.sim='rutherford';
    if(x.id==='qc-09'&&['bohr','quantum'].indexOf(out.sim)>=0)out.sim='planckQuantum';
    if(x.id==='qc-10'&&['bohr','quantum'].indexOf(out.sim)>=0)out.sim='deBroglie';
    if(x.id==='qc-11'&&['bohr','quantum'].indexOf(out.sim)>=0)out.sim='uncertainty';
    if(x.id==='qc-12'&&['bohr','quantum'].indexOf(out.sim)>=0)out.sim='quantumNumbers';
    return out});saved.forEach(function(x){if(x&&x.id&&!defaults.some(function(y){return y.id===x.id}))merged.push(x)});return merged})(),
  home:(function(){
    var base=def.home||{sections:[]};
    if(!(d.home&&Array.isArray(d.home.sections)))return base;
    var h=Object.assign({},d.home),sections=d.home.sections.slice();
    if(!sections.some(function(x){return x&&(x.id==='s-ayat-hadith'||x.type==='ayatHadith')})){
      var added=(base.sections||[]).filter(function(x){return x.id==='s-ayat-hadith'})[0];
      if(added){var at=sections.findIndex(function(x){return x&&(x.id==='s-stages'||x.type==='stages')});sections.splice(at>=0?at+1:sections.length,0,clone(added));}
    }
    // Keep the reflection directly after the 'Why ConceptLab?' section, followed by motivation.
    var why=sections.findIndex(function(x){return x&&(x.id==='s-why'||x.type==='features'&&x.h==='কেন এই ওয়েবসাইট তৈরি হচ্ছে?')});
    var ah=sections.findIndex(function(x){return x&&(x.id==='s-ayat-hadith'||x.type==='ayatHadith')});
    var mot=sections.findIndex(function(x){return x&&(x.id==='s-motivation'||x.type==='motivation')});
    var baseSections=base.sections||[];
    if(ah<0){var addAh=baseSections.find(function(x){return x.id==='s-ayat-hadith'});if(addAh){sections.push(clone(addAh));ah=sections.length-1;}}
    if(mot<0){var addMot=baseSections.find(function(x){return x.id==='s-motivation'});if(addMot){sections.push(clone(addMot));mot=sections.length-1;}}
    function moveAfter(id,afterId){var i=sections.findIndex(function(x){return x&&x.id===id}),j=sections.findIndex(function(x){return x&&x.id===afterId});if(i>=0&&j>=0){var item=sections.splice(i,1)[0];j=sections.findIndex(function(x){return x&&x.id===afterId});sections.splice(j+1,0,item);}}
    if(why>=0){moveAfter('s-ayat-hadith','s-why');moveAfter('s-motivation','s-ayat-hadith');}
    h.sections=sections;
    return h;
  })(),
  games:(function(){var saved=Array.isArray(d.games)?d.games:null;if(!saved)return def.games;var ids={};saved.forEach(function(x){if(x&&x.id)ids[x.id]=1});var gone={};(d.deletedGames||[]).forEach(function(x){gone[x]=1});var fresh={'mass-atlas':1,'periodic-quest':1,'element-sprint':1,'trend-duel':1,'odd-one-phy':1,'odd-one-chem':1,'odd-one-math':1,'step-order-phy':1,'step-order-chem':1,'step-order-math':1,'chemistry-ion-challenge':1,'organic-pathway':1,'stoichiometry-sprint':1,'molecular-shape-challenge':1,'hsc-boss-battle':1,'precision-lab-mastery':1,'photon-fringe-detective':1};return saved.concat((def.games||[]).filter(function(x){return (fresh[x.id]||/^edu-/.test(x.id))&&!ids[x.id]&&(!gone[x.id]||x.id==='chemistry-ion-challenge')}))})(),
  navigation:(function(){var base=Array.isArray(def.navigation)?def.navigation:[],saved=Array.isArray(d.navigation)?d.navigation:[],byId={};saved.forEach(function(x){if(x&&x.id)byId[x.id]=x});var out=base.map(function(x){return Object.assign({},x,byId[x.id]||{})});saved.forEach(function(x){if(x&&x.id&&!base.some(function(y){return y.id===x.id}))out.push(x)});return out})(),
  customPages:Array.isArray(d.customPages)?d.customPages:[],
  labs:(function(){var defaults=Array.isArray(def.labs)?def.labs:[],saved=Array.isArray(d.labs)?d.labs:[],byId={};saved.forEach(function(x){if(x&&x.id)byId[x.id]=x});var merged=defaults.map(function(x){return byId[x.id]||x});saved.forEach(function(x){if(x&&x.id&&!defaults.some(function(y){return y.id===x.id}))merged.push(x)});return merged})(),
  gam:Object.assign({},def.gam,d.gam||{}),
  daily:Object.assign({},def.daily||{},d.daily||{}),missions:Array.isArray(d.missions)?d.missions:(def.missions||[]),practice:Object.assign({},def.practice||{},d.practice||{}),deletedGames:Array.isArray(d.deletedGames)?d.deletedGames:[]};
 normalizeCatalog();
 if(window.CL_PHYSICS_CATALOG&&window.CL_PHYSICS_CATALOG.apply)window.CL_PHYSICS_CATALOG.apply(D.labs);
 if(!(d.home&&d.home.sections)&&d.settings){D.home.sections.forEach(function(s){if(s.type=='purpose'){if(d.settings.missionTitle)s.h=d.settings.missionTitle;if(d.settings.mission1)s.p=d.settings.mission1;if(d.settings.mission2)s.p2=d.settings.mission2}})}
 // Preserve administrator-authored footer/about text exactly; never rewrite creator names.
 D.settings.footer=String(D.settings.footer==null?'':D.settings.footer);D.settings.about=String(D.settings.about==null?'':D.settings.about);var oldAbout='ConceptLab একটি স্বাধীন, শিক্ষার্থী-পরিচালিত শিক্ষামূলক প্রকল্প, তৈরি করেছেন Taimur Shams। লক্ষ্য: মুখস্থের বাইরে গিয়ে মূল ধারণা বোঝানো।';if(D.settings.about===oldAbout)D.settings.about='ConceptLab একটি স্বাধীন, শিক্ষার্থী-পরিচালিত শিক্ষামূলক প্রকল্প, তৈরি করেছেন Taimur Shams ও Moshiur Rahman Araf। লক্ষ্য: মুখস্থের বাইরে গিয়ে মূল ধারণা বোঝানো।';
 // Migrate the old homepage heading even when saved CMS content still contains it.
 (D.home.sections||[]).forEach(function(sec){if(sec.id==='s-stages'&&sec.h==='প্রতিটি চ্যাপ্টারে চারটি ধাপ')sec.h='প্রতিটি কনসেপ্টের চারটি ধাপ'});
 S=D.settings;GAM=D.gam;HOME=D.home.sections;GAMES=D.games;LABS=D.labs;CHL=D.chapters;
 SUB={};D.subjects.forEach(function(s){SUB[s.id]=s.name});L={};Object.keys(SUB).forEach(function(k){L[k]=[]});C={};
 CHL.forEach(function(c){if(!L[c.s])return;L[c.s].push(c);if(c.status=='available'){c.q=c.q||[];C[c.id]=c}});
 applyTheme();statics();
}
function applyTheme(){var t=D.theme,r=document.documentElement.style;['p','s','a','bg','glow'].forEach(function(k){if(/^#[0-9a-f]{6}$/i.test(t[k]))r.setProperty('--'+k,t[k])});var m=$('meta[name=theme-color]');if(m)m.content=t.bg||'#000000';FX.setTheme(t)}
function statics(){
 ST=[X('stage1'),X('stage2'),X('stage3'),X('stage4')];
 var nav=$('header nav');if(nav){
  var navKeys={home:'nav_home',chapters:'nav_chapters',progress:'nav_progress',leaderboard:'nav_leaderboard',about:'nav_about'},navBase={home:'Home',chapters:'Explore Chapters',progress:'My Progress',leaderboard:'Leaderboard',about:'About'};
  var navItems=(D.navigation||[]).filter(function(item){return item&&item.enabled!==false&&item.enabled!==0&&item.enabled!=='0'}),byId={};navItems.forEach(function(item){byId[item.id]=item});nav.innerHTML='';
  var menuIcons={home:'🏠',chapters:'📖',play:'🎮',lab:'🔬',graphs:'📊',shortcuts:'⚡',hub:'🎓',progress:'📈','study-space':'🔖',daily:'📅','smart-practice':'🧠',analytics:'📊',leaderboard:'🏆',about:'✨',solver:'🧮',reference:'📚','share-card':'🏅',settings:'⚙️',profile:'👤'};
  var menuDescriptions={home:'মূল ড্যাশবোর্ড ও সব গুরুত্বপূর্ণ লিংক',chapters:'উচ্চতর গণিত, রসায়ন ও পদার্থবিজ্ঞান',play:'ধারণাভিত্তিক গেম, স্কোর ও XP',lab:'অধ্যায়ভিত্তিক ইন্টারঅ্যাকটিভ সিমুলেশন',graphs:'১০ অধ্যায়ের ৭৬টি ইন্টারঅ্যাকটিভ গ্রাফ',shortcuts:'সব অধ্যায়ের দ্রুত সূত্র ও পরীক্ষার কৌশল',hub:'পড়াশোনার টুল ও ব্যক্তিগত পরিকল্পনা',progress:'শেখার অগ্রগতি, লেভেল ও ব্যাজ','study-space':'নোট, বুকমার্ক ও সংরক্ষিত সিমুলেশন',daily:'আজকের ছোট লক্ষ্য ও মিশন','smart-practice':'ভুল প্রশ্নের স্মার্ট রিভিশন',analytics:'কুইজ ও শেখার পরিসংখ্যান',leaderboard:'শিক্ষার্থীদের অর্জন ও স্কোর',about:'প্রকল্প, লক্ষ্য ও যোগাযোগ',solver:'পদার্থ, রসায়ন ও গণিতের সূত্র ধাপে ধাপে সমাধান',reference:'ধ্রুবক, আয়ন, একক ও পরিচিতি', 'share-card':'XP, লেভেল ও অর্জনের কার্ড তৈরি',appearance:'ফন্ট, রং, অ্যানিমেশন ও লেআউট সাজান',settings:'সাইন-আপ ছাড়াই ব্যক্তিগত পছন্দ বদলান',profile:'আপনার প্রোফাইল, XP ও শেখার অগ্রগতি'};
  function menuHeading(label){var h=document.createElement('div');h.className='menu-group-label';h.textContent=label;nav.appendChild(h)}
  function menuLink(item){var id=String(item.id||''),rawLabel=item.label||item.title||id,label=navKeys[id]&&rawLabel===navBase[id]?X(navKeys[id]):rawLabel,a=document.createElement('a');a.className='menu-tile';a.href=item.href||('#/'+(id==='home'?'':id));a.setAttribute('data-menu-id',id);a.innerHTML='<span class="menu-tile-icon" aria-hidden="true">'+(menuIcons[id]||'◇')+'</span><span class="menu-tile-copy"><b>'+E(label)+'</b><small>'+E(item.description||menuDescriptions[id]||'এই ফিচারটি খুলুন')+'</small></span><span class="menu-tile-arrow" aria-hidden="true">↗</span>';nav.appendChild(a)}
  var groups=[{title:'EXPLORE & LEARN',ids:['home','chapters','play','lab','graphs']},{title:'YOUR LEARNING SPACE',ids:['hub','shortcuts','study-space','daily','smart-practice']},{title:'PROGRESS & COMMUNITY',ids:['progress','analytics','leaderboard']},{title:'CONCEPTLAB',ids:['about']}],used={};
  groups.forEach(function(group){var rows=group.ids.map(function(id){return byId[id]}).filter(Boolean);if(!rows.length)return;menuHeading(group.title);rows.forEach(function(item){used[item.id]=1;menuLink(item)})});
  var hubTools=[
   ['focus','⏱','Focus Timer','Pomodoro সেশন ও বিরতি'],['exam','📅','Exam Countdown','পরীক্ষার দিন গুনে রাখুন'],['gpa','🎓','GPA Calculator','HSC গ্রেড পয়েন্ট হিসাব'],['tools','📐','Geometry Tools','Virtual compass, protractor, ruler and pencil'],['plan','☑','Study Planner','দৈনিক পড়ার কাজ সাজান'],['cards','▤','Flashcards','প্রশ্ন ও উত্তর দিয়ে রিভিশন'],['review','🧠','Spaced Review','পুনরাবৃত্তির সময়সূচি অনুযায়ী রিভিশন'],['notes','✎','Quick Notes','গুরুত্বপূর্ণ নোট সংরক্ষণ'],['revision','📚','Revision Tracker','বিষয়ভিত্তিক রিভিশন চিহ্নিত করুন'],['syllabus','▤','Syllabus Tracker','তিন বিষয়ের সিলেবাস ট্র্যাক করুন'],['form','📐','Formula Sheet','গণিত, রসায়ন ও পদার্থের সূত্র'],['hab','🌱','Daily Habits','পড়ার অভ্যাসের ধারাবাহিকতা'],['backup','💾','Backup & Restore','Student Hub-এর ডেটা ব্যাকআপ ও পুনরুদ্ধার'],
   ['solver','🧮','Formula Solver','পদার্থ, রসায়ন ও উচ্চতর গণিতের সূত্র ধাপে ধাপে সমাধান','#/solver'],['reference','📚','Reference Shelf','ধ্রুবক, আয়ন, একক ও গণিতের পরিচিতি','#/reference'],['share-card','🏅','Progress Card','XP, লেভেল ও অর্জনের শেয়ারযোগ্য কার্ড','#/share-card']
  ];
  menuHeading('STUDENT HUB · ALL TOOLS');
  hubTools.forEach(function(t){var a=document.createElement('a');a.className='menu-tile hub-tool';a.href=t[4]||('#/hub/'+t[0]);a.setAttribute('data-menu-id',t[4]?t[0]:'hub-'+t[0]);if(t[4])used[t[0]]=1;a.innerHTML='<span class="menu-tile-icon" aria-hidden="true">'+t[1]+'</span><span class="menu-tile-copy"><b>'+E(t[2])+'</b><small>'+E(t[3])+'</small></span><span class="menu-tile-arrow" aria-hidden="true">↗</span>';nav.appendChild(a)});
  var extra=navItems.filter(function(item){return !used[item.id]});if(extra.length){menuHeading('MORE PAGES');extra.forEach(menuLink)}
  (D.customPages||[]).filter(function(page){return page&&page.on!==false&&page.on!==0&&page.on!=='0'}).forEach(function(page){var a=document.createElement('a');a.className='menu-tile';a.href='#/page/'+encodeURIComponent(page.slug||page.id);a.innerHTML='<span class="menu-tile-icon" aria-hidden="true">◇</span><span class="menu-tile-copy"><b>'+E(page.navLabel||page.title||'Custom page')+'</b><small>ConceptLab-এর অতিরিক্ত পেজ</small></span><span class="menu-tile-arrow" aria-hidden="true">↗</span>';nav.appendChild(a)});
 }

 var hb=$('.hbtn');if(hb)hb.textContent='▶ '+X('btn_play');
 var lg=$('.brand svg, .brand .logo');if(lg)lg.outerHTML='<img class="logo" src="assets/images/conceptlab-main-logo.webp" alt="" width="38" height="38">'
 var set=function(i,t){var n=document.getElementById(i);if(n)n.textContent=t};
 set('bn',S.siteName);set('fb',S.siteName);set('ft',S.credit==null?'':S.credit);
 set('footerTagline',S.footerText||S.footerTitle||'');set('footerFacebookLabel',S.facebookLabel||'Join our Facebook Page');set('footerYear',String(new Date().getFullYear()));
 var fba=document.getElementById('footerFacebook');if(fba)fba.href=S.facebookUrl||'https://www.facebook.com';
 var fs=document.getElementById('footerSocials');
 if(fs){
  var links=[{label:S.facebookLabel||'Join our Facebook Page',url:S.facebookUrl||'https://www.facebook.com',kind:'facebook'}].concat(Array.isArray(S.socialLinks)?S.socialLinks:[]);
  fs.innerHTML=links.filter(function(x){return x&&x.url&&x.label}).map(function(x){
   var kind=String(x.kind||'social').toLowerCase();
   var icon=kind==='facebook'?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6H17V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.5v3.2h2.8V21z"/></svg>':'<span aria-hidden="true">↗</span>';
   return '<a class="footer-social" href="'+String(x.url).replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'" target="_blank" rel="noopener noreferrer">'+icon+'<span>'+String(x.label).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</span></a>';
  }).join('');
 }
 set('ftop',X('ft_top'));document.title=S.siteName+': Unlocking core concepts'; chip();
}

/* ------------------------------------------------------------ progress, XP, badges */
function P(){try{return JSON.parse(localStorage.getItem('cl')||'{}')}catch(e){return{}}}
function cnt(id){return(P()[id]||[]).reduce(function(a,b){return a+b},0)}
function tot(){return Object.keys(C).reduce(function(a,k){return a+cnt(k)},0)}
function GS(){var g={};try{g=JSON.parse(localStorage.getItem('cl2')||'{}')}catch(e){}return Object.assign({xp:0,streak:0,last:'',quiz:{},games:{},sims:{},badges:{},daily:''},g)}
function save(g){try{localStorage.setItem('cl2',JSON.stringify(g))}catch(e){}cloudPush()}
function STUDY(){var s={bookmarks:{},notes:{},savedSims:{},review:[],history:[],formulaBookmarks:[]};try{s=Object.assign(s,JSON.parse(localStorage.getItem('clstudy_v1')||'{}'))}catch(e){};['bookmarks','notes','savedSims'].forEach(function(k){if(!s[k]||typeof s[k]!=='object')s[k]={}});['review','history','formulaBookmarks'].forEach(function(k){if(!Array.isArray(s[k]))s[k]=[]});return s}
function saveStudy(s){try{localStorage.setItem('clstudy_v1',JSON.stringify(s))}catch(e){}cloudPush()}
function studyMistake(id,qi,chosen){var s=STUDY(),key=id+':'+qi,x=s.review.find(function(a){return a.key===key}),first=PR().intervals[0]*DAY;if(x){x.wrongCount=(x.wrongCount||1)+1;x.stage=0;x.dueAt=Date.now()+first;x.lastWrongAt=Date.now();x.lastChoice=chosen}else s.review.push({key:key,conceptId:id,qIndex:qi,wrongCount:1,stage:0,createdAt:Date.now(),lastWrongAt:Date.now(),dueAt:Date.now()+first,lastChoice:chosen});saveStudy(s)}
function studyRecord(id,got,total,elapsed){var s=STUDY(),c=C[id];s.history.push({id:id,subject:c?c.s:'',got:got,total:total,accuracy:total?Math.round(got/total*100):0,elapsed:Math.round(elapsed/1000),at:Date.now()});if(s.history.length>500)s.history=s.history.slice(-500);saveStudy(s)}
function studySpace(){var s=STUDY(),ids=Object.keys(s.bookmarks).filter(function(id){return C[id]}),notes=Object.keys(s.notes).filter(function(id){return String(s.notes[id]||'').trim()}),sims=Object.keys(s.savedSims),opts=Object.keys(C).map(function(id){return'<option value="'+E(id)+'">'+E(C[id].t)+' · '+E(SUB[C[id].s]||'')+'</option>'}).join('');return '<div class="w pgw study-page"><span class="pill">PERSONAL STUDY SPACE</span><h1>My Study Space</h1><p class="lead">সূত্র, নোট, সিমুলেশন ও রিভিশন—এক জায়গায়। এই ব্রাউজারে স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে।</p><div class="study-stats"><div class="card"><b>'+ids.length+'</b><span>Bookmarks</span></div><div class="card"><b>'+notes.length+'</b><span>Notes</span></div><div class="card"><b>'+sims.length+'</b><span>Saved simulations</span></div><div class="card"><b>'+s.review.length+'</b><span>Review items</span></div></div><div class="study-grid"><section class="card study-panel"><h2>📝 অধ্যায়ভিত্তিক নোট</h2><form id="studyNoteForm"><label>Concept<select name="concept" required><option value="">কনসেপ্ট বেছে নিন</option>'+opts+'</select></label><label>আপনার নোট<textarea name="note" rows="4" maxlength="5000" required placeholder="সূত্র, ধারণা বা নিজের ব্যাখ্যা…"></textarea></label><p id="studyNoteStatus" role="status"></p><button class="btn pri">নোট সংরক্ষণ করুন</button></form><div class="study-list">'+(notes.length?notes.map(function(id){return'<article><div><b>'+E(C[id].t)+'</b><p>'+E(s.notes[id]).slice(0,240)+'</p><a href="#/chapter/'+E(id)+'">কনসেপ্ট খুলুন →</a></div><button class="btn mini" data-study-delete-note="'+E(id)+'">মুছুন</button></article>'}).join(''):'<p class="mutt">এখনো কোনো নোট নেই।</p>')+'</div></section><section class="card study-panel"><h2>🔖 Bookmarks & Formulae</h2><form id="formulaBookmarkForm"><input name="formula" maxlength="240" required placeholder="সূত্র, যেমন F = ma"><input name="label" maxlength="120" placeholder="সূত্রের নাম (ঐচ্ছিক)"><button class="btn pri">সূত্র Bookmark</button></form><div class="study-list">'+(ids.length?ids.map(function(id){return'<article><div><b>'+E(C[id].t)+'</b><p>'+E(SUB[C[id].s]||'')+' · '+E(C[id].chapterTitle||C[id].chapter||'')+'</p><a href="#/chapter/'+E(id)+'">আবার শিখুন →</a></div><button class="btn mini" data-study-unbookmark="'+E(id)+'">Remove</button></article>'}).join(''):'<p class="mutt">কনসেপ্ট পেজে Bookmark চাপলে এখানে আসবে।</p>')+(s.formulaBookmarks||[]).map(function(f,i){return'<article><div><b>'+E(f.label||'Saved formula')+'</b><p>'+E(f.formula)+'</p></div><button class="btn mini" data-study-delete-formula="'+i+'">মুছুন</button></article>'}).join('')+'</div></section><section class="card study-panel"><h2>⚛️ Saved Simulations</h2><div class="study-list">'+(sims.length?sims.map(function(id){var l=LABS.find(function(x){return x.id===id});return l?'<article><div><b>'+E(simTitle(l))+'</b><p>'+E(labSubject(l.sub))+'</p><a href="#/lab/'+E(id)+'">সিমুলেশন চালান →</a></div><button class="btn mini" data-study-unsave-sim="'+E(id)+'">Remove</button></article>':''}).join(''):'<p class="mutt">সিমুলেশন পেজে Save simulation চাপুন।</p>')+'</div></section><section class="card study-panel"><h2>🔁 Revision List</h2><div class="study-list">'+(s.review.length?s.review.slice().sort(function(a,b){return a.dueAt-b.dueAt}).map(function(x){return'<article><div><b>'+E(C[x.conceptId]?C[x.conceptId].t:x.conceptId)+'</b><p>ভুল হয়েছে '+(x.wrongCount||1)+' বার · '+(x.dueAt<=Date.now()?'এখন রিভিশনের সময়':'পরবর্তী রিভিশন: '+new Date(x.dueAt).toLocaleDateString())+'</p></div><a class="btn mini" href="#/smart-practice">Practice</a></article>'}).join(''):'<p class="mutt">কুইজে ভুল উত্তর দিলে এখানে যোগ হবে।</p>')+'<a class="btn pri" href="#/smart-practice">Smart Practice →</a></div></section></div><p class="mutt">এই সংস্করণে Study Space ডেটা এই ব্রাউজার/ডিভাইসে থাকে; অ্যাকাউন্ট-ভিত্তিক cloud sync নয়।</p></div>'}
function studyAnalytics(){var s=STUDY(),h=s.history.slice().sort(function(a,b){return a.at-b.at}),avg=h.length?Math.round(h.reduce(function(a,x){return a+x.accuracy},0)/h.length):0,secs=h.length?Math.round(h.reduce(function(a,x){return a+x.elapsed},0)/h.length):0,subjects=[['phy','Physics'],['chem','Chemistry'],['math','Mathematics']];return '<div class="w pgw study-page"><span class="pill">PERFORMANCE ANALYTICS</span><h1>আপনার শেখার অগ্রগতি</h1><p class="lead">কুইজের স্কোর, সময় ও বিষয়ভিত্তিক দক্ষতার সারাংশ।</p><div class="study-stats"><div class="card"><b>'+avg+'%</b><span>গড় স্কোর</span></div><div class="card"><b>'+h.length+'</b><span>কুইজ Attempt</span></div><div class="card"><b>'+secs+'s</b><span>গড় সময়</span></div><div class="card"><b>'+s.review.length+'</b><span>Review items</span></div></div><h2>বিষয়ভিত্তিক mastery</h2><div class="study-subjects">'+subjects.map(function(pair){var a=h.filter(function(x){return x.subject===pair[0]}),total=a.reduce(function(n,x){return n+x.total},0),got=a.reduce(function(n,x){return n+x.got},0),pc=total?Math.round(got/total*100):0;return'<article class="card"><div><span>'+pair[1]+'</span><b>'+pc+'%</b></div><div class="study-track"><i style="width:'+pc+'%"></i></div><small>'+got+'/'+total+' সঠিক · '+a.length+' কুইজ</small></article>'}).join('')+'</div><section class="card study-panel"><h2>সাম্প্রতিক কুইজ</h2>'+(h.length?h.slice(-10).reverse().map(function(x){return'<article class="study-history"><span>'+E(C[x.id]?C[x.id].t:x.id)+'<small>'+new Date(x.at).toLocaleDateString()+' · '+x.elapsed+'s</small></span><b>'+x.accuracy+'%</b><div class="study-track"><i style="width:'+x.accuracy+'%"></i></div></article>'}).join(''):'<p class="mutt">কুইজ শেষ করলে এখানে স্কোরের ইতিহাস দেখা যাবে।</p>')+'</section><h2 style="margin-top:26px">গত ৭ দিনের কার্যক্রম</h2>'+weekBars()+'<div class="card cloudcard" style="margin-top:16px"><div id="cloudBadge">'+cloudHtml()+'</div></div><p class="mutt">Analytics এই ডিভাইসে রেকর্ড হওয়া কুইজের ওপর ভিত্তি করে; সাইন-ইন ও সিঙ্ক ব্যাকএন্ড থাকলে ডিভাইসের মধ্যে মিলিয়ে নেওয়া হয়।</p></div>'}
function studentToken(){return localStorage.getItem('clstudentToken')||''}
function student(){try{return JSON.parse(localStorage.getItem('clstudent')||'null')}catch(e){return null}}
function setStudent(u){try{localStorage.setItem('clstudent',JSON.stringify(u))}catch(e){};syncAccountHeader();if(u&&studentToken())setTimeout(cloudPull,300)}
function syncAccountHeader(){var u=student(),actions=$('#accountActions'),link=$('#profileLink');if(u||studentToken()){try{localStorage.setItem('clHasAccount','1')}catch(e){}}if(actions){actions.hidden=!!u;var a=actions.querySelector('a');if(a){var known=false;try{known=localStorage.getItem('clHasAccount')==='1'}catch(e){}a.href=known?'#/account/signin':'#/account/signup';a.textContent=known?'Log in':'Sign up';a.classList.toggle('account-primary',!known);}}if(link){link.hidden=!u;if(u){var av=u.avatar?'<img src="'+E(u.avatar)+'" alt="Profile picture">':'<span class="profile-avatar-letter">'+E((u.name||'S').trim().charAt(0).toUpperCase())+'</span>';link.innerHTML=av;link.title=(u.name||'Student')+' · Profile and settings';link.setAttribute('aria-label','Profile and settings for '+(u.name||'Student'));}}}
function apiStudent(path,opts){opts=opts||{};opts.headers=Object.assign({},opts.headers||{},studentToken()?{Authorization:'Bearer '+studentToken()}:{});return fetch('/api/'+path,opts)}
function syncStudentXP(){var token=studentToken();if(!token)return;fetch('/api/student-progress',{headers:{Authorization:'Bearer '+token},cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('session');return r.json()}).then(function(d){if(!d.user)return;var g=GS();if(g.xp!==Number(d.user.xp||0)){g.xp=Number(d.user.xp||0);save(g);chip()}}).catch(function(){})}

function today(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function touchStreak(){var g=GS(),t=today();if(g.last==t)return;var y=new Date();y.setDate(y.getDate()-1);var ys=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();g.streak=(g.last==ys)?g.streak+1:1;g.last=t;save(g)}
function lvl(xp){var s=+GAM.lvl||100;return{n:Math.floor(xp/s)+1,into:xp%s,size:s}}
function metric(k,g){switch(k){case'xp':return g.xp;case'stages':return tot();case'sims':return Object.keys(g.sims).length;case'games':return Object.keys(g.games).reduce(function(a,id){return a+(g.games[id].plays||0)},0);case'streak':return g.streak;case'perfect':return Object.keys(g.quiz).filter(function(q){return g.quiz[q].total>0&&g.quiz[q].got>=g.quiz[q].total}).length}return 0}
function badges(){var g=GS(),got=false;(GAM.badges||[]).forEach(function(b){if(g.badges[b.id])return;if(metric(b.k,g)>=+b.n){g.badges[b.id]=Date.now();got=true;FX.toast(E(b.i)+' <b>Badge unlocked:</b> '+E(b.t),'bd');FX.confetti()}});if(got)save(g)}
function award(n,why){n=Math.round(n);if(!(n>0))return;var g=GS(),b=lvl(g.xp).n;g.xp+=n;save(g);var token=studentToken();if(token){var left=n,chain=Promise.resolve();while(left>0){(function(c){chain=chain.then(function(){return fetch('/api/student-progress',{method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({delta:c})}).then(function(r){if(!r.ok)throw new Error('XP sync');return r.json()}).then(function(d){var gg=GS();gg.xp=Number(d.xp)||gg.xp;try{localStorage.setItem('cl2',JSON.stringify(gg))}catch(e){}chip()})})})(Math.min(100,left));left-=100}chain.catch(function(){})}var a=lvl(g.xp).n;FX.toast('<b>+'+n+' XP</b>'+(why?' · '+E(why):''),'xp');if(a>b){FX.toast('🎉 <b>Level '+a+'!</b>','lv');FX.confetti()}chip();badges()}
function chip(){var el=$('#xpchip');if(!el)return;var g=GS(),l=lvl(g.xp);el.innerHTML='<span class="cf">🔥'+g.streak+'</span><span class="cl">Lv '+l.n+'</span><i class="xb"><b style="width:'+Math.round(l.into/l.size*100)+'%"></b></i><span class="cx">'+g.xp+' XP</span>'}
function mark(id,i){var p=P();p[id]=p[id]||[0,0,0,0];if(p[id][i])return;p[id][i]=1;try{localStorage.setItem('cl',JSON.stringify(p))}catch(e){}cloudPush();award(GAM.xpStage,'Stage complete');if(cnt(id)==4){FX.toast('🏁 <b>Concept complete!</b> '+E((C[id]||{}).t||''),'bd');FX.confetti()}badges()}
function markSim(key){var g=GS();if(g.sims[key])return;g.sims[key]=1;save(g);award(GAM.xpSim,'Simulation explored')}
function dailyGame(){var l=GAMES.filter(function(g){return g.on!==false&&g.on!=='0'});return l.length?l[Math.floor(Date.now()/864e5)%l.length]:null}

/* ------------------------------------------------------------ small html helpers */
function hd(t,v){t=String(t||'');if(v){t=t.replace('{n}',chapterCount()).replace('{s}',Object.keys(SUB).length)}var i=t.indexOf('|');return i<0?E(t).replace(/\n/g,'<br>'):E(t.slice(0,i))+'<br><em>'+E(t.slice(i+1))+'</em>'}
function secHead(s,v){return((s.pill||s.h||s.p)?'<div class="c sh2">'+(s.pill?'<span class="pill rv"><i></i>'+E(s.pill)+'</span>':'')+(s.h?'<h2 class="rv">'+hd(s.h,v)+'</h2>':'')+(s.p?'<p class="rv">'+E(s.p)+'</p>':'')+'</div>':'')}
function BL(c){return(c.blocks||[]).map(function(b){var v=b.v||'';if(b.t=='image')return v?'<figure class="fg"><img src="'+E(v)+'" alt="">'+(b.c?'<figcaption>'+E(b.c)+'</figcaption>':'')+'</figure>':'';if(b.t=='video'){var m=v.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);return m?'<div class="vd"><iframe src="https://www.youtube-nocookie.com/embed/'+m[1]+'" allowfullscreen loading="lazy"></iframe></div>':''}if(b.t=='pdf')return v?'<div class="pdf">'+(b.c?'<h3 class="bh">'+E(b.c)+'</h3>':'')+'<iframe src="'+E(v)+'" loading="lazy"></iframe><a class="btn" href="'+E(v)+'" target="_blank" rel="noopener">Open / download PDF</a></div>':'';if(b.t=='note')return'<div class="card bl">'+E(v)+'</div>';if(b.t=='head')return'<h3 class="bh">'+E(v)+'</h3>';return'<p class="bn bl">'+E(v)+'</p>'}).join('')}
function chapterCount(){var seen={};CHL.forEach(function(c){var k=String(c.s)+'::'+String(c.chapterTitle||c.chapter||c.t||'Chapter').trim();seen[k]=1});return Object.keys(seen).length}
function NT(){return chapterCount()}
var SIM_ICON_BY_ID={
 "hsc-chem-rutherford":"☄️",
 "hsc-chem-bohr":"⚛️",
 "wave":"🌊",
 "projectile":"🏹",
 "pendulum":"⏱️",
 "spring":"🪀",
 "circuit":"🔌",
 "gas":"🎈",
 "force":"🛒",
 "vectors":"↗️",
 "unit":"⭕",
 "tangent":"📈",
 "matrix":"🔲",
 "circle":"🔵",
 "line":"📏",
 "flame":"🕯️",
 "river-boat":"🚤",
 "mirror-optics":"🪞",
 "tiger-deer":"🐅",
 "bus-train-motion":"🚆",
 "inclined-plane-friction":"🛝",
 "ion-identification":"🔎",
 "wet-test":"🧫",
 "hsc-phy-vectors":"🧭",
 "hsc-phy-projectile":"🪂",
 "hsc-phy-newton":"🪨",
 "hsc-phy-work-energy":"⚙️",
 "hsc-phy-gravity":"🌍",
 "hsc-phy-periodic":"🎼",
 "hsc-phy-spring":"🎛️",
 "hsc-phy-wave":"〰️",
 "hsc-phy-gas":"💨",
 "hsc-phy-circuit":"💡",
 "hsc-phy-magnetic":"🌐",
 "hsc-phy-optics":"🔭",
 "hsc-chem-flame":"♨️",
 "hsc-chem-periodic":"🧿",
 "hsc-chem-bond":"🔗",
 "hsc-chem-kinetics":"⚗️",
 "hsc-chem-equilibrium":"♻️",
 "hsc-chem-ph":"🧴",
 "hsc-chem-titration":"💧",
 "hsc-chem-electrochem":"🔋",
 "hsc-chem-gas":"🫧",
 "hsc-chem-stoich":"🧾",
 "hsc-chem-redox":"🔁",
 "hsc-chem-thermo":"🌡️",
 "hsc-math-line":"📉",
 "hsc-math-circle":"🟠",
 "hsc-math-matrix":"🧊",
 "hsc-math-vectors":"🛩️",
 "hsc-math-trig":"📐",
 "hsc-math-diff":"∂",
 "hsc-math-integration":"∫",
 "hsc-math-functions":"ƒ",
 "hsc-math-probability":"🎲",
 "hsc-math-complex":"ℂ",
 "hsc-math-conics":"🥏",
 "hsc-math-trig-graph":"〽️",
 "hsc-math-vector-products":"✖️",
 "hsc-math-limit":"↝",
 "hsc-math-combinatorics":"🧩",
 "hsc-chem-isomers":"🔬",
 "hsc-chem-intermolecular":"🤝",
 "hsc-chem-solution-prep":"🧪",
 "hsc-chem-solubility":"🫙",
 "hsc-chem-electrolysis":"🪫",
 "hsc-chem-organic-mechanism":"🧬",
 "hsc-phy-circular-motion":"🌀",
 "hsc-phy-standing-waves":"🎶",
 "hsc-phy-capacitor":"⚡",
 "hsc-phy-induction":"🧲",
 "hsc-phy-photoelectric":"☀️"
};
var SIM_TITLE_BN={
 "hsc-chem-rutherford":"Rutherford Alpha Scattering",
 "hsc-chem-bohr":"Bohr Atom & Electron Levels",
 "wave":"Wave Machine",
 "projectile":"Projectile Motion Lab",
 "pendulum":"Simple Harmonic Motion",
 "spring":"Spring & Mass",
 "circuit":"Ohm's Law Circuit",
 "gas":"Gas Particles",
 "force":"Force & Motion",
 "vectors":"Vector Addition Lab",
 "unit":"Unit Circle Explorer",
 "tangent":"Differentiation: Tangent & Gradient",
 "matrix":"Matrix Transformation Lab",
 "circle":"Circle Equation Explorer",
 "line":"Straight Line Explorer",
 "flame":"Flame Test Lab",
 "river-boat":"River Boat: Relative Velocity",
 "mirror-optics":"Spherical & Plane Mirrors",
 "tiger-deer":"বাঘ–হরিণ ধাওয়া: আপেক্ষিক গতি",
 "bus-train-motion":"Bus & Train: Relative Motion",
 "inclined-plane-friction":"Inclined Plane with Friction",
 "ion-identification":"Ion Identification Lab",
 "wet-test":"Wet Test Lab",
 "hsc-phy-vectors":"Vector Resolution Lab",
 "hsc-phy-projectile":"Projectile Motion: Angle & Range",
 "hsc-phy-newton":"Newton's Second Law",
 "hsc-phy-work-energy":"Work & Kinetic Energy",
 "hsc-phy-gravity":"Gravity & Orbital Motion",
 "hsc-phy-periodic":"Simple Harmonic Motion",
 "hsc-phy-spring":"Spring Constant & Oscillation",
 "hsc-phy-wave":"Wave Equation Explorer",
 "hsc-phy-gas":"Kinetic Theory of Gases",
 "hsc-phy-circuit":"Current Electricity & Ohm's Law",
 "hsc-phy-magnetic":"Magnetic Field of a Current",
 "hsc-phy-optics":"Geometrical Optics: Thin Lens",
 "hsc-chem-flame":"Qualitative Analysis: Flame Test",
 "hsc-chem-periodic":"Periodic Trend Explorer",
 "hsc-chem-bond":"Chemical Bonding & Polarity",
 "hsc-chem-kinetics":"Reaction Rate & Temperature",
 "hsc-chem-equilibrium":"Chemical Equilibrium & Le Chatelier's Principle",
 "hsc-chem-ph":"pH & Hydrogen Ion Concentration",
 "hsc-chem-titration":"Acid–Base Titration Curve",
 "hsc-chem-electrochem":"Electrochemical Cell",
 "hsc-chem-gas":"Gas Laws & Molar Volume",
 "hsc-chem-stoich":"Stoichiometry & Limiting Reagent",
 "hsc-chem-redox":"Redox & Electron Transfer",
 "hsc-chem-thermo":"Reaction Energy & Temperature",
 "hsc-math-line":"Straight-Line Equation Explorer",
 "hsc-math-circle":"Circle Equation Explorer",
 "hsc-math-matrix":"Matrix Transformation & Determinant",
 "hsc-math-vectors":"ভেক্টর যোগ: ত্রিভুজ, সামান্তরিক, বহুভুজ ও উপাংশ",
 "hsc-math-trig":"Trigonometry: Unit Circle",
 "hsc-math-diff":"Differentiation: Tangent & Gradient",
 "hsc-math-integration":"Integration & Area Explorer",
 "hsc-math-functions":"Function & Graph Transformation Lab",
 "hsc-math-probability":"Probability Simulator",
 "hsc-math-complex":"Complex Plane Transformer",
 "hsc-math-conics":"Circle & Conic Explorer",
 "hsc-math-trig-graph":"Trigonometric Graph Explorer",
 "hsc-math-vector-products":"Vector Dot & Cross Product Lab",
 "hsc-math-limit":"Limit Explorer",
 "hsc-math-combinatorics":"Permutation & Combination Lab",
 "hsc-chem-isomers":"Isomer Builder",
 "hsc-chem-intermolecular":"Intermolecular Forces Explorer",
 "hsc-chem-solution-prep":"Solution Preparation Lab",
 "hsc-chem-solubility":"Solubility Curve Challenge",
 "hsc-chem-electrolysis":"Electrolysis & Faraday's Law",
 "hsc-chem-organic-mechanism":"Organic Reaction Mechanism Lab",
 "hsc-phy-circular-motion":"Circular Motion & Banking",
 "hsc-phy-standing-waves":"Standing Waves & Resonance",
 "hsc-phy-capacitor":"Electric Field & Capacitor",
 "hsc-phy-induction":"Electromagnetic Induction Lab",
 "hsc-phy-photoelectric":"Photoelectric Effect"
};
function simIcon(l){return l&&(SIM_ICON_BY_ID[l.id]||l.icon)||'🔬'}
function simTitle(l){return l&&(SIM_TITLE_BN[l.id]||l.t||l.title)||'Simulation'}
function labIcon(key){var l=LABS.filter(function(x){return x.sim==key})[0];return l?simIcon(l):'🔬'}

/* ------------------------------------------------------------ home sections */
function heroSvg(){var t=D.theme,p=t.p,s=t.s,a=t.a;return'<svg viewBox="0 0 400 400" style="width:100%;height:100%;overflow:visible"><defs><radialGradient id="gl"><stop offset="0" stop-color="'+p+'" stop-opacity=".24"/><stop offset="1" stop-color="'+p+'" stop-opacity="0"/></radialGradient><radialGradient id="core" cx="35%" cy="30%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="'+s+'"/><stop offset="1" stop-color="'+p+'" stop-opacity=".25"/></radialGradient><linearGradient id="rk" x1="0" x2="1"><stop offset="0" stop-color="#b9c6d6"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>'
+'<circle cx="200" cy="200" r="150" fill="url(#gl)"/><g class="rot slow"><ellipse cx="200" cy="200" rx="178" ry="62" fill="none" stroke="'+s+'" stroke-opacity=".35" stroke-dasharray="3 7" transform="rotate(-20 200 200)"/><circle cx="378" cy="200" r="5" fill="'+a+'" transform="rotate(-20 200 200)"/></g>'
+'<g class="rot rev"><ellipse cx="200" cy="200" rx="140" ry="140" fill="none" stroke="'+p+'" stroke-opacity=".25"/><circle cx="200" cy="60" r="4" fill="#fff"/></g>'
+'<circle cx="200" cy="200" r="34" fill="url(#core)" class="pulse"/><circle cx="60" cy="70" r="2" fill="#fff" class="tw"/><circle cx="350" cy="230" r="2" fill="#fff" class="tw" style="animation-delay:-1s"/><circle cx="150" cy="40" r="1.5" fill="#fff" class="tw" style="animation-delay:-2s"/><circle cx="330" cy="60" r="1.6" fill="#fff" class="tw" style="animation-delay:-1.4s"/>'
+'<path id="tp" d="M30 350Q200 -70 370 350" fill="none" stroke="'+p+'" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round" opacity=".8"/>'
+'<g><animateMotion dur="7s" repeatCount="indefinite" rotate="auto"><mpath href="#tp"/></animateMotion><path d="M-16 -7H6Q24 0 6 7H-16Z" fill="url(#rk)"/><circle cx="-2" r="3.5" fill="'+p+'"/><path d="M-16 -7L-25 -14V-3ZM-16 7L-25 14V3Z" fill="'+s+'"/><path d="M-16 -4L-34 0L-16 4Z" fill="'+a+'"><animate attributeName="d" dur=".25s" repeatCount="indefinite" values="M-16 -4L-34 0L-16 4Z;M-16 -4L-27 0L-16 4Z;M-16 -4L-34 0L-16 4Z"/></path></g>'
+'<g transform="translate(318 108)"><g class="ob"><circle r="6" fill="'+a+'"/><g><ellipse rx="36" ry="12" fill="none" stroke="'+s+'" stroke-opacity=".7"/><circle cx="36" r="3.5" fill="'+p+'"/></g><g transform="rotate(60)"><ellipse rx="36" ry="12" fill="none" stroke="'+s+'" stroke-opacity=".7"/><circle cx="-36" r="3.5" fill="'+p+'"/></g><g transform="rotate(120)"><ellipse rx="36" ry="12" fill="none" stroke="'+s+'" stroke-opacity=".7"/><circle cx="36" r="3.5" fill="'+p+'"/></g></g></g>'
+'<g transform="translate(88 300)"><path d="M-24 8L-36 28Q-42 42 -28 42H28Q42 42 36 28L24 8Z" fill="'+p+'" fill-opacity=".55"/><path d="M-12 -50H12V-20L36 28Q42 42 28 42H-28Q-42 42 -36 28L-12 -20Z" fill="none" stroke="#cfd8e3" stroke-width="2" stroke-linejoin="round"/><circle cx="-10" cy="30" r="3" fill="#fff" class="bb"/><circle cx="4" cy="32" r="2.5" fill="#fff" class="bb" style="animation-delay:-.8s"/><circle cx="14" cy="30" r="3" fill="#fff" class="bb" style="animation-delay:-1.6s"/></g>'
+'<g transform="translate(250 300)" class="fl"><path d="M0 0V64M0 32H110" stroke="#3a4656" fill="none"/><path d="M0 32Q14 -4 28 32T56 32T84 32T110 32" stroke="'+a+'" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>'
+'<g font-family="Manrope,Hind Siliguri,sans-serif" font-size="15" fill="#9fb6cb"><text x="20" y="200" class="fl">F = ma</text><text x="160" y="385" class="fl" style="animation-delay:-2s">H₂O</text><text x="290" y="215" class="fl" style="animation-delay:-3s">y = mx + c</text><text x="130" y="108" class="fl" style="animation-delay:-4s">E = mc²</text></g></svg>'}
function secHero(){var words=String(S.heroWords||'').split(',').map(function(w){return w.trim()}).filter(Boolean);
 return'<div class="w hero"><div class="hero-copy"><span class="pill rv"><i></i>'+E(S.badge)+'</span><h1 class="rv">'+E(S.h1)+'</h1><p class="lead rv">'+E(S.lead)+'</p>'+(words.length?'<p class="typed rv">'+E(S.heroPre)+' <b data-type="'+E(words.join('|'))+'"></b><span class="caret"></span></p>':'')+'</div><div class="orb-wrap" aria-hidden="true">'+heroSvg()+'</div></div>'}
function homeChallengeArena(){
 return '<section class="home-brain-sprint" aria-label="Interactive knowledge challenge"><div class="w"><div class="brain-sprint-shell"><div class="brain-sprint-copy"><span class="brain-sprint-eyebrow"><i></i> CONCEPTLAB · BRAIN SPRINT</span><h2>Test what you know.<br><em>Level up.</em></h2><p>Five quick HSC questions. Choose a subject, think it through, and build your personal best—no account required.</p><div class="brain-sprint-benefits"><span><b>05</b> questions</span><span><b>60s</b> time limit</span><span><b>3</b> subjects</span></div><div class="brain-sprint-bestline"><span class="brain-sprint-best-icon" aria-hidden="true">✦</span><span><b>Your personal best</b><small id="brainSprintBestLine">Saved on this device</small></span></div></div><div class="brain-sprint-play"><div id="brainSprintStartPanel"><div class="brain-sprint-panel-head"><span class="brain-sprint-panel-mark" aria-hidden="true">∑</span><span><b>CHALLENGE ARENA</b><small>Pick your challenge</small></span><span class="brain-sprint-live"><i></i> READY</span></div><div class="brain-sprint-subjects" role="group" aria-label="Choose challenge subject"><button type="button" data-brain-subject="all" aria-pressed="true">All subjects</button><button type="button" data-brain-subject="phy" aria-pressed="false">Physics</button><button type="button" data-brain-subject="chem" aria-pressed="false">Chemistry</button><button type="button" data-brain-subject="math" aria-pressed="false">Higher Math</button></div><div class="brain-sprint-preview"><div class="brain-sprint-preview-art" aria-hidden="true"><span class="bs-orbit bs-orbit-a"></span><span class="bs-orbit bs-orbit-b"></span><span class="bs-core">?</span><span class="bs-star">✦</span></div><div><b>Ready to activate your brain?</b><p>Answer accurately and quickly. Correct answers earn points; your best score is saved locally.</p></div></div><button type="button" class="btn pri brain-sprint-start" id="brainSprintStart">Start 60-second sprint <span aria-hidden="true">→</span></button><p class="brain-sprint-privacy">Free to play · Progress saved only in this browser</p></div><div id="brainSprintQuizPanel" hidden><div class="brain-sprint-quiz-top"><span class="brain-sprint-round" id="brainSprintRound">QUESTION 1 / 5</span><span class="brain-sprint-timer" id="brainSprintTimer" aria-live="polite">01:00</span></div><div class="brain-sprint-progress"><i id="brainSprintProgress"></i></div><p class="brain-sprint-subject-label" id="brainSprintSubject">PHYSICS</p><h3 id="brainSprintQuestion"></h3><div class="brain-sprint-options" id="brainSprintOptions"></div><p class="brain-sprint-feedback" id="brainSprintFeedback" role="status" aria-live="polite"></p><div class="brain-sprint-quiz-footer"><span id="brainSprintScore">Score: 0</span><button class="btn pri" type="button" id="brainSprintNext" disabled>Next question →</button></div></div><div id="brainSprintResultPanel" hidden><div class="brain-sprint-result-icon" aria-hidden="true">✦</div><p class="brain-sprint-result-eyebrow" id="brainSprintResultEyebrow">SPRINT COMPLETE</p><h3 id="brainSprintResultTitle">Nice work!</h3><div class="brain-sprint-result-score"><strong id="brainSprintFinalScore">0/5</strong><span>correct answers</span></div><p id="brainSprintResultText"></p><button type="button" class="btn pri brain-sprint-start" id="brainSprintAgain">Run it back <span aria-hidden="true">↻</span></button><a href="#/smart-practice" class="brain-sprint-more">Want a longer practice session? Try Smart Practice →</a></div></div></div></div></section>';
}
var BRAIN_SPRINT_QUESTIONS = [
 {s:'phy',label:'PHYSICS',q:'A car speeds up from 0 m/s to 20 m/s in 4 seconds. What is its average acceleration?',a:['4 m/s²','5 m/s²','16 m/s²','80 m/s²'],c:1,e:'Acceleration = change in velocity ÷ time = 20 ÷ 4 = 5 m/s².'},
 {s:'phy',label:'PHYSICS',q:'Two resistors of 2 Ω and 3 Ω are connected in series. What is the total resistance?',a:['1 Ω','1.2 Ω','5 Ω','6 Ω'],c:2,e:'For series resistors, resistances add: 2 Ω + 3 Ω = 5 Ω.'},
 {s:'phy',label:'PHYSICS',q:'A wave has a time period of 0.5 seconds. What is its frequency?',a:['0.5 Hz','1 Hz','2 Hz','5 Hz'],c:2,e:'Frequency f = 1/T = 1/0.5 = 2 Hz.'},
 {s:'phy',label:'PHYSICS',q:'If the speed of an object doubles while its mass stays the same, its kinetic energy becomes…',a:['Twice as large','Three times as large','Four times as large','Unchanged'],c:2,e:'Kinetic energy is proportional to speed squared: K = ½mv².'},
 {s:'phy',label:'PHYSICS',q:'Which is the SI unit of impulse?',a:['Watt','Newton-second','Joule per second','Pascal'],c:1,e:'Impulse equals change in momentum and has the unit N·s.'},
 {s:'chem',label:'CHEMISTRY',q:'Approximately how many particles are in one mole of a substance?',a:['3.00 × 10⁸','6.022 × 10²³','9.81 × 10²','1.60 × 10⁻¹⁹'],c:1,e:'One mole contains Avogadro’s number: approximately 6.022 × 10²³ entities.'},
 {s:'chem',label:'CHEMISTRY',q:'A solution with pH 3 is best described as…',a:['Acidic','Neutral','Basic','Always pure water'],c:0,e:'A pH below 7 indicates an acidic solution at standard reference conditions.'},
 {s:'chem',label:'CHEMISTRY',q:'Isotopes of the same element have the same number of…',a:['Neutrons','Nucleons','Protons','Protons and neutrons combined'],c:2,e:'Elements are defined by proton number. Isotopes differ in neutron number.'},
 {s:'chem',label:'CHEMISTRY',q:'A covalent bond forms when atoms…',a:['Share electron pairs','Exchange protons','Share neutrons','Always form ions'],c:0,e:'A covalent bond involves the sharing of one or more electron pairs.'},
 {s:'chem',label:'CHEMISTRY',q:'Why does increasing temperature often increase reaction rate?',a:['Particles stop moving','More collisions have enough energy to react','The atoms become heavier','The equilibrium constant is always zero'],c:1,e:'At higher temperature, a larger fraction of collisions can overcome the activation energy.'},
 {s:'math',label:'HIGHER MATH',q:'Differentiate f(x) = x² with respect to x.',a:['x','2x','x³/3','2'],c:1,e:'By the power rule, d(xⁿ)/dx = nxⁿ⁻¹, so d(x²)/dx = 2x.'},
 {s:'math',label:'HIGHER MATH',q:'A vector has perpendicular components 3 and 4. What is its magnitude?',a:['4','5','7','12'],c:1,e:'Magnitude = √(3² + 4²) = √25 = 5.'},
 {s:'math',label:'HIGHER MATH',q:'Which equation has slope 2 and y-intercept −1?',a:['y = 2x + 1','y = x − 2','y = 2x − 1','y = −2x − 1'],c:2,e:'In y = mx + c, the slope is m and the y-intercept is c.'},
 {s:'math',label:'HIGHER MATH',q:'A fair coin is tossed once. What is the probability of getting heads?',a:['0','1/4','1/2','1'],c:2,e:'There are two equally likely outcomes; one is heads, so the probability is 1/2.'},
 {s:'math',label:'HIGHER MATH',q:'Find the determinant of the matrix [[1, 2], [3, 4]].',a:['2','−2','10','−10'],c:1,e:'For a 2×2 matrix, det = ad − bc = (1×4) − (2×3) = −2.'}
];
function mountHomeChallengeArena(){
 var root=document.querySelector('.home-brain-sprint');if(!root)return;
 var startPanel=root.querySelector('#brainSprintStartPanel'),quizPanel=root.querySelector('#brainSprintQuizPanel'),resultPanel=root.querySelector('#brainSprintResultPanel');if(!startPanel||!quizPanel||!resultPanel)return;
 var selected='all',deck=[],index=0,score=0,seconds=60,answered=false,timer=null,finished=false;
 var $q=function(id){return root.querySelector('#'+id)};
 function readBest(){try{return JSON.parse(localStorage.getItem('clBrainSprintBestV1')||'{}')||{}}catch(e){return {}}}
 function bestLine(){var b=readBest(),v=Number(b[selected]||0);$q('brainSprintBestLine').textContent=v?'Best for '+(selected==='all'?'all subjects':selected==='phy'?'Physics':selected==='chem'?'Chemistry':'Higher Math')+': '+v+'/5 correct':'No record yet — set your first high score!'}
 function stopTimer(){if(timer){clearInterval(timer);timer=null}}
 function fmtTime(n){return '00:'+String(Math.max(0,n)).padStart(2,'0')}
 function setPanel(which){startPanel.hidden=which!=='start';quizPanel.hidden=which!=='quiz';resultPanel.hidden=which!=='result'}
 function shuffled(arr){var out=arr.slice();for(var i=out.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var x=out[i];out[i]=out[j];out[j]=x}return out}
 function start(){stopTimer();var pool=BRAIN_SPRINT_QUESTIONS.filter(function(q){return selected==='all'||q.s===selected});deck=shuffled(pool).slice(0,5);index=0;score=0;seconds=60;answered=false;finished=false;setPanel('quiz');drawQuestion();tick();timer=setInterval(function(){if(!document.documentElement.contains($q('brainSprintTimer'))){stopTimer();return}seconds--;tick();if(seconds<=0)finish(true)},1000)}
 function tick(){$q('brainSprintTimer').textContent=fmtTime(seconds);$q('brainSprintTimer').classList.toggle('is-urgent',seconds<=10);$q('brainSprintTimer').setAttribute('aria-label',seconds+' seconds remaining')}
 function drawQuestion(){var q=deck[index];if(!q){finish(false);return}answered=false;$q('brainSprintRound').textContent='QUESTION '+(index+1)+' / '+deck.length;$q('brainSprintProgress').style.width=(index/deck.length*100)+'%';$q('brainSprintSubject').textContent=q.label;$q('brainSprintQuestion').textContent=q.q;$q('brainSprintOptions').innerHTML=q.a.map(function(a,i){return '<button type="button" class="brain-sprint-option" data-brain-choice="'+i+'"><span class="brain-sprint-option-letter">'+String.fromCharCode(65+i)+'</span><span>'+E(a)+'</span></button>'}).join('');$q('brainSprintFeedback').textContent='Choose your answer.';$q('brainSprintFeedback').className='brain-sprint-feedback';$q('brainSprintScore').textContent='Score: '+score;$q('brainSprintNext').disabled=true;$q('brainSprintNext').textContent=index===deck.length-1?'See my result →':'Next question →'}
 function choose(i){if(answered||finished)return;answered=true;var q=deck[index],buttons=$q('brainSprintOptions').querySelectorAll('[data-brain-choice]');buttons.forEach(function(b){var n=Number(b.getAttribute('data-brain-choice'));b.disabled=true;if(n===q.c)b.classList.add('is-correct');if(n===i&&n!==q.c)b.classList.add('is-wrong')});var fb=$q('brainSprintFeedback');if(i===q.c){score++;fb.textContent='Correct! '+q.e;fb.classList.add('is-good')}else{fb.textContent='Not quite. '+q.e;fb.classList.add('is-bad')}$q('brainSprintScore').textContent='Score: '+score;$q('brainSprintNext').disabled=false;$q('brainSprintProgress').style.width=((index+1)/deck.length*100)+'%'}
 function advance(){if(!answered||finished)return;index++;if(index>=deck.length)finish(false);else drawQuestion()}
 function finish(timeout){if(finished)return;finished=true;stopTimer();setPanel('result');var b=readBest(),prev=Number(b[selected]||0);if(score>prev){b[selected]=score;try{localStorage.setItem('clBrainSprintBestV1',JSON.stringify(b))}catch(e){}}$q('brainSprintResultEyebrow').textContent=timeout?'TIME IS UP':'SPRINT COMPLETE';$q('brainSprintResultTitle').textContent=score===5?'Flawless run!':score>=3?'Strong thinking!':'Good practice. Keep going.';$q('brainSprintFinalScore').textContent=score+'/'+deck.length;$q('brainSprintResultText').textContent=(timeout?'The timer ended. ':'You finished the round. ')+(score>prev?'New personal best! ':'')+'Review the explanations, then try another subject or improve your score.';bestLine()}
 root.querySelectorAll('[data-brain-subject]').forEach(function(b){b.addEventListener('click',function(){selected=b.getAttribute('data-brain-subject')||'all';root.querySelectorAll('[data-brain-subject]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});bestLine()})});
 $q('brainSprintStart').addEventListener('click',start);$q('brainSprintAgain').addEventListener('click',function(){setPanel('start');bestLine()});$q('brainSprintOptions').addEventListener('click',function(e){var b=e.target.closest('[data-brain-choice]');if(b)choose(Number(b.getAttribute('data-brain-choice')))});$q('brainSprintNext').addEventListener('click',advance);bestLine();
}
function homeQuickAccess(){
 var features=[
  ['#/chapters','📖','Explore Chapters','তিনটি বিষয়ের অধ্যায় ও কনসেপ্ট'],['#/play','🎮','Arcade','গেম খেলুন, স্কোর ও XP বাড়ান'],['#/lab','🔬','Simulations','চলক বদলে ফলাফল নিজে দেখুন'],['#/hub','🎓','Student Hub','পড়াশোনার দরকারি টুল এক জায়গায়'],['#/hub/tools','📐','Geometry Tools','Virtual compass, protractor, ruler and pencil'],['#/smart-practice','🧠','Smart Practice','ভুল প্রশ্ন আবার অনুশীলন করুন'],['#/study-space','🔖','Study Space','নোট, বুকমার্ক ও সূত্র গুছিয়ে রাখুন'],['#/daily','📅','Daily Missions','আজকের লক্ষ্য ও শেখার ধারাবাহিকতা'],['#/progress','📈','My Progress','অগ্রগতি, লেভেল ও ব্যাজ দেখুন']
 ];
 var subjectData=[['math','📐','Higher Mathematics','গণিতের ধারণা, সূত্র ও অনুশীলন'],['chem','🧪','Chemistry','বিক্রিয়া, বন্ধন ও রসায়নের ধারণা'],['phy','⚛','Physics','গতি, বল, শক্তি ও প্রকৃতির নিয়ম']];
 var tools=[['#/hub/focus','⏱','Focus Timer'],['#/hub/exam','📅','Exam Countdown'],['#/hub/gpa','🎓','GPA Calculator'],['#/hub/tools','📐','Geometry & Units'],['#/hub/plan','✅','Study Planner'],['#/hub/cards','🧩','Flashcards'],['#/hub/review','🧠','Spaced Review'],['#/hub/notes','📝','Quick Notes'],['#/hub/revision','📚','Revision Tracker'],['#/hub/syllabus','📖','Syllabus Tracker'],['#/hub/form','📐','Formula Sheet'],['#/hub/hab','🌱','Daily Habits'],['#/hub/backup','💾','Backup & Restore'],['#/solver','🧮','Formula Solver'],['#/reference','📚','Reference Shelf'],['#/share-card','🏅','Progress Card'],['#/settings','⚙️','Settings']];
 return'<section class="home-launchpad" aria-label="Quick access to ConceptLab features"><div class="w"><div class="launch-head"><span class="pill"><i></i> QUICK ACCESS</span><h2>এক জায়গায় শেখা, অনুশীলন ও পরিকল্পনা</h2><p>ConceptLab-এর প্রধান ফিচারগুলোতে সরাসরি যান—উচ্চতর গণিত, রসায়ন ও পদার্থবিজ্ঞান একসঙ্গে।</p></div><div class="launch-feature-grid">'+features.map(function(x,i){return'<a class="launch-feature-card" href="'+x[0]+'" style="--launch-delay:'+(i*.035)+'s"><span class="launch-feature-icon" aria-hidden="true">'+x[1]+'</span><span class="launch-feature-copy"><b>'+x[2]+'</b><small>'+x[3]+'</small></span><span class="launch-feature-arrow" aria-hidden="true">↗</span></a>'}).join('')+'</div><div class="launch-subject-head"><div><span class="launch-eyebrow">THREE SUBJECTS · ONE LAB</span><h3>বিষয় বেছে শুরু করুন</h3></div><a href="#/chapters">সব অধ্যায় <span aria-hidden="true">→</span></a></div><div class="launch-subject-grid">'+subjectData.map(function(x){var seen={};(L[x[0]]||[]).forEach(function(c){seen[String(c.chapterTitle||c.chapter||c.t||'Chapter').trim()]=1});return'<a class="launch-subject-card subject-'+x[0]+'" href="#/chapters" data-subject-go="'+x[0]+'"><span class="launch-subject-icon" aria-hidden="true">'+x[1]+'</span><span><b>'+x[2]+'</b><small>'+Object.keys(seen).length+' অধ্যায় · '+(L[x[0]]||[]).length+' কনসেপ্ট</small><em>'+x[3]+'</em></span><span class="launch-subject-arrow" aria-hidden="true">→</span></a>'}).join('')+'</div><div class="launch-tool-head"><div><span class="launch-eyebrow">STUDENT HUB TOOLKIT</span><h3>Student Hub-এর সব টুল</h3></div><a href="#/hub">Student Hub খুলুন <span aria-hidden="true">→</span></a></div><div class="launch-tool-grid">'+tools.map(function(x){return'<a class="launch-tool" href="'+x[0]+'"><span class="launch-tool-icon" aria-hidden="true">'+x[1]+'</span><span>'+x[2]+'</span><span class="launch-tool-arrow" aria-hidden="true">↗</span></a>'}).join('')+'</div></div></section>'
}
var MOTIVATION_QUOTES=[
['শুরু করার জন্য নিখুঁত হওয়া লাগে না; শুরু করলেই উন্নতি হয়।','Zig Ziglar'],
['It always seems impossible until it’s done.','Nelson Mandela'],
['আজকের ছোট অগ্রগতিই আগামী দিনের বড় সাফল্য।','Unknown'],
['The secret of getting ahead is getting started.','Mark Twain'],
['ভুল মানে ব্যর্থতা নয়, শেখার একটি ধাপ।','Unknown'],
['Believe you can and you’re halfway there.','Theodore Roosevelt'],
['যে প্রশ্ন করতে শেখে, সে শেখার পথ খুঁজে পায়।','Unknown'],
['Success is the sum of small efforts, repeated day in and day out.','Robert Collier'],
['নিজের গতিতে এগিয়ে চলো, থেমে যেও না।','Unknown'],
['Dream big. Start small. Act now.','Robin Sharma'],
['শেখার জন্য প্রতিদিন একটু সময় দাও; ফল একদিন দেখা দেবেই।','Unknown'],
['It does not matter how slowly you go as long as you do not stop.','Confucius'],
['তুলনা নয়, গতকালের নিজের চেয়ে ভালো হওয়ার চেষ্টা করো।','Unknown'],
['The future depends on what you do today.','Mahatma Gandhi'],
['কৌতূহলই জ্ঞানের প্রথম দরজা।','Unknown'],
['Education is the most powerful weapon which you can use to change the world.','Nelson Mandela'],
['কঠিন বিষয়কে ছোট ছোট ধাপে ভাগ করো।','Unknown'],
['There are no shortcuts to any place worth going.','Beverly Sills'],
['প্রতিদিনের ধারাবাহিকতাই প্রতিভাকে দক্ষতায় বদলে দেয়।','Unknown'],
['The expert in anything was once a beginner.','Helen Hayes'],
['আজ না বুঝলে আবার চেষ্টা করো—বোঝার পথ খোলা আছে।','Unknown'],
['Believe in yourself and all that you are.','Christian D. Larson'],
['একটি ভালো প্রশ্ন অনেক মুখস্থ উত্তরের চেয়ে মূল্যবান।','Unknown'],
['You don’t have to be great to start, but you have to start to be great.','Zig Ziglar'],
['পরিশ্রমের সঙ্গে ধৈর্য যোগ হলে দক্ষতা তৈরি হয়।','Unknown'],
['Learning never exhausts the mind.','Leonardo da Vinci'],
['ব্যর্থ চেষ্টা শেষ নয়; সেটি পরের চেষ্টার তথ্য।','Unknown'],
['The beautiful thing about learning is that nobody can take it away from you.','B. B. King'],
['মনোযোগ দিয়ে শেখা সময় বাঁচায়।','Unknown'],
['Great things are done by a series of small things brought together.','Vincent van Gogh'],
['নিজের সম্ভাবনাকে সুযোগ দাও।','Unknown'],
['Act as if what you do makes a difference. It does.','William James'],
['সাফল্য একদিনে আসে না, প্রতিদিনের অভ্যাসে গড়ে ওঠে।','Unknown'],
['The only way to do great work is to love what you do.','Steve Jobs'],
['যত বেশি বুঝবে, তত কম মুখস্থ করতে হবে।','Unknown'],
['It’s not that I’m so smart, it’s just that I stay with problems longer.','Albert Einstein'],
['আজকের অধ্যবসায় আগামী দিনের আত্মবিশ্বাস।','Unknown'],
['Success is not final, failure is not fatal: it is the courage to continue that counts.','Winston Churchill'],
['জ্ঞান ভাগ করলে কমে না, বাড়ে।','Unknown'],
['The roots of education are bitter, but the fruit is sweet.','Aristotle'],
['প্রশ্ন করতে লজ্জা নয়—না বুঝে থাকা শেখার বাধা।','Unknown'],
['If you can dream it, you can do it.','Walt Disney'],
['নিজের শেখার দায়িত্ব নিজেই নাও।','Unknown'],
['Nothing will work unless you do.','Maya Angelou'],
['ধৈর্য ধরে চেষ্টা করো, অগ্রগতি কখনো কখনো নীরবে আসে।','Unknown'],
['Do what you can, with what you have, where you are.','Theodore Roosevelt'],
['একটু একটু করে শেখাই দীর্ঘ পথ পাড়ি দেয়।','Unknown'],
['The more that you read, the more things you will know.','Dr. Seuss'],
['মনোযোগ হলো শেখার সবচেয়ে শক্তিশালী হাতিয়ারগুলোর একটি।','Unknown'],
['Great minds discuss ideas.','Eleanor Roosevelt']
];
function dailyMotivation(){
 var key='cl_motivation_seen_v1',seen=[];try{seen=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(seen))seen=[]}catch(e){}
 var available=MOTIVATION_QUOTES.map(function(q,i){return {q:q,i:i}}).filter(function(x){return seen.indexOf(x.i)<0});
 if(!available.length){seen=[];available=MOTIVATION_QUOTES.map(function(q,i){return {q:q,i:i}})}
 var chosen=available[Math.floor(Math.random()*available.length)];seen.push(chosen.i);try{localStorage.setItem(key,JSON.stringify(seen))}catch(e){}
 return chosen.q;
}
function homeScienceOutro(){return '<section class="home-science-outro" aria-label="Explore the beauty of science"><div class="w"><div class="science-outro-panel"><div class="science-outro-copy"><span class="pill"><i></i> THE BEAUTY OF DISCOVERY</span><h2>Every question opens a new orbit.</h2><p>Connect the dots, test an idea, and see how the pieces of science fit together.</p><a class="btn ghost" href="#/lab">Explore the simulations →</a></div><div class="science-outro-art" aria-hidden="true"><svg viewBox="0 0 520 220" role="img"><defs><linearGradient id="scienceLine" x1="0" x2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity=".2"/><stop offset=".5" stop-color="#7dd3fc"/><stop offset="1" stop-color="#a78bfa" stop-opacity=".3"/></linearGradient></defs><path class="so-path" d="M12 150 C75 150 75 45 138 45 S201 175 264 175 S327 70 390 70 S453 150 508 150"/><path class="so-path so-path-alt" d="M12 85 C70 85 85 190 145 190 S220 25 280 25 S355 160 415 160 S470 85 508 85"/><g class="so-atom" transform="translate(260 105)"><ellipse rx="72" ry="27" transform="rotate(25)"/><ellipse rx="72" ry="27" transform="rotate(-25)"/><ellipse rx="72" ry="27" transform="rotate(90)"/><circle class="so-node" r="5"/><circle class="so-node so-node-alt" cx="70" cy="-18" r="4"/></g><g class="so-flask" transform="translate(62 22)"><path d="M-8 0h16M-5 0v24l-22 38q-4 8 7 8h40q11 0 7-8L5 24V0"/><path d="M-18 48h36"/><circle cx="-5" cy="57" r="2"/><circle cx="7" cy="61" r="2"/></g><g class="so-wave"><path d="M360 183q12-36 24 0t24 0t24 0t24 0t24 0"/></g></svg></div></div></div></section>'}

function homeDiscoveryMotion(){return '<section class="home-discovery-motion" aria-label="Explore science through animation"><div class="w"><div class="discovery-motion-head"><span class="pill"><i></i> SCIENCE IN MOTION</span><h2>Ideas come alive when you explore.</h2><p>Watch patterns move, forces connect, and tiny discoveries turn into big ideas.</p></div><div class="discovery-motion-grid"><article class="discovery-motion-card motion-wave"><div class="dm-visual" aria-hidden="true"><svg viewBox="0 0 260 100"><path class="dm-gridline" d="M5 20H255M5 50H255M5 80H255M30 5V95M80 5V95M130 5V95M180 5V95M230 5V95"/><path class="dm-wave-line" d="M5 50 C20 5 40 5 55 50 S90 95 105 50 S140 5 155 50 S190 95 205 50 S240 5 255 50"/><circle class="dm-wave-dot" cx="155" cy="50" r="4"/></svg></div><span class="dm-kicker">01 · WAVE LAB</span><h3>Patterns in motion</h3><p>Trace the rhythm of a wave as it travels through space.</p></article><article class="discovery-motion-card motion-orbit"><div class="dm-visual" aria-hidden="true"><svg viewBox="0 0 260 100"><g class="dm-orbit-group"><ellipse cx="130" cy="50" rx="58" ry="22"/><ellipse cx="130" cy="50" rx="58" ry="22" transform="rotate(58 130 50)"/><ellipse cx="130" cy="50" rx="58" ry="22" transform="rotate(-58 130 50)"/><circle class="dm-sun" cx="130" cy="50" r="9"/><circle class="dm-planet" cx="181" cy="29" r="4"/></g></svg></div><span class="dm-kicker">02 · ORBIT ROOM</span><h3>Gravity at work</h3><p>Follow the paths that keep a system connected.</p></article><article class="discovery-motion-card motion-magnet"><div class="dm-visual" aria-hidden="true"><svg viewBox="0 0 260 100"><path class="dm-field" d="M45 75 C25 10 95 4 130 50 C165 4 235 10 215 75"/><path class="dm-field dm-field-two" d="M58 76 C49 30 98 23 130 50 C162 23 211 30 202 76"/><rect class="dm-magnet" x="100" y="31" width="60" height="38" rx="8"/><path class="dm-magnet-cut" d="M130 32V68"/><circle class="dm-particle" cx="70" cy="40" r="3"/><circle class="dm-particle dm-particle-two" cx="194" cy="54" r="3"/></svg></div><span class="dm-kicker">03 · FIELD NOTES</span><h3>Invisible forces</h3><p>See how a field can shape what happens around it.</p></article></div></div></section>'}
var SEC={
 marquee:function(s){var it=(s.items||[]).map(function(i){return i.t}).filter(Boolean);if(!it.length)return'';var row=it.map(function(t){return'<span>'+E(t)+'</span><i>✦</i>'}).join(''),k=Math.max(1,Math.ceil(24/it.length)),half=new Array(k+1).join(row);return'<div class="marq" aria-hidden="true"><div class="mtk">'+half+half+'</div></div>'},
 stats:function(s){var g=GS();function val(it){switch(it.k){case'chapters':return chapterCount();case'available':return Object.keys(C).length;case'games':return GAMES.filter(function(x){return x.on!==false&&x.on!=='0'}).length;case'labs':return LABS.filter(function(x){return x.on!==false&&x.on!=='0'}).length;case'done':return tot();case'xp':return Math.max(0,Number(g.xp)||0);case'level':return lvl(g.xp).n;default:return Math.max(0,Number(it.v)||0)}}
  var cards=(s.items||[]).map(function(it,i){return'<div class="stat home-stat-card rv" data-stat-key="'+E(it.k||'custom')+'" style="--d:'+(i*.05)+'s"><b data-count="'+val(it)+'">0</b><span>'+E(it.t||'Learning metric')+'</span></div>'}).join('');
  return'<section class="home-stats-section" aria-label="ConceptLab learning statistics"><div class="w"><div class="home-stats-panel"><div class="home-stats-heading"><div><span class="home-stats-kicker">CONCEPTLAB AT A GLANCE</span><p>এক নজরে শেখার উপকরণ ও আপনার অগ্রগতি</p></div><span class="home-stats-live"><i></i> LIVE COUNTS</span></div><div class="stats home-stats-grid">'+cards+'</div></div></div></section>'},
 goals:function(s){return'<section class="goals"><div class="w">'+secHead(s)+'<div class="gA g2">'+(s.items||[]).map(function(it,i){return'<article class="card goal tilt rv" style="--d:'+(i*.1)+'s"><span class="gn">'+(i<9?'0':'')+(i+1)+'</span><div class="gi">'+E(it.i)+'</div><h3>'+E(it.t)+'</h3><p>'+E(it.p)+'</p></article>'}).join('')+'</div></div></section>'},
 stages:function(s){return'<section class="sec-stages"><div class="w">'+secHead(s)+'<div class="gA g4 stg">'+(s.items||[]).map(function(it,i){return'<div class="card tilt rv" style="--d:'+(i*.1)+'s"><div class="ic">'+(i+1)+'</div><h3>'+E(it.t||ST[i]||'')+'</h3><p>'+E(it.p)+'</p></div>'}).join('')+'</div></div></section>'},
 ayatHadith:function(s){return window.CL_AH?window.CL_AH.render(s):''},
 motivation:function(s){var q=dailyMotivation();return '<section class="motivation-section" aria-labelledby="motivationTitle"><div class="w"><div class="motivation-card"><span class="motivation-pill">✦ '+E(s.pill||'DAILY INSPIRATION')+'</span><h2 id="motivationTitle">'+E(s.h||'আজকের অনুপ্রেরণা')+'</h2><blockquote>“'+E(q[0])+'”</blockquote><p class="motivation-author">— '+E(q[1])+'</p></div></div></section>'},
 lab:function(s){var ls=LABS.filter(function(x){return x.on!==false&&x.on!=='0'});return'<section class="home-lab"><div class="w"><div class="home-lab-head"><div class="lab-copy rv">'+(s.pill?'<span class="pill"><i></i> '+E(s.pill)+'</span>':'')+'<h2>'+hd(s.h)+'</h2><p>'+E(s.p)+'</p><div class="lab-tags">'+(s.items||[]).map(function(t){return'<span>'+E(t.t)+'</span>'}).join('')+'</div></div></div><div class="home-lab-carousel"><button class="btn home-lab-arrow" type="button" data-home-lab-shift="-1" aria-label="Previous simulation">←</button><div class="home-lab-track home-lab-grid" id="homeLabTrack">'+ls.map(function(l,i){return'<article class="card gm home-lab-card rv" style="--d:'+(Math.min(i*.003,.08))+'s;--icon-hue:'+iconHue(l.id)+'" '+(i?'hidden':'')+'><div class="home-lab-card-top"><span class="gico">'+E(simIcon(l))+'</span><span class="home-lab-sub">'+E(labSubject(l.sub))+'</span><span class="home-lab-count">'+String(i+1).padStart(2,'0')+' / '+String(ls.length).padStart(2,'0')+'</span></div><h3>'+E(simTitle(l))+'</h3>'+(l.chapter?'<small class="lab-topic">'+E(l.chapter)+(l.concept?' · '+E(l.concept):'')+'</small>':'')+'<p>'+E(l.d)+'</p><a class="btn pri home-sim-btn" href="#/lab/'+E(l.id)+'">⚛ সিমুলেশন চালান →</a></article>'}).join('')+'</div><button class="btn home-lab-arrow" type="button" data-home-lab-shift="1" aria-label="Next simulation">→</button></div><div class="home-lab-footer"><a class="btn" href="#/lab">সব সিমুলেশন দেখুন →</a></div></div></section>'},
 arcade:function(s){var gs=GAMES.filter(function(g){return g.on!==false&&g.on!=='0'}),hues=[198,262,152,28,330,48];return'<section class="arcade-s home-games"><div class="w">'+secHead(s)+(gs.length?'<div class="gdeck" aria-roledescription="carousel" aria-label="Games"><div class="gdeck-track" id="homeGameTrack" tabindex="0">'+gs.map(function(g,i){return'<a class="gdeck-card'+(i===Math.floor(gs.length/2)?' on':'')+'" style="--h:'+iconHue(g.id)+';--icon-hue:'+iconHue(g.id)+'" href="#/play/'+E(g.id)+'" data-gi="'+i+'" aria-label="'+E(gameTitle(g))+'"><span class="gdeck-ico" aria-hidden="true">'+E(gameIcon(g))+'</span><span class="gdeck-diff">'+E(g.diff||'')+'</span><h3>'+E(gameTitle(g))+'</h3><p>'+E(g.d)+'</p><span class="gdeck-foot"><b>+'+(+g.xp||0)+' XP</b><span class="gdeck-play">এখন খেলুন ▶</span></span></a>'}).join('')+'</div><div class="gdeck-nav"><button class="gdeck-arrow" type="button" data-gdeck="-1" aria-label="Previous game">←</button><div class="gdeck-prog" aria-hidden="true"><i id="gdeckBar"></i></div><span class="gdeck-count" id="gdeckCount">01 / '+String(gs.length).padStart(2,'0')+'</span><button class="gdeck-arrow" type="button" data-gdeck="1" aria-label="Next game">→</button></div></div>':'')+(s.btn?'<div class="c" style="margin-top:20px"><a class="btn pri" href="'+E(safeLink(s.link))+'">'+E(s.btn)+'</a></div>':'')+'</div></section>'},
 purpose:function(s){return'<section><div class="w split"><div class="rv">'+(s.pill?'<span class="pill"><i></i>'+E(s.pill)+'</span>':'')+'<h2 style="margin-top:20px">'+hd(s.h)+'</h2></div><div class="rv"><p class="bn" style="color:#fff;margin:0 0 14px">'+E(s.p)+'</p><p class="bn" style="color:var(--mut);margin:0">'+E(s.p2)+'</p><ul>'+(s.items||[]).map(function(i){return'<li>'+E(i.t)+'</li>'}).join('')+'</ul></div></div></section>'},
 features:function(s){return'<section class="tight sec-features"><div class="w">'+secHead(s)+'<div class="gA g3">'+(s.items||[]).map(function(it,i){return'<div class="card tilt rv" style="--d:'+(i*.07)+'s"><div class="ic">'+E(it.i)+'</div><h3>'+E(it.t)+'</h3><p>'+E(it.p)+'</p></div>'}).join('')+'</div></div></section>'},
 roadmap:function(s){var lab={done:X('rs_done'),now:X('rs_now'),next:X('rs_next')};return'<section><div class="w">'+secHead(s)+'<div class="road">'+(s.items||[]).map(function(it,i){var st=lab[it.s]?it.s:'next';return'<div class="rs '+st+' rv" style="--d:'+(i*.1)+'s"><div class="rd"><i></i></div><div class="card rc"><div class="rh"><span class="rlab">'+E(it.d)+'</span><span class="rst">'+E(lab[st])+'</span></div><h3>'+E(it.t)+'</h3><p>'+E(it.p)+'</p></div></div>'}).join('')+'</div></div></section>'},
 subjects:function(s){return'<section class="tight sec-subjects"><div class="w">'+secHead(s,1)+'<div class="subj-grid">'+Object.keys(L).map(function(k,i){var seen={};L[k].forEach(function(c){seen[chTitle(c)]=1});return'<a class="subj-card tilt rv" style="--d:'+(i*.1)+'s" href="#/chapters" data-subject-go="'+E(k)+'"><span class="subj-stat"><b>'+Object.keys(seen).length+'</b> চ্যাপ্টার · <b>'+L[k].length+'</b> কনসেপ্ট</span><h3>'+E(SUB[k])+'</h3></a>'}).join('')+'</div></div></section>'},
 faq:function(s){return'<section class="tight"><div class="w">'+secHead(s)+'<div class="faq">'+(s.items||[]).map(function(it,i){return'<details class="rv" style="--d:'+(i*.05)+'s"><summary>'+E(it.q)+'</summary><p>'+E(it.a)+'</p></details>'}).join('')+'</div></div></section>'},
 cta:function(s){var showParagraph=s.id!=='s-cta'&&s.p;return'<section class="tight home-final-cta"><div class="w"><div class="cta rv"><h2>'+hd(s.h)+'</h2>'+(showParagraph?'<p>'+E(String(s.p)).replace(/\n/g,'<br>')+'</p>':'')+(s.btn?'<a class="btn pri big" href="'+E(safeLink(s.link))+'">'+E(s.btn)+'</a>':'')+'</div></div></section>'},
 text:function(s){return'<section class="tight"><div class="w" style="max-width:780px">'+secHead(Object.assign({},s,{p:''}))+'<p class="bn bl rv" style="text-align:center">'+E(s.p)+'</p></div></section>'}
};

/* ------------------------------------------------------------ pages */
var chF='all',chQ='',chS='all';
var CH_STATUS=[['all','সব'],['available','চালু'],['progress','চলমান'],['done','সম্পন্ন'],['soon','শীঘ্রই আসছে']];
function chTitle(c){return String(c.chapterTitle||c.chapter||c.t||'Chapter').trim()||'Chapter'}
function chItems(sub,title){return CHL.filter(function(c){return c.s===sub&&chTitle(c)===title&&!(c.id==='qualitative-chemistry'&&CHL.some(function(x){return x.id==='qc-01'}))})}
function chStat(items){var av=items.filter(function(c){return c.status==='available'}),done=av.reduce(function(a,c){return a+cnt(c.id)},0),max=av.length*4,full=av.filter(function(c){return cnt(c.id)>=4}).length;return{av:av.length,soon:items.length-av.length,done:done,max:max,full:full,pct:max?Math.round(done/max*100):0,next:av.filter(function(c){return cnt(c.id)<4})[0]||null,started:done>0}}
function chGrid(){
 var specs=[
 {s:'chem',n:'ল্যাবরেটরির নিরাপদ ব্যবহার',a:['safe use of laboratory','laboratory safety','lab safety']},
 {s:'chem',n:'গুণগত রসায়ন',a:['qualitative chemistry']},
 {s:'chem',n:'মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন',a:['periodic properties and chemical bond of elements','periodic properties and chemical bonding','periodic properties','chemical bonding']},
 {s:'chem',n:'রাসায়নিক পরিবর্তন',a:['chemical change','chemical changes','chemical reactions']},
 {s:'chem',n:'কর্মমুখী রসায়ন',a:['vocational chemistry','applied chemistry']},
 {s:'phy',n:'ভৌতজগৎ ও পরিমাপ',a:['physical world and measurement']},
 {s:'phy',n:'ভেক্টর',a:['vectors']},
 {s:'phy',n:'গতিবিদ্যা',a:['kinematics']},
 {s:'phy',n:'নিউটনীয় বলবিদ্যা',a:['newtonian mechanics','dynamics','force and motion']},
 {s:'phy',n:'কাজ, শক্তি ও ক্ষমতা',a:['work, energy and power','work energy and power']},
 {s:'phy',n:'মহাকর্ষ ও অভিকর্ষ',a:['gravitation and gravity','gravitation']},
 {s:'phy',n:'পদার্থের গাঠনিক ধর্ম',a:['structural properties of matter','properties of matter']},
 {s:'phy',n:'পর্যাবৃত্ত গতি',a:['periodic motion']},
 {s:'phy',n:'তরঙ্গ',a:['waves','wave']},
 {s:'phy',n:'আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব',a:['ideal gas and kinetic theory of gases','ideal gas','kinetic theory of gases']},
 {s:'math',n:'ম্যাট্রিক্স ও নির্ণায়ক',a:['matrices and determinants']},
 {s:'math',n:'ভেক্টর',a:['vectors']},
 {s:'math',n:'সরলরেখা',a:['straight lines','straight line']},
 {s:'math',n:'বৃত্ত',a:['circles','circle']},
 {s:'math',n:'বিন্যাস ও সমাবেশ',a:['permutation and combination','permutations and combinations']},
 {s:'math',n:'ত্রিকোণমিতিক অনুপাত',a:['trigonometric ratios']},
 {s:'math',n:'সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত',a:['trigonometric ratios of associated angles','associated angles']},
 {s:'math',n:'ফাংশন ও ফাংশনের লেখচিত্র',a:['functions and graphs of functions','functions and graphs']},
 {s:'math',n:'অন্তরীকরণ',a:['differentiation']},
 {s:'math',n:'যোগজীকরণ',a:['integration']}
 ];
 var q=chQ.trim().toLowerCase(),groups={},any=false,shown=0;
 Object.keys(L).forEach(function(k){if(k!=='chem'&&k!=='phy'&&k!=='math')return;L[k].forEach(function(c){if(c.id==='qualitative-chemistry'&&CHL.some(function(x){return x.id==='qc-01'}))return;var title=chTitle(c),key=k+'::'+title;if(!groups[key])groups[key]={s:k,title:title,items:[]};groups[key].items.push(c)})});
 var mapped=[];specs.forEach(function(sp){var found=null;Object.keys(groups).some(function(key){var g=groups[key];if(g.s!==sp.s)return false;var low=g.title.toLowerCase();if(!sp.a.some(function(alias){return low===alias||low.indexOf(alias)>=0}))return false;found=g;return true});if(!found)found={s:sp.s,title:sp.a[0],displayName:sp.n,items:[]};else found=Object.assign({},found,{displayName:sp.n});if(!q||(sp.n+' '+found.title+' '+SUB[sp.s]).toLowerCase().indexOf(q)>=0||found.items.some(function(c){return String(c.t||'').toLowerCase().indexOf(q)>=0}))mapped.push(found)});
 if(chF!=='all')mapped=mapped.filter(function(g){return g.s===chF});
 var out=['chem','phy','math'].map(function(k){var arr=mapped.filter(function(g){return g.s===k});if(!arr.length)return '';return '<section class="chapter-subject-group" data-chapter-subject="'+E(k)+'"><header class="chapter-subject-heading"><span class="chapter-subject-dot"></span><div><h2>'+E(SUB[k]||k)+' — ১ম পত্র</h2><p>'+arr.length+'টি অধ্যায় · বিষয়ভিত্তিক তালিকা</p></div></header><div class="chapter-index-grid gA g3">'+arr.map(function(g,i){any=true;shown++;var st=chStat(g.items),href='#/chapter-list/'+encodeURIComponent(g.s+'|'+g.title),cta=st.av&&st.full===st.av?'আবার দেখুন →':(st.started&&st.next?'চালিয়ে যান →':'কনসেপ্টগুলো দেখুন →');return '<a class="card ch av chapter-index-card tilt rv" style="--d:'+(Math.min(i*.006,.1))+'s" href="'+E(href)+'"><span class="bd2">'+E(SUB[g.s])+'</span><h3>'+E(g.displayName||g.title)+'</h3><p>'+g.items.length+'টি কনসেপ্ট · '+st.av+'টি চালু'+(st.soon?' · '+st.soon+'টি শীঘ্রই':'')+'</p>'+(st.av?'<div class="bar chbar" title="'+st.pct+'%"><i style="width:'+st.pct+'%"></i></div><small class="mutt">'+st.full+'/'+st.av+' কনসেপ্ট সম্পন্ন · '+st.pct+'%</small>':'')+'<span class="go">'+cta+'</span></a>'}).join('')+'</div></section>'}).join('');
 return '<p class="chcount mutt" role="status">'+shown+'টি অধ্যায় পাওয়া গেছে'+(q?' · “'+E(chQ.trim())+'”':'')+'</p>'+(any?'<div class="chapter-subject-groups">'+out+'</div>':'<div class="card chempty"><p class="lead c" style="margin:20px auto">কোনো অধ্যায় পাওয়া যায়নি।</p><p class="c"><button class="btn" data-ch-reset>ফিল্টার মুছুন</button></p></div>');
}

var pages={
 'study-space':function(){return studySpace()},
 'smart-practice':function(){return smartPractice()},
 daily:function(){return dailyPage()},
 analytics:function(){return studyAnalytics()},
 profile:function(){var u=student();if(!u)return '<div class="w pgw"><div class="card stgin"><h1>Sign in to view your profile</h1><p class="lead">Your profile, settings, and XP are available after signing in.</p><a class="btn pri" href="#/account/signin">Sign in</a></div></div>';var g=GS(),l=lvl(g.xp),av=u.avatar?'<img class="profile-avatar-img" src="'+E(u.avatar)+'" alt="Profile picture">':'<span class="profile-avatar-letter">'+E((u.name||'S').trim().charAt(0).toUpperCase())+'</span>';return '<div class="w pgw profile-page"><div class="profile-head card"><div class="profile-avatar">'+av+'</div><div class="profile-main"><span class="pill"><i></i> STUDENT PROFILE</span><h1>'+E(u.name||'Student')+'</h1><div class="row profile-shortcuts"><a class="btn" href="#/edit-profile">⚙ Edit profile</a><a class="btn" href="#/settings">Settings</a></div></div></div><div class="profile-stats"><div class="card"><span>Experience points</span><strong>'+Math.max(0,Number(g.xp)||0)+' XP</strong></div><div class="card"><span>Current level</span><strong>Level '+l.n+'</strong></div><div class="card"><span>Learning streak</span><strong>🔥 '+g.streak+' days</strong></div><div class="card"><span>Simulations explored</span><strong>'+Object.keys(g.sims).length+'</strong></div></div><div class="row profile-actions"><a class="btn pri" href="#/progress">View full progress</a><a class="btn" href="#/settings">Settings</a><button class="btn" id="studentLogout" type="button">Sign out</button></div></div>'},
 'edit-profile':function(){var u=student();if(!u)return '<div class="w pgw"><div class="card stgin"><h1>Sign in required</h1><a class="btn pri" href="#/account/signin">Sign in</a></div></div>';return '<div class="w pgw auth-wrap"><div class="card stgin"><span class="pill"><i></i> ACCOUNT SETTINGS</span><h1 class="ctitle">Edit your profile</h1><p class="lead">Change your picture and information. Your XP and learning progress stay connected to your account.</p><form id="studentProfileForm" class="auth-form"><div class="profile-picture-edit"><div id="profilePreview" class="profile-avatar">'+(u.avatar?'<img class="profile-avatar-img" src="'+E(u.avatar)+'" alt="Profile picture">':'<span class="profile-avatar-letter">'+E((u.name||'S').trim().charAt(0).toUpperCase())+'</span>')+'</div><label class="btn" for="profilePicture">Change profile picture</label><input id="profilePicture" type="file" accept="image/png,image/jpeg,image/webp" hidden><small class="mutt">JPG, PNG or WebP; image will be resized before saving.</small></div><label class="auth-field"><span>Full name</span><input name="name" required minlength="2" maxlength="80" value="'+E(u.name||'')+'"></label><label class="auth-field"><span>Email address (cannot be changed here)</span><input value="'+E(u.email||'')+'" disabled></label><label class="auth-field"><span>About me</span><textarea name="bio" maxlength="240" rows="3" placeholder="A little about you">'+E(u.bio||'')+'</textarea></label><label class="auth-field"><span>School / institution</span><input name="school" required minlength="2" maxlength="120" value="'+E(u.school||'')+'" placeholder="Your school or college"></label><label class="auth-field"><span>Location</span><input name="location" maxlength="120" value="'+E(u.location||'')+'" placeholder="City or area (optional)"></label><p id="profileMessage" class="mutt" role="status"></p><button class="btn pri auth-submit" type="submit">Save changes →</button><a class="btn profile-back" href="#/profile">Back to profile</a><a class="btn" href="#/settings">General settings</a></form></div></div>'},
 account:function(){var raw=location.hash.split('?')[1]||'',params=new URLSearchParams(raw),mode=(location.hash.split('/')[2]||'signin').split('?')[0],returnTo=params.get('return')||'';if(returnTo&&/^#\//.test(returnTo)){try{sessionStorage.setItem('clAuthReturn',returnTo)}catch(e){}}return '<div class="w pgw auth-wrap"><div class="card stgin"><div class="auth-mark">✦ <span>CONCEPTLAB ACCOUNT</span></div><h1 class="ctitle">'+(mode==='signup'?'Create your account':'Welcome back')+'</h1><p class="lead">'+(mode==='signup'?'Save your learning progress and compete on the leaderboard.':'Sign in to sync progress and appear on the leaderboard.')+'</p><div class="auth-free-note"><strong>Free access:</strong> You can explore chapters, simulations and games without signing in. XP on this device works locally; sign in to attach XP to your account and appear on the leaderboard.</div><div class="tabs"><a class="tab '+(mode==='signin'?'on':'')+'" href="#/account/signin'+(returnTo?'?return='+encodeURIComponent(returnTo):'')+'">Sign in</a><a class="tab '+(mode==='signup'?'on':'')+'" href="#/account/signup'+(returnTo?'?return='+encodeURIComponent(returnTo):'')+'">Sign up</a></div><form id="studentAuth" class="auth-form" data-mode="'+mode+'">'+(mode==='signup'?'<label class="auth-field"><span>Full name</span><input name="name" autocomplete="name" placeholder="Your name" required minlength="2" maxlength="80"></label><label class="auth-field"><span>Institute Name</span><input name="school" autocomplete="organization" placeholder="Your school, college or institute" required minlength="2" maxlength="120"></label>':'')+'<label class="auth-field"><span>Email address</span><input name="email" type="email" inputmode="email" autocapitalize="none" spellcheck="false" autocomplete="email" placeholder="you@example.com" required maxlength="254"></label><label class="auth-field"><span>Password</span><span class="auth-password-row"><input id="studentPassword" name="password" type="password" autocomplete="'+(mode==='signup'?'new-password':'current-password')+'" placeholder="'+(mode==='signup'?'At least 8 characters':'Enter your password')+'" minlength="8" maxlength="200" required><button type="button" class="auth-show-password" data-toggle-password aria-label="Show password">Show</button></span></label>'+(mode==='signin'?'<button type="button" class="auth-forgot" data-forgot-password>Forgot password?</button><p id="forgotMessage" class="mutt" role="status" hidden>Self-service email recovery is not configured yet. Please contact the ConceptLab administrator for a secure reset. Never share your password.</p>':'<p class="mutt">Use at least 8 characters. Your password is never shown publicly.</p>')+'<p id="authMessage" class="mutt" role="status" aria-live="polite"></p><button class="btn pri auth-submit" type="submit">'+(mode==='signup'?'Create account':'Sign in')+' <span aria-hidden="true">→</span></button><p class="auth-switch">'+(mode==='signup'?'Already have an account? <a href="#/account/signin'+(returnTo?'?return='+encodeURIComponent(returnTo):'')+'">Sign in</a>':'New to ConceptLab? <a href="#/account/signup'+(returnTo?'?return='+encodeURIComponent(returnTo):'')+'">Create an account</a>')+'</p></form></div></div>'},

 '':function(){var visible=HOME.filter(function(s){return s.on!==false&&s.on!=='0'&&SEC[s.type]});var chapterCta=visible.filter(function(s){return s.id==='s-cta'});var ticker=visible.filter(function(s){return s.type==='marquee'});var other=visible.filter(function(s){return s.id!=='s-cta'&&s.type!=='marquee'});var inserted=false;var otherHtml=other.map(function(s){var out='';if(!inserted&&s.type==='lab'){out=homeChallengeArena();inserted=true}return out+SEC[s.type](s)}).join('');if(!inserted)otherHtml+=homeChallengeArena();return secHero()+ticker.map(function(s){return SEC[s.type](s)}).join('')+homeQuickAccess()+otherHtml+homeDiscoveryMotion()+homeScienceOutro()+chapterCta.map(function(s){return SEC[s.type](s)}).join('')},
 chapters:function(){var labels=[['all','All'],['math','Higher Mathematics'],['chem','Chemistry'],['phy','Physics']];return'<div class="w pgw chapters-page"><h1 class="rv">'+E(X('ch_h'))+'</h1><div class="filters rv chapter-filter-wrap"><div class="chips left chapter-filter-chips">'+labels.map(function(x){return'<button type="button" class="chipb chapter-filter-btn'+(chF==x[0]?' on':'')+'" data-chf="'+x[0]+'" aria-pressed="'+(chF==x[0]?'true':'false')+'">'+x[1]+'</button>'}).join('')+'</div><input id="chq" class="search" type="search" placeholder="'+E(X('ch_search'))+'" value="'+E(chQ)+'" aria-label="'+E(X('ch_search'))+'"></div><div id="chg">'+chGrid()+'</div></div>'},
 play:function(){var g=GS(),dg=dailyGame(),gs=GAMES.filter(function(x){return x.on!==false&&x.on!=='0'}),ion=gs.filter(function(x){return x.id==='chemistry-ion-challenge'})[0],rest=gs.filter(function(x){return x.id!=='chemistry-ion-challenge'}),doneToday=g.daily===today();function groupKey(x){var z=(x.t+' '+x.d+' '+x.id).toLowerCase();if(/chem|ion|flame|organic|molecul|stoich|periodic|electron|reaction|acid|ph |buffer|electrolys|lab|mystery|escape|formula.*chem/i.test(z))return 'রসায়ন';if(/math|vector|slope|matrix|calculus|probab|equation|geometry/i.test(z))return 'উচ্চতর গণিত';if(/physics|projectile|cannon|river|force|wave|motion|unit|pendulum/i.test(z))return 'পদার্থবিজ্ঞান';return 'মিশ্র চ্যালেঞ্জ'}var groups=['রসায়ন','পদার্থবিজ্ঞান','উচ্চতর গণিত','মিশ্র চ্যালেঞ্জ'];return'<div class="w pgw arcade-page"><span class="pill rv"><i></i>🎮 CONCEPTLAB ARCADE · '+gs.length+'টি গেম</span><h1 class="rv">Games — খেলতে খেলতে শেখো</h1><p class="lead rv">Physics, Chemistry ও Higher Math-এর ধারণা অনুশীলন করো। প্রতিটি গেমে লক্ষ্য হলো বুঝে উত্তর দেওয়া—শুধু দ্রুত ট্যাপ করা নয়।</p><div class="arcade-feature-grid"><a class="arcade-feature" href="#/lab"><span class="arcade-feature-symbol" aria-hidden="true">⚗</span><span><b>Simulation Lab</b><small>চলক বদলাও, ফলাফল পর্যবেক্ষণ করো</small></span><strong>খুলুন →</strong></a><a class="arcade-feature" href="#/smart-practice"><span class="arcade-feature-symbol" aria-hidden="true">⌁</span><span><b>Smart Practice</b><small>ভুল প্রশ্ন আবার অনুশীলন করো</small></span><strong>খুলুন →</strong></a></div>'+(dg&&dg.id!=='chemistry-ion-challenge'?'<a class="card daily tilt rv" href="#/play/'+E(dg.id)+'"><span class="gico" style="--icon-hue:'+iconHue(dg.id)+'">'+E(gameIcon(dg))+'</span><div><span class="dtag">আজকের চ্যালেঞ্জ</span><h3>'+E(gameTitle(dg))+'</h3><p>'+E(doneToday?X('ar_done'):X('ar_daily_p'))+'</p></div><span class="go">এখন খেলুন →</span></a>':'')+groups.map(function(gr){var arr=rest.filter(function(x){return groupKey(x)===gr});if(gr==='রসায়ন'&&ion)arr.unshift(ion);if(!arr.length)return '';return'<section class="arcade-subject-section"><div class="arcade-subject-heading"><div><span>CONCEPTLAB ARCADE</span><h2>'+gr+'</h2></div><small>'+arr.length+'টি গেম</small></div><div class="gA g3 arcade-game-grid">'+arr.map(function(x,i){var rec=g.games[x.id]||{plays:0,best:0};return'<a class="card gm arcade-game-card" style="--icon-hue:'+iconHue(x.id)+'" href="#/play/'+E(x.id)+'"><span class="gico" style="--icon-hue:'+iconHue(x.id)+'">'+E(gameIcon(x))+'</span><span class="diff d-'+E(String(x.diff||'').toLowerCase())+'">'+E(x.diff||'')+'</span><h3>'+E(gameTitle(x))+'</h3><p>'+E(x.d)+'</p><div class="gmeta"><span>+'+(+x.xp||0)+' XP</span>'+(rec.plays?'<span>'+E(X('g_best'))+': '+rec.best+'</span><span>'+rec.plays+' বার খেলা</span>':'')+'</div><span class="go">খেলা শুরু →</span></a>'}).join('')+'</div></section>'}).join('')+'</div>'},
 lab:function(){
  var g=GS(),ls=LABS.filter(function(x){return x.on!==false&&x.on!=='0'});
  var physicsOrder=['ভৌত জগৎ ও পরিমাপ','ভেক্টর','গতিবিদ্যা','নিউটনীয় বলবিদ্যা','কাজ, শক্তি ও ক্ষমতা','মহাকর্ষ ও অভিকর্ষ','পদার্থের গাঠনিক ধর্ম','পর্যাবৃত্ত গতি','তরঙ্গ','আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব'];
  var chemOrder=['ল্যাবরেটরির নিরাপদ ব্যবহার','গুণগত রসায়ন','মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন','রাসায়নিক পরিবর্তন','কর্মমুখী রসায়ন'];
  var mathOrder=['ম্যাট্রিক্স ও নির্ণায়ক','ভেক্টর','সরলরেখা','বৃত্ত','বিন্যাস ও সমাবেশ','ত্রিকোণমিতিক অনুপাত','সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত','ফাংশন ও ফাংশনের লেখচিত্র','অন্তরীকরণ','যোগজীকরণ'];
  var physics=ls.filter(function(l){return labSubject(l.sub)==='পদার্থবিজ্ঞান';}).filter(function(l){return !/(optics|circuit|electricity|magnetic|magnetism|capacitor|electrostatic|photoelectric|induction)/i.test([l.id,l.sim,l.t,l.chapter,l.concept].join(' '));}),chemistry=ls.filter(function(l){return labSubject(l.sub)==='রসায়ন';}),maths=ls.filter(function(l){return labSubject(l.sub)==='উচ্চতর গণিত';});
  function blob(l){return [l.id,l.sim,l.t,l.title,l.chapter,l.concept,l.d,l.tip].join(' ').toLowerCase();}
  function physicsChapterFor(l){
   var raw=String(l.physicsChapter||l.chapter||'').trim(),aliases={'Vectors':'ভেক্টর','Vector':'ভেক্টর','Kinematics':'গতিবিদ্যা','Motion':'গতিবিদ্যা','Dynamics':'নিউটনীয় বলবিদ্যা','Newtonian Mechanics':'নিউটনীয় বলবিদ্যা','Work, Energy & Power':'কাজ, শক্তি ও ক্ষমতা','Work, Energy and Power':'কাজ, শক্তি ও ক্ষমতা','Gravitation':'মহাকর্ষ ও অভিকর্ষ','Gravity':'মহাকর্ষ ও অভিকর্ষ','Periodic Motion':'পর্যাবৃত্ত গতি','Oscillation':'পর্যাবৃত্ত গতি','Waves':'তরঙ্গ','Wave Motion':'তরঙ্গ','Ideal Gas':'আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব','Measurement':'ভৌত জগৎ ও পরিমাপ','Metrology':'ভৌত জগৎ ও পরিমাপ','Structure':'পদার্থের গাঠনিক ধর্ম','Fluids':'পদার্থের গাঠনিক ধর্ম'};
   raw=aliases[raw]||raw;if(physicsOrder.indexOf(raw)>=0)return raw;
   var z=blob(l);
   if(/vernier|screw.?gauge|caliper|measurement|metrology|unit.?conversion|significant|dimension|uncertainty|measurement-error/.test(z))return physicsOrder[0];
   if(/vector|river.?boat|dot.?product|cross.?product|components/.test(z))return physicsOrder[1];
   if(/free.?fall|falling.?object|projectile|tiger.?deer|bus.?train|relative.?motion|kinematic|motion.?graph|trajectory|two.?object/.test(z))return physicsOrder[2];
   if(/newton|force|friction|pulley|elevator|impulse|collision|momentum|gun.?bullet|recoil|circular.?motion|vertical.?circle|banking|inclined.?plane|conical.?pendulum/.test(z))return physicsOrder[3];
   if(/work|energy|power|efficiency|spring.?energy|work.?force/.test(z))return physicsOrder[4];
   if(/gravity|gravitation|satellite|orbital|orbit|escape.?velocity|gravitational.?potential|kepler/.test(z))return physicsOrder[5];
   if(/elastic|stress|strain|young|hydraulic|buoyancy|archimedes|bernoulli|fluid|viscos|capillary|surface.?tension|torricelli|pressure/.test(z))return physicsOrder[6];
   if(/shm|pendulum|oscillat|spring|periodic|harmonic/.test(z))return physicsOrder[7];
   if(/wave|sound|doppler|beat|resonance|standing/.test(z))return physicsOrder[8];
   if(/gas|molecular|rms|kinetic.?theory|thermodynamic|pv.?cycle|internal.?energy|ideal.?gas|maxwell/.test(z))return physicsOrder[9];
   return physicsOrder[2];
  }
  function chemistryChapterFor(l){var z=blob(l);
   if(/lab.?safety|safety|lab.?glass|glassware|chemical.?handling|waste.?disposal|hazard|first.?aid|lab.?procedure|laboratory/.test(z))return chemOrder[0];
   if(/periodic|bond|polarity|electron.?config|valence|orbital|shell|isotope|bohr|rutherford|atom.?basics|quantum|aufbau|hund|pauli/.test(z))return chemOrder[2];
   if(/qualitative|ion.?identification|wet.?test|flame|cation|anion|precipitat|ion.?detective|qualitative.?analysis|mass.?atlas/.test(z))return chemOrder[1];
   if(/kinetic|equilibrium|acid|base|titration|electrochem|electrolysis|redox|reaction|stoich|enthalpy|thermochem|ph\b|chemical.?change|reaction.?energy/.test(z))return chemOrder[3];
   return chemOrder[4];
  }
  function mathChapterFor(l){var z=blob(l);
   if(/matrix|matrices|determinant/.test(z))return mathOrder[0];
   if(/vector/.test(z))return mathOrder[1];
   if(/straight.?line|slope|line.?equation|line.?explorer/.test(z))return mathOrder[2];
   if(/circle|conic|radius|tangent.?circle/.test(z))return mathOrder[3];
   if(/permutation|combination|combinatoric|probability|factorial/.test(z))return mathOrder[4];
   if(/associated.?angle|compound.?angle|trig.?graph|trigonometric.?identity|unit.?circle/.test(z))return /associated|compound|graph/.test(z)?mathOrder[6]:mathOrder[5];
   if(/trig|sine|cosine|tangent|cotangent/.test(z))return mathOrder[5];
   if(/integration|integral|antiderivative/.test(z))return mathOrder[9];
   if(/differentiation|derivative|gradient|tangent|limit.?explorer/.test(z))return mathOrder[8];
   if(/function|complex|graph|conic|coordinate/.test(z))return mathOrder[7];
   return mathOrder[7];
  }
  function groupedPanel(key,order,items,mapper){var groups={};order.forEach(function(n){groups[n]=[];});items.forEach(function(l){var name=mapper(l);if(!groups[name])groups[name]=[];groups[name].push(l);});return'<section class="lab-subject-panel" data-lab-panel="'+key+'">'+order.map(function(name,idx){var arr=groups[name]||[];return'<section class="lab-subject-group" data-lab-group="'+E(key+'-'+idx)+'"><h2 class="subh">'+E(name)+' <small>'+arr.length+'টি</small></h2>'+(arr.length?'<div class="gA g3 lab-card-grid">'+arr.map(function(l,i){return card(l,i,name);}).join('')+'</div>':'<p class="mutt lab-empty-chapter">এই অধ্যায়ের সিমুলেশন যোগ করা হচ্ছে।</p>')+'</section>';}).join('')+'</section>';}
  function card(l,i,chapter){var ico=simIcon(l),title=simTitle(l),done=!!(g.sims[l.id]||g.sims[l.sim]);return'<a class="card gm tilt rv lab-sim-card" style="--d:'+(Math.min(i*.003,.08))+'s;--icon-hue:'+iconHue(l.id)+'" href="#/lab/'+E(l.id)+'"><span class="gico" aria-hidden="true">'+E(ico)+'</span>'+(done?'<span class="diff d-easy">✓ দেখা হয়েছে</span>':'')+'<h3>'+E(title)+'</h3><small class="lab-topic">'+E(chapter)+(l.concept&&l.concept!==chapter?' · '+E(l.concept):'')+'</small><p>'+E(l.d)+'</p><span class="go">সিমুলেশন খুলুন →</span></a>';}
  var physicsHtml=groupedPanel('phy',physicsOrder,physics,physicsChapterFor),chemHtml=groupedPanel('chem',chemOrder,chemistry,chemistryChapterFor),mathHtml=groupedPanel('math',mathOrder,maths,mathChapterFor);
  return'<div class="w pgw lab-page"><span class="pill rv"><i></i>🧪 ইন্টারঅ্যাকটিভ লার্নিং ল্যাব</span><h1 class="rv">সিমুলেশন</h1><p class="lead rv">শুধু বিষয় বেছে নিন। প্রতিটি বিষয়ের সিমুলেশন নির্ধারিত HSC ১ম পত্রের অধ্যায়ক্রমে সাজানো।</p><div class="subject-chooser rv" id="labSubjectChooser" role="tablist" aria-label="সিমুলেশনের বিষয়"><button type="button" class="subject-choice on" data-lab-subject="phy" role="tab" aria-selected="true"><span aria-hidden="true">⚛️</span><b>পদার্থবিজ্ঞান</b><small>'+physics.length+'টি সিমুলেশন</small></button><button type="button" class="subject-choice" data-lab-subject="chem" role="tab" aria-selected="false"><span aria-hidden="true">🧪</span><b>রসায়ন</b><small>'+chemistry.length+'টি সিমুলেশন</small></button><button type="button" class="subject-choice" data-lab-subject="math" role="tab" aria-selected="false"><span aria-hidden="true">📐</span><b>উচ্চতর গণিত</b><small>'+maths.length+'টি সিমুলেশন</small></button></div><div id="lbg" class="lab-subject-groups" style="margin-top:18px">'+physicsHtml+chemHtml.replace('data-lab-panel="chem"','data-lab-panel="chem" hidden')+mathHtml.replace('data-lab-panel="math"','data-lab-panel="math" hidden')+'</div><div class="lab-extra-link"><a class="btn" href="#/shortcuts">⚡ অধ্যায়ভিত্তিক Shortcut Tricks</a><a class="btn" href="#/graphs">📊 সব Graph Lab</a></div><p class="mutt lab-footnote">চলক বদলান, মডেল চালান এবং ফলাফল পর্যবেক্ষণ করুন। প্রতিটি অধ্যায়ের কার্ড থেকে সংশ্লিষ্ট সিমুলেশন খুলুন।</p></div>';
 },
 graphs:function(){return window.CL_GRAPHS?window.CL_GRAPHS.renderList():'<div class="w pgw"><h1>Graph Lab</h1><p>গ্রাফ ক্যাটালগ লোড করা যায়নি।</p></div>'},
 shortcuts:function(){return window.CL_SHORTCUTS?window.CL_SHORTCUTS.renderList():'<div class="w pgw"><h1>Shortcut Tricks</h1><p>শর্টকাট ক্যাটালগ লোড করা যায়নি।</p></div>'},
 progress:function(){var g=GS(),l=lvl(g.xp),pc=Math.round(l.into/l.size*100),perf=metric('perfect',g);
  var rows=Object.keys(C).map(function(k){var n=cnt(k);return'<a class="card prow" href="#/chapter/'+E(k)+'"><div><b>'+E(C[k].t)+'</b> <span class="mutt">· '+E(SUB[C[k].s]||'')+'</span><div class="bar"><i style="width:'+n*25+'%"></i></div></div><small>'+E(X('ch_prog').replace('{n}',n))+'</small></a>'}).join('');
  return'<div class="w pgw" style="max-width:860px"><h1 class="rv">'+E(X('pr_h'))+'</h1><p class="lead rv">'+E(X('pr_lead'))+'</p><div class="card lvcard rv"><div class="lring" style="--pct:'+pc+'"><b>'+l.n+'</b><small>'+E(X('pr_level'))+'</small></div><div class="lvt"><h3>'+g.xp+' XP</h3><p>'+(l.size-l.into)+' XP → '+E(X('pr_level'))+' '+(l.n+1)+'</p><div class="bar"><i style="width:'+pc+'%"></i></div><p class="streak">🔥 '+g.streak+' '+E(X('pr_streak'))+'</p></div></div>'
  +'<div class="stats4">'+[[tot(),X('pr_stages')],[Object.keys(g.sims).length,X('pr_sims')],[metric('games',g),X('pr_games')],[perf,X('pr_perfect')]].map(function(s,i){return'<div class="card rv" style="--d:'+i*.06+'s"><b data-count="'+s[0]+'">0</b><span>'+E(s[1])+'</span></div>'}).join('')+'</div>'
  +progressExtras()+'<h2 class="mt subh">'+E(X('pr_badges'))+'</h2><div class="badges">'+(GAM.badges||[]).map(function(b,i){var got=g.badges[b.id];return'<div class="card bdg tilt rv'+(got?' got':'')+'" style="--d:'+i*.04+'s"><span class="bi">'+E(b.i)+'</span><b>'+E(b.t)+'</b><small>'+E(b.d)+'</small><i>'+(got?'✓':'🔒')+'</i></div>'}).join('')+'</div>'
  +'<h2 class="mt subh">'+E(X('pr_chapters'))+'</h2>'+rows+'<p style="margin-top:34px"><button class="btn" data-reset>'+E(X('pr_reset'))+'</button></p></div>'},
 leaderboard:function(){var g=GS();return'<div class="w pgw leaderboard-page"><div class="leader-intro"><span class="pill"><i></i>STUDENT RANKINGS</span><h1>Leaderboard</h1><p class="lead">Celebrate progress, one concept at a time.</p></div><div class="leader-summary"><div><span class="stat-label">Your device XP</span><strong>'+Math.max(0,Number(g.xp)||0)+'</strong><span class="stat-label">XP earned here</span></div><div><span class="stat-label">Ranking status</span><strong id="leaderCount">—</strong><span class="stat-label">student accounts</span></div></div><div id="leaderboardData" class="leaderboard-data"><div class="leader-loading"><span class="loader-dot"></span> Loading student rankings…</div></div><p class="leader-note">Rankings are based on XP saved to ConceptLab accounts. Progress stored only on this device is shown separately.</p></div>'},
 about:function(){return'<div class="w pgw about-page" style="max-width:900px"><div class="about-hero rv"><span class="eyebrow">✦ CONCEPTLAB · ABOUT THE PROJECT</span><h1>'+E(X('ab_h'))+'</h1><p class="lead" style="max-width:none">'+E(S.about)+'</p>'+(S.aboutImg?'<img class="cv" src="'+E(S.aboutImg)+'" alt="ConceptLab project">':'')+'</div><div class="about-grid"><section class="card about-card rv"><span class="about-icon" aria-hidden="true">◎</span><h2>উদ্দেশ্য ও লক্ষ্যপাঠক</h2><p>ConceptLab-এর লক্ষ্য হলো সূত্র মুখস্থ করার বদলে ধারণা বোঝা—বাস্তব উদাহরণ, ধাপে ধাপে ব্যাখ্যা, কুইজ, গেম ও ইন্টারঅ্যাকটিভ সিমুলেশনের মাধ্যমে। এটি মূলত HSC পর্যায়ের Physics, Chemistry ও Higher Mathematics-এর শিক্ষার্থীদের জন্য তৈরি; কৌতূহলী অন্য শিক্ষার্থীরাও ব্যবহার করতে পারে।</p></section><section class="card about-card rv"><span class="about-icon" aria-hidden="true">☑</span><h2>কনটেন্ট তৈরি ও যাচাই</h2><p>শেখার উপকরণগুলো অধ্যায় ও কনসেপ্ট অনুযায়ী সাজানো হয়। প্রকাশের আগে সূত্র, একক, উদাহরণ ও কুইজের উত্তর মিলিয়ে দেখা উচিত; ইন্টারঅ্যাকটিভ মডেলগুলোকে ধারণা বোঝানোর সহায়ক হিসেবে ব্যবহার করুন, পরীক্ষাগারের বাস্তব পরিমাপের বিকল্প হিসেবে নয়। ভুল বা অস্পষ্ট কিছু চোখে পড়লে নিচের মতামত ফর্মে জানাতে পারেন।</p></section><section class="card about-card rv"><span class="about-icon about-icon-person" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><circle cx="12" cy="7" r="3.2"/><path d="M5 21v-2.2a7 7 0 0 1 14 0V21Z"/><path d="M8.7 4.9 9.5 3h5l.8 1.9"/></svg></span><h2>নির্মাতা</h2><p>ConceptLab তৈরি করেছেন Taimur Shams &amp; Moshiur Rahman Araf—একটি স্বাধীন, শিক্ষার্থী-পরিচালিত শিক্ষামূলক প্রজেক্ট হিসেবে। উদ্দেশ্য হলো বাংলা ভাষায় সহজবোধ্য ও ধারণাভিত্তিক বিজ্ঞান ও গণিত শেখার অভিজ্ঞতা তৈরি করা।</p><p class="mutt">যোগাযোগের ইমেইল সাইটের মালিক/অ্যাডমিনের কাছ থেকে নিশ্চিত করে যোগ করা হবে; কোনো অযাচাইকৃত ঠিকানা দেখানো হচ্ছে না।</p></section><section class="card about-card rv" id="feedback"><span class="about-icon about-icon-feedback" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.8A2.5 2.5 0 0 1 4 13.5Z"/><path d="M8 8h8M8 11.5h5"/></svg></span><h2>মতামত ও সমস্যা জানান</h2><p>কোনো ভুল, কাজ না করা বাটন বা নতুন ফিচারের পরামর্শ থাকলে সরাসরি এখানে পাঠান। আপনার বার্তা ConceptLab-এর Admin Panel-এর Feedback বিভাগে জমা হবে।</p><form id="feedbackForm" class="feedback-form"><label class="feedback-label" for="feedbackName">আপনার নাম (ঐচ্ছিক)</label><input id="feedbackName" name="name" maxlength="80" autocomplete="name" placeholder="নাম লিখুন"><label class="feedback-label" for="feedbackEmail">ইমেইল (ঐচ্ছিক)</label><input id="feedbackEmail" name="email" type="email" maxlength="254" autocomplete="email" placeholder="প্রয়োজনে যোগাযোগের জন্য"><label class="feedback-label" for="feedbackText">আপনার বার্তা</label><textarea id="feedbackText" name="message" rows="4" minlength="5" maxlength="2000" required placeholder="পেজের নাম, কী সমস্যা হয়েছে এবং কী আশা করেছিলেন লিখুন…"></textarea><div class="feedback-honey" aria-hidden="true"><label>Leave this field empty<input name="website" tabindex="-1" autocomplete="off"></label></div><p id="feedbackStatus" class="mutt" role="status" aria-live="polite"></p><button class="btn pri" type="submit" id="sendFeedback">বার্তা পাঠান ↗</button></form></section></div><section class="card about-legal rv"><h2>Privacy Policy — গোপনীয়তা</h2><p>ConceptLab অ্যাকাউন্ট ব্যবহার করলে নাম, ইমেইল, প্রতিষ্ঠান এবং শেখার XP/প্রগতি সংরক্ষিত হতে পারে। পাসওয়ার্ড সরাসরি প্রদর্শন করা হয় না। Leaderboard-এ নাম ও XP দেখানো হতে পারে। ব্যক্তিগত তথ্য শেয়ার করার আগে ভেবে নিন এবং প্রোফাইল/প্রাইভেসি নিয়ন্ত্রণের উপলভ্য বিকল্প ব্যবহার করুন।</p><h2>Terms of Use — ব্যবহারের শর্ত</h2><p>ConceptLab শিক্ষামূলক সহায়ক। সিমুলেশন ও কুইজ শেখার জন্য; পরীক্ষার আগে আপনার বোর্ড/প্রতিষ্ঠানের নির্ধারিত সিলেবাস ও নির্ভরযোগ্য পাঠ্যবইয়ের সঙ্গে মিলিয়ে নিন। সাইটের অপব্যবহার, অন্যের অ্যাকাউন্টে প্রবেশের চেষ্টা বা ভুল তথ্য ইচ্ছাকৃতভাবে ছড়ানো থেকে বিরত থাকুন। এই সারাংশ পূর্ণাঙ্গ আইনি পরামর্শ নয়।</p><p class="mutt">গোপনীয়তা বা ব্যবহারের শর্ত নিয়ে প্রশ্ন/সংশোধনের জন্য মতামত ফর্ম ব্যবহার করুন।</p></section></div>'}
};
function chapterListPage(encoded){var key='';try{key=decodeURIComponent(encoded||'')}catch(e){key=encoded||''}var bits=key.split('|'),sub=bits.shift()||'',title=bits.join('|'),items=chItems(sub,title);if(!items.length)return pages.chapters();
 var st=chStat(items),titles=[];(L[sub]||[]).forEach(function(c){var t=chTitle(c);if(!(c.id==='qualitative-chemistry'&&CHL.some(function(x){return x.id==='qc-01'}))&&titles.indexOf(t)<0)titles.push(t)});var ix=titles.indexOf(title),prev=ix>0?titles[ix-1]:null,next=ix>=0&&ix<titles.length-1?titles[ix+1]:null;
 var cont=st.next?'<a class="btn pri" href="#/chapter/'+E(st.next.id)+'">'+(st.started?'চালিয়ে যান':'প্রথম কনসেপ্ট শুরু করুন')+': '+E(st.next.t)+' →</a>':'<span class="bd2">✓ এই অধ্যায়ের সব চালু কনসেপ্ট সম্পন্ন</span>';
 return '<div class="w pgw"><a class="bk" href="#/chapters">← সব অধ্যায়</a><span class="pill">'+E(SUB[sub]||'')+'</span><h1 class="rv">'+E(title)+'</h1><p class="lead rv">এই অধ্যায়ের কনসেপ্টগুলো ক্রমানুসারে শিখুন। প্রতিটি কনসেপ্টে ব্যাখ্যা, ইন্টারঅ্যাকটিভ সিমুলেশন ও কুইজ রয়েছে।</p>'+(st.av?'<div class="card chapter-progress"><div><b>'+st.pct+'%</b><span>'+st.full+'/'+st.av+' কনসেপ্ট সম্পন্ন</span><div class="bar"><i style="width:'+st.pct+'%"></i></div></div><div>'+cont+'</div></div>':'')
  +'<div class="chapter-concept-list">'+items.map(function(c,i){var a=c.status==='available',n=a?cnt(c.id):0;return (a?'<a href="#/chapter/'+E(c.id)+'"':'<div')+' class="card concept-index-row '+(a?'av':'')+'"><span class="concept-index-num">'+String(i+1).padStart(2,'0')+'</span><div><h3>'+E(c.t)+'</h3><p>'+(a?'চারটি স্টেজ · '+(c.q||[]).length+'টি MCQ · '+n+'/4 ধাপ'+(n>=4?' ✓':''):'শীঘ্রই আসছে')+'</p>'+(a?'<div class="bar"><i style="width:'+n*25+'%"></i></div>':'')+'</div>'+(a?'<span class="go">'+(n>=4?'আবার দেখুন →':n>0?'চালিয়ে যান →':'শুরু করুন →')+'</span>':'<span class="bd2">Coming soon</span>')+'</'+(a?'a':'div')+'>'}).join('')+'</div>'
  +'<nav class="chapter-pn" aria-label="অধ্যায় নেভিগেশন">'+(prev?'<a class="btn" href="#/chapter-list/'+encodeURIComponent(sub+'|'+prev)+'">← '+E(prev)+'</a>':'<span></span>')+(next?'<a class="btn" href="#/chapter-list/'+encodeURIComponent(sub+'|'+next)+'">'+E(next)+' →</a>':'<span></span>')+'</nav></div>'}

function chapter(id){var c=C[id];if(!c)return pages.chapters();var peers=CHL.filter(function(x){return x.s===c.s&&String(x.chapterTitle||x.chapter||x.t||'Chapter').trim()===String(c.chapterTitle||c.chapter||c.t||'Chapter').trim()&&!(x.id==='qualitative-chemistry'&&CHL.some(function(y){return y.id==='qc-01'}))});var pos=peers.findIndex(function(x){return x.id===id});return'<div class="w pgw concept-page" style="max-width:860px"><a class="bk" href="#/chapter-list/'+E(encodeURIComponent(c.s+'|'+String(c.chapterTitle||c.chapter||c.t||'Chapter').trim()))+'">← অধ্যায়ের কনসেপ্ট তালিকা</a><div class="mutt">'+E(SUB[c.s]||'')+' · '+E(c.chapterTitle||c.chapter||'Chapter')+'</div><div class="concept-position">CONCEPT '+(pos+1)+' OF '+peers.length+'</div><h1 class="ctitle">'+E(c.t)+'</h1><button type="button" class="btn study-bookmark-btn" data-study-bookmark-concept="'+E(id)+'">'+(STUDY().bookmarks[id]?'🔖 Bookmarked · Remove':'🔖 Bookmark this concept')+'</button>'+(c.cover?'<img class="cv" src="'+E(c.cover)+'" alt="">':'')+'<div class="mutt" id="pg"></div><div class="bar"><i id="pb"></i></div><div class="tabs" id="tabs"></div><div id="stg"></div><div id="conceptNav" class="concept-nav"></div></div>'}
function gamePage(id){var g=GAMES.filter(function(x){return x.id==id&&x.on!==false&&x.on!=='0'})[0];if(!g)return pages.play();var ion=g.id==='chemistry-ion-challenge',help='',outerNav=ion?'':'<a class="bk" href="#/play">'+E(X('btn_arcade'))+'</a>',outerTitle=ion?'':'<div class="gh2"><span class="gico big" style="--icon-hue:'+iconHue(g.id)+'">'+E(gameIcon(g))+'</span><div><h1 class="ctitle" style="margin:0">'+E(gameTitle(g))+'</h1><p class="mutt" style="margin:6px 0 0">'+E(g.d)+'</p></div></div>';return'<div class="w pgw play-detail-page game-type-'+E(g.type)+'" style="max-width:900px">'+outerNav+outerTitle+help+'<div id="gm"></div></div>'}
function physicsShortcutHtml(l){if(!l||labSubject(l.sub)!=='পদার্থবিজ্ঞান')return'';var ch=l.physicsChapter||l.chapter||'',rows=[];
 if(ch.indexOf('ভেক্টর')>=0||/vector/i.test(ch)){rows=[['উপাংশ পদ্ধতি','Rₓ = ΣAₓ, Rᵧ = ΣAᵧ; R = √(Rₓ² + Rᵧ²)।'],['ত্রিভুজ সূত্র','প্রথম ভেক্টরের মাথায় দ্বিতীয়টির লেজ বসান; লব্ধি = প্রথমটির লেজ থেকে শেষটির মাথা।'],['সামান্তরিক সূত্র','দুটি ভেক্টর একই বিন্দু থেকে আঁকুন; কর্ণই লব্ধি। R = √(A²+B²+2AB cos θ)।'],['বহুভুজ সূত্র','অনেকগুলো ভেক্টর head-to-tail বসান। বন্ধ বহুভুজ হলে লব্ধি শূন্য।'],['দ্রুত বিশেষ ফল','একই দিকে: R=A+B; বিপরীত দিকে: R=|A−B|; লম্ব হলে: R=√(A²+B²)।']];}
 else if(ch.indexOf('গতিবিদ্যা')>=0||/kinematic|motion/i.test(ch)){rows=[['বেগ-সময় গ্রাফ','ঢাল = ত্বরণ; চিহ্নযুক্ত ক্ষেত্রফল = সরণ; |v|-এর ক্ষেত্রফল = মোট দূরত্ব।'],['সমান উচ্চতায় প্রক্ষেপণ','T=2u sinθ/g, H=u²sin²θ/(2g), R=u²sin2θ/g।'],['সর্বোচ্চ পাল্লা','একই উচ্চতায় নিক্ষেপ ও পতন, বায়ুর বাধা উপেক্ষা করলে θ=45°-এ পাল্লা সর্বোচ্চ।'],['পড়ন্ত বস্তু','স্থির অবস্থা থেকে t=√(2h/g), আঘাতের ঠিক আগে v=√(2gh)।']];}
 else if(ch.indexOf('নিউটনীয়')>=0||/dynamic|newton/i.test(ch)){rows=[['নিট বল','আগে সব বলের উপাংশ যোগ করুন, তারপর ΣF=ma প্রয়োগ করুন।'],['ঘর্ষণ','গতীয় ঘর্ষণ fₖ=μₖN; স্থিতি ঘর্ষণ প্রয়োজনমতো বদলায় এবং সর্বোচ্চ μₛN।'],['সংঘর্ষ','বিচ্ছিন্ন ব্যবস্থায় মোট ভরবেগ সংরক্ষিত; গতিশক্তি সব সংঘর্ষে সংরক্ষিত নয়।']];}
 else if(ch.indexOf('কাজ, শক্তি')>=0||/energy|power/i.test(ch)){rows=[['কাজ-শক্তি','নিট কাজ W_net = ΔK; বেগ দ্বিগুণ হলে গতিশক্তি চারগুণ।'],['উচ্চতা থেকে বেগ','ঘর্ষণহীন অবস্থায় h উচ্চতা থেকে নামলে v=√(2gh), ভরের ওপর নির্ভর করে না।'],['ক্ষমতা','একই দিকে বল ও বেগ হলে P=Fv; ধ্রুব ক্ষমতায় কাজ W=Pt।']];}
 else if(ch.indexOf('মহাকর্ষ')>=0||/gravitation|gravity/i.test(ch)){rows=[['দূরত্ব দ্বিগুণ','মহাকর্ষ বল ও g-এর কেন্দ্রীয়-বাইরের মডেল ১/৪ হয়, যদি কেন্দ্রীয় ভর একই থাকে।'],['বৃত্তাকার কক্ষপথ','v=√(GM/r); মোট শক্তি E=−GMm/(2r)।'],['মুক্তিবেগ','vₑ=√(2GM/R)=√2·v_orbit (একই ব্যাসার্ধে)।']];}
 else if(ch.indexOf('গাঠনিক')>=0||/fluid|elastic|structure/i.test(ch)){rows=[['স্থিতিস্থাপকতা','স্থিতিস্থাপক সীমায় পীড়ন ∝ বিকৃতি; গ্রাফের ঢাল ইয়ং গুণাঙ্ক।'],['তরল চাপ','একই তরলে গভীরতা দ্বিগুণ হলে গেজ চাপ দ্বিগুণ: P=ρgh।'],['প্রবাহ','অসংকোচনীয় স্থির প্রবাহে A₁v₁=A₂v₂।']];}
 else if(ch.indexOf('পর্যাবৃত্ত')>=0||/periodic|oscillation/i.test(ch)){rows=[['সরল দোলক','ক্ষুদ্র দোলনে T∝√L; দৈর্ঘ্য চারগুণ হলে পর্যায়কাল দ্বিগুণ।'],['স্প্রিং-ভর','T=2π√(m/k); ভর চারগুণ হলে পর্যায়কাল দ্বিগুণ।'],['SHM','সাম্য অবস্থানে বেগ সর্বাধিক, প্রান্তে বেগ শূন্য।']];}
 else if(ch.indexOf('তরঙ্গ')>=0||/wave/i.test(ch)){rows=[['তরঙ্গ সমীকরণ','v=fλ; একই মাধ্যমে বেগ স্থির থাকলে কম্পাঙ্ক দ্বিগুণ হলে তরঙ্গদৈর্ঘ্য অর্ধেক।'],['বিট','fᵦ=|f₁−f₂|।'],['দশা পার্থক্য','এক পূর্ণ তরঙ্গদৈর্ঘ্যের পথ পার্থক্য 2π রেডিয়ানের সমান।']];}
 else if(ch.indexOf('গ্যাস')>=0||/gas/i.test(ch)){rows=[['তাপমাত্রা','গ্যাসের সূত্রে তাপমাত্রা অবশ্যই কেলভিনে নিন।'],['বয়েলের সূত্র','সমতাপে PV ধ্রুব; আয়তন অর্ধেক হলে চাপ দ্বিগুণ।'],['গতিতত্ত্ব','cᵣₘₛ∝√T এবং গড় গতিশক্তি ∝ T।']];}
 else {rows=[['সূত্রের শর্ত যাচাই','সমীকরণ ব্যবহারের আগে একক, দিক, ধ্রুব রাশি ও আদর্শীকরণ যাচাই করুন।'],['গ্রাফের শর্টকাট','ঢাল ও ক্ষেত্রফলের ভৌত অর্থ নির্ণয় করুন—শুধু বক্ররেখার আকৃতি নয়।']];}
 return'<details class="card physics-shortcuts"><summary>⚡ শর্টকাট ট্রিকস ও দ্রুত সূত্র</summary><div class="physics-shortcut-grid">'+rows.map(function(r){return'<div><b>'+E(r[0])+'</b><p>'+E(r[1])+'</p></div>';}).join('')+'</div><p class="mutt">শর্টকাট প্রয়োগের আগে প্রশ্নের শর্ত যাচাই করুন; সব সূত্র সব পরিস্থিতিতে প্রযোজ্য নয়।</p></details>'}
function labPage(id){var l=LABS.filter(function(x){return x.id==id&&x.on!==false&&x.on!=='0'})[0];if(!l)return pages.lab();var rel=Object.keys(C).filter(function(k){return C[k].sim==l.sim});
 return'<div class="w pgw lab-detail-page" style="max-width:1000px"><a class="bk" href="#/lab">'+E(X('lab_back'))+'</a><div class="gh2"><span class="gico big" style="--icon-hue:'+iconHue(l.id)+'">'+E(simIcon(l))+'</span><div><h1 class="ctitle" style="margin:0">'+E(simTitle(l))+'</h1><p class="mutt" style="margin:6px 0 0">'+E(l.d)+'</p><button type="button" class="btn study-save-sim-btn" data-study-save-sim="'+E(l.id)+'">'+(STUDY().savedSims[l.id]?'✓ সংরক্ষিত · সরান':'＋ সিমুলেশন সংরক্ষণ')+'</button></div></div><div class="card simcard" id="sim"></div>'+(l.tip?'<div class="card tipc"><b>💡 '+E(X('lab_tip'))+':</b> '+E(l.tip)+'</div>':'')+physicsShortcutHtml(l)+(rel.length?'<p class="mutt" style="margin-top:22px">'+E(X('lab_rel'))+': '+rel.map(function(k){return'<a class="lnk" href="#/chapter/'+E(k)+'">'+E(C[k].t)+'</a>'}).join(', ')+'</p>':'')+'</div>'}

/* ------------------------------------------------------------ chapter stages */
function once(fn){var d=false;return function(){if(d)return;d=true;fn()}}
function simInto(el,key,c,done){
 if(key=='custom'){el.innerHTML='<iframe class="sf" sandbox="allow-scripts"></iframe>';el.firstChild.srcdoc=(c&&c.html)||'';done();return}
 var f=window.CL_SIMS[key];if(!f){el.innerHTML='<p class="bn">সিমুলেশন শীঘ্রই আসছে।</p>';done();return}
 el.innerHTML='';try{f(el,done)}catch(e){console.error(e);el.innerHTML='<p class="bn">Simulation could not start.</p>'}
 if(el.id==='sim'&&window.matchMedia&&window.matchMedia('(max-width: 700px)').matches){
  var old=document.getElementById('mobileSimControlJump');if(old)old.remove();
  var topControls=el.querySelector(':scope > .ctl, :scope > .lens-controls-host, :scope > .mirror-controls-host, :scope > .fl-controls');
  var directCanvas=el.querySelector(':scope > canvas.cv2');
  /* Direct-canvas labs now display their control panel first via CSS; retain a jump only for nested layouts. */
  if(!(topControls&&directCanvas)&&!el.querySelector('.metrology-lab')){
   var jump=document.createElement('button');jump.type='button';jump.id='mobileSimControlJump';jump.className='mobile-sim-control-jump';jump.textContent='কন্ট্রোলে যান ↓';jump.setAttribute('aria-label','সিমুলেশনের কন্ট্রোলে যান');
   jump.addEventListener('click',function(){var root=document.getElementById('sim');if(!root)return;var target=root.querySelector('.ctl')||root.querySelector('.fl-controls')||root.querySelector('.lens-controls-host')||root.querySelector('.mirror-controls-host')||root.querySelector('.chips')||root.querySelector('input[type=range]')||root.querySelector('button')||root;target.scrollIntoView({behavior:'smooth',block:'center'});if(target.matches('input,button')){try{target.focus({preventScroll:true})}catch(e){target.focus()}}});
   var firstControl=el.querySelector('.ctl, .fl-controls, .lens-controls-host, .mirror-controls-host, .chips, .ro, input[type=range], button');
   if(firstControl)el.insertBefore(jump,firstControl);else el.appendChild(jump);
  }
 }
}
function refreshBar(id){var n=cnt(id),a=$('#pg'),b=$('#pb');if(a)a.textContent=X('ch_prog').replace('{n}',n);if(b)b.style.width=n*25+'%'}
function stage(id,i){var c=C[id],h=$('#stg');if(!h)return;try{sessionStorage.setItem('st'+id,i)}catch(e){}
 $('#tabs').innerHTML=ST.map(function(s,j){return'<button class="tab'+(j==i?' on':'')+((P()[id]||[])[j]?' dn':'')+'" data-i="'+j+'"><small>'+(j+1)+'</small>'+E(s)+'</button>'}).join('');
 refreshBar(id);
 if(i<2){h.innerHTML='<div class="stgin concept-explanation"><h2 class="stgh">'+E(ST[i])+'</h2><div class="concept-reading-label">'+(i?'মূল ধারণা ও গুরুত্বপূর্ণ তথ্য':'বাস্তব উদাহরণ থেকে ধারণা')+'</div><p class="bn bl">'+E(i?c.intu:c.hook)+'</p>'+(i?BL(c):'')+'<button class="btn pri" data-n="'+(i+1)+'">'+E(X('btn_next'))+' →</button></div>';mark(id,i);refreshBar(id);$('#tabs').children[i].classList.add('dn')}
 else if(i==2){h.innerHTML='<div class="stgin"><h2 class="stgh">'+E(ST[2])+'</h2><div class="card simcard" id="sim"></div><div class="stage-next-wrap"><p class="mutt">সিমুলেশনটি পরীক্ষা করার পর পরবর্তী ধাপে যান।</p><button type="button" class="btn pri" data-n="3">'+E(X('btn_next'))+' →</button></div></div>';simInto($('#sim'),c.sim,c,once(function(){mark(id,2);if(c.sim&&c.sim!='none'&&c.sim!='custom')markSim(c.sim);refreshBar(id);var t=$('#tabs').children[2];if(t)t.classList.add('dn')}))}
 else quiz(id,h);var nav=$('#conceptNav');if(nav){var peers=CHL.filter(function(x){return x.s===c.s&&String(x.chapterTitle||x.chapter||x.t||'Chapter').trim()===String(c.chapterTitle||c.chapter||c.t||'Chapter').trim()&&!(x.id==='qualitative-chemistry'&&CHL.some(function(y){return y.id==='qc-01'}))}),ix=peers.findIndex(function(x){return x.id===id}),prev=ix>0?peers[ix-1]:null,next=ix>=0&&ix<peers.length-1?peers[ix+1]:null;nav.innerHTML='<span class="concept-nav-count">Concept '+(ix+1)+' of '+peers.length+'</span><div class="concept-nav-buttons">'+(prev&&C[prev.id]?'<a class="btn" href="#/chapter/'+E(prev.id)+'">← Previous concept</a>':'<span></span>')+(next&&C[next.id]?'<a class="btn pri" href="#/chapter/'+E(next.id)+'">Next concept →</a>':'<a class="btn" href="#/chapters">All chapters →</a>')+'</div>';}FX.scan(h)}
function quiz(id,h){var c=C[id],got=0,ans=0,quizStartedAt=Date.now();if(!c.q.length){h.innerHTML='<div class="stgin"><h2 class="stgh">'+E(ST[3])+'</h2><p class="bn">কুইজ শীঘ্রই আসছে।</p></div>';mark(id,3);refreshBar(id);return}
 h.innerHTML='<div class="stgin"><h2 class="stgh">'+E(ST[3])+'</h2>'+c.q.map(function(q,n){return'<div class="card qcard" data-q="'+n+'"><p class="bn qt">'+(n+1)+'. '+E(q.q)+'</p>'+optOrder(q).map(function(k){return'<button class="opt" data-k="'+k+'">'+E(q.o[k])+'</button>'}).join('')+'<p class="ex"></p></div>'}).join('')+'<p id="sc" class="bn scr"></p><p class="ex">'+E(c.ref||X('ref_note'))+'</p></div>';
 $$('[data-q]',h).forEach(function(b){var q=c.q[+b.dataset.q];b.onclick=function(e){var o=e.target.closest('.opt');if(!o||b.dataset.d)return;b.dataset.d=1;ans++;var k=+o.dataset.k;if(k==+q.a){got++;o.classList.add('ok')}else{o.classList.add('no');var cr=b.querySelector('.opt[data-k="'+(+q.a)+'"]');if(cr)cr.classList.add('ok');studyMistake(id,+b.dataset.q,k)}b.querySelector('.ex').textContent=(k==+q.a?'✔ ':'✘ সঠিক উত্তর: '+q.o[+q.a]+'। ')+(q.e||'');track(1);
  if(ans==c.q.length){var perfect=got==c.q.length;$('#sc').innerHTML='আপনার স্কোর: <b>'+got+' / '+c.q.length+'</b>'+(perfect?' 🏆':'');var g=GS(),prev=(g.quiz[id]||{got:0}).got;g.quiz[id]={got:Math.max(prev,got),total:c.q.length};save(g);studyRecord(id,got,c.q.length,Date.now()-quizStartedAt);if(got>prev)award((got-prev)*GAM.xpQuiz,'Quiz');if(perfect)FX.confetti();mark(id,3);refreshBar(id);var t=$('#tabs').children[3];if(t)t.classList.add('dn');badges()}}})}

/* ------------------------------------------------------------ v6: practice, daily, missions, cloud sync */
function rerender(){var y=window.pageYOffset;route();window.scrollTo(0,y)}
var DAY=86400000,MGOAL={stages:'কনসেপ্ট ধাপ সম্পন্ন',quiz:'কুইজ সম্পন্ন',games:'গেম খেলা',sims:'আলাদা সিমুলেশন',daily:'ডেইলি চ্যালেঞ্জ (দিন)',xp:'মোট XP',perfect:'পারফেক্ট কুইজ',review:'ভুলের খাতায় সঠিক রিভিশন'};
var cloud={t:null,busy:false,status:'local',at:0,msg:'',ready:false};
function MIS(){var m={daily:{},claimed:{},activity:{},goal:5,stats:{reviewCorrect:0,mastered:0}};try{m=Object.assign(m,JSON.parse(localStorage.getItem('clmis_v1')||'{}'))}catch(e){}if(!m.daily||typeof m.daily!=='object')m.daily={};if(!m.claimed||typeof m.claimed!=='object')m.claimed={};if(!m.activity||typeof m.activity!=='object')m.activity={};m.stats=Object.assign({reviewCorrect:0,mastered:0},m.stats||{});m.goal=Math.max(1,Math.min(50,+m.goal||5));return m}
function saveMis(m){try{localStorage.setItem('clmis_v1',JSON.stringify(m))}catch(e){}cloudPush()}
function track(n){var m=MIS(),t=today();m.activity[t]=(m.activity[t]||0)+(n||1);var keys=Object.keys(m.activity).sort(function(a,b){return dayNum(a)-dayNum(b)});if(keys.length>60)keys.slice(0,keys.length-60).forEach(function(k){delete m.activity[k]});saveMis(m)}
function dayNum(k){var p=String(k).split('-');return new Date(+p[0],(+p[1]||1)-1,+p[2]||1).getTime()}
function PR(){var p=Object.assign({intervals:[1,3,7,14],sessionSize:10,stepHints:1},D.practice||{});p.intervals=(Array.isArray(p.intervals)?p.intervals:[1,3,7,14]).map(Number).filter(function(x){return x>=0}).slice(0,8);if(!p.intervals.length)p.intervals=[1,3,7,14];p.sessionSize=Math.max(1,Math.min(50,+p.sessionSize||10));return p}
function whenText(ts){var d=ts-Date.now();if(d<=0)return'এখনই';var h=Math.round(d/36e5);if(h<24)return h+' ঘণ্টা পর';var dd=Math.round(d/DAY);return dd+' দিন পর'}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function optOrder(q,seed){var n=q.o.length,idx=[],i;for(i=0;i<n;i++)idx.push(i);var keep=/কোনোটিই নয়|কোনটিই নয়|সবগুলো|All of the above|None of the above/i.test(String(q.o[n-1]||''))?n-1:n,r=seed?rng(hashStr(String(seed))):Math.random;for(i=keep-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=idx[i];idx[i]=idx[j];idx[j]=t}return idx}
function hintFor(c,q){if(q&&q.h&&String(q.h).trim())return String(q.h).trim();var h=String(c&&c.hook||'').replace(/\s+/g,' ').trim();if(!h)return'কনসেপ্টের “Core Intuition” ধাপটি আবার পড়ে দেখুন।';var cut=h.search(/[।.?!]/);var s=cut>20&&cut<170?h.slice(0,cut+1):h.slice(0,150)+'…';return s}
function shortWhy(q){return String((q&&q.e)||'').trim()}

/* ---- Smart practice: spaced revision */
function practiceItems(){return STUDY().review.filter(function(it){var c=C[it.conceptId];return c&&c.q&&c.q[it.qIndex]})}
function practiceCard(it,pr){var c=C[it.conceptId],q=c.q[it.qIndex],hard=(it.wrongCount||1)>=2,st=it.stage||0,order=optOrder(q).map(function(k){return{o:q.o[k],k:k}});
 return'<article class="card practice-card" data-practice-card="'+E(it.key)+'" data-concept="'+E(it.conceptId)+'" data-qi="'+it.qIndex+'"><span class="mutt">'+E(SUB[c.s]||'')+' · ভুল '+(it.wrongCount||1)+' বার · রিভিশন ধাপ '+(Math.min(st,pr.intervals.length)+1)+'/'+pr.intervals.length+'</span>'+(hard?' <span class="bd2 hardtag">কঠিন</span>':'')+'<h2>'+E(c.t)+'</h2><p class="bn qt">'+E(q.q)+'</p><div class="practice-options">'+order.map(function(x){return'<button class="opt" data-practice-answer data-key="'+E(it.key)+'" data-choice="'+x.k+'" data-correct="'+(+q.a)+'" data-concept="'+E(it.conceptId)+'">'+E(x.o)+'</button>'}).join('')+'</div>'+(hard&&pr.stepHints?'<div class="practice-help"><button class="btn sm" data-practice-help>🪜 ধাপে ধাপে সাহায্য (১/৩)</button></div>':'')+'<p class="practice-hint ex" hidden></p><p class="ex practice-result" aria-live="polite"></p><a href="#/chapter/'+E(it.conceptId)+'">কনসেপ্ট রিভিউ →</a></article>'}
function smartPractice(){var s=STUDY(),pr=PR(),m=MIS(),now=Date.now(),all=practiceItems(),due=all.filter(function(x){return x.dueAt<=now}).sort(function(a,b){return(b.wrongCount||1)-(a.wrongCount||1)||a.dueAt-b.dueAt}),later=all.filter(function(x){return x.dueAt>now}).sort(function(a,b){return a.dueAt-b.dueAt}),session=due.slice(0,pr.sessionSize);
 var stats='<div class="study-stats"><div class="card"><b>'+all.length+'</b><span>ভুলের খাতায়</span></div><div class="card"><b>'+due.length+'</b><span>এখন রিভিশন</span></div><div class="card"><b>'+all.filter(function(x){return(x.wrongCount||1)>1}).length+'</b><span>বারবার ভুল</span></div><div class="card"><b>'+(m.stats.mastered||0)+'</b><span>আয়ত্তে এসেছে</span></div></div>';
 var body=session.length?'<p class="lead" style="margin:14px 0">আজকের সেশন: '+session.length+'টি প্রশ্ন'+(due.length>session.length?' (আরও '+(due.length-session.length)+'টি পরে)':'')+'।</p><div class="practice-grid">'+session.map(function(it){return practiceCard(it,pr)}).join('')+'</div>':(all.length?'<section class="card study-panel"><h2>'+E(X('sp_done_h'))+'</h2><p>'+E(X('sp_done_p'))+'</p></section>':'<section class="card study-panel"><h2>'+E(X('sp_empty_h'))+'</h2><p>'+E(X('sp_empty_p'))+'</p><a class="btn pri" href="#/chapters">কুইজ অনুশীলন শুরু করুন →</a></section>');
 var upcoming=later.length?'<section class="card study-panel" style="margin-top:22px"><h2>⏰ পরবর্তী রিভিশন</h2><p class="mutt">রিভিশনের ব্যবধান: '+pr.intervals.map(function(d){return d+' দিন'}).join(' → ')+'</p>'+later.slice(0,12).map(function(it){var c=C[it.conceptId];return'<article class="study-history"><span>'+E(c.t)+'<small>'+E(shortWhy(c.q[it.qIndex])||'')+'</small></span><b>'+E(whenText(it.dueAt))+'</b><button class="btn sm" data-practice-now="'+E(it.key)+'">এখনই অনুশীলন</button></article>'}).join('')+'</section>':'';
 return'<div class="w pgw study-page"><span class="pill">SMART PRACTICE</span><h1>'+E(X('sp_h'))+'</h1><p class="lead">'+E(X('sp_lead'))+'</p>'+stats+body+upcoming+'</div>'}
function practiceAnswer(pa){var card=pa.closest('[data-practice-card]');if(!card||card.dataset.answered)return;card.dataset.answered='1';var key=pa.dataset.key,chosen=+pa.dataset.choice,c=C[pa.dataset.concept],qi=+card.dataset.qi,q=c&&c.q[qi];if(!q)return;var correct=+q.a,pr=PR(),st=STUDY(),m=MIS(),it=st.review.find(function(x){return x.key===key}),used=+card.dataset.help||0,res=card.querySelector('.practice-result');
 $$('[data-practice-answer]',card).forEach(function(b){b.disabled=true;if(+b.dataset.choice===correct)b.classList.add('ok')});
 var why=shortWhy(q),msg;
 if(chosen===correct){pa.classList.add('ok');if(it){it.correctReviews=(it.correctReviews||0)+1;m.stats.reviewCorrect=(m.stats.reviewCorrect||0)+1;if(!used)it.stage=(it.stage||0)+1;if((it.stage||0)>=pr.intervals.length){st.review=st.review.filter(function(x){return x.key!==key});m.stats.mastered=(m.stats.mastered||0)+1;msg='🏆 আয়ত্তে এসেছে! এটি ভুলের খাতা থেকে সরানো হলো।'}else{it.dueAt=Date.now()+pr.intervals[Math.min(it.stage||0,pr.intervals.length-1)]*DAY;msg='✔ সঠিক! পরের রিভিশন '+whenText(it.dueAt)+'।'+(used?' (সাহায্য নেওয়ায় ধাপ এগোয়নি)':'')}}else msg='✔ সঠিক!'}
 else{pa.classList.add('no');if(it){it.wrongCount=(it.wrongCount||1)+1;it.stage=0;it.lastWrongAt=Date.now();it.dueAt=Date.now()+pr.intervals[0]*DAY;msg='✘ সঠিক উত্তর: '+q.o[correct]+'। আবার রিভিশন '+whenText(it.dueAt)+'।'}else msg='✘ সঠিক উত্তর: '+q.o[correct]+'।'}
 if(res)res.textContent=msg+(why?' '+why:'');saveStudy(st);saveMis(m);track(1)}
function practiceHelp(btn){var card=btn.closest('[data-practice-card]');if(!card||card.dataset.answered)return;var lv=(+card.dataset.help||0)+1,c=C[card.dataset.concept],q=c&&c.q[+card.dataset.qi];if(!q||lv>3)return;card.dataset.help=lv;var hint=card.querySelector('.practice-hint');
 if(lv===1){hint.hidden=false;hint.textContent='💡 ইঙ্গিত: '+hintFor(c,q);btn.textContent='🪜 ধাপে ধাপে সাহায্য (২/৩): ভুল অপশন বাদ দিন'}
 else if(lv===2){var wrong=shuf($$('[data-practice-answer]',card).filter(function(b){return +b.dataset.choice!==+q.a}));wrong.slice(0,Math.max(0,wrong.length-1)>=2?2:1).forEach(function(b){b.disabled=true;b.classList.add('dim')});btn.textContent='🪜 ধাপে ধাপে সাহায্য (৩/৩): সঠিক উত্তর দেখুন'}
 else{var ok=$$('[data-practice-answer]',card).filter(function(b){return +b.dataset.choice===+q.a})[0];if(ok)ok.classList.add('hintok');btn.disabled=true;btn.textContent='সঠিক উত্তর চিহ্নিত হয়েছে'}}

/* ---- Daily challenge */
function DL(){return Object.assign({on:1,count:5,xp:30,bonus:20,hints:1,title:'',intro:'',pinned:[]},D.daily||{})}
function hashStr(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){var a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function dailySet(){var d=DL(),n=Math.max(1,Math.min(20,+d.count||5)),pool=[],pinned=[],seen={};(d.pinned||[]).forEach(function(k){var p=String(k).split(':'),c=C[p[0]],qi=+p[1];if(c&&c.q&&c.q[qi]&&!seen[k]){seen[k]=1;pinned.push({id:p[0],qi:qi})}});
 Object.keys(C).sort().forEach(function(id){C[id].q.forEach(function(q,qi){if(q.q&&q.o&&q.o.length>=2&&!seen[id+':'+qi])pool.push({id:id,qi:qi})})});var r=rng(hashStr('cl-daily-'+today())),out=pinned.slice(0,n);while(out.length<n&&pool.length){out.push(pool.splice(Math.floor(r()*pool.length),1)[0])}return out}
function dailyState(){var m=MIS(),t=today();m.daily[t]=m.daily[t]||{answers:{},hints:{},done:false,got:0,total:0};return{m:m,t:t,s:m.daily[t]}}
function dailyDays(m){return Object.keys(m.daily).filter(function(k){return m.daily[k]&&m.daily[k].done}).length}
function missionProgress(ms){var g=GS(),st=STUDY(),m=MIS();return(ms.goals||[]).map(function(go){var have=0,n=+go.n||1,sub=ms.s||'';switch(go.k){case'stages':have=sub?Object.keys(C).filter(function(id){return C[id].s===sub}).reduce(function(a,id){return a+cnt(id)},0):tot();break;case'quiz':have=st.history.filter(function(h){return!sub||h.subject===sub}).length;break;case'games':have=metric('games',g);break;case'sims':have=Object.keys(g.sims).length;break;case'daily':have=dailyDays(m);break;case'xp':have=g.xp;break;case'perfect':have=metric('perfect',g);break;case'review':have=m.stats.reviewCorrect||0;break}return{k:go.k,n:n,have:Math.min(have,n),raw:have}})}
function weekBars(){var m=MIS(),days=[],names=['রবি','সোম','মঙ্গল','বুধ','বৃহ','শুক্র','শনি'];for(var i=6;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);var k=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();days.push({n:names[d.getDay()],v:m.activity[k]||0})}var mx=Math.max(m.goal,Math.max.apply(null,days.map(function(x){return x.v})));return'<div class="weekbars" role="img" aria-label="গত ৭ দিনের প্রশ্ন-উত্তর">'+days.map(function(x){return'<div><i style="height:'+Math.round(x.v/mx*100)+'%" class="'+(x.v>=m.goal?'hit':'')+'"></i><b>'+x.v+'</b><small>'+x.n+'</small></div>'}).join('')+'</div>'}
function dailyPage(){var d=DL(),g=GS(),m=MIS();if(!ok(d.on))return'<div class="w pgw"><section class="card study-panel"><h1>ডেইলি চ্যালেঞ্জ</h1><p class="lead">এই মুহূর্তে ডেইলি চ্যালেঞ্জ বন্ধ আছে।</p><a class="btn pri" href="#/chapters">কনসেপ্ট দেখুন →</a></section></div>';
 var set=dailySet(),ds=dailyState(),s=ds.s,answered=Object.keys(s.answers).length,tdy=m.activity[today()]||0;
 var qs=set.length?set.map(function(it,i){var c=C[it.id],q=c.q[it.qi],a=s.answers[i],has=a!=null,hl=+s.hints[i]||0;
  return'<article class="card qcard daily-q" data-dq="'+i+'"><p class="mutt">'+E(SUB[c.s]||'')+' · '+E(c.t)+'</p><p class="bn qt">'+(i+1)+'. '+E(q.q)+'</p>'+optOrder(q,'d'+today()+'-'+i).map(function(k){var o=q.o[k],cls=has?(k===+q.a?' ok':(k===+a?' no':'')):'';return'<button class="opt'+cls+'" data-daily-answer="'+i+'" data-k="'+k+'"'+(has?' disabled':'')+'>'+E(o)+'</button>'}).join('')+(d.hints&&!has?'<button class="btn sm" data-daily-hint="'+i+'">💡 ইঙ্গিত'+(hl?' (দেখানো হয়েছে)':'')+'</button>':'')+(hl&&!has?'<p class="ex">💡 '+E(hintFor(c,q))+'</p>':'')+(has?'<p class="ex">'+(+a===+q.a?'✔ ':'✘ সঠিক উত্তর: '+E(q.o[+q.a])+'। ')+E(shortWhy(q))+'</p>':'')+'</article>'}).join(''):'<p class="mutt">এখনো কোনো প্রশ্ন নেই।</p>';
 var res=s.done?'<section class="card study-panel daily-done"><h2>🎯 আজকের চ্যালেঞ্জ সম্পন্ন: '+s.got+' / '+s.total+'</h2><p>আগামীকাল নতুন প্রশ্ন আসবে। ভুল প্রশ্নগুলো ভুলের খাতায় যোগ হয়েছে।</p><a class="btn" href="#/smart-practice">ভুলের খাতা →</a></section>':'';
 var ring='<div class="card goal-card"><div><b>'+tdy+' / '+m.goal+'</b><span>আজকের শেখার লক্ষ্য (প্রশ্ন)</span><div class="bar"><i style="width:'+Math.min(100,Math.round(tdy/m.goal*100))+'%"></i></div></div><label class="goal-pick">লক্ষ্য <select data-goal-set>'+[3,5,10,15,20,30].map(function(n){return'<option value="'+n+'"'+(n===m.goal?' selected':'')+'>'+n+' প্রশ্ন/দিন</option>'}).join('')+'</select></label></div>'+weekBars();
 var subs=['all'].concat(Object.keys(SUB));
 var ms=(D.missions||[]).filter(function(x){return ok(x.on===undefined?1:x.on)&&(missionF==='all'||!x.s||x.s===missionF)});
 var mhtml=ms.length?ms.map(function(x){var pg=missionProgress(x),done=pg.length&&pg.every(function(p){return p.have>=p.n}),claimed=m.claimed[x.id],pct=pg.length?Math.round(pg.reduce(function(a,p){return a+p.have/p.n},0)/pg.length*100):0;
  return'<article class="card mission'+(claimed?' claimed':'')+'"><div class="mission-head"><span class="gico">'+E(x.i||'🎯')+'</span><div><h3>'+E(x.t)+'</h3><p>'+E(x.d||'')+'</p></div>'+(x.s&&SUB[x.s]?'<span class="bd2">'+E(SUB[x.s])+'</span>':'')+'</div>'+pg.map(function(p){return'<div class="goalrow"><span>'+E(MGOAL[p.k]||p.k)+'</span><b>'+p.have+' / '+p.n+'</b><div class="bar"><i style="width:'+Math.round(p.have/p.n*100)+'%"></i></div></div>'}).join('')+'<div class="mission-foot"><span class="mutt">'+pct+'% সম্পন্ন · +'+(+x.xp||0)+' XP</span>'+(claimed?'<span class="bd2">✓ সম্পন্ন</span>':(done?'<button class="btn pri sm" data-mission-claim="'+E(x.id)+'">'+E(X('ms_claim'))+'</button>':(x.link?'<a class="btn sm" href="'+E(safeLink(x.link))+'">শুরু করুন →</a>':'')))+'</div>'+(x.hint?'<details class="mission-hint"><summary>💡 ইঙ্গিত</summary><p>'+E(x.hint)+'</p></details>':'')+'</article>'}).join(''):'<p class="mutt">এই বিষয়ে কোনো মিশন নেই।</p>';
 return'<div class="w pgw daily-page"><span class="pill"><i></i>DAILY CHALLENGE · MISSIONS</span><h1>'+E(d.title||'ডেইলি চ্যালেঞ্জ ও লার্নিং মিশন')+'</h1><p class="lead">'+E(d.intro||'প্রতিদিন নতুন প্রশ্ন, বিষয়ভিত্তিক মিশন আর নিজের শেখার লক্ষ্য—সবকিছু এক জায়গায়।')+'</p>'+ring
  +'<h2 class="mt subh">'+E(X('dl_today'))+' <small class="mutt">'+answered+' / '+set.length+' · '+(+d.xp||0)+' XP'+((+d.bonus||0)?' + '+(+d.bonus)+' বোনাস (নিখুঁত ও ইঙ্গিতবিহীন)':'')+'</small></h2><div class="daily-list">'+qs+'</div>'+res
  +'<h2 class="mt subh">'+E(X('ms_h'))+'</h2><div class="chips left" style="margin-bottom:14px">'+subs.map(function(k){return'<button class="chipb'+(missionF==k?' on':'')+'" data-mission-filter="'+E(k)+'">'+E(k=='all'?'সব':SUB[k])+'</button>'}).join('')+'</div><div class="mission-grid">'+mhtml+'</div></div>'}
var missionF='all';
function dailyAnswer(btn){var i=+btn.dataset.dailyAnswer,k=+btn.dataset.k,set=dailySet(),it=set[i];if(!it)return;var ds=dailyState(),s=ds.s;if(s.answers[i]!=null)return;var c=C[it.id],q=c.q[it.qi];s.answers[i]=k;s.total=set.length;if(k===+q.a)s.got=(s.got||0)+1;else studyMistake(it.id,it.qi,k);
 var all=Object.keys(s.answers).length===set.length;if(all&&!s.done){s.done=true;var d=DL(),perfect=s.got===set.length&&!Object.keys(s.hints).some(function(h){return+s.hints[h]>0}),xp=Math.round((+d.xp||0)*(s.got/set.length))+(perfect?(+d.bonus||0):0);s.xpAwarded=xp;saveMis(ds.m);track(1);if(xp>0)award(xp,'Daily challenge');if(perfect)FX.confetti();badges()}else{saveMis(ds.m);track(1)}rerender()}
function dailyHint(btn){var i=+btn.dataset.dailyHint,ds=dailyState();if(ds.s.answers[i]!=null)return;ds.s.hints[i]=1;saveMis(ds.m);rerender()}
function missionClaim(id){var ms=(D.missions||[]).filter(function(x){return x.id===id})[0],m=MIS();if(!ms||m.claimed[id])return;var pg=missionProgress(ms);if(!pg.length||!pg.every(function(p){return p.have>=p.n}))return;m.claimed[id]=Date.now();saveMis(m);if(+ms.xp>0)award(+ms.xp,'Mission: '+ms.t);FX.confetti();rerender()}

/* ---- Cloud sync (needs the Netlify function + a signed-in student) */
function refreshAccount(){var tk=studentToken();if(!tk)return Promise.resolve();return fetch('/api/student-profile',{headers:{Authorization:'Bearer '+tk},cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(d){if(!d||!d.user)return;var old=JSON.stringify(student()||{}),nw=JSON.stringify(d.user),changed=old!==nw;try{localStorage.setItem('clstudent',JSON.stringify(d.user))}catch(e){}var g=GS(),xp=Math.max(0,Number(d.user.xp)||0);if(g.xp!==xp){g.xp=xp;try{localStorage.setItem('cl2',JSON.stringify(g))}catch(e){}chip()}syncAccountHeader();var ae=document.activeElement;if(changed&&/^#\/profile/.test(location.hash)&&!(ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName)))rerender()}).catch(function(){})}
function refreshAll(){if(document.hidden||!studentToken())return;refreshAccount();if(cloud.ready)cloudPull(true);else cloudPull(true)}
document.addEventListener('visibilitychange',function(){if(!document.hidden)refreshAll()});window.addEventListener('focus',refreshAll);window.addEventListener('online',refreshAll);setInterval(refreshAll,30000);

function cloudSnapshot(){var g=JSON.parse(JSON.stringify(GS()));delete g.xp;return{cl:P(),cl2:g,study:STUDY(),mis:MIS()}}
function cloudPush(){if(cloud.busy||!studentToken()||!cloud.ready)return;clearTimeout(cloud.t);cloud.t=setTimeout(cloudPushNow,2500)}
function cloudPushNow(){var tk=studentToken();if(!tk)return Promise.resolve();return fetch('/api/student-sync',{method:'PUT',headers:{'content-type':'application/json',Authorization:'Bearer '+tk},body:JSON.stringify({data:cloudSnapshot()})}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(r.status===401){cloud.status='signin';cloud.msg='আবার সাইন-ইন করুন'}else if(r.status===404||r.status===405){cloud.status='nobackend';cloud.msg='এই সাইটে সিঙ্ক ব্যাকএন্ড নেই'}else if(!r.ok){cloud.status='error';cloud.msg=j.error||'সিঙ্ক হয়নি'}else{cloud.status='ok';cloud.at=Date.now();cloud.msg=''}cloudBadge()})}).catch(function(){cloud.status='offline';cloud.msg='অফলাইন—পরে আবার চেষ্টা হবে';cloudBadge()})}
function mergeObjMax(a,b){var o=Object.assign({},a||{});Object.keys(b||{}).forEach(function(k){o[k]=Math.max(+o[k]||0,+b[k]||0)});return o}
function mergeByKey(a,b,keyFn,pick){var map={};(a||[]).concat(b||[]).forEach(function(x){if(!x)return;var k=keyFn(x);map[k]=map[k]?pick(map[k],x):x});return Object.keys(map).map(function(k){return map[k]})}
function mergeCloud(remote){if(!remote||typeof remote!=='object')return;cloud.busy=true;try{
 if(remote.cl&&typeof remote.cl==='object'){var p=P();Object.keys(remote.cl).forEach(function(id){var a=p[id]||[0,0,0,0],b=remote.cl[id]||[];p[id]=[0,1,2,3].map(function(i){return(a[i]||b[i])?1:0})});try{localStorage.setItem('cl',JSON.stringify(p))}catch(e){}}
 if(remote.cl2&&typeof remote.cl2==='object'){var g=GS(),r=remote.cl2;Object.keys(r.quiz||{}).forEach(function(id){var x=g.quiz[id],y=r.quiz[id];if(!x||(+y.got||0)>(+x.got||0))g.quiz[id]=y});Object.keys(r.games||{}).forEach(function(id){var x=g.games[id]||{plays:0,best:0},y=r.games[id]||{};g.games[id]={plays:Math.max(x.plays||0,y.plays||0),best:Math.max(x.best||0,y.best||0)}});Object.keys(r.sims||{}).forEach(function(k){g.sims[k]=1});Object.keys(r.badges||{}).forEach(function(k){if(!g.badges[k]||+r.badges[k]<+g.badges[k])g.badges[k]=r.badges[k]});if(dayNum(r.last||'1970-1-1')>dayNum(g.last||'1970-1-1')||(r.last===g.last&&(+r.streak||0)>(+g.streak||0))){g.streak=+r.streak||g.streak;g.last=r.last||g.last}if(r.daily&&dayNum(r.daily)>dayNum(g.daily||'1970-1-1'))g.daily=r.daily;try{localStorage.setItem('cl2',JSON.stringify(g))}catch(e){}}
 if(remote.study&&typeof remote.study==='object'){var s=STUDY(),rs=remote.study;['bookmarks','notes','savedSims'].forEach(function(k){s[k]=Object.assign({},rs[k]||{},s[k]||{})});s.formulaBookmarks=mergeByKey(s.formulaBookmarks,rs.formulaBookmarks,function(x){return JSON.stringify(x)},function(a){return a});s.review=mergeByKey(s.review,rs.review,function(x){return x.key},function(a,b){return(+b.lastWrongAt||0)>(+a.lastWrongAt||0)||((+b.lastWrongAt||0)===(+a.lastWrongAt||0)&&(+b.stage||0)>(+a.stage||0))?b:a});s.history=mergeByKey(s.history,rs.history,function(x){return x.id+'|'+x.at},function(a){return a}).sort(function(a,b){return a.at-b.at}).slice(-500);try{localStorage.setItem('clstudy_v1',JSON.stringify(s))}catch(e){}}
 if(remote.mis&&typeof remote.mis==='object'){var m=MIS(),rm=remote.mis;Object.keys(rm.daily||{}).forEach(function(k){var a=m.daily[k],b=rm.daily[k];if(!a||(b&&b.done&&!a.done)||(b&&Object.keys(b.answers||{}).length>Object.keys(a.answers||{}).length))m.daily[k]=b});m.claimed=Object.assign({},rm.claimed||{},m.claimed||{});m.activity=mergeObjMax(m.activity,rm.activity);m.stats={reviewCorrect:Math.max(m.stats.reviewCorrect||0,(rm.stats||{}).reviewCorrect||0),mastered:Math.max(m.stats.mastered||0,(rm.stats||{}).mastered||0)};try{localStorage.setItem('clmis_v1',JSON.stringify(m))}catch(e){}}
 }finally{cloud.busy=false}}
function cloudOwner(){var em=((student()||{}).email||'').toLowerCase(),own=localStorage.getItem('clcloudOwner')||'';if(em&&own&&own!==em){['cl','cl2','clstudy_v1','clmis_v1'].forEach(function(k){try{localStorage.removeItem(k)}catch(e){}});cloud.ready=false}if(em){try{localStorage.setItem('clcloudOwner',em)}catch(e){}}}
function cloudPull(quiet){var tk=studentToken();if(!tk){cloud.status='signin';cloud.ready=false;cloudBadge();return Promise.resolve()}cloudOwner();var before=localStorage.getItem('cl')+localStorage.getItem('cl2')+localStorage.getItem('clstudy_v1')+localStorage.getItem('clmis_v1');return fetch('/api/student-sync',{headers:{Authorization:'Bearer '+tk},cache:'no-store'}).then(function(r){if(r.status===401){cloud.status='signin';cloud.msg='আবার সাইন-ইন করুন';throw 0}if(r.status===404||r.status===405){cloud.status='nobackend';cloud.msg='এই সাইটে সিঙ্ক ব্যাকএন্ড নেই';cloud.ready=true;throw 0}if(!r.ok)throw new Error('sync');return r.json()}).then(function(j){if(j&&j.sync&&j.sync.data)mergeCloud(j.sync.data);cloud.ready=true;chip();var after=localStorage.getItem('cl')+localStorage.getItem('cl2')+localStorage.getItem('clstudy_v1')+localStorage.getItem('clmis_v1');cloud.changed=before!==after;var same=false;try{same=!!(j&&j.sync&&j.sync.data)&&JSON.stringify(cloudSnapshot())===JSON.stringify(j.sync.data)}catch(e){}cloud.status='ok';cloud.at=Date.now();cloudBadge();return same?null:cloudPushNow()}).then(function(){var re=quiet===true?/^#\/(progress|analytics)/:/^#\/(progress|analytics|daily|smart-practice)/;if((quiet!==true||cloud.changed)&&re.test(location.hash))rerender()}).catch(function(e){if(e!==0){cloud.status='offline';cloud.msg='অফলাইন'}cloudBadge()})}
function cloudBadge(){var el=$('#cloudBadge');if(el)el.innerHTML=cloudHtml()}
function cloudHtml(){var t={ok:'☁️ সিঙ্ক চালু'+(cloud.at?' · সর্বশেষ '+new Date(cloud.at).toLocaleTimeString():''),signin:'☁️ ডিভাইসের মধ্যে সিঙ্ক করতে সাইন-ইন করুন',nobackend:'💾 শুধু এই ডিভাইসে সংরক্ষিত (সিঙ্ক ব্যাকএন্ড নেই)',offline:'📴 অফলাইন—অনলাইনে এলে সিঙ্ক হবে',error:'⚠️ সিঙ্ক ত্রুটি',local:studentToken()?'☁️ সিঙ্ক অপেক্ষমাণ':'☁️ ডিভাইসের মধ্যে সিঙ্ক করতে সাইন-ইন করুন'}[cloud.status]||'';return E(t)+(cloud.msg&&cloud.status!=='ok'?' · '+E(cloud.msg):'')+(studentToken()?' <button class="btn sm" data-cloud-sync>এখন সিঙ্ক করুন</button>':' <a class="btn sm" href="#/account/signin">সাইন-ইন</a>')}
function progressExtras(){var m=MIS(),st=STUDY(),h=st.history,avg=h.length?Math.round(h.reduce(function(a,x){return a+x.accuracy},0)/h.length):0;return'<div class="card cloudcard"><div id="cloudBadge">'+cloudHtml()+'</div></div><h2 class="mt subh">📅 গত ৭ দিনের শেখা</h2>'+weekBars()+'<div class="stats4" style="margin-top:14px">'+[[h.length,'কুইজ অ্যাটেম্পট'],[avg+'%','গড় স্কোর'],[dailyDays(m),'ডেইলি চ্যালেঞ্জ (দিন)'],[Object.keys(m.claimed).length,'মিশন সম্পন্ন']].map(function(s){return'<div class="card"><b>'+s[0]+'</b><span>'+E(s[1])+'</span></div>'}).join('')+'</div>'}
app.addEventListener('click',function(e){var t=e.target;if(!t.closest)return;var a=t.closest('[data-daily-answer]');if(a)return dailyAnswer(a);a=t.closest('[data-daily-hint]');if(a)return dailyHint(a);a=t.closest('[data-mission-claim]');if(a)return missionClaim(a.dataset.missionClaim);a=t.closest('[data-mission-filter]');if(a){missionF=a.dataset.missionFilter;return rerender()}a=t.closest('[data-practice-help]');if(a)return practiceHelp(a);a=t.closest('[data-practice-now]');if(a){var sx=STUDY(),itx=sx.review.find(function(x){return x.key===a.dataset.practiceNow});if(itx){itx.dueAt=Date.now()-1;saveStudy(sx)}return rerender()}a=t.closest('[data-cloud-sync]');if(a){a.disabled=true;cloud.status='local';return cloudPull().then(function(){cloudBadge()})}});
app.addEventListener('change',function(e){if(e.target&&e.target.matches&&e.target.matches('[data-goal-set]')){var m=MIS();m.goal=+e.target.value||5;saveMis(m);rerender()}});

/* ------------------------------------------------------------ games runner */
function questionPool(){var o=[];Object.keys(C).forEach(function(k){C[k].q.forEach(function(q){if(q.q&&q.o&&q.o.length>=2)o.push({q:q.q,o:q.o,a:+q.a,e:q.e||''})})});return o}
function startGame(g){var root=$('#gm');if(!root)return;root.innerHTML='';var f=window.CL_GAMES[g.type];if(!f){root.innerHTML='<div class="card"><p class="bn">This game type is not available.</p></div>';return}
 var api={X:X,E:E,every:FX.every,confetti:FX.confetti,toast:FX.toast,questions:questionPool,done:function(res){finish(root,g,res)}};
 var wrap=document.createElement('div');root.appendChild(wrap);try{f(wrap,g,api)}catch(e){console.error(e);wrap.innerHTML='<div class="card"><p class="bn">Game could not start.</p></div>'}}
function reviewHtml(r){r=(r||[]).filter(function(x){return x&&x.q}).slice(0,8);if(!r.length)return'';return'<div class="card game-review"><h3>ভুল প্রশ্নের সংক্ষিপ্ত ব্যাখ্যা</h3>'+r.map(function(x){var e=String(x.e||'');if(e.length>180)e=e.slice(0,177)+'…';return'<div class="rv-i"><b>'+E(x.q)+'</b><span>✔ '+E(x.a)+'</span>'+(e?'<p>'+E(e)+'</p>':'')+'</div>'}).join('')+'</div>'}
function finish(root,g,res){var gs=GS(),rec=gs.games[g.id]||{plays:0,best:0},nb=res.score>rec.best;rec.plays++;rec.best=Math.max(rec.best,res.score);gs.games[g.id]=rec;
 var dg=dailyGame(),dbl=dg&&dg.id==g.id&&gs.daily!=today(),pct=Math.max(0,Math.min(1,res.pct||0)),xp=pct>0?Math.max(3,Math.round((+g.xp||20)*pct)):0;if(dbl){xp*=2;gs.daily=today()}save(gs);
 var stars=pct>=.85?3:pct>=.5?2:pct>0?1:0;if(pct>=.6)FX.confetti();
 root.innerHTML='<div class="card result"><div class="stars">'+[1,2,3].map(function(n){return'<span class="'+(n<=stars?'on':'')+'" style="--d:'+n*.18+'s">★</span>'}).join('')+'</div><h2>'+E(pct>=.6?X('g_win'):X('g_ok'))+'</h2><div class="big"><b data-count="'+res.score+'">0</b><small>'+E(X('g_score'))+'</small></div><p class="mutt">'+E(res.detail||'')+(nb&&rec.plays>1?' · 🆕 '+E(X('g_best')):'')+'</p><div class="xpchip">+'+xp+' XP'+(dbl?' · 🔥 '+E(X('ar_daily'))+' ×2':'')+'</div><div class="row c" style="margin-top:22px"><button class="btn pri" data-again>'+E(X('btn_again'))+'</button><a class="btn" href="#/play">'+E(X('btn_arcade'))+'</a></div></div>'+reviewHtml(res.review);track(1);
 FX.scan(root);if(xp)award(xp,g.t);else badges();
 root.querySelector('[data-again]').onclick=function(){startGame(g)}}

/* ------------------------------------------------------------ router */
function mountSims(){$$('[data-sim]',app).forEach(function(el){var key=el.dataset.sim;simInto(el,key,null,function(){})})}
function swipeNav(el,fn){var x0=null;el.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});el.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>45)fn(dx<0?1:-1)},{passive:true})}
function mountHomeGameCarousel(){
 var track=$('#homeGameTrack');if(!track)return;
 var cards=$$('.gdeck-card',track),n=cards.length,ix=Math.floor(Math.max(0,n-1)/2),reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,raf=0,lock=0,settleTimer=0;
 if(!n)return;
 function centeredIndex(){var tr=track.getBoundingClientRect(),mid=tr.left+track.clientWidth/2,best=0,bd=1e9;cards.forEach(function(c,i){var r=c.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-mid);if(d<bd){bd=d;best=i}});return best}
 function setOn(k){ix=Math.max(0,Math.min(n-1,k));cards.forEach(function(c,i){var on=i===ix;c.classList.toggle('on',on);if(on)c.setAttribute('aria-current','true');else c.removeAttribute('aria-current')});var b=$('#gdeckBar'),count=$('#gdeckCount');if(b)b.style.width=Math.round((ix+1)/n*100)+'%';if(count)count.textContent=String(ix+1).padStart(2,'0')+' / '+String(n).padStart(2,'0')}
 function syncToCenter(){if(!track.isConnected)return;var best=centeredIndex();if(best!==ix)setOn(best)}
 function go(k,smooth){k=((k%n)+n)%n;var c=cards[k],tr=track.getBoundingClientRect(),cr=c.getBoundingClientRect();var target=track.scrollLeft+(cr.left+cr.width/2-(tr.left+track.clientWidth/2));lock=Date.now()+(smooth&&!reduce?850:100);track.scrollTo({left:Math.max(0,target),behavior:smooth&&!reduce?'smooth':'auto'});setOn(k);clearTimeout(settleTimer);settleTimer=setTimeout(function(){lock=0;syncToCenter()},smooth&&!reduce?900:140)}
 track.addEventListener('scroll',function(){if(Date.now()<lock||raf)return;raf=requestAnimationFrame(function(){raf=0;syncToCenter()})},{passive:true});
 track.addEventListener('scrollend',function(){lock=0;clearTimeout(settleTimer);syncToCenter()},{passive:true});
 $$('[data-gdeck]').forEach(function(b){b.onclick=function(){go(ix+Number(b.dataset.gdeck),true)}});
 track.addEventListener('click',function(e){var c=e.target.closest('.gdeck-card');if(c&&!c.classList.contains('on')){e.preventDefault();go(Number(c.dataset.gi),true)}});
 track.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(ix+1,true)}else if(e.key==='ArrowLeft'){e.preventDefault();go(ix-1,true)}});
 setOn(ix);requestAnimationFrame(function(){go(ix,false);requestAnimationFrame(function(){go(ix,false)})})
}
function mountHomeSimCarousel(){mountHomeGameCarousel();var track=$('#homeLabTrack');if(track){var cards=$$('.home-lab-card',track),ix=Math.max(0,cards.findIndex(function(c){return !c.hidden}));function showCard(n){if(!cards.length)return;ix=(n+cards.length)%cards.length;cards.forEach(function(c,i){c.hidden=i!==ix});}$$('[data-home-lab-shift]').forEach(function(b){b.onclick=function(){showCard(ix+Number(b.dataset.homeLabShift))}});swipeNav(track,function(d){showCard(ix+d)});showCard(ix);return}var target=$('#homeSimTarget');if(!target)return;var items=LABS.filter(function(x){return x.on!==false&&x.on!=='0'&&x.sim&&x.sim!=='none'&&x.sim!=='custom'});if(!items.length)items=[{sim:'wave',t:'Wave Machine'},{sim:'line',t:'Straight Line Studio'},{sim:'force',t:'Force & Motion'}];var initial=items.findIndex(function(x){return x.sim===target.dataset.sim});var ix=Math.max(0,initial);function show(n){ix=(n+items.length)%items.length;var item=items[ix],key=item.sim;target.dataset.sim=key;target.innerHTML='';var title=$('#homeSimTitle'),num=$('#homeSimNum');if(title)title.textContent=item.t||key;if(num)num.textContent=String(ix+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');simInto(target,key,null,function(){})}var prev=$('#homeSimPrev'),next=$('#homeSimNext');if(prev)prev.onclick=function(){show(ix-1)};if(next)next.onclick=function(){show(ix+1)};show(ix)}
function loadLeaderboard(){var box=$('#leaderboardData'),count=$('#leaderCount');if(!box)return;fetch('/api/student-leaderboard',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('Could not load rankings');return r.json()}).then(function(d){if(!$('#leaderboardData'))return;if(count)count.textContent=String(d.count||0);var rows=d.students||[];if(!rows.length){box.innerHTML='<div class="card leader-empty"><div class="empty-icon">✦</div><h2>Be the first on the board</h2><p>No student rankings yet. Create an account and start learning to appear here.</p><a class="btn pri" href="#/account/signup">Create student account</a></div>';return;}var top=rows.slice(0,3),rest=rows.slice(3),podiumOrder=[];if(top[1])podiumOrder.push({u:top[1],rank:2});if(top[0])podiumOrder.push({u:top[0],rank:1});if(top[2])podiumOrder.push({u:top[2],rank:3});function avatar(u,small){var cls='avatar'+(small?' sm':'');return u.avatar?'<img class="'+cls+' avatar-photo" src="'+E(u.avatar)+'" alt="'+E(u.name||'Student')+' profile picture">':'<span class="'+cls+'">'+E((u.name||'S').trim().charAt(0).toUpperCase())+'</span>'}box.innerHTML='<div class="podium">'+podiumOrder.map(function(item){var u=item.u,i=item.rank-1;return'<article class="podium-card rank-'+item.rank+'"><span class="rank-medal">'+(['🥇','🥈','🥉'][i])+'</span>'+avatar(u,false)+'<h3>'+E(u.name||'Student')+'</h3><strong>'+Number(u.xp||0)+' <small>XP</small></strong><span class="rank-position">#'+item.rank+'</span></article>'}).join('')+'</div>'+(rest.length?'<div class="rank-table">'+rest.map(function(u,i){return'<div class="rank-row"><span class="rank-num">#'+(i+4)+'</span><span class="rank-person">'+avatar(u,true)+'<span class="rank-name">'+E(u.name||'Student')+'</span></span><strong>'+Number(u.xp||0)+' XP</strong></div>'}).join('')+'</div>':'');}).catch(function(){if(box)box.innerHTML='<div class="card leader-empty"><h2>Rankings are temporarily unavailable</h2><p>Please check the deployment and student database configuration, then refresh this page.</p><button class="btn" onclick="location.reload()">Try again</button></div>'})}
function customPage(slug){var page=(D.customPages||[]).filter(function(x){return x&&(x.slug===slug||x.id===slug)&&x.on!==false&&x.on!==0&&x.on!=='0'})[0];if(!page)return '<div class="w pgw"><section class="card"><h1>Page unavailable</h1><p class="lead">এই পেজটি প্রকাশিত নয় অথবা পাওয়া যায়নি।</p><a class="btn" href="#/">Home</a></section></div>';var body=String(page.body||'').trim();var paragraphs=body?body.split(/\n\s*\n/).map(function(part){return '<p>'+E(part).replace(/\n/g,'<br>')+'</p>'}).join(''):'<p class="mutt">এই পেজের কনটেন্ট অ্যাডমিন প্যানেল থেকে যোগ করুন।</p>';return '<div class="w pgw custom-public-page"><div class="custom-page-heading rv"><span class="eyebrow">CONCEPTLAB · PAGE</span><h1>'+E(page.title||page.navLabel||'Page')+'</h1></div><article class="card custom-page-content rv">'+paragraphs+'</article><p class="mutt" style="margin-top:20px"><a href="#/">← Home</a></p></div>'}
function initScrollReveal(root){
 root=root||document.getElementById('app');if(!root)return;
 var targets=root.querySelectorAll('.ayat-hadith-section,.motivation-section,.home-page .sec-features,.home-page .sec-stages,.home-page .arcade-s,.home-page .sec-sims,.home-discovery-motion,.pgw>.card,.pgw section,.pgw .card.rv,.lab-subject-group,.chapter-subject-group,.custom-page-heading,.custom-page-content');
 if(!('IntersectionObserver' in window)){targets.forEach(function(el){el.classList.add('scroll-reveal','is-visible')});return}
 var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}})},{root:null,rootMargin:'0px 0px -7% 0px',threshold:.08});
 targets.forEach(function(el){if(el.dataset.revealBound)return;el.dataset.revealBound='1';el.classList.add('scroll-reveal');io.observe(el)});
}
var GAME_CARD_ICONS=['⚡','🃏','✅','🔤','⚖️','🎯','🧲','🧬','🧪','📐','🪐','🧠','📏','🌡️','🔭','🧫','🧮','📡','🧩','🧯','🧱','🌀','🧰','🛰️','📊','🧷','🧵','🪄','🧭','🔋','💡','🛠️','🧊','🌈','🪙','🗝️','🪶','🪴','🪸','🪷','🪁','🛞','🔬','🧴','🧻'];
function mountImportantNotice(pg,root){
 var old=document.getElementById('clMessageCentre');if(old)old.remove();var oldPanel=document.getElementById('clMessagePanel');if(oldPanel)oldPanel.remove();
 var msg=String((D&&D.settings&&D.settings.importantNotice)||'').trim();
 var title=String((D&&D.settings&&D.settings.importantNoticeTitle)||'Important Notice').trim(),version=msg?(title+'\n'+msg):'',seenKey='cl_notice_seen_v2',seen='';
 try{seen=localStorage.getItem(seenKey)||''}catch(e){}
 var isNew=!!msg&&seen!==version,wrap=document.createElement('div');wrap.id='clMessageCentre';wrap.className='cl-message-centre';
 wrap.innerHTML='<button type="button" class="cl-message-trigger'+(isNew?' is-new':'')+'" aria-label="Messages" aria-expanded="false"><svg class="cl-message-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>'+(isNew?'<span class="cl-message-count">1 new</span>':'')+'</button><section id="clMessagePanel" class="cl-message-panel" hidden role="region" aria-label="Message centre"><header><h2></h2><button type="button" class="cl-message-close" aria-label="Close messages">×</button></header><article><h3></h3><p></p></article></section>';
 wrap.querySelector('.cl-message-panel header h2').textContent='Message Centre';wrap.querySelector('article h3').textContent=msg?title:'কোনো নতুন নোটিশ নেই';wrap.querySelector('article p').textContent=msg?msg:'এখানে অ্যাডমিনের প্রকাশিত গুরুত্বপূর্ণ বার্তা দেখা যাবে।';
 var trigger=wrap.querySelector('.cl-message-trigger'),panel=wrap.querySelector('.cl-message-panel');
 function toggle(){var open=panel.hidden;panel.hidden=!open;if(open){var hd=document.querySelector('header');var bt=hd?Math.round(hd.getBoundingClientRect().bottom):64;panel.style.setProperty('top',(bt+8)+'px','important')}trigger.setAttribute('aria-expanded',String(open));if(open&&msg){try{localStorage.setItem(seenKey,version)}catch(e){}trigger.classList.remove('is-new');var count=trigger.querySelector('.cl-message-count');if(count)count.remove()}}
 trigger.addEventListener('click',toggle);wrap.querySelector('.cl-message-close').addEventListener('click',function(){panel.hidden=true;trigger.setAttribute('aria-expanded','false')});var headerActions=document.querySelector('header .hx');if(headerActions){headerActions.insertBefore(wrap,document.getElementById('burger'))}else{document.body.appendChild(wrap)}document.body.appendChild(panel);function closePanel(){panel.hidden=true;trigger.setAttribute('aria-expanded','false')}if(!window.__clMessageGlobalBound){document.addEventListener('click',function(ev){var p=document.getElementById('clMessagePanel'),t=document.querySelector('#clMessageCentre .cl-message-trigger');if(p&&!p.hidden&&!p.contains(ev.target)&&t&&!t.contains(ev.target)){p.hidden=true;t.setAttribute('aria-expanded','false')}});document.addEventListener('keydown',function(ev){var p=document.getElementById('clMessagePanel'),t=document.querySelector('#clMessageCentre .cl-message-trigger');if(ev.key==='Escape'&&p&&!p.hidden){p.hidden=true;if(t)t.setAttribute('aria-expanded','false')}});window.__clMessageGlobalBound=true;}
}

var routeScrollMemory=Object.create(null),lastRouteHash=location.hash;
function instantScrollTo(y){var doc=document.documentElement,old=doc.style.scrollBehavior;doc.style.scrollBehavior='auto';window.scrollTo(0,Math.max(0,+y||0));doc.style.scrollBehavior=old}
function route(){var previousHash=lastRouteHash,previousPath=String(previousHash||'').replace(/^#\/?/,'').split('/')[0],previousFull=String(previousHash||'').replace(/^#\/?/,''),nextFull=String(location.hash||'').replace(/^#\/?/,''),nextPath=nextFull.split('/')[0],restoreY=null;if((previousPath==='play'&&previousFull==='play')||(previousPath==='lab'&&previousFull==='lab'))routeScrollMemory[previousPath]=window.pageYOffset||document.documentElement.scrollTop||0;if((nextPath==='play'&&previousFull.indexOf('play/')===0)||(nextPath==='lab'&&previousFull.indexOf('lab/')===0)){var k=nextPath;if(typeof routeScrollMemory[k]==='number')restoreY=routeScrollMemory[k]}lastRouteHash=location.hash;var mobileJump=document.getElementById('mobileSimControlJump');if(mobileJump)mobileJump.remove();syncAccountHeader();var h=location.hash.replace(/^#\/?/,''),p=h.split('/'),pg=p[0],html;
 $$('header nav a').forEach(function(a){var t=a.getAttribute('href').replace('#/','').split('/')[0];a.classList.toggle('on',t==pg||(t==''&&pg=='')||(pg=='chapter'&&t=='chapters')||(pg=='chapter-list'&&t=='chapters'))});
 $$('.bottom-nav a').forEach(function(a){var t=a.getAttribute('href').replace('#/','').split('/')[0],active=t==pg||(t==''&&pg==='')||(pg==='chapter'&&t==='chapters')||(pg==='chapter-list'&&t==='chapters');a.classList.toggle('on',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 try{html=pg=='chapter-list'&&p[1]?chapterListPage(p[1]):pg=='chapter'&&p[1]?chapter(p[1]):pg=='play'&&p[1]?gamePage(p[1]):pg=='lab'&&p[1]?labPage(p[1]):pg=='graphs'&&p[1]&&window.CL_GRAPHS?CL_GRAPHS.detail(p[1]):pg=='page'&&p[1]?customPage(decodeURIComponent(p[1])):(pages[pg]||(window.CL_HUB&&CL_HUB.pages[pg])||pages[''])()}
 catch(err){console.error('ConceptLab render error:',err);html='<section class="w pgw"><h1>Something went wrong</h1><p class="lead">Please refresh the page. If this keeps happening, tell the site admin.</p></section>'}
 app.innerHTML=html;mountImportantNotice(pg,app);setNavOpen(false,false);initScrollReveal(app);app.classList.remove('page-enter');void app.offsetWidth;app.classList.add('page-enter');app.dataset.page=pg||'home';document.body.classList.toggle('ion-game-active',pg==='play'&&p[1]==='chemistry-ion-challenge');if(restoreY!==null){requestAnimationFrame(function(){instantScrollTo(restoreY)});}else{instantScrollTo(0)}if(window.CL_HUB)try{CL_HUB.mount(pg,app)}catch(hx){console.error(hx)}
 if(pg==='leaderboard')loadLeaderboard();
 if(pg==='graphs'&&p[1]&&window.CL_GRAPHS)try{CL_GRAPHS.mount(p[1],app)}catch(ge){console.error('Graph Lab mount error:',ge)}
 if(pg==='account'){var af=$('#studentAuth');if(af)af.addEventListener('submit',function(ev){ev.preventDefault();var fd=new FormData(af),mode=af.dataset.mode,btn=af.querySelector('.auth-submit'),msg=$('#authMessage');btn.disabled=true;msg.textContent='Please wait…';fetch('/api/student-'+(mode==='signup'?'signup':'login'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:String(fd.get('name')||'').trim(),email:String(fd.get('email')||'').trim().toLowerCase(),password:fd.get('password'),school:String(fd.get('school')||'').trim()})}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'Unable to continue');return j})}).then(function(j){if(j.token)localStorage.setItem('clstudentToken',j.token);try{localStorage.setItem('clHasAccount','1')}catch(x){}setStudent(j.user);if(j.token)fetch('/api/student-progress',{headers:{Authorization:'Bearer '+j.token},cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(d){if(d&&d.user){var g=GS();g.xp=Number(d.user.xp)||0;save(g);chip()}}).catch(function(){});msg.textContent='Signed in as '+j.user.name+'.';var back='';try{back=sessionStorage.getItem('clAuthReturn')||'';sessionStorage.removeItem('clAuthReturn')}catch(x){}location.hash=(back&&/^#\//.test(back))?back:'#/profile'}).catch(function(e){msg.textContent=e.message;}).finally(function(){btn.disabled=false})})}


 if(pg==='profile'){var lo=$('#studentLogout');if(lo)lo.addEventListener('click',function(){cloud.ready=false;try{localStorage.setItem('clHasAccount','1')}catch(e){}localStorage.removeItem('clstudent');localStorage.removeItem('clstudentToken');syncAccountHeader();location.hash='#/';});}
 if(pg==='edit-profile'){var pf=$('#studentProfileForm'),pic=$('#profilePicture'),avatarData=(student()||{}).avatar||'';if(pic)pic.addEventListener('change',function(){var f=pic.files&&pic.files[0];if(!f)return;if(!/^image\/(jpeg|png|webp)$/.test(f.type)){pic.value='';$('#profileMessage').textContent='Please choose a JPG, PNG, or WebP image.';return;}var im=new Image(),reader=new FileReader();reader.onload=function(){im.onload=function(){var c=document.createElement('canvas'),max=360,scale=Math.min(1,max/Math.max(im.width,im.height));c.width=Math.round(im.width*scale);c.height=Math.round(im.height*scale);c.getContext('2d').drawImage(im,0,0,c.width,c.height);avatarData=c.toDataURL('image/jpeg',.78);$('#profilePreview').innerHTML='<img class="profile-avatar-img" src="'+avatarData+'" alt="Profile picture preview">';};im.src=reader.result;};reader.readAsDataURL(f);});if(pf)pf.addEventListener('submit',function(ev){ev.preventDefault();var fd=new FormData(pf),btn=pf.querySelector('button'),msg=$('#profileMessage');btn.disabled=true;msg.textContent='Saving…';apiStudent('student-profile',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({name:String(fd.get('name')||'').trim(),bio:String(fd.get('bio')||''),school:String(fd.get('school')||''),location:String(fd.get('location')||''),avatar:avatarData})}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'Could not save profile');return j})}).then(function(j){setStudent(j.user);msg.textContent='Profile updated successfully.';}).catch(function(err){msg.textContent=err.message;}).finally(function(){btn.disabled=false;});});}

 try{
  if(pg==''||!pages[pg]&&pg!='chapter'&&pg!='chapter-list'&&pg!='play'&&pg!='lab'){var ow=$('.orb-wrap');if(ow&&S.hero)ow.innerHTML='<img class="hero-img" src="'+E(S.hero)+'" alt="">';$$('[data-type]',app).forEach(function(el){FX.type(el,el.dataset.type.split('|'))});if(pg==='')mountHomeChallengeArena();mountSims();mountHomeSimCarousel()}
  if(pg=='chapter'&&p[1]&&C[p[1]]){var id=p[1],st=0;try{st=+(sessionStorage.getItem('st'+id)||0)}catch(e){}stage(id,st>=0&&st<4?st:0)}
  if(pg=='play'&&p[1]){var g=GAMES.filter(function(x){return x.id==p[1]})[0];if(g&&$('#gm'))startGame(g)}
  if(pg=='lab'&&p[1]){var l=LABS.filter(function(x){return x.id==p[1]})[0];if(l&&$('#sim'))simInto($('#sim'),l.sim,null,once(function(){markSim(l.sim)}))}
 }catch(err){console.error(err)}
 FX.scan(app)}
app.addEventListener('submit',function(e){
 var form=e.target;
 if(form&&form.id==='studyNoteForm'){e.preventDefault();var fd=new FormData(form),id=String(fd.get('concept')||''),note=String(fd.get('note')||'').trim();if(!id||!note)return;var st=STUDY();st.notes[id]=note;saveStudy(st);var msg=document.getElementById('studyNoteStatus');if(msg)msg.textContent='নোট সংরক্ষণ হয়েছে।';form.querySelector('[name=note]').value='';return}
 if(form&&form.id==='formulaBookmarkForm'){e.preventDefault();var fd=new FormData(form),formula=String(fd.get('formula')||'').trim(),label=String(fd.get('label')||'').trim();if(!formula)return;var st=STUDY();st.formulaBookmarks.unshift({formula:formula,label:label,at:Date.now()});saveStudy(st);route();return}
 if(!form||form.id!=='feedbackForm')return;
 e.preventDefault();
 var fd=new FormData(form),message=String(fd.get('message')||'').trim(),status=document.getElementById('feedbackStatus'),button=document.getElementById('sendFeedback');
 if(message.length<5){if(status)status.textContent='অনুগ্রহ করে অন্তত ৫ অক্ষরের বার্তা লিখুন।';return;}
 if(String(fd.get('website')||'').trim())return;
 if(button)button.disabled=true;if(status)status.textContent='বার্তা পাঠানো হচ্ছে…';
 fetch('/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:String(fd.get('name')||'').trim(),email:String(fd.get('email')||'').trim(),message:message,page:location.hash||'#/about',website:String(fd.get('website')||'')})})
 .then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।');return j;});})
 .then(function(){form.reset();if(status)status.textContent='ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে। Admin Panel-এর Feedback বিভাগে এটি দেখা যাবে।';})
 .catch(function(err){if(status)status.textContent=err.message||'বার্তা পাঠানো যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।';})
 .finally(function(){if(button)button.disabled=false;});
});

app.addEventListener('click',function(e){
 var sb=e.target.closest('[data-study-bookmark-concept]'),ss=e.target.closest('[data-study-save-sim]'),ub=e.target.closest('[data-study-unbookmark]'),us=e.target.closest('[data-study-unsave-sim]'),dn=e.target.closest('[data-study-delete-note]'),df=e.target.closest('[data-study-delete-formula]'),pa=e.target.closest('[data-practice-answer]');
 if(sb){var st=STUDY(),id=sb.dataset.studyBookmarkConcept;if(st.bookmarks[id])delete st.bookmarks[id];else st.bookmarks[id]={at:Date.now()};saveStudy(st);sb.textContent=st.bookmarks[id]?'🔖 Bookmarked · Remove':'🔖 Bookmark this concept';return}
 if(ss){var st=STUDY(),id=ss.dataset.studySaveSim;if(st.savedSims[id])delete st.savedSims[id];else st.savedSims[id]={at:Date.now()};saveStudy(st);ss.textContent=st.savedSims[id]?'✓ সংরক্ষিত · সরান':'＋ সিমুলেশন সংরক্ষণ';return}
 if(ub){var st=STUDY();delete st.bookmarks[ub.dataset.studyUnbookmark];saveStudy(st);route();return}if(us){var st=STUDY();delete st.savedSims[us.dataset.studyUnsaveSim];saveStudy(st);route();return}if(dn){var st=STUDY();delete st.notes[dn.dataset.studyDeleteNote];saveStudy(st);route();return}if(df){var st=STUDY();st.formulaBookmarks.splice(Number(df.dataset.studyDeleteFormula),1);saveStudy(st);route();return}
 if(pa){practiceAnswer(pa);return}
var t=e.target.closest('.tab'),n=e.target.closest('[data-n]'),cf=e.target.closest('[data-chf]'),lsb=e.target.closest('[data-lab-subject]'),rs=e.target.closest('[data-reset]'),pw=e.target.closest('[data-toggle-password]'),fg=e.target.closest('[data-forgot-password]'),authLink=e.target.closest('a[href^="#/account/"]'),m=location.hash.match(/^#\/chapter\/(.+)/);
 if(authLink&&!/^#\/account\//.test(location.hash)){try{sessionStorage.setItem('clAuthReturn',location.hash||'#/')}catch(x){}}
 if(pw){var pi=$('#studentPassword');if(pi){var show=pi.type==='password';pi.type=show?'text':'password';pw.textContent=show?'Hide':'Show';pw.setAttribute('aria-label',show?'Hide password':'Show password')}return}
 if(fg){var fm=$('#forgotMessage');if(fm)fm.hidden=!fm.hidden;return}
 if(m&&C[m[1]]){if(t)stage(m[1],+t.dataset.i);if(n){var nextStage=+n.dataset.n;if(nextStage===3){mark(m[1],2);var concept=C[m[1]];if(concept.sim&&concept.sim!=='none'&&concept.sim!=='custom')markSim(concept.sim);refreshBar(m[1]);var stageTab=$('#tabs').children[2];if(stageTab)stageTab.classList.add('dn')}stage(m[1],nextStage)}}
 var cs=e.target.closest('[data-chs]'),cr=e.target.closest('[data-ch-reset]');if(cs){chS=cs.dataset.chs;$$('[data-chs]').forEach(function(b){b.classList.toggle('on',b===cs)});$('#chg').innerHTML=chGrid();FX.scan($('#chg'))}if(cr){chS='all';chF='all';chQ='';route();return}if(cf){chF=cf.dataset.chf;$$('[data-chf]').forEach(function(b){b.classList.toggle('on',b===cf)});$('#chg').innerHTML=chGrid();FX.scan($('#chg'))}
 if(lsb){var v=lsb.dataset.labSubject;$$('#labSubjectChooser [data-lab-subject]').forEach(function(b){var active=b===lsb;b.classList.toggle('on',active);b.setAttribute('aria-selected',active?'true':'false')});$$('#lbg [data-lab-panel]').forEach(function(c){c.hidden=c.dataset.labPanel!==v});FX.scan($('#lbg'))}
 if(rs&&confirm('Reset all progress, XP and badges on this device?')){try{localStorage.removeItem('cl');localStorage.removeItem('cl2')}catch(x){}if(studentToken()&&cloud.ready){clearTimeout(cloud.t);cloudPushNow()}syncStudentXP();chip();route()}});
app.addEventListener('input',function(e){if(e.target.id=='chq'){chQ=e.target.value;$('#chg').innerHTML=chGrid();FX.scan($('#chg'))}});
var navHome=null,navPlaceholder=null;
function setNavOpen(open,returnFocus){
 if(typeof open!=='boolean')open=!document.body.classList.contains('navopen');
 var b=$('#burger'),nav=$('#nav'),backdrop=$('#navBackdrop');
 if(open){
  if(nav&&nav.parentNode!==document.body){navHome=nav.parentNode;navPlaceholder=document.createComment('ConceptLab navigation home');nav.parentNode.insertBefore(navPlaceholder,nav);document.body.appendChild(nav);}
  if(nav){
   var closeBtn=nav.querySelector('.nav-drawer-close');
   if(!closeBtn){closeBtn=document.createElement('button');closeBtn.type='button';closeBtn.className='nav-drawer-close';closeBtn.textContent='✕';closeBtn.setAttribute('aria-label','মেনু বন্ধ করুন');closeBtn.title='মেনু বন্ধ করুন';closeBtn.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();setNavOpen(false,true);});nav.insertBefore(closeBtn,nav.firstChild);}
   closeBtn.hidden=false;
   var r=b?b.getBoundingClientRect():{bottom:70,right:window.innerWidth-16};
   var header=$('header'),hr=header?header.getBoundingClientRect():null;
   var anchorBottom=hr&&hr.bottom>0?hr.bottom:r.bottom;
   /* The navigation drawer is an overlay, not a continuation below the header. Keep it at the top of the web viewport to eliminate the large blank lead-in on mobile. */
   var top=8;
   nav.classList.add('nav-portal');nav.style.position='fixed';nav.style.top=top+'px';nav.style.right=Math.max(12,window.innerWidth-r.right)+'px';nav.style.left='auto';nav.style.bottom='auto';nav.style.zIndex='10002';nav.style.maxHeight='calc(100dvh - '+(top+12)+'px - env(safe-area-inset-bottom))';nav.style.overflowY='auto';nav.style.overscrollBehavior='contain';nav.style.width='min(620px, calc(100vw - 24px))';nav.style.display='flex';nav.style.flexDirection='column';nav.style.alignItems='stretch';nav.style.justifyContent='flex-start';nav.style.gap='4px';nav.style.padding='12px';nav.style.border='1px solid rgba(56,189,248,.34)';nav.style.borderRadius='20px';nav.style.background='rgba(4,12,22,.985)';nav.style.boxShadow='0 24px 70px rgba(0,0,0,.72)';nav.style.backdropFilter='blur(24px)';nav.style.webkitBackdropFilter='blur(24px)';nav.style.animation='navDrop .22s ease-out both';nav.style.scrollbarWidth='thin';
  }
  document.body.classList.add('navopen');
 }else{
  document.body.classList.remove('navopen');
  if(nav){nav.classList.remove('nav-portal');var closeBtn=nav.querySelector('.nav-drawer-close');if(closeBtn)closeBtn.hidden=true;['position','top','right','left','bottom','zIndex','maxHeight','overflowY','overscrollBehavior','width','display','flexDirection','alignItems','justifyContent','gap','padding','border','borderRadius','background','boxShadow','backdropFilter','webkitBackdropFilter','animation','scrollbarWidth'].forEach(function(k){nav.style[k]=''});if(navPlaceholder&&navPlaceholder.parentNode){navPlaceholder.parentNode.insertBefore(nav,navPlaceholder);navPlaceholder.parentNode.removeChild(navPlaceholder);}else if(navHome)navHome.appendChild(nav);navPlaceholder=null;navHome=null;}
 }
 if(b)b.setAttribute('aria-expanded',open?'true':'false');if(backdrop){backdrop.setAttribute('aria-hidden',open?'false':'true');backdrop.tabIndex=open?0:-1}if(!open&&returnFocus&&b)b.focus();
}
$('#burger')&&($('#burger').onclick=function(){setNavOpen();});
$('#navBackdrop')&&($('#navBackdrop').onclick=function(){setNavOpen(false,true)});
$('#nav')&&($('#nav').addEventListener('click',function(e){if(e.target.closest('a'))setNavOpen(false,false)}));
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.body.classList.contains('navopen'))setNavOpen(false,true)});
addEventListener('hashchange',route);
function goTop(ev){var a=ev.target&&ev.target.closest?ev.target.closest('#ftop'):null;if(!a)return;ev.preventDefault();try{window.scrollTo({top:0,left:0,behavior:'smooth'})}catch(e){}document.documentElement.scrollTop=0;document.body.scrollTop=0;var sc=document.scrollingElement;if(sc)sc.scrollTop=0}
document.addEventListener('click',goTop,true);app.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-subject-go]');if(a){chF=a.dataset.subjectGo;chQ='';chS='all'}});window.addEventListener('pageshow',function(){var a=document.getElementById('ftop');if(a)a.setAttribute('role','button')});

window.CL_API={award:award,lvl:lvl,GS:GS,student:student,settings:function(){return S||{}}};load({});touchStreak();chip();syncAccountHeader();route();syncStudentXP();if(studentToken()){refreshAccount();cloudPull()}
fetch('/api/content',{cache:'no-store',headers:{'cache-control':'no-cache'}}).then(function(r){return r.ok?r.json():null}).then(function(d){if(d&&typeof d==='object'&&Object.keys(d).length){load(d);route()}}).catch(function(){});
})();
