// editing-os/lib/scan.mjs
// Workspace scanner. Stat-driven only: readdir + stat, plus bounded JSON sniffs,
// tiny meta.json / sidecar reads, NOTES.md (detail only), and the two registry.json.
// Never opens or reads media files.

import fs from 'node:fs';
import path from 'node:path';

import { computeStages, STAGE_IDS } from './stages.mjs';

export const ROOT = path.resolve(path.join(import.meta.dirname, '..', '..'));
const PROJECTS_DIR = path.join(ROOT, 'video-projects');
const STYLE_REGISTRY = path.join(ROOT, 'style-library', 'registry.json');
const ASSET_REGISTRY = path.join(ROOT, 'asset-library', 'registry.json');

const MEDIA_EXT = new Set(['.mp4', '.mov', '.m4a', '.mkv', '.wav']);
const RECENT_SKIP_DIRS = new Set([
  'renders',
  '.thumbnails',
  '.waveform-cache',
  '.hyperframes',
  'node_modules',
  'frames',
  'snapshots',
]);

function statSafe(p) {
  try {
    return fs.statSync(p);
  } catch {
    return null;
  }
}
function readdirSafe(p) {
  try {
    return fs.readdirSync(p, { withFileTypes: true });
  } catch {
    return [];
  }
}
function mtimeMs(st) {
  return st ? Math.round(st.mtimeMs) : 0;
}

// Render kind classification (SPEC).
const TS_RE = /^.+_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.mp4$/;
const FINAL_RE = /(-final(-v\d+)?\.mp4|^final\.mp4)$/;
function renderKind(name) {
  const lower = name.toLowerCase();
  if (name === 'draft.mp4' || lower.includes('draft')) return 'draft';
  if (TS_RE.test(name)) return 'timestamped';
  if (name === 'final.mp4' || FINAL_RE.test(name)) return 'final';
  return 'named';
}

function readSidecarDuration(dir, mp4Name) {
  const base = mp4Name.replace(/\.mp4$/i, '');
  const sidecar = path.join(dir, `${base}.meta.json`);
  const st = statSafe(sidecar);
  if (!st || !st.isFile() || st.size > 64 * 1024) return null;
  try {
    const obj = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
    if (typeof obj.durationMs === 'number') return obj.durationMs;
  } catch {
    /* ignore */
  }
  return null;
}

