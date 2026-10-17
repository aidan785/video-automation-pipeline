# Adobe Transfer 1+2+3 (2026-09-07) — GPT-6 Astra x Blender character animation tutorial

**Final:** `assets/clean-v3.mp4` — **15:00.8** (900.77s), 3840x1080 30fps (OBS screen-left / webcam-right, same layout as the source). verify-cuts PASS on round 3: residual pauses 0 beyond the five intentional demo beats · phrase checks 82/82 · no residual repeats · rendered 900.77s vs EDL 899.88s (drift 0.89s over 165 joins, linear r²=0.984, max residual 0.13s, no jumps = concat padding) · fresh-transcript retake read clean · every join frame-checked (v2 sheets + the one join that moved in v3).
**Delivered:** bit-identical copy at `~/Projects/Adobe Transfer Folder/GPT-6 Astra Blender Animation Tutorial - Edited.mp4` (+ `.cutlist.md`). Not yet reviewed by Aidan.
Source: `~/Projects/Adobe Transfer Folder/1.mov` (33:08.2) + `2.mov` (5:42.6) + `3.mov` (3:25.7), concatenated losslessly in order = 42:16.6 raw, 3840x1080 30fps OBS (screen left / webcam right). Project: `video-projects/adobe-transfer-3part-0907/`.

## What the video is
Aidan connects GPT-6 Astra (via the Codex app + the official Blender MCP) to Blender Studio's Storm rig: intro showcase (the "6-7" gesture animation, ball pickup, sit/stand, walk cycle, ladder-climb scene, cliff jump-scare scene), GPT-6 vs Fable 5.1 stats on the OpenAI site, Codex + Blender MCP setup walkthrough, a wave prompt + iteration, facial expressions, and a Backrooms scene with a camera-cut story, played back with sound at the end.

## Pipeline numbers
- Raw 42:17 → silence pass 17:22 (58.9% removed; 173 keep ranges). Biggest holes: the Blender/Codex connection wait (18:58–23:23, 4:25), the Backrooms generation wait + phone call (34:14–38:58, 4:44), the facial-expression wait (29:19–32:08, 2:49), the wave wait (23:58–26:48, 2:51), the intro scene-loading fumbles (0:30–1:43, 2:20–2:47, 2:57–3:44, 5:11–5:47).
- 26 transcript token fixes before planning (17 stretched Scribe tokens incl. two phantom tokens fully inside silence — "I" 0:51–1:43 and "Yo," 34:26–36:22 — plus 9 mid-length tokens hiding sub-second pauses), each end taken from an isolated Scribe pass on the slice (`assets/iso/`), not the -30dB edge.
- All 94 wordless gaps ≥1.5s isolate-transcribed individually: clean, except two quiet false starts at 17:04 ("Because… if you") that the silence cut removes, and the phone call.
- Mistake pass: 74 editorial cuts (137s) → 15:04.6 (clean-v1). The mechanical detector found 8 (all folded in).
- Round 2 (one re-encode from source, `_patch-keeps-v2.mjs` + `flubs-v2.json` + 6 residual trims): dropped the doubled "And then stand right back up." (kept the silent rise), restored the full first "rigged," and dropped the clipped "ri-" fragment v1 had kept, cut "Um, and" before "it's especially insane" (the m ran into "and" and the v1 join was heard as "I mean, it's"), cut an "s-" false start before "almost superpower", trimmed 6 sub-second pauses hiding inside stretched tokens ("Now,", "like...", "and", "say", "give", before "free") → 15:00.9 (clean-v2).
- Round 3 (`flubs-v3.json`): the round-2 join had clipped the vowel of "it's" ("es- especially" in the fresh pass) → cut through "it's" as well: "…and it is really insane. Especially insane inside of 3D modeling softwares…" → clean-v3.

