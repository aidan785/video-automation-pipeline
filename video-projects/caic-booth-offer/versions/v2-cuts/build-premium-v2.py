#!/usr/bin/env python3
"""Builds index.html: the CAIC booth offer in the style of aiautomationsociety.ai/certification (Oct 2026 site).

Look (measured from the live page): near-black sky radial-gradient (#0C0E11 -> #171B1F -> #2F78A8), three mountain
ridges with a pine treeline (drawn here, deterministic), Montserrat 400 headlines at -0.045em, Roboto Mono uppercase
labels at 0.14em, translucent pill tags with a cyan dot, the tilted dark "plate" credential card (160deg #111215 ->
#0A0B0D, 1px rgba(255,255,255,.12), radius 22, cyan glow), and a white primary pill for the CTA.
Nate sits in a large plate on the right; every beat lives in the left column.   usage: python3 build-premium.py
"""
import json, math, random

D = 58.04
W, H = 1920, 1080

# ---------------- mountains (seeded, deterministic) ----------------
def ridge(seed, base, amp, peaks, rough, width=2200, step=8):
    rnd = random.Random(seed)
    ph = [rnd.uniform(0, 6.283) for _ in range(6)]
    pts = []
    for i in range(0, width + step, step):
        x = i / width
        y = base
        for (cx, ch, cw) in peaks:                      # big shapes
            y -= ch * math.exp(-((x - cx) / cw) ** 2)
        y -= amp * (0.55 * math.sin(x * 9.1 + ph[0]) + 0.3 * math.sin(x * 23.7 + ph[1]) + 0.15 * math.sin(x * 51.3 + ph[2]))
        y -= rough * (math.sin(x * 140 + ph[3]) * 0.5 + math.sin(x * 311 + ph[4]) * 0.3)
        pts.append((i - 140, y))
    return pts

def path_from(pts, bottom=H + 40):
    d = f"M{pts[0][0]:.1f},{bottom} " + " ".join(f"L{x:.1f},{y:.1f}" for x, y in pts) + f" L{pts[-1][0]:.1f},{bottom} Z"
    return d

far = ridge(11, 925, 8, [(0.28, 150, 0.11), (0.50, 105, 0.09), (0.64, 165, 0.08), (0.86, 90, 0.12)], 2.5)
mid = ridge(23, 990, 10, [(0.12, 70, 0.10), (0.44, 50, 0.14), (0.78, 80, 0.10)], 3)
front_base = ridge(37, 1045, 8, [(0.05, 50, 0.08), (0.95, 60, 0.08)], 2)

# pine trees along the front ridge (dense at the edges, thin in the middle like the site)
rnd = random.Random(5)
trees = []
for x, y in front_base[::2]:
    xn = (x + 140) / 2200
    edge = min(1.0, (abs(xn - 0.5) / 0.5) ** 1.6 * 1.25)
    if rnd.random() > 0.25 + 0.7 * edge:
        continue
    h = rnd.uniform(40, 90) * (0.55 + 0.9 * edge)
    w = h * rnd.uniform(0.32, 0.42)
    tiers = 4 + int(h / 30)
    poly = []
    for k in range(tiers):                              # stacked fir tiers
        t0 = k / tiers; t1 = (k + 1) / tiers
        yy0 = y - h * t0; yy1 = y - h * t1
        ww = w * (1 - t0) * 0.5 + 2
        poly.append(f"M{x - ww:.1f},{yy0 + 4:.1f} L{x:.1f},{yy1 - 6:.1f} L{x + ww:.1f},{yy0 + 4:.1f} Z")
    trees.append(" ".join(poly))

SVG = f'''<svg class="mtn" viewBox="0 0 {W} {H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f9ab5"/><stop offset=".55" stop-color="#55728f"/><stop offset="1" stop-color="#3b5670"/></linearGradient>
    <linearGradient id="gMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3f54"/><stop offset="1" stop-color="#16222e"/></linearGradient>
    <linearGradient id="gHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f78a8" stop-opacity="0"/><stop offset="1" stop-color="#2f78a8" stop-opacity=".28"/></linearGradient>
  </defs>
  <g id="mFar"><path d="{path_from(far)}" fill="url(#gFar)"/></g>
  <rect x="0" y="760" width="{W}" height="320" fill="url(#gHaze)"/>
  <g id="mMid"><path d="{path_from(mid)}" fill="url(#gMid)"/></g>
  <g id="mFront"><path d="{path_from(front_base)}" fill="#07090b"/><path d="{' '.join(trees)}" fill="#07090b"/></g>
</svg>'''

GLOBE = '<img class="globe" src="assets/ais-globe-white.png" alt="">'
DOT = '<i class="dot"></i>'
tag = lambda t: f'<div class="tag">{DOT}{t}</div>'

def plate_card(id_, rows, title=True, footer=True, cls=''):
    r = ''.join(f'<div class="prow"><div class="pl">{a}</div><div class="pv">{b}</div></div>' for a, b in rows)
    head = (f'<div class="phead"><div class="pglobe">{GLOBE}</div><div class="mono dim">AIS CERTIFIED</div></div>'
            f'<div class="ptitle">Certified<br>AI Consultant</div><div class="mono pcaic">CAIC</div>') if title else ''
    foot = f'<div class="pfoot">{DOT}AI Automation Society</div>' if footer else ''
    return f'<div class="cred {cls}" id="{id_}"><div class="sheen"></div>{head}<div class="prows">{r}</div>{foot}</div>'

