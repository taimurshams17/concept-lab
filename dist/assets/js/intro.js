/* ConceptLab premium intro controller — slower reveal, accessible skip and reduced-motion support. */
(function(){
 var el=document.getElementById('intro'),root=document.documentElement;
 if(!el||root.classList.contains('intro-seen')){if(el)el.remove();return}
 var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 var MIN=reduce?850:4300,MAX=6800,t0=performance.now(),loaded=document.readyState==='complete',done=false,raf=0;
 var fill=el.querySelector('.in-fill'),nodes=[].slice.call(el.querySelectorAll('.in-prog li'));
 root.classList.add('intro-on');
 function ready(){loaded=true}
 if(!loaded)window.addEventListener('load',ready,{once:true});
 function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
 function finish(){
  if(done)return;done=true;cancelAnimationFrame(raf);
  try{sessionStorage.setItem('cl-intro-seen','1')}catch(e){}
  el.classList.add('out');
  setTimeout(function(){root.classList.remove('intro-on');root.classList.add('intro-seen');if(el.parentNode)el.parentNode.removeChild(el)},reduce?160:930);
 }
 var closing=false;
 function tick(now){
  if(done||closing)return;
  var elapsed=now-t0,p=ease(Math.min(1,elapsed/MIN));
  if(!loaded&&elapsed<MAX)p=Math.min(p,.94);
  if(fill)fill.style.transform='scaleX('+p.toFixed(4)+')';
  for(var i=0;i<nodes.length;i++)nodes[i].classList.toggle('on',p>=i/Math.max(1,nodes.length-1)-.001&&(i>0||elapsed>1450));
  if(p>=1){closing=true;setTimeout(finish,reduce?40:480);return}
  raf=requestAnimationFrame(tick);
 }
 raf=requestAnimationFrame(tick);
 var skip=document.getElementById('introSkip');if(skip)skip.addEventListener('click',finish);
 window.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Enter'||e.key===' ')finish()},{once:true});
})();
