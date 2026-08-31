// Frame-verification harness: seek the master timeline (and both source videos)
// to each beat's hero moment and screenshot the 1920x1080 stage.
//
//   npx serve . -p 8099 -n     (in this folder)
//   node _shots.mjs [--offset 1.6] [--only 3,7,12]
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const HERO = Number(opt("--offset", "1.6")); // seconds into the beat = after the entrance lands
const only = opt("--only", null)?.split(",").map(Number);
const OUT = opt("--out", "snapshots");
const URL = opt("--url", "http://localhost:8099/index.html");
const COMP = "editing-os-tutorial";

const plan = JSON.parse(readFileSync("band-plan.json", "utf8"));
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on("console", (m) => { if (m.type() === "error") console.log("  page error:", m.text()); });
await page.goto(URL, { waitUntil: "load" });

await page.waitForFunction(`!!(window.__timelines && window.__timelines["${COMP}"])`, { timeout: 30000 });
// both source videos must have enough data to paint a frame after a seek
await page.waitForFunction(
  `[...document.querySelectorAll("video")].every(v => v.readyState >= 1)`,
  { timeout: 60000 }
);
await page.evaluate(() => document.querySelectorAll("video").forEach((v) => v.pause()));

const beats = plan.beats.map((b, i) => ({ ...b, n: i + 1 })).filter((b) => !only || only.includes(b.n));

for (const b of beats) {
  const t = b.start + Math.min(HERO, b.duration * 0.6);
  await page.evaluate(async (t) => {
    const vids = [...document.querySelectorAll("video")];
    await Promise.all(
      vids.map(
        (v) =>
          new Promise((res) => {
            if (Math.abs(v.currentTime - t) < 0.05) return res();
            v.addEventListener("seeked", res, { once: true });
            v.currentTime = t;
            setTimeout(res, 4000); // don't hang on a stubborn seek
          })
      )
    );
  }, t);
  await page.evaluate(([comp, t]) => {
    const tl = window.__timelines[comp];
    tl.pause();
    tl.seek(t, false);
  }, [COMP, t]);
  await page.waitForTimeout(250);

  const name = `${String(b.n).padStart(2, "0")}_${b.type}_${t.toFixed(1)}s.png`;
  await page.locator(`#${COMP}`).screenshot({ path: `${OUT}/${name}` });
  console.log(`${String(b.n).padStart(2, " ")}  ${t.toFixed(1)}s  ${b.type}`);
}

await browser.close();
console.log(`\n${beats.length} shots → ${OUT}/`);
