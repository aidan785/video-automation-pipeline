// Minimal static server WITH HTTP Range support (needed for video scrubbing).
// Serves the project dir. Default route -> the sting preview gallery.
//   node _serve.mjs [port]   (default 8080)
import { createServer } from "node:http";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.argv[2] || 8080);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".mp4": "video/mp4", ".png": "image/png",
  ".css": "text/css", ".woff2": "font/woff2", ".js": "text/javascript",
  ".json": "application/json", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/renders/preview-gallery.html";
    const fp = join(ROOT, normalize(p));
    if (!fp.startsWith(ROOT)) { res.writeHead(403).end("forbidden"); return; }
    const st = await stat(fp);
    if (st.isDirectory()) { res.writeHead(403).end("directory"); return; }
    const type = TYPES[extname(fp).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range;
    if (range && /^bytes=\d*-\d*$/.test(range)) {
      const [s, e] = range.replace("bytes=", "").split("-");
      const start = s ? parseInt(s, 10) : 0;
      const end = e ? parseInt(e, 10) : st.size - 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${st.size}`,
        "Accept-Ranges": "bytes", "Content-Length": end - start + 1, "Content-Type": type,
      });
      createReadStream(fp, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { "Content-Length": st.size, "Accept-Ranges": "bytes", "Content-Type": type });
      createReadStream(fp).pipe(res);
    }
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}  (gallery at /)`));
