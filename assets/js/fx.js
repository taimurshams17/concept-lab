/* ConceptLab visual effects: starfield, sky-blue embers, cursor glow, reveals, counters, tilt, confetti, toasts */
window.FX=(function(){
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var on=true,colour='#38bdf8',colour2='#7dd3fc';
function rgb(h){h=(h||'#38bdf8').replace('#','');return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]}
/* ---------- background canvas ---------- */
var cv=document.getElementById('stars'),cx=cv&&cv.getContext('2d'),W=0,H=0,stars=[],embers=[],shoots=[],planets=[],px=0,py=0,tx=0,ty=0,dpr=1,nextShoot=2;
function size(){if(!cv)return;dpr=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);
 var n=Math.min(170,Math.round(W*H/11500));stars=[];for(var i=0;i<n;i++)stars.push({x:Math.random()*W,y:Math.random()*H,z:.2+Math.random()*.8,r:Math.random()*1.3+.2,t:Math.random()*6.28,s:.4+Math.random()*1.6});
 var m=0; /* v9.8.0: rising bottom bubbles/embers removed */embers=[];for(var j=0;j<m;j++)embers.push(ember(true));
 /* Sparse, low-opacity celestial objects: fixed in the sky so they feel like distant scenery. */
 planets=[
  {x:W*.82,y:H*.22,r:Math.min(15,W*.022),c:'#38bdf8',ring:true},
  {x:W*.13,y:H*.58,r:Math.min(8,W*.012),c:'#c084fc',ring:false},
  {x:W*.72,y:H*.76,r:Math.min(6,W*.009),c:'#fbbf24',ring:false},
  {x:W*.39,y:H*.17,r:Math.min(6,W*.009),c:'#a78bfa',ring:false},
  {x:W*.58,y:H*.43,r:Math.min(10,W*.014),c:'#7dd3fc',ring:true},
  {x:W*.91,y:H*.57,r:Math.min(7,W*.01),c:'#f9a8d4',ring:false},
  {x:W*.30,y:H*.82,r:Math.min(8,W*.012),c:'#fbbf24',ring:false},
  {x:W*.66,y:H*.91,r:Math.min(5,W*.008),c:'#c4b5fd',ring:false}
 ];
}
function ember(init){return{x:Math.random()*W,y:init?H-Math.random()*H*.55:H+10,r:Math.random()*2.2+.6,v:12+Math.random()*34,w:Math.random()*6.28,a:.2+Math.random()*.6}}
var last=performance.now();
function frame(n){requestAnimationFrame(frame);if(!cx||!on||document.hidden){last=n;return}if(n-last<1000/(innerWidth<700?24:36))return;
 var dt=Math.min(.05,(n-last)/1000);last=n;px+=(tx-px)*.05;py+=(ty-py)*.05;cx.clearRect(0,0,W,H);
 var c=rgb(colour),c2=rgb(colour2),t=n/1000;
 /* Several distant spiral galaxies: faint, slow-moving, and cheap to render. */
 var galaxies=[{x:W*.18,y:H*.29,s:1,a:-.22},{x:W*.70,y:H*.24,s:.56,a:.32},{x:W*.48,y:H*.72,s:.42,a:-.48}];
 for(var gi=0;gi<galaxies.length;gi++){var gal=galaxies[gi],gr=Math.min(W,H)*.105*gal.s;cx.save();cx.translate(gal.x,gal.y);cx.rotate(gal.a+Math.sin(t*.06+gi)*.018);
  var gg=cx.createRadialGradient(0,0,0,0,0,gr*1.25);gg.addColorStop(0,gi===1?'rgba(192,132,252,.075)':'rgba(125,211,252,.085)');gg.addColorStop(.38,'rgba(56,189,248,.035)');gg.addColorStop(1,'rgba(56,189,248,0)');cx.fillStyle=gg;cx.beginPath();cx.arc(0,0,gr*1.25,0,6.283);cx.fill();cx.globalAlpha=gi===0?.105:.075;
  for(var arm=0;arm<2;arm++){cx.beginPath();var galaxySteps=W<700?36:72;for(var qg=0;qg<galaxySteps;qg++){var ang=qg*(.115*72/galaxySteps)+arm*Math.PI,rad=gr*(qg/galaxySteps),xx=Math.cos(ang)*rad*1.45,yy=Math.sin(ang)*rad*.56;if(qg===0)cx.moveTo(xx,yy);else cx.lineTo(xx,yy)}cx.strokeStyle=gi===1?'rgba(196,181,253,.6)':'rgba(125,211,252,.6)';cx.lineWidth=1;cx.stroke()}cx.restore()
 }
 /* Small planets with atmospheric rim and occasional rings. */
 for(var pi=0;pi<planets.length;pi++){var pl=planets[pi],drift=Math.sin(t*.18+pi*2)*4,pr=pl.r;
  cx.save();cx.translate(pl.x+drift,pl.y+Math.cos(t*.12+pi)*3);
  cx.globalAlpha=.18;var pg=cx.createRadialGradient(-pr*.35,-pr*.4,pr*.08,0,0,pr*1.4);
  pg.addColorStop(0,pl.c);pg.addColorStop(.7,'rgba(4,16,28,.9)');pg.addColorStop(1,'rgba(0,0,0,0)');
  cx.fillStyle=pg;cx.beginPath();cx.arc(0,0,pr*1.4,0,6.283);cx.fill();
  cx.globalAlpha=.28;cx.strokeStyle=pl.c;cx.lineWidth=.7;cx.beginPath();cx.arc(0,0,pr*1.02,0,6.283);cx.stroke();
  if(pl.ring){cx.globalAlpha=.13;cx.beginPath();cx.ellipse(0,0,pr*1.8,pr*.48,-.18,0,6.283);cx.strokeStyle='#7dd3fc';cx.lineWidth=2;cx.stroke()}
  cx.restore()
 }
 for(var i=0;i<stars.length;i++){var s=stars[i];s.y-=s.z*dt*4;if(s.y<-2){s.y=H+2;s.x=Math.random()*W}
  var a=.25+.75*Math.abs(Math.sin(t*s.s+s.t));cx.globalAlpha=a*s.z;cx.fillStyle=i%7==0?'rgb('+c2[0]+','+c2[1]+','+c2[2]+')':'#fff';
  cx.beginPath();cx.arc(s.x+px*s.z*24,s.y+py*s.z*24,s.r,0,6.283);cx.fill()}
 /* rising embers in the sky-blue zone */
 cx.globalCompositeOperation='lighter';
 for(var k=0;k<embers.length;k++){var e=embers[k];e.y-=e.v*dt;e.w+=dt*1.4;e.x+=Math.sin(e.w)*8*dt;
  var life=Math.max(0,Math.min(1,(e.y-H*.35)/(H*.65)));if(e.y<H*.3){embers[k]=ember();continue}
  cx.globalAlpha=e.a*life;var g=cx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r*5);g.addColorStop(0,'rgba('+c[0]+','+c[1]+','+c[2]+',.9)');g.addColorStop(1,'rgba('+c[0]+','+c[1]+','+c[2]+',0)');cx.fillStyle=g;cx.beginPath();cx.arc(e.x,e.y,e.r*5,0,6.283);cx.fill()}
 cx.globalCompositeOperation='source-over';
 /* shooting stars */
 nextShoot-=dt;if(nextShoot<0&&!reduce){nextShoot=3+Math.random()*6;shoots.push({x:Math.random()*W*.9+W*.1,y:Math.random()*H*.35,vx:-420-Math.random()*240,vy:200+Math.random()*120,l:0})}
 for(var q=shoots.length-1;q>=0;q--){var sh=shoots[q];sh.l+=dt;sh.x+=sh.vx*dt;sh.y+=sh.vy*dt;var al=Math.max(0,1-sh.l/1.1);if(al<=0){shoots.splice(q,1);continue}
  var gr=cx.createLinearGradient(sh.x,sh.y,sh.x-sh.vx*.12,sh.y-sh.vy*.12);gr.addColorStop(0,'rgba(255,255,255,'+al+')');gr.addColorStop(1,'rgba(255,255,255,0)');cx.globalAlpha=1;cx.strokeStyle=gr;cx.lineWidth=1.6;cx.beginPath();cx.moveTo(sh.x,sh.y);cx.lineTo(sh.x-sh.vx*.12,sh.y-sh.vy*.12);cx.stroke()}
 cx.globalAlpha=1}
