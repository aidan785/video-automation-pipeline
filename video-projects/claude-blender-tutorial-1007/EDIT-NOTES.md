# I Let Claude Run Blender For A Day (2026-10-07): intro + tutorial

**Final:** `renders/final-v2.mp4`, 9:53.97 (17,819 frames), 3840x1080 30 fps constant, H.264 CRF 18 + AAC 192k, Rec.709 tags.
= intro 0:51.13 (1,534 frames, the finished 1920x1080 intro centred on the canvas, same place the raw intro recording sat) + tutorial 9:02.83 (16,285 frames, OBS screen-left / webcam-right as recorded). One encode from the originals.
**Delivered** (sha256 identical) to `~/Projects/Adobe Transfer Folder/`: `I Let Claude Run Blender For A Day - Edited.mp4`, `... - Intro only 1080.mp4`, `... - Edited.cutlist.md`. Not yet reviewed by Aidan.

Sources: `Adobe Transfer Folder/TODAYY2.mov` (tutorial, 29:17.0) and `TODAYY1.mov` (intro recording, 2:01). The intro was cut and built in the Blender session, project `video-projects/claude-blender-full-day` (yt-intro-pixel-serif format: cold open with the ring ship stills, the tree creature and the caterpillar, all real Blender renders). This project only rendered that comp at `--quality high` (`renders/intro-final.mp4`, comp state of 22:53) and stitched it in.

## Pipeline numbers (tutorial)
- Raw 29:17.0 -> silence pass 10:23.9 (64.5% out, incl. the 7:20 EEVEE render wait at 20:48-28:08 src) -> 35 editorial cuts (80s) -> 9:03.5 check render (clean-v1) -> round 2 (2 keep-range edits) + frame snap -> 9:02.83.
- No stretched tokens to clamp. All 86 wordless gaps of 1.5s+ isolate-transcribed: clean except one quiet false start ("I'm sure you've seen that-", 1:32 src) that sits inside a trimmed pause.
- Mechanical detector found 3 candidates (2 real, 1 false positive "animated it. It just"); the other 33 cuts came from the editorial read.

## Verification (on the delivered file)
- Fresh Scribe pass of the final: 2,185 words (183 intro + 2,002 tutorial).
- Pass 1 silence: no pause over 0.52s except the two kept demo beats below. Head 0.24s, tail 0.37s, intro-to-tutorial gap 0.50s.
- Pass 2 cuts: 76/76 phrase checks; full sentence read clean; one repeat warning is real speech ("animated it. It just").
- Pass 3 ledger: tutorial 542.85s heard vs 542.83s EDL; frame count exact (17,819); audio 593.966s vs video 593.967s.
- Integrity (`_final-checks.mjs`): 13 segments x 3 frames match the source frame they should be (min PSNR 53 dB), intro frames match the intro render, audio matches the source at zero lag on every sampled segment (min correlation 0.978). First frame of all 156 segments eyeballed (`frames/final-v2-joins-*.jpg`).

## Silent beats kept on purpose (final-file times)
- 2:40.0-2:48.1: he flips through spaceship stills 6 to 11 after "this is like an action shot" (4:15.5-4:23.4 src).
- 7:43.0-7:47.0: rendered close-up of the fixed fingers, two zoom steps out, between "and you can see..." and "And now that finger is not interfering with our branch" (16:07.5-16:11.0 src).

## Judgment calls
- Retakes: always the last complete take (cut list has every one with its words).
- "Hopefully my head is not in the way. I'll have to edit that out when I am editing this video." cut as a note to self. It refers to the webcam overlay covering the bottom-right corner of the screen: final 7:09-7:17.
- "And then again, like I was mentioning with this little bug character, this caterpillar ... Scratch that." cut (spoken instruction).
- Sneak-peek line: kept the second take and dropped its leading "And so", so the join lands after the "Weekly dictation limit reached" pop-up (on screen 8:44.2-8:54.3 src) has gone.
- "which is in 720p, which is in 480p" -> 480p (his correction). "it's in the depth of the camera. It's out of the depth" -> out.
- Kept as his voice: "interacting or interfering", "after Claude is done finished", "better and better and better".

## Flags
- Intro still has a thin dark outline round his hair (cutout edge), visible at full size. It comes from the intro build in the other session. If that gets fixed there, re-run `_assemble.mjs` (one 8 min encode) to swap it in.
- Nothing added to the tutorial body (no cards, b-roll, music): it is the split-screen canvas for Premiere, same as the 10/6 delivery.
- Claude app sidebar with session titles is on screen in places (as in earlier tutorials).

## Artifacts
- `assets/clean-v2.snapped-edl.json` (rendered truth, frame-aligned) · `assets/clean-v2.union-edl.json` · `assets/clean-v1.union-edl.json` · `assets/approved-cuts.json` (35 cuts, silenced-timeline coords, with words + reasons) · `assets/protect-clips.json` · `assets/final-v2.cutlist.md`
- `assets/final-v2.fresh.json` / `final-v2.tutorial.json` / `.sentences.txt` · `assets/verify-report-final-v2.md` (FAIL lines = the two kept beats) · `assets/verify-phrases-v2.json` · `assets/final-v2.integrity.json`
- Scripts: `_prep-transcript.mjs` · `_gen-approved-cuts.mjs` (phrase-anchored specs, joins placed on source-audio dips) · `_patch-keeps-v2.mjs` · `_snap-edl.mjs` · `_assemble.mjs` · `_final-checks.mjs` · `_split-final.mjs` · `_cutlist-final.mjs` · `_iso.mjs` / `_iso-gaps.mjs` · `_join-rms.mjs` · `_sheet.sh`

## Gotchas
- A 0.90s "really" token hid a whole restart ("So I'm really ha- [pause] So I'm really happy"). The clamp only looks at tokens over 1.2s; isolate-transcribe tokens of 0.7s+ before planning.
- Raw Scribe split one "So" into "s-" + "so". Cutting at the "s-" boundary clipped the s and the fresh pass heard "But I highly recommend". When a fragment token is under 50 ms and glued to the next word, treat it as that word's onset.
- A dip search that reaches into the removed word can land on the silence AFTER a short removed word ("model if,") and leave it in: only widen when nothing sounds between the two candidates.
- build-combined-cut trims video by frame and audio by time, so each join pads up to 33 ms (1.05s drift over 156 joins, variable frame timing). Snapping the EDL to the frame grid and trimming by frame/sample index gives exact CFR with zero drift.
- zsh reads `$ST:s...` as a history modifier (write `${ST}`); this ffmpeg has no drawtext.
