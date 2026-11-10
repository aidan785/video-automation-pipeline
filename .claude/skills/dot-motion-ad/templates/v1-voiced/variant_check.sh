#!/usr/bin/env bash
# build every variant in tools/variants.tsv and shoot a 6-frame strip of the tool section (needs `npx serve . -p 8093 -n`)
set -e
OUT=${1:-/tmp/v1v-variants}; mkdir -p "$OUT"
while IFS=$'\t' read -r name envs; do
  env $envs python3 tools/build.py > /dev/null
  rm -rf "$OUT/$name"; node ../../../scripts/_v1v-shots.mjs http://localhost:8093/index.html hp-teaser-v1v "$OUT/$name" 48.9 49.25 49.9 50.85 51.4 52.15 2>&1 | grep -i err || true
  magick montage $(ls "$OUT/$name"/t*.png | sort -t t -k2 -n) -tile 6x -geometry 320x180+2+2 -background '#222' "$OUT/$name.jpg" 2>/dev/null || true
  echo "$name ok"
done < tools/variants.tsv
python3 tools/build.py > /dev/null
