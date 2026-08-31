// AIS LIVE — Nate's book QR card (Becoming AI Native).
//   Static 1920x1080 graphic in the locked AIS LIVE house style (onyx command-deck,
//   grid, blue glow, italic Montserrat headline). Book cover left, headline +
//   scannable QR tile right. QR resolves to https://www.amazon.com/dp/B0H84Z9CXG.
//   Styling directives applied: all-blue accents, no em dashes, no eyebrow dots.
//
//   node _gen.mjs        -> renders/book-qr.png (1920x1080 @2x)

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "renders");
const TMP = join(OUT, "_html");
mkdirSync(TMP, { recursive: true });
const FONTS = join(ROOT, "..", "ais-live-stings", "assets", "fonts", "fonts.css");
const COVER = join(ROOT, "assets", "book-cover.jpg");
const QR = join(ROOT, "assets", "qr-trimmed.png");

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />
<link href="file://${FONTS}" rel="stylesheet" />
<style>
  :root{ --onyx:#07121c; --ac:#37bdf8; --paper-soft:rgba(209,220,232,0.80); --paper-mute:rgba(209,220,232,0.52); }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ width:1920px; height:1080px; }
  body{ background:var(--onyx); color:#fff; font-family:'Inter',sans-serif; position:relative; overflow:hidden; }
  .grid{ position:absolute; inset:0; background-image:
      linear-gradient(rgba(55,189,248,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(55,189,248,0.06) 1px, transparent 1px);
      background-size:24px 24px; }
  .glow{ position:absolute; top:-180px; right:-120px; width:760px; height:760px; border-radius:50%;
      background:rgba(55,189,248,0.22); filter:blur(120px); }
  .glow2{ position:absolute; bottom:-260px; left:-160px; width:720px; height:720px; border-radius:50%;
      background:rgba(55,189,248,0.10); filter:blur(130px); }
  .vig{ position:absolute; inset:0; background:radial-gradient(120% 120% at 50% 38%, transparent 55%, rgba(0,0,0,0.55) 100%); }
  .frame{ position:absolute; inset:0; padding:84px 120px; display:flex; flex-direction:column; }
  .chrome{ display:flex; align-items:center; justify-content:space-between; }
  .mark{ font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; letter-spacing:-0.03em;
      line-height:0.9; font-size:34px; display:inline-flex; align-items:baseline; position:relative; }
  .mark .ais{ color:#fff; } .mark .gap{ display:inline-block; width:0.08em; }
  .mark .live{ color:#37bdf8; position:relative; text-shadow:0 0 40px rgba(55,189,248,0.55); padding-right:0.30em; }
  .mark .dot{ position:absolute; top:0.08em; left:100%; margin-left:0.04em; width:0.15em; height:0.15em;
      border-radius:50%; background:#ff3b30; box-shadow:0 0 0.7em #ff3b30,0 0 0.25em #ff3b30; }
  .when{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:17px; letter-spacing:0.26em;
      text-transform:uppercase; color:var(--paper-mute); text-align:right; }
  .when b{ color:var(--ac); }

  .body{ flex:1; display:flex; align-items:center; gap:110px; padding-top:20px; }

  /* book cover, gentle lift + blue rim glow */
  .coverwrap{ flex:none; position:relative; }
  .cover{ display:block; width:436px; height:auto; border-radius:10px;
      box-shadow: 0 40px 90px rgba(0,0,0,0.65), 0 0 90px rgba(55,189,248,0.22);
      outline:1px solid rgba(255,255,255,0.10); outline-offset:-1px; }

  .copy{ flex:1; display:flex; flex-direction:column; align-items:flex-start; }
  .track{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:19px; letter-spacing:0.28em;
      text-transform:uppercase; color:var(--ac); margin-bottom:30px; }
  .title{ font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; letter-spacing:-0.035em;
      line-height:0.96; font-size:108px; }
  .title em{ font-style:italic; color:var(--ac); text-shadow:0 0 60px rgba(55,189,248,0.45); }
  .sub{ font-family:'Inter',sans-serif; font-weight:300; font-style:italic; font-size:31px; line-height:1.4;
      color:var(--paper-soft); margin-top:26px; max-width:820px; }
  .author{ font-family:'Montserrat',sans-serif; font-weight:800; font-size:30px; letter-spacing:-0.02em;
      margin-top:22px; }
  .author span{ font-family:'JetBrains Mono',monospace; font-weight:500; font-size:15px; letter-spacing:0.26em;
      text-transform:uppercase; color:var(--paper-mute); display:block; margin-bottom:8px; }

  /* QR row: white tile keeps the code scannable on the dark canvas */
  .qrrow{ display:flex; align-items:center; gap:44px; margin-top:56px; }
  .qrtile{ flex:none; width:250px; height:250px; background:#fff; border-radius:18px; padding:22px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 0 70px rgba(55,189,248,0.28); }
  .qrtile img{ display:block; width:100%; height:100%; image-rendering:pixelated; }
  .scan{ display:flex; flex-direction:column; gap:12px; }
  .scan .s1{ font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; font-size:44px;
      letter-spacing:-0.03em; line-height:1.0; }
  .scan .s1 em{ font-style:italic; color:var(--ac); }
  .scan .s2{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:17px; letter-spacing:0.26em;
      text-transform:uppercase; color:var(--paper-mute); }
  .scan .s2 b{ color:var(--ac); }
</style></head>
<body>
  <div class="grid"></div><div class="glow"></div><div class="glow2"></div><div class="vig"></div>
  <div class="frame">
    <div class="chrome">
      <span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="dot"></span></span></span>
      <span class="when"><b>NEW BOOK</b> · AVAILABLE NOW</span>
    </div>
    <div class="body">
      <div class="coverwrap"><img class="cover" src="file://${COVER}" /></div>
      <div class="copy">
        <span class="track">NATE HERK'S NEW BOOK</span>
        <h1 class="title">Becoming<br /><em>AI Native</em></h1>
        <p class="sub">Use AI to Get Real Results Without the Busywork</p>
        <div class="qrrow">
          <div class="qrtile"><img src="file://${QR}" /></div>
          <div class="scan">
            <span class="s1">Scan to get <em>the book</em></span>
            <span class="s2">AVAILABLE ON <b>AMAZON</b></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body></html>`;

const htmlPath = join(TMP, "book-qr.html");
writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
await page.goto("file://" + htmlPath);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);
await page.screenshot({ path: join(OUT, "book-qr.png") });
await browser.close();
console.log("card -> renders/book-qr.png");
