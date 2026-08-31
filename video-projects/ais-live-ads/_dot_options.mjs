import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
// positions to try for the CTA dot (relative to .live box, px at 208px font). liveW≈570, liveH≈216.
const opts = [
  { n:1, left:591, top:75 },    // current
  { n:2, left:600, top:120 },   // lower, vertically toward center, a touch farther right
  { n:3, left:600, top:150 },   // mid-height of the word
  { n:4, left:585, top:175 },   // near the baseline, right of the E foot
  { n:5, left:560, top:40 },    // tight to top-right, smaller gap, very high
  { n:6, left:620, top:110 },   // farther right, mid-upper
];
const css = opts.map(o=>`<div class="cell"><div class="tag">${o.n}</div><span class="aismark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="dot" style="left:${o.left}px;top:${o.top}px"></span></span></span></div>`).join("");
const html = `<!doctype html><html><head><link href="assets/fonts/fonts.css" rel="stylesheet"><style>
:root{--blue:#37bdf8;--onyx:#07121c;--red-live:#ff3b30}
*{margin:0;box-sizing:border-box}body{background:#05080c;display:flex;flex-direction:column;gap:0}
.cell{position:relative;height:300px;display:flex;align-items:center;padding-left:120px;background:radial-gradient(ellipse 900px 500px at 40% 50%,rgba(55,189,248,0.10),transparent 60%),var(--onyx);border-bottom:1px solid #16242f}
.cell:nth-child(even){background:radial-gradient(ellipse 900px 500px at 40% 50%,rgba(55,189,248,0.10),transparent 60%),#0a141d}
.tag{position:absolute;left:28px;top:24px;font-family:"JetBrains Mono",monospace;color:var(--blue);font-size:34px;font-weight:700}
.aismark{font-family:"Montserrat",sans-serif;font-style:italic;font-weight:900;letter-spacing:-0.03em;line-height:0.9;display:inline-flex;align-items:baseline;position:relative;font-size:208px}
.ais{padding:0.04em 0.05em 0.10em 0.16em;background:linear-gradient(180deg,#fff 0%,#e9eff4 40%,#b7c6d2 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.gap{display:inline-block;width:0}
.live{position:relative;padding:0.04em 0.40em 0.10em 0.05em;background:linear-gradient(180deg,#b3e4ff 0%,#37bdf8 52%,#1b93d6 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 28px rgba(55,189,248,0.5))}
.dot{position:absolute;width:31px;height:31px;border-radius:50%;background:var(--red-live);box-shadow:0 0 0 0 rgba(255,59,48,.7),0 0 9px var(--red-live),0 0 3px var(--red-live)}
</style></head><body>${css}</body></html>`;
import {writeFileSync} from "fs"; writeFileSync("assets/shots/_dotopts.html", html);
const b = await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--no-sandbox"]});
const p = await b.newPage(); await p.setViewport({width:1200,height:1800,deviceScaleFactor:1});
await p.goto("file://"+process.cwd()+"/assets/shots/_dotopts.html",{waitUntil:"networkidle0"});
await p.evaluate(async()=>{if(document.fonts)await document.fonts.ready});
await p.evaluate(()=>new Promise(r=>setTimeout(r,500)));
await p.screenshot({path:"assets/shots/dot_options.png",fullPage:true});
await b.close(); console.log("done");
