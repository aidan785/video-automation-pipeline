# Status / handoff

**Updated:** 2026-09-30 night, Checkpoint 6 delivered (all 10 finals, QA 10/10 PASS), waiting on review + delivery destination (D13).

## Approvals
- CP4 approved 9/30 (Aidan: "Looks good", after 2 alignment/caption revisions). Disk offload OK'd.
- CP3 approved 9/30 (Aidan: "go to checkpoint 4"). Jarvis overlay download OK'd. Use the script-doc links (opt-in pages) for examples.
- CP2 approved 9/30 (Aidan: "go to checkpoint 3"). Real AIS logo required (done). YouTube channel capture OK'd.
- CP1 approved (Aidan, 9/30): D1 burned-in captions, D2 "$749/year (about $62/mo)", D3 -16 LUFS / -1 dBTP. Go to CP2.

## Done
- CP1: intake, transcripts, edit plan, script diff, asset plan (`01-intake/CHECKPOINT-1.md`).
- All 8 clean cuts rendered (1080p30 CFR, tv-range bt709) + verified PASS with fresh Scribe re-transcription, 3 sweeps and an editorial read: `04-edit-plan/clean/`. Core = 6:22.9, proof bridge at 0:50.2.
- Dark Glass design system: `06-compositions/DESIGN.md` + generator `06-compositions/build.mjs` (captions, scenes, glass UI, 16:9 + 9:16).
- CP2 samples finished + verified: `07-previews/cp2/` (see CHECKPOINT-2.md). Finishing tool: `tools/finish.mjs`.

## Assets found (9/30)
- AI OS = Nate's public repo `nateherkai/AIS-OS` (6 skills: onboard, grill-me, audit, link, level-up, 3d-brain; 4Cs; 36s 3D brain demo video). Repo description says five skills, README says six.
- Scrollcraft = `nateherkai/scroll-craft` (Aidan sent). Live Scrollcraft sites: aiautomationsociety.ai, nateherk.com. Plan: scroll-record those as "after", fresh no-skill AI build of the same page as "before".
- SOP: not public. Aidan doesn't have it. Ask him to opt in, or fall back to cover mockup + text graphics.

## Waiting on Aidan
- CP2 review (palette, type, framing, captions, motion).
- Downloads done 9/30: ais-logo.png, AIS-OS + scroll-craft repos (see 05-visual-assets/README.md). D5 settled by the live site: 3,500+ AIS+ members (05-visual-assets/CLAIMS-CHECK.md).
- Official AIS+ logo, if one exists.
- SOP route. D4 to D13 from CP1 (events count, 3,500, $420K disclaimer, "any other AI agent", micro-cuts, proof approvals, Jarvis, YouTube capture OK, disk offload, delivery subfolder).

## CP3 (9/30)
- `07-previews/cp3/`: SOP ad 16x9 + 9x16 + SRTs, QA all PASS (see CHECKPOINT-3.md). Captures in `05-visual-assets/captures/` (tools/capture.mjs, system Chrome headless, muted).

## Next step (old)
After CP2 approval: CP3, full SOP ad in 16:9 + 9:16 (clean cut is ready, 54.5s).

## Next step (current)
After CP3 approval: CP4, AI OS + Scrollcraft ads (4 exports). Needs: D7 ("any other AI agent"), Jarvis visual (Nate JARVIS Overlay.png on Drive, needs download OK), Scrollcraft before/after build + scroll recordings.

## CP4 (9/30)
- `07-previews/cp4/`: AI OS + Scrollcraft ads, 16x9 + 9x16 + SRTs, QA all PASS (CHECKPOINT-4.md).
- New assets: `05-visual-assets/drive/Nate JARVIS Overlay.png`, `captures/aios-box.png`, `scrollcraft-demo/` (generic page + recording, official example clips). `tools/scroll-record.mjs`.
- Note: the rejected live-site scroll recording of aiautomationsociety.ai had partly run (252 frames); deleted, never used.
- Next: CP5 (VSL core + SOP-intro VSL). Needs D4 (events), D6 ($420K disclaimer), D8, D9 (proof), D12 (disk: 5.6 GB free).

