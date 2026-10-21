/* ConceptLab mini-games. CL_GAMES[type](rootEl, gameConfig, api)
   api: X(textKey), E(escape), every(el,ms,fn), questions(), done({score,pct,detail}), confetti(), toast(html) */
window.CL_GAMES=(function(){
var G={},TAU=Math.PI*2,SUBD='₀₁₂₃₄₅₆₇₈₉';
function sh(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function qa(r,s){return r.querySelector(s)}
function qq(r,s){return Array.prototype.slice.call(r.querySelectorAll(s))}
function ri(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function col(n,f){return(getComputedStyle(document.documentElement).getPropertyValue(n)||'').trim()||f}
function empty(r,msg){r.innerHTML='<div class="card"><p class="bn" style="margin:0">'+msg+'</p></div>'}
function hud(items){return'<div class="hud">'+items.map(function(i){return'<div><small>'+i[0]+'</small><b id="'+i[1]+'">'+(i[2]==null?'':i[2])+'</b></div>'}).join('')+'</div>'}
function hearts(n,max){var s='';for(var i=0;i<(max||3);i++)s+=i<n?'<span class="hrt">♥</span>':'<span class="hrt off">♥</span>';return s}
function keyhandler(r,fn){function h(e){if(!r.isConnected){document.removeEventListener('keydown',h);return}fn(e)}document.addEventListener('keydown',h)}
function flameSvg(c){return'<svg viewBox="0 0 200 240" class="flame-svg"><defs><radialGradient id="fgg" cx="50%" cy="85%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="'+c+'"/><stop offset="1" stop-color="'+c+'" stop-opacity="0"/></radialGradient></defs><ellipse cx="100" cy="140" rx="90" ry="104" fill="url(#fgg)" opacity=".55"/><path class="fl1" d="M100 24C132 70 150 100 144 140C140 176 120 190 100 190C80 190 60 176 56 140C50 100 68 70 100 24Z" fill="'+c+'" opacity=".92"/><path class="fl2" d="M100 70C122 100 130 120 126 146C123 170 112 182 100 182C88 182 77 170 74 146C70 120 78 100 100 70Z" fill="#fff" opacity=".6"/><rect x="86" y="188" width="28" height="36" rx="4" fill="#475569"/><rect x="72" y="222" width="56" height="10" rx="4" fill="#334155"/></svg>'}

/* ================= Quiz Blitz ================= */
G.blitz=function(r,g,A){var X=A.X,E=A.E,d=g.data||{},pool=(d.q||[]).filter(function(q){return q&&q.q&&q.o&&q.o.length>=2}).map(function(q){return{q:q.q,o:q.o.slice(0,4).filter(Boolean),a:+q.a,e:q.e||''}});
 if(String(g.id||'').indexOf('physics-formula-sprint')>=0||String(g.t||'').trim()==='Physics Formula Sprint'){d.useChapters='0';pool=pool.filter(function(q){return !/(chemistry|রসায়ন|রাসায়নিক|আয়ন|pH|মোলারিটি|অক্সিডেশন|বিক্রিয়া|পর্যায় সারণি)/i.test(String(q.q)+' '+String(q.e||'')+' '+q.o.join(' '))})}if(String(d.useChapters)!=='0'&&String(d.useChapters)!=='false')pool=pool.concat(A.questions());
 if(pool.length<2)return empty(r,'Add some questions in the admin panel to play this game.');
 var T=+d.time||60,score=0,lives=3,combo=0,order=[],cur,lock=false,t0=performance.now(),over=false,correct=0,missed=[];
 r.innerHTML=hud([[X('g_score'),'sc',0],[X('g_combo'),'cb','x1'],[X('g_lives'),'lv',''],[X('g_time'),'tm',T]])+'<div class="tbar"><i id="tb"></i></div><div class="card qa" id="qa"></div>';
 function h(){qa(r,'#sc').textContent=score;qa(r,'#cb').textContent='x'+Math.min(4,1+Math.floor(combo/3));qa(r,'#lv').innerHTML=hearts(lives)}
 function nxt(){if(!order.length)order=sh(pool.slice());cur=order.pop();var opts=sh(cur.o.map(function(t,i){return{t:t,ok:i==cur.a}}));qa(r,'#qa').innerHTML='<p class="bn qt">'+E(cur.q)+'</p>'+opts.map(function(o){return'<button class="opt" data-ok="'+(o.ok?1:0)+'">'+E(o.t)+'</button>'}).join('');lock=false}
 qa(r,'#qa').onclick=function(e){var b=e.target.closest('.opt');if(!b||lock||over)return;lock=true;var ok=b.dataset.ok=='1';
  if(ok){combo++;score+=10*Math.min(4,1+Math.floor(combo/3));correct++;b.classList.add('ok')}else{combo=0;lives--;b.classList.add('no');qq(r,'.opt').forEach(function(o){if(o.dataset.ok=='1')o.classList.add('ok')});if(missed.length<12)missed.push({q:cur.q,a:cur.o[cur.a],e:cur.e});if(cur.e){var xe=document.createElement('p');xe.className='ex wrongex';xe.textContent='✘ '+cur.e;qa(r,'#qa').appendChild(xe)}}
  h();if(lives<=0)return setTimeout(end,cur.e&&!ok?1800:800);setTimeout(nxt,ok?320:(cur.e?1900:950))};
 A.every(r,150,function(){var left=T-(performance.now()-t0)/1000;qa(r,'#tm').textContent=Math.max(0,Math.ceil(left));qa(r,'#tb').style.width=Math.max(0,left/T*100)+'%';if(left<=0)end()});
 function end(){if(over)return;over=true;A.done({score:score,pct:Math.min(1,score/200),detail:correct+' correct',review:missed})}
 h();nxt()};

/* ================= Formula Memory ================= */
G.memory=function(r,g,A){var X=A.X,E=A.E,pairs=((g.data||{}).pairs||[]).filter(function(p){return p&&p.a&&p.b});if(pairs.length<2)return empty(r,'Add at least 2 pairs in the admin panel.');
 var chosen=sh(pairs.slice()).slice(0,6),n=chosen.length,cards=[];chosen.forEach(function(p,i){cards.push({id:i,t:p.a});cards.push({id:i,t:p.b})});sh(cards);
 var first=-1,lock=false,moves=0,matched=0,t0=performance.now(),over=false,cols=cards.length>=12?4:cards.length>=8?4:3;
 r.innerHTML=hud([[X('g_moves'),'mv',0],['Pairs','pr','0 / '+n],[X('g_time'),'tm','0s']])+'<div class="mgrid" style="--cols:'+cols+'">'+cards.map(function(c,i){return'<button class="mc" data-i="'+i+'"><span class="mf">?</span><span class="mb">'+E(c.t)+'</span></button>'}).join('')+'</div>';
 A.every(r,500,function(){if(!over)qa(r,'#tm').textContent=Math.round((performance.now()-t0)/1000)+'s'});
 r.onclick=function(e){var b=e.target.closest('.mc');if(!b||lock||over||b.classList.contains('on')||b.classList.contains('ok'))return;var i=+b.dataset.i;b.classList.add('on');
  if(first<0){first=i;return}moves++;qa(r,'#mv').textContent=moves;var a=qq(r,'.mc')[first];
  if(cards[first].id==cards[i].id){a.classList.add('ok');b.classList.add('ok');matched++;first=-1;qa(r,'#pr').textContent=matched+' / '+n;if(matched==n){over=true;var secs=Math.round((performance.now()-t0)/1000);setTimeout(function(){A.done({score:Math.max(100,Math.round(1000-moves*25-secs*4)),pct:Math.max(.35,Math.min(1,n*1.5/moves)),detail:moves+' moves, '+secs+'s'})},700)}}
  else{lock=true;setTimeout(function(){a.classList.remove('on');b.classList.remove('on');first=-1;lock=false},850)}}};

/* ================= True or False ================= */
G.tf=function(r,g,A){var X=A.X,E=A.E,items=((g.data||{}).items||[]).filter(function(i){return i&&i.s});if(items.length<2)return empty(r,'Add statements in the admin panel.');
 var list=sh(items.slice()).slice(0,10),i=0,lives=3,score=0,combo=0,right=0,lock=false,over=false,missed=[];
 r.innerHTML=hud([[X('g_score'),'sc',0],[X('g_combo'),'cb','x1'],[X('g_lives'),'lv',''],['Card','pg','']])+'<div class="card tfc" id="tc"></div>';
 function isT(it){return it.t===true||String(it.t)==='true'||String(it.t)==='1'}
 function h(){qa(r,'#sc').textContent=score;qa(r,'#cb').textContent='x'+Math.min(4,1+Math.floor(combo/3));qa(r,'#lv').innerHTML=hearts(lives);qa(r,'#pg').textContent=Math.min(i+1,list.length)+' / '+list.length}
 function show(){lock=false;qa(r,'#tc').innerHTML='<p class="bn qt">'+E(list[i].s)+'</p><div class="tfrow"><button class="tfb t" data-v="1">✔ '+E(X('g_true'))+' <small>←</small></button><button class="tfb f" data-v="0">✘ '+E(X('g_false'))+' <small>→</small></button></div><p class="ex" id="ex"></p><div id="nx"></div>';h()}
 function ans(v){if(lock||over)return;lock=true;var it=list[i],ok=(v==isT(it));qq(r,'.tfb').forEach(function(b){var bv=b.dataset.v=='1';b.classList.add(bv==isT(it)?'ok':(bv==v?'no':'dim'))});
  if(ok){combo++;score+=10*Math.min(4,1+Math.floor(combo/3));right++}else{combo=0;lives--;if(missed.length<12)missed.push({q:it.s,a:isT(it)?'সত্য':'মিথ্যা',e:it.e||''})}qa(r,'#ex').innerHTML=(ok?'✔ ':'✘ ')+E(it.e||'');h();
  if(lives<=0||i>=list.length-1){setTimeout(end,1400)}else{qa(r,'#nx').innerHTML='<button class="btn pri" id="nb">'+E(X('g_next'))+'</button>';qa(r,'#nb').onclick=nx}}
 function nx(){i++;show()}
 function end(){if(over)return;over=true;A.done({score:score,pct:right/list.length,detail:right+' / '+list.length+' correct',review:missed})}
 r.onclick=function(e){var b=e.target.closest('.tfb');if(b)ans(b.dataset.v=='1')};
 keyhandler(r,function(e){if(e.key=='ArrowLeft')ans(true);else if(e.key=='ArrowRight')ans(false);else if((e.key=='Enter'||e.key==' ')&&lock){var nb=qa(r,'#nb');if(nb){e.preventDefault();nb.click()}}});show()};

/* ================= Word Scramble ================= */
G.scramble=function(r,g,A){var X=A.X,E=A.E,words=((g.data||{}).words||[]).filter(function(w){return w&&w.w&&w.w.trim().length>=3});if(!words.length)return empty(r,'Add words in the admin panel.');
 var list=sh(words.slice()).slice(0,5),i=0,score=0,solved=0,cur,target,bank,ans,hints,t0,lock=false,over=false;
 r.innerHTML=hud([[X('g_score'),'sc',0],['Word','pg',''],['Hints used','ht',0]])+'<div class="card" id="sb"></div>';
 function setup(){cur=list[i];target=Array.from(cur.w.trim().toUpperCase().replace(/\s+/g,''));bank=target.map(function(c,k){return{c:c,k:k}});var tries=0;do{sh(bank);tries++}while(tries<20&&bank.map(function(b){return b.c}).join('')==target.join(''));ans=[];hints=0;t0=performance.now();lock=false;draw()}
 function draw(){qa(r,'#pg').textContent=(i+1)+' / '+list.length;qa(r,'#sc').textContent=score;qa(r,'#ht').textContent=hints;
  qa(r,'#sb').innerHTML='<p class="bn" style="margin:0 0 14px;text-align:center">💡 '+E(cur.h||'')+'</p><div class="slots">'+target.map(function(_,k){return'<button class="tile slot'+(ans[k]?' fill':'')+'" data-a="'+k+'">'+(ans[k]?E(ans[k].c):'')+'</button>'}).join('')+'</div><div class="slots bank">'+bank.map(function(b,k){return'<button class="tile" data-b="'+k+'">'+E(b.c)+'</button>'}).join('')+'</div><div class="chips" style="margin-top:16px"><button class="btn" data-x="shuf">Shuffle</button><button class="btn" data-x="hint">Hint (−30)</button><button class="btn" data-x="clear">Clear</button><button class="btn" data-x="skip">Skip →</button></div>'}
 function back(k){var t=ans.splice(k,1)[0];if(t)bank.push(t)}
 function check(){lock=true;var ok=ans.map(function(a){return a.c}).join('')==target.join('');var sl=qq(r,'.slot');
  if(ok){sl.forEach(function(s){s.classList.add('ok')});var secs=(performance.now()-t0)/1000,pts=Math.max(20,100-hints*30)+Math.max(0,Math.round(40-secs));score+=pts;solved+=hints?.6:1;qa(r,'#sc').textContent=score;setTimeout(next,900)}
  else{sl.forEach(function(s){s.classList.add('no')});setTimeout(function(){while(ans.length)back(0);lock=false;draw()},650)}}
 function next(){i++;if(i>=list.length){over=true;return A.done({score:score,pct:Math.min(1,solved/list.length),detail:Math.round(solved)+' / '+list.length+' solved'})}setup()}
 r.onclick=function(e){if(lock||over)return;var b=e.target.closest('[data-b]'),a=e.target.closest('[data-a]'),x=e.target.closest('[data-x]');
  if(b){ans.push(bank.splice(+b.dataset.b,1)[0]);draw();if(ans.length==target.length)check()}
  else if(a){if(ans[+a.dataset.a]){back(+a.dataset.a);draw()}}
  else if(x){var k=x.dataset.x;if(k=='shuf'){sh(bank);draw()}else if(k=='clear'){while(ans.length)back(0);draw()}else if(k=='skip'){next()}
   else if(k=='hint'){var p=0;while(p<ans.length&&ans[p].c==target[p])p++;while(ans.length>p)back(p);var bi=-1;bank.forEach(function(t,q){if(bi<0&&t.c==target[ans.length])bi=q});if(bi>=0){ans.push(bank.splice(bi,1)[0]);hints++}draw();if(ans.length==target.length)check()}}};
 setup()};

/* ================= Balance the Equation ================= */
function norm(f){return String(f).replace(/[₀-₉]/g,function(c){return SUBD.indexOf(c)})}
function pretty(f){return norm(f).replace(/([A-Za-z)])(\d+)/g,function(m,a,b){return a+b.split('').map(function(d){return SUBD[+d]}).join('')})}
function atoms(f){f=norm(f);var i=0;function num(){var s='';while(i<f.length&&/\d/.test(f[i]))s+=f[i++];return s?+s:1}
 function grp(){var o={};while(i<f.length){var ch=f[i];if(ch=='('){i++;var inner=grp();i++;var n=num();for(var k in inner)o[k]=(o[k]||0)+inner[k]*n}else if(ch==')'){return o}else if(/[A-Z]/.test(ch)){var s=ch;i++;while(i<f.length&&/[a-z]/.test(f[i]))s+=f[i++];var m=num();o[s]=(o[s]||0)+m}else i++}return o}return grp()}
function parseEq(line){var parts=String(line||'').replace(/->|=>|→|⟶|=/,'→').split('→');if(parts.length!=2)return null;
 function side(s){return s.split('+').map(function(t){return t.trim().replace(/^\d+\s*/,'')}).filter(Boolean).map(function(f){return{f:f,a:atoms(f)}})}
 var L=side(parts[0]),R=side(parts[1]);return L.length&&R.length?{L:L,R:R}:null}
function gcd(a,b){return b?gcd(b,a%b):a}
G.balance=function(r,g,A){var X=A.X,E=A.E,eqs=((g.data||{}).eqs||[]).map(parseEq).filter(Boolean);if(!eqs.length)return empty(r,'Add equations in the admin panel.');
 var list=sh(eqs.slice()).slice(0,5),i=0,score=0,solved=0,eq,co,clicks,over=false,done=false;
 r.innerHTML=hud([[X('g_score'),'sc',0],['Equation','pg','']])+'<div class="card" id="bb"></div>';
 function terms(){return eq.L.concat(eq.R)}
 function tally(side,off){var o={};side.forEach(function(t,k){for(var e in t.a)o[e]=(o[e]||0)+t.a[e]*co[off+k]});return o}
 function setup(){eq=list[i];co=terms().map(function(){return 1});clicks=0;done=false;draw()}
 function status(){var l=tally(eq.L,0),rr=tally(eq.R,eq.L.length),els={};Object.keys(l).concat(Object.keys(rr)).forEach(function(e){els[e]=1});var ok=true;Object.keys(els).forEach(function(e){if((l[e]||0)!=(rr[e]||0))ok=false});return{l:l,r:rr,els:Object.keys(els),ok:ok}}
 function draw(){var st=status(),n=eq.L.length;qa(r,'#pg').textContent=(i+1)+' / '+list.length;qa(r,'#sc').textContent=score;
  function term(t,k){return'<div class="term"><span class="stp"><button data-t="'+k+'" data-d="1" aria-label="more">+</button><b>'+co[k]+'</b><button data-t="'+k+'" data-d="-1" aria-label="less">−</button></span><span class="fm">'+E(pretty(t.f))+'</span></div>'}
  var h='<div class="eqrow">'+eq.L.map(function(t,k){return(k?'<span class="op">+</span>':'')+term(t,k)}).join('')+'<span class="op arr">→</span>'+eq.R.map(function(t,k){return(k?'<span class="op">+</span>':'')+term(t,n+k)}).join('')+'</div>';
  h+='<div class="atoms">'+st.els.map(function(e){var a=st.l[e]||0,b=st.r[e]||0;return'<div class="at '+(a==b?'ok':'no')+'"><b>'+E(e)+'</b><span>'+a+' | '+b+'</span><i>'+(a==b?'✓':'✗')+'</i></div>'}).join('')+'</div><p class="ex" id="bm" style="text-align:center">Atoms on the left | atoms on the right. Make every element match.</p>';
  qa(r,'#bb').innerHTML=h;if(st.ok&&!done){var gg=co.reduce(gcd,0);if(gg==1){done=true;win()}else qa(r,'#bm').textContent='Balanced, but can you use the smallest whole numbers?'}}
 function win(){var pts=Math.max(30,120-clicks*6);score+=pts;solved++;qa(r,'#sc').textContent=score;A.confetti();qa(r,'#bm').innerHTML='✔ Balanced! +'+pts;qq(r,'.stp button').forEach(function(b){b.disabled=true});setTimeout(function(){i++;if(i>=list.length){over=true;A.done({score:score,pct:solved/list.length,detail:solved+' / '+list.length+' balanced'})}else setup()},1300)}
 r.onclick=function(e){var b=e.target.closest('[data-t]');if(!b||done||over)return;var k=+b.dataset.t,v=co[k]+ +b.dataset.d;if(v<1||v>12)return;co[k]=v;clicks++;draw()};setup()};

/* ================= Projectile Cannon ================= */
G.cannon=function(r,g,A){var X=A.X,E=A.E,W=800,H=340,GY=300,OX=46,SC=3.6,GR=9.8,rounds=5,round=0,shots=3,score=0,hits=0,tgt,shot=null,ghosts=[],msg='',busy=false,over=false,ang=45,pow=25,boom=0;
 r.innerHTML=hud([[X('g_score'),'sc',0],['Target','rd',''],['Shots left','sl','']])+'<div class="card" style="padding:12px"><canvas id="cn" class="cv2" width="'+W+'" height="'+H+'" style="aspect-ratio:'+W+'/'+H+'"></canvas></div><div class="ctl"><div><label><span>Angle</span><output id="ao"></output></label><input id="an" type="range" min="5" max="85" value="45"></div><div><label><span>Power</span><output id="po"></output></label><input id="pw" type="range" min="10" max="40" value="25"></div></div><div class="chips"><button class="btn pri" id="fire">🔥 Fire!</button></div><p class="ex" id="cm" style="text-align:center">Range R = v² · sin 2θ ÷ g. Choose the angle and power so that R equals the distance to the target.</p>';
 var c=qa(r,'#cn'),x=c.getContext('2d'),P=col('--p','#38bdf8'),S2=col('--s','#7dd3fc'),Am=col('--a','#fbbf24'),dpr=1;
 function upd(){ang=+qa(r,'#an').value;pow=+qa(r,'#pw').value;qa(r,'#ao').textContent=ang+'°';qa(r,'#po').textContent=pow+' m/s'}
 r.oninput=upd;upd();
 function newT(){var d=ri(35,150);while(tgt&&Math.abs(d-tgt.d)<30)d=ri(35,150);tgt={d:d};shots=3;ghosts=[];shot=null;busy=false;msg='';qa(r,'#rd').textContent=(round+1)+' / '+rounds;qa(r,'#sl').textContent=shots;qa(r,'#sc').textContent=score;qa(r,'#cm').textContent='Target is '+d+' m away.'}
 function fire(){if(busy||over)return;busy=true;shot={th:ang*Math.PI/180,v:pow,t:0};shots--;qa(r,'#sl').textContent=shots}
 qa(r,'#fire').onclick=fire;
 function land(){var T=2*shot.v*Math.sin(shot.th)/GR,R=shot.v*Math.cos(shot.th)*T,err=R-tgt.d;ghosts.push({th:shot.th,v:shot.v});shot.landed=R;
  if(Math.abs(err)<=5){var pts=Math.max(30,100-(2-shots)*30)+(Math.abs(err)<1.5?10:0);score+=pts;hits++;boom=1;A.confetti();qa(r,'#sc').textContent=score;qa(r,'#cm').textContent='🎯 Direct hit! +'+pts+' (landed at '+R.toFixed(1)+' m)';setTimeout(nextRound,1500)}
  else{qa(r,'#cm').textContent='Landed at '+R.toFixed(1)+' m, '+(err<0?'short':'long')+' by '+Math.abs(err).toFixed(1)+' m.'+(shots>0?' Adjust and fire again.':'');if(shots<=0)setTimeout(nextRound,1700);else busy=false}}
 function nextRound(){round++;if(round>=rounds){over=true;return A.done({score:score,pct:hits/rounds,detail:hits+' / '+rounds+' targets'})}newT()}
 function pos(s,t){return[OX+s.v*Math.cos(s.th)*t*SC,GY-(s.v*Math.sin(s.th)*t-.5*GR*t*t)*SC]}
 (function frame(){if(!r.isConnected)return;var last=frame.l||performance.now(),n=performance.now(),dt=Math.min(.05,(n-last)/1000);frame.l=n;
  x.clearRect(0,0,W,H);x.strokeStyle='rgba(125,190,230,.12)';x.lineWidth=1;x.fillStyle='#7f9bb3';x.font='11px Inter,sans-serif';x.textAlign='center';for(var d=0;d<=210;d+=30){var gx=OX+d*SC;x.beginPath();x.moveTo(gx,20);x.lineTo(gx,GY);x.stroke();x.fillText(d+' m',gx,GY+16)}
  x.strokeStyle='rgba(150,200,240,.5)';x.lineWidth=2;x.beginPath();x.moveTo(0,GY);x.lineTo(W,GY);x.stroke();
  ghosts.forEach(function(gh){x.beginPath();var T=2*gh.v*Math.sin(gh.th)/GR;for(var i=0;i<=60;i++){var p=pos(gh,T*i/60);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}x.strokeStyle='rgba(125,211,252,.28)';x.setLineDash([4,6]);x.lineWidth=1.5;x.stroke();x.setLineDash([])});
  if(tgt){var tx=OX+tgt.d*SC,tw=5*SC;x.fillStyle='rgba(251,191,36,.25)';x.fillRect(tx-tw,GY-4,tw*2,6);for(var k=3;k>=1;k--){x.beginPath();x.arc(tx,GY-18,k*7,0,TAU);x.fillStyle=k%2?'#f87171':'#fff';x.fill()}x.fillStyle=Am;x.font='bold 12px Inter,sans-serif';x.fillText(tgt.d+' m',tx,GY-52)}
  var a=ang*Math.PI/180;x.save();x.translate(OX,GY-8);x.rotate(-a);x.fillStyle='#475569';x.fillRect(0,-7,46,14);x.fillStyle=P;x.fillRect(38,-8,10,16);x.restore();x.fillStyle='#1e293b';x.beginPath();x.arc(OX,GY-4,16,Math.PI,0);x.fill();
  if(!busy&&!over){x.strokeStyle=P+'55';x.setLineDash([3,6]);x.lineWidth=2;x.beginPath();x.moveTo(OX,GY-8);x.lineTo(OX+Math.cos(a)*90,GY-8-Math.sin(a)*90);x.stroke();x.setLineDash([])}
  if(shot){shot.t+=dt*1.5;var T=2*shot.v*Math.sin(shot.th)/GR,tt=Math.min(shot.t,T);x.beginPath();for(var i=0;i<=60;i++){var p=pos(shot,tt*i/60);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}x.strokeStyle=S2;x.lineWidth=3;x.shadowColor=P;x.shadowBlur=10;x.stroke();x.shadowBlur=0;var q=pos(shot,tt);x.fillStyle=Am;x.shadowColor=Am;x.shadowBlur=14;x.beginPath();x.arc(q[0],q[1],7,0,TAU);x.fill();x.shadowBlur=0;if(shot.t>=T&&shot.landed==null)land()}
  requestAnimationFrame(frame)})();
 newT()};

/* ================= Slope Sniper ================= */
G.slope=function(r,g,A){var X=A.X,E=A.E,W=600,H=400,SC=30,rounds=5,round=0,score=0,solved=0,m0,c0,pts,t0,hint=0,lock=false,over=false;
 r.innerHTML=hud([[X('g_score'),'sc',0],['Round','rd',''],['Points on line','ph','0 / 3']])+'<div class="card" style="padding:12px"><canvas id="sg" class="cv2" width="'+W+'" height="'+H+'" style="aspect-ratio:'+W+'/'+H+'"></canvas></div><div class="ctl"><div><label><span>Slope m</span><output id="mo"></output></label><input id="ms" type="range" min="-4" max="4" step=".5" value="0"></div><div><label><span>y-intercept c</span><output id="co"></output></label><input id="cs" type="range" min="-6" max="6" step="1" value="0"></div></div><p class="bn" id="eq" style="text-align:center;margin:0 0 8px"></p><div class="chips"><button class="btn" id="hn">Hint (−30)</button><button class="btn" id="sk">Skip →</button></div><p class="ex" id="hm" style="text-align:center"></p>';
 var cv=qa(r,'#sg'),x=cv.getContext('2d'),P=col('--p','#38bdf8'),Am=col('--a','#fbbf24'),m=0,c=0;
 function upd(){m=+qa(r,'#ms').value;c=+qa(r,'#cs').value;qa(r,'#mo').textContent=m;qa(r,'#co').textContent=c;qa(r,'#eq').textContent='y = '+m+'x '+(c<0?'− ':'+ ')+Math.abs(c)}
 r.oninput=upd;
 function newR(){var ok=false;while(!ok){m0=ri(-3,3);if(!m0)continue;c0=ri(-4,4);var xs=sh([-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6]).slice(0,3).sort(function(a,b){return a-b});pts=xs.map(function(xv){return[xv,m0*xv+c0]});ok=pts.every(function(p){return Math.abs(p[1])<=6})}
  hint=0;lock=false;t0=performance.now();qa(r,'#rd').textContent=(round+1)+' / '+rounds;qa(r,'#hm').textContent='';qa(r,'#ms').value=0;qa(r,'#cs').value=0;upd()}
 qa(r,'#hn').onclick=function(){hint++;var a=pts[0],b=pts[1];qa(r,'#hm').textContent='Slope between the first two dots = rise ÷ run = ('+(b[1]-a[1])+') ÷ ('+(b[0]-a[0])+') = '+((b[1]-a[1])/(b[0]-a[0]))+'. The line crosses the y-axis where x = 0.'};
 qa(r,'#sk').onclick=function(){if(!lock)next()};
 function next(){round++;if(round>=rounds){over=true;return A.done({score:score,pct:solved/rounds,detail:solved+' / '+rounds+' lines found'})}newR()}
 function X1(v){return W/2+v*SC}function Y1(v){return H/2-v*SC}
 (function frame(){if(!r.isConnected)return;x.clearRect(0,0,W,H);x.strokeStyle='rgba(125,190,230,.12)';x.lineWidth=1;x.beginPath();for(var i=-10;i<=10;i++){x.moveTo(X1(i),0);x.lineTo(X1(i),H)}for(i=-6;i<=6;i++){x.moveTo(0,Y1(i));x.lineTo(W,Y1(i))}x.stroke();x.strokeStyle='rgba(150,200,240,.45)';x.beginPath();x.moveTo(0,Y1(0));x.lineTo(W,Y1(0));x.moveTo(X1(0),0);x.lineTo(X1(0),H);x.stroke();
  x.beginPath();x.moveTo(X1(-10),Y1(m*-10+c));x.lineTo(X1(10),Y1(m*10+c));x.strokeStyle=P;x.lineWidth=3.5;x.shadowColor=P;x.shadowBlur=12;x.stroke();x.shadowBlur=0;
  var n=0;if(pts)pts.forEach(function(p){var on=Math.abs(m*p[0]+c-p[1])<1e-6;if(on)n++;x.fillStyle=on?'#34d399':Am;x.shadowColor=x.fillStyle;x.shadowBlur=on?22:12;x.beginPath();x.arc(X1(p[0]),Y1(p[1]),on?9:7,0,TAU);x.fill();x.shadowBlur=0;x.fillStyle='#e2f1ff';x.font='11px Inter,sans-serif';x.textAlign='left';x.fillText('('+p[0]+', '+p[1]+')',X1(p[0])+12,Y1(p[1])-10)});
  var el=qa(r,'#ph');if(el)el.textContent=n+' / 3';
  if(n==3&&!lock&&!over){lock=true;var secs=(performance.now()-t0)/1000,pt=Math.max(30,100-hint*30-Math.round(secs/2));score+=pt;solved++;qa(r,'#sc').textContent=score;A.confetti(null,null,50);qa(r,'#hm').textContent='🎯 Perfect line! +'+pt;setTimeout(next,1300)}
  requestAnimationFrame(frame)})();newR()};

/* ================= Flame Detective ================= */
G.flame=function(r,g,A){var X=A.X,E=A.E,items=((g.data||{}).items||[]).filter(function(i){return i&&i.n&&i.c});if(items.length<3)return empty(r,'Add at least 3 ions in the admin panel.');
 var rounds=8,i=0,score=0,combo=0,right=0,lock=false,tgt;
 r.innerHTML=hud([[X('g_score'),'sc',0],[X('g_combo'),'cb','x1'],['Round','rd','']])+'<div class="card" style="text-align:center"><div class="flamebox" id="fb"></div><p class="bn" style="margin:6px 0 14px">এই শিখার রং কোন আয়নের?</p><div id="fo"></div><p class="ex" id="fe"></p><div id="fn"></div></div>';
 function h(){qa(r,'#sc').textContent=score;qa(r,'#cb').textContent='x'+Math.min(4,1+Math.floor(combo/3));qa(r,'#rd').textContent=Math.min(i+1,rounds)+' / '+rounds}
 function show(){lock=false;tgt=items[Math.floor(Math.random()*items.length)];var others=sh(items.filter(function(t){return t!==tgt})).slice(0,3),opts=sh([tgt].concat(others));qa(r,'#fb').innerHTML=flameSvg(tgt.c);qa(r,'#fo').innerHTML='<div class="chips">'+opts.map(function(o){return'<button class="btn opt2" data-n="'+E(o.n)+'">'+E(o.n)+'</button>'}).join('')+'</div>';qa(r,'#fe').textContent='';qa(r,'#fn').innerHTML='';h()}
 r.onclick=function(e){var b=e.target.closest('.opt2');if(!b||lock)return;lock=true;var ok=b.dataset.n==tgt.n;qq(r,'.opt2').forEach(function(o){o.classList.add(o.dataset.n==tgt.n?'okb':(o===b?'nob':'dim'))});
  if(ok){combo++;score+=10*Math.min(4,1+Math.floor(combo/3));right++}else combo=0;qa(r,'#fe').textContent=(ok?'✔ ':'✘ ')+tgt.n+': '+(tgt.l||'')+' শিখা';h();
  setTimeout(function(){i++;if(i>=rounds)A.done({score:score,pct:right/rounds,detail:right+' / '+rounds+' correct'});else show()},1300)};show()};

/* ================= Periodic Quest ================= */
G.periodic=function(r,g,A){
 var E=A.E,mode='home',score=0,right=0,round=0,over=false,selected=null,placed={},used={},timer=null;
 var els=[
 [1,'H','Hydrogen',1,1],[2,'He','Helium',1,18],
 [3,'Li','Lithium',2,1],[4,'Be','Beryllium',2,2],[5,'B','Boron',2,13],[6,'C','Carbon',2,14],[7,'N','Nitrogen',2,15],[8,'O','Oxygen',2,16],[9,'F','Fluorine',2,17],[10,'Ne','Neon',2,18],
 [11,'Na','Sodium',3,1],[12,'Mg','Magnesium',3,2],[13,'Al','Aluminium',3,13],[14,'Si','Silicon',3,14],[15,'P','Phosphorus',3,15],[16,'S','Sulfur',3,16],[17,'Cl','Chlorine',3,17],[18,'Ar','Argon',3,18],
 [19,'K','Potassium',4,1],[20,'Ca','Calcium',4,2],[21,'Sc','Scandium',4,3],[22,'Ti','Titanium',4,4],[23,'V','Vanadium',4,5],[24,'Cr','Chromium',4,6],[25,'Mn','Manganese',4,7],[26,'Fe','Iron',4,8],[27,'Co','Cobalt',4,9],[28,'Ni','Nickel',4,10],[29,'Cu','Copper',4,11],[30,'Zn','Zinc',4,12],[31,'Ga','Gallium',4,13],[32,'Ge','Germanium',4,14],[33,'As','Arsenic',4,15],[34,'Se','Selenium',4,16],[35,'Br','Bromine',4,17],[36,'Kr','Krypton',4,18],
 [37,'Rb','Rubidium',5,1],[38,'Sr','Strontium',5,2],[39,'Y','Yttrium',5,3],[40,'Zr','Zirconium',5,4],[41,'Nb','Niobium',5,5],[42,'Mo','Molybdenum',5,6],[43,'Tc','Technetium',5,7],[44,'Ru','Ruthenium',5,8],[45,'Rh','Rhodium',5,9],[46,'Pd','Palladium',5,10],[47,'Ag','Silver',5,11],[48,'Cd','Cadmium',5,12],[49,'In','Indium',5,13],[50,'Sn','Tin',5,14],[51,'Sb','Antimony',5,15],[52,'Te','Tellurium',5,16],[53,'I','Iodine',5,17],[54,'Xe','Xenon',5,18],
 [55,'Cs','Caesium',6,1],[56,'Ba','Barium',6,2],[57,'La','Lanthanum',8,3],[58,'Ce','Cerium',8,3],[59,'Pr','Praseodymium',8,4],[60,'Nd','Neodymium',8,5],[61,'Pm','Promethium',8,6],[62,'Sm','Samarium',8,7],[63,'Eu','Europium',8,8],[64,'Gd','Gadolinium',8,9],[65,'Tb','Terbium',8,10],[66,'Dy','Dysprosium',8,11],[67,'Ho','Holmium',8,12],[68,'Er','Erbium',8,13],[69,'Tm','Thulium',8,14],[70,'Yb','Ytterbium',8,15],[71,'Lu','Lutetium',8,16],[72,'Hf','Hafnium',6,4],[73,'Ta','Tantalum',6,5],[74,'W','Tungsten',6,6],[75,'Re','Rhenium',6,7],[76,'Os','Osmium',6,8],[77,'Ir','Iridium',6,9],[78,'Pt','Platinum',6,10],[79,'Au','Gold',6,11],[80,'Hg','Mercury',6,12],[81,'Tl','Thallium',6,13],[82,'Pb','Lead',6,14],[83,'Bi','Bismuth',6,15],[84,'Po','Polonium',6,16],[85,'At','Astatine',6,17],[86,'Rn','Radon',6,18],
 [87,'Fr','Francium',7,1],[88,'Ra','Radium',7,2],[89,'Ac','Actinium',9,3],[90,'Th','Thorium',9,4],[91,'Pa','Protactinium',9,5],[92,'U','Uranium',9,6],[93,'Np','Neptunium',9,7],[94,'Pu','Plutonium',9,8],[95,'Am','Americium',9,9],[96,'Cm','Curium',9,10],[97,'Bk','Berkelium',9,11],[98,'Cf','Californium',9,12],[99,'Es','Einsteinium',9,13],[100,'Fm','Fermium',9,14],[101,'Md','Mendelevium',9,15],[102,'No','Nobelium',9,16],[103,'Lr','Lawrencium',9,17],[104,'Rf','Rutherfordium',7,4],[105,'Db','Dubnium',7,5],[106,'Sg','Seaborgium',7,6],[107,'Bh','Bohrium',7,7],[108,'Hs','Hassium',7,8],[109,'Mt','Meitnerium',7,9],[110,'Ds','Darmstadtium',7,10],[111,'Rg','Roentgenium',7,11],[112,'Cn','Copernicium',7,12],[113,'Nh','Nihonium',7,13],[114,'Fl','Flerovium',7,14],[115,'Mc','Moscovium',7,15],[116,'Lv','Livermorium',7,16],[117,'Ts','Tennessine',7,17],[118,'Og','Oganesson',7,18]
 ];
 var bySym={};els.forEach(function(x){bySym[x[1]]=x});
 var trends=[
 {q:'একই পর্যায়ে বাম থেকে ডানে সাধারণত পারমাণবিক আকার কী হয়?',o:['বাড়ে','কমে','একই থাকে','প্রথমে সবসময় বাড়ে'],a:1,e:'কার্যকর নিউক্লীয় আকর্ষণ বাড়ায় ইলেকট্রন মেঘ সাধারণত সংকুচিত হয়।'},
 {q:'গ্রুপে ওপর থেকে নিচে পারমাণবিক আকার সাধারণত—',o:['কমে','বাড়ে','অপরিবর্তিত','শূন্য হয়'],a:1,e:'নিচে নামলে নতুন প্রধান শক্তিস্তর যুক্ত হয়।'},
 {q:'একই পর্যায়ে সাধারণত আয়নীকরণ শক্তি কোন দিকে বাড়ে?',o:['বাম থেকে ডানে','ডান থেকে বামে','নিচে নামলে','কোনো প্রবণতা নেই'],a:0,e:'সাধারণ প্রবণতা ডানদিকে বৃদ্ধি; কিছু গুরুত্বপূর্ণ ব্যতিক্রম আছে।'},
 {q:'Na ও Cl-এর মধ্যে কার ধাতব ধর্ম বেশি?',o:['Na','Cl','দুজনের সমান','নির্ধারণ করা যায় না'],a:0,e:'একই পর্যায়ে বামদিকে ধাতব ধর্ম বেশি।'},
 {q:'হ্যালোজেনদের সাধারণত ইলেকট্রন গ্রহণের প্রবণতা কেমন?',o:['তুলনামূলক বেশি','সবচেয়ে কম','শূন্য','সবসময় ধাতুর মতো'],a:0,e:'হ্যালোজেনের বহিঃস্ত স্তরে একটি ইলেকট্রন কম থাকে।'},
 {q:'Be-এর প্রথম আয়নীকরণ শক্তি B-এর চেয়ে বেশি হওয়ার গুরুত্বপূর্ণ কারণ—',o:['Be-এর 2s উপস্তর পূর্ণ','B-এর নিউট্রন নেই','Be নিষ্ক্রিয় গ্যাস','B-এর নিউক্লিয়াস নেই'],a:0,e:'Be-এর 2s² উপস্তর তুলনামূলক স্থিতিশীল; B-এর ইলেকট্রন 2p উপস্তরে যায়।'},
 {q:'N-এর প্রথম আয়নীকরণ শক্তি O-এর চেয়ে বেশি হওয়ার কারণ—',o:['N-এর অর্ধপূর্ণ 2p³ বিন্যাস','O-এর প্রোটন নেই','N ধাতু','O-এর সব উপস্তর পূর্ণ'],a:0,e:'N-এর অর্ধপূর্ণ p উপস্তর অতিরিক্ত স্থিতিশীল; O-তে একটি p অরবিটালে জোড়া ইলেকট্রনের বিকর্ষণ থাকে।'},
 {q:'গলনাঙ্ক ও স্ফুটনাঙ্কের জন্য কোন বক্তব্যটি সবচেয়ে সঠিক?',o:['সবসময় ডানদিকে বাড়ে','সবসময় নিচে বাড়ে','বন্ধন ও গঠনের ওপর নির্ভর করে','সব মৌলের সমান'],a:2,e:'গলনাঙ্ক ও স্ফুটনাঙ্কে একটিমাত্র সর্বজনীন পর্যায়গত নিয়ম নেই।'},
 {q:'একটি পরমাণু ইলেকট্রন হারালে সাধারণত কী তৈরি হয়?',o:['ঋণায়ন','ধনায়ন','নিউট্রন','সমস্থানিক'],a:1,e:'ইলেকট্রন হারালে প্রোটনের তুলনায় ইলেকট্রন কমে, তাই ধনাত্মক আয়ন হয়।'},
 {q:'একই মৌলের ধনায়নের আকার সাধারণত নিরপেক্ষ পরমাণুর তুলনায়—',o:['বড়','ছোট','একই','অসীম'],a:1,e:'ইলেকট্রন হারানো ও ইলেকট্রন-ইলেকট্রন বিকর্ষণ কমার ফলে ধনায়ন সাধারণত ছোট হয়।'}
 ];
 function home(){mode='home';r.onclick=function(e){var b=e.target.closest('[data-mode]');if(!b)return;if(b.dataset.mode==='table')tableStart();else trendStart()};r.innerHTML='<div class="card"><div class="bn" style="font-size:1.35rem;font-weight:800">🧪 Periodic Quest · মৌলের পর্যায়বৃত্ত ধর্ম</div><p class="mutt">পর্যায়সারণী সাজাও, ধর্মের প্রবণতা ধরো, ব্যতিক্রম খুঁজে বের করো।</p><div class="gA g2" style="margin-top:18px"><button class="btn pri" data-mode="table">🧩 Table Architect · মৌল বসাও</button><button class="btn" data-mode="trend">📈 Trend Hunter · ধর্মের প্রবণতা</button></div><p class="mutt" style="margin-top:16px">লক্ষ্য: সঠিক অবস্থান, পর্যায়বৃত্ত প্রবণতা এবং কেন এমন হয়—সব একসঙ্গে শেখা।</p></div>'}
 function tableStart(){mode='table';score=0;right=0;round=0;placed={};used={};var pool=sh(els.filter(function(x){return x[0]<=36||[47,53,55,56,79,80,82,92,118].indexOf(x[0])>=0}).slice()).slice(0,12); // sampled target elements
  // include a representative mix every run
  pool=sh(pool);selected=null;
  function draw(){var inPool={};pool.forEach(function(x){inPool[x[0]]=1});
   function cell(p,gr){var found=els.find(function(x){return x[3]===p&&x[4]===gr});if(!found)return'<span class="pq-cell pq-none"></span>';var val=placed[found[0]];if(val)return'<button type="button" class="pq-cell filled" disabled aria-label="'+val[1]+'"><b>'+val[1]+'</b></button>';return'<button type="button" class="pq-cell target" data-cell="'+p+','+gr+'" aria-label="পারমাণবিক সংখ্যা '+found[0]+'"><small>'+found[0]+'</small></button>'}
   var cells='';for(var p=1;p<=7;p++){for(var gr=1;gr<=18;gr++)cells+=cell(p,gr)}
   var f='';for(var p2=8;p2<=9;p2++){for(var g2=3;g2<=17;g2++)f+=cell(p2,g2)}
   var left=pool.filter(function(x){return !used[x[0]]});
   r.innerHTML='<div class="hud"><div><small>স্কোর</small><b>'+score+'</b></div><div><small>সঠিক</small><b>'+right+' / 12</b></div><div><small>নির্বাচিত</small><b>'+(selected?selected[1]:'—')+'</b></div></div><div class="card"><p class="bn">নিচ থেকে মৌলের প্রতীক বেছে নাও, তারপর যে ঘরের পারমাণবিক সংখ্যা মেলে সেখানে ট্যাপ করো।</p><div class="pq-table pq-fit">'+cells+'</div><p class="mutt pq-fl">ল্যান্থানয়েড ও অ্যাক্টিনয়েড</p><div class="pq-table pq-f pq-fit">'+f+'</div><div class="pq-tray pq-chips">'+left.map(function(x){return'<button type="button" class="pq-chip '+(selected&&selected[0]===x[0]?'sel':'')+'" data-el="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div><p class="ex" id="pq-feedback"></p><button class="btn" data-home>← ব্যাক মেনু</button></div>';
  }
  r.onclick=function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-home'))return home();if(b.dataset.el){selected=pool.find(function(x){return x[0]===+b.dataset.el});draw();return}if(b.dataset.cell&&selected){var pos=b.dataset.cell.split(',').map(Number),ok=selected[3]===pos[0]&&selected[4]===pos[1];var fb=r.querySelector('#pq-feedback');if(ok){placed[selected[0]]=selected;used[selected[0]]=1;score+=10;right++;selected=null;if(right>=12){over=true;return A.done({score:score,pct:right/12,detail:'১২টির মধ্যে ১২টি মৌল সঠিক ঘরে বসানো হয়েছে'})}draw();var ff=r.querySelector('#pq-feedback');if(ff)ff.textContent='✔ সঠিক! মৌলের অবস্থান মনে রাখো।'}else{score=Math.max(0,score-2);if(fb)fb.textContent='আবার চেষ্টা করো—পারমাণবিক সংখ্যা, গ্রুপ ও পর্যায় মিলিয়ে দেখো।';draw();var f2=r.querySelector('#pq-feedback');if(f2)f2.textContent='আবার চেষ্টা করো—পারমাণবিক সংখ্যা, গ্রুপ ও পর্যায় মিলিয়ে দেখো।'}}};
  draw()
 }
 function trendStart(){mode='trend';score=0;right=0;round=0;over=false;var order=sh(trends.slice());function show(){if(round>=8)return A.done({score:score,pct:right/8,detail:right+' / 8 সঠিক উত্তর'});var q=order[round%order.length],opts=sh(q.o.map(function(t,i){return{t:t,ok:i===q.a}}));r.innerHTML='<div class="hud"><div><small>স্কোর</small><b>'+score+'</b></div><div><small>রাউন্ড</small><b>'+(round+1)+' / 8</b></div><div><small>সঠিক</small><b>'+right+'</b></div></div><div class="card"><p class="bn" style="font-size:1.2rem;font-weight:700">'+E(q.q)+'</p><div class="pq-options">'+opts.map(function(o){return'<button class="btn" data-ok="'+(o.ok?1:0)+'">'+E(o.t)+'</button>'}).join('')+'</div><p class="ex" id="pq-explain"></p><button class="btn" data-next hidden>পরের প্রশ্ন →</button><button class="btn" data-home>← ব্যাক মেনু</button></div>';r.onclick=function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-home'))return home();if(b.hasAttribute('data-next')){round++;return show()}if(b.dataset.ok!=null&&!b.disabled){var ok=b.dataset.ok==='1';if(ok){right++;score+=10}r.querySelectorAll('[data-ok]').forEach(function(x){x.disabled=true;x.classList.add(x.dataset.ok==='1'?'okb':'dim')});r.querySelector('#pq-explain').textContent=(ok?'✔ সঠিক। ':'✘ সঠিক উত্তর: '+q.o[q.a]+'. ')+q.e;r.querySelector('[data-next]').hidden=false}}}show()}
 r.onclick=function(e){var b=e.target.closest('[data-mode]');if(!b)return;if(b.dataset.mode==='table')tableStart();else trendStart()};
 home()
};



/* ================= Element Sprint ================= */
/* ================= Mass Atlas: atomic mass through the periodic table =================
   s = standard atomic weight (IUPAC conventional value, 2 d.p.).
   r = no standard atomic weight (no stable isotopes / synthetic): the number is the mass number of the
       longest-lived known isotope, written in square brackets like on IUPAC-style tables. NOT a standard mass.
   t = radioactive but with extremely long-lived isotopes (Th, Pa, U): standard weight exists. */
G.massAtlas=function(r,g,A){
 var E=A.E,mode='home',score=0,right=0,round=0,tries=0,sel=null,placed={},order=[],cur=null,locked=false;
 var RAW='1|H|Hydrogen|1.01|s;2|He|Helium|4.00|s;3|Li|Lithium|6.94|s;4|Be|Beryllium|9.01|s;5|B|Boron|10.81|s;6|C|Carbon|12.01|s;7|N|Nitrogen|14.01|s;8|O|Oxygen|16.00|s;9|F|Fluorine|19.00|s;10|Ne|Neon|20.18|s;11|Na|Sodium|22.99|s;12|Mg|Magnesium|24.31|s;13|Al|Aluminium|26.98|s;14|Si|Silicon|28.09|s;15|P|Phosphorus|30.97|s;16|S|Sulfur|32.06|s;17|Cl|Chlorine|35.45|s;18|Ar|Argon|39.95|s;19|K|Potassium|39.10|s;20|Ca|Calcium|40.08|s;21|Sc|Scandium|44.96|s;22|Ti|Titanium|47.87|s;23|V|Vanadium|50.94|s;24|Cr|Chromium|52.00|s;25|Mn|Manganese|54.94|s;26|Fe|Iron|55.85|s;27|Co|Cobalt|58.93|s;28|Ni|Nickel|58.69|s;29|Cu|Copper|63.55|s;30|Zn|Zinc|65.38|s;31|Ga|Gallium|69.72|s;32|Ge|Germanium|72.63|s;33|As|Arsenic|74.92|s;34|Se|Selenium|78.97|s;35|Br|Bromine|79.90|s;36|Kr|Krypton|83.80|s;37|Rb|Rubidium|85.47|s;38|Sr|Strontium|87.62|s;39|Y|Yttrium|88.91|s;40|Zr|Zirconium|91.22|s;41|Nb|Niobium|92.91|s;42|Mo|Molybdenum|95.95|s;43|Tc|Technetium|98|r;44|Ru|Ruthenium|101.07|s;45|Rh|Rhodium|102.91|s;46|Pd|Palladium|106.42|s;47|Ag|Silver|107.87|s;48|Cd|Cadmium|112.41|s;49|In|Indium|114.82|s;50|Sn|Tin|118.71|s;51|Sb|Antimony|121.76|s;52|Te|Tellurium|127.60|s;53|I|Iodine|126.90|s;54|Xe|Xenon|131.29|s;55|Cs|Caesium|132.91|s;56|Ba|Barium|137.33|s;57|La|Lanthanum|138.91|s;58|Ce|Cerium|140.12|s;59|Pr|Praseodymium|140.91|s;60|Nd|Neodymium|144.24|s;61|Pm|Promethium|145|r;62|Sm|Samarium|150.36|s;63|Eu|Europium|151.96|s;64|Gd|Gadolinium|157.25|s;65|Tb|Terbium|158.93|s;66|Dy|Dysprosium|162.50|s;67|Ho|Holmium|164.93|s;68|Er|Erbium|167.26|s;69|Tm|Thulium|168.93|s;70|Yb|Ytterbium|173.05|s;71|Lu|Lutetium|174.97|s;72|Hf|Hafnium|178.49|s;73|Ta|Tantalum|180.95|s;74|W|Tungsten|183.84|s;75|Re|Rhenium|186.21|s;76|Os|Osmium|190.23|s;77|Ir|Iridium|192.22|s;78|Pt|Platinum|195.08|s;79|Au|Gold|196.97|s;80|Hg|Mercury|200.59|s;81|Tl|Thallium|204.38|s;82|Pb|Lead|207.20|s;83|Bi|Bismuth|208.98|s;84|Po|Polonium|209|r;85|At|Astatine|210|r;86|Rn|Radon|222|r;87|Fr|Francium|223|r;88|Ra|Radium|226|r;89|Ac|Actinium|227|r;90|Th|Thorium|232.04|t;91|Pa|Protactinium|231.04|t;92|U|Uranium|238.03|t;93|Np|Neptunium|237|r;94|Pu|Plutonium|244|r;95|Am|Americium|243|r;96|Cm|Curium|247|r;97|Bk|Berkelium|247|r;98|Cf|Californium|251|r;99|Es|Einsteinium|252|r;100|Fm|Fermium|257|r;101|Md|Mendelevium|258|r;102|No|Nobelium|259|r;103|Lr|Lawrencium|266|r;104|Rf|Rutherfordium|267|r;105|Db|Dubnium|268|r;106|Sg|Seaborgium|269|r;107|Bh|Bohrium|270|r;108|Hs|Hassium|269|r;109|Mt|Meitnerium|278|r;110|Ds|Darmstadtium|281|r;111|Rg|Roentgenium|282|r;112|Cn|Copernicium|285|r;113|Nh|Nihonium|286|r;114|Fl|Flerovium|289|r;115|Mc|Moscovium|290|r;116|Lv|Livermorium|293|r;117|Ts|Tennessine|294|r;118|Og|Oganesson|294|r';
 function pos(z){if(z===1)return[1,1];if(z===2)return[1,18];if(z<=4)return[2,z-2];if(z<=10)return[2,z+8];if(z<=12)return[3,z-10];if(z<=18)return[3,z];if(z<=36)return[4,z-18];if(z<=54)return[5,z-36];if(z<=56)return[6,z-54];if(z<=71)return[8,z-54];if(z<=86)return[6,z-68];if(z<=88)return[7,z-86];if(z<=103)return[9,z-86];return[7,z-100]}
 var els=RAW.split(';').map(function(t){var a=t.split('|'),z=+a[0],q=pos(z);return[z,a[1],a[2],q[0],q[1],parseFloat(a[3]),a[4]]});
 var byZ={};els.forEach(function(x){byZ[x[0]]=x});
 var STD=els.filter(function(x){return x[6]!=='r'});
 function isR(x){return x[6]==='r'}
 function m2(x){return isR(x)?'['+x[5]+']':x[5].toFixed(2)}
 var inversions={18:'Ar (৩৯.৯৫) K (৩৯.১০)-এর চেয়ে ভারী হলেও Ar-এর পারমাণবিক সংখ্যা ১৮, K-এর ১৯।',27:'Co (৫৮.৯৩) Ni (৫৮.৬৯)-এর চেয়ে ভারী, অথচ Co-এর পারমাণবিক সংখ্যা ২৭ ও Ni-এর ২৮।',52:'Te (১২৭.৬০) I (১২৬.৯০)-এর চেয়ে ভারী, অথচ Te-এর পারমাণবিক সংখ্যা ৫২ ও I-এর ৫৩।',90:'Th (২৩২.০৪) Pa (২৩১.০৪)-এর চেয়ে ভারী, অথচ Th-এর পারমাণবিক সংখ্যা ৯০ ও Pa-এর ৯১।'};
 function why(x){var z=x[0];
  if(x[6]==='t')return'ℹ️ '+x[1]+' তেজস্ক্রিয়, কিন্তু এর আইসোটোপগুলো অত্যন্ত দীর্ঘজীবী (অর্ধায়ু কোটি বছরের কাছাকাছি বা বেশি)। তাই প্রকৃতিতে আইসোটোপের অনুপাত স্থির, এবং এর প্রমিত পারমাণবিক ভর আছে।';
  if(x[6]!=='r')return'';
  var base='⚠️ '+x[1]+'-এর কোনো প্রমিত পারমাণবিক ভর নেই। প্রমিত ভর নির্ভর করে প্রকৃতিতে আইসোটোপগুলোর স্থির অনুপাতের ওপর, আর তেজস্ক্রিয় মৌল ক্ষয় হয়ে যায় বলে সেই অনুপাত স্থির থাকে না। ';
  var tail=' বন্ধনীর সংখ্যাটি সবচেয়ে দীর্ঘজীবী পরিচিত আইসোটোপের ভরসংখ্যা, প্রমিত ভর নয়; উৎসভেদে এটি ভিন্ন হতে পারে।';
  if(z===43||z===61)return base+'এর কোনো স্থিতিশীল আইসোটোপই নেই।'+tail;
  if(z>=93)return base+'এটি কৃত্রিম মৌল, পরীক্ষাগারে পারমাণবিক বিক্রিয়ায় তৈরি; প্রকৃতিতে পাওয়া যায় না বা অতি সামান্য, আর আইসোটোপগুলোর অর্ধায়ু খুব কম।'+tail;
  return base+'এর সব আইসোটোপ তেজস্ক্রিয় ও তুলনামূলক স্বল্পায়ু, তাই প্রকৃতিতে অতি সামান্য পাওয়া যায়।'+tail}
 function band(x){var m=x[5];return m<20?0:m<45?1:m<80?2:m<130?3:4}
 var BANDS=['< ২০','২০–৪৫','৪৫–৮০','৮০–১৩০','১৩০+'];
 function legend(){return'<div class="ma-legend">'+BANDS.map(function(t,i){return'<span><i class="ma-b'+i+'"></i>'+t+'</span>'}).join('')+'<span><i class="ma-rad-k"></i>প্রমিত ভর নেই</span></div>'}
 var WARN='<p class="ma-warn">⚠️ ধূসর ডটেড ঘরের মৌলগুলোর (তেজস্ক্রিয়/কৃত্রিম) কোনো প্রমিত পারমাণবিক ভর পাওয়া যায় না। এদের ভর বন্ধনীতে [ ] দেখানো হয়, যা কেবল সবচেয়ে দীর্ঘজীবী আইসোটোপের ভরসংখ্যা।</p>';
 function cellHtml(f,o){var cls='ma-cell '+(isR(f)?'ma-rad':'ma-b'+band(f))+(o.hit===f[0]?' hit':'')+(o.sel===f[0]?' sel':'')+(o.miss&&o.miss[f[0]]?' miss':'');return'<button type="button" class="'+cls+'" data-z="'+f[0]+'"'+(o.off?' disabled':'')+' aria-label="'+f[2]+'"><b>'+f[1]+'</b></button>'}
 function grid(o){o=o||{};var h='',p,gr,f;function at(pp,gg){return els.find(function(x){return x[3]===pp&&x[4]===gg})}
  for(p=1;p<=7;p++)for(gr=1;gr<=18;gr++){f=at(p,gr);if(f)h+=cellHtml(f,o);else if(gr===3&&p===6)h+='<span class="ma-cell ma-ph">*</span>';else if(gr===3&&p===7)h+='<span class="ma-cell ma-ph">**</span>';else h+='<span class="ma-cell ma-none"></span>'}
  var fr='';for(p=8;p<=9;p++)for(gr=3;gr<=17;gr++){f=at(p,gr);fr+=f?cellHtml(f,o):'<span class="ma-cell ma-none"></span>'}
  return'<div class="ma-table">'+h+'</div><p class="mutt ma-fl">* ল্যান্থানয়েড (৫৭–৭১) &nbsp; ** অ্যাক্টিনয়েড (৮৯–১০৩)</p><div class="ma-table ma-f">'+fr+'</div>'}
 function home(){mode='home';r.onclick=function(e){var b=e.target.closest('[data-mode]');if(!b)return;({map:mapStart,hunt:huntStart,ladder:ladderStart})[b.dataset.mode]()};
  r.innerHTML='<div class="card"><div class="bn" style="font-size:1.35rem;font-weight:800">⚖️ Mass Atlas · ভরের মানচিত্র</div><p class="mutt">পর্যায়সারণীর রঙিন মানচিত্রে ঘুরে মৌলের পারমাণবিক ভর শেখো, খুঁজে বের করো, সাজাও।</p><div class="gA g2" style="margin-top:18px"><button class="btn pri" data-mode="map">🗺️ Mass Map · ভর দেখো</button><button class="btn" data-mode="hunt">🎯 Mass Hunt · ভর দেখে মৌল খোঁজো</button><button class="btn" data-mode="ladder">🪜 Mass Ladder · ভর বসাও</button></div><p class="mutt" style="margin-top:16px">মান: IUPAC-এর প্রমিত পারমাণবিক ভর, দুই দশমিক পর্যন্ত। রং যত গাঢ়, ভর তত বেশি।</p>'+WARN+'</div>'}
 /* ---- Mode 1: explore ---- */
 function mapStart(){mode='map';sel=null;mapDraw()}
 function mapDraw(){var x=sel?byZ[sel]:null;
  r.innerHTML='<div class="card"><p class="bn">যেকোনো মৌলে ট্যাপ করে তার ভর দেখো।</p><div class="ma-info">'+(x?'<span class="ma-sym">'+x[1]+'</span><div><div class="ma-name">'+x[2]+' · Z = '+x[0]+'</div><div class="ma-mass'+(isR(x)?' ma-mass-r':'')+'">'+m2(x)+' <small>u'+(isR(x)?' · প্রমিত ভর নয়':'')+'</small></div></div>':'<div class="mutt">একটি মৌল বেছে নাও…</div>')+'</div>'+(x&&(isR(x)||x[6]==='t')?'<p class="ex">'+why(x)+'</p>':'')+(x&&inversions[x[0]]?'<p class="ex">⚠️ '+inversions[x[0]]+'</p>':'')+legend()+grid({sel:sel})+WARN+'<button class="btn" data-home>← ব্যাক মেনু</button></div>';
  r.onclick=function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-home'))return home();if(b.dataset.z){sel=+b.dataset.z;mapDraw()}}}
 /* ---- Mode 2: hunt (only elements that have a standard atomic weight are asked) ---- */
 function huntStart(){mode='hunt';score=0;right=0;round=0;order=sh(STD.slice()).slice(0,10);huntShow()}
 function huntShow(){if(round>=order.length){return A.done({score:score,pct:right/order.length,detail:right+' / '+order.length+' মৌল প্রথম চেষ্টায় সঠিক'})}
  cur=order[round];tries=0;locked=false;if(Math.random()<.5)huntDrawFind({});else huntDrawChoice()}
 function hudH(){return'<div class="hud"><div><small>স্কোর</small><b>'+score+'</b></div><div><small>রাউন্ড</small><b>'+(round+1)+' / '+order.length+'</b></div><div><small>সঠিক</small><b>'+right+'</b></div></div>'}
 function huntDrawFind(miss,hit,msg){r.innerHTML=hudH()+'<div class="card"><p class="bn" style="font-size:1.15rem;font-weight:700">ভর <span class="ma-big">'+m2(cur)+'</span> u — এটি কোন মৌলের?</p><p class="mutt ma-hint">ধূসর ঘরের মৌলের প্রমিত ভর নেই, ওগুলো উত্তর নয়।</p>'+legend()+grid({miss:miss,hit:hit,off:!!hit})+'<p class="ex" id="ma-fb">'+(msg||'')+'</p><button class="btn pri" data-next '+(hit?'':'hidden')+'>পরের রাউন্ড →</button><button class="btn" data-home>← ব্যাক মেনু</button></div>';
  r.onclick=function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-home'))return home();if(b.hasAttribute('data-next')){round++;return huntShow()}
   if(!b.dataset.z||locked)return;var z=+b.dataset.z,w=byZ[z];
   if(z===cur[0]){locked=true;if(tries===0){right++;score+=10}else score+=Math.max(2,6-tries*2);huntDrawFind(miss,z,'✔ '+cur[1]+' ('+cur[2]+')-এর ভর '+m2(cur)+' u। '+(inversions[cur[0]]||''))}
   else if(isR(w)){miss[z]=1;huntDrawFind(miss,null,why(w))}
   else{tries++;miss[z]=1;score=Math.max(0,score-2);huntDrawFind(miss,null,'✘ '+w[1]+'-এর ভর '+m2(w)+' u। '+(w[5]<cur[5]?'খুঁজছি তার চেয়ে ভারী মৌল।':'খুঁজছি তার চেয়ে হালকা মৌল।'))}}}
 function huntDrawChoice(){var pool=STD.filter(function(x){return x[0]!==cur[0]&&Math.abs(x[5]-cur[5])>.4}).sort(function(a,b){return Math.abs(a[5]-cur[5])-Math.abs(b[5]-cur[5])}).slice(0,6);var opts=sh(sh(pool).slice(0,3).concat([cur]));
  r.innerHTML=hudH()+'<div class="card"><p class="bn" style="font-size:1.15rem;font-weight:700"><span class="ma-big">'+cur[1]+'</span> ('+cur[2]+', Z = '+cur[0]+')-এর পারমাণবিক ভর কত?</p><div class="pq-options">'+opts.map(function(o){return'<button class="btn" data-ok="'+(o===cur?1:0)+'">'+m2(o)+' u</button>'}).join('')+'</div><p class="ex" id="ma-fb"></p><button class="btn pri" data-next hidden>পরের রাউন্ড →</button><button class="btn" data-home>← ব্যাক মেনু</button></div>';
  r.onclick=function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-home'))return home();if(b.hasAttribute('data-next')){round++;return huntShow()}
   if(b.dataset.ok==null||b.disabled)return;var ok=b.dataset.ok==='1';if(ok){right++;score+=10}else score=Math.max(0,score-2);r.querySelectorAll('[data-ok]').forEach(function(x){x.disabled=true;x.classList.add(x.dataset.ok==='1'?'okb':(x===b?'nob':'dim'))});r.querySelector('#ma-fb').textContent=(ok?'✔ সঠিক। ':'✘ সঠিক ভর '+m2(cur)+' u। ')+(inversions[cur[0]]||'');r.querySelector('[data-next]').hidden=false}}
 /* ---- Mode 3: ladder (8 consecutive elements that have a standard atomic weight) ---- */
 function ladderStart(){mode='ladder';score=0;right=0;placed={};sel=null;var st=ri(0,STD.length-8);order=STD.slice(st,st+8);ladderDraw()}
 function ladderDraw(fbMsg){var rows=order.map(function(x){var v=placed[x[0]];return'<button type="button" class="ma-row '+(v?'filled':'')+'" data-z="'+x[0]+'" '+(v?'disabled':'')+'><span class="ma-z">'+x[0]+'</span><span class="ma-s">'+x[1]+'</span><span class="ma-n">'+x[2]+'</span><span class="ma-v">'+(v?m2(x):'?')+'</span></button>'}).join('');
  var chips=order.filter(function(x){return !placed[x[0]]}).map(function(x){return x[5]}).sort(function(a,b){return a-b});
  r.innerHTML='<div class="hud"><div><small>স্কোর</small><b>'+score+'</b></div><div><small>সঠিক</small><b>'+right+' / '+order.length+'</b></div><div><small>নির্বাচিত</small><b>'+(sel!=null?sel.toFixed(2):'—')+'</b></div></div><div class="card"><p class="bn">নিচ থেকে একটি ভর বেছে সঠিক মৌলের সারিতে ট্যাপ করো। পারমাণবিক সংখ্যা বাড়লে ভর সাধারণত বাড়ে।</p><div class="ma-ladder">'+rows+'</div><div class="pq-chips ma-chips">'+chips.map(function(v){return'<button type="button" class="pq-chip '+(sel===v?'sel':'')+'" data-m="'+v+'">'+v.toFixed(2)+'</button>'}).join('')+'</div><p class="ex" id="ma-fb">'+(fbMsg||'')+'</p><button class="btn" data-home>← ব্যাক মেনু</button></div>';
  r.onclick=function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-home'))return home();
   if(b.dataset.m){sel=+b.dataset.m;return ladderDraw()}
   if(b.dataset.z&&sel!=null){var x=byZ[+b.dataset.z];if(Math.abs(x[5]-sel)<.001){placed[x[0]]=1;right++;score+=10;sel=null;if(right>=order.length){return A.done({score:score,pct:1,detail:order.length+'টি মৌলের ভর সঠিকভাবে সাজানো হয়েছে'})}ladderDraw('✔ '+x[1]+' = '+m2(x)+' u. '+(inversions[x[0]]||''))}else{score=Math.max(0,score-2);ladderDraw('✘ ঠিক হয়নি। পারমাণবিক সংখ্যা ও আগের-পরের মৌলের ভর মিলিয়ে দেখো।')}}}}
 home();
};
G.elementSprint=function(r,g,A){var E=A.E,items=[['H','Hydrogen',1],['He','Helium',2],['Li','Lithium',3],['Be','Beryllium',4],['B','Boron',5],['C','Carbon',6],['N','Nitrogen',7],['O','Oxygen',8],['F','Fluorine',9],['Ne','Neon',10],['Na','Sodium',11],['Mg','Magnesium',12],['Al','Aluminium',13],['Si','Silicon',14],['P','Phosphorus',15],['S','Sulfur',16],['Cl','Chlorine',17],['Ar','Argon',18]],qs=[],score=0,right=0,i=0,lock=false;items.forEach(function(x){qs.push({q:'কোন মৌলের পারমাণবিক সংখ্যা '+x[2]+'?',o:[x[0]+' — '+x[1],items[(x[2]+4)%items.length][0]+' — '+items[(x[2]+4)%items.length][1],items[(x[2]+9)%items.length][0]+' — '+items[(x[2]+9)%items.length][1],items[(x[2]+13)%items.length][0]+' — '+items[(x[2]+13)%items.length][1]],a:0,e:x[0]+' ('+x[1]+')-এর পারমাণবিক সংখ্যা '+x[2]+'.'})});qs=sh(qs).slice(0,10);function show(){if(i>=qs.length)return A.done({score:score,pct:right/qs.length,detail:right+' / '+qs.length+' সঠিক উত্তর'});var q=qs[i],opts=sh(q.o.map(function(t,j){return{t:t,ok:j===q.a}}));r.innerHTML=hud([['স্কোর','sc',score],['রাউন্ড','rd',(i+1)+' / '+qs.length],['সঠিক','rr',right]])+'<div class="card"><p class="bn qt">'+E(q.q)+'</p><div class="pq-options">'+opts.map(function(o){return'<button class="btn" data-ok="'+(o.ok?1:0)+'">'+E(o.t)+'</button>'}).join('')+'</div><p class="ex" id="es-ex"></p><button class="btn pri" data-next hidden>পরের প্রশ্ন →</button></div>';lock=false;r.onclick=function(e){var b=e.target.closest('button');if(!b||lock)return;if(b.hasAttribute('data-next')){i++;return show()}if(b.dataset.ok!=null){lock=true;if(b.dataset.ok==='1'){score+=10;right++}r.querySelectorAll('[data-ok]').forEach(function(x){x.disabled=true;x.classList.add(x.dataset.ok==='1'?'okb':(x===b?'nob':'dim'))});r.querySelector('#es-ex').textContent=(b.dataset.ok==='1'?'✔ সঠিক। ':'✘ ')+q.e;r.querySelector('[data-next]').hidden=false}}}show()};


/* ================= Element Sprint =================
   Dedicated registry entry used by the Arcade config. */
G.elementSprint=function(r,g,A){
 var E=A.E,score=0,right=0,round=0,finished=false;
 var elements=[
  {n:1,s:'H',name:'Hydrogen'},{n:2,s:'He',name:'Helium'},{n:3,s:'Li',name:'Lithium'},
  {n:6,s:'C',name:'Carbon'},{n:7,s:'N',name:'Nitrogen'},{n:8,s:'O',name:'Oxygen'},
  {n:11,s:'Na',name:'Sodium'},{n:12,s:'Mg',name:'Magnesium'},{n:13,s:'Al',name:'Aluminium'},
  {n:14,s:'Si',name:'Silicon'},{n:16,s:'S',name:'Sulfur'},{n:17,s:'Cl',name:'Chlorine'},
  {n:19,s:'K',name:'Potassium'},{n:20,s:'Ca',name:'Calcium'},{n:26,s:'Fe',name:'Iron'},
  {n:29,s:'Cu',name:'Copper'},{n:30,s:'Zn',name:'Zinc'},{n:47,s:'Ag',name:'Silver'},
  {n:53,s:'I',name:'Iodine'},{n:79,s:'Au',name:'Gold'}
 ];
 function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
 var questions=shuffle(elements.slice()).slice(0,10).map(function(el,i){
  var mode=i%3,correct=mode===0?el.s:mode===1?el.name:String(el.n);
  var others=shuffle(elements.filter(function(x){return x.n!==el.n}).slice()).slice(0,3).map(function(x){return mode===0?x.s:mode===1?x.name:String(x.n)});
  return {el:el,mode:mode,correct:correct,opts:shuffle(others.concat([correct]))};
 });
 function show(){
  if(round>=questions.length){finished=true;A.done({score:score,pct:right/questions.length,detail:right+' / '+questions.length+' সঠিক উত্তর'});return}
  var q=questions[round],prompt=q.mode===0?'পারমাণবিক সংখ্যা '+q.el.n+' কোন মৌলের?':q.mode===1?q.el.s+' কোন মৌলের প্রতীক?':q.el.name+'-এর পারমাণবিক সংখ্যা কত?';
  r.innerHTML='<div class="hud"><div><small>স্কোর</small><b>'+score+'</b></div><div><small>সঠিক</small><b>'+right+' / '+questions.length+'</b></div><div><small>প্রশ্ন</small><b>'+(round+1)+' / '+questions.length+'</b></div></div><div class="card"><h2 class="bn">⚡ Element Sprint</h2><p class="bn">'+E(prompt)+'</p><div class="gA g2" style="margin-top:14px">'+q.opts.map(function(o){return '<button class="btn" data-answer="'+E(o)+'">'+E(o)+'</button>'}).join('')+'</div><p class="ex" id="es-feedback" aria-live="polite"></p><button class="btn" data-next hidden>পরের প্রশ্ন →</button><p class="mutt">প্রতীক, নাম ও পারমাণবিক সংখ্যা মিলিয়ে দ্রুত অনুশীলন করো।</p></div>';
  r.onclick=function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-answer')){if(r.dataset.answered==='1')return;r.dataset.answered='1';var good=b.dataset.answer===q.correct; if(good){right++;score+=10;A.confetti&&A.confetti()}Array.prototype.forEach.call(r.querySelectorAll('[data-answer]'),function(x){x.disabled=true;if(x.dataset.answer===q.correct)x.classList.add('pri')});var fb=r.querySelector('#es-feedback');if(fb)fb.textContent=good?'✔ সঠিক! '+q.el.name+' ('+q.el.s+') — পারমাণবিক সংখ্যা '+q.el.n+'.':'সঠিক উত্তর: '+q.correct+'. '+q.el.name+'-এর পারমাণবিক সংখ্যা '+q.el.n+'.';var nx=r.querySelector('[data-next]');if(nx)nx.hidden=false}else if(b.hasAttribute('data-next')){round++;delete r.dataset.answered;show()}};
 }
 show();
};

/* ================= Trend Duel: explicit per-button handlers prevent stale/delegated clicks ================= */
G.trendDuel=function(r,g,A){
 var E=A.E,qs=[
 {q:'একই পর্যায়ে Na ও Cl-এর মধ্যে কার পারমাণবিক আকার বড়?',o:['Na','Cl','সমান','তথ্য যথেষ্ট নয়'],a:0,e:'একই পর্যায়ে সাধারণত বাম থেকে ডানে কার্যকর নিউক্লিয়ার চার্জ বাড়ে, তাই পারমাণবিক আকার কমে।'},
 {q:'একই গ্রুপে Li ও K-এর মধ্যে কার পারমাণবিক আকার বড়?',o:['Li','K','সমান','দুটিই শূন্য'],a:1,e:'গ্রুপে নিচে নামলে নতুন শক্তিস্তর যুক্ত হয় এবং পারমাণবিক আকার বাড়ে।'},
 {q:'Be ও B-এর মধ্যে কার প্রথম আয়নীকরণ শক্তি বেশি?',o:['Be','B','সমান','কোনোটির নয়'],a:0,e:'Be-এর 2s উপস্তর পূর্ণ; B থেকে 2p ইলেকট্রন সরানো তুলনামূলক সহজ।'},
 {q:'N ও O-এর মধ্যে কার প্রথম আয়নীকরণ শক্তি বেশি?',o:['N','O','সমান','সবসময় O'],a:0,e:'N-এর অর্ধপূর্ণ 2p³ বিন্যাস স্থিতিশীল; O-তে জোড়া ইলেকট্রনের বিকর্ষণ থাকে।'},
 {q:'একই পর্যায়ে সাধারণত ধাতব ধর্ম কোন দিকে বাড়ে?',o:['ডান দিকে','বাম দিকে','শুধু মাঝখানে','পরিবর্তন হয় না'],a:1,e:'পর্যায়ে বামদিকে ইলেকট্রন ত্যাগ করা তুলনামূলক সহজ, তাই ধাতব ধর্ম সাধারণত বেশি।'},
 {q:'একই গ্রুপে সাধারণত তড়িৎঋণাত্মকতা নিচে নামলে কী হয়?',o:['বাড়ে','কমে','সবসময় সমান','শূন্য হয়'],a:1,e:'পরমাণুর আকার ও শিল্ডিং বাড়ায় বন্ধন-ইলেকট্রনের ওপর আকর্ষণ সাধারণত কমে।'},
 {q:'গলনাঙ্কের জন্য কোন বক্তব্যটি ঠিক?',o:['সব মৌলে ডানদিকে বাড়ে','সব মৌলে নিচে বাড়ে','বন্ধন ও গঠনের ওপর নির্ভর করে','সব মৌলে সমান'],a:2,e:'গলনাঙ্কের একটিমাত্র সর্বজনীন প্রবণতা নেই; গঠন ও বন্ধনের ধরন গুরুত্বপূর্ণ।'},
 {q:'একটি পরমাণু ইলেকট্রন হারালে কী তৈরি হয়?',o:['ধনায়ন','ঋণায়ন','নিউট্রন','সমস্থানিক'],a:0,e:'ইলেকট্রন হারালে প্রোটনের সংখ্যা ইলেকট্রনের চেয়ে বেশি হয়, ফলে ধনায়ন তৈরি হয়।'}
 ];
 function shuffle(a){return sh(a)} qs=shuffle(qs.slice());var i=0,score=0,right=0,answered=false,locked=false;
 function show(){
  if(i>=qs.length){A.done({score:score,pct:right/qs.length,detail:right+' / '+qs.length+' সঠিক উত্তর'});return}
  var q=qs[i],opts=shuffle(q.o.map(function(t,j){return{t:t,ok:j===q.a}}));answered=false;locked=false;
  r.innerHTML=hud([['স্কোর','td-score',score],['ডুয়েল','td-round',(i+1)+' / '+qs.length],['সঠিক','td-right',right]])+'<div class="card trend-duel-card"><div class="td-kicker">PERIODIC TRENDS · ROUND '+(i+1)+'</div><p class="bn qt">⚔️ '+E(q.q)+'</p><div class="pq-options">'+opts.map(function(o,j){return'<button type="button" class="btn td-option" data-answer="'+(o.ok?'1':'0')+'"><span class="td-letter">'+String.fromCharCode(65+j)+'</span><span>'+E(o.t)+'</span></button>'}).join('')+'</div><p class="ex" id="td-ex" aria-live="polite"></p><div class="td-actions"><button type="button" class="btn pri td-next" data-next disabled>আগে উত্তর নির্বাচন করুন</button><a class="btn" href="#/play">← ব্যাক মেনু</a></div><p class="mutt td-tip">উত্তর বেছে নাও; ব্যাখ্যাটি পড়ে পরের ডুয়েলে যাও।</p></div>';
  Array.prototype.forEach.call(r.querySelectorAll('[data-answer]'),function(b){b.addEventListener('click',function(){if(locked)return;locked=true;answered=true;var ok=b.dataset.answer==='1';if(ok){score+=10;right++}Array.prototype.forEach.call(r.querySelectorAll('[data-answer]'),function(x){x.disabled=true;if(x.dataset.answer==='1')x.classList.add('okb');else if(x===b)x.classList.add('nob');else x.classList.add('dim')});var ex=r.querySelector('#td-ex');if(ex)ex.textContent=(ok?'✔ সঠিক উত্তর! ':'✘ সঠিক উত্তর: '+q.o[q.a]+'। ')+q.e;var nx=r.querySelector('[data-next]');if(nx){nx.disabled=false;nx.textContent=i===qs.length-1?'ফলাফল দেখুন →':'পরের ডুয়েল →';nx.addEventListener('click',function(){if(!answered)return;i++;show()},{once:true})}})});
 }
 show();
};

/* ================= Odd One Out ================= */
G.oddOne=function(r,g,A){var X=A.X,E=A.E,sets=((g.data||{}).sets||[]).filter(function(s){return s&&Array.isArray(s.i)&&s.i.filter(Boolean).length>=3&&s.i[+s.odd]!=null&&String(s.i[+s.odd]).trim()!==''});
 if(sets.length<2)return empty(r,'Add at least 2 sets in the admin panel.');
 var list=sh(sets.slice()).slice(0,8),i=0,score=0,combo=0,right=0,lock=false,over=false,missed=[];
 r.innerHTML=hud([[X('g_score'),'sc',0],[X('g_combo'),'cb','x1'],['Round','pg','']])+'<div class="card" id="oc"></div>';
 function h(){qa(r,'#sc').textContent=score;qa(r,'#cb').textContent='x'+Math.min(4,1+Math.floor(combo/2));qa(r,'#pg').textContent=Math.min(i+1,list.length)+' / '+list.length}
 function show(){lock=false;var s=list[i],opts=sh(s.i.map(function(t,k){return{t:t,k:k}}).filter(function(o){return o.t!=null&&String(o.t).trim()!==''}));
  qa(r,'#oc').innerHTML='<p class="bn qt">'+E(s.q||'কোনটি অন্যগুলোর মতো নয়?')+'</p><div class="odd-grid">'+opts.map(function(o){return'<button class="opt" data-k="'+o.k+'">'+E(o.t)+'</button>'}).join('')+'</div><p class="ex" id="ex" aria-live="polite"></p><div id="nx"></div>';h()}
 function pick(b){if(lock||over)return;lock=true;var s=list[i],k=+b.dataset.k,odd=+s.odd,ok=k===odd;
  qq(r,'.opt').forEach(function(o){if(+o.dataset.k===odd)o.classList.add('ok');else if(o===b)o.classList.add('no');else o.classList.add('dim')});
  if(ok){combo++;score+=10*Math.min(4,1+Math.floor(combo/2));right++}else{combo=0;if(missed.length<12)missed.push({q:(s.q||'অন্যরকমটি কোনটি?')+' ('+s.i.filter(Boolean).join(', ')+')',a:s.i[odd],e:s.why||''})}
  qa(r,'#ex').textContent=(ok?'✔ ':'✘ সঠিক উত্তর: '+s.i[odd]+'। ')+(s.why||'');h();
  var last=i>=list.length-1;qa(r,'#nx').innerHTML='<button class="btn pri" id="nb">'+(last?'ফলাফল দেখুন →':E(X('g_next')))+'</button>';
  qa(r,'#nb').onclick=function(){if(last)return end();i++;show()}}
 function end(){if(over)return;over=true;A.done({score:score,pct:right/list.length,detail:right+' / '+list.length+' correct',review:missed})}
 r.onclick=function(e){var b=e.target.closest('.opt');if(b&&b.closest('#oc'))pick(b)};show()};

/* ================= Step Order ================= */
G.stepOrder=function(r,g,A){var X=A.X,E=A.E,puz=((g.data||{}).puzzles||[]).filter(function(p){return p&&Array.isArray(p.steps)&&p.steps.filter(function(s){return s&&String(s).trim()}).length>=3}).map(function(p){return{t:p.t||'ধাপগুলো সাজান',steps:p.steps.filter(function(s){return s&&String(s).trim()}),why:p.why||''}});
 if(puz.length<1)return empty(r,'Add at least 1 puzzle in the admin panel.');
 var list=sh(puz.slice()).slice(0,5),i=0,score=0,total=0,over=false,missed=[],mist=0,placed=0,order=[];
 r.innerHTML=hud([[X('g_score'),'sc',0],['Puzzle','pg',''],['ভুল চাল','ms',0]])+'<div class="card" id="sc2"></div>';
 function h(){qa(r,'#sc').textContent=score;qa(r,'#pg').textContent=Math.min(i+1,list.length)+' / '+list.length;qa(r,'#ms').textContent=mist}
 function show(){var p=list[i];mist=0;placed=0;order=sh(p.steps.map(function(t,k){return{t:t,k:k}}));
  qa(r,'#sc2').innerHTML='<p class="bn qt">'+E(p.t)+'</p><p class="mutt">ধাপগুলো সঠিক ক্রমে একটি একটি করে ট্যাপ করুন।</p><ol class="step-done" id="sd"></ol><div class="step-bank" id="sb">'+order.map(function(o){return'<button class="opt step-chip" data-k="'+o.k+'">'+E(o.t)+'</button>'}).join('')+'</div><p class="ex" id="ex" aria-live="polite"></p><div id="nx"></div>';h()}
 function tap(b){if(over||b.disabled)return;var p=list[i],k=+b.dataset.k;
  if(k===placed){b.disabled=true;b.classList.add('ok');var li=document.createElement('li');li.textContent=p.steps[k];qa(r,'#sd').appendChild(li);b.remove();placed++;
   if(placed===p.steps.length){var frac=Math.max(0,1-.25*mist);total+=frac;score+=Math.max(5,Math.round(30*frac));if(mist>0&&missed.length<12)missed.push({q:p.t,a:p.steps.map(function(s,n){return(n+1)+') '+s}).join(' → '),e:p.why});
    qa(r,'#ex').textContent=(mist?'সম্পূর্ণ হয়েছে ('+mist+'টি ভুল চাল)। ':'✔ নিখুঁত! ')+(p.why||'');h();var last=i>=list.length-1;
    qa(r,'#nx').innerHTML='<button class="btn pri" id="nb">'+(last?'ফলাফল দেখুন →':E(X('g_next')))+'</button>';qa(r,'#nb').onclick=function(){if(last)return end();i++;show()}}
   else h()}
  else{mist++;b.classList.add('no');setTimeout(function(){b.classList.remove('no')},450);qa(r,'#ex').textContent='✘ এটি এখন নয়—আগে কোন ধাপটি হবে ভাবুন।';h()}}
 function end(){if(over)return;over=true;A.done({score:score,pct:total/list.length,detail:Math.round(total*10)/10+' / '+list.length+' puzzles solved cleanly',review:missed})}
 r.onclick=function(e){var b=e.target.closest('.step-chip');if(b)tap(b)};show()};


/* ================= Ion Detective: complete qualitative analysis game ================= */
G.ionDetective=function(r,g,A){
 r.classList.add('ion-game-root');
 var E=A.E,activeMode='home',notebookResumeLab=false,quizList=[],quizIndex=0,quizScore=0,quizRight=0,quizLock=false,quizOver=false,quizStart=0,quizSeconds=60,quizTimer=null,quizMissed=[],
     labList=[],labIndex=0,labScore=0,labPerfect=0,labTested={},labSelected={cation:'',anion:''},labAnswered=false,labMissed=[],labHint=false;
 function shuffle(a){return sh(a.slice())}
 var cases=[
  {id:'A-01',look:'নীল দ্রবণ',cation:'Cu²⁺',anion:'SO₄²⁻',why:'Cu²⁺-এর সঙ্গে NaOH দিলে নীল Cu(OH)₂ অধঃক্ষেপ হয়; অম্লীয় দ্রবণে BaCl₂ পরীক্ষায় SO₄²⁻ সাদা BaSO₄ দেয়।'},
  {id:'A-02',look:'ফ্যাকাশে সবুজ দ্রবণ',cation:'Fe²⁺',anion:'SO₄²⁻',why:'Fe²⁺-এর সঙ্গে NaOH দিলে প্রথমে সবুজ Fe(OH)₂ অধঃক্ষেপ হয়, যা বাতাসে ধীরে বাদামি হতে পারে; BaCl₂ পরীক্ষায় সালফেটের সাদা BaSO₄ তৈরি হয়।'},
  {id:'A-03',look:'হলুদাভ-বাদামি দ্রবণ',cation:'Fe³⁺',anion:'Cl⁻',why:'Fe³⁺-এর সঙ্গে NaOH দিলে লালচে-বাদামি Fe(OH)₃ অধঃক্ষেপ হয়; অম্লায়িত নমুনায় AgNO₃ দিলে সাদা AgCl তৈরি হয়।'},
  {id:'A-04',look:'বর্ণহীন দ্রবণ',cation:'Na⁺',anion:'Cl⁻',why:'Na⁺ তীব্র সোনালি-হলুদ শিখা দেয় এবং সাধারণত NaOH-এ অধঃক্ষেপ দেয় না; AgNO₃ পরীক্ষায় ক্লোরাইডের সাদা AgCl তৈরি হয়।'},
  {id:'A-05',look:'বর্ণহীন দ্রবণ',cation:'NH₄⁺',anion:'Cl⁻',why:'NaOH দিয়ে উষ্ণ করলে NH₄⁺ থেকে NH₃ গ্যাস বের হয়, যা সিক্ত লাল লিটমাসকে নীল করে; ক্লোরাইডের জন্য AgNO₃ সাদা AgCl দেয়।'},
  {id:'A-06',look:'বর্ণহীন দ্রবণ',cation:'K⁺',anion:'NO₃⁻',why:'K⁺ শিখা পরীক্ষায় হালকা বেগুনি রং দেয় (সোডিয়ামের হলুদ শিখা ঢেকে দিতে পারে); নাইট্রেটের উপযুক্ত নিশ্চিতকরণ পরীক্ষায় ব্রাউন-রিং দেখা যায়।'},
  {id:'A-07',look:'বর্ণহীন দ্রবণ',cation:'Ba²⁺',anion:'Cl⁻',why:'Ba²⁺ আপেল-সবুজ শিখা দেয়; অম্লায়িত নমুনায় AgNO₃ দিলে ক্লোরাইডের সাদা AgCl তৈরি হয়।'},
  {id:'A-08',look:'বর্ণহীন দ্রবণ',cation:'Li⁺',anion:'Br⁻',why:'Li⁺ গাঢ় লাল/ক্রিমসন শিখা দেয়; অম্লায়িত নমুনায় AgNO₃ দিলে ব্রোমাইডের ক্রিম রঙের AgBr অধঃক্ষেপ হয়।'},
  {id:'A-09',look:'বর্ণহীন দ্রবণ',cation:'Na⁺',anion:'CO₃²⁻',why:'Na⁺ সোনালি-হলুদ শিখা দেয়; কার্বনেটের সঙ্গে dilute acid যোগ করলে CO₂-এর বুদ্‌বুদ তৈরি হয় এবং চুনপানি ঘোলা করে।'},
  {id:'A-10',look:'বর্ণহীন দ্রবণ',cation:'K⁺',anion:'Br⁻',why:'K⁺-এর শিখা হালকা বেগুনি; ব্রোমাইডে অম্লায়িত নমুনার AgNO₃ পরীক্ষা ক্রিম রঙের AgBr অধঃক্ষেপ দেয়।'},
  {id:'A-11',look:'বর্ণহীন দ্রবণ',cation:'Na⁺',anion:'SO₄²⁻',why:'Na⁺ সোনালি-হলুদ শিখা দেয়; অম্লীয় মাধ্যমে BaCl₂ দিলে সাদা, অদ্রবণীয় BaSO₄ অধঃক্ষেপ সালফেট নির্দেশ করে।'},
  {id:'A-12',look:'বর্ণহীন দ্রবণ',cation:'NH₄⁺',anion:'NO₃⁻',why:'NaOH দিয়ে উষ্ণ করলে NH₃ গ্যাস নির্গত হয়; নাইট্রেটের উপযুক্ত নিশ্চিতকরণ পরীক্ষায় ব্রাউন-রিং দেখা যায়।'},
  {id:'A-13',look:'বর্ণহীন দ্রবণ',cation:'K⁺',anion:'I⁻',why:'K⁺ হালকা বেগুনি শিখা দিতে পারে; অম্লায়িত নমুনায় AgNO₃ দিলে I⁻ হলুদ AgI অধঃক্ষেপ তৈরি করে।'},
  {id:'A-14',look:'বর্ণহীন দ্রবণ',cation:'Al³⁺',anion:'Cl⁻',why:'Al³⁺-এর সঙ্গে NaOH দিলে সাদা জেলির মতো Al(OH)₃ অধঃক্ষেপ হয়; অতিরিক্ত NaOH-এ এটি দ্রবীভূত হতে পারে। ক্লোরাইডের জন্য AgNO₃-এ সাদা AgCl হয়।'},
  {id:'A-15',look:'বর্ণহীন দ্রবণ',cation:'Mg²⁺',anion:'SO₄²⁻',why:'Mg²⁺-এর সঙ্গে NaOH দিলে সাদা Mg(OH)₂ অধঃক্ষেপ হয়; সালফেটের উপযুক্ত পরীক্ষায় অম্লীয় মাধ্যমে BaCl₂ সাদা BaSO₄ দেয়।'},
  {id:'A-16',look:'বর্ণহীন দ্রবণ',cation:'Ca²⁺',anion:'Cl⁻',why:'Ca²⁺ শিখা পরীক্ষায় ইট-লাল/কমলা-লাল রং দিতে পারে। ক্লোরাইডের জন্য উপযুক্তভাবে অম্লায়িত নমুনায় AgNO₃ সাদা AgCl দেয়।'}
 ];
 var cations=['Na⁺','K⁺','Li⁺','Cu²⁺','Fe²⁺','Fe³⁺','NH₄⁺','Ba²⁺','Al³⁺','Mg²⁺','Ca²⁺'];
 var anions=['Cl⁻','Br⁻','I⁻','SO₄²⁻','CO₃²⁻','NO₃⁻'];
 var tests=[
  {id:'naoh',icon:'🧴',name:'NaOH পরীক্ষা',short:'NaOH',sub:'যোগ করলে অধঃক্ষেপের রং বা গ্যাস নির্গমন লক্ষ করো',how:'এই ভার্চুয়াল মডেলে NaOH যোগ করার পর অবক্ষেপের রং, গ্যাসের ইঙ্গিত এবং প্রয়োজনে অতিরিক্ত বিকারকে দ্রবণীয়তার পরিবর্তন দেখানো হয়।',look:'নীল, সবুজ, বাদামি বা সাদা অধঃক্ষেপ; NH₄⁺ হলে NH₃-এর ইঙ্গিত।',why:'অবক্ষেপের রং/দ্রাব্যতা দেখুন। NH₄⁺ থাকলে NaOH দিয়ে উষ্ণ করার পরে NH₃ শনাক্তকরণ জরুরি।'},
  {id:'flame',icon:'🔥',name:'শিখা পরীক্ষা',short:'শিখা',sub:'শিখার রং থেকে ধাতব আয়নের ইঙ্গিত',how:'ভার্চুয়াল শিখার রং পর্যবেক্ষণ করো। সব আয়ন স্পষ্ট রং দেয় না এবং দূষণ/মিশ্রণ ফলকে ঢেকে দিতে পারে।',look:'Na⁺ হলুদ, K⁺ হালকা বেগুনি, Li⁺ ক্রিমসন, Ba²⁺ আপেল-সবুজ, Cu²⁺ নীলাভ-সবুজ।',why:'Na⁺ হলুদ, K⁺ হালকা বেগুনি, Li⁺ গাঢ় লাল, Ba²⁺ আপেল-সবুজ ও Cu²⁺ নীলাভ-সবুজ শিখা দিতে পারে।'},
  {id:'agno3',icon:'⚗️',name:'AgNO₃ পরীক্ষা',short:'AgNO₃',sub:'সাদা/ক্রিম/হলুদ অধঃক্ষেপ তুলনা',how:'হ্যালাইডের ফল বোঝাতে নমুনা যথাযথভাবে অম্লায়িত—সাধারণত dilute HNO₃ মডেলে—ধরা হয়েছে; HCl ব্যবহার করলে অতিরিক্ত Cl⁻ ফল নষ্ট করতে পারে।',look:'Cl⁻ সাদা AgCl, Br⁻ ক্রিম AgBr, I⁻ হলুদ AgI।',why:'হ্যালাইড পরীক্ষায় নমুনা dilute HNO₃ দিয়ে অম্লায়িত করা হয়; HCl ব্যবহার করলে অতিরিক্ত Cl⁻ ঢুকে ফল ভুল হতে পারে।'},
  {id:'sulfate',icon:'🧪',name:'BaCl₂ পরীক্ষা',short:'BaCl₂',sub:'স্থায়ী সাদা BaSO₄ অধঃক্ষেপ দেখো',how:'উপযুক্ত অম্লীয় মাধ্যমে BaCl₂ যোগ করার ফল ভার্চুয়ালি দেখানো হয়; অম্লায়ন কিছু বিঘ্নকারী আয়নের প্রভাব কমায়।',look:'SO₄²⁻ থাকলে ঘন সাদা BaSO₄ অধঃক্ষেপ।',why:'নমুনাকে উপযুক্তভাবে অম্লায়িত করে BaCl₂ যোগ করলে SO₄²⁻ সাদা BaSO₄ অধঃক্ষেপ দিতে পারে।'},
  {id:'acid',icon:'🫧',name:'পাতলা অ্যাসিড পরীক্ষা',short:'Dilute acid',sub:'বুদ্‌বুদ ও CO₂-এর প্রমাণ খোঁজো',how:'কার্বনেটের সঙ্গে অ্যাসিডের ভার্চুয়াল বিক্রিয়া দেখো; গ্যাসের বুদ্‌বুদ এবং চুনপানির ঘোলা হওয়া হলো প্রাসঙ্গিক লক্ষণ।',look:'CO₃²⁻ থাকলে CO₂ নির্গমন; চুনপানি ঘোলা হয়।',why:'কার্বনেটের সঙ্গে পাতলা অ্যাসিডে CO₂ বুদ্‌বুদ হয়; গ্যাসটি চুনপানিকে ঘোলা করে।'},
  {id:'nitrate',icon:'🟤',name:'নাইট্রেট নিশ্চিতকরণ',short:'NO₃⁻',sub:'ব্রাউন-রিং ফলের অর্থ বুঝো',how:'এটি nitrate confirmatory test-এর ধারণাগত ফল; সংযোগস্থলে বাদামি ring দেখানো হলে সেটিকে পরীক্ষার অন্যান্য শর্তসহ ব্যাখ্যা করতে হয়।',look:'ধারণাগত মডেলে সংযোগস্থলে বাদামি ring।',why:'নাইট্রেটের নির্দিষ্ট নিশ্চিতকরণ পরীক্ষার ফল হিসেবে এখানে brown-ring পর্যবেক্ষণ শেখানো হয়। এটি ভার্চুয়াল মডেল।'}
 ];
 function cationResult(id,ion){
  if(id==='naoh'){
   if(ion==='Cu²⁺')return{obs:'নীল অধঃক্ষেপ তৈরি হলো।',eq:'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓',tag:'অধঃক্ষেপ',tone:'blue'};
   if(ion==='Fe²⁺')return{obs:'প্রথমে ময়লা-সবুজ অধঃক্ষেপ; কিছুক্ষণ বাতাসে থাকলে বাদামি হতে পারে।',eq:'Fe²⁺ + 2OH⁻ → Fe(OH)₂↓',tag:'অধঃক্ষেপ',tone:'green'};
   if(ion==='Fe³⁺')return{obs:'লালচে-বাদামি অধঃক্ষেপ তৈরি হলো।',eq:'Fe³⁺ + 3OH⁻ → Fe(OH)₃↓',tag:'অধঃক্ষেপ',tone:'brown'};
   if(ion==='Al³⁺')return{obs:'সাদা, জেলির মতো Al(OH)₃ অধঃক্ষেপ তৈরি হতে পারে; অতিরিক্ত NaOH-এ এটি দ্রবীভূত হয়—এই দ্বিতীয় পর্যবেক্ষণটি গুরুত্বপূর্ণ।',eq:'Al³⁺ + 3OH⁻ → Al(OH)₃↓',tag:'সাদা অধঃক্ষেপ',tone:'white'};
   if(ion==='Mg²⁺')return{obs:'সাদা Mg(OH)₂ অধঃক্ষেপ তৈরি হলো; এটি অতিরিক্ত NaOH-এ সাধারণত Al(OH)₃-এর মতো দ্রবীভূত হয় না।',eq:'Mg²⁺ + 2OH⁻ → Mg(OH)₂↓',tag:'সাদা অধঃক্ষেপ',tone:'white'};
   if(ion==='Ca²⁺')return{obs:'পরীক্ষার ঘনত্ব ও শর্ত অনুযায়ী সাদা/খুব সামান্য অধঃক্ষেপ দেখা যেতে পারে; একে একা নিশ্চিত প্রমাণ ধরো না।',eq:'Ca²⁺ + 2OH⁻ ⇌ Ca(OH)₂(s)',tag:'সতর্ক পর্যবেক্ষণ',tone:'neutral'};
   if(ion==='NH₄⁺')return{obs:'সাধারণ অধঃক্ষেপ নেই; NaOH দিয়ে উষ্ণ করলে NH₃ গ্যাস পাওয়া যেতে পারে, যা সিক্ত লাল লিটমাস নীল করে।',eq:'NH₄⁺ + OH⁻ → NH₃↑ + H₂O',tag:'গ্যাস',tone:'gas'};
   return{obs:'এই পরিস্থিতিতে উল্লেখযোগ্য রঙিন অধঃক্ষেপ দেখা গেল না। শুধু এই ফল থেকে আয়ন নিশ্চিত করা যায় না।',eq:'—',tag:'অধঃক্ষেপ নেই',tone:'neutral'};
  }
  if(id==='flame'){
   var flame={'Na⁺':['তীব্র সোনালি-হলুদ শিখা।','Na⁺-এর বৈশিষ্ট্যপূর্ণ শিখার রং হলুদ।','gold'],'K⁺':['হালকা বেগুনি শিখা; সোডিয়ামের হলুদ রং ঢেকে দিতে পারে।','K⁺-এর শিখার রং হালকা বেগুনি; প্রয়োজনে উপযুক্ত filter দিয়ে দেখা হয়।','lilac'],'Li⁺':['গাঢ় লাল/ক্রিমসন শিখা।','Li⁺-এর শিখার রং ক্রিমসন লাল।','red'],'Ba²⁺':['আপেল-সবুজ শিখা।','Ba²⁺-এর বৈশিষ্ট্যপূর্ণ শিখা আপেল-সবুজ।','green'],'Cu²⁺':['নীলাভ-সবুজ শিখা।','Cu²⁺-যুক্ত লবণ নীলাভ-সবুজ শিখা দিতে পারে।','bluegreen'],'Ca²⁺':['ইট-লাল/কমলা-লাল শিখা দেখা যেতে পারে।','Ca²⁺-এর শিখা ইট-লাল; শর্ত ও অন্যান্য আয়নে রং অস্পষ্ট হতে পারে।','red']};
   if(flame[ion])return{obs:flame[ion][0],eq:flame[ion][1],tag:'শিখার রং',tone:flame[ion][2]};
   return{obs:'এই নমুনায় এই পরীক্ষায় নির্ভরযোগ্য বৈশিষ্ট্যপূর্ণ শিখার রং পাওয়া যায়নি। অন্য পরীক্ষা বেছে নিন।',eq:'শিখা পরীক্ষা সব ধনায়নের জন্য কার্যকর নয়।',tag:'সীমাবদ্ধতা',tone:'neutral'};
  }
  return{obs:'এই পরীক্ষা ধনায়নের জন্য নয়; এটি ঋণায়ন/নির্দিষ্ট গ্যাস শনাক্তকরণের সহায়ক পরীক্ষা।',eq:'—',tag:'অন্য পরীক্ষা',tone:'neutral'};
 }
 function anionResult(id,ion){
  if(id==='agno3'){
   if(ion==='Cl⁻')return{obs:'সাদা, দইয়ের মতো AgCl অধঃক্ষেপ তৈরি হলো।',eq:'Ag⁺ + Cl⁻ → AgCl↓',tag:'সাদা অধঃক্ষেপ',tone:'white'};
   if(ion==='Br⁻')return{obs:'ক্রিম রঙের AgBr অধঃক্ষেপ তৈরি হলো।',eq:'Ag⁺ + Br⁻ → AgBr↓',tag:'ক্রিম অধঃক্ষেপ',tone:'cream'};
   if(ion==='I⁻')return{obs:'হলুদ AgI অধঃক্ষেপ তৈরি হলো।',eq:'Ag⁺ + I⁻ → AgI↓',tag:'হলুদ অধঃক্ষেপ',tone:'yellow'};
   return{obs:'হ্যালাইডের জন্য প্রত্যাশিত বৈশিষ্ট্যপূর্ণ অধঃক্ষেপ দেখা গেল না। একে একা চূড়ান্ত প্রমাণ ধরে নেবেন না।',eq:'—',tag:'নির্ণায়ক ফল নেই',tone:'neutral'};
  }
  if(id==='sulfate'){
   if(ion==='SO₄²⁻')return{obs:'ঘন সাদা BaSO₄ অধঃক্ষেপ তৈরি হলো, যা উপযুক্ত অম্লীয় মাধ্যমে অদ্রবণীয় থাকে।',eq:'Ba²⁺ + SO₄²⁻ → BaSO₄↓',tag:'সাদা অধঃক্ষেপ',tone:'white'};
   return{obs:'এই মডেলে সালফেটের বৈশিষ্ট্যপূর্ণ স্থায়ী সাদা BaSO₄ অধঃক্ষেপ দেখা গেল না।',eq:'—',tag:'সালফেটের প্রমাণ নেই',tone:'neutral'};
  }
  if(id==='acid'){
   if(ion==='CO₃²⁻')return{obs:'বুদ্‌বুদসহ CO₂ নির্গত হচ্ছে; গ্যাস চুনপানিকে ঘোলা করে।',eq:'CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O',tag:'গ্যাস নির্গমন',tone:'gas'};
   return{obs:'কার্বনেটের মতো স্পষ্ট effervescence বা CO₂-এর ফল দেখা গেল না।',eq:'—',tag:'বুদ্‌বুদ নেই',tone:'neutral'};
  }
  if(id==='nitrate'){
   if(ion==='NO₃⁻')return{obs:'নাইট্রেটের নিশ্চিতকরণ পরীক্ষার মডেলে সংযোগস্থলে বাদামি ring দেখা গেল।',eq:'নির্দিষ্ট nitrate confirmatory test (ধারণাগত ফল)',tag:'Brown ring',tone:'brown'};
   return{obs:'এই পরীক্ষার মডেলে বাদামি ring দেখা গেল না। একাধিক পরীক্ষার ফল মিলিয়ে নিন।',eq:'—',tag:'নির্ণায়ক ফল নেই',tone:'neutral'};
  }
  return{obs:'এই পরীক্ষা এই আয়নের জন্য সরাসরি নিশ্চিতকরণ পরীক্ষা নয়।',eq:'—',tag:'অন্য পরীক্ষা',tone:'neutral'};
 }
 function testResult(testId,sample){if(testId==='naoh'||testId==='flame')return cationResult(testId,sample.cation);return anionResult(testId,sample.anion)}
 function scrollGameToTop(){var doc=document.documentElement,old=doc.style.scrollBehavior;doc.style.scrollBehavior='auto';var header=document.querySelector('header'),hh=header?header.getBoundingClientRect().height:0,top=window.pageYOffset+r.getBoundingClientRect().top-hh-8;window.scrollTo(0,Math.max(0,top));requestAnimationFrame(function(){doc.style.scrollBehavior=old;});}
 function restoreGameScroll(y){var doc=document.documentElement,old=doc.style.scrollBehavior;doc.style.scrollBehavior='auto';window.scrollTo(0,y);requestAnimationFrame(function(){window.scrollTo(0,y);requestAnimationFrame(function(){window.scrollTo(0,y);doc.style.scrollBehavior=old;});});}
 function liveResultCard(){var ids=Object.keys(labTested);if(!ids.length)return '<section class="ion-simulation-guide"><b>🧭 পরীক্ষা কীভাবে বুঝবে?</b><div class="ion-guide-steps"><span>১ · বিকারক বেছে নাও</span><i>→</i><span>২ · রং/গ্যাস লক্ষ্য করো</span><i>→</i><span>৩ · ফল মিলিয়ে আয়ন বাছো</span></div><p>শুধু রং দেখে অনুমান নয়—পর্যবেক্ষণ, বিক্রিয়ার সমীকরণ ও দ্বিতীয় নিশ্চিতকরণ পরীক্ষা মিলিয়ে সিদ্ধান্ত নাও।</p></section>';
  var id=ids[ids.length-1],z=labTested[id],t=tests.filter(function(x){return x.id===id})[0],meaning={naoh:'এটি মূলত ধনায়ন সম্পর্কে ইঙ্গিত দেয়। অধঃক্ষেপের রং, গ্যাসের প্রমাণ এবং দ্রাব্যতার পরিবর্তন একসঙ্গে বিবেচনা করো।',flame:'এটি ধাতব ধনায়নের একটি ইঙ্গিত মাত্র। অন্য পরীক্ষা দিয়ে নিশ্চিত করো; সোডিয়ামের হলুদ শিখা অন্য রং ঢেকে দিতে পারে।',agno3:'সাদা AgCl → Cl⁻, ক্রিম AgBr → Br⁻, হলুদ AgI → I⁻-এর পক্ষে প্রমাণ। নমুনার অম্লায়নের শর্ত গুরুত্বপূর্ণ।',sulfate:'উপযুক্ত অম্লীয় মাধ্যমে স্থায়ী সাদা BaSO₄ দেখা সালফেটের পক্ষে প্রমাণ; অন্য সম্ভাবনা বাদ দিতে শর্ত যাচাই করো।',acid:'বুদ্‌বুদে CO₂ হলে কার্বনেটের সম্ভাবনা থাকে; চুনপানি ঘোলা হওয়া অতিরিক্ত প্রমাণ।',nitrate:'বাদামি ring nitrate পরীক্ষার নির্দেশক ফল; মডেলটি ফলের ধারণা বোঝায়, বাস্তব পরীক্ষার সম্পূর্ণ ধাপ নয়.'}[id]||'একটি পর্যবেক্ষণকে অন্য উপযুক্ত নিশ্চিতকরণ পরীক্ষার সঙ্গে মিলিয়ে দেখো।';
  var visual=id==='flame'?'<div class="ion-reaction-visual flame-scene" aria-hidden="true"><span>🔥</span><small>শিখার রং</small></div>':id==='acid'?'<div class="ion-reaction-visual gas-scene" aria-hidden="true"><span class="gas-bubble b1"></span><span class="gas-bubble b2"></span><span class="gas-bubble b3"></span><small>গ্যাস/বুদ্‌বুদ</small></div>':id==='nitrate'?'<div class="ion-reaction-visual ring-scene" aria-hidden="true"><span>◉</span><small>Brown ring</small></div>':'<div class="ion-reaction-visual precip-scene tone-'+E(z.tone)+'" aria-hidden="true"><span class="mini-tube"><i></i></span><small>অধঃক্ষেপ/দ্রবণ</small></div>';
  return '<section class="ion-live-result"><div class="ion-live-head"><span class="ion-live-pulse">●</span><b>সিমুলেশনের ফল · '+E(t?t.name:'পরীক্ষা')+'</b><span class="ion-live-status">পর্যবেক্ষণ প্রস্তুত</span></div><div class="ion-live-body">'+visual+'<div class="ion-live-copy"><small>যা দেখা গেল</small><p>'+E(z.obs)+'</p><code>'+E(z.eq)+'</code><small class="ion-meaning-label">এটার অর্থ কী?</small><p class="ion-meaning">'+E(meaning)+'</p></div></div><div class="ion-live-sequence"><span>বিকারক/পরীক্ষা</span><i>→</i><span>পর্যবেক্ষণ</span><i>→</i><span>সিদ্ধান্তের প্রমাণ</span></div></section>';
 }
 function home(){if(quizTimer){clearInterval(quizTimer);quizTimer=null}activeMode='home';r.innerHTML='<div class="ion-game-shell"><div class="ion-home-nav"><a class="ion-exit-link" href="#/play">← সব গেমে ফিরুন</a><span>ION DETECTIVE · CHEMISTRY LAB</span></div><div class="ion-hero"><div class="ion-hero-icon">🧪</div><div><div class="ion-eyebrow">CONCEPTLAB · CHEMISTRY LAB</div><h2>Ion Detective <span>আয়ন শনাক্তকরণ</span></h2><p>পরীক্ষা চালাও, পর্যবেক্ষণ নাও, প্রমাণ মিলিয়ে আয়ন শনাক্ত করো।</p></div></div><div class="ion-mode-grid">'+[
  ['lab','🧫','অজানা নমুনা','নিজে পরীক্ষা বেছে ধনায়ন ও ঋণায়ন শনাক্ত করো।','প্রধান ল্যাব'],
  ['flame','🔥','শিখা পরীক্ষা','শিখার রং থেকে নির্দিষ্ট ধাতব আয়ন চিনে নাও।','৬টি প্রশ্ন'],
  ['precip','🧪','অধঃক্ষেপের ধাঁধা','রং, দ্রাব্যতা ও বিকারকের ফল মিলিয়ে উত্তর দাও।','৮টি প্রশ্ন'],
  ['anion','🫧','ঋণায়ন অনুসন্ধান','Cl⁻, Br⁻, SO₄²⁻, CO₃²⁻ ও NO₃⁻ শনাক্তকরণ।','৮টি প্রশ্ন'],
  ['admission','⚔️','Admission Battle','সময়ের মধ্যে মিশ্র MCQ ও নিশ্চিতকরণ পরীক্ষা।','৬০ সেকেন্ড'],
  ['notebook','📓','Reaction Notebook','পরীক্ষার ফল, আয়নিক সমীকরণ ও সিদ্ধান্ত ঝালিয়ে নাও।','দ্রুত রিভিশন']
 ].map(function(m){return'<button type="button" class="ion-mode-card" data-mode="'+m[0]+'"><span class="ion-mode-icon">'+m[1]+'</span><span class="ion-mode-copy"><b>'+E(m[2])+'</b><small>'+E(m[3])+'</small><em>'+E(m[4])+'</em></span><span class="ion-mode-go">→</span></button>'}).join('')+'</div><div class="ion-learning-strip"><b>🧠 Detective rule</b><span>একটি পরীক্ষার ফলেই সব সময় সিদ্ধান্ত নয়—একাধিক পর্যবেক্ষণ মিলিয়ে নাও।</span></div><p class="ion-safety-note">এটি একটি ভার্চুয়াল শিক্ষামূলক সিমুলেশন। বাস্তব রাসায়নিক পরীক্ষা কেবল উপযুক্ত ল্যাব ও প্রশিক্ষিত শিক্ষকের তত্ত্বাবধানে করা উচিত।</p></div>';scrollGameToTop();}
 function labStart(){activeMode='lab';labList=shuffle(cases).slice(0,5);labIndex=0;labScore=0;labPerfect=0;labMissed=[];labShow()}
 function labShow(preserve){var oldY=window.pageYOffset;activeMode='lab';if(quizTimer){clearInterval(quizTimer);quizTimer=null}if(labIndex>=labList.length){A.done({score:labScore,pct:Math.min(1,labScore/(labList.length*50)),detail:labPerfect+' / '+labList.length+' নমুনায় দুই আয়নই সঠিক',review:labMissed});return}if(!preserve){labTested={};labSelected={cation:'',anion:''};labAnswered=false;labHint=false}var sm=labList[labIndex];
  r.innerHTML='<div class="ion-topline"><button class="btn" data-ion-home>← Ion Detective</button><span class="ion-mode-pill">🧫 VIRTUAL LAB</span><span class="ion-round">নমুনা '+(labIndex+1)+' / '+labList.length+'</span></div><div class="ion-lab-hud"><div><small>এই সেশনের স্কোর</small><b>'+labScore+'</b></div><div><small>পরীক্ষা করা হয়েছে</small><b id="ionTestCount">'+Object.keys(labTested).length+' / '+tests.length+'</b></div><div><small>লক্ষ্য</small><b>২টি আয়ন</b></div></div><section class="ion-sample card"><div class="ion-sample-art"><div class="ion-tube"><i class="ion-liquid '+(sm.cation==='Cu²⁺'?'liquid-blue':sm.cation==='Fe²⁺'?'liquid-green':sm.cation==='Fe³⁺'?'liquid-amber':'liquid-clear')+'"></i></div><span>UNKNOWN<br> SAMPLE</span></div><div class="ion-sample-meta"><span class="ion-tag">নমুনা '+E(sm.id)+'</span><h3>অজানা লবণ</h3><p><b>প্রাথমিক পর্যবেক্ষণ:</b> '+E(sm.look)+'</p><p class="mutt">পরীক্ষার ফল সংগ্রহ করে নমুনার ধনায়ন ও ঋণায়ন নির্ণয় করো।</p><button class="btn sm" data-hint>💡 পরীক্ষা নির্বাচনের ইঙ্গিত</button><p id="ionHint" class="ion-hint" '+(labHint?'':'hidden')+'>ধনায়ন খুঁজতে NaOH/শিখা পরীক্ষা এবং ঋণায়ন খুঁজতে AgNO₃, BaCl₂ বা dilute acid-এর ফল তুলনা করো।</p></div></section><section class="ion-panel"><div class="ion-panel-head"><div><span class="ion-step">ধাপ ১ / STEP 01</span><h3>পরীক্ষা নির্বাচন করো</h3></div><span class="ion-muted">ফলাফল নিচে দেখুন ↓</span></div><p class="ion-step-hint" role="note"><b>কীভাবে চলবে:</b> নিচের যেকোনো পরীক্ষায় চাপ দিন। পরীক্ষার পর <b>“পরীক্ষার ফল”</b> এই অংশের নিচে দেখা যাবে—প্রয়োজনে নিচে স্ক্রল করুন। এরপর ধাপ ২-এ পর্যবেক্ষণ এবং ধাপ ৩-এ আয়ন নির্বাচন করুন।</p><div class="ion-test-grid">'+tests.map(function(t){var done=!!labTested[t.id];return'<button type="button" class="ion-test-btn '+(done?'is-done':'')+'" data-test="'+t.id+'" '+(done?'disabled':'')+'><span>'+t.icon+'</span><b>'+E(t.name)+'</b><small>'+E(t.sub)+'</small><em>'+(done?'✓ সম্পন্ন':'পরীক্ষা চালাও · ফল নিচে ↓')+'</em></button>'}).join('')+'</div></section>'+liveResultCard()+'<section class="ion-panel"><div class="ion-panel-head"><div><span class="ion-step">ধাপ ২ / STEP 02</span><h3>পর্যবেক্ষণ খাতা</h3></div><span class="ion-muted">'+Object.keys(labTested).length+'টি নোট</span></div><div class="ion-observations">'+(Object.keys(labTested).length?tests.filter(function(t){return labTested[t.id]}).map(function(t){var z=labTested[t.id];return'<article class="ion-observation tone-'+E(z.tone)+'"><div class="ion-obs-top"><b>'+t.icon+' '+E(t.name)+'</b><span>'+E(z.tag)+'</span></div><p>'+E(z.obs)+'</p><code>'+E(z.eq)+'</code></article>'}).join(''):'<div class="ion-empty-note">এখনও কোনো পরীক্ষা করা হয়নি। উপরের যেকোনো পরীক্ষায় ট্যাপ করো।</div>')+'</div></section><section class="ion-panel"><div class="ion-panel-head"><div><span class="ion-step">ধাপ ৩ / STEP 03</span><h3>তোমার সিদ্ধান্ত</h3></div><span class="ion-muted">প্রতি সঠিক আয়নে ২০ পয়েন্ট</span></div><div class="ion-select-columns"><div class="ion-ion-pick"><b>ধনায়ন (Cation)</b><p>ধনাত্মক আয়নটি বেছে নাও</p><div class="ion-chip-grid">'+cations.map(function(x){return'<button type="button" data-ion-kind="cation" data-ion-value="'+x+'" class="ion-ion-chip '+(labSelected.cation===x?'selected':'')+'" '+(labAnswered?'disabled':'')+'>'+x+'</button>'}).join('')+'</div></div><div class="ion-ion-pick"><b>ঋণায়ন (Anion)</b><p>ঋণাত্মক আয়নটি বেছে নাও</p><div class="ion-chip-grid">'+anions.map(function(x){return'<button type="button" data-ion-kind="anion" data-ion-value="'+x+'" class="ion-ion-chip '+(labSelected.anion===x?'selected':'')+'" '+(labAnswered?'disabled':'')+'>'+x+'</button>'}).join('')+'</div></div></div><p id="ionLabFeedback" class="ion-feedback" aria-live="polite"></p><div class="ion-actions">'+(labAnswered?'<button type="button" class="btn pri" data-next-sample>'+(labIndex===labList.length-1?'ফলাফল দেখুন →':'পরের নমুনা →')+'</button>':'<button type="button" class="btn pri" data-submit-ion>সিদ্ধান্ত জমা দিন →</button>')+' <button type="button" class="btn" data-mode="notebook">📓 Reaction Notebook</button></div></section><p class="ion-safety-note">ভার্চুয়াল পরীক্ষা · বাস্তব ল্যাবে নিরাপত্তাবিধি অনুসরণ করো।</p>';if(preserve)restoreGameScroll(oldY);else scrollGameToTop();
 }
 var flameQs=[
  {q:'কোন আয়ন সাধারণত তীব্র সোনালি-হলুদ শিখা দেয়?',o:['Na⁺','K⁺','Li⁺','Ba²⁺'],a:0,e:'Na⁺-এর বৈশিষ্ট্যপূর্ণ শিখা তীব্র হলুদ।'},
  {q:'হালকা বেগুনি (lilac) শিখার সঙ্গে কোন আয়ন সম্পর্কিত?',o:['K⁺','Na⁺','Cu²⁺','Ba²⁺'],a:0,e:'K⁺ হালকা বেগুনি শিখা দেয়; Na-এর হলুদ শিখা এটি ঢেকে দিতে পারে।'},
  {q:'Li⁺-এর শিখার রং কোনটি?',o:['ক্রিমসন লাল','সোনালি হলুদ','আপেল সবুজ','নীলাভ সবুজ'],a:0,e:'লিথিয়াম সাধারণত গাঢ় লাল বা ক্রিমসন শিখা দেয়।'},
  {q:'আপেল-সবুজ শিখা কোন আয়নের নির্দেশক হতে পারে?',o:['Ba²⁺','Na⁺','Li⁺','K⁺'],a:0,e:'বেরিয়াম লবণ আপেল-সবুজ শিখা দিতে পারে।'},
  {q:'Cu²⁺-যুক্ত লবণের শিখা সাধারণত কেমন?',o:['নীলাভ সবুজ','হলুদ','ক্রিমসন লাল','হালকা বেগুনি'],a:0,e:'কপার-যুক্ত লবণ নীলাভ-সবুজ শিখা দিতে পারে।'},
  {q:'শিখা পরীক্ষার সীমাবদ্ধতা সম্পর্কে সঠিক বক্তব্য কোনটি?',o:['সব আয়নের আলাদা শিখার রং থাকে','একা শিখা পরীক্ষা সব আয়ন নিশ্চিত করে না','শিখার রং কখনও বদলায় না','এটি ঋণায়নকে সবসময় সরাসরি শনাক্ত করে'],a:1,e:'সব আয়ন স্পষ্ট বৈশিষ্ট্যপূর্ণ শিখা দেয় না; অন্য নিশ্চিতকরণ পরীক্ষাও দরকার।'}
 ];
 var precipQs=[
  {q:'Cu²⁺-এর দ্রবণে NaOH যোগ করলে সাধারণত কোন রঙের অধঃক্ষেপ হয়?',o:['নীল','সাদা','লালচে-বাদামি','ক্রিম'],a:0,e:'Cu(OH)₂ নীল অধঃক্ষেপ।'},
  {q:'Fe³⁺ + OH⁻ বিক্রিয়ায় কোন পর্যবেক্ষণ প্রত্যাশিত?',o:['লালচে-বাদামি অধঃক্ষেপ','হালকা বেগুনি শিখা','হলুদ গ্যাস','নীল অধঃক্ষেপ'],a:0,e:'Fe(OH)₃ লালচে-বাদামি অধঃক্ষেপ।'},
  {q:'Fe²⁺-এর সঙ্গে NaOH যোগে প্রথমে কী দেখা যায়?',o:['ময়লা-সবুজ অধঃক্ষেপ','সাদা AgCl','হলুদ AgI','আপেল-সবুজ শিখা'],a:0,e:'Fe(OH)₂ প্রথমে সবুজাভ; বাতাসে জারিত হয়ে বাদামি হতে পারে।'},
  {q:'অম্লায়িত ক্লোরাইড দ্রবণে AgNO₃ যোগ করলে কী দেখা যায়?',o:['সাদা AgCl অধঃক্ষেপ','নীল Cu(OH)₂','CO₂-এর বুদ্‌বুদ','বাদামি ring'],a:0,e:'Ag⁺ + Cl⁻ → AgCl↓; সাদা অধঃক্ষেপ।'},
  {q:'Br⁻-এর সঙ্গে AgNO₃-এ কোন রঙের অধঃক্ষেপ?',o:['ক্রিম AgBr','হলুদ AgI','নীল Cu(OH)₂','সবুজ Fe(OH)₂'],a:0,e:'AgBr ক্রিম রঙের অধঃক্ষেপ।'},
  {q:'BaCl₂ দিয়ে সালফেট পরীক্ষা করার আগে উপযুক্তভাবে অম্লায়িত করার একটি কারণ কী?',o:['কার্বনেটজাতীয় বিঘ্নকারী ফল কমাতে','শিখা হলুদ করতে','Na⁺-কে Cu²⁺ করতে','দ্রবণকে সবসময় নীল করতে'],a:0,e:'উপযুক্ত অম্লীয় মাধ্যমে BaSO₄-এর সাদা অধঃক্ষেপ সালফেট পরীক্ষায় সহায়ক; পরীক্ষার শর্ত গুরুত্বপূর্ণ।'},
  {q:'Al³⁺-এর সঙ্গে NaOH-এর ফল সম্পর্কে কোন বক্তব্যটি সাধারণত সঠিক?',o:['সাদা জেলির মতো Al(OH)₃ তৈরি হতে পারে এবং অতিরিক্ত NaOH-এ দ্রবীভূত হয়','শুধু সাদা AgCl হয়','সবসময় হলুদ গ্যাস হয়','লাল শিখা দেয়'],a:0,e:'Al(OH)₃ উভধর্মী; অতিরিক্ত NaOH-এ দ্রবীভূত হতে পারে।'},
  {q:'দুটি ভিন্ন আয়ন একই ধরনের অধঃক্ষেপ দিতে পারে হলে সেরা পদক্ষেপ কী?',o:['আরেকটি উপযুক্ত নিশ্চিতকরণ পরীক্ষা করা','প্রথম ফল দেখেই নিশ্চিত হওয়া','পরীক্ষা না করে অনুমান করা','শুধু দ্রবণের পরিমাণ দেখা'],a:0,e:'নির্ভরযোগ্য গুণগত বিশ্লেষণে একাধিক পর্যবেক্ষণ মেলানো হয়।'}
 ];
 var anionQs=[
  {q:'কার্বনেটের সঙ্গে পাতলা অ্যাসিডে কোন গ্যাস তৈরি হয়?',o:['CO₂','NH₃','O₂','H₂'],a:0,e:'CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O। CO₂ চুনপানি ঘোলা করে।'},
  {q:'সালফেট আয়ন শনাক্তে কোন আয়ন সাদা অদ্রবণীয় BaSO₄ দেয়?',o:['Ba²⁺','Ag⁺','Cu²⁺','Na⁺'],a:0,e:'Ba²⁺ + SO₄²⁻ → BaSO₄↓।'},
  {q:'AgNO₃ পরীক্ষায় সাদা দইয়ের মতো অধঃক্ষেপ কোন আয়নের সঙ্গে মেলে?',o:['Cl⁻','Br⁻','I⁻','CO₃²⁻ সবক্ষেত্রে'],a:0,e:'উপযুক্তভাবে অম্লায়িত নমুনায় Cl⁻ সাদা AgCl দেয়।'},
  {q:'AgNO₃ পরীক্ষায় ক্রিম রঙের অধঃক্ষেপ কোনটি?',o:['AgBr','AgCl','AgI','BaSO₄'],a:0,e:'AgBr ক্রিম রঙের; AgCl সাদা এবং AgI হলুদ।'},
  {q:'নাইট্রেটের একটি পরিচিত নিশ্চিতকরণ পরীক্ষার ফল কোনটি?',o:['বাদামি ring','নীল Cu(OH)₂','আপেল-সবুজ শিখা','দইয়ের মতো AgCl'],a:0,e:'নির্দিষ্ট brown-ring test nitrate সম্পর্কে নির্দেশ দিতে পারে।'},
  {q:'AgNO₃ দিয়ে হ্যালাইড পরীক্ষায় dilute HNO₃ ব্যবহারের কারণ কী?',o:['বিঘ্নকারী আয়ন/কার্বনেটের প্রভাব কমিয়ে পরীক্ষা উপযুক্ত রাখা','নমুনায় অতিরিক্ত Cl⁻ যোগ করা','সমস্ত ধাতব আয়ন সরিয়ে ফেলা','নমুনা জমাট করা'],a:0,e:'HCl দিয়ে অম্লায়িত করলে নিজেই Cl⁻ যোগ হবে; তাই তা অনুপযুক্ত।'},
  {q:'কোন আয়নটি ঋণায়ন?',o:['SO₄²⁻','NH₄⁺','Cu²⁺','Na⁺'],a:0,e:'সালফেটের আধান −2; এটি একটি পলিআটমিক ঋণায়ন।'},
  {q:'একটি পরীক্ষায় কোনো বৈশিষ্ট্যপূর্ণ ফল না পেলে সবচেয়ে যুক্তিসংগত সিদ্ধান্ত কী?',o:['এই পরীক্ষায় নিশ্চিত প্রমাণ মেলেনি; আরেকটি উপযুক্ত পরীক্ষা দরকার','নমুনায় কোনো আয়ন নেই','যেকোনো আয়ন বেছে নেওয়া','নমুনার সব আধান শূন্য'],a:0,e:'নেতিবাচক ফল মানেই নমুনায় আয়ন নেই—এমন নয়।'}
 ];
 var admissionQs=[
  {q:'Cu²⁺ + OH⁻ থেকে কোন অধঃক্ষেপ তৈরি হয়?',o:['Cu(OH)₂','AgCl','BaSO₄','AgBr'],a:0,e:'Cu(OH)₂ নীল অধঃক্ষেপ।'},
  {q:'কোন আয়ন NaOH দিয়ে উষ্ণ করলে NH₃ গ্যাস দিতে পারে?',o:['NH₄⁺','Na⁺','Cu²⁺','Ba²⁺'],a:0,e:'NH₄⁺ + OH⁻ → NH₃ + H₂O।'},
  {q:'সঠিক আয়নিক সমীকরণটি কোনটি?',o:['Ag⁺ + Cl⁻ → AgCl↓','Na⁺ + Cl⁻ → NaCl↓ (সবসময়)','K⁺ + NO₃⁻ → KNO₃↓ (পানিে)','H⁺ + CO₃²⁻ → O₂'],a:0,e:'AgCl অদ্রবণীয় সাদা অধঃক্ষেপ। NaCl ও KNO₃ পানিে দ্রবণীয়।'},
  {q:'SO₄²⁻ শনাক্তে বৈশিষ্ট্যপূর্ণ অধঃক্ষেপ কোনটি?',o:['BaSO₄','Cu(OH)₂','AgI','Fe(OH)₃'],a:0,e:'BaSO₄ সাদা ও অদ্রবণীয়।'},
  {q:'একটি নমুনায় CO₃²⁻ থাকলে পাতলা অ্যাসিডে কোন লক্ষণ প্রত্যাশিত?',o:['CO₂-এর বুদ্‌বুদ','লিলাক শিখা','ক্রিম AgBr','সাদা BaSO₄ অবশ্যই'],a:0,e:'কার্বনেট থেকে CO₂ নির্গত হয়।'},
  {q:'কোন জোড়ায় ধনায়ন ও ঋণায়ন দুটিই সঠিকভাবে মেলে?',o:['NH₄⁺ ধনায়ন, NO₃⁻ ঋণায়ন','Cl⁻ ধনায়ন, Na⁺ ঋণায়ন','SO₄²⁻ ধনায়ন, Cu²⁺ ঋণায়ন','Br⁻ ও I⁻ দুটিই ধনায়ন'],a:0,e:'NH₄⁺ ধনাত্মক এবং NO₃⁻ ঋণাত্মক আয়ন।'},
  {q:'Na⁺ শনাক্তকরণে সাধারণত কোন শিখা দেখা যায়?',o:['তীব্র হলুদ','ক্রিমসন লাল','হালকা বেগুনি','আপেল-সবুজ'],a:0,e:'Na⁺-এর হলুদ শিখা খুব তীব্র হতে পারে।'},
  {q:'Fe³⁺-এর সঙ্গে NaOH যোগে কোন ফল সবচেয়ে সম্ভাব্য?',o:['লালচে-বাদামি Fe(OH)₃','নীল Cu(OH)₂','সাদা AgCl','CO₂ গ্যাস'],a:0,e:'Fe³⁺ + 3OH⁻ → Fe(OH)₃↓।'},
  {q:'নিশ্চিতকরণ পরীক্ষায় একাধিক আলাদা ফল নেওয়ার প্রধান কারণ কী?',o:['ভুল সিদ্ধান্তের ঝুঁকি কমানো','পরীক্ষা যত দীর্ঘ তত ভালো','সব আয়নের একই ফল','আধান অকার্যকর করা'],a:0,e:'একাধিক স্বতন্ত্র পর্যবেক্ষণ সিদ্ধান্তকে বেশি নির্ভরযোগ্য করে।'},
  {q:'K⁺-এর শিখা সম্পর্কে সবচেয়ে সঠিক বক্তব্য কোনটি?',o:['হালকা বেগুনি; Na-এর হলুদ শিখায় ঢাকা পড়তে পারে','সবসময় সোনালি হলুদ','তীব্র ক্রিমসন লাল','শিখা পরীক্ষা কখনো প্রযোজ্য নয়'],a:0,e:'K⁺-এর lilac শিখা sodium contamination-এর কারণে দেখা কঠিন হতে পারে.'}
 ];
 var banks={flame:flameQs,precip:precipQs,anion:anionQs,admission:admissionQs};
 function quizStartMode(mode){if(quizTimer){clearInterval(quizTimer);quizTimer=null}activeMode=mode;quizList=shuffle(banks[mode]).slice(0,mode==='admission'?10:8);quizIndex=0;quizScore=0;quizRight=0;quizLock=false;quizOver=false;quizMissed=[];quizStart=Date.now();quizSeconds=60;quizShow();if(mode==='admission')quizTimer=A.every(r,250,function(){if(activeMode!=='admission'||quizOver)return;var left=Math.max(0,60-Math.floor((Date.now()-quizStart)/1000)),el=r.querySelector('#ionTimer');if(el)el.textContent=left+'s';var bar=r.querySelector('#ionTimerBar');if(bar)bar.style.width=(left/60*100)+'%';if(left<=0)quizFinish(true)});}
 function quizShow(){if(quizIndex>=quizList.length){quizFinish(false);return}activeMode=activeMode||'flame';var mode=activeMode,q=quizList[quizIndex],opts=shuffle(q.o.map(function(t,i){return{t:t,ok:i===q.a}}));quizLock=false;
  var label={flame:'শিখা পরীক্ষা',precip:'অধঃক্ষেপের ধাঁধা',anion:'ঋণায়ন অনুসন্ধান',admission:'Admission Battle'}[mode]||'কুইজ';
  r.innerHTML='<div class="ion-topline"><button class="btn" data-ion-home>← Ion Detective</button><span class="ion-mode-pill">'+(mode==='flame'?'🔥':mode==='precip'?'🧪':mode==='anion'?'🫧':'⚔️')+' '+E(label)+'</span><span class="ion-round">'+(quizIndex+1)+' / '+quizList.length+'</span></div><div class="ion-quiz-hud"><div><small>স্কোর</small><b>'+quizScore+'</b></div><div><small>সঠিক</small><b>'+quizRight+' / '+quizList.length+'</b></div><div><small>'+(mode==='admission'?'সময়':'ধাপ')+'</small><b id="ionTimer">'+(mode==='admission'?'60s':(quizIndex+1)+'/'+quizList.length)+'</b></div></div>'+(mode==='admission'?'<div class="ion-timer-track"><i id="ionTimerBar" style="width:100%"></i></div>':'')+'<section class="ion-question card"><span class="ion-step">INVESTIGATION '+String(quizIndex+1).padStart(2,'0')+'</span><h3>'+E(q.q)+'</h3><div class="ion-quiz-options">'+opts.map(function(o,i){return'<button type="button" class="ion-quiz-option" data-quiz-answer="'+(o.ok?'1':'0')+'"><span>'+String.fromCharCode(65+i)+'</span><b>'+E(o.t)+'</b></button>'}).join('')+'</div><p id="ionQuizFeedback" class="ion-feedback" aria-live="polite"></p><div class="ion-actions"><button type="button" class="btn pri" data-quiz-next hidden>'+(quizIndex===quizList.length-1?'ফলাফল দেখুন →':'পরের প্রশ্ন →')+'</button><button type="button" class="btn" data-mode="notebook">📓 নোটবুক দেখুন</button></div></section>';scrollGameToTop();
 }
 function quizAnswer(b){if(quizLock||quizOver)return;quizLock=true;var q=quizList[quizIndex],ok=b.dataset.quizAnswer==='1';if(ok){quizRight++;quizScore+=10}else if(quizMissed.length<12)quizMissed.push({q:q.q,a:q.o[q.a],e:q.e});Array.prototype.forEach.call(r.querySelectorAll('[data-quiz-answer]'),function(x){x.disabled=true;if(x.dataset.quizAnswer==='1')x.classList.add('correct');else if(x===b)x.classList.add('incorrect')});var fb=r.querySelector('#ionQuizFeedback');if(fb)fb.innerHTML='<b class="'+(ok?'ion-good':'ion-bad')+'">'+(ok?'✔ সঠিক সিদ্ধান্ত':'✘ সঠিক উত্তর: '+E(q.o[q.a]))+'</b><span>'+E(q.e)+'</span>';var nx=r.querySelector('[data-quiz-next]');if(nx)nx.hidden=false;var t=r.querySelector('#ionTimer');if(t&&activeMode!=='admission')t.textContent=(quizIndex+1)+'/'+quizList.length;}
 function quizFinish(byTime){if(quizOver)return;quizOver=true;if(quizTimer){clearInterval(quizTimer);quizTimer=null}A.done({score:quizScore,pct:quizRight/Math.max(1,quizList.length),detail:quizRight+' / '+quizList.length+'টি সঠিক'+(byTime?' · সময় শেষ':'') ,review:quizMissed})}
 function notebook(resumeLab){if(quizTimer){clearInterval(quizTimer);quizTimer=null}activeMode='notebook';notebookResumeLab=!!resumeLab;var rows=[
  ['NaOH + Cu²⁺','নীল Cu(OH)₂ অধঃক্ষেপ','Cu²⁺ + 2OH⁻ → Cu(OH)₂↓','ধাপ ৩ · নীল অধঃক্ষেপ কপার(II) আয়নের পক্ষে প্রমাণ; অন্য পরীক্ষার ফলও মিলিয়ে নাও.'],
  ['NaOH + Fe²⁺','প্রথমে সবুজাভ অধঃক্ষেপ','Fe²⁺ + 2OH⁻ → Fe(OH)₂↓','ধাপ ৩ · বাতাসে জারিত হয়ে বাদামি হতে পারে; তাই পর্যবেক্ষণের সময় লিখে রাখো.'],
  ['NaOH + Fe³⁺','লালচে-বাদামি অধঃক্ষেপ','Fe³⁺ + 3OH⁻ → Fe(OH)₃↓','ধাপ ৩ · আয়রন(III) আয়নের পক্ষে প্রমাণ; Fe²⁺-এর সবুজাভ অধঃক্ষেপের সঙ্গে তুলনা করো.'],
  ['NaOH দিয়ে NH₄⁺ উষ্ণ করা','NH₃ গ্যাস; সিক্ত লাল লিটমাস নীল','NH₄⁺ + OH⁻ → NH₃↑ + H₂O','অ্যামোনিয়াম নিশ্চিত করতে গ্যাস শনাক্ত করতে হয়'],
  ['অম্লায়িত নমুনা + AgNO₃','Cl⁻: সাদা; Br⁻: ক্রিম; I⁻: হলুদ অধঃক্ষেপ','Ag⁺ + X⁻ → AgX↓','হ্যালাইডের ধরন আলাদা করতে রং তুলনা করো'],
  ['অম্লীয় মাধ্যমে BaCl₂','সাদা BaSO₄ অধঃক্ষেপ','Ba²⁺ + SO₄²⁻ → BaSO₄↓','সালফেট শনাক্তকরণের ক্লাসিক ফল'],
  ['CO₃²⁻ + পাতলা অ্যাসিড','বুদ্‌বুদ; CO₂ চুনপানি ঘোলা করে','CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O','কার্বনেটের নির্দেশক পরীক্ষা'],
  ['নাইট্রেটের নিশ্চিতকরণ পরীক্ষা','ধারণাগত মডেলে সংযোগস্থলে বাদামি ring','নাইট্রেট শনাক্তের নির্দিষ্ট পরীক্ষা','ধাপ ৩ · এটি একটি নির্দেশক ফল; বাস্তব পরীক্ষার শর্ত ও প্রশিক্ষকের নিরাপত্তা নির্দেশনা অপরিহার্য.'],
  ['NaOH + Al³⁺','সাদা জেলির মতো Al(OH)₃; অতিরিক্ত NaOH-এ দ্রবীভূত হতে পারে','Al³⁺ + 3OH⁻ → Al(OH)₃↓','ধাপ ৩ · অতিরিক্ত ক্ষারে দ্রবীভূত হওয়া Al³⁺ ও Mg²⁺ আলাদা করতে সাহায্য করে.'],
  ['NaOH + Mg²⁺','সাদা Mg(OH)₂ অধঃক্ষেপ','Mg²⁺ + 2OH⁻ → Mg(OH)₂↓','ধাপ ৩ · এই মডেলে সাদা অধঃক্ষেপ অতিরিক্ত NaOH-এ Al(OH)₃-এর মতো দ্রবীভূত হয় না.']
 ];
  r.innerHTML='<div class="ion-topline"><button class="btn" data-ion-home>← Ion Detective</button><span class="ion-mode-pill">📓 REACTION NOTEBOOK</span></div><section class="ion-notebook-hero"><span>📚</span><div><h3>Reaction Notebook</h3><p>বিকারক কী করল → কী দেখা গেল → কোন আয়নের পক্ষে প্রমাণ</p></div></section><div class="ion-notebook-grid">'+rows.map(function(x,i){return'<article class="ion-note-card"><span class="ion-step">TEST '+String(i+1).padStart(2,'0')+'</span><h4>'+E(x[0])+'</h4><p><b>ধাপ ২ · পর্যবেক্ষণ:</b> '+E(x[1])+'</p><small class="ion-equation-label">ধাপ ২ · আয়নিক সমীকরণ</small><code>'+E(x[2])+'</code><small class="ion-note-meaning">'+E(x[3])+'</small></article>'}).join('')+'</div><div class="ion-simulation-guide ion-notebook-guide"><b>নোট পড়ার নিয়ম</b><div class="ion-guide-steps"><span>১ · বিকারক/শর্ত</span><i>→</i><span>২ · পর্যবেক্ষণ + সমীকরণ</span><i>→</i><span>৩ · ব্যাখ্যা</span></div><p>রঙ বা অধঃক্ষেপ একা সব সময় চূড়ান্ত পরিচয় নয়। দ্রাব্যতা, pH, বিঘ্নকারী আয়ন এবং নিশ্চিতকরণ পরীক্ষার ফলও বিবেচনা করো।</p></div><div class="ion-actions"><button type="button" class="btn pri" data-mode="lab">🧫 '+(notebookResumeLab?'আগের ল্যাবে ফিরে যাও':'ল্যাব শুরু করো')+'</button><button type="button" class="btn" data-mode="admission">⚔️ Admission Battle</button></div><p class="ion-safety-note">এই নোটবুক শিক্ষামূলক ও ভার্চুয়াল; বাস্তব রাসায়নিক ব্যবহার করার নির্দেশিকা নয়।</p>';scrollGameToTop();
 }
 r.onclick=function(e){var b=e.target.closest('button');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.hasAttribute('data-ion-home'))return home();
  if(b.dataset.mode){var m=b.dataset.mode;if(m==='home')return home();if(m==='lab'){if(activeMode==='notebook'&&notebookResumeLab&&labList.length)return labShow(true);return labStart()}if(m==='notebook')return notebook(activeMode==='lab');if(banks[m])return quizStartMode(m);return}
  if(b.hasAttribute('data-hint')){labHint=!labHint;var hi=r.querySelector('#ionHint');if(hi)hi.hidden=!labHint;b.textContent=labHint?'💡 ইঙ্গিত লুকাও':'💡 পরীক্ষা নির্বাচনের ইঙ্গিত';return}
  if(b.dataset.test&&!labAnswered){var t=tests.filter(function(x){return x.id===b.dataset.test})[0];if(!t||labTested[t.id])return;labTested[t.id]=testResult(t.id,labList[labIndex]);labShowKeepSelection();return}
  if(b.dataset.ionKind&&!labAnswered){labSelected[b.dataset.ionKind]=b.dataset.ionValue;labShowKeepSelection();return}
  if(b.hasAttribute('data-submit-ion')&&!labAnswered){if(!labSelected.cation||!labSelected.anion){var fm=r.querySelector('#ionLabFeedback');if(fm)fm.textContent='জমা দেওয়ার আগে একটি ধনায়ন ও একটি ঋণায়ন বেছে নাও।';return}var sample=labList[labIndex],cOk=labSelected.cation===sample.cation,aOk=labSelected.anion===sample.anion,bonus=Math.min(10,Object.keys(labTested).length*2),earned=(cOk?20:0)+(aOk?20:0)+bonus;labScore+=earned;if(cOk&&aOk)labPerfect++;else if(labMissed.length<12)labMissed.push({q:'নমুনা '+sample.id+' শনাক্তকরণ',a:sample.cation+' ও '+sample.anion,e:sample.why});labAnswered=true;var msg=(cOk?'✔ ধনায়ন সঠিক। ':'✘ ধনায়ন: '+sample.cation+'। ')+(aOk?'✔ ঋণায়ন সঠিক। ':'✘ ঋণায়ন: '+sample.anion+'। ')+'+'+earned+' পয়েন্ট। '+sample.why;labShowKeepSelection();var f=r.querySelector('#ionLabFeedback');if(f)f.textContent=msg;var area=r.querySelector('.ion-actions');if(area)area.innerHTML='<button type="button" class="btn pri" data-next-sample>'+(labIndex===labList.length-1?'ফলাফল দেখুন →':'পরের নমুনা →')+'</button><button type="button" class="btn" data-mode="notebook">📓 Reaction Notebook</button>';return}
  if(b.hasAttribute('data-next-sample')){labIndex++;return labShow()}
  if(b.hasAttribute('data-quiz-answer'))return quizAnswer(b);
  if(b.hasAttribute('data-quiz-next')){if(!quizLock)return;quizIndex++;return quizShow()}
 };
 function labShowKeepSelection(){labShow(true)}
 home();
};

return G})();
