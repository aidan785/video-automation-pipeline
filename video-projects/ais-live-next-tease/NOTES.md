# #24 What's Next Tease — graphic + 30s video (NEUTRAL, no September)

Released 5-7 days post-event. Closes the loop on July, opens the door to what's next.
**September is NOT confirmed** (standing no-unverified-future-events rule) — all copy is
neutral: "This was just the beginning." / "More to build. More to earn. Stay close."
When September IS confirmed: swap the S4 headline + statics' headline/footer and re-render.

## Video (index.html) — 30s, 1920x1080, lint 0/0
1. S1 (0-5) mark flash + "2026 · THAT'S A WRAP"
2. S2 (5-11) stat pair: 1600+ BUILDERS (verified) / 2 DAYS
3. S3 (11-18) 3-up footage strip (Anatomy panel, Tool War panel, Nate+Matt) — root-level
   freeze-safe mounts, clips copied from ais-live-highlight-reel/assets/clips/
4. S4 (18-24) "This was just the beginning."
5. S5 (24-30) mark hold + "More to build. More to earn. Stay close."

## Static graphics — `node _gen-graphics.mjs` -> graphics/static-{landscape,square,story}.html
1920x1080 / 1080x1080 / 1080x1920. Same copy stack. To PNG:
```
cp graphics/static-<fmt>.html index.html
npx hyperframes snapshot . --at 0.5 --output snapshots/static-<fmt>
git checkout index.html   # or re-copy the video comp back
```
(Don't leave a second root .html with data-composition-id in the project dir — lint errors.)

## Render
```
npx hyperframes render --quality standard --fps 30 --output renders/next-tease.mp4
```