CRED_ROWS = [("Earned by", "Graded portfolio and a live certification interview"), ("Result", "Certified or not. No tiers."),
             ("Valid", "24 months, with recertification"), ("Verifiable", "By anyone who checks")]

beats = [
  ("b1", 0.25, 4.5, "every company wants an AI person",
   f'{tag("The problem")}<div class="h" id="b1-h">Every company wants<br>an AI person.</div><div class="sub" id="b1-s">A lot of you already have the skills to do that job.</div>'),
  ("b2", 4.85, 4.65, "when a business asks why they should hire you",
   f'{tag("The hiring question")}<div class="h" id="b2-h">Why hire you over<br><span class="soft">the next person?</span></div><div class="sub" id="b2-s">Most people don&#8217;t have a real answer.</div>'),
  ("b3", 9.65, 5.15, "Certified AI Consultant program", plate_card("b3-cred", CRED_ROWS)),
  ("b4", 14.9, 4.4, "whether you want to work with clients",
   f'{tag("Choose your track")}<div class="tracks">'
   f'<div class="track" id="b4-t1"><div class="mono dim">Track 01 · Agency &amp; freelance</div><div class="tt">Work with clients.</div></div>'
   f'<div class="track" id="b4-t2"><div class="mono dim">Track 02 · Employed &amp; in-house</div><div class="tt">Be the AI person inside your company.</div></div>'
   f'</div><div class="mono foot" id="b4-f">+ Same curriculum, same certification.</div>'),
  ("b5", 19.45, 8.5, "run discovery against an AI",
   f'{tag("The work")}<div class="rail"><div class="rline"></div><div class="rfill" id="b5-fill"></div>'
   + ''.join(f'<div class="ritem" id="b5-i{i}"><div class="rnode"></div><div class="rnum mono">0{i + 1}</div><div><div class="rt">{t}</div><div class="rd">{d}</div></div></div>'
             for i, (t, d) in enumerate([("Run discovery", "Against an AI playing the business owner"), ("Build the system", "Design something that runs live"),
                                         ("Prove it works", "With evals"), ("Is it worth it?", "What it costs to run")])) + '</div>'),
  ("b6", 28.3, 8.2, "to get certified",
   f'{tag("To get certified")}<div class="h sm" id="b6-h">A brand-new client case.<br><span class="soft">On your own.</span></div>'
   + plate_card("b6-card", [("01", "Scope it"), ("02", "Find what&#8217;s failing in a poorly built AI system"), ("03", "Explain your reasoning")], title=False, footer=False, cls='flat')),
  ("b7", 36.75, 4.0, "live call with our team",
   f'{tag("Live certification interview")}<div class="h" id="b7-h">A live call<br>with our team.</div><div class="sub" id="b7-s">Walk us through why you made each decision.</div>'),
  ("b8", 40.85, 6.5, "when you certify",
   f'{tag("When you certify")}' + plate_card("b8-card", [("Letter", "A personal letter of recommendation from Nate"), ("Reference", "AIS as a reference clients and employers can call")], title=False, footer=False, cls='flat big')),
  ("b9", 47.45, 4.2, "our first cohort filled up",
   f'{tag("Cohort 1")}<div class="stat" id="b9-stat"><span class="num">36</span><span class="unit">hours</span></div><div class="sub" id="b9-s">Our first cohort filled up in under 36 hours.</div><div class="mono foot" id="b9-f">Cohort 2 · Waitlist open</div>'),
  ("b10", 51.6, 3.0, "join the waitlist below",
   f'<div class="cta" id="b10-cta">Join the waitlist</div><div class="mono foot" id="b10-f">Hear about it before anyone else</div>'),
  ("b11", 54.5, round(D - 54.5, 2), "hope to see you guys in there",
   plate_card("b11-cred", CRED_ROWS[:2], cls='small') + '<div class="h sm" id="b11-h">Hope to see you in there.</div>'),
]

CSS = open('assets/premium.css').read()
beat_html = '\n'.join(f'<div class="clip beat" id="{b}" data-anchor="{a}" data-start="{s}" data-duration="{d}" data-track-index="4"><div class="col">{inner}</div></div>'
                      for b, s, d, a, inner in beats)

html = f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920, height=1080">
<title>CAIC — Booth Offer (premium, certification-site style)</title>
<link href="assets/fonts/fonts.css" rel="stylesheet"><script src="assets/gsap.min.js"></script>
<style>{CSS}</style></head>
<body>
<div id="root" data-composition-id="caic-booth-offer" data-start="0" data-width="1920" data-height="1080">
  <div class="clip world" id="world" data-start="0" data-duration="{D}" data-track-index="2"><div class="sky"></div>{SVG}</div>
  <div class="natewrap"><div class="plate" id="natePlate">
    <div class="pvid"><div class="vzoom" id="vzoom"><video id="nate-video" src="assets/clip.mp4" data-start="0" data-duration="{D}" data-track-index="0" muted></video></div></div>
    <div class="sheen"></div><div class="pborder"></div>
  </div></div>
  <audio id="nate-audio" src="assets/clip.mp4" data-start="0" data-duration="{D}" data-track-index="1"></audio>
  <div class="clip chrome" id="chrome" data-start="0" data-duration="{D}" data-track-index="3">
    <div class="brand">{GLOBE}<span>AI Automation Society</span></div><div class="progress" id="prog"></div>
  </div>
{beat_html}
</div>
<script>{open('assets/premium.js').read().replace('__DUR__', str(D))}</script>
</body></html>'''
open('index.html', 'w').write(html)
print('index.html', len(html), 'bytes ·', len(trees), 'trees')
