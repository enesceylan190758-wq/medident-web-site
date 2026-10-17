# GTM dönüşüm düzeltmesi (önizleme bulguları)

Önizleme (`GTM-NTDLLHF`, medidentistanbul.com) özeti:

| Etiket | Durum | Neden |
|--------|--------|--------|
| GA4 Form Lead | Tetiklendi | Form Submit OK |
| GA4 WhatsApp / Telefon | Tetiklenmedi | Sadece linkClick; `target=_blank` kaçırabiliyor |
| Dc Form WM / 2025 Form (Ads) | Tetiklenmedi | Tetikleyici: URL içinde `gonderildi` — sitede böyle sayfa **yok** (AJAX form) |
| Google etiketi AW-346086325 | Çalışıyor | **Farklı Ads hesabı** — bidding `5670078321` değil |

## Yapılanlar (repo + Ads API)

1. `src/assets/js/tracking.js` — `generate_lead` / `whatsapp_click` / `phone_click` → dataLayer + gtag; eski AW-18418154075 label kaldırıldı; gclid/UTM hidden.
2. `site.mjs` — head’den yanlış `AW-18418154075` config kaldırıldı (sadece GA4).
3. Ads `5670078321` — `whatsapp_click`, `phone_click`, `generate_lead` → **primaryForGoal = true** (Max Conversions için).

## GTM’de kalan (yazma scope gerekir)

```bash
npm run google:auth
npm run google:gtm:fix-conversions
```

Script: CE tetikleyicileri ekler, GA4 etiketlerine bağlar, bozuk Ads form etiketlerini pause eder, publish eder.

### Elle (script çalışmazsa)

[GTM container](https://tagmanager.google.com/#/container/accounts/6006282282/containers/61262461/workspaces)

1. Tetikleyici **CE - whatsapp_click** (Custom Event = `whatsapp_click`) → GA4 WhatsApp etiketine ekle.
2. **CE - phone_click** → GA4 Telefon.
3. **CE - generate_lead** → GA4 Form Lead.
4. **Dc Form WM** + **2025 Form** → Pause (AW-346086325 + gonderildi).
5. Submit / Publish.

## Önizleme testi

1. Preview aç → siteye gir.
2. WhatsApp’a tıkla → `GA4 - WhatsApp Tıklama` + dataLayer `whatsapp_click`.
3. `tel:` tıkla → telefon etiketi.
4. Form gönder → `generate_lead` (zaten vardı).
5. Ads form etiketleri tetiklenmemeli (pause).

## Deploy

`tracking.js` + `site.mjs` canlıya gitmeden GTM CE’leri tam işe yaramaz (dataLayer yine de preview’da test edilebilir mevcut tracking ile; yeni generate_lead için deploy şart).
