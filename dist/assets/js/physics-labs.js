/* ConceptLab HSC Physics I: additional simulations for the ten-chapter catalogue.
   Each added model has its own controls, physical relation, explanatory drawing and live curve. */
(function(){
'use strict';
var chapterNames={
 measurement:'ভৌত জগৎ ও পরিমাপ',vectors:'ভেক্টর',kinematics:'গতিবিদ্যা',dynamics:'নিউটনীয় বলবিদ্যা',energy:'কাজ, শক্তি ও ক্ষমতা',gravity:'মহাকর্ষ ও অভিকর্ষ',structure:'পদার্থের গাঠনিক ধর্ম',periodic:'পর্যাবৃত্ত গতি',waves:'তরঙ্গ',gas:'আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব'
};
var S=window.CL_SIMS||(window.CL_SIMS={});
var configs={
'measurement-uncertainty':{t:'Measurement Uncertainty Lab',chapter:'measurement',icon:'🎯',kind:'measure',desc:'একই রাশির পুনরাবৃত্ত পরিমাপ, গড় মান, পরম ত্রুটি ও অনিশ্চয়তার প্রভাব পরীক্ষা করুন।',formula:'গড় মান x̄ = Σx / n; সর্বোচ্চ পরম ত্রুটি = max |xᵢ − x̄|',curve:'mean',controls:[['n','পরিমাপের সংখ্যা',2,20,1,8,'টি'],['true','প্রকৃত মান',10,50,1,25,'একক'],['noise','পরিমাপের বিচ্যুতি',0.1,5,0.1,2,'একক']]},
'dimensional-analysis':{t:'Dimensional Analysis Builder',chapter:'measurement',icon:'🧮',kind:'measure',desc:'একটি সমীকরণের দুই পাশে মাত্রা মিলিয়ে সূত্র যাচাই এবং অজানা ঘাতের শর্ত বোঝুন।',formula:'মাত্রিক সমজাতীয়তা: [বামপক্ষ] = [ডানপক্ষ]',curve:'dimension',controls:[['m','ভর-সূচক',-3,3,1,1,''],['l','দৈর্ঘ্য-সূচক',-3,3,1,2,''],['t','সময়-সূচক',-3,3,1,-2,'']]},
'unit-conversion-lab':{t:'Unit Conversion Playground',chapter:'measurement',icon:'↔️',kind:'measure',desc:'SI ও CGS এককের গুণক, ক্ষেত্রফল-আয়তন এবং যৌগিক এককের রূপান্তর তুলনা করুন।',formula:'নতুন মান = পুরোনো মান × রূপান্তর গুণক',curve:'conversion',controls:[['v','প্রাথমিক মান',1,100,1,25,'একক'],['pow','এককের ঘাত',1,3,1,2,''],['factor','রূপান্তর গুণক',0.01,100,0.01,0.01,'']]},
'vector-components-lab':{t:'Vector Components Explorer',chapter:'vectors',icon:'↕️',kind:'vector',desc:'একটি ভেক্টরকে অনুভূমিক ও উল্লম্ব উপাংশে ভাগ করে মান ও দিক পরিবর্তনের প্রভাব দেখুন।',formula:'Aₓ = A cos θ; Aᵧ = A sin θ',curve:'components',controls:[['a','ভেক্টরের মান',1,100,1,40,'একক'],['ang','কোণ',0,360,1,35,'°']]},
'vector-equilibrium-lab':{t:'Vector Equilibrium Challenge',chapter:'vectors',icon:'⚖️',kind:'vector',desc:'দুটি বলের লব্ধিকে শূন্য করতে তৃতীয় বলের মান ও দিক নির্ণয় করুন।',formula:'ΣFₓ = 0 এবং ΣFᵧ = 0',curve:'resultant',controls:[['a','প্রথম বল',5,100,1,40,'N'],['b','দ্বিতীয় বল',5,100,1,30,'N'],['ang','মধ্যবর্তী কোণ',0,180,1,70,'°']]},
'motion-graph-studio':{t:'Motion Track & Graph Studio',chapter:'kinematics',icon:'📊',kind:'motion',desc:'একই গতির অবস্থান, বেগ ও ত্বরণ বিশ্লেষণ করুন; সময় ও প্রাথমিক মান বদলে গ্রাফের ঢাল বুঝুন।',formula:'x = x₀ + ut + ½at²; v = u + at',curve:'motion',controls:[['u','প্রাথমিক বেগ',-20,30,1,4,'m/s'],['a','ত্বরণ',-5,5,0.1,1,'m/s²'],['t','সময়ের সীমা',2,20,1,10,'s']]},
'free-fall-lab':{t:'Free Fall & Vertical Throw Lab',chapter:'kinematics',icon:'🍂',kind:'motion',desc:'উচ্চতা, প্রাথমিক বেগ ও অভিকর্ষজ ত্বরণ পরিবর্তন করে পতন ও উল্লম্ব নিক্ষেপের ফল দেখুন।',formula:'y = h + ut − ½gt²; v = u − gt',curve:'freefall',controls:[['h','প্রাথমিক উচ্চতা',5,150,1,60,'m'],['u','প্রাথমিক বেগ',-20,30,1,10,'m/s'],['g','অভিকর্ষজ ত্বরণ',1,20,0.1,9.8,'m/s²']]},
'motion-graph-match':{t:'Match the Motion Graph',chapter:'kinematics',icon:'🧠',kind:'motion',desc:'বস্তুটির গতি দেখে সঠিক অবস্থান, বেগ ও ত্বরণ গ্রাফ বাছুন; গতি ও গ্রাফের সম্পর্ক পরীক্ষা করুন।',formula:'x–t এর ঢাল = v; v–t এর ঢাল = a; v–t এর ক্ষেত্রফল = সরণ',curve:'motion',controls:[['u','প্রাথমিক বেগ',-20,30,1,5,'m/s'],['a','ত্বরণ',-5,5,0.1,0.8,'m/s²'],['t','সময়',2,20,1,10,'s']]},
'free-body-builder':{t:'Free-Body Diagram Builder',chapter:'dynamics',icon:'🗜️',kind:'force',desc:'একটি বস্তুর ওজন, লম্ব প্রতিক্রিয়া, প্রয়োগকৃত বল, টান ও ঘর্ষণের ভেক্টর একত্রে দেখুন।',formula:'ΣF = ma; অনুভূমিক ও উল্লম্ব উপাংশ আলাদাভাবে যোগ করতে হয়',curve:'force',controls:[['m','বস্তুর ভর',1,200,1,20,'kg'],['f','প্রয়োগকৃত অনুভূমিক বল',0,1000,1,80,'N'],['mu','ঘর্ষণ সহগ',0,1.5,0.05,0.3,'']]},
'pulley-system-lab':{t:'Connected Bodies & Pulley Lab',chapter:'dynamics',icon:'🪝',kind:'force',desc:'আদর্শ পুলি, সংযুক্ত ভর ও টানের সাহায্যে ত্বরণ নির্ণয় করুন।',formula:'a = (m₂ − m₁)g / (m₁ + m₂); আদর্শ দড়িতে টান সমান',curve:'pulley',controls:[['m1','বাম পাশের ভর m₁',0.1,200,0.1,10,'kg'],['m2','ডান পাশের ভর m₂',0.1,200,0.1,15,'kg'],['g','অভিকর্ষজ ত্বরণ g',1,20,0.1,9.8,'m/s²']]},
'elevator-weight-lab':{t:'Elevator & Apparent Weight',chapter:'dynamics',icon:'🛗',kind:'force',desc:'লিফটের ত্বরণ উপরের বা নিচের দিকে হলে দাঁড়িপাল্লার পাঠ কীভাবে বদলায় দেখুন।',formula:'N = m(g + a) ঊর্ধ্বমুখী ত্বরণে; N = m(g − a) নিম্নমুখী ত্বরণে',curve:'elevator',controls:[['m','ব্যক্তির ভর m',1,250,1,60,'kg'],['a','লিফটের স্বাক্ষরিত ত্বরণ a (উপরে +)',-15,15,0.1,2,'m/s²'],['g','অভিকর্ষজ ত্বরণ g',1,20,0.1,9.8,'m/s²']]},
'collision-momentum-lab':{t:'Collision & Momentum Lab',chapter:'dynamics',icon:'💥',kind:'collision',desc:'দুটি কার্টের ভর ও প্রাথমিক বেগ বদলে সংঘর্ষের আগে-পরে ভরবেগ ও গতিশক্তি তুলনা করুন।',formula:'m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂; বিচ্ছিন্ন ব্যবস্থায় ভরবেগ সংরক্ষিত',curve:'collision',controls:[['m1','প্রথম ভর',1,50,1,10,'kg'],['m2','দ্বিতীয় ভর',1,50,1,15,'kg'],['v','প্রথম বেগ',-20,30,1,12,'m/s']]},
'impulse-force-time-lab':{t:'Impulse & Force-Time Lab',chapter:'dynamics',icon:'🥊',kind:'collision',desc:'বল প্রয়োগের সময় ও বলের মান বদলে অভিঘাত এবং ভরবেগের পরিবর্তন নির্ণয় করুন।',formula:'J = ∫F dt = Δp; ধ্রুব বল হলে J = FΔt',curve:'impulse',controls:[['f','ধ্রুব বল',1,500,1,80,'N'],['t','বল প্রয়োগের সময়',0.01,2,0.01,0.3,'s'],['m','বস্তুর ভর',1,100,1,10,'kg']]},
'vertical-circle-lab':{t:'Vertical Circular Motion',chapter:'dynamics',icon:'🎡',kind:'circle',desc:'উল্লম্ব বৃত্তে বস্তু চলার সময় অবস্থানভেদে বেগ ও সুতার টান পর্যবেক্ষণ করুন।',formula:'T + mg cos θ = mv²/r (θ নিচের দিক থেকে মাপা হলে চিহ্ন-রীতি অনুযায়ী)',curve:'verticalCircle',controls:[['m','বস্তুর ভর',0.1,10,0.1,1,'kg'],['r','বৃত্তের ব্যাসার্ধ',0.2,5,0.1,1.5,'m'],['v','নিচের বিন্দুর বেগ',2,20,0.5,8,'m/s']]},
'work-force-displacement-lab':{t:'Work & Force-Displacement Lab',chapter:'energy',icon:'🧱',kind:'energy',desc:'বল, সরণ ও বল-সরণের কোণ বদলে কাজের মান এবং ধনাত্মক/ঋণাত্মক কাজ বোঝুন।',formula:'W = Fs cos θ; পরিবর্তনশীল বলের ক্ষেত্রে W হলো F–x গ্রাফের ক্ষেত্রফল',curve:'work',controls:[['f','বল',1,200,1,50,'N'],['x','সরণ',0,20,0.5,8,'m'],['ang','বল ও সরণের কোণ',0,180,1,30,'°']]},
'energy-conservation-lab':{t:'Energy Conservation Playground',chapter:'energy',icon:'🎢',kind:'energy',desc:'উচ্চতা থেকে নামা বস্তুর গতিশক্তি ও বিভবশক্তির রূপান্তর দেখুন; ঘর্ষণ থাকলে যান্ত্রিক শক্তির পরিবর্তন তুলনা করুন।',formula:'mgh + ½mv² = ধ্রুবক (ঘর্ষণহীন ক্ষেত্রে)',curve:'energy',controls:[['m','ভর',1,100,1,10,'kg'],['h','প্রাথমিক উচ্চতা',1,100,1,30,'m'],['loss','শক্তি ক্ষয়ের ভগ্নাংশ',0,0.8,0.05,0.1,'']]},
'spring-energy-lab':{t:'Spring Energy Lab',chapter:'energy',icon:'🎚️',kind:'energy',desc:'স্প্রিংয়ের দৃঢ়তা ও প্রসারণ পরিবর্তন করে পুনঃস্থাপন বল, কাজ ও সঞ্চিত স্থিতিস্থাপক শক্তি দেখুন।',formula:'F = −kx; U = ½kx²',curve:'springEnergy',controls:[['k','স্প্রিং ধ্রুবক',5,500,5,100,'N/m'],['x','সর্বোচ্চ প্রসারণ',0.01,1,0.01,0.3,'m']]},
'power-efficiency-lab':{t:'Power & Efficiency Studio',chapter:'energy',icon:'🏋️',kind:'energy',desc:'কোনো ভার তোলা বা মোটর চালানোর ক্ষেত্রে কাজের হার, ইনপুট-আউটপুট শক্তি ও দক্ষতা তুলনা করুন।',formula:'P = W/t; η = (উপযোগী আউটপুট শক্তি / ইনপুট শক্তি) × 100%',curve:'power',controls:[['m','তোলা ভর',1,500,1,80,'kg'],['v','উর্ধ্বমুখী বেগ',0.1,5,0.1,1.2,'m/s'],['eta','দক্ষতা',10,100,1,80,'%']]},
'universal-gravitation-lab':{t:'Universal Gravitation Lab',chapter:'gravity',icon:'🪐',kind:'gravity',desc:'দুটি বস্তুর ভর ও দূরত্ব পরিবর্তন করে মহাকর্ষ বলের বিপরীত-বর্গ নির্ভরতা দেখুন।',formula:'F = Gm₁m₂ / r²',curve:'gravitation',controls:[['m1','প্রথম ভর',1,100,1,20,'kg'],['m2','দ্বিতীয় ভর',1,100,1,30,'kg'],['r','দূরত্ব',1,20,0.5,5,'m']]},
'gravity-profile-lab':{t:'Gravity Inside & Outside Earth',chapter:'gravity',icon:'🏔️',kind:'gravity',desc:'পৃথিবীর পৃষ্ঠের ওপর উচ্চতা অথবা সমঘনত্বের পৃথিবীর ভেতরে গভীরতা বদলে g-এর পরিবর্তন দেখুন।',formula:'পৃষ্ঠের বাইরে g = GM/(R+h)²; সমঘনত্বের ভেতরে g ∝ r',curve:'gravityProfile',controls:[['r','পৃথিবীর ব্যাসার্ধ',1000,10000,1,6371,'km'],['h','উচ্চতা/স্বাক্ষরিত গভীরতা',-6000,30000,100,1000,'km'],['g','পৃষ্ঠের g',1,15,0.1,9.8,'m/s²']]},
'gravitational-potential-lab':{t:'Gravitational Potential & Energy',chapter:'gravity',icon:'🕳️',kind:'gravity',desc:'কোনো বস্তুকে গ্রহ থেকে দূরে সরালে মহাকর্ষীয় বিভব ও বিভবশক্তি কীভাবে বদলায় দেখুন।',formula:'V = −GM/r; U = −GMm/r',curve:'potential',controls:[['M','গ্রহের ভর',1,100,1,60,'আপেক্ষিক একক'],['m','বস্তুর ভর',1,50,1,5,'kg'],['r','কেন্দ্র থেকে দূরত্ব',1,20,0.5,4,'আপেক্ষিক একক']]},
'satellite-orbit-lab':{t:'Satellite Orbit Lab',chapter:'gravity',icon:'🛰️',kind:'gravity',desc:'কক্ষীয় ব্যাসার্ধ ও কেন্দ্রীয় ভর বদলে উপগ্রহের কক্ষীয় বেগ, পর্যায়কাল এবং মোট শক্তি নির্ণয় করুন।',formula:'v = √(GM/r); T² = 4π²r³/(GM); E = −GMm/(2r)',curve:'orbit',controls:[['M','কেন্দ্রীয় ভর',1,100,1,60,'আপেক্ষিক একক'],['r','কক্ষীয় ব্যাসার্ধ',1,20,0.5,5,'আপেক্ষিক একক'],['m','উপগ্রহের ভর',0.1,20,0.1,1,'kg']]},
'escape-velocity-lab':{t:'Orbital Speed vs Escape Speed',chapter:'gravity',icon:'🚀',kind:'gravity',desc:'একই গ্রহের জন্য কক্ষীয় বেগ ও মুক্তিবেগের অনুপাত এবং ভর-ব্যাসার্ধের প্রভাব তুলনা করুন।',formula:'vₑ = √(2GM/R) = √2 vₒ (পৃষ্ঠের বৃত্তাকার কক্ষীয় বেগ vₒ হলে)',curve:'escape',controls:[['M','গ্রহের ভর',1,100,1,60,'আপেক্ষিক একক'],['R','গ্রহের ব্যাসার্ধ',1,20,0.5,5,'আপেক্ষিক একক'],['h','অতিরিক্ত উচ্চতা',0,20,0.5,2,'একক']]},
'elasticity-hooke-lab':{t:'Elasticity & Hooke’s Law Lab',chapter:'structure',icon:'🧵',kind:'elastic',desc:'তার বা স্প্রিংয়ে বল প্রয়োগ করে প্রসারণ, পীড়ন-বিকৃতি ও স্থিতিস্থাপক ধ্রুবকের সম্পর্ক দেখুন।',formula:'পীড়ন = F/A; বিকৃতি = ΔL/L; ইয়ং গুণাঙ্ক = পীড়ন/বিকৃতি',curve:'elastic',controls:[['f','প্রয়োগকৃত বল',1,300,1,80,'N'],['k','সমতুল্য দৃঢ়তা',10,1000,10,200,'N/m'],['l','প্রাথমিক দৈর্ঘ্য',0.1,5,0.1,1,'m']]},
'hydraulic-press-lab':{t:'Hydraulic Press & Pressure Lab',chapter:'structure',icon:'🛠️',kind:'fluid',desc:'দুটি পিস্টনের ক্ষেত্রফল ও বল বদলে প্যাসকেলের সূত্র এবং জলবাহী যান্ত্রিক সুবিধা পরীক্ষা করুন।',formula:'P₁ = P₂; F₂/F₁ = A₂/A₁ (আদর্শ পিস্টনে)',curve:'hydraulic',controls:[['f','প্রয়োগ বল',1,500,1,60,'N'],['a1','ছোট পিস্টনের ক্ষেত্রফল',1,50,1,10,'cm²'],['a2','বড় পিস্টনের ক্ষেত্রফল',10,500,5,100,'cm²']]},
'buoyancy-floating-lab':{t:'Buoyancy & Floating Objects',chapter:'structure',icon:'🛟',kind:'fluid',desc:'বস্তুর ও তরলের ঘনত্ব বদলে প্লব বল, আপাত ওজন ও ভাসমান বস্তুর নিমজ্জিত অংশ নির্ণয় করুন।',formula:'Fᵦ = ρতরল g Vনিমজ্জিত; ভাসমান বস্তুর জন্য Vনিমজ্জিত/V = ρবস্তু/ρতরল',curve:'buoyancy',controls:[['rho','তরলের ঘনত্ব',100,1500,10,1000,'kg/m³'],['obj','বস্তুর ঘনত্ব',100,1800,10,700,'kg/m³'],['v','বস্তুর আয়তন',0.001,0.1,0.001,0.02,'m³']]},
'bernoulli-flow-lab':{t:'Fluid Flow & Bernoulli Lab',chapter:'structure',icon:'🫗',kind:'fluid',desc:'নলের প্রস্থ, উচ্চতা ও প্রবাহ বেগ বদলে ধারাবাহিকতা ও বার্নৌলির নীতি পরীক্ষা করুন।',formula:'A₁v₁ = A₂v₂; P + ½ρv² + ρgh = ধ্রুবক',curve:'bernoulli',controls:[['a','প্রস্থচ্ছেদের ক্ষেত্রফল',1,100,1,50,'cm²'],['v','প্রবাহ বেগ',0.1,15,0.1,3,'m/s'],['rho','তরলের ঘনত্ব',500,1500,10,1000,'kg/m³']]},
'viscosity-terminal-velocity-lab':{t:'Viscosity & Terminal Velocity',chapter:'structure',icon:'🛢️',kind:'fluid',desc:'তরলের সান্দ্রতা, গোলকের ব্যাসার্ধ ও ঘনত্ব পরিবর্তন করে স্টোকসের সূত্রভিত্তিক প্রান্তিক বেগ দেখুন।',formula:'vₜ = 2r²(ρs − ρf)g/(9η) (স্টোকস অঞ্চলে গোলকের জন্য)',curve:'viscosity',controls:[['r','গোলকের ব্যাসার্ধ',0.1,5,0.1,1,'mm'],['eta','সান্দ্রতা',0.1,10,0.1,1,'Pa·s'],['drho','ঘনত্বের পার্থক্য',10,3000,10,1500,'kg/m³']]},
'surface-tension-capillary-lab':{t:'Surface Tension & Capillary Rise',chapter:'structure',icon:'🧼',kind:'fluid',desc:'নলের ব্যাসার্ধ, পৃষ্ঠটান ও সংস্পর্শ কোণ বদলে কৈশিক উচ্চতা এবং ফোঁটার অতিরিক্ত চাপ পরীক্ষা করুন।',formula:'h = 2γ cos θ/(ρgr); ফোঁটার ΔP = 2γ/r; সাবানের বুদবুদে ΔP = 4γ/r',curve:'capillary',controls:[['gamma','পৃষ্ঠটান',0.01,0.1,0.001,0.072,'N/m'],['r','কৈশিক নলের ব্যাসার্ধ',0.05,2,0.05,0.5,'mm'],['ang','সংস্পর্শ কোণ',0,180,5,20,'°']]},
'torricelli-outflow-lab':{t:'Liquid Outflow & Torricelli’s Law',chapter:'structure',icon:'🚰',kind:'fluid',desc:'তরলের মুক্ত পৃষ্ঠ থেকে ছিদ্রের গভীরতা বদলে নির্গমন বেগ ও ജেটের অনুভূমিক পাল্লা দেখুন।',formula:'v = √(2gh) (আদর্শ, ঘর্ষণহীন ও বড় পাত্রের জন্য)',curve:'torricelli',controls:[['h','ছিদ্রের ওপর তরলের উচ্চতা',0.1,10,0.1,2,'m'],['g','অভিকর্ষজ ত্বরণ',1,15,0.1,9.8,'m/s²'],['y','মাটি থেকে ছিদ্রের উচ্চতা',0.1,10,0.1,3,'m']]},
'shm-explorer-lab':{t:'SHM Explorer',chapter:'periodic',icon:'🕰️',kind:'oscillation',desc:'বিস্তার, কৌণিক কম্পাঙ্ক ও প্রাথমিক দশা বদলে সরণ, বেগ ও ত্বরণের একই সময়ের মান দেখুন।',formula:'x = A sin(ωt + φ); v = Aω cos(ωt + φ); a = −ω²x',curve:'shm',controls:[['A','বিস্তার',0.1,5,0.1,2,'m'],['w','কৌণিক কম্পাঙ্ক',0.1,10,0.1,2,'rad/s'],['phi','প্রাথমিক দশা',-3.1,3.1,0.1,0,'rad']]},
'shm-energy-lab':{t:'SHM Energy Lab',chapter:'periodic',icon:'💠',kind:'oscillation',desc:'সরল ছন্দিত গতির বিভিন্ন অবস্থানে গতিশক্তি, বিভবশক্তি ও মোট শক্তি তুলনা করুন।',formula:'E = ½kA²; U = ½kx²; K = ½k(A² − x²)',curve:'shmEnergy',controls:[['k','স্প্রিং ধ্রুবক',5,500,5,100,'N/m'],['A','বিস্তার',0.1,2,0.1,1,'m'],['x','তাৎক্ষণিক সরণ',-2,2,0.1,0.5,'m']]},
'phase-difference-studio':{t:'Phase Difference Studio',chapter:'periodic',icon:'🪢',kind:'oscillation',desc:'দুটি একই কম্পাঙ্কের SHM-এর দশা পার্থক্য বদলে তাদের যোগফলের বিস্তার দেখুন।',formula:'Aᵣ = √(A₁² + A₂² + 2A₁A₂ cos δ)',curve:'phase',controls:[['a','প্রথম বিস্তার',0.1,5,0.1,2,'m'],['b','দ্বিতীয় বিস্তার',0.1,5,0.1,1.5,'m'],['d','দশা পার্থক্য',0,360,1,60,'°']]},
'wave-superposition-lab':{t:'Wave Superposition Lab',chapter:'waves',icon:'🪇',kind:'wave',desc:'দুটি তরঙ্গের বিস্তার, তরঙ্গদৈর্ঘ্য ও দশা পরিবর্তন করে গঠনমূলক ও ধ্বংসাত্মক ব্যতিচার দেখুন।',formula:'y = A₁sin(kx−ωt) + A₂sin(kx−ωt+δ)',curve:'superposition',controls:[['a','প্রথম বিস্তার',0.1,5,0.1,2,'cm'],['b','দ্বিতীয় বিস্তার',0.1,5,0.1,1.5,'cm'],['d','দশা পার্থক্য',0,360,1,45,'°']]},
'air-column-resonance-lab':{t:'Air Column Resonance Lab',chapter:'waves',icon:'🎷',kind:'wave',desc:'খোলা ও এক প্রান্ত বন্ধ নলের দৈর্ঘ্য পরিবর্তন করে মৌলিক কম্পাঙ্ক ও হারমোনিক পরীক্ষা করুন।',formula:'খোলা নল: fₙ = nv/(2L); বন্ধ নল: fₙ = (2n−1)v/(4L)',curve:'airColumn',controls:[['L','নলের দৈর্ঘ্য',0.05,3,0.05,0.5,'m'],['v','শব্দের বেগ',300,360,1,343,'m/s'],['n','হারমোনিক সূচক',1,9,1,3,'']]},
'beats-frequency-lab':{t:'Beats & Sound Mixer',chapter:'waves',icon:'🔔',kind:'wave',desc:'দুটি কাছাকাছি কম্পাঙ্কের শব্দ যোগ করে লব্ধি কম্পনের বিস্তার-পরিবর্তন ও বিট কম্পাঙ্ক দেখুন।',formula:'বিট কম্পাঙ্ক fᵦ = |f₁ − f₂|',curve:'beats',controls:[['f1','প্রথম কম্পাঙ্ক',100,500,1,256,'Hz'],['df','কম্পাঙ্কের পার্থক্য',0,20,0.5,4,'Hz'],['a','বিস্তার',0.1,5,0.1,2,'একক']]},
'doppler-effect-lab':{t:'Doppler Effect Simulator',chapter:'waves',icon:'🚑',kind:'wave',desc:'শব্দের উৎস ও পর্যবেক্ষকের আপেক্ষিক বেগ পরিবর্তন করে পর্যবেক্ষিত কম্পাঙ্ক নির্ণয় করুন।',formula:'f′ = f(v ± vₒ)/(v ∓ vₛ); চিহ্নের নিয়মে কাছে আসা/দূরে যাওয়া বিবেচ্য',curve:'doppler',controls:[['f','উৎসের কম্পাঙ্ক',100,1200,10,500,'Hz'],['vs','উৎসের বেগ',0,100,1,20,'m/s'],['vo','পর্যবেক্ষকের বেগ',-50,50,1,0,'m/s']]},
'sound-intensity-distance-lab':{t:'Sound Intensity & Decibel Lab',chapter:'waves',icon:'🔊',kind:'wave',desc:'শব্দের উৎস থেকে দূরত্ব ও ক্ষমতা পরিবর্তন করে তীব্রতা এবং ডেসিবেল স্তরের পরিবর্তন তুলনা করুন।',formula:'I = P/(4πr²); β = 10 log₁₀(I/I₀) dB',curve:'sound',controls:[['P','শব্দ উৎসের ক্ষমতা',0.1,100,0.1,10,'W'],['r','দূরত্ব',0.5,100,0.5,5,'m'],['I0','রেফারেন্স তীব্রতা সূচক',-14,-10,1,-12,'×10⁻¹² W/m²']]},
'molecular-speed-distribution-lab':{t:'Molecular Speed Distribution',chapter:'gas',icon:'🌪️',kind:'gas',desc:'তাপমাত্রা ও গ্যাসের আণবিক ভর বদলে ম্যাক্সওয়েল-বল্টজমান বেগ-বণ্টন এবং RMS বেগ তুলনা করুন; নমুনা-সংখ্যা বাড়ালে অণু-চিত্রে বিন্দুর সংখ্যাও বাড়বে।',formula:'vᵣₘₛ = √(3RT/M); বেগ-বণ্টন বক্ররেখার শীর্ষ ও বিস্তার তাপমাত্রার সঙ্গে বদলায়',curve:'maxwell',controls:[['T','পরম তাপমাত্রা',100,1500,10,300,'K'],['M','মোলার ভর',2,100,1,28,'g/mol'],['n','অণুর নমুনা-সংখ্যা',100,10000,100,3000,'']]},
'kinetic-pressure-lab':{t:'Kinetic Theory Pressure Lab',chapter:'gas',icon:'🌫️',kind:'gas',desc:'গ্যাস অণুর RMS বেগ ও ঘনত্ব পরিবর্তন করে গতিতত্ত্বের চাপ-সমীকরণ যাচাই করুন।',formula:'P = ⅓ρcᵣₘₛ²',curve:'kineticPressure',controls:[['rho','গ্যাসের ঘনত্ব',0.1,10,0.1,1.2,'kg/m³'],['c','RMS বেগ',50,1000,10,450,'m/s']]},
'thermodynamic-process-lab':{t:'Thermodynamic Process Explorer',chapter:'gas',icon:'🔥',kind:'gas',desc:'সমতাপ, রুদ্ধতাপ, সমচাপ ও সমআয়তন প্রক্রিয়া নির্বাচন করে P-V অবস্থা, কাজ ও অভ্যন্তরীণ শক্তির পরিবর্তন তুলনা করুন।',formula:'প্রথম সূত্র: ΔU = Q − W (W হলো গ্যাসের দ্বারা সম্পন্ন কাজ)',curve:'thermo',controls:[['P','প্রাথমিক চাপ',50,500,10,200,'kPa'],['V','প্রাথমিক আয়তন',1,20,1,5,'L'],['T','প্রাথমিক তাপমাত্রা',200,800,10,300,'K']]},
'pv-cycle-lab':{t:'PV Cycle & Work Lab',chapter:'gas',icon:'🔄',kind:'gas',desc:'P-V চক্রের চারটি অবস্থা পরিবর্তন করে বদ্ধ ক্ষেত্রফল ও পুরো চক্রের নিট কাজ নির্ণয় করুন।',formula:'চক্রে ΔU = 0; নিট কাজ = P-V চিত্রের আবদ্ধ ক্ষেত্রফল',curve:'cycle',controls:[['p','চাপের পার্থক্য',10,300,5,100,'kPa'],['v','আয়তনের পার্থক্য',0.5,10,0.5,4,'L'],['n','চক্রের সংখ্যা',1,10,1,1,'']]},
'gas-internal-energy-lab':{t:'Degrees of Freedom & Internal Energy',chapter:'gas',icon:'🔆',kind:'gas',desc:'গ্যাসের তাপমাত্রা, মোল সংখ্যা ও স্বাধীনতার মাত্রা বদলে অভ্যন্তরীণ শক্তির পরিবর্তন দেখুন।',formula:'U = (f/2)nRT; ΔU = (f/2)nRΔT (আদর্শ গ্যাসে)',curve:'internalEnergy',controls:[['f','স্বাধীনতার মাত্রা',3,7,1,3,''],['n','মোল সংখ্যা',0.1,10,0.1,1,'mol'],['T','তাপমাত্রা',100,1000,10,300,'K'] ]}
};
var meta=[];
Object.keys(configs).forEach(function(id){var c=configs[id];meta.push({id:id,sim:id,on:true,icon:c.icon,t:c.t,sub:'Physics',d:c.desc,tip:c.formula,hsc:true,physicsChapter:chapterNames[c.chapter],chapter:chapterNames[c.chapter],concept:c.t,physicsAdded:true});});
function applyPhysicsCatalog(labs){
 labs=labs||[];var byId={};labs.forEach(function(l){if(l&&l.id)byId[l.id]=l;});
 var chapterById={
 'lab-slide-calipers':'measurement','lab-screw-gauge':'measurement','river-boat':'vectors','hsc-math-vectors':'vectors','hsc-math-vector-products':'vectors','tiger-deer':'kinematics','bus-train-motion':'kinematics','hsc-phy-projectile':'kinematics','hsc-phy-newton':'dynamics','inclined-plane-friction':'dynamics','hsc-phy-circular-motion':'dynamics','hsc-phy-periodic':'periodic','hsc-phy-spring':'periodic','wave':'waves','hsc-phy-wave':'waves','hsc-phy-standing-waves':'waves','gas':'gas','hsc-phy-gas':'gas','hsc-phy-work-energy':'energy','hsc-phy-gravity':'gravity'};
 Object.keys(chapterById).forEach(function(id){var l=byId[id],ck=chapterById[id];if(l){l.physicsChapter=chapterNames[ck];l.chapter=chapterNames[ck];l.sub='Physics';l.hsc=true;}});
 /* The old general force mapping was not a genuine work-energy or gravitation model. */
 if(byId['hsc-phy-work-energy']){byId['hsc-phy-work-energy'].sim='work-force-displacement-lab';}
 if(byId['hsc-phy-gravity']){byId['hsc-phy-gravity'].sim='universal-gravitation-lab';}
 /* Keep the base vector-adder in the Physics chapter catalogue; vector products remain a distinct lab. */
 if(byId['hsc-math-vectors']){byId['hsc-math-vectors'].physicsChapter=chapterNames.vectors;byId['hsc-math-vectors'].chapter=chapterNames.vectors;byId['hsc-math-vectors'].sub='Physics';byId['hsc-math-vectors'].t='ভেক্টর যোগ: ত্রিভুজ, সামান্তরিক, বহুভুজ ও উপাংশ';byId['hsc-math-vectors'].d='ভেক্টর যোগের চার পদ্ধতি বেছে নিন—ত্রিভুজ সূত্র, সামান্তরিক সূত্র, বহুভুজ সূত্র ও উপাংশ পদ্ধতি। তীরের মাথা টেনে মান ও দিক পরিবর্তন করুন; লব্ধি তাৎক্ষণিক আপডেট হবে।';byId['hsc-math-vectors'].icon='🧭';}
 if(byId['hsc-math-vector-products']){byId['hsc-math-vector-products'].physicsChapter=chapterNames.vectors;byId['hsc-math-vector-products'].chapter=chapterNames.vectors;}
 return labs;
}
window.CL_PHYSICS_CATALOG={chapters:chapterNames,additions:meta,apply:applyPhysicsCatalog,configs:configs};
/* Add the catalog before app.js merges saved content; the app later applies chapter metadata after deduplication. */
var extraPhysicsLabs=[
 {id:'hsc-phy-falling-object',sim:'fallingObject',on:true,icon:'🍃',t:'পড়ন্ত বস্তু: Free Fall',sub:'Physics',d:'উচ্চতা ও অভিকর্ষজ ত্বরণ বদলে পতনের সময়, বেগ ও মাটিতে পৌঁছানোর শর্ত পরীক্ষা করুন।',tip:'স্থির অবস্থা থেকে পড়লে t = √(2h/g), আঘাতের ঠিক আগে v = √(2gh)।',chapter:chapterNames.kinematics,physicsChapter:chapterNames.kinematics,concept:'Free Fall',hsc:true},
 {id:'hsc-phy-drop-vs-projectile',sim:'dropVsProjectile',on:true,icon:'🪂',t:'পড়ন্ত বনাম নিক্ষিপ্ত বস্তু',sub:'Physics',d:'একটি বস্তু উচ্চতা থেকে ছেড়ে দিন, অন্যটিকে ভূমি থেকে সোজা উপরের দিকে নিক্ষেপ করুন। পতনের সময় ও মোট উড্ডয়নকাল তুলনা করুন।',tip:'স্থির অবস্থা থেকে h উচ্চতা হতে পতনের সময় √(2h/g); ভূমি থেকে u বেগে উল্লম্ব নিক্ষেপের মোট উড্ডয়নকাল 2u/g।',chapter:chapterNames.kinematics,physicsChapter:chapterNames.kinematics,concept:'Free Fall vs Vertical Throw from Ground',hsc:true},
 {id:'hsc-phy-gun-bullet-recoil',sim:'gunBullet',on:true,icon:'💨',t:'বন্দুক ও গুলি: ভরবেগ সংরক্ষণ',sub:'Physics',d:'শুধু আদর্শ ভরবেগ সংরক্ষণ মডেল: বুলেট সামনের দিকে গেলে বন্দুকের পশ্চাৎবেগ ও ভরবেগের সম্পর্ক দেখুন।',tip:'প্রাথমিক মোট ভরবেগ শূন্য হলে Mv_g + mv_b = 0।',chapter:chapterNames.dynamics,physicsChapter:chapterNames.dynamics,concept:'Momentum Conservation & Recoil',hsc:true}
];
if(window.CL_DEF){window.CL_DEF.labs=window.CL_DEF.labs||[];meta.forEach(function(m){if(!window.CL_DEF.labs.some(function(l){return l.id===m.id;}))window.CL_DEF.labs.push(m);});extraPhysicsLabs.forEach(function(m){if(!window.CL_DEF.labs.some(function(l){return l.id===m.id||l.sim===m.sim;}))window.CL_DEF.labs.push(m);});window.CL_DEF.navigation=window.CL_DEF.navigation||[];if(!window.CL_DEF.navigation.some(function(n){return n.id==='graphs';}))window.CL_DEF.navigation.push({id:'graphs',href:'#/graphs',label:'গ্রাফ',description:'অধ্যায়ভিত্তিক ইন্টারঅ্যাকটিভ গ্রাফ ল্যাব',enabled:true});if(!window.CL_DEF.navigation.some(function(n){return n.id==='shortcuts';}))window.CL_DEF.navigation.push({id:'shortcuts',href:'#/shortcuts',label:'Shortcut Tricks',description:'সব অধ্যায়ের দ্রুত সূত্র ও পরীক্ষার কৌশল',enabled:true});}

if(window.CL_SIMKEYS){meta.forEach(function(m){if(window.CL_SIMKEYS.indexOf(m.sim)<0)window.CL_SIMKEYS.push(m.sim);});}
function fmt(n,d){return Number.isFinite(n)?n.toFixed(d==null?2:d):'—';}
function pv(p,k,d){return p[k]===undefined||p[k]===null?d:p[k];}
function curveValue(key,x,p){p=p||{};var g=9.8,ang=pv(p,'ang',0)*Math.PI/180,a=pv(p,'a',1),b=pv(p,'b',1),k=pv(p,'k',1),u=pv(p,'u',0);
 switch(key){
 case'mean':return (p.true||25)+((Math.sin(x*12.9898)*(p.noise||1)) / Math.sqrt(Math.max(1,p.n||8)));
 case'dimension':return Math.pow(Math.abs(x)+.1,pv(p,'l',2))*Math.pow(Math.max(.1,pv(p,'t',1)),-1);
 case'conversion':return (p.v||25)*Math.pow(p.factor||.01,p.pow||2)*(x/10);
 case'components':return (p.a||40)*Math.sin(x*Math.PI/180);
 case'resultant':return Math.sqrt(Math.max(0,(p.a||40)**2+(p.b||30)**2+2*(p.a||40)*(p.b||30)*Math.cos(x*Math.PI/180)));
 case'motion':return pv(p,'u',4)*x+.5*pv(p,'a',1)*x*x;
 case'freefall':return pv(p,'h',60)+pv(p,'u',10)*x-.5*pv(p,'g',9.8)*x*x;
 case'force':return pv(p,'f',80)-pv(p,'mu',.3)*pv(p,'m',20)*g;
 case'pulley':return ((p.m2||15)-(p.m1||10))*g/((p.m1||10)+(p.m2||15));
 case'elevator':return pv(p,'m',60)*(pv(p,'g',9.8)+pv(p,'a',2));
 case'collision':return pv(p,'m1',10)*pv(p,'v',12);
 case'impulse':return (p.f||80)*x;
 case'verticalCircle':return Math.max(0,(p.m||1)*((p.v||8)**2-2*g*(p.r||1.5)*(1-Math.cos(x)))/(p.r||1.5));
 case'work':return pv(p,'f',50)*x*Math.cos(pv(p,'ang',30)*Math.PI/180);
 case'energy':return pv(p,'m',10)*g*pv(p,'h',30)*Math.max(0,1-x)*(1-pv(p,'loss',.1)*x);
 case'springEnergy':return .5*(p.k||100)*x*x;
 case'power':return (p.m||80)*g*(p.v||1.2);
 case'gravitation':return 6.674e-11*(p.m1||20)*(p.m2||30)/(Math.max(1,x)**2);
 case'gravityProfile':{var R=pv(p,'r',6371),h=(x-5)*Math.abs(pv(p,'h',1000))/5;if(h>=0)return pv(p,'g',9.8)*Math.pow(R/(R+h),2);return pv(p,'g',9.8)*Math.max(0,(R+h)/R);}
 case'potential':return -(p.M||60)*(p.m||5)/Math.max(1,x);
 case'orbit':return Math.sqrt((p.M||60)/Math.max(1,x));
 case'escape':return Math.sqrt(2*pv(p,'M',60)/Math.max(1,pv(p,'R',5)+x));
 case'elastic':return (p.k||200)*x;
 case'hydraulic':return (p.f||60)*(p.a2||100)/(p.a1||10)*x;
 case'buoyancy':return (p.rho||1000)*g*(p.v||.02)*x;
 case'bernoulli':return Math.max(0,150000-.5*(p.rho||1000)*((p.v||3)*x)**2);
 case'viscosity':return 2*Math.pow((p.r||1)*x/1000,2)*(p.drho||1500)*g/(9*(p.eta||1));
 case'capillary':return 2*(p.gamma||.072)*Math.cos((p.ang||20)*Math.PI/180)/((p.r||.5)*x/1000*1000*g);
 case'torricelli':return Math.sqrt(Math.max(0,2*(p.g||9.8)*x));
 case'shm':return pv(p,'A',2)*Math.sin(pv(p,'w',2)*x+pv(p,'phi',0));
 case'shmEnergy':return Math.max(0,.5*(p.k||100)*(p.A||1)**2-.5*(p.k||100)*x*x);
 case'phase':return Math.sqrt(Math.max(0,(p.a||2)**2+(p.b||1.5)**2+2*(p.a||2)*(p.b||1.5)*Math.cos(x*Math.PI/180)));
 case'superposition':return (p.a||2)*Math.sin(x)+(p.b||1.5)*Math.sin(x+(p.d||45)*Math.PI/180);
 case'airColumn':{var hn=Math.max(1,x),closed=p.pipe==='closed';return (closed?(2*hn-1):hn)*(p.v||343)/((closed?4:2)*(p.L||.5));}
 case'beats':return 2*(p.a||2)*Math.cos(Math.PI*Math.abs(p.df||0)*x);
 case'doppler':return (p.f||500)*(343+(p.vo||0))/Math.max(50,343-x);
 case'sound':return 10*Math.log10(Math.max(1e-30,(p.P||10)/(4*Math.PI*Math.pow(Math.max(.1,x),2))/Math.pow(10,p.I0||-12)));
 case'maxwell':{var s=Math.sqrt(8.314*(p.T||300)/Math.max(.001,(p.M||28)/1000));return x*x*Math.exp(-x*x/(2*s*s))/Math.pow(Math.max(1,s),3);}
 case'kineticPressure':return (p.rho||1.2)*((p.c||450)*x)**2/3;
 case'thermo':{var mode=p.mode||'isothermal',V=Math.max(.1,x),P0=p.P||200,V0=p.V||5;if(mode==='isobaric')return P0;if(mode==='isochoric')return V===V0?P0:NaN;if(mode==='adiabatic')return P0*Math.pow(V0/V,5/3);return P0*V0/V;}
 case'cycle':return (p.p||100)*(p.v||4)*x*(p.n||1);
 case'internalEnergy':return .5*(p.f||3)*(p.n||1)*8.314*(p.T||300)*x;
 default:return Math.sin(x)*a;
 }
}
function renderMechanicsLab(id,root,done,c){
 root.innerHTML='';var intro=document.createElement('p');intro.className='sim-intro';intro.textContent=c.desc;root.appendChild(intro);
 var controlBox=document.createElement('div');controlBox.className='ctl';var state={},items=[];
 c.controls.forEach(function(d){var row=document.createElement('div'),lab=document.createElement('label'),span=document.createElement('span'),out=document.createElement('output'),input=document.createElement('input');span.textContent=d[1];input.type='range';input.min=d[2];input.max=d[3];input.step=d[4];input.value=d[5];input.setAttribute('aria-label',d[1]);out.textContent=d[5]+(d[6]||'');lab.appendChild(span);lab.appendChild(out);row.appendChild(lab);row.appendChild(input);controlBox.appendChild(row);state[d[0]]=+d[5];items.push({key:d[0],out:out,input:input,def:d});input.addEventListener('input',function(){state[d[0]]=+input.value;out.textContent=fmt(+input.value,3)+(d[6]||'');draw();if(done)done();});});root.appendChild(controlBox);
 var guide=buildPhysicsGuide(c,function(){var defaults={};c.controls.forEach(function(d){defaults[d[0]]=+d[5];});setPhysicsValues(c,items,state,defaults,draw);guide._status.textContent='ডিফল্ট মানে ফিরে এসেছে।';},function(){setPhysicsValues(c,items,state,physicsMissionPreset(c),draw);guide._status.textContent='মিশনের মান বসানো হয়েছে—এখন বল ও ফলাফলের পরিবর্তন দেখুন।';});root.insertBefore(guide,controlBox);
 var canvas=document.createElement('canvas');canvas.className='cv2 physics-model-canvas mechanics-model-canvas';canvas.width=900;canvas.height=380;canvas.style.width='100%';canvas.style.height='auto';canvas.style.aspectRatio='900 / 380';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',c.t+'—পরিবর্তনযোগ্য ভৌত চিত্র');root.appendChild(canvas);var x=canvas.getContext('2d');
 var stats=document.createElement('div');stats.className='physics-model-stats mechanics-model-stats';root.appendChild(stats);
 var formula=document.createElement('p');formula.className='lens-note';formula.textContent='প্রধান সম্পর্ক: '+c.formula;root.appendChild(formula);
 var note=document.createElement('p');note.className='mutt mechanics-model-note';root.appendChild(note);
 function roundedRect(ctx,x0,y0,w,h,r,fill,stroke){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x0,y0,w,h,r);else ctx.rect(x0,y0,w,h);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
 function arrow(ctx,x1,y1,x2,y2,color,label,offsetX,offsetY){ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();var a=Math.atan2(y2-y1,x2-x1),h=10;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-h*Math.cos(a-.5),y2-h*Math.sin(a-.5));ctx.lineTo(x2-h*Math.cos(a+.5),y2-h*Math.sin(a+.5));ctx.closePath();ctx.fill();if(label){ctx.font='bold 13px system-ui';ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(label,(x1+x2)/2+(offsetX||0),(y1+y2)/2+(offsetY||-9));}}
 function frame(title,subtitle){x.clearRect(0,0,canvas.width,canvas.height);x.fillStyle='#071827';x.fillRect(0,0,canvas.width,canvas.height);x.strokeStyle='rgba(125,190,230,.12)';x.lineWidth=1;for(var j=0;j<7;j++){x.beginPath();x.moveTo(18,48+j*45);x.lineTo(882,48+j*45);x.stroke();}x.fillStyle='#e2edf8';x.font='bold 20px system-ui';x.textAlign='left';x.fillText(title,24,30);x.fillStyle='#9fb6cb';x.font='12px system-ui';x.fillText(subtitle,24,52);}
 function stat(items){stats.innerHTML=items.map(function(it){return'<div class="physics-model-stat"><small>'+it[0]+'</small><b>'+it[1]+'</b></div>';}).join('');}
 function drawFBD(){var m=state.m,F=state.f,mu=state.mu,g=9.8,w=m*g,N=w,fr=Math.min(F,mu*N),net=F-fr,a=net/m,cx=450,cy=220;frame('Free-Body Diagram','সমতল তল, দড়ি/অন্য বল বাদ; ধনাত্মক x ডানে ও y উপরে');
  x.fillStyle='#24445a';x.fillRect(100,284,700,20);x.strokeStyle='#6b8ba3';x.beginPath();x.moveTo(100,284);x.lineTo(800,284);x.stroke();
  roundedRect(x,cx-55,cy-36,110,72,12,'#164b68','#38bdf8');x.fillStyle='#eaf6ff';x.font='bold 16px system-ui';x.textAlign='center';x.fillText('m = '+m+' kg',cx,cy+5);
  var forceScale=100/Math.max(w,N,F,fr,1),sw=w*forceScale,sn=N*forceScale,sf=F*forceScale,sfr=fr*forceScale;
  arrow(x,cx-25,cy-36,cx-25,cy-36-sn,'#34d399','N = '+N.toFixed(1)+' N',-52,0);arrow(x,cx+27,cy+36,cx+27,cy+36+sw,'#f87171','W = mg = '+w.toFixed(1)+' N',60,0);
  if(F>0)arrow(x,cx+55,cy-8,cx+55+sf,cy-8,'#38bdf8','F = '+F.toFixed(1)+' N',0,-13);if(fr>0)arrow(x,cx-55,cy+13,cx-55-sfr,cy+13,'#fbbf24','f = '+fr.toFixed(1)+' N',0,22);
  x.fillStyle='#cbd5e1';x.font='13px system-ui';x.textAlign='left';x.fillText('ΣFₓ = F − f = '+net.toFixed(2)+' N',24,348);x.fillText('ΣFᵧ = N − mg = 0 N',480,348);
  stat([['ওজন mg',w.toFixed(2)+' N'],['লম্ব প্রতিক্রিয়া N',N.toFixed(2)+' N'],['ঘর্ষণ বল f',fr.toFixed(2)+' N'],['নিট বল / ত্বরণ',net.toFixed(2)+' N · '+a.toFixed(3)+' m/s²']]);note.textContent=F<=mu*N?'এই মডেলে F ≤ μN হলে সর্বোচ্চ স্থিতি-ঘর্ষণ সীমার মধ্যে ব্লক স্থির থাকে; ঘর্ষণ প্রয়োগকৃত বলকে সাম্য করে।':'প্রয়োগকৃত বল ঘর্ষণের সীমা ছাড়ালে ব্লক ডানে ত্বরিত হয়; এখানে f = μN ধরা হয়েছে।';
 }
 function drawPulley(){var m1=state.m1,m2=state.m2,g=state.g,a=(m2-m1)*g/(m1+m2),T=2*m1*m2*g/(m1+m2),cx=450,cy=125,r=52,shift=Math.max(-54,Math.min(54,a*4)),y1=246-shift,y2=246+shift;frame('Connected Bodies & Pulley','আদর্শ পুলি, হালকা ও প্রসারণহীন দড়ি; ঘর্ষণ উপেক্ষা করা হয়েছে');
  x.strokeStyle='#9fb6cb';x.lineWidth=7;x.beginPath();x.moveTo(cx,60);x.lineTo(cx,75);x.stroke();x.fillStyle='#233c51';x.fillRect(cx-70,58,140,9);x.strokeStyle='#b6c6d8';x.lineWidth=5;x.beginPath();x.moveTo(cx-r,cy);x.lineTo(cx-r,y1-28);x.moveTo(cx+r,cy);x.lineTo(cx+r,y2-28);x.stroke();x.beginPath();x.arc(cx,cy,r,Math.PI,2*Math.PI);x.stroke();x.fillStyle='#14293a';x.beginPath();x.arc(cx,cy,8,0,Math.PI*2);x.fill();
  roundedRect(x,cx-r-29,y1-28,58,56,8,'#174a66','#38bdf8');roundedRect(x,cx+r-29,y2-28,58,56,8,'#174a66','#38bdf8');x.fillStyle='#eaf6ff';x.font='bold 16px system-ui';x.textAlign='center';x.fillText('m₁',cx-r,y1+5);x.fillText('m₂',cx+r,y2+5);x.fillStyle='#cbd5e1';x.font='13px system-ui';x.fillText(m1+' kg',cx-r,y1+48);x.fillText(m2+' kg',cx+r,y2+48);
  if(a>0.001){arrow(x,cx+r+38,y2-18,cx+r+38,y2+22,'#f87171','m₂ নিচে',40,0);arrow(x,cx-r-38,y1+18,cx-r-38,y1-22,'#34d399','m₁ উপরে',-42,0);}else if(a<-.001){arrow(x,cx-r-38,y1-18,cx-r-38,y1+22,'#f87171','m₁ নিচে',-42,0);arrow(x,cx+r+38,y2+18,cx+r+38,y2-22,'#34d399','m₂ উপরে',42,0);}else{x.fillStyle='#7dd3fc';x.font='bold 14px system-ui';x.fillText('দুই ভর সমান: ত্বরণ শূন্য',cx,220);}
  x.fillStyle='#cbd5e1';x.textAlign='left';x.font='13px system-ui';x.fillText('দড়ির উভয় পাশে টান T সমান',24,348);
  stat([['ত্বরণ a',(Math.abs(a)<.0005?0:a).toFixed(3)+' m/s²'],['দড়ির টান T',T.toFixed(2)+' N'],['দিক',a>0?'m₂ নিচে, m₁ উপরে':a<0?'m₁ নিচে, m₂ উপরে':'সাম্যাবস্থা'],['নিট ভর', (m1+m2).toFixed(2)+' kg']]);note.textContent='a = (m₂ − m₁)g/(m₁ + m₂), T = 2m₁m₂g/(m₁ + m₂)। ভর সমান হলে a = 0; ভারী পাশ নিচে নামে।';
 }
 function drawElevator(){var m=state.m,a=state.a,g=state.g,W=m*g,raw=m*(g+a),N=Math.max(0,raw),cx=450,carY=125;frame('Elevator & Apparent Weight','উপরের দিককে ধনাত্মক ধরা হয়েছে; স্কেলের পাঠ হলো normal force N');
  x.strokeStyle='#56778e';x.lineWidth=8;x.beginPath();x.moveTo(325,70);x.lineTo(325,320);x.moveTo(575,70);x.lineTo(575,320);x.stroke();x.strokeStyle='#284b62';x.lineWidth=3;x.strokeRect(344,carY,212,174);x.fillStyle='#0d2638';x.fillRect(349,carY+5,202,164);x.fillStyle='#1c4058';x.fillRect(367,carY+126,166,25);x.fillStyle='#8aa4b8';x.fillRect(394,carY+118,112,8);
  x.fillStyle='#f4c9a6';x.beginPath();x.arc(cx,carY+53,19,0,Math.PI*2);x.fill();x.strokeStyle='#38bdf8';x.lineWidth=9;x.beginPath();x.moveTo(cx,carY+73);x.lineTo(cx,carY+113);x.stroke();x.lineWidth=7;x.beginPath();x.moveTo(cx,carY+84);x.lineTo(cx-24,carY+105);x.moveTo(cx,carY+84);x.lineTo(cx+24,carY+105);x.stroke();
  x.fillStyle='#dbeafe';x.font='bold 13px system-ui';x.textAlign='center';x.fillText('ব্যক্তি: '+m+' kg',cx,carY+27);x.fillStyle='#7dd3fc';x.font='bold 14px system-ui';x.fillText('স্কেল: '+N.toFixed(1)+' N',cx,carY+145);
  if(a>0.001)arrow(x,650,235,650,155,'#34d399','ত্বরণ ↑',54,-2);else if(a<-.001)arrow(x,650,155,650,235,'#f87171','ত্বরণ ↓',54,-2);else{x.fillStyle='#7dd3fc';x.font='bold 13px system-ui';x.textAlign='center';x.fillText('a = 0',650,140);}
  arrow(x,265,155,265,213,'#f87171','ওজন mg',-26,0);arrow(x,285,250,285,205,'#34d399','N',-12,-4);
  stat([['প্রকৃত ওজন mg',W.toFixed(2)+' N'],['আপাত ওজন / স্কেল পাঠ',N.toFixed(2)+' N'],['আপাত ভর N/g',(N/g).toFixed(2)+' kg'],['অবস্থা',raw<=0.0001?'মুক্ত পতন/স্কেলের সংযোগ নেই':a>0?'উর্ধ্বমুখী ত্বরণ':a<0?'নিম্নমুখী ত্বরণ':'ধ্রুব বেগ বা স্থির']]);note.textContent=raw<=0?'m(g+a) ≤ 0 হওয়ায় ব্যক্তি স্কেলের সঙ্গে সংস্পর্শে থাকতে পারে না; স্কেলের পাঠ ০ N ধরা হয়েছে।':'N = m(g+a), যেখানে a উপরের দিকে ধনাত্মক। নিচে ত্বরণ হলে a ঋণাত্মক, তাই স্কেলের পাঠ কমে; উপরে ত্বরণ হলে বাড়ে।';
 }
 function draw(){if(id==='free-body-builder')drawFBD();else if(id==='pulley-system-lab')drawPulley();else drawElevator();}
 draw();
}
function physicsMissionText(c){
 var m={
  mean:'পরিমাপের সংখ্যা ৮ থেকে ২০ করুন। এরপর বিচ্যুতি বাড়িয়ে দেখুন—আরও বেশি পাঠ নিলে গড়ের অনিশ্চয়তা কীভাবে বদলায়।',
  dimension:'একবারে একটি মাত্রা-সূচক বদলান। দেখুন, সমীকরণের দুই পাশে একই M, L ও T ঘাত রাখা কেন জরুরি।',
  conversion:'একই প্রাথমিক মান রেখে এককের ঘাত ১, ২ ও ৩ করুন। দৈর্ঘ্য, ক্ষেত্রফল ও আয়তনের রূপান্তর তুলনা করুন।',
  components:'মিশনের মান A = 60 এবং θ = 60° বসাবে। এরপর A স্থির রেখে θ = 30°, 60° ও 90° করুন; মূল তীর ও Aₓ/Aᵧ উপাংশ কীভাবে বদলায় দেখুন।',
  resultant:'দুটি বল স্থির রেখে কোণ 0° থেকে 180° করুন। কোন অবস্থায় লব্ধি সবচেয়ে বড় বা ছোট হয় দেখুন।',
  motion:'প্রথমে a = 0, পরে ধনাত্মক ও ঋণাত্মক ত্বরণ দিন। একই সময়ে সরণ ও বেগের পরিবর্তন তুলনা করুন।',
  freefall:'উচ্চতা স্থির রেখে g বদলান, তারপর প্রাথমিক বেগ বদলান। ভূমিতে পৌঁছানোর সময় ও আঘাতের বেগ তুলনা করুন।',
  force:'প্রয়োগকৃত বল ধীরে বাড়ান। কখন বল ঘর্ষণকে অতিক্রম করে এবং নিট বল/ত্বরণ তৈরি হয় লক্ষ্য করুন।',
  pulley:'দুই ভর সমান করুন, তারপর একটি ভর বাড়ান। ত্বরণের দিক ও মান কীভাবে বদলায় দেখুন।',
  elevator:'লিফটের ত্বরণ +g, 0 এবং −g-এর কাছাকাছি করে স্কেলের পাঠ তুলনা করুন।',
  collision:'প্রথম কার্টের বেগের চিহ্ন পাল্টান। মোট ভরবেগের দিক কীভাবে বদলায় দেখুন।',
  impulse:'বল স্থির রেখে বল প্রয়োগের সময় দ্বিগুণ করুন। অভিঘাত J = FΔt কীভাবে বদলায় যাচাই করুন।',
  verticalCircle:'নিচের বিন্দুর বেগ বাড়ান। ওপরের বিন্দুতে দড়ির টান বজায় রাখার শর্তের সঙ্গে তুলনা করুন।',
  work:'বল ও সরণের কোণ 0°, 60° ও 90° করুন। একই বল ও সরণে কাজ কেন বদলায় দেখুন।',
  energy:'শক্তি ক্ষয়ের ভগ্নাংশ 0 থেকে 0.5 করুন। নিচে পৌঁছানোর সময় কত শক্তি গতিশক্তিতে রূপান্তরিত হয় তুলনা করুন।',
  springEnergy:'স্প্রিংয়ের প্রসারণ দ্বিগুণ করুন। পুনঃস্থাপন বল ও সঞ্চিত শক্তি কত গুণ হয় পরীক্ষা করুন।',
  power:'ভর ও বেগ স্থির রেখে দক্ষতা পরিবর্তন করুন। প্রয়োজনীয় ইনপুট ক্ষমতা ও উপযোগী আউটপুট তুলনা করুন।',
  gravitation:'দুটি ভর স্থির রেখে দূরত্ব দ্বিগুণ করুন। মহাকর্ষ বল আনুমানিক কত ভাগ হয় যাচাই করুন।',
  gravityProfile:'পৃষ্ঠের ওপর উচ্চতা ও পৃথিবীর ভেতরে গভীরতা আলাদা আলাদা করে দিন। g-এর প্রবণতা তুলনা করুন।',
  potential:'কেন্দ্র থেকে দূরত্ব দ্বিগুণ করুন। ঋণাত্মক বিভব ও বিভবশক্তির মান কীভাবে বদলায় দেখুন।',
  orbit:'কেন্দ্রীয় ভর স্থির রেখে কক্ষীয় ব্যাসার্ধ বাড়ান। কক্ষীয় বেগ ও পর্যায়কাল তুলনা করুন।',
  escape:'একই গ্রহে কক্ষীয় বেগ ও মুক্তিবেগ তুলনা করুন। তাদের অনুপাত কেন প্রায় √2 হয় দেখুন।',
  elastic:'প্রয়োগকৃত বল বাড়ান। সমতুল্য দৃঢ়তা স্থির থাকলে প্রসারণ ও strain কীভাবে বদলায় দেখুন।',
  hydraulic:'ছোট পিস্টনের ক্ষেত্রফল স্থির রেখে বড় পিস্টনের ক্ষেত্রফল দ্বিগুণ করুন। আউটপুট বলের পরিবর্তন দেখুন।',
  buoyancy:'বস্তুর ঘনত্ব তরলের ঘনত্বের নিচে, সমান ও ওপরে নিয়ে যান। কখন ভাসে আর কখন ডোবে যাচাই করুন।',
  bernoulli:'প্রবাহ বেগ বাড়ান। গতিশীল চাপ ½ρv² কত দ্রুত বাড়ে তা পর্যবেক্ষণ করুন।',
  viscosity:'গোলকের ব্যাসার্ধ বাড়ান। Stokes মডেলে terminal velocity-এর সঙ্গে r² সম্পর্কটি যাচাই করুন।',
  capillary:'সংস্পর্শ কোণ 0° থেকে 90° ও 180° করুন। কৈশিক উচ্চতার চিহ্ন ও মান লক্ষ্য করুন।',
  torricelli:'শুরুতে h = 2 m, পরে h = 8 m করুন। উচ্চতা চারগুণ হলে নির্গমন বেগ ঠিক দ্বিগুণ হয় কি না ফলাফলে মিলিয়ে দেখুন।',
  shm:'বিস্তার A ও কৌণিক কম্পাঙ্ক ω আলাদা আলাদা বদলান। সরণ ও সর্বোচ্চ বেগের পার্থক্য দেখুন।',
  shmEnergy:'বিস্তার দ্বিগুণ করুন। মোট যান্ত্রিক শক্তি কীভাবে বদলায় পরীক্ষা করুন।',
  phase:'দুই তরঙ্গের দশা পার্থক্য 0°, 90° ও 180° তুলনা করুন। লব্ধি বিস্তারের পরিবর্তন দেখুন।',
  superposition:'দুই তরঙ্গের দশা পার্থক্য 0° ও 180° করুন। গঠনমূলক ও ধ্বংসাত্মক ব্যতিচার তুলনা করুন।',
  airColumn:'প্রথমে দুই প্রান্ত খোলা নল থেকে এক প্রান্ত বন্ধ নল বেছে নিন, তারপর n = 4 দিন। একই দৈর্ঘ্য ও শব্দের বেগে অনুমোদিত হারমোনিক ও কম্পাঙ্কের পার্থক্য তুলনা করুন।',
  beats:'দুই উৎসের কম্পাঙ্কের পার্থক্য বাড়ান। প্রতি সেকেন্ডে beat-এর সংখ্যা কীভাবে বদলায় লক্ষ্য করুন।',
  doppler:'উৎসের বেগের দিককে কাছে আসা/দূরে যাওয়া হিসেবে ভাবুন। পর্যবেক্ষিত কম্পাঙ্কের পরিবর্তন দেখুন।',
  sound:'শব্দের উৎসের দূরত্ব দ্বিগুণ করুন। তীব্রতা ও dB স্তর একভাবে কমে কি না তুলনা করুন।',
  maxwell:'তাপমাত্রা বাড়ান। Maxwell বণ্টনের শীর্ষ কীভাবে বেশি বেগের দিকে সরে যায় দেখুন।',
  kineticPressure:'গ্যাসের অণুর RMS বেগ বাড়ান। P ∝ c² সম্পর্ক যাচাই করুন।',
  thermo:'মিশনের মান রুদ্ধতাপ প্রক্রিয়া নির্বাচন করবে। এরপর ড্রপডাউন থেকে সমতাপ, সমচাপ ও সমআয়তনও বেছে নিন। P–V পথের আকৃতি ও ফলাফলের লেবেল তুলনা করুন।',
  cycle:'শুধু চাপের পার্থক্য বদলান, আয়তন অপরিবর্তিত রাখুন। P–V চক্রের উচ্চতা ও আবদ্ধ ক্ষেত্রফল কীভাবে বদলায় দেখুন; এরপর রিসেট করে শুধু আয়তন বদলান।',
  internalEnergy:'স্বাধীনতার মাত্রা f, মোল n অথবা তাপমাত্রা T বাড়ান। U = (f/2)nRT-এর সরল সমানুপাত যাচাই করুন.'
 };
 return m[c.curve]||'একবারে একটি স্লাইডার বদলান। চিত্র, গ্রাফ ও হিসাবের ফল দেখুন; তারপর রিসেট করে আগের অবস্থার সঙ্গে তুলনা করুন।';
}
function physicsMissionPreset(c){
 var p={
  'measurement-uncertainty':{n:20,noise:5},'dimensional-analysis':{m:1,l:1,t:-2},'unit-conversion-lab':{pow:3,factor:.01},
  'vector-components-lab':{a:60,ang:60},'vector-equilibrium-lab':{a:40,b:30,ang:120},
  'motion-graph-studio':{u:4,a:2,t:15},'free-fall-lab':{h:100,u:0,g:9.8},'motion-graph-match':{u:5,a:1,t:15,mode:'velocity'},
  'free-body-builder':{m:20,f:200,mu:.3},'pulley-system-lab':{m1:20,m2:20},'elevator-weight-lab':{a:0},
  'collision-momentum-lab':{v:-12},'impulse-force-time-lab':{f:200,t:1},'vertical-circle-lab':{v:12},
  'work-force-displacement-lab':{ang:90},'energy-conservation-lab':{loss:.5},'spring-energy-lab':{x:.6},'power-efficiency-lab':{eta:60},
  'universal-gravitation-lab':{r:10},'gravity-profile-lab':{h:-3000},'gravitational-potential-lab':{r:8},'satellite-orbit-lab':{r:8},'escape-velocity-lab':{h:10},
  'elasticity-hooke-lab':{f:200},'hydraulic-press-lab':{a2:200},'buoyancy-floating-lab':{obj:1200},'bernoulli-flow-lab':{a:25,v:10},
  'viscosity-terminal-velocity-lab':{r:2},'surface-tension-capillary-lab':{ang:90},'torricelli-outflow-lab':{h:8},
  'shm-explorer-lab':{A:3,w:3},'shm-energy-lab':{A:1.5},'phase-difference-studio':{d:90},'wave-superposition-lab':{d:90},
  'beats-frequency-lab':{df:8},'doppler-effect-lab':{vs:40},'sound-intensity-distance-lab':{r:8},
  'molecular-speed-distribution-lab':{T:500},'kinetic-pressure-lab':{c:600},'thermodynamic-process-lab':{V:8,mode:'adiabatic'},'air-column-resonance-lab':{n:4,pipe:'closed'},
  'pv-cycle-lab':{p:150},'gas-internal-energy-lab':{f:5}
 };
 return p[c.id]||{};
}
function buildPhysicsGuide(c,onReset,onMission,customText){
 var guide=document.createElement('section');guide.className='physics-lab-guide';
 var head=document.createElement('div');head.className='physics-lab-guide-head';
 var kicker=document.createElement('span');kicker.className='physics-lab-guide-kicker';kicker.textContent='TRY · OBSERVE · EXPLAIN';
 var title=document.createElement('strong');title.textContent='কীভাবে পরীক্ষা করবেন';head.appendChild(kicker);head.appendChild(title);guide.appendChild(head);
 var steps=document.createElement('p');steps.className='physics-lab-guide-steps';steps.textContent='১) একটি স্লাইডার বদলান। ২) চিত্র ও ফলাফলের পরিবর্তন দেখুন। ৩) মিশনটি চেষ্টা করুন, তারপর রিসেট করে তুলনা করুন।';guide.appendChild(steps);
 var task=document.createElement('div');task.className='physics-lab-mission';var taskTitle=document.createElement('span');taskTitle.textContent='নিজে পরীক্ষা করুন';var taskText=document.createElement('p');taskText.textContent=customText||physicsMissionText(c);task.appendChild(taskTitle);task.appendChild(taskText);guide.appendChild(task);
 var actions=document.createElement('div');actions.className='physics-lab-guide-actions';var missionBtn=document.createElement('button');missionBtn.type='button';missionBtn.className='btn pri mini';missionBtn.textContent='মিশনের মান বসান';missionBtn.addEventListener('click',function(){if(onMission)onMission();});var resetBtn=document.createElement('button');resetBtn.type='button';resetBtn.className='btn mini';resetBtn.textContent='↺ রিসেট';resetBtn.addEventListener('click',function(){if(onReset)onReset();});actions.appendChild(missionBtn);actions.appendChild(resetBtn);guide.appendChild(actions);
 var status=document.createElement('p');status.className='physics-lab-guide-status';status.setAttribute('aria-live','polite');status.textContent='পরীক্ষা শুরু করতে স্লাইডার টানুন বা মিশনের মান বসান।';guide.appendChild(status);guide._status=status;return guide;
}
function setPhysicsValues(c,items,state,values,redraw){
 (c.controls||[]).forEach(function(d){if(!Object.prototype.hasOwnProperty.call(values,d[0]))return;var raw=values[d[0]],v=typeof raw==='number'?raw:parseFloat(raw);if(!Number.isFinite(v))return;v=Math.max(+d[2],Math.min(+d[3],v));var step=+d[4]||1;v=+d[2]+Math.round((v-(+d[2]))/step)*step;v=Math.max(+d[2],Math.min(+d[3],v));state[d[0]]=v;var item=items.find(function(o){return o.key===d[0];});if(item){item.input.value=String(v);if(item.out)item.out.textContent=fmt(v,3)+(d[6]||'');}});
 ['mode','pipe'].forEach(function(key){if(!Object.prototype.hasOwnProperty.call(values,key))return;state[key]=values[key];var item=items.find(function(o){return o.key===key;});if(item&&item.input)item.input.value=values[key];});
 if(redraw)redraw();
}
function labStat(label,value){return '<div class="physics-model-stat"><small>'+label+'</small><b>'+value+'</b></div>';}
function physicsResult(c,p){
 var g=9.8,fmtN=function(n,d){return Number.isFinite(n)?n.toFixed(d==null?3:d):'—';};
 switch(c.curve){
 case'mean':{var uncertainty=(+p.noise||0)/Math.sqrt(Math.max(1,+p.n||1));return{a:'আনুমানিক গড় মান',av:fmtN(+p.true,2)+' ± '+fmtN(uncertainty,2)+' একক',b:'পরিমাপের সংখ্যা',bv:(p.n||0)+' টি',note:'এখানে অনিশ্চয়তার স্কেল noise/√n হিসেবে দেখানো হয়েছে; এটি বাস্তব পরিমাপ-তথ্য নয়, একটি সরল শিক্ষামডেল।'};}
 case'dimension':return{a:'মাত্রাগত রূপ',av:'M^'+p.m+' L^'+p.l+' T^'+p.t,b:'সমীকরণ যাচাই',bv:'দুই পাশে ঘাত মেলান',note:'মাত্রিক বিশ্লেষণ সূত্রের মাত্রাগত সামঞ্জস্য যাচাই করে; একা এটি সমীকরণটি সম্পূর্ণ প্রমাণ করে না।'};
 case'conversion':{var cv=(+p.v)*Math.pow(+p.factor,+p.pow);return{a:'রূপান্তরিত মান',av:fmtN(cv,5),b:'রূপান্তর গুণক',bv:fmtN(+p.factor,5)+'^'+p.pow,note:'রূপান্তর গুণকটি উদাহরণ হিসেবে দেওয়া; সঠিক একক-জোড়ার জন্য সঠিক গুণক বেছে নিন।'};}
 case'motion':{var t=+p.t,u=+p.u,a=+p.a,x=u*t+.5*a*t*t,v=u+a*t,match={position:'অবস্থান–সময় (x–t)',velocity:'বেগ–সময় (v–t)',acceleration:'ত্বরণ–সময় (a–t)'};return{a:'t সময়ে সরণ (x − x₀)',av:fmtN(x,2)+' m',b:'t সময়ে বেগ',bv:fmtN(v,2)+' m/s',note:c.id==='motion-graph-match'?'নির্বাচিত গ্রাফ: '+(match[p.mode]||match.position)+'. x–t-এর ঢাল বেগ, v–t-এর ঢাল ত্বরণ এবং v–t-এর ক্ষেত্রফল সরণ দেয়।':'x₀ = 0 ধরে সরণ দেখানো হয়েছে। বেগের চিহ্ন দিক নির্দেশ করে।'};}
 case'freefall':{var h=+p.h,u=+p.u,gg=+p.g,thit=(u+Math.sqrt(u*u+2*gg*h))/gg,vhit=u-gg*thit;return{a:'ভূমিতে পৌঁছানোর সময়',av:fmtN(thit,2)+' s',b:'আঘাতের ঠিক আগের বেগ',bv:fmtN(vhit,2)+' m/s',note:'উপরের দিককে ধনাত্মক ধরা; বাতাসের বাধা উপেক্ষা করা হয়েছে।'};}
 case'force':{var m=+p.m,F=+p.f,frMax=+p.mu*m*g,fr=Math.min(F,frMax),net=F-fr,acc=net/m;return{a:'ঘর্ষণ বলের মডেল',av:fmtN(fr,2)+' N',b:'নিট বল / ত্বরণ',bv:fmtN(net,2)+' N / '+fmtN(acc,3)+' m/s²',note:F<=frMax?'স্থিতিঘর্ষণ প্রয়োগকৃত বলের সমান ধরে বস্তু স্থির থাকে।':'ঘর্ষণের সীমা পেরিয়েছে; এই সরল মডেলে বস্তু ডানে ত্বরিত হয়।'};}
 case'pulley':{var m1=+p.m1,m2=+p.m2,acc=(m2-m1)*gg/(m1+m2),T=2*m1*m2*gg/(m1+m2);return{a:'সিস্টেমের ত্বরণ',av:fmtN(acc,3)+' m/s²',b:'দড়ির টান',bv:fmtN(T,2)+' N',note:'আদর্শ, ঘর্ষণহীন পুলি ও ভরহীন দড়ি ধরা হয়েছে।'};}
 case'elevator':{var n=+p.m*(+p.g+ +p.a);return{a:'আপাত ওজন / স্কেল পাঠ',av:fmtN(Math.max(0,n),2)+' N',b:'প্রকৃত ওজন',bv:fmtN(+p.m*+p.g,2)+' N',note:n<=0?'মডেল অনুযায়ী সংস্পর্শ হারানোর পরিস্থিতি; স্কেলের পাঠ ০ N ধরা হয়েছে।':'উপরের দিককে ধনাত্মক ধরা হয়েছে।'};}
 case'collision':{var momentum=+p.m1*+p.v,mt=+p.m1+ +p.m2,vafter=momentum/mt,ke=.5*+p.m1*(+p.v)**2;return{a:'প্রাথমিক মোট ভরবেগ*',av:fmtN(momentum,2)+' kg·m/s',b:'একসাথে চললে বেগ*',bv:fmtN(vafter,3)+' m/s',note:'*সংখ্যাগত তুলনার জন্য দ্বিতীয় কার্ট শুরুতে স্থির এবং সংঘর্ষের পর দুটি কার্ট একসঙ্গে চলে—এই অনুমান ধরা হয়েছে।'};}
 case'impulse':{var J=+p.f*+p.t,delta=J/+p.m;return{a:'অভিঘাত J = FΔt',av:fmtN(J,2)+' N·s',b:'ভরবেগ পরিবর্তনে বেগের বদল',bv:fmtN(delta,3)+' m/s',note:'ধ্রুব বল এবং স্থির ভর ধরে হিসাব করা হয়েছে।'};}
 case'verticalCircle':{var mc=+p.m,rad=+p.r,vb=+p.v,vtop2=vb*vb-4*gg*rad,tTop=mc*(vtop2/rad-gg),vmin=Math.sqrt(5*gg*rad);return{a:'নিচে কেন্দ্রাভিমুখী বলের মান',av:fmtN(mc*vb*vb/rad,2)+' N',b:'পূর্ণ লুপের আনুমানিক ন্যূনতম নিচের বেগ',bv:fmtN(vmin,2)+' m/s',note:tTop>=0?'এই বেগে আদর্শ মডেলে ওপরের দিকে দড়ির টান থাকতে পারে।':'এই বেগে ওপরের বিন্দুতে দড়ি টানটান থাকার শর্ত পূরণ নাও হতে পারে।'};}
 case'work':{var W=+p.f*+p.x*Math.cos(+p.ang*Math.PI/180);return{a:'কাজ W = Fs cosθ',av:fmtN(W,2)+' J',b:'বল–সরণ কোণ',bv:fmtN(+p.ang,0)+'°',note:Math.abs(+p.ang-90)<1e-6?'বল সরণের লম্ব হওয়ায় কাজ প্রায় শূন্য।':W<0?'বল সরণের বিপরীত দিকে উপাংশ রাখে, তাই কাজ ঋণাত্মক।':'কাজের চিহ্ন বলের সরণ-সমান্তরাল উপাংশের দিকের ওপর নির্ভর করে।'};}
 case'energy':{var E=+p.m*g*+p.h,loss=+p.loss,Ekin=E*(1-loss);return{a:'প্রাথমিক বিভব শক্তি',av:fmtN(E,2)+' J',b:'ক্ষয় বাদে পাওয়া গতিশক্তি (নিচে)',bv:fmtN(Ekin,2)+' J',note:'ক্ষয়ের ভগ্নাংশকে প্রাথমিক যান্ত্রিক শক্তির অংশ হিসেবে ধরা হয়েছে।'};}
 case'springEnergy':{var Fs=+p.k*+p.x,U=.5*+p.k*(+p.x)**2;return{a:'স্প্রিং বলের মান |F| = kx',av:fmtN(Fs,2)+' N',b:'স্থিতিস্থাপক শক্তি',bv:fmtN(U,3)+' J',note:'হুকের সূত্রের আদর্শ অঞ্চলে F = −kx; এখানে বলের মান দেখানো হয়েছে।'};}
 case'power':{var pout=+p.m*g*+p.v,pin=pout/(Math.max(1,+p.eta)/100);return{a:'উপযোগী আউটপুট ক্ষমতা',av:fmtN(pout,2)+' W',b:'প্রয়োজনীয় ইনপুট ক্ষমতা',bv:fmtN(pin,2)+' W',note:'ধ্রুব বেগে উল্লম্বভাবে ভার তোলার জন্য Pout = mgv ধরে নেওয়া হয়েছে।'};}
 case'gravitation':{var grav=6.674e-11*+p.m1*+p.m2/(+p.r)**2;return{a:'মহাকর্ষ বল',av:grav.toExponential(3)+' N',b:'দূরত্বের নির্ভরতা',bv:'F ∝ 1/r²',note:'দুটি বিন্দু ভর এবং শূন্যস্থান ধরে নিউটনের মহাকর্ষ সূত্র প্রয়োগ করা হয়েছে।'};}
 case'gravityProfile':{var R=+p.r,h=+p.h,gg0=+p.g,gh=h>=0?gg0*Math.pow(R/(R+h),2):gg0*Math.max(0,(R+h)/R);return{a:'নির্বাচিত স্থানে g',av:fmtN(gh,3)+' m/s²',b:'পৃষ্ঠের তুলনায়',bv:fmtN(gh/gg0*100,1)+'%',note:h>=0?'পৃষ্ঠের বাইরে g ∝ 1/(R+h)² ধরা হয়েছে।':'পৃথিবীর ভেতরে সমঘনত্বের সরল মডেল: g ∝ কেন্দ্র থেকে দূরত্ব।'};}
 case'potential':{var V=-(+p.M)/(+p.r),U=-(+p.M*+p.m)/(+p.r);return{a:'মহাকর্ষীয় বিভব (আপেক্ষিক)',av:fmtN(V,3),b:'বিভবশক্তি (আপেক্ষিক)',bv:fmtN(U,3),note:'সহজ বোঝার জন্য G = 1-সহ আপেক্ষিক একক ধরা হয়েছে; এটি SI-এর পরিমাপ নয়।'};}
 case'orbit':{var speed=Math.sqrt(+p.M/+p.r),period=2*Math.PI*Math.sqrt((+p.r)**3/+p.M),energy=- (+p.M)*(+p.m)/(2*(+p.r));return{a:'কক্ষীয় বেগ (আপেক্ষিক)',av:fmtN(speed,3),b:'মোট কক্ষীয় শক্তি E',bv:fmtN(energy,3),note:'একই সরল বৃত্তাকার কক্ষপথে পর্যায়কাল T = '+fmtN(period,3)+' (আপেক্ষিক একক); G = 1 ধরে করা হয়েছে। উপগ্রহের ভর m মোট শক্তিতে প্রভাব ফেলে, কিন্তু আদর্শ কক্ষীয় বেগে নয়।'};}
 case'escape':{var R0=+p.R+ +p.h,vc=Math.sqrt(+p.M/R0),ve=Math.sqrt(2*+p.M/R0);return{a:'বৃত্তাকার কক্ষীয় বেগ (আপেক্ষিক)',av:fmtN(vc,3),b:'মুক্তিবেগ (আপেক্ষিক)',bv:fmtN(ve,3)+' = √2 × vₒ',note:'একই ব্যাসার্ধে মুক্তিবেগ / কক্ষীয় বেগ = √2, আদর্শ নিউটনীয় মডেলে।'};}
 case'elastic':{var ext=+p.f/Math.max(1,+p.k),strain=ext/Math.max(.001,+p.l);return{a:'প্রসারণ ΔL = F/k',av:fmtN(ext,4)+' m',b:'বিকৃতি ΔL/L',bv:fmtN(strain,5),note:'সমতুল্য দৃঢ়তা k-কে সরল স্প্রিং-সদৃশ ধরা হয়েছে; পীড়ন নির্ণয়ে ক্ষেত্রফলও প্রয়োজন।'};}
 case'hydraulic':{var fout=+p.f*+p.a2/Math.max(.001,+p.a1);return{a:'বড় পিস্টনের আউটপুট বল',av:fmtN(fout,2)+' N',b:'যান্ত্রিক গুণক',bv:fmtN(+p.a2/+p.a1,2)+'×',note:'প্যাসকেলের নীতি অনুযায়ী দুই পিস্টনে চাপ সমান; ঘর্ষণ ও উচ্চতার পার্থক্য উপেক্ষা করা হয়েছে।'};}
 case'buoyancy':{var rho=+p.rho,obj=+p.obj,vol=+p.v,frac=Math.min(1,obj/Math.max(1,rho)),sub=vol*frac,Fb=rho*g*sub,W=obj*g*vol;return{a:'নিমজ্জিত আয়তনের ভগ্নাংশ',av:fmtN(frac*100,1)+'%',b:'প্লব বল / বস্তুর ওজন',bv:fmtN(Fb,2)+' / '+fmtN(W,2)+' N',note:obj<rho?'ঘনত্ব কম, তাই বস্তু ভাসে এবং সরল মডেলে আংশিক নিমজ্জিত থাকে.':obj>rho?'বস্তুর ঘনত্ব বেশি; সম্পূর্ণ নিমজ্জিত হলেও ওজন প্লব বলের চেয়ে বেশি, তাই ডোবে.':'দুই ঘনত্ব সমান হলে বস্তু নিরপেক্ষভাবে ভাসতে পারে.'};}
 case'bernoulli':{var q=.5*+p.rho*(+p.v)**2,Q=(+p.a)*1e-4*(+p.v);return{a:'গতিশীল চাপ ½ρv²',av:fmtN(q,2)+' Pa',b:'আয়তনিক প্রবাহ হার Q = Av',bv:fmtN(Q,4)+' m³/s',note:'ক্ষেত্রফল cm² থেকে m²-এ রূপান্তর করা হয়েছে। একই প্রবাহে A₁v₁ = A₂v₂; সমতল আদর্শ প্রবাহে বেগ বাড়লে স্থির চাপ কমে।'};}
 case'viscosity':{var rm=+p.r/1000,vt=2*rm*rm*+p.drho*g/(9*Math.max(.0001,+p.eta));return{a:'টার্মিনাল বেগ (Stokes মডেল)',av:fmtN(vt,5)+' m/s',b:'গোলকের ব্যাসার্ধ',bv:fmtN(+p.r,2)+' mm',note:'ছোট গোলক, কম Reynolds সংখ্যা ও Stokes drag ধরে হিসাব করা হয়েছে।'};}
 case'capillary':{var hh=2*+p.gamma*Math.cos(+p.ang*Math.PI/180)/(1000*g*(+p.r/1000));return{a:'কৈশিক উচ্চতা',av:fmtN(hh*100,2)+' cm',b:'সংস্পর্শ কোণ',bv:fmtN(+p.ang,0)+'°',note:'পানি-সদৃশ ঘনত্ব 1000 kg/m³ ধরে; θ > 90° হলে উচ্চতা ঋণাত্মক হতে পারে।'};}
 case'torricelli':{var vout=Math.sqrt(2*+p.g*+p.h),range=vout*Math.sqrt(2*+p.y/+p.g);return{a:'ছিদ্র দিয়ে নির্গমন বেগ',av:fmtN(vout,3)+' m/s',b:'জেটের আনুমানিক অনুভূমিক পাল্লা',bv:fmtN(range,3)+' m',note:'v = √(2gh) এবং মাটিতে পৌঁছানোর সময় √(2y/g) ধরা হয়েছে। বড় ট্যাংক, ছোট ছিদ্র, বায়ুর বাধা ও সান্দ্রতা উপেক্ষিত।'};}
 case'shm':{var disp=+p.A*Math.sin(+p.w*1+(+p.phi||0)),vmax=+p.A*+p.w;return{a:'t = 1 s-এ সরণ',av:fmtN(disp,3),b:'সর্বোচ্চ বেগ |v|max = Aω',bv:fmtN(vmax,3),note:'x = A sin(ωt + φ), এখানে t = 1 s-এ সরল মান দেখানো হয়েছে।'};}
 case'shmEnergy':{var Et=.5*+p.k*(+p.A)**2,xx=Math.max(-Math.abs(+p.A),Math.min(Math.abs(+p.A),+p.x)),U=.5*+p.k*xx*xx,K=Math.max(0,Et-U);return{a:'বিভব শক্তি U / গতিশক্তি K',av:fmtN(U,3)+' / '+fmtN(K,3)+' J',b:'মোট শক্তি E = U + K',bv:fmtN(Et,3)+' J',note:'সরণ x-কে ±A সীমার মধ্যে ধরে; বিস্তার প্রান্তে গতিশক্তি শূন্য এবং সাম্যাবস্থায় বিভব শক্তি শূন্য।'};}
 case'phase':{var delta=+p.d||0,resultant=Math.sqrt(Math.max(0,(+p.a)**2+(+p.b)**2+2*+p.a*+p.b*Math.cos(delta*Math.PI/180)));return{a:'লব্ধি বিস্তার',av:fmtN(resultant,3)+' m',b:'দশা পার্থক্য',bv:fmtN(delta,0)+'°',note:'দুটি একই কম্পাঙ্কের সরল হারমোনিক তরঙ্গের লব্ধি বিস্তার দেখানো হয়েছে।'};}
 case'superposition':{var y1=+p.a*Math.sin(1),y2=+p.b*Math.sin(1+(+p.d)*Math.PI/180);return{a:'t/অবস্থান = 1-এ তরঙ্গ ১',av:fmtN(y1,3),b:'লব্ধি সরণ',bv:fmtN(y1+y2,3),note:'দুটি তরঙ্গের সরণ বীজগাণিতিকভাবে যোগ করা হয়েছে; phase shift ডিগ্রিতে দেওয়া।'};}
 case'airColumn':{var closed=p.pipe==='closed',freq=(closed?(2*+p.n-1):+p.n)*+p.v/(4*Math.max(.01,+p.L));if(!closed)freq=+p.n*+p.v/(2*Math.max(.01,+p.L));return{a:'অনুরণন কম্পাঙ্ক',av:fmtN(freq,2)+' Hz',b:'নলের ধরন / হারমোনিক',bv:(closed?'এক প্রান্ত বন্ধ':'দুই প্রান্ত খোলা')+' · n = '+p.n,note:closed?'এক প্রান্ত বন্ধ নলে বিজোড় হারমোনিক: fₙ = (2n−1)v/(4L)।':'দুই প্রান্ত খোলা নলে fₙ = nv/(2L)।'};}
 case'beats':{var f1=+p.f1,f2=f1+Math.abs(+p.df);return{a:'বিট কম্পাঙ্ক |f₁ − f₂|',av:fmtN(Math.abs(+p.df),2)+' Hz',b:'দুই কম্পাঙ্ক f₁ / f₂',bv:fmtN(f1,1)+' / '+fmtN(f2,1)+' Hz',note:'এখানে f₂ = f₁ + Δf। বিটের হার কম্পাঙ্কের পার্থক্য দিয়ে নির্ধারিত হয়; সর্বোচ্চ লব্ধি বিস্তার প্রায় 2A।'};}
 case'doppler':{var fobs=+p.f*(343+(+p.vo))/(Math.max(1,343-(+p.vs)));return{a:'পর্যবেক্ষিত কম্পাঙ্ক (উৎস কাছে আসে)',av:fmtN(fobs,2)+' Hz',b:'উৎসের বেগ',bv:fmtN(+p.vs,2)+' m/s',note:'শব্দের বেগ 343 m/s; উৎস পর্যবেক্ষকের দিকে এগোচ্ছে এবং পর্যবেক্ষক স্থির/নির্দিষ্ট vo ধরে নেওয়া হয়েছে।'};}
 case'sound':{var I=(+p.P)/(4*Math.PI*(+p.r)**2),I0=Math.pow(10,+p.I0),db=10*Math.log10(Math.max(1e-30,I/I0));return{a:'শব্দের তীব্রতা',av:I.toExponential(3)+' W/m²',b:'শব্দের স্তর',bv:fmtN(db,2)+' dB',note:'বিন্দু উৎসের জন্য I = P/(4πr²); রেফারেন্স তীব্রতা I₀ = 10^('+p.I0+') W/m²।'};}
 case'maxwell':{var rms=Math.sqrt(3*8.314*+p.T/(Math.max(.001,+p.M)/1000));return{a:'RMS বেগ',av:fmtN(rms,1)+' m/s',b:'তাপমাত্রা / মোলার ভর',bv:fmtN(+p.T,0)+' K / '+fmtN(+p.M,0)+' g/mol',note:'বাম পাশের অণু-চিত্রে নমুনার সংখ্যা বদলায়; ডান পাশের বক্ররেখা আদর্শ Maxwell–Boltzmann বণ্টন। তাপমাত্রা বাড়লে বৈশিষ্ট্যগত বেগ বাড়ে, মোলার ভর বাড়লে কমে।'};}
 case'kineticPressure':{var press=+p.rho*(+p.c)**2/3;return{a:'গতিতত্ত্বের চাপ',av:fmtN(press,2)+' Pa',b:'RMS বেগ',bv:fmtN(+p.c,1)+' m/s',note:'P = ⅓ρcᵣₘₛ²; গ্যাসকে আদর্শ ও দিক-সমভাবে চলমান ধরা হয়েছে।'};}
 case'thermo':{var mode=p.mode||'isothermal',P0=+p.P,V0=+p.V,T0=+p.T,nEff=P0*V0/(8.314*T0),modeNames={isothermal:'সমতাপ',isobaric:'সমচাপ',isochoric:'সমআয়তন',adiabatic:'রুদ্ধতাপ'};return{a:'নির্বাচিত প্রক্রিয়া',av:modeNames[mode]||'সমতাপ',b:'প্রাথমিক অবস্থা থেকে আনুমানিক n',bv:fmtN(nEff,3)+' mol',note:'PV = nRT-তে kPa·L = J ধরে n-কে প্রাথমিক অবস্থার P, V ও T থেকে নির্ণয় করা হয়েছে; P–V গ্রাফে নির্বাচিত প্রক্রিয়ার পথ দেখানো হয়.'};}
 case'cycle':{var wcy=+p.p*+p.v*+p.n;return{a:'এক চক্রে নিট কাজ',av:fmtN(+p.p*+p.v,2)+' J',b:'চক্র সংখ্যা অনুযায়ী মোট কাজ',bv:fmtN(wcy,2)+' J',note:'1 kPa·L = 1 J; আয়তন ও চাপের পার্থক্যে আয়তাকার P–V চক্র ধরে হিসাব করা হয়েছে।'};}
 case'internalEnergy':{var U=.5*+p.f*+p.n*8.314*+p.T;return{a:'অভ্যন্তরীণ শক্তি U',av:fmtN(U,2)+' J',b:'স্বাধীনতার মাত্রা f',bv:String(p.f),note:'আদর্শ গ্যাসে U = (f/2)nRT, equipartition মডেল ধরা হয়েছে।'};}
 default:return{a:'বর্তমান পরামিতি',av:c.t,b:'প্রধান সম্পর্ক',bv:c.formula,note:'মান বদলালে চিত্র ও গাণিতিক ফল আপডেট হয়।'};
 }
}
function drawLabArrow(ctx,x1,y1,x2,y2,color,label,dash){
 ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;ctx.lineCap='round';ctx.setLineDash(dash||[]);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);var a=Math.atan2(y2-y1,x2-x1),h=10;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-h*Math.cos(a-.46),y2-h*Math.sin(a-.46));ctx.lineTo(x2-h*Math.cos(a+.46),y2-h*Math.sin(a+.46));ctx.closePath();ctx.fill();if(label){ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText(label,(x1+x2)/2,(y1+y2)/2-10);}ctx.restore();
}
function renderVectorLab(id,root,done,c){
 root.innerHTML='';var intro=document.createElement('p');intro.className='sim-intro';intro.textContent=id==='vector-components-lab'?'মান A ও কোণ θ বদলে একই ভেক্টরের অনুভূমিক Aₓ ও উল্লম্ব Aᵧ উপাংশ সরাসরি দেখুন। তীর, উপাংশ ও হিসাব একই মান ব্যবহার করে আপডেট হবে।':'দুটি বল A ও B এবং তাদের মধ্যবর্তী কোণ বদলে লব্ধি R নির্ণয় করুন। R শূন্য হলে দুই ভেক্টর সাম্যাবস্থায় থাকে।';root.appendChild(intro);
 var state={},items=[],controlBox=document.createElement('div');controlBox.className='ctl';
 c.controls.forEach(function(d){var row=document.createElement('div'),lab=document.createElement('label'),span=document.createElement('span'),out=document.createElement('output'),input=document.createElement('input');span.textContent=d[1];input.type='range';input.min=d[2];input.max=d[3];input.step=d[4];input.value=d[5];input.setAttribute('aria-label',d[1]);out.textContent=fmt(+d[5],3)+(d[6]||'');lab.appendChild(span);lab.appendChild(out);row.appendChild(lab);row.appendChild(input);controlBox.appendChild(row);state[d[0]]=+d[5];items.push({key:d[0],input:input,out:out,def:d});input.addEventListener('input',function(){state[d[0]]=+input.value;out.textContent=fmt(+input.value,3)+(d[6]||'');draw();if(done)done();});});
 var customMission=id==='vector-components-lab'?'A স্থির রেখে θ = 30°, 60° ও 90° তুলনা করুন। θ = 90° হলে Aₓ কত থাকে?': 'A ও B সমান করুন এবং θ = 180° দিন। লব্ধি কেন শূন্য হয় তা তীর ও হিসাব দিয়ে ব্যাখ্যা করুন।';
 var guide=buildPhysicsGuide(c,function(){setPhysicsValues(c,items,state,Object.fromEntries(c.controls.map(function(d){return[d[0],+d[5]];})),draw);guide._status.textContent='ডিফল্ট মানে ফিরে এসেছে।';},function(){setPhysicsValues(c,items,state,physicsMissionPreset(c),draw);guide._status.textContent='মিশনের মান বসানো হয়েছে—এখন উপাংশ/লব্ধি ও দিক পর্যবেক্ষণ করুন।';},customMission);root.appendChild(guide);root.appendChild(controlBox);
 var canvas=document.createElement('canvas');canvas.className='cv2 physics-model-canvas vector-lab-canvas';canvas.width=900;canvas.height=440;canvas.style.width='100%';canvas.style.height='auto';canvas.style.aspectRatio='900 / 440';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',c.t+'—সক্রিয় ভেক্টর ডায়াগ্রাম');root.appendChild(canvas);var x=canvas.getContext('2d');var stats=document.createElement('div');stats.className='physics-model-stats vector-lab-stats';root.appendChild(stats);var formula=document.createElement('p');formula.className='lens-note';formula.textContent='প্রধান সম্পর্ক: '+c.formula;root.appendChild(formula);var note=document.createElement('p');note.className='mutt vector-lab-note';root.appendChild(note);
 function quadrant(theta,ax,ay){if(Math.abs(ax)<1e-8&&Math.abs(ay)<1e-8)return'শূন্য ভেক্টর';if(Math.abs(ay)<1e-8)return ax>=0?'ধনাত্মক x-অক্ষ':'ঋণাত্মক x-অক্ষ';if(Math.abs(ax)<1e-8)return ay>=0?'ধনাত্মক y-অক্ষ':'ঋণাত্মক y-অক্ষ';return theta<90?'প্রথম চতুর্ভাগ':theta<180?'দ্বিতীয় চতুর্ভাগ':theta<270?'তৃতীয় চতুর্ভাগ':'চতুর্থ চতুর্ভাগ';}
 function draw(){var W=900,H=440,primary='#38bdf8',accent='#fbbf24',green='#34d399',purple='#c4b5fd',text='#e2edf8',muted='#9fb6cb';x.clearRect(0,0,W,H);x.fillStyle='#071827';x.fillRect(0,0,W,H);x.fillStyle=text;x.textAlign='left';x.font='bold 18px system-ui';x.fillText(id==='vector-components-lab'?'Vector Components Explorer':'Vector Equilibrium Challenge',24,30);x.font='12px system-ui';x.fillStyle=muted;x.fillText(id==='vector-components-lab'?'নীল: মূল ভেক্টর A · হলুদ: Aₓ · সবুজ: Aᵧ':'নীল: A · হলুদ: B · বেগুনি: লব্ধি R · সাদা ড্যাশ: সাম্যকারী বল',24,51);x.strokeStyle='rgba(125,190,230,.22)';x.beginPath();x.moveTo(520,62);x.lineTo(520,415);x.stroke();
  var ox=260,oy=245,maxSpan=id==='vector-components-lab'?Math.max(1,+state.a):Math.max(1,+state.a+ +state.b),scale=Math.min(1.45,190/maxSpan);for(var tick=-4;tick<=4;tick++){var gx=ox+tick*40,gy=oy+tick*40;x.strokeStyle=tick===0?'rgba(190,215,235,.58)':'rgba(125,190,230,.09)';x.lineWidth=tick===0?1.8:1;x.beginPath();x.moveTo(gx,70);x.lineTo(gx,410);x.stroke();x.beginPath();x.moveTo(45,gy);x.lineTo(485,gy);x.stroke();}x.fillStyle=muted;x.font='12px system-ui';x.fillText('x',480,oy-8);x.fillText('y',ox+9,73);x.fillStyle=accent;x.beginPath();x.arc(ox,oy,4,0,Math.PI*2);x.fill();
  if(id==='vector-components-lab'){
   var A=+state.a,theta=+state.ang*Math.PI/180,ax=A*Math.cos(theta),ay=A*Math.sin(theta),ex=ox+ax*scale,ey=oy-ay*scale,px=ox+ax*scale;drawLabArrow(x,ox,oy,ex,ey,primary,'A');if(Math.abs(ax)>.001)drawLabArrow(x,ox,oy,px,oy,accent,'Aₓ',[5,4]);if(Math.abs(ay)>.001)drawLabArrow(x,px,oy,ex,ey,green,'Aᵧ',[5,4]);x.fillStyle=text;x.font='12px system-ui';x.fillText('Aₓ = '+fmt(ax,2),38,383);x.fillText('Aᵧ = '+fmt(ay,2),38,402);x.fillStyle=primary;x.fillText('A',ex+8,ey-8);var Q=quadrant(+state.ang,ax,ay);stats.innerHTML=labStat('অনুভূমিক উপাংশ Aₓ',fmt(ax,3)+' একক')+labStat('উল্লম্ব উপাংশ Aᵧ',fmt(ay,3)+' একক')+labStat('লব্ধির মান |A|',fmt(Math.hypot(ax,ay),3)+' একক')+labStat('দিক / অবস্থান',fmt(+state.ang,0)+'° · '+Q);note.textContent='Aₓ = A cosθ, Aᵧ = A sinθ। θ ধনাত্মক x-অক্ষ থেকে ঘড়ির কাঁটার বিপরীত দিকে মাপা হয়েছে; তাই 180°–360°-এ উপাংশের চিহ্ন বদলায়।';
  }else{
   var A2=+state.a,B2=+state.b,th=+state.ang*Math.PI/180,ax2=A2,ay2=0,bx=B2*Math.cos(th),by=B2*Math.sin(th),rx=ax2+bx,ry=ay2+by,ex2=ox+ax2*scale,ey2=oy-ay2*scale,ebx=ox+bx*scale,eby=oy-by*scale,erx=ox+rx*scale,ery=oy-ry*scale,R=Math.hypot(rx,ry),phi=((Math.atan2(ry,rx)*180/Math.PI)+360)%360;drawLabArrow(x,ox,oy,ex2,ey2,primary,'A');drawLabArrow(x,ox,oy,ebx,eby,accent,'B');if(R>.001)drawLabArrow(x,ox,oy,erx,ery,purple,'R = A + B');if(R>.001)drawLabArrow(x,ox,oy,ox-rx*scale,oy+ry*scale,'rgba(226,237,248,.75)','−R',[5,4]);x.fillStyle=text;x.font='12px system-ui';x.fillText('Rₓ = '+fmt(rx,2),38,383);x.fillText('Rᵧ = '+fmt(ry,2),38,402);stats.innerHTML=labStat('প্রথম বল A',fmt(A2,2)+' N')+labStat('দ্বিতীয় বল B',fmt(B2,2)+' N')+labStat('লব্ধির মান |R|',fmt(R,3)+' N')+labStat('লব্ধির দিক',R<1e-8?'নির্ধারিত নয়':fmt(phi,2)+'°');note.textContent=R<1e-8?'A ও B সমান এবং বিপরীতমুখী—তাই লব্ধি শূন্য; শূন্য ভেক্টরের দিক নির্ধারিত নয়.':'Rₓ = A + B cosθ, Rᵧ = B sinθ; |R| = √(Rₓ² + Rᵧ²)। সাম্যকারী বলের মান |R|-এর সমান কিন্তু দিক বিপরীত।';
  }
 }
 draw();
}
function renderPhysicsLab(id,root,done){
 var c=configs[id];if(!c||!root)return;c.id=id;
 if(id==='vector-components-lab'||id==='vector-equilibrium-lab'){renderVectorLab(id,root,done,c);return;}
 if(id==='free-body-builder'||id==='pulley-system-lab'||id==='elevator-weight-lab'){renderMechanicsLab(id,root,done,c);return;}
 root.innerHTML='';var intro=document.createElement('p');intro.className='sim-intro';intro.textContent=c.desc;root.appendChild(intro);var controlBox=document.createElement('div');controlBox.className='ctl';var state={},items=[];
 c.controls.forEach(function(d){var row=document.createElement('div'),lab=document.createElement('label'),span=document.createElement('span'),out=document.createElement('output'),input=document.createElement('input');span.textContent=d[1];input.type='range';input.min=d[2];input.max=d[3];input.step=d[4];input.value=d[5];input.setAttribute('aria-label',d[1]);out.textContent=fmt(+d[5],3)+(d[6]||'');lab.appendChild(span);lab.appendChild(out);row.appendChild(lab);row.appendChild(input);controlBox.appendChild(row);state[d[0]]=+d[5];items.push({key:d[0],unit:d[6],out:out,input:input,def:d});input.addEventListener('input',function(){state[d[0]]=+input.value;out.textContent=fmt(+input.value,3)+(d[6]||'');draw();if(done)done();});});
 if(id==='thermodynamic-process-lab'){
  var row=document.createElement('div'),lab=document.createElement('label'),span=document.createElement('span'),select=document.createElement('select');span.textContent='তাপগতীয় প্রক্রিয়া';select.setAttribute('aria-label','তাপগতীয় প্রক্রিয়া');[['isothermal','সমতাপ (T ধ্রুব)'],['isobaric','সমচাপ (P ধ্রুব)'],['isochoric','সমআয়তন (V ধ্রুব)'],['adiabatic','রুদ্ধতাপ (Q = 0)']].forEach(function(o){var opt=document.createElement('option');opt.value=o[0];opt.textContent=o[1];select.appendChild(opt);});state.mode='isothermal';select.value=state.mode;lab.appendChild(span);lab.appendChild(select);row.appendChild(lab);controlBox.appendChild(row);items.push({key:'mode',input:select,out:null,def:{0:'mode'}});select.addEventListener('change',function(){state.mode=select.value;draw();if(done)done();});
 }
 if(id==='motion-graph-match'){
  var rowM=document.createElement('div'),labM=document.createElement('label'),spanM=document.createElement('span'),selectM=document.createElement('select');spanM.textContent='কোন গ্রাফ দেখবেন?';selectM.setAttribute('aria-label','কোন গ্রাফ দেখবেন?');[['position','অবস্থান–সময় (x–t)'],['velocity','বেগ–সময় (v–t)'],['acceleration','ত্বরণ–সময় (a–t)']].forEach(function(o){var op=document.createElement('option');op.value=o[0];op.textContent=o[1];selectM.appendChild(op);});state.mode='position';selectM.value=state.mode;labM.appendChild(spanM);labM.appendChild(selectM);rowM.appendChild(labM);controlBox.appendChild(rowM);items.push({key:'mode',input:selectM,out:null,def:{0:'mode'}});selectM.addEventListener('change',function(){state.mode=selectM.value;draw();if(done)done();});
 }
 if(id==='air-column-resonance-lab'){
  var row2=document.createElement('div'),lab2=document.createElement('label'),span2=document.createElement('span'),select2=document.createElement('select');span2.textContent='নলের দুই প্রান্ত';select2.setAttribute('aria-label','নলের দুই প্রান্ত');[['open','দুই প্রান্ত খোলা'],['closed','এক প্রান্ত বন্ধ']].forEach(function(o){var opt=document.createElement('option');opt.value=o[0];opt.textContent=o[1];select2.appendChild(opt);});state.pipe='open';select2.value=state.pipe;lab2.appendChild(span2);lab2.appendChild(select2);row2.appendChild(lab2);controlBox.appendChild(row2);items.push({key:'pipe',input:select2,out:null,def:{0:'pipe'}});select2.addEventListener('change',function(){state.pipe=select2.value;draw();if(done)done();});
 }
 root.appendChild(controlBox);
 var guide=buildPhysicsGuide(c,function(){var defaults={};c.controls.forEach(function(d){defaults[d[0]]=+d[5];});if(id==='thermodynamic-process-lab')defaults.mode='isothermal';if(id==='air-column-resonance-lab')defaults.pipe='open';if(id==='motion-graph-match')defaults.mode='position';setPhysicsValues(c,items,state,defaults,draw);guide._status.textContent='ডিফল্ট মানে ফিরে এসেছে।';},function(){var preset=physicsMissionPreset(c);setPhysicsValues(c,items,state,preset,draw);guide._status.textContent='মিশনের মান বসানো হয়েছে—এখন গ্রাফ ও ফলাফলের পরিবর্তন দেখুন।';},id==='motion-graph-match'?'প্রথমে x–t, তারপর v–t ও a–t গ্রাফ বেছে নিন। একই u ও a রেখে তিনটি রেখা কীভাবে বদলায় দেখুন।':null);root.insertBefore(guide,controlBox);
 var canvas=document.createElement('canvas');canvas.className='cv2 physics-model-canvas';canvas.width=900;canvas.height=340;canvas.style.width='100%';canvas.style.height='auto';canvas.style.aspectRatio='900 / 340';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',c.t+'—চিত্র ও পরিবর্তনশীল গ্রাফ');root.appendChild(canvas);var x=canvas.getContext('2d');var stats=document.createElement('div');stats.className='physics-model-stats';root.appendChild(stats);var formula=document.createElement('p');formula.className='lens-note';formula.textContent='প্রধান সম্পর্ক: '+c.formula;root.appendChild(formula);var note=document.createElement('p');note.className='mutt';root.appendChild(note);
 function draw(){var W=900,H=340,split=300,P={bg:'#081827',grid:'rgba(125,190,230,.13)',axis:'rgba(160,200,225,.65)',line:'#38bdf8',accent:'#fbbf24',green:'#34d399',text:'#d9e7f2'};x.clearRect(0,0,W,H);x.fillStyle=P.bg;x.fillRect(0,0,W,H);x.fillStyle=P.text;x.font='bold 15px system-ui';x.textAlign='left';x.fillText(c.t,20,26);x.strokeStyle='rgba(125,190,230,.2)';x.beginPath();x.moveTo(split,42);x.lineTo(split,H-18);x.stroke();drawSketch(x,c.kind,state,split,H,P,c);
  if(c.curve==='thermo')drawThermoGraph(x,state,P);
  else if(c.curve==='cycle')drawPVCycleGraph(x,state,P);
  else if(c.curve==='collision')drawCollisionGraph(x,state,P);
  else if(c.curve==='power')drawPowerGraph(x,state,P);
  else drawPhysicsCurve(x,c,state,P);
  var r=physicsResult(c,state);stats.innerHTML=labStat(r.a,r.av)+labStat(r.b,r.bv);note.textContent=r.note+' মডেলটি আদর্শীকৃত; বাস্তব পরীক্ষার সব প্রভাব এতে নেই.';
 }
 draw();
}
function drawPhysicsCurve(x,c,p,P){
 var xmin=0,xmax=10,curve=c.curve;
 if(curve==='mean'){xmin=1;xmax=Math.max(2,+p.n||8);}
 else if(curve==='motion'){xmin=0;xmax=Math.max(1,+p.t||10);}
 else if(curve==='freefall'){xmin=0;var flight=(+p.u+Math.sqrt(Math.max(0,(+p.u)**2+2*(+p.g)*(+p.h))))/Math.max(.001,+p.g);xmax=Math.max(.1,flight);}
 else if(curve==='impulse'){xmin=0;xmax=Math.max(.01,+p.t||1);}
 else if(curve==='verticalCircle'){xmin=0;xmax=Math.PI*2;}
 else if(curve==='work'){xmin=0;xmax=Math.max(.1,+p.x||1);}
 else if(curve==='energy'){xmin=0;xmax=1;}
 else if(curve==='springEnergy'){xmin=0;xmax=Math.max(.01,+p.x||.3);}
 else if(curve==='gravitation'||curve==='potential'||curve==='orbit'){xmin=1;xmax=20;}
 else if(curve==='gravityProfile'){xmin=0;xmax=10;}
 else if(curve==='escape'){xmin=0;xmax=20;}
 else if(curve==='elastic'){xmin=0;xmax=Math.max(.1,2*(+p.f||1)/Math.max(1,+p.k||1));}
 else if(curve==='buoyancy'||curve==='bernoulli'||curve==='kineticPressure'){xmin=0;xmax=1;}
 else if(curve==='torricelli'){xmin=0;xmax=Math.max(10,+p.h||1);}
 else if(curve==='shmEnergy'){xmin=-Math.max(.1,+p.A||1);xmax=Math.max(.1,+p.A||1);}
 else if(curve==='phase'){xmin=0;xmax=360;}
 else if(curve==='airColumn'){xmin=1;xmax=Math.max(9,+p.n||3);}
 else if(curve==='beats'){xmin=0;xmax=4/Math.max(1,Math.abs(+p.df||0));}
 else if(curve==='doppler'){xmin=0;xmax=100;}
 else if(curve==='sound'){xmin=.5;xmax=100;}
 else if(curve==='maxwell'){xmin=0;xmax=Math.max(600,3*Math.sqrt(8.314*(+p.T||300)/Math.max(.001,(+p.M||28)/1000)));}
 var values=[],samples=160;
 function graphValue(xv){if(c.id==='motion-graph-match'){var t=xv,u=+p.u,a=+p.a;return p.mode==='velocity'?u+a*t:p.mode==='acceleration'?a:u*t+.5*a*t*t;}return curveValue(curve,xv,p);}
 for(var i=0;i<=samples;i++){var xx=xmin+(xmax-xmin)*i/samples;values.push({x:xx,y:graphValue(xx)});}
 var finite=values.filter(function(v){return Number.isFinite(v.y);}),ymin=finite.reduce(function(a,v){return Math.min(a,v.y);},Infinity),ymax=finite.reduce(function(a,v){return Math.max(a,v.y);},-Infinity);
 if(!isFinite(ymin)||!isFinite(ymax)){ymin=-1;ymax=1;}if(ymin===ymax){var bump=Math.abs(ymin)*.1||1;ymin-=bump;ymax+=bump;}
 var pad=(ymax-ymin)*.12;ymin-=pad;ymax+=pad;
 var px0=365,px1=870,py0=62,py1=276;
 var X=function(v){return px0+(v-xmin)/(xmax-xmin)*(px1-px0);},Y=function(v){return py1-(v-ymin)/(ymax-ymin)*(py1-py0);};
 x.strokeStyle=P.grid;x.lineWidth=1;x.font='10px system-ui';
 for(i=0;i<=5;i++){var gy=py0+(py1-py0)*i/5,val=ymax-(ymax-ymin)*i/5;x.beginPath();x.moveTo(px0,gy);x.lineTo(px1,gy);x.stroke();x.fillStyle=P.text;x.textAlign='right';x.fillText(Number(val.toPrecision(3)).toString(),px0-8,gy+3);}
 for(i=0;i<=5;i++){var gx=xmin+(xmax-xmin)*i/5;x.beginPath();x.moveTo(X(gx),py0);x.lineTo(X(gx),py1);x.stroke();x.fillStyle=P.text;x.textAlign='center';var label=Number(gx.toPrecision(3)).toString();x.fillText(label,X(gx),py1+16);}
 x.strokeStyle=P.axis;x.lineWidth=1.3;x.beginPath();x.moveTo(px0,py1);x.lineTo(px1,py1);x.moveTo(px0,py0);x.lineTo(px0,py1);x.stroke();
 var xlabels={mean:'পরিমাপের নমুনা n →',dimension:'পরিবর্তনশীল রাশি →',conversion:'ইনপুট মান (স্কেল) →',motion:'সময় t (s) →',freefall:'সময় t (s) →',force:'সময় (s) →',pulley:'সময় (s) →',elevator:'সময় (s) →',impulse:'সময় t (s) →',verticalCircle:'কোণ θ (rad) →',work:'সরণ x (m) →',energy:'পথের অগ্রগতি (0–1) →',springEnergy:'প্রসারণ x (m) →',gravitation:'দূরত্ব r (m) →',gravityProfile:'কেন্দ্র থেকে উচ্চতা / গভীরতা →',potential:'দূরত্ব r (আপেক্ষিক) →',orbit:'কক্ষীয় ব্যাসার্ধ r →',escape:'উচ্চতা h →',elastic:'প্রসারণ ΔL (m) →',hydraulic:'প্রয়োগ বলের গুণক →',buoyancy:'নিমজ্জিত অংশের ভগ্নাংশ →',bernoulli:'নির্বাচিত বেগের ভগ্নাংশ →',viscosity:'ব্যাসার্ধের গুণক →',capillary:'কৈশিক ব্যাসার্ধের গুণক →',torricelli:'তরল-স্তম্ভের উচ্চতা h (m) →',shm:'সময় t (s) →',shmEnergy:'তাৎক্ষণিক সরণ x (m) →',phase:'দশা পার্থক্য δ (°) →',superposition:'অবস্থান / পর্যায় kx−ωt →',airColumn:'হারমোনিক সূচক n →',beats:'সময় t (s) →',doppler:'উৎসের বেগ vₛ (m/s) →',sound:'দূরত্ব r (m) →',maxwell:'আণবিক বেগ v (m/s) →',kineticPressure:'RMS বেগের ভগ্নাংশ →',internalEnergy:'সম্পর্কের স্কেল × →'};
 x.textAlign='left';x.font='12px system-ui';x.fillStyle=P.text;x.fillText(xlabels[curve]||(c.id==='motion-graph-match'?({position:'সময় t (s) →',velocity:'সময় t (s) →',acceleration:'সময় t (s) →'}[p.mode]||'সময় t (s) →'):'পরিবর্তনশীল x →'),px0,43);
 x.strokeStyle=P.line;x.lineWidth=2.5;x.beginPath();var started=false;values.forEach(function(v){if(!Number.isFinite(v.y)){started=false;return;}if(!started){x.moveTo(X(v.x),Y(v.y));started=true;}else x.lineTo(X(v.x),Y(v.y));});x.stroke();
 var marker=null;
 if(curve==='gravitation'||curve==='potential'||curve==='orbit')marker=+p.r;
 else if(curve==='gravityProfile')marker=+p.h===0?5:(+p.h>0?10:0);
 else if(curve==='escape')marker=+p.h;
 else if(curve==='torricelli')marker=+p.h;
 else if(curve==='phase')marker=+p.d;
 else if(curve==='airColumn')marker=+p.n;
 else if(curve==='doppler')marker=+p.vs;
 else if(curve==='sound')marker=+p.r;
 else if(curve==='shmEnergy')marker=+p.x;
 if(marker!==null&&marker>=xmin&&marker<=xmax){var my=graphValue(marker);if(Number.isFinite(my)){x.save();x.strokeStyle='rgba(251,191,36,.45)';x.setLineDash([4,4]);x.beginPath();x.moveTo(X(marker),py0);x.lineTo(X(marker),py1);x.stroke();x.setLineDash([]);x.fillStyle=P.accent;x.beginPath();x.arc(X(marker),Y(my),5,0,Math.PI*2);x.fill();x.restore();}}
 x.fillStyle=P.accent;x.font='11px system-ui';x.fillText('স্লাইডার বদলালে গ্রাফ ও ফলাফল একসঙ্গে আপডেট হয়',px0,309);
 var ylabels={mean:'গড়ের চারপাশে পাঠ',dimension:'মাত্রার অনুপাত',conversion:'রূপান্তরিত মান',motion:'অবস্থান x (m)',freefall:'উচ্চতা y (m)',force:'নিট বল (N)',pulley:'ত্বরণ (m/s²)',elevator:'আপাত ওজন (N)',impulse:'অভিঘাত J (N·s)',verticalCircle:'কেন্দ্রাভিমুখী বল (N)',work:'কাজ W (J)',energy:'যান্ত্রিক শক্তি (J)',springEnergy:'স্থিতিস্থাপক শক্তি U (J)',gravitation:'মহাকর্ষ বল F (N)',gravityProfile:'অভিকর্ষজ ত্বরণ g (m/s²)',potential:'বিভবশক্তি (আপেক্ষিক)',orbit:'কক্ষীয় বেগ (আপেক্ষিক)',escape:'মুক্তিবেগ (আপেক্ষিক)',elastic:'স্থিতিস্থাপক বল F (N)',hydraulic:'আউটপুট বল (N)',buoyancy:'প্লব বল (N)',bernoulli:'স্থির চাপ (Pa)',viscosity:'টার্মিনাল বেগ (m/s)',capillary:'কৈশিক উচ্চতা (cm)',torricelli:'নির্গমন বেগ (m/s)',shm:'সরণ x (m)',shmEnergy:'গতিশক্তি K (J)',phase:'লব্ধি বিস্তার',superposition:'লব্ধি সরণ y',airColumn:'কম্পাঙ্ক f (Hz)',beats:'লব্ধি বিস্তার',doppler:'পর্যবেক্ষিত কম্পাঙ্ক f′ (Hz)',sound:'শব্দের স্তর (dB)',maxwell:'আপেক্ষিক সম্ভাব্যতা',kineticPressure:'চাপ P (Pa)',internalEnergy:'অভ্যন্তরীণ শক্তি U (J)'};
 x.fillStyle=P.text;x.font='10px system-ui';x.textAlign='left';x.fillText(ylabels[curve]||'নির্বাচিত সম্পর্ক অনুযায়ী মান',px0,327);
}
function drawCollisionGraph(x,p,P){
 var x0=360,x1=870,m1=+p.m1,m2=+p.m2,v=+p.v,total=m1+m2,p0=m1*v,vAfter=p0/Math.max(.001,total),ke0=.5*m1*v*v,ke1=.5*total*vAfter*vAfter;
 x.fillStyle=P.text;x.font='bold 13px system-ui';x.textAlign='left';x.fillText('সংঘর্ষের আগে ও পরে তুলনা',x0,43);
 x.strokeStyle=P.grid;x.beginPath();x.moveTo(615,60);x.lineTo(615,296);x.stroke();
 function bars(left,right,title,a,b,unit,signed){x.fillStyle=P.text;x.font='bold 12px system-ui';x.fillText(title,left,70);var max=Math.max(Math.abs(a),Math.abs(b),.001);var base=left+15,barMax=right-left-110;if(signed){base=left+(right-left)/2;x.strokeStyle=P.axis;x.beginPath();x.moveTo(base,88);x.lineTo(base,270);x.stroke();barMax=(right-left)/2-35;}[['আগে',a,104,P.line],['পরে',b,166,P.green]].forEach(function(o){x.fillStyle=P.text;x.font='11px system-ui';x.textAlign='left';x.fillText(o[0],left,o[2]-8);var len=Math.abs(o[1])/max*barMax,yy=o[2];x.fillStyle=o[3];x.fillRect(signed?(o[1]<0?base-len:base):(base),yy,len,16);x.fillStyle=P.text;x.font='10px system-ui';x.fillText(fmt(o[1],2)+' '+unit,left,yy+29);});}
 bars(365,605,'মোট ভরবেগ',p0,p0,'kg·m/s',true);bars(630,865,'গতিশক্তি',ke0,ke1,'J',false);x.fillStyle=P.green;x.font='11px system-ui';x.fillText('সম্পূর্ণ অনাস্থিতিস্থাপক সংঘর্ষে ভরবেগ সংরক্ষিত; গতিশক্তি কমতে পারে।',365,309);
}
function drawPowerGraph(x,p,P){
 var out=+p.m*9.8*+p.v,input=out/Math.max(.01,+p.eta/100),max=Math.max(input,out,1),x0=390,x1=850;
 x.fillStyle=P.text;x.font='bold 13px system-ui';x.textAlign='left';x.fillText('ইনপুট বনাম উপযোগী আউটপুট ক্ষমতা',365,43);
 var rows=[['উপযোগী আউটপুট Pₒᵤₜ',out,110,P.green],['প্রয়োজনীয় ইনপুট Pᵢₙ',input,205,P.line]];
 rows.forEach(function(r){var val=r[1],yy=r[2],color=r[3],w=(x1-x0)*val/max;x.fillStyle=P.text;x.font='12px system-ui';x.fillText(r[0],x0,yy-12);x.fillStyle='rgba(125,190,230,.08)';x.fillRect(x0,yy,x1-x0,30);x.fillStyle=color;x.fillRect(x0,yy,w,30);x.fillStyle=P.text;x.font='11px system-ui';x.fillText(fmt(val,2)+' W',Math.min(x0+w+8,x1-65),yy+20);});
 x.fillStyle=P.green;x.font='12px system-ui';x.fillText('দক্ষতা η = '+fmt(+p.eta,0)+'%',x0,282);x.fillStyle=P.text;x.font='11px system-ui';x.fillText('η বাড়লে একই আউটপুটের জন্য কম ইনপুট ক্ষমতা লাগে।',x0,309);
}
function drawThermoGraph(x,p,P){var x0=365,x1=865,y0=67,y1=282,V0=+p.V,Pr=+p.P,mode=p.mode||'isothermal',gamma=5/3,vmin=Math.max(.1,V0*.5),vmax=V0*1.5,values=[];x.fillStyle=P.text;x.font='bold 13px system-ui';x.textAlign='left';x.fillText('P–V চিত্র · '+({isothermal:'সমতাপ',isobaric:'সমচাপ',isochoric:'সমআয়তন',adiabatic:'রুদ্ধতাপ'}[mode]||'সমতাপ'),350,43);function pressAt(V){if(mode==='isobaric')return Pr;if(mode==='isochoric')return Pr;if(mode==='adiabatic')return Pr*Math.pow(V0/V,gamma);return Pr*V0/V;}var minP=mode==='isobaric'?Pr*.8:Pr*Math.pow(V0/vmax,mode==='adiabatic'?gamma:1),maxP=mode==='isobaric'?Pr*1.2:Pr*Math.pow(V0/vmin,mode==='adiabatic'?gamma:1);if(mode==='isochoric'){minP=0;maxP=Pr*1.3;}var X=function(V){return x0+(V-vmin)/(vmax-vmin)*(x1-x0)},Y=function(Pv){return y1-(Pv-minP)/(maxP-minP)*(y1-y0)};x.strokeStyle=P.grid;for(var i=0;i<=4;i++){var gy=y0+(y1-y0)*i/4,gx=x0+(x1-x0)*i/4;x.beginPath();x.moveTo(x0,gy);x.lineTo(x1,gy);x.stroke();x.beginPath();x.moveTo(gx,y0);x.lineTo(gx,y1);x.stroke();}x.strokeStyle=P.axis;x.beginPath();x.moveTo(x0,y1);x.lineTo(x1,y1);x.moveTo(x0,y0);x.lineTo(x0,y1);x.stroke();x.fillStyle=P.text;x.font='10px system-ui';x.textAlign='center';x.fillText('আয়তন V (L) →',(x0+x1)/2,315);x.save();x.translate(x0-23,(y0+y1)/2);x.rotate(-Math.PI/2);x.fillText('চাপ P (kPa)',0,0);x.restore();x.strokeStyle=P.line;x.lineWidth=3;x.beginPath();if(mode==='isochoric'){x.moveTo(X(V0),Y(minP));x.lineTo(X(V0),Y(Pr));x.lineTo(X(V0),Y(maxP));}else{for(i=0;i<=100;i++){var V=vmin+(vmax-vmin)*i/100,Pv=pressAt(V);if(i===0)x.moveTo(X(V),Y(Pv));else x.lineTo(X(V),Y(Pv));}}x.stroke();x.fillStyle=P.accent;x.beginPath();x.arc(X(V0),Y(Pr),5,0,Math.PI*2);x.fill();x.fillStyle=P.text;x.textAlign='left';x.font='11px system-ui';x.fillText('প্রাথমিক অবস্থা ('+fmt(V0,1)+' L, '+fmt(Pr,0)+' kPa)',x0+8,y0+15);x.fillStyle=P.green;x.fillText(mode==='isochoric'?'V ধ্রুব: উল্লম্ব রেখা':mode==='isobaric'?'P ধ্রুব: অনুভূমিক রেখা':mode==='adiabatic'?'PVᵞ = ধ্রুব':'PV = ধ্রুব',x0+8,y1+18);}
function drawPVCycleGraph(x,p,P){var x0=365,x1=855,y0=70,y1=280,dp=+p.p,dv=+p.v;function X(v){return x0+v/10*(x1-x0)}function Y(v){return y1-v/350*(y1-y0)}x.fillStyle=P.text;x.textAlign='left';x.font='bold 13px system-ui';x.fillText('আয়তাকার P–V চক্র',350,43);x.strokeStyle=P.grid;for(var i=0;i<=5;i++){var gx=x0+(x1-x0)*i/5,gy=y0+(y1-y0)*i/5;x.beginPath();x.moveTo(gx,y0);x.lineTo(gx,y1);x.stroke();x.beginPath();x.moveTo(x0,gy);x.lineTo(x1,gy);x.stroke();}x.strokeStyle=P.axis;x.beginPath();x.moveTo(x0,y1);x.lineTo(x1,y1);x.moveTo(x0,y0);x.lineTo(x0,y1);x.stroke();var xl=X(2),xr=X(Math.min(9,2+dv)),yt=Y(Math.min(330,80+dp)),yb=Y(80);x.fillStyle='rgba(56,189,248,.14)';x.fillRect(xl,yt,xr-xl,yb-yt);x.strokeStyle=P.line;x.lineWidth=3;x.strokeRect(xl,yt,xr-xl,yb-yt);x.fillStyle=P.accent;[[xl,yb],[xr,yb],[xr,yt],[xl,yt]].forEach(function(q){x.beginPath();x.arc(q[0],q[1],4,0,Math.PI*2);x.fill();});drawLabArrow(x,xl,yb,xr,yb,P.line,'১ → ২');drawLabArrow(x,xr,yb,xr,yt,P.line,'২ → ৩');drawLabArrow(x,xr,yt,xl,yt,P.green,'৩ → ৪');drawLabArrow(x,xl,yt,xl,yb,P.green,'৪ → ১');x.fillStyle=P.text;x.font='11px system-ui';x.textAlign='center';x.fillText('আয়তন পরিবর্তন ΔV = '+fmt(dv,1)+' L · চক্রের সংখ্যা n = '+fmt(+p.n,0),(x0+x1)/2,315);x.textAlign='left';x.fillText('চাপ পার্থক্য ΔP = '+fmt(dp,0)+' kPa',x0+8,y0+14);x.fillStyle=P.green;x.fillText('ক্ষেত্রফল ≈ ΔP × ΔV = '+fmt(dp*dv,2)+' J/চক্র',x0+8,y1+18);}

