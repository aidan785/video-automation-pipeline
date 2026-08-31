#!/usr/bin/env python3
"""Bake blue-ring medallions for the crop-style headshots so every member on the
team slide gets the same look as the speaker-announcement medallions.

Recipe (sampled from nate-herk.png): 600x600, transparent outside a circle of
r=291, 9px #37BDF8 ring, inner disc #0B1A29 navy with a subtle lighter well,
person cutout (rembg) bottom-anchored inside the disc.

Run: .venv/bin/python _make-medallions.py
Out: assets/headshots/<slug>.png (overwrites the raw crops)
"""
import os
from rembg import remove
from PIL import Image, ImageDraw

DIR = os.path.dirname(os.path.abspath(__file__))
HS = os.path.join(DIR, "assets", "headshots")
SRC = os.path.join(DIR, "assets", "headshots-raw")  # originals preserved here

SLUGS = ["meghan-cox", "aidan-stanik", "mustafa-tawfiq", "dominic-ibarra"]
# tight face crops render huge at bust scale; pull them back
ZOOM = {"meghan-cox": 0.72}

S = 600            # canvas
CX = CY = S // 2
R_OUT = 291        # outer ring radius
RING_W = 9
R_IN = R_OUT - RING_W

os.makedirs(SRC, exist_ok=True)

SS = 4  # supersample factor for clean circle edges

def disc_bg():
    """navy disc with a soft lighter well (matches sampled 14,32,50 over 11,26,41)."""
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    big = Image.new("RGBA", (S * SS, S * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(big)
    # ring
    d.ellipse([(CX - R_OUT) * SS, (CY - R_OUT) * SS, (CX + R_OUT) * SS, (CY + R_OUT) * SS],
              fill=(55, 189, 248, 255))
    # inner disc
    d.ellipse([(CX - R_IN) * SS, (CY - R_IN) * SS, (CX + R_IN) * SS, (CY + R_IN) * SS],
              fill=(11, 26, 41, 255))
    big = big.resize((S, S), Image.LANCZOS)
    img.alpha_composite(big)
    # radial lighter well, centered slightly high
    well = Image.new("L", (S, S), 0)
    dw = ImageDraw.Draw(well)
    for r in range(R_IN, 0, -4):
        a = int(28 * (1 - r / R_IN))
        dw.ellipse([CX - r, CY - 40 - r, CX + r, CY - 40 + r], fill=a)
    tint = Image.new("RGBA", (S, S), (55, 120, 170, 255))
    img.paste(Image.composite(tint, img, well), (0, 0), well.point(lambda v: v))
    return img

def medallion(slug):
    raw_path = os.path.join(SRC, f"{slug}.png")
    if not os.path.exists(raw_path):
        os.rename(os.path.join(HS, f"{slug}.png"), raw_path)
    src = Image.open(raw_path).convert("RGBA")

    cut = remove(src)  # person cutout, alpha bg

    # crop to the person, then frame as a BUST like the baked medallions:
    # full-body sources keep only head + torso before scaling.
    bbox = cut.getbbox()
    cut = cut.crop(bbox)
    if cut.height > 1.35 * cut.width:  # full-body shot -> keep top (head+torso)
        cut = cut.crop((0, 0, cut.width, int(cut.width * 1.15)))

    # scale so the bust fills the disc height like nate-herk.png
    zoom = ZOOM.get(slug, 0.86)
    target_h = int(R_IN * 2 * zoom)
    scale = target_h / cut.height
    cut = cut.resize((int(cut.width * scale), target_h), Image.LANCZOS)
    # very wide busts: cap width instead so shoulders stay inside the ring
    max_w = int(R_IN * 2 * 0.94)
    if cut.width > max_w:
        scale = max_w / cut.width
        cut = cut.resize((max_w, int(cut.height * scale)), Image.LANCZOS)

    img = disc_bg()
    # bottom of the cutout sits at the chord ~78% down the disc so shoulders
    # never poke past the ring edge
    y_bottom = CY + int(R_IN * 0.96)
    x = CX - cut.width // 2
    y = y_bottom - cut.height

    # clip the cutout to the inner disc so nothing crosses the ring
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    layer.alpha_composite(cut, (x, y))
    mask = Image.new("L", (S * SS, S * SS), 0)
    ImageDraw.Draw(mask).ellipse(
        [(CX - R_IN) * SS, (CY - R_IN) * SS, (CX + R_IN) * SS, (CY + R_IN) * SS], fill=255)
    mask = mask.resize((S, S), Image.LANCZOS)
    layer.putalpha(Image.composite(layer.getchannel("A"), Image.new("L", (S, S), 0), mask))

    img.alpha_composite(layer)
    out = os.path.join(HS, f"{slug}.png")
    img.save(out)
    print(f"  {slug} -> {out}")

for slug in SLUGS:
    medallion(slug)
print("done")