function prettify(slug) {
  return slug.replace(/^_/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function familyOf(slug) {
  if (slug.startsWith('ais-live')) return 'ais-live';
  if (slug.startsWith('caic')) return 'caic';
  if (slug.startsWith('ais-plus')) return 'ais-plus';
  return 'misc';
}

// Build the compact inventory used by the stage engine, plus the pieces the summary needs.
// Returns null if the project path is not a directory.
function buildInventory(slug) {
  const projDir = path.join(PROJECTS_DIR, slug);
  const projStat = statSafe(projDir);
  if (!projStat || !projStat.isDirectory()) return null;

  const assetsDir = path.join(projDir, 'assets');
  const rendersDir = path.join(projDir, 'renders');
  const cardsDir = path.join(projDir, 'cards');

  let newestMtime = mtimeMs(projStat);
  const bump = (m) => {
    if (m > newestMtime) newestMtime = m;
  };

  // --- root-level files ---
  const rootEntries = readdirSafe(projDir);
  let rootIndexHtml = null;
  const extraFiles = [];
  const rootFilesForStale = [];
  let rootFilesBytes = 0;
  let hasGenMjs = false;
  let hasNotes = false;

  for (const e of rootEntries) {
    if (e.isFile()) {
      const abs = path.join(projDir, e.name);
      const st = statSafe(abs);
      const m = mtimeMs(st);
      bump(m);
      rootFilesBytes += st ? st.size : 0;
      if (e.name === 'index.html') {
        rootIndexHtml = { rel: 'index.html', mtime: m };
        rootFilesForStale.push(m);
      }
      if (/^_gen.*\.mjs$/.test(e.name) || (e.name.endsWith('.mjs') && e.name.startsWith('_gen'))) {
        hasGenMjs = true;
        rootFilesForStale.push(m);
        extraFiles.push(e.name);
      } else if (e.name.endsWith('.mjs')) {
        extraFiles.push(e.name);
      }
      if (e.name === 'NOTES.md') {
        hasNotes = true;
        extraFiles.push('NOTES.md');
      }
    }
  }

  // --- assets/ (one level) ---
  const assetsFiles = [];
  const jsonCandidates = [];
  let assetsHasBrollDir = false;
  let assetsBytes = 0;
  const assetsMtimesForStale = [];
  const assetsEntries = readdirSafe(assetsDir);
  for (const e of assetsEntries) {
    const abs = path.join(assetsDir, e.name);
    const st = statSafe(abs);
    const m = mtimeMs(st);
    const rel = `assets/${e.name}`;
    const isDir = e.isDirectory();
    assetsFiles.push({ name: e.name, rel, abs, mtime: m, size: st ? st.size : 0, isDir });
    bump(m);
    assetsMtimesForStale.push(m);
    if (isDir) {
      if (e.name === 'broll') assetsHasBrollDir = true;
    } else {
      assetsBytes += st ? st.size : 0;
      if (e.name.toLowerCase().endsWith('.json')) {
        jsonCandidates.push({ name: e.name, rel, abs, mtime: m, size: st ? st.size : 0 });
      }
    }
  }
  // Also consider JSONs at project root and in transcripts/ per SPEC "assets JSONs".
  for (const e of rootEntries) {
    if (e.isFile() && e.name.toLowerCase().endsWith('.json')) {
      const abs = path.join(projDir, e.name);
      const st = statSafe(abs);
      jsonCandidates.push({ name: e.name, rel: e.name, abs, mtime: mtimeMs(st), size: st ? st.size : 0 });
    }
  }
  const transcriptsDir = path.join(projDir, 'transcripts');
  for (const e of readdirSafe(transcriptsDir)) {
    if (e.isFile() && e.name.toLowerCase().endsWith('.json')) {
      const abs = path.join(transcriptsDir, e.name);
      const st = statSafe(abs);
      const m = mtimeMs(st);
      bump(m);
      jsonCandidates.push({ name: e.name, rel: `transcripts/${e.name}`, abs, mtime: m, size: st ? st.size : 0 });
    }
  }

  // --- cards/*.html ---
  const cardsHtml = [];
  const cardsMtimesForStale = [];
  for (const e of readdirSafe(cardsDir)) {
    const abs = path.join(cardsDir, e.name);
    if (e.isDirectory()) {
      // one level deeper for cards/<sub>/*.html (tier folders)
      for (const s of readdirSafe(abs)) {
        if (s.isFile() && s.name.endsWith('.html')) {
          const sAbs = path.join(abs, s.name);
          const st = statSafe(sAbs);
          const m = mtimeMs(st);
          bump(m);
          cardsHtml.push({ rel: `cards/${e.name}/${s.name}`, mtime: m });
          cardsMtimesForStale.push(m);
        }
      }
    } else if (e.isFile() && e.name.endsWith('.html')) {
      const st = statSafe(abs);
      const m = mtimeMs(st);
      bump(m);
      cardsHtml.push({ rel: `cards/${e.name}`, mtime: m });
      cardsMtimesForStale.push(m);
    }
  }

  // --- renders/ (one level mp4s) + renders/final/ delivery ---
  const renders = [];
  const deliveryRenders = [];
  let rendersBytes = 0;
  const rendersEntries = readdirSafe(rendersDir);
  for (const e of rendersEntries) {
    const abs = path.join(rendersDir, e.name);
    const st = statSafe(abs);
    const m = mtimeMs(st);
    if (e.isFile()) {
      rendersBytes += st ? st.size : 0;
      bump(m);
      if (e.name.toLowerCase().endsWith('.mp4')) {
        renders.push({
          file: `renders/${e.name}`,
          bytes: st ? st.size : 0,
          mtime: m,
          kind: renderKind(e.name),
          durationMs: readSidecarDuration(rendersDir, e.name),
          stale: false, // filled after S is known
        });
      }
    } else if (e.isDirectory() && e.name === 'final') {
      for (const d of readdirSafe(abs)) {
        if (d.isFile() && d.name.toLowerCase().endsWith('.mp4')) {
          const dAbs = path.join(abs, d.name);
          const dst = statSafe(dAbs);
          const dm = mtimeMs(dst);
          bump(dm);
          rendersBytes += dst ? dst.size : 0;
          const rec = {
            file: `renders/final/${d.name}`,
            bytes: dst ? dst.size : 0,
            mtime: dm,
            kind: 'delivery',
            durationMs: readSidecarDuration(abs, d.name),
            stale: false,
          };
          renders.push(rec);
          deliveryRenders.push(rec);
        }
      }
    }
  }

  // --- archetype ---
  const cleanFile = assetsFiles.find((f) => !f.isDir && f.name === 'clean.mp4');
  const hasTranscript = false; // resolved later via stage engine; recompute cheaply below.
  const nonCleanSource = assetsFiles.find((f) => {
    if (f.isDir) return false;
    const lower = f.name.toLowerCase();
    const ext = lower.slice(lower.lastIndexOf('.'));
    if (!MEDIA_EXT.has(ext)) return false;
    if (f.name === 'clean.mp4' || f.name === 'edited-clean.mp4') return false;
    if (f.name.endsWith('.silenced.mp4')) return false;
    return true;
  });

  // transcript detection needs the sniff; do it once here so archetype can use it.
  // Reuse the same capped-sniff the stage engine uses via a lightweight recompute.
  const transcriptDetected = detectTranscript(jsonCandidates);

  let archetype;
  if (cleanFile || (transcriptDetected && nonCleanSource)) {
    archetype = 'talking-head';
  } else if (hasGenMjs || cardsHtml.length) {
    archetype = 'graphics-only';
  } else {
    archetype = 'unknown';
  }

  // --- stale rule ---
  // S = newest mtime among root index.html, _gen*.mjs, cards/*.html, and files directly
  // in assets/ (excluding renders/).
  const staleSourceMtimes = [
    ...rootFilesForStale,
    ...cardsMtimesForStale,
    ...assetsMtimesForStale,
  ];
  const S = staleSourceMtimes.length ? Math.max(...staleSourceMtimes) : 0;
  for (const r of renders) {
    r.stale = r.mtime < S;
  }
  const sortedRenders = renders.slice().sort((a, b) => b.mtime - a.mtime);
  const staleRender = sortedRenders.length > 0 ? sortedRenders[0].stale : false;

  const dirSizes = {
    renders: rendersBytes,
    assets: assetsBytes,
    total: rendersBytes + assetsBytes + rootFilesBytes,
  };

  // meta.json name
  let name = prettify(slug);
  const metaPath = path.join(projDir, 'meta.json');
  const metaStat = statSafe(metaPath);
  if (metaStat && metaStat.isFile() && metaStat.size < 64 * 1024) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      if (meta && typeof meta.name === 'string' && meta.name.trim()) name = meta.name.trim();
    } catch {
      /* ignore */
    }
  }

  return {
    slug,
    name,
    projDir,
    archetype,
    assetsFiles,
    assetsHasBrollDir,
    jsonCandidates,
    rootIndexHtml,
    cardsHtml,
    renders: sortedRenders,
    deliveryRenders,
    staleRender,
    lastTouched: newestMtime,
    hasNotes,
    dirSizes,
    extraFiles,
  };
}

