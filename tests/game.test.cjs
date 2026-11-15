const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const node={classList:{add(){},remove(){}},textContent:'',focus(){}};
const ctx=vm.createContext({console,Math,Date,Set,localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{},setTimeout:()=>{},BloomTrace:require('../dist/gestures.js'),document:{getElementById:()=>node}});
const code=fs.readFileSync('dist/game.js','utf8').split("$('back').onclick")[0];
vm.runInContext(fs.readFileSync('dist/words.js','utf8')+'\n'+fs.readFileSync('dist/engine.js','utf8')+'\n'+code+'\nrender=()=>{};drawSelection=()=>{};message=()=>{};persist=()=>{};sound=()=>{};celebrate=()=>{};dialog=()=>{};',ctx);
const run=x=>vm.runInContext(x,ctx);
run("fresh('classic');s.letters=['E','A','T'];selection=[0,1,2];submit()");assert.equal(run('s.score'),30);assert.equal(run('s.lives'),3);
run('selection=[0,1,2];submit()');assert.equal(run('s.score'),30);
run('selection=[0];submit()');assert.equal(run('s.lives'),3);
run('selection=[1,2,0];submit();selection=[2,0,1];submit()');assert.equal(run('s.letters.length'),4);
run("fresh('classic');s.letters=['X','Z','Q'];selection=[0,1,2];submit();selection=[0,1,2];submit();selection=[0,1,2];submit()");assert.equal(run('s.lives'),0);assert.equal(run('s.over'),true);
assert.equal(run("canSpell('tree',['T','R','E'])"),false);assert.equal(run("canSpell('tree',['T','R','E','E'])"),true);
for(let i=0;i<100;i++){run("fresh('classic')");for(let n=3;n<=9;n++){assert.ok(run('possible().length>=quota()&&quota()>0'));assert.equal(run('possible().every(w=>w.length===s.letters.length)'),true);run('s.found.push(...possible().slice(0,quota()))');if(n<9){const before=run('s.letters.join("")');run('addLetter()');assert.equal(run('s.letters.slice(0,-1).join("")'),before)}}}
run("fresh('daily');globalThis.seedA=s.letters.join('');fresh('daily')");assert.equal(run('s.letters.join("")'),run('seedA'));
assert.ok(run('playableSeeds.length')>100);const starts=new Set();let previous;for(let i=0;i<100;i++){run("fresh('classic')");const key=run('signature(s.letters)');assert.notEqual(key,previous);previous=key;starts.add(key)}assert.ok(starts.size>40);
run("fresh('adventure',1);s.letters=['S','T','A','R','E'];s.hint={word:'stare',revealed:0};revealHint()");assert.equal(run('s.hint.revealed'),2);run('revealHint()');assert.equal(run('s.hint.revealed'),4);run('revealHint()');assert.equal(run('s.hint.revealed'),5);assert.equal(run('s.hints'),0);assert.equal(run('revealHint()'),false);
run("s.letters=['T','R','E','E','S'];s.hint={word:'trees',revealed:5}");assert.equal(run('new Set(hintTiles()).size'),5);
run("pointerHit=()=>1;fresh('classic');s.letters=['E','A','T'];selection=[0,1];drag={id:7,moved:true,start:0};pointerEnd({pointerId:7})");assert.equal(run('selection.length'),0);assert.equal(run('s.lives'),3);
run("selection=[0];drag={id:7,moved:false,startedAt:Date.now()-500,start:0};pointerEnd({pointerId:7})");assert.equal(run('selection.length'),0);
run("selection=[0,1];drag={id:7};pointerCancel()");assert.equal(run('selection.length'),0);
// Complete every Adventure level by playing valid answers; verify unlocks and reward idempotence.
run('profile.stars={};profile.coins=0');
for(let id=1;id<=30;id++){run(`fresh('adventure',${id})`);let tries=0;while(!run('s.over')){assert.ok(tries++<100);run("var answer=possible()[0];selection=[];for(const c of answer.toUpperCase())selection.push(s.letters.findIndex((l,i)=>l===c&&!selection.includes(i)));submit()")}assert.equal(run(`profile.stars[${id}]`),3)}
assert.equal(run('starsTotal()'),90);run("fresh('adventure',1);s.over=true;globalThis.coinsBefore=profile.coins;finish(true)");assert.equal(run('profile.coins'),run('coinsBefore'));
run("fresh('daily');s.over=true;finish(true);globalThis.dailyCoins=profile.coins;finish(true)");assert.equal(run('profile.coins'),run('dailyCoins'));
console.log('PASS: 100 solvable Classic runs; 30 Adventure levels; exact-length rules; scoring, lives, duplicates; random diversity; deterministic Daily; progressive hints; repeated tiles; swipe cleanup; stars and one-time completion rewards. Starting sets:',run('playableSeeds.length'));

run("globalThis.saved={};localStorage.setItem=(k,v)=>saved[k]=v;localStorage.getItem=k=>saved[k]||null;showGame=()=>{};fresh('classic');s.score=123;s.letters=['E','A','T'];saved['bloom-run-v4-classic']=JSON.stringify(s);loadRun('classic')");assert.equal(run('s.score'),123);
run("delete saved['bloom-run-v4-classic'];saved['letter-bloom-v2-classic']=JSON.stringify(s);loadRun('classic')");assert.equal(run('s.score'),123);assert.equal(run('s.target'),10);
console.log('PASS: separate saved run restore and legacy Classic migration.');