function drawSketch(x,kind,p,split,H,P,c){
 var cx=150,cy=178,curve=c&&c.curve||'',v=function(k,d){return p[k]===undefined?d:+p[k];},clamp=function(n,a,b){return Math.max(a,Math.min(b,n));};
 x.save();x.fillStyle='rgba(56,189,248,.075)';x.beginPath();if(x.roundRect)x.roundRect(18,48,260,265,16);else x.rect(18,48,260,265);x.fill();x.strokeStyle='rgba(125,190,230,.22)';x.stroke();x.fillStyle=P.text;x.font='bold 13px system-ui';x.textAlign='center';x.fillText('ইন্টারঅ্যাকটিভ মডেল',148,70);x.textAlign='left';x.lineWidth=3;x.lineCap='round';
 function line(x1,y1,x2,y2,color,w){x.strokeStyle=color;x.lineWidth=w||2;x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke();}
 function box(x0,y0,w,h,fill,stroke){x.fillStyle=fill;x.fillRect(x0,y0,w,h);if(stroke){x.strokeStyle=stroke;x.strokeRect(x0,y0,w,h);}}
 function arrow(x1,y1,x2,y2,color,label){arrowCanvas(x,x1,y1,x2,y2,color);if(label){x.fillStyle=color;x.font='bold 10px system-ui';x.textAlign='center';x.fillText(label,(x1+x2)/2,(y1+y2)/2-8);}}
 function small(text,y,color){x.fillStyle=color||P.text;x.font='11px system-ui';x.textAlign='center';x.fillText(text,148,y);x.textAlign='left';}
 if(curve==='mean'||curve==='dimension'||curve==='conversion'||kind==='measure'){
  line(42,145,255,145,P.axis,2);var n=clamp(Math.round(v('n',8)),2,20);for(var i=0;i<=10;i++){var tx=48+i*19;line(tx,135,tx, i%5===0?161:151,P.axis,1);if(i%5===0){x.fillStyle=P.text;x.font='9px system-ui';x.fillText(String(i*10),tx-3,173);}}
  if(curve==='mean'){var pos=clamp(48+(v('true',25)-10)/40*190,48,238);x.fillStyle=P.accent;x.beginPath();x.arc(pos,145,7,0,Math.PI*2);x.fill();for(i=0;i<Math.min(n,12);i++){var jitter=Math.sin((i+1)*12.9898)*v('noise',2)*5; x.fillStyle='rgba(56,189,248,.8)';x.beginPath();x.arc(clamp(pos+jitter,45,250),192+(i%3)*7,2.8,0,Math.PI*2);x.fill();}small('n = '+n+' · বিচ্যুতি ±'+fmt(v('noise',2),1),250);}
  else if(curve==='dimension'){small('M^'+v('m',1)+' · L^'+v('l',2)+' · T^'+v('t',-2),220);small('মাত্রার ঘাত বদলান',250,P.accent);}
  else{var val=v('v',25)*Math.pow(v('factor',.01),v('pow',2));x.fillStyle=P.accent;x.beginPath();x.arc(clamp(48+(Math.log(Math.max(.0001,Math.abs(val))+1)-Math.log(1.0001))/Math.log(1001)*190,48,238),145,7,0,Math.PI*2);x.fill();small('রূপান্তরিত মান = '+fmt(val,3),215);small('ঘাত = '+v('pow',2),245);}
 }
 else if(kind==='motion'){
  if(curve==='freefall'){
   line(65,95,65,244,P.axis,3);line(42,244,255,244,P.axis,2);var h=Math.max(1,v('h',60)),u=v('u',10),g0=Math.max(.1,v('g',9.8)),thit=(u+Math.sqrt(Math.max(0,u*u+2*g0*h)))/g0,ts=.45*thit,yNow=clamp(h+u*ts-.5*g0*ts*ts,0,h),ballY=244-yNow/h*125;line(65,118,65,235,'rgba(125,190,230,.25)',1);x.fillStyle=P.accent;x.beginPath();x.arc(65,ballY,8,0,Math.PI*2);x.fill();arrow(90,ballY-12,90,ballY+24,P.green,'g');small('h = '+fmt(h,1)+' m · tভূমি ≈ '+fmt(thit,2)+' s',277);
  }else{
   line(38,235,260,235,P.axis,2);for(var t=0;t<=5;t++){var xx=45+t*40;line(xx,230,xx,241,P.axis,1);x.fillStyle=P.text;x.font='9px system-ui';x.fillText(String(t),xx-2,255);}var time=v('t',10),u=v('u',4),acc=v('a',1),dist=u*time+.5*acc*time*time,pos=clamp(120+dist*1.1,48,238);box(pos-10,194,20,25,P.line,'rgba(226,237,248,.5)');arrow(pos+2,188,clamp(pos+clamp(u+acc*time,-38,48),pos+4,260),188,P.accent,'v');small('শেষ অবস্থান x = '+fmt(dist,1)+' m · v = '+fmt(u+acc*time,1)+' m/s',280);
  }
 }
 else if(kind==='force'||kind==='collision'){
  var mass=Math.max(.1,v('m',20)),force=v('f',80),friction=v('mu',.3)*mass*9.8;
  if(curve==='pulley'){
   x.strokeStyle=P.axis;x.lineWidth=3;x.beginPath();x.arc(148,105,22,Math.PI,Math.PI*2);x.stroke();line(126,105,126,166,P.line,2);line(170,105,170,174,P.line,2);line(126,166,126,179,P.line,2);line(170,174,170,187,P.line,2);box(107,178,38,29,'rgba(56,189,248,.22)',P.line);box(151,186,38,29,'rgba(251,191,36,.2)',P.accent);small('m₁ = '+fmt(v('m1',10),1)+' kg',244);small('m₂ = '+fmt(v('m2',15),1)+' kg · a = '+fmt((v('m2',15)-v('m1',10))*v('g',9.8)/(v('m1',10)+v('m2',15)),2)+' m/s²',271);
  }else if(curve==='elevator'){
   box(76,90,145,153,'rgba(125,190,230,.025)',P.axis);box(119,149,58,58,'rgba(56,189,248,.22)',P.line);arrow(148,149,148,112,P.green,'N');arrow(148,207,148,238,'#f87171','mg');arrow(188,178,188,178+clamp(v('a',2)*3,-32,32),P.accent,'a');small('a = '+fmt(v('a',2),1)+' m/s² · উপরে +',274);
  }else if(curve==='collision'){
   line(38,231,260,231,P.axis,2);var v1=v('v',12),dir=v1<0?-1:1;box(69,183,47,35,'rgba(56,189,248,.23)',P.line);box(181,183,47,35,'rgba(251,191,36,.23)',P.accent);arrow(92,174,92+dir*clamp(Math.abs(v1)*3,8,60),174,P.line,'u₁');arrow(205,174,205+dir*clamp(Math.abs(v1)*2,8,45),174,P.accent,'u₂=0');small('m₁ = '+fmt(v('m1',10),0)+' · m₂ = '+fmt(v('m2',15),0),267);
  }else if(curve==='impulse'){
   box(104,157,80,55,'rgba(56,189,248,.2)',P.line);var fl=clamp(v('f',80)/8,6,90);arrow(184,183,184+fl,183,P.green,'F');line(45,248,255,248,P.axis,2);for(var q=0;q<=5;q++)line(48+q*40,242,48+q*40,254,P.axis,1);small('Δt = '+fmt(v('t',.3),2)+' s · J = FΔt',279);
  }else{
   var forceLen=clamp(Math.abs(force)/5,15,85),frLen=clamp(Math.abs(friction)/5,4,72);box(105,150,82,58,'rgba(56,189,248,.2)',P.line);arrow(145,150,145,104,P.accent,'N');arrow(105,180,105-forceLen,180,'#f87171','f');arrow(187,180,187+forceLen,180,P.green,'F');arrow(187,204,187+frLen,204,P.accent,'fᵣ');small('ঘর্ষণ ≈ '+fmt(Math.min(force,friction),1)+' N',267);small('ΣF = ma',287);
  }
 }
 else if(kind==='circle'||kind==='gravity'){
  var r=clamp(v('r',v('R',5)),.5,20),radius=clamp(32+r*3,36,80),theta=((v('t',v('ang',v('h',20)))*10)%360)*Math.PI/180;line(cx-radius-6,cy,cx+radius+6,cy,P.grid,1);x.strokeStyle=P.line;x.beginPath();x.arc(cx,cy,radius,0,Math.PI*2);x.stroke();x.fillStyle=P.green;x.beginPath();x.arc(cx,cy,curve==='gravitation'?14:18,0,Math.PI*2);x.fill();var px=cx+radius*Math.cos(theta),py=cy+radius*Math.sin(theta);x.fillStyle=P.accent;x.beginPath();x.arc(px,py,7,0,Math.PI*2);x.fill();arrow(px,py,cx+(radius-20)*Math.cos(theta),cy+(radius-20)*Math.sin(theta),P.purple,'F');small('r = '+fmt(r,2)+' · '+(curve==='verticalCircle'?'বৃত্তীয় গতি':'মহাকর্ষ / কক্ষপথ'),278);
 }
 else if(kind==='energy'){
  if(curve==='springEnergy'){
   var ext=clamp(v('x',.3),.01,1),len=clamp(70+ext*105,72,175);line(42,155,60,155,P.axis,4);x.strokeStyle=P.line;x.beginPath();x.moveTo(60,155);for(var j=0;j<=12;j++)x.lineTo(60+(len-20)*j/12,155+(j%2?13:-13));x.stroke();box(60+len-18,135,38,40,'rgba(56,189,248,.2)',P.line);arrow(60+len+22,155,Math.min(264,60+len+52),155,P.accent,'F');small('x = '+fmt(ext,2)+' m · k = '+fmt(v('k',100),0)+' N/m',236);small('U = ½kx² = '+fmt(.5*v('k',100)*ext*ext,2)+' J',263);
  }else if(curve==='work'){
   line(40,228,260,228,P.axis,2);box(76,184,44,42,'rgba(56,189,248,.2)',P.line);arrow(120,205,120+clamp(v('f',50)/3,8,95)*Math.cos(v('ang',30)*Math.PI/180),205,P.green,'F');arrow(76,246,76+clamp(v('x',8)*12,8,150),246,P.accent,'s');small('W = Fs cosθ',280);
  }else if(curve==='power'){
   line(48,240,250,240,P.axis,2);box(110,168,46,66,'rgba(56,189,248,.2)',P.line);arrow(132,168,132,108,P.green,'v');small('Pout = mgv = '+fmt(v('m',80)*9.8*v('v',1.2),1)+' W',270);
  }else{
   line(38,260,260,260,P.axis,2);var h=clamp(v('h',30),1,100),yy=clamp(250-h*1.4,105,235);box(115,yy,34,24,P.line,'rgba(226,237,248,.6)');line(132,yy+24,132,260,P.axis,1);arrow(170,yy,170,yy+clamp(h,12,65),P.accent,'mgh');small('mgh → ½mv²',287);
  }
 }
 else if(kind==='elastic'){
  var ext=clamp(v('f',80)/Math.max(1,v('k',200)),.01,3),len=clamp(70+ext*65,70,200);line(42,150,60,150,P.axis,4);x.strokeStyle=P.line;x.beginPath();x.moveTo(60,150);var turns=10;for(var j=0;j<=turns;j++){x.lineTo(60+(len-22)*j/turns,150+(j%2?15:-15));}x.stroke();box(60+len-20,129,38,42,'rgba(56,189,248,.22)',P.line);arrow(60+len+20,151,Math.min(265,60+len+55),151,P.accent,'F');small('ΔL ≈ '+fmt(ext,3)+' m',230);small('F = kΔL',258);}
 else if(kind==='fluid'){
  if(curve==='buoyancy'){
   box(52,115,192,112,'rgba(56,189,248,.12)',P.line);box(54,155,188,70,'rgba(56,189,248,.24)',null);var ratio=clamp(v('obj',700)/Math.max(1,v('rho',1000)),.1,1.8),sub=clamp(1/ratio,0,1),height=clamp(42*sub,5,60);box(120,155-height,55,height,'rgba(251,191,36,.65)',P.accent);arrow(148,151-height,148,130-height,P.green,'Fᵦ');small('ρ বস্তু / ρ তরল = '+fmt(ratio,2),266);
  }else if(curve==='hydraulic'){
   var a1=clamp(v('a1',10),1,50),a2=clamp(v('a2',100),10,500),w1=clamp(20+a1,24,62),w2=clamp(45+a2*.18,47,125);box(62,180-w1/2, w1,90,'rgba(56,189,248,.16)',P.line);box(170,170-w2/2,w2,80,'rgba(56,189,248,.16)',P.line);line(62+w1,220,170,220,P.line,3);arrow(62+w1/2,120,62+w1/2,145,P.accent,'F₁');arrow(170+w2/2,112,170+w2/2,145,P.green,'F₂');small('A₁ : A₂ = '+fmt(a1,0)+' : '+fmt(a2,0),276);
  }else if(curve==='torricelli'){
   box(68,93,130,145,'rgba(56,189,248,.10)',P.line);var waterH=clamp(v('h',2)/10*110,5,125),waterY=230-waterH;box(70,waterY,126,230-waterY,'rgba(56,189,248,.27)',null);line(70,waterY,196,waterY,P.line,2);var holeY=clamp(230-v('y',3)*10,104,226);box(191,holeY,9,8,P.accent,null);arrow(200,holeY+4,clamp(200+v('h',2)*15,220,270),holeY+4,P.green,'v');small('h = '+fmt(v('h',2),1)+' m · y = '+fmt(v('y',3),1)+' m',274);
  }else if(curve==='bernoulli'){
   var area=clamp(v('a',50),1,100),speed=clamp(v('v',3),.1,15),tube=clamp(35+area*.45,28,80),yy=clamp(190-tube/2,110,205);line(42,yy,255,yy,P.line,3);line(42,yy+tube,255,yy+tube,P.line,3);for(j=0;j<3;j++)arrow(70+j*50,yy+tube/2,Math.min(258,85+j*50+speed*2),yy+tube/2,P.green,'');small('A = '+fmt(area,0)+' cm² · v = '+fmt(speed,1)+' m/s',263);
  }else{
   box(55,110,185,120,'rgba(56,189,248,.18)',P.line);var flow=clamp(v('v',3)/15,0,1);for(j=0;j<3;j++)arrow(70+j*50,150+j*20,90+j*50+flow*25,150+j*20,P.green,'');small(curve==='viscosity'?'vₜ ∝ r² Δρ/η':curve==='capillary'?'h ∝ γ cosθ/r':'P + ½ρv² = ধ্রুবক',265);
  }
 }
 else if(kind==='oscillation'||kind==='wave'){
  if(curve==='shmEnergy'){
   var k0=v('k',100),A0=v('A',1),x0=clamp(v('x',.5),-Math.abs(A0),Math.abs(A0)),Et=.5*k0*A0*A0,U0=.5*k0*x0*x0,K0=Math.max(0,Et-U0),barW=165;
   small('SHM শক্তির বণ্টন',98,P.text);[['মোট E',Et,112,P.accent],['বিভব U',U0,168,P.line],['গতিশক্তি K',K0,224,P.green]].forEach(function(q){x.textAlign='left';x.fillStyle=P.text;x.font='10px system-ui';x.fillText(q[0],42,q[2]-6);box(42,q[2],barW,15,'rgba(125,190,230,.09)',null);box(42,q[2],barW*(Et>0?q[1]/Et:0),15,q[0]==='মোট E'?P.accent:q[0]==='বিভব U'?P.line:P.green,null);});small('x = '+fmt(x0,2)+' m · E = U + K',276);
  }else if(curve==='airColumn'){
   box(76,110,145,98,'rgba(56,189,248,.08)',P.line);var closed=p.pipe==='closed';line(76,110,76,208,closed?P.accent:P.line,4);if(!closed)line(221,110,221,208,P.line,4);x.strokeStyle=P.green;x.lineWidth=2.5;x.beginPath();for(var kx=0;kx<=135;kx+=2){var yy=159-24*Math.sin(kx/135*Math.PI*(closed?2*v('n',3)-1:v('n',3)));if(kx===0)x.moveTo(81+kx,yy);else x.lineTo(81+kx,yy);}x.stroke();small((closed?'এক প্রান্ত বন্ধ':'দুই প্রান্ত খোলা')+' · n = '+fmt(v('n',3),0),252);small('L = '+fmt(v('L',.5),2)+' m',277);
  }else if(curve==='beats'){
   x.strokeStyle=P.axis;x.beginPath();x.moveTo(37,172);x.lineTo(260,172);x.stroke();x.strokeStyle=P.line;x.lineWidth=2.4;x.beginPath();for(var bx=0;bx<=220;bx++){var bt=bx/220*(4/Math.max(1,v('df',4))),env=2*v('a',2)*Math.cos(Math.PI*v('df',4)*bt),wave=Math.sin(2*Math.PI*v('f1',256)*bt/Math.max(1,v('f1',256)));var by=172-22*env/Math.max(1,2*v('a',2))*wave;if(bx===0)x.moveTo(40+bx,by);else x.lineTo(40+bx,by);}x.stroke();x.strokeStyle=P.green;x.setLineDash([4,4]);x.beginPath();for(bx=0;bx<=220;bx++){bt=bx/220*(4/Math.max(1,v('df',4)));by=172-27*Math.cos(Math.PI*v('df',4)*bt);if(bx===0)x.moveTo(40+bx,by);else x.lineTo(40+bx,by);}x.stroke();x.setLineDash([]);small('f₁ = '+fmt(v('f1',256),0)+' Hz · Δf = '+fmt(v('df',4),1)+' Hz',270);
  }else{
   var amp=clamp(v('A',v('a',2)),.1,5)*17,w=clamp(v('w',v('f1',v('f',2))),.1,10),phase=v('d',v('phi',0));x.strokeStyle=P.axis;x.beginPath();x.moveTo(37,172);x.lineTo(260,172);x.stroke();x.strokeStyle=P.line;x.lineWidth=2.5;x.beginPath();for(var wx=0;wx<=220;wx+=2){var wy=172-amp*Math.sin(wx/220*Math.PI*4*(w/2)+phase*Math.PI/180);if(wx===0)x.moveTo(40+wx,wy);else x.lineTo(40+wx,wy);}x.stroke();if(curve==='superposition'||curve==='phase'){x.strokeStyle=P.green;x.setLineDash([4,4]);x.beginPath();for(wx=0;wx<=220;wx+=2){wy=172-clamp(v('b',1.5),.1,5)*17*Math.sin(wx/220*Math.PI*4*(w/2)+phase*Math.PI/180);if(wx===0)x.moveTo(40+wx,wy);else x.lineTo(40+wx,wy);}x.stroke();x.setLineDash([]);}small(curve==='phase'?'δ = '+fmt(v('d',60),0)+'° · দুই SHM':curve==='superposition'?'দশা δ = '+fmt(v('d',45),0)+'°':curve==='shm'?'A = '+fmt(v('A',2),1)+' m · ω = '+fmt(v('w',2),1):'দশা / কম্পাঙ্ক বদলে তরঙ্গ তুলনা করুন',264);
  }
 }
 else if(kind==='gas'){
  if(curve==='thermo'){
   box(67,105,170,122,'rgba(56,189,248,.04)',P.axis);var vol=clamp(v('V',5)/20,.05,1),pistonY=114+(1-vol)*76;box(72,116,160,clamp(pistonY-116,2,78),'rgba(56,189,248,.24)',null);line(72,pistonY,232,pistonY,P.accent,4);line(151,pistonY,151,pistonY-18,P.accent,3);small('P = '+fmt(v('P',200),0)+' kPa · V = '+fmt(v('V',5),1)+' L',257);small('T = '+fmt(v('T',300),0)+' K · পিস্টন',280);
  }else if(curve==='cycle'){
   var pd=clamp(v('p',100)/300,0,1),vd=clamp(v('v',4)/10,0,1);line(60,235,245,235,P.axis,2);line(60,235,60,104,P.axis,2);var rw=50+120*vd,rh=20+80*pd;box(80,235-rh,rw,rh,'rgba(56,189,248,.13)',P.line);x.strokeStyle=P.line;x.lineWidth=2.5;x.strokeRect(80,235-rh,rw,rh);drawLabArrow(x,80,235,80+rw,235,P.line,'১→২');small('ΔP = '+fmt(v('p',100),0)+' kPa',267);small('ΔV = '+fmt(v('v',4),1)+' L · n = '+fmt(v('n',1),0),288);
  }else{
   box(48,98,202,142,'rgba(56,189,248,.05)',P.axis);var molar=Math.max(.001,v('M',28)/1000),temp=curve==='kineticPressure'?clamp(v('c',450)/1000,.05,1):clamp(Math.sqrt(v('T',300)/Math.max(1,v('M',28)))/8,.05,1),count=curve==='maxwell'?clamp(Math.round(v('n',3000)/220),6,45):24,seed=1;for(var m=0;m<count;m++){var rx=48+((m*73+Math.floor(m/3)*29+seed*7)%194),ry=100+((m*47+Math.floor(m/5)*31+seed*11)%136),rad=2.2+temp*2;x.fillStyle=m%3===0?P.accent:P.line;x.beginPath();x.arc(rx,ry,rad,0,Math.PI*2);x.fill();var dx=(Math.sin(m*8.1)*8+4)*temp,dy=(Math.cos(m*5.7)*8+3)*temp;arrow(rx,ry,clamp(rx+dx,51,246),clamp(ry+dy,102,237),P.green,'');}small(curve==='maxwell'?'নমুনা n = '+fmt(v('n',3000),0)+' · T = '+fmt(v('T',300),0)+' K':'P = ⅓ρc² · c = '+fmt(v('c',450),0)+' m/s',270);
  }
 }
 else{small('স্লাইডার বদলে ভৌত মডেলের পরিবর্তন দেখুন',250);}
 x.restore();
}
function arrowCanvas(x,x1,y1,x2,y2,color){var a=Math.atan2(y2-y1,x2-x1);x.strokeStyle=color;x.fillStyle=color;x.lineWidth=3;x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke();x.beginPath();x.moveTo(x2,y2);x.lineTo(x2-10*Math.cos(a-.5),y2-10*Math.sin(a-.5));x.lineTo(x2-10*Math.cos(a+.5),y2-10*Math.sin(a+.5));x.closePath();x.fill();}
meta.forEach(function(m){S[m.sim]=function(root,done){renderPhysicsLab(m.sim,root,done);};});
})();
