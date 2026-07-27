#!/usr/bin/env node
/** Report missing/duplicate title + meta description in dist/. Run after build. */
import fs from "node:fs";
import path from "node:path";

const DIST = path.join(process.cwd(), "dist");
const titles = new Map();
const descs = new Map();
const issues = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name === "index.html") check(p);
  }
}

function check(file) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(DIST, file);
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim() || "";
  const desc = (html.match(/name="description" content="([^"]*)"/i) || [])[1]?.trim() || "";
  if (!title) issues.push(`MISSING title: ${rel}`);
  if (!desc) issues.push(`MISSING description: ${rel}`);
  if (title) {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(rel);
  }
  if (desc) {
    if (!descs.has(desc)) descs.set(desc, []);
    descs.get(desc).push(rel);
  }
}

if (!fs.existsSync(DIST)) {
  console.error("dist/ missing — run npm run build first");
  process.exit(1);
}
walk(DIST);
for (const [t, files] of titles) {
  if (files.length > 1) issues.push(`DUPLICATE title (${files.length}x): ${t}\n  - ${files.slice(0, 8).join("\n  - ")}`);
}
for (const [d, files] of descs) {
  if (files.length > 3) issues.push(`DUPLICATE description (${files.length}x): ${d.slice(0, 80)}…\n  - ${files.slice(0, 6).join("\n  - ")}`);
}
console.log(`Scanned pages. Issues: ${issues.length}`);
for (const i of issues.slice(0, 40)) console.log("·", i);
if (issues.length > 40) console.log(`… +${issues.length - 40} more`);
process.exit(issues.some((x) => x.startsWith("MISSING")) ? 1 : 0);
