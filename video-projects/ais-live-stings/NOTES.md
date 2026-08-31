# AIS LIVE — Transition / Break Stings (delivery notes)

10 branded transition/break sting cards for AIS LIVE (virtual event Jul 11–12, 2026).
Built in HyperFrames (HTML-native video), fully on-brand per `AIS-LIVE-BRAND.md`.

## Deliverables

| # | Sting | Wording | Eyebrow | Accent | Duration |
|---|---|---|---|---|---|
| 1 | `sting_be-right-back` | We'll be right **back.** | INTERMISSION | blue | 8.0s |
| 2 | `sting_back-in-5` | BACK IN **5** MINUTES | BREAK | blue | 8.0s |
| 3 | `sting_back-in-10` | BACK IN **10** MINUTES | BREAK | blue | 8.0s |
| 4 | `sting_up-next` | Up **next.** | TRACK 02 | blue | 8.0s |
| 5 | `sting_grab-a-coffee` | Grab a **coffee.** | BREAK | coral | 8.0s |
| 6 | `sting_starting-soon` | Session starting **soon.** | STANDBY | blue | 8.0s |
| 7 | `sting_lunch-break` | Lunch **break.** | BREAK | coral | 8.0s |
| 8 | `sting_welcome-back` | Let's **go.** | WELCOME BACK | blue | 8.0s |
| 9 | `sting_brand-loop-a` | (mark only, no grid) | — | — | 6.4s |
| 10 | `sting_brand-loop-b` | (mark only, on grid + glow swell) | — | — | 9.6s |

All exported 1920×1080, 60fps, H.264. Final MP4s in `renders/sting_<slug>.mp4`.
Contact sheet: `renders/contact-sheet.png`. Verification stills: `frames/hero_<slug>.png`.

## Deliberate deviations from the literal brief (both for brand-correctness)

1. **The mark is live HTML text, not the supplied PNG.** The brand's #1 motion rule is the
   pulsing red live-dot; a flat PNG can't animate. The mark is rebuilt as text (white AIS /
   electric-blue LIVE / separately-animated red dot + ring) so the dot can pulse. It matches the
   `AIS-LIVE-BRAND.md` §3.2 mark spec pixel-for-pixel (Montserrat 900 italic, −0.03em, lh 0.9,
   0.08em word gap, dot 0.16em ⌀ top 0.08em ml 0.06em #FF3B30). The white-transparent PNG is kept
   in `assets/logos/` for reference.
2. **Solid mark colors, not a gradient.** Brand §3.5 forbids gradients on the mark, so the mark
   uses the solid §3.2 colors (#fff / #37bdf8), NOT the subtle gradient the `ais-live-ads` project
   used. This also sidesteps the `background-clip:text` edge-clipping bug from that project.

## Design decisions

- **Loop behavior — two philosophies.** Message + countdown cards play a short entrance (eyebrow
  fade, clip-path wipe on the line, mark settle) over the first ~1.4s, then hold the rest pose; on
  loop the entrance re-triggers. The two brand-loop cards have **no** entrance (ambient-only) so
  they loop perfectly seamlessly for long holds. (If you want the message cards seamless too, drop
  their `.from()` entrance tweens in `_stings.mjs`.)
- **Accent colors.** Blue everywhere except **coral** on `grab-a-coffee` and `lunch-break` (warmer,
  "take a beat" feel — coral glow blob + accent word + eyebrow). The mark itself never changes
  (always white/blue/red-dot). Coral on the *accent word* is on-brand (§6); §3.5 only forbids
  coral on the *mark*.
- **Durations are 1.6s multiples** (8.0 / 6.4 / 9.6) so every loop stays in phase with the
  live-dot's 1.6s pulse, per §10.4.
- **Ambient motion is fully seamless** at the loop point: dot pulse uses an even play-count so it
  ends at rest scale 1; the ring is invisible at every 1.6s cycle edge; the glow blob drifts on a
  sine.inOut yoyo (returns to origin with zero velocity); the grid scans exactly one 24px tile
  over the full duration (tiles seamlessly). No CSS `animation: infinite` — the render engine bans
  infinite loops, so all repeats are finite and computed from duration.

## Section 12 export checklist (per AIS-LIVE-BRAND.md)

- [x] Mark is Montserrat 900 italic, ALL CAPS, single line
- [x] Tracking −0.03em, line-height 0.9, word gap 0.08em
- [x] Glow only on dark grounds (all stings are onyx)
- [x] Live-dot #FF3B30 at 0.16em, top 0.08em, ml 0.06em
- [x] Live-dot pulses at 1.6s; ends on rest pose
- [x] Body in Inter, eyebrows JetBrains Mono +0.32em UPPER
- [x] One italic accent run per line (blue or coral)
- [x] Command-deck grid rgba(55,189,248,.065) at 24px cells
- [x] Glow blobs blur 140–150px, opacity 0.20
- [x] No red on type/surfaces; no gradients on the mark
- [x] Animations end on rest pose; loops phase with 1.6s

## Minor things to flag

- `brand-loop-b`'s mark glow rests at 30px (the low end of its 30→80px swell) rather than the
  60px static default the other cards use. Intentional for the swell loop; trivial to recenter
  (e.g. 45→80px) if you want uniform mark glow across all cards.
- Verified by reading rendered frames (not just lint): the hero/rest pose, the dot+ring pulse
  mid-flight, and the end frame for be-right-back; plus full-res spot-checks of back-in-10
  (two-digit numeral), starting-soon (longest line — fits one line), and brand-loop-b (large mark).

## Not in this batch (out of scope per the brief)

- Sponsor stings (Airtable / Glaido / Hostinger) — waiting on logo files.
- Doors-Open Loop and heavy sizzles.

## How to regenerate / re-render

```bash
cd video-projects/ais-live-stings

# regenerate all 10 sting sources from the data table
node _stings.mjs

# set index.html to one sting, then lint / render it
node _stings.mjs be-right-back
hyperframes lint .
hyperframes render --quality high --fps 60 --output renders/sting_be-right-back.mp4 .

# rebuild the contact sheet (after renders exist)
node _contact.mjs
```

Gotchas for the next session:
- The working CLI here is **hyperframes 0.4.32** run directly from the npx cache bin; `npx hyperframes`
  resolves to a 0.6.107 that exits silently in this env. Resolve the bin with
  `find ~/.npm/_npx -path '*node_modules/.bin/hyperframes'` and run via `node <bin>`.
- The shell is **zsh**: `for x in $var` does NOT word-split. Use a literal list (`for x in a b c`)
  or `${=var}` when looping over slugs.
- `stings/*.html` are the sources; the project root keeps exactly one composition (`index.html`)
  or HyperFrames flags multiple root compositions.
