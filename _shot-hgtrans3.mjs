import { chromium } from 'playwright';
const CARDS = [
  ['tr-whip-pan', [1.45, 1.9]],
  ['tr-spin-whip', [1.42, 1.65]],
  ['tr-zoom-punch', [1.45, 1.7]],
  ['tr-push-parallax', [1.5, 1.9]],
  ['tr-venetian-slats', [1.4, 1.7]],
  ['tr-circle-reveal', [1.7, 1.95]],
  ['tr-letterbox-crush', [1.55, 1.9]],
  ['tr-type-wiper', [1.6, 1.9]],
  ['tr-pip-expand', [2.2, 2.5]],
  ['tr-flash-cut', [1.55, 1.75]],
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
