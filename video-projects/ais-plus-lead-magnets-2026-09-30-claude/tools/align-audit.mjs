#!/usr/bin/env node
// Alignment audit for a built composition (static layout, no playback needed).
// Rule: 16:9 -> every scene element's LEFT edge sits on the headline's left edge (x=96), unless it is a
//        deliberate right-side element; 9:16 -> every element's CENTER sits on the frame center (x=540).
// Also checks media windows (.mwrap) and text lines inside a group share one edge.
// Usage: node tools/align-audit.mjs 06-compositions/<comp> [--tol 6]
import { chromium } from "playwright";
import { resolve } from "node:path";

const dir = resolve(process.argv[2]);
const TOL = Number(process.argv[process.argv.indexOf("--tol") + 1]) || 6;
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio"] });
const page = await browser.newPage();
await page.goto("file://" + dir + "/index.html");
await page.waitForTimeout(800);
const rep = await page.evaluate((TOL) => {
  const main = document.getElementById("main");
  const W = main.offsetWidth, vertical = W < 1200;
  const tl = window.__timelines.main;
  const r = (el) => el.getBoundingClientRect();
  // content extent: union of visible children, or the text run itself (not the container box)
  const ext = (el) => {
    if (el !== undefined && /\b(glass|schip|cchip|mchip|tile|status|step)\b/.test(el.className) && !el.classList.contains("ui")) return r(el); // cards and chips: their box is the visual edge
    const kids = [...el.children].filter((k) => !/sheen|reflection/.test(k.className) && r(k).width);
    if (kids.length) { const bs = kids.map((k) => ext(k)); return { left: Math.min(...bs.map((b) => b.left)), right: Math.max(...bs.map((b) => b.right)) }; }
    if (el.tagName === "IMG" || el.tagName === "svg" || el.tagName === "I") return r(el);
    const rg = document.createRange(); rg.selectNodeContents(el); const b = rg.getBoundingClientRect();
    return b.width ? b : r(el);
  };
  const out = [];
  document.querySelectorAll("section.scene").forEach((sc) => {
    const t0 = Number(sc.dataset.start), t1 = t0 + Number(sc.dataset.duration);
    tl.seek(Math.max(t0 + 0.9, t1 - 0.45));
    const axisLeft = ext(sc.querySelector(".eyebrow")).left;
    const check = (el, label, rule) => {
      const b = ext(el); if (!(b.right - b.left)) return;
      const off = rule === "center" ? Math.round((b.left + b.right) / 2 - W / 2) : Math.round(b.left - axisLeft);
      out.push({ scene: sc.id, el: label, left: Math.round(b.left), right: Math.round(b.right), off, rule, flag: Math.abs(off) > TOL });
    };
    const rule = vertical ? "center" : "left";
    check(sc.querySelector(".eyebrow"), "eyebrow", rule);
    sc.querySelectorAll("h1 span").forEach((x, i) => check(x, "h1 line " + (i + 1), rule));
    sc.querySelectorAll(".ui > *:not(.reflection)").forEach((x) => check(x, String(x.className).split(" ")[0], rule));
    // lockups: every line inside a column must share its first line's left edge
    sc.querySelectorAll(".cta-col, .kit, .c-list").forEach((col) => {
      const kids = [...col.children].filter((k) => r(k).width); if (!kids.length) return;
      if (getComputedStyle(col).display === "grid") { // grid lockup: each visual ROW (items sharing a top) must be centered on the axis
        const rows = {}; kids.forEach((k) => { const key = Math.round((r(k).top + r(k).bottom) / 2 / 24); const b = ext(k); rows[key] = rows[key] ? { left: Math.min(rows[key].left, b.left), right: Math.max(rows[key].right, b.right) } : { left: b.left, right: b.right }; });
        Object.values(rows).forEach((b, i) => { const off = Math.round((b.left + b.right) / 2 - (vertical ? W / 2 : (b.left + b.right) / 2)); out.push({ scene: sc.id, el: col.className.split(" ")[0] + " row " + (i + 1), left: Math.round(b.left), right: Math.round(b.right), off, rule: "lockup", flag: Math.abs(off) > TOL }); });
        return;
      }
      const centered = getComputedStyle(col).alignItems === "center"; // centered lockups share a center line, others a left edge
      const edge = (k) => { const b = ext(k); return centered ? (b.left + b.right) / 2 : b.left; };
      const L0 = edge(kids[0]);
      kids.forEach((k, i) => { const off = Math.round(edge(k) - L0); out.push({ scene: sc.id, el: col.className.split(" ")[0] + ">" + String(k.className).split(" ")[0] + i, left: Math.round(ext(k).left), right: Math.round(ext(k).right), off, rule: "lockup", flag: Math.abs(off) > TOL && !(col.classList.contains("kit") && k.classList.contains("skill-chips") && vertical) }); });
    });
  });
  // caption-zone check: no scene graphic or media window may reach into the caption band
  const capTop = Math.min(...[...document.querySelectorAll(".caption")].map((c) => r(c).top));
  document.querySelectorAll("section.scene").forEach((sc) => {
    const t0 = Number(sc.dataset.start), t1 = t0 + Number(sc.dataset.duration);
    tl.seek(Math.max(t0 + 0.9, t1 - 0.45));
    let bottom = 0, who = "";
    sc.querySelectorAll(".ui *:not(.reflection):not(.sheen)").forEach((el) => { const b = r(el); if (b.height && b.bottom > bottom && getComputedStyle(el).opacity !== "0") { bottom = b.bottom; who = String(el.className).split(" ")[0] || el.tagName; } });
    document.querySelectorAll(".mwrap").forEach((m) => { if (Number(getComputedStyle(m).opacity) < 0.05) return; const a0 = Number(m.dataset.in), a1 = Number(m.dataset.out); if (a1 > t0 && a0 < t1) { const b = r(m); if (b.bottom > bottom) { bottom = b.bottom; who = m.id; } } });
    const gap = Math.round(capTop - bottom);
    out.push({ scene: sc.id, el: "caption gap (" + who + ")", left: 0, right: Math.round(bottom), off: gap, rule: "capgap", flag: gap < 14 });
  });
  return { W, vertical, rows: out };
}, TOL);
await browser.close();
console.log(`${process.argv[2]}  (${rep.vertical ? "9:16, axis = center x=" + rep.W / 2 : "16:9, axis = headline left edge"})`);
for (const x of rep.rows) if (x.flag) console.log(x.rule === 'capgap' ? `  CAPTION ${x.scene.padEnd(4)} clearance ${String(x.off).padStart(4)}px  bottom at y=${x.right}  ${x.el}` : `  OFF ${String(x.off).padStart(5)}px  ${x.scene.padEnd(4)} ${x.rule.padEnd(6)} ${x.el.padEnd(22)} [${x.left} to ${x.right}]`);
console.log(`  ${rep.rows.filter((x) => x.flag && x.rule !== 'capgap').length} alignment issues, ${rep.rows.filter((x) => x.flag && x.rule === 'capgap').length} caption-zone collisions (need >= 14px clearance above captions)`);
