import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const OUT = process.argv[2];
const FPS = 30;
const only = process.argv[3] ? process.argv[3].split(",") : null;
fs.mkdirSync(path.join(OUT, "sections"), { recursive: true });
fs.mkdirSync(path.join(OUT, "intro 10-38s"), { recursive: true });

const SECTIONS = new Set(["section-setup", "section-prompting", "section-outputs"]);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2400, height: 5200 }, deviceScaleFactor: 2 });
await p.goto("file://" + path.resolve("popups-animated.html"), { waitUntil: "networkidle" });
await Promise.race([p.evaluate(() => document.fonts.ready), p.waitForTimeout(6000)]);
await p.waitForTimeout(400);

const ids = await p.evaluate(() => Object.keys(window.__anims));
for (const id of ids) {
  if (only && !only.includes(id)) continue;
  const dur = await p.evaluate((i) => window.__anims[i].dur, id);
  const box = await p.locator("#" + id).boundingBox();
  const clip = { x: Math.floor(box.x), y: Math.floor(box.y), width: Math.ceil(box.width / 2) * 2, height: Math.ceil(box.height / 2) * 2 };
  const framesDir = path.join(OUT, "_frames-" + id);
  fs.mkdirSync(framesDir, { recursive: true });
  const total = Math.round(dur * FPS);
  for (let f = 0; f <= total; f++) {
    await p.evaluate(([i, t]) => { window.__anims[i].tl.seek(t, false).pause(); }, [id, f / FPS]);
    await p.screenshot({ clip, omitBackground: true, path: path.join(framesDir, String(f).padStart(4, "0") + ".png") });
  }
  await p.evaluate((i) => { window.__anims[i].tl.seek(0, false).pause(); }, id);
  const sub = SECTIONS.has(id) ? "sections" : "intro 10-38s";
  const mov = path.join(OUT, sub, id + ".mov");
  execFileSync("ffmpeg", ["-y", "-framerate", String(FPS), "-i", path.join(framesDir, "%04d.png"),
    "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", "-vendor", "apl0", mov],
    { stdio: "pipe" });
  fs.rmSync(framesDir, { recursive: true });
  console.log("rendered", mov, `(${dur}s, ${total + 1} frames, ${clip.width}x${clip.height}@2x)`);
}
await b.close();
console.log("ALL DONE");
