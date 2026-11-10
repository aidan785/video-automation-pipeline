"""Footage -> luminance sprite sheet for the dot engine (see references/footage-to-dots.md).
Run with the workspace venv that has numpy + scipy:
  raw-media/hp-sampler-refs/.venv/bin/python -I .claude/skills/dot-motion-ad/scripts/footage_to_sprite.py \
      SRC.mp4 OUT.png --w 160 --h 90 --fps 24 --frames 84 [--crop 0.82] [--track] [--texture] [--sigma 4 --k 0.9]
--track    follow the brightest subject (windowed weighted centroid) with a crop that grows 330->600px-equivalent
--texture  add a highpass layer so dark textured areas (water) show as small dots while smooth areas (mist) drop out;
           the sheet then holds FINAL tone (engine curve = return L)
"""
import argparse, subprocess, numpy as np
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--w", type=int, default=160); ap.add_argument("--h", type=int, default=90)
ap.add_argument("--fps", type=float, default=24); ap.add_argument("--frames", type=int, default=0)
ap.add_argument("--crop", type=float, default=0.82); ap.add_argument("--cols", type=int, default=8)
ap.add_argument("--sigma", type=float, default=4); ap.add_argument("--k", type=float, default=0.9)
ap.add_argument("--track", action="store_true"); ap.add_argument("--texture", action="store_true")
a = ap.parse_args()

W, H = map(int, subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", a.src],
                               capture_output=True, text=True).stdout.strip().split(","))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", a.src, "-vf", f"fps={a.fps},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32) / 255
if a.frames: f = f[:a.frames]

def resize(im, w, h):
    return ndimage.zoom(ndimage.uniform_filter(im, size=max(1, int(im.shape[1] / w))), (h / im.shape[0], w / im.shape[1]), order=1)

centres = None
if a.track:
    p = np.array([W * 0.75, H * 0.5]); cs = []
    for im in f:
        x0, x1 = int(max(0, p[0] - 70)), int(min(W, p[0] + 70)); y0, y1 = int(max(0, p[1] - 60)), int(min(H, p[1] + 45))
        win = im[y0:y1, x0:x1]; th = max(0.35, np.percentile(win, 92))
        ys, xs = np.nonzero(win >= th); wt = win[ys, xs] - th + 1e-3
        c = np.array([(xs * wt).sum() / wt.sum() + x0, (ys * wt).sum() / wt.sum() + y0])
        p = 0.6 * p + 0.4 * c; cs.append(p.copy())
    cs = np.array(cs); kern = np.ones(9) / 9
    centres = np.stack([np.convolve(np.pad(cs[:, i], 4, mode="edge"), kern, "valid") for i in range(2)], 1)

out = []
for i, im in enumerate(f):
    if centres is not None:
        u = i / max(1, len(f) - 1); cw = W * (0.386 + 0.316 * u); ch = cw * a.h / a.w
        cx = centres[i][0] - 0.14 * cw + 10; cy = centres[i][1] + 0.05 * ch
        x0 = int(np.clip(cx - cw / 2, 0, W - cw)); y0 = int(np.clip(cy - ch / 2, 0, H - ch))
        c = im[y0:y0 + int(ch), x0:x0 + int(cw)]
    else:
        cw, ch = int(W * a.crop), int(H * a.crop); x0, y0 = (W - cw) // 2, (H - ch) // 2
        c = im[y0:y0 + ch, x0:x0 + cw]
    c = resize(c, a.w, a.h)
    lc = np.clip(c + a.k * (c - ndimage.gaussian_filter(c, a.sigma)), 0, 1)
    if a.texture:
        tone = np.clip((lc - 0.2) / 0.38, 0, 1) ** 1.25
        tex = 0.55 * np.clip((c - ndimage.gaussian_filter(c, 2.6)) * 15 - 0.05, 0, 1) ** 0.75
        lc = np.maximum(tone, tex)
    out.append(lc)

fr = np.array(out); n, h, w = fr.shape; rows = -(-n // a.cols)
sheet = np.zeros((rows * h, a.cols * w), np.float32)
for i, x in enumerate(fr): sheet[(i // a.cols) * h:(i // a.cols + 1) * h, (i % a.cols) * w:(i % a.cols + 1) * w] = x
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{a.cols * w}x{rows * h}", "-i", "-", "-frames:v", "1", a.out],
               input=(sheet * 255).astype(np.uint8).tobytes(), check=True)
print(f"{a.out}: {n} frames {w}x{h}, {a.cols} cols, sheet {a.cols * w}x{rows * h}  (index: ((floor(k/{a.cols})*{h}+py)*{a.cols * w}+(k%{a.cols})*{w}+px)*4)")