// Minimal transcript detection mirroring stages.findTranscript (bounded sniff, cap 12).
import { sniffWordsKey } from './stages.mjs';
function detectTranscript(jsonCandidates) {
  const capped = jsonCandidates.slice(0, 12);
  for (const j of capped) {
    if (sniffWordsKey(j.abs, j.size)) return j;
  }
  return null;
}

function toSummary(inv) {
  const stages = computeStages({
    archetype: inv.archetype,
    assetsFiles: inv.assetsFiles,
    assetsHasBrollDir: inv.assetsHasBrollDir,
    jsonCandidates: inv.jsonCandidates,
    rootIndexHtml: inv.rootIndexHtml,
    cardsHtml: inv.cardsHtml,
    renders: inv.renders,
    deliveryRenders: inv.deliveryRenders,
  });
  return {
    slug: inv.slug,
    name: inv.name,
    family: familyOf(inv.slug),
    archetype: inv.archetype,
    utility: inv.slug.startsWith('_'),
    stages,
    renders: inv.renders.map((r) => ({
      file: r.file,
      bytes: r.bytes,
      mtime: r.mtime,
      kind: r.kind,
      durationMs: r.durationMs,
      stale: r.stale,
    })),
    staleRender: inv.staleRender,
    lastTouched: inv.lastTouched,
    hasNotes: inv.hasNotes,
    dirSizes: inv.dirSizes,
  };
}

// Full workspace scan. Returns { state: WorkspaceState, scannedAt, recentFiles }.
// recentFiles is passed to git.mjs so activity does not re-walk the tree.
export function scanWorkspace() {
  const t0 = Date.now();
  const slugs = readdirSafe(PROJECTS_DIR)
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const summaries = [];
  const recentAcc = []; // { path (rel to video-projects), mtime }

  for (const slug of slugs) {
    const inv = buildInventory(slug);
    if (!inv) continue;
    summaries.push(toSummary(inv));
    collectRecentFiles(slug, inv.projDir, recentAcc);
  }

  summaries.sort((a, b) => b.lastTouched - a.lastTouched);

  const projectCount = summaries.filter((p) => !p.utility).length;
  const utilityCount = summaries.filter((p) => p.utility).length;
  const withRenders = summaries.filter((p) => p.renders.length > 0).length;
  const staleRenderCount = summaries.filter((p) => p.staleRender).length;
  const renderBytes = summaries.reduce((n, p) => n + p.dirSizes.renders, 0);

  const scannedAt = Date.now();
  const scanMs = scannedAt - t0;

  const state = {
    summary: {
      projectCount,
      utilityCount,
      withRenders,
      staleRenderCount,
      renderBytes,
      scannedAt,
      scanMs,
    },
    projects: summaries,
  };

  recentAcc.sort((a, b) => b.mtime - a.mtime);
  const recentFiles = recentAcc.slice(0, 30);

  return { state, scannedAt, scanMs, recentFiles };
}

