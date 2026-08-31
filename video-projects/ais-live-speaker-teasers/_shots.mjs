// batch frame extractor: for each card, copy it to index.html, serve over
// http, seek the paused timeline to its hero moment, screenshot ->
// frames/<slug>.png
import { mkdirSync, readFileSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/aidanstanik/Projects/Video Automation/node_modules/playwright-core/index.js");

const ROOT = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(ROOT, "frames"), { recursive: true });
const manifest = JSON.parse(readFileSync(join(ROOT, "_manifest.json"), "utf8"));

const MIME = { html: "text/html", css: "text/css", woff2: "font/woff2", js: "text/javascript", png: "image/png" };
const srv = createServer(async (req, res) => {
  try {
    const p = join(ROOT, decodeURIComponent(req.url.split("?")[0]).replace(/^\//, "") || "index.html");
    const body = await readFile(p);
    res.writeHead(200, { "content-type": MIME[p.split(".").pop()] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => srv.listen(8099, r));

const HERO_T = 4.2;
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const m of manifest) {
  copyFileSync(join(ROOT, "cards", `${m.slug}.html`), join(ROOT, "index.html"));
  await page.goto(`http://localhost:8099/index.html?v=${m.slug}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(([id, sec]) => { window.__timelines[id].seek(sec).pause(); }, [m.comp, HERO_T]);
  await page.waitForTimeout(120);
  await page.screenshot({ path: join(ROOT, "frames", `${m.slug}.png`) });
  console.log(m.slug);
}
await browser.close();
srv.close();
