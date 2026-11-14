const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({console,Math,Date,Set,localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{},document:{getElementById:()=>({})}});
const code=fs.readFileSync('dist/game.js','utf8').split("$('wheel').addEventListener")[0];
vm.runInContext(fs.readFileSync('dist/words.js','utf8')+'\n'+code+'\nrender=()=>{};clear=()=>{selection=[]};message=()=>{};endGame=()=>{};save=()=>{};',ctx);
const run=x=>vm.runInContext(x,ctx);
run("fresh('classic');s.letters=['E','A','T'];selection=[0,1,2];submit()");assert.equal(run('s.score'),30);assert.equal(run('s.lives'),3);
run('selection=[0,1,2];submit()');assert.equal(run('s.score'),30);assert.equal(run('s.lives'),3);
run('selection=[0];submit()');assert.equal(run('s.lives'),3);
run('selection=[1,2,0];submit();selection=[2,0,1];submit()');assert.equal(run('s.letters.length'),4);assert.equal(run('s.stageCount'),0);assert.equal(run("['E','A','T'].every(c=>s.letters.includes(c))"),true);
run("fresh('classic');s.letters=['X','Z','Q'];selection=[0,1,2];submit();selection=[0,1,2];submit();selection=[0,1,2];submit()");assert.equal(run('s.lives'),0);assert.equal(run('s.over'),true);run('selection=[0,1,2];submit()');assert.equal(run('s.lives'),0);
assert.equal(run("canSpell('tree',['T','R','E'])"),false);assert.equal(run("canSpell('tree',['T','R','E','E'])"),true);
for(let i=0;i<12;i++){run("fresh('classic')");for(let n=3;n<=9;n++){assert.ok(run('possible().length>=quota(s.letters.length)'));run('s.found.push(...possible().slice(0,quota(s.letters.length)))');if(n<9){const before=run('s.letters.join("")');run('addLetter()');assert.equal(run('s.letters.slice(0,-1).join("")'),before)}}}
run("fresh('daily');globalThis.seedA=s.letters.join('');fresh('daily')");assert.equal(run('s.letters.join("")'),run('seedA'));
console.log('PASS: scoring, duplicate/short protection, third-miss game over, tile multiplicity, random growth preservation, 12 solvable full runs, daily seed.');
