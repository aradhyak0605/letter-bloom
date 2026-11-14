const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({console,Math,Date,Set,localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{},BloomTrace:require('../dist/gestures.js'),document:{getElementById:()=>({})}});
const code=fs.readFileSync('dist/game.js','utf8').split("$('wheel').addEventListener")[0];
vm.runInContext(fs.readFileSync('dist/words.js','utf8')+'\n'+code+'\nrender=()=>{};clear=()=>{selection=[]};message=()=>{};endGame=()=>{};save=()=>{};',ctx);
const run=x=>vm.runInContext(x,ctx);
run("fresh('classic');s.letters=['E','A','T'];selection=[0,1,2];submit()");assert.equal(run('s.score'),30);assert.equal(run('s.lives'),3);
run('selection=[0,1,2];submit()');assert.equal(run('s.score'),30);assert.equal(run('s.lives'),3);
run('selection=[0];submit()');assert.equal(run('s.lives'),3);
run('selection=[1,2,0];submit();selection=[2,0,1];submit()');assert.equal(run('s.letters.length'),4);assert.equal(run('s.stageCount'),0);assert.equal(run("['E','A','T'].every(c=>s.letters.includes(c))"),true);
run("fresh('classic');s.letters=['X','Z','Q'];selection=[0,1,2];submit();selection=[0,1,2];submit();selection=[0,1,2];submit()");assert.equal(run('s.lives'),0);assert.equal(run('s.over'),true);run('selection=[0,1,2];submit()');assert.equal(run('s.lives'),0);
assert.equal(run("canSpell('tree',['T','R','E'])"),false);assert.equal(run("canSpell('tree',['T','R','E','E'])"),true);
run("fresh('classic');s.letters=['E','A','T','S'];selection=[0,1,2];submit()");assert.equal(run('s.score'),0);assert.equal(run('s.lives'),3);assert.equal(run('s.stageCount'),0);
run('selection=[2,0,1,3];submit()');assert.equal(run('s.score'),40);
assert.equal(run('possible().every(w=>w.length===s.letters.length)'),true);
for(let i=0;i<100;i++){
  run("fresh('classic')");
  for(let n=3;n<=9;n++){
    assert.ok(run('possible().length>=quota()&&quota()>0'));
    assert.equal(run('possible().every(w=>w.length===s.letters.length)'),true);
    run('s.found.push(...possible().slice(0,quota()))');
    if(n<9){const before=run('s.letters.join("")');run('addLetter()');assert.equal(run('s.letters.slice(0,-1).join("")'),before)}
  }
}
run("fresh('daily');globalThis.seedA=s.letters.join('');fresh('daily')");assert.equal(run('s.letters.join("")'),run('seedA'));
console.log('PASS: scoring, duplicate/short protection, third-miss game over, tile multiplicity, random growth preservation, 100 solvable exact-length full runs, shorter words rejected without penalty, daily seed.');

// Regression: partial drags used to survive pointerup and poison the next word.
run("pointerHit=()=>1;pointerPoint=()=>({x:0,y:0});drawSelection=()=>{};fresh('classic');s.letters=['E','A','T'];selection=[0,1];drag={id:7,moved:true,startedAt:Date.now(),start:0,before:[]};pointerEnd({pointerId:7})");
assert.equal(run('selection.length'),0);assert.equal(run('s.lives'),3);
run("selection=[0];drag={id:7,moved:false,startedAt:Date.now()-500,start:0,before:[]};pointerEnd({pointerId:7})");assert.equal(run('selection.length'),0);
run("selection=[0,1];drag={id:7,before:[0]};pointerCancel({pointerId:7})");assert.equal(run('selection.length'),0);
run("selection=[2];drag={id:7,moved:false,start:0,startX:0,startY:0,last:0};pointerMove({pointerId:7,clientX:20,clientY:20})");assert.equal(run('selection.includes(2)'),false);
console.log('PASS: partial release, long hold, cancellation and new-swipe stale-selection regression.');
