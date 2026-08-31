# AIS LIVE — Design Spec

> Source of truth: the AIS LIVE **Doors-Open Loop** (`video-projects/ais-live-loops/`),
> distilled into this style. Reference stills in `references/`.

## Style Prompt

The AIS LIVE "command-deck": a live-event broadcast look. The viewer sits inside a
dark onyx room with a receding perspective-grid tunnel (floor + ceiling), a conic
light beam raking down from above, and soft blue + coral glow wells breathing in the
corners. A film-grain vignette pulls focus to center; a persistent **AIS/LIVE** mark
sits bottom-right with a pulsing red live-dot (broadcast tally). Headlines are
italic-900 chrome-gradient type that reveals **word-by-word** (blur + rise); big
stats are blue-gradient numbers that count up; a **motion-blur whip + light streak**
fires on every cut — never a hard cut. High energy, kinetic, depth-driven. Every
card in this style is a full-screen **takeover** (tier1 / custom) — this is a stage,
not a lower-third system. The camera never sleeps.

## Colors

- Background: `#07121C` (onyx; deeper well `#040A11`)
- Foreground / text: `#FFFFFF` (dim italic sub `rgba(209,220,232,.85)`)
- Accent: `#37BDF8` (AIS blue — chrome/blue gradient headlines + numbers, eyebrows)
- Secondary accent: `#FF8A5C` (coral — "Earn Day", punchlines, agenda times, chevrons)
- Live-dot only: `#FF3B30` (red — never used as a text/fill color)

Match `tokens.css`. The AIS/LIVE mark stays **solid** (brand rule §3.2) — only
headlines get the chrome gradient.

## Typography

- Display / headline / numbers / mark: **Montserrat** italic-900 — athletic, broadcast
- Body / italic sub / captions: **Inter** — 300–500, recedes
- Mono / eyebrow / kicker / unit / timestamp: **JetBrains Mono** — 700, wide-tracked uppercase
- No serif anywhere.

Chrome-gradient words carry generous padding (`.08em .13em .24em`) so italic-900
glyph overhangs don't clip against the `background-clip:text` box.

## Motion

- Entrance: word-by-word blur+rise (`expo.out`, 0.075 stagger); stat numbers pop
  (`back.out(1.6)`) and count up; speaker cards 3D-flip (`power3.out`) then drift;
  agenda/track rows slide in from the left (`power2.out`, blur-in).
- Cut/transition: fast motion-blur **whip** (~0.22s) + light streak. When
  **sequencing beats, OVERLAP them** — the incoming beat enters as the outgoing
  whips out, so the screen never fades to black between sections. Every section
  boundary gets a dedicated cut (whip + streak); no empty/black gaps.
- **Side-swipe match cut** (~0.24s) for swapping same-format panels (e.g. a
  testimonial chain): keep ONE persistent frame, swipe the whole block with
  blur+scale, swap the content while it's blurred, land the next panel SHARP as
  the swipe ends. Time `swipeStart = nextClipStart − swipeDur` so nothing empty
  shows on the landing.
- Ambient (always on, deterministic, scaled to card duration): the camera rides
  the **background only** — the depth tunnel/glow push in (`.bg` scale) + parallax
  drift, grid scroll, beam rock + flicker, glow drift, breathing vignette, pulsing
  live-dot, 1.6s ring ping. The **text layer never scales or translates**.
- **Real member `<video>` clips sit dead still.** No digital ken-burns on footage
  — the talking-head has its own motion; a scaled frame-seeked video shakes.
- Timing: ~5–8s per card (testimonial split beats run ~4–6s). No static holds.

## Card kinds in this style

- **tier1 takeovers:**
  - `thesis` — chrome headline (`.chrome`), big two-word punch (`.hero`)
  - `stat` — count-up blue number (`.countup`)
  - `quote` — member-win pull-quote (`.member`)
  - `section` — AIS/LIVE mark flash (`.markflash`)
  - `overview` — schedule/agenda (`.agenda`), takeaway list (`.tracks`)
- **custom (event-specific takeovers):**
  - `speakers` — 4:5 speaker-card grid, 3D-flip + drift (`.grid`)
  - `sponsor` — sponsor logo row with tier roles (`.logos`)
  - `testimonial` — split proof card: mono NAME + big blue **count-up** number +
    unit on the LEFT, the member's talking-head clip framed on the RIGHT
    (`.split`). Chain several with the side-swipe match cut for a member montage.

## Product mark — AIS+

Distinct from the **AIS/LIVE** event mark. The **AIS+** product/membership mark is
**all white, italic-900 Montserrat, the `+` included** (never tinted). Inline it in
copy with `<span class="plus">AIS<span class="p">+</span></span>` (component lives in
the shared CSS / `tokens.css`).

There is no tier2 tier in this style yet — it's a full-screen event package, not a
talking-head overlay system. (A tier2 lower-third set could be added later.)

## Live-asset directives (Aidan, 2026-07-07 — BAKE THESE IN)

