# Verification passes — clean.json

Result: FAIL · 5 fail(s), 1 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 9.26s at 0:10.88 between "consistency." and "I"
- **FAIL** residual pause 6.38s at 0:37.68 between "drink." and "And"
- **FAIL** residual pause 0.94s at 4:00.92 between "is" and "natural"
- **FAIL** residual pause 8.80s at 5:59.74 between "on." and "And"

## PASS 2 · cuts sweep
- **WARN** no phrase checks supplied (pass --candidates + --cuts, or --phrases) — cut removal verified by ledger only
- **OK** no immediate word repeats remain

## PASS 3 · ledger sweep
- **FAIL** rendered duration 532.70s vs EDL expectation 532.13s (drift 0.57s)
