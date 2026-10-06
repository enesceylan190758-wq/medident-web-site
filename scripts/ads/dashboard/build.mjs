/**
 * Panel (statik prototip): Meta ve Google Ads verisini SUNUCU tarafinda ceker, kucultur ve
 * template.html'e gomer (styles.css, demo.js, app.js ve kural motoru ile birlikte).
 * Jeton sayfaya hic girmez; sayfa sadece hazir sayilari tasir.
 * demo.js tamamen kurgusal demo musterileri uretir; arayuzde "Demo" etiketlidir.
 * Cikti repo disinda/gitignore'da kalir (repo herkese acik, reklam verisi commit edilmez).
 *
 *   npm run ads:dashboard -- --since 2026-01-01 --out .cache/ads-panel.html [--clients scripts/ads/clients.json]
 *   ... --from-json meta.json --google-json google.json   # onceden cekilmis veriyle
 *
 * --clients: hangi reklam hesabinin hangi musteriye ait oldugu (bkz. clients.example.json).
 * Verilmezse her Meta hesabi kendi musterisi olur, Google hesaplari atanmamis kalir.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listAdAccounts, adInsights } from "../lib/meta.mjs";
import { accessibleCustomers, clientAccounts, campaignDaily, searchTerms } from "../lib/google.mjs";
import { results } from "../lib/analyze.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const ymd = (d) => d.toISOString().slice(0, 10);
const until = arg("until", ymd(new Date(Date.now() - 864e5)));
const since = arg("since", ymd(new Date(Date.parse(until) - 179 * 864e5)));
const out = arg("out", ".cache/ads-panel.html");
const chunks = (s, e, n) => {
  const r = [];
  for (let a = s; a <= e; ) {
    const b = ymd(new Date(Math.min(Date.parse(a) + (n - 1) * 864e5, Date.parse(e))));
    r.push([a, b]);
    a = ymd(new Date(Date.parse(b) + 864e5));
  }
  return r;
};

// ---- Meta
let accounts, rows;
if (arg("from-json")) {
  ({ accounts, rows } = JSON.parse(readFileSync(arg("from-json"), "utf8")));
} else {
  accounts = await listAdAccounts();
  rows = [];
  // ~45 gunluk parcalar: uzun aralik + reklam/gun kirilimi proxy zaman asimina dusuyor
  for (const a of accounts) for (const [s, e] of chunks(since, until, 45)) rows.push(...(await adInsights(a.id, s, e)));
}
const acc = accounts.map((a) => ({ id: a.id, name: a.name.trim(), currency: a.currency, status: a.account_status }));
const accIdx = new Map(acc.map((a, i) => [a.id.replace("act_", ""), i]));
const camps = [], campIdx = new Map(), ads = [], adIdx = new Map(), R = [];
for (const r of rows) {
  if (!campIdx.has(r.campaign_id)) {
    campIdx.set(r.campaign_id, camps.length);
    camps.push([r.campaign_id, r.campaign_name, r.objective, r.optimization_goal, accIdx.get(String(r.account_id))]);
  }
  if (!adIdx.has(r.ad_id)) {
    adIdx.set(r.ad_id, ads.length);
    ads.push([r.ad_id, r.ad_name, r.adset_id, campIdx.get(r.campaign_id)]);
  }
  const res = results(r);
  R.push([r.date_start, adIdx.get(r.ad_id), +r.spend, +r.impressions, +(r.frequency || 0), +(r.inline_link_clicks || 0), res.leads, res.messages]);
}

// ---- Google Ads
let g;
if (arg("google-json")) {
  g = JSON.parse(readFileSync(arg("google-json"), "utf8"));
} else {
  g = { customers: [] };
  try {
    const [manager] = await accessibleCustomers();
    g.manager = manager;
    const termsFrom = ymd(new Date(Date.parse(until) - 89 * 864e5));
    for (const c of await clientAccounts(manager)) {
      const crow = [];
      for (const [s, e] of chunks(since, until, 120)) crow.push(...(await campaignDaily(c.id, s, e, manager)));
      g.customers.push({ ...c, rows: crow, terms: await searchTerms(c.id, termsFrom, until, manager) });
    }
  } catch (e) {
    console.warn(`Google Ads atlandi: ${e.message}`);
  }
}
const gCust = g.customers.map((c) => ({ id: c.id, name: c.name, currency: c.currency }));
const gCamps = [], gCampIdx = new Map(), GR = [], GT = [];
g.customers.forEach((c, ci) => {
  for (const r of c.rows) {
    if (!gCampIdx.has(r.campaign_id)) {
      gCampIdx.set(r.campaign_id, gCamps.length);
      gCamps.push([r.campaign_id, r.campaign_name, r.type, r.status, ci]);
    }
    GR.push([r.date, gCampIdx.get(r.campaign_id), r.cost, r.impressions, r.clicks, r.conversions, r.lostBudget]);
  }
  for (const t of c.terms || []) GT.push([ci, t.term, t.cost, t.clicks, t.impressions, t.conversions]);
});

// ---- Musteri eslemesi
const clientsFile = arg("clients", existsSync("scripts/ads/clients.json") ? "scripts/ads/clients.json" : null);
let clients;
if (clientsFile) {
  clients = JSON.parse(readFileSync(clientsFile, "utf8")).clients;
} else {
  clients = acc.map((a) => ({ id: a.id, name: a.name, meta: [a.id], google: [] }));
}
const assignedMeta = new Set(clients.flatMap((c) => c.meta || []));
const assignedG = new Set(clients.flatMap((c) => c.google || []));
const unassigned = {
  meta: acc.filter((a) => !assignedMeta.has(a.id)).map((a) => a.id),
  google: gCust.filter((c) => !assignedG.has(c.id)).map((c) => c.id),
};

const data = {
  generatedAt: new Date().toISOString(), since, until,
  meta: { accounts: acc, campaigns: camps, ads, rows: R },
  google: { customers: gCust, campaigns: gCamps, rows: GR, terms: GT, termsDays: 90 },
  clients, unassigned,
};

// Kural motoru tarayicida da ayni kod: analyze.mjs'i export'suz gom
const engine = readFileSync(join(here, "../lib/analyze.mjs"), "utf8").replace(/^export /gm, "");
const read = (f) => readFileSync(join(here, f), "utf8");
const html = read("template.html")
  .replace("/*__STYLES__*/", () => read("styles.css"))
  .replace("/*__ENGINE__*/", () => engine)
  .replace("/*__DEMO__*/", () => read("demo.js"))
  .replace("/*__APP__*/", () => read("app.js"))
  .replace("/*__DATA__*/null", () => JSON.stringify(data).replace(/</g, "\\u003c"));
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(
  `${out}: ${clients.length} musteri, Meta ${acc.length} hesap / ${R.length} satir, Google ${gCust.length} hesap / ${GR.length} satir (${(html.length / 1024).toFixed(0)} KB)`
);
