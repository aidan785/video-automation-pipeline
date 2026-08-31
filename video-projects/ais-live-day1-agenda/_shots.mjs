// one-off frame extractor: serve index.html over http, seek the paused master
// timeline to hero moments, screenshot each -> frames/t<sec>.png
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/aidanstanik/Projects/Video Automation/node_modules/playwright-core/index.js");

const ROOT = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(ROOT, "frames"), { recursive: true });

const MIME = { html: "text/html", css: "text/css", woff2: "font/woff2", js: "text/javascript" };
const srv = createServer(async (req, res) => {
  try {
    const p = join(ROOT, decodeURIComponent(req.url.split("?")[0]).replace(/^\//, "") || "index.html");
    const body = await readFile(p);
    res.writeHead(200, { "content-type": MIME[p.split(".").pop()] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => srv.listen(8099, r));

// hero moments: intro, a few sessions, keynote, worksplit1, viprooms, kacper,
// worksplit2, certified, close, markflash outro
const TIMES = [5.2, 13.4, 21.2, 29.4, 39.0, 47.9, 56.2, 64.3, 72.2, 83.2, 92.6, 104.0, 116.5, 123.8, 133.2, 141.8, 148.9, 157.7, 166.7, 175.9];

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("http://localhost:8099/index.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
for (const t of TIMES) {
  await page.evaluate(sec => { window.__timelines["cmp-day1-agenda"].seek(sec).pause(); }, t);
  await page.waitForTimeout(120);
  await page.screenshot({ path: join(ROOT, "frames", `t${String(t).replace(".", "_")}.png`) });
  console.log(`t=${t}`);
}
await browser.close();
srv.close();
