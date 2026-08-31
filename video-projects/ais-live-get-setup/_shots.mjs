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
const TIMES = [3.6, 9.8, 16.9, 23.8, 30.9, 37.8, 44.9, 51.8, 58.1];

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("http://localhost:8099/index.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
for (const t of TIMES) {
  await page.evaluate(sec => { window.__timelines["cmp-get-setup"].seek(sec).pause(); }, t);
  await page.waitForTimeout(120);
  await page.screenshot({ path: join(ROOT, "frames", `t${String(t).replace(".", "_")}.png`) });
  console.log(`t=${t}`);
}
await browser.close();
srv.close();
