        /* v1-voiced: a farmer working the field with a hoe (v5h2 person), carved out of the field dots so he reads */
        function farmerDots(t) {
          return null;   /* r11d (Aidan: "remove the farmer from the farm scene, just fill in those dots"): no farmer, field uncarved */
          const Bk = window.__B; if (!Bk) return null;
          const a = OUT(seg(t, T_FALL + 0.45, 0.6)); if (a <= 0.01) return null;
          const s = 1.2, feet = 1018, fx = 300, fy = feet - 166 * s, u = Math.max(0, Math.sin((t - T_FALL) * 4.4)), sw = Math.sin((t - T_FALL) * 4.4);
          const h1 = [fx + 70 + 20 * sw, fy - 10 - 90 * u], tip = [fx + 330 - 40 * u, feet - 20 - 170 * u];
          const p = Bk.person({ x: fx, y: fy, s, dir: 1, lean: 0.22 - 0.12 * u, hair: "short", ik: [[h1[0] + 20, h1[1] + 10], [lerp(h1[0], tip[0], 0.32), lerp(h1[1], tip[1], 0.32)]], bend: [1, 1] });
          const dx = tip[0] - h1[0], dy = tip[1] - h1[1], L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L;
          const P2 = [...p.P, ["s", h1[0] - dx * 0.08, h1[1] - dy * 0.08, tip[0], tip[1], 6], ["s", tip[0] - nx * 4, tip[1] - ny * 4, tip[0] - nx * 4 + dy / L * 46, tip[1] - ny * 4 - dx / L * 46, 8]];
          const PE = 9, cs = Bk.cells(P2, PE), keys = new Set();
          cs.forEach(([x, y]) => { const i = Math.round(x / 14), j = Math.round(y / 14); for (let di = -2; di <= 2; di++) for (let dj = -2; dj <= 2; dj++) keys.add((i + di) * 10000 + (j + dj)); });
          return { dots: cs.map(([x, y]) => [x, y, PE * 0.46 * a]), hit: (x, y) => keys.has(Math.round(x / 14) * 10000 + Math.round(y / 14)) };
        }
        function late(t, S, bo, raw) {
