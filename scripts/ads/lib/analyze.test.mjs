// Sentetik veriyle kural testleri. Gercek reklam verisi repoya girmez (repo herkese acik).
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, results } from "./analyze.mjs";

const UNTIL = "2026-05-31";
const day = (n) => new Date(Date.parse(UNTIL) - n * 864e5).toISOString().slice(0, 10);

function row(over) {
  return {
    account_id: "111",
    account_name: "Test ",
    account_currency: "TRY",
    objective: "OUTCOME_LEADS",
    campaign_name: "Form",
    adset_id: "s1",
    ad_id: "a1",
    ad_name: "Reklam",
    spend: "100",
    impressions: "1000",
    frequency: "1.2",
    inline_link_clicks: "15",
    actions: [],
    ...over,
  };
}
const leads = (n) => [
  { action_type: "lead", value: String(n) },
  { action_type: "onsite_conversion.lead_grouped", value: String(n) },
  { action_type: "offsite_complete_registration_add_meta_leads", value: String(n) },
];

// Hesap ortalamasi: a1, 30 gunde 3000 TL / 10 lead = 300 TL
function baseline() {
  return Array.from({ length: 30 }, (_, i) =>
    row({ date_start: day(i), actions: i % 3 === 0 ? leads(1) : [] })
  );
}

test("lead ayni gonderim icin birden cok action_type ile gelse de bir kez sayilir", () => {
  assert.deepEqual(results(row({ actions: leads(4) })), { leads: 4, messages: 0, total: 4 });
});

test("sonucsuz harcama: hedef CPL'in 2 katindan fazla harcayip 0 sonuc", () => {
  const rows = [...baseline()];
  for (let i = 0; i < 7; i++) rows.push(row({ ad_id: "bad", ad_name: "Kotu", date_start: day(i), spend: "120" }));
  const { findings } = analyze(rows, { until: UNTIL });
  const f = findings.find((x) => x.id === "bad");
  assert.equal(f?.rule, "spend_no_results");
  assert.equal(f.severity, "high");
  assert.equal(f.account_id, "act_111");
});

test("etkilesim kampanyasi sonucsuz harcama kuralina girmez ve ortalamayi bozmaz", () => {
  const rows = [...baseline()];
  for (let i = 0; i < 7; i++)
    rows.push(row({ ad_id: "eng", objective: "OUTCOME_ENGAGEMENT", date_start: day(i), spend: "1000" }));
  const r = analyze(rows, { until: UNTIL });
  assert.equal(r.findings.find((x) => x.id === "eng"), undefined);
  assert.equal(r.accounts[0].baseline.cpl, 300);
  assert.equal(r.accounts[0].name, "Test");
});

test("kazanan: ortalamanin cok altinda CPL ve en az 3 sonuc", () => {
  const rows = [...baseline()];
  for (let i = 0; i < 7; i++)
    rows.push(row({ ad_id: "win", date_start: day(i), spend: "50", impressions: "500", actions: i < 4 ? leads(1) : [] }));
  const f = analyze(rows, { until: UNTIL }).findings.find((x) => x.id === "win");
  assert.equal(f?.rule, "winner");
});

test("kreatif yorgunlugu: yuksek frekans ve CTR dususu", () => {
  const rows = [...baseline()];
  for (let i = 7; i < 14; i++) rows.push(row({ ad_id: "tired", date_start: day(i), inline_link_clicks: "20", actions: leads(1) }));
  for (let i = 0; i < 7; i++)
    rows.push(row({ ad_id: "tired", date_start: day(i), frequency: "3.5", inline_link_clicks: "8", actions: leads(1) }));
  const f = analyze(rows, { until: UNTIL }).findings.find((x) => x.id === "tired" && x.rule === "creative_fatigue");
  assert.ok(f);
});

test("harcama durdu: son 7 gun 0, oncesinde harcama var", () => {
  const rows = baseline().filter((r) => r.date_start < day(6));
  const f = analyze(rows, { until: UNTIL }).findings.find((x) => x.rule === "spend_stopped");
  assert.equal(f?.level, "account");
});

test("hesaplar birbirine karismaz", () => {
  const rows = [...baseline(), ...baseline().map((r) => ({ ...r, account_id: "222", spend: "1000" }))];
  const r = analyze(rows, { until: UNTIL });
  assert.deepEqual(r.accounts.map((a) => [a.id, a.baseline.cpl]), [["act_111", 300], ["act_222", 3000]]);
});

test("hedef CPL hesap bazli verilebilir", () => {
  const rows = [...baseline()];
  for (let i = 0; i < 7; i++) rows.push(row({ ad_id: "x", date_start: day(i), spend: "30" }));
  const f = analyze(rows, { until: UNTIL, targetCpl: { act_111: 100 } }).findings.find((x) => x.id === "x");
  assert.equal(f?.rule, "spend_no_results");
});
