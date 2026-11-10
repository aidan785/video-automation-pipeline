/* @field-glass:start v3 */
/* HP V3 · FIELD GLASS motion helpers (single source of truth).
   Cards carry an inlined copy between the @field-glass markers (inline
   assembly only copies a card's own <script>). Edit this file, then run
   `node scripts/style-library/sync-hp3-libs.mjs`
   (restamps both the @text-preset and @field-glass blocks).

   Markup it expects (CSS lives in tokens.css, "FIELD GLASS utilities"):
     .fg-photo > img          the graded nature photo (drifts, sways)
     .fg-night                pre-sunrise veil, masked by --sr (radius %)
     .fg-flare                sun bloom at the burn origin (bottom-left)
     .fg-glass                glass pane; --fb blur px, --fm condense radius %,
                              --fx/--fy condense origin; child .fg-tint, .fg-dapple
   GROUND SWITCHES (v3, Aidan 11/3: not every card needs nature / the corner glow;
   some flat, some with grain, some with no background at all). Every card carries
   three hidden slots and calls FG.ground(ROOT, defaults) before building its timeline:
     <span class="fg-slot" data-slot="ground">oxblood</span>  photo | oxblood | deep | brick | cream | burn | wash | none
     <span class="fg-slot" data-slot="grain">off</span>       on | off
     <span class="fg-slot" data-slot="light">off</span>       on | off  (the bottom-left sunrise + flare)
   FG.ground sets data-ground / data-grain / data-light on the root; tokens.css does
   the rest (hides the photo / flare / night / grain, paints flat grounds, switches
   glass to the solid Sanji-style fill on flat grounds, makes "none" transparent).
     FG.ground(ROOT, {ground, grain, light}) -> {ground, photo, flat, none, grain, light}
   API (timeline-driven, deterministic):
     FG.sunrise(tl, root, at, {dur})        light burns up from bottom-left, flare peaks then settles
     FG.condense(tl, el, at, {dur, x, y})   glass fogs in from a point: clear -> frosted, tint rises
     FG.clear(tl, el, at, {dur})            glass evaporates (exit), edges first
     FG.beat(tl, el, at, {amp})             the logo's lub-dub: 1.07, back, 1.045, back
     FG.sway(tl, root, at, dur)             wind on the photo: slow drift + a breath of rotation
     FG.dapple(tl, el, at, dur)             leaf-shadow plate drifts across a pane
     FG.POP / FG.SETTLE                     HP pop ease (no overshoot) / uppit settle */
