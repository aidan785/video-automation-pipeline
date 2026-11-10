# "Original with Voice" (v1-voiced): the current HP teaser, 11/4 to 11/5/2026

`video-projects/hp-teaser-pack-2/v1-voiced`, Studio :3052. THE teaser for now (Aidan, standup 11/4). v2 delivered 11/5. This file covers how we got here after the v1 ChatGPT-dots delivery, the build system, every change, and the gotchas.

## Road from v1 to here (what the team rejected and why)

1. **v1 "ChatGPT Dots"** (hp-teaser-cg-proof) delivered 11/3. Team (Kodi): carry dot creations through ALL scenes (moon/ocean were real footage); v1 loses the HUMAN side (tech advancing, not people improving their lives; no human heard until Jillian, jarring).
2. **Pack 1** (`video-projects/hp-teaser-pack-1/`, v1.1 to v9 + v10-v12 stick/halftone round). Rules learned: no filled-blob humanoids; halftone live people "don't make sense"; only Jillian's real voice or her clone.
3. **Team round 2** (Kodi + Jillian): first teaser must be HUMAN; v1 becomes a later "wow" teaser with a shorter opening; Jillian offered to re-record (fix the "silo" sound).
4. **Pack 2** (`video-projects/hp-teaser-pack-2/`, ports 3041-3049, brief PACK-2-BRIEF.md): same nine concepts with non-member examples; favourite = v5-hybrid; Fish clone VO with Jillian's real voice at the end. v5-hybrid-v2 (:3051) retimed to a bar cue sheet (Neck Brace = 120.35 BPM, beat 0.49855 s, grid t(k)=3.483+0.49855k). Paused.
5. **23 team samples** on Drive "Teaser Samples" 1uhAXCep7pJ4QCqC-m7ZzdryjM2jY5tMP with a READ ME doc.
6. **v1-voiced**: original v1 + Fish Jillian VO + humans per era. r3 tried v5h2's AI chat/example scenes; Aidan: "look really bad". **r4 LESSON: he prefers v1's original ending craft over newer scenes.** Reverted to v1's own ending. r8 word-synced captions. r10 delivered as v1 (59.0 s).
7. Real-footage (v1-real-footage :3053, Higgsfield Kling) and Wes Anderson (v1-wes :3054) cuts: shelved, AI footage reads as AI. We're back on dots (see `show-concept-and-intros.md`).

## Build system (never hand-edit index.html)

- `tools/build.py` inlines engine A (`tools/srcA.html` = cg-proof v1) and engine B (`tools/srcB.html`), applies string patches (`sub()` asserts the anchor exists, `patch_a`, plus `tools/patchA.json` start/end/file block replacements from `tools/patches/*.js`), builds the music bed + VO mix, writes index.html.
- Engine A frame = `cf = (t + SH()) * 30`. Engine t is offset by SH(); inserts that need root time use `window.__RT` / cf/30.
- Python %-formatted blocks: write a JS `%` as `%%`.
- Constant names collide with engine globals (T_TXT already existed): prefix new ones (T_MKTXT, T_MKSOL, T_MKSH).
- VO table in build.py: `VO_A` (tools/vo-a.json, history lines) + `VO_B` (ending lines) as [id, file, start, caption, n]; n>=13 = gold "humanly possible" caption.
- Captions: `tools/caption_words.py` runs Scribe on every placed clip -> `tools/words.json` (worst offset 20 ms).

## What changed 11/5 (r11 to r13j = v2)

| Ask (Aidan) | What we did |
|---|---|
| VO "never about the tool, it's how humans use it", no added time first, then "extend during the transition", then "just the VO, no animation" | Fish line split: vo-n2a "But it was never really about the tool." @49.75, vo-n2b "It was always about what humans do with it." @51.95. Root clock holds engine A at 0.1x over [49.5, 54.5) so the four talking pills speak both halves; ending + real Jillian lines shift +4.5 s; END 63.5. Animated inserts (tools->people r11b `tools_ins.js`, wheel->carriage r12 `tools_wheel.js`) both cut; `TOOLS_ANIM = False`, kept on disk. |
| "Let the music flow where we originally got it" | `flow_bed()`: one continuous Neck Brace bed (teaser t = NB t - 103.7, corr 0.998) instead of the pad splice he heard as a bad cut; gain envelope follows r10, held through the insert. |
| Remove the farmer, fill in the dots | `tools/patches/farmerfn.js` returns null first; field uncarved. |
| Ray "lines" should be dots, with depth blur | `S.ddots`: after T_EXP+16 streaks become dots in 5 blur bands [0,2,4,6.5,10] by distance from centre (z = hypot(x-960,(y-540)*1.7)/1050, blur 10z², r 2.6+10z^1.6); speed smear blur = min(6, L*0.09), batched per band; S.soft 2.2 -> 0.6. |
| Dots form the HP logo, swoop from the bottom, fill bottom to top, motion blur, drift left as dots then solidify, Uppit words, no stem drop | `tools/mark-dots.json` (775 pts, full mark at 9 px pitch, 330 px tall, from hp-mark-cream.svg). Pair rays to targets by x-sort; stagger 11*(1-v) frames bottom first; quadratic bezier path dipping to y=1340; E_FORM bz(.45,0,.2,1). Each dot glides left on its own beat (sd = 3.5u+1.5v+1.5·hash, GLIDE over 22 f, 18 px lift) from (960,540,h330) to (599.6,540,h128.4); solid MKI crossfades in at its final box; "Humanly"/"Possible" SVGs Uppit (blur 6, rise 19 px, 21 f, 1.2 f stagger). The stemless-square + stem-drop version (r13) was rejected. |
| Skeleton video looks out of place: X-ray screen, bone hand, keep the flash | `tools/patches/xray.js`: procedural lightbox (590-1330 × 70-1030, frame 26, film clip), bone hand from capsules + discs (ulna/radius, 8 carpals, 4 fingers + thumb, joint gaps, knuckle heads), small wave around the wrist, bright cortical edge, halo, scan band, same strobe phases. Last footage scene removed. |
| Studio glitchy at the end | draw(): break the sub-frame loop when the shutter multiplier is 0; batch blur strokes per band. ~8 ms/frame. |

