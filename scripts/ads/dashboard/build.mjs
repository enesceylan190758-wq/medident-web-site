/**
 * Panel (statik prototip): Meta verisini SUNUCU tarafinda ceker, kucultur ve
 * template.html'e gomer (styles.css, demo.js, app.js ve kural motoru ile birlikte).
 * Jeton sayfaya hic girmez; sayfa sadece hazir sayilari tasir.
 * demo.js tamamen kurgusal demo klinikleri uretir; arayuzde "Demo" etiketlidir.
 * Cikti repo disinda/gitignore'da kalir (repo herkese acik, reklam verisi commit edilmez).
 *
 *   npm run ads:dashboard -- --since 2026-01-01 --until 2026-05-31 --out .cache/ads-panel.html
 *   npm run ads:dashboard -- --from-json ham.json ...   # onceden cekilmis {accounts, rows}
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listAdAccounts, adInsights } from "../lib/meta.mjs";
import { results } from "../lib/analyze.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const ymd = (d) => d.toISOString().slice(0, 10);
const until = arg("until", ymd(new Date(Date.now() - 864e5)));
const since = arg("since", ymd(new Date(Date.parse(until) - 89 * 864e5)));
const out = arg("out", ".cache/ads-panel.html");

let accounts, rows;
if (arg("from-json")) {
  ({ accounts, rows } = JSON.parse(readFileSync(arg("from-json"), "utf8")));
} else {
  accounts = await listAdAccounts();
  rows = [];
  // Insights'i ~45 gunluk parcalarla cek: uzun aralik + reklam/gun kirilimi proxy zaman asimina dusuyor
  for (const a of accounts) {
    for (let s = since; s <= until; ) {
      const e = ymd(new Date(Math.min(Date.parse(s) + 44 * 864e5, Date.parse(until))));
      rows.push(...(await adInsights(a.id, s, e)));
      s = ymd(new Date(Date.parse(e) + 864e5));
    }
  }
}

// Kucult: tekrar eden metinleri sozluge al, satirlari diziye cevir
const acc = accounts.map((a) => ({ id: a.id, name: a.name.trim(), currency: a.currency, status: a.account_status }));
const accIdx = new Map(acc.map((a, i) => [a.id.replace("act_", ""), i]));
const camps = [], campIdx = new Map(), ads = [], adIdx = new Map();
const R = [];
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
const data = { generatedAt: new Date().toISOString(), since, until, accounts: acc, campaigns: camps, ads, rows: R };

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
console.log(`${out}: ${acc.length} hesap, ${camps.length} kampanya, ${ads.length} reklam, ${R.length} satir (${(html.length / 1024).toFixed(0)} KB)`);
