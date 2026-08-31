import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
const key="ais-live-body-9x16";
const fileUrl="file://"+encodeURI(process.cwd()+"/index.html");
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--no-sandbox","--autoplay-policy=no-user-gesture-required"]});
const p=await b.newPage(); await p.setViewport({width:1080,height:1920,deviceScaleFactor:2});
await p.goto(fileUrl,{waitUntil:"domcontentloaded",timeout:60000});
await p.evaluate(async()=>{if(document.fonts)await document.fonts.ready;});
await p.evaluate(()=>new Promise(r=>setTimeout(r,800)));
for (const [t,sel,out] of [[5,"#bug","assets/shots/crop_bug.png"],[23,"#cta","assets/shots/crop_cta.png"]]) {
  await p.evaluate((t,key)=>{const tl=window.__timelines[key];tl.pause();tl.time(t,false);},t,key);
  await p.evaluate(()=>new Promise(r=>setTimeout(r,200)));
  const r=await p.evaluate((sel)=>{const m=document.querySelector(sel+" .aismark").getBoundingClientRect();return{x:m.x,y:m.y,w:m.width,h:m.height};},sel);
  await p.screenshot({path:out, clip:{x:Math.max(0,r.x-20),y:Math.max(0,r.y-40),width:r.w+90,height:r.h+70}});
  console.log("wrote",out);
}
await b.close();
