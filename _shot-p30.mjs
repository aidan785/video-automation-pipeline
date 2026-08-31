// Frame verification for caic-p30-intro via Studio player-seek
import { chromium } from 'playwright';
import fs from 'node:fs';

const PORT = 3031;
const OUT = '/tmp/p30-frames';
fs.mkdirSync(OUT, { recursive: true });

const SHOTS = [
  ['b1-coldopen', 2.6],
  ['full-face', 8.0],
  ['b2-cafe-punch', 26.5],
  ['b2-cafe-warn', 38.5],
  ['b3-mistake', 56.5],
  ['b4-reframe', 80.5],
  ['b5-handoff', 104.5],
  ['b6-truth', 126.0],
  ['b7-pip-quotes', 152.0],
  ['b7-pip-rules', 191.5],
  ['b8-buckets', 214.5],
  ['b9-roadmap', 236.0],
  ['b10-scars', 258.5],
  ['b11-employed', 269.5],
  ['b12-outro', 278.5],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`http://localhost:${PORT}/preview`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('hyperframes-player', { timeout: 30000 });

// readiness poll: seek must actually move currentTime
await page.waitForFunction(() => {
  const p = document.querySelector('hyperframes-player');
  if (!p || typeof p.seek !== 'function') return false;
  p.seek(1.0);
  return p.currentTime > 0.5;
}, { timeout: 60000 });
await page.waitForTimeout(1500);

for (const [name, t] of SHOTS) {
  await page.evaluate((tt) => document.querySelector('hyperframes-player').seek(tt), t);
  await page.waitForTimeout(1400);
  const ct = await page.evaluate(() => document.querySelector('hyperframes-player').currentTime);
  if (Math.abs(ct - t) > 0.5) console.log(`WARN ${name}: wanted ${t}, player at ${ct.toFixed(2)} (hot-reload reset?)`);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`shot ${name} @${t} (player ${ct.toFixed(2)})`);
}
await browser.close();
console.log('done ->', OUT);
