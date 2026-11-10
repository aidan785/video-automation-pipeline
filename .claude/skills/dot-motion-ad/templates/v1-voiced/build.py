#!/usr/bin/env python3
"""v1-voiced: the ORIGINAL v1 teaser (engine A = hp-teaser-cg-proof) for 0 -> H, then the v5-hybrid-v2 AI section
(engine B) for the rest, in ONE composition with one timeline. Both engines are inlined from snapshots
(tools/srcA.html = cg-proof, tools/srcB.html = v5h2) with string patches + tools/patchA.js (the human adjustments).

Run from the project folder:  python3 tools/build.py   -> index.html, assets/audio/bed-ducked.m4a, tools/cue.json
Timing: root time r. r < H: engine A at r (its own clocks). r >= H: engine B at v5h2 time r + D, so v5h2 beat k92
(the build, one dot breathing) lands exactly at H; everything after is v5h2's music-locked cut, shifted by -D.
"""
import json, os, re, subprocess

P, T0 = 0.49855, 3.483
tk = lambda k: T0 + P * k          # v5h2 comp time of its beat k
g = lambda n: T0 + P * n           # Neck Brace source time of source beat n
H = 46.9                           # v1: f1407, the chip zoom has just filled the frame (end of the ad audio, before their prompt)
K_IN = 92                          # v5h2 beat where the tail starts (one dot breathes over the build)
D = round(tk(K_IN) - H, 4)         # root -> v5h2 offset
END_K = 162
END = round(tk(END_K) - D, 4)
# r4 (Aidan: "really weird cut ... keep it playing how it was before"): v1 plays straight through to its own 59s ending.
# Engine B is only used for captions + the people/ship/horse rigs the history borrows.
H = END_A = 59.0
# r11 (Aidan: add "it wasn't about the tool, it's how humans use it" near the end, before the wrap-up): the four talking dots
# say a NEW Fish line after "Now we're in the age of AI." Engine A's clock slows to INS_S inside [INS_X, INS_X+INS_G) (the pills
# keep talking off the ROOT clock), then resumes INS_SHIFT later; the ending, its music and the last two real lines move with it.
INS_X, INS_G, INS_S = 48.5, 3.9, 0.718   # r15: window = the tools insert; engine A lands on its pills (51.30) as the window ends (+1.1 s)
# r11b (Aidan: "I don't want an animation for this, just the voiceover during the transition"): no tools/people insert,
# the four dots just keep talking the new line through the held stretch. tools/patches/tools_ins.js kept, off.
TOOLS_ANIM = True    # r14 (team: four dots sit too long; Aidan: dots -> tools, humans pop up to use them). was False in r12b (Aidan: "get rid of that, back to the original without the wheel and carriage")
# r12 (Aidan: "spin the four dots into the wheel ... then that turns into maybe the carriage"): the wheel -> carriage insert.
# r11 tools/people = tools/patches/tools_ins.js; r11e (no animation) = TOOLS_ANIM False, archived at ../_archives/v1-voiced-r11e-no-anim
INS_FILE = os.environ.get("INS_FILE", "tools/patches/tools_story.js")   # r15 variants (VARIANTS.md); r14 = tools_ins.js, wheel = tools_wheel.js
INS_SHIFT = round(INS_G * (1 - INS_S), 4)     # 4.5 s
END = round(END_A + INS_SHIFT, 4)             # 63.5
H = END
r = lambda k: tk(k) - D            # root time of v5h2 beat k

SRC_NB = "../../hp-jillian-message/assets/neckbrace-full.m4a"
SRC_V1 = "assets/teaser-audio.m4a"   # v1's bed: ad audio 0-46.9 + Neck Brace

# ---------------- VO (root times). [id, file, start, caption, caption-n (>=13 = gold "humanly possible")] ----------------
VO_A = json.load(open("tools/vo-a.json"))   # the history lines, placed against engine A's scenes (see tools/place_vo.py)
VO_B = [   # r4: v1's ending (f1420 pills, f1540 row, f1550 rays, f1640 implode, f1652 card)
    ["vo-07", "vo-07", 45.4, "Now we're in the age of AI.", 0],   # r14: starts on the chip (was f1420 over the dots)   # Fish; the four dots' capsules talk with THIS clip (VOENV)
    ["vo-n2a", "vo-n2a", 47.55, "But it was never really about the tool.", 0],          # r11 Fish n2_t3 (fish-v1v-r11), split at its pause
    ["vo-n2b", "vo-n2b", 49.45, "It was always about what humans do with it.", 0],     # the pills talk both halves   # r11 Fish n2_t3 (fish-v1v-r11), the pills talk it
    ["vo-g07b", "vo-real-l07b", 51.95, "Every week, we sit down with someone who reached what they thought was out of reach.", 0],   # r15: REAL Jillian kept (Aidan: variations minus the VO change); "every episode" clone ready = vo-fish-ep   # REAL Jillian (L07-b t3), over the rays / endless stream, ends before the implode (54.67)
    ["vo-l01", "vo-real-l01", 55.07 + INS_SHIFT, "With AI, more is now humanly possible.", 13],   # REAL Jillian (L01 t3) as the burn card opens (f1652)
]

