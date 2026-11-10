---
name: dot-motion-ad
description: Recreate an After Effects style dot / halftone motion ad (the ChatGPT "Intelligence Age" spot is the gold standard) shot for shot in HyperFrames, in a brand's identity, with Aidan's motion rules (match cuts, momentum across every cut, continuity of dots, motion blur, camera always moving). Covers reference breakdown, the canvas + WebGL dot engine, footage-to-dots sprites, music alignment, voiceover, the ending/end card, review loop, render and Drive delivery. Also holds the Humanly Possible dot concept (dots = energy / life force, logo = the heart) and the episode-intro format (30 s to 1 min dot story that reveals nothing, then Jillian's intro). Use when asked to make a dot ad, halftone ad, "evolution of progress" teaser, an HP episode intro / show open / dot story, recreate the ChatGPT/OpenAI ad, build or edit the Humanly Possible teaser ("Original with Voice", hp-teaser-pack-2/v1-voiced), write Jillian a VO script, or continue video-projects/hp-teaser-cg-proof.
---

# Dot motion ad (ChatGPT-ad recreation method)

Built 11/3/2026 for the **Humanly Possible landing-page teaser** (`video-projects/hp-teaser-cg-proof/`, delivered as "HP Teaser - ChatGPT Dots - v1.mp4"). **The current teaser is "Original with Voice" v2** (`video-projects/hp-teaser-pack-2/v1-voiced`, delivered 11/5), and as of 11/5 the dots are the show's whole visual idea: every episode opens with a dot story. Everything below came out of one long session of Aidan directing scene by scene. Every rule in `references/aidan-motion-rules.md` exists because he corrected something. Read it before touching motion.

## What this is

One HyperFrames composition. A single canvas renderer, not DOM clips, draws every frame from a pure function of time: `state(t)` → dots/blobs/glyphs → motion-blurred composite. Scenes hand off through shared dots (scale-through, invert match cut, morph, mask), never through cuts. Real-world subjects (wave, ship, skeleton, TV clips) are video footage turned into luminance sprite sheets and halftoned on the same dot grid.

## Read first (in this order)

0. `references/show-concept-and-intros.md`: what the dots MEAN (energy, not cells), the logo as the heart, the episode format, open questions. Read before any HP intro or teaser work.
0b. `references/teaser-v1-voiced.md`: the current teaser, how it is built (build.py + patches), every 11/5 and 11/6 (v3) change, the 17 VO lines, deliverables and Studio gotchas.
1. `references/aidan-motion-rules.md`: the non-negotiables, each with the correction that produced it.
2. `references/reference-analysis.md`: the ChatGPT ad broken down into a shot table, a transition table, 17 grammar moves and the story arc, plus measured easing.
3. `references/story-hp.md`: how the ad's "evolution of progress" story maps onto Humanly Possible, and the teaser drafts that were rejected first.
4. `references/engine.md`: how `templates/hp-teaser-engine.html` works (clocks, state, blur, metaballs, grid, held frames).
5. `references/scene-cookbook.md`: every scene that was built (frames, technique, parameters, what was rejected).
6. `references/footage-to-dots.md`: sprite pipeline, tracking, tone curves, texture trick, sourcing (Pexels, archive.org, Higgsfield prompts).
7. `references/audio.md`: music identification and alignment, loudness matching, Jillian VO picks via gws, the VO chain, ducking, the VO-driven dots.
8. `references/identity-and-ending.md`: HP palette and type, uppit text reveal, SIGNAL corner code, ending sequence, end card.
9. `references/workflow-tools-delivery.md`: the review loop, Studio, shot sheets, glitch scan, archives, render, Drive upload.
10. `references/feedback-log.md`: Aidan's messages in order. Re-read the latest ones before each change.
11. `references/build-log.md`: every version of every scene with its parameters (the raw project log).
12. `references/method-memory.md`: the condensed method notes.

## Files

- `templates/hp-teaser-engine.html`: the delivered v1 composition (the engine plus all scenes).
- `templates/_player.html`: a fallback real-time player.
- `templates/v1-voiced/`: snapshot of the current teaser's generator (build.py, patchA.json, patches/*.js incl. xray.js, the logo dot targets mark-dots.json) and `vo-script-template.html` (HP-branded VO script PDF layout). The live project is `video-projects/hp-teaser-pack-2/v1-voiced`; edit there and run `python3 tools/build.py`, never hand-edit its index.html.
- `scripts/fish_tts.py`: zero-shot Fish Audio clone of Jillian. `scripts/pose_track.py`: clip -> joints JSON.
- `scripts/footage_to_sprite.py`: video → luminance sprite sheet, with optional tracking and texture layer.
- `scripts/vo_polish.sh`: the placeholder VO chain.
- Assets used by the template live in `video-projects/hp-teaser-cg-proof/assets/` (sprites, logo, audio).

## Workflow (gates)

1. **Study the reference frame by frame before animating.** Sample every frame at 24fps around each transition (labelled strips). Measure motion by tracking blob radius and position per frame. Write a shot table and a transition table.
2. **Review before building.** Give Aidan a review of the motion, the design style and the reference's story, plus how it maps to our brand. Wait.
3. **Small motion proof first** (about 10s), then **build scene by scene**. Get each scene approved before the next ("Remove all those new things. Let's just build scene by scene.").
4. **Every iteration:**
   - Edit.
   - Lint.
   - Shoot a PNG sheet around each changed transition and `Read` it.
   - Run the glitch scan.
   - Restart Studio on its port and open it for him.
   - Archive the previous version into `video-projects/<slug>-archive/`, NOT inside the project, or Studio hangs.
5. **His frame numbers are Studio 30fps frames** (f655 = 21.83s). Re-read them before every timing change, and never drift a beat he set.
6. **No MP4 render until he says go.** Deliver with gws to the Drive folder he names.

## Hard rules (short form)

- **Speed crosses every cut.** Every transition is its own easy-ease, as a match cut: either A exits fast → B enters fast and settles, or A winds up slow → accelerates into the cut → B lands fast and settles. Never stop then restart.
- **Continuity.** The next scene starts from the exact last-frame dot positions. No jumps, teleports or freezes.
- **The dots are the material.** What's on screen becomes the next thing. No separate effect particles that appear from nothing.
- **Figures are already moving when they form.** Particles chase anchors on the live, animated rig.
- **The camera always moves.** It zooms in before the event lands, and the momentum carries into the next scene.
- **Motion blur on everything.** 5 sub-frames over a 270° shutter, or path smears. A blur window must never cross a hard ground flip.
- **Glitches are clean.** No decorative glyph flecks. When Aidan says "glitch" about our output, he means an unwanted jump: make it smoother.
- **Never push later beats off the music** or off his frame numbers. Absorb new motion inside the existing window.
- **Make it readable.** If he can't tell what a footage scene is, use a finer grid, continuous tone and local contrast (see footage-to-dots).
- **The dots are energy, never biology.** No cells, tissue, anatomy or anything morbid. Every dot story comes home to the HP mark (the heart).
- **All dots, no footage.** Footage halftones were rejected; the last one (x-ray skeleton) is now a procedural dot lightbox.
- **People are stick rigs or the v2 human-dots style.** Never filled-blob humanoids.
- **Only Jillian's voice** (real takes or the Fish clone). Never another TTS voice. Spell it Jillian and Kodi.
- **Prefer v1's original craft** over new scenes bolted on (r4 lesson). When he asks for an extra beat, try it as a backup-able insert he can switch off.
- **Scratch media stays out of `assets/`** and restart Studio after each build (it hangs on hot-reload).
- **People read at a glance** (side-on, head clear of tools and arms), **the group stays centred and in frame**, no ground line under figures, and scenes **go forward into the next scene's dots, never back** (rules 38-42, cookbook 17b).
- **Casual updates, no em dashes.**

## Starting a new dot ad

1. `mkdir video-projects/<slug>`, then copy `templates/hp-teaser-engine.html` → `index.html` and add `hyperframes.json` + `meta.json`.
2. Strip the scene branches you don't need (`early`, `late`, `fourDots` chain), and keep the infrastructure: helpers, shader, `cells`, `boil`, grain, `cornerSignal`, `layers`, `draw`, the held-frame timeline.
3. Change `OX`/`CR` (ground/dot colours), `END` and `data-duration` (they must match), and the audio tags.
4. Studio: `../../.hf-cli/node_modules/.bin/hyperframes preview --port <port>` from inside the project.
