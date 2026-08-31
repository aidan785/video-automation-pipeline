#!/usr/bin/env python3
"""Crop the 6 ClickUp avatar photos out of the members-page screenshot.

Coordinates are defined in a 1567-px-wide reference space (how the screenshot
renders at 1x) and scaled to the actual file size, so a retina 2x capture
works unchanged. Output: assets/headshots/<slug>.png (square, top-center).
"""
import subprocess, sys, os, json

SRC = "/Users/aidanstanik/.claude/image-cache/13218c8d-1b6c-40cd-b677-2477b4afe53c/1.png"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "headshots")
os.makedirs(OUT, exist_ok=True)

REF_W = 1567.0
PITCH_X = 196.3   # card pitch, columns
LEFT0 = 4         # first card left edge
ROW_Y = [16, 288, 560]   # avatar top edge per row
AV_W, AV_H = 173, 202    # avatar box in the card

# slug: (col, row)
PEOPLE = {
    "junaise":        (2, 0),
    "mustafa-tawfiq": (6, 0),
    "dominic-ibarra": (7, 0),
    "aidan-stanik":   (0, 1),
    "usman-mohammed": (2, 1),
    "meghan-cox":     (6, 1),
}

probe = subprocess.run(
    ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_streams", SRC],
    capture_output=True, text=True, check=True)
st = json.loads(probe.stdout)["streams"][0]
scale = st["width"] / REF_W
print(f"screenshot {st['width']}x{st['height']}, scale {scale:.3f}")

for slug, (col, row) in PEOPLE.items():
    x = int((LEFT0 + col * PITCH_X) * scale)
    y = int(ROW_Y[row] * scale)
    w = int(AV_W * scale)
    h = int(AV_H * scale)
    # square crop from the top of the avatar box (faces sit high)
    s = min(w, h)
    dst = os.path.join(OUT, f"{slug}.png")
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", SRC,
         "-vf", f"crop={s}:{s}:{x}:{y + int(6 * scale)}", dst],
        check=True)
    print(f"  {slug}: crop {s}x{s} at ({x},{y})")

print("done")
