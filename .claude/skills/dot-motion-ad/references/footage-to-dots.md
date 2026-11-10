# Footage → dots

Realistic subjects (wave, ship, skeleton, TV clips, moon) are real video turned into a **luminance sprite sheet** (a PNG of tiled grayscale frames), loaded once into ImageData and sampled on the dot grid each frame. This is deterministic, tiny and fast.

## Loader pattern (in the engine)

```js
const SP = { d: null, n: 97 };
{ const im = new Image(); im.onload = () => { const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
  const x = c.getContext("2d"); x.drawImage(im, 0, 0); SP.d = x.getImageData(0, 0, c.width, c.height).data; draw(last); };
  im.src = "assets/ship-lum.png"; }
// frame k, cell (px,py) of a COLS-wide sheet of FW x FH frames:
const L = SP.d[((Math.floor(k / COLS) * FH + py) * (COLS * FW) + (k % COLS) * FW + px) * 4] / 255;
```

- Frame index: `k = floor((t - T0) * 24)`, clamped (or ping-ponged for loops, as with the skeleton).
- Dot radius: `PW * 0.52 * sqrt(L)` on a PW grid (area ∝ tone).
- Skip `L < ~0.035`.
- Under file:// the canvas gets tainted; that's harmless, because Studio serves over http.

## Readability rules (from "really hard to see what these are")

1. **Grid.** A 12px grid (160x90 cells) for full-frame footage. 16px plus a hard threshold reads as blobs.
2. **Continuous tone, not a threshold.** Midtones become small dots so structure shows (rock vs water vs foam).
3. **Local contrast baked in:** `c + k*(c - gaussian(c, sigma))`.
   - wave: sigma 4, k 0.9
   - ship: sigma 6, k 1.2
4. **Highlight roll-off** so foam doesn't blow out into a flat cream mass. Wave curve: `((L-.2)/.85)^1.65 * .92`.
5. **Kill bright bands that aren't the subject.** For the wave, the top 7 sky rows are faded with `c01((j-7)/5)`.
6. **Small subjects: track and crop.** The galleon was 10% of the frame.
   - Track the sails with a windowed, weighted centroid: a 140x105 window around the previous position, threshold = max(0.35, 92nd percentile), position smoothed 0.6/0.4, then a 9-tap box filter.
   - Crop a window that GROWS with the subject (330→600px of 854) so the ship stays about 1/3 of the frame, placed lower-right like the reference.
   - Verify the track by drawing boxes on sample frames before trusting it.
7. **Dark detail (the "still see the water" fix).** The sea was DARKER than the mist, so lifting levels lit up the sky instead.
   - Encode tone = `max(levels(sails/foam), 0.55 * clip(highpass(c, sigma 2.6) * 15 - 0.05)^0.75)`.
   - Ripple crests become small dots, and the smooth mist (no high frequency) drops out.
   - Bake it into the sprite; the shader-side curve is then `return L`.
8. **Edge term for dark subjects** (the black locomotive on snow): `max(curve(L), edge)` so silhouettes are outlined.
9. **Feather sprite tile edges** so there's no visible box (skeleton: `c01(min(u, W-1-u, v)/60)`).
10. **A cartoon's sky can be brighter than its subject** (Popeye), which weakens readability. Pick clips where the subject is the brightest thing.

## Build script

`scripts/footage_to_sprite.py`. It needs numpy + scipy, which are in `raw-media/hp-sampler-refs/.venv` (no PIL; ffmpeg does the I/O). It covers:

- a centre crop or a tracked crop
- area downscale
- local contrast
- an optional highpass texture layer
- tiling to an 8-column sheet

Quick ffmpeg-only version, from before the readability pass:

```bash
ffmpeg -i src.mp4 -vf "fps=24,crop=iw*0.82:ih*0.82,scale=160:90,format=gray,eq=contrast=1.15,tile=8x11" -frames:v 1 assets/x-lum.png
```

## Sourcing

- **Pexels API** (`PEXELS_API_KEY` in the workspace .env): `curl -H "Authorization: $K" https://api.pexels.com/videos/videos/<id>`, then download a 720p `video_files` link.
  - Used: 35257509 (wave, Nui MALAMA), 6952251 (man reporter, Werner Pfennig), 10464555 (woman reporter, rejected), 40360253 (prop skeleton, replaced), 33733229 (brigantine, rejected).
- **archive.org public domain:** Popeye 1936 (`Popeye_meetsSinbadtheSailor`), NASA Apollo 11 restored moonwalk.
- **Higgsfield** (lowest quality; it becomes dots anyway). Aidan generates these himself when the MCP is disconnected. Write the prompt to `_research-<x>-prompt.md` and copy it to his clipboard.
  - Galleon prompt:
    > Wide cinematic shot at night on a stormy ocean, an old 1600s galleon with three masts and full white square sails sailing from the bottom right of frame toward the center, the camera handheld on a rolling boat, horizon tilted and swaying, long diagonal streaks of white sea foam and spray across dark water, high contrast black and white, bright white sails against a near-black sea and sky, film grain, no text.
  - Skeleton: a front-facing waving skeleton on black (Aidan's clip, `skeleton-hf-src.mp4`).
  - Train (unused): a head-on Polar Express-style loco with the headlight centred, plus a wide overhead version. Prompts are in `video-projects/hp-teaser-cg-proof/_research-train-prompt.md`.
- **Keep raw sources** in `raw-media/hp-teaser-src/`. The first wave sprite was built without keeping the source, and it had to be re-downloaded to fix readability.
- **Licensing:** Getty clips (e.g. galleons 711-22) are licensed, so use them only as a look reference.

## Pose-tracked rigs (real human motion, still pure dots)

`scripts/pose_track.py clip.mp4 out.json --people N --start s --dur d --smooth 2 --preview sheet.jpg` (venv `raw-media/hp-sampler-refs/.venv`, mediapipe 1.2.2 + cv2; model `raw-media/hp-pose-src/models/pose_landmarker_full.task`). Outputs per-frame 2D joints (nose, shoulders, elbows, wrists, hips, knees, ankles, heels, toes + derived neck/pelvis), gap-filled and gaussian-smoothed. Drive the stick rig's segments from these joints instead of hand-keyed walk cycles: the figure gets real weight and timing but no footage is ever shown.
- Always check the `--preview` sheet. BlazePose misses small/partly hidden people (a toddler next to his dad was never detected): use one clearly visible person per clip and track people separately.
- Pick clips shot side-on with the full body in frame for walks/runs/throws.