Standing rules from Aidan's revision passes on the Day 1 agenda walkthrough +
Get Set Up videos. Apply to ALL new AIS LIVE motion assets unless he says otherwise:

1. **All blue, for now.** Times, accent words, section labels, speaker/facilitator
   names, track labels: everything accents in brand blue `#37BDF8`. No coral, no
   yellow in main text or times. (Coral/yellow track color-coding is retired for
   motion assets until further notice; ambient bg glows may stay subtle coral.)
2. **No em dashes in on-screen copy.** Use commas or periods instead.
3. **No colored highlight strips** on the top edge of cards/boxes (no `border-top`
   accent bars).
4. **No marker dots/squares before eyebrow or section-tag labels** (kill the
   `.eyebrow::before` chip). Plain mono text, centered.
5. **AIS+ product mark is ALL WHITE, `+` included — never tint it.** The AIS/LIVE
   event mark stays solid (white AIS, blue LIVE, red dot); only headlines and
   times get gradients. (Details in "Product mark" + "What NOT to do" below.)
6. **Real sponsor logos, always.** Any sponsor mention uses the actual white
   logo art (HyperAgent, Glaido live in `video-projects/ais-live-loops/assets/sponsors/`).
   No text-only sponsor names, no placeholder boxes in delivered assets.
7. **Exact times + exact speakers** come from the latest agenda doc
   (currently v7.1, Google Doc `1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18`),
   all times Central, shown verbatim.

## Block-asset directives (Aidan, 2026-07-08 — BAKE THESE IN)

From the Block 1 Opening revision passes. Apply to ALL AIS LIVE block/loop
assets alongside the live-asset directives above:

1. **Speaker headshots fill top to bottom.** Solo cutouts
   (`ais-live-speaker-announcements/assets/cutouts-clean/`) must fill the frame
   height — never small in a corner. Working rule: 4:5 crops (1080x1350) at 96%
   of frame height, squarish chest-up crops at 88% (aidan-finnegan,
   dave-ebbelaar, devin-kearns, jon-morrow, kacper-rutkiewicz, nate-herk,
   tangy-frederick, anne-marie-enns), bottom-anchored, box shifted left so wide
   crops clear the text column.
2. **2+ speakers = the CIRCLE FORMAT.** Never overlap cutouts. Use the circular
   medallions (`ais-live-speaker-announcements/assets/medallions/`) stacked in
   a vertical column on the left, vertically centered: 2 people = 340px,
   3 = 280px, 4 = 220px circles, 20-30px gap. Reference:
   `video-projects/ais-live-block1-opening/_gen.mjs` portrait beat.
3. **Member-win cards.** Real community post screenshot framed RIGHT (rounded
   20px, thin white border, drop shadow, ≤840px tall), loose summary LEFT
   (eyebrow MEMBER WIN, chrome headline with the number accented blue, italic
   sub, name in blue mono). ~8s per card, after testimonial reels. Numbers
   verbatim from the posts. Curated pool + written summaries:
   `ais-live-block1-opening/assets/wins/` + the WINS array in its `_gen.mjs`.
4. **HyperAgent content = the 18:25 keynote**, not a 60s spot. Remuxed copy at
   `ais-live-block1-opening/assets/video/hyperagent-keynote.mp4` (keep voice
   audio). Plays once per block where slotted; the `hyperagent-white-big.png`
   logo card holds the slot otherwise. Confirm per-block with Aidan.
5. **Clay is OUT.** Not a sponsor. No placeholders, no mentions, anywhere.
6. **Glaido = the real lockup** (green G icon + wordmark, `glaido-white.png`),
   sized big (~150px logo height). The all-white icon treatment is retired.
7. **Delivery pipeline for assembled blocks:** HyperFrames render -> Drive
   block folder -> Aidan adds the music bed in Premiere -> the RingCentral
   compression pass (H.264 MP4 1080p, RF22 / 8 Mbps cap, AAC baked in,
   web-optimized/faststart) runs on HIS Premiere export, never the raw render.

## What NOT to do

- **Never** apply the chrome/blue/coral gradient to the AIS/LIVE mark — it stays solid.
- **Never** tint the AIS+ product mark — it's all white, `+` included.
- **Never** hard-cut between beats — a whip/streak must carry every transition, and
  beats must OVERLAP so the screen never fades to black between sections.
- **Never** scale or translate the text layer for "camera" motion — it softens the
  type (rasterize-then-interpolate). Move the background (`.bg`) instead; text stays crisp.
- **Never** digitally zoom a member `<video>` clip — frame-seek shake. Let it sit still.
- **Never** let the camera/ambient go fully static — depth and breathing are the identity.
- Don't use red for anything but the live-dot.
- Don't size two logos/marks by pixel-height blindly — match **cap-height** so a
  no-descender wordmark doesn't visually dominate (see `custom.sponsor`).
- Don't put more than one idea on a card; one beat = one statement.
