// Captures each layer of index.html as a 3840x2160 PNG (alpha except backdrop).
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("./", import.meta.url));
const layers = [
  { id: "L1", name: "01-backdrop", alpha: false, extras: ["grain"] },
  { id: "L2", name: "02-stage-frame", alpha: true, extras: [] },
  { id: "L3", name: "03-spotlights", alpha: true, extras: [] },
  { id: "L4", name: "04-audience-back", alpha: true, extras: [] },
  { id: "L5", name: "05-audience-mid", alpha: true, extras: [] },
  { id: "L6", name: "06-audience-front", alpha: true, extras: [] },
];
const all = ["L1", "L2", "L3", "L4", "L5", "L6", "grain", "vignette"];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
await p.goto("file://" + dir + "index.html");
await p.waitForTimeout(800);

async function show(ids) {
  await p.evaluate((visible) => {
    document.querySelectorAll(".layer").forEach((el) => {
      el.style.display = visible.includes(el.id) ? "block" : "none";
    });
  }, ids);
  await p.waitForTimeout(150);
}

for (const l of layers) {
  await show([l.id, ...l.extras]);
  await p.screenshot({ path: `${dir}out/${l.name}.png`, omitBackground: l.alpha });
  console.log("shot", l.name);
}

await show(all);
await p.screenshot({ path: `${dir}out/_preview-composite.png` });
console.log("shot _preview-composite");
await b.close();
