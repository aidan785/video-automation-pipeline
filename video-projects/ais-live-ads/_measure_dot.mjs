import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
const b = await puppeteer.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless:"new", args:["--no-sandbox","--autoplay-policy=no-user-gesture-required"]});
const p = await b.newPage(); await p.setViewport({width:1920,height:1080});
await p.goto("http://localhost:3002/api/projects/ais-live-ads/preview",{waitUntil:"domcontentloaded",timeout:60000});
await p.evaluate(async()=>{ if(document.fonts) await document.fonts.ready; });
await p.evaluate(()=>new Promise(r=>setTimeout(r,1200)));
const m = await p.evaluate(()=>{
  const out={};
  for (const sel of ['#bug','#cta']) {
    const dot = document.querySelector(sel+' .dot');
    const live = document.querySelector(sel+' .live');
    if(dot&&live){
      const fs = parseFloat(getComputedStyle(dot.closest('.aismark')).fontSize);
      out[sel] = { offsetLeft: dot.offsetLeft, offsetTop: dot.offsetTop, liveW: live.offsetWidth, liveH: live.offsetHeight, fontPx: fs,
        dotW: dot.offsetWidth };
    }
  }
  return out;
});
console.log(JSON.stringify(m,null,2));
await b.close();
