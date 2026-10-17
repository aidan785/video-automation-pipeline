# AIS Live — White Glass in HyperFrames

Native HyperFrames HTML/CSS compositions animated with GSAP. White space, graphite Inter type, restrained cyan reflections, translucent glass panels with backdrop blur and edge highlights, a rounded speaker window, and the AIS Live red dot. Visual references: the user's Steadyflow and Vitalis After Effects walkthroughs.

## Files

- `01-morning/index.html` — The 30-Minute Morning, 31.93 seconds.
- `02-assistant/index.html` — AI Executive Assistant, 37.10 seconds.
- `03-founder/index.html` — The $420K AI OS, 42.57 seconds.
- `build.mjs` — source definitions, layouts, captions and timeline generator.
- `scenes.json` — scene timings and headlines.
- `DESIGN.md` — visual direction.
- Each composition is self-contained, with its own clean footage, fonts and GSAP.

## Rebuild

From this folder, run `node build.mjs`. From each numbered composition, run `npm run check`, then:

```sh
../../../../node_modules/.bin/hyperframes render --quality standard --fps 30 --workers 2 --output renders/white-glass-hyperframes.mp4
```

Back in this folder, run `python3 finish-exports.py`. This remuxes the verified audio unchanged to avoid AAC encoder priming delay, checks the full video decode and audio alignment, creates QC stills, and copies the final MP4s to the SSD.

Run `npm run dev` from a numbered composition to open it in HyperFrames Studio.

## Validation

All three compositions pass lint without errors, contrast validation, and layout inspection. The only lint warning is the single caption track containing many timed captions. It has no overlapping captions. `verification.json` records full decode and audio checks; `qc/contact.jpg` in each composition contains one hero frame per scene.

Exports: `/Volumes/Extreme SSD/Uppit AI/AIS Live/October /Ads/Edited/White Glass - HyperFrames/`.
