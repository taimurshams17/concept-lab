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
G.blitz=function(r,g,A){var X=A.X,E=A.E,d=g.data||{},pool=(d.q||[]).filter(function(q){return q&&q.q&&q.o&&q.o.length>=2}).map(function(q){return{q:q.q,o:q.o.slice(0,4).filter(Boolean),a:+q.a}});
 if(String(d.useChapters)!=='0'&&String(d.useChapters)!=='false')pool=pool.concat(A.questions());
 if(pool.length<2)return empty(r,'Add some questions in the admin panel to play this game.');
 var T=+d.time||60,score=0,lives=3,combo=0,order=[],cur,lock=false,t0=performance.now(),over=false,correct=0;
 r.innerHTML=hud([[X('g_score'),'sc',0],[X('g_combo'),'cb','x1'],[X('g_lives'),'lv',''],[X('g_time'),'tm',T]])+'<div class="tbar"><i id="tb"></i></div><div class="card qa" id="qa"></div>';
 function h(){qa(r,'#sc').textContent=score;qa(r,'#cb').textContent='x'+Math.min(4,1+Math.floor(combo/3));qa(r,'#lv').innerHTML=hearts(lives)}
 function nxt(){if(!order.length)order=sh(pool.slice());cur=order.pop();var opts=sh(cur.o.map(function(t,i){return{t:t,ok:i==cur.a}}));qa(r,'#qa').innerHTML='<p class="bn qt">'+E(cur.q)+'</p>'+opts.map(function(o){return'<button class="opt" data-ok="'+(o.ok?1:0)+'">'+E(o.t)+'</button>'}).join('');lock=false}
 qa(r,'#qa').onclick=function(e){var b=e.target.closest('.opt');if(!b||lock||over)return;lock=true;var ok=b.dataset.ok=='1';
  if(ok){combo++;score+=10*Math.min(4,1+Math.floor(combo/3));correct++;b.classList.add('ok')}else{combo=0;lives--;b.classList.add('no');qq(r,'.opt').forEach(function(o){if(o.dataset.ok=='1')o.classList.add('ok')})}
  h();if(lives<=0)return setTimeout(end,800);setTimeout(nxt,ok?320:950)};
 A.every(r,150,function(){var left=T-(performance.now()-t0)/1000;qa(r,'#tm').textContent=Math.max(0,Math.ceil(left));qa(r,'#tb').style.width=Math.max(0,left/T*100)+'%';if(left<=0)end()});
 function end(){if(over)return;over=true;A.done({score:score,pct:Math.min(1,score/200),detail:correct+' correct'})}
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
 var list=sh(items.slice()).slice(0,10),i=0,lives=3,score=0,combo=0,right=0,lock=false,over=false;
 r.innerHTML=hud([[X('g_score'),'sc',0],[X('g_combo'),'cb','x1'],[X('g_lives'),'lv',''],['Card','pg','']])+'<div class="card tfc" id="tc"></div>';
 function isT(it){return it.t===true||String(it.t)==='true'||String(it.t)==='1'}
 function h(){qa(r,'#sc').textContent=score;qa(r,'#cb').textContent='x'+Math.min(4,1+Math.floor(combo/3));qa(r,'#lv').innerHTML=hearts(lives);qa(r,'#pg').textContent=Math.min(i+1,list.length)+' / '+list.length}
 function show(){lock=false;qa(r,'#tc').innerHTML='<p class="bn qt">'+E(list[i].s)+'</p><div class="tfrow"><button class="tfb t" data-v="1">✔ '+E(X('g_true'))+' <small>←</small></button><button class="tfb f" data-v="0">✘ '+E(X('g_false'))+' <small>→</small></button></div><p class="ex" id="ex"></p><div id="nx"></div>';h()}
 function ans(v){if(lock||over)return;lock=true;var it=list[i],ok=(v==isT(it));qq(r,'.tfb').forEach(function(b){var bv=b.dataset.v=='1';b.classList.add(bv==isT(it)?'ok':(bv==v?'no':'dim'))});
  if(ok){combo++;score+=10*Math.min(4,1+Math.floor(combo/3));right++}else{combo=0;lives--}qa(r,'#ex').innerHTML=(ok?'✔ ':'✘ ')+E(it.e||'');h();
  if(lives<=0||i>=list.length-1){setTimeout(end,1400)}else{qa(r,'#nx').innerHTML='<button class="btn pri" id="nb">'+E(X('g_next'))+'</button>';qa(r,'#nb').onclick=nx}}
 function nx(){i++;show()}
 function end(){if(over)return;over=true;A.done({score:score,pct:right/list.length,detail:right+' / '+list.length+' correct'})}
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
  x.clearRect(0,0,W,H);x.strokeStyle='rgba(125,190,230,.12)';x.lineWidth=1;x.fillStyle='#7f9bb3';x.font='11px Manrope,sans-serif';x.textAlign='center';for(var d=0;d<=210;d+=30){var gx=OX+d*SC;x.beginPath();x.moveTo(gx,20);x.lineTo(gx,GY);x.stroke();x.fillText(d+' m',gx,GY+16)}
  x.strokeStyle='rgba(150,200,240,.5)';x.lineWidth=2;x.beginPath();x.moveTo(0,GY);x.lineTo(W,GY);x.stroke();
  ghosts.forEach(function(gh){x.beginPath();var T=2*gh.v*Math.sin(gh.th)/GR;for(var i=0;i<=60;i++){var p=pos(gh,T*i/60);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}x.strokeStyle='rgba(125,211,252,.28)';x.setLineDash([4,6]);x.lineWidth=1.5;x.stroke();x.setLineDash([])});
  if(tgt){var tx=OX+tgt.d*SC,tw=5*SC;x.fillStyle='rgba(251,191,36,.25)';x.fillRect(tx-tw,GY-4,tw*2,6);for(var k=3;k>=1;k--){x.beginPath();x.arc(tx,GY-18,k*7,0,TAU);x.fillStyle=k%2?'#f87171':'#fff';x.fill()}x.fillStyle=Am;x.font='bold 12px Manrope,sans-serif';x.fillText(tgt.d+' m',tx,GY-52)}
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
  var n=0;if(pts)pts.forEach(function(p){var on=Math.abs(m*p[0]+c-p[1])<1e-6;if(on)n++;x.fillStyle=on?'#34d399':Am;x.shadowColor=x.fillStyle;x.shadowBlur=on?22:12;x.beginPath();x.arc(X1(p[0]),Y1(p[1]),on?9:7,0,TAU);x.fill();x.shadowBlur=0;x.fillStyle='#e2f1ff';x.font='11px Manrope,sans-serif';x.textAlign='left';x.fillText('('+p[0]+', '+p[1]+')',X1(p[0])+12,Y1(p[1])-10)});
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

return G})();
