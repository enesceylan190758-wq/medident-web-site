# Dönüşüm Eylemlerini Kampanyalara Bağlama Planı

*Tarih: 2026-09-24 · Kaynak: Google Ads API (customer 5670078321, doğrudan sorgu)*

---

## Bulgu — asıl sorun "bağlama" değil, "veri akmaması"

`whatsapp_click`, `phone_click`, `generate_lead` üçü de zaten:
- **ENABLED**
- **`primaryForGoal: true`** — yani kampanyalar zaten bunları "Dönüşümler" hedefi olarak kullanıyor, ayrı bir kampanya-seviyesi seçim/bağlama işlemi **gerekmiyor**. Hat B / Hat C / SKAG kampanyalarının hiçbiri `selective_optimization` ile kısıtlanmamış → hesabın tüm primary dönüşümlerini otomatik sayıyorlar.

Yani "kampanyalara bağlama" adımı **teknik olarak zaten yapılmış**. Asıl kırık olan yer: **bu üç eylemin hiçbirine hiç veri gelmemiş** (2022'den bugüne 0 dönüşüm). Sorun bağlantı değil, **event'lerin siteden hiç ateşlenmemesi veya GTM→GA4→Ads zincirinin bir yerde kopması.**

Tek ufak tutarsızlık: `generate_lead` → `includeInConversionsMetric: false`. Bu, "Dönüşümler" sütununda görünmeyeceği anlamına gelir (raporlama ayarı, bidding'i etkilemez ama görünürlüğü bozar). Düzeltilmeli.

---

## Kontrol zinciri (sırayla, her adım bir öncekini doğrular)

### 1. Site tarafında event gerçekten ateşleniyor mu?
`src/assets/js/site.js` ve `src/assets/js/tracking.js` içinde `whatsapp_click` / `phone_click` / `generate_lead` (veya GA4 karşılığı) dataLayer'a push ediliyor mu — kod tarafı zaten bu repoda, kontrol edilebilir.
**Aksiyon (ben yapabilirim):** kodu okuyup event isimlerinin GTM tetikleyicileriyle birebir eştiğini doğrularım.

### 2. GTM konteynerinde tetikleyici + etiket var mı, yayınlanmış mı?
`npm run google:gtm:fix-conversions` scripti repo'da hazır — CE (custom event) tetikleyicilerini (`whatsapp_click`/`phone_click`/`generate_lead`) oluşturup GA4 etiketlerine bağlıyor, eski/çift formları (Dc Form WM, 2025 Form) duraklatıyor, workspace'i **publish** ediyor.

⚠️ Bu script **canlı GTM konteynerine yazıyor ve yayınlıyor** (GTM-NTDLLHF, sitenin şu an kullandığı konteyner) — outward-facing bir işlem, **çalıştırmadan önce onay lazım.**
Şu an ayrıca **Tag Manager API bu Cloud projesinde kapalı** (`743135910038`), script çalışmadan önce Enes'in şunu açması gerekiyor:
[console.cloud.google.com/apis/api/tagmanager.googleapis.com?project=earnest-vent-484108-f5](https://console.cloud.google.com/apis/api/tagmanager.googleapis.com?project=earnest-vent-484108-f5)

### 3. GA4'te bu event'ler "conversion" olarak işaretli mi?
GA4 tarafında `generate_lead`, `whatsapp_click`, `phone_click` custom event'lerinin "Mark as conversion" anahtarı açık olmalı. GA4 Data API bu projede kapalı, açılınca API'den de doğrulanabilir; şimdilik GA4 arayüzünden Enes bakabilir: **Yönetici → Etkinlikler**.

### 4. GA4 → Ads import gerçekten veri getiriyor mu?
Ads tarafında zaten `GOOGLE_ANALYTICS_4_CUSTOM` / `GOOGLE_ANALYTICS_4_GENERATE_LEAD` tipinde import edilmiş görünüyor (bağlantı var), ama **hiç sayı gelmemiş**. Bu genelde iki sebepten olur: (a) GA4 tarafında hiç event tetiklenmemiş (adım 1-3 kırık), veya (b) GA4↔Ads linki var ama import job'ı hiç çalışmamış/durmuş.

### 5. `generate_lead` raporlama ayarını düzelt
`includeInConversionsMetric: true` yap (şu an `false`). Bu, mutate izniyle tek satırlık bir API çağrısı — Tag Manager API'ye gerek yok, `googleAds:mutate` ile şimdi bile yapılabilir.

---

## Enes'e kısa madde listesi

1. **Tag Manager API'yi aç** (yeni Cloud projede kapalı): [link yukarıda](#2-gtm-konteynerinde-tetikleyici--etiket-var-mı-yayınlanmış-mı)
2. **GA4 → Yönetici → Etkinlikler**'de `whatsapp_click`, `phone_click`, `generate_lead` gerçekten "conversion" işaretli mi, son 30 günde en az 1 kayıt var mı bak, ekran görüntüsü at.
3. Siteden bizzat bir WhatsApp/telefon linkine tıkla, GA4 **Gerçek Zamanlı** raporunda event düşüyor mu canlı test et.
4. Tag Manager API açılınca haber ver — `npm run google:gtm:fix-conversions`'ı **senin onayınla** çalıştırırım (canlı konteynere yazıyor).
5. `generate_lead` dönüşüm metriği görünürlüğünü düzeltmemi istersen onayla, ayrı ve düşük riskli bir mutate, hemen yaparım.
