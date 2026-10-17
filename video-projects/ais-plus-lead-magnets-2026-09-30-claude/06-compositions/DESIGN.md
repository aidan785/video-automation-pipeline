# Dark Glass (AIS lead magnets + AIS+ VSL)

Dark-mode translation of the approved White Glass HyperFrames system
(`video-projects/ais-live-ai-os-ads/hyperframes-white-glass` + `-vertical`). Same geometry, motion and hierarchy. The palette and materials are inverted for a deep navy canvas.

## Style prompt
Calm, premium, Apple-like. A deep navy-charcoal canvas lit by two soft blue light pools. Layered translucent glass panels with a bright top edge, gentle blur and broad soft shadows. One idea per scene: an eyebrow, a two-line Inter headline, one glass illustration. Nate sits in a large rounded window, naturally exposed, never graded dark. Readable caption pill low and centered. Motion eases in with blur-to-focus and a gentle stagger; scenes hand off with a soft blur crossfade.

## Colors
| Token | Hex / value | Role |
| --- | --- | --- |
| canvas | `#070B12` | stage background (solid, plus radial light pools only; no full-screen linear gradients, to avoid H.264 banding) |
| pool | `rgba(38,120,190,.20)` / `rgba(55,189,248,.10)` | soft radial light behind the glass and the speaker window |
| glass | `linear-gradient(135deg, rgba(255,255,255,.11), rgba(255,255,255,.04) 55%, rgba(110,190,240,.07))` | panel fill, with `backdrop-filter: blur(26px) saturate(1.4)` |
| glass edge | `rgba(255,255,255,.13)` border, `rgba(255,255,255,.22)` inset top highlight | soft edge highlight |
| text | `#F2F6FA` | primary (headlines, card titles, captions) |
| text-2 | `#A6B6C6` | secondary (sub-lines, labels) |
| text-3 | `#8397AA` | tertiary (small caps labels, 18px+ only) |
| accent | `#37BDF8` | AIS blue: eyebrows, icons, key numbers, caption emphasis. The only hue. |
| accent-fill | `rgba(55,189,248,.13)` | icon tiles, status pills |

Red is not used (no LIVE dot). Five colors max, one accent.

## Typography
- Inter only. Headlines 600 to 640 weight, 88px landscape and vertical (78px when long), tracking -0.052em (slightly looser than White Glass because light-on-dark reads heavier).
- UI 450 to 560, captions 500 at 35px (38px vertical), `font-variant-numeric: tabular-nums` on numbers.
- Minimum sizes: 60px headlines, 20px body, 18px labels.

## Layout
- **16:9:** 96px margins; left editorial column (padding 177 / 900 / 155 / 96); speaker window at (1080,151), 744x773, radius 40; caption pill centered, top 965; brand top-left (96,63), header note top-right.
- **9:16:** brand (64,88); eyebrow, headline and glass UI centered in the top half (content starts at y 250, clear of the Reels/Stories top overlay); caption pill in the gap at y 932; speaker window at (64,1080), 952x720, radius 44. Nothing important below y 1500 except Nate's torso (bottom UI overlay zone).
- **VSL:** same 16:9 frame with calmer pacing. Dense frames (offer, proof) use stacked glass cards in the left column, never over Nate.

## Motion
- Entrances 0.5 to 0.8s: scene blur 11px to 0, x 26 to 0 (`power3.out`); eyebrow y 12 (`power2.out`); headline lines y 22 + blur 6, stagger 0.10 (`expo.out`); glass items y 23, stagger 0.085 (`power3.out`).
- Scene hand-off = blur crossfade: outgoing blur 10px, x -22, fade over 0.27s (`power2.inOut`), overlapping the incoming entrance.
- Word-synced reveals land 0.1 to 0.2s before the spoken word, never late.
- Ambient: a slow sheen across glass, reflection drift (`sine.inOut`). No loops over a scene's length.
- Captions: phrase groups of 2 to 6 words, 0.16s rise-in, one group at a time, numbers and product names in accent.

## What NOT to do
- No giant italic broadcast headlines, grids, grain, crosshairs, neon outlines, whips or glitch.
- No AIS Live wordmark, red LIVE dot, event dates or ticket offers.
- No opaque dark rectangles pretending to be glass. No dark grade on Nate.
- No invented testimonials, comments, product screens or claims. Product demos use real captures only.
- No text over Nate's face; no caption over the speaker window in 16:9.
