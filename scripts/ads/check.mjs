/**
 * Meta baglanti testi: jeton kime ait, hangi izinler var, hangi reklam hesaplari gorunuyor.
 * Sadece konsola yazar; hicbir sey dosyaya ya da repoya kaydedilmez (repo herkese acik).
 *
 *   npm run ads:check
 */
import { whoami, listAdAccounts, adInsights } from "./lib/meta.mjs";

const STATUS = { 1: "aktif", 2: "devre disi", 3: "odenmemis", 7: "risk incelemesi", 9: "grace", 100: "kapanis bekliyor", 101: "kapali" };

const ymd = (d) => d.toISOString().slice(0, 10);
const until = new Date();
const since = new Date(until.getTime() - 29 * 864e5);

const me = await whoami();
console.log(`Kullanici : ${me.name} (${me.id})`);
console.log(`Izinler   : ${me.permissions.join(", ")}`);
for (const need of ["ads_read"]) {
  if (!me.permissions.includes(need)) console.warn(`UYARI: ${need} izni yok`);
}

const accounts = await listAdAccounts();
console.log(`\n${accounts.length} reklam hesabi gorunuyor (son 30 gun: ${ymd(since)} - ${ymd(until)}):\n`);

const rows = [];
for (const a of accounts) {
  let spend = 0;
  let impressions = 0;
  let err = "";
  try {
    for (const r of await adInsights(a.id, ymd(since), ymd(until))) {
      spend += Number(r.spend || 0);
      impressions += Number(r.impressions || 0);
    }
  } catch (e) {
    err = e.message;
  }
  rows.push({
    hesap: a.name,
    id: a.id,
    durum: STATUS[a.account_status] || a.account_status,
    para: a.currency,
    "harcama 30g": err ? "HATA" : spend.toFixed(2),
    "gosterim 30g": err ? err.slice(0, 40) : impressions,
  });
}
console.table(rows);
