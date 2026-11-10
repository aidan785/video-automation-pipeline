function skeletonScene(t, S) {
          /* r13 (Aidan: "the skeleton is a video and looks out of place ... an X-ray screen with a bone hand inside"): same strobe
             flash on the cut, then a lightbox X-ray viewer drawn in halftone dots: a framed panel with a film clip, and inside it a
             bone hand (forearm, carpals, metacarpals, phalanges with joint gaps, brighter bone edges) that gives a small wave, with
             the soft x-ray glow and the scan band sweeping down. All procedural, a pure function of cf. */
          const cf = (t + SH()) * 30, ph = skPhase(cf), P = 11;
          S.dots = []; S.glyphs = []; S.blobs = []; S.arcs = []; S.streaks = []; S.zoomC = null;
          const inv = ph < 6 && ph % 2 === 1;          /* odd steps: cream ground, maroon x-ray */
          S.ground = inv ? CR : OX; S.dotCol = inv ? OX : CR;
          if (ph === 0) return;                        /* step 0: the bulb's light floods the frame */
          const tt = (cf - T_SK) / 30, push = 1 + 0.04 * GLIDE(seg(cf, T_SK, 70));
          /* the hand: [base x, base y, angle from vertical, segment lengths, widths]; thumb last */
          const wave = 0.07 * Math.sin(tt * 4.2), curl = 0.05 * (0.5 + 0.5 * Math.sin(tt * 4.2 - 1.1));
          const FING = [[-46, 682, -0.13, [170, 108, 68, 48], [15, 13, 11, 10]], [-2, 676, -0.02, [178, 120, 76, 50], [16, 13.5, 11.5, 10]],
                        [40, 680, 0.09, [168, 112, 70, 48], [15, 13, 11, 10]], [78, 694, 0.21, [146, 90, 56, 44], [14, 12, 10, 9]],
                        [-74, 726, -0.72, [112, 86, 62], [16, 14, 12]]];
          const caps = [], discs = [];
          const rot = (x, y) => { const c = Math.cos(wave), sn = Math.sin(wave), Y = y - 760; return [960 + (x * c - Y * sn) * push, 760 + (x * sn + Y * c) * push]; };   /* pivots at the wrist */
          caps.push([-56, 1010, -48, 772, 23], [44, 1010, 40, 770, 27]);   /* ulna, radius */
          [[-58, 748, 17], [-24, 742, 18], [10, 744, 17], [42, 748, 16], [-50, 714, 15], [-16, 708, 16], [16, 708, 16], [48, 716, 15]].forEach((d) => discs.push(d));   /* carpals */
          FING.forEach(([bx, by, a, L, Wd], fi) => {
            let x = bx, y = by, an = a;
            L.forEach((len, k) => {
              if (k > 0) an += (fi === 4 ? 0.14 : curl * k);
              const ex = x + Math.sin(an) * len, ey = y - Math.cos(an) * len;
              caps.push([x, y, ex, ey, Wd[k]]);
              discs.push([ex, ey, Wd[k] + 3.5]);   /* the knuckle heads */
              x = ex + Math.sin(an) * 9; y = ey - Math.cos(an) * 9;   /* joint gap */
            });
            discs.push([x - Math.sin(an) * 4, y + Math.cos(an) * 4, Wd[Wd.length - 1] + 1]);   /* tuft */
          });
          const CP = caps.map(([x0, y0, x1, y1, r]) => { const a = rot(x0, y0), b = rot(x1, y1); return [a[0], a[1], b[0], b[1], r * push]; });
          const DP = discs.map(([x, y, r]) => { const a = rot(x, y); return [a[0], a[1], r * push]; });
          /* the viewer: a lightbox panel with a thick frame and a film clip at the top */
          const BX0 = 590, BX1 = 1330, BY0 = 70, BY1 = 1030, FR = 26;
          const scan = (tt * 0.55) % 1.3 - 0.15;
          for (let y = P / 2; y < 1080; y += P) for (let x = P / 2; x < 1920; x += P) {
            const inBox = x > BX0 && x < BX1 && y > BY0 && y < BY1; if (!inBox && !(x > 900 && x < 1020 && y > 44 && y < 96)) continue;
            const frame = !(x > BX0 + FR && x < BX1 - FR && y > BY0 + FR && y < BY1 - FR) || (x > 900 && x < 1020 && y > 44 && y < 96);
            let L;
            if (frame) L = 0.82;
            else {
              let d = 1e9;   /* signed-ish distance to the nearest bone */
              for (const [x0, y0, x1, y1, r] of CP) { const vx = x1 - x0, vy = y1 - y0, u = Math.max(0, Math.min(1, ((x - x0) * vx + (y - y0) * vy) / (vx * vx + vy * vy))); d = Math.min(d, Math.hypot(x - x0 - vx * u, y - y0 - vy * u) - r); }
              for (const [cx, cy, r] of DP) d = Math.min(d, Math.hypot(x - cx, y - cy) - r);
              const band = Math.exp(-(((y / 1080 - scan) / 0.05) ** 2));
              const bone = d < 0 ? (d > -5 ? 1 : 0.72) : 0;                      /* cortical edge brighter than the marrow */
              const halo = d >= 0 ? 0.42 * Math.exp(-d / 26) : 0;                 /* soft tissue glow round the bones */
              L = Math.max(bone * (1 + 0.3 * band), halo * (1 + 0.6 * band), 0.11 + 0.12 * band);   /* the lit panel itself, faint */
            }
            if (L < 0.07) continue;
            S.dots.push([x, y, P * 0.52 * Math.pow(Math.min(1, L), 0.62)]);
          }
        }
