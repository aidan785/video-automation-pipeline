// Programmatic overlap sweep: at each beat's densest moment, measure all visible
// card rects inside the player iframe and report sibling pairs that intersect.
import { chromium } from 'playwright';

const SETS = [
  [3031, 'p30', [26.5, 38.5, 56.5, 80.5, 104.5, 126, 191.5, 214.5, 236, 258.5, 269.5, 278.5]],
  [3032, 'p31', [31, 58, 90, 112, 210, 236, 290, 322, 367, 402, 416]],
  [3033, 'p32', [40, 67, 86, 218, 292, 370, 423, 468, 510, 528]],
];

const SEL = '.chipx,.punchx,.warnx,.qrow,.kc,.quote,.ln,.mpill,.l1,.l2,.found,.kick,.kicker,#vidframe';

const browser = await chromium.launch();
let issues = 0;
for (const [port, name, times] of SETS) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`http://localhost:${port}/preview`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('hyperframes-player', { timeout: 30000 });
  await page.waitForFunction(() => {
    const p = document.querySelector('hyperframes-player');
    if (!p || typeof p.seek !== 'function') return false;
    p.seek(1.0); return p.currentTime > 0.5;
  }, { timeout: 60000 });
  await page.waitForTimeout(1500);

  for (const t of times) {
    await page.evaluate((tt) => document.querySelector('hyperframes-player').seek(tt), t);
    await page.waitForTimeout(1200);
    const ct = await page.evaluate(() => document.querySelector('hyperframes-player').currentTime);
    if (Math.abs(ct - t) > 0.5) { console.log(`  RESET at ${name}@${t} — re-seeking`); await page.evaluate((tt) => document.querySelector('hyperframes-player').seek(tt), t); await page.waitForTimeout(1500); }
    const overlaps = await page.evaluate((sel) => {
      const p = document.querySelector('hyperframes-player');
      const doc = p.shadowRoot.querySelector('iframe').contentWindow.document;
      const els = [...doc.querySelectorAll(sel)];
      const vis = [];
      for (const el of els) {
        const cs = el.ownerDocument.defaultView.getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        // effective opacity up the tree
        let op = 1, n = el;
        while (n && n.nodeType === 1) { op *= parseFloat(el.ownerDocument.defaultView.getComputedStyle(n).opacity || '1'); n = n.parentElement; }
        if (op < 0.5) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        vis.push({ el, r });
      }
      const out = [];
      for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
        const a = vis[i], b = vis[j];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
        const iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (ix > 6 && iy > 6) {
          const id = (e) => (e.id ? '#' + e.id : '.' + [...e.classList].join('.')) + (e.closest('[id^=b]') ? ' in #' + e.closest('[id^=b]').id : '');
          out.push(`${id(a.el)} × ${id(b.el)} (${Math.round(ix)}x${Math.round(iy)}px)`);
        }
      }
      return out;
    }, SEL);
    if (overlaps.length) { issues += overlaps.length; console.log(`${name} @${t}s:`); for (const o of overlaps) console.log('  OVERLAP ' + o); }
  }
  await page.close();
}
await browser.close();
console.log(issues ? `\n${issues} overlap(s) found` : '\nno overlaps found');
