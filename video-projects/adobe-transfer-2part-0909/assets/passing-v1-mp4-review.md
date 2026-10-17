# Passing agent — v1 MP4 — FAIL

Evidence is fresh transcription clean-v1-fresh.json from the completed clean-v1.mp4, not a retimed transcript or the preliminary WAV transcript. Mechanical report: passing-v1-mp4-mechanical.md.

## Pass 1 — full silence sweep

Reviewed the complete 269-sentence fresh transcript in order with timing and sentence joins. One inter-word gap exceeds the configured0.7s gate:0.94s at9:11.93, “before” to “Once.” Source-mapped tightening was already routed to the editor. First speech begins0.08s; last ends1260.417s, leaving about0.316s tail. No other long break, missing section of speech, or surviving waiting chatter appears in this complete read.

## Pass 2 — full cuts and editorial sweep

Reviewed the complete fresh speech against the approved mistakes and raw sequence. All63 explicit phrase checks pass. Nine adjacent-word warning pairs preserve intended emphasis, grammar (“access to to set”), or separate slot clicks (“Add, add”). Both similar-sentence detector pairs are independent tutorial examples or steps, not retakes.

Confirmed failures: “I don't know” was overcut before “the technical term”; “create sculpt things” and “confused to as why” remain. Root has prepared corrections and separately confirmed the initial S- flub before Seedance. The actual MP4 ASR also spells a slight “j-just” around9:09; WAV ASR says “just,” so route for isolated audio inspection, not automatic removal. “Session” is correctly audible and transcribed.

## Pass 3 — full ledger and coverage sweep

Revisited the complete269-sentence sequence from the opener through the final outro for meaning coverage and accidental loss, with token alignment against the planned transcript. The sole aligned multi-word deletion is “I don't know.” All principal tutorial steps and the ending remain. No external script was supplied, so a script-coverage claim is not made.

Union EDL keep sum1260.733333s plus delete sum2621.466667s equals source3882.2s exactly. Expected frame count37822 matches root's measured video frame count37822. Root measured video duration1260.733008s; drift from union is0.000325s. Single union EDL is applicable, so no sequential chain is required. Source order is1.mov then2.mov in source.ffconcat.

Verdict: FAIL; v2 corrections required. All three passes must restart on a fresh transcription of completed v2 MP4. Prepared passing-v2-phrase-checks.json with68 explicit checks, including restoration of “I don't know the technical term” and removal/retention checks for the two micro-flubs.
