import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on("console", (m) => console.log("[console]", m.type(), m.text().slice(0, 200)));
p.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 300)));
console.log("goto...");
await p.goto("http://localhost:8090/", { waitUntil: "domcontentloaded", timeout: 20000 });
console.log("loaded");
await p.waitForTimeout(3000);
const info = await p.evaluate(() => ({
  gsap: typeof window.gsap,
  tls: window.__timelines ? Object.keys(window.__timelines) : null,
  dur: window.__timelines && window.__timelines["caic-booth"] ? window.__timelines["caic-booth"].duration() : null,
}));
console.log(JSON.stringify(info));
await p.evaluate(() => window.__timelines["caic-booth"].seek(23.5));
await p.waitForTimeout(400);
await p.screenshot({ path: "/tmp/caic-shots/dbg-23.5.png" });
console.log("shot ok");
await b.close();
