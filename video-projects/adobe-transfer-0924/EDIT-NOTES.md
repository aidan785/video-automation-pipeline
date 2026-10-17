# GPT-6 Sol Blender Test — edit notes

Source: `2026-09-24 22-31-39.mov` (30:21, 3840×1080, 30 fps). The original file is linked into `assets/` and was not modified.

- The silence pass planned 190 removal ranges. Four Scribe tokens were clamped after source-audio silence analysis. A later audio check revealed a doubled “search” inside one stretched token; its word timing was repaired and the first take removed.
- `assets/approved-cuts.json` holds 39 user-authorized editorial cut decisions on the post-silence timeline. The automatic candidate suggesting removal of Kitchen and Marble Machine pricing was rejected because those are separate builds.
- The full fresh transcript read identified nine more short restarts inside words that Scribe had stretched. `assets/source-refinements.json` records their source-time cuts. It also restores the spoken tail of the Penguin price that the silence pass had shortened.
- `render-edit.py` combines the decisions with the source EDL, rounds to exact 30 fps frame boundaries, selects 197 retained spans in one H.264 encode, and applies 4 ms audio fades at the joins. The rendered duration is 9:56.9.
- The remaining “it. It” near 5:34 is intentional emphasis: “And it got it. It understood it.”

`assets/clean.frame-edl.json` is the authoritative EDL for the delivered render. `VERIFICATION.md` records the final MP4 transcript and three mechanical passes. The final transcript is in `FINAL-TRANSCRIPT.txt`.
