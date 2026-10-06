(() => {
  "use strict";
  const RAW = window.__ADS_DATA__;
  const DAY = 864e5;
  const addD = (s, n) => new Date(Date.parse(s) + n * DAY).toISOString().slice(0, 10);
  const MSG = "onsite_conversion.messaging_conversation_started_7d";

  // ---------------------------------------------------------------- storage
  const store = {
    get(k, d) { try { const v = localStorage.getItem("adsPanel2:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("adsPanel2:" + k, JSON.stringify(v)); } catch {} },
  };

  // ---------------------------------------------------------------- data
  const realLastSpend = RAW.rows.reduce((m, r) => (r[2] > 0 && r[0] > m ? r[0] : m), RAW.since);
  const DEMO = buildDemo({ since: RAW.since, until: RAW.until });
  const ACC = [
    ...RAW.accounts.map((a) => ({ ...a, demo: false, sector: "dental", city: "İstanbul", target: null, measure: null })),
    ...DEMO.accounts,
  ];
  const nReal = RAW.accounts.length;
  const CAMPS = [...RAW.campaigns, ...DEMO.campaigns.map((c) => [c[0], c[1], c[2], c[3], c[4] + nReal])];
  const ADS = [...RAW.ads, ...DEMO.ads.map((a) => [a[0], a[1], a[2], a[3] + RAW.campaigns.length])];
  const RROWS = [...RAW.rows, ...DEMO.rows.map((r) => [r[0], r[1] + RAW.ads.length, ...r.slice(2)])];

  const ROWS = RROWS.map(([date, ai, spend, imp, freq, clicks, leads, msgs]) => {
    const [ad_id, ad_name, adset_id, ci] = ADS[ai];
    const [campaign_id, campaign_name, objective, optimization_goal, acci] = CAMPS[ci];
    const a = ACC[acci];
    const actions = [];
    if (leads) actions.push({ action_type: "lead", value: String(leads) });
    if (msgs) actions.push({ action_type: MSG, value: String(msgs) });
    return {
      date_start: date, account_id: a.id.replace("act_", ""), account_name: a.name, account_currency: a.currency, acci,
      campaign_id, campaign_name, objective, optimization_goal, adset_id, ad_id, ad_name,
      spend: String(spend), impressions: String(imp), frequency: String(freq), inline_link_clicks: String(clicks), actions,
      _spend: spend, _imp: imp, _clicks: clicks, _leads: leads, _msgs: msgs, _res: leads + msgs, _cur: a.currency,
      _measured: measuresResults({ objective, optimization_goal }),
    };
  });
  const accKey = (a) => `act_${String(a.id).replace(/^act_/, "")}`; // analyze() hesap kimligi
  const maxDate = ROWS.reduce((m, r) => (r._spend > 0 && r.date_start > m ? r.date_start : m), RAW.since);

  // ---------------------------------------------------------------- state
  const state = {
    view: ["overview", "campaigns", "recs", "reports", "log", "settings"].includes(location.hash.slice(1)) ? location.hash.slice(1) : store.get("view", "overview"),
    lang: store.get("lang", "de"),
    cur: store.get("cur", "EUR"),
    account: store.get("account", "all"),
    win: store.get("win", 30),
    end: store.get("end", maxDate),
    theme: store.get("theme", null),
    fx: store.get("fx", { EUR: 1, CHF: 0.93, TRY: 52.5 }),
    targets: store.get("targets", {}),
    decisions: store.get("decisions", {}),
    notify: store.get("notify", { daily: true, weekly: true, telegram: true }),
    recTab: "open",
    chart: "spend",
    sort: { key: "spend", dir: -1 },
    search: "",
    campFilter: "all",
    logFilter: "all",
    repWeek: 0,
    menu: false,
    pop: false,
    reasonFor: null,
    ob: null,
  };
  if (state.account !== "all" && !ACC.some((a) => a.id === state.account)) state.account = "all";
  if (state.end > RAW.until || state.end < addD(RAW.since, 13)) state.end = maxDate;
  if (state.theme) document.documentElement.dataset.theme = state.theme;

  // ---------------------------------------------------------------- i18n
  const LOC = { de: "de-DE", en: "en-GB", tr: "tr-TR" };
  const T = {
    de: {
      nav_overview: "Übersicht", nav_campaigns: "Kampagnen", nav_recs: "Empfehlungen", nav_reports: "Berichte", nav_log: "Protokoll", nav_settings: "Einstellungen",
      workspace: "Arbeitsbereich", brand_sub: "Werbe-Cockpit für Kliniken",
      connect: "Konto verbinden", connect_sub: "Meta-Werbekonto hinzufügen",
      all_accounts: "Alle Konten", accounts_n: "{n} Konten", real_group: "MediDent (echte Daten)", demo_group: "Demo-Konten (fiktiv)",
      demo: "Demo", real: "Echt", days: "{n} T",
      spend: "Ausgaben", leads: "Leads", cpl: "Kosten pro Lead", ctr: "Klickrate", freq: "Frequenz", impressions: "Impressionen",
      vs_prev: "ggü. Vorperiode", no_prev: "keine Vorperiode", unchanged: "unverändert",
      status_title: "Tagesstatus", happened: "Was ist passiert", means: "Was das bedeutet", decide: "Ihre Entscheidung",
      st_ok: "Im Plan", st_watch: "Beobachten", st_act: "Handlung nötig",
      head_spend: "{spend} ausgegeben, {leads} Leads.",
      head_cpl_better: "Kosten pro Lead {pct} unter dem 7-Tage-Schnitt.",
      head_cpl_worse: "Kosten pro Lead {pct} über dem 7-Tage-Schnitt.",
      head_cpl_flat: "Kosten pro Lead auf dem Niveau der letzten 7 Tage.",
      head_noleads: "Ausgaben ohne Lead an diesem Tag.",
      head_nospend: "Keine Ausgaben an diesem Tag.",
      mean_target_ok: "Die Kosten pro Lead der letzten 7 Tage ({cpl}) liegen im Zielbereich.",
      mean_target_bad: "Die Kosten pro Lead der letzten 7 Tage ({cpl}) liegen {pct} über dem Ziel ({target}).",
      mean_high: "{n} Anzeigen kosten Geld ohne Ergebnis – hier liegt das größte Einsparpotenzial.", mean_high_1: "Eine Anzeige kostet Geld ohne Ergebnis – hier liegt das größte Einsparpotenzial.", mean_win_1: "Eine Anzeige liefert deutlich günstiger als der Schnitt und verträgt mehr Budget.", dec_open_1: "Eine offene Empfehlung:", avg7: "Ø 7 Tage: {v}",
      mean_win: "{n} Anzeigen liefern deutlich günstiger als der Schnitt und vertragen mehr Budget.",
      mean_none: "Keine Auffälligkeiten in den Anzeigen.",
      mean_nodata: "Für diesen Tag liegen keine Ausgaben vor.",
      dec_none: "Heute ist keine Entscheidung offen.",
      dec_open: "{n} offene Empfehlungen, die wichtigste:",
      approve: "Annehmen", reject: "Ablehnen", see_all: "Alle ansehen", undo: "Rückgängig",
      ba_title: "Vorher / Nachher", ba_measure: "Seit der Maßnahme am {date}", ba_period: "Vorperiode gegenüber aktueller Periode", before: "Vorher", after: "Nachher",
      ba_weekly: "Kosten pro Lead je Woche", ba_marker: "Maßnahme", ba_by_acc: "Nach Konto", ba_none: "Zu wenige Leads für einen Vergleich.",
      chart_title: "Ausgaben und Leads", per_day: "pro Tag",
      top_recs: "Wichtigste Empfehlungen", accounts: "Konten", open_recs: "Offen",
      camp_search: "Kampagne oder Anzeige suchen", st_all: "Alle", st_active: "Aktiv", st_paused: "Pausiert",
      col_campaign: "Kampagne", col_goal: "Ziel", col_status: "Status", col_trend: "Verlauf", col_account: "Konto", col_currency: "Währung",
      obj_OUTCOME_LEADS: "Leads", obj_LEAD_GENERATION: "Leads", obj_MESSAGES: "WhatsApp", obj_OUTCOME_ENGAGEMENT: "Interaktion", obj_OUTCOME_AWARENESS: "Reichweite", obj_OUTCOME_TRAFFIC: "Traffic", obj_OUTCOME_SALES: "Umsatz", obj_LINK_CLICKS: "Klicks",
      no_camps: "Keine Kampagne mit Ausgaben in diesem Zeitraum.",
      recs_intro: "Nach Priorität sortiert. Nichts wird ohne Ihre Zustimmung geändert.",
      recs_preview: "Vorschau: Entscheidungen werden nur im Protokoll vermerkt, nicht an Meta gesendet.",
      tab_open: "Offen", tab_approved: "Angenommen", tab_rejected: "Abgelehnt",
      recs_empty_t: "Alles erledigt", recs_empty_s: "Für diesen Zeitraum gibt es keine offenen Empfehlungen.", recs_empty_d: "Noch keine Entscheidungen in dieser Ansicht.",
      reason_q: "Grund (optional):", r_seasonal: "Saisonal geplant", r_early: "Zu früh, weiter beobachten", r_brand: "Markenkampagne, kein Lead-Ziel", r_other: "Anderer Grund", skip: "Ohne Grund",
      toast_ok: "Angenommen und im Protokoll vermerkt.", toast_no: "Abgelehnt und im Protokoll vermerkt.", toast_undo: "Entscheidung zurückgesetzt.",
      priority: "Priorität", sev_high: "Dringend", sev_medium: "Wichtig", sev_low: "Hinweis", sev_info: "Chance",
      f_spend7: "Ausgaben 7 T", f_leads7: "Leads 7 T", f_cpl7: "Kosten/Lead 7 T", f_ctr7: "Klickrate 7 T", f_freq: "Frequenz", f_target: "Ziel {v}", f_prev: "Vorwoche {v}",
      rt_spend_no_results: "Anzeige pausieren", rt_high_cpl: "Budget senken oder Zielgruppe prüfen", rt_creative_fatigue: "Creative erneuern", rt_low_ctr: "Anzeigentext und Bild überarbeiten", rt_spend_stopped: "Auslieferung prüfen", rt_winner: "Budget erhöhen", rt_learning_limited: "Anzeigengruppen zusammenlegen",
      rw_spend_no_results: "In den letzten 7 Tagen hat diese Anzeige {spend} ausgegeben und keinen Lead gebracht. Das ist mehr als das Doppelte Ihrer Zielkosten pro Lead ({target}).",
      rw_msg_hint: " Prüfen Sie vorher, ob WhatsApp-Gespräche korrekt an Meta gemeldet werden.",
      rw_high_cpl: "Ein Lead kostet hier {cpl} – {pct} über Ihrem Ziel von {target}.",
      rw_creative_fatigue: "Dieselben Personen sehen die Anzeige im Schnitt {freq}-mal. Die Klickrate ist von {p} auf {r} gefallen – ein typisches Zeichen für Werbemüdigkeit.",
      rw_low_ctr: "Nur {ctr} der Personen klicken ({imp} Impressionen). Üblich sind ab 0,7 %.",
      rw_spend_stopped: "Seit 7 Tagen keine Ausgaben in diesem Konto. Prüfen Sie Zahlungsmethode, Kontostatus und pausierte Kampagnen.",
      rw_winner: "Ein Lead kostet hier {cpl}, {pct} unter Ihrem Ziel ({target}), bei {n} Leads in 7 Tagen.",
      ri_spend_no_results: "Spart ca. {v} pro Woche", ri_high_cpl: "Auf Zielniveau ca. {v} pro Woche weniger", ri_creative_fatigue: "Neue Variante hält die Kosten pro Lead stabil", ri_low_ctr: "Mehr Klicks bei gleichem Budget", ri_spend_stopped: "Verhindert einen Lead-Ausfall", ri_winner: "+20 % Budget ≈ +{n} Leads pro Woche",
      rep_title: "Wochenbericht · KW {w}", rep_list: "Berichte", rep_sent: "Versand jeden Montag 07:00 · E-Mail und Telegram",
      rep_sum_up: "In dieser Woche wurden {spend} ausgegeben und {leads} Leads gewonnen. Ein Lead kostete {cpl}, {pct} günstiger als in der Vorwoche.",
      rep_sum_down: "In dieser Woche wurden {spend} ausgegeben und {leads} Leads gewonnen. Ein Lead kostete {cpl}, {pct} teurer als in der Vorwoche.",
      rep_sum_flat: "In dieser Woche wurden {spend} ausgegeben und {leads} Leads gewonnen. Ein Lead kostete {cpl}.",
      rep_sum_none: "In dieser Woche gab es keine Ausgaben.",
      rep_top: "Die wichtigsten Empfehlungen", rep_none: "Keine Empfehlungen in dieser Woche.", rep_daily: "Leads pro Tag",
      log_all: "Alle", log_dec: "Entscheidungen", log_sys: "System", log_empty: "Noch keine Einträge.",
      you: "Sie", system: "System", rules: "Regelwerk",
      lg_connect: "Werbekonto verbunden (nur Lesezugriff)", lg_firstRun: "Erste Analyse abgeschlossen · {n} Empfehlungen", lg_report: "Wochenbericht versendet",
      lg_measure: "Maßnahme angenommen: {text}", lg_pauseRejected: "Empfehlung abgelehnt: „{ad}“ pausieren", lg_budgetUp: "Empfehlung angenommen: Budget für „{ad}“ +{pct} %",
      lg_sync: "Daten synchronisiert ({from} – {to})", lg_real_connect: "Werbekonto über Systembenutzer verbunden (nur Lesen)",
      lg_dec_ok: "Angenommen: {title}", lg_dec_no: "Abgelehnt: {title}", lg_reason: "Grund: {r}",
      set_lang: "Sprache", set_lang_d: "Sprache der Oberfläche und der Berichte.",
      set_cur: "Währung", set_cur_d: "Alle Beträge werden in diese Währung umgerechnet, auch Konten in anderen Währungen.",
      set_fx: "Umrechnungskurse", set_fx_d: "Feste Näherungskurse für diese Vorschau. Im Produkt täglich aktualisiert.",
      set_target: "Zielkosten pro Lead", set_target_d: "Pro Konto in Kontowährung. Leer = Durchschnitt des Kontos.",
      set_notify: "Benachrichtigungen", set_notify_d: "Wie und wann Sie informiert werden.",
      n_daily: "Tagesstatus per E-Mail, 07:00", n_weekly: "Wochenbericht, montags", n_telegram: "Telegram bei dringenden Empfehlungen",
      set_accounts: "Verbundene Konten", set_accounts_d: "Werbekonten, auf die dieser Arbeitsbereich Zugriff hat.",
      set_end: "Stichtag der Vorschau", set_end_d: "Die echten MediDent-Kampagnen sind seit Juni pausiert. Wählen Sie einen Tag zwischen Januar und Mai 2026.",
      set_sec: "Sicherheit", set_sec_d: "Wie der Zugriff auf Meta geschützt ist.",
      sec_text: "Der Meta-Zugriffsschlüssel liegt ausschließlich auf dem Server. Diese Seite enthält nur aufbereitete Kennzahlen, keinen Schlüssel.",
      last_sync: "Letzte Synchronisation {d}", auto: "Auto", active: "Aktiv",
      ob_t: "Meta-Konto verbinden", ob_steps: ["Meta verbinden", "Konten wählen", "Ziele festlegen", "Fertig"],
      ob_preview: "Vorschau · es wird keine Verbindung hergestellt",
      ob1_h: "Verbinden Sie Ihr Meta-Werbekonto", ob1_p: "Wir lesen Ihre Kampagnendaten, analysieren sie täglich und schlagen konkrete Schritte vor. Änderungen passieren nur, wenn Sie zustimmen.",
      ob1_l: ["Zugriff über Partnerfreigabe im Business Manager, kein Passwort", "Zum Start nur Lesezugriff (ads_read)", "Jederzeit in Meta widerrufbar"],
      ob1_btn: "Mit Meta verbinden", ob1_wait: "Verbindung wird hergestellt …", ob1_ok: "Verbunden · 1 Business, {n} Werbekonten gefunden",
      ob2_h: "Welche Werbekonten sollen wir analysieren?", ob2_p: "Sie können Konten später unter Einstellungen hinzufügen oder entfernen.",
      ob3_h: "Was darf ein Lead kosten?", ob3_p: "Damit wir Empfehlungen an Ihren Zielen ausrichten. Leer lassen, wenn wir den Durchschnitt verwenden sollen.",
      ob3_cur: "Berichtswährung", ob3_target: "Zielkosten pro Lead",
      ob4_h: "Alles bereit", ob4_p: "Die erste Analyse läuft. In wenigen Minuten sehen Sie Ihren Tagesstatus und die ersten Empfehlungen.",
      back: "Zurück", next: "Weiter", done: "Zur Übersicht", close: "Schließen", cancel: "Abbrechen",
      demo_strip: "<b>Demo-Daten:</b> Die mit „Demo“ markierten Kliniken sind fiktiv und dienen nur der Vorführung. Sie zeigen keine echten Kundenergebnisse.",
      real_strip: "<b>Echte Daten</b> aus dem MediDent-Werbekonto, Januar bis Mai 2026. Beträge in {cur} zu Näherungskursen umgerechnet.",
      footnote: "Beträge umgerechnet zu Näherungskursen (1 EUR = {chf} CHF = {try} TRY).",
      period: "Zeitraum", currency: "Währung", language: "Sprache", theme: "Darstellung", menu: "Menü",
      sector_dental: "Zahnmedizin", sector_implant: "Zahnimplantate", sector_hair: "Haartransplantation", sector_aesthetic: "Ästhetische Chirurgie", sector_eye: "Augenlaser",
    },
    en: {
      nav_overview: "Overview", nav_campaigns: "Campaigns", nav_recs: "Recommendations", nav_reports: "Reports", nav_log: "Audit log", nav_settings: "Settings",
      workspace: "Workspace", brand_sub: "Ad cockpit for clinics",
      connect: "Connect account", connect_sub: "Add a Meta ad account",
      all_accounts: "All accounts", accounts_n: "{n} accounts", real_group: "MediDent (real data)", demo_group: "Demo accounts (fictional)",
      demo: "Demo", real: "Real", days: "{n}d",
      spend: "Spend", leads: "Leads", cpl: "Cost per lead", ctr: "Click rate", freq: "Frequency", impressions: "Impressions",
      vs_prev: "vs previous period", no_prev: "no previous period", unchanged: "unchanged",
      status_title: "Daily status", happened: "What happened", means: "What it means", decide: "Your decision",
      st_ok: "On track", st_watch: "Watch", st_act: "Action needed",
      head_spend: "{spend} spent, {leads} leads.",
      head_cpl_better: "Cost per lead {pct} below the 7-day average.",
      head_cpl_worse: "Cost per lead {pct} above the 7-day average.",
      head_cpl_flat: "Cost per lead in line with the last 7 days.",
      head_noleads: "Spend without a lead that day.",
      head_nospend: "No spend that day.",
      mean_target_ok: "Cost per lead over the last 7 days ({cpl}) is within target.",
      mean_target_bad: "Cost per lead over the last 7 days ({cpl}) is {pct} above target ({target}).",
      mean_high: "{n} ads cost money without results – the biggest saving is here.", mean_high_1: "One ad costs money without results – the biggest saving is here.", mean_win_1: "One ad delivers well below average and can take more budget.", dec_open_1: "One open recommendation:", avg7: "7-day avg: {v}",
      mean_win: "{n} ads deliver well below average and can take more budget.",
      mean_none: "Nothing unusual in your ads.",
      mean_nodata: "No spend recorded for this day.",
      dec_none: "No decision is waiting today.",
      dec_open: "{n} open recommendations, the most important:",
      approve: "Approve", reject: "Reject", see_all: "See all", undo: "Undo",
      ba_title: "Before / after", ba_measure: "Since the change on {date}", ba_period: "Previous period vs current period", before: "Before", after: "After",
      ba_weekly: "Cost per lead by week", ba_marker: "Change", ba_by_acc: "By account", ba_none: "Too few leads to compare.",
      chart_title: "Spend and leads", per_day: "per day",
      top_recs: "Top recommendations", accounts: "Accounts", open_recs: "Open",
      camp_search: "Search campaign or ad", st_all: "All", st_active: "Active", st_paused: "Paused",
      col_campaign: "Campaign", col_goal: "Goal", col_status: "Status", col_trend: "Trend", col_account: "Account", col_currency: "Currency",
      obj_OUTCOME_LEADS: "Leads", obj_LEAD_GENERATION: "Leads", obj_MESSAGES: "WhatsApp", obj_OUTCOME_ENGAGEMENT: "Engagement", obj_OUTCOME_AWARENESS: "Awareness", obj_OUTCOME_TRAFFIC: "Traffic", obj_OUTCOME_SALES: "Sales", obj_LINK_CLICKS: "Clicks",
      no_camps: "No campaign with spend in this period.",
      recs_intro: "Sorted by priority. Nothing changes without your approval.",
      recs_preview: "Preview: decisions are recorded in the audit log only, not sent to Meta.",
      tab_open: "Open", tab_approved: "Approved", tab_rejected: "Rejected",
      recs_empty_t: "All done", recs_empty_s: "No open recommendations for this period.", recs_empty_d: "No decisions in this view yet.",
      reason_q: "Reason (optional):", r_seasonal: "Planned seasonal", r_early: "Too early, keep watching", r_brand: "Brand campaign, no lead goal", r_other: "Other reason", skip: "No reason",
      toast_ok: "Approved and recorded in the audit log.", toast_no: "Rejected and recorded in the audit log.", toast_undo: "Decision reset.",
      priority: "Priority", sev_high: "Urgent", sev_medium: "Important", sev_low: "Note", sev_info: "Opportunity",
      f_spend7: "Spend 7d", f_leads7: "Leads 7d", f_cpl7: "Cost/lead 7d", f_ctr7: "Click rate 7d", f_freq: "Frequency", f_target: "Target {v}", f_prev: "Prev. week {v}",
      rt_spend_no_results: "Pause ad", rt_high_cpl: "Lower budget or review audience", rt_creative_fatigue: "Refresh creative", rt_low_ctr: "Rework ad copy and image", rt_spend_stopped: "Check delivery", rt_winner: "Increase budget", rt_learning_limited: "Merge ad sets",
      rw_spend_no_results: "Over the last 7 days this ad spent {spend} and brought no lead. That is more than twice your target cost per lead ({target}).",
      rw_msg_hint: " First check that WhatsApp conversations are reported to Meta correctly.",
      rw_high_cpl: "A lead costs {cpl} here – {pct} above your target of {target}.",
      rw_creative_fatigue: "The same people see this ad {freq} times on average. Click rate fell from {p} to {r} – a typical sign of ad fatigue.",
      rw_low_ctr: "Only {ctr} of people click ({imp} impressions). 0.7% or more is typical.",
      rw_spend_stopped: "No spend in this account for 7 days. Check the payment method, account status and paused campaigns.",
      rw_winner: "A lead costs {cpl} here, {pct} below your target ({target}), with {n} leads in 7 days.",
      ri_spend_no_results: "Saves about {v} per week", ri_high_cpl: "At target level about {v} less per week", ri_creative_fatigue: "A new variant keeps cost per lead stable", ri_low_ctr: "More clicks for the same budget", ri_spend_stopped: "Prevents a lead outage", ri_winner: "+20% budget ≈ +{n} leads per week",
      rep_title: "Weekly report · W{w}", rep_list: "Reports", rep_sent: "Sent every Monday 07:00 · email and Telegram",
      rep_sum_up: "This week {spend} was spent and {leads} leads were won. A lead cost {cpl}, {pct} cheaper than the week before.",
      rep_sum_down: "This week {spend} was spent and {leads} leads were won. A lead cost {cpl}, {pct} more than the week before.",
      rep_sum_flat: "This week {spend} was spent and {leads} leads were won. A lead cost {cpl}.",
      rep_sum_none: "No spend this week.",
      rep_top: "Top recommendations", rep_none: "No recommendations this week.", rep_daily: "Leads per day",
      log_all: "All", log_dec: "Decisions", log_sys: "System", log_empty: "No entries yet.",
      you: "You", system: "System", rules: "Rules",
      lg_connect: "Ad account connected (read-only)", lg_firstRun: "First analysis finished · {n} recommendations", lg_report: "Weekly report sent",
      lg_measure: "Change approved: {text}", lg_pauseRejected: "Recommendation rejected: pause “{ad}”", lg_budgetUp: "Recommendation approved: budget for “{ad}” +{pct}%",
      lg_sync: "Data synced ({from} – {to})", lg_real_connect: "Ad account connected via system user (read-only)",
      lg_dec_ok: "Approved: {title}", lg_dec_no: "Rejected: {title}", lg_reason: "Reason: {r}",
      set_lang: "Language", set_lang_d: "Language of the interface and reports.",
      set_cur: "Currency", set_cur_d: "All amounts are converted into this currency, including accounts in other currencies.",
      set_fx: "Exchange rates", set_fx_d: "Fixed approximate rates for this preview. Updated daily in the product.",
      set_target: "Target cost per lead", set_target_d: "Per account in account currency. Empty = account average.",
      set_notify: "Notifications", set_notify_d: "How and when you are informed.",
      n_daily: "Daily status by email, 07:00", n_weekly: "Weekly report, Mondays", n_telegram: "Telegram for urgent recommendations",
      set_accounts: "Connected accounts", set_accounts_d: "Ad accounts this workspace can access.",
      set_end: "Preview reference date", set_end_d: "The real MediDent campaigns have been paused since June. Pick a day between January and May 2026.",
      set_sec: "Security", set_sec_d: "How access to Meta is protected.",
      sec_text: "The Meta access key is stored on the server only. This page contains prepared figures, never the key.",
      last_sync: "Last sync {d}", auto: "Auto", active: "Active",
      ob_t: "Connect Meta account", ob_steps: ["Connect Meta", "Choose accounts", "Set goals", "Done"],
      ob_preview: "Preview · no connection is made",
      ob1_h: "Connect your Meta ad account", ob1_p: "We read your campaign data, analyse it daily and suggest concrete next steps. Changes only happen when you approve them.",
      ob1_l: ["Access via partner sharing in Business Manager, no password", "Read-only access to start (ads_read)", "Revocable in Meta at any time"],
      ob1_btn: "Continue with Meta", ob1_wait: "Connecting …", ob1_ok: "Connected · 1 business, {n} ad accounts found",
      ob2_h: "Which ad accounts should we analyse?", ob2_p: "You can add or remove accounts later in Settings.",
      ob3_h: "What may a lead cost?", ob3_p: "So recommendations follow your goals. Leave empty to use the account average.",
      ob3_cur: "Reporting currency", ob3_target: "Target cost per lead",
      ob4_h: "All set", ob4_p: "The first analysis is running. In a few minutes you will see your daily status and first recommendations.",
      back: "Back", next: "Next", done: "Go to overview", close: "Close", cancel: "Cancel",
      demo_strip: "<b>Demo data:</b> clinics marked “Demo” are fictional and for demonstration only. They do not show real client results.",
      real_strip: "<b>Real data</b> from the MediDent ad account, January to May 2026. Amounts converted to {cur} at approximate rates.",
      footnote: "Amounts converted at approximate rates (1 EUR = {chf} CHF = {try} TRY).",
      period: "Period", currency: "Currency", language: "Language", theme: "Appearance", menu: "Menu",
      sector_dental: "Dentistry", sector_implant: "Dental implants", sector_hair: "Hair transplant", sector_aesthetic: "Aesthetic surgery", sector_eye: "Laser eye surgery",
    },
    tr: {
      nav_overview: "Genel bakış", nav_campaigns: "Kampanyalar", nav_recs: "Öneriler", nav_reports: "Raporlar", nav_log: "Kayıt", nav_settings: "Ayarlar",
      workspace: "Çalışma alanı", brand_sub: "Klinikler için reklam paneli",
      connect: "Hesap bağla", connect_sub: "Meta reklam hesabı ekle",
      all_accounts: "Tüm hesaplar", accounts_n: "{n} hesap", real_group: "MediDent (gerçek veri)", demo_group: "Demo hesaplar (kurgusal)",
      demo: "Demo", real: "Gerçek", days: "{n} gün",
      spend: "Harcama", leads: "Lead", cpl: "Lead başı maliyet", ctr: "Tıklama oranı", freq: "Frekans", impressions: "Gösterim",
      vs_prev: "önceki döneme göre", no_prev: "önceki dönem yok", unchanged: "değişmedi",
      status_title: "Günlük durum", happened: "Ne oldu", means: "Ne anlama geliyor", decide: "Senden beklenen karar",
      st_ok: "Planda", st_watch: "İzle", st_act: "Aksiyon gerekli",
      head_spend: "{spend} harcandı, {leads} lead.",
      head_cpl_better: "Lead başı maliyet 7 günlük ortalamanın {pct} altında.",
      head_cpl_worse: "Lead başı maliyet 7 günlük ortalamanın {pct} üzerinde.",
      head_cpl_flat: "Lead başı maliyet son 7 günle aynı seviyede.",
      head_noleads: "O gün harcama var, lead yok.",
      head_nospend: "O gün harcama yok.",
      mean_target_ok: "Son 7 günün lead başı maliyeti ({cpl}) hedef aralığında.",
      mean_target_bad: "Son 7 günün lead başı maliyeti ({cpl}) hedefin ({target}) {pct} üzerinde.",
      mean_high: "{n} reklam sonuç getirmeden para harcıyor; en büyük tasarruf burada.", mean_high_1: "Bir reklam sonuç getirmeden para harcıyor; en büyük tasarruf burada.", mean_win_1: "Bir reklam ortalamadan çok daha ucuza lead getiriyor, daha fazla bütçe kaldırır.", dec_open_1: "Bir açık öneri:", avg7: "7 gün ort.: {v}",
      mean_win: "{n} reklam ortalamadan çok daha ucuza lead getiriyor, daha fazla bütçe kaldırır.",
      mean_none: "Reklamlarda olağandışı bir durum yok.",
      mean_nodata: "Bu gün için harcama yok.",
      dec_none: "Bugün bekleyen karar yok.",
      dec_open: "{n} açık öneri, en önemlisi:",
      approve: "Onayla", reject: "Reddet", see_all: "Tümünü gör", undo: "Geri al",
      ba_title: "Önce / sonra", ba_measure: "{date} tarihindeki değişiklikten beri", ba_period: "Önceki dönem / bu dönem", before: "Önce", after: "Sonra",
      ba_weekly: "Haftalık lead başı maliyet", ba_marker: "Değişiklik", ba_by_acc: "Hesap bazında", ba_none: "Karşılaştırma için yeterli lead yok.",
      chart_title: "Harcama ve lead", per_day: "günlük",
      top_recs: "En önemli öneriler", accounts: "Hesaplar", open_recs: "Açık",
      camp_search: "Kampanya veya reklam ara", st_all: "Tümü", st_active: "Aktif", st_paused: "Durduruldu",
      col_campaign: "Kampanya", col_goal: "Amaç", col_status: "Durum", col_trend: "Seyir", col_account: "Hesap", col_currency: "Para birimi",
      obj_OUTCOME_LEADS: "Lead", obj_LEAD_GENERATION: "Lead", obj_MESSAGES: "WhatsApp", obj_OUTCOME_ENGAGEMENT: "Etkileşim", obj_OUTCOME_AWARENESS: "Bilinirlik", obj_OUTCOME_TRAFFIC: "Trafik", obj_OUTCOME_SALES: "Satış", obj_LINK_CLICKS: "Tıklama",
      no_camps: "Bu dönemde harcama yapan kampanya yok.",
      recs_intro: "Önceliğe göre sıralı. Onayın olmadan hiçbir şey değişmez.",
      recs_preview: "Önizleme: kararlar sadece kayda işlenir, Meta'ya gönderilmez.",
      tab_open: "Açık", tab_approved: "Onaylanan", tab_rejected: "Reddedilen",
      recs_empty_t: "Hepsi tamam", recs_empty_s: "Bu dönem için açık öneri yok.", recs_empty_d: "Bu görünümde henüz karar yok.",
      reason_q: "Neden (isteğe bağlı):", r_seasonal: "Sezonluk planlı", r_early: "Erken, izlemeye devam", r_brand: "Marka kampanyası, lead hedefi yok", r_other: "Başka neden", skip: "Nedensiz",
      toast_ok: "Onaylandı ve kayda işlendi.", toast_no: "Reddedildi ve kayda işlendi.", toast_undo: "Karar geri alındı.",
      priority: "Öncelik", sev_high: "Acil", sev_medium: "Önemli", sev_low: "Not", sev_info: "Fırsat",
      f_spend7: "Harcama 7 g", f_leads7: "Lead 7 g", f_cpl7: "Lead başı 7 g", f_ctr7: "Tıklama 7 g", f_freq: "Frekans", f_target: "Hedef {v}", f_prev: "Önceki hafta {v}",
      rt_spend_no_results: "Reklamı durdur", rt_high_cpl: "Bütçeyi düşür veya hedeflemeyi gözden geçir", rt_creative_fatigue: "Görseli yenile", rt_low_ctr: "Reklam metni ve görseli yenile", rt_spend_stopped: "Yayını kontrol et", rt_winner: "Bütçeyi artır", rt_learning_limited: "Reklam setlerini birleştir",
      rw_spend_no_results: "Bu reklam son 7 günde {spend} harcadı ve hiç lead getirmedi. Bu, hedef lead başı maliyetinin ({target}) iki katından fazla.",
      rw_msg_hint: " Önce WhatsApp konuşmalarının Meta'ya doğru sayıldığını kontrol et.",
      rw_high_cpl: "Burada bir lead {cpl}; hedefin olan {target} değerinin {pct} üzerinde.",
      rw_creative_fatigue: "Aynı kişiler reklamı ortalama {freq} kez görmüş. Tıklama oranı {p} → {r} düştü; tipik reklam yorgunluğu.",
      rw_low_ctr: "Kişilerin yalnızca {ctr} kadarı tıklıyor ({imp} gösterim). Normali %0,7 ve üzeri.",
      rw_spend_stopped: "Bu hesapta 7 gündür harcama yok. Ödeme yöntemini, hesap durumunu ve durdurulmuş kampanyaları kontrol et.",
      rw_winner: "Burada bir lead {cpl}; hedefin ({target}) {pct} altında, 7 günde {n} lead.",
      ri_spend_no_results: "Haftada yaklaşık {v} tasarruf", ri_high_cpl: "Hedef seviyede haftada yaklaşık {v} daha az", ri_creative_fatigue: "Yeni varyant lead maliyetini sabit tutar", ri_low_ctr: "Aynı bütçeyle daha çok tıklama", ri_spend_stopped: "Lead kaybını önler", ri_winner: "+%20 bütçe ≈ haftada +{n} lead",
      rep_title: "Haftalık rapor · {w}. hafta", rep_list: "Raporlar", rep_sent: "Her pazartesi 07:00 · e-posta ve Telegram",
      rep_sum_up: "Bu hafta {spend} harcandı, {leads} lead geldi. Bir lead {cpl}; önceki haftadan {pct} daha ucuz.",
      rep_sum_down: "Bu hafta {spend} harcandı, {leads} lead geldi. Bir lead {cpl}; önceki haftadan {pct} daha pahalı.",
      rep_sum_flat: "Bu hafta {spend} harcandı, {leads} lead geldi. Bir lead {cpl}.",
      rep_sum_none: "Bu hafta harcama yok.",
      rep_top: "En önemli öneriler", rep_none: "Bu hafta öneri yok.", rep_daily: "Günlük lead",
      log_all: "Tümü", log_dec: "Kararlar", log_sys: "Sistem", log_empty: "Henüz kayıt yok.",
      you: "Sen", system: "Sistem", rules: "Kurallar",
      lg_connect: "Reklam hesabı bağlandı (sadece okuma)", lg_firstRun: "İlk analiz tamamlandı · {n} öneri", lg_report: "Haftalık rapor gönderildi",
      lg_measure: "Değişiklik onaylandı: {text}", lg_pauseRejected: "Öneri reddedildi: “{ad}” durdurulsun", lg_budgetUp: "Öneri onaylandı: “{ad}” bütçesi +%{pct}",
      lg_sync: "Veri senkronize edildi ({from} – {to})", lg_real_connect: "Reklam hesabı sistem kullanıcısıyla bağlandı (sadece okuma)",
      lg_dec_ok: "Onaylandı: {title}", lg_dec_no: "Reddedildi: {title}", lg_reason: "Neden: {r}",
      set_lang: "Dil", set_lang_d: "Arayüz ve raporların dili.",
      set_cur: "Para birimi", set_cur_d: "Tüm tutarlar, başka para birimindeki hesaplar dahil, bu para birimine çevrilir.",
      set_fx: "Döviz kurları", set_fx_d: "Bu önizleme için sabit yaklaşık kurlar. Üründe günlük güncellenir.",
      set_target: "Hedef lead başı maliyet", set_target_d: "Hesap para biriminde, hesap bazında. Boş = hesabın ortalaması.",
      set_notify: "Bildirimler", set_notify_d: "Ne zaman ve nasıl haber verileceği.",
      n_daily: "Günlük durum e-postası, 07:00", n_weekly: "Haftalık rapor, pazartesi", n_telegram: "Acil önerilerde Telegram",
      set_accounts: "Bağlı hesaplar", set_accounts_d: "Bu çalışma alanının erişebildiği reklam hesapları.",
      set_end: "Önizleme tarihi", set_end_d: "Gerçek MediDent kampanyaları Haziran'dan beri kapalı. Ocak–Mayıs 2026 arasından bir gün seç.",
      set_sec: "Güvenlik", set_sec_d: "Meta erişiminin nasıl korunduğu.",
      sec_text: "Meta erişim anahtarı yalnızca sunucuda durur. Bu sayfada sadece hazır rakamlar var, anahtar yok.",
      last_sync: "Son senkronizasyon {d}", auto: "Otomatik", active: "Aktif",
      ob_t: "Meta hesabı bağla", ob_steps: ["Meta'ya bağlan", "Hesapları seç", "Hedefleri belirle", "Bitti"],
      ob_preview: "Önizleme · gerçek bağlantı kurulmaz",
      ob1_h: "Meta reklam hesabını bağla", ob1_p: "Kampanya verini okur, her gün analiz eder ve somut adımlar öneririz. Değişiklikler sadece sen onaylarsan yapılır.",
      ob1_l: ["Business Manager'da iş ortağı paylaşımıyla erişim, şifre yok", "Başlangıçta sadece okuma izni (ads_read)", "Meta'dan istediğin zaman geri alınabilir"],
      ob1_btn: "Meta ile devam et", ob1_wait: "Bağlanıyor …", ob1_ok: "Bağlandı · 1 işletme, {n} reklam hesabı bulundu",
      ob2_h: "Hangi reklam hesaplarını analiz edelim?", ob2_p: "Hesapları sonradan Ayarlar'dan ekleyip çıkarabilirsin.",
      ob3_h: "Bir lead en fazla ne kadara mal olmalı?", ob3_p: "Öneriler hedeflerine göre çalışsın diye. Boş bırakırsan hesabın ortalaması kullanılır.",
      ob3_cur: "Rapor para birimi", ob3_target: "Hedef lead başı maliyet",
      ob4_h: "Hazır", ob4_p: "İlk analiz çalışıyor. Birkaç dakika içinde günlük durumu ve ilk önerileri göreceksin.",
      back: "Geri", next: "İleri", done: "Genel bakışa git", close: "Kapat", cancel: "Vazgeç",
      demo_strip: "<b>Demo veri:</b> “Demo” etiketli klinikler kurgusaldır, sadece tanıtım içindir. Gerçek müşteri sonucu değildir.",
      real_strip: "<b>Gerçek veri:</b> MediDent reklam hesabı, Ocak–Mayıs 2026. Tutarlar yaklaşık kurla {cur}'ya çevrildi.",
      footnote: "Tutarlar yaklaşık kurlarla çevrildi (1 EUR = {chf} CHF = {try} TRY).",
      period: "Dönem", currency: "Para birimi", language: "Dil", theme: "Görünüm", menu: "Menü",
      sector_dental: "Diş hekimliği", sector_implant: "Diş implantı", sector_hair: "Saç ekimi", sector_aesthetic: "Estetik cerrahi", sector_eye: "Göz lazeri",
    },
  };
  const t = (k, v = {}) => {
    const s = (T[state.lang] && T[state.lang][k]) ?? T.de[k] ?? k;
    return typeof s === "string" ? s.replace(/\{(\w+)\}/g, (_, x) => (v[x] ?? "")) : s;
  };

  // ---------------------------------------------------------------- format
  const loc = () => LOC[state.lang];
  const conv = (amount, from) => (amount / (state.fx[from] || 1)) * (state.fx[state.cur] || 1);
  const money = (v, opt = {}) => v == null || !isFinite(v) ? "–" : new Intl.NumberFormat(loc(), { style: "currency", currency: state.cur, maximumFractionDigits: opt.dec ?? (Math.abs(v) < 100 ? 2 : 0), minimumFractionDigits: 0 }).format(v);
  const moneyIn = (v, cur) => v == null ? "–" : new Intl.NumberFormat(loc(), { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(v);
  const num = (v, d = 0) => v == null || !isFinite(v) ? "–" : new Intl.NumberFormat(loc(), { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const pct = (v, d = 1) => v == null || !isFinite(v) ? "–" : new Intl.NumberFormat(loc(), { style: "percent", maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const pct0 = (v) => pct(Math.abs(v), 0);
  const dfmt = (s, o = { day: "numeric", month: "short" }) => new Date(s + "T00:00:00Z").toLocaleDateString(loc(), { ...o, timeZone: "UTC" });
  const dlong = (s) => dfmt(s, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const dtime = (iso) => new Date(iso).toLocaleString(loc(), { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const isoWeek = (s) => {
    const d = new Date(s + "T00:00:00Z");
    const day = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - day + 3);
    const first = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
    return 1 + Math.round(((d - first) / DAY - 3 + ((first.getUTCDay() + 6) % 7)) / 7);
  };

  // ---------------------------------------------------------------- icons
  const I = {
    logo: '<path d="M4 17 9.5 9l4 5 2.5-3L20 17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    overview: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="4.5" rx="1.6"/><rect x="13.5" y="11" width="7" height="9.5" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/>',
    campaigns: '<path d="M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    recs: '<path d="M9 11.5 11.2 14 15.5 9"/><rect x="3.5" y="3.5" width="17" height="17" rx="4"/>',
    reports: '<path d="M7 3.5h7l4.5 4.5v12a.5.5 0 0 1-.5.5H7a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M13.5 3.5V8h5M9 13h6M9 16.5h4"/>',
    log: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    settings: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    plug: '<path d="M9 3.5v4M15 3.5v4M7 7.5h10v3.5a5 5 0 0 1-10 0V7.5ZM12 16v4.5"/>',
    chev: '<path d="m7 10 5 5 5-5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z"/>',
    auto: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" fill="currentColor" stroke="none"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    sync: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1L20 9.5M19.5 12a7.5 7.5 0 0 1-13 5.1L4 14.5M20 4.5v5h-5M4 19.5v-5h5"/>',
    send: '<path d="M20.5 3.5 10 14M20.5 3.5l-6.5 17-4-6.5-6.5-4 17-6.5Z"/>',
    undo: '<path d="M9 7 4.5 11.5 9 16"/><path d="M5 11.5h9.5a5 5 0 0 1 0 10H12"/>',
  };
  const icon = (n, cls = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="${cls}">${I[n]}</svg>`;

  // ---------------------------------------------------------------- analysis
  const selAccIdx = () => state.account === "all" ? ACC.map((_, i) => i) : [ACC.findIndex((a) => a.id === state.account)];
  const rowsBetween = (from, to, accs = selAccIdx()) => {
    const set = new Set(accs);
    return ROWS.filter((r) => set.has(r.acci) && r.date_start >= from && r.date_start <= to);
  };
  function agg(rows) {
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
  const targetOf = (acc) => {
    const v = state.targets[acc.id];
    if (v != null && v !== "" && +v > 0) return +v;
    return acc.target ?? null;
  };
  const SEV_ORDER = { high: 0, medium: 1, low: 2, info: 3 };

  // Kural motoru: her hesap kendi para biriminde; oneriler sonra ortak para birimine cevrilir
  const recCache = new Map();
  function recsFor(end, accs = selAccIdx()) {
    const key = end + "|" + accs.join(",") + "|" + JSON.stringify(state.targets);
    if (recCache.has(key)) return recCache.get(key);
    const from = addD(end, -29);
    const out = [];
    for (const i of accs) {
      const acc = ACC[i];
      const rows = ROWS.filter((r) => r.acci === i && r.date_start >= from && r.date_start <= end);
      if (!rows.length) continue;
      const tgt = targetOf(acc);
      const rep = analyze(rows, { until: end, targetCpl: tgt ? { [accKey(acc)]: tgt } : undefined });
      for (const f of rep.findings) {
        const k = `${acc.id}|${f.rule}|${f.id}|${end}`;
        const spendConv = f.metrics?.spend != null ? conv(f.metrics.spend, acc.currency) : 0;
        out.push({ ...f, key: k, acc, acci: i, spendConv });
      }
    }
    out.sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || b.spendConv - a.spendConv);
    recCache.set(key, out);
    return out;
  }
  const decisionOf = (k) => state.decisions[k];
  const openRecs = (end) => recsFor(end).filter((r) => !decisionOf(r.key));

  function recText(f) {
    const cur = f.acc.currency;
    const m = f.metrics || {};
    const c = (v) => (v == null ? "–" : money(conv(v, cur)));
    const title = t("rt_" + f.rule);
    let why = "", impact = "";
    const facts = [];
    if (f.rule === "spend_no_results") {
      why = t("rw_spend_no_results", { spend: c(m.spend), target: c(f.target) }) + (f.objective === "MESSAGES" ? t("rw_msg_hint") : "");
      impact = t("ri_spend_no_results", { v: c(m.spend) });
    } else if (f.rule === "high_cpl") {
      why = t("rw_high_cpl", { cpl: c(m.cpl), target: c(f.target), pct: pct0(m.cpl / f.target - 1) });
      impact = t("ri_high_cpl", { v: c((m.cpl - f.target) * m.results) });
    } else if (f.rule === "creative_fatigue") {
      why = t("rw_creative_fatigue", { freq: num(m.frequency, 1), p: pct(f.prior?.ctr, 2), r: pct(m.ctr, 2) });
      impact = t("ri_creative_fatigue");
    } else if (f.rule === "low_ctr") {
      why = t("rw_low_ctr", { ctr: pct(m.ctr, 2), imp: num(m.impressions) });
      impact = t("ri_low_ctr");
    } else if (f.rule === "spend_stopped") {
      why = t("rw_spend_stopped");
      impact = t("ri_spend_stopped");
    } else if (f.rule === "winner") {
      why = t("rw_winner", { cpl: c(m.cpl), target: c(f.target), pct: pct0(1 - m.cpl / f.target), n: num(m.results) });
      impact = t("ri_winner", { n: num(Math.max(1, Math.round(m.results * 0.2))) });
    } else {
      why = f.message;
    }
    if (f.level === "ad") {
      facts.push({ k: t("f_spend7"), v: c(m.spend) });
      facts.push({ k: t("f_leads7"), v: num(m.results) });
      if (f.target) {
        const over = m.cpl != null && m.cpl > f.target;
        facts.push({ k: t("f_cpl7"), v: m.cpl == null ? "–" : c(m.cpl), c: t("f_target", { v: c(f.target) }), cls: m.cpl == null ? "bad" : over ? "bad" : "good" });
      }
      facts.push({ k: t("f_ctr7"), v: pct(m.ctr, 2), c: f.prior?.ctr ? t("f_prev", { v: pct(f.prior.ctr, 2) }) : "", cls: f.prior?.ctr && m.ctr < f.prior.ctr * 0.85 ? "bad" : "" });
      if (m.frequency) facts.push({ k: t("f_freq"), v: num(m.frequency, 1), cls: m.frequency >= 3 ? "bad" : "" });
    } else if (m.spend != null) {
      facts.push({ k: t("spend") + " 30 T", v: c(m.spend) });
    }
    return { title, why, impact, facts };
  }

  // ---------------------------------------------------------------- charts
  function niceMax(v) {
    if (!(v > 0)) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p;
    return 10 * p;
  }
  const charts = new Map(); // el id -> draw fn
  function mountChart(id, draw) { charts.set(id, draw); const el = document.getElementById(id); if (el) draw(el); }
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) { const d = charts.get(e.target.id); if (d && e.contentRect.width && Math.abs((e.target._w || 0) - e.contentRect.width) > 4) d(e.target); }
  });

  function barChart(el, { days, vals, color, fmt, h = 220, mark }) {
    const W = Math.max(260, el.clientWidth); el._w = W;
    const H = h, pl = 52, pr = 8, pt = 10, pb = 24;
    const iw = W - pl - pr, ih = H - pt - pb;
    const max = niceMax(Math.max(...vals, 0));
    const y = (v) => pt + ih - (v / max) * ih;
    const step = iw / days.length;
    const gap = days.length > 60 ? 1 : 2;
    const bw = Math.max(1, Math.min(22, step - gap));
    let s = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img"><g class="grid">`;
    for (const tk of [0, max / 2, max]) s += `<line x1="${pl}" x2="${W - pr}" y1="${y(tk)}" y2="${y(tk)}"/><text x="${pl - 8}" y="${y(tk) + 3}" text-anchor="end">${esc(fmt(tk, true))}</text>`;
    s += `</g>`;
    vals.forEach((v, i) => {
      if (!v) return;
      const x = pl + i * step + (step - bw) / 2, hh = Math.max(1.5, ih - (y(v) - pt));
      const r = Math.min(3, bw / 2, hh);
      s += `<path class="bar" style="animation-delay:${Math.min(i * 6, 300)}ms" data-i="${i}" d="M${x},${pt + ih} v${-(hh - r)} q0,${-r} ${r},${-r} h${bw - 2 * r} q${r},0 ${r},${r} v${hh - r} z" fill="${color}"/>`;
    });
    const li = days.length > 2 ? [0, Math.floor((days.length - 1) / 2), days.length - 1] : days.map((_, i) => i);
    for (const i of li) {
      const anchor = i === 0 ? "start" : i === days.length - 1 ? "end" : "middle";
      const x = i === 0 ? pl : i === days.length - 1 ? W - pr : pl + i * step + step / 2;
      s += `<text x="${x}" y="${H - 6}" text-anchor="${anchor}">${esc(dfmt(days[i]))}</text>`;
    }
    if (mark && mark.i >= 0) {
      const x = pl + mark.i * step;
      s += `<g class="marker"><line x1="${x}" x2="${x}" y1="${pt}" y2="${pt + ih}"/><text x="${x + 6}" y="${pt + 10}">${esc(mark.label)}</text></g>`;
    }
    s += `<line class="base" x1="${pl}" x2="${W - pr}" y1="${pt + ih}" y2="${pt + ih}"/>`;
    s += `<rect x="${pl}" y="${pt}" width="${iw}" height="${ih}" fill="transparent" class="hit"/></svg><div class="tip" hidden></div>`;
    el.innerHTML = s;
    hover(el, W, (px) => {
      const i = Math.floor((px - pl) / step);
      if (i < 0 || i >= days.length) return null;
      el.querySelectorAll(".bar").forEach((b) => b.classList.toggle("dim", +b.dataset.i !== i));
      return { x: pl + i * step + step / 2, y: y(vals[i]), html: `<div class="tt">${esc(dlong(days[i]))}</div><div class="tv">${esc(fmt(vals[i]))}</div>` };
    }, () => el.querySelectorAll(".bar").forEach((b) => b.classList.remove("dim")));
  }

  function lineChart(el, { labels, vals, color, fmt, h = 170, mark, tipLabel }) {
    const W = Math.max(260, el.clientWidth); el._w = W;
    const H = h, pl = 52, pr = 12, pt = 14, pb = 24;
    const iw = W - pl - pr, ih = H - pt - pb;
    const defined = vals.filter((v) => v != null);
    const max = niceMax(Math.max(...defined, 0) * 1.08);
    const x = (i) => pl + (labels.length === 1 ? iw / 2 : (i / (labels.length - 1)) * iw);
    const y = (v) => pt + ih - (v / max) * ih;
    let d = "", area = "", started = false, firstX = 0, lastX = 0;
    vals.forEach((v, i) => {
      if (v == null) return;
      d += `${started ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      if (!started) firstX = x(i);
      lastX = x(i);
      started = true;
    });
    if (started) area = `${d}L${lastX},${pt + ih}L${firstX},${pt + ih}Z`;
    const gid = "g" + Math.random().toString(36).slice(2, 8);
    let s = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0.22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><g class="grid">`;
    for (const tk of [0, max / 2, max]) s += `<line x1="${pl}" x2="${W - pr}" y1="${y(tk)}" y2="${y(tk)}"/><text x="${pl - 8}" y="${y(tk) + 3}" text-anchor="end">${esc(fmt(tk, true))}</text>`;
    s += `</g>`;
    const li = labels.length > 2 ? [0, Math.floor((labels.length - 1) / 2), labels.length - 1] : labels.map((_, i) => i);
    for (const i of li) s += `<text x="${x(i)}" y="${H - 6}" text-anchor="${i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}">${esc(labels[i].short)}</text>`;
    if (mark && mark.i >= 0) {
      const mx = x(mark.i);
      s += `<g class="marker"><line x1="${mx}" x2="${mx}" y1="${pt}" y2="${pt + ih}"/><text x="${mx + 6}" y="${pt + 8}">${esc(mark.label)}</text></g>`;
    }
    s += `<line class="base" x1="${pl}" x2="${W - pr}" y1="${pt + ih}" y2="${pt + ih}"/>`;
    if (started) {
      s += `<path class="area" d="${area}" fill="url(#${gid})"/><path class="line" d="${d}" stroke="${color}" style="--len:4000"/>`;
      const li2 = vals.length - 1 - [...vals].reverse().findIndex((v) => v != null);
      s += `<circle cx="${x(li2)}" cy="${y(vals[li2])}" r="4" fill="${color}" stroke="var(--bg-elev)" stroke-width="2"/>`;
    }
    s += `<line class="cross" x1="0" x2="0" y1="${pt}" y2="${pt + ih}" visibility="hidden"/><circle class="hdot" r="4" fill="${color}" stroke="var(--bg-elev)" stroke-width="2" visibility="hidden"/>`;
    s += `<rect x="${pl}" y="${pt}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip" hidden></div>`;
    el.innerHTML = s;
    const cross = el.querySelector(".cross"), hdot = el.querySelector(".hdot");
    hover(el, W, (px) => {
      const i = Math.round(((px - pl) / iw) * (labels.length - 1));
      if (i < 0 || i >= labels.length || vals[i] == null) { cross.setAttribute("visibility", "hidden"); hdot.setAttribute("visibility", "hidden"); return null; }
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.setAttribute("visibility", "visible");
      hdot.setAttribute("cx", x(i)); hdot.setAttribute("cy", y(vals[i])); hdot.setAttribute("visibility", "visible");
      return { x: x(i), y: y(vals[i]), html: `<div class="tt">${esc(labels[i].long)}</div><div class="tv">${esc(fmt(vals[i]))}</div>${tipLabel ? `<div class="tt">${esc(tipLabel(i))}</div>` : ""}` };
    }, () => { cross.setAttribute("visibility", "hidden"); hdot.setAttribute("visibility", "hidden"); });
  }

  function hover(el, W, at, leave) {
    const svg = el.querySelector("svg"), tip = el.querySelector(".tip");
    const move = (e) => {
      const r = svg.getBoundingClientRect();
      const res = at(((e.clientX - r.left) / r.width) * W);
      if (!res) { tip.hidden = true; return; }
      tip.innerHTML = res.html;
      tip.style.left = `${(res.x / W) * 100}%`;
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
  const rolling = (arr, n) => arr.map((_, i) => {
    let s = 0, c = 0;
    for (let k = Math.max(0, i - n + 1); k <= i; k++) { s += arr[k].s; c += arr[k].r; }
    return c ? s / c : null;
  });

  // ---------------------------------------------------------------- ui pieces
  const accLabel = (a) => `${esc(a.name)}`;
  const pillDemo = (a) => (a.demo ? `<span class="pill demo">${t("demo")}</span>` : `<span class="pill real">${t("real")}</span>`);
  const sevPill = (s) => `<span class="pill ${s === "high" ? "bad" : s === "medium" ? "warn" : s === "info" ? "good" : "neutral"}"><span class="dot"></span>${t("sev_" + s)}</span>`;
  const deltaPill = (a, b, goodUp, neutral) => {
    if (a == null || b == null || !isFinite(a) || !isFinite(b)) return `<span class="muted">${t("no_prev")}</span>`;
    if (b === 0) return `<span class="muted">${t("no_prev")}</span>`;
    const d = a / b - 1;
    if (Math.abs(d) < 0.005) return `<span class="delta flat">±0</span> <span>${t("vs_prev")}</span>`;
    const cls = neutral ? "flat" : (d > 0) === goodUp ? "good" : "bad";
    return `<span class="delta ${cls}">${d > 0 ? "↑" : "↓"} ${pct0(d)}</span> <span>${t("vs_prev")}</span>`;
  };

  function shell() {
    const nav = [["overview", "overview"], ["campaigns", "campaigns"], ["recs", "recs"], ["reports", "reports"], ["log", "log"], ["settings", "settings"]];
    const nOpen = openRecs(state.end).length;
    const selName = state.account === "all" ? t("all_accounts") : ACC.find((a) => a.id === state.account).name;
    const selA = ACC.find((a) => a.id === state.account);
    const themeIc = state.theme === "dark" ? "moon" : state.theme === "light" ? "sun" : "auto";
    document.getElementById("app").innerHTML = `
      <div class="app">
        <aside class="side ${state.menu ? "open" : ""}" id="side" aria-label="${t("menu")}">
          <div class="brand"><div class="brand-mark">${icon("logo")}</div><div><div class="brand-name">MediDent Ads</div><div class="brand-sub">${t("brand_sub")}</div></div></div>
          <nav class="nav" aria-label="${t("menu")}">
            <div class="nav-label">${t("workspace")}</div>
            ${nav.map(([v, ic]) => `<a href="#${v}" data-nav="${v}" ${state.view === v ? 'aria-current="page"' : ""}>${icon(ic)}<span>${t("nav_" + v)}</span>${v === "recs" && nOpen ? `<span class="count">${nOpen}</span>` : ""}</a>`).join("")}
          </nav>
          <div class="side-foot">
            <button class="connect-cta" type="button" data-act="ob-open">${icon("plug")}<div><b>${t("connect")}</b><span>${t("connect_sub")}</span></div></button>
            <div class="who"><span class="avatar"></span><span>MediDent İstanbul · Admin</span></div>
          </div>
        </aside>
        <div class="scrim ${state.menu ? "open" : ""}" data-act="menu-close"></div>
        <div class="main">
          <div class="top">
            <button class="btn icon ghost menu-btn" type="button" data-act="menu" aria-label="${t("menu")}">${icon("menu")}</button>
            <h1>${t("nav_" + state.view)}</h1>
            <div class="tools">
              <div class="select" id="accSel">
                <button type="button" data-act="pop" aria-haspopup="listbox" aria-expanded="${state.pop}">
                  ${selA ? `<span class="dot" style="background:${selA.demo ? "var(--demo)" : "var(--accent)"}"></span>` : ""}<span class="lbl">${esc(selName)}</span>${icon("chev")}
                </button>
                ${state.pop ? accPop() : ""}
              </div>
              <div class="seg" role="group" aria-label="${t("period")}">${[7, 30, 90].map((n) => `<button type="button" data-win="${n}" aria-pressed="${state.win === n}">${t("days", { n })}</button>`).join("")}</div>
              <div class="seg" role="group" aria-label="${t("currency")}">${["EUR", "CHF"].map((c) => `<button type="button" data-cur="${c}" aria-pressed="${state.cur === c}">${c}</button>`).join("")}</div>
              <div class="seg hide-sm" role="group" aria-label="${t("language")}">${["de", "en", "tr"].map((l) => `<button type="button" data-lang="${l}" aria-pressed="${state.lang === l}">${l.toUpperCase()}</button>`).join("")}</div>
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

  function accPop() {
    const real = ACC.filter((a) => !a.demo), demo = ACC.filter((a) => a.demo);
    const opt = (id, title, sub, extra = "") => `<button class="opt" type="button" role="option" data-acc="${esc(id)}" aria-selected="${state.account === id}">${extra}<span><span class="t">${esc(title)}</span>${sub ? `<span class="s">${sub}</span>` : ""}</span>${state.account === id ? icon("check", "chk") : ""}</button>`;
    return `<div class="pop" role="listbox">
      ${opt("all", t("all_accounts"), t("accounts_n", { n: ACC.length }))}
      <div class="grp">${t("real_group")}</div>
      ${real.map((a) => opt(a.id, a.name, `${esc(a.id)} · ${a.currency}`, `<span class="dot" style="background:var(--accent)"></span>`)).join("")}
      <div class="grp">${t("demo_group")}</div>
      ${demo.map((a) => opt(a.id, a.name, `${t("sector_" + a.sector)} · ${esc(a.city)} · ${a.currency}`, `<span class="dot" style="background:var(--demo)"></span>`)).join("")}
    </div>`;
  }

  function stripFor() {
    const accs = selAccIdx().map((i) => ACC[i]);
    const anyDemo = accs.some((a) => a.demo), anyReal = accs.some((a) => !a.demo);
    let s = "";
    if (anyDemo) s += `<div class="demo-strip">${t("demo_strip")}</div>`;
    if (anyReal && !anyDemo) s += `<div class="demo-strip" style="background:var(--accent-soft)">${t("real_strip", { cur: state.cur })}</div>`;
    return s;
  }

  // ---------------------------------------------------------------- views
  function vOverview() {
    const end = state.end, from = addD(end, -(state.win - 1));
    const pFrom = addD(from, -state.win), pTo = addD(from, -1);
    const A = agg(rowsBetween(from, end)), P = agg(rowsBetween(pFrom, pTo));
    const recs = openRecs(end);
    const multi = state.account === "all";

    // gunluk seriler
    const days = Array.from({ length: state.win }, (_, i) => addD(from, i));
    const byDay = new Map(days.map((d) => [d, { s: 0, r: 0, l: 0, imp: 0, cl: 0, ms: 0 }]));
    for (const r of rowsBetween(from, end)) {
      const o = byDay.get(r.date_start);
      o.s += conv(r._spend, r._cur); o.l += r._res; o.imp += r._imp; o.cl += r._clicks;
      if (r._measured) { o.ms += conv(r._spend, r._cur); o.r += r._res; }
    }
    const series = days.map((d) => byDay.get(d));

    const kpi = (label, v, fmtv, delta, sp, color) => `<div class="card kpi"><div class="l">${label}</div><div class="v" data-count="${v ?? ""}" data-fmt="${fmtv}">${fmtVal(v, fmtv)}</div><div class="d">${delta}</div><div class="spark">${spark(sp, color)}</div></div>`;
    const cplRoll = rolling(series.map((o) => ({ s: o.ms, r: o.r })), 7);
    const ctrRoll = series.map((o, i) => { let c = 0, m = 0; for (let k = Math.max(0, i - 6); k <= i; k++) { c += series[k].cl; m += series[k].imp; } return m ? c / m : null; });

    return `
      ${statusCard(end, recs)}
      <section class="grid-kpi" aria-label="KPI">
        ${kpi(t("spend"), A.spend, "money", deltaPill(A.spend, P.spend, true, true), series.map((o) => o.s), "var(--s-spend)")}
        ${kpi(t("leads"), A.res, "int", deltaPill(A.res, P.res, true), series.map((o) => o.l), "var(--s-leads)")}
        ${kpi(t("cpl"), A.cpl, "money", deltaPill(A.cpl, P.cpl, false), cplRoll, "var(--s-cpl)")}
        ${kpi(t("ctr"), A.ctr, "pct", deltaPill(A.ctr, P.ctr, true), ctrRoll, "var(--fg-3)")}
      </section>
      <div class="grid-2">
        <div class="stack">
          <section class="card">
            <div class="card-h"><h2>${t("chart_title")}</h2><span class="sub">${t("per_day")} · ${esc(dfmt(from))} – ${esc(dfmt(end))}</span>
              <div class="right"><div class="seg" role="group">${["spend", "leads"].map((k) => `<button type="button" data-chart="${k}" aria-pressed="${state.chart === k}">${t(k)}</button>`).join("")}</div></div></div>
            <div class="card-b"><div class="chart" id="chMain"></div></div>
          </section>
          <section class="card">
            <div class="card-h"><h2>${t("top_recs")}</h2><span class="sub">${recs.length} ${t("open_recs").toLowerCase()}</span><div class="right"><a class="btn sm ghost" href="#recs" data-nav="recs">${t("see_all")} ${icon("arrow")}</a></div></div>
            <div class="card-b" style="display:grid;padding-top:6px">${recs.slice(0, 3).map((r, i) => recMini(r, i)).join("") || `<div class="empty">${icon("check")}<b>${t("recs_empty_t")}</b><span>${t("recs_empty_s")}</span></div>`}</div>
          </section>
        </div>
        ${baCard()}
      </div>
      ${multi ? accountsCard(from, end, pFrom, pTo) : campTopCard(from, end)}
      ${stripFor()}
      <p class="footnote">${t("footnote", { chf: num(state.fx.CHF, 2), try: num(state.fx.TRY, 1) })}</p>`;
  }

  function fmtVal(v, f) {
    if (v == null || !isFinite(v)) return "–";
    return f === "money" ? money(v) : f === "pct" ? pct(v, 2) : num(v);
  }

  function statusCard(end, recs) {
    const accs = selAccIdx();
    const day = agg(rowsBetween(end, end, accs));
    const prev = agg(rowsBetween(addD(end, -7), addD(end, -1), accs));
    const last7 = agg(rowsBetween(addD(end, -6), end, accs));
    const avgS = prev.spend / 7, avgL = prev.res / 7;
    const high = recs.filter((r) => r.severity === "high").length, med = recs.filter((r) => r.severity === "medium").length;
    const win = recs.filter((r) => r.rule === "winner").length;
    const st = high ? ["bad", t("st_act")] : med ? ["warn", t("st_watch")] : ["good", t("st_ok")];

    let head;
    if (!day.spend) head = t("head_nospend");
    else {
      head = t("head_spend", { spend: money(day.spend), leads: num(day.res) }) + " ";
      if (!day.mRes) head += t("head_noleads");
      else if (prev.cpl) {
        const d = day.cpl / prev.cpl - 1;
        head += Math.abs(d) < 0.05 ? t("head_cpl_flat") : d < 0 ? t("head_cpl_better", { pct: pct0(d) }) : t("head_cpl_worse", { pct: pct0(d) });
      }
    }
    // ortalama hedef: tek hesapta hedef, coklu hesapta hesap hedeflerinin harcama agirlikli ortalamasi yerine yorum CPL degisimi uzerinden
    let mean = "";
    const one = accs.length === 1 ? ACC[accs[0]] : null;
    const tgt = one ? targetOf(one) : null;
    if (!last7.spend) mean = t("mean_nodata");
    else if (one && tgt && last7.cpl) {
      const tgtC = conv(tgt, one.currency);
      mean = last7.cpl <= tgtC * 1.05 ? t("mean_target_ok", { cpl: money(last7.cpl) }) : t("mean_target_bad", { cpl: money(last7.cpl), pct: pct0(last7.cpl / tgtC - 1), target: money(tgtC) });
    }
    const extra = [];
    const dead = recs.filter((r) => r.rule === "spend_no_results").length;
    if (dead) extra.push(t(dead === 1 ? "mean_high_1" : "mean_high", { n: dead }));
    if (win) extra.push(t(win === 1 ? "mean_win_1" : "mean_win", { n: win }));
    if (!mean && !extra.length) mean = t("mean_none");
    mean = [mean, ...extra].filter(Boolean).join(" ");

    const top = recs[0];
    let decide;
    if (!top) decide = `<p>${t("dec_none")}</p>`;
    else {
      const tx = recText(top);
      decide = `<div class="decision"><p>${t(recs.length === 1 ? "dec_open_1" : "dec_open", { n: recs.length })}</p>
        <div><div class="what">${esc(tx.title)}</div><div class="rec-entity">${esc(top.name)} · ${esc(top.acc.name)} ${top.acc.demo ? `<span class="pill demo">${t("demo")}</span>` : ""}</div></div>
        <div class="acts"><button class="btn sm primary" type="button" data-dec="approve" data-key="${esc(top.key)}">${icon("check")}${t("approve")}</button><button class="btn sm" type="button" data-dec="reject" data-key="${esc(top.key)}">${t("reject")}</button><a class="btn sm ghost" href="#recs" data-nav="recs">${t("see_all")}</a></div>
        ${state.reasonFor === top.key ? reasonChips(top.key) : ""}</div>`;
    }
    return `<section class="card status" aria-label="${t("status_title")}">
      <div class="status-top"><span class="pill ${st[0]}"><span class="pulse"></span>${st[1]}</span><span class="eyebrow">${t("status_title")}</span><span class="date">${esc(dlong(end))}</span></div>
      <h2>${esc(head)}</h2>
      <div class="status-cols">
        <div class="status-col"><span class="eyebrow">${t("happened")}</span><div class="hap">
          <div><span class="k">${t("spend")}</span><span class="v">${money(day.spend)}</span><span class="c">${esc(t("avg7", { v: money(avgS) }))}</span></div>
          <div><span class="k">${t("leads")}</span><span class="v">${num(day.res)}</span><span class="c">${esc(t("avg7", { v: num(avgL, 1) }))}</span></div>
          <div><span class="k">${t("cpl")}</span><span class="v">${money(day.cpl)}</span><span class="c">${esc(t("avg7", { v: money(prev.cpl) }))}</span></div>
        </div></div>
        <div class="status-col"><span class="eyebrow">${t("means")}</span><p>${esc(mean)}</p></div>
        <div class="status-col"><span class="eyebrow">${t("decide")}</span>${decide}</div>
      </div>
    </section>`;
  }

  function measureFor() {
    if (state.account === "all") return null;
    const a = ACC.find((x) => x.id === state.account);
    return a?.measure && a.measure.date <= state.end ? a.measure : null;
  }

  function baRange() {
    const m = measureFor();
    if (m) {
      const after = [m.date, state.end < addD(m.date, 34) ? state.end : addD(m.date, 34)];
      const len = Math.round((Date.parse(after[1]) - Date.parse(after[0])) / DAY) + 1;
      return { m, before: [addD(m.date, -len), addD(m.date, -1)], after };
    }
    const from = addD(state.end, -(state.win - 1));
    return { m: null, before: [addD(from, -state.win), addD(from, -1)], after: [from, state.end] };
  }

  function baCard() {
    const { m, before, after } = baRange();
    const B = agg(rowsBetween(...before)), A = agg(rowsBetween(...after));
    const ok = B.cpl != null && A.cpl != null;
    const d = ok ? A.cpl / B.cpl - 1 : null;
    const multi = state.account === "all";
    const rows = multi ? ACC.map((acc, i) => {
      const b = agg(rowsBetween(...before, [i])), a = agg(rowsBetween(...after, [i]));
      return { acc, b: b.cpl, a: a.cpl };
    }).filter((x) => x.b != null || x.a != null) : [];
    return `<section class="card">
      <div class="card-h"><h2>${t("ba_title")} · ${t("cpl")}</h2><span class="sub">${m ? t("ba_measure", { date: dfmt(m.date, { day: "numeric", month: "long" }) }) : t("ba_period")}</span></div>
      <div class="card-b ba">
        ${ok ? `<div class="ba-nums">
          <div class="side-l"><span class="lab">${t("before")} · ${esc(dfmt(before[0]))} – ${esc(dfmt(before[1]))}</span><span class="val">${money(B.cpl)}</span></div>
          <div class="arrow">${icon("arrow")}</div>
          <div class="side-r"><span class="lab">${t("after")} · ${esc(dfmt(after[0]))} – ${esc(dfmt(after[1]))}</span><span class="val">${money(A.cpl)}</span></div>
        </div>
        <div class="ba-note"><span class="delta ${d < 0 ? "good" : d > 0 ? "bad" : "flat"}">${d < 0 ? "↓" : d > 0 ? "↑" : "±"} ${pct0(d)}</span>${m ? `<span>${esc(m[state.lang] || m.de)}</span>` : `<span>${num(B.mRes)} → ${num(A.mRes)} ${t("leads")}</span>`}</div>` : `<div class="empty">${t("ba_none")}</div>`}
        <div><div class="eyebrow" style="margin-bottom:6px">${t("ba_weekly")}</div><div class="chart" id="chBA"></div></div>
        ${multi && rows.length ? `<div><div class="eyebrow" style="margin-bottom:4px">${t("ba_by_acc")}</div><div class="ba-list">${rows.map((x) => {
          const dd = x.a != null && x.b != null ? x.a / x.b - 1 : null;
          return `<div class="ba-row"><span class="n"><span>${esc(x.acc.name)}</span>${x.acc.demo ? `<span class="pill demo">${t("demo")}</span>` : ""}</span><span class="num muted">${money(x.b)} → ${money(x.a)}</span>${dd == null ? `<span class="muted">–</span>` : `<span class="delta ${dd < 0 ? "good" : "bad"}">${dd < 0 ? "↓" : "↑"} ${pct0(dd)}</span>`}</div>`;
        }).join("")}</div></div>` : ""}
      </div>
    </section>`;
  }

  function drawBA() {
    const { m } = baRange();
    const weeks = 16;
    const labels = [], vals = [];
    let mi = -1;
    for (let w = weeks - 1; w >= 0; w--) {
      const to = addD(state.end, -7 * w), from = addD(to, -6);
      const a = agg(rowsBetween(from, to));
      labels.push({ short: dfmt(from), long: `${dfmt(from)} – ${dfmt(to)}` });
      vals.push(a.mRes >= 2 ? a.cpl : null);
      if (m && m.date >= from && m.date <= to) mi = labels.length - 1;
    }
    mountChart("chBA", (el) => lineChart(el, { labels, vals, color: "var(--s-cpl)", fmt: (v, axis) => axis ? money(v, { dec: 0 }) : money(v), mark: mi >= 0 ? { i: mi, label: t("ba_marker") } : null }));
  }

  function drawMain() {
    const from = addD(state.end, -(state.win - 1));
    const days = Array.from({ length: state.win }, (_, i) => addD(from, i));
    const map = new Map(days.map((d) => [d, { s: 0, l: 0 }]));
    for (const r of rowsBetween(from, state.end)) { const o = map.get(r.date_start); o.s += conv(r._spend, r._cur); o.l += r._res; }
    const isS = state.chart === "spend";
    const vals = days.map((d) => (isS ? map.get(d).s : map.get(d).l));
    const m = measureFor();
    mountChart("chMain", (el) => barChart(el, {
      days, vals, color: isS ? "var(--s-spend)" : "var(--s-leads)",
      fmt: (v, axis) => (isS ? money(v, { dec: 0 }) : axis ? num(v) : `${num(v)} ${t("leads")}`),
      mark: m ? { i: days.indexOf(m.date), label: t("ba_marker") } : null,
    }));
  }

  function recMini(r, i) {
    const tx = recText(r);
    return `<div style="display:grid;grid-template-columns:26px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 0;${i ? "border-top:1px solid var(--line)" : ""}">
      <span class="num muted" style="font-size:12px">${String(i + 1).padStart(2, "0")}</span>
      <div style="min-width:0"><div style="font-weight:600;display:flex;gap:8px;align-items:center;flex-wrap:wrap">${esc(tx.title)} ${sevPill(r.severity)}</div><div class="rec-entity">${esc(r.name)} · ${esc(r.acc.name)}</div></div>
      <a class="btn sm ghost" href="#recs" data-nav="recs" aria-label="${t("see_all")}">${icon("arrow")}</a>
    </div>`;
  }

  function accountsCard(from, end, pFrom, pTo) {
    const all = openRecs(end);
    return `<section class="card">
      <div class="card-h"><h2>${t("accounts")}</h2><span class="sub">${esc(dfmt(from))} – ${esc(dfmt(end))}</span></div>
      <div class="card-b" style="padding-top:8px"><div class="tbl-wrap"><table>
        <thead><tr><th>${t("col_account")}</th><th class="r">${t("spend")}</th><th class="r">${t("leads")}</th><th class="r">${t("cpl")}</th><th class="r">${t("open_recs")}</th></tr></thead>
        <tbody>${ACC.map((acc, i) => {
          const a = agg(rowsBetween(from, end, [i])), p = agg(rowsBetween(pFrom, pTo, [i]));
          const n = all.filter((r) => r.acci === i).length;
          const dd = a.cpl != null && p.cpl != null ? a.cpl / p.cpl - 1 : null;
          return `<tr data-acc="${esc(acc.id)}" style="cursor:pointer"><td><div class="cell-name" style="min-width:180px"><span class="t">${esc(acc.name)}</span><span class="s">${pillDemo(acc)} ${t("sector_" + acc.sector)} · ${acc.currency}</span></div></td>
            <td class="r">${money(a.spend)}</td><td class="r">${num(a.res)}</td>
            <td class="r">${money(a.cpl)}${dd != null && Math.abs(dd) >= 0.005 ? ` <span class="delta ${dd < 0 ? "good" : "bad"}" style="margin-left:4px">${dd < 0 ? "↓" : "↑"}${pct0(dd)}</span>` : ""}</td>
            <td class="r">${n ? `<span class="pill ${all.some((r) => r.acci === i && r.severity === "high") ? "bad" : "warn"}">${n}</span>` : `<span class="muted">0</span>`}</td></tr>`;
        }).join("")}</tbody></table></div></div>
    </section>`;
  }

  function campStats(from, end) {
    const map = new Map();
    const lastDay = new Map();
    for (const r of ROWS) {
      if (!selAccIdx().includes(r.acci)) continue;
      if (r._spend > 0 && r.date_start <= end) lastDay.set(r.campaign_id, r.date_start > (lastDay.get(r.campaign_id) || "") ? r.date_start : lastDay.get(r.campaign_id));
    }
    const days = Array.from({ length: state.win }, (_, i) => addD(from, i));
    for (const r of rowsBetween(from, end)) {
      if (!map.has(r.campaign_id)) map.set(r.campaign_id, { id: r.campaign_id, name: r.campaign_name, obj: r.objective, acc: ACC[r.acci], rows: [], ads: new Set(), daily: new Map(days.map((d) => [d, 0])) });
      const c = map.get(r.campaign_id);
      c.rows.push(r); c.ads.add(r.ad_name);
      c.daily.set(r.date_start, (c.daily.get(r.date_start) || 0) + conv(r._spend, r._cur));
    }
    return [...map.values()].map((c) => {
      const a = agg(c.rows);
      const active = (lastDay.get(c.id) || "") >= addD(end, -2);
      return { ...c, spend: a.spend, res: a.res, cpl: a.mRes ? a.mSpend / a.mRes : null, ctr: a.ctr, active, spark: [...c.daily.values()] };
    });
  }

  function campTopCard(from, end) {
    const list = campStats(from, end).sort((a, b) => b.spend - a.spend).slice(0, 5);
    return `<section class="card">
      <div class="card-h"><h2>${t("nav_campaigns")}</h2><span class="sub">${esc(dfmt(from))} – ${esc(dfmt(end))}</span><div class="right"><a class="btn sm ghost" href="#campaigns" data-nav="campaigns">${t("see_all")} ${icon("arrow")}</a></div></div>
      <div class="card-b" style="padding-top:8px"><div class="tbl-wrap"><table><thead><tr><th>${t("col_campaign")}</th><th class="r">${t("spend")}</th><th class="r">${t("cpl")}</th></tr></thead>
      <tbody>${list.map((c) => `<tr><td><div class="cell-name" style="min-width:160px"><span class="t">${esc(c.name)}</span><span class="s">${t("obj_" + c.obj)}</span></div></td><td class="r">${money(c.spend)}</td><td class="r">${money(c.cpl)}</td></tr>`).join("") || `<tr><td colspan="3" class="muted">${t("no_camps")}</td></tr>`}</tbody></table></div></div>
    </section>`;
  }

  function vCampaigns() {
    const from = addD(state.end, -(state.win - 1));
    let list = campStats(from, state.end);
    const q = state.search.trim().toLowerCase();
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || [...c.ads].some((a) => a.toLowerCase().includes(q)) || c.acc.name.toLowerCase().includes(q));
    if (state.campFilter !== "all") list = list.filter((c) => (state.campFilter === "active") === c.active);
    const { key, dir } = state.sort;
    const val = (c) => key === "acc" ? c.acc.name : key === "obj" ? t("obj_" + c.obj) : c[key];
    list.sort((a, b) => { const x = val(a) ?? -Infinity, y = val(b) ?? -Infinity; return (x > y ? 1 : x < y ? -1 : 0) * dir; });
    const th = (k, l, r) => `<th class="${r ? "r" : ""}" aria-sort="${key === k ? (dir > 0 ? "ascending" : "descending") : "none"}"><button type="button" data-sort="${k}">${l}${key === k ? (dir > 0 ? " ↑" : " ↓") : ""}</button></th>`;
    return `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <label class="search" for="q">${icon("search")}<input id="q" type="search" placeholder="${t("camp_search")}" value="${esc(state.search)}" autocomplete="off"></label>
        <div class="seg" role="group">${["all", "active", "paused"].map((k) => `<button type="button" data-cf="${k}" aria-pressed="${state.campFilter === k}">${t("st_" + k)}</button>`).join("")}</div>
        <span class="muted" style="margin-left:auto;font-size:12px">${esc(dfmt(from))} – ${esc(dfmt(state.end))} · ${list.length}</span>
      </div>
      <section class="card"><div class="tbl-wrap"><table>
        <thead><tr>${th("name", t("col_campaign"))}${th("obj", t("col_goal"))}<th>${t("col_status")}</th>${th("spend", t("spend"), 1)}${th("res", t("leads"), 1)}${th("cpl", t("cpl"), 1)}${th("ctr", t("ctr"), 1)}<th>${t("col_trend")}</th></tr></thead>
        <tbody>${list.map((c) => `<tr>
          <td><div class="cell-name"><span class="t">${esc(c.name)}</span><span class="s">${pillDemo(c.acc)} ${esc(c.acc.name)} · ${c.ads.size} ${c.ads.size === 1 ? "Ad" : "Ads"}</span></div></td>
          <td><span class="pill neutral">${t("obj_" + c.obj)}</span></td>
          <td>${c.active ? `<span class="pill good"><span class="dot"></span>${t("st_active")}</span>` : `<span class="pill neutral">${t("st_paused")}</span>`}</td>
          <td class="r">${money(c.spend)}</td><td class="r">${num(c.res)}</td><td class="r">${money(c.cpl)}</td><td class="r">${pct(c.ctr, 2)}</td>
          <td><div class="mini-spark">${spark(c.spark, "var(--s-spend)", 90, 24)}</div></td></tr>`).join("") || `<tr><td colspan="8"><div class="empty">${t("no_camps")}</div></td></tr>`}
        </tbody></table></div></section>
      ${stripFor()}`;
  }

  function reasonChips(key) {
    return `<div class="reasons"><span class="muted" style="font-size:12px">${t("reason_q")}</span>${["seasonal", "early", "brand", "other"].map((r) => `<button class="chipbtn" type="button" data-reason="${r}" data-key="${esc(key)}">${t("r_" + r)}</button>`).join("")}<button class="chipbtn" type="button" data-reason="" data-key="${esc(key)}">${t("skip")}</button><button class="btn sm ghost" type="button" data-act="reason-cancel">${t("cancel")}</button></div>`;
  }

  function recCard(r, i, decided) {
    const tx = recText(r);
    const dec = decisionOf(r.key);
    return `<article class="card rec" data-rec="${esc(r.key)}">
      <div class="prio ${r.severity}">${i + 1}</div>
      <div class="rec-body">
        <div class="rec-head"><div style="display:grid;gap:4px;min-width:0;flex:1 1 300px">
          <h3 class="rec-title">${esc(tx.title)}</h3>
          <div class="rec-entity">${esc(r.name)}${r.campaign ? ` · ${esc(r.campaign)}` : ""} · ${esc(r.acc.name)} ${r.acc.demo ? `<span class="pill demo">${t("demo")}</span>` : ""}</div>
        </div>${sevPill(r.severity)}</div>
        <p class="rec-why">${esc(tx.why)}</p>
        ${tx.facts.length ? `<div class="facts">${tx.facts.map((f) => `<div class="fact"><span class="k">${esc(f.k)}</span><span class="v">${esc(f.v)}</span>${f.c ? `<span class="c ${f.cls || ""}">${esc(f.c)}</span>` : ""}</div>`).join("")}</div>` : ""}
        <div class="rec-foot">
          <span class="impact">${icon("bolt")}${esc(tx.impact)}</span>
          ${decided ? `<span class="pill ${dec.status === "approved" ? "good" : "neutral"}">${dec.status === "approved" ? t("tab_approved") : t("tab_rejected")} · ${esc(dtime(dec.at))}</span><button class="btn sm ghost" type="button" data-undo="${esc(r.key)}">${icon("undo")}${t("undo")}</button>`
            : `<button class="btn sm" type="button" data-dec="reject" data-key="${esc(r.key)}">${icon("x")}${t("reject")}</button><button class="btn sm primary" type="button" data-dec="approve" data-key="${esc(r.key)}">${icon("check")}${t("approve")}</button>`}
        </div>
        ${state.reasonFor === r.key ? reasonChips(r.key) : ""}
      </div>
    </article>`;
  }

  function vRecs() {
    const all = recsFor(state.end);
    const open = all.filter((r) => !decisionOf(r.key));
    const ap = all.filter((r) => decisionOf(r.key)?.status === "approved");
    const rj = all.filter((r) => decisionOf(r.key)?.status === "rejected");
    const list = state.recTab === "open" ? open : state.recTab === "approved" ? ap : rj;
    return `
      <div style="display:grid;gap:4px"><p style="margin:0;color:var(--fg-2)">${t("recs_intro")}</p><p class="footnote" style="margin:0">${t("recs_preview")} · ${esc(dlong(state.end))}</p></div>
      <div class="tabs" role="tablist">${[["open", open.length], ["approved", ap.length], ["rejected", rj.length]].map(([k, n]) => `<button type="button" role="tab" data-rtab="${k}" aria-selected="${state.recTab === k}">${t("tab_" + k)} <span class="c">${n}</span></button>`).join("")}</div>
      <div class="recs">${list.map((r, i) => recCard(r, i, state.recTab !== "open")).join("") || `<div class="card empty">${icon("check")}<b>${t("recs_empty_t")}</b><span>${state.recTab === "open" ? t("recs_empty_s") : t("recs_empty_d")}</span></div>`}</div>
      ${stripFor()}`;
  }

  function weeksList() {
    const out = [];
    for (let w = 0; w < 8; w++) {
      const to = addD(state.end, -7 * w), from = addD(to, -6);
      out.push({ from, to, a: agg(rowsBetween(from, to)), p: agg(rowsBetween(addD(from, -7), addD(from, -1))) });
    }
    return out;
  }

  function vReports() {
    const ws = weeksList();
    const w = ws[Math.min(state.repWeek, ws.length - 1)];
    const scope = state.account === "all" ? t("all_accounts") : ACC.find((a) => a.id === state.account).name;
    const d = w.a.cpl != null && w.p.cpl != null ? w.a.cpl / w.p.cpl - 1 : null;
    const sum = !w.a.spend ? t("rep_sum_none") : d == null || Math.abs(d) < 0.02 ? t("rep_sum_flat", { spend: money(w.a.spend), leads: num(w.a.res), cpl: money(w.a.cpl) })
      : t(d < 0 ? "rep_sum_up" : "rep_sum_down", { spend: money(w.a.spend), leads: num(w.a.res), cpl: money(w.a.cpl), pct: pct0(d) });
    const recs = recsFor(w.to).slice(0, 3);
    return `
      <div class="rep">
        <section class="card rep-list" aria-label="${t("rep_list")}">
          ${ws.map((x, i) => `<button class="rep-item" type="button" data-week="${i}" aria-current="${i === state.repWeek}">
            <span class="t"><span>${t("rep_title", { w: isoWeek(x.to) })}</span>${x.p.cpl && x.a.cpl ? `<span class="delta ${x.a.cpl < x.p.cpl ? "good" : "bad"}">${x.a.cpl < x.p.cpl ? "↓" : "↑"}${pct0(x.a.cpl / x.p.cpl - 1)}</span>` : ""}</span>
            <span class="s">${esc(dfmt(x.from))} – ${esc(dfmt(x.to))} · ${money(x.a.spend)}</span></button>`).join("")}
        </section>
        <article class="card doc">
          <div class="meta"><span class="pill neutral">${icon("send")} ${t("rep_sent")}</span><span>${esc(scope)}</span></div>
          <h3>${t("rep_title", { w: isoWeek(w.to) })} · ${esc(dfmt(w.from, { day: "numeric", month: "long" }))} – ${esc(dfmt(w.to, { day: "numeric", month: "long", year: "numeric" }))}</h3>
          <p>${esc(sum)}</p>
          <div class="doc-kpis">
            <div><span class="k">${t("spend")}</span><span class="v">${money(w.a.spend)}</span>${deltaMini(w.a.spend, w.p.spend, true, true)}</div>
            <div><span class="k">${t("leads")}</span><span class="v">${num(w.a.res)}</span>${deltaMini(w.a.res, w.p.res, true)}</div>
            <div><span class="k">${t("cpl")}</span><span class="v">${money(w.a.cpl)}</span>${deltaMini(w.a.cpl, w.p.cpl, false)}</div>
            <div><span class="k">${t("ctr")}</span><span class="v">${pct(w.a.ctr, 2)}</span>${deltaMini(w.a.ctr, w.p.ctr, true)}</div>
          </div>
          <div><div class="eyebrow" style="margin-bottom:8px">${t("rep_daily")}</div><div class="chart" id="chRep"></div></div>
          <div style="display:grid;gap:10px"><div class="eyebrow">${t("rep_top")}</div>
            ${recs.length ? `<ol>${recs.map((r) => { const tx = recText(r); return `<li><b>${esc(tx.title)}</b> · ${esc(r.name)} (${esc(r.acc.name)})<br>${esc(tx.why)}</li>`; }).join("")}</ol>` : `<p>${t("rep_none")}</p>`}
          </div>
        </article>
      </div>
      ${stripFor()}`;
  }
  const deltaMini = (a, b, goodUp, neutral) => {
    if (a == null || b == null || !b) return `<span class="muted" style="font-size:11px">–</span>`;
    const d = a / b - 1;
    if (Math.abs(d) < 0.005) return `<span class="muted" style="font-size:11px">±0</span>`;
    return `<span style="font-size:11px;color:${neutral ? "var(--fg-3)" : (d > 0) === goodUp ? "var(--good)" : "var(--bad)"}">${d > 0 ? "↑" : "↓"} ${pct0(d)}</span>`;
  };
  function drawRep() {
    const w = weeksList()[state.repWeek];
    const days = Array.from({ length: 7 }, (_, i) => addD(w.from, i));
    const vals = days.map((d) => agg(rowsBetween(d, d)).res);
    mountChart("chRep", (el) => barChart(el, { days, vals, color: "var(--s-leads)", fmt: (v, axis) => (axis ? num(v) : `${num(v)} ${t("leads")}`), h: 150 }));
  }

  function logEntries() {
    const accs = new Set(selAccIdx().map((i) => ACC[i].id));
    const out = [];
    for (const e of DEMO.log) if (accs.has(e.account)) out.push({ ...e, acc: ACC.find((a) => a.id === e.account) });
    for (const a of ACC.filter((x) => !x.demo && accs.has(x.id))) {
      out.push({ at: RAW.generatedAt, type: "system", kind: "sync", acc: a });
      out.push({ at: new Date(Date.parse(RAW.generatedAt) - 6e5).toISOString(), type: "system", kind: "realConnect", acc: a });
    }
    for (const [key, d] of Object.entries(state.decisions)) {
      const acc = ACC.find((a) => a.id === key.split("|")[0]);
      if (acc && accs.has(acc.id)) out.push({ at: d.at, type: "decision", status: d.status, kind: "user", title: d.title, name: d.name, reason: d.reason, key, acc, end: key.split("|")[3] });
    }
    return out.sort((a, b) => (a.at < b.at ? 1 : -1));
  }

  function vLog() {
    let list = logEntries();
    if (state.logFilter === "dec") list = list.filter((e) => e.type === "decision");
    if (state.logFilter === "sys") list = list.filter((e) => e.type === "system");
    const line = (e) => {
      let text = "", who = t("system"), ic = "sync", cls = "info", sub = "";
      if (e.kind === "connect") { text = t("lg_connect"); ic = "plug"; }
      else if (e.kind === "realConnect") { text = t("lg_real_connect"); ic = "lock"; }
      else if (e.kind === "firstRun") { text = t("lg_firstRun", { n: e.n }); who = t("rules"); ic = "bolt"; }
      else if (e.kind === "report") { text = t("lg_report"); ic = "send"; }
      else if (e.kind === "sync") { text = t("lg_sync", { from: dfmt(RAW.since), to: dfmt(RAW.until) }); ic = "sync"; }
      else if (e.kind === "measure") { text = t("lg_measure", { text: e.text[state.lang] || e.text.de }); who = t("you"); ic = "check"; cls = "good"; }
      else if (e.kind === "pauseRejected") { text = t("lg_pauseRejected", { ad: e.adName }); who = t("you"); ic = "x"; cls = "bad"; sub = t("lg_reason", { r: t("r_" + e.reason) }); }
      else if (e.kind === "budgetUp") { text = t("lg_budgetUp", { ad: e.adName, pct: e.pct }); who = t("you"); ic = "check"; cls = "good"; }
      else if (e.kind === "user") {
        const title = e.title?.[state.lang] || e.title?.de || "";
        text = e.status === "approved" ? t("lg_dec_ok", { title }) : t("lg_dec_no", { title });
        who = t("you"); ic = e.status === "approved" ? "check" : "x"; cls = e.status === "approved" ? "good" : "bad";
        sub = [e.name, e.reason ? t("lg_reason", { r: t("r_" + e.reason) }) : ""].filter(Boolean).join(" · ");
      }
      return `<div class="log-item"><span class="log-time">${esc(dtime(e.at))}</span><span class="log-ic ${cls}">${icon(ic)}</span>
        <div class="log-main"><span class="t">${esc(text)}</span><span class="s">${esc(who)} · ${esc(e.acc.name)} ${e.acc.demo ? `<span class="pill demo">${t("demo")}</span>` : ""}${sub ? ` · ${esc(sub)}` : ""}${e.kind === "user" ? ` · <button class="undo" type="button" data-undo="${esc(e.key)}">${t("undo")}</button>` : ""}</span></div></div>`;
    };
    return `
      <div class="seg" role="group" style="justify-self:start">${["all", "dec", "sys"].map((k) => `<button type="button" data-lf="${k}" aria-pressed="${state.logFilter === k}">${t("log_" + k)}</button>`).join("")}</div>
      <section class="card log">${list.map(line).join("") || `<div class="empty">${t("log_empty")}</div>`}</section>
      ${stripFor()}`;
  }

  function vSettings() {
    const sw = (k) => `<button class="switch" type="button" role="switch" aria-checked="${!!state.notify[k]}" data-sw="${k}" aria-label="${t("n_" + k)}"></button>`;
    return `
      <section class="card">
        <div class="set-row"><div><h3>${t("set_lang")}</h3><p>${t("set_lang_d")}</p></div><div class="set-ctl"><div class="seg" style="justify-self:start">${[["de", "Deutsch"], ["en", "English"], ["tr", "Türkçe"]].map(([l, n]) => `<button type="button" data-lang="${l}" aria-pressed="${state.lang === l}">${n}</button>`).join("")}</div></div></div>
        <div class="set-row"><div><h3>${t("set_cur")}</h3><p>${t("set_cur_d")}</p></div><div class="set-ctl"><div class="seg" style="justify-self:start">${["EUR", "CHF"].map((c) => `<button type="button" data-cur="${c}" aria-pressed="${state.cur === c}">${c}</button>`).join("")}</div></div></div>
        <div class="set-row"><div><h3>${t("set_fx")}</h3><p>${t("set_fx_d")}</p></div><div class="set-ctl">
          <div class="field"><label for="fxCHF">1 EUR =</label><div class="input"><input id="fxCHF" data-fx="CHF" inputmode="decimal" value="${state.fx.CHF}"><span>CHF</span></div></div>
          <div class="field"><label for="fxTRY">1 EUR =</label><div class="input"><input id="fxTRY" data-fx="TRY" inputmode="decimal" value="${state.fx.TRY}"><span>TRY</span></div></div>
        </div></div>
        <div class="set-row"><div><h3>${t("set_target")}</h3><p>${t("set_target_d")}</p></div><div class="set-ctl">
          ${ACC.map((a) => `<div class="field"><label for="tg-${esc(a.id)}">${esc(a.name)} ${a.demo ? `<span class="pill demo">${t("demo")}</span>` : ""}</label><div class="input"><input id="tg-${esc(a.id)}" data-target="${esc(a.id)}" inputmode="decimal" placeholder="${t("auto")}" value="${esc(state.targets[a.id] ?? a.target ?? "")}"><span>${a.currency}</span></div></div>`).join("")}
        </div></div>
        <div class="set-row"><div><h3>${t("set_end")}</h3><p>${t("set_end_d")}</p></div><div class="set-ctl"><div class="input"><input id="endDate" type="date" min="${addD(RAW.since, 13)}" max="${RAW.until}" value="${state.end}" style="font-family:var(--sans)"></div></div></div>
        <div class="set-row"><div><h3>${t("set_notify")}</h3><p>${t("set_notify_d")}</p></div><div class="set-ctl">
          ${["daily", "weekly", "telegram"].map((k) => `<div class="toggle-line"><span>${t("n_" + k)}</span>${sw(k)}</div>`).join("")}
        </div></div>
        <div class="set-row"><div><h3>${t("set_accounts")}</h3><p>${t("set_accounts_d")}</p></div><div class="set-ctl">
          <div>${ACC.map((a) => `<div class="acc-line"><span class="dot" style="background:${a.demo ? "var(--demo)" : "var(--accent)"}"></span><div class="grow"><span class="t">${esc(a.name)}</span><span class="s">${a.demo ? `${t("sector_" + a.sector)} · ${esc(a.city)}` : esc(a.id)} · ${a.currency}</span></div>${pillDemo(a)}<span class="pill good"><span class="dot"></span>${t("active")}</span></div>`).join("")}</div>
          <div><button class="btn" type="button" data-act="ob-open">${icon("plug")}${t("connect")}</button></div>
          <p class="footnote" style="margin:0">${t("last_sync", { d: dtime(RAW.generatedAt) })}</p>
        </div></div>
        <div class="set-row"><div><h3>${t("set_sec")}</h3><p>${t("set_sec_d")}</p></div><div class="set-ctl"><div class="secure">${icon("lock")}<span>${t("sec_text")}</span></div></div></div>
      </section>`;
  }

  // ---------------------------------------------------------------- onboarding
  function onboarding() {
    const ob = state.ob, steps = t("ob_steps");
    let body = "";
    if (ob.step === 0) {
      body = `<span class="ob-banner">${t("ob_preview")}</span><h2>${t("ob1_h")}</h2><p>${t("ob1_p")}</p>
        <ul class="ob-list">${t("ob1_l").map((l) => `<li>${icon("check")}<span>${esc(l)}</span></li>`).join("")}</ul>
        <div>${ob.connected ? `<div class="secure">${icon("check")}<span>${t("ob1_ok", { n: ACC.length })}</span></div>`
          : `<button class="btn primary meta-btn" type="button" data-act="ob-connect" ${ob.connecting ? "disabled" : ""}>${ob.connecting ? `<span class="spin"></span>${t("ob1_wait")}` : `${icon("plug")}${t("ob1_btn")}`}</button>`}</div>`;
    } else if (ob.step === 1) {
      body = `<h2>${t("ob2_h")}</h2><p>${t("ob2_p")}</p><div style="display:grid;gap:8px">${ACC.map((a) => `<label class="ob-acc" for="oba-${esc(a.id)}"><input type="checkbox" id="oba-${esc(a.id)}" data-oba="${esc(a.id)}" ${ob.sel.includes(a.id) ? "checked" : ""}><div class="grow"><span>${esc(a.name)}</span><span class="s">${a.demo ? `${t("sector_" + a.sector)} · ${esc(a.city)}` : esc(a.id)} · ${a.currency}</span></div>${pillDemo(a)}</label>`).join("")}</div>`;
    } else if (ob.step === 2) {
      body = `<h2>${t("ob3_h")}</h2><p>${t("ob3_p")}</p>
        <div class="field"><label>${t("ob3_cur")}</label><div class="seg" style="justify-self:start">${["EUR", "CHF"].map((c) => `<button type="button" data-cur="${c}" aria-pressed="${state.cur === c}">${c}</button>`).join("")}</div></div>
        <div class="field"><label for="obTarget">${t("ob3_target")}</label><div class="input"><input id="obTarget" inputmode="decimal" placeholder="${t("auto")}" value="${esc(ob.target || "")}"><span>${state.cur}</span></div></div>`;
    } else {
      body = `<div class="success">${icon("check")}</div><h2>${t("ob4_h")}</h2><p>${t("ob4_p")}</p>`;
    }
    const canNext = ob.step === 0 ? ob.connected : ob.step === 1 ? ob.sel.length > 0 : true;
    return `<div class="ob-wrap" role="dialog" aria-modal="true" aria-label="${t("ob_t")}">
      <div class="ob">
        <div class="ob-steps"><div class="brand"><div class="brand-mark">${icon("logo")}</div><div class="brand-name">MediDent Ads</div></div>
          ${steps.map((s, i) => `<div class="ob-step ${i === ob.step ? "on" : i < ob.step ? "done" : ""}"><span class="n">${i < ob.step ? "✓" : i + 1}</span><span>${esc(s)}</span></div>`).join("")}</div>
        <div class="ob-main">${body}
          <div class="ob-foot"><span class="note">${ob.step < 3 ? `${ob.step + 1} / 4` : ""}</span>
            ${ob.step === 0 ? `<button class="btn ghost" type="button" data-act="ob-close">${t("cancel")}</button>` : ob.step < 3 ? `<button class="btn ghost" type="button" data-act="ob-back">${t("back")}</button>` : ""}
            ${ob.step < 3 ? `<button class="btn accent" type="button" data-act="ob-next" ${canNext ? "" : "disabled"}>${t("next")} ${icon("arrow")}</button>` : `<button class="btn accent" type="button" data-act="ob-close">${t("done")}</button>`}
          </div>
        </div>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------------- render
  const VIEWS = { overview: vOverview, campaigns: vCampaigns, recs: vRecs, reports: vReports, log: vLog, settings: vSettings };
  let lastCount = new Map();
  function render(opts = {}) {
    const focusId = document.activeElement?.id;
    const sel = focusId && document.activeElement.selectionStart;
    shell();
    charts.clear();
    ro.disconnect();
    const v = document.getElementById("view");
    v.innerHTML = VIEWS[state.view]();
    if (opts.still) v.style.animation = "none";
    if (state.view === "overview") { drawMain(); drawBA(); }
    if (state.view === "reports") drawRep();
    for (const id of charts.keys()) { const el = document.getElementById(id); if (el) ro.observe(el); }
    countUp();
    if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); if (sel != null && el.setSelectionRange) try { el.setSelectionRange(sel, sel); } catch {} } }
  }
  function countUp() {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("[data-count]").forEach((el, i) => {
      const to = parseFloat(el.dataset.count);
      if (!isFinite(to)) return;
      const k = state.view + i;
      const from = lastCount.has(k) ? lastCount.get(k) : to * 0.6;
      lastCount.set(k, to);
      if (reduce || from === to) return;
      const f = el.dataset.fmt, t0 = performance.now(), dur = 520;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmtVal(from + (to - from) * e, f);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function toast(msg, ic = "check") {
    const box = document.getElementById("toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `${icon(ic)}<span>${esc(msg)}</span>`;
    box.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 260); }, 2600);
  }

  function decide(key, status, reason) {
    const r = recsFor(state.end).find((x) => x.key === key) || recsFor(key.split("|")[3]).find((x) => x.key === key);
    if (!r) return;
    const title = {};
    const keep = state.lang;
    for (const l of ["de", "en", "tr"]) { state.lang = l; title[l] = t("rt_" + r.rule); }
    state.lang = keep;
    state.decisions = { ...state.decisions, [key]: { status, at: new Date().toISOString(), title, name: r.name, reason: reason || null } };
    store.set("decisions", state.decisions);
    state.reasonFor = null;
    const card = document.querySelector(`[data-rec="${CSS.escape(key)}"]`);
    const done = () => { render({ still: true }); toast(status === "approved" ? t("toast_ok") : t("toast_no"), status === "approved" ? "check" : "x"); };
    if (card && !matchMedia("(prefers-reduced-motion: reduce)").matches) { card.classList.add("leaving"); setTimeout(done, 280); } else done();
  }

  // ---------------------------------------------------------------- events
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-nav],[data-act],[data-win],[data-cur],[data-lang],[data-acc],[data-chart],[data-dec],[data-reason],[data-undo],[data-rtab],[data-sort],[data-cf],[data-lf],[data-week],[data-sw]");
    if (!el) { if (state.pop && !e.target.closest("#accSel")) { state.pop = false; render({ still: true }); } return; }
    const d = el.dataset;
    if (d.nav) { e.preventDefault(); state.view = d.nav; state.menu = false; state.pop = false; state.reasonFor = null; store.set("view", d.nav); try { history.replaceState(null, "", "#" + d.nav); } catch {} render(); scrollTo({ top: 0 }); return; }
    if (d.win) { state.win = +d.win; store.set("win", state.win); render({ still: true }); return; }
    if (d.cur) { state.cur = d.cur; store.set("cur", d.cur); render({ still: true }); return; }
    if (d.lang) { state.lang = d.lang; store.set("lang", d.lang); render({ still: true }); return; }
    if (d.acc && !el.closest("form")) { state.account = d.acc; state.pop = false; state.repWeek = 0; store.set("account", d.acc); render(); return; }
    if (d.chart) { state.chart = d.chart; drawMain(); document.querySelectorAll("[data-chart]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.chart === state.chart))); return; }
    if (d.dec === "approve") { decide(d.key, "approved"); return; }
    if (d.dec === "reject") { state.reasonFor = d.key; render({ still: true }); return; }
    if (d.reason !== undefined && d.key) { decide(d.key, "rejected", d.reason); return; }
    if (d.undo) { const n = { ...state.decisions }; delete n[d.undo]; state.decisions = n; store.set("decisions", n); render({ still: true }); toast(t("toast_undo"), "undo"); return; }
    if (d.rtab) { state.recTab = d.rtab; state.reasonFor = null; render({ still: true }); return; }
    if (d.sort) { state.sort = state.sort.key === d.sort ? { key: d.sort, dir: -state.sort.dir } : { key: d.sort, dir: d.sort === "name" || d.sort === "obj" ? 1 : -1 }; render({ still: true }); return; }
    if (d.cf) { state.campFilter = d.cf; render({ still: true }); return; }
    if (d.lf) { state.logFilter = d.lf; render({ still: true }); return; }
    if (d.week) { state.repWeek = +d.week; render({ still: true }); return; }
    if (d.sw) { state.notify = { ...state.notify, [d.sw]: !state.notify[d.sw] }; store.set("notify", state.notify); el.setAttribute("aria-checked", String(state.notify[d.sw])); return; }
    switch (d.act) {
      case "pop": state.pop = !state.pop; render({ still: true }); break;
      case "menu": state.menu = true; render({ still: true }); break;
      case "menu-close": state.menu = false; render({ still: true }); break;
      case "theme": {
        state.theme = state.theme == null ? "light" : state.theme === "light" ? "dark" : null;
        if (state.theme) document.documentElement.dataset.theme = state.theme; else delete document.documentElement.dataset.theme;
        store.set("theme", state.theme); render({ still: true }); break;
      }
      case "reason-cancel": state.reasonFor = null; render({ still: true }); break;
      case "ob-open": state.ob = { step: 0, connecting: false, connected: false, sel: ACC.map((a) => a.id), target: "" }; state.menu = false; render({ still: true }); break;
      case "ob-close": state.ob = null; render({ still: true }); break;
      case "ob-back": state.ob.step = Math.max(0, state.ob.step - 1); render({ still: true }); break;
      case "ob-next": state.ob.step = Math.min(3, state.ob.step + 1); render({ still: true }); break;
      case "ob-connect":
        state.ob.connecting = true; render({ still: true });
        setTimeout(() => { if (state.ob) { state.ob.connecting = false; state.ob.connected = true; render({ still: true }); } }, 1300);
        break;
    }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.id === "q") { state.search = el.value; render({ still: true }); return; }
    if (el.dataset.oba) { const s = new Set(state.ob.sel); el.checked ? s.add(el.dataset.oba) : s.delete(el.dataset.oba); state.ob.sel = [...s]; render({ still: true }); return; }
    if (el.id === "obTarget") { state.ob.target = el.value; return; }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.fx) { const v = parseFloat(String(el.value).replace(",", ".")); if (v > 0) { state.fx = { ...state.fx, [el.dataset.fx]: v }; store.set("fx", state.fx); render({ still: true }); } return; }
    if (el.dataset.target) { const v = String(el.value).replace(",", ".").trim(); state.targets = { ...state.targets, [el.dataset.target]: v === "" ? "" : parseFloat(v) }; store.set("targets", state.targets); recCache.clear(); render({ still: true }); return; }
    if (el.id === "endDate" && el.value) { state.end = el.value; store.set("end", el.value); recCache.clear(); render({ still: true }); return; }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.ob) { state.ob = null; render({ still: true }); }
      else if (state.pop || state.menu || state.reasonFor) { state.pop = false; state.menu = false; state.reasonFor = null; render({ still: true }); }
    }
  });
  addEventListener("hashchange", () => { const v = location.hash.slice(1); if (VIEWS[v] && v !== state.view) { state.view = v; render(); } });

  render();
})();
