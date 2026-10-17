import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const PROJECT=path.resolve(ROOT,'../..');
const transcript=JSON.parse(fs.readFileSync(path.join(ROOT,'assets/transcript.json')));
const words=transcript.words,D=1631/30,FPS=30;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const norm=s=>s.toLowerCase().replace(/[^a-z0-9']/g,'');
const frame=s=>Math.round(s*FPS)/FPS;
function anchor(phrase){
 const tokens=phrase.split(/\s+/).map(norm);
 const i=words.findIndex((w,i)=>tokens.every((t,j)=>norm(words[i+j]?.text??'')===t));
 if(i<0)throw Error('Missing anchor: '+phrase);
 return words[i].start;
}
const textGroups=[
 'My YouTube channel on AI automation',
 'has over a million subscribers.',
 'And the most frequent comments',
 'people make across the',
 'five hundred and twenty-six videos',
 'on the channel',
 "aren't technical questions",
 'about which tools or workflows to use.',
 'They ask about how to actually',
 'make money with their AI skills.',
 'These people get stuck in a loop',
 'where they keep using their time',
 'to learn new things',
 'and dive into the latest tools',
 'and the latest models',
 'instead of using the skills and knowledge',
 'that they already have',
 'to actually make money.',
 'Because it feels easier to learn more',
 'than it does to risk being',
 'ignored or rejected by other people.',
 'So this SOP right here',
 'cuts through all the overthinking',
 'and makes it feel just as good',
 'to sell as it does to learn.',
 "It'll show you",
 'the one-sentence pitch that works today,',
 'how to build credibility',
 'with zero case studies,',
 'the exact outreach messages',
 'that land projects.',
 'This SOP has been used',
 'by hundreds of builders',
 'to close their first client deal,',
 'and most of them did it',
 'within thirty days',
 'of getting their hands on this SOP.',
 'So click the link,',
 'enter your email,',
 'download the SOP,',
 'and get your first client'
];
let cursor=0;
const captions=textGroups.map(text=>{
 const count=text.split(' ').length,span=words.slice(cursor,cursor+count);cursor+=count;
 if(span.map(w=>w.text).join(' ')!==text)throw Error('Caption mismatch: '+text);
 return {text,start:span[0].start,end:span.at(-1).end,words:span};
});
if(cursor!==words.length)throw Error('Caption words missing');
captions.forEach((c,i)=>c.end=Math.min(c.end+.16,captions[i+1]?.start??D));
fs.writeFileSync(path.join(ROOT,'captions.json'),JSON.stringify(captions,null,2));
const clock=s=>{const m=Math.round(s*1000);return `${String(Math.floor(m/3600000)).padStart(2,'0')}:${String(Math.floor(m/60000)%60).padStart(2,'0')}:${String(Math.floor(m/1000)%60).padStart(2,'0')},${String(m%1000).padStart(3,'0')}`;};
for(const shape of ['16x9','9x16'])fs.writeFileSync(path.join(PROJECT,'captions',`CHECKPOINT-3_First-AI-Client-SOP_${shape}.srt`),captions.map((c,i)=>`${i+1}\n${clock(c.start)} --> ${clock(c.end)}\n${c.text}\n`).join('\n'));
const paths={
 book:'<path d="M24 10C15 5 7 7 5 9v29c5-3 12-2 19 2 7-4 14-5 19-2V9c-4-2-11-3-19 1Zm0 0v30"/>',
 message:'<path d="M10 9h28a5 5 0 0 1 5 5v17a5 5 0 0 1-5 5H22L11 43v-7a6 6 0 0 1-6-6V14a5 5 0 0 1 5-5Z"/><path d="M14 19h20M14 26h14"/>',
 arrow:'<path d="M8 24h31M27 12l12 12-12 12"/>',
 check:'<path d="m12 24 8 8 17-19"/>',
 target:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="2"/>',
 document:'<path d="M12 5h16l10 10v28H12Z M28 5v11h10M19 25h12M19 32h12"/>',
 play:'<rect x="5" y="10" width="38" height="28" rx="9"/><path d="m20 17 11 7-11 7Z"/>',
 loop:'<path d="M39 19A16 16 0 0 0 10 13L5 20m0-11v11h11M9 29a16 16 0 0 0 29 6l5-7m0 11V28H32"/>',
 shield:'<path d="m24 5 16 6v12c0 10-9 17-16 20-7-3-16-10-16-20V11Z"/><path d="m16 23 6 6 11-12"/>',
 download:'<path d="M24 5v26m-9-9 9 9 9-9M8 33v10h32V33"/>',
 people:'<circle cx="18" cy="15" r="7"/><path d="M5 41v-5a13 13 0 0 1 26 0v5M31 8a7 7 0 0 1 0 14m5 7a11 11 0 0 1 7 11"/>'
};
const icon=k=>`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[k]}</svg>`;
const row=(id,k,title,subtitle,i)=>`<div id="${id}" class="glass benefit"><span class="icon">${icon(k)}</span><div><strong>${title}</strong><small>${subtitle}</small></div>${i?`<span class="number">0${i}</span>`:''}</div>`;
const specs=[
 {id:'reach',start:0,anchor:'My YouTube channel',eyebrow:'AI automation',title:['Nate Herk','on YouTube.'],ui:`<div id="reach-stat" class="glass metric-panel"><div class="stat-icon">${icon('play')}</div><div><strong class="stat-value">1M+</strong><span class="stat-label">YouTube subscribers</span></div></div>`},
 {id:'comments',anchor:'And the most frequent comments',eyebrow:'On the channel',title:['One recurring','question.'],ui:`<div id="video-count" class="glass metric-panel"><div class="stat-icon">${icon('message')}</div><div><strong class="stat-value medium">526</strong><span class="stat-label">videos on the channel</span></div></div><div id="tool-tags" class="tags"><span>Tools</span><span>Workflows</span></div>`},
 {id:'income',anchor:'They ask about how',eyebrow:'The real question',title:['Turn AI skills','into income.'],ui:`<div class="glass bridge-panel"><div class="bridge-item">${icon('book')}<strong>AI skills</strong></div><div class="bridge">${icon('arrow')}</div><div class="bridge-item">${icon('people')}<strong>Real clients</strong></div></div>`},
 {id:'loop',anchor:'These people get stuck',eyebrow:'The learning loop',title:['Always learning.','Still waiting.'],ui:`<div class="loop-cards"><div class="glass loop-card" id="learn-new">${icon('book')}<strong>Learn</strong><small>New things</small></div><div class="glass loop-card" id="new-tools">${icon('loop')}<strong>Explore</strong><small>New tools</small></div><div class="glass loop-card" id="new-models">${icon('target')}<strong>Repeat</strong><small>New models</small></div></div><div id="use-skills" class="glass quiet-callout">Use what you already know.</div>`},
 {id:'fear',anchor:'Because it feels easier',eyebrow:'What keeps the loop going',title:['Learning','feels safer.'],ui:`<div class="fear-cards"><div class="glass fear-card">${icon('book')}<strong>Learn more</strong><small>Feels familiar</small></div><div class="glass fear-card">${icon('shield')}<strong>Reach out</strong><small>Risk rejection</small></div></div>`},
 {id:'solution',anchor:'So this SOP right here',eyebrow:'First AI Client SOP',title:['Less overthinking.','More action.'],ui:`<div class="concepts"><div class="glass learn-card">${icon('book')}<strong>Learn</strong></div><div class="bridge">${icon('arrow')}</div><div class="glass sell-card"><div class="symbol">${icon('message')}</div><strong>Put it to work.</strong><small>A clear next step<br>toward your first client.</small><div class="sheen" data-layout-allow-overflow></div></div></div>`},
 {id:'benefits',anchor:"It'll show you",eyebrow:'Inside the SOP',title:['Make your','next move.'],ui:`<div class="benefits">${row('pitch','target','One-sentence pitch','That works today',1)}${row('credibility','check','Build credibility','With zero case studies',2)}${row('outreach','message','Outreach messages','That land projects',3)}</div>`},
 {id:'outcomes',anchor:'This SOP has been used',eyebrow:'First AI Client SOP',title:['From AI skills','to a first client.'],ui:`<div class="benefits outcome-rows">${row('builders','people','Hundreds of builders','Have used the SOP to close a first deal')}${row('thirty-days','check','Most within 30 days','Of getting the SOP')}</div>`},
 {id:'cta',anchor:'So click the link',eyebrow:'Your next step',title:['Get the free','First Client SOP.'],ui:`<div class="glass cta-card"><div class="download-symbol">${icon('download')}</div><div><strong>Download the SOP</strong><small>Click the link · Enter your email</small></div></div><div class="cta-note">Put your AI skills to work.</div>`}
];
specs.forEach((s,i)=>{s.word_start=anchor(s.anchor);if(i)s.start=frame(s.word_start-.2);s.end=specs[i+1]?.start??D;});
specs.forEach((s,i)=>{s.end=i<specs.length-1?Math.min(D,specs[i+1].start+.30):D;});
const beats=[];
function at(id,phrase,lead=.2){const word_start=anchor(phrase),start=frame(word_start-lead);beats.push({id,phrase,word_start,start,lead:word_start-start});return start;}
const tCount=at('video-count','five hundred and twenty-six'),tTags=at('tool-tags',"aren't technical questions"),tUse=at('use-skills','instead of using'),tPitch=at('pitch','the one-sentence pitch',.04),tCred=at('credibility','how to build credibility'),tOut=at('outreach','the exact outreach messages'),tBuilders=at('builders','hundreds of builders',.35),tDays=at('thirty-days','and most of them did it');
const extraCSS=`
.caption{opacity:0}#solution h1{font-size:78px;letter-spacing:-3.7px}
.metric-panel{height:267px;width:806px;padding:31px 38px;display:flex;align-items:center;gap:34px}.stat-icon{width:105px;height:105px;display:grid;place-items:center;border-radius:27px;color:#75c9f3;background:rgba(117,201,243,.08)}.stat-icon svg{width:65px;height:65px}.stat-value{display:block;font-size:128px;font-weight:600;letter-spacing:-7px;line-height:1.05;font-variant-numeric:tabular-nums}.stat-value.medium{font-size:106px;letter-spacing:-5px}.stat-label{display:block;font-size:29px;color:#b5c3d4;line-height:1.4;margin-top:6px;letter-spacing:-.7px}
.tags{display:flex;gap:16px;margin-top:18px}.tags span{padding:9px 21px;border:1px solid rgba(181,195,212,.2);border-radius:15px;color:#b5c3d4;font-size:24px}
.bridge-panel{width:806px;height:282px;display:flex;align-items:center;justify-content:center;gap:52px}.bridge-item{display:flex;flex-direction:column;align-items:center;gap:24px;width:230px}.bridge-item svg{width:69px;height:69px;color:#75c9f3}.bridge-item strong{font-size:33px;font-weight:500;letter-spacing:-.9px}
.loop-cards{display:flex;gap:17px;width:806px}.loop-card{width:257px;height:212px;padding:26px;display:flex;flex-direction:column;gap:9px}.loop-card svg{width:45px;height:45px;color:#75c9f3;margin-bottom:7px}.loop-card strong{font-size:31px;font-weight:530;letter-spacing:-.7px}.loop-card small{font-size:24px;color:#b5c3d4}.quiet-callout{width:806px;margin-top:24px;font-size:30px;font-weight:480;padding:24px 30px;letter-spacing:-.6px;text-align:center}
.fear-cards{display:flex;gap:24px;width:806px}.fear-card{width:391px;height:274px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}.fear-card svg{width:65px;height:65px;color:#75c9f3}.fear-card strong{font-size:35px;font-weight:530;letter-spacing:-1px}.fear-card small{font-size:25px;color:#b5c3d4}
.outcome-rows{gap:24px}.outcome-rows .benefit{height:132px}.outcome-rows .benefit strong{font-size:32px}.outcome-rows .benefit small{font-size:23px}
.cta-card{width:806px;min-height:207px;padding:34px;display:flex;align-items:center;gap:27px;background:linear-gradient(135deg,rgba(59,109,143,.43),rgba(33,64,88,.23))}.download-symbol{width:82px;height:82px;flex-shrink:0;display:grid;place-items:center;background:rgba(117,201,243,.09);border-radius:24px;color:#75c9f3}.download-symbol svg{width:47px;height:47px}.cta-card strong{display:block;font-size:39px;letter-spacing:-1.2px;font-weight:560;line-height:1.2}.cta-card small{display:block;font-size:24px;line-height:1.4;color:#b5c3d4;margin-top:16px;letter-spacing:-.35px}.cta-note{font-size:27px;color:#b5c3d4;margin-top:26px;letter-spacing:-.6px}
`;
const verticalExtra=`
#solution h1{font-size:78px;letter-spacing:-3.3px}.metric-panel,.bridge-panel,.loop-cards,.quiet-callout,.fear-cards,.cta-card{width:830px}.metric-panel{height:260px}.stat-value{font-size:128px}.stat-label{font-size:30px}.tags{justify-content:center}.loop-card{width:266px}.quiet-callout{font-size:30px;padding:21px;margin-top:23px}.fear-card{width:403px}.outcome-rows .benefit{height:132px}.outcome-rows .benefit strong{font-size:32px}.outcome-rows .benefit small{font-size:23px}.cta-note{text-align:center}.cta-card small{font-size:24px}.cta-card strong{font-size:39px}
`;
const allAnimations=[];
const enter=(target,from,start,duration=.6,ease='power3.out')=>allAnimations.push(`tl.from(${JSON.stringify(target)},${JSON.stringify({...from,duration,ease})},${frame(start)});`);
for(let i=0;i<specs.length;i++){
 const s=specs[i];
 if(i){const prev=specs[i-1];allAnimations.push(`tl.to('#${prev.id}',{x:-22,opacity:0,filter:'blur(10px)',duration:${8/30},ease:'power2.inOut'},${s.start});`);enter('#'+s.id,{x:26,opacity:0,filter:'blur(11px)'},s.start,.6);}
 enter(`#${s.id} .eyebrow`,{y:9,opacity:0},s.start+(i?.066667:.1),.5,'power2.out');
 allAnimations.push(`tl.from('#${s.id} h1 span',{y:17,opacity:0,filter:'blur(5px)',duration:${20/30},stagger:.1,ease:'expo.out'},${frame(s.start+(i?.233333:.133333))});`);
}
enter('#reach-stat',{y:22,opacity:0},.6,22/30);
enter('#video-count',{y:22,opacity:0},tCount,22/30);
enter('#tool-tags',{y:14,opacity:0},tTags,.6,'sine.out');
enter('#income .bridge-panel',{y:22,opacity:0},specs[2].start+.4,.6);
enter('#learn-new',{x:-16,rotation:-3,opacity:0},specs[3].start+.5,22/30);
enter('#new-tools',{y:18,opacity:0},specs[3].start+.7,22/30,'power2.out');
enter('#new-models',{x:16,rotation:3,opacity:0},specs[3].start+.9,22/30,'sine.out');
enter('#use-skills',{y:18,opacity:0},tUse,.6,'sine.out');
allAnimations.push(`tl.from('#fear .fear-card',{y:20,opacity:0,duration:.7,stagger:.166667,ease:'power3.out'},${frame(specs[4].start+.433333)});`);
enter('#solution .learn-card',{x:-17,rotation:-7,opacity:0},specs[5].start+.3,22/30);
enter('#solution .bridge',{scale:.88,opacity:0},specs[5].start+.5,.5,'sine.out');
enter('#solution .sell-card',{y:22,opacity:0},specs[5].start+19/30,22/30);
allAnimations.push(`tl.to('#solution .sheen',{x:690,duration:${50/30},ease:'sine.inOut'},${frame(specs[5].start+2.2)});`);
enter('#pitch',{y:20,opacity:0},tPitch,.7);
enter('#credibility',{x:18,opacity:0},tCred,20/30,'power2.out');
enter('#outreach',{y:18,opacity:0},tOut,.7,'sine.out');
enter('#builders',{y:18,opacity:0},tBuilders,.7);
enter('#thirty-days',{x:18,opacity:0},tDays,.7,'sine.out');
enter('#cta .cta-card',{y:20,opacity:0},specs[8].start+.433333,22/30);
enter('#cta .cta-note',{y:12,opacity:0},specs[8].start+.6,.5,'sine.out');
allAnimations.push(`tl.to('.ambient',{x:20,opacity:.88,duration:${D},ease:'sine.inOut'},0);`);
const baseCSS=fs.readFileSync(path.join(ROOT,'approved-base.css'),'utf8');
const portraitCSS=fs.readFileSync(path.join(ROOT,'approved-portrait.css'),'utf8');
for(const format of ['landscape','portrait']){
 const dir=path.join(ROOT,format),assets=path.join(dir,'assets');fs.mkdirSync(assets,{recursive:true});
 for(const name of ['speaker.mp4','speaker-poster.jpg','Inter-Variable.ttf','gsap.min.js','ais-official-mark.png','transcript.json'])fs.copyFileSync(path.join(ROOT,'assets',name),path.join(assets,name));
 fs.copyFileSync(path.join(ROOT,'DESIGN.md'),path.join(dir,'DESIGN.md'));
 const portrait=format==='portrait',width=portrait?1080:1920,height=portrait?1920:1080;
 const scenes=specs.map((s,i)=>`<section id="${s.id}" class="scene clip" data-start="${s.start}" data-duration="${s.end-s.start}" data-track-index="${3+i}" data-anchor="${esc(s.anchor)}"><div class="scene-inner"><div class="eyebrow">${s.eyebrow}</div><h1>${s.title.map(t=>`<span>${t}</span>`).join('')}</h1><div class="ui"><div class="reflection"></div>${s.ui}</div></div></section>`).join('\n');
 const caps=captions.map((c,i)=>`<div id="cap${i}" class="caption clip" data-start="${c.start}" data-duration="${c.end-c.start}" data-track-index="${30+Math.floor(i/8)}"><span>${esc(c.text)}</span></div>`).join('\n');
 const animation=`const tl=gsap.timeline({paused:true});\n${allAnimations.join('\n')}\nconst captions=${JSON.stringify(captions.map(({start,end})=>({start,end})))};captions.forEach((c,i)=>{tl.set('#cap'+i,{opacity:1},c.start);tl.set('#cap'+i,{opacity:0},c.end);});tl.to({}, {duration:${D}},0);window.__timelines=window.__timelines||{};window.__timelines.main=tl;const q=new URLSearchParams(location.search);if(q.has('t')){const t=Number(q.get('t'));tl.seek(t);document.querySelectorAll('.clip').forEach(el=>{const a=Number(el.dataset.start),b=a+Number(el.dataset.duration);el.style.visibility=t>=a&&t<b?'visible':'hidden';});}`;
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=${width},height=${height}"><title>SOP Ad · Dark White Glass · ${format}</title><script src="assets/gsap.min.js"></script><style>${baseCSS}${extraCSS}${portrait?portraitCSS+verticalExtra:''}</style></head><body><main id="main" data-composition-id="main" data-start="0" data-duration="${D}" data-width="${width}" data-height="${height}"><div class="ambient"></div><div class="brand"><img class="brand-logo" src="assets/ais-official-mark.png" alt="AI Automation Society"><span class="rule"></span><small>Free SOP</small></div><div class="header-note">First AI Client</div><div class="speaker-window"><video id="speaker" src="assets/speaker.mp4" poster="assets/speaker-poster.jpg" muted playsinline data-start="0" data-duration="${D}" data-track-index="0"></video></div><div class="speaker-edge"></div><audio id="speech" src="assets/speaker.mp4" data-start="0" data-duration="${D}" data-track-index="1" data-volume="1"></audio>${scenes}${caps}</main><script>${animation}</script></body></html>`;
 fs.writeFileSync(path.join(dir,'index.html'),html);
 fs.writeFileSync(path.join(dir,'hyperframes.json'),JSON.stringify({paths:{assets:'assets',blocks:'compositions'}},null,2));
 fs.writeFileSync(path.join(dir,'meta.json'),JSON.stringify({id:`ais-sop-${format}`,name:`First AI Client SOP · ${format}`},null,2));
 fs.mkdirSync(path.join(dir,'renders'),{recursive:true});
 fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:`ais-sop-${format}`,private:true,scripts:{dev:'hyperframes preview',check:'hyperframes lint && hyperframes validate && hyperframes inspect',render:'hyperframes render --quality standard --fps 30 --workers 2 --output renders/sop-render.mp4'}},null,2));
}
const checks=[...specs.map(s=>({id:s.id,phrase:s.anchor,start:s.start,word_start:s.word_start,lead:s.word_start-s.start})),...beats];
if(!checks.every(x=>x.lead>=-.2&&x.lead<=1.8))throw Error('Anchor timing failed');
fs.writeFileSync(path.join(ROOT,'scene-plan.json'),JSON.stringify(specs,null,2));
fs.writeFileSync(path.join(ROOT,'beat-sync.json'),JSON.stringify({status:'PASS',checks,caption_words:cursor,caption_groups:captions.length,cta_hold:D-specs.at(-1).start},null,2));
console.log(JSON.stringify({duration:D,scenes:specs.map(({id,start,end})=>({id,start,end})),caption_groups:captions.length,beat_sync:'PASS'},null,2));
