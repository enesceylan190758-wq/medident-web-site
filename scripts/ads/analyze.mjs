/**
 * Reklam analizi: hesaplari ceker, kurallari calistirir, bulgulari konsola yazar.
 * Hicbir sey dosyaya ya da repoya yazilmaz (repo herkese acik).
 *
 *   npm run ads:analyze                                  # tum hesaplar, dune kadar son 30 gun
 *   npm run ads:analyze -- --account act_844806619753230 # tek hesap
 *   npm run ads:analyze -- --until 2026-05-31            # gecmis bir donem
 *   npm run ads:analyze -- --json                        # makine okunur cikti (dashboard/Telegram icin)
 *
 * Hedef CPL varsayilan olarak hesabin kendi donem ortalamasidir. Sabit hedef icin:
 *   ADS_TARGET_CPL='{"act_844806619753230": 900}' npm run ads:analyze
 */
import { listAdAccounts, adInsights, adSets, actId } from "./lib/meta.mjs";
import { analyze } from "./lib/analyze.mjs";

const args = process.argv.slice(2);
const arg = (k) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const ymd = (d) => d.toISOString().slice(0, 10);

const until = arg("until") || ymd(new Date(Date.now() - 864e5)); // bugun eksik gun, dahil etme
const days = Number(arg("days") || 30);
const since = ymd(new Date(Date.parse(until) - (days - 1) * 864e5));
const only = arg("account") ? actId(arg("account")) : null;

const accounts = (await listAdAccounts()).filter((a) => !only || a.id === only);
if (!accounts.length) throw new Error(only ? `${only} bu jetonla gorunmuyor.` : "Hic reklam hesabi gorunmuyor.");

const rows = [];
const sets = [];
for (const a of accounts) {
  rows.push(...(await adInsights(a.id, since, until)));
  sets.push(...(await adSets(a.id)));
}

const targetCpl = process.env.ADS_TARGET_CPL ? JSON.parse(process.env.ADS_TARGET_CPL) : undefined;
const report = analyze(rows, { until, adSets: sets, targetCpl });

// Hic satiri olmayan (donemde harcamasi olmayan) hesaplar da raporda gorunsun
for (const a of accounts) {
  if (!report.accounts.some((x) => x.id === a.id)) {
    report.accounts.push({ id: a.id, name: a.name, currency: a.currency, baseline: null, recent: null });
  }
}

if (args.includes("--json")) {
  console.log(JSON.stringify({ since, ...report }, null, 2));
  process.exit(0);
}

const ICON = { high: "[!!]", medium: "[! ]", low: "[ .]", info: "[+ ]" };
console.log(`Donem: ${since} - ${until}  (son pencere: ${report.window.recentFrom} - ${until})\n`);
for (const acc of report.accounts) {
  const b = acc.baseline;
  const t = acc.total;
  console.log(`== ${acc.name} (${acc.id})`);
  if (!t) {
    console.log("   Donemde harcama yok.\n");
    continue;
  }
  console.log(
    `   ${days} gun: ${t.spend} ${acc.currency} toplam harcama; form/mesaj kampanyalari ${b.spend} ${acc.currency}, ` +
      `${b.results} sonuc (${b.leads} form, ${b.messages} mesaj), CPL ${b.cpl ?? "-"}`
  );
  const fs = report.findings.filter((f) => f.account_id === acc.id);
  if (!fs.length) console.log("   Bulgu yok.");
  for (const f of fs) console.log(`   ${ICON[f.severity]} ${f.name}${f.campaign ? `  (kampanya: ${f.campaign})` : ""}\n        ${f.message}`);
  console.log();
}
