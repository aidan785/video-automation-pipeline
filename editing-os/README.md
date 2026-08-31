# Editing OS

A live visual operating system for the Video Automation workspace. The filesystem is
the source of truth: a single Node process scans `video-projects/`, `style-library/`,
`asset-library/`, and git state on demand, holds one in-memory snapshot, and serves a
dark mission-control UI. No database, no build step, no new npm dependencies (node
builtins only).

## Run

```bash
node editing-os/server.mjs        # http://localhost:4200
PORT=4300 node editing-os/server.mjs   # override the port
```

The server never auto-increments. If 4200 is taken it prints a message naming the port
and exits. It warms one snapshot at startup and logs the scan time (about 50 to 100 ms
for 75 projects on the M4 Pro). The snapshot is reused for 60 seconds; the Refresh
button forces a rescan (`POST /api/rescan`).

## Views

- Mission Control (`#/`) - summary strip (projects, with-renders, stale renders, render
  disk) plus a card grid. Each card has a 9-segment pipeline rail, family and archetype
  badges, newest-render age, and a stale flag. Client-side filters: search, family,
  archetype, minimum reached stage, stale-only, hide-utility (default on), and sort.
- Project Detail (`#/project/<slug>`) - absolute path with Copy and Reveal in Finder,
  per-stage rows with evidence, a renders table with per-file stale flags, and NOTES.md
  rendered as markdown-lite.
- Studio (`#/studio`) - an 8-bit pixel-art office of the five pipeline agents; see the
  Studio section below.
- Libraries (`#/libraries`) - style rows with palette swatches and fonts, plus asset
  registry counts and a registry-staleness banner.
- Activity (`#/activity`) - branch, dirty count, last 20 commits, 30 most recently
  modified project files.

## Studio

The Studio (`#/studio`) is a bright, lived-in 8-bit co-working office (warm cream walls,
wood-plank floor, sunny daylight windows, plants, bookshelf, whiteboard, kitchenette, and
a wall clock) that shows the pipeline agents as characters at five desks. Everything is
drawn on one HTML5 canvas (logical 640x360, integer-scaled, no external images or fonts).
The roster is fixed:

- Snip - Silence Editor (cut-silences), green
- Redo - Mistake Editor (cut-mistakes), amber
- Vera - Verifier (verify-cuts), purple
- Mo - Motion Designer (motion-graphics), blue
- Scout - B-roll Scout (insert-broll), orange

Status detection is server-side (`GET /api/agents`, see STUDIO_CONTRACT.md). It reuses
the same 60 s snapshot as the rest of the OS, then re-stats only the winning evidence
file per agent plus the session directory. Each agent is attributed the newest evidence
mtime of its own pipeline stage across all projects (verify excludes the clean.mp4 proxy
so a fresh editor render does not light the verifier). The age of that artifact maps to a
tier: working (15 min), winding-down (2 h), or idle. A recent Claude session touching the
workspace turns the office lights on (full bright daytime); with no recent session the
lights go to a dimmer, warm after-hours mood that stays clearly readable. Working agents sit and type at a lit desk with a
floating project tag; winding-down agents sit and occasionally stretch or sip; idle agents
stroll the whole office floor on varied routes (along and behind the desk row, to the water
cooler, couch, window, and across the middle), spread apart with light separation so they
never bunch up, with only brief pauses and the occasional short couch sit, cooler sip, or
look out the window. Each desk chair and mousepad is tinted its owner's accent color, so an
empty seat still reads as that agent's. Status changes are smooth: an agent starting work
walks to its desk and sits rather than snapping there. The canvas rAF loop stops when Studio is not the active route or the tab
is hidden, and the topbar shows a pulsing dot on the Studio nav item when any agent is
working (a single 30 s global poll).

Dev force param: append `?force=<id>:<status>[,<id>:<status>...]` to the URL to override
just the status of named agents for screenshots and tests, for example
`?force=silences:working,motion:working`. Invalid ids or statuses are ignored, and no real
project files are ever touched. A forced agent with no project shows a demo tag. The
standalone preview `?fixture=1` renders canned data with no server, and `?fixture=1&lights=off`
previews the dimmer after-hours look.

## How stage detection works

Nine stages in fixed order: source, transcript, silences, mistakes, verify, motion,
broll, render, delivered. Each resolves to a status (`done`, `partial`, `unknown`,
`n-a`) with evidence files. Evidence comes in two tiers:

- Direct - an artifact written by that stage (a `.silence-edl.json`, an `approved-cuts.json`,
  a render mp4). Highest confidence.
- Proxy - a file that implies the stage ran without being its own output. The main proxy
  is `assets/clean.mp4`: its existence marks source, silences, mistakes, and verify as
  done even when the per-stage artifacts were not kept.

Detection is stat-driven. JSON transcripts are sniffed by reading the first 16 KB and
testing for a `"words"` key (widened from 4 KB because real ElevenLabs transcripts put
`"words"` about 7 to 11 KB in). Media files are never opened or read.

## Known limitations

- Verify is proxy-only today. No direct verify artifact is written to disk yet, so a
  clean render is the strongest signal. If a `verify-report.md` or `*.verify.json` ever
  lands it becomes direct evidence automatically.
- B-roll has not completed on any project, so that stage reads unknown or n-a everywhere.
- Registry staleness is heuristic: the style registry is flagged stale when its mtime is
  older than the newest `style-library/*/style.json`. It does not re-derive card counts.
- Archetype can read `unknown` for hand-built graphics projects that have an `index.html`
  but no `_gen*.mjs` and no `cards/` dir. Motion still detects correctly; the badge is
  just conservative.
- Reveal in Finder runs `open -R` and only works on the host machine. Paths are confined
  to the workspace root (400 outside root, 404 if missing).
