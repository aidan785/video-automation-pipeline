# AIS lead magnet ads + AIS+ VSL (recorded 2026-09-30)

Claude Code's working project for Steven's 9/30 edit request: 3 lead magnet ads (16:9 + 9:16) and 4 AIS+ VSL versions (16:9) built from one shared core. Due Fri Oct 2, 2026, EOD CT.

Kept separate from `../ais-plus-lead-magnets-2026-09-30/` (the other agent's run) so the two don't mix.

- Start here: `STATUS.md` (current state + next step), then `01-intake/CHECKPOINT-1.md`.
- Raw footage: `sources/` symlinks to the SSD `_sources` folder. Read-only, never modified.
- Style reference: `../ais-live-ai-os-ads/hyperframes-white-glass(-vertical)/`, adapted to dark mode.

| Folder | What |
| --- | --- |
| 01-intake | Checkpoint 1 report, source inventory, loudness, framing/reference contact sheets |
| 02-scripts | Spoken-script references + script vs recording diff + caption terms |
| 03-transcripts | Scribe word-level JSON (raw) + readable timestamped text |
| 04-edit-plan | Proposed cuts, source-to-edit maps, VSL assembly map |
| 05-visual-assets | Asset plan (have / can get / need) + collected assets |
| 06-compositions | HyperFrames compositions (CP2+) |
| 07-previews | Review renders and stills (CP2+) |
| 08-captions | Caption JSON + SRT per export (CP3+) |
| 09-exports | Final MP4s before copy to the SSD delivery folder |
| tools | Scripts that produce everything above (re-runnable) |

Rebuild the plan: `node tools/plan-edit.mjs && node tools/render-plan-md.mjs && python3 tools/inventory.py`
