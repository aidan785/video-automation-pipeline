# AIS lead magnet ads + AIS+ VSLs: exports (Claude Code run)

Brief: Steven, 9/30. 3 ads (16:9 + 9:16) + 4 AIS+ VSLs (16:9). Dark Glass HyperFrames system. Burned-in captions + SRT sidecars. Audio -16 LUFS / -1 dBTP.

| # | File | Length | Size | Loudness | QA | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 01 AD - First AI Automation Client SOP - 16x9.mp4 (+ .srt) | 0:54.8 | 1920x1080, 25.5 MB | -16.1 LUFS / -1.8 dBTP | PASS | CP3 approved; CP6 re-render for the handshake icon only |
| 2 | 01 AD - First AI Automation Client SOP - 9x16.mp4 (+ .srt) | 0:54.8 | 1080x1920, 28.9 MB | -16.1 LUFS / -1.8 dBTP | PASS | CP3 approved; CP6 re-render for the handshake icon only |
| 3 | 02 AD - AI OS Template - 16x9.mp4 (+ .srt) | 1:09.9 | 1920x1080, 34.5 MB | -16.1 LUFS / -1.8 dBTP | PASS | CP4 approved; audio re-finished with a peak limiter (true peak was -0.9), video bit-identical |
| 4 | 02 AD - AI OS Template - 9x16.mp4 (+ .srt) | 1:09.9 | 1080x1920, 38.9 MB | -16.1 LUFS / -1.8 dBTP | PASS | CP4 approved; audio re-finished with a peak limiter (true peak was -0.9), video bit-identical |
| 5 | 03 AD - Scrollcraft - 16x9.mp4 (+ .srt) | 0:51.8 | 1920x1080, 29.4 MB | -16.1 LUFS / -1.8 dBTP | PASS | CP4 approved; audio re-finished with a peak limiter (true peak was -0.9), video bit-identical |
| 6 | 03 AD - Scrollcraft - 9x16.mp4 (+ .srt) | 0:51.8 | 1080x1920, 32.3 MB | -16.1 LUFS / -1.8 dBTP | PASS | CP4 approved; audio re-finished with a peak limiter (true peak was -0.9), video bit-identical |
| 7 | 04 VSL - First AI Client SOP - 16x9.mp4 (+ .srt) | 7:08.5 | 1920x1080, 217.6 MB | -16.1 LUFS / -1.7 dBTP | PASS | CP5 r2 approved (Skool screenshots) |
| 8 | 05 VSL - AI OS Template - 16x9.mp4 (+ .srt) | 7:15.5 | 1920x1080, 221.7 MB | -16.1 LUFS / -1.5 dBTP | PASS | CP6: new intro + shared core A + B |
| 9 | 06 VSL - Scrollcraft - 16x9.mp4 (+ .srt) | 7:24.4 | 1920x1080, 229.6 MB | -16.1 LUFS / -1.5 dBTP | PASS | CP6: new intro + shared core A + B |
| 10 | 07 VSL - Generic (free Skool join emails) - 16x9.mp4 (+ .srt) | 6:34.3 | 1920x1080, 200.3 MB | -16.1 LUFS / -1.4 dBTP | PASS | CP6: new intro + core B (from the proof bridge) |

Checks per file: 1080p/1080x1920 at 30 fps CFR, video = audio length, full decode with no warnings, loudness within 1 LU of -16 with true peak at or under -1 dBTP, every frame step 1/30s (no dropped or held frames at joins), no black frames, no frozen stretches over 1.5s (except the VSL end-card hold), SRT cues in order, non-overlapping and inside the video. Raw numbers: `qa.json`.

VSL structure: 04/05/06 = custom intro + core A + core B; 07 = Generic intro + core B (enters at the proof bridge). Chapter + cut maps: the `* - MAP.md` file next to each VSL.
