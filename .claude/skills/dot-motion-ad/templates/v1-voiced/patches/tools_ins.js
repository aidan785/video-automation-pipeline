        /* ===== r11 insert: "it was never about the tool / it was about what humans do with it" =====
           Inside engine A's held clock: the four talking pills pop into four tools (spear, wheel, bulb, rocket), dot people
           rise under them and grab them (hunter, wheel-roller, kid with the bulb, astronaut with the rocket), then every group
           folds back into its pill at the exact pill spot, so engine A's ending picks up with no seam.
           Root time rt comes from the engine time t (sub-frame exact, so the motion blur works). */
        (function () {
          const c01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), sg = (t, a, d) => c01((t - a) / d), lerp = (a, b, u) => a + (b - a) * u;
          const OUT = (u) => 1 - Math.pow(1 - u, 3), INOUT = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
          const BACK = (u) => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
          const IX = __IX__, IG = __IG__, IS = __IS__;
          const T_MORPH = 50.15, T_PEOPLE = 52.55, T_GRAB = 53.2, T_FOLD = 53.9, PE = 8, PT = 8;
          const PILL = (k) => [960 + (k - 1.5) * 150, 540], SLOT = (k) => 960 + (k - 1.5) * 390, GROUND = 800;
          /* tool silhouettes as prims, local space (centre 0,0) */
          const TOOL = [
            [["s", 0, 78, 0, -54, 5], ["p", [[0, -104], [15, -64], [0, -50], [-15, -64]]]],                                   // spear
            (() => { const P = [["d", 0, 0, 58], ["x", ["d", 0, 0, 45]], ["d", 0, 0, 11]];
              for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; P.push(["s", 0, 0, Math.cos(a) * 46, Math.sin(a) * 46, 4]); } return P; })(),   // wheel
            [["d", 0, -22, 42], ["x", ["d", 0, -22, 31]], ["s", -11, -16, 11, -16, 3], ["s", -11, -16, -4, 14, 3], ["s", 11, -16, 4, 14, 3],
             ["p", [[-17, 16], [17, 16], [15, 48], [-15, 48]]], ["x", ["s", -18, 28, 18, 28, 2.5]], ["x", ["s", -18, 38, 18, 38, 2.5]]],                 // bulb
            [["e", 0, -12, 23, 66, 0], ["x", ["d", 0, -26, 9]], ["p", [[-21, 18], [-44, 58], [-20, 46]]], ["p", [[21, 18], [44, 58], [20, 46]]], ["p", [[-12, 50], [12, 50], [8, 62], [-8, 62]]]],   // rocket
          ];
          const SC = [1.65, 1.25, 1.6, 1.6];   /* tool scale vs the people */
          const scl = (p, k) => p[0] === "d" ? ["d", p[1] * k, p[2] * k, p[3] * k] : p[0] === "s" ? ["s", p[1] * k, p[2] * k, p[3] * k, p[4] * k, p[5] * k]
            : p[0] === "e" ? ["e", p[1] * k, p[2] * k, p[3] * k, p[4] * k, p[5]] : p[0] === "p" ? ["p", p[1].map(([x, y]) => [x * k, y * k])] : ["x", scl(p[1], k)];
          const TC = TOOL.map((pr, i) => window.__B.cells(pr.map((p) => scl(p, SC[i])), PT));
          const spin = (pts, a) => { const c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]); };
          function people(k, rt, g) {
            /* g = grab progress 0..1: the tool flies from its float spot into the hand, the arm reaches for it */
            const B = window.__B, X = SLOT(k), G = OUT(g), fl = [X, 400 + 6 * Math.sin(rt * 2.4 + k * 1.3)], hipY = GROUND - 166;
            const reach = (rest, grip) => [lerp(rest[0], grip[0], G), lerp(rest[1], grip[1], G)];
            let o, tp, ta = 0;
            if (k === 0) {        // hunter: plants the spear upright at his side
              tp = [lerp(fl[0], X + 62, G), lerp(fl[1], hipY - 20, G)];
              o = { x: X - 10, y: hipY, s: 1, front: true, hair: "short", ik: [null, reach([X + 40, hipY + 10], [tp[0], tp[1] + 4])], bend: [1, 1] };
            } else if (k === 1) { // a traveller rolls the wheel along
              tp = [lerp(fl[0], X + 74, G), lerp(fl[1], GROUND - 72, G)]; ta = G * (rt - T_GRAB) * 4;
              const gp = [tp[0] - 54, tp[1] - 40];
              o = { x: X - 56, y: hipY, s: 1, dir: 1, lean: 0.2 * G, hair: "long", dress: true, ik: [reach([X - 40, hipY + 20], gp), reach([X - 36, hipY + 24], [gp[0] + 8, gp[1] + 20])], bend: [1, 1] };
            } else if (k === 2) { // a kid holds the bulb up high
              const hy = GROUND - 166 * 0.6; tp = [lerp(fl[0], X, G), lerp(fl[1], hy - 236, G)];
              o = { x: X, y: hy, s: 0.6, hk: 1.3, front: true, hair: "pig", ik: [reach([X - 28, hy + 10], [tp[0] - 14, tp[1] + 72]), reach([X + 28, hy + 10], [tp[0] + 14, tp[1] + 72])], bend: [1, 1] };
            } else {              // astronaut lifts the rocket
              tp = [lerp(fl[0], X + 86, G), lerp(fl[1], hipY - 176, G)]; ta = 0.22 * G;
              o = { x: X - 20, y: hipY, s: 1, front: true, hair: "short", ik: [null, reach([X + 28, hipY + 10], [tp[0] - 4, tp[1] + 70])], bend: [1, 1] };
            }
            const p = B.person(o);
            if (k === 3) { const [hx, hy] = p.head, r = p.hr;   /* helmet with a visor + life-support pack */
              p.P.push(["d", hx, hy - 2, r * 1.55], ["x", ["e", hx, hy + 2, r * 0.92, r * 0.62, 0]], ["p", [[o.x - 46, hipY - 112], [o.x + 46, hipY - 112], [o.x + 42, hipY - 30], [o.x - 42, hipY - 30]]]); }
            return { P: p.P, tp, ta };
          }
          window.__INS = function (t, S) {
            if (t < IX || t >= IX + IG * IS) return false;
            const rt = IX + (t - IX) / IS;
            if (rt < T_MORPH) return false;   // the pills still talk ("But it was…")
            for (let k = 0; k < 4; k++) {
              const pp = PILL(k), m0 = T_MORPH + k * 0.07, gm = OUT(sg(rt, m0, 0.6));
              const f0 = T_FOLD + k * 0.045, fu = INOUT(sg(rt, f0, 0.42));
              const fam = OUT(sg(rt, T_PEOPLE + k * 0.12, 0.45)), g = sg(rt, T_GRAB + k * 0.1, 0.5);
              const P = fam > 0 ? people(k, rt, g) : null;
              const tp = P ? P.tp : [SLOT(k), 400 + 6 * Math.sin(rt * 2.4 + k * 1.3)], ta = P ? P.ta : 0;
              const ctr = [lerp(pp[0], tp[0], gm), lerp(pp[1], tp[1], gm)];
              /* the pill pops: shrinks as its dots fly out into the tool */
              const pr = 46 * (1 - OUT(sg(rt, m0, 0.28)));
              const tool = spin(TC[k], ta).map(([u, v]) => {
                const md = OUT(sg(rt, m0 + Math.hypot(u, v) * 0.0009, 0.38));
                return [lerp(pp[0], ctr[0] + u, md), lerp(pp[1], ctr[1] + v, md), PT * 0.44 * Math.min(1, md * 1.4)];
              });
              const body = P ? window.__B.cells(P.P, PE).map(([x, y]) => [x, y + 46 * (1 - fam), PE * 0.44 * fam]) : [];
              /* fold: every dot of the group slides into the pill spot, the pill swells back to full */
              const all = tool.concat(body);
              for (const [x, y, r] of all) {
                if (r < 0.3) continue;
                if (fu <= 0) S.dots.push([x, y, r]);
                else { const e = fu; S.dots.push([lerp(x, pp[0], e), lerp(y, pp[1], e), r * (1 - 0.6 * e)]); }
              }
              const back = fu > 0 ? 46 * OUT(sg(rt, f0 + 0.18, 0.26)) : 0;
              const R = Math.max(pr, back);
              if (R > 0.5) S.caps.push([pp[0], pp[1], R, 0]);
            }
            return true;
          };
        })();
