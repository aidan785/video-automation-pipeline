import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
const key = "ais-live-body-9x16";
const times = (process.argv[2]||"").split(",").map(Number).filter(x=>!isNaN(x));
const prefix = process.argv[3] || "assets/shots/v";
const fileUrl = "file://" + encodeURI(process.cwd() + "/index.html");
const b = await puppeteer.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless:"new", args:["--no-sandbox","--autoplay-policy=no-user-gesture-required"]});
const p = await b.newPage(); await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
await p.goto(fileUrl,{waitUntil:"domcontentloaded",timeout:60000});
await p.evaluate(async()=>{ if(document.fonts) await document.fonts.ready; });
await p.evaluate(()=>new Promise(r=>setTimeout(r,800)));
for (const t of times){
  await p.evaluate((t,key)=>{ const v=document.getElementById("bg-video"); if(v){try{v.pause()}catch(e){} v.currentTime=t;} const tl=window.__timelines&&window.__timelines[key]; if(tl){tl.pause(); tl.time(t,false);} },t,key);
  await p.evaluate(()=>new Promise(r=>setTimeout(r,350)));
  await p.screenshot({ path: `${prefix}_${String(t).replace(".","_")}.png` });
  console.log("shot",t);
}
await b.close();
