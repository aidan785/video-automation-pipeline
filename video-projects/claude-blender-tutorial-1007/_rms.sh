#!/bin/zsh
# 50ms RMS sweep: _rms.sh <audio> <start> <dur> [win_s=0.05]
A=$1; S=$2; D=$3; W=${4:-0.05}
SR=$(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of csv=p=0 "$A")
N=$(printf "%.0f" $(echo "$SR*$W" | bc -l))
ffmpeg -v error -ss $S -t $D -i "$A" -af "asetnsamples=$N,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-" -f null - 2>/dev/null | grep -oE "RMS_level=(-?[0-9.]+|-inf)|pts_time:[0-9.]+" | paste - - | awk -F'[:=\t]' -v s=$S '{printf "%.2f:%s ", s+$2, ($4=="-inf"?"-120":sprintf("%.0f",$4))} END{print ""}'
