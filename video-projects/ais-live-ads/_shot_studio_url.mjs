import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
const URL = process.argv[2];
const b = await puppeteer.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless:"new", args:["--no-sandbox","--autoplay-policy=no-user-gesture-required"]});
const p = await b.newPage(); await p.setViewport({width:1728,height:1080,deviceScaleFactor:1});
await p.goto(URL,{waitUntil:"networkidle2",timeout:60000}).catch(()=>{});
await p.evaluate(async()=>{ if(document.fonts) await document.fonts.ready; });
await p.evaluate(()=>new Promise(r=>setTimeout(r,3500)));
await p.screenshot({ path:"assets/shots/studio_view.png" });
await b.close(); console.log("shot done");
