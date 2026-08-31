# Verification passes — video-projects/adobe-transfer-07-24/assets/clean.json

Result: FAIL · 1 fail(s), 9 warning(s)

## PASS 1 · silence sweep
- **OK** no inter-word pause exceeds 0.75s across 2655 words

## PASS 2 · cuts sweep
- **OK** all 33 phrase checks pass
- **WARN** possible residual stutter "really, really" at 2:19.98 — re-read in context
- **WARN** possible residual stutter "it. It" at 2:29.30 — re-read in context
- **WARN** possible residual stutter "Very, very" at 4:33.48 — re-read in context
- **WARN** possible residual stutter "the, the" at 5:22.38 — re-read in context
- **WARN** possible residual stutter "really, really" at 5:49.96 — re-read in context
- **WARN** possible residual stutter "really, really" at 6:07.06 — re-read in context
- **WARN** possible residual stutter "really, really" at 6:55.22 — re-read in context
- **WARN** possible residual stutter "really, really" at 7:02.96 — re-read in context
- **WARN** possible residual stutter "it. It" at 8:55.34 — re-read in context

## PASS 3 · ledger sweep
- **FAIL** rendered duration 787.98s vs EDL expectation 787.15s (drift 0.83s)

## Verdict — PASS (judgment layer, round 4)

- Pass 1: zero residual gaps across 2655 words.
- Pass 2: 33/33 phrase checks (every cut retake phrase count 0, every kept take
  exactly 1; "lots of rocks" 2x adjudicated correct — two different sentences).
  All 9 stutter WARNs re-read: emphatic doubling / sentence boundaries / the
  bottle apposition. Canyon anaphora reads clean.
- Pass 3: 0.83s drift over 150 joins = the known linear concat frame-padding
  (~5.5ms/join), proven via word-offset growth 0.21s -> 0.44s -> 0.76s.
- Round 3 (retake pass): 61 cuts, ~2:26 of surviving retakes/false starts
  removed via _retake-pass.mjs. Round 4: one final "I wanted," doubling cut
  (raw Scribe had merged it into a stretched token; fresh transcript exposed it).
