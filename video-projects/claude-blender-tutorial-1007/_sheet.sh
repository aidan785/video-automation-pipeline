#!/bin/zsh
# Screen-half contact sheet. usage: _sheet.sh <start> <end> <step_s> [cols=5] [src]   -> frames/s-<start>-<end>-<step>.jpg ; tile i = start + i*step
S=$1; E=$2; ST=$3; C=${4:-5}; SRC=${5:-"/Users/aidanstanik/Projects/Adobe Transfer Folder/TODAYY2.mov"}
N=$(python3 -c "import math;print(math.ceil(($E-$S)/$ST))")
R=$(python3 -c "import math;print(math.ceil($N/$C))")
ffmpeg -v error -y -ss $S -t $(($E-$S)) -i "$SRC" -an -vf "crop=1920:1080:0:0,fps=1/${ST},scale=384:216,tile=${C}x${R}" -frames:v 1 -q:v 3 frames/s-$S-$E-$ST.jpg
echo "frames/s-$S-$E-$ST.jpg  ($N tiles, ${C}x${R})"
