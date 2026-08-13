#!/usr/bin/env node
/**
 * Hekim onayi — reviewer + reviewedAt doldurur (insan komutu).
 *
 *   npm run seo:approve -- --slugs bonding-tedavisi-nedir,dis-implant-nedir --by "Dr. Ahmet Çelik"
 *   npm run seo:approve -- --slugs a,b --by "Dr. Elif Kara" --date 2026-08-13
 *
 * reviewer alanini ajan doldurmaz; bu script bilincli insan imzasidir.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONTENT = path.join(ROOT, "src/content");

const argv = process.argv.slice(2);
const val = (f) => {
  const i = argv.indexOf(f);
  return i > -1 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null;
};

const slugsRaw = val("--slugs");
const by = val("--by");
const date = val("--date") || new Date().toISOString().slice(0, 10);

if (!slugsRaw || !by) {
  console.error(`Usage:
  npm run seo:approve -- --slugs slug1,slug2 --by "Dr. Ahmet Çelik"
  npm run seo:approve -- --slugs slug1 --by "Dr. Elif Kara" --date 2026-08-13`);
  process.exit(1);
}

const slugs = new Set(
  slugsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

if (!slugs.size) {
  console.error("En az bir slug gerekli.");
  process.exit(1);
}

function load(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function save(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

const blogPath = path.join(CONTENT, "generated-blog.json");
const geoPath = path.join(CONTENT, "geo/packs.json");
const blog = load(blogPath);
const geo = load(geoPath);

let hit = 0;
const missing = new Set(slugs);

for (const p of [...blog, ...geo]) {
  if (!slugs.has(p.slug)) continue;
  missing.delete(p.slug);
  p.reviewer = by;
  p.reviewedAt = date;
  if (!p.author) p.author = by;
  if (!p.updatedAt) p.updatedAt = date;
  hit++;
  console.log(`OK  ${p.lang}/${p.type || (p.html ? "blog" : "geo")}/${p.slug} → ${by} @ ${date}`);
}

save(blogPath, blog);
save(geoPath, geo);

if (missing.size) {
  console.error(`\nBulunamadi: ${[...missing].join(", ")}`);
  process.exit(1);
}

console.log(`\n${hit} kayit onaylandi. Sonraki: npm run seo:lint:new && PR.`);
