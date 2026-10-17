# Checkpoint 4: AI OS + Scrollcraft ads

## Files (this folder)
| File | Format | Length |
| --- | --- | --- |
| 02 AD - AI OS Template - 16x9.mp4 (+ .srt) | 1920x1080, 30p | 1:09.9 |
| 02 AD - AI OS Template - 9x16.mp4 (+ .srt) | 1080x1920, 30p | 1:09.9 |
| 03 AD - Scrollcraft - 16x9.mp4 (+ .srt) | 1920x1080, 30p | 0:51.8 |
| 03 AD - Scrollcraft - 9x16.mp4 (+ .srt) | 1080x1920, 30p | 0:51.8 |

## Edits
- AI OS: raw 1:38.4 to 1:09.9. False start "Jarvis works so well--" (raw 0:38) removed, 7 long pauses trimmed, 0.9s CTA hold. Verify PASS (fresh re-transcription).
- Scrollcraft: raw 1:04.4 to 0:51.8. Single take, 6 pauses trimmed, 0.85s CTA hold. Verify PASS.

## Where the visuals come from (all real, from the script-doc links or approved downloads)
| Visual | Source |
| --- | --- |
| Jarvis open | `Nate JARVIS Overlay.png` (Steven's Drive link in the script doc) |
| 3D brain (2 moments) | `docs/media/3d-brain-demo.mp4` in Nate's public AIS-OS repo (his HerkBrain) |
| 4Cs one-liners | AIS-OS README ("Knows your business", "Reaches your stuff", "Knows how to do the work", "Runs without being asked") |
| Six skills | AIS-OS repo: /onboard, /grill-me, /audit, /link, /level-up, /3d-brain |
| AI OS box | `ai-os-box.svg` on the AI OS opt-in page, rendered transparent at 2x |
| Scrollcraft "after" | the official Scrollcraft examples (the "Built with Scrollcraft" preview on the opt-in page + its two siblings in the repo): PERKFORM, nateherk.com, AIS site |
| Scrollcraft "before" | a real AI-built page: a fresh agent built an AIS landing page from the same facts with no design skill, then I scroll-recorded it |
| "Re-explaining" chat bubbles | illustrative text only (no claims) |

## QA (all four)
| Check | Result |
| --- | --- |
| Full decode | clean |
| Loudness | -16.0 LUFS, true peak -0.9 dBTP |
| Audio | verified clean edit, A/V durations equal |
| Black / frozen frames | none |
| Captions | AI OS 242/242 words, Scrollcraft 189/189 words covered, 0 overlaps, text matches fresh transcript (Claude Code fixed) |
| Frames read | every scene hero frame in both formats + the compare frame at full size |
| Lint | 0 errors (1 organizational caption-density warning) |

## Decisions for you
1. **Jarvis overlay:** it shows "STARK INDUSTRIES" / "J.A.R.V.I.S." / "Stark Tower" (Marvel marks) for the first 6s of a paid ad. Keep, or swap for an original glass HUD?
2. **D7 applied:** captions keep "or any other AI agent that you wanna use" (it's what Nate says); graphics say Claude Code + Codex only.
3. **Generic "before" page:** OK to present a no-skill AI build as "Generic AI-built page"?
4. The nateherk.com example's hero (old 950,000+ stat) is skipped; only its later sections appear.

## Revision 1 (9/30, Aidan: spacing / alignment)
- 16:9 "Hours spent re-explaining": chat bubbles now start on the headline's left edge (were right-aligned, 375px off).
- 9:16 final CTA: stacked and centered (AI OS box, "Works with", Claude Code / Codex, "Free template, link below" all on x=540).
- New `tools/align-audit.mjs`: seeks every scene to its hero frame and measures real content edges. AI OS 16:9 + 9:16, Scrollcraft 16:9 + 9:16, SOP 9:16 all 0 off-axis. SOP 16:9 has one intentional exception (the 3D-tilted SOP cover sits 27px in).
- AI OS re-rendered + finished: -16 LUFS, clean decode.

## Revision 2 (9/30, Aidan: captions covering graphics in the short form)
- Cause: revision 1 stacked the 9:16 CTA, pushing "Free template, link below" 48px into the caption band (captions sit at y=932).
- Fix: "Works with" + Claude Code + Codex on one centered row, box 180px; the CTA now clears the captions.
- `tools/align-audit.mjs` now also checks the caption band (every scene graphic and visible media window must end >= 14px above the captions). All six ads: 0 caption collisions. AI OS 9:16 re-rendered + finished (-16 LUFS, clean decode).
