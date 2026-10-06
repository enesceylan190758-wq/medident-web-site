(() => {
  "use strict";
  const RAW = window.__ADS_DATA__;
  const DAY = 864e5;
  const addD = (s, n) => new Date(Date.parse(s) + n * DAY).toISOString().slice(0, 10);
  const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);
  const MSG = "onsite_conversion.messaging_conversation_started_7d";

  // ================================================================ storage
  const store = {
    get(k, d) { try { const v = localStorage.getItem("adsPanel3:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("adsPanel3:" + k, JSON.stringify(v)); } catch {} },
  };

  // ================================================================ data
  const DEMO = buildDemo({ until: RAW.until, days: 186 });

  // Meta
  const ACC = [...RAW.meta.accounts.map((a) => ({ ...a, demo: false })), ...DEMO.meta.accounts];
  const nA = RAW.meta.accounts.length, nC = RAW.meta.campaigns.length, nAd = RAW.meta.ads.length;
  const CAMPS = [...RAW.meta.campaigns, ...DEMO.meta.campaigns.map((c) => [c[0], c[1], c[2], c[3], c[4] + nA])];
  const ADS = [...RAW.meta.ads, ...DEMO.meta.ads.map((a) => [a[0], a[1], a[2], a[3] + nC])];
  const MROWS = [...RAW.meta.rows, ...DEMO.meta.rows.map((r) => [r[0], r[1] + nAd, ...r.slice(2)])].map(([date, ai, spend, imp, freq, clicks, leads, msgs]) => {
    const [ad_id, ad_name, adset_id, ci] = ADS[ai];
    const [campaign_id, campaign_name, objective, optimization_goal, acci] = CAMPS[ci];
    const a = ACC[acci];
    const actions = [];
    if (leads) actions.push({ action_type: "lead", value: String(leads) });
    if (msgs) actions.push({ action_type: MSG, value: String(msgs) });
    return {
      date_start: date, account_id: String(a.id).replace("act_", ""), account_name: a.name, account_currency: a.currency, acci,
      campaign_id, campaign_name, objective, optimization_goal, adset_id, ad_id, ad_name,
      spend: String(spend), impressions: String(imp), frequency: String(freq), inline_link_clicks: String(clicks), actions,
      _spend: spend, _imp: imp, _clicks: clicks, _leads: leads, _msgs: msgs, _res: leads + msgs, _cur: a.currency,
      _measured: measuresResults({ objective, optimization_goal }),
    };
  });

  // Google
  const GC = [...RAW.google.customers.map((c) => ({ ...c, demo: false })), ...DEMO.google.customers];
  const nG = RAW.google.customers.length, nGC = RAW.google.campaigns.length;
  const GCAMP = [...RAW.google.campaigns, ...DEMO.google.campaigns.map((c) => [c[0], c[1], c[2], c[3], c[4] + nG])];
  const GROWS = [...RAW.google.rows, ...DEMO.google.rows.map((r) => [r[0], r[1] + nGC, ...r.slice(2)])].map(([date, ci, cost, imp, clicks, conv, lost]) => {
    const [id, name, type, status, gi] = GCAMP[ci];
    return { date, ci, id, name, type, status, gi, cost, imp, clicks, conv, lost, _cur: GC[gi].currency };
  });
  const GTERMS = [...RAW.google.terms, ...DEMO.google.terms.map((t) => [t[0] + nG, ...t.slice(1)])].map(([gi, term, cost, clicks, imp, conv]) => ({ gi, term, cost, clicks, imp, conv, _cur: GC[gi].currency }));

  // Musteriler
  const accIndex = (id) => ACC.findIndex((a) => a.id === id);
  const gIndex = (id) => GC.findIndex((c) => String(c.id) === String(id));
  const CLIENTS = [
    ...RAW.clients.map((c) => {
      const metaIdx = (c.meta || []).map(accIndex).filter((i) => i >= 0);
      return {
        id: c.id, name: c.name, city: c.city || "", sector: c.sector || "dental", demo: false,
        currency: c.currency || ACC[metaIdx[0]]?.currency || "EUR",
        metaIdx, gIdx: (c.google || []).map(gIndex).filter((i) => i >= 0), social: null,
        targets: c.targets || {}, assumptions: c.assumptions || null, access: c.access || { status: "none", users: 0 }, measure: null,
      };
    }),
    ...DEMO.clients.map((c) => ({ ...c, metaIdx: c.meta.map(accIndex), gIdx: c.google.map(gIndex), social: DEMO.social[c.social] })),
  ];
  const clientById = (id) => CLIENTS.find((c) => c.id === id);
  const UNASSIGNED = (RAW.unassigned?.meta || []).map((id) => ACC[accIndex(id)]).filter(Boolean);

  // ================================================================ state
  const VIEWS_CLIENT = ["overview", "plan", "meta", "google", "social", "reports", "log", "settings"];
  const hash = location.hash.slice(1);
  const state = {
    client: store.get("client", null),
    view: store.get("view", "overview"),
    preview: false,
    lang: store.get("lang", "de"),
    cur: store.get("cur", "EUR"),
    win: store.get("win", 30),
    end: store.get("end", RAW.until),
    theme: store.get("theme", null),
    fx: store.get("fx", { EUR: 1, CHF: 0.93, TRY: 52.5 }),
    targets: store.get("targets", {}),
    assumptions: store.get("assumptions", {}),
    decisions: store.get("decisions", {}),
    notify: store.get("notify", { daily: true, weekly: true, telegram: true }),
    planTab: "open", planCh: "all", chart: "req", gChart: "cost",
    sort: { key: "spend", dir: -1 }, search: "", campFilter: "all", logFilter: "all", repWeek: 0,
    menu: false, pop: false, reasonFor: null, ob: null,
  };
  if (state.client && !clientById(state.client)) state.client = null;
  if (!VIEWS_CLIENT.includes(state.view)) state.view = "overview";
  if (hash === "clients") state.client = null;
  if (state.end > RAW.until || state.end < addD(RAW.since, 30)) state.end = RAW.until;
  if (state.theme) document.documentElement.dataset.theme = state.theme;
  const C = () => clientById(state.client);

  // ================================================================ i18n
  const LOC = { de: "de-DE", en: "en-GB", tr: "tr-TR" };
  const T = {
    de: {
      brand_sub: "Werbe-Cockpit für Kliniken", admin: "Agentur-Admin", menu: "Menü",
      nav_clients: "Kunden", nav_overview: "Übersicht", nav_plan: "Maßnahmenplan", nav_meta: "Meta Ads", nav_google: "Google Ads", nav_social: "Facebook & Instagram", nav_reports: "Berichte", nav_log: "Protokoll", nav_settings: "Einstellungen",
      sec_admin: "Agentur", sec_client: "Kunde", sec_portal: "Ihr Portal",
      all_clients: "Alle Kunden", new_client: "Neuer Kunde", demo: "Demo", real: "Echt", days: "{n} T",
      preview_btn: "Kundenansicht", preview_on: "Kundenansicht", preview_text: "So sieht {name} das Portal. Interne Bereiche und andere Kunden sind ausgeblendet.", preview_exit: "Beenden",
      period: "Zeitraum", currency: "Währung", language: "Sprache", theme: "Darstellung",
      cl_intro: "Wählen Sie einen Kunden. Jeder Kunde sieht nur seine eigenen Daten; hier sehen Sie alle.",
      cl_count: "Kunden", cl_open: "Offene Maßnahmen", cl_urgent: "Dringend", cl_access: "Mit Kundenzugang",
      col_client: "Kunde", col_channels: "Kanäle", col_requests: "Anfragen 30 T", col_cpr: "Kosten/Anfrage", col_budget: "Budget 30 T", col_actions: "Maßnahmen", col_access: "Zugang",
      acc_active: "Aktiv · {n} Nutzer", acc_invited: "Eingeladen", acc_none: "Kein Zugang",
      unassigned: "Nicht zugeordnete Werbekonten", unassigned_d: "Diese Konten gehören noch zu keinem Kunden.", assign: "Zuordnen",
      open: "Öffnen",
      ch_meta: "Meta Ads", ch_google: "Google Ads", ch_facebook: "Facebook", ch_instagram: "Instagram", ch_tracking: "Messung", ch_setup: "Einrichtung", ch_all: "Alle",
      connected: "Verbunden", not_connected: "Nicht verbunden", paused_since: "Pausiert seit {d}",
      requests: "Anfragen", cpr: "Kosten pro Anfrage", budget: "Werbebudget", reach_org: "Organische Reichweite",
      spend: "Ausgaben", leads: "Leads", cpl: "Kosten pro Lead", ctr: "Klickrate", freq: "Frequenz", impressions: "Impressionen",
      clicks: "Klicks", cpc: "Kosten pro Klick", conv: "Conversions", cpa: "Kosten/Conversion", cost: "Kosten",
      vs_prev: "ggü. Vorperiode", no_prev: "keine Vorperiode", split: "{m} Meta · {g} Google", spend_day: "Ausgaben pro Tag",
      status_title: "Tagesstatus", happened: "Was ist passiert", means: "Was das bedeutet", decide: "Ihre Entscheidung",
      st_ok: "Im Plan", st_watch: "Beobachten", st_act: "Handlung nötig",
      head_req: "{spend} Werbebudget, {n} Anfragen.", head_better: "Kosten pro Anfrage {pct} unter dem 7-Tage-Schnitt.", head_worse: "Kosten pro Anfrage {pct} über dem 7-Tage-Schnitt.", head_flat: "Kosten pro Anfrage auf dem Niveau der letzten 7 Tage.", head_none: "Ausgaben ohne Anfrage an diesem Tag.", head_nospend: "Keine Werbeausgaben an diesem Tag.",
      avg7: "Ø 7 Tage: {v}",
      mean_trend_good: "In den letzten 7 Tagen kostete eine Anfrage {cpr}, {pct} weniger als in der Woche davor.",
      mean_trend_bad: "In den letzten 7 Tagen kostete eine Anfrage {cpr}, {pct} mehr als in der Woche davor.",
      mean_trend_flat: "Eine Anfrage kostete in den letzten 7 Tagen {cpr}, stabil zur Vorwoche.",
      mean_urgent: "{n} dringende Maßnahmen offen.", mean_urgent_1: "Eine dringende Maßnahme ist offen.",
      mean_meta_paused: "Meta-Anzeigen laufen seit {d} nicht mehr; alle Anfragen kommen aktuell über Google.",
      mean_nodata: "Für diesen Zeitraum liegen keine Werbedaten vor.",
      dec_none: "Heute ist keine Entscheidung offen.", dec_open: "{n} offene Maßnahmen, die wichtigste:", dec_open_1: "Eine offene Maßnahme:",
      approve: "Annehmen", approve_client: "Freigeben", reject: "Ablehnen", see_all: "Alle ansehen", undo: "Rückgängig", mark_done: "Als erledigt markieren",
      chart_req: "Anfragen pro Tag", chart_spend: "Werbebudget pro Tag", per_day: "pro Tag",
      top_actions: "Nächste Schritte", channels: "Kanäle", last_data: "Datenstand {d}",
      ba_title: "Vorher / Nachher", ba_measure: "Seit der Maßnahme am {date}", ba_period: "Vorperiode gegenüber aktueller Periode", before: "Vorher", after: "Nachher", ba_weekly: "Kosten pro Anfrage je Woche", ba_marker: "Maßnahme", ba_none: "Zu wenige Anfragen für einen Vergleich.",
      roi_title: "Wirtschaftlichkeit", roi_est: "Schätzung", roi_req: "Anfragen", roi_book: "Beratungstermine", roi_pat: "Behandlungen", roi_rev: "Umsatz", roi_ratio: "Jeder Werbe-{cur} bringt ca. {x} Umsatz.", roi_assume: "Annahmen: {b} der Anfragen buchen einen Termin, {c} davon starten eine Behandlung, Ø Behandlungswert {v}.", roi_missing: "Legen Sie Termin-Quote, Behandlungs-Quote und Ø Behandlungswert fest, um den Umsatz aus Werbung zu schätzen.", roi_set: "Annahmen festlegen", roi_edit: "Annahmen anpassen",
      plan_intro: "Konkrete nächste Schritte aus allen Kanälen, nach Wirkung sortiert. Nichts wird ohne Freigabe geändert.",
      plan_sum_n: "{n} offene Maßnahmen", plan_sum_save: "mögliche Einsparung ca. {save} pro Woche", plan_sum_more: "ca. {more} zusätzliche Anfragen pro Woche",
      plan_preview: "Vorschau: Entscheidungen werden nur im Protokoll vermerkt, nicht an Meta oder Google gesendet.",
      ps_save: "Einsparung pro Woche", ps_more: "Mehr Anfragen pro Woche",
      tab_open: "Offen", tab_approved: "Angenommen", tab_done: "Erledigt", tab_rejected: "Abgelehnt",
      plan_empty_t: "Alles erledigt", plan_empty_s: "Für diesen Zeitraum gibt es keine offenen Maßnahmen.", plan_empty_d: "Noch keine Maßnahmen in dieser Ansicht.",
      owner_agency: "Agentur", owner_clinic: "Klinik", owner_both: "Klinik + Agentur", effort: "Aufwand", effort_S: "gering", effort_M: "mittel", effort_L: "hoch", steps: "So gehen wir vor",
      reason_q: "Grund (optional):", r_seasonal: "Saisonal geplant", r_early: "Zu früh, weiter beobachten", r_brand: "Markenkampagne, kein Lead-Ziel", r_other: "Anderer Grund", skip: "Ohne Grund", cancel: "Abbrechen",
      toast_ok: "Angenommen und im Protokoll vermerkt.", toast_no: "Abgelehnt und im Protokoll vermerkt.", toast_done: "Als erledigt markiert.", toast_undo: "Entscheidung zurückgesetzt.",
      sev_high: "Dringend", sev_medium: "Wichtig", sev_low: "Hinweis", sev_info: "Chance",
      a_spend_no_results: "Anzeige „{ad}“ pausieren",
      w_spend_no_results: "In den letzten 7 Tagen hat diese Anzeige {spend} ausgegeben und keine Anfrage gebracht – mehr als das Doppelte der Zielkosten pro Lead ({target}).",
      s_spend_no_results: ["Anzeige im Werbeanzeigenmanager pausieren", "Freigewordenes Budget auf die beste Anzeige legen", "In 7 Tagen Kosten pro Lead erneut prüfen"],
      i_save: "Spart ca. {v} pro Woche",
      a_high_cpl: "Kosten bei „{ad}“ senken",
      w_high_cpl: "Ein Lead kostet hier {cpl} – {pct} über dem Ziel von {target}.",
      s_high_cpl: ["Tagesbudget um 25 % reduzieren", "Zielgruppe eingrenzen (Alter, Umkreis)", "Formular auf maximal 4 Fragen kürzen"],
      i_high_cpl: "Auf Zielniveau ca. {v} pro Woche weniger",
      a_creative_fatigue: "Neue Anzeigenvariante für „{ad}“",
      w_creative_fatigue: "Dieselben Personen sehen die Anzeige im Schnitt {freq}-mal. Die Klickrate fiel von {p} auf {r} – typische Werbemüdigkeit.",
      s_creative_fatigue: ["Klinik liefert 2–3 neue Fotos oder ein kurzes Video", "Agentur erstellt 2 Varianten (Video 15 s, Karussell)", "Alte Anzeige nach 5 Tagen pausieren"],
      i_fatigue: "Hält die Kosten pro Lead stabil",
      a_low_ctr: "Text und Bild von „{ad}“ überarbeiten",
      w_low_ctr: "Nur {ctr} der Personen klicken ({imp} Impressionen). Üblich sind ab 0,7 %.",
      s_low_ctr: ["Erste Zeile mit klarem Nutzen formulieren", "Bild mit Gesicht oder Ärztin/Arzt testen"],
      i_low_ctr: "Mehr Klicks bei gleichem Budget",
      a_spend_stopped: "Meta-Auslieferung prüfen",
      w_spend_stopped: "Seit 7 Tagen keine Ausgaben in diesem Konto.",
      s_spend_stopped: ["Zahlungsmethode im Werbekonto prüfen", "Pausierte Kampagnen bewusst reaktivieren oder dokumentieren"],
      i_spend_stopped: "Verhindert einen Ausfall bei den Anfragen",
      a_winner: "Budget für „{ad}“ erhöhen",
      w_winner: "Ein Lead kostet hier {cpl}, {pct} unter dem Ziel ({target}), bei {n} Leads in 7 Tagen.",
      s_winner: ["Tagesbudget um 20 % erhöhen", "Nach 3 Tagen prüfen, dann erneut +20 %", "Gleiche Botschaft als neue Variante testen"],
      i_more: "ca. +{n} Anfragen pro Woche",
      a_shift: "Budget umschichten: von „{from}“ zu „{to}“",
      w_shift: "„{from}“ kostete in 7 Tagen {spendL} bei {resL} Anfragen. „{to}“ bringt eine Anfrage für {cplW}. Gleiches Budget, mehr Anfragen.",
      s_shift: ["{amt} pro Tag bei „{from}“ abziehen", "Den Betrag auf „{to}“ legen", "Nach 7 Tagen Kosten pro Anfrage prüfen"],
      a_wa_tracking: "WhatsApp-Anfragen messbar machen",
      w_wa_tracking: "„{camp}“ hat {spend} ausgegeben, Meta zählt aber keine einzige begonnene Unterhaltung. Ohne Messung kann Meta nicht auf Anfragen optimieren.",
      s_wa_tracking: ["WhatsApp-Business-Konto mit der Facebook-Seite verknüpfen", "Kampagnenziel auf „Unterhaltungen“ umstellen", "Eingehende WhatsApp-Anfragen 2 Wochen lang gegenzählen"],
      i_wa: "Macht Kosten pro Anfrage sichtbar",
      a_meta_paused: "Meta-Werbung wieder starten?",
      w_meta_paused: "Seit {d} laufen keine Meta-Anzeigen. Davor kostete ein Lead bei Meta {cplM}, bei Google aktuell {cpa}.",
      w_meta_paused_nog: "Seit {d} laufen keine Meta-Anzeigen. Davor kostete ein Lead {cplM}.",
      s_meta_paused: ["Entscheiden: reaktivieren oder bewusst pausiert lassen", "Mit der besten früheren Anzeige starten: „{ad}“", "Mit kleinem Tagesbudget beginnen und nach 7 Tagen bewerten"],
      i_meta_paused: "Zweiter Kanal für Anfragen",
      a_g_tracking: "Google-Conversion-Messung prüfen",
      w_g_tracking: "Google Ads hat {cost} ausgegeben, aber keine einzige Conversion gemessen. Wahrscheinlich fehlt das Conversion-Tracking.",
      s_g_tracking: ["Conversion-Aktion für Formular und Anruf anlegen", "Google-Tag auf der Danke-Seite prüfen", "Gebotsstrategie erst danach auf Conversions umstellen"],
      i_g_tracking: "Grundlage für jede weitere Optimierung",
      a_g_no_conv: "Google-Kampagne „{camp}“ prüfen",
      w_g_no_conv: "{cost} Kosten ohne Conversion, während das Konto im Schnitt {cpa} pro Conversion zahlt.",
      s_g_no_conv: ["Suchbegriffe der Kampagne durchsehen", "Gebote senken oder Kampagne pausieren"],
      a_g_budget: "Mehr Budget für „{camp}“",
      w_g_budget: "Die Kampagne verpasst {pct} der Suchanfragen, weil das Tagesbudget aufgebraucht ist – bei günstigen {cpa} pro Conversion.",
      s_g_budget: ["Tagesbudget um 25 % erhöhen", "Nach 7 Tagen Kosten pro Conversion prüfen"],
      a_g_negative: "Ausschließende Keywords hinzufügen",
      w_g_negative: "Diese Suchbegriffe haben in 90 Tagen {cost} gekostet und keine Conversion gebracht.",
      s_g_negative: ["Begriffe als ausschließende Keywords auf Kontoebene eintragen", "Suchbegriff-Bericht ab jetzt alle 2 Wochen prüfen"],
      a_g_low_ctr: "Google-Anzeigentexte für „{camp}“ überarbeiten",
      w_g_low_ctr: "Klickrate nur {ctr} bei {imp} Impressionen. Für Suchkampagnen sind 3 % und mehr üblich.",
      s_g_low_ctr: ["Ort und Behandlung in die Überschrift", "Preisrahmen oder kostenlose Beratung nennen", "Mindestens 2 Anzeigen pro Anzeigengruppe testen"],
      a_social_connect: "Facebook-Seite und Instagram verbinden",
      w_social_connect: "Ohne Zugriff auf Seiten-Statistiken sehen wir Reichweite, Follower und Beiträge nicht.",
      s_social_connect: ["Facebook-Seite im Business Manager für die Agentur freigeben", "Instagram-Konto mit der Seite verknüpfen", "Berechtigungen für Seiten- und Instagram-Statistiken bestätigen"],
      i_social_connect: "Vollständiges Bild aller Kanäle",
      a_post_freq: "Häufiger veröffentlichen",
      w_post_freq: "Nur {n} Beiträge in den letzten 4 Wochen. Das Follower-Wachstum auf Instagram ist um {pct} zurückgegangen.",
      s_post_freq: ["Mindestens 3 Beiträge pro Woche einplanen", "Davon 1 Reel mit Ärztin/Arzt oder Team", "Fragen von Patientinnen und Patienten als Themen nutzen"],
      i_post_freq: "Mehr Reichweite ohne Werbebudget",
      a_boost: "Top-Beitrag als Anzeige bewerben",
      w_boost: "„{topic}“ erreichte {reach} Personen, {x}-mal mehr Interaktionen als ein durchschnittlicher Beitrag.",
      s_boost: ["Beitrag in Meta als Anzeige mit Ziel Leads bewerben", "7 Tage mit kleinem Tagesbudget testen", "Zielgruppe: Umkreis der Klinik, 30–65 Jahre"],
      i_boost: "Günstige Anfragen aus bewährtem Inhalt",
      a_reels: "Mehr Reels statt Einzelbilder",
      w_reels: "Reels erreichen im Schnitt {x}-mal so viele Personen wie Einzelbilder.",
      s_reels: ["Bilder durch kurze Videos (15–30 s) ersetzen", "Untertitel einblenden, viele schauen ohne Ton"],
      f_spend7: "Ausgaben 7 T", f_leads7: "Leads 7 T", f_cpl7: "Kosten/Lead 7 T", f_ctr7: "Klickrate 7 T", f_freq: "Frequenz", f_target: "Ziel {v}", f_prev: "Vorwoche {v}",
      f_cost: "Kosten", f_conv: "Conversions", f_lost: "Verpasst (Budget)", f_posts: "Beiträge 4 Wo.", f_growth: "IG-Wachstum", f_reach: "Reichweite", f_inter: "Interaktionen", f_terms: "Suchbegriffe", f_30: "30 T",
      meta_paused_banner: "Die Meta-Anzeigen dieses Kunden sind seit {d} pausiert.", show_until: "Zeitraum bis {d} anzeigen",
      col_campaign: "Kampagne", col_goal: "Ziel", col_status: "Status", col_trend: "Verlauf", col_type: "Typ", col_term: "Suchbegriff", col_post: "Beitrag", col_platform: "Kanal", col_format: "Format", col_rate: "Interaktionsrate",
      st_all: "Alle", st_active: "Aktiv", st_paused: "Pausiert", camp_search: "Kampagne oder Anzeige suchen", no_camps: "Keine Kampagne mit Ausgaben in diesem Zeitraum.",
      obj_OUTCOME_LEADS: "Leads", obj_LEAD_GENERATION: "Leads", obj_MESSAGES: "WhatsApp", obj_OUTCOME_ENGAGEMENT: "Interaktion", obj_OUTCOME_AWARENESS: "Reichweite", obj_OUTCOME_TRAFFIC: "Traffic", obj_OUTCOME_SALES: "Umsatz", obj_LINK_CLICKS: "Klicks",
      gt_SEARCH: "Suche", gt_PERFORMANCE_MAX: "Performance Max", gt_DISPLAY: "Display", gt_VIDEO: "Video",
      g_terms: "Suchbegriffe (letzte 90 Tage)", g_neg: "Ausschluss-Kandidat", g_none: "Kein Google-Ads-Konto verbunden.", g_campaigns: "Kampagnen",
      s_followers: "Follower", s_reach: "Reichweite", s_inter_rate: "Interaktionsrate", s_posts: "Beiträge", s_top: "Beiträge im Zeitraum", s_none_t: "Facebook und Instagram sind noch nicht verbunden", s_none_s: "Verbinden Sie die Facebook-Seite und das Instagram-Konto, damit hier Reichweite, Follower und die besten Beiträge erscheinen.", s_connect: "Jetzt verbinden",
      fmt_reel: "Reel", fmt_image: "Bild", fmt_carousel: "Karussell", top: "Top",
      rep_title: "Wochenbericht · KW {w}", rep_sent: "Versand jeden Montag 07:00 · E-Mail und Telegram",
      rep_sum: "Diese Woche kamen {n} Anfragen für {spend} Werbebudget, {cpr} pro Anfrage{delta}.", rep_better: " – {pct} günstiger als in der Vorwoche", rep_worse: " – {pct} teurer als in der Vorwoche", rep_none: "Diese Woche gab es keine Werbeausgaben.",
      rep_channels: "Kanäle im Überblick", rep_top: "Nächste Schritte", rep_noact: "Keine offenen Maßnahmen.", rep_daily: "Anfragen pro Tag",
      log_all: "Alle", log_dec: "Entscheidungen", log_sys: "System", log_empty: "Noch keine Einträge.", you: "Sie", system: "System", rules: "Regelwerk", clientUser: "Kunde",
      lg_connect: "Meta-Werbekonto verbunden (nur Lesezugriff)", lg_connectGoogle: "Google-Ads-Konto verbunden", lg_firstRun: "Erste Analyse abgeschlossen · {n} Maßnahmen", lg_report: "Wochenbericht versendet",
      lg_measure: "Maßnahme umgesetzt: {text}", lg_pauseRejected: "Abgelehnt: „{ad}“ pausieren", lg_budgetUp: "Angenommen: Budget für „{ad}“ +{pct} %", lg_negKw: "Umgesetzt: „{term}“ als ausschließendes Keyword",
      lg_sync: "Daten synchronisiert", lg_real_connect: "Meta-Werbekonto über Systembenutzer verbunden (nur Lesen)", lg_real_google: "Google-Ads-Konto über Verwaltungskonto verbunden (nur Lesen)",
      lg_dec_approved: "Angenommen: {title}", lg_dec_rejected: "Abgelehnt: {title}", lg_dec_done: "Erledigt: {title}", lg_reason: "Grund: {r}",
      set_general: "Allgemein", set_general_d: "Sprache, Währung, Kurse und Stichtag gelten für den ganzen Arbeitsbereich.",
      set_fx_d: "Feste Näherungskurse für diese Vorschau. Im Produkt täglich aktualisiert.",
      set_end: "Stichtag",
      set_target: "Zielkosten pro Lead", set_target_d: "Pro Meta-Werbekonto in Kontowährung. Leer = Durchschnitt des Kontos.",
      set_assume: "Annahmen für die Wirtschaftlichkeit", set_assume_d: "Damit der Umsatz aus Werbung geschätzt werden kann.", as_book: "Anfragen mit Beratungstermin", as_close: "Termine mit Behandlung", as_value: "Ø Behandlungswert",
      set_access: "Kundenzugang", set_access_d: "Wer beim Kunden das Portal sieht. Kunden sehen nur ihre eigenen Daten.", invite: "Einladung senden", invite_toast: "Vorschau: Es wurde keine E-Mail versendet.", users_n: "{n} Nutzer aktiv", invited: "Einladung offen", no_access: "Noch kein Zugang",
      set_sources: "Datenquellen", set_sources_d: "Verbundene Konten dieses Kunden.",
      set_notify: "Benachrichtigungen", set_notify_d: "Wie und wann informiert wird.", n_daily: "Tagesstatus per E-Mail, 07:00", n_weekly: "Wochenbericht, montags", n_telegram: "Telegram bei dringenden Maßnahmen",
      set_sec: "Sicherheit", sec_text: "Die Zugriffsschlüssel für Meta und Google liegen ausschließlich auf dem Server. Diese Seite enthält nur aufbereitete Kennzahlen, keinen Schlüssel.",
      connect: "Verbinden", auto: "Auto",
      ob_t: "Neuen Kunden anlegen", ob_steps: ["Kunde", "Kanäle verbinden", "Ziele", "Zugang"], ob_preview: "Vorschau · es wird nichts angelegt oder verbunden",
      ob1_h: "Welche Klinik betreuen Sie?", ob_name: "Name der Klinik", ob_sector: "Fachbereich", ob_city: "Stadt",
      ob2_h: "Kanäle verbinden", ob2_p: "Zugriff über Partnerfreigaben, ohne Passwörter. Zum Start nur Lesezugriff, jederzeit widerrufbar.",
      ob_meta_d: "Werbekonto über Business-Manager-Partnerfreigabe", ob_google_d: "Konto unter Ihrem Verwaltungskonto (MCC)", ob_fb_d: "Seiten-Statistiken", ob_ig_d: "Instagram-Statistiken",
      ob3_h: "Was darf eine Anfrage kosten?", ob3_p: "Damit Maßnahmen an den Zielen der Klinik ausgerichtet werden. Leer lassen für den Durchschnitt.", ob_target: "Zielkosten pro Anfrage",
      ob4_h: "Zugang für die Klinik", ob4_p: "Die Klinik erhält ein eigenes Login und sieht nur ihre Daten.", ob_email: "E-Mail der Ansprechperson",
      ob_done: "Kunde anlegen", ob_done_toast: "Vorschau: Es wurde kein Kunde angelegt.",
      back: "Zurück", next: "Weiter", connecting: "Verbinde …",
      sector_dental: "Zahnmedizin", sector_implant: "Zahnimplantate", sector_hair: "Haartransplantation", sector_aesthetic: "Ästhetische Chirurgie", sector_eye: "Augenlaser",
      demo_strip: "<b>Demo-Kunde:</b> fiktive Klinik mit erfundenen Daten, nur zur Vorführung. Keine echten Kundenergebnisse.",
      real_strip: "<b>Echte Daten</b> aus den verbundenen Werbekonten. Beträge zu Näherungskursen in {cur} umgerechnet.",
      footnote: "Beträge umgerechnet zu Näherungskursen (1 EUR = {chf} CHF = {try} TRY).",
    },
    en: {
      brand_sub: "Ad cockpit for clinics", admin: "Agency admin", menu: "Menu",
      nav_clients: "Clients", nav_overview: "Overview", nav_plan: "Action plan", nav_meta: "Meta Ads", nav_google: "Google Ads", nav_social: "Facebook & Instagram", nav_reports: "Reports", nav_log: "Audit log", nav_settings: "Settings",
      sec_admin: "Agency", sec_client: "Client", sec_portal: "Your portal",
      all_clients: "All clients", new_client: "New client", demo: "Demo", real: "Real", days: "{n}d",
      preview_btn: "Client view", preview_on: "Client view", preview_text: "This is how {name} sees the portal. Internal areas and other clients are hidden.", preview_exit: "Exit",
      period: "Period", currency: "Currency", language: "Language", theme: "Appearance",
      cl_intro: "Choose a client. Each client only sees their own data; you see all of them here.",
      cl_count: "Clients", cl_open: "Open actions", cl_urgent: "Urgent", cl_access: "With client login",
      col_client: "Client", col_channels: "Channels", col_requests: "Enquiries 30d", col_cpr: "Cost/enquiry", col_budget: "Budget 30d", col_actions: "Actions", col_access: "Login",
      acc_active: "Active · {n} users", acc_invited: "Invited", acc_none: "No login",
      unassigned: "Unassigned ad accounts", unassigned_d: "These accounts do not belong to a client yet.", assign: "Assign",
      open: "Open",
      ch_meta: "Meta Ads", ch_google: "Google Ads", ch_facebook: "Facebook", ch_instagram: "Instagram", ch_tracking: "Tracking", ch_setup: "Setup", ch_all: "All",
      connected: "Connected", not_connected: "Not connected", paused_since: "Paused since {d}",
      requests: "Enquiries", cpr: "Cost per enquiry", budget: "Ad budget", reach_org: "Organic reach",
      spend: "Spend", leads: "Leads", cpl: "Cost per lead", ctr: "Click rate", freq: "Frequency", impressions: "Impressions",
      clicks: "Clicks", cpc: "Cost per click", conv: "Conversions", cpa: "Cost/conversion", cost: "Cost",
      vs_prev: "vs previous period", no_prev: "no previous period", split: "{m} Meta · {g} Google", spend_day: "Spend per day",
      status_title: "Daily status", happened: "What happened", means: "What it means", decide: "Your decision",
      st_ok: "On track", st_watch: "Watch", st_act: "Action needed",
      head_req: "{spend} ad budget, {n} enquiries.", head_better: "Cost per enquiry {pct} below the 7-day average.", head_worse: "Cost per enquiry {pct} above the 7-day average.", head_flat: "Cost per enquiry in line with the last 7 days.", head_none: "Spend without an enquiry that day.", head_nospend: "No ad spend that day.",
      avg7: "7-day avg: {v}",
      mean_trend_good: "Over the last 7 days an enquiry cost {cpr}, {pct} less than the week before.",
      mean_trend_bad: "Over the last 7 days an enquiry cost {cpr}, {pct} more than the week before.",
      mean_trend_flat: "An enquiry cost {cpr} over the last 7 days, stable versus the week before.",
      mean_urgent: "{n} urgent actions are open.", mean_urgent_1: "One urgent action is open.",
      mean_meta_paused: "Meta ads have not run since {d}; all enquiries currently come from Google.",
      mean_nodata: "No ad data for this period.",
      dec_none: "No decision is waiting today.", dec_open: "{n} open actions, the most important:", dec_open_1: "One open action:",
      approve: "Approve", approve_client: "Approve", reject: "Reject", see_all: "See all", undo: "Undo", mark_done: "Mark as done",
      chart_req: "Enquiries per day", chart_spend: "Ad budget per day", per_day: "per day",
      top_actions: "Next steps", channels: "Channels", last_data: "Data as of {d}",
      ba_title: "Before / after", ba_measure: "Since the change on {date}", ba_period: "Previous period vs current period", before: "Before", after: "After", ba_weekly: "Cost per enquiry by week", ba_marker: "Change", ba_none: "Too few enquiries to compare.",
      roi_title: "Return", roi_est: "Estimate", roi_req: "Enquiries", roi_book: "Consultations", roi_pat: "Treatments", roi_rev: "Revenue", roi_ratio: "Each {cur} of ad spend brings about {x} in revenue.", roi_assume: "Assumptions: {b} of enquiries book a consultation, {c} of those start treatment, average treatment value {v}.", roi_missing: "Set booking rate, treatment rate and average treatment value to estimate revenue from ads.", roi_set: "Set assumptions", roi_edit: "Edit assumptions",
      plan_intro: "Concrete next steps across all channels, sorted by impact. Nothing changes without approval.",
      plan_sum_n: "{n} open actions", plan_sum_save: "possible saving about {save} per week", plan_sum_more: "about {more} more enquiries per week",
      plan_preview: "Preview: decisions are recorded in the audit log only, not sent to Meta or Google.",
      ps_save: "Saving per week", ps_more: "More enquiries per week",
      tab_open: "Open", tab_approved: "Approved", tab_done: "Done", tab_rejected: "Rejected",
      plan_empty_t: "All done", plan_empty_s: "No open actions for this period.", plan_empty_d: "No actions in this view yet.",
      owner_agency: "Agency", owner_clinic: "Clinic", owner_both: "Clinic + agency", effort: "Effort", effort_S: "low", effort_M: "medium", effort_L: "high", steps: "How we do it",
      reason_q: "Reason (optional):", r_seasonal: "Planned seasonal", r_early: "Too early, keep watching", r_brand: "Brand campaign, no lead goal", r_other: "Other reason", skip: "No reason", cancel: "Cancel",
      toast_ok: "Approved and recorded in the audit log.", toast_no: "Rejected and recorded in the audit log.", toast_done: "Marked as done.", toast_undo: "Decision reset.",
      sev_high: "Urgent", sev_medium: "Important", sev_low: "Note", sev_info: "Opportunity",
      a_spend_no_results: "Pause ad “{ad}”",
      w_spend_no_results: "Over the last 7 days this ad spent {spend} without a single enquiry – more than twice the target cost per lead ({target}).",
      s_spend_no_results: ["Pause the ad in Ads Manager", "Move the freed budget to the best ad", "Check cost per lead again in 7 days"],
      i_save: "Saves about {v} per week",
      a_high_cpl: "Lower cost on “{ad}”",
      w_high_cpl: "A lead costs {cpl} here – {pct} above the target of {target}.",
      s_high_cpl: ["Cut daily budget by 25%", "Narrow the audience (age, radius)", "Shorten the form to 4 questions or fewer"],
      i_high_cpl: "At target level about {v} less per week",
      a_creative_fatigue: "New ad variant for “{ad}”",
      w_creative_fatigue: "The same people see this ad {freq} times on average. Click rate fell from {p} to {r} – typical ad fatigue.",
      s_creative_fatigue: ["Clinic provides 2–3 new photos or a short video", "Agency builds 2 variants (15 s video, carousel)", "Pause the old ad after 5 days"],
      i_fatigue: "Keeps cost per lead stable",
      a_low_ctr: "Rework copy and image of “{ad}”",
      w_low_ctr: "Only {ctr} of people click ({imp} impressions). 0.7% or more is typical.",
      s_low_ctr: ["Lead with a clear benefit in the first line", "Test an image with a face or the doctor"],
      i_low_ctr: "More clicks for the same budget",
      a_spend_stopped: "Check Meta delivery",
      w_spend_stopped: "No spend in this account for 7 days.",
      s_spend_stopped: ["Check the payment method in the ad account", "Reactivate paused campaigns on purpose or document why"],
      i_spend_stopped: "Prevents an enquiry outage",
      a_winner: "Increase budget for “{ad}”",
      w_winner: "A lead costs {cpl} here, {pct} below target ({target}), with {n} leads in 7 days.",
      s_winner: ["Raise daily budget by 20%", "Check after 3 days, then another +20%", "Test the same message as a new variant"],
      i_more: "about +{n} enquiries per week",
      a_shift: "Shift budget from “{from}” to “{to}”",
      w_shift: "“{from}” spent {spendL} in 7 days for {resL} enquiries. “{to}” brings an enquiry for {cplW}. Same budget, more enquiries.",
      s_shift: ["Take {amt} per day from “{from}”", "Add it to “{to}”", "Check cost per enquiry after 7 days"],
      a_wa_tracking: "Make WhatsApp enquiries measurable",
      w_wa_tracking: "“{camp}” spent {spend}, but Meta counts no started conversation. Without measurement Meta cannot optimise for enquiries.",
      s_wa_tracking: ["Connect the WhatsApp Business account to the Facebook page", "Switch the campaign goal to “Conversations”", "Count incoming WhatsApp enquiries manually for 2 weeks"],
      i_wa: "Makes cost per enquiry visible",
      a_meta_paused: "Restart Meta advertising?",
      w_meta_paused: "No Meta ads have run since {d}. Before that a lead cost {cplM} on Meta; on Google it currently costs {cpa}.",
      w_meta_paused_nog: "No Meta ads have run since {d}. Before that a lead cost {cplM}.",
      s_meta_paused: ["Decide: reactivate or keep paused on purpose", "Restart with the best previous ad: “{ad}”", "Start with a small daily budget and review after 7 days"],
      i_meta_paused: "A second channel for enquiries",
      a_g_tracking: "Check Google conversion tracking",
      w_g_tracking: "Google Ads spent {cost} without a single measured conversion. Conversion tracking is most likely missing.",
      s_g_tracking: ["Create conversion actions for form and call", "Check the Google tag on the thank-you page", "Only then switch bidding to conversions"],
      i_g_tracking: "The basis for every further optimisation",
      a_g_no_conv: "Review Google campaign “{camp}”",
      w_g_no_conv: "{cost} spent without a conversion, while the account pays {cpa} per conversion on average.",
      s_g_no_conv: ["Review the campaign's search terms", "Lower bids or pause the campaign"],
      a_g_budget: "More budget for “{camp}”",
      w_g_budget: "The campaign misses {pct} of searches because its daily budget runs out – at a low {cpa} per conversion.",
      s_g_budget: ["Raise daily budget by 25%", "Check cost per conversion after 7 days"],
      a_g_negative: "Add negative keywords",
      w_g_negative: "These search terms cost {cost} in 90 days without a conversion.",
      s_g_negative: ["Add the terms as account-level negative keywords", "Review the search terms report every 2 weeks"],
      a_g_low_ctr: "Rewrite Google ads for “{camp}”",
      w_g_low_ctr: "Click rate only {ctr} at {imp} impressions. Search campaigns typically reach 3% or more.",
      s_g_low_ctr: ["Put location and treatment in the headline", "Mention a price range or free consultation", "Test at least 2 ads per ad group"],
      a_social_connect: "Connect Facebook page and Instagram",
      w_social_connect: "Without access to page insights we cannot see reach, followers or posts.",
      s_social_connect: ["Share the Facebook page with the agency in Business Manager", "Link the Instagram account to the page", "Confirm permissions for page and Instagram insights"],
      i_social_connect: "Complete picture of all channels",
      a_post_freq: "Post more often",
      w_post_freq: "Only {n} posts in the last 4 weeks. Instagram follower growth dropped by {pct}.",
      s_post_freq: ["Plan at least 3 posts per week", "Include 1 reel with the doctor or team", "Use patient questions as topics"],
      i_post_freq: "More reach without ad budget",
      a_boost: "Promote the top post as an ad",
      w_boost: "“{topic}” reached {reach} people, {x} times the interactions of an average post.",
      s_boost: ["Promote the post in Meta with a lead goal", "Test for 7 days with a small daily budget", "Audience: clinic radius, ages 30–65"],
      i_boost: "Cheap enquiries from proven content",
      a_reels: "More reels instead of single images",
      w_reels: "Reels reach {x} times as many people as single images on average.",
      s_reels: ["Replace images with short videos (15–30 s)", "Add captions, many watch without sound"],
      f_spend7: "Spend 7d", f_leads7: "Leads 7d", f_cpl7: "Cost/lead 7d", f_ctr7: "Click rate 7d", f_freq: "Frequency", f_target: "Target {v}", f_prev: "Prev. week {v}",
      f_cost: "Cost", f_conv: "Conversions", f_lost: "Missed (budget)", f_posts: "Posts 4 wks", f_growth: "IG growth", f_reach: "Reach", f_inter: "Interactions", f_terms: "Search terms", f_30: "30d",
      meta_paused_banner: "This client's Meta ads have been paused since {d}.", show_until: "Show period up to {d}",
      col_campaign: "Campaign", col_goal: "Goal", col_status: "Status", col_trend: "Trend", col_type: "Type", col_term: "Search term", col_post: "Post", col_platform: "Channel", col_format: "Format", col_rate: "Engagement rate",
      st_all: "All", st_active: "Active", st_paused: "Paused", camp_search: "Search campaign or ad", no_camps: "No campaign with spend in this period.",
      obj_OUTCOME_LEADS: "Leads", obj_LEAD_GENERATION: "Leads", obj_MESSAGES: "WhatsApp", obj_OUTCOME_ENGAGEMENT: "Engagement", obj_OUTCOME_AWARENESS: "Awareness", obj_OUTCOME_TRAFFIC: "Traffic", obj_OUTCOME_SALES: "Sales", obj_LINK_CLICKS: "Clicks",
      gt_SEARCH: "Search", gt_PERFORMANCE_MAX: "Performance Max", gt_DISPLAY: "Display", gt_VIDEO: "Video",
      g_terms: "Search terms (last 90 days)", g_neg: "Negative candidate", g_none: "No Google Ads account connected.", g_campaigns: "Campaigns",
      s_followers: "Followers", s_reach: "Reach", s_inter_rate: "Engagement rate", s_posts: "Posts", s_top: "Posts in period", s_none_t: "Facebook and Instagram are not connected yet", s_none_s: "Connect the Facebook page and Instagram account to see reach, followers and the best posts here.", s_connect: "Connect now",
      fmt_reel: "Reel", fmt_image: "Image", fmt_carousel: "Carousel", top: "Top",
      rep_title: "Weekly report · W{w}", rep_sent: "Sent every Monday 07:00 · email and Telegram",
      rep_sum: "This week brought {n} enquiries for {spend} ad budget, {cpr} per enquiry{delta}.", rep_better: " – {pct} cheaper than the week before", rep_worse: " – {pct} more expensive than the week before", rep_none: "No ad spend this week.",
      rep_channels: "Channels at a glance", rep_top: "Next steps", rep_noact: "No open actions.", rep_daily: "Enquiries per day",
      log_all: "All", log_dec: "Decisions", log_sys: "System", log_empty: "No entries yet.", you: "You", system: "System", rules: "Rules", clientUser: "Client",
      lg_connect: "Meta ad account connected (read-only)", lg_connectGoogle: "Google Ads account connected", lg_firstRun: "First analysis finished · {n} actions", lg_report: "Weekly report sent",
      lg_measure: "Change implemented: {text}", lg_pauseRejected: "Rejected: pause “{ad}”", lg_budgetUp: "Approved: budget for “{ad}” +{pct}%", lg_negKw: "Done: “{term}” added as negative keyword",
      lg_sync: "Data synced", lg_real_connect: "Meta ad account connected via system user (read-only)", lg_real_google: "Google Ads account connected via manager account (read-only)",
      lg_dec_approved: "Approved: {title}", lg_dec_rejected: "Rejected: {title}", lg_dec_done: "Done: {title}", lg_reason: "Reason: {r}",
      set_general: "General", set_general_d: "Language, currency, rates and reference date apply to the whole workspace.",
      set_fx_d: "Fixed approximate rates for this preview. Updated daily in the product.",
      set_end: "Reference date",
      set_target: "Target cost per lead", set_target_d: "Per Meta ad account in account currency. Empty = account average.",
      set_assume: "Return assumptions", set_assume_d: "Used to estimate revenue from ads.", as_book: "Enquiries that book a consultation", as_close: "Consultations that start treatment", as_value: "Average treatment value",
      set_access: "Client login", set_access_d: "Who at the client sees the portal. Clients only see their own data.", invite: "Send invitation", invite_toast: "Preview: no email was sent.", users_n: "{n} users active", invited: "Invitation pending", no_access: "No login yet",
      set_sources: "Data sources", set_sources_d: "Connected accounts of this client.",
      set_notify: "Notifications", set_notify_d: "How and when to inform.", n_daily: "Daily status by email, 07:00", n_weekly: "Weekly report, Mondays", n_telegram: "Telegram for urgent actions",
      set_sec: "Security", sec_text: "The access keys for Meta and Google are stored on the server only. This page contains prepared figures, never a key.",
      connect: "Connect", auto: "Auto",
      ob_t: "Add new client", ob_steps: ["Client", "Connect channels", "Goals", "Login"], ob_preview: "Preview · nothing is created or connected",
      ob1_h: "Which clinic do you manage?", ob_name: "Clinic name", ob_sector: "Speciality", ob_city: "City",
      ob2_h: "Connect channels", ob2_p: "Access via partner sharing, no passwords. Read-only to start, revocable at any time.",
      ob_meta_d: "Ad account via Business Manager partner sharing", ob_google_d: "Account under your manager account (MCC)", ob_fb_d: "Page insights", ob_ig_d: "Instagram insights",
      ob3_h: "What may an enquiry cost?", ob3_p: "So actions follow the clinic's goals. Leave empty to use the average.", ob_target: "Target cost per enquiry",
      ob4_h: "Login for the clinic", ob4_p: "The clinic gets its own login and only sees its own data.", ob_email: "Contact email",
      ob_done: "Create client", ob_done_toast: "Preview: no client was created.",
      back: "Back", next: "Next", connecting: "Connecting …",
      sector_dental: "Dentistry", sector_implant: "Dental implants", sector_hair: "Hair transplant", sector_aesthetic: "Aesthetic surgery", sector_eye: "Laser eye surgery",
      demo_strip: "<b>Demo client:</b> fictional clinic with invented data, for demonstration only. Not real client results.",
      real_strip: "<b>Real data</b> from the connected ad accounts. Amounts converted to {cur} at approximate rates.",
      footnote: "Amounts converted at approximate rates (1 EUR = {chf} CHF = {try} TRY).",
    },
    tr: {
      brand_sub: "Klinikler için reklam paneli", admin: "Ajans yöneticisi", menu: "Menü",
      nav_clients: "Müşteriler", nav_overview: "Genel bakış", nav_plan: "Aksiyon planı", nav_meta: "Meta reklamları", nav_google: "Google reklamları", nav_social: "Facebook ve Instagram", nav_reports: "Raporlar", nav_log: "Kayıt", nav_settings: "Ayarlar",
      sec_admin: "Ajans", sec_client: "Müşteri", sec_portal: "Portalınız",
      all_clients: "Tüm müşteriler", new_client: "Yeni müşteri", demo: "Demo", real: "Gerçek", days: "{n} gün",
      preview_btn: "Müşteri görünümü", preview_on: "Müşteri görünümü", preview_text: "{name} portalı böyle görüyor. İç bölümler ve diğer müşteriler gizli.", preview_exit: "Çık",
      period: "Dönem", currency: "Para birimi", language: "Dil", theme: "Görünüm",
      cl_intro: "Bir müşteri seç. Her müşteri sadece kendi verisini görür; sen burada hepsini görürsün.",
      cl_count: "Müşteri", cl_open: "Açık aksiyon", cl_urgent: "Acil", cl_access: "Müşteri girişi olan",
      col_client: "Müşteri", col_channels: "Kanallar", col_requests: "Talep 30 g", col_cpr: "Talep başı maliyet", col_budget: "Bütçe 30 g", col_actions: "Aksiyon", col_access: "Giriş",
      acc_active: "Aktif · {n} kullanıcı", acc_invited: "Davet edildi", acc_none: "Giriş yok",
      unassigned: "Atanmamış reklam hesapları", unassigned_d: "Bu hesaplar henüz bir müşteriye bağlı değil.", assign: "Ata",
      open: "Aç",
      ch_meta: "Meta reklamları", ch_google: "Google reklamları", ch_facebook: "Facebook", ch_instagram: "Instagram", ch_tracking: "Ölçüm", ch_setup: "Kurulum", ch_all: "Tümü",
      connected: "Bağlı", not_connected: "Bağlı değil", paused_since: "{d} tarihinden beri durdurulmuş",
      requests: "Talepler", cpr: "Talep başı maliyet", budget: "Reklam bütçesi", reach_org: "Organik erişim",
      spend: "Harcama", leads: "Lead", cpl: "Lead başı maliyet", ctr: "Tıklama oranı", freq: "Frekans", impressions: "Gösterim",
      clicks: "Tıklama", cpc: "Tıklama başı maliyet", conv: "Dönüşüm", cpa: "Dönüşüm başı maliyet", cost: "Maliyet",
      vs_prev: "önceki döneme göre", no_prev: "önceki dönem yok", split: "{m} Meta · {g} Google", spend_day: "Günlük harcama",
      status_title: "Günlük durum", happened: "Ne oldu", means: "Ne anlama geliyor", decide: "Senden beklenen karar",
      st_ok: "Planda", st_watch: "İzle", st_act: "Aksiyon gerekli",
      head_req: "{spend} reklam bütçesi, {n} talep.", head_better: "Talep başı maliyet 7 günlük ortalamanın {pct} altında.", head_worse: "Talep başı maliyet 7 günlük ortalamanın {pct} üzerinde.", head_flat: "Talep başı maliyet son 7 günle aynı seviyede.", head_none: "O gün harcama var, talep yok.", head_nospend: "O gün reklam harcaması yok.",
      avg7: "7 gün ort.: {v}",
      mean_trend_good: "Son 7 günde bir talep {cpr}; önceki haftadan {pct} daha ucuz.",
      mean_trend_bad: "Son 7 günde bir talep {cpr}; önceki haftadan {pct} daha pahalı.",
      mean_trend_flat: "Son 7 günde bir talep {cpr}; önceki haftayla aynı.",
      mean_urgent: "{n} acil aksiyon açık.", mean_urgent_1: "Bir acil aksiyon açık.",
      mean_meta_paused: "Meta reklamları {d} tarihinden beri çalışmıyor; şu an tüm talepler Google'dan geliyor.",
      mean_nodata: "Bu dönem için reklam verisi yok.",
      dec_none: "Bugün bekleyen karar yok.", dec_open: "{n} açık aksiyon, en önemlisi:", dec_open_1: "Bir açık aksiyon:",
      approve: "Onayla", approve_client: "Onayla", reject: "Reddet", see_all: "Tümünü gör", undo: "Geri al", mark_done: "Yapıldı olarak işaretle",
      chart_req: "Günlük talep", chart_spend: "Günlük reklam bütçesi", per_day: "günlük",
      top_actions: "Sıradaki adımlar", channels: "Kanallar", last_data: "Veri tarihi {d}",
      ba_title: "Önce / sonra", ba_measure: "{date} tarihindeki değişiklikten beri", ba_period: "Önceki dönem / bu dönem", before: "Önce", after: "Sonra", ba_weekly: "Haftalık talep başı maliyet", ba_marker: "Değişiklik", ba_none: "Karşılaştırma için yeterli talep yok.",
      roi_title: "Kârlılık", roi_est: "Tahmin", roi_req: "Talep", roi_book: "Muayene randevusu", roi_pat: "Tedavi", roi_rev: "Ciro", roi_ratio: "Reklama harcanan her {cur} yaklaşık {x} ciro getiriyor.", roi_assume: "Varsayımlar: taleplerin {b} kadarı randevu alıyor, bunların {c} kadarı tedaviye başlıyor, ortalama tedavi değeri {v}.", roi_missing: "Reklamdan gelen ciroyu tahmin etmek için randevu oranı, tedavi oranı ve ortalama tedavi değerini gir.", roi_set: "Varsayımları gir", roi_edit: "Varsayımları düzenle",
      plan_intro: "Tüm kanallardan somut sıradaki adımlar, etkisine göre sıralı. Onay olmadan hiçbir şey değişmez.",
      plan_sum_n: "{n} açık aksiyon", plan_sum_save: "haftada yaklaşık {save} tasarruf", plan_sum_more: "haftada yaklaşık {more} ek talep",
      plan_preview: "Önizleme: kararlar sadece kayda işlenir, Meta'ya veya Google'a gönderilmez.",
      ps_save: "Haftalık tasarruf", ps_more: "Haftalık ek talep",
      tab_open: "Açık", tab_approved: "Onaylanan", tab_done: "Yapıldı", tab_rejected: "Reddedilen",
      plan_empty_t: "Hepsi tamam", plan_empty_s: "Bu dönem için açık aksiyon yok.", plan_empty_d: "Bu görünümde henüz aksiyon yok.",
      owner_agency: "Ajans", owner_clinic: "Klinik", owner_both: "Klinik + ajans", effort: "Efor", effort_S: "düşük", effort_M: "orta", effort_L: "yüksek", steps: "Nasıl yapılacak",
      reason_q: "Neden (isteğe bağlı):", r_seasonal: "Sezonluk planlı", r_early: "Erken, izlemeye devam", r_brand: "Marka kampanyası, lead hedefi yok", r_other: "Başka neden", skip: "Nedensiz", cancel: "Vazgeç",
      toast_ok: "Onaylandı ve kayda işlendi.", toast_no: "Reddedildi ve kayda işlendi.", toast_done: "Yapıldı olarak işaretlendi.", toast_undo: "Karar geri alındı.",
      sev_high: "Acil", sev_medium: "Önemli", sev_low: "Not", sev_info: "Fırsat",
      a_spend_no_results: "“{ad}” reklamını durdur",
      w_spend_no_results: "Bu reklam son 7 günde {spend} harcadı ve hiç talep getirmedi; hedef lead maliyetinin ({target}) iki katından fazla.",
      s_spend_no_results: ["Reklamı Reklam Yöneticisi'nde durdur", "Açılan bütçeyi en iyi reklama aktar", "7 gün sonra lead maliyetini tekrar kontrol et"],
      i_save: "Haftada yaklaşık {v} tasarruf",
      a_high_cpl: "“{ad}” maliyetini düşür",
      w_high_cpl: "Burada bir lead {cpl}; {target} hedefinin {pct} üzerinde.",
      s_high_cpl: ["Günlük bütçeyi %25 düşür", "Hedef kitleyi daralt (yaş, mesafe)", "Formu en fazla 4 soruya indir"],
      i_high_cpl: "Hedef seviyede haftada yaklaşık {v} daha az",
      a_creative_fatigue: "“{ad}” için yeni reklam varyantı",
      w_creative_fatigue: "Aynı kişiler reklamı ortalama {freq} kez görmüş. Tıklama oranı {p} → {r} düştü; tipik reklam yorgunluğu.",
      s_creative_fatigue: ["Klinik 2–3 yeni fotoğraf veya kısa video gönderir", "Ajans 2 varyant hazırlar (15 sn video, karusel)", "Eski reklamı 5 gün sonra durdur"],
      i_fatigue: "Lead maliyetini sabit tutar",
      a_low_ctr: "“{ad}” metnini ve görselini yenile",
      w_low_ctr: "Kişilerin yalnızca {ctr} kadarı tıklıyor ({imp} gösterim). Normali %0,7 ve üzeri.",
      s_low_ctr: ["İlk satırda net bir fayda yaz", "Yüz veya doktor içeren görsel dene"],
      i_low_ctr: "Aynı bütçeyle daha çok tıklama",
      a_spend_stopped: "Meta yayınını kontrol et",
      w_spend_stopped: "Bu hesapta 7 gündür harcama yok.",
      s_spend_stopped: ["Reklam hesabındaki ödeme yöntemini kontrol et", "Durdurulan kampanyaları bilinçli olarak aç ya da nedenini not et"],
      i_spend_stopped: "Talep kaybını önler",
      a_winner: "“{ad}” bütçesini artır",
      w_winner: "Burada bir lead {cpl}; hedefin ({target}) {pct} altında, 7 günde {n} lead.",
      s_winner: ["Günlük bütçeyi %20 artır", "3 gün sonra kontrol et, sonra tekrar +%20", "Aynı mesajı yeni bir varyantla test et"],
      i_more: "haftada yaklaşık +{n} talep",
      a_shift: "Bütçeyi “{from}” reklamından “{to}” reklamına kaydır",
      w_shift: "“{from}” 7 günde {spendL} harcadı, {resL} talep getirdi. “{to}” bir talebi {cplW} maliyetle getiriyor. Aynı bütçe, daha çok talep.",
      s_shift: ["“{from}” reklamından günde {amt} çek", "Bu tutarı “{to}” reklamına ekle", "7 gün sonra talep başı maliyeti kontrol et"],
      a_wa_tracking: "WhatsApp taleplerini ölçülebilir yap",
      w_wa_tracking: "“{camp}” {spend} harcadı ama Meta tek bir başlatılmış konuşma saymıyor. Ölçüm olmadan Meta talebe göre optimize edemez.",
      s_wa_tracking: ["WhatsApp Business hesabını Facebook sayfasına bağla", "Kampanya hedefini “Konuşmalar” yap", "Gelen WhatsApp taleplerini 2 hafta elle say"],
      i_wa: "Talep başı maliyeti görünür kılar",
      a_meta_paused: "Meta reklamları yeniden başlatılsın mı?",
      w_meta_paused: "{d} tarihinden beri Meta reklamı yok. Öncesinde Meta'da bir lead {cplM}; Google'da şu an {cpa}.",
      w_meta_paused_nog: "{d} tarihinden beri Meta reklamı yok. Öncesinde bir lead {cplM}.",
      s_meta_paused: ["Karar ver: yeniden başlat ya da bilinçli olarak kapalı tut", "Önceki en iyi reklamla başla: “{ad}”", "Küçük günlük bütçeyle başla, 7 gün sonra değerlendir"],
      i_meta_paused: "Talepler için ikinci kanal",
      a_g_tracking: "Google dönüşüm ölçümünü kontrol et",
      w_g_tracking: "Google Ads {cost} harcadı ama tek bir dönüşüm ölçmedi. Büyük ihtimalle dönüşüm takibi eksik.",
      s_g_tracking: ["Form ve arama için dönüşüm işlemleri oluştur", "Teşekkür sayfasındaki Google etiketini kontrol et", "Teklif stratejisini ancak bundan sonra dönüşüme çevir"],
      i_g_tracking: "Her optimizasyonun temeli",
      a_g_no_conv: "“{camp}” Google kampanyasını gözden geçir",
      w_g_no_conv: "{cost} harcama, hiç dönüşüm yok; hesap ortalaması dönüşüm başına {cpa}.",
      s_g_no_conv: ["Kampanyanın arama terimlerini incele", "Teklifleri düşür veya kampanyayı durdur"],
      a_g_budget: "“{camp}” için daha fazla bütçe",
      w_g_budget: "Günlük bütçe bittiği için kampanya aramaların {pct} kadarını kaçırıyor; dönüşüm başı maliyet ise düşük: {cpa}.",
      s_g_budget: ["Günlük bütçeyi %25 artır", "7 gün sonra dönüşüm başı maliyeti kontrol et"],
      a_g_negative: "Hariç tutulacak anahtar kelimeler ekle",
      w_g_negative: "Bu arama terimleri 90 günde {cost} harcadı ve hiç dönüşüm getirmedi.",
      s_g_negative: ["Terimleri hesap düzeyinde hariç tutulan anahtar kelime olarak ekle", "Arama terimleri raporunu 2 haftada bir incele"],
      a_g_low_ctr: "“{camp}” Google reklam metinlerini yenile",
      w_g_low_ctr: "{imp} gösterimde tıklama oranı sadece {ctr}. Arama kampanyalarında %3 ve üzeri normal.",
      s_g_low_ctr: ["Başlığa şehir ve tedaviyi yaz", "Fiyat aralığı veya ücretsiz muayene belirt", "Her reklam grubunda en az 2 reklam test et"],
      a_social_connect: "Facebook sayfasını ve Instagram'ı bağla",
      w_social_connect: "Sayfa istatistiklerine erişim olmadan erişim, takipçi ve gönderileri göremiyoruz.",
      s_social_connect: ["Facebook sayfasını Business Manager'da ajansla paylaş", "Instagram hesabını sayfaya bağla", "Sayfa ve Instagram istatistik izinlerini onayla"],
      i_social_connect: "Tüm kanalların eksiksiz görünümü",
      a_post_freq: "Daha sık paylaşım yap",
      w_post_freq: "Son 4 haftada sadece {n} gönderi. Instagram takipçi artışı {pct} düştü.",
      s_post_freq: ["Haftada en az 3 gönderi planla", "Bunlardan 1'i doktor veya ekiple Reel olsun", "Hasta sorularını konu olarak kullan"],
      i_post_freq: "Reklam bütçesi olmadan daha çok erişim",
      a_boost: "En iyi gönderiyi reklam olarak öne çıkar",
      w_boost: "“{topic}” {reach} kişiye ulaştı; ortalama bir gönderiden {x} kat fazla etkileşim aldı.",
      s_boost: ["Gönderiyi Meta'da lead hedefiyle reklam yap", "7 gün küçük günlük bütçeyle test et", "Hedef: klinik çevresi, 30–65 yaş"],
      i_boost: "Kanıtlanmış içerikten ucuz talep",
      a_reels: "Tekli görsel yerine daha çok Reel",
      w_reels: "Reel'ler ortalamada tekli görsellerin {x} katı kişiye ulaşıyor.",
      s_reels: ["Görselleri kısa videolarla (15–30 sn) değiştir", "Altyazı ekle, çoğu kişi sesi kapalı izliyor"],
      f_spend7: "Harcama 7 g", f_leads7: "Lead 7 g", f_cpl7: "Lead başı 7 g", f_ctr7: "Tıklama 7 g", f_freq: "Frekans", f_target: "Hedef {v}", f_prev: "Önceki hafta {v}",
      f_cost: "Maliyet", f_conv: "Dönüşüm", f_lost: "Kaçırılan (bütçe)", f_posts: "Gönderi 4 hf", f_growth: "IG artışı", f_reach: "Erişim", f_inter: "Etkileşim", f_terms: "Arama terimleri", f_30: "30 g",
      meta_paused_banner: "Bu müşterinin Meta reklamları {d} tarihinden beri durdurulmuş.", show_until: "{d} tarihine kadar göster",
      col_campaign: "Kampanya", col_goal: "Amaç", col_status: "Durum", col_trend: "Seyir", col_type: "Tür", col_term: "Arama terimi", col_post: "Gönderi", col_platform: "Kanal", col_format: "Biçim", col_rate: "Etkileşim oranı",
      st_all: "Tümü", st_active: "Aktif", st_paused: "Durduruldu", camp_search: "Kampanya veya reklam ara", no_camps: "Bu dönemde harcama yapan kampanya yok.",
      obj_OUTCOME_LEADS: "Lead", obj_LEAD_GENERATION: "Lead", obj_MESSAGES: "WhatsApp", obj_OUTCOME_ENGAGEMENT: "Etkileşim", obj_OUTCOME_AWARENESS: "Bilinirlik", obj_OUTCOME_TRAFFIC: "Trafik", obj_OUTCOME_SALES: "Satış", obj_LINK_CLICKS: "Tıklama",
      gt_SEARCH: "Arama", gt_PERFORMANCE_MAX: "Performance Max", gt_DISPLAY: "Görüntülü", gt_VIDEO: "Video",
      g_terms: "Arama terimleri (son 90 gün)", g_neg: "Hariç tutma adayı", g_none: "Bağlı Google Ads hesabı yok.", g_campaigns: "Kampanyalar",
      s_followers: "Takipçi", s_reach: "Erişim", s_inter_rate: "Etkileşim oranı", s_posts: "Gönderi", s_top: "Dönemdeki gönderiler", s_none_t: "Facebook ve Instagram henüz bağlı değil", s_none_s: "Erişim, takipçi ve en iyi gönderileri burada görmek için Facebook sayfasını ve Instagram hesabını bağla.", s_connect: "Şimdi bağla",
      fmt_reel: "Reel", fmt_image: "Görsel", fmt_carousel: "Karusel", top: "En iyi",
      rep_title: "Haftalık rapor · {w}. hafta", rep_sent: "Her pazartesi 07:00 · e-posta ve Telegram",
      rep_sum: "Bu hafta {spend} reklam bütçesiyle {n} talep geldi, talep başı {cpr}{delta}.", rep_better: "; önceki haftadan {pct} daha ucuz", rep_worse: "; önceki haftadan {pct} daha pahalı", rep_none: "Bu hafta reklam harcaması yok.",
      rep_channels: "Kanallara genel bakış", rep_top: "Sıradaki adımlar", rep_noact: "Açık aksiyon yok.", rep_daily: "Günlük talep",
      log_all: "Tümü", log_dec: "Kararlar", log_sys: "Sistem", log_empty: "Henüz kayıt yok.", you: "Sen", system: "Sistem", rules: "Kurallar", clientUser: "Müşteri",
      lg_connect: "Meta reklam hesabı bağlandı (sadece okuma)", lg_connectGoogle: "Google Ads hesabı bağlandı", lg_firstRun: "İlk analiz tamamlandı · {n} aksiyon", lg_report: "Haftalık rapor gönderildi",
      lg_measure: "Değişiklik uygulandı: {text}", lg_pauseRejected: "Reddedildi: “{ad}” durdurulsun", lg_budgetUp: "Onaylandı: “{ad}” bütçesi +%{pct}", lg_negKw: "Yapıldı: “{term}” hariç tutulan anahtar kelime olarak eklendi",
      lg_sync: "Veri senkronize edildi", lg_real_connect: "Meta reklam hesabı sistem kullanıcısıyla bağlandı (sadece okuma)", lg_real_google: "Google Ads hesabı yönetici hesap üzerinden bağlandı (sadece okuma)",
      lg_dec_approved: "Onaylandı: {title}", lg_dec_rejected: "Reddedildi: {title}", lg_dec_done: "Yapıldı: {title}", lg_reason: "Neden: {r}",
      set_general: "Genel", set_general_d: "Dil, para birimi, kurlar ve referans tarih tüm çalışma alanı için geçerli.",
      set_fx_d: "Bu önizleme için sabit yaklaşık kurlar. Üründe günlük güncellenir.",
      set_end: "Referans tarih",
      set_target: "Hedef lead başı maliyet", set_target_d: "Her Meta reklam hesabı için hesap para biriminde. Boş = hesap ortalaması.",
      set_assume: "Kârlılık varsayımları", set_assume_d: "Reklamdan gelen ciroyu tahmin etmek için.", as_book: "Randevu alan talepler", as_close: "Tedaviye başlayan randevular", as_value: "Ortalama tedavi değeri",
      set_access: "Müşteri girişi", set_access_d: "Müşteri tarafında portalı kim görüyor. Müşteriler sadece kendi verisini görür.", invite: "Davet gönder", invite_toast: "Önizleme: e-posta gönderilmedi.", users_n: "{n} aktif kullanıcı", invited: "Davet bekliyor", no_access: "Henüz giriş yok",
      set_sources: "Veri kaynakları", set_sources_d: "Bu müşterinin bağlı hesapları.",
      set_notify: "Bildirimler", set_notify_d: "Ne zaman ve nasıl haber verileceği.", n_daily: "Günlük durum e-postası, 07:00", n_weekly: "Haftalık rapor, pazartesi", n_telegram: "Acil aksiyonlarda Telegram",
      set_sec: "Güvenlik", sec_text: "Meta ve Google erişim anahtarları yalnızca sunucuda durur. Bu sayfada sadece hazır rakamlar var, anahtar yok.",
      connect: "Bağla", auto: "Otomatik",
      ob_t: "Yeni müşteri ekle", ob_steps: ["Müşteri", "Kanalları bağla", "Hedefler", "Giriş"], ob_preview: "Önizleme · hiçbir şey oluşturulmaz veya bağlanmaz",
      ob1_h: "Hangi kliniği yönetiyorsun?", ob_name: "Klinik adı", ob_sector: "Uzmanlık", ob_city: "Şehir",
      ob2_h: "Kanalları bağla", ob2_p: "Şifresiz, iş ortağı paylaşımıyla erişim. Başlangıçta sadece okuma, istendiğinde geri alınabilir.",
      ob_meta_d: "Business Manager iş ortağı paylaşımıyla reklam hesabı", ob_google_d: "Yönetici hesabın (MCC) altındaki hesap", ob_fb_d: "Sayfa istatistikleri", ob_ig_d: "Instagram istatistikleri",
      ob3_h: "Bir talep en fazla kaça mal olmalı?", ob3_p: "Aksiyonlar kliniğin hedeflerine göre çalışsın diye. Ortalama için boş bırak.", ob_target: "Hedef talep başı maliyet",
      ob4_h: "Klinik için giriş", ob4_p: "Klinik kendi girişini alır ve sadece kendi verisini görür.", ob_email: "İletişim kişisinin e-postası",
      ob_done: "Müşteriyi oluştur", ob_done_toast: "Önizleme: müşteri oluşturulmadı.",
      back: "Geri", next: "İleri", connecting: "Bağlanıyor …",
      sector_dental: "Diş hekimliği", sector_implant: "Diş implantı", sector_hair: "Saç ekimi", sector_aesthetic: "Estetik cerrahi", sector_eye: "Göz lazeri",
      demo_strip: "<b>Demo müşteri:</b> uydurma verili kurgusal klinik, sadece tanıtım için. Gerçek müşteri sonucu değildir.",
      real_strip: "<b>Gerçek veri:</b> bağlı reklam hesaplarından. Tutarlar yaklaşık kurla {cur}'ya çevrildi.",
      footnote: "Tutarlar yaklaşık kurlarla çevrildi (1 EUR = {chf} CHF = {try} TRY).",
    },
  };
  const t = (k, v = {}) => {
    const s = T[state.lang]?.[k] ?? T.de[k] ?? k;
    return typeof s === "string" ? s.replace(/\{(\w+)\}/g, (_, x) => (v[x] ?? "")) : s;
  };
  const tAll = (k, v) => Object.fromEntries(["de", "en", "tr"].map((l) => { const keep = state.lang; state.lang = l; const r = t(k, v); state.lang = keep; return [l, r]; }));

  // ================================================================ format
  const loc = () => LOC[state.lang];
  const conv = (amount, from) => (amount / (state.fx[from] || 1)) * (state.fx[state.cur] || 1);
  const money = (v, opt = {}) => v == null || !isFinite(v) ? "–" : new Intl.NumberFormat(loc(), { style: "currency", currency: state.cur, maximumFractionDigits: opt.dec ?? (Math.abs(v) < 100 ? 2 : 0), minimumFractionDigits: 0 }).format(v);
  const num = (v, d = 0) => v == null || !isFinite(v) ? "–" : new Intl.NumberFormat(loc(), { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const compact = (v) => v == null || !isFinite(v) ? "–" : new Intl.NumberFormat(loc(), { notation: "compact", maximumFractionDigits: 1 }).format(v);
  const pct = (v, d = 1) => v == null || !isFinite(v) ? "–" : new Intl.NumberFormat(loc(), { style: "percent", maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const pct0 = (v) => pct(Math.abs(v), 0);
  const dfmt = (s, o = { day: "numeric", month: "short" }) => new Date(s + "T00:00:00Z").toLocaleDateString(loc(), { ...o, timeZone: "UTC" });
  const dlong = (s) => dfmt(s, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const dmed = (s) => dfmt(s, { day: "numeric", month: "long", year: "numeric" });
  const dtime = (iso) => new Date(iso).toLocaleString(loc(), { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const isoWeek = (s) => {
    const d = new Date(s + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7) + 3);
    const first = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
    return 1 + Math.round(((d - first) / DAY - 3 + ((first.getUTCDay() + 6) % 7)) / 7);
  };
  const short = (s, n = 38) => (s && s.length > n ? s.slice(0, n - 1) + "…" : s || "");

  // ================================================================ icons
  const I = {
    logo: '<path d="M4 17 9.5 9l4 5 2.5-3L20 17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    clients: '<rect x="3.5" y="4" width="17" height="16" rx="3"/><path d="M3.5 9.5h17M9 9.5V20"/>',
    overview: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="4.5" rx="1.6"/><rect x="13.5" y="11" width="7" height="9.5" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/>',
    plan: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><path d="m3.5 6.5 1.2 1.2L7 5.4M3.5 12l1.2 1.2L7 10.9"/><circle cx="5" cy="17.5" r="1.2"/>',
    meta: '<path d="M4 15.5c0-4 2-8 4.2-8 3 0 4.3 9 7.6 9 1.8 0 2.7-2 2.7-4.3 0-3.2-1.6-4.7-3-4.7-2.6 0-4.3 4.8-6.5 8-1.1 1.5-2 2-2.8 2C4.7 17.5 4 16.7 4 15.5Z"/>',
    google: '<path d="M20 12.2c0-.6 0-1.1-.2-1.7H12v3.2h4.5a4.6 4.6 0 1 1-1.3-5.3l2.3-2.3A8 8 0 1 0 20 12.2Z"/>',
    social: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.6" cy="7.4" r=".6" fill="currentColor"/>',
    reports: '<path d="M7 3.5h7l4.5 4.5v12a.5.5 0 0 1-.5.5H7a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M13.5 3.5V8h5M9 13h6M9 16.5h4"/>',
    log: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    settings: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    plug: '<path d="M9 3.5v4M15 3.5v4M7 7.5h10v3.5a5 5 0 0 1-10 0V7.5ZM12 16v4.5"/>',
    chev: '<path d="m7 10 5 5 5-5"/>', check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z"/>',
    auto: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" fill="currentColor" stroke="none"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z"/>', lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    sync: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1L20 9.5M19.5 12a7.5 7.5 0 0 1-13 5.1L4 14.5M20 4.5v5h-5M4 19.5v-5h5"/>',
    send: '<path d="M20.5 3.5 10 14M20.5 3.5l-6.5 17-4-6.5-6.5-4 17-6.5Z"/>', undo: '<path d="M9 7 4.5 11.5 9 16"/><path d="M5 11.5h9.5a5 5 0 0 1 0 10H12"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5a7 7 0 0 1 14 0"/>',
    fb: '<path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5Z"/>',
    ig: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.6" cy="7.4" r=".6" fill="currentColor"/>',
    tracking: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    setup: '<path d="M9 3.5v4M15 3.5v4M7 7.5h10v3.5a5 5 0 0 1-10 0V7.5ZM12 16v4.5"/>',
  };
  const icon = (n, cls = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="${cls}">${I[n]}</svg>`;
  const CH_ICON = { meta: "meta", google: "google", facebook: "fb", instagram: "ig", tracking: "tracking", setup: "setup" };

  // ================================================================ data access
  const inRange = (d, from, to) => d >= from && d <= to;
  const mRows = (cl, from, to) => { const s = new Set(cl.metaIdx); return MROWS.filter((r) => s.has(r.acci) && inRange(r.date_start, from, to)); };
  const gRows = (cl, from, to) => { const s = new Set(cl.gIdx); return GROWS.filter((r) => s.has(r.gi) && inRange(r.date, from, to)); };
  function aggM(rows) {
    const a = { spend: 0, imp: 0, clicks: 0, res: 0, leads: 0, msgs: 0, mSpend: 0, mRes: 0 };
    for (const r of rows) {
      const s = conv(r._spend, r._cur);
      a.spend += s; a.imp += r._imp; a.clicks += r._clicks; a.res += r._res; a.leads += r._leads; a.msgs += r._msgs;
      if (r._measured) { a.mSpend += s; a.mRes += r._res; }
    }
    a.cpl = a.mRes ? a.mSpend / a.mRes : null;
    a.ctr = a.imp ? a.clicks / a.imp : null;
    return a;
  }
  function aggG(rows) {
    const a = { cost: 0, imp: 0, clicks: 0, conv: 0 };
    for (const r of rows) { a.cost += conv(r.cost, r._cur); a.imp += r.imp; a.clicks += r.clicks; a.conv += r.conv; }
    a.ctr = a.imp ? a.clicks / a.imp : null;
    a.cpc = a.clicks ? a.cost / a.clicks : null;
    a.cpa = a.conv ? a.cost / a.conv : null;
    return a;
  }
  function aggAll(cl, from, to) {
    const m = aggM(mRows(cl, from, to)), g = aggG(gRows(cl, from, to));
    const req = m.res + g.conv, spend = m.spend + g.cost;
    return { m, g, req, spend, cpr: req ? spend / req : null };
  }
  const lastMeta = (cl) => { let d = ""; const s = new Set(cl.metaIdx); for (const r of MROWS) if (s.has(r.acci) && r._spend > 0 && r.date_start <= state.end && r.date_start > d) d = r.date_start; return d || null; };
  const lastGoogle = (cl) => { let d = ""; const s = new Set(cl.gIdx); for (const r of GROWS) if (s.has(r.gi) && r.cost > 0 && r.date <= state.end && r.date > d) d = r.date; return d || null; };
  function socialAgg(cl, from, to) {
    const S = cl.social;
    if (!S) return null;
    const pick = (arr) => arr.filter((x) => inRange(x[0], from, to));
    const fb = pick(S.fb), ig = pick(S.ig);
    const before = (arr) => arr.filter((x) => x[0] < from).slice(-1)[0];
    const posts = S.posts.filter((p) => inRange(p[0], from, to));
    const inter = posts.reduce((s, p) => s + p[5], 0), preach = posts.reduce((s, p) => s + p[4], 0);
    const fbReach = fb.reduce((s, x) => s + x[2], 0), igReach = ig.reduce((s, x) => s + x[2], 0);
    return {
      fbF: fb.length ? fb[fb.length - 1][1] : null, igF: ig.length ? ig[ig.length - 1][1] : null,
      fbG: fb.length && before(S.fb) ? fb[fb.length - 1][1] - before(S.fb)[1] : null,
      igG: ig.length && before(S.ig) ? ig[ig.length - 1][1] - before(S.ig)[1] : null,
      reach: fbReach + igReach, fbReach, igReach, posts, rate: preach ? inter / preach : null, fb, ig,
    };
  }
  const targetOf = (acc, cl) => {
    const v = state.targets[acc.id];
    if (v != null && v !== "" && +v > 0) return +v;
    return cl?.targets?.[acc.id] ?? null;
  };
  const assumptionsOf = (cl) => {
    const o = state.assumptions[cl.id] || {};
    const base = cl.assumptions || {};
    const pick = (k) => (o[k] != null && o[k] !== "" ? +o[k] : base[k] ?? null);
    const a = { booking: pick("booking"), close: pick("close"), value: pick("value") };
    return a.booking > 0 && a.close > 0 && a.value > 0 ? a : null;
  };

  // ================================================================ action plan
  const SEV = { high: 0, medium: 1, low: 2, info: 3 };
  const planCache = new Map();
  function metaFindings(cl, end) {
    const from = addD(end, -29), out = [];
    for (const i of cl.metaIdx) {
      const acc = ACC[i];
      const rows = MROWS.filter((r) => r.acci === i && inRange(r.date_start, from, end));
      if (!rows.length) continue;
      const tgt = targetOf(acc, cl);
      const rep = analyze(rows, { until: end, targetCpl: tgt ? { [`act_${String(acc.id).replace(/^act_/, "")}`]: tgt } : undefined });
      rep.findings.forEach((f) => out.push({ ...f, acc }));
    }
    return out;
  }

  // Not: metinler (title/why/steps) dil degisince yeniden uretilsin diye anahtar + degisken olarak saklanir.
  function buildPlan(cl, end) {
    const ck = `${cl.id}|${end}|${state.lang}|${state.cur}|${state.fx.CHF}|${state.fx.TRY}|${JSON.stringify(state.targets)}`;
    if (planCache.has(ck)) return planCache.get(ck);
    const A = [];
    const key = (type, id) => `${cl.id}|${type}|${id}|${end}`;
    const from30 = addD(end, -29);

    // ---- Meta (kural motoru)
    const fs = metaFindings(cl, end);
    const winners = fs.filter((f) => f.rule === "winner").sort((a, b) => a.metrics.cpl - b.metrics.cpl);
    const losers = fs.filter((f) => (f.rule === "spend_no_results" && f.objective !== "MESSAGES") || f.rule === "high_cpl").sort((a, b) => b.metrics.spend - a.metrics.spend);
    const used = new Set();
    if (winners.length && losers.length) {
      const w = winners[0], l = losers[0];
      const daily = conv(l.metrics.spend, l.acc.currency) / 7, amt = daily * 0.6;
      const cplW = conv(w.metrics.cpl, w.acc.currency);
      const more = Math.max(1, Math.round((amt * 7) / cplW - (l.metrics.results || 0) * 0.6));
      used.add(w.id + w.rule); used.add(l.id + l.rule);
      A.push({
        key: key("shift", l.id + ">" + w.id), ch: "meta", sev: "high", owner: "agency", effort: "S", more,
        titleK: ["a_shift", { from: short(l.name, 28), to: short(w.name, 28) }],
        whyK: ["w_shift", { from: short(l.name, 40), to: short(w.name, 40), spendL: money(conv(l.metrics.spend, l.acc.currency)), resL: num(l.metrics.results), cplW: money(cplW) }],
        stepsK: ["s_shift", { amt: money(amt, { dec: 0 }), from: short(l.name, 28), to: short(w.name, 28) }],
        impactK: ["i_more", { n: num(more) }],
        facts: [[t("f_spend7"), money(conv(l.metrics.spend, l.acc.currency)), short(l.name, 24), "bad"], [t("f_cpl7"), money(cplW), short(w.name, 24), "good"]],
        entity: `${l.name} → ${w.name}`,
      });
    }
    for (const f of fs) {
      if (used.has(f.id + f.rule)) continue;
      const cur = f.acc.currency, m = f.metrics || {};
      const c = (v) => (v == null ? "–" : money(conv(v, cur)));
      const facts = [];
      if (f.level === "ad") {
        facts.push([t("f_spend7"), c(m.spend)], [t("f_leads7"), num(m.results)]);
        if (f.target) facts.push([t("f_cpl7"), m.cpl == null ? "–" : c(m.cpl), t("f_target", { v: c(f.target) }), m.cpl == null || m.cpl > f.target ? "bad" : "good"]);
        facts.push([t("f_ctr7"), pct(m.ctr, 2), f.prior?.ctr ? t("f_prev", { v: pct(f.prior.ctr, 2) }) : "", f.prior?.ctr && m.ctr < f.prior.ctr * 0.85 ? "bad" : ""]);
        if (m.frequency) facts.push([t("f_freq"), num(m.frequency, 1), "", m.frequency >= 3 ? "bad" : ""]);
      }
      const base = { key: key(f.rule, f.id), ch: "meta", sev: f.severity, facts, entity: `${f.name}${f.campaign ? " · " + f.campaign : ""}` };
      const ad = short(f.name || "", 34);
      if (f.rule === "spend_no_results") {
        if (f.objective === "MESSAGES") continue; // WhatsApp asagida olcum aksiyonu olarak
        A.push({ ...base, owner: "agency", effort: "S", titleK: ["a_spend_no_results", { ad }], whyK: ["w_spend_no_results", { spend: c(m.spend), target: c(f.target) }], stepsK: ["s_spend_no_results"], impactK: ["i_save", { v: c(m.spend) }], save: conv(m.spend, cur) });
      } else if (f.rule === "high_cpl") {
        const save = (m.cpl - f.target) * m.results;
        A.push({ ...base, owner: "agency", effort: "M", titleK: ["a_high_cpl", { ad }], whyK: ["w_high_cpl", { cpl: c(m.cpl), target: c(f.target), pct: pct0(m.cpl / f.target - 1) }], stepsK: ["s_high_cpl"], impactK: ["i_high_cpl", { v: c(save) }], save: conv(save, cur) });
      } else if (f.rule === "creative_fatigue") {
        A.push({ ...base, owner: "both", effort: "M", titleK: ["a_creative_fatigue", { ad }], whyK: ["w_creative_fatigue", { freq: num(m.frequency, 1), p: pct(f.prior?.ctr, 2), r: pct(m.ctr, 2) }], stepsK: ["s_creative_fatigue"], impactK: ["i_fatigue"] });
      } else if (f.rule === "low_ctr") {
        A.push({ ...base, owner: "agency", effort: "S", titleK: ["a_low_ctr", { ad }], whyK: ["w_low_ctr", { ctr: pct(m.ctr, 2), imp: num(m.impressions) }], stepsK: ["s_low_ctr"], impactK: ["i_low_ctr"] });
      } else if (f.rule === "spend_stopped") {
        A.push({ ...base, entity: f.acc.name, facts: [], owner: "clinic", effort: "S", titleK: ["a_spend_stopped"], whyK: ["w_spend_stopped"], stepsK: ["s_spend_stopped"], impactK: ["i_spend_stopped"] });
      } else if (f.rule === "winner") {
        const more = Math.max(1, Math.round(m.results * 0.2));
        A.push({ ...base, owner: "agency", effort: "S", more, titleK: ["a_winner", { ad }], whyK: ["w_winner", { cpl: c(m.cpl), target: c(f.target), pct: pct0(1 - m.cpl / f.target), n: num(m.results) }], stepsK: ["s_winner"], impactK: ["i_more", { n: num(more) }] });
      }
    }
    // WhatsApp: mesaj kampanyasi harciyor ama baslatilan konusma sayilmiyor -> olcum sorunu
    const wa = new Map();
    for (const r of mRows(cl, from30, end)) {
      if (r.objective !== "MESSAGES") continue;
      const o = wa.get(r.campaign_id) || { name: r.campaign_name, spend: 0, msgs: 0 };
      o.spend += conv(r._spend, r._cur); o.msgs += r._msgs; wa.set(r.campaign_id, o);
    }
    for (const [id, o] of wa) if (o.msgs === 0 && o.spend > 0) {
      A.push({ key: key("wa", id), ch: "tracking", sev: "high", owner: "both", effort: "M", titleK: ["a_wa_tracking"], whyK: ["w_wa_tracking", { camp: short(o.name, 40), spend: money(o.spend) }], stepsK: ["s_wa_tracking"], impactK: ["i_wa"], save: (o.spend / 30) * 7 * 0.3, facts: [[`${t("spend")} ${t("f_30")}`, money(o.spend)], [t("requests"), "0", "", "bad"]], entity: o.name });
    }
    // Meta uzun suredir durmus
    const lm = lastMeta(cl);
    if (lm && daysBetween(lm, end) > 14) {
      const pf = addD(lm, -59), prev = aggM(mRows(cl, pf, lm));
      const by = new Map();
      for (const r of mRows(cl, pf, lm)) { if (!r._measured) continue; const o = by.get(r.ad_id) || { name: r.ad_name, s: 0, r: 0 }; o.s += r._spend; o.r += r._res; by.set(r.ad_id, o); }
      const best = [...by.values()].filter((o) => o.r >= 3).sort((a, b) => a.s / a.r - b.s / b.r)[0];
      const g30 = aggG(gRows(cl, from30, end));
      A.push({
        key: key("metaPaused", lm), ch: "meta", sev: "medium", owner: "both", effort: "S",
        titleK: ["a_meta_paused"], whyK: [g30.cpa ? "w_meta_paused" : "w_meta_paused_nog", { d: dmed(lm), cplM: money(prev.cpl), cpa: money(g30.cpa) }],
        stepsK: ["s_meta_paused", { ad: best ? short(best.name, 40) : "–" }], impactK: ["i_meta_paused"],
        facts: [[`${t("cpl")} · Meta`, money(prev.cpl), `${dfmt(pf)} – ${dfmt(lm)}`], ...(g30.cpa ? [[`${t("cpa")} · Google`, money(g30.cpa), t("f_30")]] : [])],
        entity: cl.metaIdx.map((i) => ACC[i].name).join(", "),
      });
    }

    // ---- Google
    if (cl.gIdx.length) {
      const g = gRows(cl, from30, end), G = aggG(g);
      if (G.cost > 0 && G.conv === 0) {
        A.push({ key: key("gTracking", "acc"), ch: "google", sev: "high", owner: "agency", effort: "M", titleK: ["a_g_tracking"], whyK: ["w_g_tracking", { cost: money(G.cost) }], stepsK: ["s_g_tracking"], impactK: ["i_g_tracking"], facts: [[`${t("f_cost")} ${t("f_30")}`, money(G.cost)], [t("f_conv"), "0", "", "bad"]], entity: cl.gIdx.map((i) => GC[i].name).join(", ") });
      }
      const byC = new Map();
      for (const r of g) { const o = byC.get(r.id) || { id: r.id, name: r.name, type: r.type, rows: [] }; o.rows.push(r); byC.set(r.id, o); }
      for (const o of byC.values()) {
        const a = aggG(o.rows);
        const lv = o.rows.map((r) => r.lost).filter((v) => v != null);
        const lost = lv.length ? lv.reduce((s, v) => s + v, 0) / lv.length : null;
        if (G.conv > 0 && a.conv === 0 && G.cpa && a.cost >= G.cpa * 1.5) {
          A.push({ key: key("gNoConv", o.id), ch: "google", sev: "medium", owner: "agency", effort: "S", titleK: ["a_g_no_conv", { camp: short(o.name, 36) }], whyK: ["w_g_no_conv", { cost: money(a.cost), cpa: money(G.cpa) }], stepsK: ["s_g_no_conv"], impactK: ["i_save", { v: money((a.cost / 30) * 7) }], save: (a.cost / 30) * 7, facts: [[`${t("f_cost")} ${t("f_30")}`, money(a.cost)], [t("f_conv"), "0", "", "bad"], [`${t("cpa")} Ø`, money(G.cpa)]], entity: o.name });
        }
        if (lost != null && lost >= 0.2 && a.cpa && G.cpa && a.cpa <= G.cpa * 1.05) {
          const more = Math.max(1, Math.round((a.conv / 30) * 7 * (lost / (1 - lost)) * 0.6));
          A.push({ key: key("gBudget", o.id), ch: "google", sev: "info", owner: "agency", effort: "S", more, titleK: ["a_g_budget", { camp: short(o.name, 36) }], whyK: ["w_g_budget", { pct: pct0(lost), cpa: money(a.cpa) }], stepsK: ["s_g_budget"], impactK: ["i_more", { n: num(more) }], facts: [[t("f_lost"), pct(lost, 0), "", "bad"], [t("cpa"), money(a.cpa), `Ø ${money(G.cpa)}`, "good"], [`${t("f_conv")} ${t("f_30")}`, num(a.conv, 0)]], entity: o.name });
        }
        if (o.type === "SEARCH" && a.imp >= 800 && a.ctr != null && a.ctr < 0.03) {
          A.push({ key: key("gCtr", o.id), ch: "google", sev: "low", owner: "agency", effort: "S", titleK: ["a_g_low_ctr", { camp: short(o.name, 36) }], whyK: ["w_g_low_ctr", { ctr: pct(a.ctr, 2), imp: num(a.imp) }], stepsK: ["s_g_low_ctr"], impactK: ["i_low_ctr"], facts: [[t("ctr"), pct(a.ctr, 2), "", "bad"], [t("impressions"), num(a.imp)]], entity: o.name });
        }
      }
      const terms = GTERMS.filter((x) => cl.gIdx.includes(x.gi));
      const total = terms.reduce((s, x) => s + conv(x.cost, x._cur), 0);
      const waste = terms.filter((x) => x.conv === 0 && conv(x.cost, x._cur) >= total * 0.03).sort((a, b) => b.cost - a.cost).slice(0, 4);
      if (waste.length) {
        const wc = waste.reduce((s, x) => s + conv(x.cost, x._cur), 0);
        A.push({ key: key("gNeg", waste.map((x) => x.term).join(",")), ch: "google", sev: "medium", owner: "agency", effort: "S", titleK: ["a_g_negative"], whyK: ["w_g_negative", { cost: money(wc) }], stepsK: ["s_g_negative"], impactK: ["i_save", { v: money((wc / 90) * 7) }], save: (wc / 90) * 7, facts: waste.map((x) => [`„${x.term}“`, money(conv(x.cost, x._cur)), `${num(x.clicks)} ${t("clicks")} · 0 ${t("f_conv")}`, "bad"]), entity: t("f_terms") });
      }
    }

    // ---- Organik
    if (!cl.social) {
      A.push({ key: key("socialConnect", "x"), ch: "setup", sev: "low", owner: "clinic", effort: "S", titleK: ["a_social_connect"], whyK: ["w_social_connect"], stepsK: ["s_social_connect"], impactK: ["i_social_connect"], facts: [], entity: "Facebook · Instagram" });
    } else {
      const S = cl.social;
      const p28 = S.posts.filter((p) => inRange(p[0], addD(end, -27), end));
      const growth = (arr, a, b) => { const x = arr.filter((v) => inRange(v[0], a, b)); return x.length > 1 ? x[x.length - 1][1] - x[0][1] : 0; };
      const g1 = growth(S.ig, addD(end, -27), end), g0 = growth(S.ig, addD(end, -55), addD(end, -28));
      if (p28.length < 8) {
        const drop = g0 > 0 ? 1 - g1 / g0 : 0;
        A.push({ key: key("postFreq", "x"), ch: "instagram", sev: drop > 0.2 ? "medium" : "low", owner: "clinic", effort: "M", titleK: ["a_post_freq"], whyK: ["w_post_freq", { n: num(p28.length), pct: pct0(Math.max(0, drop)) }], stepsK: ["s_post_freq"], impactK: ["i_post_freq"], facts: [[t("f_posts"), num(p28.length), "≥ 12", "bad"], [t("f_growth"), "+" + num(g1), t("f_prev", { v: "+" + num(g0) }), drop > 0.2 ? "bad" : ""]], entity: "Instagram · Facebook" });
      }
      const avgI = S.posts.length ? S.posts.reduce((s, p) => s + p[5], 0) / S.posts.length : 0;
      const star = S.posts.filter((p) => inRange(p[0], addD(end, -20), end)).sort((a, b) => b[5] - a[5])[0];
      if (star && avgI && star[5] >= avgI * 2.5) {
        A.push({ key: key("boost", star[0]), ch: star[1] === "ig" ? "instagram" : "facebook", sev: "info", owner: "agency", effort: "S", titleK: ["a_boost"], whyK: ["w_boost", { topic: star[3], reach: num(star[4]), x: num(star[5] / avgI, 1) }], stepsK: ["s_boost"], impactK: ["i_boost"], facts: [[t("f_reach"), num(star[4])], [t("f_inter"), num(star[5]), `Ø ${num(avgI)}`, "good"]], entity: `${star[3]} · ${dfmt(star[0])}` });
      }
      const p90 = S.posts.filter((p) => inRange(p[0], addD(end, -89), end));
      const avgR = (f) => { const x = p90.filter((p) => p[2] === f); return x.length >= 2 ? x.reduce((s, p) => s + p[4], 0) / x.length : null; };
      const rR = avgR("reel"), rI = avgR("image");
      const imgShare = p90.length ? p90.filter((p) => p[2] === "image").length / p90.length : 0;
      if (rR && rI && rR >= rI * 1.5 && imgShare > 0.3) {
        A.push({ key: key("reels", "x"), ch: "instagram", sev: "low", owner: "clinic", effort: "M", titleK: ["a_reels"], whyK: ["w_reels", { x: num(rR / rI, 1) }], stepsK: ["s_reels"], impactK: ["i_post_freq"], facts: [[t("fmt_reel"), num(rR), `${t("f_reach")} Ø`], [t("fmt_image"), num(rI), `${t("f_reach")} Ø`]], entity: "Instagram · Facebook" });
      }
    }

    A.sort((a, b) => SEV[a.sev] - SEV[b.sev] || ((b.save || 0) + (b.more || 0) * 30) - ((a.save || 0) + (a.more || 0) * 30));
    planCache.set(ck, A);
    return A;
  }
  const decOf = (k) => state.decisions[k];
  const openActions = (cl, end = state.end) => buildPlan(cl, end).filter((a) => !decOf(a.key));
  const txt = (a) => {
    const s = t(a.stepsK[0]), v = a.stepsK[1] || {};
    return { title: t(...a.titleK), why: t(...a.whyK), impact: a.impactK ? t(...a.impactK) : "", steps: Array.isArray(s) ? s.map((x) => x.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "")) : [] };
  };

  // ================================================================ charts
  function niceMax(v) {
    if (!(v > 0)) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p;
    return 10 * p;
  }
  const charts = new Map();
  function mountChart(id, draw) { charts.set(id, draw); const el = document.getElementById(id); if (el) draw(el); }
  // Boyut degisince yeniden ciz, ama animasyonu tekrar oynatma
  const ro = new ResizeObserver((es) => { for (const e of es) { const d = charts.get(e.target.id); if (d && e.contentRect.width && Math.abs((e.target._w || 0) - e.contentRect.width) > 4) { e.target.classList.add("still"); d(e.target); } } });

  // series: [{vals, color, label}] — ust uste (stacked); segmentler arasinda 1.5px zemin boslugu
  function barChart(el, { days, series, fmt, h = 220, mark }) {
    const W = Math.max(260, el.clientWidth); el._w = W;
    const H = h, pl = 52, pr = 8, pt = 10, pb = 24, iw = W - pl - pr, ih = H - pt - pb;
    const tot = days.map((_, i) => series.reduce((s, se) => s + (se.vals[i] || 0), 0));
    const max = niceMax(Math.max(...tot, 0));
    const y = (v) => pt + ih - (v / max) * ih;
    const step = iw / days.length, bw = Math.max(1, Math.min(22, step - (days.length > 60 ? 1 : 2)));
    let s = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img"><g class="grid">`;
    for (const tk of [0, max / 2, max]) s += `<line x1="${pl}" x2="${W - pr}" y1="${y(tk)}" y2="${y(tk)}"/><text x="${pl - 8}" y="${y(tk) + 3}" text-anchor="end">${esc(fmt(tk, true))}</text>`;
    s += `</g><g class="barsg" style="transform-origin:0 ${pt + ih}px">`;
    days.forEach((_, i) => {
      const x = pl + i * step + (step - bw) / 2;
      const segs = series.map((se) => se.vals[i] || 0);
      const top = segs.reduce((k, v, j) => (v > 0 ? j : k), -1);
      let base = 0;
      segs.forEach((v, j) => {
        if (!v) return;
        const y0 = y(base) - (base > 0 ? 1.5 : 0), y1 = y(base + v);
        const hh = Math.max(1.5, y0 - y1);
        const r = j === top ? Math.min(3, bw / 2, hh) : 0;
        s += `<path class="bar" data-i="${i}" d="M${x},${y0} v${-(hh - r)} ${r ? `q0,${-r} ${r},${-r} h${bw - 2 * r} q${r},0 ${r},${r}` : `h${bw}`} v${hh - r} z" fill="${series[j].color}"/>`;
        base += v;
      });
    });
    s += `</g>`;
    const li = days.length > 2 ? [0, Math.floor((days.length - 1) / 2), days.length - 1] : days.map((_, i) => i);
    for (const i of li) {
      const anchor = i === 0 ? "start" : i === days.length - 1 ? "end" : "middle";
      const x = i === 0 ? pl : i === days.length - 1 ? W - pr : pl + i * step + step / 2;
      s += `<text x="${x}" y="${H - 6}" text-anchor="${anchor}">${esc(dfmt(days[i]))}</text>`;
    }
    if (mark && mark.i >= 0) { const x = pl + mark.i * step; s += `<g class="marker"><line x1="${x}" x2="${x}" y1="${pt}" y2="${pt + ih}"/><text x="${x + 6}" y="${pt + 10}">${esc(mark.label)}</text></g>`; }
    s += `<line class="base" x1="${pl}" x2="${W - pr}" y1="${pt + ih}" y2="${pt + ih}"/><rect x="${pl}" y="${pt}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip" hidden></div>`;
    el.innerHTML = s;
    hover(el, W, (px) => {
      const i = Math.floor((px - pl) / step);
      if (i < 0 || i >= days.length) return null;
      el.querySelectorAll(".bar").forEach((b) => b.classList.toggle("dim", +b.dataset.i !== i));
      const lines = series.length > 1 ? series.map((se) => `<div class="tl"><i style="background:${se.color}"></i><span>${esc(se.label)}</span><b>${esc(fmt(se.vals[i] || 0))}</b></div>`).join("") : `<div class="tv">${esc(fmt(tot[i]))}</div>`;
      return { x: pl + i * step + step / 2, y: y(tot[i]), html: `<div class="tt">${esc(dlong(days[i]))}</div>${lines}` };
    }, () => el.querySelectorAll(".bar").forEach((b) => b.classList.remove("dim")));
  }

  function lineChart(el, { labels, vals, color, fmt, h = 170, mark }) {
    const W = Math.max(260, el.clientWidth); el._w = W;
    const H = h, pl = 52, pr = 12, pt = 14, pb = 24, iw = W - pl - pr, ih = H - pt - pb;
    const def = vals.filter((v) => v != null);
    const max = niceMax(Math.max(...def, 0) * 1.08);
    const x = (i) => pl + (labels.length === 1 ? iw / 2 : (i / (labels.length - 1)) * iw);
    const y = (v) => pt + ih - (v / max) * ih;
    let d = "", started = false, fx = 0, lx = 0;
    vals.forEach((v, i) => { if (v == null) return; d += `${started ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`; if (!started) fx = x(i); lx = x(i); started = true; });
    const gid = "g" + Math.random().toString(36).slice(2, 8);
    let s = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0.22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><g class="grid">`;
    for (const tk of [0, max / 2, max]) s += `<line x1="${pl}" x2="${W - pr}" y1="${y(tk)}" y2="${y(tk)}"/><text x="${pl - 8}" y="${y(tk) + 3}" text-anchor="end">${esc(fmt(tk, true))}</text>`;
    s += `</g>`;
    const li = labels.length > 2 ? [0, Math.floor((labels.length - 1) / 2), labels.length - 1] : labels.map((_, i) => i);
    for (const i of li) s += `<text x="${x(i)}" y="${H - 6}" text-anchor="${i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}">${esc(labels[i].short)}</text>`;
    if (mark && mark.i >= 0) { const mx = x(mark.i); s += `<g class="marker"><line x1="${mx}" x2="${mx}" y1="${pt}" y2="${pt + ih}"/><text x="${mx + 6}" y="${pt + 8}">${esc(mark.label)}</text></g>`; }
    s += `<line class="base" x1="${pl}" x2="${W - pr}" y1="${pt + ih}" y2="${pt + ih}"/>`;
    if (started) {
      s += `<path class="area" d="${d}L${lx},${pt + ih}L${fx},${pt + ih}Z" fill="url(#${gid})"/><path class="line" d="${d}" stroke="${color}" style="--len:4000"/>`;
      const l2 = vals.length - 1 - [...vals].reverse().findIndex((v) => v != null);
      s += `<circle cx="${x(l2)}" cy="${y(vals[l2])}" r="4" fill="${color}" stroke="var(--bg-elev)" stroke-width="2"/>`;
    }
    s += `<line class="cross" x1="0" x2="0" y1="${pt}" y2="${pt + ih}" visibility="hidden"/><circle class="hdot" r="4" fill="${color}" stroke="var(--bg-elev)" stroke-width="2" visibility="hidden"/><rect x="${pl}" y="${pt}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip" hidden></div>`;
    el.innerHTML = s;
    const cross = el.querySelector(".cross"), hdot = el.querySelector(".hdot");
    hover(el, W, (px) => {
      const i = Math.round(((px - pl) / iw) * (labels.length - 1));
      if (i < 0 || i >= labels.length || vals[i] == null) { cross.setAttribute("visibility", "hidden"); hdot.setAttribute("visibility", "hidden"); return null; }
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.setAttribute("visibility", "visible");
      hdot.setAttribute("cx", x(i)); hdot.setAttribute("cy", y(vals[i])); hdot.setAttribute("visibility", "visible");
      return { x: x(i), y: y(vals[i]), html: `<div class="tt">${esc(labels[i].long)}</div><div class="tv">${esc(fmt(vals[i]))}</div>` };
    }, () => { cross.setAttribute("visibility", "hidden"); hdot.setAttribute("visibility", "hidden"); });
  }

  function hover(el, W, at, leave) {
    const svg = el.querySelector("svg"), tip = el.querySelector(".tip");
    const move = (e) => {
      const r = svg.getBoundingClientRect();
      const res = at(((e.clientX - r.left) / r.width) * W);
      if (!res) { tip.hidden = true; return; }
      tip.innerHTML = res.html;
      tip.style.left = `${Math.min(90, Math.max(10, (res.x / W) * 100))}%`;
      tip.style.top = `${res.y}px`;
      tip.hidden = false;
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerdown", move);
    svg.addEventListener("pointerleave", () => { tip.hidden = true; leave && leave(); });
  }

  function spark(vals, color, w = 200, h = 34) {
    const d0 = vals.map((v) => v ?? 0);
    const max = Math.max(...d0, 1e-9), min = Math.min(...d0, 0);
    const x = (i) => (vals.length === 1 ? w / 2 : (i / (vals.length - 1)) * w);
    const y = (v) => h - 2 - ((v - min) / (max - min || 1)) * (h - 6);
    const line = d0.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
    const gid = "s" + Math.random().toString(36).slice(2, 8);
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0.18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${line}L${w},${h}L0,${h}Z" fill="url(#${gid})"/><path d="${line}" fill="none" stroke="${color}" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`;
  }

  // ================================================================ ui bits
  const pillKind = (cl) => (cl.demo ? `<span class="pill demo">${t("demo")}</span>` : `<span class="pill real">${t("real")}</span>`);
  const sevPill = (s) => `<span class="pill ${s === "high" ? "bad" : s === "medium" ? "warn" : s === "info" ? "good" : "neutral"}"><span class="dot"></span>${t("sev_" + s)}</span>`;
  const chPill = (ch) => `<span class="chp">${icon(CH_ICON[ch])}${t("ch_" + ch)}</span>`;
  const deltaPill = (a, b, goodUp, neutral) => {
    if (a == null || b == null || !isFinite(a) || !isFinite(b) || b === 0) return `<span class="muted">${t("no_prev")}</span>`;
    const d = a / b - 1;
    if (Math.abs(d) < 0.005) return `<span class="delta flat">±0</span> <span>${t("vs_prev")}</span>`;
    const cls = neutral ? "flat" : (d > 0) === goodUp ? "good" : "bad";
    return `<span class="delta ${cls}">${d > 0 ? "↑" : "↓"} ${pct0(d)}</span> <span>${t("vs_prev")}</span>`;
  };
  const deltaMini = (a, b, goodUp) => {
    if (a == null || b == null || !b || !isFinite(a)) return "";
    const d = a / b - 1;
    if (Math.abs(d) < 0.005) return `<span class="delta flat">±0</span>`;
    return `<span class="delta ${(d > 0) === goodUp ? "good" : "bad"}">${d > 0 ? "↑" : "↓"}${pct0(d)}</span>`;
  };
  function chStatus(cl) {
    const lm = lastMeta(cl), lg = lastGoogle(cl);
    return [
      { ch: "meta", on: cl.metaIdx.length > 0, paused: lm && daysBetween(lm, state.end) > 14 ? lm : null },
      { ch: "google", on: cl.gIdx.length > 0, paused: lg && daysBetween(lg, state.end) > 14 ? lg : null },
      { ch: "facebook", on: !!cl.social },
      { ch: "instagram", on: !!cl.social },
    ];
  }
  const chDots = (cl) => `<span class="chdots">${chStatus(cl).map((s) => `<span class="chd ${s.on ? (s.paused ? "paused" : "on") : "off"}" title="${esc(t("ch_" + s.ch))}: ${esc(s.on ? (s.paused ? t("paused_since", { d: dmed(s.paused) }) : t("connected")) : t("not_connected"))}">${icon(CH_ICON[s.ch])}</span>`).join("")}</span>`;

  // ================================================================ shell
  function shell() {
    const cl = C();
    const preview = state.preview && cl;
    const themeIc = state.theme === "dark" ? "moon" : state.theme === "light" ? "sun" : "auto";
    const nOpen = cl ? openActions(cl).length : 0;
    const clientNav = [["overview", "overview"], ["plan", "plan"], ["research", "radar"], ["create", "studio"], ["meta", "meta"], ["google", "google"], ["social", "social"], ["reports", "reports"], ["log", "log"], ["settings", "settings"]];
    const navItem = (v, ic, label, extra = "") => `<a href="#${v}" data-nav="${v}" ${(!cl && v === "clients") || (cl && state.view === v) ? 'aria-current="page"' : ""}>${icon(ic)}<span>${label}</span>${extra}</a>`;
    document.getElementById("app").innerHTML = `
      <div class="app ${preview ? "is-preview" : ""}">
        <aside class="side ${state.menu ? "open" : ""}" aria-label="${t("menu")}">
          ${preview ? `<div class="brand"><div class="brand-mark client">${esc(cl.name.slice(0, 1))}</div><div><div class="brand-name">${esc(cl.name)}</div><div class="brand-sub">MediDent Ads</div></div></div>`
            : `<div class="brand"><div class="brand-mark">${icon("logo")}</div><div><div class="brand-name">MediDent Ads</div><div class="brand-sub">${t("brand_sub")}</div></div></div>`}
          <nav class="nav">
            ${preview ? "" : `<div class="nav-label">${t("sec_admin")}</div>${navItem("clients", "clients", t("nav_clients"), `<span class="count neutral">${CLIENTS.length}</span>`)}`}
            ${cl ? `<div class="nav-label nav-client">${preview ? t("sec_portal") : `<span>${t("sec_client")}</span><span class="nav-cname">${esc(cl.name)}</span>`}</div>
              ${clientNav.filter(([v]) => !(preview && v === "log")).map(([v, ic]) => navItem(v, ic, t("nav_" + v), v === "plan" && nOpen ? `<span class="count">${nOpen}</span>` : "")).join("")}` : ""}
          </nav>
          <div class="side-foot">
            ${preview ? "" : `<button class="connect-cta" type="button" data-act="ob-open">${icon("plus")}<div><b>${t("new_client")}</b><span>Meta · Google · Facebook · Instagram</span></div></button>`}
            <div class="who"><span class="avatar"></span><span>${preview ? esc(cl.name) : "Enes Ceylan · " + t("admin")}</span></div>
          </div>
        </aside>
        <div class="scrim ${state.menu ? "open" : ""}" data-act="menu-close"></div>
        <div class="main">
          ${preview ? `<div class="preview-bar">${icon("eye")}<span><b>${t("preview_on")}</b> · ${esc(t("preview_text", { name: cl.name }))}</span><button class="btn sm" type="button" data-act="preview">${t("preview_exit")}</button></div>` : ""}
          <div class="top">
            <button class="btn icon ghost menu-btn" type="button" data-act="menu" aria-label="${t("menu")}">${icon("menu")}</button>
            <h1>${cl ? t("nav_" + state.view) : t("nav_clients")}</h1>
            <div class="tools">
              ${preview ? "" : `<div class="select" id="clSel"><button type="button" data-act="pop" aria-haspopup="listbox" aria-expanded="${state.pop}">${cl ? `<span class="dot" style="background:${cl.demo ? "var(--demo)" : "var(--accent)"}"></span>` : icon("clients")}<span class="lbl">${esc(cl ? cl.name : t("all_clients"))}</span>${icon("chev")}</button>${state.pop ? clientPop() : ""}</div>`}
              ${cl ? `<div class="seg" role="group" aria-label="${t("period")}">${[7, 30, 90].map((n) => `<button type="button" data-win="${n}" aria-pressed="${state.win === n}">${t("days", { n })}</button>`).join("")}</div>` : ""}
              <div class="seg" role="group" aria-label="${t("currency")}">${["EUR", "CHF"].map((c) => `<button type="button" data-cur="${c}" aria-pressed="${state.cur === c}">${c}</button>`).join("")}</div>
              <div class="seg hide-sm" role="group" aria-label="${t("language")}">${["de", "en", "tr"].map((l) => `<button type="button" data-lang="${l}" aria-pressed="${state.lang === l}">${l.toUpperCase()}</button>`).join("")}</div>
              ${cl && !preview ? `<button class="btn" type="button" data-act="preview" title="${t("preview_btn")}">${icon("eye")}<span class="hide-sm">${t("preview_btn")}</span></button>` : ""}
              <button class="btn icon" type="button" data-act="theme" aria-label="${t("theme")}" title="${t("theme")}">${icon(themeIc)}</button>
            </div>
          </div>
          <main class="content"><div class="view" id="view"></div></main>
        </div>
      </div>
      ${state.ob ? onboarding() : ""}
      <div class="toasts" id="toasts" aria-live="polite"></div>`;
    document.documentElement.lang = state.lang;
  }

  function clientPop() {
    const opt = (id, title, sub, dot) => `<button class="opt" type="button" role="option" data-client="${esc(id)}" aria-selected="${(state.client || "") === id}">${dot ? `<span class="dot" style="background:${dot}"></span>` : icon("clients")}<span><span class="t">${esc(title)}</span>${sub ? `<span class="s">${esc(sub)}</span>` : ""}</span>${(state.client || "") === id ? icon("check", "chk") : ""}</button>`;
    return `<div class="pop" role="listbox">
      ${opt("", t("all_clients"), `${CLIENTS.length} ${t("cl_count")}`)}
      <div class="grp">${t("real")}</div>${CLIENTS.filter((c) => !c.demo).map((c) => opt(c.id, c.name, `${t("sector_" + c.sector)} · ${c.city}`, "var(--accent)")).join("")}
      <div class="grp">${t("demo")}</div>${CLIENTS.filter((c) => c.demo).map((c) => opt(c.id, c.name, `${t("sector_" + c.sector)} · ${c.city}`, "var(--demo)")).join("")}
    </div>`;
  }

  const strip = (cl) => (cl.demo ? `<div class="demo-strip">${t("demo_strip")}</div>` : `<div class="demo-strip real">${t("real_strip", { cur: state.cur })}</div>`);
  const foot = () => `<p class="footnote">${t("footnote", { chf: num(state.fx.CHF, 2), try: num(state.fx.TRY, 1) })}</p>`;
  const clientHead = (cl) => `<div class="client-head">
      <div class="ch-id"><div class="ch-avatar ${cl.demo ? "demo" : ""}">${esc(cl.name.slice(0, 1))}</div><div><div class="ch-name">${esc(cl.name)} ${pillKind(cl)}</div><div class="ch-sub">${t("sector_" + cl.sector)} · ${esc(cl.city)} · ${t("last_data", { d: dmed(state.end) })}</div></div></div>
      ${chDots(cl)}
    </div>`;
  const kpiCard = (l, v, f, d, sub = "", sp = "") => `<div class="card kpi"><div class="l">${l}</div><div class="v" data-count="${v ?? ""}" data-fmt="${f}">${fmtVal(v, f)}</div><div class="d">${d}</div>${sub ? `<div class="kpi-sub">${sub}</div>` : ""}${sp ? `<div class="spark">${sp}</div>` : ""}</div>`;
  const dayList = (from, n) => Array.from({ length: n }, (_, i) => addD(from, i));
  function fmtVal(v, f) {
    if (v == null || !isFinite(v)) return "–";
    return f === "money" ? money(v) : f === "pct" ? pct(v, 2) : f === "compact" ? compact(v) : num(v);
  }

  // ================================================================ views
  function vClients() {
    const from = addD(state.end, -29), pFrom = addD(from, -30), pTo = addD(from, -1);
    let open = 0, urgent = 0, withAcc = 0;
    const rows = CLIENTS.map((cl) => {
      const a = aggAll(cl, from, state.end), p = aggAll(cl, pFrom, pTo);
      const acts = openActions(cl);
      const u = acts.filter((x) => x.sev === "high").length;
      open += acts.length; urgent += u; if (cl.access?.status === "active") withAcc++;
      const accTxt = cl.access?.status === "active" ? `<span class="pill good"><span class="dot"></span>${t("acc_active", { n: cl.access.users })}</span>` : cl.access?.status === "invited" ? `<span class="pill warn">${t("acc_invited")}</span>` : `<span class="pill neutral">${t("acc_none")}</span>`;
      return `<tr data-client="${esc(cl.id)}" class="rowlink" tabindex="0">
        <td><div class="cell-client"><div class="ch-avatar sm ${cl.demo ? "demo" : ""}">${esc(cl.name.slice(0, 1))}</div><div class="cell-name"><span class="t">${esc(cl.name)}</span><span class="s">${pillKind(cl)} ${t("sector_" + cl.sector)} · ${esc(cl.city)}</span></div></div></td>
        <td>${chDots(cl)}</td>
        <td class="r">${num(a.req)} ${deltaMini(a.req, p.req, true)}</td>
        <td class="r">${money(a.cpr)} ${deltaMini(a.cpr, p.cpr, false)}</td>
        <td class="r">${money(a.spend)}</td>
        <td class="r">${acts.length ? `<span class="pill ${u ? "bad" : "warn"}">${acts.length}${u ? ` · ${u} ${t("sev_high").toLowerCase()}` : ""}</span>` : `<span class="muted">0</span>`}</td>
        <td>${accTxt}</td>
        <td class="r go">${icon("arrow")}</td></tr>`;
    }).join("");
    return `
      <p class="lead-in">${t("cl_intro")}</p>
      <section class="stat-row">
        <div class="stat"><span class="k">${t("cl_count")}</span><span class="v">${CLIENTS.length}</span></div>
        <div class="stat"><span class="k">${t("cl_open")}</span><span class="v">${open}</span></div>
        <div class="stat"><span class="k">${t("cl_urgent")}</span><span class="v ${urgent ? "bad" : ""}">${urgent}</span></div>
        <div class="stat"><span class="k">${t("cl_access")}</span><span class="v">${withAcc} / ${CLIENTS.length}</span></div>
      </section>
      <section class="card"><div class="tbl-wrap"><table>
        <thead><tr><th>${t("col_client")}</th><th>${t("col_channels")}</th><th class="r">${t("col_requests")}</th><th class="r">${t("col_cpr")}</th><th class="r">${t("col_budget")}</th><th class="r">${t("col_actions")}</th><th>${t("col_access")}</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div></section>
      ${UNASSIGNED.length ? `<section class="card"><div class="card-h"><h2>${t("unassigned")}</h2><span class="sub">${t("unassigned_d")}</span></div><div class="card-b">${UNASSIGNED.map((a) => `<div class="acc-line">${icon("meta")}<div class="grow"><span class="t">${esc(a.name)}</span><span class="s">${esc(a.id)} · ${a.currency}</span></div><button class="btn sm" type="button" data-act="assign">${t("assign")}</button></div>`).join("")}</div></section>` : ""}
      ${foot()}`;
  }

  function decButtons(k) {
    return `<button class="btn sm primary" type="button" data-dec="approve" data-key="${esc(k)}">${icon("check")}${state.preview ? t("approve_client") : t("approve")}</button><button class="btn sm" type="button" data-dec="reject" data-key="${esc(k)}">${t("reject")}</button>`;
  }

  function statusCard(cl) {
    const end = state.end;
    const day = aggAll(cl, end, end), prev = aggAll(cl, addD(end, -7), addD(end, -1));
    const w1 = aggAll(cl, addD(end, -6), end), w0 = aggAll(cl, addD(end, -13), addD(end, -7));
    const acts = openActions(cl);
    const high = acts.filter((a) => a.sev === "high").length, med = acts.filter((a) => a.sev === "medium").length;
    const st = high ? ["bad", t("st_act")] : med ? ["warn", t("st_watch")] : ["good", t("st_ok")];
    let head;
    if (!day.spend) head = t("head_nospend");
    else {
      head = t("head_req", { spend: money(day.spend), n: num(day.req) }) + " ";
      if (!day.req) head += t("head_none");
      else if (prev.cpr) { const d = day.cpr / prev.cpr - 1; head += Math.abs(d) < 0.05 ? t("head_flat") : d < 0 ? t("head_better", { pct: pct0(d) }) : t("head_worse", { pct: pct0(d) }); }
    }
    const mean = [];
    if (!w1.spend) mean.push(t("mean_nodata"));
    else if (w1.cpr && w0.cpr) { const d = w1.cpr / w0.cpr - 1; mean.push(Math.abs(d) < 0.05 ? t("mean_trend_flat", { cpr: money(w1.cpr) }) : t(d < 0 ? "mean_trend_good" : "mean_trend_bad", { cpr: money(w1.cpr), pct: pct0(d) })); }
    const lm = lastMeta(cl);
    if (lm && daysBetween(lm, end) > 14 && w1.g.cost > 0) mean.push(t("mean_meta_paused", { d: dmed(lm) }));
    if (high) mean.push(t(high === 1 ? "mean_urgent_1" : "mean_urgent", { n: high }));
    const top = acts[0];
    let decide = `<p>${t("dec_none")}</p>`;
    if (top) {
      const x = txt(top);
      decide = `<div class="decision"><p>${t(acts.length === 1 ? "dec_open_1" : "dec_open", { n: acts.length })}</p>
        <div><div class="what">${esc(x.title)}</div><div class="rec-entity">${chPill(top.ch)} <span>${esc(x.impact)}</span></div></div>
        <div class="acts">${decButtons(top.key)}<a class="btn sm ghost" href="#plan" data-nav="plan">${t("see_all")}</a></div>
        ${state.reasonFor === top.key ? reasonChips(top.key) : ""}</div>`;
    }
    return `<section class="card status">
      <div class="status-top"><span class="pill ${st[0]}"><span class="pulse"></span>${st[1]}</span><span class="eyebrow">${t("status_title")}</span><span class="date">${esc(dlong(end))}</span></div>
      <h2>${esc(head)}</h2>
      <div class="status-cols">
        <div class="status-col"><span class="eyebrow">${t("happened")}</span><div class="hap">
          <div><span class="k">${t("budget")}</span><span class="v">${money(day.spend)}</span><span class="c">${esc(t("avg7", { v: money(prev.spend / 7) }))}</span></div>
          <div><span class="k">${t("requests")}</span><span class="v">${num(day.req)}</span><span class="c">${esc(t("avg7", { v: num(prev.req / 7, 1) }))}</span></div>
          <div><span class="k">${t("cpr")}</span><span class="v">${money(day.cpr)}</span><span class="c">${esc(t("avg7", { v: money(prev.cpr) }))}</span></div>
        </div></div>
        <div class="status-col"><span class="eyebrow">${t("means")}</span><p>${esc(mean.join(" "))}</p></div>
        <div class="status-col"><span class="eyebrow">${t("decide")}</span>${decide}</div>
      </div>
    </section>`;
  }

  function vOverview() {
    const cl = C(), end = state.end, from = addD(end, -(state.win - 1));
    const pFrom = addD(from, -state.win), pTo = addD(from, -1);
    const A = aggAll(cl, from, end), P = aggAll(cl, pFrom, pTo);
    const S = socialAgg(cl, from, end), SP = socialAgg(cl, pFrom, pTo);
    const days = dayList(from, state.win);
    const req = new Map(days.map((d) => [d, 0])), sp = new Map(days.map((d) => [d, 0]));
    for (const r of mRows(cl, from, end)) { req.set(r.date_start, req.get(r.date_start) + r._res); sp.set(r.date_start, sp.get(r.date_start) + conv(r._spend, r._cur)); }
    for (const r of gRows(cl, from, end)) { req.set(r.date, req.get(r.date) + r.conv); sp.set(r.date, sp.get(r.date) + conv(r.cost, r._cur)); }
    const reqS = days.map((d) => req.get(d)), spS = days.map((d) => sp.get(d));
    const cprRoll = days.map((_, i) => { let s = 0, r = 0; for (let k = Math.max(0, i - 6); k <= i; k++) { s += spS[k]; r += reqS[k]; } return r ? s / r : null; });
    const acts = openActions(cl);
    const orgSpark = S ? spark(days.map((d) => (S.fb.find((x) => x[0] === d)?.[2] || 0) + (S.ig.find((x) => x[0] === d)?.[2] || 0)), "var(--s-org)") : "";
    return `
      ${clientHead(cl)}
      ${statusCard(cl)}
      <section class="grid-kpi">
        ${kpiCard(t("requests"), A.req, "int", deltaPill(A.req, P.req, true), t("split", { m: num(A.m.res), g: num(A.g.conv, 0) }), spark(reqS, "var(--s-leads)"))}
        ${kpiCard(t("cpr"), A.cpr, "money", deltaPill(A.cpr, P.cpr, false), "", spark(cprRoll, "var(--s-cpl)"))}
        ${kpiCard(t("budget"), A.spend, "money", deltaPill(A.spend, P.spend, true, true), t("split", { m: money(A.m.spend, { dec: 0 }), g: money(A.g.cost, { dec: 0 }) }), spark(spS, "var(--s-spend)"))}
        ${S ? kpiCard(t("reach_org"), S.reach, "compact", deltaPill(S.reach, SP?.reach, true), `Facebook ${compact(S.fbReach)} · Instagram ${compact(S.igReach)}`, orgSpark)
          : `<div class="card kpi off"><div class="l">${t("reach_org")}</div><div class="v muted">–</div><div class="d">${t("not_connected")}</div><a class="btn sm" href="#social" data-nav="social" style="justify-self:start;margin-top:8px">${icon("plug")}${t("connect")}</a></div>`}
      </section>
      <div class="grid-2">
        <div class="stack">
          <section class="card">
            <div class="card-h"><h2>${state.chart === "req" ? t("chart_req") : t("chart_spend")}</h2><span class="sub">${esc(dfmt(from))} – ${esc(dfmt(end))}</span>
              <div class="right"><div class="seg">${[["req", t("requests")], ["spend", t("budget")]].map(([k, l]) => `<button type="button" data-chart="${k}" aria-pressed="${state.chart === k}">${l}</button>`).join("")}</div></div></div>
            <div class="card-b"><div class="legend"><span><i style="background:var(--s-meta)"></i>Meta</span><span><i style="background:var(--s-google)"></i>Google</span></div><div class="chart" id="chMain"></div></div>
          </section>
          <section class="card">
            <div class="card-h"><h2>${t("top_actions")}</h2><span class="sub">${acts.length} ${t("tab_open").toLowerCase()}</span><div class="right"><a class="btn sm ghost" href="#plan" data-nav="plan">${t("see_all")} ${icon("arrow")}</a></div></div>
            <div class="card-b mini-list">${acts.slice(0, 4).map((a, i) => { const x = txt(a); return `<a class="mini" href="#plan" data-nav="plan"><span class="num muted">${String(i + 1).padStart(2, "0")}</span><div class="mm"><div class="mt"><span>${esc(x.title)}</span>${sevPill(a.sev)}</div><div class="rec-entity">${chPill(a.ch)}<span>${esc(x.impact)}</span></div></div>${icon("arrow")}</a>`; }).join("") || `<div class="empty">${icon("check")}<b>${t("plan_empty_t")}</b><span>${t("plan_empty_s")}</span></div>`}</div>
          </section>
        </div>
        <div class="stack">${baCard(cl)}${roiCard(cl, A)}</div>
      </div>
      ${channelCards(cl, from, end, pFrom, pTo)}
      ${strip(cl)}${foot()}`;
  }

  function drawMain() {
    const cl = C(), end = state.end, from = addD(end, -(state.win - 1)), days = dayList(from, state.win);
    const m = new Map(days.map((d) => [d, [0, 0]])), g = new Map(days.map((d) => [d, [0, 0]]));
    for (const r of mRows(cl, from, end)) { const o = m.get(r.date_start); o[0] += conv(r._spend, r._cur); o[1] += r._res; }
    for (const r of gRows(cl, from, end)) { const o = g.get(r.date); o[0] += conv(r.cost, r._cur); o[1] += r.conv; }
    const k = state.chart === "req" ? 1 : 0;
    const mk = cl.measure && cl.measure.date >= from && cl.measure.date <= end ? { i: days.indexOf(cl.measure.date), label: t("ba_marker") } : null;
    mountChart("chMain", (el) => barChart(el, {
      days, mark: mk,
      series: [{ label: "Meta", color: "var(--s-meta)", vals: days.map((d) => m.get(d)[k]) }, { label: "Google", color: "var(--s-google)", vals: days.map((d) => g.get(d)[k]) }],
      fmt: (v, axis) => (k ? num(v, axis ? 0 : v % 1 ? 1 : 0) : money(v, { dec: 0 })),
    }));
  }

  function baRange(cl) {
    const m = cl.measure && cl.measure.date <= state.end ? cl.measure : null;
    if (m) {
      const after = [m.date, state.end < addD(m.date, 34) ? state.end : addD(m.date, 34)];
      const len = daysBetween(after[0], after[1]) + 1;
      return { m, before: [addD(m.date, -len), addD(m.date, -1)], after };
    }
    const from = addD(state.end, -(state.win - 1));
    return { m: null, before: [addD(from, -state.win), addD(from, -1)], after: [from, state.end] };
  }
  function baCard(cl) {
    const { m, before, after } = baRange(cl);
    const B = aggAll(cl, ...before), A = aggAll(cl, ...after);
    const ok = B.cpr != null && A.cpr != null;
    const d = ok ? A.cpr / B.cpr - 1 : null;
    return `<section class="card">
      <div class="card-h"><h2>${t("ba_title")} · ${t("cpr")}</h2><span class="sub">${m ? t("ba_measure", { date: dfmt(m.date, { day: "numeric", month: "long" }) }) : t("ba_period")}</span></div>
      <div class="card-b ba">
        ${ok ? `<div class="ba-nums">
          <div class="side-l"><span class="lab">${t("before")} · ${esc(dfmt(before[0]))} – ${esc(dfmt(before[1]))}</span><span class="val">${money(B.cpr)}</span></div>
          <div class="arrow">${icon("arrow")}</div>
          <div class="side-r"><span class="lab">${t("after")} · ${esc(dfmt(after[0]))} – ${esc(dfmt(after[1]))}</span><span class="val">${money(A.cpr)}</span></div>
        </div>
        <div class="ba-note"><span class="delta ${d < 0 ? "good" : d > 0 ? "bad" : "flat"}">${d < 0 ? "↓" : d > 0 ? "↑" : "±"} ${pct0(d)}</span><span>${m ? esc(m[state.lang] || m.de) : `${num(B.req, 0)} → ${num(A.req, 0)} ${t("requests")}`}</span></div>` : `<div class="empty">${t("ba_none")}</div>`}
        <div><div class="eyebrow" style="margin-bottom:6px">${t("ba_weekly")}</div><div class="chart" id="chBA"></div></div>
      </div></section>`;
  }
  function drawBA() {
    const cl = C(), { m } = baRange(cl);
    const labels = [], vals = []; let mi = -1;
    for (let w = 15; w >= 0; w--) {
      const to = addD(state.end, -7 * w), from = addD(to, -6);
      const a = aggAll(cl, from, to);
      labels.push({ short: dfmt(from), long: `${dfmt(from)} – ${dfmt(to)}` });
      vals.push(a.req >= 2 ? a.cpr : null);
      if (m && m.date >= from && m.date <= to) mi = labels.length - 1;
    }
    mountChart("chBA", (el) => lineChart(el, { labels, vals, color: "var(--s-cpl)", fmt: (v, axis) => (axis ? money(v, { dec: 0 }) : money(v)), mark: mi >= 0 ? { i: mi, label: t("ba_marker") } : null }));
  }

  function roiCard(cl, A) {
    const as = assumptionsOf(cl);
    if (!as) return `<section class="card"><div class="card-h"><h2>${t("roi_title")}</h2><span class="pill neutral">${t("roi_est")}</span></div><div class="card-b" style="display:grid;gap:12px"><p class="muted" style="margin:0">${t("roi_missing")}</p>${state.preview ? "" : `<a class="btn sm" href="#settings" data-nav="settings" style="justify-self:start">${t("roi_set")}</a>`}</div></section>`;
    const book = A.req * as.booking, pat = book * as.close, rev = pat * conv(as.value, cl.currency);
    const ratio = A.spend ? rev / A.spend : null;
    const steps = [[t("roi_req"), num(A.req)], [t("roi_book"), num(book, 0)], [t("roi_pat"), num(pat, 0)], [t("roi_rev"), money(rev, { dec: 0 })]];
    return `<section class="card"><div class="card-h"><h2>${t("roi_title")}</h2><span class="pill neutral">${t("roi_est")}</span>${state.preview ? "" : `<div class="right"><a class="btn sm ghost" href="#settings" data-nav="settings">${t("roi_edit")}</a></div>`}</div>
      <div class="card-b" style="display:grid;gap:14px">
        <div class="funnel">${steps.map(([k, v], i) => `<div class="fstep" style="--w:${[100, 80, 62, 46][i]}%"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}</div>
        ${ratio ? `<p class="roi-line">${t("roi_ratio", { cur: state.cur, x: money(ratio, { dec: 2 }) })}</p>` : ""}
        <p class="footnote" style="margin:0">${t("roi_assume", { b: pct(as.booking, 0), c: pct(as.close, 0), v: money(conv(as.value, cl.currency), { dec: 0 }) })}</p>
      </div></section>`;
  }

  function channelCards(cl, from, end, pFrom, pTo) {
    const m = aggM(mRows(cl, from, end)), mp = aggM(mRows(cl, pFrom, pTo));
    const g = aggG(gRows(cl, from, end)), gp = aggG(gRows(cl, pFrom, pTo));
    const S = socialAgg(cl, from, end);
    const st = chStatus(cl);
    const card = (ch, nav, body, s) => `<a class="card chcard" href="#${nav}" data-nav="${nav}"><div class="chc-h">${icon(CH_ICON[ch])}<span>${t("ch_" + ch)}</span>${s.on ? (s.paused ? `<span class="pill warn">${t("paused_since", { d: dfmt(s.paused) })}</span>` : `<span class="pill good"><span class="dot"></span>${t("connected")}</span>`) : `<span class="pill neutral">${t("not_connected")}</span>`}</div>${body}</a>`;
    const pair = (k1, v1, d1, k2, v2, d2) => `<div class="chc-b"><div><span class="k">${k1}</span><span class="v">${v1}</span>${d1 || ""}</div><div><span class="k">${k2}</span><span class="v">${v2}</span>${d2 || ""}</div></div>`;
    const off = `<div class="chc-b off"><span class="muted">${t("not_connected")}</span></div>`;
    return `<section class="sec"><div class="sec-h"><h2>${t("channels")}</h2><span class="sub">${esc(dfmt(from))} – ${esc(dfmt(end))}</span></div><div class="grid-ch">
      ${card("meta", "meta", st[0].on ? pair(t("leads"), num(m.res), deltaMini(m.res, mp.res, true), t("cpl"), money(m.cpl), deltaMini(m.cpl, mp.cpl, false)) : off, st[0])}
      ${card("google", "google", st[1].on ? pair(t("conv"), num(g.conv, 0), deltaMini(g.conv, gp.conv, true), t("cpa"), money(g.cpa), deltaMini(g.cpa, gp.cpa, false)) : off, st[1])}
      ${card("facebook", "social", S ? pair(t("s_followers"), compact(S.fbF), S.fbG != null ? `<span class="delta good">+${num(S.fbG)}</span>` : "", t("s_reach"), compact(S.fbReach), "") : off, st[2])}
      ${card("instagram", "social", S ? pair(t("s_followers"), compact(S.igF), S.igG != null ? `<span class="delta good">+${num(S.igG)}</span>` : "", t("s_reach"), compact(S.igReach), "") : off, st[3])}
    </div></section>`;
  }

  // ---------------------------------------------------------------- plan
  function reasonChips(key) {
    return `<div class="reasons"><span class="muted" style="font-size:12px">${t("reason_q")}</span>${["seasonal", "early", "brand", "other"].map((r) => `<button class="chipbtn" type="button" data-reason="${r}" data-key="${esc(key)}">${t("r_" + r)}</button>`).join("")}<button class="chipbtn" type="button" data-reason="" data-key="${esc(key)}">${t("skip")}</button><button class="btn sm ghost" type="button" data-act="reason-cancel">${t("cancel")}</button></div>`;
  }
  function actionCard(a, i) {
    const x = txt(a), dec = decOf(a.key), status = dec?.status;
    return `<article class="card rec" data-rec="${esc(a.key)}">
      <div class="prio ${a.sev}">${i + 1}</div>
      <div class="rec-body">
        <div class="rec-head"><div class="rec-hl">
          <div class="rec-meta">${chPill(a.ch)}<span class="own">${icon("user")}${t("owner_" + a.owner)}</span><span class="own">${t("effort")}: ${t("effort_" + a.effort)}</span></div>
          <h3 class="rec-title">${esc(x.title)}</h3>
          ${a.entity ? `<div class="rec-entity">${esc(a.entity)}</div>` : ""}
        </div>${sevPill(a.sev)}</div>
        <p class="rec-why">${esc(x.why)}</p>
        ${a.facts?.length ? `<div class="facts">${a.facts.map(([k, v, c, cls]) => `<div class="fact"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span>${c ? `<span class="c ${cls || ""}">${esc(c)}</span>` : ""}</div>`).join("")}</div>` : ""}
        ${x.steps.length ? `<div class="steps"><div class="eyebrow">${t("steps")}</div><ol>${x.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>` : ""}
        <div class="rec-foot">
          <span class="impact">${icon("bolt")}${esc(x.impact)}</span>
          ${status ? `<span class="pill ${status === "rejected" ? "neutral" : "good"}">${t("tab_" + status)} · ${esc(dtime(dec.at))}</span>${status === "approved" && !state.preview ? `<button class="btn sm" type="button" data-done="${esc(a.key)}">${icon("check")}${t("mark_done")}</button>` : ""}<button class="btn sm ghost" type="button" data-undo="${esc(a.key)}">${icon("undo")}${t("undo")}</button>`
            : `<button class="btn sm" type="button" data-dec="reject" data-key="${esc(a.key)}">${icon("x")}${t("reject")}</button><button class="btn sm primary" type="button" data-dec="approve" data-key="${esc(a.key)}">${icon("check")}${state.preview ? t("approve_client") : t("approve")}</button>`}
        </div>
        ${state.reasonFor === a.key ? reasonChips(a.key) : ""}
      </div>
    </article>`;
  }
  function vPlan() {
    const cl = C(), all = buildPlan(cl, state.end);
    const by = (s) => all.filter((a) => (s === "open" ? !decOf(a.key) : decOf(a.key)?.status === s));
    const open = by("open");
    const chs = ["all", ...new Set(all.map((a) => a.ch))];
    let list = by(state.planTab);
    if (state.planCh !== "all") list = list.filter((a) => a.ch === state.planCh);
    const save = open.reduce((s, a) => s + (a.save || 0), 0), more = open.reduce((s, a) => s + (a.more || 0), 0);
    return `
      ${clientHead(cl)}
      <section class="card plan-sum"><div class="ps-main"><span class="eyebrow">${t("nav_plan")} · ${esc(dlong(state.end))}</span><h2>${esc([t("plan_sum_n", { n: open.length }), save >= 10 ? t("plan_sum_save", { save: money(save, { dec: 0 }) }) : "", more >= 1 ? t("plan_sum_more", { more: num(more) }) : ""].filter(Boolean).join(" · "))}</h2><p>${t("plan_intro")}</p></div>
        ${save >= 10 || more >= 1 ? `<div class="ps-stats">${save >= 10 ? `<div><span class="k">${t("ps_save")}</span><span class="v">${money(save, { dec: 0 })}</span></div>` : ""}${more >= 1 ? `<div><span class="k">${t("ps_more")}</span><span class="v">+${num(more)}</span></div>` : ""}</div>` : ""}</section>
      <div class="plan-bar">
        <div class="tabs" role="tablist">${["open", "approved", "done", "rejected"].map((k) => `<button type="button" role="tab" data-ptab="${k}" aria-selected="${state.planTab === k}">${t("tab_" + k)} <span class="c">${by(k).length}</span></button>`).join("")}</div>
        <div class="chips-f">${chs.map((c) => `<button type="button" class="fchip" data-pch="${c}" aria-pressed="${state.planCh === c}">${c === "all" ? t("ch_all") : `${icon(CH_ICON[c])}${t("ch_" + c)}`}</button>`).join("")}</div>
      </div>
      <p class="footnote" style="margin:0">${t("plan_preview")}</p>
      <div class="recs">${list.map(actionCard).join("") || `<div class="card empty">${icon("check")}<b>${t("plan_empty_t")}</b><span>${state.planTab === "open" ? t("plan_empty_s") : t("plan_empty_d")}</span></div>`}</div>
      ${strip(cl)}`;
  }

  // ---------------------------------------------------------------- meta
  function campStats(cl, from, end) {
    const map = new Map(), last = new Map(), set = new Set(cl.metaIdx);
    for (const r of MROWS) if (set.has(r.acci) && r._spend > 0 && r.date_start <= end && r.date_start > (last.get(r.campaign_id) || "")) last.set(r.campaign_id, r.date_start);
    const days = dayList(from, daysBetween(from, end) + 1);
    for (const r of mRows(cl, from, end)) {
      if (!map.has(r.campaign_id)) map.set(r.campaign_id, { id: r.campaign_id, name: r.campaign_name, obj: r.objective, acc: ACC[r.acci], rows: [], ads: new Set(), daily: new Map(days.map((d) => [d, 0])) });
      const c = map.get(r.campaign_id);
      c.rows.push(r); c.ads.add(r.ad_name); c.daily.set(r.date_start, (c.daily.get(r.date_start) || 0) + conv(r._spend, r._cur));
    }
    return [...map.values()].map((c) => { const a = aggM(c.rows); return { ...c, spend: a.spend, res: a.res, cpl: a.mRes ? a.mSpend / a.mRes : null, ctr: a.ctr, active: (last.get(c.id) || "") >= addD(end, -2), spark: [...c.daily.values()] }; });
  }
  function sortList(list, valFn) {
    const { key, dir } = state.sort;
    return list.sort((a, b) => { const x = valFn(a, key) ?? -Infinity, y = valFn(b, key) ?? -Infinity; return (x > y ? 1 : x < y ? -1 : 0) * dir; });
  }
  const th = (k, l, r) => { const { key, dir } = state.sort; return `<th class="${r ? "r" : ""}" aria-sort="${key === k ? (dir > 0 ? "ascending" : "descending") : "none"}"><button type="button" data-sort="${k}">${l}${key === k ? (dir > 0 ? " ↑" : " ↓") : ""}</button></th>`; };

  function vMeta() {
    const cl = C(), end = state.end, from = addD(end, -(state.win - 1)), pFrom = addD(from, -state.win), pTo = addD(from, -1);
    if (!cl.metaIdx.length) return `${clientHead(cl)}<div class="card empty">${icon("meta")}<b>${t("not_connected")}</b></div>`;
    const A = aggM(mRows(cl, from, end)), P = aggM(mRows(cl, pFrom, pTo));
    const lm = lastMeta(cl);
    let list = campStats(cl, from, end);
    const q = state.search.trim().toLowerCase();
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || [...c.ads].some((a) => a.toLowerCase().includes(q)));
    if (state.campFilter !== "all") list = list.filter((c) => (state.campFilter === "active") === c.active);
    list = sortList(list, (c, k) => (k === "obj" ? t("obj_" + c.obj) : c[k]));
    return `
      ${clientHead(cl)}
      ${lm && daysBetween(lm, end) > 14 ? `<div class="banner warn">${icon("meta")}<span>${t("meta_paused_banner", { d: dmed(lm) })}</span><button class="btn sm" type="button" data-setend="${lm}">${t("show_until", { d: dfmt(lm) })}</button></div>` : ""}
      <section class="grid-kpi">
        ${kpiCard(t("spend"), A.spend, "money", deltaPill(A.spend, P.spend, true, true))}
        ${kpiCard(t("leads"), A.res, "int", deltaPill(A.res, P.res, true), `${num(A.leads)} Form · ${num(A.msgs)} WhatsApp`)}
        ${kpiCard(t("cpl"), A.cpl, "money", deltaPill(A.cpl, P.cpl, false))}
        ${kpiCard(t("ctr"), A.ctr, "pct", deltaPill(A.ctr, P.ctr, true))}
      </section>
      <section class="card"><div class="card-h"><h2>${t("spend_day")}</h2><span class="sub">${esc(dfmt(from))} – ${esc(dfmt(end))}</span></div><div class="card-b"><div class="chart" id="chMeta"></div></div></section>
      <div class="toolbar">
        <label class="search" for="q">${icon("search")}<input id="q" type="search" placeholder="${t("camp_search")}" value="${esc(state.search)}" autocomplete="off"></label>
        <div class="seg">${["all", "active", "paused"].map((k) => `<button type="button" data-cf="${k}" aria-pressed="${state.campFilter === k}">${t("st_" + k)}</button>`).join("")}</div>
      </div>
      <section class="card"><div class="tbl-wrap"><table>
        <thead><tr>${th("name", t("col_campaign"))}${th("obj", t("col_goal"))}<th>${t("col_status")}</th>${th("spend", t("spend"), 1)}${th("res", t("leads"), 1)}${th("cpl", t("cpl"), 1)}${th("ctr", t("ctr"), 1)}<th>${t("col_trend")}</th></tr></thead>
        <tbody>${list.map((c) => `<tr><td><div class="cell-name"><span class="t">${esc(c.name)}</span><span class="s">${esc(c.acc.name)} · ${c.ads.size} Ads</span></div></td><td><span class="pill neutral">${t("obj_" + c.obj)}</span></td><td>${c.active ? `<span class="pill good"><span class="dot"></span>${t("st_active")}</span>` : `<span class="pill neutral">${t("st_paused")}</span>`}</td><td class="r">${money(c.spend)}</td><td class="r">${num(c.res)}</td><td class="r">${money(c.cpl)}</td><td class="r">${pct(c.ctr, 2)}</td><td><div class="mini-spark">${spark(c.spark, "var(--s-meta)", 90, 24)}</div></td></tr>`).join("") || `<tr><td colspan="8"><div class="empty">${t("no_camps")}</div></td></tr>`}</tbody>
      </table></div></section>
      ${strip(cl)}`;
  }
  function drawMeta() {
    const cl = C(), end = state.end, from = addD(end, -(state.win - 1)), days = dayList(from, state.win);
    const s = new Map(days.map((d) => [d, 0]));
    for (const r of mRows(cl, from, end)) s.set(r.date_start, s.get(r.date_start) + conv(r._spend, r._cur));
    mountChart("chMeta", (el) => barChart(el, { days, h: 200, series: [{ label: "Meta", color: "var(--s-meta)", vals: days.map((d) => s.get(d)) }], fmt: (v) => money(v, { dec: 0 }) }));
  }

  // ---------------------------------------------------------------- google
  function vGoogle() {
    const cl = C(), end = state.end, from = addD(end, -(state.win - 1)), pFrom = addD(from, -state.win), pTo = addD(from, -1);
    if (!cl.gIdx.length) return `${clientHead(cl)}<div class="card empty">${icon("google")}<b>${t("not_connected")}</b><span>${t("g_none")}</span></div>${strip(cl)}`;
    const A = aggG(gRows(cl, from, end)), P = aggG(gRows(cl, pFrom, pTo));
    const by = new Map();
    for (const r of gRows(cl, from, end)) { const o = by.get(r.id) || { id: r.id, name: r.name, type: r.type, status: r.status, rows: [] }; o.rows.push(r); by.set(r.id, o); }
    let camps = [...by.values()].map((o) => { const a = aggG(o.rows); const l = o.rows.map((r) => r.lost).filter((v) => v != null); return { ...o, ...a, spend: a.cost, lost: l.length ? l.reduce((s, v) => s + v, 0) / l.length : null }; });
    camps = sortList(camps, (c, k) => (k === "res" ? c.conv : k === "cpl" ? c.cpa : c[k]));
    const terms = GTERMS.filter((x) => cl.gIdx.includes(x.gi)).sort((a, b) => b.cost - a.cost).slice(0, 15);
    const avgT = terms.length ? terms.reduce((s, x) => s + x.cost, 0) / terms.length : 0;
    const lg = lastGoogle(cl);
    const fc = (v) => num(v, v % 1 ? 1 : 0);
    return `
      ${clientHead(cl)}
      ${lg && daysBetween(lg, end) > 14 ? `<div class="banner warn">${icon("google")}<span>${t("paused_since", { d: dmed(lg) })}</span></div>` : ""}
      <section class="grid-kpi six">
        ${kpiCard(t("cost"), A.cost, "money", deltaPill(A.cost, P.cost, true, true))}
        ${kpiCard(t("clicks"), A.clicks, "int", deltaPill(A.clicks, P.clicks, true))}
        ${kpiCard(t("ctr"), A.ctr, "pct", deltaPill(A.ctr, P.ctr, true))}
        ${kpiCard(t("cpc"), A.cpc, "money", deltaPill(A.cpc, P.cpc, false))}
        ${kpiCard(t("conv"), A.conv, "int", deltaPill(A.conv, P.conv, true))}
        ${kpiCard(t("cpa"), A.cpa, "money", deltaPill(A.cpa, P.cpa, false))}
      </section>
      <section class="card"><div class="card-h"><h2>${state.gChart === "cost" ? t("cost") : t("conv")} ${t("per_day")}</h2><span class="sub">${esc(dfmt(from))} – ${esc(dfmt(end))}</span><div class="right"><div class="seg">${[["cost", t("cost")], ["conv", t("conv")]].map(([k, l]) => `<button type="button" data-gchart="${k}" aria-pressed="${state.gChart === k}">${l}</button>`).join("")}</div></div></div><div class="card-b"><div class="chart" id="chG"></div></div></section>
      <section class="card"><div class="card-h"><h2>${t("g_campaigns")}</h2></div><div class="card-b" style="padding-top:8px"><div class="tbl-wrap"><table>
        <thead><tr>${th("name", t("col_campaign"))}<th>${t("col_type")}</th>${th("spend", t("cost"), 1)}${th("clicks", t("clicks"), 1)}${th("ctr", t("ctr"), 1)}${th("cpc", t("cpc"), 1)}${th("res", t("conv"), 1)}${th("cpl", t("cpa"), 1)}<th class="r">${t("f_lost")}</th></tr></thead>
        <tbody>${camps.map((c) => `<tr><td><div class="cell-name"><span class="t">${esc(c.name)}</span><span class="s">${c.status === "ENABLED" ? `<span class="pill good"><span class="dot"></span>${t("st_active")}</span>` : `<span class="pill neutral">${t("st_paused")}</span>`}</span></div></td><td><span class="pill neutral">${t("gt_" + c.type)}</span></td><td class="r">${money(c.cost)}</td><td class="r">${num(c.clicks)}</td><td class="r">${pct(c.ctr, 2)}</td><td class="r">${money(c.cpc)}</td><td class="r">${fc(c.conv)}</td><td class="r">${money(c.cpa)}</td><td class="r">${c.lost != null ? `<span class="${c.lost >= 0.2 ? "txt-bad" : ""}">${pct(c.lost, 0)}</span>` : "–"}</td></tr>`).join("") || `<tr><td colspan="9"><div class="empty">${t("no_camps")}</div></td></tr>`}</tbody></table></div></div></section>
      <section class="card"><div class="card-h"><h2>${t("g_terms")}</h2></div><div class="card-b" style="padding-top:8px"><div class="tbl-wrap"><table>
        <thead><tr><th>${t("col_term")}</th><th class="r">${t("clicks")}</th><th class="r">${t("cost")}</th><th class="r">${t("conv")}</th><th></th></tr></thead>
        <tbody>${terms.map((x) => `<tr><td><span class="term">${esc(x.term)}</span></td><td class="r">${num(x.clicks)}</td><td class="r">${money(conv(x.cost, x._cur))}</td><td class="r">${fc(x.conv)}</td><td>${x.conv === 0 && x.cost >= avgT * 0.5 ? `<span class="pill bad">${t("g_neg")}</span>` : ""}</td></tr>`).join("")}</tbody></table></div></div></section>
      ${strip(cl)}`;
  }
  function drawGoogle() {
    const cl = C(); if (!cl.gIdx.length) return;
    const end = state.end, from = addD(end, -(state.win - 1)), days = dayList(from, state.win);
    const s = new Map(days.map((d) => [d, [0, 0]]));
    for (const r of gRows(cl, from, end)) { const o = s.get(r.date); o[0] += conv(r.cost, r._cur); o[1] += r.conv; }
    const k = state.gChart === "cost" ? 0 : 1;
    mountChart("chG", (el) => barChart(el, { days, h: 200, series: [{ label: "Google", color: "var(--s-google)", vals: days.map((d) => s.get(d)[k]) }], fmt: (v, axis) => (k ? num(v, axis || !(v % 1) ? 0 : 1) : money(v, { dec: 0 })) }));
  }

  // ---------------------------------------------------------------- social
  function vSocial() {
    const cl = C(), end = state.end, from = addD(end, -(state.win - 1)), pFrom = addD(from, -state.win), pTo = addD(from, -1);
    if (!cl.social) {
      return `${clientHead(cl)}<section class="card connect-empty"><div class="ce-icons">${icon("fb")}${icon("ig")}</div><h2>${t("s_none_t")}</h2><p>${t("s_none_s")}</p>
        <ol class="ce-steps">${t("s_social_connect").map((s) => `<li>${esc(s)}</li>`).join("")}</ol>${state.preview ? "" : `<button class="btn primary" type="button" data-act="ob-open">${icon("plug")}${t("s_connect")}</button>`}</section>${strip(cl)}`;
    }
    const S = socialAgg(cl, from, end), P = socialAgg(cl, pFrom, pTo);
    const posts = [...S.posts].sort((a, b) => b[5] - a[5]);
    const avgI = cl.social.posts.length ? cl.social.posts.reduce((s, p) => s + p[5], 0) / cl.social.posts.length : 0;
    return `
      ${clientHead(cl)}
      <section class="grid-kpi">
        ${kpiCard(`${icon("fb")} Facebook · ${t("s_followers")}`, S.fbF, "int", `<span class="delta good">+${num(S.fbG)}</span> <span>${t("days", { n: state.win })}</span>`)}
        ${kpiCard(`${icon("ig")} Instagram · ${t("s_followers")}`, S.igF, "int", `<span class="delta good">+${num(S.igG)}</span> <span>${t("days", { n: state.win })}</span>`)}
        ${kpiCard(t("s_reach"), S.reach, "compact", deltaPill(S.reach, P.reach, true), `Facebook ${compact(S.fbReach)} · Instagram ${compact(S.igReach)}`)}
        ${kpiCard(t("s_inter_rate"), S.rate, "pct", deltaPill(S.rate, P.rate, true), `${num(S.posts.length)} ${t("s_posts")}`)}
      </section>
      <section class="card"><div class="card-h"><h2>${t("s_reach")} ${t("per_day")}</h2><span class="sub">${esc(dfmt(from))} – ${esc(dfmt(end))}</span></div><div class="card-b"><div class="legend"><span><i style="background:var(--s-fb)"></i>Facebook</span><span><i style="background:var(--s-ig)"></i>Instagram</span></div><div class="chart" id="chS"></div></div></section>
      <section class="card"><div class="card-h"><h2>${t("s_top")}</h2><span class="sub">${num(posts.length)}</span></div><div class="card-b" style="padding-top:8px"><div class="tbl-wrap"><table>
        <thead><tr><th>${t("col_post")}</th><th>${t("col_platform")}</th><th>${t("col_format")}</th><th class="r">${t("s_reach")}</th><th class="r">${t("f_inter")}</th><th class="r">${t("col_rate")}</th></tr></thead>
        <tbody>${posts.map((p) => `<tr><td><div class="cell-name"><span class="t">${esc(p[3])} ${p[5] >= avgI * 2.5 ? `<span class="pill good">${t("top")}</span>` : ""}</span><span class="s">${esc(dmed(p[0]))}</span></div></td><td><span class="chp">${icon(p[1] === "ig" ? "ig" : "fb")}${p[1] === "ig" ? "Instagram" : "Facebook"}</span></td><td>${t("fmt_" + p[2])}</td><td class="r">${num(p[4])}</td><td class="r">${num(p[5])}</td><td class="r">${pct(p[4] ? p[5] / p[4] : null, 1)}</td></tr>`).join("") || `<tr><td colspan="6" class="muted">–</td></tr>`}</tbody></table></div></div></section>
      ${strip(cl)}`;
  }
  function drawSocial() {
    const cl = C(); if (!cl.social) return;
    const end = state.end, from = addD(end, -(state.win - 1)), days = dayList(from, state.win);
    const f = new Map(cl.social.fb.map((x) => [x[0], x[2]])), i = new Map(cl.social.ig.map((x) => [x[0], x[2]]));
    mountChart("chS", (el) => barChart(el, { days, h: 200, series: [{ label: "Facebook", color: "var(--s-fb)", vals: days.map((d) => f.get(d) || 0) }, { label: "Instagram", color: "var(--s-ig)", vals: days.map((d) => i.get(d) || 0) }], fmt: (v) => compact(v) }));
  }

  // ---------------------------------------------------------------- reports
  function weeks(cl) {
    return Array.from({ length: 8 }, (_, w) => { const to = addD(state.end, -7 * w), from = addD(to, -6); return { from, to, a: aggAll(cl, from, to), p: aggAll(cl, addD(from, -7), addD(from, -1)), s: socialAgg(cl, from, to) }; });
  }
  function vReports() {
    const cl = C(), ws = weeks(cl), w = ws[Math.min(state.repWeek, 7)];
    const d = w.a.cpr != null && w.p.cpr != null ? w.a.cpr / w.p.cpr - 1 : null;
    const delta = d == null || Math.abs(d) < 0.02 ? "" : t(d < 0 ? "rep_better" : "rep_worse", { pct: pct0(d) });
    const sum = !w.a.spend ? t("rep_none") : t("rep_sum", { n: num(w.a.req, 0), spend: money(w.a.spend), cpr: money(w.a.cpr), delta });
    const acts = openActions(cl, w.to).slice(0, 3);
    return `
      ${clientHead(cl)}
      <div class="rep">
        <section class="card rep-list">${ws.map((x, i) => `<button class="rep-item" type="button" data-week="${i}" aria-current="${i === state.repWeek}"><span class="t"><span>${t("rep_title", { w: isoWeek(x.to) })}</span>${deltaMini(x.a.cpr, x.p.cpr, false)}</span><span class="s">${esc(dfmt(x.from))} – ${esc(dfmt(x.to))} · ${num(x.a.req, 0)} ${t("requests")}</span></button>`).join("")}</section>
        <article class="card doc">
          <div class="meta"><span class="pill neutral">${icon("send")} ${t("rep_sent")}</span><span>${esc(cl.name)}</span></div>
          <h3>${t("rep_title", { w: isoWeek(w.to) })} · ${esc(dfmt(w.from, { day: "numeric", month: "long" }))} – ${esc(dmed(w.to))}</h3>
          <p>${esc(sum)}</p>
          <div class="doc-kpis">
            <div><span class="k">${t("requests")}</span><span class="v">${num(w.a.req, 0)}</span>${deltaMini(w.a.req, w.p.req, true)}</div>
            <div><span class="k">${t("cpr")}</span><span class="v">${money(w.a.cpr)}</span>${deltaMini(w.a.cpr, w.p.cpr, false)}</div>
            <div><span class="k">${t("budget")}</span><span class="v">${money(w.a.spend)}</span></div>
            <div><span class="k">${t("reach_org")}</span><span class="v">${w.s ? compact(w.s.reach) : "–"}</span></div>
          </div>
          <div><div class="eyebrow" style="margin-bottom:8px">${t("rep_channels")}</div><div class="tbl-wrap"><table class="mini-tbl">
            <tr><td>${chPill("meta")}</td><td class="r">${num(w.a.m.res)} ${t("leads")}</td><td class="r">${money(w.a.m.spend)}</td><td class="r">${money(w.a.m.cpl)}</td></tr>
            <tr><td>${chPill("google")}</td><td class="r">${num(w.a.g.conv, 0)} ${t("conv")}</td><td class="r">${money(w.a.g.cost)}</td><td class="r">${money(w.a.g.cpa)}</td></tr>
            ${w.s ? `<tr><td>${chPill("instagram")}</td><td class="r">${compact(w.s.igReach)} ${t("s_reach")}</td><td class="r" colspan="2">${num(w.s.posts.length)} ${t("s_posts")}</td></tr>` : ""}
          </table></div></div>
          <div><div class="eyebrow" style="margin-bottom:8px">${t("rep_daily")}</div><div class="chart" id="chRep"></div></div>
          <div style="display:grid;gap:10px"><div class="eyebrow">${t("rep_top")}</div>${acts.length ? `<ol>${acts.map((a) => { const x = txt(a); return `<li><b>${esc(x.title)}</b><br>${esc(x.why)}</li>`; }).join("")}</ol>` : `<p>${t("rep_noact")}</p>`}</div>
        </article>
      </div>${strip(cl)}`;
  }
  function drawRep() {
    const cl = C(), w = weeks(cl)[state.repWeek], days = dayList(w.from, 7);
    mountChart("chRep", (el) => barChart(el, { days, h: 150, series: [{ label: "Meta", color: "var(--s-meta)", vals: days.map((d) => aggM(mRows(cl, d, d)).res) }, { label: "Google", color: "var(--s-google)", vals: days.map((d) => aggG(gRows(cl, d, d)).conv) }], fmt: (v, axis) => num(v, axis || !(v % 1) ? 0 : 1) }));
  }

  // ---------------------------------------------------------------- log
  function vLog() {
    const cl = C();
    let list = DEMO.log.filter((e) => e.client === cl.id).map((e) => ({ ...e }));
    if (!cl.demo) {
      list.push({ at: RAW.generatedAt, type: "system", kind: "sync" });
      if (cl.metaIdx.length) list.push({ at: new Date(Date.parse(RAW.generatedAt) - 6e5).toISOString(), type: "system", kind: "realConnect" });
      if (cl.gIdx.length) list.push({ at: new Date(Date.parse(RAW.generatedAt) - 3e5).toISOString(), type: "system", kind: "realGoogle" });
    }
    for (const c of (typeof live !== "undefined" ? live.campaigns : [])) if (c.client === cl.id && c.status !== "draft") list.push({ at: c.updatedAt || c.createdAt, type: "decision", kind: "campaign", status: c.status, name: c.name || c.topic || "—", by: c.by });
    for (const r of (typeof live !== "undefined" ? live.research : [])) if (r.client === cl.id) list.push({ at: r.at, type: "system", kind: "research", q: r.query, n: r.ads.length });
    for (const [k, d] of Object.entries(state.decisions)) if (k.startsWith(cl.id + "|")) list.push({ at: d.at, type: "decision", kind: "user", status: d.status, title: d.title, reason: d.reason, key: k, by: d.by });
    if (state.logFilter === "dec") list = list.filter((e) => e.type === "decision");
    if (state.logFilter === "sys") list = list.filter((e) => e.type === "system");
    list.sort((a, b) => (a.at < b.at ? 1 : -1));
    const line = (e) => {
      let text = "", who = t("system"), ic = "sync", cls = "info", sub = "";
      const M = {
        connect: () => { text = t("lg_connect"); ic = "plug"; }, connectGoogle: () => { text = t("lg_connectGoogle"); ic = "google"; },
        realConnect: () => { text = t("lg_real_connect"); ic = "lock"; }, realGoogle: () => { text = t("lg_real_google"); ic = "lock"; },
        firstRun: () => { text = t("lg_firstRun", { n: e.n }); who = t("rules"); ic = "bolt"; }, report: () => { text = t("lg_report"); ic = "send"; },
        sync: () => { text = t("lg_sync"); },
        measure: () => { text = t("lg_measure", { text: e.text[state.lang] || e.text.de }); who = t("you"); ic = "check"; cls = "good"; },
        pauseRejected: () => { text = t("lg_pauseRejected", { ad: e.adName }); who = t("clientUser"); ic = "x"; cls = "bad"; sub = t("lg_reason", { r: t("r_" + e.reason) }); },
        budgetUp: () => { text = t("lg_budgetUp", { ad: e.adName, pct: e.pct }); who = t("clientUser"); ic = "check"; cls = "good"; },
        negKw: () => { text = t("lg_negKw", { term: e.term }); who = t("you"); ic = "google"; cls = "good"; },
        campaign: () => { text = t(e.status === "approved" ? "lg_campaign_approved" : e.status === "changes" ? "lg_campaign_changes" : "lg_campaign_sent", { n: e.name }); who = e.by === "client" ? t("clientUser") : t("you"); ic = e.status === "changes" ? "x" : e.status === "approved" ? "check" : "send"; cls = e.status === "changes" ? "bad" : e.status === "approved" ? "good" : "info"; },
        research: () => { text = t("lg_research", { q: e.q, n: e.n }); who = t("you"); ic = "radar"; },
        user: () => { const title = e.title?.[state.lang] || e.title?.de || ""; text = t("lg_dec_" + e.status, { title }); who = e.by === "client" ? t("clientUser") : t("you"); ic = e.status === "rejected" ? "x" : "check"; cls = e.status === "rejected" ? "bad" : "good"; sub = e.reason ? t("lg_reason", { r: t("r_" + e.reason) }) : ""; },
      };
      (M[e.kind] || (() => {}))();
      return `<div class="log-item"><span class="log-time">${esc(dtime(e.at))}</span><span class="log-ic ${cls}">${icon(ic)}</span><div class="log-main"><span class="t">${esc(text)}</span><span class="s">${esc(who)}${sub ? ` · ${esc(sub)}` : ""}${e.kind === "user" ? ` · <button class="undo" type="button" data-undo="${esc(e.key)}">${t("undo")}</button>` : ""}</span></div></div>`;
    };
    return `${clientHead(cl)}
      <div class="seg" style="justify-self:start">${["all", "dec", "sys"].map((k) => `<button type="button" data-lf="${k}" aria-pressed="${state.logFilter === k}">${t("log_" + k)}</button>`).join("")}</div>
      <section class="card log">${list.map(line).join("") || `<div class="empty">${t("log_empty")}</div>`}</section>${strip(cl)}`;
  }

  // ---------------------------------------------------------------- settings
  function vSettings() {
    const cl = C(), pv = state.preview;
    const as = { ...(cl.assumptions || {}), ...(state.assumptions[cl.id] || {}) };
    const sw = (k) => `<button class="switch" type="button" role="switch" aria-checked="${!!state.notify[k]}" data-sw="${k}" aria-label="${t("n_" + k)}"></button>`;
    const src = (ic, name, sub, on) => `<div class="acc-line">${icon(ic)}<div class="grow"><span class="t">${esc(name)}</span><span class="s">${esc(sub)}</span></div>${on ? `<span class="pill good"><span class="dot"></span>${t("connected")}</span>` : `<span class="pill neutral">${t("not_connected")}</span>${pv ? "" : `<button class="btn sm" type="button" data-act="ob-open">${t("connect")}</button>`}`}</div>`;
    const accTxt = cl.access?.status === "active" ? t("users_n", { n: cl.access.users }) : cl.access?.status === "invited" ? t("invited") : t("no_access");
    const pctVal = (v) => (v == null || v === "" ? "" : Math.round(v * 100));
    return `${clientHead(cl)}
      <section class="card">
        ${pv ? "" : `<div class="set-row"><div><h3>${t("set_general")}</h3><p>${t("set_general_d")}</p></div><div class="set-ctl">
          <div class="seg" style="justify-self:start">${[["de", "Deutsch"], ["en", "English"], ["tr", "Türkçe"]].map(([l, n]) => `<button type="button" data-lang="${l}" aria-pressed="${state.lang === l}">${n}</button>`).join("")}</div>
          <div class="seg" style="justify-self:start">${["EUR", "CHF"].map((c) => `<button type="button" data-cur="${c}" aria-pressed="${state.cur === c}">${c}</button>`).join("")}</div>
          <div class="field-row"><div class="field"><label for="fxCHF">1 EUR =</label><div class="input"><input id="fxCHF" data-fx="CHF" inputmode="decimal" value="${state.fx.CHF}"><span>CHF</span></div></div>
          <div class="field"><label for="fxTRY">1 EUR =</label><div class="input"><input id="fxTRY" data-fx="TRY" inputmode="decimal" value="${state.fx.TRY}"><span>TRY</span></div></div>
          <div class="field"><label for="endDate">${t("set_end")}</label><div class="input"><input id="endDate" type="date" min="${addD(RAW.since, 30)}" max="${RAW.until}" value="${state.end}" style="font-family:var(--sans)"></div></div></div>
          <p class="footnote" style="margin:0">${t("set_fx_d")}</p>
        </div></div>`}
        <div class="set-row"><div><h3>${t("set_target")}</h3><p>${t("set_target_d")}</p></div><div class="set-ctl">
          ${cl.metaIdx.map((i) => { const a = ACC[i]; return `<div class="field"><label for="tg-${esc(a.id)}">${esc(a.name)}</label><div class="input"><input id="tg-${esc(a.id)}" data-target="${esc(a.id)}" inputmode="decimal" placeholder="${t("auto")}" value="${esc(state.targets[a.id] ?? cl.targets?.[a.id] ?? "")}"><span>${a.currency}</span></div></div>`; }).join("") || `<span class="muted">–</span>`}
        </div></div>
        <div class="set-row"><div><h3>${t("set_assume")}</h3><p>${t("set_assume_d")}</p></div><div class="set-ctl"><div class="field-row">
          <div class="field"><label for="asB">${t("as_book")}</label><div class="input"><input id="asB" data-as="booking" inputmode="decimal" value="${pctVal(as.booking)}" placeholder="30"><span>%</span></div></div>
          <div class="field"><label for="asC">${t("as_close")}</label><div class="input"><input id="asC" data-as="close" inputmode="decimal" value="${pctVal(as.close)}" placeholder="40"><span>%</span></div></div>
          <div class="field"><label for="asV">${t("as_value")}</label><div class="input"><input id="asV" data-as="value" inputmode="decimal" value="${as.value ?? ""}" placeholder="–"><span>${cl.currency}</span></div></div>
        </div></div></div>
        ${pv ? "" : `<div class="set-row"><div><h3>${t("set_access")}</h3><p>${t("set_access_d")}</p></div><div class="set-ctl">
          <div class="acc-line">${icon("user")}<div class="grow"><span class="t">${esc(cl.name)}</span><span class="s">${esc(accTxt)}</span></div><button class="btn sm" type="button" data-act="invite">${icon("send")}${t("invite")}</button></div>
          <div><button class="btn sm ghost" type="button" data-act="preview">${icon("eye")}${t("preview_btn")}</button></div>
        </div></div>`}
        <div class="set-row"><div><h3>${t("set_sources")}</h3><p>${t("set_sources_d")}</p></div><div class="set-ctl">
          ${cl.metaIdx.map((i) => src("meta", ACC[i].name, `Meta · ${ACC[i].id} · ${ACC[i].currency}`, true)).join("") || src("meta", "Meta Ads", "–", false)}
          ${cl.gIdx.map((i) => src("google", GC[i].name, `Google Ads · ${GC[i].id} · ${GC[i].currency}`, true)).join("") || src("google", "Google Ads", "–", false)}
          ${src("fb", "Facebook", t("ob_fb_d"), !!cl.social)}${src("ig", "Instagram", t("ob_ig_d"), !!cl.social)}
        </div></div>
        <div class="set-row"><div><h3>${t("set_notify")}</h3><p>${t("set_notify_d")}</p></div><div class="set-ctl">${["daily", "weekly", "telegram"].map((k) => `<div class="toggle-line"><span>${t("n_" + k)}</span>${sw(k)}</div>`).join("")}</div></div>
        <div class="set-row"><div><h3>${t("set_sec")}</h3></div><div class="set-ctl"><div class="secure">${icon("lock")}<span>${t("sec_text")}</span></div></div></div>
      </section>`;
  }

  // ---------------------------------------------------------------- onboarding
  function onboarding() {
    const ob = state.ob, steps = t("ob_steps");
    let body = "";
    if (ob.step === 0) {
      body = `<span class="ob-banner">${t("ob_preview")}</span><h2>${t("ob1_h")}</h2>
        <div class="field"><label for="obName">${t("ob_name")}</label><div class="input wide"><input id="obName" data-ob="name" value="${esc(ob.name)}" style="font-family:var(--sans)"></div></div>
        <div class="field-row"><div class="field"><label for="obSector">${t("ob_sector")}</label><div class="input"><select id="obSector" data-ob="sector">${["implant", "dental", "hair", "aesthetic", "eye"].map((s) => `<option value="${s}" ${ob.sector === s ? "selected" : ""}>${t("sector_" + s)}</option>`).join("")}</select></div></div>
        <div class="field"><label for="obCity">${t("ob_city")}</label><div class="input"><input id="obCity" data-ob="city" value="${esc(ob.city)}" style="font-family:var(--sans)"></div></div></div>`;
    } else if (ob.step === 1) {
      const row = (k, ic, name, d) => `<div class="ob-src">${icon(ic)}<div class="grow"><b>${name}</b><span>${d}</span></div>${ob.conn[k] === "ok" ? `<span class="pill good">${icon("check")}${t("connected")}</span>` : ob.conn[k] === "wait" ? `<span class="btn sm" aria-busy="true"><span class="spin"></span>${t("connecting")}</span>` : `<button class="btn sm" type="button" data-obconn="${k}">${t("connect")}</button>`}</div>`;
      body = `<h2>${t("ob2_h")}</h2><p>${t("ob2_p")}</p><div class="ob-srcs">${row("meta", "meta", "Meta Ads", t("ob_meta_d"))}${row("google", "google", "Google Ads", t("ob_google_d"))}${row("fb", "fb", "Facebook", t("ob_fb_d"))}${row("ig", "ig", "Instagram", t("ob_ig_d"))}</div>`;
    } else if (ob.step === 2) {
      body = `<h2>${t("ob3_h")}</h2><p>${t("ob3_p")}</p><div class="field"><label for="obTarget">${t("ob_target")}</label><div class="input"><input id="obTarget" data-ob="target" inputmode="decimal" placeholder="${t("auto")}" value="${esc(ob.target)}"><span>${state.cur}</span></div></div>`;
    } else {
      body = `<h2>${t("ob4_h")}</h2><p>${t("ob4_p")}</p><div class="field"><label for="obMail">${t("ob_email")}</label><div class="input wide"><input id="obMail" data-ob="email" type="email" value="${esc(ob.email)}" style="font-family:var(--sans)"></div></div>`;
    }
    return `<div class="ob-wrap" role="dialog" aria-modal="true" aria-label="${t("ob_t")}"><div class="ob">
      <div class="ob-steps"><div class="brand"><div class="brand-mark">${icon("logo")}</div><div class="brand-name">${t("ob_t")}</div></div>
        ${steps.map((s, i) => `<div class="ob-step ${i === ob.step ? "on" : i < ob.step ? "done" : ""}"><span class="n">${i < ob.step ? "✓" : i + 1}</span><span>${esc(s)}</span></div>`).join("")}</div>
      <div class="ob-main">${body}
        <div class="ob-foot"><span class="note">${ob.step + 1} / 4</span>
          ${ob.step === 0 ? `<button class="btn ghost" type="button" data-act="ob-close">${t("cancel")}</button>` : `<button class="btn ghost" type="button" data-act="ob-back">${t("back")}</button>`}
          ${ob.step < 3 ? `<button class="btn accent" type="button" data-act="ob-next">${t("next")} ${icon("arrow")}</button>` : `<button class="btn accent" type="button" data-act="ob-finish">${t("ob_done")}</button>`}
        </div></div></div></div>`;
  }

  // ================================================================ render
  const VIEWS = { overview: vOverview, plan: vPlan, meta: vMeta, google: vGoogle, social: vSocial, reports: vReports, log: vLog, settings: vSettings };
  const DRAW = { overview: () => { drawMain(); drawBA(); }, meta: drawMeta, google: drawGoogle, social: drawSocial, reports: drawRep };
  /*__STUDIO__*/

  const lastCount = new Map();
  function render(opts = {}) {
    const focusId = document.activeElement?.id;
    const sel = focusId && document.activeElement.selectionStart;
    shell();
    charts.clear(); ro.disconnect();
    const v = document.getElementById("view");
    const cl = C();
    v.innerHTML = cl ? VIEWS[state.view]() : vClients();
    if (opts.still) v.style.animation = "none";
    if (cl && DRAW[state.view]) DRAW[state.view]();
    for (const id of charts.keys()) { const el = document.getElementById(id); if (el) ro.observe(el); }
    countUp();
    if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); if (sel != null && el.setSelectionRange) try { el.setSelectionRange(sel, sel); } catch {} } }
  }
  function countUp() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll("[data-count]").forEach((el, i) => {
      const to = parseFloat(el.dataset.count);
      if (!isFinite(to)) return;
      const k = (state.client || "") + state.view + i;
      const from = lastCount.has(k) ? lastCount.get(k) : to * 0.6;
      lastCount.set(k, to);
      if (from === to) return;
      const f = el.dataset.fmt, t0 = performance.now();
      const step = (now) => { const p = Math.min(1, (now - t0) / 520), e = 1 - Math.pow(1 - p, 3); el.textContent = fmtVal(from + (to - from) * e, f); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }
  function toast(msg, ic = "check") {
    const box = document.getElementById("toasts");
    const el = document.createElement("div");
    el.className = "toast"; el.innerHTML = `${icon(ic)}<span>${esc(msg)}</span>`;
    box.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 260); }, 2600);
  }
  function decide(key, status, reason) {
    const cl = C();
    const a = buildPlan(cl, key.split("|")[3]).find((x) => x.key === key);
    const prev = state.decisions[key];
    const title = a ? tAll(...a.titleK) : prev?.title;
    state.decisions = { ...state.decisions, [key]: { status, at: new Date().toISOString(), title, reason: reason ?? prev?.reason ?? null, by: state.preview ? "client" : "agency" } };
    store.set("decisions", state.decisions);
    state.reasonFor = null;
    const card = document.querySelector(`[data-rec="${CSS.escape(key)}"]`);
    const done = () => { render({ still: true }); toast(status === "approved" ? t("toast_ok") : status === "done" ? t("toast_done") : t("toast_no"), status === "rejected" ? "x" : "check"); };
    if (card && !matchMedia("(prefers-reduced-motion: reduce)").matches) { card.classList.add("leaving"); setTimeout(done, 280); } else done();
  }
  const go = (view, client) => {
    if (client !== undefined) { state.client = client || null; store.set("client", state.client); state.repWeek = 0; state.planCh = "all"; state.search = ""; if (!state.client) state.preview = false; }
    if (view) { state.view = view; store.set("view", view); }
    state.menu = false; state.pop = false; state.reasonFor = null;
    try { history.replaceState(null, "", "#" + (state.client ? state.view : "clients")); } catch {}
    render(); scrollTo({ top: 0 });
  };

  // ================================================================ events
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-nav],[data-act],[data-win],[data-cur],[data-lang],[data-client],[data-chart],[data-gchart],[data-dec],[data-reason],[data-undo],[data-done],[data-ptab],[data-pch],[data-sort],[data-cf],[data-lf],[data-week],[data-sw],[data-setend],[data-obconn]");
    if (!el) { if (state.pop && !e.target.closest("#clSel")) { state.pop = false; render({ still: true }); } return; }
    const d = el.dataset;
    if (d.nav) { e.preventDefault(); if (d.nav === "clients") go(null, null); else go(d.nav); return; }
    if (d.client !== undefined) { e.preventDefault(); go(d.client ? (VIEWS_CLIENT.includes(state.view) ? state.view : "overview") : null, d.client); return; }
    if (d.win) { state.win = +d.win; store.set("win", state.win); render({ still: true }); return; }
    if (d.cur) { state.cur = d.cur; store.set("cur", d.cur); render({ still: true }); return; }
    if (d.lang) { state.lang = d.lang; store.set("lang", d.lang); render({ still: true }); return; }
    if (d.chart) { state.chart = d.chart; render({ still: true }); return; }
    if (d.gchart) { state.gChart = d.gchart; render({ still: true }); return; }
    if (d.dec === "approve") { decide(d.key, "approved"); return; }
    if (d.dec === "reject") { state.reasonFor = d.key; render({ still: true }); return; }
    if (d.reason !== undefined && d.key) { decide(d.key, "rejected", d.reason || null); return; }
    if (d.done) { decide(d.done, "done"); return; }
    if (d.undo) { const n = { ...state.decisions }; delete n[d.undo]; state.decisions = n; store.set("decisions", n); render({ still: true }); toast(t("toast_undo"), "undo"); return; }
    if (d.ptab) { state.planTab = d.ptab; state.reasonFor = null; render({ still: true }); return; }
    if (d.pch) { state.planCh = d.pch; render({ still: true }); return; }
    if (d.sort) { state.sort = state.sort.key === d.sort ? { key: d.sort, dir: -state.sort.dir } : { key: d.sort, dir: d.sort === "name" || d.sort === "obj" ? 1 : -1 }; render({ still: true }); return; }
    if (d.cf) { state.campFilter = d.cf; render({ still: true }); return; }
    if (d.lf) { state.logFilter = d.lf; render({ still: true }); return; }
    if (d.week) { state.repWeek = +d.week; render({ still: true }); return; }
    if (d.sw) { state.notify = { ...state.notify, [d.sw]: !state.notify[d.sw] }; store.set("notify", state.notify); el.setAttribute("aria-checked", String(state.notify[d.sw])); return; }
    if (d.setend) { state.end = d.setend; store.set("end", d.setend); planCache.clear(); render({ still: true }); return; }
    if (d.obconn) { const k = d.obconn; state.ob.conn[k] = "wait"; render({ still: true }); setTimeout(() => { if (state.ob) { state.ob.conn[k] = "ok"; render({ still: true }); } }, 1100); return; }
    switch (d.act) {
      case "pop": state.pop = !state.pop; render({ still: true }); break;
      case "menu": state.menu = true; render({ still: true }); break;
      case "menu-close": state.menu = false; render({ still: true }); break;
      case "preview": state.preview = !state.preview; if (state.preview && state.view === "log") state.view = "overview"; state.menu = false; render(); scrollTo({ top: 0 }); break;
      case "theme":
        state.theme = state.theme == null ? "light" : state.theme === "light" ? "dark" : null;
        if (state.theme) document.documentElement.dataset.theme = state.theme; else delete document.documentElement.dataset.theme;
        store.set("theme", state.theme); render({ still: true }); break;
      case "reason-cancel": state.reasonFor = null; render({ still: true }); break;
      case "invite": toast(t("invite_toast"), "send"); break;
      case "assign": state.ob = { step: 0, name: UNASSIGNED[0]?.name || "", sector: "dental", city: "", target: "", email: "", conn: { meta: "ok" } }; render({ still: true }); break;
      case "ob-open": state.ob = { step: 0, name: "", sector: "implant", city: "", target: "", email: "", conn: {} }; state.menu = false; render({ still: true }); break;
      case "ob-close": state.ob = null; render({ still: true }); break;
      case "ob-back": state.ob.step = Math.max(0, state.ob.step - 1); render({ still: true }); break;
      case "ob-next": state.ob.step = Math.min(3, state.ob.step + 1); render({ still: true }); break;
      case "ob-finish": state.ob = null; render({ still: true }); toast(t("ob_done_toast"), "check"); break;
    }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.id === "q") { state.search = el.value; render({ still: true }); return; }
    if (el.dataset.ob && state.ob) { state.ob[el.dataset.ob] = el.value; }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    const numv = (v) => parseFloat(String(v).replace(",", "."));
    if (el.dataset.fx) { const v = numv(el.value); if (v > 0) { state.fx = { ...state.fx, [el.dataset.fx]: v }; store.set("fx", state.fx); planCache.clear(); render({ still: true }); } return; }
    if (el.dataset.target) { const v = String(el.value).trim(); state.targets = { ...state.targets, [el.dataset.target]: v === "" ? "" : numv(v) }; store.set("targets", state.targets); planCache.clear(); render({ still: true }); return; }
    if (el.dataset.as) { const cl = C(), k = el.dataset.as, raw = String(el.value).trim(); const v = raw === "" ? "" : k === "value" ? numv(raw) : numv(raw) / 100; state.assumptions = { ...state.assumptions, [cl.id]: { ...(state.assumptions[cl.id] || {}), [k]: v } }; store.set("assumptions", state.assumptions); render({ still: true }); return; }
    if (el.id === "endDate" && el.value) { state.end = el.value; store.set("end", el.value); planCache.clear(); render({ still: true }); return; }
    if (el.dataset.ob && state.ob) { state.ob[el.dataset.ob] = el.value; }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.ob) { state.ob = null; render({ still: true }); }
      else if (state.pop || state.menu || state.reasonFor) { state.pop = false; state.menu = false; state.reasonFor = null; render({ still: true }); }
    }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches?.("tr[data-client]")) { e.preventDefault(); e.target.click(); }
  });
  addEventListener("hashchange", () => {
    const v = location.hash.slice(1);
    if (v === "clients" && state.client) go(null, null);
    else if (VIEWS_CLIENT.includes(v) && state.client && v !== state.view) go(v);
  });

  render();
})();
