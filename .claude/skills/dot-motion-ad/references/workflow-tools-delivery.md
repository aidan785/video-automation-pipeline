# Workflow, tools, delivery

## Reference study

- **Extract every frame at 24fps** at 320px. Make overview sheets (every 3rd frame) and full-24fps transition strips labelled `fNNNN_ss.ssss`, with ffmpeg `drawtext` or a Python montage.
  - The strips live in `video-projects/hp-teaser-translated/_research/chatgpt-strips/T01–T32`.
- **Per-frame series:** luma, dark fraction and frame diff (`series.tsv`). Hard cuts show up as diff spikes.
- **Track blob radius and position per frame** to get real easing curves. Fit them to a cubic-bezier (the opening breath came out as about (.5,0,.3,1)).
- **Delegating the breakdown:** a subagent can do this, but subagents can't write report files. Have it return the analysis in its final message.

## Review loop (every change)

1. **Lint.** From the project: `npx hyperframes lint`. It must show 0 errors (2 warnings are normal).
2. **Shot sheet.**
   - Command: `node scripts/style-library/_hp3-shot.mjs video-projects/<slug>/index.html <scratch>/<prefix> t1,t2,...`
   - Times are comp seconds (f/30).
   - It writes `<prefix>-<t>.png` plus `<prefix>-sheet.jpg`, and prints console errors.
   - **Read the sheet.** Shoot around every transition you touched: before, during and after.
3. **Glitch scan.**
   - Command: `node scripts/style-library/_glitch-scan.mjs <abs path index.html> <compId>`
   - It steps every frame at 24fps and flags frame-diff spikes. Only intended hard changes may spike: burst, cover, invert, strobe, cuts.
4. **Studio.** He wants Studio, not my `_player.html`:
   ```bash
   cd video-projects/<slug>
   lsof -ti:3018 | xargs kill -9
   nohup ../../.hf-cli/node_modules/.bin/hyperframes preview --port 3018 > <scratch>/studio.log 2>&1 &
   # poll until curl localhost:3018 == 200, then
   open http://localhost:3018
   ```
   - Restart after asset changes (the cache holds old sprites and audio).
   - If loading hangs, move archives out of the project.
   - `templates/_player.html` (served by `npx serve . -p 8092 -n`) is the fallback real-time player synced to the music: space plays, arrow keys step 1 frame, shift steps 1s.
5. **Archive** the previous version (`cp index.html ../<slug>-archive/<scene>-vN.html`) before every rework. Old sprites and audio go to `sprites-v1/` and `audio-v1/`.
6. **Report** casually, with no em dashes: what changed, his frame numbers, and what's not verified.

## Render + deliver (only on his explicit go)

```bash
cd video-projects/<slug>
npx hyperframes render --quality standard --workers auto --browser-gpu --gpu --output renders/<name>.mp4   # run in background, log to file; never pipe through tail
```

- A 59s canvas comp rendered in 59s, 107 MB. Check disk space first (`df -h /Users`).
- **Verify the render itself:** ffprobe it, extract about 12 frames across the timeline into a tile sheet and `Read` it, and measure loudness with `ffmpeg -af ebur128`.
- **Upload with gws** (shared drives need `supportsAllDrives`):
  ```bash
  gws drive files get --params '{"fileId":"<folder>","supportsAllDrives":true,"fields":"id,name,driveId"}'
  gws drive files create --params '{"supportsAllDrives":true,"fields":"id,name,size,webViewLink"}' \
    --json '{"name":"<Title> - v1.mp4","parents":["<folder>"]}' --upload renders/<name>.mp4
  ```
- v1 went to "Edited Teaser" (`1k2HjVI6d0W1yIVrnOPlO9WOC_OT8p0HR`) as "HP Teaser - ChatGPT Dots - v1.mp4".

## Memory

- Project notes: `memory/hp-signal-teaser.md` (a running log of every scene version).
- Method: `memory/dot-motion-recreation-method.md`.
- Update both after each round.
