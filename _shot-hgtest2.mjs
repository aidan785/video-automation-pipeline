import { chromium } from 'playwright';
import fs from 'node:fs';
const times = [8.12, 56.05, 125.45, 153.8, 154.4, 167.93, 235.15, 288.15, 324.05, 380.35, 415.9, 416.3];
const OUT = '_shots-hgtest';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('http://localhost:3040/preview', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('hyperframes-player', { timeout: 30000 });
await page.waitForFunction(() => {
  const p = document.querySelector('hyperframes-player');
  if (!p || typeof p.seek !== 'function') return false;
  p.seek(1.0); return p.currentTime > 0.5;
}, { timeout: 60000 });
await page.waitForTimeout(2000);
for (const t of times) {
  let ct = -1;
  for (let i = 0; i < 3; i++) {
    await page.evaluate((tt) => document.querySelector('hyperframes-player').seek(tt), t);
    await page.waitForTimeout(1600);
    ct = await page.evaluate(() => document.querySelector('hyperframes-player').currentTime);
    if (Math.abs(ct - t) < 0.5) break;
  }
  const file = `${OUT}/tr-t${String(t).replace('.', '_')}.png`;
  await page.screenshot({ path: file });
  console.log(`${file}  (ct=${ct.toFixed(2)})`);
}
await browser.close();
