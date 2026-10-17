# AIS Live AI OS ads

Source: https://drive.google.com/file/d/1s4EoZjAgbBW5fCOMfbiJqmMymdI5tj72/view
Scripts: https://docs.google.com/document/d/1__WXp1E_By62H3PUuxsbmyelKpUmpg5uhUUgspqWpyY/edit

Source filename: AIS Live 3 Ads.mp4. Browser player duration: 2:51.
Inspected September 20, 2026. Script copied to SCRIPT.md.

## Initial editorial map

These are approximate locations from the Drive transcript, not frame-accurate cut boundaries. Verify against source audio and word-level transcription before editing.

| Ad | Approximate source region | Cleanup |
| --- | --- | --- |
| 1 — The 30-Minute Morning | 0:03–0:48 | Trim opening; remove long pause between the sentence ending “get straight to work” and “So, if you've been feeling scattered” (roughly 0:31–0:39). |
| 2 — AI Just Killed Executive Assistants | 0:50–1:45 | Remove abandoned “You can now build…” take around 0:55–0:59; retain complete restart. Remove first “First, you just give it context…” take around 1:08–1:12, retaining corrected “who you are.” Remove incomplete CTA “So, if you'd like” before the complete CTA around 1:40. |
| 3 — The $420K AI OS | 1:50–end | Remove two abandoned “It helps them manage their priorities…” takes around 2:06–2:15; retain final complete version and remainder. |

Ad 3 requires the exact overlay below, visible for at least 5 seconds alongside the opening revenue claim:

> Results shown reflect the founder's company and are not typical. Individual results vary.

Source is landscape talking-head footage. Output aspect ratio has not been specified. Finishing preference (captions/light graphics versus clean talking-head cuts) was asked but not yet answered.

## Completed

Source supplied locally at `/Volumes/Extreme SSD/Uppit AI/AIS Live/October /Ads/AIS Live 3 Ads.mp4`. Three cleaned, captioned landscape drafts rendered and copied to the adjacent `Edited` folder. Source is read-only.

All three cuts passed fresh-transcript silence, phrase, and EDL verification with zero failures or warnings. Full fresh transcripts were read for script coverage and residual retakes. Final sampled frames were inspected for each graphic, caption placement, disclaimer, and endings.

Reproduction: `python3 edit.py` assembles the source cuts; `python3 finish.py` applies native image overlays generated from the caption/graphic plan. Per-ad folders hold EDLs, raw-to-edit word timing, fresh verification transcripts, verification reports, SRTs, and clean/finished MP4s.

Finish assumption: original landscape framing, blue/onyx AIS Live branding, readable phrase captions, light supporting panels; no added music.
