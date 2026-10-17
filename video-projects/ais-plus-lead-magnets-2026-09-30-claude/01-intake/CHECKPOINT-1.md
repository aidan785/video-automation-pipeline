# Checkpoint 1: Intake and edit plan

**Campaign:** 3 AIS lead magnet ads (16:9 + 9:16) and 4 AIS+ VSL versions (16:9) from the 9/30 recordings
**Deadline:** Fri Oct 2, 2026, end of day CT
**Status:** intake done, edit plan proposed. Nothing cut, styled or rendered. Waiting on your review.

---

## 1. Decisions needed

### Blocks Checkpoint 2 (dark style proof)

| # | Decision | My recommendation |
| --- | --- | --- |
| D1 | **VSL "native captions on":** player closed captions on by default, or burned-in styled captions? | **Burned-in**, matching the ads (always on, whatever the page player does), plus SRT sidecars. If you want player CC instead, I deliver caption-free MP4s + SRT/VTT so there are never double captions. |
| D2 | **Annual price display:** the body says "about $62 a month". The end screen says **$66.58/mo**, which is exactly **$799 / 12** (the old annual price). $749 / 12 = **$62.42**. Also "over 50% less per month" vs $129 is only true at $62.42. | Show **"$749/year (about $62/mo)"** everywhere. Confirm with Steven. |
| D3 | **Audio level:** the raws sit at -22 LUFS. The White Glass exports kept the recording level. | Normalize all 10 to **-16 LUFS / -1 dBTP**, applied identically to intros and core so joins match. |

### Needed before Checkpoints 3 to 6

| # | Decision | My recommendation |
| --- | --- | --- |
| D4 | **Virtual events:** core 3:58 says "quarterly virtual events", 5:36 says "all three of the virtual events we run each year". The $1,097 math (3 x $199 + $500) only works with three. Both are in the recording. | Graphics say "VIP tickets to every virtual event" (no count) + "$1,097/yr in event savings" as spoken. Which is actually true? |
| D5 | **Community size:** spoken "over 3,500", script 3,600, the Sept AIS+ graphics used 3,700+. | Graphics follow the speech: **3,500+**. |
| D6 | **$420K claim in the AI OS VSL intro (05):** spoken as "earns **over** $420,000 per month with fewer than ten full-time employees". The earlier $420K ad carried "Results shown reflect the founder's company and are not typical. Individual results vary." | Add the **same disclaimer** under that line (5s+). |
| D7 | **"or any other AI agent that you wanna use"** is spoken in the AI OS and Scrollcraft ads. The script and opt-in pages say Claude Code and Codex only. | Keep the speech. Graphics say "Claude Code + Codex". I can try cutting the phrase by ear if you'd rather match the landing page. |
| D8 | **Optional micro-cuts:** 05 "provides **s- with** support" -> "provides support" (matches script). Core "a team of **experts,** expert humans" -> "a team of expert humans" (matches script). Both have clean silence on each side. | **Yes** to both. Keep the core's leading "So" (it runs 40 ms into "if", not a clean cut). |
| D9 | **Proof:** who is the $385K member, and is there approved proof (name, photo, quote)? OK to reuse the 4 AIS+ member testimonial clips from the AIS+ membership promo and/or the AIS Live Senja testimonials? | No face or name on the $385K line without approved proof. Reuse existing clips only with your OK. |
| D10 | **Jarvis visual:** Steven's example 1 is an Iron Man film still. | Use Nate's own `Nate JARVIS Overlay.png` (Drive, 9/29) plus an original glass HUD animation. No Marvel stills in paid ads. |
| D11 | **Assets** (full list in `05-visual-assets/ASSET-PLAN.md`): SOP PDF; AI OS setup flow, six real skill names, 3D brain recording; a Scrollcraft before/after pair; course thumbnails for Agent Zero / 10 Hours to 10 Seconds / One Person AI Agency; AIS+ community screenshot; official AIS and AIS+ logo files. | Can I capture Nate's public YouTube channel header and public comments (names and avatars blurred) myself? If you send the Scrollcraft skill, I can build a real before/after of one page. |
| D12 | **Local disk:** 9.3 GB free (98% full). Past renders used ~9 GB of scratch per 9 min of video. The 6-minute core alone needs ~6 GB and the SSD can't host render scratch (exFAT fails). | OK to **offload** (move, not delete) old finished-project renders/assets to the SSD? I'll list candidates for sign-off first. |
| D13 | **Delivery folder:** `.../2026-09-30 - Lead Magnets and AIS Plus/` already has the other agent's `_sources`. | Deliver my exports to a **`Claude Code/`** subfolder there. Confirm the external upload destination (Drive?) at the end. |

---

