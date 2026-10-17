// Scratch: scrim-vs-video-push coverage check for the sidepanel fix (9/1). Dev tool, not part of the build.
// Condition: the global scrim's fully-opaque region must cover the bg strip the #video-stage x-push exposes.
// W = scrim width, O = opaque width, SH = video shift. Run: node _scrim-coverage.mjs
// coverage check: the scrim's fully-opaque region must always cover the bg strip
// exposed by the video push. W = scrim width, O = opaque width, SH = video shift.
const W = 1114, O = 768, SH = 380;
const p3io = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
const p3o  = t => 1 - Math.pow(1-t,3);
const p2io = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
const clamp = t => Math.max(0, Math.min(1, t));
function run(name, sc, vid) { // sc/vid: {t0, d, ease}
  let worst = 1e9, at = 0;
  for (let t = -1; t <= 1.5; t += 0.01) {
    const q = sc.ease(clamp((t - sc.t0)/sc.d)), p = vid.ease(clamp((t - vid.t0)/vid.d));
    const opaqueRight = -W*(1-q) + O, strip = SH*p;
    if (strip < 1) continue; const m = opaqueRight - strip;
    if (m < worst) { worst = m; at = t; }
  }
  console.log(name.padEnd(34), "worst margin", worst.toFixed(0), "px at", at.toFixed(2));
}
console.log("ENTER (S=0): scrim x -W->0, video x 0->SH");
run("scrim S-.35 .75 p3io | vid S-.1 .65", {t0:-.35,d:.75,ease:p3io}, {t0:-.1,d:.65,ease:p3io});
run("scrim S-.3 .7 p3io | vid S-.1 .65",   {t0:-.3,d:.7,ease:p3io},   {t0:-.1,d:.65,ease:p3io});
run("scrim S-.25 .7 p3io | vid S-.1 .65",  {t0:-.25,d:.7,ease:p3io},  {t0:-.1,d:.65,ease:p3io});
run("scrim S-.2 .65 p3io | vid S .65",     {t0:-.2,d:.65,ease:p3io},  {t0:0,d:.65,ease:p3io});
run("scrim S-.1 .55 p3o | vid S-.1 .65",   {t0:-.1,d:.55,ease:p3o},   {t0:-.1,d:.65,ease:p3io});
run("scrim S-.25 .7 p2io | vid S-.1 .65",  {t0:-.25,d:.7,ease:p2io},  {t0:-.1,d:.65,ease:p3io});
console.log("EXIT (E=0): scrim x 0->-W (progress q), video x SH->0 (progress p)");
function runExit(name, sc, vid) {
  let worst = 1e9, at = 0;
  for (let t = -1.5; t <= 1; t += 0.01) {
    const q = sc.ease(clamp((t - sc.t0)/sc.d)), p = vid.ease(clamp((t - vid.t0)/vid.d));
    const opaqueRight = -W*q + O, strip = SH*(1-p);
    if (strip < 1) continue; const m = opaqueRight - strip;
    if (m < worst) { worst = m; at = t; }
  }
  console.log(name.padEnd(34), "worst margin", worst.toFixed(0), "px at", at.toFixed(2));
}
runExit("vid E-.55 .65 | scrim E-.45 .6 p3io", {t0:-.45,d:.6,ease:p3io}, {t0:-.55,d:.65,ease:p3io});
runExit("vid E-.55 .65 | scrim E-.4 .55 p3io", {t0:-.4,d:.55,ease:p3io}, {t0:-.55,d:.65,ease:p3io});
runExit("vid E-.65 .65 | scrim E-.45 .6 p3io", {t0:-.45,d:.6,ease:p3io}, {t0:-.65,d:.65,ease:p3io});
runExit("vid E-.7 .65 | scrim E-.45 .55 p3io", {t0:-.45,d:.55,ease:p3io}, {t0:-.7,d:.65,ease:p3io});
runExit("vid E-.55 .65 | scrim E-.3 .5 p3io", {t0:-.3,d:.5,ease:p3io}, {t0:-.55,d:.65,ease:p3io});
