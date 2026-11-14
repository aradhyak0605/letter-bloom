'use strict';
const $=id=>document.getElementById(id), STORE='letter-bloom-v2', seeds=['EAT','ART','TOP','OWN','SAP'];
let preferences={best:0,night:false,theme:'garden'},mode='classic',s,selection=[],positions=[],drag=null,noticeTimer;
try{preferences={...preferences,...JSON.parse(localStorage.getItem('bloom-prefs')||'{}')}}catch{}
const dayKey=()=>new Date().toLocaleDateString('en-CA');
function hash(t){let n=2166136261;for(const c of t)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0}
function random(){s.rng=(Math.imul(s.rng,1664525)+1013904223)>>>0;return s.rng/4294967296}
// A stage never asks for more full-length anagrams than actually exist.
function quota(n=s.letters.length,letters=s.letters){return Math.min(n===3?3:Math.min(n,8),(wordGroups.get(signature(letters))||[]).length)}
function fresh(m){const seed=m==='daily'?hash(dayKey()):Math.floor(Math.random()*4294967295);s={letters:playableSeeds[seed%playableSeeds.length].split(''),found:[],score:0,lives:3,streak:0,stageCount:0,hints:3,round:1,rng:seed,date:dayKey(),over:false};}
function save(){try{localStorage.setItem(STORE+'-'+mode,JSON.stringify(s));localStorage.setItem('bloom-prefs',JSON.stringify(preferences))}catch{}}
function load(m){mode=m;let old;try{old=JSON.parse(localStorage.getItem(STORE+'-'+m))}catch{}if(old&&Array.isArray(old.letters)&&old.letters.length>=3&&old.letters.length<=9&&(m!=='daily'||old.date===dayKey()))s=old;else fresh(m);selection=[];render();if(s.over)endGame();}
function canSpell(w,letters){const bag=letters.join('').toLowerCase().split('');for(const c of w){let i=bag.indexOf(c);if(i<0)return false;bag.splice(i,1)}return true}
function signature(letters){return [...letters].join('').toLowerCase().split('').sort().join('')}
const wordGroups=new Map();
for(const word of WORDS){const key=signature(word);if(!wordGroups.has(key))wordGroups.set(key,[]);wordGroups.get(key).push(word)}
// Work backwards from nine tiles. Every offered addition has a complete route
// through the later levels, rather than merely a playable immediate next step.
const growthOptions=new Map();
let viable=new Set([...wordGroups.keys()].filter(key=>key.length===9));
for(let length=9;length>3;length--){
  const parents=new Set();
  for(const key of viable)for(let i=0;i<key.length;i++){
    const parent=key.slice(0,i)+key.slice(i+1);
    if(!wordGroups.has(parent))continue;
    parents.add(parent);if(!growthOptions.has(parent))growthOptions.set(parent,new Set());
    growthOptions.get(parent).add(key[i].toUpperCase());
  }
  viable=parents;
}
const playableSeeds=seeds.filter(seed=>growthOptions.has(signature(seed))&&(wordGroups.get(signature(seed))||[]).length>=3);
function possible(letters=s.letters,exclude=s.found){const found=new Set(exclude);return (wordGroups.get(signature(letters))||[]).filter(word=>!found.has(word))}
function addLetter(){
  const choices=[...(growthOptions.get(signature(s.letters))||[])].sort();
  if(!choices.length)throw new Error('No playable letter addition');
  const letter=choices[Math.floor(random()*choices.length)];
  s.letters.push(letter);s.stageCount=0;if(s.letters.length>=6)preferences.night=true;return letter;
}
function message(text,kind=''){clearTimeout(noticeTimer);$('message').textContent=text;$('message').className='message '+kind;}
function render(){document.body.dataset.theme=preferences.theme;$('best').textContent=preferences.best;$('score').textContent=s.score;$('hearts').textContent='♥'.repeat(s.lives)+'♡'.repeat(3-s.lives);$('hearts').setAttribute('aria-label',s.lives+' lives remaining');const names=['The seed','First leaves','Taking root','In bloom','Wild garden','Flourishing','Full bloom'];$('level').textContent=`${mode==='daily'?'Daily':'Chapter'} ${String(s.letters.length-2).padStart(2,'0')} · ${names[s.letters.length-3]}`;$('streak').textContent=s.streak>=3?`✦ ${s.streak} in a row · ×${Math.min(3,1+Math.floor(s.streak/3))} next word`:'Every word is a beginning';$('progress-label').textContent=`${s.stageCount} / ${quota(s.letters.length)} words`;$('next-label').textContent=s.letters.length===9?'Next garden · keep your score':'Grow a random new letter';$('bar').style.width=100*s.stageCount/quota(s.letters.length)+'%';$('count').textContent=s.found.length+' found';$('words').replaceChildren(...s.found.slice().reverse().map(w=>{const el=document.createElement('span');el.className='chip';el.textContent=w.toUpperCase();return el}));$('shuffle').disabled=s.letters.length<4||s.over;$('submit').disabled=s.over;$('hint').disabled=s.letters.length<5||s.hints===0||s.over;$('hint').textContent=s.letters.length<5?'♧ Hint · unlock at 5':`♧ Hint · ${s.hints} left`;$('classic').classList.toggle('active',mode==='classic');$('daily').classList.toggle('active',mode==='daily');document.querySelectorAll('[data-unlock]').forEach(e=>e.classList.toggle('locked',s.letters.length<Number(e.dataset.unlock)));document.querySelectorAll('.theme-btn').forEach(e=>e.classList.toggle('active',preferences.theme===e.dataset.theme));$('night-label').textContent=preferences.night?'Night':'Night · 🔒';drawWheel();save();}
function drawWheel(){const wheel=$('wheel');wheel.querySelectorAll('.letter').forEach(e=>e.remove());const size=wheel.clientWidth,height=wheel.clientHeight,r=Math.min(size,height)*.365;positions=s.letters.map((l,i)=>{const angle=-Math.PI/2+2*Math.PI*i/s.letters.length;return{x:size/2+Math.cos(angle)*r,y:height/2+Math.sin(angle)*r}});s.letters.forEach((l,i)=>{const b=document.createElement('button');b.className='letter';b.textContent=l;b.dataset.index=i;b.style.left=positions[i].x+'px';b.style.top=positions[i].y+'px';b.setAttribute('aria-label','Letter '+l);b.addEventListener('click',e=>{if(e.detail===0)select(i)});wheel.append(b)});drawSelection();}
function drawSelection(){document.querySelectorAll('.letter').forEach((b,i)=>{b.classList.toggle('selected',selection.includes(i));b.setAttribute('aria-pressed',selection.includes(i))});const text=selection.map(i=>s.letters[i]).join('');$('preview').textContent=text||'Swipe or tap to connect';$('preview').className='word-preview'+(text?'':' empty');$('path').setAttribute('points',BloomTrace.points(selection,positions,drag?.cursor));}
function select(i,fromDrag=false){if(s.over)return;selection=BloomTrace.follow(selection,i,!fromDrag);drawSelection();}
function clear(){selection=[];drawSelection()}
function submit(){if(s.over)return;const word=selection.map(i=>s.letters[i]).join('').toLowerCase();if(word.length!==s.letters.length){message(`Use all ${s.letters.length} letters for this level. No life lost.`);return}if(s.found.includes(word)){message('Already growing in your garden. Try another!');clear();return}if(!WORDS.has(word)){s.lives--;s.streak=0;clear();render();message(`${word.toUpperCase()} isn’t in the word list. ${s.lives} ${s.lives===1?'life':'lives'} left.`,'error');if(s.lives===0){s.over=true;save();endGame()}return}s.score+=word.length*10*Math.min(3,1+Math.floor(s.streak/3));s.streak++;s.found.push(word);s.stageCount++;preferences.best=Math.max(preferences.best,s.score);let msg=`${word.toUpperCase()} · lovely find!`;if(s.stageCount>=quota(s.letters.length)){if(s.letters.length<9){const newLetter=addLetter();msg=`✦ ${newLetter} joined your letters! ${s.letters.length===4?'Shuffle unlocked.':s.letters.length===5?'Hints unlocked.':s.letters.length===6?'Night theme unlocked.':'Keep growing.'}`}else{s.round++;s.letters=playableSeeds[Math.floor(random()*playableSeeds.length)].split('');s.found=[];s.stageCount=0;s.hints=3;msg=`✳ Garden ${s.round}! Fresh letters, same score and lives.`}}clear();render();message(msg,'good');if(navigator.vibrate)navigator.vibrate(20)}
function modal(html){$('modal').innerHTML=html;$('overlay').classList.remove('hidden');$('modal').querySelector('button')?.focus()}
function closeModal(){$('overlay').classList.add('hidden')}
function endGame(){const missed=possible().slice(0,5);modal(`<div style="font-size:38px">✳</div><div class="eyebrow">Your garden grew beautifully</div><h2>A little pause.<br>A new beginning.</h2><div class="modal-score">${s.score}</div><div class="eyebrow">points · ${s.found.length} words this garden</div><p>${missed.length?'A few words you could have found: <b>'+missed.join(', ').toUpperCase()+'</b>.':'A fresh set of letters is waiting.'}</p><button class="submit" id="again">${mode==='daily'?'Practise today’s seed':'Grow again'} ↗</button><button class="restart" id="dismiss">View my garden</button>`);$('again').onclick=()=>{fresh(mode);closeModal();render();message('A fresh garden. Make it yours.')};$('dismiss').onclick=closeModal}
function restart(){modal('<div style="font-size:35px">↻</div><h2>Plant a fresh seed?</h2><p>This restarts your current run. Your personal best and unlocked themes stay yours.</p><button class="submit" id="confirm-reset">Start fresh</button><button class="restart" id="cancel-reset">Keep playing</button>');$('confirm-reset').onclick=()=>{fresh(mode);closeModal();render();message('Your next word adventure starts here.')};$('cancel-reset').onclick=closeModal}
function pointerPoint(e){const rect=$('wheel').getBoundingClientRect();return{x:e.clientX-rect.left,y:e.clientY-rect.top}}
function pointerHit(e){const radius=($('wheel').querySelector('.letter')?.offsetWidth||56)/2+4;return BloomTrace.hit(pointerPoint(e),positions,radius)}
function pointerStart(e){
  if(drag||s.over||e.button>0)return;
  const b=e.target.closest('.letter');if(!b)return;e.preventDefault();
  const i=Number(b.dataset.index);
  drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,moved:false,last:i,before:[...selection],cursor:pointerPoint(e)};
  select(i);$('wheel').setPointerCapture(e.pointerId);drawSelection();
}
function pointerMove(e){
  if(!drag||drag.id!==e.pointerId)return;
  if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>8)drag.moved=true;
  drag.cursor=pointerPoint(e);const i=pointerHit(e);
  if(i>=0&&i!==drag.last)select(i,true);
  drag.last=i;drawSelection();
}
function pointerEnd(e){
  if(!drag||drag.id!==e.pointerId)return;
  const action=BloomTrace.release(drag.moved,pointerHit(e),selection.length);drag=null;
  if(action==='cancel'){clear();message('Selection cleared. No life lost.');}
  else if(action==='submit')submit();
  drawSelection();
}
function pointerCancel(e){if(drag&&drag.id===e.pointerId){selection=drag.before;drag=null;drawSelection()}}
$('wheel').addEventListener('pointerdown',pointerStart);
$('wheel').addEventListener('pointermove',pointerMove);
$('wheel').addEventListener('pointerup',pointerEnd);
$('wheel').addEventListener('pointercancel',pointerCancel);
$('wheel').addEventListener('lostpointercapture',pointerCancel);
$('clear').onclick=clear;$('submit').onclick=submit;$('shuffle').onclick=()=>{if(s.letters.length<4||s.over)return;for(let i=s.letters.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[s.letters[i],s.letters[j]]=[s.letters[j],s.letters[i]]}selection=[];render();message('A new perspective. Same possibilities.')};
$('hint').onclick=()=>{if(s.letters.length<5||s.hints<1||s.over)return;const words=possible().sort((a,b)=>a.length-b.length||a.localeCompare(b));if(!words.length){message('You found everything!');return}s.hints--;const word=words[Math.floor(random()*Math.min(20,words.length))];render();message(`Look for ${word[0].toUpperCase()}${' _'.repeat(word.length-1)} · ${word.length} letters`)};
$('help').onclick=()=>{modal('<div style="font-size:35px">✳</div><h2>Let your words grow.</h2><p>Start with <b>3 random letters</b>. Swipe across letters to submit a word, or tap them and press Check word.<br><br>Use <b>every tile exactly once</b>: 3 tiles means 3-letter words, 4 tiles means 4-letter words, and so on. The goal adapts to the available full-length words, so a level never asks for impossible answers. Trace back to undo letters. Release away from a tile to cancel.<br><br>You have <b>3 lives for the whole run</b>. Wrong words cost a life; repeats and short entries don’t. Every 3 correct words in a row raises your bonus, up to ×3.<br><br>At 9 letters, completing the goal plants a new garden and keeps your score and lives. Daily seed gives everyone the same starting puzzle for their local date.<br><br>Keyboard: type letters, Backspace to undo, Enter to check. This version uses a built-in English dictionary, including some uncommon words.</p><button class="submit" id="got-it">Let’s play ↗</button>');$('got-it').onclick=closeModal};
$('restart').onclick=restart;$('mobile-reset').onclick=restart;$('classic').onclick=()=>load('classic');$('daily').onclick=()=>{load('daily');message('Today’s seed · '+dayKey()+'. Your run saves separately.')};
document.querySelectorAll('.theme-btn').forEach(b=>b.onclick=()=>{if(b.dataset.theme==='night'&&!preferences.night){message('Reach 6 letters to unlock Night forever.');return}preferences.theme=b.dataset.theme;render()});
document.addEventListener('keydown',e=>{if(!$('overlay').classList.contains('hidden')){if(e.key==='Escape')closeModal();return}if(e.key==='Enter'){e.preventDefault();submit()}else if(e.key==='Backspace'){e.preventDefault();selection.pop();drawSelection()}else if(e.key==='Escape')clear();else if(/^[a-z]$/i.test(e.key)){const i=s.letters.findIndex((l,j)=>l===e.key.toUpperCase()&&!selection.includes(j));if(i>=0)select(i)}});
window.addEventListener('resize',drawWheel);load('classic');if(!s.over)message(s.found.length?'Welcome back. Your garden is right here.':'3 letters. 3 lives. Let’s grow something.');
$('garden-open').onclick=()=>{modal('<div class="eyebrow">YOUR WORD GARDEN</div><h2>'+s.found.length+' words found</h2><div class="words">'+s.found.map(w=>'<span class="chip">'+w.toUpperCase()+'</span>').join('')+'</div><p>Personal best: <b>'+preferences.best+'</b> points<br>Garden '+s.round+' · '+s.letters.length+' letters</p><button class="submit" id="back-game">Keep growing ↗</button>');$('back-game').onclick=closeModal};
$('style-open').onclick=()=>{modal('<div class="eyebrow">MAKE IT YOURS</div><h2>Your atmosphere</h2><div class="theme-row"><button class="theme-btn" id="pick-garden"><span class="theme-dot" style="background:#b8cf8b"></span>Garden</button><button class="theme-btn" id="pick-peach"><span class="theme-dot" style="background:#dfa289"></span>Peach</button><button class="theme-btn" id="pick-night"><span class="theme-dot" style="background:#354657"></span>Night '+(preferences.night?'':'🔒')+'</button></div><p>Shuffle opens at 4 letters. Hints at 5. Reach 6 letters to unlock Night forever.<br><br>Progress saves automatically on this device.</p><button class="submit" id="style-done">Back to my garden</button>');for(const theme of ['garden','peach','night'])$('pick-'+theme).onclick=()=>{if(theme==='night'&&!preferences.night){$('pick-night').textContent='Reach 6 letters';return}preferences.theme=theme;render()};$('style-done').onclick=closeModal};
