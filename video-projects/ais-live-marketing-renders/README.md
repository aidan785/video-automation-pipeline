# AIS LIVE — Marketing Asset Kit (video)

Branded motion-graphics cards for **AIS LIVE** (virtual event, **Sat July 11 + Sun July 12, 2026** · *Real Projects. Real Revenue.*). All assets lock **July 4, 2026**.

Built in HyperFrames (HTML-native video), fully on-brand per `AIS-LIVE-BRAND.md`. All clips **1920×1080, 60fps, H.264**, loop-friendly. This folder is the single drop point; sources live in the per-group projects under `video-projects/`.

## What's here (25 clips, 4 groups)

### `countdowns/` — #21 Week-of Countdown + #20 Registration Urgency (8)
| File | On screen | Plan # | Dur |
|---|---|---|---|
| `countdown-7.mp4` | COUNTDOWN · **7** · DAYS TO GO · *Saturday, July 11…* | #21 | 8.0s |
| `countdown-5.mp4` | …**5** DAYS TO GO | #21 | 8.0s |
| `countdown-3.mp4` | …**3** DAYS TO GO | #21 | 8.0s |
| `countdown-2.mp4` | …**2** DAYS TO GO | #21 | 8.0s |
| `countdown-1.mp4` | …**1** DAY TO GO · *Tomorrow — Saturday, July 11* | #21 | 8.0s |
| `reg-super-early.mp4` | Super early bird **ends soon.** | #20 | 8.0s |
| `reg-early-bird.mp4` | Early bird **closing.** | #20 | 8.0s |
| `reg-final-call.mp4` | Final **days.** (coral) | #20 | 8.0s |

### `moments/` — #22 We're Live + #11 Day-1 Outro (4)
| File | On screen | Plan # | Dur |
|---|---|---|---|
| `live-day1.mp4` | ● ON AIR · We're **live** · *Day 1 · Saturday, July 11* | #22 | 8.0s |
| `live-day2.mp4` | ● ON AIR · We're **live** · *Day 2 · Sunday, July 12* | #22 | 8.0s |
| `wrap-day1.mp4` | THAT'S A WRAP · Day 1 **done.** | #11 | 8.0s |
| `see-you-tomorrow.mp4` | DAY 1 COMPLETE · See you **tomorrow.** | #11 | 8.0s |

### `loops-tease/` — #1 Doors-Open + #15 Stage Backdrop + #24 September Tease (3)
| File | On screen | Plan # | Dur |
|---|---|---|---|
| `doors-open.mp4` | DOORS OPEN · *Real projects. Real* **revenue.** · seamless holding loop | #1 | 16s loop |
| `stage-backdrop.mp4` | Corner AIS LIVE mark, center kept clear for overlaid content · seamless | #15 | 16s loop |
| `september-tease.mp4` | COMING TO AUSTIN · **September.** · *Sept 18–20, 2026 · In person* | #24 | 11.2s |

### `transition-stings/` — #9 Transition / Break Stings (10)
Delivered earlier; copied here so the kit is complete. Full notes in `video-projects/ais-live-stings/NOTES.md`.
`sting_be-right-back`, `back-in-5`, `back-in-10`, `up-next`, `grab-a-coffee`, `starting-soon`, `lunch-break`, `welcome-back`, `brand-loop-a`, `brand-loop-b`.

`contact-sheet.png` shows a hero frame of the 15 new cards.

## Design decisions (carried from the stings)

- **Mark is live HTML text, not the PNG** — so the red live-dot can pulse (brand §4, the #1 motion rule). Solid §3.2 colors (#fff AIS / #37bdf8 LIVE), never a gradient (§3.5).
- **Live-dot pulse is the only ambient motion**; everything else is on the 1.6s beat (§10). Durations are 1.6s multiples (8.0 / 11.2 / 16.0) so every loop stays in phase.
- **Seamless loops** (`doors-open`, `stage-backdrop`): ambient-only, no entrance — dot pulse ends on rest scale, ring is invisible at every cycle edge, glow drifts on a sine yoyo, grid scans exactly one 24px tile. They tile perfectly for indefinite holds.
- **Message/countdown/tease cards re-animate** a short entrance each loop (eyebrow fade, clip-path word reveal, numeral pop, mark settle).
- **`live-day1/2`**: the word "live" carries the mark's live treatment (blue + red dot); the AIS LIVE lockup signs off below. Both dots pulse together on the beat — intentional.
- **Coral** only on `reg-final-call` (urgency heat). Coral on an accent word is on-brand; §3.5 only forbids coral on the *mark*.

## Decisions worth confirming

- **#20 pricing is templated, not literal.** I did not invent prices or tier dates. The cards read as deadline/urgency ("ends soon", "closing", "Final days"). Drop the real tier name + price + date into `ais-live-countdowns/_gen.mjs` (the `reg-*` entries) and re-render.
- **#24 September tease = the in-person flagship.** Brand surfaces #6 + #33 give "Austin, TX · Sept 18–20, 2026". If the September beat is something else (e.g. a cert cohort), the copy is a one-line edit in `ais-live-loops/_gen.mjs`.
- **Countdown cadence** is 7 / 5 / 3 / 2 / 1 (a typical drip, not every day). Add 6/4 by copying a `countdown-*` entry.

## Not built this batch (blocked on assets, not effort)

- **#25 Speaker Quote cards** — need the actual quotes (post-event).
- **#18 Speaker Announcement** — need speaker names + photos.
- **#10 Sponsor Stings / #19 Sponsor Announcement** — need Airtable / Glaido / Hostinger logo files.
- **#8 Member Awards** — need the member/award list.
- Not a HyperFrames job (real footage / NLE): #2, #3, #4, #5, #6, #7, #12, #23. Static / other owner: #13 (done), #14 (AME).

All of the above are fast to add once the content/logos arrive — same generator pattern.

## Regenerate / re-render

```bash
# resolve the working CLI (npx hyperframes resolves to a broken 0.6.107 here)
HF=$(find ~/.npm/_npx -path '*node_modules/.bin/hyperframes' | head -1)   # -> 0.4.32

cd video-projects/ais-live-countdowns      # or -moments / -loops
node _gen.mjs <slug>                         # regenerate all cards + set index.html to <slug>
node "$HF" lint .
node "$HF" render --quality high --fps 60 --output "renders/<slug>.mp4" .

# rebuild the combined contact sheet (after renders exist)
cd video-projects && node _contact-marketing.mjs
```

Shared brand engine: `video-projects/_ais-brand-kit.mjs` (mark, CSS, ambient motion, entrances). Each project's `_gen.mjs` is just a data table. Shell is **zsh** — loop with literal slug lists, never `for x in $var`. Keep exactly one root composition (`index.html`) per project; sources live in `cards/`.