def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)

def flow_bed(out="tools/_work/bed-flow.wav", sr=48000, NB_OFF=103.7, JOIN=INS_X):
    """r11c (Aidan: the music cut during the new line, "let it flow"): no splice. v1's bed straight to JOIN, then the SAME song
    keeps playing from Neck Brace itself (teaser t = NB t - 103.7, corr 0.998), its level following v1's own gain shape:
    held at the pad level through the new line, then v1's swell / settle / fade moved INS_SHIFT later with the ending."""
    import numpy as np
    def rd(f, ss=0, t=None):
        a = ["ffmpeg", "-v", "error", "-ss", str(ss)] + (["-t", str(t)] if t else []) + ["-i", f, "-ac", "2", "-ar", str(sr), "-f", "f32le", "-"]
        return np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.float32).reshape(-1, 2)
    A = rd(SRC_V1); N = int(END * sr) + sr // 10
    B = rd(SRC_NB, NB_OFF, END + 1)[:N]                      # B[k] = song at teaser time k/sr
    win = sr // 20
    def rms(x):
        m = len(x) // win; return np.sqrt((x[:m * win] ** 2).mean(axis=1).reshape(m, win).mean(axis=1) + 1e-12)
    ra, rb = rms(A), rms(B[:len(A)])
    gw = ra / rb                                              # v1's gain on the song, per 50 ms (teaser time)
    gw = np.convolve(gw, np.ones(5) / 5, "same")
    tg = (np.arange(len(gw)) + 0.5) * win / sr
    t = np.arange(N) / sr
    src = np.where(t < JOIN, t, np.where(t < JOIN + INS_SHIFT, JOIN, t - INS_SHIFT))   # which v1 moment's level to use
    g = np.interp(src, tg, gw, right=0.0)
    flow = B * g[:, None]
    a = np.zeros_like(flow); a[:len(A)] = A[:N]
    x = np.clip((t - (JOIN - 0.06)) / 0.12, 0, 1)[:, None]    # 120 ms crossfade, same song on both sides
    o = a * (1 - x) + flow * x
    o[t >= END] = 0
    import wave
    w = wave.open(out, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(o[:int(END * sr)], -1, 1) * 32767).astype("<i2").tobytes()); w.close()
    return out

def build_bed(vo):
    # r4: v1's own bed for the whole piece (ChatGPT ad audio + Neck Brace, with its own fade)
    # r11c: the continuous flow bed (flow_bed) replaces r11's stretched-pad splice
    parts = ["[0:a]volume=-1dB[p0]"]
    n = 1
    terms = [f"clip(min((t-{s-0.15:.3f})/0.15,({s+d+0.35:.3f}-t)/0.35),0,1)" for _, _, s, d, _, _ in vo]
    e = terms[0]
    for x in terms[1:]: e = f"max({e},{x})"
    open("tools/duck-expr.txt", "w").write(e)
    fc = ";".join(parts) + ";" + "[p0]" + f"concat=n={n}:v=0:a=1,volume='1-0.553*({e})':eval=frame,atrim=0:{END}[o]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", flow_bed(), "-filter_complex", fc, "-map", "[o]", "-c:a", "aac", "-b:a", "192k", "assets/audio/bed-ducked.m4a"], check=True)

def vo_env(f, fps=30):
    """RMS envelope of a VO clip at fps (drives the four dots' capsules, like v1's VOENV)"""
    import array
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "6000", "-f", "s16le", "-"], capture_output=True).stdout
    smp, n, env = array.array("h", raw), 6000 // fps, []
    for i in range(0, len(smp), n):
        w = smp[i:i + n]; env.append((sum(x * x for x in w) / max(1, len(w))) ** 0.5)
    pk = max(env) or 1
    return [round(min(1, 0.78 * (e / pk) ** 0.8), 2) for e in env]

def write_sync(rows):
    """_review/CAPTION-SYNC.md: spoken time vs caption reveal for every word; the first 30 fps frame at/after the reveal is
    where the word appears (captions run on the exact frame time, not the 18 fps held clock)"""
    import math
    out = ["# v1-voiced caption sync (r8)", "", "Spoken = clip start + Scribe word start (on the placed, trimmed clip). Reveal = spoken - 20 ms (uppit lead).",
           "Shown = first 30 fps frame at/after the reveal. Delta = shown - spoken. Pass = |delta| <= 33 ms (1 frame).", "",
           "| line | word | spoken | reveal | shown (30fps) | delta ms | pass |", "|---|---|---|---|---|---|---|"]
    worst = 0
    for vid, w, sp, rv in rows:
        sh = math.ceil(rv * 30 - 1e-6) / 30; dl = round((sh - sp) * 1000); worst = max(worst, abs(dl))
        out.append(f"| {vid} | {w} | {sp:.3f} | {rv:.3f} | {sh:.3f} | {dl:+d} | {'yes' if abs(dl) <= 33 else 'NO'} |")
    out.insert(4, f"Words: {len(rows)}. Worst |delta|: {worst} ms.")
    open("_review/CAPTION-SYNC.md", "w").write("\n".join(out) + "\n")
    print("caption sync: words", len(rows), "worst ms", worst)

