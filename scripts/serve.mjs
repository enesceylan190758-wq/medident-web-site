// Tiny static file server for local preview of dist/.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "dist");
const PORT = process.env.PORT || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    let fp = path.join(ROOT, p);
    try {
      if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) fp = path.join(fp, "index.html");
      if (!fs.existsSync(fp)) fp = path.join(ROOT, p, "index.html");
      if (!fs.existsSync(fp)) {
        res.writeHead(404, { "Content-Type": "text/html" });
        const nf = path.join(ROOT, "404.html");
        res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : "404");
        return;
      }
      const ext = path.extname(fp);
      res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
      res.end(fs.readFileSync(fp));
    } catch (e) {
      res.writeHead(500);
      res.end("500: " + e.message);
    }
  })
  .listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
