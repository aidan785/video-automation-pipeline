# Handmade references: the Instagram reel + real Vox (2026-11-03)

Aidan's direction after the first 45 cards: the edge stripes, outline boxes and offset shadows read as AI. Wanted: real Vox depth and color, Sanji's nature grounds/glass/pixel transitions, and this reel's human-made texture and rhythm.

## Instagram reel (instagram.com/reel/DeKDmkmh_gM, 20.4 s, 24 fps, 4:3)

Frames: `references/frames/ig-reel_f*.jpg` (sampled at 4 fps; f001 = 0.0 s, f041 = 10.0 s).

**Rhythm (measured scene cuts):** bursts of one-frame flicker cuts at every section change (0.0, 2.0, 6.3, 11.9, 16.2 s), holds of 1.7 to 4.2 s between them, and runs of quick 0.3 to 0.8 s beats (9 to 11 s, 16 to 17 s). Fast, slow, fast: the flicker clusters act as punctuation, the holds let one idea breathe.

**Grounds alternate:** warm off-white paper with real tooth, then true black with film dust, then one flat saturated field (yellow, red). Each beat lives in one color world.

**Hand marks:** ink brush strokes and signature-like scribbles that write on (pressure varies, ends taper), a scribble that becomes a transition (a black brush swipe crosses the frame), letters that scatter and re-gather.

**Type:** tiny lowercase sans, typed word by word with a blinking bar cursor, against one huge word ("how") at the open. Scale contrast does the work, not boxes.

**Objects:** pixel-art cutouts (heart, coin, camera, record) arranged in a loop, spinning out with motion blur, swapped on cuts; a person as a silhouette filled with a warm orange-to-gold gradient on black (very close to the HP burn).

**What makes it human:** nothing sits on a card; every mark has irregular pressure; timing is uneven on purpose; texture is everywhere (paper, dust, grain); transitions are made of the same stuff as the content (an ink stroke, a blur smear, a flicker), not a generic wipe.

## Real Vox (KVYNwthBcgM, 1UnIDL-eHOs)

Frames: `references/frames/vox-ok_*.jpg`. (The images in `01-vox-explainer/references/` are third-party "Vox style" template thumbnails, not Vox. Don't use them as the Vox reference.)

- Grounds are real paper or full-frame archival photos and footage. Color comes from the material itself (hand-colored engravings, vintage ads, a green TV set), not from UI hues.
- Marks: red pen ellipses and underlines on newspaper clippings, yellow highlighter behind one phrase, thin yellow callout lines.
- Depth: cutout figures standing in front of giant letterforms, layered planes, slow push-ins on photos.
- Supers are plain type, a source label top-left ("Office Space | 1999"), no boxes.
- Remote interviews are shown as plain full-frame webcams.

## Translation into the FIELD family (first prototype: `cards/field/fd-aside-depth.html`)

- Torn paper with real tooth (SVG feTurbulence + diffuse lighting multiplied into the fill, displacement for the fibrous edge), layered at three depths with parallax; the brick sheet tears open onto the guest's world (nature photo gradient-mapped into deep, oxblood, brick, orange, gold, cream and racked soft).
- Content as a cream printout taped down off-level, ink multiplied into the paper. No card UI, no stripe, no outline, no offset shadow (only a soft contact lift for loose paper).
- One gold marker swipe, one orange pen ring that overshoots its start and boils at 12 fps.
- Everything pasted or drawn moves on twos (`tl.set` every 1/12 s, seek-safe). Only the camera glides.
