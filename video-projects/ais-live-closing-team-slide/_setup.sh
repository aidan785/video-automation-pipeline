#!/bin/zsh
# one-shot: copy medallions -> crop screenshot avatars -> generate index.html -> start Studio on :3016
set -e
cd "/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-closing-team-slide"

for p in nate-herk jon-morrow ednan-abdullayev russ-henneberry anne-marie-enns kodi pat-blakely jenn-van-wagner yash-chauhan; do
  cp "../ais-live-speaker-announcements/assets/medallions/$p.png" assets/headshots/
done

python3 _crop-headshots.py
node _gen.mjs

echo "headshots:"
ls assets/headshots

(nohup npx hyperframes preview --port 3016 > /tmp/team-slide-preview.log 2>&1 &)
sleep 4
tail -5 /tmp/team-slide-preview.log
echo "Studio: http://localhost:3016"
