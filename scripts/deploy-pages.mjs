#!/usr/bin/env node
/**
 * Deploy dist/ to gh-pages for medidentistanbul.com (custom domain).
 * No subpath base — root domain.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const DOMAIN = process.env.SITE_DOMAIN || "https://medidentistanbul.com";
const CUSTOM_HOST = process.env.CUSTOM_DOMAIN || "medidentistanbul.com";
const REPO = "enesceylan190758-wq/medident-web-site";

function sh(cmd, opts = {}) {
  console.log(">", cmd);
  return execSync(cmd, { stdio: "inherit", ...opts });
}
function shOut(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", ...opts }).trim();
}

// Production build (root paths)
sh(`SITE_DOMAIN=${DOMAIN} SITE_BASE= node build.mjs`, { cwd: ROOT });

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("dist/index.html missing");
  process.exit(1);
}
fs.writeFileSync(path.join(DIST, ".nojekyll"), "");
fs.writeFileSync(path.join(DIST, "CNAME"), CUSTOM_HOST + "\n");

const home = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
if (!home.includes('href="/assets/css/site.css"') && !home.includes("href=\"/assets/css/site.css\"")) {
  // asset() may render differently — just ensure logo path exists locally
  if (!fs.existsSync(path.join(DIST, "assets/img/logo.png"))) {
    console.error("logo missing in dist — abort");
    process.exit(1);
  }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "medident-gh-pages-"));
sh(`cp -a "${DIST}/." "${tmp}/"`);
const remote = shOut("git remote get-url origin", { cwd: ROOT });
sh("git init -b gh-pages", { cwd: tmp });
sh('git -c user.email="cursor@cursor.com" -c user.name="Cursor Agent" add -A', { cwd: tmp });
sh(
  'git -c user.email="cursor@cursor.com" -c user.name="Cursor Agent" commit -m "Deploy MediDent to custom domain"',
  { cwd: tmp }
);
sh(`git remote add origin "${remote}"`, { cwd: tmp });
sh("git push -u origin gh-pages --force", { cwd: tmp });
fs.rmSync(tmp, { recursive: true, force: true });

try {
  sh(`gh api -X POST repos/${REPO}/pages -f build_type=legacy -f source[branch]=gh-pages -f source[path]=/`);
} catch {
  try {
    sh(`gh api -X PUT repos/${REPO}/pages -f build_type=legacy -f source[branch]=gh-pages -f source[path]=/`);
  } catch (e) {
    console.warn("Pages API skipped (enable once in GitHub Settings → Pages):", e.message);
  }
}

try {
  sh(`gh api -X PUT repos/${REPO}/pages -f cname=${CUSTOM_HOST}`);
} catch (e) {
  console.warn("CNAME API skipped:", e.message);
}

console.log(`
DONE — gh-pages published for https://${CUSTOM_HOST}/

SENİN 2 DAKİKAN (Turhost DNS):
1) GitHub → Settings → Pages → Source: Deploy from branch → gh-pages / (root) → Save
2) Turhost DNS zone editor:
   - A @ → 185.199.108.153
   - A @ → 185.199.109.153
   - A @ → 185.199.110.153
   - A @ → 185.199.111.153
   - CNAME www → enesceylan190758-wq.github.io
`);