def script_of(html):
    i = html.index("window.__timelines = window.__timelines || {};")
    j = html.index("</script>", i)
    return html[i:j]

def sub(s, old, new, count=1):
    if old not in s: raise SystemExit(f"patch anchor not found: {old[:80]!r}")
    return s.replace(old, new, count)

def patch_b(s):
    s = sub(s, 'document.getElementById("v5")', 'document.getElementById("v1v")')
    s = sub(s, 'root.querySelector("canvas.out")', 'root.querySelector("canvas.outB")')
    s = sub(s, 'root.querySelector("canvas.ui")', 'root.querySelector("canvas.uiB")')
    s = sub(s, "const VO = [", "let VO = [")
    s = sub(s, "const ex = IN(seg(t, t0 + d + 0.1, 0.3))", "const nx = VO.reduce((m, v) => (v[1] > t0 + 0.01 && v[1] < m ? v[1] : m), 1e9), ex = IN(seg(t, Math.min(t0 + d + 0.1, nx - 0.3), 0.28))")   # r5: a caption clears before the next one
    # r6 (Aidan: "weird purple hue on the white screen"): caption scrim = the SAME colour as the frame's ground (cream on cream,
    # maroon on maroon; it only softens art under it), type in the opposite colour; switches with every invert
    s = sub(s, "ink = S.ground === CR && !S.card ? OX : CR", "ink = S.ground[1] > 0.5 && !S.card ? OX : CR")
    s = sub(s, "if (!S.card) { const a = 0.8 * (1 - ex) * UPPIT(seg(t, t0 - 0.05, 0.4)), gc = S.ground,", "if (!S.card) { const a = 0.82 * (1 - ex) * UPPIT(seg(t, t0 - 0.05, 0.4)), gc = S.ground[1] > 0.5 ? CR : OX,")
    # r8 (Aidan: "captions aligning perfectly with what the voice is saying"): every word reveals at ITS spoken start
    # (Scribe on the placed clip, tools/words.json), WL = 20 ms lead; the caption clears 0.3 s after the last word ends
    s = sub(s, "for (const [n, t0, d, txt] of VO) {", "for (const [n, t0, d, txt, wt] of VO) {")
    s = sub(s, "const u = UPPIT(seg(t, t0 + per * i * 0.85 - 0.06, 0.6)) * (1 - ex)", "const u = UPPIT(seg(t, wt ? t0 + wt[0][i] - 0.02 : t0 + per * i * 0.85 - 0.06, 0.6)) * (1 - ex)")
    s = sub(s, "Math.min(t0 + d + 0.1, nx - 0.3)", "Math.min(wt ? t0 + wt[1] + 0.3 : t0 + d + 0.1, nx - 0.3)")
    s = sub(s, "const a = 0.82 * (1 - ex) * UPPIT(seg(t, t0 - 0.05, 0.4))", "const a = 0.82 * (1 - ex) * UPPIT(seg(t, (wt ? t0 + wt[0][0] : t0) - 0.12, 0.4))")
    s = sub(s, 'LOGO.onload = () => draw(last);','LOGO.onload = () => window.__ROOTREDRAW && window.__ROOTREDRAW();')
    s = sub(s, "function draw(t) {", "function draw(t, tc) {")
    s = sub(s, "captions(t, S0);\n          if (S0.card != null) endCard(to);", "if (S0.card != null) endCard(to);\n          captions(tc == null ? t : tc, S0);   /* v1-voiced: the last line (REAL L01) reads under the logo */")
    s = sub(s, "let CT = 0;", "let CT = 0; let BIRTH_T = -1; const BIRTH = () => (BIRTH_T < 0 ? 1 : OUT(seg(CT, BIRTH_T, 0.3)));")
    s = sub(s, "* (1 - 0.45 * wind);", "* (1 - 0.45 * wind) * BIRTH();")
    # ---- r3: the AI section = four talking dots + examples that morph out of them (tools/patches/ai.js); the shop in cream ----
    s = sub(s, "        function state(t) {", f"        const VOE07 = {json.dumps(vo_env('assets/vo-07.m4a'))}, VO07_T0 = {VO_B[0][2] + D:.3f};\n" + open("tools/patches/ai.js").read() + "        function state(t) {")
    s = sub(s, "texts: [], card: null };\n          if (t < T_H)", "texts: [], card: null };\n          if (CT >= AI0 && CT < C3E) { aiState(t, S); return S; }\n          if (t < T_H)")
    s = sub(s, "if (S.caps && S.caps.length) { g.fillStyle = css(GD);", "if (S.caps && S.caps.length) { g.fillStyle = css(S.capCol || GD);")
    s = sub(s, "const zin = OUT(seg(t, T_BAKER, 0.55)),", "const zin = 1,")
    s = sub(s, "lc.forEach(([x, y]) => S.acc.push(", "lc.forEach(([x, y]) => S.dots.push(")
    s = sub(s, "0.3 * Math.sin(a * 4 + q.i)).forEach((d) => S.acc.push(d));", "0.3 * Math.sin(a * 4 + q.i)).forEach((d) => S.dots.push(d));")
    s = sub(s, '"POP. 2,000", ax, ay, 26, lab, "cap", GD, 0]', '"POP. 2,000", ax, ay, 26, lab, "cap", CR, 0]')
    s = sub(s, "const lab = OUT(seg(t, T_BAKER + 0.4, 0.5)) * (1 - seg(t, T_PULLG, 0.3));",
            'const lab = 1 - seg(t, T_PULLG, 0.3);   /* r3: the shop arrives built out of the chat */\n'
            '          if (lab > 0 && zb > 0.3) { const [ox, oy] = cam([740, 425, 0]); S.texts.push(["OPEN", ox, oy, 30 * zb, lab, "cap", CR, 0]); }')
    # the ending line is REAL L01 ("With AI, more is now humanly possible."): the gold words follow n >= 13 already
    i = s.index("const tl = gsap.timeline({ paused: true });")
    j = s.index("window.__p2probe")
    j = s.index("\n", j)
    qdef = s[s.index("const STEP_FPS = 18;", i): s.index("tl.fromTo(P", i)]
    s = s[:i] + qdef + """window.__B = { draw, q, state, M,
          clearOut: () => { out.clearRect(0, 0, W, H); ui.clearRect(0, 0, W, H); },
          caps: (t, ground, card) => { ui.clearRect(0, 0, W, H); captions(t, { ground, card: card ? 1 : null }); },
          setVO: (v) => { VO = v; }, setBirth: (x) => { BIRTH_T = x; }, setCT: (x) => { CT = x; },
          person, cells, horseRig, xfPrims, galleon, shipPose, seaCrest, seaL, swellY, quad, limb, walkLegs, iconDots,
          surfTone: (a) => toneMap("surf", SCW, SCH, (g) => { g.scale(1 / SP12, 1 / SP12); g.translate(320, 180); drawSurface(g, a); }),
          surfL: (D, wx, wy) => { const i = Math.floor((wx + 320) / SP12), j = Math.floor((wy + 180) / SP12); if (i < 0 || j < 0 || i >= SCW || j >= SCH) return 0; return D[(j * SCW + i) * 4] / 255; } };""" + s[j:]
    return s

