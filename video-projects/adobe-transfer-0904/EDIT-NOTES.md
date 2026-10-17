# Adobe Transfer 2026-09-04 14-20-56 — Claude Fable 5.1 x Blender rigged-character animation tutorial (edit 2026-09-04)

**Final:** `assets/clean-v2.mp4` — **6:24.7** (384.7s), 3840x1080 30fps (OBS screen-left / webcam-right, same layout as the source). verify-cuts PASS on round 2: residual pauses 0 beyond the seven intentional demo beats · phrase checks 69/69 · rendered 384.73s vs EDL 384.30s (drift 0.43s over 82 joins = concat padding) · retake read of the fresh transcript clean.
**Delivered:** bit-identical copy at `~/Projects/Adobe Transfer Folder/Blender Character Animation Tutorial - Edited.mp4` (+ `.cutlist.md`).
Source: `~/Projects/Adobe Transfer Folder/2026-09-04 14-20-56.mov` (27:33.9 raw).

## What the video is
Aidan connects Claude Fable 5.1 (via Claude Code in VS Code + the Blender MCP) to Blender Studio's "Storm" rig, prompts a wave and a backflip, compares against Opus 4.8, and shows the intro showcase (facial expressions, walk, backflip, wave, alley environment with camera moves).

## Pipeline numbers
- Raw 27:34 → silence pass 7:21 (73% removed) — the two generation waits alone were 6:40 (backflip, 17:32–24:12) and 4:07 (wave, 11:36–15:43); 1:44 of window-switching before the VS Code walkthrough; 1:18 + 0:53 of idle after the backflip result and before the outro.
- Speech is only ~7:25 of the recording; the silence pass is *supposed* to remove this much.
- Mistake pass: 33 editorial cuts (48s) → 6:33.3 (clean-v1). Mechanical detector found 6 stutters (4 already in the editorial list; "very, very" and "much, much" kept as emphasis).
- Round 2 (one re-encode from source): 8 residual pauses hiding inside stretched Scribe tokens trimmed, the "but you would do--" fragment removed, demo lead-ins/tails tightened to ~1s each → 6:24.3 (clean-v2).

## Protected demo beats (intentional silent gaps — verify pass 1 lists them as residual pauses = accepted)
Intro showcase, in order: facial-expression tail after "just like this." (~2.4s) · walk tail (~0.9s) · backflip lead-in + speech + tail (~1.1s each side) · wave lead-in/tail (~1.0/1.2s) · alley camera pan / DEAD END sign after "some camera zooms." (5.3s — this is the camera movement he is describing) · alley walk tail after "in under thirty minutes." (~2.1s) · backflip-result tail after "rig animation like this." (~1.0s).
The Opus 4.8 comparison (YouTube playback of the old video) plays under his narration, so it needed no protection.

## Judgment calls
- Intro fumbling between demos (Finder, "Save changes before closing?" dialogs, Mission Control with Discord visible, QuickTime previews he opened by accident) is all gone; the demos now cut back-to-back under the narration. Frame-checked at 1 fps.
- "Gave him, gave him some walking movements--" → kept "gave the character some walking movements." · "And then even animated him..." → kept the full second take.
- "For example, here is for example, here is for example, here's Opus 4.8" → third take only. The comparison video is already playing when we land on it.
- "I believe it's about fifteen dollars a month or maybe eleven dollar-- it's about fifteen dollars a month, but you would do-- But do remember..." → "I believe it's about fifteen dollars a month. But do remember that Blender is a free platform". (Raw Scribe had merged "you would do... But do" into one token — only the fresh transcript of the render revealed it.)
- "having a trouble f- if you're having trouble finding" → restart removed (it was invisible in the raw transcript: one stretched "finding" token).
- "So, so on the left here" → doubled "So" removed (it sat inside an 80-second stretched token).
- "We need to make sure our actual Claude-- our actual Blender session is connected" → self-correction kept, first attempt dropped.
- "Now let's just ask Claude to, 'Now make him jump and do a back… flip. He lands on his feet.'" — he reads his prompt while typing it; the typing pauses were tightened, words kept.
- Fillers cut: "Um," / "uh," in the backflip review. Kept: "very, very nicely", "much, much better", "editable, completely editable" (emphasis).
- The 53s of silently flying around the alley scene before the outro (26:19–27:12) is cut; the outro still plays over the clay alley view.

