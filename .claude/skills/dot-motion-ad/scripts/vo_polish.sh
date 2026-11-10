#!/usr/bin/env bash
# VO polish placeholder (Aidan finishes VO in Premiere Essential Sound). See references/audio.md.
# usage: vo_polish.sh in.wav out.m4a [target_lufs=-15] [fade_in_start=0]
set -euo pipefail
IN="$1"; OUT="$2"; T="${3:--15}"; FI="${4:-0}"; TMP=$(mktemp -d)
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
CH="afade=t=in:st=$FI:d=0.04,highpass=f=85:p=2,equalizer=f=300:t=q:w=1.1:g=-4.5,equalizer=f=160:t=q:w=0.9:g=1.5,equalizer=f=3200:t=q:w=0.9:g=6,equalizer=f=6000:t=q:w=1.2:g=2.5,highshelf=f=9000:g=1.5,deesser=i=0.4:m=0.5:f=0.5,acompressor=threshold=-24dB:ratio=3:attack=10:release=140:knee=6:makeup=3dB,acompressor=threshold=-14dB:ratio=6:attack=1:release=40:knee=3,afade=t=out:st=$(python3 -c "print($D-0.06)"):d=0.06"
ffmpeg -v error -y -i "$IN" -af "$CH" -ar 48000 "$TMP/p.wav"
L=$(ffmpeg -nostats -i "$TMP/p.wav" -af ebur128 -f null - 2>&1 | grep -A1 Integrated | grep -o "I: *-[0-9.]*" | tail -1 | grep -o "\-[0-9.]*")
G=$(python3 -c "print($T-($L))")
PK=$(ffmpeg -i "$TMP/p.wav" -af "volume=${G}dB,astats=metadata=0" -f null - 2>&1 | grep "Peak level dB" | tail -1 | grep -o "\-*[0-9.]*$")
echo "gain ${G} dB, pre-limit peak ${PK} dBFS (limiter ceiling -1; >~3 dB over = look for a click)"
ffmpeg -v error -y -i "$TMP/p.wav" -af "volume=${G}dB,alimiter=limit=0.89:attack=3:release=60:level=disabled" -c:a aac -b:a 256k "$OUT"
rm -rf "$TMP"