def patch_a(s, extra):
    s = sub(s, 'document.querySelector("#proof canvas." + s)', 'document.querySelector("#v1v canvas." + s)')
    s = sub(s, "const SL = state(t);", "const SL = state(t); window.__AG = SL.ground; window.__ACARD = SL.card != null;")
    # r4 ending: the pills talk with the Fish "Now we're in the age of AI." clip; the rays headline matches what Jillian says
    i = s.index("const VOENV = ["); j = s.index("];", i) + 2
    env = vo_env('assets/vo-07.m4a')   # r11: + the new line (both halves), on the pills' clock
    for v in VO_B[1:3]:
        o = round((v[2] - VO_B[0][2]) * 30); e = vo_env(f'assets/{v[1]}.m4a'); env = env + [0] * max(0, o - len(env)); env = env[:o] + e
    global PILL_ENV; PILL_ENV = env
    s = s[:i] + f"const VOENV = {json.dumps(env)};" + s[j:]
    s = sub(s, "const T_VO = 1420,", f"const T_VO = {VO_B[0][2] * 30:.3f},")   # r15: the pills talk from where vo-07 actually starts (was stuck on f1420)
    s = sub(s, "vi = Math.floor(cf - T_VO)", "vi = Math.floor((window.__RT != null ? window.__RT * 30 : cf) - T_VO)")   # r11: pills talk on the ROOT clock
    s = sub(s, "if (cf < T_ROW) for (let k = 0; k < 4; k++) {", "if (window.__INS && window.__INS(cf / 30, S)) {} else if (cf < T_ROW) for (let k = 0; k < 4; k++) {")   # r11: tools -> humans insert
    # r11d (Aidan: the rays "are more like lines than dots"): once the explosion settles, every ray is round dots (no smear)
    s = sub(s, "S.streaks.push([[x, y, r], [px, py], Math.max(2, Math.min(40, 150 / r))]);",
            "if (fm > 0 && fm < 0.999) { const q = endDot(c, j, cf - 0.8), rr = Math.min(r, 4.6), L = Math.hypot(q[0] - x, q[1] - y), m = Math.min(1, rr * 4 / (L || 1)); (S.ddots = S.ddots || []).push([x, y, rr, fm, x + (q[0] - x) * m, y + (q[1] - y) * m, L]); } else if (cf >= T_EXP + 16) (S.ddots = S.ddots || []).push([x, y, fm > 0 ? r : Math.max(3.4, r * 1.05), fm || 0]); else S.streaks.push([[x, y, r], [px, py], Math.max(2, Math.min(40, 150 / r))]);")
    s = sub(s, "S.soft = 2.2 * E_COL(seg(cf, T_EXP + 10, 16))", "S.soft = 0.6 * E_COL(seg(cf, T_EXP + 10, 16))")
    # r11e (Aidan: "add that blur to add that depth on the dots at the very end"): the ray dots get depth of field. They grow
    # toward the frame edge (closer to camera), so the big near dots blur the most, the small far ones near the centre stay crisp
    s = sub(s, "          for (let [[x, y, r], [px, py], cap] of S.streaks) {",
            "          if (S.ddots && S.ddots.length) { const BANDS = [0, 2, 4, 6.5, 10], bk = BANDS.map(() => []);\n"
            "            for (const d of S.ddots) { const z = Math.min(1, Math.hypot(d[0] - 960, (d[1] - 540) * 1.7) / 1050), fm = d[3] || 0, b = Math.max(10 * z * z * (1 - fm), d[6] ? Math.min(6, d[6] * 0.09) : 0); if (!d[6]) d[2] = lerp(2.6 + 10 * Math.pow(z, 1.6), d[2], fm); let i = 0; while (i + 1 < BANDS.length && b > (BANDS[i] + BANDS[i + 1]) / 2) i++; bk[i].push(d); }\n"
            "            bk.forEach((L, i) => { if (!L.length) return; bg.filter = BANDS[i] ? `blur(${BANDS[i]}px)` : \"none\"; bg.globalAlpha = 1 - 0.05 * i; bg.beginPath();\n"
            "              for (const [x, y, r] of L) { const [nx, ny, nr] = boil(x, y, t); bg.moveTo(x + nx + r * nr, y + ny); bg.arc(x + nx, y + ny, r * nr, 0, 6.2832); } bg.fill();\n"
            "              bg.lineCap = \"round\"; let lw = 0, n = 0; bg.beginPath(); for (const [x, y, r, , px, py] of L) if (px != null) { lw += r; n++; bg.moveTo(px, py); bg.lineTo(x + 0.01, y); } if (n) { bg.lineWidth = 2 * lw / n; bg.stroke(); } });\n"
            "            bg.filter = \"none\"; bg.globalAlpha = 1; }\n"
            "          for (let [[x, y, r], [px, py], cap] of S.streaks) {")
    # r13 (Aidan: "the dots floating around form the Humanly Possible logo: HP in the middle, then it shifts over and the
    # Humanly Possible text pops up"): the implode is replaced by a FORMATION. Every ray dot flies to a spot on the HP mark
    # (tools/mark-dots.json, the mark sampled at a 9 px pitch, 330 px tall, centred); the burn opens behind it; the dot mark
    # turns into the solid mark, glides left + shrinks into the lockup, and the wordmark pops in beside it.
    MARK = open("tools/mark-dots.json").read()
    s = sub(s, """          const imp = E_IMP(seg(cf, T_IMP + 2 * (1 - k / ENK), 11));
          if (imp > 0) { const dx = x - 960, dy = y - 540, sw = 1.1 * imp * (upper ? 1 : -1), cs = Math.cos(sw), sn = Math.sin(sw), m = 1 - imp;   /* swirl in */
            x = 960 + (dx * cs - dy * sn) * m; y = 540 + (dx * sn + dy * cs) * m; r *= 1 - 0.9 * Math.sqrt(imp); }
          return [x, y, r];""",
    """          const tg = cf < T_IMP ? null : markPt(c * ENJ + j, cf), fm = tg ? E_FORM(seg(cf, T_IMP + 11 * (1 - tg[3]) + 2 * (((c * 37 + j * 11) % 17) / 17), 16)) : 0;
          if (fm > 0) { const [tx, ty, tr] = tg, cx2 = lerp(x, tx, 0.75), cy2 = 1080 + 260;   /* r13b: swoop down under the frame, then up into place */
            const v = 1 - fm; x = v * v * x + 2 * v * fm * cx2 + fm * fm * tx; y = v * v * y + 2 * v * fm * cy2 + fm * fm * ty; r = lerp(r, tr, fm); }
          return [x, y, r, fm];""")
    s = sub(s, "        function ending(cf, S) {", """        /* r13 the HP mark in dots: MARK_N targets (u, v in 0..1 of the mark box); every ray dot gets one, paired by angle so
           nothing crosses; the mark box glides from the centre (330 px) to its lockup spot (128 px) */
        const MARK_D = %s, E_FORM = bz(0.45, 0, 0.2, 1), T_STEM = 1689, STEM_X = 485.6, STEM_Y = 786, STEM_D = 123.5, T_MKSOL = 1705, T_MKSH = 1677, T_MKTXT = 1711, MK_H0 = 330, MK_H1 = 128.4, MK_X1 = 599.6, LK = [510, 442.4, 900, 195.1];
        const markBox = (cf) => { const g = GLIDE(seg(cf, T_MKSH + 6.5, 22)), h = lerp(MK_H0, MK_H1, g); return [lerp(960, MK_X1, g), 540, h]; };   /* the solid mark lands where the last dots land */
        let MARK_A = null;
        function markPt(i, cf) {
          if (!MARK_A) {
            const ds = [];
            for (let c = 0; c < ENC; c++) for (let j = 0; j < ENJ; j++) { const p = endDot(c, j, T_IMP - 0.01); ds.push([c * ENJ + j, p[0] + 0.001 * p[1]]); }
            ds.sort((a, b) => a[1] - b[1]);
            const ts = MARK_D.map((m, k) => [k, m[0] * 1920 + 0.001 * m[1]]).sort((a, b) => a[1] - b[1]);
            MARK_A = new Array(ds.length); ds.forEach(([id], rnk) => { MARK_A[id] = ts[Math.floor(rnk * ts.length / ds.length)][0]; });
          }
          const [u, v] = MARK_D[MARK_A[i]], sd = 3.5 * u + 1.5 * v + 1.5 * (((i * 29) %% 13) / 13), g = GLIDE(seg(cf, T_MKSH + sd, 22)), h = lerp(MK_H0, MK_H1, g);   /* r13i: every dot drifts over on its own beat */
          const cx = lerp(960, MK_X1, g), cy = 540 - 18 * Math.sin(Math.PI * g) * (0.8 + 0.2 * v);
          return [cx + (u - 0.5) * h * 0.87654, cy + (v - 0.5) * h, 9 * 0.44 * h / MK_H0, v];
        }
        function ending(cf, S) {""" % MARK)
    s = sub(s, "        function ending(cf, S) {", """        /* r16: the tools insert explodes its scene straight into the depth rays (no pills, no streak stage) */
        window.__END = { T_EXP, ENC, ENJ,
          ray: (c, j, cf) => { const up = j < ENJ / 2, a = up ? c : ENC + c, k = up ? ENJ / 2 - 1 - j : j - ENJ / 2, ft = cf - T_EXP - 6, flow = ft > 0 ? 0.42 * (ft - 9 + 9 * Math.exp(-ft / 9)) : 0; return rayPt(a, (k + flow) % ENK, cf); },
          e: (j, cf) => { const ofn = Math.abs((j - (ENJ - 1) / 2) * (1080 / ENJ) * 1.02) / 551; return E_EXP(seg(cf, T_EXP + 3 * (1 - ofn), 13)); },
          soft: (cf) => 0.6 * E_COL(seg(cf, T_EXP + 10, 16)) };
        function ending(cf, S) {""")
    s = sub(s, "          if (cf < T_IMP + 13) for (let c = 0; c < ENC; c++) for (let j = 0; j < ENJ; j++) {\n            const [x, y, r] = endDot(c, j, cf);",
               "          if (cf < T_CARD) for (let c = 0; c < ENC; c++) for (let j = 0; j < ENJ; j++) {\n            const [x, y, r, fm] = endDot(c, j, cf);")
    s = sub(s, "          if (cf >= T_IMP + 10 && cf < T_CARD) S.dots.push([960, 540, 22 * OUT(seg(cf, T_IMP + 10, 3)) + wob((cf - T_IMP - 13) / 30, 6, 0.27, 0.3)]);\n", "")
    s = sub(s, 'const LOGO = new Image(); LOGO.onload = () => draw(last); LOGO.src = "assets/logo/hp-horizontal-cream.svg";',
               'const LOGO = new Image(); LOGO.onload = () => draw(last); LOGO.src = "assets/logo/hp-horizontal-cream.svg";\n'
               '        const MKI = new Image(); MKI.onload = () => draw(last); MKI.src = "assets/logo/hp-mark-cream.svg";\n'
               '        const WH1 = new Image(); WH1.onload = () => draw(last); WH1.src = "assets/logo/hp-word-humanly.svg";\n'
               '        const WH2 = new Image(); WH2.onload = () => draw(last); WH2.src = "assets/logo/hp-word-possible.svg";')
    s = sub(s, """            if (LOGO.complete && LOGO.naturalWidth) {
              const u = bz(0.23, 1, 0.32, 1)(seg(cc, T_CARD + 4, 21)), lw = 620, lh = lw * LOGO.naturalHeight / LOGO.naturalWidth;
              out.globalAlpha = u; out.filter = `blur(${(6 * (1 - u)).toFixed(2)}px)`; out.drawImage(LOGO, 960 - lw / 2, 540 - lh / 2 + 18 * (1 - u), lw, lh); out.filter = "none"; out.globalAlpha = 1;
            }""",
    """            /* r13: the dot mark finishes forming over the burn, turns solid, glides left; the wordmark pops in beside it */
            const sol = GLIDE(seg(cc, T_MKSOL, 9)), [mx, my, mh] = markBox(cc);
            if (sol < 1) { out.globalAlpha = 1 - sol; out.fillStyle = css(CR); out.beginPath();
              const mb = [];
              for (let c = 0; c < ENC; c++) for (let j = 0; j < ENJ; j++) { const [x, y, r, fm] = endDot(c, j, cc), z = Math.min(1, Math.hypot(x - 960, (y - 540) * 1.7) / 1050), rr = lerp(2.6 + 10 * Math.pow(z, 1.6), r, fm);
                if (fm < 0.999 || (cc > T_MKSH && cc < T_MKSH + 34)) { const q = endDot(c, j, cc - 0.7); let px = q[0], py = q[1]; const L = Math.hypot(px - x, py - y), mx = rr * 4; if (L > 1.5) { if (L > mx) { px = x + (px - x) * mx / L; py = y + (py - y) * mx / L; } mb.push([x, y, px, py, rr, L]); continue; } }   /* still flying: motion-blurred */
                out.moveTo(x + rr, y); out.arc(x, y, rr, 0, 6.2832); }
              out.fill();
              out.strokeStyle = css(CR); out.lineCap = "round"; [[0, 2.5], [1, 4.5], [2, 6]].forEach(([bi, bl]) => { let lw = 0, n = 0; out.beginPath(); for (const [x, y, px, py, rr, L] of mb) { if ((L < 25 ? 0 : L < 60 ? 1 : 2) !== bi) continue; lw += rr; n++; out.moveTo(px, py); out.lineTo(x + 0.01, y); } if (n) { out.filter = `blur(${bl}px)`; out.lineWidth = 2 * lw / n; out.stroke(); } }); out.filter = "none";   /* blur grows with speed */
              out.globalAlpha = 1; }
            if (sol > 0 && MKI.complete && MKI.naturalWidth) { out.globalAlpha = sol; out.drawImage(MKI, mx - mh * 0.87654 / 2, my - mh / 2, mh * 0.87654, mh); out.globalAlpha = 1; }   /* r13g: no stem drop, the full mark from the start */
            [WH1, WH2].forEach((im, i) => { if (!im.complete || !im.naturalWidth) return;   /* Uppit: per word, blur 6 px + 0.3 em rise, 0.7 s, 40 ms stagger */
              const u = bz(0.23, 1, 0.32, 1)(seg(cc, T_MKTXT + i * 1.2, 21)); if (u <= 0) return;
              out.globalAlpha = u; out.filter = `blur(${(6 * (1 - u)).toFixed(2)}px)`; out.drawImage(im, LK[0], LK[1] + 19 * (1 - u), LK[2], LK[3]); out.filter = "none"; out.globalAlpha = 1; });""")
    # r13h (Aidan: "Studio is very glitchy during that end part"): perf. A zero-length shutter still drew every frame NSUB (5)
    # times; draw once instead. The motion-blurred strokes are batched into one path per blur band (a canvas blur filter per
    # stroke was ~800 filter passes a frame).
    s = sub(s, """            layers(t - SHUT * (flip || glf ? 0 : mk ? (t - SH() >= T_SPIN + 0.3 ? 0 : 0.15) : sf) * k / (NSUB - 1));
            out.globalAlpha = 1 / (k + 1); out.drawImage(subc, 0, 0);   /* running average of the sub-frames */""",
    """            const shm = flip || glf ? 0 : mk ? (t - SH() >= T_SPIN + 0.3 ? 0 : 0.15) : sf;
            layers(t - SHUT * shm * k / (NSUB - 1));
            out.globalAlpha = 1 / (k + 1); out.drawImage(subc, 0, 0);   /* running average of the sub-frames */
            if (shm === 0) break;   /* r13h: no shutter = one sample is the frame */""")
    s = sub(s, 'const words = ["New", "stories", "every", "single", "week."]', 'const words = ["Out", "of", "reach,", "until", "now"]')
    s = sub(s, 'out.fillStyle = i >= 2 ? "#FFC145" : css(CR);', 'out.fillStyle = i >= 3 ? "#FFC145" : css(CR);')
    i = s.index("const tl = gsap.timeline({ paused: true });")
    j = s.index('window.__timelines["hp-cg-proof"] = tl;') + len('window.__timelines["hp-cg-proof"] = tl;')
    s = s[:i] + "window.__A = { draw, state, SH, LT, LAND };" + s[j:]
    for p in extra:
        if "start" in p:
            i = s.index(p["start"]); j = s.index(p["end"], i)
            s = s[:i] + p["new"] + s[j:]
        else: s = sub(s, p["old"], p["new"])
    return s

