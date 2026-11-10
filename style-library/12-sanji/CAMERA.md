# Sanji · CAMERA bible ("screen-cam")

How the camera moves over **screenshots and screen recordings** to point at things. Camera only: no styling was taken from the reference. The reference is a 12:25 screen-recording tutorial (YouTube `_fIoJ_ywGfY`, 1920x1080, **30fps**). I tracked the camera on **every one of its 22,359 frames**: per-frame similarity transform (zoom, pan, rotation) from ORB features plus RANSAC, then grouped into moves. I also read every frame at 30fps through the key move windows (`references/camera/framestrips/`, frame numbers burned in). Curated stills are in `references/camera/01-10*.jpg`, and the raw move list (442 moves with start, duration, zoom and pan) is in `references/camera/moves.json`. Code: `lib/camera.js` (`CAM`). Reference card: `cards/tier1/t1-camera-screen.html`.

## 1. The idea in one line
The camera is a pointer. Every move lands on exactly one thing (a number, a line of chat, a button, a face), holds long enough to read it while slowly creeping in, then usually punches back out to context. It never wanders.

## 2. Measured numbers
| Measure | Value |
|---|---|
| Moves per minute | **35.6** (442 moves in 12:25; plus 90 hard cuts) |
| Mix | 184 push-ins, 165 pull-outs, 93 pans |
| Push duration | median **0.52s** (p25 0.43, p75 1.04) |
| Push amount | median **x1.36** (p25 x1.18, p75 x1.67, biggest ~x3.2) |
| Pull duration | median **0.47s** (p25 0.40, p75 0.57) |
| Pull amount | median **x0.76** (p25 x0.64) |
| Pan duration | median **0.30s** (p25 0.23, p75 0.47); peak ~34px/frame, p90 147px/frame |
| Speed curve | `cubic-bezier(.42, .16, .2, .96)` (fit to the median progress curve of 242 moves, mean error **0.002**). Peak speed at ~33% of the move: soft first 2 frames, fast middle, long settle |
| Hold between moves | median **0.77s** (p25 0.17, p75 1.5) |
| Punch pattern | push then pull back within 6s: **83 times** (the signature) |
| Pan inside zooms | 133 of 184 pushes also travel >150px (the zoom aims at an off-centre target) |
| Hold creep | 39% of hold frames keep moving: median **1.1% zoom per second** (p75 1.6%), drift ~3px/s |
| Motion blur | frame sharpness drops to **~1/3** at peak speed (Laplacian 43 to 13-15) and comes back on landing |

## 3. The moves (use these names)
| Move | `CAM` call | Recipe | When |
|---|---|---|---|
| **Punch** (signature) | `cam.punch(tl, at, rect, hold)` | push 0.52s to the rect, creep for `hold`, pull 0.47s back to wide | point at one detail and return to context |
| **Push** | `cam.push(tl, at, rect)` | 0.52s, measured curve, zoom in log space, blur scales with velocity | go to a detail and stay |
| **Pull** | `cam.pull(tl, at, rect?)` | 0.47s back to wide (or a larger rect) | reveal context, end a beat |
| **Pan** | `cam.pan(tl, at, rect)` | 0.3 to 0.45s same-scale slide to a neighbouring detail | chat line to chat line, field to field |
| **Crash** | `cam.crash(tl, at, rect)` | 0.3s hard push, `cubic-bezier(.55,.05,.15,1)`, heavy blur | enter a new screen or button, used like a transition |
| **Creep** | `cam.creep(tl, at, dur)` | continuous ~1.1%/s push about the frame centre, sine.inOut, no blur | every hold. A dead-still screen reads as a screenshot, a creeping one reads as a camera |
| **Frame** | `cam.frame(tl, at, rect)` | instant cut to a framing | start state, or a hard cut between two framings |

`rect` = the region of the stage (in its own pixels) that should fill the frame. The rig matches aspect, adds 8% breathing room, never shows past the stage edge, and caps zoom at x3.2.

## 4. Grammar (from the frame reads)
- **Aim, then move.** Most pushes also travel toward the target, so the detail ends near frame centre. Push to the thing, don't zoom on the middle and hope.
- **Blur sells speed.** At peak speed the whole frame is smeared (strongest on zooms). It is sharp again within 2 to 3 frames of landing. No blur during creep or holds. Type must be crisp when it's read.
- **Fast in, long settle.** 0.5s moves with ~70% of the travel done by the midpoint. The settle is what makes it feel human, so never use linear or symmetric sine on a move.
- **Rhythm:** move, hold 0.8 to 1.5s (creeping), move. Big moves (x2 to x3) come in pairs: punch in, read, punch out.
- **Zoom-resolve entries:** a new screen often arrives as a crash zoom out of blur that lands into a creep. That's the screen-recording version of a transition.
- **Long float:** on a tall single asset (portrait clip, phone screen) the camera slowly floats along it for 2 to 3s instead of punching.
- **Context first:** start wide for ~0.5 to 0.8s so the viewer knows where they are before the first punch.

## 5. Rules for cards
- Wrap the screenshot / `<video>` / UI in one `.stage` div sized to the frame and give *that* to `CAM.rig`. Never transform a `<video>` directly (render contract), always the wrapper.
- No `will-change: transform` on the stage. Chrome would scale a cached bitmap and type goes soft at x2 to x3.
- Use real screenshots at 2x when they'll be zoomed past x2. DOM-built mock UIs stay sharp at any zoom.
- Captions, callouts and labels live OUTSIDE the stage (they don't zoom with the camera). Time them to land after the move settles (+0.15s).
- Everything is deterministic: each move's start state is planned at build time, so the timeline seeks in any order.
