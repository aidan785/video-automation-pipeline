import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
const key="ais-live-body-9x16";
const fileUrl="file://"+encodeURI(process.cwd()+"/index.html");
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--no-sandbox","--autoplay-policy=no-user-gesture-required"]});
const p=await b.newPage(); await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
await p.goto(fileUrl,{waitUntil:"domcontentloaded",timeout:60000});
await p.evaluate(async()=>{if(document.fonts)await document.fonts.ready;});
await p.evaluate(()=>new Promise(r=>setTimeout(r,800)));
// seek bug visible (t=5) and cta (t=23)
for (const [t,sel] of [[5,"#bug"],[23,"#cta"]]) {
  await p.evaluate((t,key)=>{const tl=window.__timelines[key]; tl.pause(); tl.time(t,false);},t,key);
  await p.evaluate(()=>new Promise(r=>setTimeout(r,200)));
  const m = await p.evaluate((sel)=>{
    const mark=document.querySelector(sel+" .aismark");
    const live=document.querySelector(sel+" .live");
    const dot=document.querySelector(sel+" .dot");
    const mr=mark.getBoundingClientRect(), lr=live.getBoundingClientRect(), dr=dot.getBoundingClientRect();
    const cs=getComputedStyle(live); const fs=parseFloat(getComputedStyle(mark).fontSize);
    // live box relative coords: dot containing block is .live (position relative)
    return { fontSize:fs, livePadRight:cs.paddingRight,
      live_w: lr.width, live_left_screen: lr.x, mark_top_screen: mr.y,
      // text right edge inside .live = live width - paddingRight
      dot_left_now: dot.style.left, dot_top_now: dot.style.top,
      dot_screen:{x:dr.x,y:dr.y}, live_screen:{x:lr.x,y:lr.y,w:lr.width,h:lr.height} };
  }, sel);
  console.log(sel, JSON.stringify(m));
}
await b.close();