const FG = (function () {
  function bz(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t, dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x;
      for (let i = 0; i < 8; i++) { const e = sx(t) - x, d = dx(t); if (Math.abs(e) < 1e-6) return sy(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
      let lo = 0, hi = 1; t = x; for (let i = 0; i < 30; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-6) break; if (x > v) lo = t; else hi = t; t = (lo + hi) / 2; } return sy(t); };
  }
  const POP = bz(0.2, 0.9, 0.25, 1), SETTLE = bz(0.23, 1, 0.32, 1), GLIDE = bz(0.65, 0, 0.35, 1);
  const q = (root, s) => (root.matches && root.matches(s) ? root : root.querySelector(s));

  const comp = (el) => (el && el.closest ? el.closest("[data-composition-id]") : null);
  const FLAT = ["oxblood", "deep", "brick", "cream"];
  function ground(ROOT, d = {}) {
    const slot = (n) => { const e = ROOT.querySelector(`[data-slot="${n}"]`); return e ? e.textContent.trim().toLowerCase() : ""; };
    const g = slot("ground") || d.ground || "photo", grain = slot("grain") || d.grain || "off", light = slot("light") || d.light || "off";
    Object.assign(ROOT.dataset, { ground: g, grain, light: g === "none" ? "off" : light });
    const base = ROOT.querySelector(".fg-ground");
    if (base && g === "wash" && !base.querySelector(".fg-blob")) {
      [["gold", -260, 520], ["orange", 1180, -320], ["brick", 520, 340], ["deep", 1400, 560]].forEach(([c, x, y]) => {
        const b = document.createElement("div"); b.className = "fg-blob " + c; b.style.left = x + "px"; b.style.top = y + "px"; base.appendChild(b); });
    }
    return { ground: g, photo: g === "photo", flat: FLAT.includes(g), none: g === "none", grain: grain === "on", light: ROOT.dataset.light === "on" };
  }
  const lightOff = (root) => { const c = comp(root); return c && c.dataset.light === "off"; };
  function sunrise(tl, root, at = 0, o = {}) {
    if (lightOff(root)) return at;
    const dur = o.dur ?? 1.4, night = q(root, ".fg-night"), flare = q(root, ".fg-flare");
    if (night) tl.fromTo(night, { "--sr": 0 }, { "--sr": 150, duration: dur, ease: GLIDE }, at);
    if (flare) tl.fromTo(flare, { opacity: 0, scale: 0.4 }, { keyframes: [{ opacity: 1, scale: 1.1, duration: dur * 0.45, ease: "power2.out" }, { opacity: o.flareRest ?? 0.38, scale: 1, duration: dur * 0.9, ease: "sine.inOut" }] }, at);
    return at + dur;
  }
  function condense(tl, el, at = 0, o = {}) {
    const dur = o.dur ?? 0.9, tint = el.querySelector(":scope > .fg-tint");
    tl.set(el, { "--fx": o.x ?? "0%", "--fy": o.y ?? "100%", autoAlpha: 1 }, at);
    tl.fromTo(el, { "--fm": 0, "--fb": 0 }, { "--fm": 170, duration: dur, ease: SETTLE }, at)
      .to(el, { "--fb": o.blur ?? 28, duration: dur * 1.1, ease: "power2.out" }, at);
    if (tint) tl.fromTo(tint, { opacity: 0 }, { opacity: 1, duration: dur, ease: "power2.out" }, at + 0.05);
    return at + dur;
  }
  function clear(tl, el, at = 0, o = {}) {
    const dur = o.dur ?? 0.55;
    tl.to(el, { "--fb": 0, duration: dur, ease: "power2.in" }, at).to(el, { autoAlpha: 0, duration: dur * 0.7, ease: "power2.in" }, at + dur * 0.3);
    return at + dur;
  }
  function beat(tl, el, at = 0, o = {}) {
    const a = o.amp ?? 1;
    tl.to(el, { keyframes: [
      { scale: 1 + 0.07 * a, duration: 0.11, ease: "sine.inOut" }, { scale: 1, duration: 0.14, ease: "sine.inOut" },
      { scale: 1 + 0.045 * a, duration: 0.1, ease: "sine.inOut" }, { scale: 1, duration: 0.27, ease: "sine.inOut" }] }, at);
    return at + 0.62;
  }
  /* ambient motion for whatever the ground is: wind on a photo, drifting wash blobs, a slow sun on the burn */
  function sway(tl, root, at, dur) {
    const c = comp(root) || root, g = c.dataset.ground || "photo";
    if (g === "photo") { const img = q(root, ".fg-photo"); if (img) tl.fromTo(img, { scale: 1.1, x: -18, rotation: -0.25 }, { scale: 1.03, x: 14, rotation: 0.2, duration: dur, ease: "sine.inOut" }, at); }
    else if (g === "wash") root.querySelectorAll(".fg-blob").forEach((b, i) => tl.fromTo(b, { x: 0, y: 0 }, { x: (i % 2 ? -1 : 1) * 140, y: (i < 2 ? -1 : 1) * 70, duration: dur, ease: "sine.inOut" }, at));
    else if (g === "burn") { const gr = q(root, ".fg-ground"); if (gr) tl.fromTo(gr, { "--bx": "4%", "--by": "104%" }, { "--bx": "14%", "--by": "96%", duration: dur, ease: "sine.inOut" }, at); }
  }
  function dapple(tl, el, at, dur) {
    const d = el.matches(".fg-dapple") ? el : el.querySelector(".fg-dapple");
    if (d) tl.fromTo(d, { x: -60, y: 10 }, { x: 60, y: -14, duration: dur, ease: "sine.inOut" }, at);
  }
  return { ground, sunrise, condense, clear, beat, sway, dapple, POP, SETTLE, GLIDE, bz };
})();
/* @field-glass:end */
