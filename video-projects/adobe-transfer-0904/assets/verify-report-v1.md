# Verification passes — assets/clean-v1.json

Result: FAIL · 16 fail(s), 2 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 2.40s at 0:06.30 between "this," and "gave"
- **FAIL** residual pause 3.25s at 0:10.35 between "movements," and "even"
- **FAIL** residual pause 3.40s at 0:20.02 between "5.1." and "Gave"
- **FAIL** residual pause 1.52s at 0:25.14 between "animation," and "and"
- **FAIL** residual pause 5.32s at 0:32.96 between "zooms." and "And"
- **FAIL** residual pause 2.90s at 0:52.14 between "minutes." and "And"
- **FAIL** residual pause 0.96s at 1:55.94 between "some" and "caveats."
- **FAIL** residual pause 0.84s at 5:10.56 between "his" and "feet."
- **FAIL** residual pause 1.99s at 5:55.07 between "this." and "So"

## PASS 2 · cuts sweep
- **FAIL** phrase count: "I connected Fable 5.1 to blender-rigged characters" found 0x, expected 1x
- **FAIL** phrase count: "from a mocab library" found 0x, expected 1x
- **FAIL** phrase count: "here's Opus 4.8" found 0x, expected 1x
- **FAIL** phrase count: "tools that I used" found 1x, expected 0x
- **FAIL** phrase count: "inside of Blender" found 5x, expected 3x
- **FAIL** phrase count: "and boom we get a backflip" found 0x, expected 1x
- **FAIL** phrase count: "you can utilize Claude Fable 5.1 to animate your rigged characters" found 0x, expected 1x
- **WARN** possible residual stutter "very, very" at 1:50.46 — re-read in context
- **WARN** possible residual stutter "much, much" at 4:54.54 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 393.73s matches EDL expectation 393.33s (drift 0.40s)
