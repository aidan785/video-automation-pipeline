#!/bin/bash
# Real datamosh plates for the apple-a24 family (A24 "Aftersun" break-in / break-up).
# Method: encode the sequence in MPEG-4 Part 2 (no B-frames, one huge GOP, I-frames forced only where we
# want them), then DROP chosen I-frames with ffmpeg's noise bitstream filter. The decoder keeps the previous
# picture and applies the next shot's motion vectors and residuals to it: genuine codec damage, 16 px blocks.
# A later kept I-frame snaps the picture clean. Output: H.264 mp4, 1920x1080, 24 fps, for <video> playback.
#
#   build-mosh.sh transition A.mp4 B.mp4 out.mp4 [A_frames=24] [mosh_frames=14] [B_frames=36]
#       A frames 0..A-1, then B; B's first I-frame dropped, clean I-frame mosh_frames later.
#   build-mosh.sh title A.mp4 S1.png S2.png C.mp4 out.mp4
#       F1-12 A, F13 blank paper (dropped I-frame), F14-43 still S1 (title only, slight settle), F44-84 still S2
#       (title + credit), F85-102 C. I-frames dropped at F13 and F85; kept at F29 and F91.
#       S1/S2 = screenshots of cards/apple-a24/title.html at #f=29 and #f=84 (rebuild after text changes).
set -euo pipefail
mode=$1; shift
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
FPS=24
if [ "$mode" = transition ]; then
  A=$1; B=$2; OUT=$3; NA=${4:-24}; NM=${5:-14}; NB=${6:-36}
  ffmpeg -v error -y -i "$A" -i "$B" -filter_complex \
    "[0:v]fps=$FPS,scale=1920:1080,trim=end_frame=$NA,setpts=PTS-STARTPTS[a];[1:v]fps=$FPS,scale=1920:1080,trim=end_frame=$NB,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1[v]" \
    -map "[v]" -c:v mpeg4 -q:v 4 -g 1000 -bf 0 -sc_threshold 1000000000 \
    -force_key_frames "expr:eq(n,$NA)+eq(n,$((NA+NM)))" "$tmp/seq.avi"
  DROP="eq(n,$NA)"
elif [ "$mode" = title ]; then
  A=$1; S1=$2; S2=$3; C=$4; OUT=$5; P0=${6:-$(dirname "$0")/../paper-warm.jpg}
  # frame 12 = blank paper I-frame (DROPPED): the titled frames that follow are coded as "type appearing on paper",
  # so the decoder paints those residual blocks onto shot A = the type breaks in as blocks over the old picture.
  Z="zoompan=z='if(lt(on,16),1.035-0.035*on/16,1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=$FPS"
  ffmpeg -v error -y -i "$A" -loop 1 -i "$P0" -i "$S1" -i "$S2" -i "$C" -filter_complex \
    "[0:v]fps=$FPS,scale=1920:1080,trim=end_frame=12,setpts=PTS-STARTPTS[a];\
[1:v]scale=1920:1080,zoompan=z=1.035:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=$FPS,trim=end_frame=1,setsar=1,setpts=PTS-STARTPTS[p0];\
[2:v]scale=1920:1080,$Z:d=30,setsar=1,setpts=PTS-STARTPTS[s1];\
[3:v]scale=1920:1080,zoompan=z=1:d=41:s=1920x1080:fps=$FPS,setsar=1,setpts=PTS-STARTPTS[s2];\
[4:v]fps=$FPS,scale=1920:1080,trim=end_frame=18,setpts=PTS-STARTPTS[c];\
[a][p0][s1][s2][c]concat=n=5:v=1[v]" \
    -map "[v]" -c:v mpeg4 -q:v 4 -g 1000 -bf 0 -sc_threshold 1000000000 \
    -force_key_frames "expr:eq(n,12)+eq(n,28)+eq(n,84)+eq(n,90)" "$tmp/seq.avi"
  DROP="eq(n,12)+eq(n,84)"
else
  echo "mode: transition | title" >&2; exit 1
fi
DROP=${DROP//,/\\,}   # commas must be escaped inside a bsf option
ffmpeg -v error -y -i "$tmp/seq.avi" -c:v copy -bsf:v "noise=drop=key*($DROP)" "$tmp/mosh.avi"
ffmpeg -v error -y -i "$tmp/mosh.avi" -r $FPS -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p -g 12 -movflags +faststart -an "$OUT"
echo "wrote $OUT ($(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$OUT") frames)"
