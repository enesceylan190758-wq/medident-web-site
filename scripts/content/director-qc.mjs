#!/usr/bin/env node
/**
 * Director QC — content gate before publish.
 * Rejects thin/template/duplicate GEO and blog drafts.
 *
 * Usage:
 *   node scripts/content/director-qc.mjs                    # check all geo packs + generated blog
 *   node scripts/content/director-qc.mjs --file path.json # check single draft array
 *   node scripts/content/director-qc.mjs --strict         # exit 1 on any failure
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BANNED_PHRASES } from "./geo-answers.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONTENT = path.join(ROOT, "src/content");
const strict = process.argv.includes("--strict");
const trOnly = process.argv.includes("--tr-only");

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

function jaccard(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

function sentences(text) {
  return String(text || "")
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

function maxSentenceOverlap(a, b) {
  const sa = sentences(a);
  const sb = sentences(b);
  let max = 0;
  for (const x of sa) {
    for (const y of sb) {
      max = Math.max(max, jaccard(x, y));
    }
  }
  return max;
}

/** @returns {{ok: boolean, issues: string[]}} */
export function reviewGeoPack(pack, corpus = []) {
  const issues = [];
  const text = [pack.direct_answer, ...(pack.bullets || []), ...(pack.faq || []).map((f) => f.a)].join(" ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount < 85) issues.push(`Kelime sayısı düşük (${wordCount} < 85)`);

  for (const banned of BANNED_PHRASES) {
    if (text.includes(banned)) issues.push(`Yasak şablon ifade: "${banned.slice(0, 50)}…"`);
  }

  const q = (pack.question || pack.title || "").replace(/\?$/, "").toLowerCase();
  const first = (pack.direct_answer || "").toLowerCase();
  if (q && first && !first.includes(q.split(" ")[0]) && wordCount < 40) {
    issues.push("İlk cümle hedef soruyu doğrudan cevaplamıyor (GEO chunk okunabilirliği)");
  }

  for (const other of corpus) {
    if (other === pack || other.slug === pack.slug) continue;
    const overlap = maxSentenceOverlap(pack.direct_answer, other.direct_answer);
    if (overlap > 0.55) {
      issues.push(`Yüksek benzerlik (%${Math.round(overlap * 100)}) → ${other.slug}`);
    }
  }

  const risky = /\b(garanti|kesin sonuç|%100|en iyi klinik)\b/i;
  if (risky.test(text) && pack.lang === "tr") {
    issues.push("Yasal risk: garanti/üstünlük iddiası (TR yurt içi içerik)");
  }

  return { ok: issues.length === 0, issues };
}

/** @returns {{ok: boolean, issues: string[]}} */
export function reviewBlogPost(post, corpus = []) {
  const issues = [];
  const html = post.html || "";
  const text = html.replace(/<[^>]+>/g, " ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount < 300) issues.push(`Blog çok kısa (${wordCount} < 300)`);

  for (const banned of BANNED_PHRASES) {
    if (text.includes(banned)) issues.push(`Yasak şablon: "${banned.slice(0, 40)}…"`);
  }

  for (const other of corpus) {
    if (other.slug === post.slug) continue;
    const overlap = jaccard(text.slice(0, 800), (other.html || "").replace(/<[^>]+>/g, " ").slice(0, 800));
    if (overlap > 0.45) issues.push(`Blog şablon benzerliği %${Math.round(overlap * 100)} → ${other.slug}`);
  }

  return { ok: issues.length === 0, issues };
}

function main() {
  const fileArg = process.argv.find((a, i) => process.argv[i - 1] === "--file");
  let failed = 0;
  let passed = 0;

  if (fileArg) {
    const items = loadJson(path.resolve(fileArg));
    for (const item of items) {
      const r = item.direct_answer ? reviewGeoPack(item, items) : reviewBlogPost(item, items);
      if (r.ok) passed++;
      else {
        failed++;
        console.log(`FAIL ${item.slug || item.title}:`, r.issues.join("; "));
      }
    }
  } else {
    const geoPath = path.join(CONTENT, "geo/packs.json");
    const blogPath = path.join(CONTENT, "generated-blog.json");
    const geo = fs.existsSync(geoPath) ? loadJson(geoPath) : [];
    const blog = fs.existsSync(blogPath) ? loadJson(blogPath) : [];

    for (const lang of ["tr", "en", "de"]) {
      if (trOnly && lang !== "tr") continue;
      const langGeo = geo.filter((g) => g.lang === lang);
      for (const pack of langGeo) {
        const r = reviewGeoPack(pack, langGeo);
        if (r.ok) {
          passed++;
        } else {
          failed++;
          console.log(`FAIL [${lang}] geo/${pack.slug}:`, r.issues.join("; "));
        }
      }
    }

    if (!trOnly) {
      const trBlog = blog.filter((b) => b.lang === "tr" && b.source === "daily-seo");
      for (const post of trBlog) {
        const r = reviewBlogPost(post, trBlog);
        if (r.ok) passed++;
        else {
          failed++;
          console.log(`FAIL blog/${post.slug}:`, r.issues.join("; "));
        }
      }
    }
  }

  console.log(`\nDirector QC: ${passed} passed, ${failed} failed`);
  if (strict && failed > 0) process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main();
}
