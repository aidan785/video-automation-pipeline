# AIS+ Membership Video (#6) — DRAFT scaffold

Conversion-critical video from the AIS LIVE production plan. Plays Day 1 3:55pm, Day 2 5:35pm, and the Welcome Lounge.

**Status:** draft scaffold. Look + copy + timing locked; media slots are placeholders.

- Duration ~78s, 1920x1080, 30fps
- Brand: blend of AIS+ product (blue #37bdf8 glow logo, navy, teal/orange) + AIS LIVE event framing (grid/glow/vignette, AIS/LIVE mark bug)
- Currently silent + text-driven so it's reviewable without VO
- Copy grounded in the AIS+ Upsell Module (real courses, member wins, "build vs earn" bridge)

## Beats
S1 bridge · S2 what AIS+ is (Nate talking-head slot) · S3 two courses · S4 proof (stats + member wins) · S5 unlocked stack · S6 the math · S7 join CTA

## Pending inputs to reach final
1. B-roll — member footage / community wins / course screen-recordings (the #6 Drive folder is empty). Drop into the dashed `.slot` placeholders.
2. Nate talking-head clip → S2 slot (muted `<video>` + sibling `<audio>` so his VO carries).
3. VO + music bed (or a scratch TTS to lock timing).
4. Green-light on named member numbers in S4 ($14K Aidan Finnegan / $6K Mike Aheirwe / $500 Jose Lopes) — pulled from the classroom doc.

## Build/preview
```
cd video-projects/ais-plus-membership
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js lint
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js preview   # studio
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js render --quality draft --fps 30 --output renders/draft.mp4
```
