if (window.__B) {   /* r6 (Aidan): an old-school COACH, articulated. The horse follows the hill under it; each coach wheel sits on the
               hill where IT is; the cabin tilts between its two wheels with a damped sway; hinged shafts link the two, so on crests
               and dips the horse and coach sit at different angles. Wheels = the wheel-scene spokes, rolling at ground speed. */
              const Bk = window.__B, ph = 6.2832 * t / 0.42, PC = 9, rk = PC * 0.46, HX = 1160;
              const slopeAt = (x, tt) => Math.max(-0.45, Math.min(0.45, Math.atan2(surfS(x + 40, tt) - surfS(x - 40, tt), 80)));
              /* the horse (rider removed: the driver sits on the coach) */
              const H2 = Bk.horseRig(0, 0, -30, 1.38, ph, 1), nR = Bk.person({ x: 0, y: 0, s: 1, dir: 1, legs: [[1.15, 0.12], [1.05, 0.05]], ik: [[1, 1], [1, 1]] }).P.length;
              const hs = slopeAt(HX, t), hy = surfS(HX, t), hP = (x, y) => { const [rx, ry] = rot(x, y - 150, hs); return [HX + rx, hy + ry]; };
              /* r9 harness, cut into the horse as thin strap lines (local horse frame): collar at the shoulders, saddle + girth at mid-back, breeching round the hindquarters */
              const HS = [["x", ["s", 118, -86, 92, 24, 4.5]], ["x", ["s", 22, -96, 30, 34, 4.5]], ["x", ["s", -6, -98, 52, -98, 6]]];
              for (let k = 0; k < 8; k++) { const u0 = k / 8, u1 = (k + 1) / 8, br = (u) => [-150 + 70 * Math.sin(u * 3.1416) * 0.4 + 40 * u, -70 + 110 * u]; HS.push(["x", ["s", ...br(u0), ...br(u1), 4]]); }
              HS.push(["x", ["s", -128, -40, 22, -40, 3.6]]);   /* a trace strap along the flank, from the breeching to the saddle */
              for (const [x, y] of Bk.cells([...H2.slice(0, H2.length - nR), ...HS], 12)) { const [X, Y] = hP(x, y); S.dots.push(bz([X, Y, 12 * 0.46])); }
              /* coach wheels on the hill: big rear, small front */
              const RR = 80, RF = 54, RX = HX - 600, FX = HX - 330;
              const axle = (x, R, tt) => [x, surfS(x, tt) + 12 - R];
              const ang = (tt) => { const a = axle(RX, RR, tt), b = axle(FX, RF, tt); return Math.atan2(b[1] - a[1] - (RR - RF) * 0, b[0] - a[0]); };
              /* suspension: the body lags its wheels a touch and sways (damped) */
              const a0 = ang(t), aLag = 0.55 * a0 + 0.3 * ang(t - 0.09) + 0.15 * ang(t - 0.18), sway = 0.025 * Math.sin(t * 7.3) * Math.min(1, Math.abs(a0 - ang(t - 0.15)) * 12 + 0.25);
              const ab = aLag + sway, bounce = -3 - 4 * Math.abs(Math.sin(ph * 0.5 + 0.8)), A0 = axle(RX, RR, t);
              const f = (lx, ly) => { const [rx, ry] = rot(lx, ly + bounce, ab); return [A0[0] + rx, A0[1] + ry]; };
              const C = [];
              /* undercarriage + springs */
              C.push(["s", -70, -18, 300, -18, 6], ["s", -20, -24, 30, -36, 4], ["s", 230, -24, 270, -36, 4]);
              /* the cabin: straight sides, ARCHED roof with a slight overhang */
              const top = -262, eave = -200, cab = [[-40, -46], [200, -46], [204, eave]];
              for (let k = 0; k <= 16; k++) { const u = k / 16, x = lerp(204, -44, u); cab.push([x, eave - (eave - top) * Math.sin(Math.PI * u)]); }
              cab.push([-44, eave]); C.push(["p", cab]);
              const lip = []; for (let k = 0; k <= 18; k++) { const u = k / 18, x = lerp(216, -56, u); lip.push([x, eave + 4 - (eave - top + 10) * Math.sin(Math.PI * u)]); }
              for (let k = 0; k < lip.length - 1; k++) C.push(["s", ...lip[k], ...lip[k + 1], 5]);
              C.push(["s", -56, eave + 4, -44, eave + 4, 5], ["s", 204, eave + 4, 216, eave + 4, 5]);
              /* door (outline + window) and a side window, cut out of the cabin */
              C.push(["x", ["p", [[64, -186], [136, -186], [136, -124], [64, -124]]]]);
              C.push(["x", ["s", 56, -196, 144, -196, 2.6]], ["x", ["s", 56, -196, 56, -54, 2.6]], ["x", ["s", 144, -196, 144, -54, 2.6]]);
              C.push(["x", ["p", [[-20, -186], [32, -186], [32, -124], [-20, -124]]]]);
              C.push(["x", ["s", 0, -232, 160, -232, 2.4]]);   /* a roof seam */
              /* a small coach lamp */
              C.push(["s", 204, -150, 222, -150, 3], ["d", 228, -160, 10]);
              /* the raised driver's box at the front */
              C.push(["s", 200, -70, 262, -150, 6], ["s", 236, -150, 300, -150, 8], ["s", 250, -84, 312, -84, 6]);
              const drv = Bk.person({ x: 268, y: -156, s: 0.82, dir: 1, lean: 0.12, hair: "short", tw: 26, legs: [[1.35, 0.35], [1.3, 0.3]], ik: [[352, -196], [358, -188]], bend: [1, 1] });
              const body = Bk.xfPrims([...C, ...drv.P], f, ab);
              /* the shafts: hinged at the coach front and at the horse's harness, so they flex between the two */
              /* r9: the shafts CURVE (classic carriage shafts arc up, then run forward along the horse's side to the saddle tug),
                 a cubic between the two hinges whose handles follow the coach's and the horse's angles, with a little lagging bounce;
                 thin dots on the coach grid, drawn past the hind legs (above them), never a straight bar */
              const shaftDots = (y0, yh, rad) => {
                const P0 = f(300, y0), P3 = hP(30, yh), L = Math.hypot(P3[0] - P0[0], P3[1] - P0[1]), lag = 6 * Math.sin(ph * 0.5 + 1.9);
                const C1 = [P0[0] + Math.cos(ab - 0.42) * L * 0.42, P0[1] + Math.sin(ab - 0.42) * L * 0.42 + lag], C2 = [P3[0] - Math.cos(hs + 0.08) * L * 0.4, P3[1] - Math.sin(hs + 0.08) * L * 0.4 - 0.5 * lag];
                const pts = []; for (let k = 0; k <= 60; k++) { const u = k / 60, v = 1 - u; pts.push([v * v * v * P0[0] + 3 * v * v * u * C1[0] + 3 * v * u * u * C2[0] + u * u * u * P3[0], v * v * v * P0[1] + 3 * v * v * u * C1[1] + 3 * v * u * u * C2[1] + u * u * u * P3[1]]); }
                let acc = 0; S.dots.push(bz([...pts[0], rad + 1.6]));
                for (let k = 1; k < pts.length; k++) { acc += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); if (acc >= 8) { acc = 0; S.dots.push(bz([...pts[k], rad])); } }
                S.dots.push(bz([...P3, rad + 1.4]));
              };
              shaftDots(-30, -44, 3.4);
              /* the reins: driver's hands to the horse's head */
              const hd = hP(250, -108), hnd = f(352, -192);
              body.push(["s", ...hnd, ...hd, 2.4]);
              /* the wheels, in screen space on the hill */
              for (const [wx, R] of [[RX, RR], [FX, RF]]) { const [cx, cy] = axle(wx, R, t), wa = -gScroll(t) / R, n = Math.round(R / 3);
                for (let k = 0; k < n; k++) { const q0 = k / n * 6.2832, q1 = (k + 1) / n * 6.2832; body.push(["s", cx + Math.cos(q0) * R, cy + Math.sin(q0) * R, cx + Math.cos(q1) * R, cy + Math.sin(q1) * R, 5]); }
                for (let k = 0; k < 8; k++) { const q = wa + k / 8 * 6.2832; body.push(["s", cx, cy, cx + Math.cos(q) * (R - 5), cy + Math.sin(q) * (R - 5), 3.4]); }
                body.push(["d", cx, cy, R > 60 ? 13 : 10]); }
              for (const [x, y] of Bk.cells(body, PC)) S.dots.push(bz([x, y, rk]));
            } else cells(horsePrims(t, 0, 0, 0), PHo).forEach(([x, y]) => { const [rx, ry] = rot(x, y - 150, sl); S.dots.push(bz([960 + rx, fy + ry, DHo])); });