// Recent-files collection: shallow walk of a project, skipping the excluded dirs and
// dotfiles. Files are stat'd (already cheap) and recorded as video-projects-relative.
function collectRecentFiles(slug, projDir, acc, depth = 0) {
  if (depth > 3) return;
  for (const e of readdirSafe(projDir)) {
    if (e.name.startsWith('.')) continue;
    const abs = path.join(projDir, e.name);
    if (e.isDirectory()) {
      if (RECENT_SKIP_DIRS.has(e.name)) continue;
      collectRecentFiles(slug, abs, acc, depth + 1);
    } else if (e.isFile()) {
      const st = statSafe(abs);
      if (!st) continue;
      const rel = path.relative(PROJECTS_DIR, abs).split(path.sep).join('/');
      acc.push({ path: rel, mtime: mtimeMs(st) });
    }
  }
}

// Detail endpoint: full summary + absPath, notes (fresh read), extraFiles.
export function buildProjectDetail(slug) {
  const inv = buildInventory(slug);
  if (!inv) return null;
  const summary = toSummary(inv);
  let notes = null;
  if (inv.hasNotes) {
    const notesPath = path.join(inv.projDir, 'NOTES.md');
    const st = statSafe(notesPath);
    if (st && st.isFile() && st.size < 1024 * 1024) {
      try {
        notes = fs.readFileSync(notesPath, 'utf8');
      } catch {
        notes = null;
      }
    }
  }
  return {
    ...summary,
    absPath: inv.projDir,
    notes,
    extraFiles: inv.extraFiles,
  };
}

// --- Libraries ---

function pickString(v) {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

export function scanLibraries() {
  const styles = [];
  let styleCount = 0;
  let cardCount = 0;
  let registryMtime = 0;
  let registryStale = false;

  const styleRegStat = statSafe(STYLE_REGISTRY);
  registryMtime = mtimeMs(styleRegStat);
  if (styleRegStat && styleRegStat.isFile()) {
    try {
      const reg = JSON.parse(fs.readFileSync(STYLE_REGISTRY, 'utf8'));
      const list = Array.isArray(reg.styles) ? reg.styles : [];
      styleCount = typeof reg.styleCount === 'number' ? reg.styleCount : list.length;
      cardCount = typeof reg.cardCount === 'number'
        ? reg.cardCount
        : list.reduce((n, s) => n + (Number(s.cardCount) || 0), 0);
      for (const s of list) {
        const pal = s.palette || {};
        styles.push({
          id: pickString(s.id) || '',
          number: Number(s.number) || 0,
          name: pickString(s.name) || pickString(s.id) || '',
          status: pickString(s.status) || 'unknown',
          cardCount: Number(s.cardCount) || 0,
          palette: {
            bg: pickString(pal.bg),
            fg: pickString(pal.fg),
            accent: pickString(pal.accent),
            // Registry uses accent2/alert; map to the contract's red/orange chips.
            red: pickString(pal.red) || pickString(pal.alert),
            orange: pickString(pal.orange) || pickString(pal.accent2),
          },
          fonts: {
            display: pickString((s.fonts || {}).display),
            body: pickString((s.fonts || {}).body),
            mono: pickString((s.fonts || {}).mono),
          },
        });
      }
    } catch {
      /* leave empty on parse failure */
    }
  }

  // registryStale: registry.json older than newest style-library/*/style.json.
  const styleLibDir = path.join(ROOT, 'style-library');
  let newestStyleJson = 0;
  for (const e of readdirSafe(styleLibDir)) {
    if (e.isDirectory()) {
      const sj = path.join(styleLibDir, e.name, 'style.json');
      const st = statSafe(sj);
      if (st && st.isFile()) newestStyleJson = Math.max(newestStyleJson, mtimeMs(st));
    }
  }
  registryStale = registryMtime > 0 && newestStyleJson > registryMtime;

  // Asset library
  let assetCount = 0;
  let byType = {};
  let assetRegistryMtime = 0;
  const assetRegStat = statSafe(ASSET_REGISTRY);
  assetRegistryMtime = mtimeMs(assetRegStat);
  if (assetRegStat && assetRegStat.isFile()) {
    try {
      const areg = JSON.parse(fs.readFileSync(ASSET_REGISTRY, 'utf8'));
      assetCount = typeof areg.assetCount === 'number'
        ? areg.assetCount
        : Array.isArray(areg.assets) ? areg.assets.length : 0;
      if (areg.byType && typeof areg.byType === 'object') byType = areg.byType;
    } catch {
      /* ignore */
    }
  }

  return {
    styles,
    styleCount,
    cardCount,
    registryMtime,
    registryStale,
    assets: { assetCount, byType, registryMtime: assetRegistryMtime },
  };
}

export { STAGE_IDS };
