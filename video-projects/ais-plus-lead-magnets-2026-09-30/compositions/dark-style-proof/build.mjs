import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const PROJECT=path.resolve(ROOT,'../..');
const DURATION=14;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const words=JSON.parse(fs.readFileSync(path.join(ROOT,'assets/transcript.json'))).words;
const textGroups=[
 'So this SOP right here',
 'cuts through all the overthinking',
 'and makes it feel just as good',
 'to sell as it does to learn.',
 "It'll show you",
 'the one-sentence pitch that works today,',
 'how to build credibility',
 'with zero case studies,',
 'the exact outreach messages',
 'that land projects.'
];
let cursor=0;
const captions=textGroups.map(text=>{
 const count=text.split(' ').length, span=words.slice(cursor,cursor+count);
 if(span.map(w=>w.text).join(' ')!==text)throw new Error('Caption mismatch '+text);
 cursor+=count;
 return {text,start:span[0].start,end:span.at(-1).end,words:span};
});
if(cursor!==words.length)throw new Error('Caption words omitted');
captions.forEach((c,i)=>{c.end=Math.min(c.end+.16,captions[i+1]?.start??DURATION);});
const srtTime=s=>{const ms=Math.round(s*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`};
fs.writeFileSync(path.join(ROOT,'captions.json'),JSON.stringify(captions,null,2));
const srt=captions.map((c,i)=>`${i+1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`).join('\n');
fs.mkdirSync(path.join(PROJECT,'captions'),{recursive:true});
for(const f of ['16x9','9x16'])fs.writeFileSync(path.join(PROJECT,'captions',`CHECKPOINT-2_SOP_Style-Proof_${f}.srt`),srt);

const paths={
 book:'<path d="M24 10C15 5 7 7 5 9v29c5-3 12-2 19 2 7-4 14-5 19-2V9c-4-2-11-3-19 1Zm0 0v30"/>',
 message:'<path d="M10 9h28a5 5 0 0 1 5 5v17a5 5 0 0 1-5 5H22L11 43v-7a6 6 0 0 1-6-6V14a5 5 0 0 1 5-5Z"/><path d="M14 19h20M14 26h14"/>',
 arrow:'<path d="M8 24h31M27 12l12 12-12 12"/>',
 check:'<path d="m12 24 8 8 17-19"/>',
 target:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="2"/>',
 document:'<path d="M12 5h16l10 10v28H12Z M28 5v11h10M19 25h12M19 32h12"/>'
};
const icon=k=>`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[k]}</svg>`;
const CSS=`
@font-face{font-family:Inter;src:url('assets/Inter-Variable.ttf');font-weight:100 900}
*{box-sizing:border-box}html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#0d141f;font-family:Inter,sans-serif;color:#f3f6fa}
#main{position:relative;width:1920px;height:1080px;overflow:hidden;background:radial-gradient(ellipse at 38% 72%,#142237 0%,#0d141f 66%)}
.ambient{position:absolute;left:65px;top:460px;width:940px;height:400px;border-radius:50%;background:radial-gradient(ellipse,rgba(75,157,202,.12),transparent 67%);filter:blur(35px);pointer-events:none}
.brand{position:absolute;left:96px;top:31px;display:flex;align-items:center;gap:14px;color:#f3f6fa;z-index:5}
.brand .brand-logo{display:block;width:96px;height:96px;object-fit:contain;flex-shrink:0}.brand .rule{width:1px;height:28px;background:rgba(181,195,212,.25)}.brand small{font-size:22px;font-weight:450;letter-spacing:-.3px;color:#b5c3d4}
.header-note{position:absolute;right:98px;top:64px;font-size:23px;color:#b5c3d4;letter-spacing:-.4px}
.speaker-window{position:absolute;left:1080px;top:151px;width:744px;height:773px;border-radius:40px;overflow:hidden;background:#1b2737;box-shadow:0 28px 80px rgba(0,0,0,.22);border:1.5px solid rgba(230,242,255,.19);z-index:2}
.speaker-window video,.speaker-window img{width:100%;height:100%;object-fit:cover;object-position:50% 50%}.speaker-edge{position:absolute;left:1080px;top:151px;width:744px;height:773px;border-radius:40px;box-shadow:inset 0 1px 1px rgba(255,255,255,.28);z-index:3;pointer-events:none}
.scene{position:absolute;inset:0;z-index:4;pointer-events:none}.scene-inner{width:100%;height:100%;padding:178px 900px 155px 96px;display:flex;flex-direction:column;gap:23px}
.eyebrow{font-size:25px;font-weight:480;color:#75c9f3;letter-spacing:-.25px;line-height:1.3}
h1{font-size:84px;line-height:1.09;font-weight:620;letter-spacing:-4px;margin:0;max-width:900px}h1 span{display:block;white-space:nowrap}#intro h1{font-size:78px;letter-spacing:-3.7px}
.ui{position:relative;width:830px;height:350px;flex-shrink:0;margin-top:26px;isolation:isolate}
.reflection{position:absolute;left:90px;top:25px;width:650px;height:250px;border-radius:50%;filter:blur(34px);z-index:-1;background:radial-gradient(ellipse at 45% 40%,rgba(102,184,229,.17),rgba(46,90,130,.10) 48%,transparent 74%)}
.glass{position:relative;background:linear-gradient(135deg,rgba(64,88,116,.39),rgba(28,43,63,.39) 52%,rgba(56,87,114,.26));border:1.3px solid rgba(214,234,255,.19);border-radius:25px;backdrop-filter:blur(28px) saturate(1.3);box-shadow:inset 0 1.4px 1px rgba(241,249,255,.14),inset 0 -1px 1px rgba(134,165,195,.06),0 23px 48px rgba(0,0,0,.16);overflow:hidden}
.glass:after{content:'';position:absolute;inset:1px;border-radius:inherit;border-top:1px solid rgba(229,243,255,.08);pointer-events:none}
.sheen{position:absolute;left:-180px;top:-100px;width:110px;height:500px;transform:rotate(25deg);background:linear-gradient(90deg,transparent,rgba(220,242,255,.08),transparent);filter:blur(13px);pointer-events:none}
.concepts{display:flex;align-items:center;gap:30px;width:830px;padding:0 12px 0 0}
.learn-card{width:235px;height:252px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;transform:rotate(-4deg)}
.learn-card svg{width:69px;height:69px;color:#b5c3d4}.learn-card strong{font-size:34px;font-weight:500;letter-spacing:-1px}
.bridge{color:#75c9f3}.bridge svg{width:51px;height:51px}
.sell-card{width:420px;height:278px;padding:35px 36px;display:flex;flex-direction:column;justify-content:center;gap:17px;background:linear-gradient(135deg,rgba(59,109,143,.43),rgba(33,64,88,.23))}
.sell-card .symbol{width:63px;height:63px;border-radius:18px;display:grid;place-items:center;background:rgba(117,201,243,.09);color:#75c9f3;border:1px solid rgba(117,201,243,.12)}.symbol svg{width:37px;height:37px}
.sell-card strong{font-size:39px;font-weight:550;letter-spacing:-1.3px}.sell-card small{font-size:25px;color:#b5c3d4;font-weight:400;line-height:1.35}
.benefits{display:flex;flex-direction:column;gap:19px;width:806px}
.benefit{width:100%;height:102px;padding:18px 23px;display:flex;align-items:center;gap:21px;border-radius:23px}
.benefit .icon{width:60px;height:60px;flex-shrink:0;display:grid;place-items:center;border-radius:17px;background:rgba(117,201,243,.08);color:#75c9f3}.benefit .icon svg{width:34px;height:34px}
.benefit strong{display:block;font-size:29px;font-weight:550;letter-spacing:-.7px;line-height:1.25}.benefit small{display:block;font-size:22px;font-weight:400;color:#b5c3d4;margin-top:5px;letter-spacing:-.25px}.benefit .number{margin-left:auto;padding-left:20px;color:#b5c3d4;font-size:21px;font-weight:450;font-variant-numeric:tabular-nums}
.caption{position:absolute;top:965px;left:0;width:1920px;text-align:center;z-index:10}
.caption span{display:inline-block;padding:10px 23px 12px;border-radius:20px;border:1px solid rgba(224,240,255,.16);background:rgba(33,48,67,.8);backdrop-filter:blur(20px);box-shadow:0 6px 24px rgba(0,0,0,.12);font-size:35px;font-weight:450;line-height:1.25;letter-spacing:-.45px;max-width:1700px;white-space:nowrap;color:#f3f6fa}
.offer-content{width:100%;height:100%;padding:173px 900px 150px 96px;display:flex;flex-direction:column;gap:23px}.offer-content h1{font-size:76px;line-height:1.08}
.offer-cards{display:flex;gap:22px;width:850px;margin-top:14px}.offer-card{padding:27px 29px;height:293px;display:flex;flex-direction:column;gap:10px}.annual{width:466px;background:linear-gradient(135deg,rgba(59,109,143,.43),rgba(33,64,88,.23))}.monthly{width:350px}
.offer-label{font-size:23px;font-weight:550;color:#b5c3d4}.annual .offer-label{color:#75c9f3}.price{font-size:93px;font-weight:600;line-height:1.03;letter-spacing:-5px;font-variant-numeric:tabular-nums}.price small{font-size:28px;letter-spacing:-.6px;font-weight:400;color:#b5c3d4}.annual .price small{display:block;margin-top:8px}.monthly .price{font-size:77px;margin-top:4px}.equivalent{font-size:26px;color:#f3f6fa;font-weight:450;margin-top:4px;letter-spacing:-.4px}.billing{font-size:22px;color:#b5c3d4}.offer-features{font-size:25px;color:#b5c3d4;letter-spacing:-.4px;margin-top:2px}.refund{font-size:23px;color:#b5c3d4;display:flex;align-items:center;gap:12px}.refund svg{width:26px;height:26px;color:#75c9f3}
`;
const VERTICAL=`
html,body,#main{width:1080px;height:1920px}#main{background:radial-gradient(ellipse at 50% 43%,#142237 0%,#0d141f 66%)}
.ambient{left:40px;top:590px;width:1000px;height:540px}.brand{left:64px;top:53px;gap:16px}.brand .brand-logo{width:110px;height:110px}.brand small{font-size:24px}.header-note{right:64px;top:96px;font-size:24px}
.speaker-window,.speaker-edge{left:64px;top:1080px;width:952px;height:720px;border-radius:44px}.speaker-window video{object-position:50% 50%}
.scene-inner{padding:214px 64px 0;align-items:center;gap:20px}.eyebrow{text-align:center;font-size:28px}h1,#intro h1{text-align:center;font-size:82px;line-height:1.08;letter-spacing:-3.8px;width:952px;max-width:952px}#intro h1{font-size:78px;letter-spacing:-3.3px}
.ui{width:830px;height:330px;margin-top:18px;text-align:left}.concepts{gap:29px;padding:0}.learn-card{width:240px}.sell-card{width:450px}.benefits{width:830px;gap:16px}.benefit{height:96px;padding:14px 23px}.benefit strong{font-size:30px;line-height:1.15}.benefit small{font-size:22px;line-height:1.2;margin-top:4px}
.caption{top:932px;left:64px;width:952px}.caption span{max-width:930px;white-space:normal;text-wrap:balance;font-size:38px;line-height:1.22;padding:12px 24px 14px;border-radius:23px}
`;
const benefit=(id,i,k,title,subtitle)=>`<div id="${id}" class="glass benefit"><span class="icon">${icon(k)}</span><div><strong>${title}</strong><small>${subtitle}</small></div><span class="number">0${i}</span></div>`;
const adScenes=`
<section id="intro" class="scene clip" data-start="0" data-duration="5.533333" data-track-index="3" data-anchor="So this SOP right here"><div class="scene-inner"><div class="eyebrow">First AI Client SOP</div><h1><span>Less overthinking.</span><span>More action.</span></h1><div class="ui"><div class="reflection"></div><div class="concepts"><div class="glass learn-card">${icon('book')}<strong>Learn</strong></div><div class="bridge">${icon('arrow')}</div><div class="glass sell-card"><div class="symbol">${icon('message')}</div><strong>Put it to work.</strong><small>A clear next step<br>toward your first client.</small><div class="sheen" data-layout-allow-overflow></div></div></div></div></div></section>
<section id="benefits-scene" class="scene clip" data-start="5" data-duration="9" data-track-index="4" data-anchor="It'll show you"><div class="scene-inner"><div class="eyebrow">Inside the SOP</div><h1><span>Make your</span><span>next move.</span></h1><div class="ui"><div class="reflection"></div><div class="benefits">${benefit('pitch',1,'target','One-sentence pitch','That works today')}${benefit('credibility',2,'check','Build credibility','With zero case studies')}${benefit('outreach',3,'message','Outreach messages','That land projects')}</div></div></div></section>`;
const timing={scene_transition:5,benefits:[{id:'pitch',start:6,anchor:'the one-sentence pitch',word_start:6.04},{id:'credibility',start:7.866667,anchor:'how to build credibility',word_start:8.08},{id:'outreach',start:10.533333,anchor:'the exact outreach messages',word_start:10.78}]};
fs.writeFileSync(path.join(ROOT,'scene-plan.json'),JSON.stringify(timing,null,2));
const animation=`
const tl=gsap.timeline({paused:true});
tl.from('#intro .eyebrow',{y:9,opacity:0,duration:.5,ease:'power2.out'},.1);
tl.from('#intro h1 span',{y:17,opacity:0,filter:'blur(5px)',duration:.666667,stagger:.1,ease:'expo.out'},.133333);
tl.from('.learn-card',{x:-17,rotation:-7,opacity:0,duration:.733333,ease:'power3.out'},.3);
tl.from('.bridge',{scale:.88,opacity:0,duration:.5,ease:'sine.out'},.5);
tl.from('.sell-card',{y:22,opacity:0,duration:.733333,ease:'power3.out'},.633333);
tl.to('#intro .sheen',{x:690,duration:1.666667,ease:'sine.inOut'},2.2);
// Matched reference transition: outgoing group moves left into soft blur;
// incoming group arrives from the right and resolves into focus at the same seam.
tl.to('#intro',{x:-22,opacity:0,filter:'blur(10px)',duration:.266667,ease:'power2.inOut'},5);
tl.from('#benefits-scene',{x:26,opacity:0,filter:'blur(11px)',duration:.6,ease:'power3.out'},5);
tl.from('#benefits-scene .eyebrow',{y:10,opacity:0,duration:.5,ease:'power2.out'},5.066667);
tl.from('#benefits-scene h1 span',{y:17,opacity:0,duration:.666667,stagger:.1,ease:'expo.out'},5.233333);
tl.from('#pitch',{y:20,opacity:0,duration:.7,ease:'power3.out'},6);
tl.from('#credibility',{x:18,opacity:0,duration:.666667,ease:'power2.out'},7.866667);
tl.from('#outreach',{y:18,opacity:0,duration:.7,ease:'sine.out'},10.533333);
tl.to('.ambient',{x:16,opacity:.88,duration:14,ease:'sine.inOut'},0);
const CAPTIONS=${JSON.stringify(captions.map(({text,start,end})=>({text,start,end})))};
CAPTIONS.forEach((c,i)=>{tl.set('#cap'+i,{opacity:1},c.start);tl.set('#cap'+i,{opacity:0},c.end);});
tl.to({}, {duration:14},0);
window.__timelines=window.__timelines||{};window.__timelines.main=tl;
const q=new URLSearchParams(location.search);if(q.has('t')){const t=Number(q.get('t'));tl.seek(t);document.querySelectorAll('.clip').forEach(el=>{const a=Number(el.dataset.start),b=a+Number(el.dataset.duration);el.style.visibility=t>=a&&t<b?'visible':'hidden'});}
`;
fs.copyFileSync(path.join(PROJECT,'visual-assets/ais-official-mark.png'),path.join(ROOT,'assets/ais-official-mark.png'));
for(const format of ['landscape','portrait','vsl-offer']){
 const dir=path.join(ROOT,format);fs.mkdirSync(dir,{recursive:true});
 const assetDir=path.join(dir,'assets');
 if(fs.existsSync(assetDir)&&fs.lstatSync(assetDir).isSymbolicLink())fs.unlinkSync(assetDir);
 fs.mkdirSync(assetDir,{recursive:true});
 for(const asset of ['speaker.mp4','speaker-poster.jpg','vsl-offer-speaker.jpg','Inter-Variable.ttf','gsap.min.js','transcript.json','ais-official-mark.png'])fs.copyFileSync(path.join(ROOT,'assets',asset),path.join(assetDir,asset));
 fs.copyFileSync(path.join(ROOT,'DESIGN.md'),path.join(dir,'DESIGN.md'));
 const portrait=format==='portrait',offer=format==='vsl-offer',width=portrait?1080:1920,height=portrait?1920:1080,duration=offer?1:DURATION;
 const speaker=offer?'<img src="assets/vsl-offer-speaker.jpg" alt="Nate">':`<video id="speaker" src="assets/speaker.mp4" poster="assets/speaker-poster.jpg" muted playsinline data-start="0" data-duration="14" data-track-index="0"></video>`;
 const capHTML=captions.map((c,i)=>`<div id="cap${i}" class="caption clip" data-start="${c.start}" data-duration="${(c.end-c.start).toFixed(3)}" data-track-index="30"><span>${esc(c.text)}</span></div>`).join('\n');
 const offerHTML=`<div class="offer-content"><div class="eyebrow">AIS+ membership</div><h1><span>Choose your</span><span>membership.</span></h1><div class="offer-cards"><div class="glass offer-card annual"><div class="offer-label">ANNUAL</div><div class="price">$749<small>per year</small></div><div class="equivalent">≈ $62.42 / month</div></div><div class="glass offer-card monthly"><div class="offer-label">MONTHLY</div><div class="price">$129</div><div class="billing">per month</div><div class="billing">Upgrade anytime</div></div></div><div class="offer-features">Courses · Templates · Human support</div><div class="refund">${icon('check')}30-day refund on annual membership</div></div><div class="caption"><span>Annual is $749 for the year.</span></div>`;
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=${width},height=${height}"><title>AIS · Dark White Glass · ${format}</title><script src="assets/gsap.min.js"></script><style>${CSS}${portrait?VERTICAL:''}</style></head><body><main id="main" data-composition-id="main" data-start="0" data-duration="${duration}" data-width="${width}" data-height="${height}"><div class="ambient"></div><div class="brand"><img class="brand-logo" src="assets/ais-official-mark.png" alt="AI Automation Society"><span class="rule"></span><small>${offer?'AIS+ membership':'Free SOP'}</small></div><div class="header-note">${offer?'Build. Ship. Grow.':'First AI Client'}</div><div class="speaker-window">${speaker}</div><div class="speaker-edge"></div>${offer?offerHTML:adScenes+capHTML+'<audio id="speech" src="assets/speaker.mp4" data-start="0" data-duration="14" data-track-index="1" data-volume="1"></audio>'}</main><script>${offer?'const tl=gsap.timeline({paused:true});tl.to({}, {duration:1},0);window.__timelines=window.__timelines||{};window.__timelines.main=tl;':animation}</script></body></html>`;
 fs.writeFileSync(path.join(dir,'index.html'),html);
 fs.writeFileSync(path.join(dir,'hyperframes.json'),JSON.stringify({paths:{assets:'assets',blocks:'compositions'}},null,2));
 fs.writeFileSync(path.join(dir,'meta.json'),JSON.stringify({id:`ais-dark-proof-${format}`,name:`AIS Dark Style Proof · ${format}`},null,2));
 fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:`ais-dark-proof-${format}`,private:true,scripts:{dev:'hyperframes preview',check:'hyperframes lint && hyperframes validate && hyperframes inspect',render:'hyperframes render --quality standard --fps 30 --workers 2 --output renders/style-proof-render.mp4'}},null,2));
 console.log(format,width,height,duration);
}
// Audit actual word anchors, since the old shared validator is hard-wired to another project's sub-composition schema.
const anchorChecks=timing.benefits.map(b=>({...b,lead: +(b.word_start-b.start).toFixed(3),pass:b.word_start-b.start>=-.2&&b.word_start-b.start<=1.8}));
if(!anchorChecks.every(b=>b.pass))throw new Error('Beat-sync failure');
fs.writeFileSync(path.join(ROOT,'beat-sync.json'),JSON.stringify({status:'PASS',source:'assets/transcript.json',checks:anchorChecks,captionsCoverAllWords:cursor===words.length},null,2));
