/**
 * Reklam analiz kurallari — saf fonksiyonlar, ag erisimi yok.
 *
 * Girdi: adInsights() satirlari (reklam x gun) + adSets() kayitlari.
 * Cikti: bulgular [{ account_id, level, id, name, rule, severity, message, metrics }]
 *
 * Esikler sabit TL tutari degil, her hesabin KENDI donem ortalamasina goredir
 * (baseline). Boylece farkli butceli musteri hesaplari ayar gerektirmeden calisir.
 * Hesap bazli sabit hedef istenirse `targetCpl` ile verilir.
 */

export const DEFAULTS = {
  recentDays: 7, // son pencere
  minSpendFactor: 2, // "sonucsuz harcama": hedef/baseline CPL'in kac kati harcanmis
  highCplFactor: 1.5, // son 7 gun CPL > baseline x 1.5
  winnerCplFactor: 0.7, // son 7 gun CPL < baseline x 0.7 ve en az winnerMinResults sonuc
  winnerMinResults: 3,
  fatigueFrequency: 3, // son 7 gun frekans esigi
  fatigueCtrDrop: 0.3, // onceki 7 gune gore link CTR dususu (%30)
  lowCtr: 0.007, // link CTR < %0.7
  lowCtrMinImpressions: 2000,
  minImpressions: 1000, // daha az gosterimde CTR/CPL kurali calismaz (gurultu)
};

// Lead: Meta ayni form gonderimini birden cok action_type ile sayar (lead,
// onsite_conversion.lead_grouped, offsite_*_add_meta_leads). Cift saymamak icin tek tip.
const LEAD_TYPES = ["onsite_conversion.lead_grouped", "lead"];
const MSG_TYPE = "onsite_conversion.messaging_conversation_started_7d";

// Sonucu form/mesaj olan kampanya amaclari. Digerleri (etkilesim, bilinirlik, trafik)
// CPL kurallarina girmez ve hesap ortalamasini bozmaz.
const RESULT_OBJECTIVES = ["OUTCOME_LEADS", "LEAD_GENERATION", "MESSAGES", "OUTCOME_ENGAGEMENT_MESSAGES"];
export const measuresResults = (row) =>
  RESULT_OBJECTIVES.includes(row.objective) ||
  ["LEAD_GENERATION", "QUALITY_LEAD", "CONVERSATIONS"].includes(row.optimization_goal);

const actionValue = (actions, type) =>
  Number((actions || []).find((a) => a.action_type === type)?.value || 0);

/** Bir insights satirindan sonuc sayilari */
export function results(row) {
  const leadType = LEAD_TYPES.find((t) => (row.actions || []).some((a) => a.action_type === t));
  const leads = leadType ? actionValue(row.actions, leadType) : 0;
  const messages = actionValue(row.actions, MSG_TYPE);
  return { leads, messages, total: leads + messages };
}

function emptyAgg() {
  return { spend: 0, impressions: 0, linkClicks: 0, reachProxy: 0, leads: 0, messages: 0, results: 0, days: 0 };
}

function add(agg, row) {
  const r = results(row);
  agg.spend += Number(row.spend || 0);
  agg.impressions += Number(row.impressions || 0);
  agg.linkClicks += Number(row.inline_link_clicks || 0);
  // gunluk reach toplanamaz; frekans icin impressions / (impressions / frequency) yaklasimi
  const f = Number(row.frequency || 0);
  agg.reachProxy += f > 0 ? Number(row.impressions || 0) / f : 0;
  agg.leads += r.leads;
  agg.messages += r.messages;
  agg.results += r.total;
  agg.days += 1;
  return agg;
}

export function metrics(agg) {
  return {
    spend: round(agg.spend),
    impressions: agg.impressions,
    results: agg.results,
    leads: agg.leads,
    messages: agg.messages,
    cpl: agg.results ? round(agg.spend / agg.results) : null,
    ctr: agg.impressions ? agg.linkClicks / agg.impressions : null,
    // gunluk frekanslarin gosterim agirlikli yaklasimi; gercek tekil erisim degil
    frequency: agg.reachProxy ? round(agg.impressions / agg.reachProxy) : null,
  };
}

const round = (n) => Math.round(n * 100) / 100;
const addDays = (ymd, n) => new Date(Date.parse(ymd) + n * 864e5).toISOString().slice(0, 10);

/**
 * @param {object[]} rows   adInsights satirlari (birden cok hesap olabilir)
 * @param {object}   opts   { until: "YYYY-MM-DD", adSets?: [], targetCpl?: {act_x: 900}, ...DEFAULTS }
 */
