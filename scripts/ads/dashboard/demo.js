/*
 * Demo hesaplari — TAMAMEN KURGUSAL. Musteri tanitimi icin; arayuzde "Demo" etiketiyle gosterilir.
 * Klinik adlari uydurmadir, gercek firma ya da gercek sonuc temsil etmez.
 * Veri deterministik (sabit tohum) uretilir; her acilista ayni gorunur.
 * Cikti, gercek verinin kucultulmus bicimiyle ayni: accounts / campaigns / ads / rows (+ log, measure).
 */
function buildDemo(range) {
  const DAY = 864e5;
  const addD = (s, n) => new Date(Date.parse(s) + n * DAY).toISOString().slice(0, 10);
  const days = [];
  for (let d = range.since; d <= range.until; d = addD(d, 1)) days.push(d);
  const end = range.until;

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function poisson(lambda, r) {
    if (lambda <= 0) return 0;
    if (lambda > 30) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * (r() + r() + r() - 1.5) * 2));
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= r(); } while (p > L);
    return k - 1;
  }

  // story: zaman icinde reklamin davranisi. t = sondan geriye gun sayisi (0 = son gun)
  const STORY = {
    steady: () => ({}),
    improve: (t, d, m) => (d < m ? { cpl: 1.4 } : d < addD(m, 7) ? { cpl: 1.1 } : { cpl: 0.85 }),
    winnerLate: (t) => (t < 21 ? { cpl: 0.52 } : {}),
    fatigue: (t) => (t < 7 ? { freq: 3.4 + (7 - t) * 0.08, ctr: 0.52, cpl: 1.35 } : t < 14 ? { freq: 2.6, ctr: 1.05 } : {}),
    dead: (t) => (t < 11 ? { cpl: 1e9 } : { off: true }),
    highcpl: (t) => (t < 8 ? { cpl: 2.1 } : {}),
    pausedEarly: (t) => (t < 40 ? { off: true } : {}),
    seasonal: (t, d) => (d >= "2026-03-01" && d <= "2026-04-20" ? {} : { off: true }),
  };

  const CLINICS = [
    {
      key: "implant", name: "Elbwerk Implantologie", city: "Hamburg", currency: "EUR", seed: 1101, target: 85,
      measure: { date: "2026-04-14", de: "Zielgruppe auf 40–70 Jahre eingegrenzt, Formular von 7 auf 4 Fragen gekürzt", en: "Narrowed audience to ages 40–70, cut the form from 7 to 4 questions", tr: "Hedef kitle 40–70 yaşa daraltıldı, form 7 sorudan 4 soruya indirildi" },
      campaigns: [
        { name: "Implantate · Leadformular · DE", obj: "OUTCOME_LEADS", ads: [
          { name: "Video · Ablauf in drei Schritten", budget: 62, cpl: 78, ctr: 0.016, cpm: 11, story: "winnerLate" },
          { name: "Karussell · Häufige Fragen", budget: 48, cpl: 92, ctr: 0.013, cpm: 10, story: "fatigue" },
          { name: "Bild · Beratungstermin vereinbaren", budget: 44, cpl: 96, ctr: 0.011, cpm: 10, story: "improve" },
        ] },
        { name: "All-on-4 · WhatsApp-Beratung", obj: "MESSAGES", ads: [
          { name: "Video · Arzt erklärt All-on-4", budget: 30, cpl: 54, ctr: 0.014, cpm: 9, msgs: true, story: "steady" },
        ] },
        { name: "Reichweite · Hamburg & Umland", obj: "OUTCOME_AWARENESS", ads: [
          { name: "Video 15 s · Praxisrundgang", budget: 18, cpl: 0, ctr: 0.004, cpm: 4.2, story: "steady" },
        ] },
      ],
    },
    {
      key: "hair", name: "Turmalin Haarklinik", city: "Zürich", currency: "CHF", seed: 2207, target: 140,
      measure: { date: "2026-04-02", de: "Budget von Bild- auf Videoanzeigen umgeschichtet (60/40 → 25/75)", en: "Shifted budget from image to video ads (60/40 → 25/75)", tr: "Bütçe görsel reklamlardan video reklamlara kaydırıldı (60/40 → 25/75)" },
      campaigns: [
        { name: "FUE · Leadformular · DE-CH", obj: "OUTCOME_LEADS", ads: [
          { name: "Video · Patientengeschichte nach 12 Monaten", budget: 85, cpl: 150, ctr: 0.015, cpm: 14, story: "improve" },
          { name: "Bild · Kostenlose Haaranalyse", budget: 55, cpl: 168, ctr: 0.012, cpm: 13, story: "highcpl" },
        ] },
        { name: "Saphir-FUE · Leadformular · EN", obj: "OUTCOME_LEADS", ads: [
          { name: "Reel · Clinic tour (EN)", budget: 48, cpl: 175, ctr: 0.011, cpm: 12, story: "dead" },
        ] },
        { name: "Beratung · WhatsApp", obj: "MESSAGES", ads: [
          { name: "Bild · Fragen direkt an das Team", budget: 26, cpl: 96, ctr: 0.013, cpm: 11, msgs: true, story: "steady" },
        ] },
      ],
    },
    {
      key: "aesthetic", name: "Atelier Nordlicht Ästhetik", city: "München", currency: "EUR", seed: 3301, target: 120,
      measure: { date: "2026-04-21", de: "Kampagne „Lidstraffung“ auf Beratungstermin statt Preisanfrage optimiert", en: "Optimised the eyelid campaign for consultation bookings instead of price requests", tr: "Göz kapağı kampanyası fiyat talebi yerine muayene randevusuna optimize edildi" },
      campaigns: [
        { name: "Lidstraffung · Beratungstermin", obj: "OUTCOME_LEADS", ads: [
          { name: "Video · Ärztin beantwortet Fragen", budget: 52, cpl: 118, ctr: 0.014, cpm: 12, story: "improve" },
          { name: "Bild · Ablauf und Heilung", budget: 34, cpl: 128, ctr: 0.012, cpm: 11, story: "steady" },
        ] },
        { name: "Brustchirurgie · Beratungstermin", obj: "OUTCOME_LEADS", ads: [
          { name: "Video · Beratungsgespräch", budget: 70, cpl: 190, ctr: 0.010, cpm: 13, story: "highcpl" },
        ] },
        { name: "Faltenbehandlung · Leadformular", obj: "OUTCOME_LEADS", ads: [
          { name: "Karussell · Behandlungen im Überblick", budget: 40, cpl: 72, ctr: 0.017, cpm: 10, story: "winnerLate" },
        ] },
        { name: "Frühjahr · Infoabend", obj: "OUTCOME_LEADS", ads: [
          { name: "Bild · Anmeldung Infoabend", budget: 28, cpl: 64, ctr: 0.015, cpm: 9, story: "seasonal" },
        ] },
      ],
    },
    {
      key: "eye", name: "Seeblick Augenlaser", city: "Luzern", currency: "CHF", seed: 4409, target: 95,
      measure: { date: "2026-04-08", de: "Eignungstest als Sofort-Formular eingeführt, Landingpage entfernt", en: "Introduced an instant eligibility form and dropped the landing page", tr: "Uygunluk testi anlık form olarak eklendi, açılış sayfası kaldırıldı" },
      campaigns: [
        { name: "SMILE pro · Eignungstest", obj: "OUTCOME_LEADS", ads: [
          { name: "Video · Ein Tag ohne Brille", budget: 75, cpl: 92, ctr: 0.017, cpm: 12, story: "improve" },
          { name: "Bild · In 2 Minuten zum Ergebnis", budget: 42, cpl: 88, ctr: 0.016, cpm: 11, story: "winnerLate" },
        ] },
        { name: "Femto-LASIK · Leadformular", obj: "OUTCOME_LEADS", ads: [
          { name: "Karussell · Fragen zur Behandlung", budget: 46, cpl: 104, ctr: 0.013, cpm: 11, story: "fatigue" },
          { name: "Bild · Winteraktion Beratung", budget: 30, cpl: 120, ctr: 0.011, cpm: 10, story: "pausedEarly" },
        ] },
        { name: "Reichweite · Zentralschweiz", obj: "OUTCOME_AWARENESS", ads: [
          { name: "Video 10 s · Sicht ohne Brille", budget: 16, cpl: 0, ctr: 0.005, cpm: 4.8, story: "steady" },
        ] },
      ],
    },
  ];

  const accounts = [], campaigns = [], ads = [], rows = [], log = [];
  CLINICS.forEach((c, ci) => {
    const accIndex = accounts.length;
    const id = `demo_${c.key}`;
    accounts.push({ id, name: c.name, currency: c.currency, status: 1, demo: true, sector: c.key, city: c.city, target: c.target, measure: c.measure });
    const r = rng(c.seed);
    c.campaigns.forEach((cp, k) => {
      const campIndex = campaigns.length;
      campaigns.push([`${id}_c${k}`, cp.name, cp.obj, cp.obj === "MESSAGES" ? "CONVERSATIONS" : cp.obj === "OUTCOME_LEADS" ? "LEAD_GENERATION" : "REACH", accIndex]);
      cp.ads.forEach((ad, j) => {
        const adIndex = ads.length;
        ads.push([`${id}_c${k}_a${j}`, ad.name, `${id}_c${k}_s0`, campIndex]);
        days.forEach((d, i) => {
          const t = days.length - 1 - i;
          const s = STORY[ad.story](t, d, c.measure.date);
          if (s.off) return;
          const dow = new Date(d + "T00:00:00Z").getUTCDay();
          const wk = dow === 0 || dow === 6 ? 0.82 : 1;
          // hesap duzeyi etki: olcumden once biraz daha pahali
          const acct = d < c.measure.date ? 1.18 : 0.95;
          const spend = +(ad.budget * wk * (0.82 + r() * 0.36)).toFixed(2);
          const imp = Math.round((spend / ad.cpm) * 1000 * (0.9 + r() * 0.2));
          const ctr = ad.ctr * (s.ctr || 1) * (0.85 + r() * 0.3);
          const clicks = Math.round(imp * ctr);
          const freq = +((s.freq || 1.15 + (1 - t / days.length) * 0.5) * (0.95 + r() * 0.1)).toFixed(2);
          let leads = 0, msgs = 0;
          if (ad.cpl > 0) {
            const n = poisson(spend / (ad.cpl * (s.cpl || 1) * acct), r);
            if (ad.msgs) msgs = n; else leads = n;
          }
          rows.push([d, adIndex, spend, imp, freq, clicks, leads, msgs]);
        });
      });
    });

    // Protokoll: kurgusal gecmis kayitlar
    const at = (d, h) => `${d}T${h}:00Z`;
    const L = (o) => log.push({ account: id, ...o });
    L({ at: at(range.since, "08:12"), type: "system", kind: "connect" });
    L({ at: at(addD(range.since, 1), "06:00"), type: "system", kind: "firstRun", n: 5 + (ci % 3) });
    L({ at: at(addD(c.measure.date, -1), "16:40"), type: "decision", status: "approved", kind: "measure", text: c.measure });
    const allAds = c.campaigns.flatMap((cp) => cp.ads);
    const byStory = (st) => (allAds.find((a) => a.story === st) || allAds[0]).name;
    L({ at: at(addD(c.measure.date, -9), "09:05"), type: "decision", status: "rejected", kind: "pauseRejected", reason: "early", adName: byStory("improve") });
    L({ at: at(addD(end, -24), "11:22"), type: "decision", status: "approved", kind: "budgetUp", pct: 20, adName: byStory("winnerLate") });
    for (let w = 1; w <= 3; w++) L({ at: at(addD(end, -7 * w + 3), "07:00"), type: "system", kind: "report" });
  });
  return { accounts, campaigns, ads, rows, log };
}
