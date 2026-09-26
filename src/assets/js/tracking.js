/* ============================================================================
   MediDent İstanbul — Dönüşüm İzleme
   ----------------------------------------------------------------------------
   GTM (GTM-NTDLLHF) + GA4 (G-WP6XMC87YB) → Ads hesabı 5670078321
   (GA4 import: whatsapp_click, phone_click, generate_lead)

   Eski AW-18418154075 / 502-170-9821 etiketleri KULLANILMAZ — yanlış hesap.
   GTM içindeki AW-346086325 form etiketleri de ayrı hesap; bidding 5670… için
   GA4 olayları birincil kaynaktır.
   ========================================================================== */

(function () {
  "use strict";

  var DEDUPE_MS = 3000;
  var lastFired = {};

  window.dataLayer = window.dataLayer || [];

  function track(eventName, meta) {
    var now = Date.now();
    if (lastFired[eventName] && now - lastFired[eventName] < DEDUPE_MS) return;
    lastFired[eventName] = now;

    meta = meta || {};

    // 1) GTM Custom Event — GA4 etiketleri bunu dinler
    try {
      window.dataLayer.push({
        event: eventName,
        lead_source: meta.source || "",
        page_lang: document.documentElement.lang || "tr",
      });
    } catch (e) {}

    // 2) gtag doğrudan (GTM gecikse bile GA4'e düşsün)
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, {
          lead_source: meta.source || "",
          page_lang: document.documentElement.lang || "tr",
        });
      }
    } catch (e) {}

    // 3) Meta Pixel
    try {
      if (typeof window.fbq === "function") {
        var metaEvent =
          eventName === "generate_lead" || eventName === "lead_form_submit"
            ? "Lead"
            : "Contact";
        window.fbq("track", metaEvent, {
          content_name: eventName,
          content_category: meta.source || "",
        });
      }
    } catch (e) {}
  }

  /* --- Form → generate_lead (+ legacy lead_form_submit) -------------------- */

  function fireFormLead(source) {
    track("generate_lead", { source: source || "form" });
    track("lead_form_submit", { source: source || "form" });
  }

  document.addEventListener(
    "submit",
    function (e) {
      var form = e.target;
      if (form && form.classList && form.classList.contains("form-main")) {
        fireFormLead("form_submit");
      }
    },
    true
  );

  function watchFormSuccess() {
    var box = document.querySelector(".form-success");
    if (!box) return;

    var isVisible = function (el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    };

    var wasVisible = isVisible(box);
    var observer = new MutationObserver(function () {
      var nowVisible = isVisible(box);
      if (nowVisible && !wasVisible) {
        fireFormLead("form_success");
      }
      wasVisible = nowVisible;
    });

    observer.observe(box, { attributes: true, attributeFilter: ["style", "class", "hidden"] });
    if (box.parentElement) {
      observer.observe(box.parentElement, { childList: true, subtree: true, attributes: true });
    }
  }

  /* --- Ref kodu — sabit whitelist, ham kelime/kampanya asla mesaja yazılmaz.
     Öncelik: ?ref= (Ads final URL'ine ileride eklenebilir) → ?h= (DTR
     anahtarı, dis-implant-fiyat/ sayfasında zaten var) → utm_campaign.
     Eşleşme yoksa null döner — mesaja Ref satırı eklenmez. -------------- */

  var REF_MAP = {
    // DTR anahtarları (dis-implant-fiyat/?h=...) — bkz. kampanya-kurulum-taslagi
    "implant-fiyat": "TR-IMP1",
    "turkiye-implant": "TR-IMP2",
    "rakip-karsilastir": "TR-CMP",
    "medident-istanbul": "TR-BRAND",
    // utm_campaign / gelecekteki ?ref= değerleri için aynı whitelist
    "implant": "TR-IMP",
    "all-on-4": "TR-AO4",
    "hat-b-de": "DE-DENT",
    "hat-c-fr": "FR-DENT",
  };

  // Konum kodu (?l=) ref'in sonuna eklenir: TR-IMP-KRT. Sabit whitelist.
  var REF_LOC = {
    "istanbul": "IST", "turkiye": "TR", "memleket": "MEM", "tatil": "TAT",
    "anadolu-yakasi": "ANA", "uskudar": "USK", "acibadem": "ACI", "kadikoy": "KDK",
    "atasehir": "ATS", "umraniye": "UMR", "maltepe": "MLT", "kartal": "KRT",
    "pendik": "PND", "tuzla": "TZL", "sancaktepe": "SNC", "sultanbeyli": "SLT",
  };

  function resolveRefCode(store) {
    if (!store) return null;
    var token = store.ref || store.h || store.utm_campaign;
    var base = token ? REF_MAP[token] : null;
    if (!base && store.l && REF_LOC[store.l]) base = REF_MAP["implant"];
    if (!base) return null;
    if (store.l && REF_LOC[store.l]) base += "-" + REF_LOC[store.l];
    return base;
  }

  function appendRef(text, refCode) {
    if (!refCode) return text;
    return (text || "") + (text ? "\n\n" : "") + "Ref: " + refCode;
  }

  /* --- Sessiz kayıt (form + doğrudan WhatsApp) — WhatsApp açılışını asla
     bekletmez/engellemez. sendBeacon varsa onu, yoksa fetch keepalive
     kullanır; yanıt hiç okunmaz (fire-and-forget). ---------------------- */

  function recordLead(payload) {
    try {
      var cfg = window.__MD_FORM__ || {};
      var endpoint = cfg.recordEndpoint;
      if (!endpoint) return;
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
        navigator.sendBeacon(endpoint, blob);
      } else if (typeof fetch === "function") {
        fetch(endpoint, { method: "POST", body: body, keepalive: true, mode: "no-cors" }).catch(function () {});
      }
    } catch (e) {}
  }

  function basePayload(sourceType, attribution) {
    var stored = getStore();
    return {
      source_type: sourceType,
      ref_code: resolveRefCode(stored) || "",
      attribution: attribution || stored,
      landing_page: stored.landing_page || location.href,
      page_url: location.href,
      lang: document.documentElement.lang || "tr",
    };
  }

  /* --- WhatsApp / Telefon ------------------------------------------------- */

  document.addEventListener(
    "click",
    function (e) {
      var link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;

      var href = link.getAttribute("href") || "";
      var hrefLower = href.toLowerCase();

      if (hrefLower.indexOf("wa.me") !== -1 || hrefLower.indexOf("whatsapp.com") !== -1 || hrefLower.indexOf("api.whatsapp.com") !== -1) {
        var source = link.classList && link.classList.contains("wa-float") ? "wa_float" : "wa_link";
        track("whatsapp_click", { source: source });

        var stored = getStore();
        var refCode = resolveRefCode(stored);
        if (refCode) {
          try {
            var u = new URL(href, location.href);
            var currentText = u.searchParams.get("text") || "";
            if (currentText.indexOf("Ref: " + refCode) === -1) {
              u.searchParams.set("text", appendRef(currentText, refCode));
              link.setAttribute("href", u.toString());
            }
          } catch (err) {}
        }

        recordLead(
          Object.assign(basePayload("whatsapp_direct"), {
            treatment: "",
            name: "",
            phone: "",
            email: "",
            message: "",
          })
        );
        return;
      }

      if (hrefLower.indexOf("tel:") === 0) {
        track("phone_click", { source: "tel_link" });
      }
    },
    true
  );

  /* --- UTM / gclid / landing page → sessionStorage + form hidden --------- */

  function getStore() {
    try {
      return JSON.parse(sessionStorage.getItem("md_attr") || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function captureAttribution() {
    try {
      var params = new URLSearchParams(window.location.search);
      var keys = ["ref", "h", "l", "gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "kw"];
      var store = getStore();
      keys.forEach(function (k) {
        var v = params.get(k);
        if (v) store[k] = v;
      });
      // İlk giriş sayfası bir kez kaydedilir, sonraki sayfa gezinmelerinde
      // ezilmez (oturum boyunca "landing page" anlamını korur).
      if (!store.landing_page) store.landing_page = location.href;
      sessionStorage.setItem("md_attr", JSON.stringify(store));
      return store;
    } catch (e) {
      return {};
    }
  }

  function fillHiddenFields(store) {
    var forms = document.querySelectorAll("form.form-main, form[data-lead-form]");
    forms.forEach(function (form) {
      Object.keys(store).forEach(function (k) {
        var input = form.querySelector('input[name="' + k + '"]');
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          form.appendChild(input);
        }
        input.value = store[k];
      });
    });
  }

  function boot() {
    var store = captureAttribution();
    fillHiddenFields(store);
    watchFormSuccess();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // site.js form gönderiminin kullanması için — whitelist tek yerde kalsın.
  window.MDTrack = {
    getStore: getStore,
    resolveRefCode: resolveRefCode,
    appendRef: appendRef,
    recordLead: recordLead,
    basePayload: basePayload,
  };
})();