## 2. Reference system (White Glass)

Read: `hyperframes-white-glass/` and `-vertical/` DESIGN.md, README.md, build.mjs, scenes.json, finish-exports.py, verify-exports.py. Frames pulled from the SSD exports: `01-intake/frames/_sheet-ref-landscape.jpg`, `_sheet-ref-vertical.jpg`.

**Keeping:**
- **Landscape:** left editorial column (eyebrow, 2-line Inter headline at 600 to 650 weight, glass UI), rounded speaker window at right (1080,151, 744x773, r40), centered caption pill at y 965.
- **Vertical:** centered headline and glass UI on top, caption pill in the gap (y 932), Nate in a 952x720 rounded window at (64,1080).
- **Motion:** 0.5 to 0.8s eased entrances, ~0.085s stagger, blur-into-focus, 0.27s soft blur scene exits, slow sheen and reflection drift. No whips, grids, grain or neon.
- **Finish step:** remux the verified clean audio onto the render (avoids AAC priming delay), full-decode check, audio correlation check, contact sheets.

**Changing (dark mode, detail at Checkpoint 2):**
- **Surfaces:** deep navy/charcoal canvas with soft blue light pools. Glass becomes low-alpha white fills with a 1px top-edge highlight and backdrop blur.
- **Text:** near-white primary, muted blue-grey secondary. AIS blue #37BDF8 stays the only accent.
- **Nate's window:** stays naturally exposed, no grade toward the dark UI.

**Branding:**
- **Ads:** AIS mark and "AI Automation Society", matching the opt-in pages.
- **VSL:** AIS+ mark.
- **Dropped:** the AIS Live wordmark, red LIVE dot, event dates, ticket offers and old copy. The header note becomes the lead magnet name.

---

## 3. Source inventory

