/*
 * Demo musteriler — TAMAMEN KURGUSAL. Musteri tanitimi icin; arayuzde her yerde "Demo" etiketiyle gosterilir.
 * Klinik adlari uydurmadir, gercek firma ya da gercek sonuc temsil etmez.
 * Veri deterministik (sabit tohum) uretilir; tarihler veri gununden (range.until) geriye dogru kurulur.
 * Cikti: meta (gercek verinin kucultulmus bicimiyle ayni), google, social, log ve musteri tanimlari.
 */
function buildDemo(range) {
  const DAY = 864e5;
  const addD = (s, n) => new Date(Date.parse(s) + n * DAY).toISOString().slice(0, 10);
  const end = range.until;
  const since = addD(end, -(range.days || 186) + 1);
  const days = [];
  for (let d = since; d <= end; d = addD(d, 1)) days.push(d);

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

  // t = sondan geriye gun (0 = son gun), m = olcum tarihi
  const STORY = {
    steady: () => ({}),
    improve: (t, d, m) => (d < m ? { cpl: 1.4 } : d < addD(m, 7) ? { cpl: 1.1 } : { cpl: 0.85 }),
    winnerLate: (t) => (t < 21 ? { cpl: 0.52 } : {}),
    fatigue: (t) => (t < 7 ? { freq: 3.4 + (7 - t) * 0.08, ctr: 0.52, cpl: 1.35 } : t < 14 ? { freq: 2.6, ctr: 1.05 } : {}),
    dead: (t) => (t < 11 ? { cpl: 1e9 } : { off: true }),
    highcpl: (t) => (t < 8 ? { cpl: 2.1 } : {}),
    pausedEarly: (t) => (t < 40 ? { off: true } : {}),
    seasonal: (t) => (t > 70 && t < 120 ? {} : { off: true }),
    noTracking: () => ({ cpl: 1e9 }), // WhatsApp: harcama var, olculen konusma yok
  };

  const CLINICS = [
    {
      key: "implant", name: "Elbwerk Implantologie", city: "Hamburg", currency: "EUR", seed: 1101, ig: 0.38, an: true, target: 85, measureAgo: 48,
      assumptions: { booking: 0.35, close: 0.4, value: 4200 },
      access: { status: "active", users: 2 },
      measure: { de: "Zielgruppe auf 40–70 Jahre eingegrenzt, Formular von 7 auf 4 Fragen gekürzt", en: "Narrowed audience to ages 40–70, cut the form from 7 to 4 questions", tr: "Hedef kitle 40–70 yaşa daraltıldı, form 7 sorudan 4 soruya indirildi" },
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
      google: [
        { name: "Suche · Zahnimplantate Hamburg", type: "SEARCH", budget: 55, cpc: 3.9, ctr: 0.064, cvr: 0.075, lost: 0.05 },
        { name: "Suche · All-on-4 Festsitzende Zähne", type: "SEARCH", budget: 35, cpc: 4.6, ctr: 0.058, cvr: 0.09, lost: 0.34 },
        { name: "Performance Max · Implantate", type: "PERFORMANCE_MAX", budget: 30, cpc: 1.3, ctr: 0.012, cvr: 0.018, lost: null },
      ],
      terms: [["zahnimplantat hamburg", 0.22, 0.09], ["implantat kosten", 0.16, 0.06], ["all on 4 hamburg", 0.12, 0.11], ["feste zähne an einem tag", 0.09, 0.07], ["zahnimplantat krankenkasse zuschuss", 0.08, 0], ["zahnarzt notdienst hamburg", 0.06, 0], ["implantologie fortbildung", 0.04, 0], ["implantat erfahrungen", 0.05, 0.03]],
      social: { fb: [3100, 0.9], ig: [6400, 3.2], posts: 3.2, topics: ["Ablauf einer Implantation in 60 Sekunden", "Patientenfrage: Wie lange hält ein Implantat?", "Praxisrundgang", "Unser Team stellt sich vor", "All-on-4 einfach erklärt", "Mythen über Implantate", "Tag der offenen Tür"] },
    },
    {
      key: "hair", name: "Turmalin Haarklinik", city: "Zürich", currency: "CHF", seed: 2207, ig: 0.62, target: 140, measureAgo: 60,
      assumptions: { booking: 0.3, close: 0.35, value: 6800 },
      access: { status: "invited", users: 1 },
      measure: { de: "Budget von Bild- auf Videoanzeigen umgeschichtet (60/40 → 25/75)", en: "Shifted budget from image to video ads (60/40 → 25/75)", tr: "Bütçe görsel reklamlardan video reklamlara kaydırıldı (60/40 → 25/75)" },
      campaigns: [
        { name: "FUE · Leadformular · DE-CH", obj: "OUTCOME_LEADS", ads: [
          { name: "Video · Patientengeschichte nach 12 Monaten", budget: 85, cpl: 150, ctr: 0.015, cpm: 14, story: "improve" },
          { name: "Bild · Kostenlose Haaranalyse", budget: 55, cpl: 168, ctr: 0.012, cpm: 13, story: "highcpl" },
        ] },
        { name: "Saphir-FUE · Leadformular · EN", obj: "OUTCOME_LEADS", ads: [
          { name: "Reel · Clinic tour (EN)", budget: 48, cpl: 175, ctr: 0.011, cpm: 12, story: "dead" },
        ] },
        { name: "Beratung · WhatsApp", obj: "MESSAGES", ads: [
          { name: "Bild · Fragen direkt an das Team", budget: 26, cpl: 96, ctr: 0.013, cpm: 11, msgs: true, story: "noTracking" },
        ] },
      ],
      google: [
        { name: "Suche · Haartransplantation Zürich", type: "SEARCH", budget: 70, cpc: 5.8, ctr: 0.052, cvr: 0.05, lost: 0.08 },
        { name: "Suche · FUE Kosten Schweiz", type: "SEARCH", budget: 40, cpc: 6.4, ctr: 0.047, cvr: 0.035, lost: 0.12 },
      ],
      terms: [["haartransplantation zürich", 0.24, 0.07], ["haartransplantation kosten schweiz", 0.18, 0.05], ["fue methode", 0.1, 0.03], ["haartransplantation türkei", 0.12, 0], ["haarausfall shampoo frauen", 0.07, 0], ["haartransplantation vorher nachher", 0.06, 0.01], ["koreanische methode haare", 0.04, 0]],
      social: { fb: [1800, 0.4], ig: [9200, 4.1], posts: 1.4, topics: ["Was passiert am OP-Tag?", "FUE oder DHI – der Unterschied", "Haarwachstum nach 3, 6 und 12 Monaten", "Fragen an unseren Arzt", "Pflege nach der Behandlung"] },
    },
    {
      key: "aesthetic", name: "Atelier Nordlicht Ästhetik", city: "München", currency: "EUR", seed: 3301, ig: 0.72, target: 120, measureAgo: 41,
      assumptions: { booking: 0.4, close: 0.45, value: 3600 },
      access: { status: "active", users: 3 },
      measure: { de: "Kampagne „Lidstraffung“ auf Beratungstermin statt Preisanfrage optimiert", en: "Optimised the eyelid campaign for consultation bookings instead of price requests", tr: "Göz kapağı kampanyası fiyat talebi yerine muayene randevusuna optimize edildi" },
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
      google: [
        { name: "Suche · Lidstraffung München", type: "SEARCH", budget: 38, cpc: 3.2, ctr: 0.071, cvr: 0.06, lost: 0.02 },
        { name: "Suche · Brust-OP Beratung", type: "SEARCH", budget: 45, cpc: 5.1, ctr: 0.041, cvr: 0.02, lost: 0.0 },
      ],
      terms: [["lidstraffung münchen", 0.26, 0.08], ["schlupflider op kosten", 0.17, 0.05], ["brustvergrößerung münchen", 0.15, 0.02], ["lidstraffung krankenkasse", 0.09, 0], ["schönheitsklinik ausbildung", 0.05, 0], ["brustvergrößerung risiken", 0.08, 0.01], ["botox selber spritzen", 0.03, 0]],
      social: { fb: [2400, 0.5], ig: [11800, 2.6], posts: 3.8, topics: ["Lidstraffung: Heilungsverlauf Tag 1 bis 14", "Was ist eine Faltenbehandlung?", "Behind the scenes: Beratungsgespräch", "5 Fragen vor einer Brust-OP", "Unsere Ärztin im Interview", "Sommer-Pflegetipps"] },
    },
    {
      key: "eye", name: "Seeblick Augenlaser", city: "Luzern", currency: "CHF", seed: 4409, ig: 0.42, target: 95, measureAgo: 55,
      assumptions: { booking: 0.45, close: 0.5, value: 4900 },
      access: { status: "none", users: 0 },
      measure: { de: "Eignungstest als Sofort-Formular eingeführt, Landingpage entfernt", en: "Introduced an instant eligibility form and dropped the landing page", tr: "Uygunluk testi anlık form olarak eklendi, açılış sayfası kaldırıldı" },
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
      google: [
        { name: "Suche · Augenlasern Luzern", type: "SEARCH", budget: 48, cpc: 4.2, ctr: 0.068, cvr: 0.08, lost: 0.29 },
        { name: "Suche · SMILE pro Kosten", type: "SEARCH", budget: 32, cpc: 4.9, ctr: 0.055, cvr: 0.06, lost: 0.06 },
        { name: "Performance Max · Augenlaser", type: "PERFORMANCE_MAX", budget: 22, cpc: 1.1, ctr: 0.011, cvr: 0.012, lost: null },
      ],
      terms: [["augenlasern luzern", 0.25, 0.1], ["smile pro kosten", 0.16, 0.07], ["augenlasern erfahrungen", 0.1, 0.03], ["brille online kaufen", 0.07, 0], ["kontaktlinsen günstig", 0.05, 0], ["lasik risiken", 0.07, 0.01], ["augenarzt luzern termin", 0.08, 0.02]],
      social: { fb: [4200, 0.7], ig: [5100, 2.2], posts: 2.6, topics: ["Ablauf SMILE pro in 90 Sekunden", "Bin ich geeignet? 4 Kriterien", "Ein Jahr ohne Brille – Erfahrungsbericht", "Fragen an den Augenarzt", "Sport nach dem Augenlasern"] },
    },
    {
      key: "bakery", name: "İnci Patisserie", contact: "Seda Hanım", city: "Köln", currency: "EUR", seed: 5503, ig: 0.74, target: 15, measureAgo: 35,
      assumptions: { booking: 0.55, close: 0.92, value: 68 },
      access: { status: "active", users: 2 },
      measure: { de: "Bestellformular auf 3 Fragen gekürzt, Video „Torte entsteht“ gestartet", en: "Cut the order form to 3 questions, launched the “cake in the making” video", tr: "Sipariş formu 3 soruya indirildi, “Pasta nasıl yapılır” videosu başlatıldı" },
      campaigns: [
        { name: "Hochzeitstorten · Anfrageformular · Köln", obj: "OUTCOME_LEADS", ads: [
          { name: "Video · Torte entsteht in 30 Sekunden", budget: 22, cpl: 14, ctr: 0.019, cpm: 7, story: "winnerLate" },
          { name: "Karussell · Tortenkatalog 2026", budget: 16, cpl: 19, ctr: 0.015, cpm: 7, story: "fatigue" },
          { name: "Bild · Probiertermin vereinbaren", budget: 12, cpl: 21, ctr: 0.012, cpm: 6, story: "improve" },
        ] },
        { name: "Geburtstagstorten · WhatsApp-Bestellung", obj: "MESSAGES", ads: [
          { name: "Reel · Motivtorten für Kinder", budget: 14, cpl: 8, ctr: 0.021, cpm: 6, msgs: true, story: "steady" },
          { name: "Bild · Bestellung bis 48 h vorher", budget: 8, cpl: 9, ctr: 0.012, cpm: 6, msgs: true, story: "highcpl" },
        ] },
        { name: "Weihnachtsstollen · Vorbestellung", obj: "OUTCOME_LEADS", ads: [
          { name: "Bild · Stollen jetzt vorbestellen", budget: 15, cpl: 11, ctr: 0.014, cpm: 6, story: "seasonal" },
        ] },
        { name: "Reichweite · Café Ehrenfeld", obj: "OUTCOME_AWARENESS", ads: [
          { name: "Reel 15 s · Frühstück am Wochenende", budget: 9, cpl: 0, ctr: 0.006, cpm: 3.5, story: "steady" },
        ] },
      ],
      google: [
        { name: "Suche · Hochzeitstorte Köln", type: "SEARCH", budget: 18, cpc: 1.4, ctr: 0.07, cvr: 0.09, lost: 0.12 },
        { name: "Suche · Torte bestellen Köln", type: "SEARCH", budget: 14, cpc: 1.1, ctr: 0.065, cvr: 0.11, lost: 0.28 },
        { name: "Performance Max · Café & Konditorei", type: "PERFORMANCE_MAX", budget: 10, cpc: 0.6, ctr: 0.015, cvr: 0.03, lost: null },
      ],
      terms: [["hochzeitstorte köln", 0.2, 0.1], ["torte bestellen köln", 0.18, 0.12], ["motivtorte kinder", 0.12, 0.08], ["konditorei in der nähe", 0.1, 0.06], ["café ehrenfeld frühstück", 0.08, 0.04], ["tortenrezept", 0.07, 0], ["kuchen backen kurs", 0.05, 0], ["fondant kaufen", 0.05, 0]],
      social: { fb: [1900, 0.6], ig: [8700, 4.1], posts: 4.5, topics: ["Torte des Tages", "So entsteht eine Hochzeitstorte", "Wochenend-Frühstück", "Saisonkuchen: Zwetschge", "Hinter den Kulissen der Backstube", "Neue Pralinen", "Kundenwunsch: Motivtorte"] },
    },
  ];

  const accounts = [], campaigns = [], ads = [], rows = [], plat = [], log = [], clients = [];
  const gCustomers = [], gCampaigns = [], gRows = [], gTerms = [];
  const social = {};
  CLINICS.forEach((c, ci) => {
    const accIndex = accounts.length;
    const id = `demo_${c.key}`;
    const mDate = addD(end, -c.measureAgo);
    accounts.push({ id, name: c.name, currency: c.currency, status: 1, demo: true });
    const r = rng(c.seed);
    const rp = rng(c.seed + 7); // yayin yeri bolusu ayri rastgele dizi: mevcut demo rakamlari degismesin
    c.campaigns.forEach((cp, k) => {
      const campIndex = campaigns.length;
      const igShare = Math.min(0.8, Math.max(0.2, c.ig + (rp() - 0.5) * 0.24));
      const day = new Map();
      campaigns.push([`${id}_c${k}`, cp.name, cp.obj, cp.obj === "MESSAGES" ? "CONVERSATIONS" : cp.obj === "OUTCOME_LEADS" ? "LEAD_GENERATION" : "REACH", accIndex]);
      cp.ads.forEach((ad, j) => {
        const adIndex = ads.length;
        ads.push([`${id}_c${k}_a${j}`, ad.name, `${id}_c${k}_s0`, campIndex]);
        days.forEach((d, i) => {
          const t = days.length - 1 - i;
          const s = STORY[ad.story](t, d, mDate);
          if (s.off) return;
          const dow = new Date(d + "T00:00:00Z").getUTCDay();
          const wk = dow === 0 || dow === 6 ? 0.82 : 1;
          const acct = d < mDate ? 1.18 : 0.95;
          const spend = +(ad.budget * wk * (0.82 + r() * 0.36)).toFixed(2);
          const imp = Math.round((spend / ad.cpm) * 1000 * (0.9 + r() * 0.2));
          const clicks = Math.round(imp * ad.ctr * (s.ctr || 1) * (0.85 + r() * 0.3));
          const freq = +((s.freq || 1.15 + (1 - t / days.length) * 0.5) * (0.95 + r() * 0.1)).toFixed(2);
          let leads = 0, msgs = 0;
          if (ad.cpl > 0) {
            const n = poisson(spend / (ad.cpl * (s.cpl || 1) * acct), r);
            if (ad.msgs) msgs = n; else leads = n;
          }
          rows.push([d, adIndex, spend, imp, freq, clicks, leads, msgs]);
          const o = day.get(d) || [0, 0, 0];
          o[0] += spend; o[1] += leads; o[2] += msgs; day.set(d, o);
        });
      });
      // Gunluk kampanya toplamini Facebook / Instagram (+ kucuk Audience Network payi) olarak bol
      for (const [d, [spend, leads, msgs]] of day) {
        const other = c.an ? spend * 0.04 : 0;
        const igS = +((spend - other) * Math.min(0.9, Math.max(0.1, igShare - 0.05 + rp() * 0.1))).toFixed(2);
        const split = (n) => { let i = 0; for (let q = 0; q < n; q++) if (rp() < igShare) i++; return [n - i, i]; };
        const [fl, il] = split(leads), [fm, im] = split(msgs);
        plat.push([d, campIndex, "f", +(spend - other - igS).toFixed(2), fl, fm], [d, campIndex, "i", igS, il, im]);
        if (other) plat.push([d, campIndex, "o", +other.toFixed(2), 0, 0]);
      }
    });

    // Google Ads
    const gIndex = gCustomers.length;
    gCustomers.push({ id: `g_${c.key}`, name: c.name, currency: c.currency, demo: true });
    let totalCost = 0;
    c.google.forEach((g, k) => {
      const gi = gCampaigns.length;
      gCampaigns.push([`g_${c.key}_${k}`, g.name, g.type, "ENABLED", gIndex]);
      days.forEach((d, i) => {
        const t = days.length - 1 - i;
        const dow = new Date(d + "T00:00:00Z").getUTCDay();
        const wk = dow === 0 || dow === 6 ? 0.7 : 1.05;
        const cost = +(g.budget * wk * (0.85 + r() * 0.3) * (g.lost && g.lost > 0.2 ? 0.98 : 1)).toFixed(2);
        const clicks = Math.max(0, Math.round((cost / g.cpc) * (0.85 + r() * 0.3)));
        const imp = Math.round(clicks / (g.ctr * (0.85 + r() * 0.3)) || 0);
        const conv = poisson(clicks * g.cvr * (d < mDate ? 0.85 : 1.05) * (t < 30 ? 1.05 : 1), r);
        gRows.push([d, gi, cost, imp, clicks, conv, g.lost == null ? null : +(g.lost * (0.8 + r() * 0.4)).toFixed(3)]);
        if (t < 90) totalCost += cost;
      });
    });
    c.terms.forEach(([term, share, cvr]) => {
      const cost = +(totalCost * share).toFixed(2);
      const clicks = Math.round(cost / 4.2);
      gTerms.push([gIndex, term, cost, clicks, Math.round(clicks / 0.055), Math.round(clicks * cvr)]);
    });

    // Organik: Facebook + Instagram
    const sr = rng(c.seed + 7);
    const fbDaily = [], igDaily = [];
    let fbF = c.social.fb[0], igF = c.social.ig[0];
    days.forEach((d, i) => {
      fbF += c.social.fb[1] * (0.4 + sr() * 1.2);
      igF += c.social.ig[1] * (0.4 + sr() * 1.2) * (i > days.length - 30 && c.key === "hair" ? 0.5 : 1);
      fbDaily.push([d, Math.round(fbF), Math.round(fbF * (0.06 + sr() * 0.06)), Math.round(fbF * (0.002 + sr() * 0.004))]);
      igDaily.push([d, Math.round(igF), Math.round(igF * (0.09 + sr() * 0.08)), Math.round(igF * (0.006 + sr() * 0.008))]);
    });
    const posts = [];
    const FORMATS = ["reel", "image", "carousel"];
    days.forEach((d, i) => {
      const t = days.length - 1 - i;
      const rate = c.key === "hair" && t < 35 ? 0.6 : c.social.posts; // Turmalin: son 5 haftada az paylasim
      if (sr() < rate / 7) {
        const platform = sr() < 0.62 ? "ig" : "fb";
        const format = FORMATS[Math.floor(sr() * 3)];
        const base = platform === "ig" ? igF * 0.18 : fbF * 0.12;
        const boost = format === "reel" ? 1.9 : format === "carousel" ? 1.2 : 0.8;
        const star = c.key === "implant" && t === 9 ? 3.6 : c.key === "eye" && t === 14 ? 3.1 : 1;
        const reach = Math.round(base * boost * star * (0.6 + sr() * 0.8));
        const inter = Math.round(reach * (platform === "ig" ? 0.045 : 0.025) * (star > 1 ? 1.5 : 1) * (0.7 + sr() * 0.6));
        const topic = c.social.topics[Math.floor(sr() * c.social.topics.length)];
        posts.push([d, platform, format, topic, reach, inter]);
      }
    });
    social[id] = { fb: fbDaily, ig: igDaily, posts };

    clients.push({
      id, name: c.name, contact: c.contact || "", city: c.city, sector: c.key, currency: c.currency, demo: true,
      meta: [id], google: [`g_${c.key}`], social: id,
      targets: { [id]: c.target }, assumptions: c.assumptions, access: c.access,
      measure: { ...c.measure, date: mDate },
    });

    // Protokoll
    const at = (d, h) => `${d}T${h}:00Z`;
    const L = (o) => log.push({ client: id, ...o });
    const allAds = c.campaigns.flatMap((cp) => cp.ads);
    const byStory = (st) => (allAds.find((a) => a.story === st) || allAds[0]).name;
    L({ at: at(since, "08:12"), type: "system", kind: "connect" });
    L({ at: at(addD(since, 1), "09:30"), type: "system", kind: "connectGoogle" });
    L({ at: at(addD(since, 1), "06:00"), type: "system", kind: "firstRun", n: 5 + (ci % 3) });
    L({ at: at(addD(mDate, -1), "16:40"), type: "decision", status: "approved", kind: "measure", text: c.measure });
    L({ at: at(addD(mDate, -9), "09:05"), type: "decision", status: "rejected", kind: "pauseRejected", reason: "early", adName: byStory("improve") });
    L({ at: at(addD(end, -24), "11:22"), type: "decision", status: "approved", kind: "budgetUp", pct: 20, adName: byStory("winnerLate") });
    L({ at: at(addD(end, -17), "14:05"), type: "decision", status: "approved", kind: "negKw", term: c.terms.find((x) => x[2] === 0)[0] });
    for (let w = 1; w <= 3; w++) L({ at: at(addD(end, -7 * w + 1), "07:00"), type: "system", kind: "report" });
  });
  return {
    since,
    meta: { accounts, campaigns, ads, rows, plat },
    google: { customers: gCustomers, campaigns: gCampaigns, rows: gRows, terms: gTerms },
    social, log, clients,
  };
}