def main():
    A = open("tools/srcA.html").read(); B = open("tools/srcB.html").read()
    pa = json.load(open("tools/patchA.json")) if __import__("os").path.exists("tools/patchA.json") else []
    for p in pa:
        if "file" in p: p["new"] = open("tools/" + p["file"]).read()
    sa = patch_a(script_of(A), pa)
    sb = patch_b(script_of(B))
    vo = []
    for vid, f, s, cap, n in VO_A + VO_B:
        vo.append([vid, f, round(s, 3), round(dur(f"assets/{f}.m4a"), 2), cap, n])
    build_bed(vo)
    # r5: no periods; r8: each caption carries its words' spoken starts (from Scribe on the placed clip) + its last word's end
    WJ = json.load(open("tools/words.json")) if os.path.exists("tools/words.json") else {}
    caps, sync = [], []
    for vid, f, s0, d, cap, n in vo:
        txt = cap.replace(".", ""); ws = WJ.get(f)
        if ws and len(ws) == len(txt.split(" ")):
            caps.append([n, s0, d, txt, [[w[1] for w in ws], ws[-1][2]]])
            for (w, a, b), cw in zip(ws, txt.split(" ")): sync.append((vid, cw, round(s0 + a, 3), round(s0 + a - 0.02, 3)))
        else:
            print("WARN caption/word mismatch", vid, txt, ws and [w[0] for w in ws]); caps.append([n, s0, d, txt])
    write_sync(sync)
    audio = "\n".join(f'      <audio id="{vid}" src="assets/{f}.m4a" data-start="{s}" data-duration="{d}" data-track-index="{3 + i % 2}" data-volume="1"></audio>' for i, (vid, f, s, d, cap, n) in enumerate(vo))
    html = f"""<!DOCTYPE html>
<!--
  HP teaser PACK 2 · v1-voiced: the ORIGINAL v1 dot teaser (hp-teaser-cg-proof) with Jillian's voice and people in it,
  then v5-hybrid-v2's AI section (the four talking dots, everyday AI, the globe -> the Humanly Possible logo).
  GENERATED by tools/build.py (edit tools/*, re-run; do not hand-edit). Cue sheet: _review/CUE-SHEET.md.
  Root time r: r < {H} = engine A (v1, its own clocks + tools/patchA.js human additions); r >= {H} = engine B (v5h2) at r + {D}.
  VOICE: Jillian only (Fish Audio clone for the story; her REAL recordings for the last two lines).
  Temp music: v1's bed (ChatGPT ad audio, uncleared) then Ratatat "Neck Brace" (uncleared), ducked 7 dB under every line.
-->
<html>
  <head>
    <meta charset="utf-8">
    <style>
      html, body {{ margin: 0; background: #000; }}
      #v1v {{ position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: hidden; background: #FFF0E6; }}
      #v1v canvas {{ position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }}
      #v1v canvas.bg, #v1v canvas.gl, #v1v canvas.fx {{ display: none; }}
      #v1v canvas.outB {{ z-index: 3; }}
      #v1v canvas.uiB {{ z-index: 5; }}
      #v1v .fontwarm {{ position: absolute; left: -9999px; font-family: "Bricolage Grotesque"; font-weight: 800; }}
      #v1v .fontwarm2 {{ position: absolute; left: -9999px; font-family: "Noto Sans JP", sans-serif; font-weight: 700; }}
    </style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Noto+Sans+JP:wght@700&display=swap">
  </head>
  <body>
    <div id="v1v" data-composition-id="hp-teaser-v1v" data-start="0" data-duration="{END}" data-width="1920" data-height="1080">
      <span class="fontwarm">Every era, then you. Out of reach, until now.</span>
      <span class="fontwarm2">げんき？</span>
      <!-- temp music: v1 bed 0-{H} (ChatGPT ad audio + Neck Brace, uncleared), then Neck Brace bars on its grid; ducked 7 dB under every line -->
      <audio id="bed" src="assets/audio/bed-ducked.m4a" data-start="0" data-duration="{END}" data-track-index="2" data-volume="1"></audio>
{audio}
      <canvas class="bg"></canvas>
      <canvas class="gl"></canvas>
      <canvas class="fx"></canvas>
      <canvas class="out"></canvas>
      <canvas class="outB"></canvas>
      <canvas class="uiB"></canvas>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      {sb}
    </script>
    <script>
      {sa}
    </script>
    <script>
{open(INS_FILE).read().replace("__IX__", str(INS_X)).replace("__IG__", str(INS_G)).replace("__IS__", str(INS_S)).replace("__VAR__", os.environ.get("VAR", "workshop")).replace("__STICK__", os.environ.get("STICK", "0")).replace("__SRC__", os.environ.get("SRC", "tool")).replace("__EXIT__", os.environ.get("EXIT", "swirl")).replace("__PC__", os.environ.get("PC", "11")).replace("__TVO__", f"{VO_B[0][2] * 30:.3f}").replace("__VOENV__", json.dumps(PILL_ENV)) if TOOLS_ANIM else "/* r11b: tools insert off */"}
    </script>
    <script>
      (function () {{
        const H = {H}, D = {D}, END = {END}, IX = {INS_X}, IG = {INS_G}, IS = {INS_S};
        const te = (t) => (t < IX ? t : t < IX + IG ? IX + (t - IX) * IS : t - IG * (1 - IS));   /* r11: engine-A clock with the hold */
        const A = window.__A, B = window.__B;
        B.setVO({json.dumps(caps)});
        B.setBirth(H + D);
        let last = 0;
        function rootDraw(t, tc) {{
          last = t;
          if (t < H) {{ window.__RT = t; A.draw(te(t)); B.clearOut(); B.caps(tc == null ? t : tc, window.__AG || [1, 0.94, 0.9], window.__ACARD); }}
          else B.draw(t + D, t);
        }}
        window.__ROOTREDRAW = () => rootDraw(last);
        const q = (t) => (t < H ? Math.floor(t * 18 + 1e-6) / 18 : B.q(t + D) - D);
        const tl = gsap.timeline({{ paused: true }});
        const P = {{ t: 0 }};
        tl.fromTo(P, {{ t: 0 }}, {{ t: END, duration: END, ease: "none", onUpdate: () => rootDraw(q(P.t), P.t) }}, 0);
        tl.set({{}}, {{}}, END);
        rootDraw(0);
        window.__timelines["hp-teaser-v1v"] = tl;
        window.__v1v = {{ rootDraw, A, B, H, D, END }};
      }})();
    </script>
  </body>
</html>
"""
    open("index.html", "w").write(html)
    json.dump({"H": H, "D": D, "END": END, "VO": vo}, open("tools/cue.json", "w"), indent=1)
    print("END", END, "D", D)
    for v in vo: print(v)

if __name__ == "__main__":
    main()
