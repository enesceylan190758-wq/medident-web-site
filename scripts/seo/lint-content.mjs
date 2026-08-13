#!/usr/bin/env node
/**
 * MediDent icerik kalite kapisi (RED gate).
 *
 * Kullanim:
 *   node scripts/seo/lint-content.mjs                 # tum korpus, RED varsa exit 1
 *   node scripts/seo/lint-content.mjs --report-only   # her zaman exit 0 (envanter icin)
 *   node scripts/seo/lint-content.mjs --new-only      # sadece bu PR'da eklenenler (git diff)
 *   node scripts/seo/lint-content.mjs --max-new 8     # hacim tavani
 *   node scripts/seo/lint-content.mjs --json out.json
 *
 * Girdi: src/content/generated-blog.json, src/content/geo/packs.json
 * Cikti: konsol raporu + opsiyonel JSON. RED bulursa exit 1.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONTENT = path.join(ROOT, "src/content");
const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/seo/lib/banned-terms.json"), "utf8"));

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => {
  const i = argv.indexOf(f);
  return i > -1 && argv[i + 1] ? argv[i + 1] : d;
};
const REPORT_ONLY = has("--report-only");
const NEW_ONLY = has("--new-only");
const MAX_NEW = Number(val("--max-new", "8"));
const JSON_OUT = val("--json", null);

// ---- esikler ----
const T = {
  DUP_RED: 0.75,          // ayni dilde trigram Jaccard
  DUP_WARN: 0.6,
  BLOG_MIN_WORDS: 250,
  GEO_ANSWER_MIN: 25,
  GEO_ANSWER_MAX: 60,
  GEO_MIN_BULLETS: 3,
  GEO_MIN_FAQ: 2,
  BLOG_LEAD_MAX: 60,      // ilk paragraf kelime tavani (answer-first)
  STALE_DAYS: 180,
};

const findings = [];
const add = (level, item, rule, msg, hint) =>
  findings.push({ level, id: `${item.lang}/${item.type}/${item.slug}`, rule, msg, hint });

// ---- yardimcilar ----
const readJson = (p, fb) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fb);
const asArray = (x) => (Array.isArray(x) ? x : x && typeof x === "object" ? Object.values(x).find(Array.isArray) || [] : []);
const strip = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
const words = (s) => strip(s).split(" ").filter(Boolean);

function trigrams(text) {
  const w = strip(text).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + 2 < w.length; i++) s.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
  return s;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

// sayisal iddia: fiyat, yuzde, sure, oran -> source zorunlu
const CLAIM_RE =
  /(\b\d[\d.,]*\s*(€|\$|£|tl|eur|usd|gbp)\b)|(%\s*\d|\b\d+\s*%)|(\b\d+\s*[-–]\s*\d+\s*(y[ıi]l|ay|hafta|g[uü]n|saat|jahr|monat|woche|tag|year|month|week|day|hour))|(\bba[sş]ar[ıi] oran[ıi]\b)|(\bsuccess rate\b)|(\berfolgsquote\b)/i;

function bannedHits(text, lang) {
  const hits = [];
  const rules = [...(CFG.all || []), ...(CFG[lang] || [])];
  const t = String(text || "");
  for (const r of rules) {
    const m = t.match(new RegExp(r.re, "iu"));
    if (m) hits.push({ term: m[0].trim(), why: r.why, allow: r.allow });
  }
  return hits;
}

// ---- korpusu yukle ----
const blog = asArray(readJson(path.join(CONTENT, "generated-blog.json"), []))
  .map((p) => ({ ...p, type: "blog", lang: p.lang || "tr" }));
const geo = asArray(readJson(path.join(CONTENT, "geo/packs.json"), []))
  .map((p) => ({ ...p, type: "geo", lang: p.lang || "tr" }));
const all = [...blog, ...geo];

// ---- --new-only: PR'da eklenen slug'lari tespit et ----
let newSlugs = null;
if (NEW_ONLY) {
  try {
    const base = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "origin/main";
    execSync(`git fetch --no-tags --depth=1 origin ${process.env.GITHUB_BASE_REF || "main"}`, { cwd: ROOT, stdio: "ignore" });
    const prevBlog = asArray(JSON.parse(execSync(`git show ${base}:src/content/generated-blog.json`, { cwd: ROOT }).toString()));
    const prevGeo = asArray(JSON.parse(execSync(`git show ${base}:src/content/geo/packs.json`, { cwd: ROOT }).toString()));
    const prev = new Set([...prevBlog, ...prevGeo].map((p) => `${p.lang}/${p.slug}`));
    newSlugs = new Set(all.filter((p) => !prev.has(`${p.lang}/${p.slug}`)).map((p) => `${p.lang}/${p.slug}`));
  } catch (e) {
    console.error("! --new-only calisamadi (base bulunamadi), tum korpus denetlenecek:", e.message);
    newSlugs = null;
  }
}
const inScope = (p) => !newSlugs || newSlugs.has(`${p.lang}/${p.slug}`);
const scoped = all.filter(inScope);

// ---- 0. HACIM TAVANI ----
if (newSlugs) {
  const byLang = {};
  for (const s of newSlugs) {
    const l = s.split("/")[0];
    byLang[l] = (byLang[l] || 0) + 1;
  }
  for (const [lang, n] of Object.entries(byLang)) {
    if (n > MAX_NEW) {
      findings.push({
        level: "RED",
        id: `${lang}/*`,
        rule: "volume-cap",
        msg: `${lang}: bu PR'da ${n} yeni sayfa (tavan ${MAX_NEW})`,
        hint: "PR'i bol veya --max-new degerini bilincli yukselt. Hacim kacagi = scaled content abuse riski.",
      });
    }
  }
}

// ---- 1..8 sayfa bazli kontroller ----
const seenQuery = new Map();

for (const p of scoped) {
  const body = p.type === "blog" ? p.html : [p.direct_answer, ...(p.bullets || [])].join(" ");
  const full = [p.title, p.excerpt, p.metaDescription, p.question, p.direct_answer, strip(p.html), (p.bullets || []).join(" "), (p.faq || []).map((f) => `${f.q} ${f.a}`).join(" ")]
    .filter(Boolean)
    .join(" \n ");

  // 1. yasak ifade
  for (const h of bannedHits(full, p.lang)) {
    add("RED", p, "banned-term", `yasak ifade: "${h.term}" — ${h.why}`, h.allow || "Ifadeyi kaldir veya nesnel dille yeniden yaz.");
  }

  // 2. E-E-A-T: yazar/onay
  if (!p.author) add("RED", p, "no-author", "author alani bos", "Gercek hekim ata (content/entities ile eslesen isim).");
  if (!p.reviewer) add("RED", p, "no-reviewer", "reviewer alani bos", "Hekim onayi olmadan yayinlanamaz. PR'da reviewer + reviewedAt doldur.");
  if (!p.reviewedAt) add("RED", p, "no-reviewed-at", "reviewedAt bos", "ISO tarih ekle (2026-08-13).");
  if (!p.updatedAt && !p.publishedAt) add("RED", p, "no-date", "publishedAt/updatedAt yok", "dateModified schema'si icin zorunlu.");

  // 3. answer-first
  if (p.type === "geo") {
    const n = words(p.direct_answer).length;
    if (!p.direct_answer) add("RED", p, "no-direct-answer", "direct_answer yok", "Soruyu tek basina cevaplayan 25-60 kelime yaz.");
    else if (n < T.GEO_ANSWER_MIN || n > T.GEO_ANSWER_MAX)
      add("RED", p, "answer-length", `direct_answer ${n} kelime (hedef ${T.GEO_ANSWER_MIN}-${T.GEO_ANSWER_MAX})`, "Alintilanabilir olmasi icin tek paragraf, tek basina anlamli olmali.");
    if (p.question && p.direct_answer) {
      const qk = words(p.question).map((w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")).filter((w) => w.length > 4);
      const ak = new Set(words(p.direct_answer).map((w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")));
      const overlap = qk.filter((w) => ak.has(w)).length;
      if (qk.length >= 2 && overlap === 0)
        add("RED", p, "answer-mismatch", "direct_answer soruyu dogrudan karsilamiyor (ortak anahtar kelime yok)", "Cevabin ilk cumlesi soruyu tekrar etmeli.");
    }
  } else {
    const firstP = String(p.html || "").match(/<p[^>]*>(.*?)<\/p>/is)?.[1] || "";
    const n = words(firstP).length;
    if (n > T.BLOG_LEAD_MAX)
      add("RED", p, "lead-too-long", `ilk paragraf ${n} kelime (tavan ${T.BLOG_LEAD_MAX})`, "Answer-first: ilk paragraf tek basina cevap olmali.");
  }

  // 4. thin
  if (p.type === "blog") {
    const n = words(p.html).length;
    if (n < T.BLOG_MIN_WORDS) add("RED", p, "thin", `${n} kelime (min ${T.BLOG_MIN_WORDS})`, "Ozgun bilgi ekle — sablon cumle ekleyerek doldurma.");
  } else {
    if ((p.bullets || []).length < T.GEO_MIN_BULLETS) add("RED", p, "thin", `${(p.bullets || []).length} bullet (min ${T.GEO_MIN_BULLETS})`, "Somut: sure, seans, malzeme, iyilesme.");
    if ((p.faq || []).length < T.GEO_MIN_FAQ) add("RED", p, "thin", `${(p.faq || []).length} FAQ (min ${T.GEO_MIN_FAQ})`, "FAQPage schema icin en az 2.");
  }

  // 5. ic link
  const links = p.internal_links || (String(p.html || "").match(/<a\s/gi) || []).length;
  const linkCount = Array.isArray(links) ? links.length : links;
  if (!linkCount) add("RED", p, "no-internal-link", "ic link yok", "Ilgili hizmet sayfasina 1 + ilgili 2 answer'a link ver.");
  if (linkCount > 8) add("WARN", p, "too-many-links", `${linkCount} ic link (tavan 8)`, "Otomatik link enjeksiyonunu sinirla.");

  // 6. kaynaksiz sayisal iddia
  if (CLAIM_RE.test(full) && !p.source) {
    const m = full.match(CLAIM_RE);
    add("RED", p, "unsourced-claim", `sayisal iddia var ("${String(m[0]).trim()}") ama source alani bos`, "source ekle veya rakami cikar.");
  }

  // 7. kannibalizasyon
  const key = `${p.lang}::${(p.question || p.title || p.slug).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()}`;
  if (seenQuery.has(key)) add("RED", p, "cannibalization", `ayni sorgu baska sayfada var: ${seenQuery.get(key)}`, "Tek soru = tek URL. Digerini birlestir veya link ver.");
  else seenQuery.set(key, `${p.type}/${p.slug}`);

  // 8. AR/RU native onay
  if (["ar", "ru"].includes(p.lang) && p.nativeReviewed !== true)
    add("RED", p, "no-native-review", `${p.lang}: nativeReviewed true degil`, "Native konusur onayi olmadan yayinlanamaz.");

  // 9. tazelik (WARN)
  const d = p.updatedAt || p.publishedAt;
  if (d) {
    const age = (Date.now() - new Date(d).getTime()) / 86400000;
    if (age > T.STALE_DAYS) add("WARN", p, "stale", `${Math.round(age)} gun guncellenmemis`, "Refresh PR: ayni URL'de guncelle, yeni URL acma.");
  }
}

// ---- 10. DUPLICATE (ayni dil, ayni tip) ----
const sig = new Map(all.map((p) => [`${p.lang}/${p.type}/${p.slug}`, trigrams(p.type === "blog" ? p.html : [p.direct_answer, ...(p.bullets || [])].join(" "))]));
for (const p of scoped) {
  const pk = `${p.lang}/${p.type}/${p.slug}`;
  let worst = { s: 0, other: null };
  for (const q of all) {
    if (q === p) continue;
    if (q.lang !== p.lang || q.type !== p.type) continue;
    const s = jaccard(sig.get(pk), sig.get(`${q.lang}/${q.type}/${q.slug}`));
    if (s > worst.s) worst = { s, other: q.slug };
  }
  if (worst.s >= T.DUP_RED)
    add("RED", p, "duplicate", `"${worst.other}" ile %${(worst.s * 100).toFixed(0)} benzer`, "Sablon govde. Ozgun yaz veya iki sayfayi birlestir.");
  else if (worst.s >= T.DUP_WARN)
    add("WARN", p, "near-duplicate", `"${worst.other}" ile %${(worst.s * 100).toFixed(0)} benzer`, "Govdeyi farklilastir.");
}

// ---- rapor ----
const red = findings.filter((f) => f.level === "RED");
const warn = findings.filter((f) => f.level === "WARN");
const byRule = {};
for (const f of findings) byRule[f.rule] = (byRule[f.rule] || 0) + 1;

console.log("\n" + "=".repeat(64));
console.log(`MediDent icerik kapisi — ${scoped.length} sayfa denetlendi${newSlugs ? " (sadece yeni)" : " (tum korpus)"}`);
console.log("=".repeat(64));
console.log(`RED: ${red.length}   WARN: ${warn.length}\n`);
console.log("Kural bazinda:");
for (const [r, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${r}`);

const show = (list, cap) => {
  const seen = new Set();
  let shown = 0;
  for (const f of list) {
    if (shown >= cap) break;
    const k = `${f.rule}::${f.id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    console.log(`  [${f.rule}] ${f.id}\n      ${f.msg}\n      -> ${f.hint}`);
    shown++;
  }
  if (list.length > shown) console.log(`  ... +${list.length - shown} daha`);
};
if (red.length) {
  console.log("\n--- RED (merge bloklanir) ---");
  show(red, 25);
}
if (warn.length) {
  console.log("\n--- WARN (bloklamaz) ---");
  show(warn, 10);
}

if (JSON_OUT) {
  fs.writeFileSync(path.join(ROOT, JSON_OUT), JSON.stringify({ scanned: scoped.length, red: red.length, warn: warn.length, byRule, findings }, null, 2));
  console.log(`\nJSON: ${JSON_OUT}`);
}

if (red.length && !REPORT_ONLY) {
  console.log(`\nFAIL: ${red.length} RED bulgusu. Duzeltilmeden merge edilemez.\n`);
  process.exit(1);
}
console.log(REPORT_ONLY ? "\n(report-only: exit 0)\n" : "\nOK\n");
