#!/usr/bin/env python3
"""Reframe the 16:9 master into W x H (shorts 1080x1920, LinkedIn 1080x1080).
The frame is scaled 1.25x into a 1080x760 band (192 source px cropped per side) and centred. The space above/below is the
frame's own ground: the median colour of the band (content can't bleed in, so a hill or a dot touching the edge never
smears into the fill). From the burn end card on (T_BURN) the ground is a gradient, so the fill there is the band's top/bottom
edge colours averaged into 8 columns and stretched smooth. Band edges feather into the fill; light grain on the fill.
usage: python tools/aspect.py in.mp4 out.mp4 W H   (run with the hp-sampler venv python: needs numpy)
"""
import subprocess, sys
import numpy as np

IN, OUT, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
BW, BH, FPS, T_BURN = 1080, 760, 30, 59.45
Y0 = (H - BH) // 2
FT, FB = 50, 48   # feather rows top / bottom

rd = subprocess.Popen(["ffmpeg", "-v", "error", "-i", IN, "-vf", f"scale=1350:{BH}:flags=lanczos,crop={BW}:{BH}:135:0", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
wr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", IN,
                       "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
a = np.ones(BH, np.float32)
y = np.arange(BH)
a = np.minimum(a, np.minimum(y / FT, (BH - 1 - y) / FB)).clip(0, 1)
a = (a * a * (3 - 2 * a))[:, None, None]
rng = np.random.default_rng(7)
grain = [rng.normal(0, 2.2, (H, W, 1)).astype(np.float32) for _ in range(8)]

def strip8(rows):
    c = rows.reshape(rows.shape[0], 8, BW // 8, 3).mean(axis=(0, 2))           # 8 column averages
    xs = (np.arange(W) + 0.5) / W * 8 - 0.5
    return np.stack([np.interp(xs, np.arange(8), c[:, k]) for k in range(3)], -1)   # (W, 3) smooth

n = 0
while True:
    buf = rd.stdout.read(BW * BH * 3)
    if len(buf) < BW * BH * 3: break
    band = np.frombuffer(buf, np.uint8).reshape(BH, BW, 3).astype(np.float32)
    t = n / FPS
    if t < T_BURN:
        g = np.median(band[::6, ::6].reshape(-1, 3), axis=0)
        top = bot = np.broadcast_to(g, (W, 3))
    else:
        top, bot = strip8(band[:24]), strip8(band[-24:])
    fill = np.empty((H, W, 3), np.float32)
    fill[:Y0] = top; fill[Y0 + BH:] = bot
    v = np.linspace(0, 1, BH)[:, None, None]
    fill[Y0:Y0 + BH] = top[None] * (1 - v) + bot[None] * v
    fill += grain[n % 8]
    fill[Y0:Y0 + BH] = band * a + fill[Y0:Y0 + BH] * (1 - a)
    wr.stdin.write(fill.clip(0, 255).astype(np.uint8).tobytes())
    n += 1
wr.stdin.close(); wr.wait(); rd.wait()
print("frames", n, "->", OUT)
