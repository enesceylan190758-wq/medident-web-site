#!/usr/bin/env node
/**
 * Build preview (GitHub Pages base path) and force-push dist/ to gh-pages.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

const DOMAIN = process.env.SITE_DOMAIN || "https://enesceylan190758-wq.github.io";
const BASE = process.env.SITE_BASE || "/medident-web-site";
const REPO = "enesceylan190758-wq/medident-web-site";

function sh(cmd, opts = {}) {
  console.log(">", cmd);
  return execSync(cmd, { stdio: "inherit", ...opts });
}

function shOut(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", ...opts }).trim();
}

// 1) Preview build
sh(`SITE_DOMAIN=${DOMAIN} SITE_BASE=${BASE} node build.mjs`, { cwd: ROOT });

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("dist/index.html missing");
  process.exit(1);
}
fs.writeFileSync(path.join(DIST, ".nojekyll"), "");

// Sanity: CSS path must include base
const home = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
if (!home.includes(`${BASE}/assets/css/site.css`)) {
  console.error("Preview build missing basePath on CSS — aborting");
  process.exit(1);
}

// 2) Push orphan gh-pages from a temp git repo
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "medident-gh-pages-"));
sh(`cp -a "${DIST}/." "${tmp}/"`);

const remote = shOut("git remote get-url origin", { cwd: ROOT });
sh("git init -b gh-pages", { cwd: tmp });
sh('git -c user.email="cursor@cursor.com" -c user.name="Cursor Agent" add -A', { cwd: tmp });
sh(
  'git -c user.email="cursor@cursor.com" -c user.name="Cursor Agent" commit -m "Deploy MediDent preview site"',
  { cwd: tmp }
);
sh(`git remote add origin "${remote}"`, { cwd: tmp });
sh("git push -u origin gh-pages --force", { cwd: tmp });

fs.rmSync(tmp, { recursive: true, force: true });

// 3) Enable / update Pages
function enablePages() {
  try {
    sh(
      `gh api -X POST repos/${REPO}/pages -f build_type=legacy -f source[branch]=gh-pages -f source[path]=/`
    );
    return;
  } catch {
    /* may already exist */
  }
  try {
    sh(
      `gh api -X PUT repos/${REPO}/pages -f build_type=legacy -f source[branch]=gh-pages -f source[path]=/`
    );
  } catch (e) {
    console.warn("Pages API update skipped:", e.message);
  }
}
enablePages();

// 4) Restore production dist (Turhost zip must stay root-path)
sh("node build.mjs", { cwd: ROOT });

console.log(`\nPreview URL: ${DOMAIN}${BASE}/`);
