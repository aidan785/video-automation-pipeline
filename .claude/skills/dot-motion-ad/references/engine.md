# The engine (templates/hp-teaser-engine.html)

This is a full copy of the delivered v1 composition. It's one file, about 1,370 lines.

## Composition shell

- Root `#proof`, `data-composition-id="hp-cg-proof"`, and `data-duration` MUST equal the JS `END`.
- Audio is sibling `<audio>` tags on separate track indexes:
  - music on track 2
  - VO on tracks 3 and 4
- Canvases:
  - `bg`: 2D dots and shapes, hidden
  - `gl`: WebGL2 metaballs, hidden
  - `fx`: hidden
  - `out`: the only visible canvas
  - plus an offscreen `sub` canvas
- Fonts: a Google Fonts `<link>` for Bricolage Grotesque 800, plus a hidden `.fontwarm` span so the font is loaded before canvas text draws.
- Timeline: `const P={t:0}`, then `tl.fromTo(P,{t:0},{t:END,duration:END,ease:"none",onUpdate:()=>draw(q(P.t))})`, then `tl.set({}, {}, END)`, registered on `window.__timelines["hp-cg-proof"]`.
- `q(t)` holds frames at `STEP_FPS` (18): `Math.floor(t*18)/18`. Set it to 0 for smooth playback.

## Helpers (top of the script)

- `seg(t,a,d)` gives 0..1 progress. `lerp`, `c01`.
- `bz(x1,y1,x2,y2)` is a cubic-bezier easing (Newton solve). Named eases:
  - `BREATHE` = (.5,0,.3,1), measured from the ad
  - `OUT` = (.16,1,.3,1)
  - `IN` = (.7,0,.84,0)
  - `GLIDE` = (.45,0,.55,1)
  - `SWEEP`
  - per-scene eases (`SUNE`, `FALLE`, `MFALL`, `SHIPCAM`, `BRK`, `E_ROW`/`E_COL`/`E_EXP`/`E_IMP`, ...)
- `hash(a,b,s)` is a deterministic integer hash. `vn(x,y,s)` is value noise. No `Math.random`.
- `wob(t,amp,period,decay)` is a decaying jiggle. `rot(x,y,a,ox,oy)` rotates a point.
- **Name collisions bite.** `bz`, `LAND`, `BR`, `NJ` were all already taken. Grep before adding a const (I hit FLAND/FALLE/BRAD/ENC renames).

## Render path per frame

`draw(t)` runs the following:

1. **Motion blur:** for k in 0..NSUB-1 (5), it calls `layers(t - SHUT*f*k/(NSUB-1))` and averages into `out` with `globalAlpha = 1/(k+1)` (a running average).
   - `SHUT = FR*0.75` (270° of a 24fps frame).
   - `f` scales the shutter per situation:
     - `0` across ground flips (`gAt(t) !== gAt(t-SHUT)`) or glitch frames
     - `0.25` on the very fast zoom bursts
     - `0.15` during the mask close
     - `0` where a scene carries its own smears (`mk`)
   - Check `mk` whenever a scene looks choppy.
2. `cornerSignal(t)`: SIGNAL mono glyphs drawn on `out` after the blur.
3. Headline text and end card drawn on `out` (crisp, not blurred).
4. 5% film grain: one 256px noise tile, offset per 24fps frame.

`layers(t)`:

1. `S = state(t)`.
2. Fill the ground, then draw `S.dots` in ONE path. Each dot is `[x,y,r]`, or `[x,y,r,sx,sy]` for an ellipse squash/stretch, with `boil()` drift applied.
3. Then, in order:
   - `S.streaks`: round-cap lines from the previous position, length capped at `r*cap`
   - `S.caps`: capsules / pills (roundRect)
   - `S.arcs`: spin smears
   - `S.blob2`: a noise-radius blob
   - `S.loco`, `S.disc`
   - `S.glyphs`: Menlo glyphs with alpha