## ⚠ Flags for Aidan
- PRIVATE CONTENT WAS ON SCREEN during the backflip wait (Gmail inbox ~12:37–13:00, a resume PDF ~13:17 and ~18:33–18:53, iMessage threads ~19:13–22:40, Mission Control with Messages at 24:37) and Gmail again at 5:34 during the YouTube search. All of it falls inside cut ranges; every one of the 82 joins was frame-checked and none of it survives. Re-check before publishing anyway.
- The old YouTube video's own narration bleeds faintly under the Opus 4.8 comparison (system audio was captured; isolate-transcription heard "The reason why..." at 5:50). It sits under Aidan's voice at 6:05–6:14 and 6:35–6:58 source. A level ride in Premiere, or duck the bed, if it bothers.
- Quiet speech: the whole VS Code / Blender Studio walkthrough (7:26–11:36 source) is read at a lower level (Scribe even Title-Cased it). Kept intact; worth a level ride.
- He says "Blender rigged characters" in the hook; the fresh transcript also heard "rigid characters" at the outro ("animate your rigged characters") — that is a transcription artefact, not the edit.
- No delivery destination given — copied beside the source as "Blender Character Animation Tutorial - Edited.mp4" (+ .cutlist.md), same pattern as the Unreal delivery. Rename / move if it should live elsewhere.

## Gotchas learned / re-hit
- Clamp tail chop, again: the -30dB clamp shortened "backflip." to 0.12s — it was "back … flip." with a typing pause; the clamp would have deleted "flip.". Every clamped token was checked with a 50ms RMS sweep + an isolated Scribe pass on the slice before planning. `clamp-stretched-tokens.mjs` now flags sub-0.25s results as SUSPECT and applies every overlapping silence (it used to stop after the first, leaving 74s inside "So").
- Raw-Scribe merged tokens hide restarts: "finding" (1.2s) hid "f- if you're having trouble"; "do" hid "you would do… But do". Isolate-transcribe every stretched token's speech window before planning, and always read the fresh transcript of the render.
- -45dB is NOT a usable floor on this recording (room/fan noise sits around -50dB RMS, keyboard peaks -30dB) — silencedetect at -45 found nothing in the dead waits. -30dB + per-slice isolate checks is the working recipe.
- Zero-content Scribe tokens (a lone ",") break phrase matching and hide a pause; dropped in prep.

## Artifacts
- `assets/clean-v1.union-edl.json` — final union EDL (source coords; patch-residual updated it in place for v2; v1 copy at `clean-v1.union-edl.backup.json`)
- `assets/approved-cuts.json` (33 cuts, silenced-timeline coords) · `assets/flubs-v2.json` (8 source-coord trims) · `assets/protect-clips.json` (9 windows) · `assets/residual-v2.dry.txt`
- `assets/clean-v1.cutlist.md` — human-readable cut list (source timecodes)
- `assets/verify-report-v2.md` — verify-cuts report · `assets/clean-v2.json` + `.sentences.txt` — fresh transcript of the final render
- `_prep-transcript.mjs` (token fixes + [CLIP] injection) · `_gen-approved-cuts.mjs` · `_gen-flubs-v2.mjs` · `_fix-phrases.mjs`
- `assets/iso/` — isolated re-transcriptions of every wordless span ≥1.5s (all empty except boundary words = no hidden speech anywhere in the waits)
- `frames/` — contact sheets used for the screen-activity read (intro at 1 fps, all joins of v1)
- Intermediate `clean-v1.mp4` deleted after v2 verified (regenerable from `clean-v1.union-edl.backup.json`)
