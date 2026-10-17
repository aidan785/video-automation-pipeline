#!/usr/bin/env node
// Capture real, public visuals for the SOP ad (Aidan OK'd 9/30):
//   1. Nate's YouTube channel header (and the subscriber / video counts it shows)
//   2. Real public comments that ask how to make money / get clients, with names + avatars BLURRED
//   3. The First Client SOP cover mockup from the opt-in page
// Headless Chromium, audio muted, device scale 2. Writes to 05-visual-assets/captures/ + captures.json.
// Usage: node tools/capture.mjs [channel|comments|sop ...]
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "05-visual-assets/captures");
mkdirSync(OUT, { recursive: true });
const logPath = join(OUT, "captures.json");
const log = existsSync(logPath) ? JSON.parse(readFileSync(logPath, "utf8")) : {};
const want = process.argv.slice(2);
const run = (k) => !want.length || want.includes(k);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio", "--autoplay-policy=user-gesture-required"] }); // system Chrome (no Playwright browser download)
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: "dark", locale: "en-US" });
const page = await ctx.newPage();
await ctx.addCookies([{ name: "PREF", value: "f6=400&hl=en", domain: ".youtube.com", path: "/" }]); // YouTube dark theme
const hush = () => page.evaluate(() => document.querySelectorAll("video,audio").forEach((m) => { m.pause(); m.muted = true; })).catch(() => {});

if (run("channel")) {
  await page.goto("https://www.youtube.com/@nateherk", { waitUntil: "domcontentloaded" });
  await sleep(4000); await hush();
  const header = page.locator("yt-page-header-renderer, #page-header").first();
  await header.waitFor({ timeout: 15000 });
  const text = (await header.innerText()).replace(/\s+/g, " ");
  await header.screenshot({ path: join(OUT, "yt-channel-header.png") });
  log.channel = { url: page.url(), capturedAt: new Date().toISOString(), headerText: text.slice(0, 400),
    subscribers: (text.match(/([\d.,]+[KMB]?) subscribers/i) || [])[1] || null, videos: (text.match(/([\d.,]+) videos/i) || [])[1] || null };
  console.log("channel:", log.channel.subscribers, "subscribers,", log.channel.videos, "videos");
}

if (run("comments")) {
  const RX = /\b(get|land|find|getting|landing|finding|approach|reach out to)\s+(my\s+|your\s+|a\s+|the\s+)?(first\s+)?(paying\s+)?clients?\b|how (do|can|would|should) (i|you|we|one) (sell|charge|price|monetize|pitch)|make money (with|from|using) (this|it|these|ai|automation|n8n|agents?|my)|get paid (for|with)|where (do|can) (i|you) find clients|monetize (my|these|this|ai)/i;
  // Nate's own videos about getting clients / selling AI services draw the most "how do I get clients" comments
  const vids = [];
  for (const q of ["first client", "get clients", "sell AI automation", "AI agency", "make money"]) {
    await page.goto(`https://www.youtube.com/@nateherk/search?query=${encodeURIComponent(q)}`, { waitUntil: "domcontentloaded" });
    await sleep(3500); await hush();
    const hrefs = await page.$$eval("a", (as) => as.map((a) => a.href.split("&")[0]).filter((h) => /watch\?v=/.test(h)));
    for (const h of hrefs) if (!vids.includes(h) && vids.length < 16) vids.push(h);
  }
  console.log("videos to scan:", vids.length);
  const found = [];
  for (const v of vids) {
    if (found.length >= 8) break;
    await page.goto(v, { waitUntil: "domcontentloaded" });
    await sleep(3500); await hush();
    for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 1600); await sleep(900); }
    await hush();
    const threads = page.locator("ytd-comment-thread-renderer");
    const n = Math.min(await threads.count(), 120);
    for (let i = 0; i < n && found.length < 8; i++) {
      const body = threads.nth(i).locator("#body").first();
      const txt = ((await threads.nth(i).locator("#content-text").first().innerText().catch(() => "")) || "").trim();
      if (!RX.test(txt) || txt.length > 220 || txt.length < 25) continue;
      // blur identity before the screenshot: author name, avatar, handle links, reply/pin badges
      await threads.nth(i).evaluate((el) => {
        el.querySelectorAll("#author-text, #author-thumbnail, #avatar, yt-img-shadow, #author-comment-badge, #header-author a").forEach((n) => { n.style.filter = "blur(9px)"; });
        el.querySelectorAll("#replies, #action-buttons #reply-button-end").forEach((n) => { n.style.display = "none"; });
      });
      await body.scrollIntoViewIfNeeded(); await sleep(300);
      const file = `yt-comment-${String(found.length + 1).padStart(2, "0")}.png`;
      await body.screenshot({ path: join(OUT, file) });
      found.push({ file, video: v, text: txt });
      console.log("comment:", file, "|", txt.replace(/\s+/g, " ").slice(0, 120));
    }
  }
  log.comments = { capturedAt: new Date().toISOString(), note: "public YouTube comments on Nate's videos; author names + avatars blurred in-page before capture", items: found };
}

if (run("sop")) {
  await page.goto("https://app.aiautomationsociety.ai/optin/first-client-SOP/", { waitUntil: "domcontentloaded" });
  await sleep(3500);
  // the cover mockup: smallest element that holds the whole cover text
  const handle = await page.evaluateHandle(() => {
    const all = [...document.querySelectorAll("div,figure,aside,article")].filter((e) => /STANDARD OPERATING PROCEDURE/i.test(e.innerText) && /First Client SOP/i.test(e.innerText) && !e.querySelector("form, input"));
    all.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
    return all.find((e) => e.getBoundingClientRect().width > 250) || null;
  });
  const el = handle.asElement();
  if (el) {
    await el.screenshot({ path: join(OUT, "sop-cover.png"), omitBackground: true });
    const box = await el.boundingBox();
    log.sop = { url: page.url(), capturedAt: new Date().toISOString(), box, text: (await el.innerText()).replace(/\s+/g, " ").slice(0, 200) };
    console.log("sop cover:", Math.round(box.width), "x", Math.round(box.height), "css px");
  } else console.log("sop cover: NOT FOUND");
}

if (run("aiosbox")) {
  // AI OS product box from the AI OS opt-in page (linked in the ads script doc)
  await page.goto("https://app.aiautomationsociety.ai/optin/ai-os/", { waitUntil: "domcontentloaded" });
  await sleep(3500);
  const handle = await page.evaluateHandle(() => {
    const imgs = [...document.querySelectorAll("img")].filter((i) => i.getBoundingClientRect().width > 250 && !/logo/i.test(i.src));
    if (imgs.length) return imgs.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
    const all = [...document.querySelectorAll("div,figure,aside")].filter((e) => /AI OS/.test(e.innerText) && /OPERATING SYSTEM/i.test(e.innerText) && !e.querySelector("form,input"));
    all.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
    return all.find((e) => e.getBoundingClientRect().width > 250) || null;
  });
  const el = handle.asElement();
  if (el) {
    const tag = await el.evaluate((e) => e.tagName + " " + (e.src || ""));
    await el.screenshot({ path: join(OUT, "aios-box.png"), omitBackground: true });
    log.aiosbox = { url: page.url(), capturedAt: new Date().toISOString(), element: tag, box: await el.boundingBox() };
    console.log("aios box:", tag);
  } else console.log("aios box: NOT FOUND");
}

writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");
await browser.close();
