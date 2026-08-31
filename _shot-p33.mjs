// Frame-shot harness for p33 (Studio :3034). Seeks hero moments + scrim-exit midpoints.
import { chromium } from 'playwright';
import fs from 'node:fs';

const PORT = 3034;
const OUT = '_shots-p33';
const TIMES = [
  3.5,   // B1 headline
  30,    // B2 early (flow chip + punch)
  53,    // B2 full stack
  60,    // B3 headline
  74,    // B3 rule cards
  95,    // B4 binary test cards
  130,   // B5a identity card
  165,   // B5a warn (all)
  215,   // B5b chips + punch
  231,   // B5b assembly rail
  270,   // B6 confession full
  299,   // B7 workflow/agent cols + punch
  345,   // B8 full stack
  385,   // B9a five patterns
  427,   // B9b brightwater rail + cards
  467,   // B10 mistakes
  483,   // B11 outro
  // scrim-exit midpoints (must show NO bare left strip / cut edge)
  56.2, 277.5, 350.4, 475.2,
];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`http://localhost:${PORT}/preview`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('hyperframes-player', { timeout: 30000 });
await page.waitForFunction(() => {
  const p = document.querySelector('hyperframes-player');
  if (!p || typeof p.seek !== 'function') return false;
  p.seek(1.0); return p.currentTime > 0.5;
}, { timeout: 60000 });
await page.waitForTimeout(1500);

for (const t of TIMES) {
  await page.evaluate((tt) => document.querySelector('hyperframes-player').seek(tt), t);
  await page.waitForTimeout(1400);
  let ct = await page.evaluate(() => document.querySelector('hyperframes-player').currentTime);
  if (Math.abs(ct - t) > 0.5) {
    await page.evaluate((tt) => document.querySelector('hyperframes-player').seek(tt), t);
    await page.waitForTimeout(1600);
    ct = await page.evaluate(() => document.querySelector('hyperframes-player').currentTime);
  }
  const name = `${OUT}/t${String(t).replace('.', '_')}.png`;
  await page.screenshot({ path: name });
  console.log(`${name}  (ct=${ct.toFixed(2)})`);
}
await browser.close();
