/* @ascii-engine:start v1 */
/* SANJI · SYSTEM canvas · ASCII engine (single source of truth).
   Cards carry an INLINED copy between the @ascii-engine markers (inline
   assembly only copies a card's own <script>). Edit this file, then run
   `node scripts/style-library/sync-ascii-engine.mjs` to restamp every card.

   Model (measured from the BUCK blue-screen spots): every image is a
   grayscale paint mapped to a density ramp of glyphs on a fixed grid.
     const F = SYS.field(canvasEl, { cw: 15, ch: 22 });
     F.paint((g) => { ...draw grayscale in 1920x1080 coords... });  // white = dense glyph
     F.clearText(); F.text(col, row, "Send:", { alpha: 1, inv: false });
     F.render(t, { flicker: 0.25 });
   Everything is a pure function of t (seeded hashes, no Math.random). */
const SYS = (function () {
  const RAMP = " .,:-~>*+cC%#$";
  const NOISE = "#$%&*+-/<=>?@[]^_{|}~0123456789ABCDEFxz";
  const c01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const hash = (x, y, s) => {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const lcg = (seed) => { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); };
  const sm = (t) => t * t * (3 - 2 * t);
  const vnoise = (x, y, s) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  const fbm = (x, y, s, oct = 4) => { let v = 0, amp = 0.5, f = 1; for (let i = 0; i < oct; i++) { v += amp * vnoise(x * f, y * f, s + i * 17); f *= 2; amp *= 0.5; } return v; };
  /* frame index at 24fps: glyph noise ticks on frames, like the reference */
  const frame = (t) => Math.floor(t * 24 + 1e-6);

  /* scramble: resolved prefix + a short tail of noise glyphs that rides the edge.
     p 0..1 = progress; tail = noise chars ahead of the resolved edge. */
  function scramble(final, p, t, seed = 7, tail = 3) {
    const n = final.length, k = Math.floor(c01(p) * n + 1e-6);
    if (k >= n) return final;
    let out = final.slice(0, k);
    const f = frame(t);
    for (let i = k; i < Math.min(n, k + tail); i++) out += final[i] === " " ? " " : NOISE[Math.floor(hash(i, f, seed) * NOISE.length)];
    return out;
  }
  /* noise-only string of length n (for chip glitch frames) */
  function noiseStr(n, t, seed = 3) { let s = ""; const f = frame(t); for (let i = 0; i < n; i++) s += NOISE[Math.floor(hash(i, f, seed) * NOISE.length)]; return s; }

  function field(canvas, opts = {}) {
    const W = opts.width || 1920, H = opts.height || 1080;
    const cw = opts.cw || 15, ch = opts.ch || 22;
    const cols = Math.ceil(W / cw), rows = Math.ceil(H / ch);
    const font = opts.font || `600 ${Math.round(ch * 0.98)}px "IBM Plex Mono", "JetBrains Mono", monospace`;
    const ink = opts.ink || "243,245,255", bg = opts.bg || "#0F18FB";
    const ramp = opts.ramp || RAMP;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const src = document.createElement("canvas"); src.width = cols; src.height = rows;
    const sctx = src.getContext("2d", { willReadFrequently: true });
    let lum = new Float32Array(cols * rows);
    const ovC = new Array(cols * rows).fill(null), ovA = new Float32Array(cols * rows), ovI = new Uint8Array(cols * rows);

    const F = {
      cols, rows, cw, ch, W, H, ctx, src: sctx,
      /* grayscale paint in 1920x1080 coordinates; white = bright/dense */
      paint(fn) {
        sctx.setTransform(1, 0, 0, 1, 0, 0);
        sctx.globalAlpha = 1; sctx.globalCompositeOperation = "source-over";
        sctx.fillStyle = "#000"; sctx.fillRect(0, 0, cols, rows);
        sctx.setTransform(cols / W, 0, 0, rows / H, 0, 0);
        sctx.fillStyle = "#fff"; sctx.strokeStyle = "#fff";
        fn(sctx);
        const d = sctx.getImageData(0, 0, cols, rows).data;
        for (let i = 0; i < cols * rows; i++) lum[i] = d[i * 4] / 255;
      },
      /* direct luminance function per cell: fn(col,row,x,y) -> 0..1 (added to paint) */
      fn(fn, mode = "max") {
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const i = r * cols + c, v = fn(c, r, (c + 0.5) * cw, (r + 0.5) * ch);
          lum[i] = mode === "add" ? c01(lum[i] + v) : mode === "set" ? c01(v) : Math.max(lum[i], v);
        }
      },
      clearLum() { lum.fill(0); },
      clearText() { ovC.fill(null); ovA.fill(0); ovI.fill(0); },
      /* write a string into the grid. col/row in cells; inv = inverse-video chip */
      text(col, row, str, o = {}) {
        if (row < 0 || row >= rows) return;
        for (let i = 0; i < str.length; i++) {
          const c = col + i; if (c < 0 || c >= cols) continue;
          const k = row * cols + c;
          if (str[i] === " " && !o.inv && !o.keepSpace) continue;
          ovC[k] = str[i]; ovA[k] = o.alpha == null ? 1 : o.alpha; ovI[k] = o.inv ? 1 : 0;
        }
      },
      /* text placed by pixel position (snapped to the grid) */
      textAt(x, y, str, o = {}) { F.text(Math.round(x / cw), Math.round(y / ch), str, o); },
      lumAt(c, r) { return c < 0 || r < 0 || c >= cols || r >= rows ? 0 : lum[r * cols + c]; },
      render(t, o = {}) {
        const flick = o.flicker == null ? 0.18 : o.flicker;   /* prob a cell hops one ramp level per frame */
        const gain = o.gain == null ? 1 : o.gain, floor = o.floor == null ? 0.06 : o.floor;
        const aMin = o.alphaMin == null ? 0.38 : o.alphaMin, aMax = o.alphaMax == null ? 1 : o.alphaMax;
        const seed = o.seed || 11, f = frame(t), R = o.ramp || ramp, N = R.length - 1;
        ctx.clearRect(0, 0, W, H);
        if (o.fillBg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); }
        ctx.font = font; ctx.textBaseline = "top"; ctx.textAlign = "left";
        /* bucket by alpha so fillStyle changes stay cheap */
        const B = 8, buckets = Array.from({ length: B }, () => []);
        const inv = [];
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const k = r * cols + c;
          if (ovC[k] !== null) { if (ovI[k]) inv.push(k); else buckets[Math.min(B - 1, Math.floor(ovA[k] * (B - 1) + 0.5))].push([k, ovC[k]]); continue; }
          let v = lum[k] * gain;
          if (v < floor) continue;
          v = c01(v);
          let idx = Math.round(v * N);
          if (flick > 0 && hash(c, r, f * 31 + seed) < flick) idx += hash(r, c, f + seed) < 0.5 ? -1 : 1;
          idx = Math.max(1, Math.min(N, idx));
          const a = aMin + (aMax - aMin) * v;
          buckets[Math.min(B - 1, Math.floor(a * (B - 1) + 0.5))].push([k, R[idx]]);
        }
        for (let b = 0; b < B; b++) {
          if (!buckets[b].length) continue;
          ctx.fillStyle = `rgba(${ink},${(b / (B - 1)).toFixed(3)})`;
          for (const [k, chr] of buckets[b]) ctx.fillText(chr, (k % cols) * cw, Math.floor(k / cols) * ch);
        }
        if (inv.length) {
          ctx.fillStyle = `rgb(${ink})`;
          for (const k of inv) ctx.fillRect((k % cols) * cw, Math.floor(k / cols) * ch, cw, ch);
          ctx.fillStyle = bg;
          for (const k of inv) ctx.fillText(ovC[k], (k % cols) * cw, Math.floor(k / cols) * ch);
        }
      },
    };
    return F;
  }

  /* ---- grayscale paint helpers (draw onto F.src inside F.paint) ---------- */
  /* spinning coin: angle in radians around the vertical axis. Generic face
     (rim + inner ring + diagonal sheen bands); pass a glyph string for the face. */
  function coin(g, x, y, R, angle, o = {}) {
    const sx = Math.cos(angle), w = Math.max(R * 0.07, Math.abs(sx) * R);
    const thick = R * (o.thick || 0.16) * Math.abs(Math.sin(angle));
    const face = o.face == null ? 0.3 : o.face;
    g.save(); g.translate(x, y);
    /* edge band (visible as the coin turns): bright, reads as the sliver when edge-on */
    if (thick > 0.5) { g.fillStyle = `rgba(255,255,255,${o.edge || 0.8})`; g.beginPath(); g.ellipse(Math.sign(Math.sin(angle)) * thick * 0.5, 0, w, R, 0, 0, 6.2832); g.fill(); }
    g.fillStyle = `rgb(${Math.round(face * 255)},${Math.round(face * 255)},${Math.round(face * 255)})`; g.beginPath(); g.ellipse(0, 0, w, R, 0, 0, 6.2832); g.fill();
    /* lighter diagonal sheen bands (the reference's striped face) */
    g.save(); g.beginPath(); g.ellipse(0, 0, w * 0.92, R * 0.92, 0, 0, 6.2832); g.clip();
    g.rotate(-0.75); const ph = ((o.sheen || 0) * R * 1.4) % (R * 0.6);
    g.fillStyle = "rgba(255,255,255,0.32)";
    for (let b = -4; b <= 4; b++) g.fillRect(-R * 2, b * R * 0.6 + ph, R * 4, R * 0.2);
    g.restore();
    g.lineWidth = R * 0.11; g.strokeStyle = "#fff"; g.beginPath(); g.ellipse(0, 0, w * 0.95, R * 0.95, 0, 0, 6.2832); g.stroke();
    g.lineWidth = R * 0.04; g.strokeStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.ellipse(0, 0, w * 0.76, R * 0.76, 0, 0, 6.2832); g.stroke();
    if (o.glyph && Math.abs(sx) > 0.18) {
      g.save(); g.scale(sx, 1); g.fillStyle = "#fff";
      g.font = `800 ${R * 1.0}px "Inter Tight", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(o.glyph, 0, R * 0.05); g.restore();
    }
    g.restore();
  }
  /* soft dot (particle) */
  function dot(g, x, y, r, a = 1) { g.fillStyle = `rgba(255,255,255,${a})`; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); }
  /* big glyph-mask text, e.g. a word rendered as ASCII */
  function word(g, str, x, y, size, o = {}) {
    g.save(); g.fillStyle = `rgba(255,255,255,${o.alpha == null ? 1 : o.alpha})`;
    g.font = `${o.weight || 800} ${size}px ${o.family || '"Inter Tight", sans-serif'}`;
    g.textAlign = o.align || "center"; g.textBaseline = "middle"; g.fillText(str, x, y); g.restore();
  }
  /* SVG path (24-unit icon, e.g. Lucide) stroked into the paint */
  function icon(g, d, x, y, size, o = {}) {
    g.save(); g.translate(x - size / 2, y - size / 2); g.scale(size / 24, size / 24);
    const p = new Path2D(d);
    if (o.fill) { g.fillStyle = `rgba(255,255,255,${o.alpha == null ? 1 : o.alpha})`; g.fill(p); }
    g.lineWidth = o.width || 2; g.lineCap = "round"; g.lineJoin = "round";
    g.strokeStyle = `rgba(255,255,255,${o.alpha == null ? 1 : o.alpha})`; g.stroke(p); g.restore();
  }

  return { RAMP, NOISE, c01, hash, lcg, vnoise, fbm, frame, scramble, noiseStr, field, coin, dot, word, icon };
})();
/* @ascii-engine:end */
