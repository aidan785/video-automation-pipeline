import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
await page.goto("http://localhost:3002", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.evaluate(() => new Promise((r) => setTimeout(r, 4000)));

// Find the iframe (player may live in shadow DOM or directly)
const frames = page.frames();
console.log("frames:", frames.map((f) => f.url()));

let target = null;
for (const f of frames) {
  const has = await f.evaluate(() => !!document.getElementById("bug")).catch(() => false);
  if (has) { target = f; break; }
}
if (!target) {
  // try shadow DOM iframe discovery
  const info = await page.evaluate(() => {
    const out = [];
    const walk = (root) => {
      root.querySelectorAll("*").forEach((el) => {
        if (el.shadowRoot) { out.push(el.tagName); walk(el.shadowRoot); }
        if (el.tagName === "IFRAME") out.push("IFRAME:" + (el.src || "(srcdoc)"));
      });
    };
    walk(document);
    return out;
  });
  console.log("shadow/iframe scan:", info);
}

if (target) {
  const data = await target.evaluate(() => {
    const pick = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName, id: el.id, cls: el.className,
        inlineStyle: el.getAttribute("style"),
        position: cs.position, overflow: cs.overflow,
        width: cs.width, height: cs.height,
        left: cs.left, top: cs.top, right: cs.right, bottom: cs.bottom,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      };
    };
    return {
      bug: pick(document.getElementById("bug")),
      bugInner: pick(document.querySelector("#bug .bug-inner")),
      mark: pick(document.querySelector("#bug .aismark")),
      parentOfBug: pick(document.getElementById("bug")?.parentElement),
    };
  });
  console.log(JSON.stringify(data, null, 2));
} else {
  console.log("could not find #bug in any frame");
}
await browser.close();
