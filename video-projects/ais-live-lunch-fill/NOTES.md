# Block 3 — Lunch / Afternoon Preview (main stage, Day 1 · 2:00–2:35 CT)

35:00 build (2100s exactly) that RUNS ONCE and fills the whole lunch window.
Program per production direction, each pass in order: afternoon preview (agenda +
spotlights + VIP directing) → networking/expo prompt → AIS+ membership → sponsor
reel (HyperAgent + Glaido + Clay) → community testimonials → proof/reset seam.

**Status:** v2 RENDERED + DELIVERED 2026-07-08. `renders/lunch-fill-final-v2.mp4`
(35:00.0, 488.7 MB, standard 1080p, 19m58s render) replaced the Drive file's
content IN PLACE — same file ID `1-oZUnzPBEKE4epOTlHgnzdMakSVGSwOj`, same name
"AIS LIVE - Block 3 - Lunch + Afternoon Preview (35 min).mp4", in Event
Assets/Block 3 Assets (`1NKXDf7Ayp6mBrVHia82rFvXFumOU-9Fh`) — existing links
stay valid. Rendered-file spot checks passed (reel intros + win card +
presenting card + keynote mid/end + Glaido; audio at membership/keynote/reel
moments). v2 = keynote-once + member wins + logo-beat sponsors + fixed reels;
2 passes + 24 filler + outro.

## Structure — 5 varied passes + filler pool + fixed outro

- **5 passes** (~6.3 min each): copy variants rotate (5 hero / 5 expo-tagline
  variants, 3 afternoon spotlights), testimonial reels alternate
  (building on even passes / earning on odd), **membership ad mounts every OTHER
  pass** (taglines only on off-passes, "ask at the booth / get certified at 5:05")
  so the same ad doesn't repeat every pass across 35 minutes.
- **18 filler beats** (soft loop, no mounts): quotes/stats/agenda re-show/expo
  prompt/WB2 worksplit/markflash — tops the build up toward 35:00.
- **Fixed outro** (last ~31s): "Back in the room." → featured-session card
  ("Run an Entire AI Agency Using Claude Code, Kacper Rutkiewicz, starting now on
  the main stage") → markflash "The afternoon starts now." settling out in the
  final 0.9s. The video ends exactly as the 2:35 session begins.
- Exact-landing pad rides the final markflash hold; generator throws if D ≠ 2100.

## Afternoon content (Agenda v7.1, verbatim, all times Central)

9-row afternoon agenda card; VIP working sessions card (5 rooms: Jon Morrow /
Jenn Van Wagner / Russ Henneberry / Kodi Zene / Meghan Cox) with "live now until
2:35" directing; WB2 3:10 worksplit (Sabrina Ramonov / Samin Yasar); rotating
spotlights (4:20 Tangy Frederick, 5:05 Get AIS+ Certified Ednan, 5:20 Closing Nate
+ overnight challenge); featured 2:35 Kacper card in every pass + the outro.

## Sponsor reel — revisions (Aidan)

- **Clay is OUT** (2026-07-07) — no longer a sponsor. Reel is HyperAgent + Glaido.
- **v2 (2026-07-08): the 18:25 HyperAgent keynote plays ONCE**, in pass 1 at
  ~8:46: 5s "OUR PRESENTING SPONSOR" logo card → `hyperagent-keynote.mp4`
  (1104.87s, WITH audio, same piece Block 1 mounts) → Glaido 10s. All other
  HyperAgent slots are 10s logo beats (the 60s placeholder card is retired —
  the keynote IS the sponsor video).

## Testimonial reels — descender fix + restyle pickup (2026-07-08)

Aidan flagged the "y" in "What They Earned" clipping in the mounted earning reel.
Root cause in `ais-live-testimonials/_gen.mjs`: the intro/outro wipe-reveal
clip-path clips at the BORDER box and 0.16em bottom padding wasn't enough for the
italic-900 descender at 128px — now 0.30em + a -0.17em margin so spacing holds.
Both reels re-rendered (they also picked up the all-blue directive restyle: the
old mounted mp4s were still the yellow/dot/em-dash look) and re-mounted here with
fresh brackets. Durations unchanged (63.93 / 69.9), total still exactly 2100s.

3 win cards follow each testimonial reel (summary left, real post screenshot
right — renderer/CSS/data ported verbatim from `ais-live-block1-opening`).
16-post pool in `assets/wins/`, selected by index math (pass 0 → wins 1-3,
pass 1 → wins 4-6; pass() runs twice per assembly iteration so NO cursor).

## Membership mount — Nate placeholder removed 2026-07-07

The mounted `ais-plus-membership.mp4` was re-rendered from its source project
(`video-projects/ais-plus-membership/`, S2 dashed "Talking head · Nate" slot +
its riseSlot tween deleted; scene timing untouched, still 66s). Fresh render +
regenerated poster/lastframe brackets copied in here. NOTE: the Block 2 fill
(`ais-live-workshop-block1-fill`) still carries the OLD membership copy + a Clay
beat — owned by another session, flagged to Aidan, don't touch from here.

## Audio

Mounted pieces (AIS+ ad, testimonial reels, HyperAgent spot) keep their voice audio
(muted `<video>` + sibling `<audio>`, data-volume 1). All authored cards are silent —
venue runs a music bed underneath at playback.

## Engine notes (vs Block 2 fill)

Forked from `ais-live-workshop-block1-fill/_gen.mjs`. Changes:
- New `rooms` beat type — VIP working-sessions list (italic-900 title + blue mono
  facilitator rows, slideX entrance, gentle drift on the long hold).
- Ambient cycles use SHORT fixed periods (camera ~30s, beam ~25s, flicker ~6s,
  vignette ~8.4s) with even yoyo segment counts — a 35-min half-cycle (the old
  `D/2` pattern) would read as static at this length.
- Mount tracks moved to 500+/560+ (video/audio) — with 142 beats the old 200+ base
  would collide with scene track indices (12+idx).
- `plusMark()` inlines the all-white AIS+ product mark in eyebrow/sub/agenda copy.

## Build / preview / verify

```
node _gen.mjs --set          # regenerate index.html (also picks up hyperagent-60.mp4)
npx hyperframes lint         # 0 errors; 3 accepted warnings (dup poster imgs via
                             # repeated mounts; single-file size — established pattern)
npx hyperframes preview      # Studio (took :3009 this session — stale servers hold 3002-3008)
node _shots.mjs --port 3009 <t> <t> ...   # Playwright frame shots via the live player -> frames/
```

## Sources

- Afternoon program: Agenda v7.1 (doc 1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18)
- Mounted renders: ais-plus-membership + testi-building/earning (current
  Mike→Miguel-swap reels), copied from the Block 2 fill project
- Logos: hyperagent-white-big, glaido-white, clay-white (same set as Block 2)
- Quotes/stats: the verified doors-open-loop set, 7 quotes + 4 stats rotating
  (no unconfirmed future-event content)