## CP5 (9/30)
- Disk: 16.7 GB of old project media MOVED to SSD `Projects/_offloaded-local-renders/` (8 projects, per-file size verified, OFFLOADED-2026-09-30.txt in each). Local free 43 GB.
- Core split at the proof bridge into `04-edit-plan/clean/08-vsl-core-A.mp4` (50.0s) + `-B.mp4` (333.3s), both verify PASS. Captions re-timed to the renders (`tools/align-words.mjs`).
- Comps: `06-compositions/vsl-intro-sop`, `vsl-core-a`, `vsl-core-b` (split/solo layouts, 3s end-card hold). `tools/assemble-vsl.mjs` (frame-exact concat + continuous loudnorm'd audio + rebased SRT), `tools/vsl-map.mjs`, `tools/seek-shots.mjs`.
- Output: `07-previews/cp5/04 VSL - First AI Client SOP - 16x9.mp4` (+ .srt, MAP.md, map.json). QA all PASS.
- Next: CP6. Build intros 05/06/07, assemble 05/06 (intro + A + B) and 07 (intro + B), final QA on all 10, delivery to SSD `Claude Code/` subfolder (D13), confirm upload destination.

## CP5 r2 (9/30 evening)
- Aidan's CP5 notes and fixes: see `07-previews/cp5/CHECKPOINT-5.md` "Revision 2". Rows build in on the word (no dim "off" placeholders), scene-scoped whole-word anchors, phrase-level captions (`groupCaptionsV2`), Lucide handshake/cpu icons, official AIS+ wordmark (`05-visual-assets/brand/ais-plus-logo-white.png` + `ais-plus-icon.png`), D8 core micro-cut R8 applied (core B now 332.367s, verify PASS).
- r1 outputs kept in `07-previews/cp5/_r1/`.
- Blocked: Skool classroom screenshots need Aidan logged in to skool.com in the browser pane.
- CP6 carry-over: SOP ads (01, both formats) still use the old handshake glyph; re-render them in the final pass. Apply the same VSL rules to intros 05/06/07.

## CP6 (9/30 night)
- Aidan approved CP5 r2 ("go to checkpoint 6").
- Intros built + rendered: `06-compositions/vsl-intro-aios`, `vsl-intro-scrollcraft`, `vsl-intro-generic` (specs VSL_AIOS_INTRO / VSL_SCROLL_INTRO + SCROLL_INTRO_MEDIA / VSL_GENERIC_INTRO in build.mjs). 05 intro micro-cut R1 ("s- with") applied, verify PASS; cut-clean now maps words by midpoint (tight cuts dropped "support").
- VSLs 05/06/07 assembled into `07-previews/cp6/` (`VSL_OUT=07-previews/cp6 node tools/assemble-vsl.mjs ...`). SOP ads re-rendered for the handshake icon; all ad audio re-finished with a limiter (`tools/finish.mjs`, true peak was -0.9).
- `node tools/final-qa.mjs` -> `09-exports/` (hard links) + MANIFEST.md + qa.json: 10/10 PASS. Details: `07-previews/cp6/CHECKPOINT-6.md`.
- Next: Aidan's CP6 review, then delivery ONLY after he confirms the SSD `Claude Code/` subfolder and the external upload destination.
- CP6 APPROVED 9/30 (Aidan: "these all look good"), including the defaults: D6 $420K disclaimer, 05 "s- with" micro-cut, the four Draft courses kept in "What's inside". Only delivery remains (destination to confirm).
- DELIVERED 9/30 (Aidan chose: SSD `Claude Code/` subfolder, SSD only, no upload): 10 MP4s + 10 SRTs + 4 VSL chapter maps + MANIFEST.md + qa.json copied to `/Volumes/Extreme SSD/Uppit AI/AIS Live/October /Ads/2026-09-30 - Lead Magnets and AIS Plus/Claude Code/`, 26/26 files SHA-256 verified against `09-exports/`, AppleDouble stubs cleaned. Codex's `_sources`/`_checkpoints` untouched. Campaign complete.
- 9/30: delivery folder organized on request: `Ads - 16x9/`, `Ads - 9x16/`, `VSLs - 16x9/` (each .srt beside its video), `QA + chapter maps/`, MANIFEST.md at the top (layout section added; copy in `09-exports/MANIFEST.delivered.md`).
