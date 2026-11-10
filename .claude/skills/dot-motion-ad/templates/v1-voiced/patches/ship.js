if (t >= T_WAVE3 && window.__B) {
              /* v1-voiced: no footage. v5h2's procedural v1-style halftone sea rises from the water line, and the detailed
                 dot galleon sails in on the swell (mother + kid on the stern castle), spray off the bow */
              const Bk = window.__B, c = t - T_WAVE3, rise = OUT(seg(t, T_WAVE3, 0.7)), PW = 12, z = 1.02 + 0.07 * GLIDE(seg(t, T_WAVE3, 4.6));
              const camS = (p) => cm([960 + (p[0] - 960) * z, 560 + (p[1] - 560) * z, p[2] * z]);
              const crest = []; for (let i = -4; i < 164; i++) crest.push(Bk.seaCrest(i * PW + PW / 2, c, rise));
              const crestAt = (x) => crest[Math.max(0, Math.min(crest.length - 1, Math.round((x - PW / 2) / PW) + 4))];
              for (let i = -4; i < 164; i++) { const x = i * PW + PW / 2, cr = crest[i + 4];
                for (let y = Math.max(PW / 2, Math.floor((cr - 60) / PW) * PW + PW / 2); y < 1150; y += PW) { const L = Bk.seaL(x, y, c, cr, rise); if (L > 0.035) S.dots.push(camS([x, y, PW * 0.52 * Math.sqrt(L)])); } }
              /* r3 (Aidan): no slide-in. The galleon is carried UP with the sea as it swells: it rides the rising water (same rise
                 curve as the crest) and emerges out of it (masts first), clipped at the waterline */
              const em = OUT(seg(t, T_WAVE3 + 0.1, 1.3));
              if (em > 0) {
                const g2 = OUT(seg(t, T_WAVE3 + 0.1, 0.35)), lift = (1 - rise) * 260 + (1 - em) * 420, ps = Bk.shipPose(c), SS = 0.86;
                const f = (x, y) => { const [rx, ry] = rot(x * SS, y * SS, ps.a); return [ps.x + rx, ps.y + lift + ry]; };
                const wet = (x, y) => y < crestAt(x) + 4;
                const G = Bk.galleon(c);
                for (const [x, y] of Bk.cells(Bk.xfPrims(G.P, f, ps.a), 6)) if (y < crestAt(x) + 4) S.dots.push(camS([x, y, 6 * 0.44 * g2]));
                for (const [p0, p1] of G.rig) { const A2 = f(...p0), B2 = f(...p1), n = Math.ceil(Math.hypot(B2[0] - A2[0], B2[1] - A2[1]) / 9); for (let k = 0; k <= n; k++) { const X = lerp(A2[0], B2[0], k / n), Y = lerp(A2[1], B2[1], k / n); if (wet(X, Y)) S.dots.push(camS([X, Y, 1.5 * g2])); } }
                const wv = Math.sin(t * 11) * 0.35;
                const mom = Bk.person({ x: -314, y: -98 - 166 * 0.27, s: 0.27, front: true, hair: "long", dress: true, arms: [[0.25, 0.15], [2.5 + wv, 2.9 + wv]] });
                const kid = Bk.person({ x: -283, y: -98 - 166 * 0.17, s: 0.17, hk: 1.3, front: true, hair: "short", arms: [[2.4 - wv, 2.8 - wv], [0.3, 0.2]] });
                for (const [x, y] of Bk.cells(Bk.xfPrims([...mom.P, ...kid.P], f, ps.a), 5)) if (wet(x, y)) S.dots.push(camS([x, y, 5 * 0.5 * g2]));
                const bow = f(330, -10);
                for (let k = 0; k < 34; k++) { const ph = (c * 1.3 + hash(k, 1, 31)) % 1, vx = 140 + 240 * hash(k, 2, 31), vy = -(260 + 300 * hash(k, 3, 31)), tt = ph * 0.9;
                  const x = bow[0] + vx * tt, y = bow[1] + vy * tt + 0.5 * 900 * tt * tt; if (y > crestAt(x) + 6) continue;
                  S.dots.push(camS([x, y, (1 - ph) * (2.5 + 3 * hash(k, 4, 31)) * g2])); }
              }
            }
            
