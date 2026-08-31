# Verification passes — video-projects/ais-plus-13-cadence/assets/clean-fresh.json

Result: FAIL · 2 fail(s), 5 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 1.16s at 0:58.84 between "helps," and "um,"
- **FAIL** residual pause 0.86s at 2:05.18 between "is" and "what"

## PASS 2 · cuts sweep
- **WARN** no phrase checks supplied (pass --candidates + --cuts, or --phrases) — cut removal verified by ledger only
- **WARN** possible residual stutter "triggers. Triggers" at 0:16.50 — re-read in context
- **WARN** possible residual stutter "capabilities. Capabilities" at 2:24.86 — re-read in context
- **WARN** possible residual stutter "really, really" at 2:34.04 — re-read in context
- **WARN** possible residual stutter "really, really" at 2:34.78 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 160.37s matches EDL expectation 160.19s (drift 0.17s)
