        /* ===== r15 insert: "But it was never really about the tool. It was always about what humans do with it." =====
           Built to the dot-motion rules (one continuous move, speed crosses every cut, the dots are the material, figures
           already moving when they form, the camera never still, hero objects big). Root time rt.
           1. wind-up  (48.62): the four talking pills go quiet, pull in and shrink (slow -> fast into the cut)
           2. burst    (48.98, lands on "tool" 49.03): each dot bursts with overshoot into a big live tool (spear swaying,
              wheel already rolling, bulb, laptop on a desk); the spray lands as a dotted ground line; the camera pulls out
           3. humans   (50.42, mid-rise on "humans" 50.77): people grow up out of that ground line feet first, already
              reaching for their tool (the ground under them is consumed)
           4. use it   (51.0, "do with it"): hunter cocks the spear overhead, a walker rolls the wheel on, a kid lifts the bulb
              and it lights, a typist fills the laptop screen with code
           5. swirl    (51.78 -> 52.40): every group spirals into its pill (accelerating, peeling off by angle); the pills land
              at full size exactly as engine A resumes, so the row / rays carry the speed on */
        (function () {
          const Bk = window.__B;
          const c01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), sg = (t, a, d) => c01((t - a) / d), lerp = (a, b, u) => a + (b - a) * u;
          const EO = (u) => 1 - Math.pow(1 - u, 3), EI = (u) => u * u * u, EIO = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
          const BACK = (u) => { const c = 1.25, v = u - 1; return 1 + (c + 1) * v * v * v + c * v * v; };
          const hs = (a, b) => { let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
          const IX = __IX__, IG = __IG__, IS = __IS__, T_END = IX + IG, VAR = "__VAR__", STICK = __STICK__, SRC = "__SRC__", EXIT = "__EXIT__";   /* workshop | pan | crowd | chain */
          const T_WU = 48.62, T_BST = 48.98, T_HUM = 50.42, T_GRAB = 51.0, T_LIT = 51.12, T_FOLD = 51.78, D_FOLD = T_END - T_FOLD;
          const PC = __PC__, DR = PC * 0.44, GY = 872, SX = [470, 820, 1160, 1550];   /* r16b: pulled in, the whole group centred with margin (spear tail to desk edge) */
          const T_REV = VAR === "chain" ? 50.36 : T_BST, CH_T = [48.98, 49.34, 49.70, 50.06], CH_C = [960, 520];
          const PILL = (k) => [960 + (k - 1.5) * 150, 540];
          const rotP = (pts, a) => { const c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]); };
          const T_VO = __TVO__, VOENV = __VOENV__;   /* the pills' voice envelope, injected by build.py */
          const ve = (k) => { const n = Math.floor(window.__RT * 30 - T_VO) - k; return n >= 0 && n < VOENV.length ? VOENV[n] : 0; };
          function stickRig(o) {   /* v1-hunter style: thick torso stroke, round head, 2-bone limbs; hip at (0,0) */
            const s = o.s || 1, lean = o.lean || 0, d = o.front ? 1 : (o.dir || 1), P = [];
            const sh = [Math.sin(lean) * 128 * s * d, -Math.cos(lean) * 128 * s], hd = [sh[0] + Math.sin(lean) * 36 * s * d, sh[1] - Math.cos(lean) * 36 * s];
            P.push(["s", 0, 0, sh[0], sh[1], 15 * s], ["d", hd[0], hd[1], 24 * s * (o.hk || 1)]);
            const legs = o.legs || [[0.08, 0.04], [-0.08, 0.04]];
            legs.forEach(([a, b], i) => { const sgn = o.front ? (i ? 1 : -1) : d, k = [sgn * Math.sin(a) * 84 * s + (o.front ? sgn * 10 * s : 0), Math.cos(a) * 84 * s], f = [k[0] + sgn * Math.sin(b) * 84 * s, k[1] + Math.cos(b) * 84 * s]; P.push(["s", o.front ? sgn * 10 * s : 0, 0, k[0], k[1], 9.5 * s], ["s", k[0], k[1], f[0], f[1], 8.5 * s]); });
            const root = [sh[0], sh[1] + 12 * s];
            for (let i = 0; i < 2; i++) {
              let h;
              if (o.ik && o.ik[i]) h = o.ik[i];
              else { const [a, b] = o.arms ? o.arms[i] : [0.2, 0.1], sgn = o.front ? (i ? 1 : -1) : d, e = [root[0] + sgn * Math.sin(a) * 70 * s, root[1] + Math.cos(a) * 70 * s]; h = [e[0] + sgn * Math.sin(a + b) * 66 * s, e[1] + Math.cos(a + b) * 66 * s]; }
              const L1 = 70 * s, L2 = 66 * s, vx = h[0] - root[0], vy = h[1] - root[1], D = Math.min(L1 + L2 - 0.5, Math.hypot(vx, vy)) || 1;
              const ca = (L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), al = Math.acos(Math.max(-1, Math.min(1, ca))), bs = Math.atan2(vy, vx) + (o.front ? (i ? -1 : 1) : -d) * al;
              const e = [root[0] + Math.cos(bs) * L1, root[1] + Math.sin(bs) * L1], hh = [root[0] + vx / Math.hypot(vx, vy || 1e-6) * D, root[1] + vy / Math.hypot(vx || 1e-6, vy) * D];
              P.push(["s", root[0], root[1], e[0], e[1], 8.5 * s], ["s", e[0], e[1], hh[0], hh[1], 8 * s]);
            }
            return { P };
          }
          const mkP = (o) => (STICK ? stickRig(o) : Bk.person(o));
          /* ---------- tools, sampled once in local space ---------- */
          const C = (pr) => Bk.cells(pr, PC);
          const SPEAR = C([["s", -175, 0, 150, 0, 4.6], ["p", [[146, -17], [200, 0], [146, 17]]], ["s", 138, -7, 138, 7, 5]]);
          const RIM = C([["d", 0, 0, 106], ["x", ["d", 0, 0, 84]]]);
          const SPK = C([["d", 0, 0, 19], ...[0, 1, 2, 3, 4, 5].map((i) => { const a = i * Math.PI / 3; return ["s", 0, 0, Math.cos(a) * 86, Math.sin(a) * 86, 5]; })]);
          const GLASS = C([["d", 0, 0, 76], ["x", ["d", 0, 0, 61]]]), GFILL = C([["d", 0, 0, 60]]);
          const FIL = C([["s", -16, 40, -16, 6, 3.5], ["s", 16, 40, 16, 6, 3.5], ["s", -16, 6, -6, -10, 3.5], ["s", -6, -10, 4, 6, 3.5], ["s", 4, 6, 16, 6, 3.5]]);
          const BASE = C([["p", [[-34, 66], [34, 66], [28, 96], [-28, 96]]], ["s", -26, 104, 26, 104, 5], ["s", -22, 116, 22, 116, 5], ["s", -10, 128, 10, 128, 5]]);
          const SCR = C([["p", [[-98, -146], [98, -146], [98, -14], [-98, -14]]], ["x", ["p", [[-80, -128], [80, -128], [80, -32], [-80, -32]]]]]);
          const KEYS = C([["p", [[-104, -6], [104, -6], [122, 8], [-122, 8]]]]);
          const TABLE = C([["s", -150, 18, 150, 18, 6], ["s", -128, 18, -128, 150, 5.5], ["s", 128, 18, 128, 150, 5.5]]);
          const CODE = []; for (let r = 0; r < 7; r++) { const n = 3 + Math.floor(hs(r, 3) * 11); for (let i = 0; i < n; i++) CODE.push([-70 + i * PC + (r % 3 === 1 ? PC * 2 : 0), -118 + r * 13, r, i]); }
          const tr = (L, ox, oy, a = 0) => (a ? rotP(L, a) : L).map(([x, y]) => [x + ox, y + oy]);
          /* ---------- ground line: the burst spray lands here ---------- */
          const GROUND = false;   /* r16: Aidan, remove the line under it */
          const NG = 150, GX = [...Array(NG)].map((_, j) => 125 + j * (1670 / (NG - 1)));
          const GK = GX.map((x) => SX.reduce((b, s, k) => (Math.abs(x - s) < Math.abs(x - SX[b]) ? k : b), 0));
          /* ---------- the four stories (all positions on screen, before the camera) ---------- */
          const grab = (rt) => EO(sg(rt, T_GRAB, 0.25)), act = (rt) => EIO(sg(rt, T_GRAB + 0.08, 0.62)), reach = (rt) => EO(sg(rt, T_HUM + 0.12, 0.5));
          function spearPose(rt) {
            const g = grab(rt), w = act(rt), ox = SX[0] - 86 + 3 * Math.sin(rt * 1.3);
            const fl = [SX[0] + 46, 452 + 8 * Math.sin(rt * 2.2)], fa = -0.95 + 0.07 * Math.sin(rt * 2.1);
            const held = [ox - 4 - 12 * w, GY - 166 - 240 - 6 * w];   /* above + behind the head, clear of it */
            return { c: [lerp(fl[0], held[0], g), lerp(fl[1], held[1], g)], a: lerp(fa, -0.12 - 0.1 * w, g), ox, w };
          }
          function wheelPose(rt) {
            const dx = 28 * EIO(sg(rt, T_GRAB, 0.78)), c = [SX[1] + 34 + dx, GY - 106];
            return { c, phi: 1.3 * Math.max(0, rt - T_BST) + dx / 106, dx };
          }
          function bulbPose(rt) {
            const j = 22 * Math.sin(Math.PI * sg(rt, T_GRAB, 0.5)), fl = [SX[2], 440 + 7 * Math.sin(rt * 2.6 + 1)], g = grab(rt);
            return { c: [lerp(fl[0], SX[2] + 30, g), lerp(fl[1], 432, g) - j], j };   /* held up at arm's length, ahead of the face */
          }
          const LT = [SX[3] + 52, GY - 168];   /* table top centre */
          function toolDots(k, rt) {   /* [x, y] screen dots of tool k at its live pose */
            if (k === 0) { const p = spearPose(rt); return tr(SPEAR, p.c[0], p.c[1], p.a); }
            if (k === 1) { const p = wheelPose(rt); return tr(RIM, p.c[0], p.c[1], p.phi).concat(tr(SPK, p.c[0], p.c[1], p.phi)); }
            if (k === 2) { const p = bulbPose(rt), lit = EO(sg(rt, T_LIT, 0.18)), out = tr(GLASS, p.c[0], p.c[1]).concat(tr(FIL, p.c[0], p.c[1]), tr(BASE, p.c[0], p.c[1]));
              if (lit > 0) tr(GFILL, p.c[0], p.c[1]).forEach(([x, y], i) => { if (hs(i, 5) < lit) out.push([x, y]); });
              return out; }
            const ty = LT[1] + 2 * Math.sin(rt * 1.7), out = tr(TABLE, LT[0], ty).concat(tr(SCR, LT[0], ty), tr(KEYS, LT[0], ty));
            if (rt < T_GRAB) { if (Math.floor(rt * 2.6) % 2 === 0) out.push([LT[0] - 70, ty - 118]); }   /* cursor blinks */
            else if (!(EXIT === "dive" && rt >= T_FOLD - 0.32)) CODE.forEach(([x, y, r, i]) => { if ((rt - T_GRAB) * 26 > r * 2.4 + i) out.push([LT[0] + x, ty + y]); });   /* typing */
            return out;
          }
          const toolC = (k, rt) => (k === 0 ? spearPose(rt).c : k === 1 ? wheelPose(rt).c : k === 2 ? bulbPose(rt).c : [LT[0], LT[1] - 60]);
          function personOf(k, rt) {   /* person prims built at the origin, + where the hip goes */
            const r = reach(rt);
            if (k === 0) {
              const p = spearPose(rt), ox = p.ox, oy = GY - 166, ca = Math.cos(p.a), sa = Math.sin(p.a);
              const g1 = [p.c[0] - 42 * ca, p.c[1] - 42 * sa], g2 = [ox + 126 + 8 * p.w, oy - 150 - 10 * p.w], rest = [[ox + 40, oy + 20], [ox + 30, oy + 30]];   /* throwing hand on the shaft, other arm aims */
              const hd = [g1, g2].map((gp, i) => [lerp(rest[i][0], gp[0], r) - ox, lerp(rest[i][1], gp[1], r) - oy]);
              return { o: [ox, oy], P: mkP({ x: 0, y: 0, s: 1, dir: 1, lean: 0.08 - 0.3 * p.w, hair: "short", legs: [[lerp(0.2, 0.42, p.w), lerp(0.06, 0.12, p.w)], [lerp(-0.2, -0.45, p.w), lerp(-0.04, -0.3, p.w)]], ik: hd, bend: [1, 1] }).P };
            }
            if (k === 1) {
              const w = wheelPose(rt), ox = SX[1] - 98 + w.dx, oy = GY - 166 - 5 * Math.abs(Math.sin(w.dx / 22)), wc = w.c;
              const tg = [[wc[0] - 74, wc[1] - 70], [wc[0] - 92, wc[1] - 44]], rest = [[ox + 30, oy + 30], [ox + 24, oy + 36]];
              const hd = tg.map((gp, i) => [lerp(rest[i][0], gp[0], r) - ox, lerp(rest[i][1], gp[1], r) - oy]);
              const walking = sg(rt, T_GRAB, 0.2) * (1 - sg(rt, T_GRAB + 0.62, 0.2));
              return { o: [ox, oy], P: mkP({ x: 0, y: 0, s: 1, dir: 1, lean: 0.12 + 0.16 * r, hair: "long", dress: true, legs: Bk.walkLegs(w.dx / 9, 0.35 * walking), ik: hd, bend: [1, 1] }).P };
            }
            if (k === 2) {
              const b = bulbPose(rt), s = 0.92, ox = SX[2] - 60, oy = GY - 166 * s - 0.4 * b.j, lit = EO(sg(rt, T_LIT, 0.3));
              const tg = [[b.c[0] - 4, b.c[1] + 112], [lerp(ox - 34, ox - 52, lit), lerp(oy + 24, oy - 30, lit)]], rest = [[ox + 30, oy + 20], [ox - 24, oy + 26]];   /* one hand up on the bulb, the other swings out wide when it lights */
              const hd = tg.map((gp, i) => [lerp(rest[i][0], gp[0], i ? 1 : r) - ox, lerp(rest[i][1], gp[1], i ? 1 : r) - oy]);
              return { o: [ox, oy], P: mkP({ x: 0, y: 0, s, dir: 1, lean: -0.06 * r, hair: "short", ik: hd, bend: [1, 1] }).P };
            }
            const ox = SX[3] - 186, oy = GY - 92, ty = LT[1] + 2 * Math.sin(rt * 1.7), ty2 = rt > T_GRAB ? 1 : 0;
            const tg = [0, 1].map((i) => [LT[0] - 88 + i * 30, ty - 4 - ty2 * 6 * Math.max(0, Math.sin(rt * 26 + i * 2.2))]), rest = [[ox + 34, oy + 26], [ox + 28, oy + 34]];
            const hd = tg.map((gp, i) => [lerp(rest[i][0], gp[0], r) - ox, lerp(rest[i][1], gp[1], r) - oy]);
            const CHAIR = [["s", -44, 16, 34, 16, 6], ["s", -44, 16, -52, -84, 5.5], ["s", -30, 16, -30, 92, 5], ["s", 24, 16, 24, 92, 5]];
            return { o: [ox, oy], P: CHAIR.concat(mkP({ x: 0, y: 0, s: 1, dir: 1, lean: 0.2 + 0.06 * r, nod: 0.12, hair: "bun", legs: [[1.42, 0.02], [1.32, 0.08]], ik: hd, bend: [1, 1] }).P) };
          }
          /* r16 pairing: upper half of the scene -> upper rays, lower -> lower, matched by x rank (nothing crosses);
             every ray dot gets at least one scene dot, so nothing pops in at the handoff */
          let PAIR = null, PAIRN = -1, RAYS = null;
          function pairing(ALL, E) {
            if (PAIRN === ALL.length) return PAIR;
            if (!RAYS) { RAYS = [[], []]; for (let c = 0; c < E.ENC; c++) for (let j = 0; j < E.ENJ; j++) { const q = E.ray(c, j, E.T_EXP + 16); RAYS[j < E.ENJ / 2 ? 0 : 1].push([c, j, q[0]]); } RAYS.forEach((L) => L.sort((a, b) => a[2] - b[2])); }
            const ys = ALL.map((d) => d[1]).sort((a, b) => a - b), my = ys[ys.length >> 1], H = [[], []];
            ALL.forEach((d, i) => H[d[1] < my ? 0 : 1].push([i, d[0]]));
            PAIR = new Array(ALL.length);
            H.forEach((L, h) => { L.sort((a, b) => a[1] - b[1]); const R = RAYS[h]; L.forEach(([i], rk) => { const q = R[Math.floor(rk * R.length / L.length)]; PAIR[i] = [q[0], q[1]]; }); });
            PAIRN = ALL.length; window.__PAIRN = ALL.length; return PAIR;
          }
          /* ---------- camera ---------- */
          function cam(rt) {
            let z = 1;
            if (rt >= T_WU) z = lerp(1, 1.06, EI(sg(rt, T_WU, T_BST - T_WU)));
            if (rt >= T_BST) z = lerp(1.06, 0.93, EO(sg(rt, T_BST, 0.6)));
            if (rt >= T_BST + 0.6) z = lerp(0.93, 1.0, EIO(sg(rt, T_BST + 0.6, T_FOLD - T_BST - 0.6)));
            let dx = 14 * Math.sin(Math.PI * sg(rt, T_BST, T_FOLD - T_BST)), fx = 960;
            if (VAR === "pan") {   /* push in on the burst, truck across the four stories, pull wide on "do with it" */
              const zi = EO(sg(rt, T_BST, 0.5)), zo = EIO(sg(rt, T_GRAB - 0.05, 0.6)), tk = EIO(sg(rt, T_BST + 0.2, T_GRAB - T_BST - 0.25));
              z = lerp(lerp(1.06, 1.62, zi), 0.96, zo); if (rt >= T_GRAB + 0.55) z = lerp(0.96, 1, EIO(sg(rt, T_GRAB + 0.55, T_FOLD - T_GRAB - 0.55)));
              fx = lerp(lerp(960, SX[0] + 40, zi * (1 - tk)) + (SX[3] - SX[0]) * tk * (1 - zo), 960, zo); dx = 0;
              if (rt < T_BST) fx = 960;
            }
            if (VAR === "chain" && rt >= T_BST && rt < T_REV + 0.6) z = lerp(1.06, 1.0, EO(sg(rt, T_BST, 0.4))) * lerp(1, 0.93, EO(sg(rt, T_REV, 0.6)));
            return [z, dx, fx];
          }
          window.__INS = function (t, S) {
            const E = window.__END, TH = E && EXIT !== "dive" ? (E.T_EXP + 16) / 30 : IX + IG * IS;   /* r16: hold on past the window, hand off once the rays settle */
            if (t < IX || t >= TH) return false;
            const rt = t < IX + IG * IS ? IX + (t - IX) / IS : t + IG * (1 - IS), [z, dx, fx] = cam(rt);
            const put = (x, y, r) => S.dots.push([960 + (x - fx) * z + dx, 600 + (y - 600) * z, r * z]);
            /* 1. the pills: still talking, then the wind-up (quiet, pull in, shrink) */
            const pillPos = (k) => { const p = PILL(k), u = EI(sg(rt, T_WU, T_BST - T_WU)); return VAR === "chain" ? (rt >= T_BST ? CH_C : [lerp(p[0], 960, u), lerp(p[1], CH_C[1], u)]) : [lerp(p[0], lerp(p[0], 960, 0.16), u), p[1]]; };
            if (rt < T_BST) {
              const u = EI(sg(rt, T_WU, T_BST - T_WU));
              for (let k = 0; k < 4; k++) { const [x, y] = pillPos(k), r = 46 * (1 - (VAR === "chain" ? 0.6 : 0.62) * u), talk = Math.max(ve(k), ve(k + 1) * 0.8) * (1 - sg(rt, T_WU, 0.18));
                S.caps.push([960 + (x - fx) * z + dx, 600 + (y - 600) * z, r * z, r * 1.5 * talk * z]); }
              return true;
            }
            if (VAR === "chain" && rt < T_REV) {   /* one hero dot, scale-through morphs: spear -> wheel -> bulb -> laptop */
              let drew = false;
              for (let i = 0; i < 4; i++) {
                const a = CH_T[i], nx = i < 3 ? CH_T[i + 1] : T_REV, b = sg(rt, a, 0.26), sh = i < 3 || true ? EI(sg(rt, nx - 0.1, 0.1)) : 0; if (rt < a || rt >= nx) continue;
                const HS = [1.55, 1.45, 1.5, 1.25][i] * BACK(b) * (1 - sh), tc = toolC(i, rt), spin = 0.35 * (rt - a);
                toolDots(i, rt).forEach(([x, y]) => { const [u, v] = rotP([[x - tc[0], y - tc[1]]], i === 1 ? 0 : spin * 0.3)[0]; put(CH_C[0] + u * HS, CH_C[1] + v * HS, DR * Math.max(0.5, Math.min(1.25, HS))); });
                drew = true;
                const R = 18 * (1 - EO(b)) + 18 * sh; if (R > 0.5) S.caps.push([960 + (CH_C[0] - fx) * z + dx, 600 + (CH_C[1] - 600) * z, R * z, 0]);
              }
              { const R = 18 * (1 - EO(sg(rt, T_BST, 0.12))); if (R > 0.5) S.caps.push([960 + (CH_C[0] - fx) * z + dx, 600 + (CH_C[1] - 600) * z, R * z, 0]); }
              return true;
            }
            const groups = [[], [], [], []];   /* [x, y, r] per story, before the fold */
            { const R = (VAR === "chain" ? 18 : 46 * 0.38) * (1 - EO(sg(rt, T_REV, 0.16))); if (R > 0.5) for (let k = 0; k < (VAR === "chain" ? 1 : 4); k++) { const [x, y] = pillPos(k); S.caps.push([960 + (x - fx) * z + dx, 600 + (y - 600) * z, R * z, 0]); } }
            /* 2. tools burst out of the dots (overshoot, inner dots first) */
            for (let k = 0; k < 4; k++) {
              const src = pillPos(k), tc = toolC(k, rt);
              toolDots(k, rt).forEach(([x, y]) => {
                const d = Math.hypot(x - tc[0], y - tc[1]), b = sg(rt, T_REV + 0.05 * Math.min(1, d / 220), 0.44); if (b <= 0) return;
                const s = BACK(b), e = EO(b), cx = lerp(src[0], tc[0], e), cy = lerp(src[1], tc[1], e);
                groups[k].push([cx + (x - tc[0]) * s, cy + (y - tc[1]) * s, DR * Math.min(1, 0.35 + b * 1.4)]);
              });
            }
            /* the spray lands as the ground line; people grow out of it */
            const PEOPLE = [0, 1, 2, 3].map((k) => (rt >= T_HUM - 0.05 ? personOf(k, rt) : null));
            const PX = PEOPLE.map((p) => (p ? p.o[0] : 0));
            if (GROUND) GX.forEach((gx, j) => {
              const k = GK[j], src = pillPos(k), e = EO(sg(rt, T_REV + 0.03 + 0.28 * hs(j, 1), VAR === "chain" ? 0.5 : 0.62)); if (e <= 0) return;
              const cxp = lerp(src[0], gx, 0.5), cyp = Math.min(src[1], GY) - 200 - 160 * hs(j, 2), v = 1 - e;
              let x = v * v * src[0] + 2 * v * e * cxp + e * e * gx, y = v * v * src[1] + 2 * v * e * cyp + e * e * (GY + 16), r = DR * 0.82 * Math.min(1, 0.3 + e);
              const near = PEOPLE[k] && SRC !== "tool" ? c01(1 - Math.abs(gx - PX[k] - 10) / 60) : 0, used = near * EO(sg(rt, T_HUM, 0.45));
              r *= 1 - 0.75 * used; y += 1.5 * Math.sin(rt * 3 + j);
              if (r > 0.6) groups[k].push([x, y, r]);
            });
            PEOPLE.forEach((p, k) => {
              if (!p) return;
              Bk.cells(p.P, PC).forEach(([lx, ly]) => {
                const x = lx + p.o[0], y = ly + p.o[1], u = EO(sg(rt, T_HUM + (SRC === "tool" ? 0.2 * c01(Math.hypot(x - toolC(k, rt)[0], y - toolC(k, rt)[1]) / 420) : 0.24 * c01((GY - y) / 400)) + 0.03 * hs(Math.round(x), Math.round(y)), 0.42)); if (u <= 0) return;
                if (SRC === "tool") { const tc = toolC(k, rt); groups[k].push([lerp(tc[0], x, u), lerp(tc[1], y, u), DR * Math.min(1, 0.25 + u * 1.2)]); } else groups[k].push([x, lerp(GY + 10, y, u), DR * Math.min(1, 0.25 + u * 1.2)]);
              });
              if (k === 2) { const lt = sg(rt, T_LIT, 0.42); if (lt > 0 && lt < 1) { const c = bulbPose(rt).c;   /* the tap: a quick burst of small dots, gone in 0.4 s */
                for (let i = 0; i < 18; i++) { const a = i / 18 * 6.2832 + 0.2 * hs(i, 8), d = 84 + 120 * EO(lt) * (0.6 + 0.4 * hs(i, 9)); groups[2].push([c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, 3.4 * (1 - lt)]); } } }
            });
            if (VAR === "crowd" && rt >= T_HUM) {
              const CW = [[150, 0.62, "long"], [520, 0.7, "short"], [600, 0.55, "pig"], [960, 0.74, "bun"], [1040, 0.6, "short"], [1380, 0.68, "long"], [1460, 0.56, "pig"], [1800, 0.66, "short"]];
              CW.forEach(([x0, s, hair], i) => {
                const k = SX.reduce((b, q, kk) => (Math.abs(x0 - q) < Math.abs(x0 - SX[b]) ? kk : b), 0), w = Math.sin(rt * 7 + i * 1.7), up = EO(sg(rt, T_GRAB - 0.1 + 0.05 * i, 0.35));
                const P = mkP({ x: 0, y: 0, s, hk: 1.15, front: true, hair, arms: [[lerp(0.2, 2.55 + 0.18 * w, up), 0.15], [lerp(0.2, 2.55 - 0.18 * w, up), 0.15]], cp: 0.4 * Math.sin(rt * 3 + i) }).P;
                const oy = GY - 166 * s - 10 * up * Math.max(0, Math.sin(rt * 9 + i));
                Bk.cells(P, PC).forEach(([lx, ly]) => { const x = lx + x0, y = ly + oy, u = EO(sg(rt, T_HUM + 0.1 + 0.03 * i + 0.24 * c01((GY - y) / 300), 0.4)); if (u > 0) groups[k].push([x, lerp(GY + 10, y, u), DR * 0.85 * Math.min(1, 0.25 + u * 1.2)]); });
              });
            }
            if (EXIT === "dive" && rt >= T_FOLD - 0.32) {   /* the screen clears to four dots; the camera dives in; they ARE the pills */
              const Z1 = 150 / 10.9, Sc = [LT[0], LT[1] + 2 * Math.sin(rt * 1.7) - 80], e = EI(sg(rt, T_FOLD, D_FOLD)), Zc = Math.exp(Math.log(Z1) * e);
              const fxx = lerp(960, Sc[0], e), fyy = lerp(600, Sc[1], e), ty = lerp(600, 540, e), Z = z * Zc;
              const P2 = (x, y) => [960 + (x - fxx) * Z + dx * (1 - e), ty + (y - fyy) * Z];
              for (let k = 0; k < 4; k++) for (const [x, y, r] of groups[k]) { const [X, Y] = P2(x, y), R = r * Z; if (X > -R && X < 1920 + R && Y > -R && Y < 1080 + R && R < 400) S.dots.push([X, Y, R]); }
              const ap = EO(sg(rt, T_FOLD - 0.32, 0.22));
              for (let k = 0; k < 4; k++) { const [X, Y] = P2(Sc[0] + (k - 1.5) * 10.9, Sc[1]), R = 3.34 * Z * ap; if (R > 0.4) S.caps.push([X, Y, R, 0]); }
              return true;
            }
            /* 3. r16: no return to the four dots. A slow draw-in toward the centre, then every dot explodes straight into
               the ending's curling depth rays, sharp -> depth of field as it flies; handed to the ending once they settle */
            const cf = t * 30, wu = E ? EI(sg(cf, E.T_EXP - 16, 19)) : 0, ALL = [];
            for (let k = 0; k < 4; k++) for (const [x, y, r] of groups[k]) { const X = 960 + (x - fx) * z + dx, Y = 600 + (y - 600) * z; ALL.push([960 + (X - 960) * (1 - 0.08 * wu), 560 + (Y - 560) * (1 - 0.08 * wu), r * z]); }
            if (!E || cf < E.T_EXP) { for (const d of ALL) S.dots.push(d); return true; }
            const asg = pairing(ALL, E); S.soft = E.soft(cf); S.ddots = S.ddots || [];
            ALL.forEach(([x, y, r], i) => { const [c, j] = asg[i], e = E.e(j, cf), p = E.ray(c, j, cf); S.ddots.push([lerp(x, p[0], e), lerp(y, p[1], e), r, 1 - e]); });
            return true;
          };
        })();
