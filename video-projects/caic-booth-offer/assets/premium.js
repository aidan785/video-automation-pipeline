// CAIC booth offer — premium runtime. One paused GSAP timeline registered on window.__timelines["caic-booth-offer"].
// Motion follows the certification site: letters blur in, blocks fade/rise softly, the plates breathe, the ridges drift.
(() => {
  const DUR = __DUR__;
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];

  // headlines -> words (keep wrapping) -> chars (for the blur-in)
  const splitChars = (el) => {
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { f.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "wd";
          for (const c of part) { const s = document.createElement("span"); s.className = "ch"; s.textContent = c; w.appendChild(s); }
          f.appendChild(w);
        });
        n.replaceWith(f);
      } else if (n.nodeType === 1 && n.tagName !== "BR") splitChars(n);
    });
  };
  $$(".h, .ptitle").forEach(splitChars);

  const tl = gsap.timeline({ paused: true });
  const E = "power3.out";
  const letters = (sel, at, st = 0.016) => tl.fromTo($$(sel + " .ch"), { opacity: 0, y: "0.2em", filter: "blur(10px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, stagger: st, ease: E }, at);
  const rise = (sel, at, d = 0.9, from = {}) => tl.fromTo(sel, Object.assign({ autoAlpha: 0, y: 18, filter: "blur(8px)" }, from),
    { autoAlpha: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)", duration: d, ease: E }, at);
  const out = (sel, at) => tl.to(sel, { autoAlpha: 0, y: -10, filter: "blur(6px)", duration: 0.45, ease: "power2.in" }, at);
  const credIn = (sel, at) => tl.fromTo(sel, { autoAlpha: 0, y: 40, rotateY: 22, rotateX: 2, transformPerspective: 1400, filter: "blur(12px)" },
    { autoAlpha: 1, y: 0, rotateY: 9, rotateX: 2, transformPerspective: 1400, filter: "blur(0px)", duration: 1.25, ease: E }, at);

  const ON = "#f7f8fa", DONE = "rgba(244,245,247,0.6)", CY = "#37bdf8";
  // walk a list: each item lights up on its spoken word; the one before it steps back to "done"
  const walk = (els, times, on, off) => times.forEach((at, i) => { on(els[i], at); if (i) off(els[i - 1], at); });

  // ---- world + Nate's plate (whole spot)
  tl.fromTo("#mFar", { x: 0 }, { x: -30, duration: DUR, ease: "none" }, 0);
  tl.fromTo("#mMid", { x: 0 }, { x: -64, duration: DUR, ease: "none" }, 0);
  tl.fromTo("#mFront", { x: 0 }, { x: -118, duration: DUR, ease: "none" }, 0);
  tl.fromTo("#prog", { scaleX: 0 }, { scaleX: 1, duration: DUR, ease: "none" }, 0);
  // Nate's plate stays flat and square-on (only the CAIC credential card carries the 3D tilt)
  tl.fromTo("#natePlate", { autoAlpha: 0, scale: 0.97, filter: "blur(10px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: E }, 0);
  // (v3) the punch-in now switches once, on the only cut left (the retake); it is set on the outer timeline below
  tl.fromTo(".chrome .brand", { autoAlpha: 0, y: -8 }, { autoAlpha: 0.92, y: 0, duration: 0.8, ease: E }, 0.2);

  // ---- B1 · the problem ("every" 0.42 / "already have the skills" 3.10)
  rise("#b1 .tag", 0.3, 0.7); letters("#b1-h", 0.5); rise("#b1-s", 2.9); out("#b1 .col", 4.3);

  // ---- B2 · the hiring question ("business" 5.22 / "hire" 6.50 / "most people" 8.02)
  rise("#b2 .tag", 4.9, 0.7); letters("#b2-h", 5.05); rise("#b2-s", 7.8); out("#b2 .col", 9.05);

  // ---- B3 · the credential plate ("Certified" 10.32 / "CAIC" 12.06 / "built" 14.08)
  credIn("#b3-cred", 9.75); letters("#b3-cred .ptitle", 10.2, 0.022); rise("#b3-cred .pcaic", 11.85, 0.7);
  $$("#b3-cred .prow").forEach((r, i) => rise(r, 12.45 + i * 0.28, 0.7));
  rise("#b3-cred .pfoot", 13.65, 0.7);
  tl.fromTo("#b3-cred .pglobe", { boxShadow: "0 0 18px rgba(55,189,248,0.3)" }, { boxShadow: "0 0 34px rgba(55,189,248,0.7)", duration: 0.8, yoyo: true, repeat: 1, ease: "sine.inOut" }, 12.0);
  out("#b3 .col", 14.4);

  // ---- B4 · two tracks ("clients" 16.50 / "AI person" 17.66)
  rise("#b4 .tag", 14.95, 0.7);
  rise("#b4-t1", 15.55); rise("#b4-t2", 15.7);
  walk([$("#b4-t1"), $("#b4-t2")], [16.05, 17.5],                          // "work with clients" 16.22 / "the AI person" 17.66
    (el, at) => { tl.to(el, { borderColor: "rgba(55,189,248,0.6)", backgroundColor: "rgba(55,189,248,0.09)", boxShadow: "0 0 40px -12px rgba(55,189,248,0.5)", duration: 0.35 }, at);
                  tl.to(el.querySelector(".tt"), { color: ON, duration: 0.35 }, at); tl.to(el.querySelector(".mono"), { color: CY, duration: 0.35 }, at); },
    (el, at) => { tl.to(el, { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)", boxShadow: "0 0 0 0 rgba(55,189,248,0)", duration: 0.35 }, at);
                  tl.to(el.querySelector(".tt"), { color: DONE, duration: 0.35 }, at); tl.to(el.querySelector(".mono"), { color: "rgba(244,245,247,0.5)", duration: 0.35 }, at); });
  rise("#b4-f", 17.95, 0.7); out("#b4 .col", 18.85);

  // ---- B5 · the work rail ("discovery" 19.76 / "build" 22.70 / "evals" 24.22 / "worth" 26.06)
  rise("#b5 .tag", 19.5, 0.7);
  const items = $$("#b5 .ritem"), acts = [19.45, 22.55, 23.55, 24.95];   // "run" 19.60 / "build" 22.70 / "prove" 23.68 / "figure out … worth" 25.12
  tl.fromTo(items, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: E }, 19.4);   // all four appear muted (CSS)
  const nodeY = (i) => items[i].offsetTop + 35 - 34; // node centre relative to the rail fill origin
  const q = (el, s) => el.querySelector(s);
  walk(items, acts,
    (el, at) => { tl.to(q(el, ".rt"), { color: ON, duration: 0.3 }, at); tl.to(q(el, ".rd"), { color: "rgba(244,245,247,0.75)", duration: 0.3 }, at);
                  tl.to(q(el, ".rnum"), { color: CY, duration: 0.3 }, at);
                  tl.to(q(el, ".rnode"), { backgroundColor: CY, borderColor: CY, boxShadow: "0 0 18px #37bdf8", scale: 1.35, duration: 0.3 }, at); },
    (el, at) => { tl.to(q(el, ".rt"), { color: DONE, duration: 0.3 }, at); tl.to(q(el, ".rd"), { color: "rgba(244,245,247,0.42)", duration: 0.3 }, at);
                  tl.to(q(el, ".rnum"), { color: "rgba(244,245,247,0.45)", duration: 0.3 }, at);
                  tl.to(q(el, ".rnode"), { boxShadow: "0 0 0 rgba(55,189,248,0)", scale: 1, duration: 0.3 }, at); });
  acts.forEach((at, i) => { if (i) tl.to("#b5-fill", { height: () => nodeY(i), duration: 0.45, ease: "power2.inOut" }, at - 0.2); });
  out("#b5 .col", 27.5);

  // ---- B6 · the certification case ("certified" 28.76 / "brand-new" 29.76 / "scope" 32.02 / "failing" 32.94 / "reasoning" 35.96)
  rise("#b6 .tag", 28.35, 0.7); letters("#b6-h", 29.45, 0.014);
  rise("#b6-card", 31.55, 0.6);
  const r6 = $$("#b6-card .prow"), t6 = [31.85, 32.4, 35.15];               // "scope" 32.02 / "find" 32.54 / "explain" 35.28
  t6.forEach((at, i) => rise(r6[i], at, 0.6, { y: 10 }));
  const rowOn = (el, at) => { tl.to(el.querySelector(".pl"), { color: CY, duration: 0.3 }, at); tl.to(el.querySelector(".pv"), { color: ON, duration: 0.3 }, at); };
  const rowOff = (el, at) => { tl.to(el.querySelector(".pl"), { color: "rgba(244,245,247,0.4)", duration: 0.3 }, at); tl.to(el.querySelector(".pv"), { color: "rgba(244,245,247,0.5)", duration: 0.3 }, at); };
  walk(r6, t6, rowOn, rowOff);
  out("#b6 .col", 36.05);

  // ---- B7 · live interview ("live" 37.54 / "walk" 38.86)
  rise("#b7 .tag", 36.8, 0.7); letters("#b7-h", 37.2); rise("#b7-s", 38.55); out("#b7 .col", 40.3);

  // ---- B8 · what you get ("certify" 41.14 / "personal" 41.86 / "reference" 44.72)
  rise("#b8 .tag", 40.9, 0.7); rise("#b8-card", 41.3, 0.8);
  const r8 = $$("#b8-card .prow"), t8 = [41.7, 43.65];                      // "personal letter" 41.86 / "plus AIS" 43.76
  t8.forEach((at, i) => rise(r8[i], at, 0.6, { y: 10 })); walk(r8, t8, rowOn, rowOff);
  out("#b8 .col", 46.9);

  // ---- B9 · cohort 1 ("cohort" 47.80 / "thirty-six" 49.00)
  rise("#b9 .tag", 47.5, 0.7); rise("#b9-stat", 48.35, 1.0);
  const cnt = { v: 0 }, numEl = $("#b9-stat .num");
  tl.fromTo(cnt, { v: 0 }, { v: 36, duration: 1.1, ease: "power3.out", onUpdate: () => { numEl.textContent = String(Math.round(cnt.v)); } }, 48.35);
  rise("#b9-s", 49.0); rise("#b9-f", 50.5, 0.7); out("#b9 .col", 51.2);

  // ---- B10 · CTA ("join the waitlist" 51.82 / "anyone" 54.64)
  rise("#b10-cta", 51.65, 0.9, { scale: 0.96 });
  tl.to("#b10-cta", { boxShadow: "0 24px 90px -18px rgba(55,189,248,0.85), inset 0 0 0 1px rgba(255,255,255,0.5)", duration: 0.7, yoyo: true, repeat: 1, ease: "sine.inOut" }, 52.6);
  rise("#b10-f", 52.95, 0.7); out("#b10 .col", 54.15);

  // ---- B11 · close ("hope" 55.98; hold)
  credIn("#b11-cred", 54.55); letters("#b11-cred .ptitle", 54.9, 0.02);
  $$("#b11-cred .prow").forEach((r, i) => rise(r, 55.5 + i * 0.25, 0.7));
  letters("#b11-h", 55.75);

  tl.to({}, { duration: DUR }, 0);

  // ---- v3 cut: Nate's natural phrasing restored ("be the person inside your company, the AI person inside your company",
  // "what it costs … to run", the pause before "Thanks"). The beats above stay authored on the v2 timeline; this maps
  // film time (new) -> v2 time (old). Each restored span holds the graphics still: [new, old] knots, linear between.
  const NEW = __DUR_NEW__, K = [[0, 0], [17.40, 17.40], [18.67, 17.40], [28.61, 27.34], [28.83, 27.34], [58.48, 56.99], [58.76, 56.99], [NEW, NEW - 1.77]];
  const map = (t) => { for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, u] = K[i - 1], [b, v] = K[i]; return b > a ? u + (t - a) * (v - u) / (b - a) : v; } return t - 1.77; };
  const film = gsap.timeline({ paused: true }), clock = { t: 0 };
  film.to(clock, { t: NEW, duration: NEW, ease: "none", onUpdate: () => tl.seek(map(clock.t), false) }, 0);
  film.set("#vzoom", { scale: 1.07 }, 1267 / 30 - 0.001);       // the one remaining cut (retake removed): clip frame 1267
  window.__timelines = window.__timelines || {};
  window.__timelines["caic-booth-offer"] = film;
})();