All 8 files are in the SSD `_sources` folder and **match the Drive originals byte for byte** (Drive connector listing; the gcloud Drive token has expired, so md5 wasn't available). Full data: `01-intake/inventory.json`.

| Clip | Role | Raw | Video | Audio | Speech |
| --- | --- | --- | --- | --- | --- |
| 01 | Ad: First AI Client SOP | 1:28.3 | 3840x2160 H.264, 30p | AAC 48k stereo, -22.0 LUFS, TP -3.1 | 0:02.6 to 1:26.0 |
| 02 | Ad: AI OS Template | 1:38.4 | same | -21.7 LUFS, TP -3.2 | 0:08.8 to 1:35.8 |
| 03 | Ad: Scrollcraft | 1:04.4 | same | -22.0 LUFS, TP -4.0 | 0:02.9 to 1:01.6 |
| 04 | VSL intro: SOP | 0:52.3 | same | -22.0 LUFS, TP -2.1 | 0:04.1 to 0:49.7 |
| 05 | VSL intro: AI OS | 0:59.9 | same | -21.9 LUFS, TP -3.1 | 0:02.3 to 0:57.7 |
| 06 | VSL intro: Scrollcraft | 1:06.9 | same | -22.0 LUFS, TP -3.0 | 0:02.9 to 1:04.3 |
| 07 | VSL intro: Generic | 1:09.1 | same | -22.1 LUFS, TP -1.7 | 0:02.6 to 1:06.6 |
| 08 | VSL core body | 9:55.4 | same | -22.0 LUFS, TP -1.3 | 0:02.6 to 9:52.9 |

**Technical notes:**
- **Frame rate:** ~71 Mbps, full-range yuvj420p, and slightly variable timing (30.003 fps average, 31 to 38 ms steps). I'll conform to constant 30 fps in the proxy transcode.
- **Audio:** dual mono. Pauses are gated to true digital silence, so trims inside pauses are clean.
- **Consistency:** every clip is the same set and session (light grey wall, AIS neon, YouTube plaques) with Nate centered. Levels match within 0.4 LU, so intro to core joins won't jump. See `01-intake/frames/_sheet-raw.jpg`.
- **Untranscribed audio:** none worth worrying about. The scan found only 0.17 to 0.31s breaths/clicks (`tools/untranscribed-audio.py`).

Transcripts: ElevenLabs Scribe, word-level, `03-transcripts/raw/*.json`. Readable versions with pauses marked: `03-transcripts/readable/*.txt`.

---

## 4. Edit plan

Full detail with source-to-edit maps: `04-edit-plan/EDIT-PLAN.md` (per-clip JSON in the same folder).

### Retakes (always the last take)

Every landmark in the brief matched a real retake in the transcript. The rough brief times resolved to word boundaries like this:

| Clip | Brief | Cut (raw) | What goes | Kept take |
| --- | --- | --- | --- | --- |
| 01 SOP ad | restart 0:52 | 0:41.3 to 0:57.0 | first "So this SOP right here..." pass, stops at "the exact..." | 0:57.0 complete pass |
| 02 AI OS ad | restart 0:38 | 0:38.0 to 0:40.2 | "Jarvis works so well--" | 0:40.2 |
| 08 core | 1:32 / 1:38 | 1:32.0 to 1:38.2 | "...to closing a three hundred and eighty-five thousand dollars." | 1:38.2 |
| 08 core | 1:45 / 1:49 | 1:45.5 to 1:49.1 | "...closing deals for five thou..." | 1:49.1 |
| 08 core | 4:47 / 4:59 | 4:47.8 to 4:59.3 | "...I was looking at..." | 4:59.3 |
| 08 core | 6:04 / 6:10 | 6:03.7 to 6:10.2 | "...if you're not" | 6:10.2 |
| 08 core | 6:28 | 6:28.2 to 6:30.4 | "Several thousand--" | "So that means we have several thousand..." |
| 08 core | math x3 + dead air | 6:55.9 to 8:31.6 | takes at 6:55 and 7:11 + 69s of dead air (7:22 to 8:31) | 8:31.6 |
| 08 core | 8:49 / 8:56 | 8:49.8 to 8:56.6 | "...that are valuable..." | 8:56.6 |

Clips 03, 04, 06 and 07 are single clean takes. My full read found no other retakes. It did find the two optional micro-cuts in D8.

### Pauses

Any gap over 0.6s becomes a natural breath (0.28s tail after the last word, 0.17s before the next). No speed-ups. Every join gets an ear/RMS check at build time.

### Proposed durations

| Clip | Raw | Clean |
| --- | --- | --- |
| 01 SOP ad | 1:28.2 | **0:54.4** |
| 02 AI OS ad | 1:38.3 | **1:09.4** |
| 03 Scrollcraft ad | 1:04.3 | **0:51.5** |
| 04 intro SOP | 0:52.2 | 0:43.1 |
| 05 intro AI OS | 0:59.8 | 0:50.7 |
| 06 intro Scrollcraft | 1:06.9 | 0:59.0 |
| 07 intro Generic | 1:09.0 | 0:58.9 |
| 08 core | 9:55.3 | **6:22.6** (7 retake cuts, 29 pause trims, 64s of pauses) |

---

## 5. VSL assembly

**The core is built and rendered once, in two parts split at the proof bridge:**
- **Part A:** core opening, edit 0:00 to 0:49.9.
- **Part B:** proof bridge to the end, edit 0:49.9 to 6:22.6.
- **Proof bridge marker:** raw **1:12.36**, "So this page is full of examples...". The spoken line starts with "So" (the script says "This page..."). A clean breath at raw 1:11.67 is the natural entry.

**Each version = intro + core parts:**
- The video is joined with matching encode settings.
- The audio is laid as one continuous track built from the same edit list, so there are no gaps at the joins.
- Captions are rebased per version. A core fix is made once and flows to all four.

| Version | Build | Join at | Est. length |
| --- | --- | --- | --- |
| 04 VSL - First AI Client SOP | intro 04 + A + B | 0:43.1 | **7:05.8** |
| 05 VSL - AI OS Template | intro 05 + A + B | 0:50.7 | **7:13.3** |
| 06 VSL - Scrollcraft | intro 06 + A + B | 0:59.0 | **7:21.7** |
| 07 VSL - Generic | intro 07 + B | 0:58.9 | **6:31.6** |

**Join read (text level; audio checked at build):**
- **04 / 05:** "...But here's the thing" -> "So if you're like most builders...". Reads fine.
- **06:** "...design is just one piece of the puzzle" -> "So if you're like most builders...". Reads fine.
- **07:** "...AIS+ is built to help you escape that trap." -> "So this page is full of examples of people who were stuck in that exact same situation...". Clean hand-off, and nothing repeats because the generic intro already covered the core opening.
- **Expected overlap:** the SOP intro's "watching videos and bookmarking tutorials" is echoed by the core's "watched videos and followed tutorials". That's how the script is written, so I'm flagging it only.

---

## 6. Script vs recording

Full list: `02-scripts/SCRIPT-VS-RECORDING.md`. The items that need a call are D2, D4, D5, D6 and D7 above.

Also noted:
- **Refund:** 30 days, annual-only as scripted (the Sept upsell used 7 days, so I'm assuming 30 is current).
- **Course names:** Agent Zero, 10 Hours to 10 Seconds and One Person AI Agency differ from the six dashboard modules on file from 9/1.
- **"hundreds of builders"** in the SOP ad: Steven's open comment asks whether it's really thousands. Captions follow the speech.

Caption terminology fixes are listed there too (Claude Code, Codex, AIS+, Herk Loop, number formatting).

---

## 7. Captions and audio

- **Ads:** burned-in captions in both formats, 2 to 6 word phrases, timed to the kept takes, terminology fixed.
  - **Landscape:** low centered pill.
  - **Vertical:** in the gap above Nate's window, clear of the Reels/Stories bottom UI.
- **VSL:** per D1. I'll generate an SRT for every export either way, rebased to each version's timeline.
- **Audio:** per D3. No music, same as the White Glass exports. I'll reuse the White Glass audio-preservation finish step (remux the verified clean audio onto the render) with the new edit timings.

---

## 8. The 10 exports

| # | File | Format | Captions | Sidecar |
| --- | --- | --- | --- | --- |
| 1 | 01 AD - First AI Automation Client SOP - 16x9.mp4 | 1920x1080 | burned-in | .srt |
| 2 | 01 AD - First AI Automation Client SOP - 9x16.mp4 | 1080x1920 | burned-in | .srt |
| 3 | 02 AD - AI OS Template - 16x9.mp4 | 1920x1080 | burned-in | .srt |
| 4 | 02 AD - AI OS Template - 9x16.mp4 | 1080x1920 | burned-in | .srt |
| 5 | 03 AD - Scrollcraft - 16x9.mp4 | 1920x1080 | burned-in | .srt |
| 6 | 03 AD - Scrollcraft - 9x16.mp4 | 1080x1920 | burned-in | .srt |
| 7 | 04 VSL - First AI Client SOP - 16x9.mp4 | 1920x1080 | per D1 | .srt |
| 8 | 05 VSL - AI OS Template - 16x9.mp4 | 1920x1080 | per D1 | .srt |
| 9 | 06 VSL - Scrollcraft - 16x9.mp4 | 1920x1080 | per D1 | .srt |
| 10 | 07 VSL - Generic (free Skool join emails) - 16x9.mp4 | 1920x1080 | per D1 | .srt |

**Shared master:** 08 VSL CORE BODY (parts A + B) stays in the project as the reusable master. I'll also drop it in the delivery folder if you want it.

**Delivery:** 10 MP4s + 10 SRTs + `MANIFEST.md`, with durations, source-to-edit maps, QA results and the selected takes.

---

## 9. Production order (to hit Fri EOD CT)

| When | Checkpoint | Work | Blocked by |
| --- | --- | --- | --- |
| Wed 9/30 pm | CP2 dark style proof | Cut + verify clip 01. Build the dark system from the White Glass code. 10 to 15s SOP-ad sample in 16:9 + 9:16. One VSL offer/proof frame. | D1, D2, D3 |
| Thu 10/1 am | CP3 first complete ad | SOP ad in both formats | SOP PDF, YouTube/comments capture OK (D11) |
| Thu 10/1 pm | CP4 remaining ads | AI OS + Scrollcraft ads, 4 exports, QA notes | AI OS screens, Scrollcraft before/after (D11), D6, D7, D10 |
| Thu 10/1 eve | CP5 VSL master | Cut + verify all intros and the core. Core parts A/B with graphics. SOP VSL assembled + chapter/cut map. | D4, D5, D8, D9, D12 |
| Fri 10/2 | CP6 delivery | Assemble 05/06/07, verify all 4 joins (esp. the generic bridge), final QA on all 10, manifest, delivery | D13 |

**Right after approval:**
- **Parallel work:** I'll cut and verify all 8 clips (plain edits, no styling) alongside CP2. Cuts are the longest-lead item, and the verify pass (fresh re-transcription + 3 sweeps) catches problems early.
- **Asset gaps:** the missing product assets are the biggest schedule risk, so they need to start moving now. Everything else is in hand.

---

## 10. Where everything is

```
video-projects/ais-plus-lead-magnets-2026-09-30-claude/
  README.md, STATUS.md          layout + handoff
  sources -> SSD _sources       the 8 raw recordings (read-only)
  01-intake/                    CHECKPOINT-1.md (this), inventory.json, audio/loudness.txt, frames/ (contact sheets)
  02-scripts/                   ads-script.md, vsl-script.md, SCRIPT-VS-RECORDING.md
  03-transcripts/               raw/ (Scribe JSON + logs), readable/ (timestamped text)
  04-edit-plan/                 EDIT-PLAN.md, <clip>.plan.json (keeps, cuts, maps), vsl-assembly.json
  05-visual-assets/             ASSET-PLAN.md (have / can get / need)
  06-compositions/ 07-previews/ 08-captions/ 09-exports/   empty until CP2+
  tools/                        dump-transcript.mjs, plan-edit.mjs, render-plan-md.mjs, inventory.py, untranscribed-audio.py
```