4. WebGL metaballs `drawBlobs(blobSets, col)`:
   - NB = 48 balls × NS = 8 sub-sample sets.
   - The shader sums `r²/d²` per set, **clamps the field at 3 before fwidth** (otherwise the centres speckle), applies `smoothstep(1±fwidth)`, and averages the sets. That gives blob motion blur for free.
   - `state(t, true)` (`bo` = blobs-only) is the cheap half-step sample.
5. Composite `bg` + `gl` into `sub`, with `S.soft` px canvas blur when set (the ending stream).
6. Post-layers:
   - `S.post`: a disc drawn over everything (the seed dot over the closing zoom)
   - `S.train`
   - `S.mask` = [w,h,radius]: `destination-in` rounded-rect mask with cream `destination-over` behind it. This is the f852 frame-to-ball move.

**`S` fields** (reset each call): ground, dotCol, dots, blobs, blobCol, streaks, sun, glyphs, mask, arcs, blob2, train, loco, zoomC, post, headline, caps, card, disc, soft.

## Clocks

- **The ad clock.** Everything was built on the reference ad's timeline so Aidan's Studio frame numbers and the music line up.
- **`early(t)`** runs the opening up to the spear. **`late(t, S, bo, raw)`** runs everything after the spear lands, on the reference clock shifted by `SH()`:
  - `SH() = T_COVER() - 8.95`
  - `T_COVER = LAND + Z_DELAY + Z_DUR`
  - the spear's flight time is computed by `flightInfo()`
  - For his frame f: comp t = f/30, late = t - SH (about 1.411).
- **`LT(t)`** maps comp time to late time, with the stone beat compressed by `CFIRE` so that everything after `T_RESYNC` is back on the original frames. **Never add EXTRA time.**
- **Scene dispatch:** `fourDots(t,S,bo)` checks branches newest-first, by cf = (t+SH())*30:
  - T_CHIP 1360 → `chipScene` (+ VO pills, then `ending`)
  - T_NET 1298 → `netScene`
  - T_TV 1142 → `tvScene`
  - T_DNA 1113 → `dnaScene`
  - T_PL 1055 → `planeScene`
  - T_SK 1018 → `skeletonScene`
  - bulb/train → `coilScene`
  - balls/spin/train swirl
- **`gAt(tt)`** returns a ground-state id per time range: 0, 1, 2, 3, the mask, 10+skeleton strobe phase, 30 plane, 31 TV, 32 net, 33 chip. A change inside the shutter means no blur.

## Dot grid and rigs

- **Strict grid.** Dot diameter is about 88% of the pitch (the ad's grammar). Pitches used:
  - 14px for the hunters
  - 30px for fire, coin, horse and corn
  - 12px for the footage
  - 11–16px for the earlier footage
- **`cells(prims, P)`** rasterizes primitives onto the grid:
  - `["s",x1,y1,x2,y2,halfW]` segment
  - `["d",x,y,r]` disc
  - `["e",x,y,rx,ry,ang]` ellipse
  - Segment half-width must be at least about 0.65 × pitch, or diagonals break.
- **Rigs** are functions of time that return primitives (`hunterPrims`, `horsePrims`, `personPrims`, plane grid, ...). Figures run cycles analytically.
- **`anchorsOf` / `anchorAt`** address points by (primitive index, parameters), so morph particles chase the live pose.
- **Masks for shapes:**
  - offscreen canvases sampled per frame (the freight train `TM`, the Tesla coil `TC`)
  - point-in-polygon (the corn traced from his reference frames)
- **Particles** follow bezier arcs with momentum and a cascade delay. Spins are one analytic angle function (`spinA`), and the morph rides its deceleration.

## Boil and grain

- `boil(x,y,t)`: noise drift of ±2.2px and ±7% radius on every dot. Streaks use the same drift, so dots don't hop when they start moving.
- Grain at 5% everywhere, and 16% on the end card.

## Performance

- Most frames take about 15–24ms. The footage grid at 160x90 is 14,400 dots × 5 sub-frames, which is fine.
- If Studio stutters, check for CPU metaballs, not the dot count.
