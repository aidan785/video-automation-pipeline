        /* ================= v1-voiced AI SECTION (Aidan 11/4): no gold dot. The AI is v1's FOUR DOTS that talk (capsules
           stretched by the voice). Each example: a person asks, the four dots talk, then the dots themselves BECOME the
           result (match cut / split): the letter -> the grandson; the clock -> the nurse home at bedtime; the awning -> the
           baker's shop. Runs on comp time (CT, v5h2 beats) from k92 to k132; bakerScene / the globe take over after. ================= */
        const KB = (k) => 3.483 + 0.49855 * k;
        const AI0 = KB(92), AI_RET = KB(96), C1 = KB(100), C2 = KB(108), C3 = KB(124), C3E = KB(132);
        const HUB = { x: 1290, y: 430, sp: 78, r: 24 };
        const hubPt = (k, s = 1) => [HUB.x + (k - 1.5) * HUB.sp * s, HUB.y];
        const voEnv = (env, c, t0) => { const f = (c - t0) * 30, i = Math.floor(f); if (i < 0 || i >= env.length - 1) return 0; return lerp(env[i], env[i + 1], f - i); };
        const fakeTalk = (c, a, b) => { if (c < a || c > b) return 0; const u = (c - a) / (b - a); return Math.sqrt(Math.sin(Math.PI * u)) * (0.35 + 0.65 * Math.abs(Math.sin(c * 15.3) * Math.sin(c * 6.1 + 1.3))); };
        function pushCaps(S, pts, r, talk) { pts.forEach(([x, y], k) => { const e = talk(k), rr = r; if (rr > 0.3) S.caps.push([x, y, rr, rr * 1.5 * e]); }); }
        /* morph helper: carry dots of set A into set B (paired by sorted order along x+y), u 0..1 */
        function morphSets(A, B, u) {
          if (!A.length || !B.length) return u < 0.5 ? A : B;
          const sa = [...A].sort((p, q) => p[0] + 0.3 * p[1] - q[0] - 0.3 * q[1]), sb = [...B].sort((p, q) => p[0] + 0.3 * p[1] - q[0] - 0.3 * q[1]), n = Math.max(sa.length, sb.length), out = [];
          for (let i = 0; i < n; i++) { const a = sa[Math.floor(i * sa.length / n)], b = sb[Math.floor(i * sb.length / n)], e = GLIDE(c01(u * 1.15 - 0.15 * hash(i, 7, 5)));
            out.push([lerp(a[0], b[0], e), lerp(a[1], b[1], e) - 60 * Math.sin(Math.PI * e), lerp(a[2], b[2], e)]); }
          return out;
        }
        /* a person typing on a tablet, left of frame */
        function askPerson(o, c, a) {
          const x = o.x || 470, y = FEET - 166 * (o.s || 1), typing = seg(a, 0.3, 0.05) * (1 - seg(a, 1.0, 0.1)), tb = 3 * Math.sin(c * 34) * typing, look = OUT(seg(a, 1.0, 0.3));
          const tab = [x + 106, y - 64 + 3 * Math.sin(c * 2.2)];
          const p = person({ x, y, s: o.s || 1, dir: 1, lean: 0.05, hair: o.hair, dress: o.dress, tw: 24, br: Math.sin(c * 2.1), nod: 0.1 * typing - 0.12 * look,
            ik: [[tab[0] - 12, tab[1] + 34 + tb], [tab[0] + 4, tab[1] + 30 - tb]], bend: [1, 1] });
          return { p, tab };
        }
        function askFrame(S, o, c, t0, ink, fade = 0, tabFade = 0, drawPerson = true) {
          const a = c - t0, { p, tab } = askPerson(o, c, a), g2 = OUT(seg(a, 0.0, 0.35)), cam = (d) => d;
          if (drawPerson && a < 0.45) asmDots("ask" + o.key, (cc) => askPerson(o, cc, cc - t0).p.P, t0, { x: 470, y: FEET + 40, r: 10 }, PE, c).forEach((d) => S.dots.push([d[0], d[1], d[2] * (1 - g2)]));
          if (drawPerson && g2 > 0) drawCells(S.dots, cam, p.P, PE, 0.44 * g2);
          if (g2 > 0 && tabFade < 1) iconDots("tablet", PE, tab[0], tab[1], 0.6 * g2, 0.12).forEach((d) => S.dots.push([d[0], d[1], d[2] * (1 - tabFade)]));
          for (let k = 0; k < 64; k++) S.dots.push([120 + k * 22, FEET + 6, 3.2 * OUT(seg(a, 0.05 + Math.abs(k - 32) * 0.006, 0.3))]);
          /* her words, typed into a bubble over the dots */
          const typed = seg(a, 0.3, 0.65), nch = Math.round(o.prompt.length * typed), fs = 34, bw = 0.5 * fs * o.prompt.length + 64, bx = HUB.x, by = HUB.y - 150, bop = OUT(seg(a, 0.26, 0.2)) * (1 - fade);
          const PL = []; if (bop > 0) rrDots(PL, bx, by, bw, 80, 40, 12, 2.8 * bop); PL.forEach((d) => S.dots.push(d));
          if (nch > 0 && bop > 0) S.texts.push([o.prompt.slice(0, nch), bx - bw / 2 + 32, by, fs, bop, "brl", ink, 0]);
          return { a, p, tab };
        }
        function aiState(t, S) {
          const c = CT; S.caps = [];
          /* ---- k92-k100: the four dots are born in the chip's centre, pop into a row and TALK with Jillian ("Now we're in the age of AI.") ---- */
          if (c < C1) {
            S.ground = OX; S.dotCol = CR; S.capCol = CR;
            const toHub = GLIDE(seg(c, C1 - 1.0, 0.95)), hop = wob(c - AI_RET, 0.16, 0.26, 0.22);
            const pts = [0, 1, 2, 3].map((k) => { const b = OUT(seg(c, AI0 + 0.04 + 0.06 * k, 0.3)), x0 = lerp(960, 960 + (k - 1.5) * 150, OUT(seg(c, AI0 + 0.1, 0.4)));
              const pop = wob(c - AI0 - 0.34 - 0.06 * k, 0.12, 0.25, 0.3), up = c >= AI_RET ? 34 * Math.max(0, Math.sin(Math.PI * c01((c - AI_RET - 0.04 * k) / 0.32))) : 0;
              const [hx, hy] = hubPt(k); return [lerp(x0, hx, toHub), lerp(540, hy, toHub) - up, lerp(46, HUB.r, toHub) * b * (1 + pop + hop)]; });
            pts.forEach(([x, y, r]) => { if (r > 0.3) S.caps.push([x, y, r, r * 1.5 * voEnv(VOE07, c, VO07_T0 + 0.0)]); });
            return;
          }
          /* ---- chat 1 (maroon), k100-k108: a grandmother asks; the dots talk; they fold into a LETTER that flies to her grandson; it splits back into the four dots ---- */
          if (c < C2) {
            S.ground = OX; S.dotCol = CR; S.capCol = CR;
            const o = { key: 1, hair: "bun", dress: true, prompt: "Help me write to my grandson in English." }, a = c - C1; askFrame(S, o, c, C1, CR, seg(a, 1.75, 0.3));
            const fold = GLIDE(seg(a, 1.75, 0.4)), fly = GLIDE(seg(a, 2.15, 0.7)), back = seg(a, 3.3, 0.6);
            const G = [1620, FEET - 166 * 0.8], ga = a - 2.6, jump = Math.max(0, Math.sin(Math.PI * c01((ga - 0.3) / 0.45))) * 54;
            const catchPt = [G[0] - 70, G[1] - 170 - jump], A0 = [HUB.x, HUB.y];
            if (fold < 1) pushCaps(S, [0, 1, 2, 3].map((k) => { const [hx, hy] = hubPt(k); return [lerp(hx, A0[0], fold), lerp(hy, A0[1], fold)]; }), HUB.r * (1 - 0.5 * fold), (k) => fakeTalk(c - 0.05 * k, C1 + 1.0, C1 + 1.65));
            if (fold > 0) {   /* the letter: the four dots ARE the envelope (grows out of them, then flies) */
              const v = 1 - fly, C = [(A0[0] + catchPt[0]) / 2, 220], ex = v * v * A0[0] + 2 * v * fly * C[0] + fly * fly * catchPt[0], ey = v * v * A0[1] + 2 * v * fly * C[1] + fly * fly * catchPt[1];
              const sc = lerp(0.2, 1.0, OUT(fold)) * lerp(1, 0.6, fly), split = OUT(back);
              if (split < 1) iconDots("envelope", PE, ex, ey, sc, 0.25 * Math.sin(a * 5) * (1 - fly) * fly * 4).forEach((d) => S.dots.push([d[0], d[1], d[2] * (1 - split)]));
              if (back > 0) pushCaps(S, [0, 1, 2, 3].map((k) => { const [hx, hy] = hubPt(k), u = GLIDE(c01(back * 1.2 - 0.06 * k)), mx = lerp(ex, hx, u), my = lerp(ey, hy, u) - 140 * Math.sin(Math.PI * u); return [mx, my]; }), HUB.r * OUT(back), () => 0);
            }
            if (ga > -0.05) {   /* the grandson, assembled where the letter lands; he catches it and jumps */
              const gs = (cc, j) => person({ x: G[0], y: G[1] - j, s: 0.8, hk: 1.2, dir: -1, hair: "short", br: Math.sin(cc * 2.6), legs: j > 3 ? [[0.4, -0.3], [-0.2, -0.6]] : undefined, ik: [[G[0] - 70, G[1] - j - 160], [G[0] - 52, G[1] - j - 150]], bend: [1, 1] });
              if (ga < 0.45) asmDots("gson1", (cc) => gs(cc, 0).P, C1 + 2.6, { x: G[0], y: FEET, r: 12 }, PE, c).forEach((d) => S.dots.push(d));
              if (ga > 0.2) drawCells(S.dots, (d) => d, gs(c, jump).P, PE, 0.44 * OUT(seg(ga, 0.2, 0.25)));
              if (fly >= 1 && back < 1) iconDots("envelope", PE, catchPt[0], catchPt[1] - 10, 0.6, -0.15).forEach((d) => S.dots.push(d));
              if (back >= 1) iconDots("envelope", PE, catchPt[0], catchPt[1] - 10, 0.6, -0.15).forEach((d) => S.dots.push(d));
            }
            return;
          }
          /* ---- chat 2 (cream), k108-k124: a nurse asks; the dots talk; they fly out to 12/3/6/9 and become a CLOCK that races to 8:00;
                  the camera pulls back: it's the clock on her kid's bedroom wall, she's home, reading him a story ---- */
          if (c < C3) {
            S.ground = CR; S.dotCol = OX; S.capCol = OX;
            const a = c - C2, CKW = [1180, 230], CKR = 70, CKS = [960, 470], Rbig = 200;
            const pull = GLIDE(seg(a, 3.35, 0.95)), Z = lerp(Rbig / CKR, 1, pull), cam = mk(CKW[0], CKW[1], Z * (1 + 0.04 * GLIDE(seg(a, 4.3, 3.2))), lerp(CKS[0], CKW[0], pull), lerp(CKS[1], CKW[1], pull));
            const chatOut = seg(a, 1.75, 0.45);
            if (chatOut < 1) {
              const T = { dots: [], texts: [] }, o = { key: 2, hair: "pony", prompt: "Turn my notes into a shift handoff." }; askFrame(T, o, c, C2, OX);
              T.dots.forEach((d) => S.dots.push([d[0], d[1] + 40 * IN(chatOut), d[2] * (1 - chatOut)])); T.texts.forEach((x) => { x[4] *= 1 - chatOut; S.texts.push(x); });
            }
            const toClock = GLIDE(seg(a, 1.7, 0.5)), ring = OUT(seg(a, 2.05, 0.45)), race = seg(a, 2.2, 1.35), handOn = OUT(seg(a, 2.15, 0.25));
            /* the four dots: talk at the hub, then fly to 12 / 3 / 6 / 9 (in clock world space) */
            const qWorld = [0, 1, 2, 3].map((k) => [CKW[0] + Math.cos(-Math.PI / 2 + k * Math.PI / 2) * CKR, CKW[1] + Math.sin(-Math.PI / 2 + k * Math.PI / 2) * CKR]);
            const talk = (k) => fakeTalk(c - 0.05 * k, C2 + 1.0, C2 + 1.65);
            if (toClock < 1) pushCaps(S, [0, 1, 2, 3].map((k) => { const [hx, hy] = hubPt(k), q = cam([...qWorld[k], 1]); return [lerp(hx, q[0], toClock), lerp(hy, q[1], toClock) - 90 * Math.sin(Math.PI * toClock)]; }), lerp(HUB.r, 8 * Z, toClock), talk);
            else qWorld.forEach((q) => S.dots.push(cam([q[0], q[1], 8])));
            for (let k = 0; k < 24; k++) { if (k % 6 === 0) continue; const an = k / 24 * 6.2832 - Math.PI / 2, u = c01(ring * 1.3 - k / 24 * 0.3); if (u > 0) S.dots.push(cam([CKW[0] + Math.cos(an) * CKR, CKW[1] + Math.sin(an) * CKR, 3.4 * u])); }
            if (handOn > 0) {   /* hands race round, settle on 8:00 */
              const sp = GLIDE(race), am = -Math.PI / 2 + 6.2832 * 3 * (1 - sp) * 1.0, ah = -Math.PI / 2 + 6.2832 * (8 / 12) - 6.2832 * 0.25 * (1 - sp);
              for (const [an, L] of [[am, 58], [ah, 38]]) for (let q = 1; q * 8 <= L; q++) S.dots.push(cam([CKW[0] + Math.cos(an) * q * 8, CKW[1] + Math.sin(an) * q * 8, 3.8 * handOn]));
              S.dots.push(cam([CKW[0], CKW[1], 6 * handOn]));
            }
            /* the bedroom grows in around the clock as the camera pulls back */
            const rm = OUT(seg(a, 3.45, 0.7));
            if (rm > 0) {
              const room = [];
              room.push(["s", 140, FEET + 4, 1800, FEET + 4, 3]);
              room.push(["s", DOOR[0], FEET, DOOR[0], DOOR[1], 6], ["s", DOOR[0], DOOR[1], DOOR[0] + DOOR[2] * 0.5, DOOR[1], 6], ["s", DOOR[0] + DOOR[2] * 0.5, DOOR[1], DOOR[0] + DOOR[2] * 0.5, FEET, 6]);
              room.push(["s", 620, 220, 900, 220, 5], ["s", 620, 220, 620, 420, 5], ["s", 900, 220, 900, 420, 5], ["s", 620, 420, 900, 420, 5], ["s", 760, 220, 760, 420, 4], ["s", 620, 320, 900, 320, 4]);
              room.push(["s", BED.x0, BED.y + 24, BED.x1, BED.y + 24, 13], ["s", BED.x0 + 14, BED.y + 24, BED.x0 + 14, FEET, 7], ["s", BED.x1 - 14, BED.y + 24, BED.x1 - 14, FEET, 7], ["s", BED.x1, BED.y - 120, BED.x1, FEET, 9]);
              room.push(["s", LAMP[0] - 50, 640, LAMP[0] + 50, 640, 7], ["s", LAMP[0] - 40, 640, LAMP[0] - 40, FEET, 6], ["s", LAMP[0] + 40, 640, LAMP[0] + 40, FEET, 6], ["s", LAMP[0], 640, LAMP[0], LAMP[1] + 30, 5], ["p", [[LAMP[0] - 46, LAMP[1] + 34], [LAMP[0] + 46, LAMP[1] + 34], [LAMP[0] + 26, LAMP[1] - 30], [LAMP[0] - 26, LAMP[1] - 30]]]);
              drawCells(S.dots, cam, room, 10, 0.4 * rm);
              discDots(832, 270, 26, 8, 0.44).forEach((d) => S.dots.push(cam([d[0], d[1], d[2] * rm])));
              /* her kid sitting up in bed, the blanket; she sits on the edge, reading */
              const blanket = ["p", [[1150, BED.y + 8], [1180, BED.y - 26], [1320, BED.y - 40], [1440, BED.y - 30], [1470, BED.y + 8]]];
              const kidP = person({ x: 1440, y: BED.y - 16, s: 0.62, hk: 1.3, dir: -1, lean: -0.14, hair: "pig", legs: [[1.5, 1.5], [1.5, 1.5]], arms: [[0.5 + 0.06 * Math.sin(c * 2), 0.9], [0.35, 0.25]], nod: 0.06 * Math.sin(c * 1.4) });
              const book = [1205, 600 + 3 * Math.sin(c * 1.9)], br = Math.sin(c * 2.0);
              const nur = person({ x: 1110, y: BED.y - 150, s: 1.08, dir: 1, lean: -0.04, hair: "pony", sway: 0.2 * Math.sin(c * 1.2), br, legs: [[1.45, 0.05], [1.4, 0.08]], ik: [[book[0] - 26, book[1] + 14], [book[0] + 22, book[1] + 16]], bend: [1, 1], nod: 0.14 });
              drawCells(S.dots, cam, [...kidP.P, blanket], PE, 0.44 * rm);
              drawCells(S.dots, cam, nur.P, PE, 0.44 * rm);
              iconDots("book", PE, book[0], book[1], 0.7, -0.1).forEach((d) => S.dots.push(cam([d[0], d[1], d[2] * rm])));
            }
            /* the end of the scene: the clock's four dots leave the wall and become the four dots again (they lead the invert into the baker) */
            const lv = seg(c, C3 - 0.75, 0.75);
            if (lv > 0) { const L = GLIDE(lv); S.dots = S.dots.map((d) => { const dx = d[0] - CX, dy = d[1] - CY; return [CX + dx * (1 - 0.15 * L), CY + dy * (1 - 0.15 * L), d[2] * (1 - L)]; });
              qWorld.forEach((q, k) => { const s0 = cam([q[0], q[1], 8]), [hx, hy] = hubPt(k); S.caps.push([lerp(s0[0], hx, L), lerp(s0[1], hy, L), lerp(s0[2], HUB.r, L), 0]); }); }
            return;
          }
          /* ---- chat 3 (maroon), k124-k132: a baker asks; the dots talk; they split into the scallops of her shop's AWNING; the shop builds round her ---- */
          S.ground = OX; S.dotCol = CR; S.capCol = CR;
          const a = c - C3, o = { key: 3, hair: "bun", dress: true, prompt: "Build an online shop for my bread." };
          const walk = GLIDE(seg(a, 2.3, 1.1)), shopIn = OUT(seg(a, 2.2, 0.8));
          const f = askFrame(S, o, c, C3, CR, seg(a, 1.75, 0.3), seg(a, 2.1, 0.3), walk <= 0);
          if (walk > 0) {   /* the baker: from the chat pose (left) into the shop pose (centre, front) */
            const bShop = baker(M(KB(132))).p, bA = cells(f.p.P, PE).map(([x, y]) => [x, y, PE * 0.44]), bB = cells(bShop.P, PE).map(([x, y]) => [x, y - 60, PE * 0.44]);
            morphSets(bA, bB, walk).forEach((d) => S.dots.push(d));
          }
          /* the four dots talk, then SPLIT into 8 and fly up into the awning scallops */
          const sp = GLIDE(seg(a, 1.75, 0.6)), talk = (k) => fakeTalk(c - 0.05 * k, C3 + 1.0, C3 + 1.65);
          if (sp <= 0) pushCaps(S, [0, 1, 2, 3].map((k) => hubPt(k)), HUB.r, talk);
          else for (let j = 0; j < 8; j++) { const k = j >> 1, [hx, hy] = hubPt(k), tx = 645 + j * 90, ty = 214 - 60, u = c01(sp * 1.15 - 0.02 * j), x = lerp(hx, tx, u), y = lerp(hy, ty, u) - 120 * Math.sin(Math.PI * u);
            if (u < 1) S.dots.push([x, y, lerp(HUB.r * (j % 2 ? 0.75 : 1), 40, u)]); }
          if (sp > 0.85) {   /* they land as the awning's half-scallops (same cells as the shop scene) */
            const aw = []; for (let k = 0; k < 8; k++) aw.push(["d", 645 + k * 90, 214, 44]); aw.push(["x", ["p", [[600, 160], [1320, 160], [1320, 214], [600, 214]]]]);
            const g = c01((sp - 0.85) / 0.15); cells(aw, 10).forEach(([x, y]) => S.dots.push([x, y - 60, 10 * 0.32 * g]));
          }
          if (shopIn > 0) {   /* the shop draws itself round her (same layout + camera as the shop scene that follows) */
            const shop = [["s", 560, FEET + 4, 1360, FEET + 4, 3], ["s", 600, 210, 1320, 210, 6], ["s", 600, 210, 600, FEET, 5], ["s", 1320, 210, 1320, FEET, 5],
              ["s", 660, 330, 820, 330, 4], ["s", 660, 330, 660, 520, 4], ["s", 820, 330, 820, 520, 4], ["s", 660, 520, 820, 520, 4], ["s", 1100, 330, 1260, 330, 4], ["s", 1100, 330, 1100, 520, 4], ["s", 1260, 330, 1260, 520, 4], ["s", 1100, 520, 1260, 520, 4]];
            const sc = cells(shop, 10);
            sc.forEach(([x, y]) => { const d = Math.hypot(x - 960, y - 400), u = c01(shopIn * 1.4 - d / 1400); if (u > 0) S.dots.push([x, y - 60, 10 * 0.32 * u]); });
          }
          /* "open": a small sign in the window */
          const op = OUT(seg(a, 3.0, 0.4)); if (op > 0) S.texts.push(["OPEN", 740, 425 - 60, 30, op, "cap", CR, 4 * (1 - op)]);
        }
