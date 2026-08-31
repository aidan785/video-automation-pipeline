#!/usr/bin/env node
// Composites the rendered alpha MOVs onto the interview.
//
// v3 (2026-08-26): re-pointed at Aidan's OWN manual cut in
// `CAIC/Interviews/Editing /Raw interview 1.mp4`. He trimmed the head and tail
// himself and asked for nothing to be cut — so this script no longer touches
// the edit at all. Its only job is to lay the intro card on the front.
//
// That source is 640x360, upscaled to 1280x720 (lanczos) so the 1920x1080
// authored card stays crisp. A `titleLead` of black is padded onto the front so
// the title card is already up when the conversation starts underneath it.
//
//   node _composite.mjs                 # full render
//   node _composite.mjs --preview 0 12  # just a window, for eyeballing
//   node _composite.mjs --print         # print the ffmpeg command, run nothing

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

const EDIT_DIR = "/Volumes/Extreme SSD/Uppit AI/Projects/CAIC/Interviews/Editing ";
const SRC = join(EDIT_DIR, "Raw interview 1.mp4");
const OUT_NAME = "Interview 1 - AI Governance for Builders - EDITED.mp4";
const GFX = join(EDIT_DIR, "_gfx", "i1");

// Output spec. The source is 640x360/25 — upscale for the card, keep the rate.
const W = 1280, H = 720, FPS = "25";
// Source is smaller than the output, so it needs a scale. Cards are authored
// 1920x1080 and get scaled to fit.
const BASE_SCALE = `scale=${W}:${H}:flags=lanczos`;

const plan = JSON.parse(readFileSync(join(HERE, "_plan.json"), "utf8"));
const LEAD = plan.titleLead;

const args = process.argv.slice(2);
const printOnly = args.includes("--print");
const pi = args.indexOf("--preview");
const preview = pi >= 0 ? { from: Number(args[pi + 1]), to: Number(args[pi + 2]) } : null;
const out = preview
  ? join(GFX, `preview-i1-${preview.from}-${preview.to}.mp4`)
  : join(EDIT_DIR, OUT_NAME);

// Overlay start on the OUTPUT timeline. The title sits at 0; everything else
// is a source-timeline time shifted by the prepended title lead.
const gfx = plan.graphics.map((g) => ({
  id: g.id,
  kind: g.kind,
  at: g.kind === "title" ? 0 : +(g.start + LEAD).toFixed(3),
  dur: g.duration,
}));

// How long the title takes to dissolve off at the end of its hold.
const TITLE_DISSOLVE = 1.5;

const inputs = ["-i", SRC];
for (const g of gfx) inputs.push("-i", join(GFX, `${g.id}.mov`));

const chains = [];
chains.push(
  `[0:v]${BASE_SCALE},setsar=1,` +
    `tpad=start_duration=${LEAD}:start_mode=add:color=black,` +
    `format=yuv420p[base]`,
);

let last = "base";
gfx.forEach((g, i) => {
  const src = `${i + 1}:v`;
  if (g.kind === "title") {
    // The card renders with an effectively transparent background (see the note
    // in _gen.mjs), so give it an opaque black plate of its own and dissolve the
    // whole plate. That way the interview audio runs underneath a solid title
    // and only appears when the plate fades.
    const st = +(g.dur - TITLE_DISSOLVE).toFixed(3);
    chains.push(`color=c=black:s=${W}x${H}:r=${FPS}:d=${g.dur},format=rgba[plate${i}]`);
    chains.push(
      `[${src}]format=rgba,scale=${W}:${H}:flags=lanczos,setsar=1,` +
        `trim=0:${g.dur},setpts=PTS-STARTPTS[card${i}]`,
    );
    chains.push(`[plate${i}][card${i}]overlay=0:0:format=auto[titled${i}]`);
    chains.push(
      `[titled${i}]format=rgba,fade=t=out:st=${st}:d=${TITLE_DISSOLVE}:alpha=1,` +
        `setpts=PTS-STARTPTS+${g.at}/TB[g${i}]`,
    );
  } else {
    chains.push(
      `[${src}]format=rgba,scale=${W}:${H}:flags=lanczos,setsar=1,` +
        `trim=0:${g.dur},setpts=PTS-STARTPTS+${g.at}/TB[g${i}]`,
    );
  }
  const label = i === gfx.length - 1 ? "vout" : `v${i}`;
  chains.push(
    `[${last}][g${i}]overlay=0:0:eof_action=pass:repeatlast=0:` +
      `enable='between(t,${g.at},${(g.at + g.dur).toFixed(3)})'[${label}]`,
  );
  last = label;
});
chains.push(`[0:a]adelay=${Math.round(LEAD * 1000)}|${Math.round(LEAD * 1000)}[aout]`);

const cmd = [
  "ffmpeg", "-y",
  ...inputs,
  "-filter_complex", chains.join(";"),
  "-map", "[vout]",
  "-map", "[aout]",
  ...(preview ? ["-ss", String(preview.from), "-to", String(preview.to)] : []),
  "-c:v", "libx264",
  "-preset", preview ? "veryfast" : "medium",
  "-crf", "20",
  "-pix_fmt", "yuv420p",
  "-r", FPS,
  "-c:a", "aac",
  "-b:a", "160k",
  "-movflags", "+faststart",
  out,
];

if (printOnly) {
  console.log(cmd.map((a) => (/[ ';]/.test(a) ? `'${a}'` : a)).join(" "));
  process.exit(0);
}

console.log(`compositing ${gfx.length} graphic(s) -> ${out}`);
for (const g of gfx) console.log(`  ${g.id.padEnd(14)} @ ${g.at}s for ${g.dur}s`);
const r = spawnSync(cmd[0], cmd.slice(1), { stdio: "inherit" });
process.exit(r.status ?? 1);
