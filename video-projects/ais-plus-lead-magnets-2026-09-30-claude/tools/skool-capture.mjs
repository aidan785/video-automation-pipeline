#!/usr/bin/env node
// AIS+ Skool community screenshots (Aidan, CP5 review: "use the community to pull screenshots for elements").
//   login: opens a visible Chrome window on a throwaway profile (session scratchpad, not his real Chrome).
//          Aidan logs in himself; the script only waits until the classroom loads, then closes.
//   shoot: headless, same profile, 2x device scale, muted, every <video> paused. Saves the classroom grid,
//          each course card (matched by title), and the calendar, to 05-visual-assets/skool/.
//          The top bar (his avatar, notifications, chat) is never captured.
// Usage: node tools/skool-capture.mjs login|shoot <profileDir>
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [mode, profileArg] = process.argv.slice(2);
if (!["login", "shoot", "cards"].includes(mode) || !profileArg) { console.error("usage: skool-capture.mjs login|shoot <profileDir>"); process.exit(2); }
const PROFILE = resolve(profileArg);
const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT = join(ROOT, "05-visual-assets/skool");
const GROUP = "https://www.skool.com/ai-automation-society-plus";
const COURSES = ["Agent Zero", "10 Hours to 10 Seconds", "One Person AI Agency", "Templates"];

const quiet = async (page) => page.evaluate(() => document.querySelectorAll("video,audio").forEach((m) => { m.muted = true; m.pause(); }));
const loggedIn = async (page) => !(await page.evaluate(() => [...document.querySelectorAll("button,a")].some((b) => /^log in$/i.test(b.textContent.trim()))));

if (mode === "login") {
  const ctx = await chromium.launchPersistentContext(PROFILE, { channel: "chrome", headless: false, viewport: null, args: ["--mute-audio"] });
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(`${GROUP}/classroom`);
  console.log("waiting for login (up to 20 min)...");
  const t0 = Date.now();
  while (Date.now() - t0 < 20 * 60e3) {
    await page.waitForTimeout(3000);
    try { if (page.url().includes("/classroom") && (await loggedIn(page))) { console.log("logged in"); break; } } catch {}
  }
  await ctx.close();
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
if (mode === "cards") { // node tools/skool-capture.mjs cards <profile> "Exact Title" ...  -> card-<slug>.png + thumb-<slug>.png
  const titles = process.argv.slice(4);
  const ctx = await chromium.launchPersistentContext(PROFILE, { channel: "chrome", headless: true, viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, args: ["--mute-audio"] });
  const page = await ctx.newPage();
  await page.goto(`${GROUP}/classroom`, { waitUntil: "networkidle" });
  await quiet(page);
  await page.waitForTimeout(1500);
  const done = [];
  for (const title of titles) {
    const r = await page.evaluate((title) => {
      const leaves = [...document.querySelectorAll("*")].filter((e) => e.children.length === 0);
      const el = leaves.find((e) => e.textContent.trim() === title) || leaves.find((e) => e.textContent.trim().toLowerCase().includes(title.toLowerCase()));
      if (!el) return null;
      let n = el;
      while (n && n !== document.body) {
        const b = n.getBoundingClientRect();
        if (n.querySelector("img") && b.width > 220 && b.width < 560 && b.height > 220) {
          const im = n.querySelector("img").getBoundingClientRect();
          return { card: { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height }, thumb: { x: b.x + scrollX, y: im.y + scrollY, width: b.width, height: im.height } };
        }
        n = n.parentElement;
      }
      return null;
    }, title);
    if (!r) { console.log(`card not found: ${title}`); continue; }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await page.screenshot({ path: join(OUT, `card-${slug}.png`), clip: r.card, fullPage: true });
    await page.screenshot({ path: join(OUT, `thumb-${slug}.png`), clip: r.thumb, fullPage: true });
    done.push(slug);
  }
  await ctx.close();
  console.log(JSON.stringify(done));
  process.exit(0);
}
const ctx = await chromium.launchPersistentContext(PROFILE, { channel: "chrome", headless: true, viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, args: ["--mute-audio", "--autoplay-policy=user-gesture-required"] });
const page = await ctx.newPage();
const shots = [];
await page.goto(`${GROUP}/classroom`, { waitUntil: "networkidle" });
if (!(await loggedIn(page)) || !page.url().includes("/classroom")) { console.error("not logged in (run login first)"); await ctx.close(); process.exit(1); }
await quiet(page);
await page.waitForTimeout(1500);
// hide the site header (personal avatar/notifications/chat) before any capture
await page.addStyleTag({ content: "header { visibility: hidden !important; }" });
await page.screenshot({ path: join(OUT, "classroom-grid.png"), fullPage: true });
shots.push({ file: "classroom-grid.png", url: page.url() });
for (const title of COURSES) {
  const box = await page.evaluate((title) => {
    const el = [...document.querySelectorAll("*")].find((e) => e.children.length === 0 && e.textContent.trim().toLowerCase().includes(title.toLowerCase()));
    if (!el) return null;
    let n = el;
    while (n && n !== document.body) { const r = n.getBoundingClientRect(); if (n.querySelector("img") && r.width > 220 && r.width < 560 && r.height > 220) return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; n = n.parentElement; }
    return null;
  }, title);
  if (!box) { console.log(`card not found: ${title}`); continue; }
  const file = `course-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  await page.screenshot({ path: join(OUT, file), clip: box, fullPage: true });
  shots.push({ file, title, box });
}
await page.goto(`${GROUP}/calendar`, { waitUntil: "networkidle" });
await quiet(page);
await page.addStyleTag({ content: "header { visibility: hidden !important; }" });
await page.waitForTimeout(1200);
await page.screenshot({ path: join(OUT, "calendar.png"), fullPage: false });
shots.push({ file: "calendar.png", url: page.url() });
writeFileSync(join(OUT, "captures.json"), JSON.stringify({ captured: new Date().toISOString(), source: GROUP, note: "Logged-in screenshots of the AIS+ Skool community for VSL graphics (Aidan's request, CP5 review). Review for member names/faces before use.", shots }, null, 2) + "\n");
await ctx.close();
console.log(JSON.stringify(shots.map((s) => s.file)));
