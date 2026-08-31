// Frame-shot harness for the VSL comp (:3037).
// Hardened: triple re-seek race handling + player-reset detection (Studio hot-reload
// can bounce the page mid-run, leaving the playhead at 0:00 and every later shot stale).
import { chromium } from 'playwright';
import fs from 'node:fs';

const TIMES = process.argv[2]
  ? process.argv[2].split(',').map(Number)
  : [13, 20, 33, 40, 75, 88, 93, 100, 112, 125, 134, 140, 156,
     165, 178, 183, 195, 205, 215, 230, 240, 250, 275, 285,
     300, 320, 332, 340, 356, 362, 372, 387, 393, 405, 408,
     414, 423, 431, 435,
     16.65, 71.9, 109.45, 158.5, 188.35, 234.8, 245.2, 292.75, 334.9, 366.85, 410.2, 427.1];

const OUT = '_shots-vsl';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

async function initPlayer() {
  await page.goto('http://localhost:3037/preview', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('hyperframes-player', { timeout: 30000 });
  await page.waitForFunction(() => {
    const p = document.querySelector('hyperframes-player');
    if (!p || typeof p.seek !== 'function') return false;
    p.seek(1.0); return p.currentTime > 0.5;
  }, { timeout: 60000 });
  await page.waitForTimeout(2500);
}
await initPlayer();

for (const t of TIMES) {
  let ct = -1, ok = false;
  for (let attempt = 0; attempt < 4 && !ok; attempt++) {
    try {
      await page.evaluate((tt) => document.querySelector('hyperframes-player').seek(tt), t);
      await page.waitForTimeout(2000);
      ct = await page.evaluate(() => document.querySelector('hyperframes-player').currentTime);
    } catch { ct = -1; }
    if (Math.abs(ct - t) < 0.5) ok = true;
    else if (ct < 1 && t > 1) { console.log(`  [reset detected at t=${t}, reinit]`); await initPlayer(); }
  }
  const file = `${OUT}/t${String(t).replace('.', '_')}.png`;
  await page.screenshot({ path: file });
  console.log(`${file}  (ct=${ct.toFixed(2)}${ok ? '' : '  STALE'})`);
}
await browser.close();
