# AIS Live — White Glass / Vertical

Three native 1080×1920 HyperFrames compositions. Centered headlines and animated glass illustrations occupy the upper half; Nate appears below in a rounded 952×720 window. Captions sit between the graphics and footage. The AIS Live red dot, speech edits, scene timings, and founder disclaimer are retained.

Compositions: `01-morning`, `02-assistant`, `03-founder`.

Run `node build.mjs` here to rebuild the HTML. From each composition directory, run `npm run check` and `npm run render`. Then run `python3 finish-exports.py` here to restore the verified audio without an additional encode, validate the MP4s, and copy them to `/Users/aidanstanik/Downloads/AIS ADS/Vertical`.

Each composition contains its media, fonts, GSAP, and a `qc` directory with a hero frame for every scene. `verification.json` records decoded video and audio checks. The original horizontal compositions and exports remain available.