if(cv){size();addEventListener('resize',size);requestAnimationFrame(frame)}
addEventListener('pointermove',function(e){tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2},{passive:true});
/* Custom cursor removed: use the browser-native cursor. */
/* ---------- reveal + counters ---------- */
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);var cs=e.target.querySelectorAll('[data-count]');cs.forEach(count);if(e.target.hasAttribute('data-count'))count(e.target)}})},{threshold:.08,rootMargin:'0px 0px 100px 0px'}):null;
function count(el){if(el._c)return;el._c=1;var to=+el.getAttribute('data-count')||0,t0=performance.now(),d=reduce?0:1100;(function f(n){var p=d?Math.min(1,(n-t0)/d):1;p=1-Math.pow(1-p,3);el.textContent=Math.round(to*p).toLocaleString();if(p<1&&el.isConnected)requestAnimationFrame(f)})(t0)}
function scan(root){root=root||document;var list=root.querySelectorAll('.rv:not(.in)');list.forEach(function(el,i){if(io)io.observe(el);else el.classList.add('in')});
 var cs=root.querySelectorAll('[data-count]:not(.rv)');cs.forEach(function(el){if(el.closest('.rv'))return;if(io)io.observe(el);else count(el)})}
setTimeout(function(){document.querySelectorAll('.rv:not(.in)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){el.classList.add('in');el.querySelectorAll('[data-count]').forEach(count)}})},1200);
/* ---------- card spotlight + tilt ---------- */
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.card');if(!c)return;var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
 if(c.classList.contains('tilt')&&!reduce&&e.pointerType!=='touch'){var rx=((y/r.height)-.5)*-7,ry=((x/r.width)-.5)*7;c.style.transform='perspective(800px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px)'}},{passive:true});
document.addEventListener('pointerout',function(e){var c=e.target.closest&&e.target.closest('.card.tilt');if(c&&!c.contains(e.relatedTarget))c.style.transform=''});
/* ---------- helpers ---------- */
function every(el,ms,fn){var id=setInterval(function(){if(!el.isConnected){clearInterval(id);return}fn()},ms);return id}
function type(el,words,pre){if(!el||!words.length)return;var w=0,i=0,del=false;(function step(){if(!el.isConnected)return;var word=words[w];if(!del){i++;if(i>=word.length){del=true;el.textContent=word;return setTimeout(step,1500)}}else{i--;if(i<=0){del=false;w=(w+1)%words.length;i=0}}el.textContent=word.slice(0,i);setTimeout(step,del?45:90)})()}
/* ---------- toasts ---------- */
function toast(html,kind){var box=document.getElementById('toasts');if(!box)return;var d=document.createElement('div');d.className='toast '+(kind||'');d.innerHTML=html;box.appendChild(d);requestAnimationFrame(function(){d.classList.add('in')});setTimeout(function(){d.classList.remove('in');setTimeout(function(){d.remove()},400)},3400)}
/* ---------- confetti ---------- */
var cf=document.getElementById('conf'),cc=cf&&cf.getContext('2d'),parts=[],cfOn=false;
function cfsize(){if(!cf)return;cf.width=innerWidth;cf.height=innerHeight}cfsize();addEventListener('resize',cfsize);
function confetti(x,y,n){if(!cc||reduce)return;n=n||90;x=x==null?innerWidth/2:x;y=y==null?innerHeight*.35:y;var pal=[colour,colour2,'#ffffff','#fbbf24','#a5f3fc'];
 for(var i=0;i<n;i++){var a=Math.random()*6.283,s=4+Math.random()*9;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6,r:3+Math.random()*4,c:pal[i%pal.length],l:0,rot:Math.random()*6,vr:(Math.random()-.5)*.4})}
 if(!cfOn){cfOn=true;requestAnimationFrame(cfFrame)}}
function cfFrame(){cc.clearRect(0,0,cf.width,cf.height);for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.l++;p.vy+=.28;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;if(p.l>130||p.y>cf.height+20){parts.splice(i,1);continue}
  cc.globalAlpha=Math.max(0,1-p.l/130);cc.fillStyle=p.c;cc.save();cc.translate(p.x,p.y);cc.rotate(p.rot);cc.fillRect(-p.r,-p.r/2,p.r*2,p.r);cc.restore()}
 cc.globalAlpha=1;if(parts.length)requestAnimationFrame(cfFrame);else{cfOn=false;cc.clearRect(0,0,cf.width,cf.height)}}
/* ---------- public ---------- */
return{
 scan:scan,every:every,type:type,toast:toast,confetti:confetti,
 setTheme:function(t){t=t||{};colour=t.p||colour;colour2=t.s||colour2;on=t.fx!=='off';if(cv)cv.style.display=on?'block':'none';document.documentElement.classList.toggle('nofx',!on)}
}})();
