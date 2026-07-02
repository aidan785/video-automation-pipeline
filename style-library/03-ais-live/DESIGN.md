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
- Cut/transition: motion-blur **whip** + light streak on entry; exits whip up + blur
  (`power2.in`), or dolly-through-type on punchlines.
- Ambient (always on, deterministic, scaled to card duration): slow camera dolly,
  grid scroll, beam rock + flicker, glow drift, breathing vignette, pulsing live-dot,
  1.6s ring ping on the dot.
- Timing: ~5–8s per card. No static holds.

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

There is no tier2 tier in this style yet — it's a full-screen event package, not a
talking-head overlay system. (A tier2 lower-third set could be added later.)

## What NOT to do

- **Never** apply the chrome/blue/coral gradient to the AIS/LIVE mark — it stays solid.
- **Never** hard-cut between beats — a whip/streak must carry every transition.
- **Never** let the camera/ambient go fully static — depth and breathing are the identity.
- Don't use red for anything but the live-dot.
- Don't size two logos/marks by pixel-height blindly — match **cap-height** so a
  no-descender wordmark doesn't visually dominate (see `custom.sponsor`).
- Don't put more than one idea on a card; one beat = one statement.
