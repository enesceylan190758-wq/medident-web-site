#!/usr/bin/env node
/**
 * Kampanya bazında performans raporu (son 7 ve son 30 gün) — salt okunur.
 *
 * İki kimlik doğrulama yolu desteklenir:
 *   1. Proxy-enjekte edilen kimlik bilgisi (Project settings → API credentials,
 *      "GCP access token" tipi, allowed website googleads.googleapis.com):
 *      Authorization başlığını ortamın egress proxy'si kendisi ekler, bu script
 *      hiç token görmez/istemez. GOOGLE_REFRESH_TOKEN .env'de yoksa bu yol denenir.
 *   2. Klasik OAuth (npm run google:auth ile üretilen GOOGLE_REFRESH_TOKEN):
 *      .env'de varsa bu öncelikli kullanılır.
 *
 * Çıktı: konsola tablo + docs/google-ads/reports/son-7-gun.csv, son-30-gun.csv
 *
 *   node scripts/google/report.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnv, ROOT } from "./env.mjs";
import { accessToken, adsCustomerId, googleFetch, errorText } from "./http.mjs";
import { KNOWN } from "./config.mjs";

loadEnv();

const RANGES = [
  { key: "son-7-gun", label: "Son 7 gün", gaql: "LAST_7_DAYS" },
  { key: "son-30-gun", label: "Son 30 gün", gaql: "LAST_30_DAYS" },
];

const QUERY = (range) => `
  SELECT
    campaign.name,
    campaign.status,
    metrics.cost_micros,
    metrics.impressions,
    metrics.clicks,
    metrics.conversions,
    metrics.cost_per_conversion
  FROM campaign
  WHERE segments.date DURING ${range}
  ORDER BY metrics.cost_micros DESC
`;

function tl(micros) {
  return (Number(micros || 0) / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

function headers() {
  const login = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || KNOWN.adsMccId || "").replace(/-/g, "");
  const h = {};
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN) h["developer-token"] = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (login) h["login-customer-id"] = login;
  return h;
}

async function fetchRange(token, customerId, range) {
  const version = KNOWN.adsApiVersion;
  const res = await googleFetch(
    token,
    `https://googleads.googleapis.com/${version}/customers/${customerId}/googleAds:search`,
    { method: "POST", headers: headers(), body: { query: QUERY(range.gaql) } },
  );
  if (!res.ok) {
    throw new Error(`${range.label}: ${errorText(res.json) || `HTTP ${res.status}`}`);
  }
  return (res.json?.results || []).map((r) => {
    const m = r.metrics || {};
    const clicks = Number(m.clicks || 0);
    const costMicros = Number(m.costMicros || 0);
    const conversions = Number(m.conversions || 0);
    return {
      kampanya: r.campaign?.name || "?",
      durum: r.campaign?.status || "?",
      harcama: tl(costMicros),
      gosterim: Number(m.impressions || 0),
      tiklama: clicks,
      donusum: conversions,
      leadBasiMaliyet: conversions > 0 ? tl(m.costPerConversion) : "-",
    };
  });
}

function printTable(label, rows) {
  console.log(`\n${label}\n${"-".repeat(label.length)}`);
  if (!rows.length) {
    console.log("(bu aralıkta kampanya verisi yok)");
    return;
  }
  const cols = [
    ["kampanya", "Kampanya", 34],
    ["durum", "Durum", 10],
    ["harcama", "Harcama (TL)", 14],
    ["gosterim", "Gösterim", 10],
    ["tiklama", "Tıklama", 9],
    ["donusum", "Dönüşüm", 9],
    ["leadBasiMaliyet", "Lead/Maliyet", 12],
  ];
  console.log(cols.map(([, h, w]) => h.padEnd(w)).join(" "));
  for (const row of rows) {
    console.log(cols.map(([k, , w]) => String(row[k]).slice(0, w).padEnd(w)).join(" "));
  }
}

function writeCsv(key, rows) {
  const dir = path.join(ROOT, "docs/google-ads/reports");
  fs.mkdirSync(dir, { recursive: true });
  const header = "kampanya,durum,harcama_tl,gosterim,tiklama,donusum,lead_basi_maliyet_tl";
  const lines = rows.map((r) =>
    [r.kampanya, r.durum, r.harcama, r.gosterim, r.tiklama, r.donusum, r.leadBasiMaliyet]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  fs.writeFileSync(path.join(dir, `${key}.csv`), [header, ...lines].join("\n") + "\n");
}

export async function runReport() {
  const usingOAuth = Boolean(process.env.GOOGLE_REFRESH_TOKEN);
  let token = null;
  if (usingOAuth) {
    token = await accessToken();
    if (!token) {
      console.error("GOOGLE_REFRESH_TOKEN geçersiz — npm run google:auth ile yeniden üret.");
      process.exitCode = 1;
      return;
    }
  }
  // usingOAuth=false: token=null → googleFetch Authorization başlığı eklemez,
  // ortamın egress proxy'si (varsa) kendi ekler.
  const customerId = adsCustomerId();
  console.log(`Google Ads kampanya raporu — müşteri ${customerId}\n`);
  for (const range of RANGES) {
    try {
      const rows = await fetchRange(token, customerId, range);
      const active = rows.filter((r) => r.durum === "ENABLED" || Number(r.gosterim) > 0);
      printTable(range.label, active);
      if (rows.length > active.length) {
        console.log(`(+ ${rows.length - active.length} pasif/harcamasız kampanya — CSV'de tam liste)`);
      }
      writeCsv(range.key, rows);
    } catch (e) {
      console.error(`${range.label}: ${e.message || e}`);
      process.exitCode = 1;
    }
  }
  console.log(`\nCSV dosyaları: docs/google-ads/reports/`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runReport().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
}
