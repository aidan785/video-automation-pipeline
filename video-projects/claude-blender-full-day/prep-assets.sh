#!/bin/zsh
# Builds every derived picture and clip the intro uses from the Blender outputs copied into assets/src/.
# Nothing here is generated: every pixel is a crop, a resize or a retime of a Blender render.
# Run from the project folder:  zsh prep-assets.sh            (everything)
#                               zsh prep-assets.sh creatures  (only the cold open creature + caterpillar clip)
#                               zsh prep-assets.sh mont       (only the montage clip)
#                               zsh prep-assets.sh stills     (only the pictures)
set -e
cd "$(dirname "$0")/assets"
ONLY="${1:-all}"
want() { [[ "$ONLY" == all || "$ONLY" == "$1" ]] }
FF=(ffmpeg -hide_banner -loglevel error -y)
X264=(-an -c:v libx264 -preset medium -crf 16 -g 30 -keyint_min 30 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart)
mkdir -p co mont bh

if want stills; then
# ---------- cold open: ring ship stills, 4:3 (the push is done in the comp) ----------
$FF -i src/ring/ringship_hero_1080p.png -vf "crop=1440:1080:240:0" -q:v 2 co/ring-hero.jpg
$FF -i src/ring/a3_wall_run.png        -vf "crop=1440:1080:480:0" -q:v 2 co/ring-a3.jpg
$FF -i src/ring/c1_citadel_tele.png    -vf "crop=1440:1080:100:0" -q:v 2 co/ring-c1.jpg
fi

if want creatures; then
# ---------- cold open: tree creature + caterpillar as ONE 4:3 clip, 30 fps, 293 frames (comp 3.933 to 13.700) ----------
# All three creature shots come from the 1080p render (re-rendered 7 Oct, 23:57: frames 71 to 240 used to render the body black).
# seg1  85f  tree 1080p render, source 0.00 to 2.83 s, centre crop
# seg2  36f  tree 1080p render, source 5.70 to 6.90 s (the blink), left 3/4 of the frame: same framing the v1 placeholder had
# seg3  53f  tree 1080p render, source 3.15 to 4.92 s (head tracks the insect), same left 3/4 framing
# seg4 119f  caterpillar quick render, source 6.00 to 9.97 s (wiggle, then the turn to the lens)
# (v1 of the draft used the 360p preview render upscaled for seg2 and seg3: crop=488:366:0:0,scale=1440:1080 of tree_creature_preview_360p.mp4)
CU="crop=1440:1080:0:0"
$FF -i src/tree/tree_creature_1080p.mp4 -i src/tree/tree_creature_1080p.mp4 -i src/tree/tree_creature_1080p.mp4 -i src/cat/caterpillar_flower_quick_1080p.mp4 \
  -filter_complex "
   [0:v]trim=start=0:end=2.95,setpts=PTS-STARTPTS,fps=30,trim=end_frame=85,crop=1440:1080:240:0,setsar=1[a];
   [1:v]trim=start=5.70:end=7.0,setpts=PTS-STARTPTS,fps=30,trim=end_frame=36,${CU},setsar=1[b];
   [2:v]trim=start=3.15:end=5.0,setpts=PTS-STARTPTS,fps=30,trim=end_frame=53,${CU},setsar=1[c];
   [3:v]trim=start=6.0:end=10.0,setpts=PTS-STARTPTS,fps=30,trim=end_frame=119,crop=1440:1080:330:0,setsar=1[d];
   [a][b][c][d]concat=n=4:v=1:a=0,fps=30[o]" -map "[o]" $X264 co/creatures.mp4
fi

if want stills; then
# ---------- contact sheet prints (the card that lands on the wall behind Aidan) ----------
$FF -i src/ring/c4_top_down.png                    -vf "crop=855:1080:640:0,scale=760:960" -q:v 2 co/print-ring.jpg
$FF -i src/tree/tree_creature_hero_1080p.png       -vf "crop=855:1080:530:0,scale=760:960" -q:v 2 co/print-tree.jpg
$FF -i src/cat/caterpillar_flower_hello_1080p.png  -vf "crop=855:1080:430:0,scale=760:960" -q:v 2 co/print-cat.jpg

# ---------- behind Aidan ----------
$FF -i src/ring/reference.png -q:v 2 bh/ref-ring.jpg
$FF -i src/cat/reference.png  -vf "scale=800:800" -q:v 2 bh/ref-cat.jpg
$FF -i src/tree/c01_clay.png        -vf "scale=960:540" -q:v 2 bh/prog-tree-1.jpg
$FF -i src/tree/c04_main.png        -vf "scale=960:540" -q:v 2 bh/prog-tree-2.jpg
$FF -i src/tree/c05_main.png        -vf "scale=960:540" -q:v 2 bh/prog-tree-3.jpg
$FF -i src/tree/c10_full_f032.png   -vf "scale=960:540" -q:v 2 bh/prog-tree-4.jpg
$FF -i src/ring/s1_hull_plates.png  -vf "scale=960:540" -q:v 2 bh/prog-ring-1.jpg
$FF -i src/ring/s2_greebles.png     -vf "scale=960:540" -q:v 2 bh/prog-ring-2.jpg
$FF -i src/ring/s4_asteroids.png    -vf "scale=960:540" -q:v 2 bh/prog-ring-3.jpg
$FF -i src/ring/ringship_hero_1080p.png -vf "scale=960:540" -q:v 2 bh/prog-ring-4.jpg
$FF -i src/ring/rejected_c4_rock_macro.png          -vf "scale=960:540" -q:v 2 bh/rej-1.jpg
$FF -i src/ring/rejected_c5_under_belly.png         -vf "scale=960:540" -q:v 2 bh/rej-2.jpg
$FF -i src/ring/rejected_deck_level_candidates.jpg  -vf "scale=960:540" -q:v 2 bh/rej-3.jpg

# ---------- montage cutaway: ring ship still (pushed in the comp) ----------
$FF -i src/ring/c5_backlit.png -q:v 2 mont/ring-c5.jpg
fi

if want mont; then
# ---------- montage cutaway: ONE clip with creature then caterpillar, 78 frames ----------
$FF -i src/tree/tree_creature_1080p.mp4 -i src/cat/caterpillar_flower_quick_1080p.mp4 \
  -filter_complex "
   [0:v]trim=start=0.95:end=2.6,setpts=PTS-STARTPTS,fps=30,trim=end_frame=39,setsar=1[a];
   [1:v]trim=start=6.0:end=7.6,setpts=PTS-STARTPTS,fps=30,trim=end_frame=39,setsar=1[b];
   [a][b]concat=n=2:v=1:a=0,fps=30[o]" -map "[o]" $X264 mont/mont.mp4
fi

for f in co/creatures.mp4 mont/mont.mp4; do
  echo "$f: $(ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=width,height,r_frame_rate,nb_read_frames -of csv=p=0 $f)"
done