## Protected demo beats (intentional silent gaps; verify pass 1 lists them as residual pauses = accepted)
- 1:55.6–2:01.7 src — pickup demo after "pick up objects." (hand lifts the ball, cut to the face, zoom out, places it down)
- 2:56.8–2:58.0 — stand-up completes after "stand right back up."
- 3:50.3–3:51.6 — walk-cycle tail after "walking all with GPT 6 Astra."
- 6:10.3–6:14.6 — cliff reveal after "then it shows the actual cliff."
- 40:20.3–40:52.5 — the Backrooms final output, fullscreen, WITH its own audio (he unmutes: "so you guys can hear"), ends on the cut-to-black. ~32s. Scribe heard no words there so cut-silences would have deleted it.

## Judgment calls
- Hook kept as recorded: "Can GPT Astra 6 animate characters in Blender?" then "what you're seeing right now is a full character animation by GPT 6 Astra…" (first restart dropped). "Had to show you guys the six-seven one first" kept — the opening animation is the 6-7 meme gesture.
- Intro restarts stitched: "I also, / I also animated a pickup", "You can animate a character pi-- You can, you can animate…", "And if you notice, and if you notice, he has eye movement and fa-- He has some eye movement…", "We can animate him walking in certain sc--", "And then can, and then we can actually create scenes with GPT…", "3D building software, 3D modeling software" (kept the correction), "and then everything else--", "And then again, and then again", "So it's, it's getting better and-- So it's definitely getting better", "using, like, using keyframing", "go back into GPC--", "one prompt, one single, one single prompt for this / One single prompt for this animation right here" (third take only).
- Stats section: four false starts while scrolling ("So you can see we have… So we can see… So we can see that at, like, high effort on GPT-6 Astra, if we look at the high effort on…") dropped; the edit goes straight to "If we look at the high effort on Fable 5.1, it's about a forty percent resolution rate… If we look at the high effort on GPT-6 Astra, it's about fourteen dollars…". "sixty-two, sixty-one percent" → "sixty-one percent" (his correction). "the Pro model, on the Pro subscription" → "on the Pro subscription".
- "They even built games with GPT-6 Astra, so if you, like, look…" → abandoned tail cut before the 36s browse; then "And they're even building these crazy games and 3D models inside of HTML".
- Codex app open: "It looks just like this. It says… / It looks just like this, and if we open it up. / And if we open it up, you can see this is what our Codex looks like" → "It looks just like this, and if we open it up. [app opens] you can see this is what our Codex looks like."
- "which is like ChatGPT-- which is like GPT-6 Astra or Fable five point one" → correction kept.
- Plugins hunt: "and then find the plugins where you can search up… Where you can, where you can search up Blender" → "…find the plugins where you can search up Blender."
- "Also animating him to sit down and then stand back up. [4.8s wait] And then stand right back up." → second sentence dropped (read as a stutter once the wait was trimmed); the character's rise still plays silently for 1.1s.
- "free 3D rigged, [5.4s] ri- character models" → kept the first, full "rigged," and dropped the clipped fragment (v1 had it the other way round and read "free 3D rig character models").
- Fillers cut: Um/uh ×9 (mostly in the Backrooms review). Kept as his voice: "like" hedges, "closer and closer and closer", "I mean, it's very simple".
- Outro: "I'm gonna leave you guy--" and "And I'm gonna leave you guys with--" false starts dropped; "I'm going to leave you guys with this. So this is how you can create character animation inside of Blender." kept.

## ⚠ Flags for Aidan
- **A phone/video call was captured** during the Backrooms wait (36:22–38:50 source: "Yo, can you hear me? … Are you able to turn your camera on? … I'm allowing video for everybody…", with the call window and his own camera feed visible on screen at the end of 2.mov). All of it is inside one cut (34:14.4 → 38:58.2); the joins were frame-checked. Discord is also briefly on screen at ~21:26–21:31 (inside the connection-wait cut). Re-check before publishing anyway.
- He says "**Claude** has access to all of the rig movements" at 23:31 (means Codex / GPT-6 Astra) — can't fix in the edit.
- "GPT Astra 6" (hook) vs "GPT-6 Astra" (everywhere else) — as recorded.
- The 6-7 line ("Had to show you guys the six-seven one first") — kept because the animation is the meme gesture; say the word if it should go (src 0:26.8–0:30.0).
- Quiet delivery on the setup walkthrough; a level ride in Premiere wouldn't hurt.
- Delivery destination not given — copied beside the sources as "GPT-6 Astra Blender Animation Tutorial - Edited.mp4" (+ .cutlist.md), same pattern as the Unreal / Blender-tutorial deliveries. Rename / move as needed.

