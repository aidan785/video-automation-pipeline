# AIS LIVE — VIP Prompt: Q&A with Nate is live now

34s in-show prompt fired at 9:30 AM Day 1 (Sat Jul 11): tells VIP attendees the
Q&A with Nate is happening RIGHT NOW and routes them to the VIP room. Session
facts verbatim from Agenda v7.1 (9:30am · 45 min · VIP room · Nate Herk).

Same house engine as the Day 1 agenda walkthrough / Get Set Up videos (depth
grid tunnel, chrome italic type, whip cuts, solid AIS/LIVE mark bug), all-blue
styling per the standing directives (no coral/yellow, no eyebrow dots, no
on-screen em dashes). Signature element: persistent LIVE NOW · VIP pill
top-left with pulsing red tally dot (replaces the progress rail).

## Structure

5 beats: hero ("Your Q&A with Nate is live.") ->
Nate portrait card (cutout reused from ais-live-speaker-announcements
assets/cutouts-clean/nate-herk.png; title + name/role + 9:30 AM CT · 45 MIN ·
VIP ROOM meta) ->
how it works (3 rows from the v7.1 session blurb) ->
CTA ("Head to the VIP room.") -> AIS LIVE markflash outro.

## Build / verify / render

```bash
node _gen-vip.mjs       # -> index.html
node _shots.mjs         # headless frame verification -> frames/
npx hyperframes lint    # 0 errors, 0 warnings
npx hyperframes render --quality standard --workers auto --browser-gpu --gpu --output renders/vip-qa-live-now-final.mp4
```

Silent by default.

## Status

- Built + frame-verified + approved 2026-07-07. Rendered standard (19s render)
  and DELIVERED to Drive Event Assets/Block 1 Assets as
  "AIS LIVE - VIP Prompt - Q&A with Nate Live Now.mp4"
  (file 1SULCotSv_AKFkieFjvfPqaYwH-yg_kWJ).
- Block 1 Assets folder: 1igWvlWzHX0qWUdT6TJU7PRSr3-A1KX93.
