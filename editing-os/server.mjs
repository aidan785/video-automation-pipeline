// editing-os/server.mjs
// Editing OS server. node:http only, port 4200 (PORT override), no auto-increment.
// Serves the four JSON endpoints + static public/, with a 60 s snapshot cache.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';

import { scanWorkspace, buildProjectDetail, scanLibraries, ROOT } from './lib/scan.mjs';
import { buildActivity } from './lib/git.mjs';
import { buildAgentsState } from './lib/agents.mjs';

const DEFAULT_PORT = 4200;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
const PUBLIC_DIR = path.join(import.meta.dirname, 'public');
const CACHE_TTL_MS = 60 * 1000;

// One in-memory snapshot.
let snapshot = null; // { state, scannedAt, scanMs, recentFiles }

function rescan() {
  const result = scanWorkspace();
  snapshot = result;
  return result;
}

function getSnapshot() {
  if (!snapshot || Date.now() - snapshot.scannedAt > CACHE_TTL_MS) {
    return rescan();
  }
  return snapshot;
}

// --- helpers ---

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function sendError(res, status, message) {
  sendJSON(res, status, { error: message });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function serveStatic(req, res, urlPath) {
  // Map "/" -> index.html; strip leading slash; block traversal.
  let rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  rel = decodeURIComponent(rel);
  const abs = path.join(PUBLIC_DIR, rel);
  // Confine to PUBLIC_DIR.
  if (abs !== PUBLIC_DIR && !abs.startsWith(PUBLIC_DIR + path.sep)) {
    sendError(res, 403, 'Forbidden');
    return;
  }
  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) {
      if (urlPath === '/') {
        // public/ not built yet: friendly placeholder.
        const html =
          '<!doctype html><meta charset="utf-8"><title>Editing OS</title>' +
          '<body style="background:#0A0C10;color:#37BDF8;font:16px -apple-system,Inter,sans-serif;padding:40px">' +
          '<h1>Editing OS</h1><p>API is live. The UI (public/) has not been built yet.</p>' +
          '<p>Try <code style="color:#F5B942">/api/state</code>.</p></body>';
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
        return;
      }
      sendError(res, 404, 'Not found');
      return;
    }
    const ext = path.extname(abs).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(abs).pipe(res);
  });
}

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let data = '';
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      data += c;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

// --- reveal (mandatory security check) ---
async function handleReveal(req, res) {
  let body;
  try {
    const raw = await readBody(req);
    body = raw ? JSON.parse(raw) : {};
  } catch {
    sendError(res, 400, 'Invalid JSON body');
    return;
  }
  if (!body || typeof body.path !== 'string') {
    sendError(res, 400, 'Missing path');
    return;
  }
  const p = path.resolve(body.path);
  const insideWorkspace = p !== ROOT && p.startsWith(ROOT + path.sep);
  if (!insideWorkspace) {
    sendError(res, 400, 'Path outside workspace');
    return;
  }
  if (!fs.existsSync(p)) {
    sendError(res, 404, 'Path does not exist');
    return;
  }
  execFile('open', ['-R', p], (err) => {
    if (err) sendError(res, 500, 'Failed to reveal');
    else sendJSON(res, 200, { ok: true });
  });
}

// --- router ---
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  try {
    if (req.method === 'GET' && pathname === '/api/state') {
      sendJSON(res, 200, getSnapshot().state);
      return;
    }

    if (req.method === 'GET' && pathname.startsWith('/api/project/')) {
      const slug = decodeURIComponent(pathname.slice('/api/project/'.length));
      if (!slug || slug.includes('/')) {
        sendError(res, 400, 'Bad slug');
        return;
      }
      const detail = buildProjectDetail(slug);
      if (!detail) {
        sendError(res, 404, 'Unknown project');
        return;
      }
      sendJSON(res, 200, detail);
      return;
    }

    if (req.method === 'GET' && pathname === '/api/libraries') {
      getSnapshot(); // keep snapshot warm/consistent
      sendJSON(res, 200, scanLibraries());
      return;
    }

    if (req.method === 'GET' && pathname === '/api/activity') {
      const snap = getSnapshot();
      const activity = await buildActivity(snap.recentFiles);
      sendJSON(res, 200, activity);
      return;
    }

    if (req.method === 'GET' && pathname === '/api/agents') {
      const snap = getSnapshot();
      const agentsState = buildAgentsState(snap, url.searchParams.get('force'));
      sendJSON(res, 200, agentsState);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/rescan') {
      const result = rescan();
      sendJSON(res, 200, { ok: true, scannedAt: result.scannedAt, ms: result.scanMs });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/reveal') {
      await handleReveal(req, res);
      return;
    }

    if (req.method === 'GET') {
      serveStatic(req, res, pathname);
      return;
    }

    sendError(res, 404, 'Not found');
  } catch (e) {
    sendError(res, 500, e && e.message ? e.message : 'Internal error');
  }
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `[editing-os] Port ${PORT} is already in use. This server never auto-increments. ` +
        `Free the port or set PORT=<n> and retry.`
    );
    process.exit(1);
  }
  console.error('[editing-os] server error:', err);
  process.exit(1);
});

server.listen(PORT, () => {
  // Warm the snapshot once at startup and log the scan time.
  const t0 = Date.now();
  const result = rescan();
  const warmMs = Date.now() - t0;
  console.log(
    `[editing-os] listening on http://localhost:${PORT}  ` +
      `(scanned ${result.state.projects.length} projects in ${result.scanMs}ms, warm ${warmMs}ms)`
  );
});
