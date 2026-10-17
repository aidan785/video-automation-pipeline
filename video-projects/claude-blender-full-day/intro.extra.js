  // ================= project scenes (CUE = word times from the transcript) =================
  const pop = (sel, t, o = {}) => tl.fromTo(sel, { scale: o.from ?? 0.7, opacity: 0 },
    { scale: 1, opacity: 1, duration: o.dur ?? 0.24, ease: o.ease ?? "back.out(1.5)" }, snap(t));

  // ----- cold open: the ring ship is stills only, so each one gets a steady push or drift -----
  tl.fromTo("#rs1 img", { scale: 1.0 }, { scale: 1.08, duration: 1.6667, ease: "none" }, 0);
  tl.fromTo("#rs2 img", { scale: 1.1, xPercent: 1.4 }, { scale: 1.04, xPercent: -1.4, duration: 1.3, ease: "none" }, snap(1.6667));
  tl.fromTo("#rs3 img", { scale: 1.02 }, { scale: 1.08, duration: 0.9667, ease: "none" }, snap(2.9667));

  // ----- contact sheet: one print per build on "I didn't / build / a single one", then the labels -----
  tl.fromTo("#pr1 img, #pr1 .nm", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }, snap(CUE.didnt - 0.06));
  tl.fromTo("#pr2 img, #pr2 .nm", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }, snap(CUE.build - 0.06));
  tl.fromTo("#pr3 img, #pr3 .nm", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }, snap(CUE.single - 0.06));
  tl.fromTo("#sheet .tk", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power3.out", stagger: 0.08 }, snap(CUE.scenes - 0.2));
  // match cut (on the join into "I let Claude run Blender"): the gate opens, the sheet flies to the wall,
  // then its twin behind Aidan takes over and tucks in behind his head
  tl.to("#gate1", { opacity: 0, duration: 0.16, ease: "power1.out" }, snap(CUE.mc));
  tl.to("#sheet", { x: -234, y: 106, scale: 0.4, duration: 0.46, ease: "power3.inOut" }, snap(CUE.mc));
  tl.fromTo("#bh-sheet", { x: 0, rotation: 0, scale: 0.4 }, { x: 8, rotation: -3, scale: 0.42, duration: 0.3, ease: "back.out(1.6)" }, snap(CUE.sheetLand + 0.04));
  // the sheet is gone as the camera pushes in on the next sentence
  tl.to("#bh-sheet", { opacity: 0, duration: 0.12, ease: "power1.in" }, snap(CUE.sheetOut - 0.14));
  tl.set("#bh-sheet", { opacity: 0 }, snap(CUE.sheetOut - 0.02));

  // ----- "I give it a reference picture, and I let it work": the two reference pictures -----
  pop("#bh-ref1", CUE.ref - 0.06);
  pop("#bh-ref2", CUE.letit - 0.06);
  tl.to("#bh-ref1", { opacity: 0, duration: 0.12, ease: "power1.in" }, snap(CUE.refsOut - 0.14));
  tl.to("#bh-ref2", { opacity: 0, duration: 0.12, ease: "power1.in" }, snap(CUE.refsOut - 0.14));
  tl.set("#bh-ref1", { opacity: 0 }, snap(CUE.refsOut - 0.02));
  tl.set("#bh-ref2", { opacity: 0 }, snap(CUE.refsOut - 0.02));

  // ----- "looked at them and fixed its own mistakes": both builds step from first pass to finished on the words -----
  pop("#bh-pg1", CUE.pgIn);
  pop("#bh-pg2", CUE.pgIn + 0.1);
  tl.set("#bh-pg1 .s2", { opacity: 1 }, snap(CUE.looked - 0.04));
  tl.set("#bh-pg2 .s2", { opacity: 1 }, snap(CUE.looked - 0.04));
  tl.fromTo("#bh-pg1", { scale: 1.05 }, { scale: 1, duration: 0.2, ease: "power2.out", immediateRender: false }, snap(CUE.looked - 0.04));
  tl.fromTo("#bh-pg2", { scale: 1.05 }, { scale: 1, duration: 0.2, ease: "power2.out", immediateRender: false }, snap(CUE.looked - 0.04));
  tl.set("#bh-pg1 .s3", { opacity: 1 }, snap(CUE.fixed - 0.04));
  tl.set("#bh-pg2 .s3", { opacity: 1 }, snap(CUE.fixed - 0.04));
  tl.fromTo("#bh-pg1", { scale: 1.05 }, { scale: 1, duration: 0.2, ease: "power2.out", immediateRender: false }, snap(CUE.fixed - 0.04));
  tl.fromTo("#bh-pg2", { scale: 1.05 }, { scale: 1, duration: 0.2, ease: "power2.out", immediateRender: false }, snap(CUE.fixed - 0.04));
  tl.set("#bh-pg1 .s4", { opacity: 1 }, snap(CUE.mistakes - 0.04));
  tl.set("#bh-pg2 .s4", { opacity: 1 }, snap(CUE.mistakes - 0.04));
  tl.fromTo("#bh-pg1", { scale: 1.07 }, { scale: 1, duration: 0.24, ease: "power2.out", immediateRender: false }, snap(CUE.mistakes - 0.04));
  tl.fromTo("#bh-pg2", { scale: 1.07 }, { scale: 1, duration: 0.24, ease: "power2.out", immediateRender: false }, snap(CUE.mistakes - 0.04));
  tl.to("#bh-pg1", { opacity: 0, duration: 0.12, ease: "power1.in" }, snap(CUE.pgOut - 0.14));
  tl.to("#bh-pg2", { opacity: 0, duration: 0.12, ease: "power1.in" }, snap(CUE.pgOut - 0.14));
  tl.set("#bh-pg1", { opacity: 0 }, snap(CUE.pgOut - 0.02));
  tl.set("#bh-pg2", { opacity: 0 }, snap(CUE.pgOut - 0.02));

  // ----- "It even threw out some shots": the rejected stills land on the words, then drop on "wasn't good enough" (last in, first out) -----
  pop("#bh-rj1", CUE.threw - 0.06);
  pop("#bh-rj2", CUE.some - 0.06);
  pop("#bh-rj3", CUE.shots - 0.06);
  tl.to("#bh-rj3", { y: 760, rotation: -26, duration: 0.36, ease: "power2.in" }, snap(CUE.wasnt));
  tl.to("#bh-rj2", { y: 960, rotation: 28, duration: 0.38, ease: "power2.in" }, snap(CUE.wasnt + 0.16));
  tl.to("#bh-rj1", { y: 1160, rotation: -30, duration: 0.4, ease: "power2.in" }, snap(CUE.wasnt + 0.32));
  tl.set("#bh-rj3", { opacity: 0 }, snap(CUE.wasnt + 0.38));
  tl.set("#bh-rj2", { opacity: 0 }, snap(CUE.wasnt + 0.56));
  tl.set("#bh-rj1", { opacity: 0 }, snap(CUE.wasnt + 0.74));

  // ----- montage cutaway: ring ship still with a push, then the creature and the caterpillar (one clip) -----
  tl.fromTo("#montr img", { scale: 1.0 }, { scale: 1.07, duration: 1.3333, ease: "none" }, snap(CUE.montIn));
  tl.set("#montw1", { opacity: 1 }, snap(CUE.montV));
  tl.set("#montw1", { opacity: 0 }, snap(CUE.montOut));

  // ----- fixes on top of the generated timeline (project side, the template is untouched) -----
  // cold open captions: a caption and the one replacing it both draw on the boundary frame (clip windows are end-inclusive),
  // so each caption is switched off half a frame before its window closes
  document.querySelectorAll(".cap").forEach((el) => {
    const end = parseFloat(el.dataset.start) + parseFloat(el.dataset.duration);
    tl.set(el, { opacity: 0 }, end - F / 2);
  });
  // the last stack ("how to set it up") holds to the final frame: the cut into the video takes it out, not a fade
  const lastStack = [...document.querySelectorAll(".beat .stack")].pop();
  tl.getChildren(true, true, false).forEach((tw) => {
    if (tw.vars.opacity === 0 && tw.targets().includes(lastStack)) tl.remove(tw);
  });
