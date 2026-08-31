import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import { existsSync } from "fs";
const t = parseFloat(process.argv[2] || "23.5");
const dl = process.argv[3] ? parseFloat(process.argv[3]) : null; // #cta .dot left px
const dt = process.argv[4] ? parseFloat(process.argv[4]) : null; // #cta .dot top px
const out = process.argv[5] || "assets/shots/real_cta.png";
const fileUrl = "file://" + encodeURI(process.cwd() + "/index.html");
const b = await puppeteer.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless:"new", args:["--no-sandbox","--autoplay-policy=no-user-gesture-required"]});
const p = await b.newPage(); await p.setViewport({width:1920,height:1080,deviceScaleFactor:1});
await p.goto(fileUrl,{waitUntil:"domcontentloaded",timeout:60000});
await p.evaluate(async()=>{ if(document.fonts) await document.fonts.ready; });
await p.evaluate(()=>new Promise(r=>setTimeout(r,800)));
await p.evaluate((t)=>{
  const v=document.getElementById("bg-video"); if(v){try{v.pause()}catch(e){} v.currentTime=t;}
  const tl=window.__timelines && window.__timelines["ais-live-body"];
  if(tl){ tl.pause(); tl.time(t,false); }
},t);
if(dl!=null){ await p.evaluate((dl,dt)=>{ const d=document.querySelector('#cta .dot'); d.style.left=dl+'px'; if(dt!=null)d.style.top=dt+'px'; },dl,dt); }
await p.evaluate(()=>new Promise(r=>setTimeout(r,300)));
const rect = await p.evaluate(()=>{ const m=document.querySelector('#cta .aismark'); const r=m.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; });
const clip = { x: Math.max(0,rect.x-30), y: Math.max(0,rect.y-90), width: Math.min(1920-1, rect.w+240), height: rect.h+170 };
await p.screenshot({ path: out, clip });
console.log("mark rect:", JSON.stringify(rect), "-> wrote", out);
await b.close();
