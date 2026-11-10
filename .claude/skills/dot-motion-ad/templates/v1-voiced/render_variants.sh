#!/usr/bin/env bash
# build + render every variant in tools/variants.tsv to ../_renders/variants (outside the project, so Studio stays light)
OUT="$(cd ..; pwd)/_renders/variants"; mkdir -p "$OUT"
while IFS=$'\t' read -r name envs <&3; do
  env $envs python3 tools/build.py > /dev/null || { echo "$name BUILD FAIL"; continue; }
  npx hyperframes lint < /dev/null 2>&1 | grep -q " 0 error" || echo "$name LINT ERRORS"
  f="$OUT/HP Teaser v3 - Tool Section - $name.mp4"
  npx hyperframes render --quality standard --workers auto --browser-gpu --gpu --output "$f" < /dev/null > "$OUT/$name.log" 2>&1 && echo "$name rendered $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")" || echo "$name RENDER FAIL"
done 3< tools/variants.tsv
python3 tools/build.py > /dev/null; echo ALL DONE