export function analyze(rows, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const until = o.until || rows.reduce((m, r) => (r.date_start > m ? r.date_start : m), "");
  const recentFrom = addDays(until, -(o.recentDays - 1));
  const priorFrom = addDays(recentFrom, -o.recentDays);

  const accounts = new Map(); // account_id -> { base, recent, ads: Map }
  for (const row of rows) {
    const acc = `act_${row.account_id}`.replace(/^act_act_/, "act_");
    if (!accounts.has(acc)) {
      accounts.set(acc, { name: row.account_name?.trim(), currency: row.account_currency, base: emptyAgg(), all: emptyAgg(), recent: emptyAgg(), ads: new Map() });
    }
    const A = accounts.get(acc);
    const measured = measuresResults(row);
    if (measured) add(A.base, row); // baseline CPL yalnizca sonuc amacli kampanyalardan
    add(A.all, row);
    if (row.date_start >= recentFrom) add(A.recent, row);

    if (!A.ads.has(row.ad_id)) {
      A.ads.set(row.ad_id, {
        id: row.ad_id,
        name: row.ad_name,
        adset_id: row.adset_id,
        campaign: row.campaign_name,
        objective: row.objective,
        measured,
        recent: emptyAgg(),
        prior: emptyAgg(),
      });
    }
    const ad = A.ads.get(row.ad_id);
    if (row.date_start >= recentFrom) add(ad.recent, row);
    else if (row.date_start >= priorFrom) add(ad.prior, row);
  }

  const findings = [];
  const push = (f) => findings.push(f);

  for (const [account_id, A] of accounts) {
    const base = metrics(A.base);
    const target = o.targetCpl?.[account_id] ?? base.cpl; // hedef yoksa hesabin kendi ortalamasi
    const cur = A.currency;

    for (const ad of A.ads.values()) {
      const r = metrics(ad.recent);
      const p = metrics(ad.prior);
      if (!r.spend) continue;
      const ctx = { account_id, account_name: A.name, currency: cur, level: "ad", id: ad.id, name: ad.name, campaign: ad.campaign, objective: ad.objective, target, metrics: r, prior: p, window: o.recentDays };

      // 1) Sonucsuz harcama (yalnizca sonuc amacli kampanyalar)
      if (ad.measured && r.results === 0 && target && r.spend >= target * o.minSpendFactor) {
        push({ ...ctx, rule: "spend_no_results", severity: "high",
          message: `Son ${o.recentDays} günde ${fmt(r.spend, cur)} harcadı, hiç sonuç yok (hedef sonuç başı maliyet ${fmt(target, cur)}). ` +
            (ad.objective === "MESSAGES"
              ? "Mesaj kampanyası: önce WhatsApp konuşmalarının Meta'ya sayılıp sayılmadığını kontrol et, sonra durdurmayı değerlendir."
              : "Durdurmayı değerlendir.") });
        continue; // CPL kurallari anlamsiz
      }

      // 2) Yuksek CPL / 3) kazanan
      if (ad.measured && r.cpl && target && r.impressions >= o.minImpressions) {
        if (r.cpl > target * o.highCplFactor) {
          push({ ...ctx, rule: "high_cpl", severity: "medium",
            message: `Sonuç başı ${fmt(r.cpl, cur)}, hesap ortalamasının (${fmt(target, cur)}) %${pct(r.cpl / target - 1)} üzerinde.` });
        } else if (r.cpl < target * o.winnerCplFactor && r.results >= o.winnerMinResults) {
          push({ ...ctx, rule: "winner", severity: "info",
            message: `Sonuç başı ${fmt(r.cpl, cur)}, ortalamanın %${pct(1 - r.cpl / target)} altında (${r.results} sonuç). Bütçe artırma adayı.` });
        }
      }

      // 4) Kreatif yorgunlugu
      if (r.frequency >= o.fatigueFrequency && p.ctr && r.ctr != null && r.ctr < p.ctr * (1 - o.fatigueCtrDrop)) {
        push({ ...ctx, rule: "creative_fatigue", severity: "medium",
          message: `Aynı kişi reklamı ortalama ${r.frequency} kez görmüş, link tıklama oranı %${pct(p.ctr, 2)} → %${pct(r.ctr, 2)} düştü. Görseli/videoyu yenile.` });
      } else if (ad.measured && r.impressions >= o.lowCtrMinImpressions && r.ctr != null && r.ctr < o.lowCtr) {
        // 5) Dusuk CTR (bilinirlik/erisim kampanyalarinda dusuk CTR beklenir, atla)
        push({ ...ctx, rule: "low_ctr", severity: "low",
          message: `Link tıklama oranı %${pct(r.ctr, 2)} (${r.impressions} gösterim). Görsel veya hedefleme zayıf.` });
      }
    }

    // 6) Hesapta harcama durdu (son 7 gun 0, onceki donemde harcama var)
    const recentAcc = metrics(A.recent);
    if (!recentAcc.spend && A.all.spend) {
      push({ account_id, account_name: A.name, level: "account", id: account_id, name: A.name, rule: "spend_stopped", severity: "medium", metrics: metrics(A.all),
        message: `Son ${o.recentDays} günde harcama yok. Ödeme yöntemini, hesap durumunu ve kapalı kampanyaları kontrol et.` });
    }
  }

  // 7) Ogrenme sinirli reklam setleri
  for (const s of o.adSets || []) {
    if (s.effective_status !== "ACTIVE") continue;
    if (s.learning_stage_info?.status === "FAIL") {
      push({ account_id: `act_${s.account_id}`, level: "adset", id: s.id, name: s.name, rule: "learning_limited", severity: "low",
        message: "Öğrenme sınırlı: haftada ~50 sonuca ulaşamıyor. Reklam setlerini birleştirmeyi veya hedeflemeyi genişletmeyi değerlendir." });
    }
  }

  const order = { high: 0, medium: 1, low: 2, info: 3 };
  findings.sort((a, b) => order[a.severity] - order[b.severity] || (b.metrics?.spend || 0) - (a.metrics?.spend || 0));
  return {
    window: { recentFrom, until, priorFrom },
    accounts: [...accounts].map(([id, A]) => ({ id, name: A.name, currency: A.currency, baseline: metrics(A.base), total: metrics(A.all), recent: metrics(A.recent) })),
    findings,
  };
}

function fmt(n, currency) {
  return `${Math.round(n).toLocaleString("tr-TR")} ${currency === "TRY" ? "TL" : currency || ""}`.trim();
}
function pct(x, digits = 0) {
  return (x * 100).toFixed(digits);
}
