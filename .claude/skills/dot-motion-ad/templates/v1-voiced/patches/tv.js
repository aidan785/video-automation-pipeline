function tvScene(t, S) {
          /* v1-voiced (no footage): an old TV made of dots; after a beat of static it shows the moon landing (v5h2's dot
             astronaut planting the flag), and a family on the couch, seen from behind, watches it together */
          const cf = (t + SH()) * 30, P = 10, Bk = window.__B;
          S.ground = OX; S.dotCol = CR; S.dots = []; S.glyphs = []; S.blobs = []; S.arcs = []; S.streaks = []; S.zoomC = null;
          const TW = 900, TH = 520, CXs = 960, CYs = 320, RAD = 110, push = 1 + 0.05 * GLIDE(seg(cf, T_TV, 156));
          const zp = (x, y, r) => [960 + (x - 960) * push, 600 + (y - 600) * push, r * push];
          const fr = Math.floor(cf), T_LAND = T_TV + 13, tune = cf < T_LAND, a = (cf - T_LAND) / 30 * 0.42;
          const D = !tune && Bk ? Bk.surfTone(a) : null, x0 = CXs - TW / 2, y0 = CYs - TH / 2, flick = 0.92 + 0.08 * hash(fr, 3, 91), on = OUT(seg(cf, T_TV, 5));
          for (let ly = P / 2; ly < TH; ly += P) for (let lx = P / 2; lx < TW; lx += P) {
            const qx = Math.max(RAD - lx, lx - (TW - RAD), 0), qy = Math.max(RAD - ly, ly - (TH - RAD), 0);
            if (Math.hypot(qx, qy) > RAD) continue;
            let L = 0;
            if (tune) { const roll = ((ly / TH + cf * 0.11) % 1), snow = hash(Math.floor(lx / 12), Math.floor(ly / 12) + fr * 97, 97); L = Math.max(snow > 0.55 ? (snow - 0.55) * 2.2 : 0, roll < 0.12 ? 0.5 * snow : 0); }
            else if (D) { const v = Bk.surfL(D, lx / TW * 1920, ly / TH * 1080 + 40); L = Math.pow(c01((v - 0.12) / 0.8), 1.1); }
            S.dots.push(zp(x0 + lx, y0 + ly, Math.max(1.4, P * 0.5 * Math.sqrt(L) * flick) * on));
          }
          /* the set: cabinet edge, antenna, knobs */
          const cab = (x, y) => S.dots.push(zp(x, y, 4.2 * on));
          for (let k = 0; k <= 120; k++) { const u = k / 120; cab(x0 - 34 + u * (TW + 68), y0 - 34); cab(x0 - 34 + u * (TW + 68), y0 + TH + 34); }
          for (let k = 0; k <= 70; k++) { const u = k / 70; cab(x0 - 34, y0 - 34 + u * (TH + 68)); cab(x0 + TW + 34, y0 - 34 + u * (TH + 68)); }
          for (let k = 0; k <= 22; k++) { const u = k / 22; cab(CXs - 40 * u * 4, y0 - 34 - 34 * u * 2.4); cab(CXs + 40 * u * 3.2, y0 - 34 - 34 * u * 2.6); }
          /* the family on the couch (backs to us): heads + shoulders above the couch back, the kid points up when the flag goes in */
          if (Bk) {
            const fa = OUT(seg(cf, T_TV + 3, 10)), PE = 9, top = 800, DY = -160;   /* r5: everything lifted out of the caption zone */ pnt = OUT(seg(a, 1.0, 0.25));
            const ppl = [Bk.person({ x: 640, y: 1075 + DY, s: 1.28, front: true, hair: "short", tw: 25, br: Math.sin(cf / 30 * 2.1) }),
              Bk.person({ x: 1280, y: 1080 + DY, s: 1.22, front: true, hair: "long", dress: true, br: Math.sin(cf / 30 * 2.4 + 1) }),
              Bk.person({ x: 960, y: 1030 + DY - 16 * pnt, s: 0.86, hk: 1.3, front: true, hair: "pig", arms: [[lerp(0.4, 2.65, pnt), lerp(0.3, 2.8, pnt)], [lerp(0.4, 2.65, pnt), lerp(0.3, 2.8, pnt)]] })   /* r5: both hands up */];
            for (const q of ppl) for (const [x, y] of Bk.cells(q.P, PE)) if (y < top - 12) S.dots.push(zp(x, y, PE * 0.46 * fa));
            for (let y = top; y < top + 96; y += 14) for (let x = 380; x <= 1540; x += 14) { const edge = y < top + 16 || x < 430 || x > 1490; if (x > 430 && x < 1490 && y > top + 16 && y < top + 40) continue; S.dots.push(zp(x, y, (edge ? 5.2 : 3.4) * fa)); }
            for (const sx of [380, 1540]) for (let y = top - 60; y < top; y += 14) for (let dx = 0; dx < 56; dx += 14) S.dots.push(zp(sx + (sx < 900 ? dx - 28 : -dx + 28), y, 5 * fa));
          }
        }
        
