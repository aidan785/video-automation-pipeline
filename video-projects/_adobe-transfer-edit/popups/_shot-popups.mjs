import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const OUT = process.argv[2] || "out";
fs.mkdirSync(path.join(OUT, "sections"), { recursive: true });
fs.mkdirSync(path.join(OUT, "intro 10-38s"), { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2400, height: 4800 }, deviceScaleFactor: 2 });
await p.goto("file://" + path.resolve("popups.html"), { waitUntil: "networkidle" });
await Promise.race([p.evaluate(() => document.fonts.ready), p.waitForTimeout(6000)]);
await p.waitForTimeout(500);

const sections = ["section-setup", "section-prompting", "section-outputs"];
const intro = ["role-animators", "role-scriptwriters", "role-editors",
  "full-team", "full-team-strike", "higgsfield", "single-prompt",
  "chip-scripting", "chip-editing", "chip-animating", "chip-generating"];

for (const id of intro) {
  await p.locator("#" + id).screenshot({ path: path.join(OUT, "intro 10-38s", id + ".png"), omitBackground: true });
}
for (const id of sections) {
  const el = p.locator("#" + id);
  await el.screenshot({ path: path.join(OUT, "sections", id + ".png"), omitBackground: true });
  // layer passes: box only / text only
  await p.evaluate((i) => document.querySelector("#" + i + " .section-card").classList.add("layer-box"), id);
  await el.screenshot({ path: path.join(OUT, "sections", id + ".layer-box.png"), omitBackground: true });
  await p.evaluate((i) => {
    const c = document.querySelector("#" + i + " .section-card");
    c.classList.remove("layer-box"); c.classList.add("layer-text");
  }, id);
  await el.screenshot({ path: path.join(OUT, "sections", id + ".layer-text.png"), omitBackground: true });
  await p.evaluate((i) => document.querySelector("#" + i + " .section-card").classList.remove("layer-text"), id);
}
await b.close();
console.log("done ->", OUT);
