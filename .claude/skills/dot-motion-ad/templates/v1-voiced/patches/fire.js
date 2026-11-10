if (t >= 10.33 && t < T_SW) fireCells(t).forEach(([x, y, k]) => S.glyphs.push([...cm([x, y, PG * 1.0]), fireSym(x, y, t), 1]));   /* their chunky grid, our symbols */
            /* v1-voiced: a little family gathers round the fire as it builds, warming their hands (v5h2 people) */
            if (window.__B && t >= 10.3 && t < T_SW + 0.32) {
              const Bk = window.__B, fam = OUT(seg(t, 10.38, 0.5)) * (1 - IN(seg(t, T_SW - 0.02, 0.3))), fl = Math.sin(t * 2.3), wy = FBY - 166, PE = 8;
              if (fam > 0.01) {
                const pp = [Bk.person({ x: 470, y: wy, s: 1.0, dir: 1, lean: 0.12, hair: "short", br: fl, ik: [[FCX - 300, FBY - 150 + 6 * fl], [FCX - 320, FBY - 120]], bend: [1, 1] }),
                  Bk.person({ x: 1450, y: wy, s: 1.0, dir: -1, lean: 0.1, hair: "long", dress: true, br: -fl, ik: [[FCX + 300, FBY - 150 - 6 * fl], [FCX + 320, FBY - 120]], bend: [1, 1] }),
                  Bk.person({ x: 1600, y: FBY - 166 * 0.6, s: 0.6, hk: 1.3, dir: -1, lean: 0.05, hair: "pig", ik: [[1530, FBY - 170], [1520, FBY - 150]], bend: [1, 1] })];
                for (const q of pp) for (const [x, y] of Bk.cells(q.P, PE)) S.dots.push(cm([x, y + 40 * (1 - fam), PE * 0.44 * fam]));
              }
            }