## Artifacts
- `assets/clean-v1.union-edl.json` — final union EDL (source coords; patch-residual updated it in place for v2/v3 — matches clean-v3) · `assets/clean-v3.cutlist.md` — every deleted range with per-file timecodes + reasons
- `assets/clean-v3.json` + `clean-v3.sentences.txt` — fresh transcript of the final render · `assets/verify-report-v3.md`
- `assets/approved-cuts.json` (74 cuts, silenced-timeline coords, with reasons) · `assets/protect-clips.json` (5 windows) · `assets/patch-protect.json` (+ the "big laugh." tail) · `assets/flubs-v2.json` / `flubs-v3.json` (source-coord round-2/3 cuts) · `assets/residual-v2.dry.txt` / `residual-v3.dry.txt`
- `assets/clean-v1.union-edl.backup.json` — the v1 EDL before the round-2 keep edits · `_patch-keeps-v2.mjs` · `_rms.sh` (20/50 ms RMS sweeps)
- `assets/clean-v1.cutlist.md` — the 74 editorial cuts with reasons (source timecodes, v1)
- `_prep-transcript.mjs` (token fixes + [CLIP] injection) · `_gen-approved-cuts.mjs` (phrase-anchored specs) · `_iso.mjs` / `_iso-gaps.mjs` (isolated re-transcription) · `_framediff.mjs` · `_join-sheets.mjs`
- `assets/iso/` — isolated Scribe passes (every stretched token, every wordless gap ≥1.5s) · `assets/iso-gaps-report.txt`
- `frames/` — 1 fps contact sheets of the intro screen half, 2 fps protect-window checks, sparse wait-region sheets, join sheets

## Gotchas learned / re-hit
- **Phantom stretched tokens**: Scribe attached "I" (0:51–1:43, 52s) and "Yo," (34:26–36:22, 116s) to spans lying entirely inside a -30dB silence; `clamp-stretched-tokens` has nothing to clamp to and silently skips them (15 clamped vs 19 tokens >1.2s). Compare the clamp count with the >1.2s token list and retime the rest by hand from an isolated pass.
- **Playback-with-audio needs a protect token too**: the Backrooms output plays with sound (music/SFX) but Scribe emits no words, so cut-silences would have deleted 32s of intentional content. `[CLIP]` token 2420.3–2452.55.
- **No-gap fillers**: "Um, and it's" had no silence between "Um" and "and" — cutting at Scribe's boundary left an "m" that the fresh pass heard as "I mean"; cutting through the d-closure dip clipped the vowel of "it's" ("es- especially"). When a filler runs straight into the next word, cut through to the next real dip (dropped "and it's" as well). Two re-renders to learn.
- The kept take of a doubled word can be the broken one: raw "rigged, [5s] rigged character models" — the second "rigged" was a clipped "ri-" (0.28s); the fresh pass heard "rig character models". Check the fresh transcript at every stutter join, and prefer the take whose token length looks like a full word.
- A doubled narration line ("…stand back up. [4.8s] And then stand right back up.") reads as a stutter once the wait between them is trimmed; drop the second (keep its silent action) rather than leaving the pause.
- Mean frame-diff on the screen half is useless for a small animated character (reads as static); read the 1 fps / 2 fps contact sheets instead. The `-ss` contact-sheet mapping is tile i = start + i/fps.
- RMS sweep helper: `-inf` RMS values break naive paste/awk parsing (window pairs shift by one); handle `-inf` explicitly.
