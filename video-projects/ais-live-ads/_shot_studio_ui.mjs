import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
await page.goto("http://localhost:3002/", { waitUntil: "networkidle2", timeout: 60000 }).catch(()=>{});
await page.evaluate(() => new Promise(r=>setTimeout(r,2500)));
await page.screenshot({ path: "assets/shots/studio_ui.png" });
// dump any buttons/labels text to understand controls
const txt = await page.evaluate(() => Array.from(document.querySelectorAll('button,[role=button],a,label')).map(e=>e.textContent.trim()).filter(Boolean).slice(0,80));
console.log(JSON.stringify(txt));
await browser.close();
