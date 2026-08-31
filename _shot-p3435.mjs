// Frame-shot harness for p34 (:3035) and p35 (:3036).
import { chromium } from 'playwright';
import fs from 'node:fs';

const SETS = [
  [3035, 'p34', [4, 30, 46, 70, 100, 120, 135, 150, 160, 190, 214, 228, 260, 280, 300, 320, 350, 370, 395, 410, 425,
                 // scrim-exit midpoints
                 56.2, 153.7, 235.3, 324.2, 415.9]],
  [3036, 'p35', [4, 15, 32, 44, 60, 90, 110, 130, 160, 168, 200, 220, 240, 270, 290, 310, 330, 360, 400, 418, 444,
                 // scrim-exit midpoints
                 49.7, 171.0, 318.3, 427.3]],
];

const browser = await chromium.launch();
for (const [port, name, times] of SETS) {
  const OUT = `_shots-${name}`;
  fs.mkdirSync(OUT, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`http://localhost:${port}/preview`, { waitUntil: 'domcontentloaded' });
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
    const file = `${OUT}/t${String(t).replace('.', '_')}.png`;
    await page.screenshot({ path: file });
    console.log(`${file}  (ct=${ct.toFixed(2)})`);
  }
  await page.close();
}
await browser.close();
