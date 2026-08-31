# AIS LIVE — Day 1 Agenda Walkthrough

180s (3:00) chronological rundown of everything on Day 1 (Build Day, Sat July 11),
in the AIS LIVE house style (doors-loop motion engine: depth grid tunnel, chrome italic
type, whip cuts, solid AIS/LIVE mark bug).

## Source of truth

**Full Agenda doc v7.1** (Google Doc `1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18`),
pulled 2026-07-07. All times Central, shown verbatim.

⚠ v7.1 shifts several Day 1 times vs. the older delivered card sets
(`ais-live-day1-cards`, RingCentral session cards built from v6.x):
panel now 10:30 (was 11:00), Hyperagent keynote 11:40 (was 10:30), Glaido 12:00,
Evals 12:20, Workshop Block 1 12:45 (was 12:55), Kacper 2:35 (was 2:45),
WB2 3:10 (was 3:20), WB3 4:20 (was 4:30), certification 5:05, close 5:20 (was 5:30).
If v7.1 is final, those older card sets are stale.

## Structure

20 beats: intro hero → every Day 1 item in order (big gradient time + title + speakers)
→ concurrent workshop blocks as split Foundation/Advanced cards (yellow/coral) →
5 VIP working rooms as a row list with facilitators → AIS LIVE markflash outro.

Signature element: **day progress rail** along the bottom (9AM→5PM ticks, "ALL TIMES CT"),
fill + glowing head glide to each session's clock position as scenes advance.

## Build / verify

```bash
node _gen-agenda.mjs    # -> index.html
node _shots.mjs         # headless hero-frame screenshots -> frames/
npx hyperframes lint    # 0 errors (file-size warning accepted, same as doors loop)
npx hyperframes preview # Studio, port 3002
```

Silent by default (no VO/music baked in) — drop a bed under it in the NLE or ask for
the sfx kit port from the doors loop.

## Status

- Built + frame-verified 2026-07-07; revisions same day (no em dashes on screen, no card
  highlight strips, all-blue styling, Kodi Zene, eyebrow dots removed, real sponsor logos).
- APPROVED + DELIVERED 2026-07-07: renders/day1-agenda-final.mp4 (standard, 21MB, 1m43s
  render w/ --workers auto --browser-gpu --gpu) -> Drive "Event Assets/Block 1 Assets/
  AIS LIVE - Day 1 Agenda Walkthrough.mp4" (folder id 1igWvlWzHX0qWUdT6TJU7PRSr3-A1KX93, inside Event Assets 1atPnspYOZALqgWckZ94BSd4iPHeoKaNL).
