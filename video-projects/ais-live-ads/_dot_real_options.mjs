import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
const t = 23.5;
const POS = [
  {n:1,left:585,top:55},   {n:2,left:595,top:110},  {n:3,left:600,top:150},
  {n:4,left:590,top:195},  {n:5,left:640,top:110},  {n:6,left:565,top:110},
];
const fileUrl="file://"+encodeURI(process.cwd()+"/index.html");
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--no-sandbox","--autoplay-policy=no-user-gesture-required"]});
const p=await b.newPage(); await p.setViewport({width:1920,height:1080,deviceScaleFactor:1});
await p.goto(fileUrl,{waitUntil:"domcontentloaded",timeout:60000});
await p.evaluate(async()=>{if(document.fonts)await document.fonts.ready});
await p.evaluate(()=>new Promise(r=>setTimeout(r,800)));
await p.evaluate((t)=>{const v=document.getElementById("bg-video");if(v){try{v.pause()}catch(e){}v.currentTime=t;}const tl=window.__timelines["ais-live-body"];tl.pause();tl.time(t,false);},t);
const rect=await p.evaluate(()=>{const r=document.querySelector('#cta .aismark').getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};});
const clip={x:Math.max(0,Math.round(rect.x-30)),y:Math.max(0,Math.round(rect.y-105)),width:Math.round(rect.w+260),height:Math.round(rect.h+210)};
const files=[];
for(const o of POS){
  await p.evaluate((o,clip)=>{
    const d=document.querySelector('#cta .dot'); d.style.left=o.left+'px'; d.style.top=o.top+'px';
    let badge=document.getElementById('__badge'); if(!badge){badge=document.createElement('div');badge.id='__badge';document.body.appendChild(badge);}
    badge.textContent=o.n;
    badge.style.cssText='position:fixed;left:'+(clip.x+10)+'px;top:'+(clip.y+8)+'px;z-index:99999;font:700 40px JetBrains Mono,monospace;color:#37bdf8;background:#000a;padding:2px 14px;border-radius:6px;';
  },o,clip);
  await p.evaluate(()=>new Promise(r=>setTimeout(r,150)));
  const f=`/tmp/dopt_${o.n}.png`; await p.screenshot({path:f,clip}); files.push(f);
}
await b.close();
console.log("CROPS "+files.join(" "));
