        /* ===== r12 insert (Aidan: on "but it was never about the tool" the four dots SPIN into the wheel; on "it was always about
           what humans do with it" the wheel becomes the carriage) =====
           Inside engine A's held clock (same hook as r11's tools insert). rt = root time.
           49.83 "But": the four pills orbit and spread round a circle -> the wheel bursts out of them and keeps spinning.
           52.09 "It was always…": the wheel slides back and shrinks into the coach's rear wheel; the coach, the front wheel, the
           horse, the driver and two passengers grow out of it; the ground streams under them, the wheels roll, the horse runs.
           53.98: every dot folds back into its pill spot, so engine A's ending (row -> rays) picks up with no seam. */
        (function () {
          const c01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), sg = (t, a, d) => c01((t - a) / d), lerp = (a, b, u) => a + (b - a) * u;
          const OUT = (u) => 1 - Math.pow(1 - u, 3), INOUT = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
          const IX = __IX__, IG = __IG__, IS = __IS__;
          const T_SPIN = 48.62, T_W = 49.0, T_C = 50.5, T_FOLD = 51.9, PC = 9, RW = 190;   /* r15: retimed onto "tool" (49.03) / "humans" (50.77), fold lands as the window ends (52.4) */
          const PILL = (k) => [960 + (k - 1.5) * 150, 540];
          /* the carriage layout (flat ground): rear wheel RX, front FX, horse HX, ground G */
          const G = 790, RR = 80, RF = 54, HX = 1190, RX = HX - 600, FX = HX - 330, A0 = [RX, G + 12 - RR];
          /* rim and hub+spokes sampled separately (a cut prim removes everything under it, so the spokes would vanish) */
          const rimPrims = (R) => [["d", 0, 0, R], ["x", ["d", 0, 0, R * 0.79]]];
          const hubPrims = (R) => { const P = [["d", 0, 0, R * 0.2]];
            for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; P.push(["s", 0, 0, Math.cos(a) * R * 0.8, Math.sin(a) * R * 0.8, Math.max(4.5, R * 0.075)]); } return P; };
          const WC = {}; const wcells = (R) => (WC[R] || (WC[R] = [...window.__B.cells(rimPrims(R), PC), ...window.__B.cells(hubPrims(R), PC)]));
          const spin = (pts, a) => { const c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]); };
          /* spin angle: ramps smoothly up to 6 rad/s and keeps rolling */
          const phi = (rt) => { const u = Math.max(0, rt - T_SPIN); return 6 * u - 1.8 * (1 - Math.exp(-u / 0.3)); };
          let COACH = null;
          function coach() {
            /* local frame = rear axle. Cabin, undercarriage, driver's box, lamp, two passengers in the windows (from r6's coach) */
            const Bk = window.__B, C = [];
            C.push(["s", -70, -18, 300, -18, 6], ["s", -20, -24, 30, -36, 4], ["s", 230, -24, 270, -36, 4]);
            const top = -262, eave = -200, cab = [[-40, -46], [200, -46], [204, eave]];
            for (let k = 0; k <= 16; k++) { const u = k / 16; cab.push([lerp(204, -44, u), eave - (eave - top) * Math.sin(Math.PI * u)]); }
            cab.push([-44, eave]); C.push(["p", cab]);
            for (let k = 0; k < 18; k++) { const L = (u) => [lerp(216, -56, u), eave + 4 - (eave - top + 10) * Math.sin(Math.PI * u)]; C.push(["s", ...L(k / 18), ...L((k + 1) / 18), 5]); }
            C.push(["s", -56, eave + 4, -44, eave + 4, 5], ["s", 204, eave + 4, 216, eave + 4, 5]);
            C.push(["x", ["p", [[56, -192], [144, -192], [144, -118], [56, -118]]]]);   /* door window */
            C.push(["x", ["p", [[-24, -192], [36, -192], [36, -118], [-24, -118]]]]);   /* side window */
            C.push(["x", ["s", 0, -232, 160, -232, 2.4]]);
            /* the humans: a grown-up in the door window, a kid in the side window */
            C.push(["d", 100, -164, 17], ["e", 100, -124, 30, 14, 0], ["d", 6, -152, 13], ["e", 6, -122, 20, 10, 0]);
            C.push(["s", 204, -150, 222, -150, 3], ["d", 228, -160, 10]);
            C.push(["s", 200, -70, 262, -150, 6], ["s", 236, -150, 300, -150, 8], ["s", 250, -84, 312, -84, 6]);
            const drv = Bk.person({ x: 268, y: -156, s: 0.82, dir: 1, lean: 0.12, hair: "short", tw: 26, legs: [[1.35, 0.35], [1.3, 0.3]], ik: [[352, -196], [358, -188]], bend: [1, 1] });
            return Bk.cells([...C, ...drv.P], PC).map(([x, y]) => [x + A0[0], y + A0[1]]);
          }
          function horse(rt) {
            const Bk = window.__B, ph = 6.2832 * rt / 0.42;
            const H2 = Bk.horseRig(0, 0, -30, 1.38, ph, 1), nR = Bk.person({ x: 0, y: 0, s: 1, dir: 1, legs: [[1.15, 0.12], [1.05, 0.05]], ik: [[1, 1], [1, 1]] }).P.length;
            return Bk.cells(H2.slice(0, H2.length - nR), 12).map(([x, y]) => [HX + x, G + y - 150, 12 * 0.46]);
          }
          function lines() {
            /* shafts (coach front -> harness) + reins (driver's hands -> horse's head), as dotted lines */
            const out = [], dl = (a, b, r, step) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step)); for (let i = 0; i <= n; i++) out.push([lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n), r]); };
            dl([A0[0] + 300, A0[1] - 30], [HX + 30, G - 194], 3.4, 8);
            dl([A0[0] + 352, A0[1] - 192], [HX + 250, G - 258], 2.2, 9);
            return out;
          }
          window.__INS = function (t, S) {
            if (t < IX || t >= IX + IG * IS) return false;
            const rt = IX + (t - IX) / IS;
            if (rt < T_SPIN) return false;   // the pills still talk ("But…")
            const all = [];   // [x, y, r] dots of this frame (before the fold)
            const fa = phi(rt);
            /* 1. the four pills orbit + spread onto the rim (90 deg apart), then shrink into the wheel */
            const ou = INOUT(sg(rt, T_SPIN, 0.62)), pr = 46 * (1 - OUT(sg(rt, T_W, 0.3)));
            const ST = [Math.PI, Math.PI, 0, 0], TG = [Math.PI, 1.5 * Math.PI, 0, 0.5 * Math.PI];
            const pillAt = (k) => { const r0 = Math.abs((k - 1.5) * 150), r = lerp(r0, RW * 0.9, ou), a = lerp(ST[k], TG[k], ou) + fa; return [960 + Math.cos(a) * r, 540 + Math.sin(a) * r]; };
            const caps = [];
            if (pr > 0.5) for (let k = 0; k < 4; k++) { const [x, y] = pillAt(k); caps.push([x, y, pr]); }
            /* 2. the wheel bursts out of the four pills, spinning; on "It was always…" it slides back + shrinks into the rear wheel */
            const cu = INOUT(sg(rt, T_C, 0.6)), R = lerp(RW, RR, cu), wc = [lerp(960, A0[0], cu), lerp(540, A0[1], cu)];
            const roll = Math.max(0, rt - T_C), scroll = 480 * (roll - 0.35 * (1 - Math.exp(-roll / 0.35)));
            const wa = fa;
            spin(wcells(RW), wa).forEach(([u, v]) => {
              const qa = Math.atan2(v, u) - fa, k = [2, 3, 0, 1][((Math.floor(((qa % 6.2832) + 6.2832 + Math.PI / 4) / (Math.PI / 2)) % 4) + 4) % 4], src = pillAt(k);
              const md = OUT(sg(rt, T_W + Math.hypot(u, v) * 0.0011, 0.42)); if (md <= 0) return;
              const s = R / RW;
              all.push([lerp(src[0], wc[0] + u * s, md), lerp(src[1], wc[1] + v * s, md), PC * 0.46 * Math.min(1, md * 1.4) * lerp(1, 0.8, cu)]);
            });
            /* 3. the carriage grows out of the wheel: cabin + passengers + driver, front wheel, horse, shafts, ground */
            if (rt >= T_C + 0.15) {
              const born = (x, y, r, d0) => { const b = OUT(sg(rt, T_C + 0.2 + d0, 0.45)); if (b > 0.01) all.push([lerp(wc[0], x, b), lerp(wc[1], y, b), r * Math.min(1, b * 1.3)]); };
              const dd = (x, y) => Math.hypot(x - A0[0], y - A0[1]) * 0.0007;
              (COACH || (COACH = coach())).forEach(([x, y]) => born(x, y + 2.5 * Math.sin(rt * 21), PC * 0.46, dd(x, y)));
              spin(wcells(RF), scroll / RF).forEach(([u, v]) => born(FX + u, G + 12 - RF + v, PC * 0.42, dd(FX, G)));
              horse(rt).forEach(([x, y, r]) => born(x, y, r, dd(x, y)));
              lines().forEach(([x, y, r]) => born(x, y, r, dd(x, y)));
              for (let i = 0; i < 26; i++) { const x = (((i * 84 - scroll) % 2184) + 2184) % 2184 - 132; born(x, G + 30, 4.2, Math.abs(x - 960) * 0.0004); }
            }
            /* 4. fold: every dot slides into the pill spot of its quarter of the frame, the pill swells back to full */
            const fu = INOUT(sg(rt, T_FOLD, 0.4)), back = 46 * OUT(sg(rt, T_FOLD + 0.2, 0.28));
            for (const [x, y, r] of all) {
              if (r < 0.3) continue;
              if (fu <= 0) { S.dots.push([x, y, r]); continue; }
              const k = Math.max(0, Math.min(3, Math.floor((x - 560) / 225))), pp = PILL(k);
              S.dots.push([lerp(x, pp[0], fu), lerp(y, pp[1], fu), r * (1 - 0.6 * fu)]);
            }
            for (const [x, y, r] of caps) S.caps.push([x, y, r, 0]);
            if (back > 0.5) for (let k = 0; k < 4; k++) S.caps.push([PILL(k)[0], 540, back, 0]);
            return true;
          };
        })();
