#!/usr/bin/env node
/**
 * Tazelik / decay taramasi. Cuma cron'u bunu calistirir.
 * YENI URL ONERMEZ — sadece mevcut URL'lerde guncelleme adaylari cikarir.
 *
 *   node scripts/seo/decay-scan.mjs --days 90 --top 10
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONTENT = path.join(ROOT, "src/content");
const arg = (f, d) => {
  const i = process.argv.indexOf(f);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const DAYS = Number(arg("--days", "90"));
const TOP = Number(arg("--top", "10"));

const readJson = (p, fb) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fb);
const asArray = (x) => (Array.isArray(x) ? x : x && typeof x === "object" ? Object.values(x).find(Array.isArray) || [] : []);

const items = [
  ...asArray(readJson(path.join(CONTENT, "generated-blog.json"), [])).map((p) => ({ ...p, type: "blog" })),
  ...asArray(readJson(path.join(CONTENT, "geo/packs.json"), [])).map((p) => ({ ...p, type: "geo" })),
];

// Yil damgasi tasiyan icerik daha hizli bayatlar (fiyat/rehber sayfalari).
const YEAR_RE = /\b(20\d\d)\b/;
const nowYear = new Date().getUTCFullYear();

const scored = items
  .map((p) => {
    const d = p.updatedAt || p.publishedAt;
    const age = d ? (Date.now() - new Date(d).getTime()) / 86400000 : 9999;
    const text = [p.title, p.excerpt, p.direct_answer, p.metaDescription].filter(Boolean).join(" ");
    const y = text.match(YEAR_RE)?.[1];
    const staleYear = y && Number(y) < nowYear;
    let score = 0;
    if (age > DAYS) score += Math.min(3, (age - DAYS) / 60 + 1);
    if (staleYear) score += 3;                      // "2026" yazip 2027'de durmak en hizli kayip
    if (!p.reviewer) score += 1.5;
    if (!p.author) score += 1;
    if (p.type === "geo") score += 0.5;             // GEO tazeligi AI alintisinda daha kritik
    return { ...p, age: Math.round(age), staleYear: staleYear ? y : null, score };
  })
  .filter((p) => p.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, TOP);

const lines = [
  `# Tazelik taramasi — ${new Date().toISOString().slice(0, 10)}`,
  "",
  `Esik: ${DAYS} gun. Aday: ${scored.length}.`,
  "",
  "**Kural: yeni URL acma. Ayni dosyada rakam/tarih guncelle, 1 yeni H2 sorusu ekle, `updatedAt` tazele.**",
  "",
  "| # | Sayfa | Tip | Yas (gun) | Eski yil | Skor |",
  "|---|---|---|---|---|---|",
  ...scored.map((p, i) => `| ${i + 1} | \`${p.lang}/${p.slug}\` | ${p.type} | ${p.age === 9999 ? "tarihsiz" : p.age} | ${p.staleYear || "-"} | ${p.score.toFixed(1)} |`),
];

const out = lines.join("\n");
console.log(out);
fs.writeFileSync(path.join(ROOT, "decay-report.md"), out + "\n");