## What changed 11/5 to 11/6 (r14 to r16b = v3)

| Ask | What we did |
|---|---|
| Kodi: four-dot hold too long, AI line on the chip | vo-07 "Now we're in the age of AI." moved to 45.4 (on the chip); the 0.1x engine hold is gone; END 60.1. T_VO patched to vo-07's real start (pills had lip-synced 2 s late). |
| Animate "never about the tool / what humans do with it" | `patches/tools_story.js` insert (scene-cookbook 17b): tools burst out of the pills, people form out of their tools, explode into the depth rays. Built 15 variants first (`variants.tsv`, VAR/STICK/SRC/PC/EXIT env knobs); the approved one is the default build. |
| People don't read, ground line, back to four dots, spear off frame | Redrawn poses, no ground line (SRC=tool default), direct explosion into the ending's ray dots, centred row with small travel. |
| "Every week" -> "every episode" | Not swapped yet: the cut still has the real "Every week" (vo-real-l07b @51.95). Fish clone ready at `assets/vo-fish-ep.m4a` (-16.6 LUFS); Jillian may re-record. The script PDF already says "Every episode". |

Insert gotchas: the insert IIFE can't see engine-A consts, so build.py injects `__TVO__`, `__VOENV__` etc. as placeholders and exports `window.__END`; a build.py `sub()` string is NOT %-formatted (write `%`, not `%%`, unless it's inside the `% MARK` block); the dive variants (EXIT=dive) still use the old fold ending.

## Gotchas (this project)

- Studio hangs (node 100% CPU) if a big working WAV sits in `assets/`: keep scratch media in `tools/_work/`.
- Studio also hangs on hot-reload after every `python3 tools/build.py`: restart it after each build (kill :3052, `.hf-cli/node_modules/.bin/hyperframes preview --port 3052 --foreground --no-open`, run in background).
- Grab frames with `scripts/_v1v-shots.mjs` over a separate `npx serve . -p 8093 -n`, not `hyperframes snapshot`, while he's in Studio.
- A cut prim removes everything under it: sample rim and hub separately (wheel spokes vanished).
- macOS has no `timeout`.

## Deliverables

- v1 (r10, 59.0 s): Drive "Original w/ Voice" 11wz_NAGSM2OLQy6FblwPqNIW4qgZP5va, "HP Teaser - Original with Voice - v1.mp4".
- **v2 (r13j, 63.53 s, 1080p30, -17.2 LUFS):** `renders/original-with-voice-v2.mp4`, same folder, "HP Teaser - Original with Voice - v2.mp4" (1VkeiuF6km_bGPxRYVnMl6Xp3qGYTojmb). Not yet reviewed.
- **Jillian VO script PDF** (so she can re-record the 15 Fish lines): `v1-voiced/script/HP Teaser VO Script - Jillian.pdf`, built from `script/jillian-vo-script.html` (HP light mode: oxblood on cream, Bricolage + Inter Tight, hp-horizontal-pulse logo; full-bleed `.pg` Letter pages, `@page margin 0`; printed with headless Chrome `--print-to-pdf --no-pdf-header-footer`). Lines + timecodes come from `tools/scribe/*.json`, target length = first-to-last word. Lines 16-17 are already real Jillian takes (shown greyed, "Recorded"). Uploaded with the dots doc PDF to Drive folder 1et1MU3iF9RhVN_3ckhObzcSspH-mF4l6.
- **v3 (r16b, 60.14 s):** `hp-teaser-pack-2/_renders/v3/HP Teaser v3 - Original with Voice.mp4` (rendered 11/6, not uploaded yet). 15 tool-section variants: Drive 14oRLUwUqtrqz5xZwL1V2SAJX5XJ7YRMd. 9:16 + 1:1 of v2 via `tools/aspect.py`: Drive 1bVD7sw0ztDFQEN9q1rbXpOlntqoVo-WR (redo from v3 if asked).
- Archives: `hp-teaser-pack-2/_archives/` (+ r15/r16 tools_story.js, r15 build.py) (v1-voiced-r10, r11e-no-anim, r11/r11b/r12b/r13/r13f-stemdrop/r13g/r13h build.py, farmerfn-r11c.js).

## The 17 lines (v2 order, root time)

1.9 It started with hunters and gatherers, just trying to feed their families. / 11.25 Fire kept us warm. / 14.92 Then the wheel carried us farther. / 18.45 We learned to farm, and grew enough to feed our towns. / 23.85 Ships carried us across the oceans. / 30.5 Trains brought us back together. / 32.35 Then Edison lit up our nights. / 34.2 X-rays, / 35.3 Rockets, / 36.89 and DNA took us further than ever. / 39.45 And we watched it all, together. / 43.4 Then the internet connected us all. / 47.33 Now we're in the age of AI. / 49.75 But it was never really about the tool. / 51.95 It was always about what humans do with it. / 54.65 Every week, we sit down with someone who reached what they thought was out of reach. (REAL L07-b) / 59.57 With AI, more is now humanly possible. (REAL L01)

## Still open

- Music is the uncleared Neck Brace rip (temp).
- Jillian's consent for the Fish clone unconfirmed; her re-records replace lines 1-15.
