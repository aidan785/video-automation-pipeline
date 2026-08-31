#!/bin/bash
# Render the plain cut (screen recording + rounded square PIP, no graphics) with ffmpeg.
#
# Why not `hyperframes render`: this composition has zero beats and nothing animates, so
# the browser frame-capture path is pure overhead — it wants ~20GB of scratch for 32,112
# 1080p frames and dies with ENOSPC on a 98%-full disk. ffmpeg does the identical
# composite as a straight video op: no scratch, no browser, a few minutes.
#
# Geometry is taken verbatim from index.html: PIP 380x380, 36px radius, 44px margins
# bottom-right -> overlay at x=1496 y=656.
set -euo pipefail

cd "$(dirname "$0")"
OUT="${1:-/Users/aidanstanik/Projects/Adobe Transfer Folder/editing OS final.mp4}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

PIP=380; RADIUS=36; MARGIN=44
X=$(( 1920 - MARGIN - PIP ))   # 1496
Y=$(( 1080 - MARGIN - PIP ))   # 656
HALF=$(( PIP / 2 ))            # 190
INNER=$(( HALF - RADIUS ))     # 154

# 1. rounded-corner alpha mask (antialiased rounded-rect SDF)
ffmpeg -v error -f lavfi -i "color=black:s=${PIP}x${PIP}" \
  -vf "geq=lum='255*clip(${RADIUS}-hypot(max(0\,abs(X-${HALF})-${INNER})\,max(0\,abs(Y-${HALF})-${INNER}))+0.5\,0\,1)':cb=128:cr=128,format=gray" \
  -frames:v 1 "$WORK/mask.png" -y

# 2. soft drop shadow, matching the CSS `0 24px 60px rgba(0,0,0,0.55)`
ffmpeg -v error -i "$WORK/mask.png" -filter_complex \
  "[0:v]format=gray,pad=460:460:40:40:color=black,boxblur=20:2,lut=y='val*0.55'[a];color=black:s=460x460[c];[c][a]alphamerge" \
  -frames:v 1 "$WORK/shadow.png" -y

# 3. composite: screen recording <- shadow <- masked PIP, talking-head audio
ffmpeg -hide_banner -stats \
  -i assets/screen.mp4 \
  -i assets/talkinghead-square.mp4 \
  -loop 1 -i "$WORK/shadow.png" \
  -loop 1 -i "$WORK/mask.png" \
  -i assets/narration.m4a \
  -filter_complex "\
    [0:v][2:v]overlay=$((X-40)):$((Y-40+14))[bg]; \
    [1:v]scale=${PIP}:${PIP},format=rgba[p]; \
    [3:v]format=gray[m]; \
    [p][m]alphamerge[pip]; \
    [bg][pip]overlay=${X}:${Y}[v]" \
  -map "[v]" -map 4:a \
  -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart -shortest \
  -progress /tmp/editingos-render-progress.txt \
  "$OUT" -y

echo "wrote: $OUT"
