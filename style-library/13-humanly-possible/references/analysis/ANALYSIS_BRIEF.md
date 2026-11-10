# Humanly Possible motion reference analysis: brief

Goal: extract the MOTION-GRAPHICS vocabulary from reference videos so we can build a premium card library for Humanly Possible (an interview show about everyday people and one real way they use AI). We want what makes the graphics feel hand-made and expensive, not a summary of the content.

## Inputs (per video `<v>`)
- `video/<v>.mp4` (720p, video only)
- `frames/<v>/sheets/scene_*.jpg` (scene-change frames, 5x6 grids, in order; times in `frames/<v>/scene_times.txt`, one pts per frame in order)
- `frames/<v>/sheets/uniform_*.jpg` (one frame every 2 s, 6x6 grids, in order: tile N = t ≈ 2*(N-1) s)

## Method
1. Read every sheet for your videos. Note each moment where a graphic is on screen (title card, lower third, name card, stat, quote, list, screen/browser card, map, split, chapter card, transition, logo bug, caption style).
2. For the 6 to 12 strongest graphic moments per video, cut a burst to see HOW it moves: `ffmpeg -ss <t-0.5> -t 2 -i video/<v>.mp4 -vf "fps=8,scale=480:-1" bursts/<v>/<label>_%02d.jpg` then `montage -font /System/Library/Fonts/Helvetica.ttc bursts/<v>/<label>_*.jpg -tile 8x2 -geometry +2+2 bursts/<v>/<label>_sheet.jpg` and Read the sheet. Describe the entrance, hold and exit frame by frame (what moves, direction, roughly how many frames, any blur/mask/wipe/scale, does text animate per word/line/letter).
3. Grab full-res hero frames for the best 6 to 10 moments: `ffmpeg -ss <t> -i video/<v>.mp4 -frames:v 1 -q:v 2 picks/<v>_<label>.jpg`. Read each one to confirm it is the right frame.

## Write ONLY inside
`raw-media/humanly-possible-style-refs/` subfolders `bursts/<v>/`, `picks/`, and `analysis/<v>.md`. Do not write anywhere else (not the scratchpad, not style-library, not scripts). Do not delete or modify `video/` or `frames/`.

## Output: `analysis/<v>.md` for each of your videos
- **One-paragraph read** of the graphics language.
- **Inventory**: a table of graphic moments: time, type, layout (where on frame, % of frame), type treatment (font feel, weight, case, size), color use, surface (flat/paper/glass/photo/texture), how it enters, how it exits, duration on screen.
- **Motion grammar**: easing feel (snappy vs drifting), typical entrance duration in frames, what moves vs what holds, how text reveals, how graphics relate to cuts (do cuts hide in motion, do graphics persist across cuts).
- **Signature moves**: the 3 to 6 specific techniques worth stealing, each described precisely enough to rebuild in HTML/GSAP at 1920x1080 (positions, sizes, timings, layering).
- **Fit for Humanly Possible**: for each signature move, how it translates into our brand (oxblood #4B1526 ground, cream #FFF0E6 type, brick #7A1E1E feature surfaces, ONE orange #FF8A4C accent per frame, gold #FFC145 for one word/number, Bricolage Grotesque 800 headlines + Inter Tight, 6/10/14px radii, flat surfaces, film grain, quick pop-and-settle motion with cubic-bezier(.2,.9,.25,1), no bounces/spins/long fades, no glows or glass on UI). Say plainly if a move does not fit.
- **Picks**: list each `picks/` file with one line on what it shows.

Be concrete and visual. Timestamps in m:ss. No em dashes in anything you write.
