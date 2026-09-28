#!/usr/bin/env node
/**
 * Keyword Planner — Almanya hacim / CPC + yeni kelime keşfi (salt okunur, hesapta değişiklik yapmaz)
 *
 * DE_TR: Türkçe dil + Almanya geo · DE_DE: Almanca dil + Almanya geo · DE_EN: İngilizce + Almanya
 * Çıktı: docs/google-ads/keyword-volumes-de.csv · --ideas → keyword-ideas-de.csv
 *
 * Gereken: Cloud projede Ads API erişimi Basic+ (Explorer, KeywordPlanIdeaService'i engeller)
 *   https://console.cloud.google.com/google/ads-apis/overview
 *
 *   node scripts/google/keyword-volumes.mjs           # listedeki kelimelerin hacmi
 *   node scripts/google/keyword-volumes.mjs --ideas   # tohum kelime + rakip URL'den yeni kelimeler
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnv, ROOT } from "./env.mjs";
import { KNOWN } from "./config.mjs";
import { accessToken, adsCustomerId, googleFetch, errorText } from "./http.mjs";

loadEnv();

const GEO_DE = "geoTargetConstants/2276";
const LANG = { tr: "languageConstants/1037", de: "languageConstants/1001", en: "languageConstants/1000" };

const SETS = [
  {
    hat: "DE_TR",
    lang: "tr",
    groups: {
      implant: [
        "diş implant fiyat", "türkiye diş implantı", "türkiyede implant fiyatları",
        "istanbul implant fiyat", "implant tedavisi türkiye", "tek gün implant", "implant diş fiyatları",
      ],
      "all-on-4": ["all on 4 türkiye", "all on 4 fiyat", "tüm ağız implant fiyatı", "sabit protez implant"],
      zirkonyum: ["zirkonyum diş fiyatları", "zirkonyum kaplama türkiye", "hollywood smile fiyat", "gülüş tasarımı istanbul"],
      yolculuk: ["almanyadan türkiyeye diş tedavisi", "türkiyede diş yaptırmak", "istanbulda diş kliniği"],
    },
  },
  {
    hat: "DE_DE",
    lang: "de",
    groups: {
      implant: [
        "zahnimplantate türkei", "zahnimplantat türkei kosten", "implantate istanbul",
        "zahnimplantat istanbul preis", "zahnimplantate im ausland",
      ],
      "all-on-4": [
        "all on 4 türkei", "all on 4 türkei kosten", "feste zähne an einem tag türkei",
        "vollmund implantate türkei", "zahnersatz türkei", "zahnersatz türkei kosten",
      ],
      zirkon: ["zirkonkronen türkei", "zirkonkronen türkei preis", "veneers türkei kosten", "hollywood smile türkei"],
      genel: [
        "zähne machen lassen türkei", "zähne machen türkei kosten", "zahnbehandlung türkei",
        "zahnarzt istanbul", "zahnarzt istanbul deutsch",
      ],
      "seo-only": [
        "zähne türkei erfahrungen", "zähne türkei vorher nachher", "zähne türkei probleme",
        "zahnbehandlung türkei krankenkasse",
      ],
    },
  },
];

// Keşif tohumları — GSC'de Almanya'dan gelen gerçek sorgu kalıbı "istanbul + tedavi" (2026-09-24)
const IDEAS = [
  { hat: "DE_DE", lang: "de", seeds: ["zahnarzt istanbul", "zähne machen lassen istanbul", "all on 4 istanbul", "implantate istanbul", "hollywood smile türkei"], url: "https://www.fly2smile.de/" },
  { hat: "DE_TR", lang: "tr", seeds: ["istanbul diş kliniği", "implant tedavisi istanbul", "diş yaptırmak istanbul", "zirkonyum diş istanbul"] },
  { hat: "DE_EN", lang: "en", seeds: ["turkey teeth", "dental clinic istanbul", "invisalign istanbul", "all on 4 istanbul"] },
];

const eur = (micros) => (micros ? (Number(micros) / 1e6).toFixed(2) : "");

const toCsv = (rows) => rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";

// OAuth kullanıcısı klinik hesabına doğrudan erişiyorsa MCC header'ı USER_PERMISSION_DENIED verir → header'sız tekrar dene.
async function adsPost(token, url, body) {
  const base = {};
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN) base["developer-token"] = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const login = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || "").replace(/-/g, "");
  let res = await googleFetch(token, url, { method: "POST", headers: login ? { ...base, "login-customer-id": login } : base, body });
  if (login && JSON.stringify(res.json || {}).includes("USER_PERMISSION_DENIED")) {
    res = await googleFetch(token, url, { method: "POST", headers: base, body });
  }
  if (!res.ok && JSON.stringify(res.json || {}).includes("DEVELOPER_TOKEN_NOT_APPROVED")) {
    throw new Error(
      "Cloud projenin Ads API erişimi Explorer — Keyword Planner kapalı. Basic başvurusu: https://console.cloud.google.com/google/ads-apis/overview",
    );
  }
  return res;
}

async function ideas(token, cid) {
  const rows = [["hat", "kelime", "aylik_ort", "rekabet", "cpc_dusuk", "cpc_yuksek"]];
  for (const set of IDEAS) {
    const seed = set.url ? { keywordAndUrlSeed: { keywords: set.seeds, url: set.url } } : { keywordSeed: { keywords: set.seeds } };
    const res = await adsPost(token, `https://googleads.googleapis.com/${KNOWN.adsApiVersion}/customers/${cid}:generateKeywordIdeas`, {
      ...seed,
      geoTargetConstants: [GEO_DE],
      language: LANG[set.lang],
      keywordPlanNetwork: "GOOGLE_SEARCH",
      pageSize: 300,
    });
    if (!res.ok) throw new Error(`${set.hat}: ${res.status} ${errorText(res.json)}`);
    for (const r of res.json.results || []) {
      const m = r.keywordIdeaMetrics || {};
      if (!Number(m.avgMonthlySearches)) continue;
      rows.push([set.hat, r.text, m.avgMonthlySearches, m.competition || "", eur(m.lowTopOfPageBidMicros), eur(m.highTopOfPageBidMicros)]);
    }
  }
  rows.splice(1, rows.length, ...rows.slice(1).sort((a, b) => b[2] - a[2]));
  const out = path.join(ROOT, "docs/google-ads/keyword-ideas-de.csv");
  fs.writeFileSync(out, toCsv(rows));
  console.table(rows.slice(1, 80).map(([hat, kelime, hacim, rekabet, lo, hi]) => ({ hat, kelime, hacim, rekabet, cpc: lo || hi ? `${lo}–${hi}` : "" })));
  console.log(`\n${rows.length - 1} kelime · CSV: ${path.relative(ROOT, out)}`);
}

async function main() {
  const token = await accessToken();
  if (!token) throw new Error(".env içinde GOOGLE_CLIENT_ID / SECRET / REFRESH_TOKEN yok — önce npm run google:auth");
  const cid = adsCustomerId();
  if (process.argv.includes("--ideas")) return ideas(token, cid);

  const rows = [["hat", "grup", "kelime", "aylik_ort", "rekabet", "cpc_dusuk", "cpc_yuksek"]];
  for (const set of SETS) {
    const groupOf = new Map();
    for (const [g, kws] of Object.entries(set.groups)) kws.forEach((k) => groupOf.set(k, g));
    const res = await adsPost(
      token,
      `https://googleads.googleapis.com/${KNOWN.adsApiVersion}/customers/${cid}:generateKeywordHistoricalMetrics`,
      {
        keywords: [...groupOf.keys()],
        geoTargetConstants: [GEO_DE],
        language: LANG[set.lang],
        keywordPlanNetwork: "GOOGLE_SEARCH",
      },
    );
    if (!res.ok) throw new Error(`${set.hat}: ${res.status} ${errorText(res.json)}`);
    const seen = new Set();
    for (const r of res.json.results || []) {
      const m = r.keywordMetrics || {};
      const kw = r.text;
      const variants = [kw, ...(r.closeVariants || [])];
      const orig = variants.find((v) => groupOf.has(v)) || kw;
      seen.add(orig);
      rows.push([
        set.hat, groupOf.get(orig) || "?", orig, m.avgMonthlySearches ?? 0,
        m.competition || "", eur(m.lowTopOfPageBidMicros), eur(m.highTopOfPageBidMicros),
      ]);
    }
    for (const k of groupOf.keys()) if (!seen.has(k)) rows.push([set.hat, groupOf.get(k), k, "veri yok", "", "", ""]);
  }

  const out = path.join(ROOT, "docs/google-ads/keyword-volumes-de.csv");
  fs.writeFileSync(out, toCsv(rows));
  console.table(rows.slice(1).map(([hat, grup, kelime, hacim, rekabet, lo, hi]) => ({ hat, grup, kelime, hacim, rekabet, cpc: lo || hi ? `${lo}–${hi}` : "" })));
  console.log(`\nCSV: ${path.relative(ROOT, out)}`);
}

main().catch((e) => {
  console.error("HATA:", e.message);
  process.exit(1);
});
