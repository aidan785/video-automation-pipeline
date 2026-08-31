/* Editing OS - UI (Workstream B)
 * Vanilla JS. Consumes only CONTRACT endpoints. Fixture mode via ?fixture=1.
 */
(function () {
  "use strict";

  var FIXTURE = new URLSearchParams(location.search).get("fixture") === "1";

  // ---------- Canonical stage order + labels ----------
  var STAGES = [
    { id: "source", label: "Source", code: "SRC" },
    { id: "transcript", label: "Transcript", code: "TRN" },
    { id: "silences", label: "Silences", code: "SIL" },
    { id: "mistakes", label: "Mistakes", code: "MIS" },
    { id: "verify", label: "Verify", code: "VER" },
    { id: "motion", label: "Motion", code: "MOT" },
    { id: "broll", label: "B-roll", code: "BRL" },
    { id: "render", label: "Render", code: "RND" },
    { id: "delivered", label: "Delivered", code: "DEL" }
  ];
  var STAGE_LABEL = {};
  STAGES.forEach(function (s) { STAGE_LABEL[s.id] = s.label; });

  // =====================================================================
  // FIXTURE DATA - realistic, exercises every UI state
  // =====================================================================
  var DAY = 86400000, HOUR = 3600000, MIN = 60000;
  var NOW = Date.parse("2026-07-24T09:30:00Z");

  function ev(file, kind, ago) { return { file: file, kind: kind, mtime: NOW - ago }; }
  function stage(id, status, evidence) { return { id: id, status: status, evidence: evidence || [] }; }

  // helper to guarantee all 9 stages present in canonical order
  function stages(map) {
    return STAGES.map(function (s) { return map[s.id] || stage(s.id, "unknown", []); });
  }

  var FX_PROJECTS = [
    // 1. Talking-head, direct evidence, final render, fresh
    {
      slug: "caic-p33-workflow",
      name: "CAIC P3.3 Workflow",
      family: "caic",
      archetype: "talking-head",
      utility: false,
      stages: stages({
        source: stage("source", "done", [ev("assets/p33-raw.mp4", "direct", 6 * DAY)]),
        transcript: stage("transcript", "done", [ev("assets/p33-raw.json", "direct", 6 * DAY - 2 * HOUR)]),
        silences: stage("silences", "done", [ev("assets/p33-raw.silence-edl.json", "direct", 5 * DAY)]),
        mistakes: stage("mistakes", "done", [ev("assets/approved-cuts.json", "direct", 5 * DAY - HOUR)]),
        verify: stage("verify", "done", [ev("assets/p33.verify.json", "proxy", 5 * DAY - 2 * HOUR)]),
        motion: stage("motion", "done", [ev("index.html", "direct", 3 * DAY)]),
        broll: stage("broll", "done", [ev("assets/broll/", "direct", 2 * DAY)]),
        render: stage("render", "done", [ev("renders/final.mp4", "direct", 26 * HOUR)]),
        delivered: stage("delivered", "unknown", [])
      }),
      renders: [
        { file: "renders/final.mp4", bytes: 214_800_000, mtime: NOW - 26 * HOUR, kind: "final", durationMs: 512000, stale: false },
        { file: "renders/draft.mp4", bytes: 42_100_000, mtime: NOW - 4 * DAY, kind: "draft", durationMs: 511000, stale: true }
      ],
      staleRender: false,
      lastTouched: NOW - 26 * HOUR,
      hasNotes: true,
      dirSizes: { renders: 256_900_000, assets: 1_940_000_000, total: 2_197_000_000 }
    },
    // 2. Talking-head, PROXY-only (clean.mp4) evidence, no render
    {
      slug: "caic-p22-scaling",
      name: "CAIC P2.2 Scaling",
      family: "caic",
      archetype: "talking-head",
      utility: false,
      stages: stages({
        source: stage("source", "done", [ev("assets/clean.mp4", "proxy", 3 * DAY)]),
        transcript: stage("transcript", "done", [ev("assets/p22.json", "direct", 3 * DAY - HOUR)]),
        silences: stage("silences", "done", [ev("assets/clean.mp4", "proxy", 3 * DAY)]),
        mistakes: stage("mistakes", "done", [ev("assets/clean.mp4", "proxy", 3 * DAY)]),
        verify: stage("verify", "done", [ev("assets/clean.mp4", "proxy", 3 * DAY)]),
        motion: stage("motion", "unknown", []),
        broll: stage("broll", "unknown", []),
        render: stage("render", "unknown", []),
        delivered: stage("delivered", "unknown", [])
      }),
      renders: [],
      staleRender: false,
      lastTouched: NOW - 3 * DAY + HOUR,
      hasNotes: false,
      dirSizes: { renders: 0, assets: 880_000_000, total: 881_200_000 }
    },
    // 3. Graphics-only, no renders, talking-head stages n-a
    {
      slug: "ais-live-testimonials",
      name: "AIS Live Testimonials",
      family: "ais-live",
      archetype: "graphics-only",
      utility: false,
      stages: stages({
        source: stage("source", "n-a", []),
        transcript: stage("transcript", "n-a", []),
        silences: stage("silences", "n-a", []),
        mistakes: stage("mistakes", "n-a", []),
        verify: stage("verify", "n-a", []),
        motion: stage("motion", "done", [ev("index.html", "direct", 20 * HOUR), ev("cards/building.html", "direct", 22 * HOUR)]),
        broll: stage("broll", "n-a", []),
        render: stage("render", "unknown", []),
        delivered: stage("delivered", "unknown", [])
      }),
      renders: [],
      staleRender: false,
      lastTouched: NOW - 20 * HOUR,
      hasNotes: true,
      dirSizes: { renders: 0, assets: 34_400_000, total: 35_100_000 }
    },
    // 4. Stale render - source edited after newest render
    {
      slug: "caic-vsl",
      name: "CAIC VSL Edit",
      family: "caic",
      archetype: "talking-head",
      utility: false,
      stages: stages({
        source: stage("source", "done", [ev("assets/vsl-raw.mov", "direct", 8 * DAY)]),
        transcript: stage("transcript", "done", [ev("assets/vsl-raw.json", "direct", 8 * DAY)]),
        silences: stage("silences", "done", [ev("assets/vsl-raw.silence-edl.json", "direct", 7 * DAY)]),
        mistakes: stage("mistakes", "partial", [ev("assets/vsl-raw.cut-candidates.json", "direct", 7 * DAY)]),
        verify: stage("verify", "unknown", []),
        motion: stage("motion", "done", [ev("index.html", "direct", 5 * HOUR)]),
        broll: stage("broll", "unknown", []),
        render: stage("render", "done", [ev("renders/caic-vsl_2026-07-20_18-20-04.mp4", "direct", 4 * DAY)]),
        delivered: stage("delivered", "unknown", [])
      }),
      renders: [
        { file: "renders/caic-vsl_2026-07-20_18-20-04.mp4", bytes: 388_200_000, mtime: NOW - 4 * DAY, kind: "timestamped", durationMs: 903000, stale: true }
      ],
      staleRender: true,
      lastTouched: NOW - 5 * HOUR,
      hasNotes: true,
      dirSizes: { renders: 388_200_000, assets: 2_610_000_000, total: 2_999_000_000 }
    },
    // 5. Delivered project - final/ delivery mp4
    {
      slug: "ais-live-day1-sizzle",
      name: "AIS Live Day 1 Opening Sizzle",
      family: "ais-live",
      archetype: "graphics-only",
      utility: false,
      stages: stages({
        source: stage("source", "n-a", []),
        transcript: stage("transcript", "n-a", []),
        silences: stage("silences", "n-a", []),
        mistakes: stage("mistakes", "n-a", []),
        verify: stage("verify", "n-a", []),
        motion: stage("motion", "done", [ev("index.html", "direct", 9 * DAY)]),
        broll: stage("broll", "n-a", []),
        render: stage("render", "done", [ev("renders/final.mp4", "direct", 8 * DAY), ev("renders/final/day1-sizzle-final.mp4", "direct", 7 * DAY)]),
        delivered: stage("delivered", "done", [ev("renders/final/day1-sizzle-final.mp4", "direct", 7 * DAY)])
      }),
      renders: [
        { file: "renders/final/day1-sizzle-final.mp4", bytes: 96_400_000, mtime: NOW - 7 * DAY, kind: "delivery", durationMs: 32000, stale: false },
        { file: "renders/final.mp4", bytes: 94_200_000, mtime: NOW - 8 * DAY, kind: "final", durationMs: 32000, stale: false }
      ],
      staleRender: false,
      lastTouched: NOW - 7 * DAY,
      hasNotes: true,
      dirSizes: { renders: 190_600_000, assets: 12_800_000, total: 204_100_000 }
    },
    // 6. Utility project (slug starts with _)
    {
      slug: "_broll-test",
      name: "Broll Test",
      family: "misc",
      archetype: "graphics-only",
      utility: true,
      stages: stages({
        motion: stage("motion", "done", [ev("index.html", "direct", 12 * DAY)]),
        source: stage("source", "n-a", []),
        transcript: stage("transcript", "n-a", []),
        silences: stage("silences", "n-a", []),
        mistakes: stage("mistakes", "n-a", []),
        verify: stage("verify", "n-a", []),
        broll: stage("broll", "n-a", []),
        render: stage("render", "unknown", []),
        delivered: stage("delivered", "unknown", [])
      }),
      renders: [],
      staleRender: false,
      lastTouched: NOW - 12 * DAY,
      hasNotes: false,
      dirSizes: { renders: 0, assets: 147_000_000, total: 147_400_000 }
    },
    // 7. Empty / unknown archetype project - nothing detected
    {
      slug: "ais-plus-membership",
      name: "AIS+ Membership",
      family: "ais-plus",
      archetype: "unknown",
      utility: false,
      stages: stages({}),
      renders: [],
      staleRender: false,
      lastTouched: NOW - 15 * DAY,
      hasNotes: false,
      dirSizes: { renders: 0, assets: 0, total: 4200 }
    },
    // 8. Extra talking-head partial to fill grid, no renders, mid-pipeline
    {
      slug: "ais-live-day2-reenergize",
      name: "AIS Live Day 2 Re-Energize",
      family: "ais-live",
      archetype: "talking-head",
      utility: false,
      stages: stages({
        source: stage("source", "done", [ev("assets/day2-raw.mp4", "direct", 2 * DAY)]),
        transcript: stage("transcript", "done", [ev("assets/day2-raw.json", "direct", 2 * DAY)]),
        silences: stage("silences", "done", [ev("assets/day2-raw.silence-edl.json", "direct", 30 * HOUR)]),
        mistakes: stage("mistakes", "partial", [ev("assets/day2-raw.cut-candidates.json", "direct", 28 * HOUR)]),
        verify: stage("verify", "unknown", []),
        motion: stage("motion", "partial", [ev("assets/day2-raw.beat-candidates.json", "direct", 10 * HOUR)]),
        broll: stage("broll", "unknown", []),
        render: stage("render", "unknown", []),
        delivered: stage("delivered", "unknown", [])
      }),
      renders: [],
      staleRender: false,
      lastTouched: NOW - 10 * HOUR,
      hasNotes: true,
      dirSizes: { renders: 0, assets: 1_120_000_000, total: 1_121_000_000 }
    }
  ];

  function fxSummary() {
    var real = FX_PROJECTS.filter(function (p) { return !p.utility; });
    return {
      projectCount: real.length,
      utilityCount: FX_PROJECTS.length - real.length,
      withRenders: FX_PROJECTS.filter(function (p) { return p.renders.length > 0; }).length,
      staleRenderCount: FX_PROJECTS.filter(function (p) { return p.staleRender; }).length,
      renderBytes: FX_PROJECTS.reduce(function (a, p) { return a + p.dirSizes.renders; }, 0),
      scannedAt: NOW,
      scanMs: 640
    };
  }

  var FIXTURE_STATE = { summary: fxSummary(), projects: FX_PROJECTS.slice() };

  var FIXTURE_NOTES = {
    "caic-p33-workflow": "# CAIC P3.3 Workflow\n\n**Status:** Delivered to Drive 7/23.\n\nFull pipeline: clean cuts (3 verify rounds), Kallaway motion edits, square PIP crop on FULL beats.\n\n## Cuts\n\n- 61 cuts total, 21:15 down to 14:35\n- stretched-token verify gotcha handled\n\n## Renders\n\n| file | quality | notes |\n| --- | --- | --- |\n| final.mp4 | standard | delivered |\n| draft.mp4 | draft | stale |\n",
    "ais-live-testimonials": "# AIS Live Testimonials\n\nCommunity testimonial reels (#4 Building / #5 Earning).\n\n**Template:** slideshow placeholder, rounded 16:9 clip slots.\n\n## Swap-in\n\nMiguel Zamarripa swapped for Lutfiya in the building reel. Reel now ~63.92s.\n",
    "caic-vsl": "# CAIC VSL Edit\n\n**v3 Studio render DELIVERED 7/23 8:20pm.**\n\nNOTE: source was re-touched after the render landed, so the render now reads stale. Re-render before final delivery.\n\n## Gotchas\n\n- stale-render trap (render mtime vs asset mtime)\n- keep-range-sliver: union leaves 2-4 frame flashes, MIN_KEEP 0.3 bridge fix\n",
    "ais-live-day1-sizzle": "# AIS Live Day 1 Opening Sizzle\n\nDraft scaffold promoted to final. Delivered to Drive Block 1 Assets.\n\n**Duration:** 32s. Doors 8:30 card at tail.\n",
    "ais-live-day2-reenergize": "# AIS Live Day 2 Re-Energize\n\nDraft scaffold. Beat candidates staged, motion pass pending review.\n"
  };

  var FIXTURE_LIBRARIES = {
    styles: [
      { id: "vox-explainer", number: 1, name: "Vox Explainer", status: "draft", cardCount: 24, palette: { bg: "#efe9dc", fg: "#17130e", accent: "#37BDF8", red: "#e23b2e", orange: "#f26a1b" }, fonts: { display: "Georgia", body: "Inter", mono: "SF Mono" } },
      { id: "kallaway", number: 2, name: "Kallaway", status: "published", cardCount: 38, palette: { bg: "#0b0b0d", fg: "#f4f4f2", accent: "#37BDF8", red: "#ff4d4d", orange: "#ff8a1f" }, fonts: { display: "Helvetica Neue", body: "Helvetica Neue", mono: null } },
      { id: "ais-live", number: 3, name: "AIS LIVE", status: "published", cardCount: 31, palette: { bg: "#05070c", fg: "#eaf4ff", accent: "#37BDF8", red: "#f0564a", orange: "#f5b942" }, fonts: { display: "Inter", body: "Inter", mono: "SF Mono" } },
      { id: "keynote", number: 4, name: "Keynote", status: "draft", cardCount: 18, palette: { bg: "#0a0a0a", fg: "#ffffff", accent: "#37BDF8", red: null, orange: null }, fonts: { display: "Helvetica Neue", body: "Helvetica Neue", mono: null } },
      { id: "harris", number: 5, name: "Harris", status: "draft", cardCount: 21, palette: { bg: "#12100e", fg: "#f6efe6", accent: "#37BDF8", red: "#d94b3a", orange: "#e88a2a" }, fonts: { display: "Georgia", body: "Inter", mono: null } },
      { id: "fireship", number: 6, name: "Fireship", status: "draft", cardCount: 16, palette: { bg: "#0d1117", fg: "#e6edf3", accent: "#37BDF8", red: "#f85149", orange: "#f0883e" }, fonts: { display: "Inter", body: "Inter", mono: "JetBrains Mono" } },
      { id: "bloomberg", number: 7, name: "Bloomberg", status: "draft", cardCount: 19, palette: { bg: "#000000", fg: "#f2f2f2", accent: "#37BDF8", red: "#ff433d", orange: null }, fonts: { display: "Helvetica Neue", body: "Helvetica Neue", mono: "SF Mono" } },
      { id: "abram", number: 8, name: "Abram", status: "draft", cardCount: 15, palette: { bg: "#111111", fg: "#ededed", accent: "#37BDF8", red: null, orange: "#f5b942" }, fonts: { display: "Inter", body: null, mono: null } },
      { id: "higgsfield", number: 9, name: "Higgsfield", status: "draft", cardCount: 20, palette: { bg: "#0f1109", fg: "#f2f4e8", accent: "#D6FD03", red: null, orange: null }, fonts: { display: "Inter", body: "Inter", mono: null } }
    ],
    styleCount: 9,
    cardCount: 202,
    registryMtime: NOW - 2 * DAY,
    registryStale: true,
    assets: {
      assetCount: 148,
      byType: { logo: 62, video: 41, photo: 33, screenshot: 12 },
      registryMtime: NOW - 5 * DAY
    }
  };

  var FIXTURE_ACTIVITY = {
    branch: "add-testimonial-reels",
    dirtyCount: 34,
    commits: [
      { hash: "5fb92ce", subject: "Add AIS LIVE community testimonial reels (#4 Building / #5 Earning)", date: NOW - 6 * HOUR },
      { hash: "e6097cf", subject: "Add Doors-Open Loop (#1) + AIS LIVE style library", date: NOW - 2 * DAY },
      { hash: "3070caf", subject: "Add Day 1 Opening Sizzle (#2) draft scaffold", date: NOW - 3 * DAY },
      { hash: "fd9a7e9", subject: "Add Day 2 Re-Energize (#3) draft scaffold", date: NOW - 3 * DAY - 3 * HOUR },
      { hash: "f6441ec", subject: "Add AIS+ Membership video (#6) draft scaffold", date: NOW - 4 * DAY },
      { hash: "a12bd90", subject: "Wire cut-mistakes review gate into master workflow", date: NOW - 5 * DAY },
      { hash: "b83ee01", subject: "Verify-cuts passing agent: three mandatory passes", date: NOW - 6 * DAY }
    ],
    recentFiles: [
      { path: "ais-live-testimonials/cards/building.html", mtime: NOW - 5 * HOUR },
      { path: "ais-live-testimonials/index.html", mtime: NOW - 6 * HOUR },
      { path: "caic-vsl/index.html", mtime: NOW - 5 * HOUR },
      { path: "ais-live-day2-reenergize/assets/day2-raw.beat-candidates.json", mtime: NOW - 10 * HOUR },
      { path: "ais-live-day1-sizzle/NOTES.md", mtime: NOW - 20 * HOUR },
      { path: "caic-p33-workflow/renders/final.mp4", mtime: NOW - 26 * HOUR },
      { path: "ais-plus-membership/index.html", mtime: NOW - 15 * DAY }
    ]
  };

  // =====================================================================
  // Fetch layer
  // =====================================================================
  function api(path) {
    if (FIXTURE) return Promise.resolve(fixtureFor(path));
    return fetch(path, { headers: { accept: "application/json" } }).then(function (r) {
      if (!r.ok) {
        return r.json().catch(function () { return { error: "HTTP " + r.status }; })
          .then(function (b) { throw new Error(b.error || "HTTP " + r.status); });
      }
      return r.json();
    });
  }

  function fixtureFor(path) {
    if (path === "/api/state") return clone(FIXTURE_STATE);
    if (path === "/api/libraries") return clone(FIXTURE_LIBRARIES);
    if (path === "/api/activity") return clone(FIXTURE_ACTIVITY);
    if (path.indexOf("/api/project/") === 0) {
      var slug = decodeURIComponent(path.slice("/api/project/".length));
      var p = FX_PROJECTS.filter(function (x) { return x.slug === slug; })[0];
      if (!p) { var e = new Error("Unknown project: " + slug); throw e; }
      var d = clone(p);
      d.absPath = "/Users/aidanstanik/Projects/Video Automation/video-projects/" + slug;
      d.notes = FIXTURE_NOTES[slug] || null;
      d.hasNotes = !!d.notes;
      d.extraFiles = ["_gen.mjs", "NOTES.md"].filter(function () { return true; });
      return d;
    }
    return {};
  }

  function postRescan() {
    if (FIXTURE) return Promise.resolve({ ok: true, scannedAt: Date.now(), ms: 620 });
    return fetch("/api/rescan", { method: "POST" }).then(function (r) { return r.json(); });
  }
  function postReveal(absPath) {
    if (FIXTURE) return Promise.resolve({ ok: true });
    return fetch("/api/reveal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: absPath })
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (b) { throw new Error(b.error || "reveal failed"); });
      return r.json();
    });
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // =====================================================================
  // Formatters
  // =====================================================================
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtBytes(n) {
    if (n == null || n === 0) return "0 B";
    var u = ["B", "KB", "MB", "GB", "TB"], i = Math.floor(Math.log(n) / Math.log(1024));
    i = Math.min(i, u.length - 1);
    var v = n / Math.pow(1024, i);
    return (v >= 100 || i === 0 ? Math.round(v) : v.toFixed(1)) + " " + u[i];
  }
  function fmtDuration(ms) {
    if (ms == null) return null;
    var s = Math.round(ms / 1000), m = Math.floor(s / 60);
    s = s % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function relTime(ms) {
    if (ms == null) return "unknown";
    var diff = Date.now() - ms;
    if (FIXTURE) diff = NOW - ms; // stable in fixture mode
    if (diff < 0) diff = 0;
    var s = Math.floor(diff / 1000);
    if (s < 45) return "just now";
    var m = Math.floor(s / 60);
    if (m < 60) return m + (m === 1 ? " min ago" : " mins ago");
    var h = Math.floor(m / 60);
    if (h < 24) return h + (h === 1 ? " hr ago" : " hrs ago");
    var d = Math.floor(h / 24);
    if (d < 30) return d + (d === 1 ? " day ago" : " days ago");
    var mo = Math.floor(d / 30);
    if (mo < 12) return mo + (mo === 1 ? " mo ago" : " mos ago");
    return Math.floor(mo / 12) + " yr ago";
  }
  function fmtDate(ms) {
    if (ms == null) return "unknown";
    var d = new Date(ms);
    var mm = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    var hh = d.getHours(), ap = hh >= 12 ? "pm" : "am";
    hh = hh % 12 || 12;
    var min = d.getMinutes();
    return mm + " " + d.getDate() + ", " + hh + ":" + (min < 10 ? "0" : "") + min + ap;
  }
  function pretty(slug) {
    return slug.replace(/^_/, "").split("-").map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
  }
  function famLabel(f) {
    return { "ais-live": "AIS Live", "caic": "CAIC", "ais-plus": "AIS+", "misc": "Misc" }[f] || f;
  }

  // reached stage index: highest stage index that is done/proxy/partial
  var STAGE_INDEX = {};
  STAGES.forEach(function (s, i) { STAGE_INDEX[s.id] = i; });
  function reachedIndex(p) {
    var r = -1;
    p.stages.forEach(function (st, i) {
      if (st.status === "done" || st.status === "partial") r = i;
    });
    return r;
  }
  function isProxyStage(st) {
    return st.status === "done" && st.evidence.length > 0 &&
      st.evidence.every(function (e) { return e.kind === "proxy"; });
  }
  function segClass(st) {
    if (st.status === "n-a") return "na";
    if (st.status === "partial") return "partial";
    if (st.status === "unknown") return "unknown";
    if (st.status === "done") return isProxyStage(st) ? "proxy" : "done";
    return "unknown";
  }

  // =====================================================================
  // DOM helpers
  // =====================================================================
  var view = document.getElementById("view");
  var summaryStrip = document.getElementById("summary-strip");
  var toastEl = document.getElementById("toast");
  var refreshBtn = document.getElementById("refresh-btn");

  function h(html) { view.innerHTML = html; }
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
      setTimeout(function () { toastEl.hidden = true; }, 220);
    }, 2400);
  }

  function railHTML(p, small) {
    var segs = p.stages.map(function (st, i) {
      var cls = segClass(st);
      var meta = STAGES[i];
      var title = meta.label + ": " + st.status + (isProxyStage(st) ? " (proxy)" : "");
      return '<div class="seg ' + cls + '" title="' + esc(title) + '">' +
        '<div class="seg-fill"></div>' +
        (small ? "" : '<span class="seg-code">' + meta.code + "</span>") +
        "</div>";
    }).join("");
    return '<div class="rail">' + segs + "</div>";
  }

  // =====================================================================
  // Mission Control
  // =====================================================================
  var msState = null;
  var filters = {
    q: "", family: "", archetype: "", minStage: "", staleOnly: false, hideUtility: true, sort: "touched"
  };

  function renderSummary(sum) {
    summaryStrip.hidden = false;
    summaryStrip.innerHTML = [
      cell(sum.projectCount, "Projects", sum.utilityCount + " utility hidden", ""),
      cell(sum.withRenders, "With renders", "of " + sum.projectCount + " active", "accent"),
      cell(sum.staleRenderCount, "Stale renders", sum.staleRenderCount ? "need re-render" : "all fresh", sum.staleRenderCount ? "warn" : ""),
      cell(fmtBytes(sum.renderBytes), "Render disk", "across all projects", "")
    ].join("");
  }
  function cell(val, lbl, sub, mod) {
    return '<div class="summary-cell ' + mod + '">' +
      '<div class="val tnum">' + esc(val) + "</div>" +
      '<div class="lbl">' + esc(lbl) + "</div>" +
      '<div class="sub">' + esc(sub) + "</div></div>";
  }

  function renderMission() {
    setActiveNav("mission");
    if (!msState) {
      h('<div class="skeleton-grid">' + Array(6).join("<div class='skel'></div>") + "</div>");
      api("/api/state").then(function (s) {
        msState = s;
        renderSummary(s.summary);
        renderMission();
      }).catch(showError);
      return;
    }
    renderSummary(msState.summary);

    var families = { "ais-live": 1, "caic": 1, "ais-plus": 1, "misc": 1 };
    var famOpts = Object.keys(families).map(function (f) {
      return '<option value="' + f + '"' + (filters.family === f ? " selected" : "") + ">" + famLabel(f) + "</option>";
    }).join("");
    var archOpts = ["talking-head", "graphics-only", "unknown"].map(function (a) {
      return '<option value="' + a + '"' + (filters.archetype === a ? " selected" : "") + ">" + a + "</option>";
    }).join("");
    var stageOpts = STAGES.map(function (s, i) {
      return '<option value="' + i + '"' + (filters.minStage === String(i) ? " selected" : "") + ">reached " + s.label + "</option>";
    }).join("");
    var sortOpts = [["touched", "Last touched"], ["name", "Name"], ["progress", "Stage progress"]].map(function (o) {
      return '<option value="' + o[0] + '"' + (filters.sort === o[0] ? " selected" : "") + ">" + o[1] + "</option>";
    }).join("");

    var filtered = applyFilters(msState.projects);

    var cardsHTML = filtered.length ? filtered.map(cardHTML).join("") :
      '<div class="empty" style="grid-column:1/-1"><h3>No projects match</h3><div>Adjust the filters or search above.</div></div>';

    h(
      '<div class="view-head">' +
        '<div><div class="view-title">Mission Control<span class="count tnum">' + filtered.length + " / " + msState.projects.length + "</span></div>" +
        '<div class="view-sub">Filesystem is the source of truth. Snapshot scanned ' + esc(relTime(msState.summary.scannedAt)) + " in " + esc(msState.summary.scanMs) + " ms.</div></div>" +
      "</div>" +

      '<div class="filters">' +
        '<label class="search"><span class="icon">&#8981;</span>' +
          '<input id="f-q" type="search" placeholder="Search name or slug" value="' + esc(filters.q) + '" aria-label="Search projects" /></label>' +
        '<select class="select" id="f-family" aria-label="Family"><option value="">All families</option>' + famOpts + "</select>" +
        '<select class="select" id="f-arch" aria-label="Archetype"><option value="">All types</option>' + archOpts + "</select>" +
        '<select class="select" id="f-stage" aria-label="Minimum stage"><option value="">Any stage</option>' + stageOpts + "</select>" +
        '<select class="select" id="f-sort" aria-label="Sort">' + sortOpts + "</select>" +
        '<label class="toggle ' + (filters.staleOnly ? "on" : "") + '"><input type="checkbox" id="f-stale"' + (filters.staleOnly ? " checked" : "") + " /><span class=\"box\"></span>Stale only</label>" +
        '<label class="toggle ' + (filters.hideUtility ? "on" : "") + '"><input type="checkbox" id="f-util"' + (filters.hideUtility ? " checked" : "") + " /><span class=\"box\"></span>Hide utility</label>" +
      "</div>" +

      railLegendHTML() +
      '<div class="grid">' + cardsHTML + "</div>"
    );

    wireFilters();
  }

  function railLegendHTML() {
    return '<div class="rail-legend">' +
      '<span class="li"><span class="chip done"></span>Direct done</span>' +
      '<span class="li"><span class="chip proxy"></span>Proxy done</span>' +
      '<span class="li"><span class="chip partial"></span>Partial</span>' +
      '<span class="li"><span class="chip unknown"></span>Unknown</span>' +
      '<span class="li"><span class="chip na"></span>Not applicable</span>' +
      '<span class="li" style="margin-left:auto;color:var(--text-faint)">Rail order: ' +
        STAGES.map(function (s) { return s.label; }).join(" &#8250; ") + "</span>" +
      "</div>";
  }

  function applyFilters(projects) {
    var out = projects.filter(function (p) {
      if (filters.hideUtility && p.utility) return false;
      if (filters.family && p.family !== filters.family) return false;
      if (filters.archetype && p.archetype !== filters.archetype) return false;
      if (filters.staleOnly && !p.staleRender) return false;
      if (filters.minStage !== "" && reachedIndex(p) < Number(filters.minStage)) return false;
      if (filters.q) {
        var q = filters.q.toLowerCase();
        if ((p.slug + " " + p.name).toLowerCase().indexOf(q) === -1) return false;
      }
      return true;
    });
    out.sort(function (a, b) {
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      if (filters.sort === "progress") return reachedIndex(b) - reachedIndex(a) || b.lastTouched - a.lastTouched;
      return b.lastTouched - a.lastTouched;
    });
    return out;
  }

  function cardHTML(p) {
    var newest = p.renders.length ? p.renders[0] : null;
    var renderMeta = newest
      ? '<span class="meta-item"><span class="dot ok"></span>' + esc(relTime(newest.mtime)) + " render</span>"
      : '<span class="meta-item"><span class="dot none"></span>no renders</span>';
    var staleFlag = p.staleRender
      ? '<span class="flag-stale"><span class="dot"></span>Stale render</span>' : "";

    return '<button type="button" class="card ' + (p.staleRender ? "stale" : "") + '" data-slug="' + esc(p.slug) + '">' +
      '<div class="card-top">' +
        "<div>" +
          '<div class="card-name">' + esc(p.name) + "</div>" +
          '<div class="card-slug">' + esc(p.slug) + "</div>" +
        "</div>" +
        '<div class="card-badges">' +
          '<span class="badge fam-' + p.family + '">' + esc(famLabel(p.family)) + "</span>" +
          '<span class="badge arch arch-' + p.archetype + '">' + esc(p.archetype) + "</span>" +
          (p.utility ? '<span class="badge util">utility</span>' : "") +
        "</div>" +
      "</div>" +
      railHTML(p) +
      '<div class="card-meta">' +
        '<div class="meta-left">' + renderMeta + staleFlag + "</div>" +
        '<div class="meta-right">' + esc(relTime(p.lastTouched)) + "</div>" +
      "</div>" +
      "</button>";
  }

  function wireFilters() {
    var q = document.getElementById("f-q");
    if (q) q.oninput = function () { filters.q = this.value; debounceMission(); };
    bind("f-family", "family");
    bind("f-arch", "archetype");
    bind("f-stage", "minStage");
    bind("f-sort", "sort");
    var stale = document.getElementById("f-stale");
    if (stale) stale.onchange = function () { filters.staleOnly = this.checked; renderMission(); };
    var util = document.getElementById("f-util");
    if (util) util.onchange = function () { filters.hideUtility = this.checked; renderMission(); };

    Array.prototype.forEach.call(document.querySelectorAll(".card"), function (c) {
      c.onclick = function () { location.hash = "#/project/" + c.getAttribute("data-slug"); };
    });
  }
  function bind(id, key) {
    var el = document.getElementById(id);
    if (el) el.onchange = function () { filters[key] = this.value; renderMission(); };
  }
  var dbTimer = null;
  function debounceMission() {
    clearTimeout(dbTimer);
    dbTimer = setTimeout(function () {
      // re-render only the grid + count to preserve focus in the search box
      var filtered = applyFilters(msState.projects);
      var grid = document.querySelector(".grid");
      var count = document.querySelector(".view-title .count");
      if (count) count.textContent = filtered.length + " / " + msState.projects.length;
      if (grid) {
        grid.innerHTML = filtered.length ? filtered.map(cardHTML).join("") :
          '<div class="empty" style="grid-column:1/-1"><h3>No projects match</h3><div>Adjust the filters or search above.</div></div>';
        Array.prototype.forEach.call(document.querySelectorAll(".card"), function (c) {
          c.onclick = function () { location.hash = "#/project/" + c.getAttribute("data-slug"); };
        });
      }
    }, 130);
  }

  // =====================================================================
  // Project Detail
  // =====================================================================
  function renderDetail(slug) {
    setActiveNav("mission");
    summaryStrip.hidden = true;
    h('<div class="loading">Loading project&#8230;</div>');
    api("/api/project/" + encodeURIComponent(slug)).then(function (p) {
      drawDetail(p);
    }).catch(function (e) {
      h('<a class="back-link" href="#/">&#8592; Mission Control</a>' +
        '<div class="error-box">Project not found: <code>' + esc(slug) + "</code><br>" + esc(e.message || "") + "</div>");
    });
  }

  function drawDetail(p) {
    var stageRows = p.stages.map(function (st, i) {
      var meta = STAGES[i];
      var proxy = isProxyStage(st);
      var pillCls = st.status === "done" ? "status-done"
        : st.status === "partial" ? "status-partial"
        : st.status === "n-a" ? "status-na" : "status-unknown";
      var pillLabel = st.status === "n-a" ? "n/a" : st.status;
      if (proxy) pillLabel = "done - proxy";
      var evHTML = st.evidence.length
        ? '<div class="evidence">' + st.evidence.map(function (e) {
            return '<div class="ev">' +
              '<span class="kind ' + e.kind + '">' + e.kind + "</span>" +
              '<span class="file">' + esc(e.file) + "</span>" +
              '<span class="mt tnum">' + esc(fmtDate(e.mtime)) + "</span>" +
              "</div>";
          }).join("") + "</div>"
        : '<div class="ev-none">' + (st.status === "n-a" ? "not applicable for this archetype" : "no evidence on disk") + "</div>";
      return '<div class="stage-row">' +
        '<div class="stage-name"><span class="stage-idx tnum">' + (i + 1) + "</span>" + esc(meta.label) + "</div>" +
        '<div><span class="status-pill ' + pillCls + '"><span class="d"></span>' + esc(pillLabel) + "</span></div>" +
        evHTML +
        "</div>";
    }).join("");

    var rendersPanel = p.renders.length
      ? '<table class="tbl"><thead><tr><th>File</th><th>Kind</th><th>Size</th><th>Duration</th><th>Modified</th><th>State</th></tr></thead><tbody>' +
        p.renders.map(function (r) {
          var dur = fmtDuration(r.durationMs);
          return "<tr>" +
            '<td class="fname">' + esc(r.file) + "</td>" +
            '<td><span class="rk ' + r.kind + '">' + esc(r.kind) + "</span></td>" +
            '<td class="tnum">' + fmtBytes(r.bytes) + "</td>" +
            '<td class="tnum">' + (dur ? esc(dur) : '<span style="color:var(--text-faint)">n/a</span>') + "</td>" +
            '<td class="tnum">' + esc(fmtDate(r.mtime)) + "</td>" +
            "<td>" + (r.stale
              ? '<span class="stale-tag"><span class="d"></span>Stale</span>'
              : '<span class="fresh-tag">Fresh</span>') + "</td>" +
            "</tr>";
        }).join("") + "</tbody></table>"
      : '<div class="empty" style="margin:16px;padding:36px"><h3>No renders yet</h3><div>Nothing in this project’s renders/ folder.</div></div>';

    var notesPanel = p.notes
      ? '<div class="panel"><div class="panel-head"><h2>NOTES.md</h2></div>' +
        '<div class="notes-body">' + mdLite(p.notes) + "</div></div>"
      : "";

    var extra = (p.extraFiles && p.extraFiles.length)
      ? '<div class="panel"><div class="panel-head"><h2>Root files</h2><span class="hint">generators + notes</span></div>' +
        '<div class="panel-body">' + p.extraFiles.map(function (f) {
          return '<div class="ev" style="padding:10px 18px"><span class="file">' + esc(f) + "</span></div>";
        }).join("") + "</div></div>"
      : "";

    h(
      '<a class="back-link" href="#/">&#8592; Mission Control</a>' +
      '<div class="detail-head">' +
        '<div class="detail-title-row">' +
          "<div><div class=\"detail-title\">" + esc(p.name) + "</div>" +
          '<div class="detail-slug">' + esc(p.slug) + "</div></div>" +
          '<div class="card-badges">' +
            '<span class="badge fam-' + p.family + '">' + esc(famLabel(p.family)) + "</span>" +
            '<span class="badge arch arch-' + p.archetype + '">' + esc(p.archetype) + "</span>" +
            (p.staleRender ? '<span class="badge" style="color:var(--red);border-color:rgba(240,86,74,.4)">stale render</span>' : "") +
          "</div>" +
        "</div>" +
        '<div class="detail-path"><span class="p">' + esc(p.absPath || "") + "</span>" +
          '<button type="button" class="btn btn-sm" id="copy-path">Copy path</button>' +
          '<button type="button" class="btn btn-sm" id="reveal">Reveal in Finder</button>' +
        "</div>" +
      "</div>" +

      '<div class="panel"><div class="size-grid">' +
        '<div class="size-cell"><div class="lbl">Renders</div><div class="val tnum">' + fmtBytes(p.dirSizes.renders) + "</div></div>" +
        '<div class="size-cell"><div class="lbl">Assets</div><div class="val tnum">' + fmtBytes(p.dirSizes.assets) + "</div></div>" +
        '<div class="size-cell"><div class="lbl">Total on disk</div><div class="val tnum">' + fmtBytes(p.dirSizes.total) + "</div></div>" +
      "</div></div>" +

      '<div class="panel"><div class="panel-head"><h2>Pipeline</h2><span class="hint">9 stages, filesystem-detected</span></div>' +
        railHTML(p) .replace('<div class="rail">', '<div class="rail" style="margin:16px 18px 4px">') +
        '<div class="panel-body">' + stageRows + "</div></div>" +

      '<div class="panel"><div class="panel-head"><h2>Renders</h2><span class="hint">' + p.renders.length + " file" + (p.renders.length === 1 ? "" : "s") + "</span></div>" +
        rendersPanel + "</div>" +

      notesPanel +
      extra
    );

    var copyBtn = document.getElementById("copy-path");
    if (copyBtn) copyBtn.onclick = function () {
      var t = p.absPath || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { toast("Path copied to clipboard"); },
          function () { fallbackCopy(t); });
      } else fallbackCopy(t);
    };
    var revealBtn = document.getElementById("reveal");
    if (revealBtn) revealBtn.onclick = function () {
      revealBtn.disabled = true;
      postReveal(p.absPath).then(function () { toast("Revealed in Finder"); })
        .catch(function (e) { toast("Reveal failed: " + (e.message || "")); })
        .then(function () { revealBtn.disabled = false; });
    };
  }
  function fallbackCopy(t) {
    var ta = document.createElement("textarea");
    ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Path copied to clipboard"); }
    catch (e) { toast("Copy not supported"); }
    document.body.removeChild(ta);
  }

  // markdown-lite: headings, bold, tables monospaced, bullets, everything else preformatted
  function mdLite(src) {
    var lines = src.replace(/\r\n/g, "\n").split("\n");
    var out = [], i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (/^\|.*\|\s*$/.test(line)) {
        var tbl = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { tbl.push(lines[i]); i++; }
        out.push('<div class="md-table">' + esc(tbl.join("\n")) + "</div>");
        continue;
      }
      var m;
      if ((m = /^###\s+(.*)$/.exec(line))) out.push('<div class="md-h3">' + inline(m[1]) + "</div>");
      else if ((m = /^##\s+(.*)$/.exec(line))) out.push('<div class="md-h2">' + inline(m[1]) + "</div>");
      else if ((m = /^#\s+(.*)$/.exec(line))) out.push('<div class="md-h1">' + inline(m[1]) + "</div>");
      else if ((m = /^\s*[-*]\s+(.*)$/.exec(line))) out.push('<div class="md-li">' + inline(m[1]) + "</div>");
      else if (line.trim() === "") { /* skip blank */ }
      else out.push('<div class="md-p">' + inline(line) + "</div>");
      i++;
    }
    return out.join("");
  }
  function inline(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  // =====================================================================
  // Libraries
  // =====================================================================
  function renderLibraries() {
    setActiveNav("libraries");
    summaryStrip.hidden = true;
    h('<div class="loading">Loading libraries&#8230;</div>');
    api("/api/libraries").then(function (lib) {
      var banner = lib.registryStale
        ? '<div class="lib-banner"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:var(--red)"></span>' +
          "Style registry.json is older than a style.json. Run the registry generator to refresh.</div>"
        : "";

      var rows = lib.styles.map(function (s) {
        return '<div class="style-row">' +
          '<div class="style-num tnum">' + esc(pad2(s.number)) + "</div>" +
          "<div><div class=\"style-name\">" + esc(s.name) + '</div><div class="style-id">' + esc(s.id) + "</div></div>" +
          '<div><span class="style-status ' + esc(s.status) + '">' + esc(s.status || "unknown") + "</span></div>" +
          '<div class="tnum">' + esc(s.cardCount) + " cards</div>" +
          '<div class="swatches">' + swatches(s.palette) + "</div>" +
          '<div class="fonts">' + fontsHTML(s.fonts) + "</div>" +
          "</div>";
      }).join("");

      var byType = lib.assets && lib.assets.byType ? lib.assets.byType : {};
      var assetCards = Object.keys(byType).sort(function (a, b) { return byType[b] - byType[a]; }).map(function (t) {
        return '<div class="asset-card"><div class="n tnum">' + esc(byType[t]) + '</div><div class="t">' + esc(t) + "</div></div>";
      }).join("");

      h(
        '<div class="view-head"><div><div class="view-title">Libraries</div>' +
        '<div class="view-sub">Style card pool and shared asset registry.</div></div></div>' +
        banner +
        '<div class="panel"><div class="panel-head"><h2>Style library</h2>' +
          '<span class="hint tnum">' + esc(lib.styleCount) + " styles &#183; " + esc(lib.cardCount) + " cards</span></div>" +
          '<div class="style-row head"><span>#</span><span>Name</span><span>Status</span><span>Cards</span><span>Palette</span><span>Fonts</span></div>' +
          rows +
        "</div>" +
        '<div class="view-head" style="margin-top:26px"><div><div class="view-title" style="font-size:16px">Asset library</div>' +
        '<div class="view-sub tnum">' + esc(lib.assets ? lib.assets.assetCount : 0) + " assets cached" + "</div></div></div>" +
        '<div class="asset-cards">' + (assetCards || '<div class="empty">No assets registered.</div>') + "</div>"
      );
    }).catch(showError);
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function swatches(pal) {
    if (!pal) pal = {};
    return ["bg", "fg", "accent", "red", "orange"].map(function (k) {
      var c = pal[k];
      if (!c) return '<span class="sw empty" title="' + k + ': none"></span>';
      return '<span class="sw" style="background:' + esc(c) + '" title="' + k + ": " + esc(c) + '"></span>';
    }).join("");
  }
  function fontsHTML(f) {
    if (!f) f = {};
    return ["display", "body", "mono"].map(function (k) {
      return '<div><span class="f-lbl">' + k + "</span> " + esc(f[k] || "none") + "</div>";
    }).join("");
  }

  // =====================================================================
  // Activity
  // =====================================================================
  function renderActivity() {
    setActiveNav("activity");
    summaryStrip.hidden = true;
    h('<div class="loading">Loading activity&#8230;</div>');
    api("/api/activity").then(function (a) {
      var commits = a.commits.length ? a.commits.map(function (c) {
        return '<div class="commit"><span class="hash tnum">' + esc(c.hash) + "</span>" +
          '<span class="subj">' + esc(c.subject) + "</span>" +
          '<span class="date tnum">' + esc(relTime(c.date)) + "</span></div>";
      }).join("") : '<div class="empty">No commits found.</div>';

      var files = a.recentFiles.length ? a.recentFiles.map(function (f) {
        return '<div class="rfile"><span class="rp">' + esc(f.path) + "</span>" +
          '<span class="rm tnum">' + esc(relTime(f.mtime)) + "</span></div>";
      }).join("") : '<div class="empty">No recent files.</div>';

      h(
        '<div class="view-head"><div><div class="view-title">Activity</div>' +
        '<div class="view-sub">Git state and recently touched project files.</div></div></div>' +
        '<div class="activity-topline">' +
          '<span class="branch-pill"><span class="brand-dot" style="box-shadow:none"></span>' + esc(a.branch) + "</span>" +
          '<span class="dirty-pill ' + (a.dirtyCount ? "" : "clean") + '">' +
            (a.dirtyCount ? esc(a.dirtyCount) + " uncommitted file" + (a.dirtyCount === 1 ? "" : "s") : "working tree clean") +
          "</span>" +
        "</div>" +
        '<div class="activity-cols">' +
          '<div class="panel"><div class="panel-head"><h2>Recent commits</h2><span class="hint">last ' + a.commits.length + "</span></div>" +
            '<div class="panel-body">' + commits + "</div></div>" +
          '<div class="panel"><div class="panel-head"><h2>Recently modified</h2><span class="hint">under video-projects/</span></div>' +
            '<div class="panel-body">' + files + "</div></div>" +
        "</div>"
      );
    }).catch(showError);
  }

  // =====================================================================
  // Router
  // =====================================================================
  function showError(e) {
    summaryStrip.hidden = true;
    h('<div class="error-box"><strong>Could not reach the Editing OS server.</strong><br>' +
      esc(e && e.message ? e.message : "Unknown error") +
      '<br><br>Start it with <code>node editing-os/server.mjs</code>, or append ' +
      '<code>?fixture=1</code> to preview with sample data.</div>');
  }

  function setActiveNav(route) {
    Array.prototype.forEach.call(document.querySelectorAll(".nav-link"), function (l) {
      l.classList.toggle("active", l.getAttribute("data-route") === route);
    });
  }

  var studioMounted = false;
  function leaveStudio() {
    if (studioMounted && window.Studio) { window.Studio.unmount(); }
    studioMounted = false;
  }

  function route() {
    var hash = location.hash || "#/";
    if (hash !== "#/studio") leaveStudio();
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    if (hash.indexOf("#/project/") === 0) {
      renderDetail(decodeURIComponent(hash.slice("#/project/".length)));
    } else if (hash === "#/studio") {
      renderStudio();
    } else if (hash === "#/libraries") {
      renderLibraries();
    } else if (hash === "#/activity") {
      renderActivity();
    } else {
      renderMission();
    }
    // keep fixture flag on internal nav links
    if (FIXTURE) patchFixtureLinks();
  }

  // Studio view: mounts the pixel-art canvas scene (studio.js owns its rAF loop).
  function renderStudio() {
    setActiveNav("studio");
    summaryStrip.hidden = true;
    h('<div class="view-head"><div><div class="view-title">The Studio</div>' +
      '<div class="view-sub">Your editing agents at work. Live from ' +
      (FIXTURE ? "fixture data" : "/api/agents") + ", polled every 8 seconds.</div></div></div>" +
      '<div id="studio-mount"></div>');
    var host = document.getElementById("studio-mount");
    if (window.Studio && host) {
      window.Studio.mount(host);
      studioMounted = true;
    } else if (host) {
      host.innerHTML = '<div class="empty"><h3>Studio unavailable</h3><div>studio.js did not load.</div></div>';
    }
  }

  // ---------- Topbar Studio dot: global 30s /api/agents poll ----------
  var studioDot = document.getElementById("studio-dot");
  function pollStudioDot() {
    if (FIXTURE) {
      // fixture: show the dot so the affordance is visible in preview
      if (studioDot) { studioDot.hidden = false; studioDot.title = "2 agents working"; }
      return;
    }
    // Forward a dev ?force override so screenshots/tests can drive the dot;
    // the real backend derives working state from disk and ignores it.
    var force = new URLSearchParams(location.search).get("force");
    var url = "/api/agents" + (force ? "?force=" + encodeURIComponent(force) : "");
    fetch(url, { headers: { accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (st) {
        if (!studioDot) return;
        var working = st && Array.isArray(st.agents)
          ? st.agents.filter(function (a) { return a.status === "working"; }).length : 0;
        studioDot.hidden = working === 0;
        studioDot.title = working + (working === 1 ? " agent working" : " agents working");
      })
      .catch(function () { if (studioDot) studioDot.hidden = true; });
  }

  function patchFixtureLinks() {
    // hash links don't lose query string, but ensure flag banner is visible
    document.getElementById("fixture-flag").hidden = false;
  }

  // Refresh: POST rescan, drop cache, re-render current view
  refreshBtn.onclick = function () {
    refreshBtn.classList.add("loading");
    postRescan().then(function (r) {
      msState = null;
      document.getElementById("scan-status").textContent =
        FIXTURE ? "fixture snapshot" : "rescanned in " + (r.ms || 0) + " ms";
      route();
      toast(FIXTURE ? "Fixture data reloaded" : "Workspace rescanned");
    }).catch(function (e) {
      toast("Rescan failed: " + (e.message || ""));
    }).then(function () {
      refreshBtn.classList.remove("loading");
    });
  };

  window.addEventListener("hashchange", route);
  document.getElementById("scan-status").textContent = FIXTURE ? "fixture snapshot" : "workspace snapshot";
  if (FIXTURE) document.getElementById("fixture-flag").hidden = false;
  route();

  // Global topbar dot poll (30s), the only app-wide agents poll.
  pollStudioDot();
  setInterval(pollStudioDot, 30000);
})();
