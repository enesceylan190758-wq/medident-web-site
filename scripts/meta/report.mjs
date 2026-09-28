#!/usr/bin/env node
/**
 * Hat A (Meta) kampanya performansı — son 7 ve 30 gün, bugün dahil. Salt okunur.
 *
 * Ortam:
 *   META_ACCESS_TOKEN  (zorunlu) — Business Manager sistem kullanıcısı, ads_read
 *   META_AD_ACCOUNT_ID (opsiyonel) — act_XXXX veya sadece rakam
 *   FB_ACCESS_TOKEN / META_SYSTEM_USER_TOKEN / FB_AD_ACCOUNT_ID eşdeğer
 *
 * Token dosyaya, loga veya commit'e yazılmaz.
 *
 *   npm run meta:ads:report
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnv, ROOT } from "./env.mjs";
import { KNOWN, LEAD_ACTION_TYPES } from "./config.mjs";
import {
  graphFetch,
  graphGetAll,
  metaAccessToken,
  metaAdAccountId,
  metaErrorExact,
} from "./http.mjs";

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
  { key: "son-7-gun", label: "Son 7 gün (bugün dahil)", since: daysAgo(6), until: TODAY },
  { key: "son-30-gun", label: "Son 30 gün (bugün dahil)", since: daysAgo(29), until: TODAY },
];

function money(n) {
  return Number(n || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function actionValue(list, types) {
  if (!Array.isArray(list)) return 0;
  let sum = 0;
  for (const a of list) {
    if (types.has(a.action_type)) sum += Number(a.value || 0);
  }
  return sum;
}

function printTable(label, rows) {
  console.log(`\n${label}\n${"-".repeat(label.length)}`);
  if (!rows.length) {
    console.log("(bu aralıkta kampanya verisi yok)");
    return;
  }
  const cols = [
    ["kampanya", "Kampanya", 36],
    ["harcama", "Harcama", 12],
    ["gosterim", "Gösterim", 10],
    ["tiklama", "Tıklama", 9],
    ["donusum", "Lead", 8],
    ["leadBasi", "Lead/Maliyet", 12],
  ];
  console.log(cols.map(([, h, w]) => h.padEnd(w)).join(" "));
  for (const row of rows) {
    console.log(cols.map(([k, , w]) => String(row[k]).slice(0, w).padEnd(w)).join(" "));
  }
}

function writeCsv(key, rows) {
  const dir = path.join(ROOT, "docs/meta-ads/reports");
  fs.mkdirSync(dir, { recursive: true });
  const header = "kampanya,harcama,gosterim,tiklama,lead,lead_basi_maliyet";
  const lines = rows.map((r) =>
    [r.kampanya, r.harcama, r.gosterim, r.tiklama, r.donusum, r.leadBasi]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  fs.writeFileSync(path.join(dir, `${key}.csv`), [header, ...lines].join("\n") + "\n");
}

function mapInsights(rows) {
  return rows
    .map((r) => {
      const spend = Number(r.spend || 0);
      const leads = actionValue(r.actions, LEAD_ACTION_TYPES);
      const leadCost = actionValue(r.cost_per_action_type, LEAD_ACTION_TYPES);
      return {
        kampanya: r.campaign_name || r.campaign_id || "?",
        harcama: money(spend),
        gosterim: Number(r.impressions || 0),
        tiklama: Number(r.clicks || 0),
        donusum: leads,
        leadBasi: leads > 0 ? money(leadCost || spend / leads) : "-",
        _spend: spend,
      };
    })
    .sort((a, b) => b._spend - a._spend);
}

async function listAdAccounts(token) {
  return graphGetAll(token, "/me/adaccounts", {
    fields: "id,name,account_id,account_status,currency,timezone_name",
    limit: 50,
  });
}

async function resolveAccount(token) {
  const wanted = metaAdAccountId();
  const accounts = await listAdAccounts(token);
  if (!accounts.length) {
    throw new Error("Token geçerli ama bu kullanıcının ads_read ile görebileceği reklam hesabı yok.");
  }
  if (wanted) {
    const hit = accounts.find((a) => a.id === wanted || `act_${a.account_id}` === wanted);
    if (!hit) {
      const names = accounts.map((a) => `${a.id} · ${a.name || "?"}`).join("; ");
      throw new Error(`META_AD_ACCOUNT_ID=${wanted} hesap listesinde yok. Görünen: ${names}`);
    }
    return hit;
  }
  if (accounts.length === 1) return accounts[0];
  const names = accounts.map((a) => `${a.id} · ${a.name || "?"}`).join("\n  ");
  throw new Error(`Birden fazla reklam hesabı var. META_AD_ACCOUNT_ID seç:\n  ${names}`);
}

async function fetchRange(token, actId, range) {
  const rows = await graphGetAll(token, `/${actId}/insights`, {
    level: "campaign",
    fields: "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,actions,cost_per_action_type",
    time_range: { since: range.since, until: range.until },
    limit: 200,
  });
  return mapInsights(rows);
}

export async function runReport() {
  const token = metaAccessToken();
  if (!token) {
    console.error(
      "META_ACCESS_TOKEN ortamda yok. Cursor environment secret olarak ekle (ads_read sistem kullanıcısı), sonra yeni bir agent başlat. Pixel ID API girişi değildir: " +
        KNOWN.pixelId,
    );
    process.exitCode = 1;
    return;
  }

  const me = await graphFetch(token, "/me", { fields: "id,name" });
  if (!me.ok) {
    console.error(metaErrorExact(me.json, me.status));
    process.exitCode = 1;
    return;
  }

  let account;
  try {
    account = await resolveAccount(token);
  } catch (e) {
    console.error(e.message || e);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Meta Ads kampanya raporu — ${account.name || account.id} (${account.id}) · ${account.currency || "?"}`,
  );
  console.log(`pixel (sitede, API değil): ${KNOWN.pixelId}\n`);

  for (const range of RANGES) {
    try {
      const rows = await fetchRange(token, account.id, range);
      printTable(range.label, rows);
      writeCsv(range.key, rows);
    } catch (e) {
      console.error(`${range.label}: ${e.message || e}`);
      process.exitCode = 1;
    }
  }

  console.log(`\nCSV: docs/meta-ads/reports/`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runReport().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
}
