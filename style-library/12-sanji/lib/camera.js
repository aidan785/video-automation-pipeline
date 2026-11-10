/* @camera:start v1 */
/* SANJI · CAMERA "screen-cam" (single source of truth). CAMERA.md has the measurements.
   Camera moves over screenshots / screen recordings that POINT at things: punch into
   the detail, hold with a slow creep, punch back out. Measured on every frame (30fps,
   22,359 frames) of a screen-recording tutorial (YouTube _fIoJ_ywGfY): 442 moves,
   median push 0.52s / x1.36, median pull 0.47s, speed curve = cubic-bezier(.42,.16,.2,.96)
   (mean error 0.002), sharpness drops to ~1/3 at peak speed (heavy motion blur), holds
   creep at ~1.1% zoom per second.
   Cards carry an inlined copy between the @camera markers; edit this file, then run
   `node scripts/style-library/sync-camera.mjs [files]`.

   Usage: put the screenshot / <video> / UI inside a wrapper div that fills the frame
   (the "stage"), then drive the wrapper:
     const cam = CAM.rig(stageEl, { w: 1920, h: 1080 });
     let t = cam.frame(tl, 0, { x: 0, y: 0, w: 1920, h: 1080 });          // wide, instant
     t = cam.push(tl, t + 0.6, { x: 1210, y: 300, w: 520, h: 292 });       // punch to the detail
     t = cam.creep(tl, t, 1.4);                                            // hold, slow drift in
     t = cam.pull(tl, t, { x: 0, y: 0, w: 1920, h: 1080 });                // punch back to wide
     cam.punch(tl, at, rect, hold)  = push + creep + pull in one call (the most common pattern)
     cam.pan(tl, at, rect)          = same-scale slide to a neighbour (short, 0.3s)
     cam.crash(tl, at, rect)        = fast hard push (0.3s, x2-3) used as a transition
   rect = the region (in stage pixels) that should fill the frame; aspect is matched
   automatically and a little breathing room (pad) is kept.
   All moves are tweens on one proxy, so they seek deterministically. */
const CAM = (function () {
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const e = sx(t) - x, d = dx(t); if (Math.abs(e) < 1e-6) return sy(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
      let lo = 0, hi = 1; t = x;
      for (let i = 0; i < 30; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-6) break; if (x > v) lo = t; else hi = t; t = (lo + hi) / 2; }
      return sy(t);
    };
  }
  /* measured move curve: soft start, fast middle, long settle */
  const EASE = bezier(0.42, 0.16, 0.2, 0.96);
  const D = { maxScale: 3.2, push: 0.52, pull: 0.47, pan: 0.3, crash: 0.3, pad: 0.08, creep: 0.011, blur: 14, maxBlur: 22 };

  function rig(stage, o = {}) {
    const W = o.w || 1920, H = o.h || 1080, pad = o.pad == null ? D.pad : o.pad;
    const blurK = o.blur == null ? D.blur : o.blur;
    stage.style.transformOrigin = "0 0";
    /* no will-change: Chrome would scale a cached bitmap and type goes soft at x3 */
    /* camera state: s = scale, x/y = stage translation (px) */
    const S = { s: 1, x: 0, y: 0 };
    const apply = (vel) => {
      stage.style.transform = `translate(${S.x}px, ${S.y}px) scale(${S.s})`;
      const b = Math.min(D.maxBlur, vel * blurK);
      stage.style.filter = b > 0.35 ? `blur(${b.toFixed(2)}px)` : "none";
    };
    /* convert a stage rect to the camera state that frames it */
    function target(r) {
      const ar = W / H; let w = r.w, h = r.h;
      if (w / h > ar) h = w / ar; else w = h * ar;
      w *= 1 + pad; h *= 1 + pad;
      const s = Math.min(o.maxScale || D.maxScale, Math.max(1, W / w));   /* reference never went past ~x3.2 */
      const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      let x = W / 2 - cx * s, y = H / 2 - cy * s;
      x = Math.min(0, Math.max(W - W * s, x)); y = Math.min(0, Math.max(H - H * s, y));   /* never show past the stage edge */
      return { s, x, y };
    }
    /* PLAN = the camera state at the end of the last scheduled move (build time).
       Every tween writes ABSOLUTE values from its planned start, so any seek order works. */
    const PLAN = { s: 1, x: 0, y: 0 };
    function move(tl, at, B, dur, ease) {
      const A = { ...PLAN }; const P = { p: 0 };
      tl.fromTo(P, { p: 0 }, {
        p: 1, duration: dur, ease: "none", immediateRender: false,
        onUpdate() {
          const e = ease(P.p), e2 = ease(Math.min(1, P.p + 1 / 30 / dur));
          /* zoom interpolated in log space so it reads as constant speed to the eye */
          const la = Math.log(A.s), lb = Math.log(B.s), ls = la + (lb - la) * e, ls2 = la + (lb - la) * e2;
          S.s = Math.exp(ls); S.x = A.x + (B.x - A.x) * e; S.y = A.y + (B.y - A.y) * e;
          const dz = Math.abs(ls2 - ls), dp = Math.hypot(B.x - A.x, B.y - A.y) * (e2 - e) / 1000;
          apply(P.p >= 1 || P.p <= 0 ? 0 : (dz + dp) * 5);
        },
      }, at);
      PLAN.s = B.s; PLAN.x = B.x; PLAN.y = B.y;
      return at + dur;
    }
    const api = {
      W, H, state: S, target, plan: PLAN,
      /* cut the camera to a framing (no move) */
      frame(tl, at, r) { const B = target(r); move(tl, at, B, 1 / 60, (x) => 1); if (at === 0) { S.s = B.s; S.x = B.x; S.y = B.y; apply(0); } return at; },
      push(tl, at, r, o = {}) { return move(tl, at, target(r), o.dur || D.push, o.ease || EASE); },
      pull(tl, at, r = { x: 0, y: 0, w: W, h: H }, o = {}) { return move(tl, at, target(r), o.dur || D.pull, o.ease || EASE); },
      pan(tl, at, r, o = {}) { return move(tl, at, target(r), o.dur || D.pan, o.ease || EASE); },
      crash(tl, at, r, o = {}) { return move(tl, at, target(r), o.dur || D.crash, o.ease || bezier(0.55, 0.05, 0.15, 1)); },
      /* hold with a slow continuous push about the frame centre (~1.1% zoom per second) */
      creep(tl, at, dur, o = {}) {
        const rate = o.rate == null ? D.creep : o.rate;
        const k = Math.exp(rate * dur), A = { ...PLAN };
        const B = { s: A.s * k, x: W / 2 - (W / 2 - A.x) * k, y: H / 2 - (H / 2 - A.y) * k };
        B.x = Math.min(0, Math.max(W - W * B.s, B.x)); B.y = Math.min(0, Math.max(H - H * B.s, B.y));
        /* creep never blurs: velocity is far below the blur threshold */
        return move(tl, at, B, dur, gsap.parseEase("sine.inOut"));
      },
      /* punch in, hold with creep, punch back out (the reference does this ~83 times) */
      punch(tl, at, r, hold = 1.2, back = { x: 0, y: 0, w: W, h: H }) {
        let t = api.push(tl, at, r); t = api.creep(tl, t, hold); return api.pull(tl, t, back);
      },
    };
    return api;
  }
  return { rig, EASE, bezier, DEFAULTS: D };
})();
/* @camera:end */
