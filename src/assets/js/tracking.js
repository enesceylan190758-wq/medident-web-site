/* ============================================================================
   MediDent İstanbul — Dönüşüm İzleme Kodu
   ----------------------------------------------------------------------------
   NEREYE:  Her sayfada, </body> etiketinden hemen ÖNCE.
            (GTM ve gtag kodlarından SONRA gelmeli.)
            Tüm dillerde geçerli: /, /en/, /de/, /ar/, /ru/

   NE YAPAR: Aşağıdaki 4 eylemi Google Ads + GA4 + Meta Pixel'e olay olarak
             gönderir. Mevcut hiçbir kodu değiştirmez, sadece dinler.

               1) Form gönderimi ("Ücretsiz Teklif İste")   -> lead_form_submit
               2) Sabit WhatsApp ikonu (.wa-float)          -> whatsapp_click
               3) Sayfadaki tüm wa.me linkleri              -> whatsapp_click
               4) tel: linkleri                             -> phone_click
   ========================================================================== */

(function () {
  'use strict';

  /* --- AYARLAR ------------------------------------------------------------ */

  // Google Ads conversion tag (account 502-170-9821)
  var AW_ID = 'AW-18418154075';

  var LABELS = {
    lead_form_submit: 'IzvWCIjLve0cENv0us5E',
    whatsapp_click:   'RB7UCIvLve0cENv0us5E',
    phone_click:      'eefnCI7Lve0cENv0us5E'
  };

  // Meta Pixel olay eşlemesi
  var META_EVENTS = {
    lead_form_submit: 'Lead',
    whatsapp_click:   'Contact',
    phone_click:      'Contact'
  };

  // Aynı olayı bu kadar milisaniye içinde tekrar gönderme (çift sayımı önler)
  var DEDUPE_MS = 3000;

  /* --- ÇEKİRDEK ----------------------------------------------------------- */

  window.dataLayer = window.dataLayer || [];

  var lastFired = {};

  function track(eventName, meta) {
    var now = Date.now();
    if (lastFired[eventName] && now - lastFired[eventName] < DEDUPE_MS) return;
    lastFired[eventName] = now;

    meta = meta || {};

    // 1) GTM / GA4 — dataLayer'a olay bas
    try {
      window.dataLayer.push({
        event: eventName,
        lead_source: meta.source || '',
        page_lang: document.documentElement.lang || 'tr'
      });
    } catch (e) {}

    // 2) Google Ads — doğrudan dönüşüm (GTM kurulmasa bile çalışır)
    try {
      var label = LABELS[eventName];
      if (typeof window.gtag === 'function' && label) {
        window.gtag('event', 'conversion', {
          send_to: AW_ID + '/' + label
        });
      }
    } catch (e) {}

    // 3) Meta Pixel
    try {
      var metaEvent = META_EVENTS[eventName];
      if (typeof window.fbq === 'function' && metaEvent) {
        window.fbq('track', metaEvent, {
          content_name: eventName,
          content_category: meta.source || ''
        });
      }
    } catch (e) {}
  }

  /* --- 1) FORM GÖNDERİMİ --------------------------------------------------- */
  /* Form AJAX ile çalışıyor ve başarıda .form-success bloğu gösteriliyor.
     İki yolu birden dinliyoruz: submit olayı + .form-success görünür olması.
     DEDUPE_MS sayesinde ikisi birden tetiklense de tek dönüşüm sayılır.      */

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form && form.classList && form.classList.contains('form-main')) {
      track('lead_form_submit', { source: 'form' });
    }
  }, true);

  function watchFormSuccess() {
    var box = document.querySelector('.form-success');
    if (!box) return;

    var isVisible = function (el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    };

    // Zaten görünür durumda açıldıysa sayma — sadece değişimi izle
    var wasVisible = isVisible(box);

    var observer = new MutationObserver(function () {
      var nowVisible = isVisible(box);
      if (nowVisible && !wasVisible) {
        track('lead_form_submit', { source: 'form' });
      }
      wasVisible = nowVisible;
    });

    observer.observe(box, { attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
    if (box.parentElement) {
      observer.observe(box.parentElement, { childList: true, subtree: true, attributes: true });
    }
  }

  /* --- 2, 3, 4) WHATSAPP VE TELEFON TIKLAMALARI ---------------------------- */
  /* Delege dinleyici: sayfaya sonradan eklenen linkler de yakalanır.
     capture=true ile yönlendirme başlamadan önce tetiklenir.                 */

  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!link) return;

    var href = link.getAttribute('href') || '';

    // Sabit WhatsApp ikonu mu, sayfa içi WhatsApp linki mi ayırt et
    if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp.com') !== -1) {
      var source = link.classList && link.classList.contains('wa-float')
        ? 'wa_float'
        : 'wa_link';
      track('whatsapp_click', { source: source });
      return;
    }

    if (href.indexOf('tel:') === 0) {
      track('phone_click', { source: 'tel_link' });
    }
  }, true);

  /* --- BAŞLAT -------------------------------------------------------------- */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchFormSuccess);
  } else {
    watchFormSuccess();
  }
})();
