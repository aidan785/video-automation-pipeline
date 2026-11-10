              S.dots.push([x, y, P * 0.5 * Math.sqrt(Math.min(1, L)) * al]);
            }
            /* v1-voiced: a kid reads on the floor under the bulb, lit up when it comes on (v5h2 person) */
            if (window.__B) { const Bk = window.__B, kal = c01((sc - 0.45) / 0.25);
              if (kal > 0) { const kid = Bk.person({ x: 300, y: 1000 - 166 * 0.78 * 0.55, s: 0.78, hk: 1.3, dir: 1, lean: -0.08, hair: "pig", legs: [[1.5, 1.45], [1.45, 1.4]], ik: [[410, 905], [422, 913]], bend: [1, 1], nod: 0.18 }), PE = 8, rr = PE * 0.44 * kal * (0.5 + 0.5 * glow);
                for (const [x, y] of Bk.cells(kid.P, PE)) S.dots.push([x, y, rr]);
                for (const [x, y] of Bk.iconDots("book", PE, 422, 887, 0.55, -0.25)) S.dots.push([x, y, rr]);
                for (let k = 0; k < 40; k++) S.dots.push([110 + k * 12, 1042, 3.2 * kal]); } }
