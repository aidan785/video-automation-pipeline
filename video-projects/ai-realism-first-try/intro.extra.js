  // ================= project scenes (CUE = word times from the transcript) =================
  const pop = (sel, t, o = {}) => tl.fromTo(sel, { scale: o.from ?? 0.7, opacity: 0 },
    { scale: 1, opacity: 1, duration: o.dur ?? 0.24, ease: o.ease ?? "back.out(1.5)" }, snap(t));

  // ----- cold open: triptych breaks into pixels, contact sheet, match cut -----
  tl.fromTo("#trip .col img", { scale: 1 }, { scale: 1.06, duration: 3.2, ease: "none" }, snap(10.14));
  [[12.44, "s1"], [12.58, "s2"], [12.72, "s3"]].forEach(([t, c]) => tl.set("#trip .col img." + c, { opacity: 1 }, snap(t)));
  ["#tc1", "#tc2", "#tc3"].forEach((c, i) => tl.set(c, { opacity: 0 }, snap(12.86 + i * 0.1)));
  [13.64, 13.88, 14.26].forEach((t, i) => tl.fromTo("#pr" + (i + 1) + " img, #pr" + (i + 1) + " .nm", { scale: 0.6, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }, snap(t)));
  tl.fromTo("#sheet .tk", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power3.out", stagger: 0.08 }, snap(14.8));
  // match cut: the gate opens, the sheet flies to the wall, then its twin behind Aidan takes over and tucks in behind his head
  tl.to("#gate1", { opacity: 0, duration: 0.16, ease: "power1.out" }, snap(15.56));
  tl.to("#sheet", { x: -128, y: 86, scale: 0.4274, duration: 0.46, ease: "power3.inOut" }, snap(15.56));
  tl.fromTo("#bh-sheet", { x: 0, rotation: 0, scale: 0.4274 }, { x: 60, rotation: -3, scale: 0.46, duration: 0.3, ease: "back.out(1.6)" }, snap(CUE.sheetLand + 0.04));
  // the sheet is gone before the camera pushes in on the next sentence
  tl.to("#bh-sheet", { opacity: 0, duration: 0.12, ease: "power1.in" }, snap(CUE.sheetOut - 0.14));
  tl.set("#bh-sheet", { opacity: 0 }, snap(CUE.sheetOut - 0.02));

  // ----- "50 re-rolls later, credits gone, bank account drained": one bad take per clause -----
  pop("#bh-rr1", CUE.fifty - 0.06);
  pop("#bh-rr2", CUE.credits - 0.06);
  pop("#bh-rr3", CUE.bank - 0.06);
  tl.to(".rr", { opacity: 0, duration: 0.12, ease: "power1.in" }, snap(CUE.badOut - 0.14));
  tl.set(".rr", { opacity: 0 }, snap(CUE.badOut - 0.02));

  // ----- "every shot you just saw took one generation": the three clips behind him -----
  pop("#bh-c1", CUE.every + 0.2);
  pop("#bh-c2", CUE.every + 0.5);
  pop("#bh-c3", CUE.every + 0.8);
  tl.to(".vcard", { opacity: 0, duration: 0.12, ease: "power1.in" }, snap(CUE.clipsOut - 0.12));
  tl.set(".vcard", { opacity: 0 }, snap(CUE.clipsOut));

  // ----- montage wrappers are only visible inside their own window -----
  [[0, 1.3], [1.3, 2.75], [2.75, 4.25]].forEach(([a, b], i) => {
    tl.set("#montw" + (i + 1), { opacity: 1 }, snap(CUE.montIn + a));
    tl.set("#montw" + (i + 1), { opacity: 0 }, snap(CUE.montIn + b));
  });
