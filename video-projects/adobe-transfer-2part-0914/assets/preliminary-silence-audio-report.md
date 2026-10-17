# Verification passes — video-projects/adobe-transfer-2part-0914/assets/silences-audio-precheck.json

Result: FAIL · 10 fail(s), 9 warning(s)

## PASS 1 · silence sweep
- **FAIL** tail dead air: 1.19s after last word (max 0.9s)
- **FAIL** residual pause 0.86s at 1:06.96 between "leaves" and "that"
- **FAIL** residual pause 1.04s at 1:44.16 between "here," and "it's"
- **FAIL** residual pause 41.03s at 2:29.99 between "better." and "We"
- **FAIL** residual pause 2.13s at 3:12.71 between "you" and "want."
- **FAIL** residual pause 2.56s at 3:23.78 between "want." and "So"
- **FAIL** residual pause 1.27s at 3:37.76 between "the..." and "I"
- **FAIL** residual pause 1.04s at 9:53.14 between "there." and "Shoot"
- **FAIL** residual pause 0.99s at 10:24.91 between "gonna--" and "And"
- **FAIL** residual pause 0.96s at 12:31.12 between "code." and "But"

## PASS 2 · cuts sweep
- **WARN** no phrase checks supplied (pass --candidates + --cuts, or --phrases) — cut removal verified by ledger only
- **WARN** possible residual stutter "But, but" at 1:16.70 — re-read in context
- **WARN** possible residual stutter "and, and," at 1:28.16 — re-read in context
- **WARN** possible residual stutter "and, and" at 1:28.85 — re-read in context
- **WARN** possible residual stutter "So, so" at 4:20.46 — re-read in context
- **WARN** possible residual stutter "the, the" at 6:45.78 — re-read in context
- **WARN** possible residual stutter "super, super" at 8:02.56 — re-read in context
- **WARN** possible residual stutter "to to" at 10:01.46 — re-read in context
- **WARN** possible residual stutter "sit, sit" at 12:35.72 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 869.85s matches EDL expectation 869.87s (drift 0.02s)
