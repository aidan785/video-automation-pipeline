#!/usr/bin/env node
/* Screenshot every beat at a hero moment: loads index.html raw (no HF runtime),
   hides all beats except the target, seeks the master timeline, shoots a PNG.
   Bg video shows its poster frame only — fine for checking the overlays. */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const PROJECTS = {
  "updown-upsell": [
    ["b1", 152.5], ["b2", 158.5], ["b2", 166.5], ["b2", 172.5], ["b3", 179.0],
    ["b4", 188.0], ["b5", 219.0], ["b6", 227.0], ["b7", 258.5], ["b8", 289.5],
    ["b8", 296.0], ["b8", 300.5], ["b9", 505.5], ["b10", 526.5], ["b11", 578.0], ["b12", 596.5],
  ],
  "updown-downsell": [
    ["b1", 14.5], ["b2", 19.5], ["b3", 33.5], ["b4", 37.5], ["b5", 48.5], ["b6", 78.5],
  ],
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [proj, shots] of Object.entries(PROJECTS)) {
  const dir = path.join(ROOT, proj, "frames");
  fs.mkdirSync(dir, { recursive: true });
  const url = "file://" + path.join(ROOT, proj, "index.html");
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__timelines && Object.keys(window.__timelines).length && document.fonts.status === "loaded", { timeout: 20000 }).catch(() => {});
  await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(dir, "_warmup.png") }); // force full raster once
  for (const [beat, t] of shots) {
    await page.evaluate(([beat, t]) => {
      document.querySelectorAll(".beat").forEach(el => { el.style.display = el.id === beat ? "block" : "none"; });
      document.querySelectorAll("video").forEach(v => { v.pause(); });
      const tl = window.__timelines[Object.keys(window.__timelines)[0]];
      tl.seek(t, false);
    }, [beat, t]);
    await page.waitForTimeout(250);
    const out = path.join(dir, `${beat}-${t}.png`);
    await page.screenshot({ path: out });
    console.log(out);
  }
}
await browser.close();
