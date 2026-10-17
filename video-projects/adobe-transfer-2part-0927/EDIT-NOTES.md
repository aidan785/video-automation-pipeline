# Opus 5.5 BlenderKit tutorial — edit notes

Sources: `1.0.mov` followed by `2.0.mov` from the Adobe Transfer Folder. The originals were not modified. They form one continuous 38:18.3 split-screen tutorial.

- ElevenLabs Scribe word timestamps drove the edit. Three stretched tokens near the long render wait were repaired from isolated transcriptions; an unverified `Yeah` token was removed.
- The silence pass removed 1,680.3 seconds, including the long Blender build waits. Its planned transcript was read end to end before the editorial pass.
- `assets/approved-cuts.json` records 37 reviewed retake, restart, and off-script cuts. `assets/source-refinements.json` adds six source-time fixes found during the editorial and fresh-render reads.
- `render-edit.py` combines the source cuts, snaps them to 30 fps frames, adds 4 ms audio fades at joins, and encodes the final 3840×1080 H.264/AAC file in one pass. `assets/clean.frame-edl.json` is the authoritative ledger: 151 retained spans, 16,362 frames, 9:05.4 runtime.
- Reviewed 13 graphic candidates and 47 B-roll candidates. None was added: the split-screen source shows the actual Blender interface, assets, and renders discussed in the narration, and cutaways would obscure those demonstrations.
- The final MP4 passed all three cut-verification passes. The three repeat warnings are intentional emphasis (`super, super`, `very, very`) and the brand name ending one sentence and opening the next (`BlenderKit. BlenderKit`).
- Inspected frames at 0:02, 1:30, 3:00, 4:30, 6:00, 7:30, 8:50, and both sides of the part-one/part-two join at 8:26.4. The face, demo, and garage reveal remain visible. The complete MP4 decoded without errors.

See `VERIFICATION.md` for the final mechanical report and `FINAL-TRANSCRIPT.txt` for the fresh rendered transcript.
