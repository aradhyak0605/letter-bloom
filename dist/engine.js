'use strict';
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
const familiar = new Set('act add age aid aim air ale all and ant any ape apt arc are ark arm art ash ask ate awe awl axe bad bag ban bar bat bay bed bee beg bet bid big bin bit boa bob bog boo bow box boy bra bud bug bun bus but buy cab cad cam can cap car cat cob cod cog con cop cot cow coy cry cub cue cup cur cut dab dad dam day den dew did die dig dim din dip dog dot dry dub due dug duo dye ear eat eel egg ego elk elm end era eve ewe eye fad fan far fat fax fed fee fen few fig fin fir fit fix flu fly foe fog for fox fry fun fur gag gal gap gas gel gem get gin god goo got gum gun gut guy gym had hag ham has hat hay hem hen her hey hid him hip his hit hob hog hop hot how hub hue hug hum hut ice icy ill imp ink inn ion ire its jam jar jaw jay jet jew jig job jog jot joy jug jut keg key kid kin kit lab lad lag lap law lay lea led leg let lid lie lip lit log lot low lug mad man map mar mat maw max may men met mid mix mob mod mom moo mop mow mud mug mum nab nag nap nay net new nib nil nip nit nod nor not now nun nut oak oar oat odd ode off oft oil old one opt orb ore our out owe owl own pad pal pan pap par pat paw pay pea peg pen pep per pet pew pie pig pin pip pit ply pod pop pot pow pro pry pub pug pun pup pus put rag ram ran rap rat raw ray red ref rep rib rid rig rim rip rob rod roe rot row rub rue rug rum run rut rye sac sad sag sap sat saw say sea see set sew she shy sin sip sir sit six ski sky sly sob sod son sop sow soy spa spy sty sub sue sum sun sup tab tad tag tan tap tar tax tea tee ten the tie tin tip toe ton too top tor tot tow toy try tub tug two use van vat vet via vie vow wad wag war was wax way web wed wee wet who why wig win wit woe wok won woo wow wry yak yam yap yea yen yes yet yew you zap zip zoo'.split(' '));
const playableSeeds=[...growthOptions.keys()].filter(k=>k.length===3 && wordGroups.get(k).length>=2 && wordGroups.get(k).some(w=>familiar.has(w))).sort();
function hash(t){let n=2166136261;for(const c of t)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0}
function random(){s.rng=(Math.imul(s.rng,1664525)+1013904223)>>>0;return s.rng/4294967296}
function possible(letters=s.letters,exclude=s.found){const found=new Set(exclude);return (wordGroups.get(signature(letters))||[]).filter(w=>!found.has(w))}
function quota(){return Math.min(s.letters.length===3?3:4,wordGroups.get(signature(s.letters)).length)}
function newLetters(previous=''){const pool=playableSeeds.filter(k=>k!==signature(previous));const letters=pool[Math.floor(random()*pool.length)].toUpperCase().split('');for(let i=letters.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[letters[i],letters[j]]=[letters[j],letters[i]]}return letters}
function addLetter(){const options=[...growthOptions.get(signature(s.letters))].sort();const l=options[Math.floor(random()*options.length)];s.letters.push(l);s.stageCount=0;s.hint=null;return l}
function hintTiles(){if(!s.hint)return [];const indices=[];for(const c of s.hint.word.slice(0,s.hint.revealed).toUpperCase()){indices.push(s.letters.findIndex((l,i)=>l===c&&!indices.includes(i)))}return indices}
function revealHint(){if(s.hints<1||s.over)return false;const options=possible();if(!options.length)return false;if(!s.hint||!options.includes(s.hint.word))s.hint={word:options[Math.floor(random()*options.length)],revealed:0};if(s.hint.revealed>=s.hint.word.length)return false;s.hint.revealed=Math.min(s.hint.word.length,s.hint.revealed+Math.ceil(s.letters.length/3));s.hints--;return true}
