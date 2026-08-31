import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1500 } });
await page.goto('http://localhost:8090/09-higgsfield/_preview/transitions.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
for (const [name, wait] of [['a', 0], ['b', 1100], ['c', 1300]]) {
  await page.waitForTimeout(wait);
  await page.screenshot({ path: `_shots-hgtrans-${name}.png`, fullPage: true });
}
await browser.close();
console.log('done');
