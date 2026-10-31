/* ConceptLab cinematic intro — reliable audio unlock, gentle fade and reduced-motion support. */
(function(){
 'use strict';
 var el=document.getElementById('intro'),root=document.documentElement;
 if(!el||root.classList.contains('intro-seen')){if(el)el.remove();return;}
 var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var MIN=reduce?2000:4300,MAX=6800,t0=performance.now(),loaded=document.readyState==='complete',done=false,raf=0;
 var fill=el.querySelector('.in-fill'),nodes=[].slice.call(el.querySelectorAll('.in-prog li'));
 var soundButton=document.getElementById('introSound'),soundLabel=soundButton&&soundButton.querySelector('span');
 root.classList.add('intro-on');
 function ready(){loaded=true;}
 if(!loaded)window.addEventListener('load',ready,{once:true});

 var music=null,musicRAF=0,musicStarted=false,musicTarget=0,gestureFallbackArmed=false;
 function readSoundPreference(){
  var pref={on:true,vol:.6};
  try{var saved=JSON.parse(localStorage.getItem('cl_sfx_v1')||'null');if(saved&&typeof saved==='object'){if(typeof saved.on==='boolean')pref.on=saved.on;if(isFinite(saved.vol))pref.vol=Math.max(0,Math.min(1,+saved.vol));}}catch(e){}
  return pref;
 }
 function updateSoundButton(on,message){
  if(!soundButton)return;
  soundButton.classList.toggle('is-on',!!on);
  soundButton.setAttribute('aria-pressed',String(!!on));
  if(soundLabel)soundLabel.textContent=message||(on?'Intro music on':'Enable intro music');
 }
 function beginFade(){
  if(!music||done)return;
  cancelAnimationFrame(musicRAF);
  var startedAt=performance.now();
  function fadeIn(){
   if(!music||done)return;
   var amount=Math.min(1,(performance.now()-startedAt)/650);
   try{music.volume=Math.min(1,musicTarget)*amount;}catch(e){}
   if(amount<1)musicRAF=requestAnimationFrame(fadeIn);
  }
  musicRAF=requestAnimationFrame(fadeIn);
 }
 function startMusic(fromGesture){
  if(done||!music)return;
  if(musicStarted&&!music.paused)return;
  if(musicStarted&&music.paused&&fromGesture)musicStarted=false;
  if(musicStarted)return;
  musicStarted=true;
  try{
   music.currentTime=0;
   var promise=music.play();
   if(promise&&typeof promise.then==='function'){
    promise.then(function(){if(done)return;musicStarted=true;updateSoundButton(true,'Intro music on');beginFade();})
     .catch(function(){musicStarted=false;updateSoundButton(false,'Tap to enable intro music');});
   }else{
    if(!music.paused){updateSoundButton(true,'Intro music on');beginFade();}
    else{musicStarted=false;updateSoundButton(false,'Tap to enable intro music');}
   }
  }catch(e){musicStarted=false;updateSoundButton(false,'Tap to enable intro music');}
 }
 function installGestureFallback(){
  if(gestureFallbackArmed||done||!music)return;
  gestureFallbackArmed=true;
  var unlock=function(){if(!done)startMusic(true);};
  document.addEventListener('pointerdown',unlock,{once:true,capture:true,passive:true});
  document.addEventListener('keydown',unlock,{once:true,capture:true});
 }
 function prepareMusic(){
  var pref=readSoundPreference();
  if(pref.vol<=0){updateSoundButton(false,'Volume is muted in Settings');if(soundButton)soundButton.disabled=true;return;}
  musicTarget=Math.min(.78,Math.max(.3,pref.vol*1.08));
  music=document.createElement('audio');
  music.src='assets/audio/intro-cinematic.mp3?v=20261031-v15-normalized';
  music.preload='auto';music.loop=false;music.volume=0;music.setAttribute('playsinline','');music.setAttribute('aria-hidden','true');
  music.addEventListener('error',function(){musicStarted=false;updateSoundButton(false,'Intro music unavailable');if(music&&music.parentNode)music.parentNode.removeChild(music);music=null;});
  music.addEventListener('ended',function(){if(!done)updateSoundButton(false,'Replay intro music');});
  document.body.appendChild(music);
  updateSoundButton(false,pref.on?'Enable intro music':'Tap to enable intro music');
  if(pref.on){
   installGestureFallback();
   /* Attempt autoplay; browsers that block it show the one-tap control above. */
   startMusic(false);
  }
 }
 function stopMusic(){
  if(!music)return;
  cancelAnimationFrame(musicRAF);
  var started=performance.now(),initial=music.volume;
  function fadeOut(){
   if(!music)return;
   var amount=Math.min(1,(performance.now()-started)/420);
   try{music.volume=Math.max(0,initial*(1-amount));}catch(e){}
   if(amount<1){musicRAF=requestAnimationFrame(fadeOut);return;}
   try{music.pause();music.currentTime=0;}catch(e){}
   if(music.parentNode)music.parentNode.removeChild(music);music=null;
  }
  musicRAF=requestAnimationFrame(fadeOut);
 }
 if(soundButton)soundButton.addEventListener('click',function(){
  if(!music){var pref=readSoundPreference();if(pref.on&&pref.vol>0)prepareMusic();}
  if(music){startMusic(true);if(music.paused)updateSoundButton(false,'Tap again to enable sound');}
 });
 prepareMusic();

 function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;}
 function finish(){
  if(done)return;done=true;cancelAnimationFrame(raf);stopMusic();
  try{sessionStorage.setItem('cl-intro-seen','1');}catch(e){}
  el.classList.add('out');
  setTimeout(function(){root.classList.remove('intro-on');root.classList.add('intro-seen');if(el.parentNode)el.parentNode.removeChild(el);},reduce?160:930);
 }
 var closing=false;
 function tick(now){
  if(done||closing)return;
  var elapsed=now-t0,p=ease(Math.min(1,elapsed/MIN));
  if(!loaded&&elapsed<MAX)p=Math.min(p,.94);
  if(fill)fill.style.transform='scaleX('+p.toFixed(4)+')';
  for(var i=0;i<nodes.length;i++)nodes[i].classList.toggle('on',p>=i/Math.max(1,nodes.length-1)-.001&&(i>0||elapsed>1100));
  if(p>=1){closing=true;setTimeout(finish,reduce?40:480);return;}
  raf=requestAnimationFrame(tick);
 }
 raf=requestAnimationFrame(tick);
 var skip=document.getElementById('introSkip');if(skip)skip.addEventListener('click',finish);
 window.addEventListener('keydown',function(e){if(e.key==='Escape')finish();},{once:true});
})();
