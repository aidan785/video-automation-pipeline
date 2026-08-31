import { chromium } from 'playwright';
const CARDS = [
  ['tr-match-carry', [1.35, 1.5, 1.75]],
  ['tr-punch-cut', [2.5, 3.2]],
  ['tr-glass-wipe', [1.5, 1.62, 1.8]],
  ['tr-panel-slide', [1.1, 3.0]],
  ['tr-dot-boot-gate', [1.7, 2.4]],
  ['tr-zoom-through', [1.5, 2.45, 3.1]],
];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [slug, times] of CARDS) {
  await page.goto(`http://localhost:8090/09-higgsfield/cards/transitions/${slug}.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__timelines && Object.keys(window.__timelines).length, { timeout: 15000 });
  for (const t of times) {
    await page.evaluate((tt) => { const tl = Object.values(window.__timelines)[0]; tl.pause(tt); }, t);
    await page.waitForTimeout(250);
    await page.screenshot({ path: `_shots-hgtrans/${slug}-t${String(t).replace('.','_')}.png` });
  }
}
await browser.close();
console.log('done');
