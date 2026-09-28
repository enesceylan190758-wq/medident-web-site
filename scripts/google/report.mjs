#!/usr/bin/env node
/**
 * Kampanya + reklam bazında performans raporu (son 7 ve son 30 gün, BUGÜN dahil)
 * — salt okunur.
 *
 * Kimlik doğrulama (öncelik sırası):
 *   1. GOOGLE_ADS_SA_JSON — Cursor environment secret, servis hesabı JSON.
 *      google-auth-library JWT, scope https://www.googleapis.com/auth/adwords.
 *      Anahtar dosyaya/loga yazılmaz. login-customer-id = MCC 4448637998.
 *   2. GOOGLE_REFRESH_TOKEN — npm run google:auth (OAuth masaüstü).
 *   3. Proxy-enjekte token (Project settings → GCP access token). Authorization
 *      başlığını egress proxy ekler; script token görmez.
 *
 * LAST_7_DAYS / LAST_30_DAYS GAQL sabitleri bugünü hariç tutar (dün + önceki
 * N-1 gün) — bu yüzden bugünü dahil etmek için segments.date BETWEEN ile
 * açık tarih aralığı kullanılır.
 *
 * Çıktı: konsola tablo + en başarılı reklam + docs/google-ads/reports/*.csv
 *
 *   node scripts/google/report.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnv, ROOT } from "./env.mjs";
import {
  adsAccessToken,
  adsCustomerId,
  adsErrorExact,
  adsLoginCustomerId,
  flattenSearchStream,
  googleFetch,
} from "./http.mjs";
import { KNOWN } from "./config.mjs";

loadEnv();

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return isoDate(d);
}

const TODAY = isoDate(new Date());
const RANGES = [
  { key: "son-7-gun", label: "Son 7 gün (bugün dahil)", start: daysAgo(6), end: TODAY },
  { key: "son-30-gun", label: "Son 30 gün (bugün dahil)", start: daysAgo(29), end: TODAY },
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
  WHERE segments.date BETWEEN "${range.start}" AND "${range.end}"
  ORDER BY metrics.cost_micros DESC
`;

const BEST_AD_QUERY = (range) => `
  SELECT
    campaign.name,
    ad_group.name,
    ad_group_ad.ad.id,
    ad_group_ad.status,
    ad_group_ad.ad.type,
    metrics.clicks,
    metrics.impressions,
    metrics.conversions,
    metrics.cost_micros,
    metrics.ctr
  FROM ad_group_ad
  WHERE segments.date BETWEEN "${range.start}" AND "${range.end}"
    AND metrics.impressions > 0
  ORDER BY metrics.conversions DESC, metrics.clicks DESC
  LIMIT 5
`;

function tl(micros) {
  return (Number(micros || 0) / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

function headers() {
  const login = adsLoginCustomerId();
  const h = {};
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN) h["developer-token"] = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (login) h["login-customer-id"] = login;
  return h;
}

async function searchAds(token, customerId, query) {
  const version = KNOWN.adsApiVersion;
  const res = await googleFetch(
    token,
    `https://googleads.googleapis.com/${version}/customers/${customerId}/googleAds:searchStream`,
    { method: "POST", headers: headers(), body: { query } },
  );
  if (!res.ok) throw new Error(adsErrorExact(res));
  return flattenSearchStream(res.json);
}

async function fetchRange(token, customerId, range) {
  let results;
  try {
    results = await searchAds(token, customerId, QUERY(range));
  } catch (e) {
    throw new Error(`${range.label}: ${e.message}`);
  }
  return results.map((r) => {
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

async function fetchBestAds(token, customerId, range) {
  let results;
  try {
    results = await searchAds(token, customerId, BEST_AD_QUERY(range));
  } catch (e) {
    throw new Error(`${range.label} (reklam): ${e.message}`);
  }
  return results.map((r) => {
    const m = r.metrics || {};
    return {
      kampanya: r.campaign?.name || "?",
      reklamGrubu: r.adGroup?.name || "?",
      adId: r.adGroupAd?.ad?.id || "?",
      tur: r.adGroupAd?.ad?.type || "?",
      harcama: tl(m.costMicros),
      gosterim: Number(m.impressions || 0),
      tiklama: Number(m.clicks || 0),
      ctr: m.ctr ? `%${(Number(m.ctr) * 100).toFixed(1)}` : "-",
      donusum: Number(m.conversions || 0),
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

function printBestAds(label, rows) {
  console.log(`\nEn başarılı reklamlar — ${label}\n${"-".repeat(20 + label.length)}`);
  if (!rows.length) {
    console.log("(bu aralıkta gösterim alan reklam yok)");
    return;
  }
  const cols = [
    ["kampanya", "Kampanya", 30],
    ["reklamGrubu", "Reklam Grubu", 26],
    ["harcama", "Harcama (TL)", 12],
    ["gosterim", "Gösterim", 9],
    ["tiklama", "Tıklama", 8],
    ["ctr", "CTR", 7],
    ["donusum", "Dönüşüm", 8],
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
  const customerId = adsCustomerId();
  const login = adsLoginCustomerId();
  const authMode = process.env.GOOGLE_ADS_SA_JSON
    ? "GOOGLE_ADS_SA_JSON"
    : process.env.GOOGLE_REFRESH_TOKEN
      ? "GOOGLE_REFRESH_TOKEN"
      : "proxy";
  if (!process.env.GOOGLE_ADS_SA_JSON && !process.env.GOOGLE_REFRESH_TOKEN) {
    console.error(
      "GOOGLE_ADS_SA_JSON ortamda yok. Cursor environment secret bu agent'a enjekte edilmemiş olabilir — yeni bir agent başlatman gerekebilir.",
    );
  }
  let token;
  try {
    token = await adsAccessToken();
  } catch (e) {
    console.error(e.message || e);
    process.exitCode = 1;
    return;
  }
  console.log(`Google Ads kampanya raporu — müşteri ${customerId} · login ${login} · auth ${authMode}\n`);
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

  const adRange = RANGES[RANGES.length - 1]; // en geniş pencere (son 30 gün, bugün dahil)
  try {
    const bestAds = await fetchBestAds(token, customerId, adRange);
    printBestAds(adRange.label, bestAds);
  } catch (e) {
    console.error(e.message || e);
    process.exitCode = 1;
  }

  console.log(`\nCSV dosyaları: docs/google-ads/reports/`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runReport().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
}
