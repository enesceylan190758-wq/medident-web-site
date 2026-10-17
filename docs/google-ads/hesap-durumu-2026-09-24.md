# İstanbul Dent (5670078321) — Hesap Durumu ve Reklam Kurulum Notu

*Tarih: 2026-09-24 · Kaynak: Google Ads API (googleAds:search, doğrudan hesap erişimi, proje 743135910038 Explorer)*

---

## 🔴 Blokaj #1 — Hesap harcama limiti aşılmış

```
account_budget: status APPROVED
  approved_spending_limit_micros: 31.021,38 TL
  amount_served_micros:           31.350,59 TL   (limit üstü: 329,21 TL)
```

Bu yüzden **hesaptaki her kampanya** (yeni DE/FR/SKAG dahil, eski 20+ kampanya dahil) `serving_status: SUSPENDED`. Kampanya durumu ENABLED/PAUSED olması fark etmiyor — hesap seviyesinde tıkanmış.

**Aksiyon (Enes, Ads arayüzünden):** Araçlar → Faturalandırma → Hesap bütçeleri → limiti yenile/yükselt. API üzerinden hesap bütçesi oluşturma/düzenleme bu erişim seviyesinde yapılamıyor, Ads UI'dan yapılmalı.

---

## 🔴 Blokaj #2 — Dönüşüm izleme hiç çalışmamış

2022'den bugüne ~31.000 TL harcama, gerçek tıklamalar var, **0 kayıtlı dönüşüm.**

Aktif GA4 içe aktarılan dönüşümler (ENABLED ama hiç veri gelmemiş):
- `Medident (web) whatsapp_click` — GOOGLE_ANALYTICS_4_CUSTOM
- `Medident (web) phone_click` — GOOGLE_ANALYTICS_4_CUSTOM
- `Medident (web) generate_lead` — GOOGLE_ANALYTICS_4_GENERATE_LEAD
- `Medident (web) purchase` — GOOGLE_ANALYTICS_4_PURCHASE (HIDDEN)

Yeni kampanyaların üçü de `Maximize Conversions` stratejisiyle kuruldu ve şu an `BIDDING_STRATEGY_LEARNING` durumunda — dönüşüm verisi akmadan bu asla optimize olmaz.

**Aksiyon:** Bütçe açılmadan önce GA4→Ads dönüşüm aktarımının gerçekten tetiklendiğini doğrulamak lazım (GTM event testi + Ads "Dönüşümler" ekranında son 7 gün veri var mı bakılmalı). `npm run google:gtm:fix-conversions` scripti bu iş için repo'da zaten var, ölçüm kurulumu tamamlanmadan yeni bütçe açmak aynı hikayeyi tekrar eder: para gider, sinyal gelmez.

---

## Gerçek arama terimi verisi (Keyword Planner API kapalı — bunun yerine geçmiş kampanya verisi kullanıldı)

Tüm zamanlar, tıklamaya göre sıralı, tam liste script çıktısında. Öne çıkanlar:

**Almanca — fiyat/maliyet odaklı (en çok tıklanan):**
`zahnimplantate preisliste` · `zahnimplantate preise` · `was kosten komplett neue zähne` · `zähne bleichen kosten türkei` · `feste dritte zähne kosten` · `zahnersatz türkei preise` · `kompletter zahnersatz kosten` · `zahnkrone kosten türkei` · `veneers kosten türkei`

**İngilizce:**
`full mouth dental implants turkey price list` · `teeth implants turkey` · `dental implants turkey (cost)` · `teeth in a day turkey` · `cheap dental implants turkey`

**Rakip marka aramaları (yüksek tıklama, düşünülmeye değer):**
`istadental` / `istadental istanbul preise` · `lema clinic istanbul` / `lema dental clinic erfahrungen` · `omer istanbul` / `ömer istanbul diş polikliniği` · `dentfix istanbul` · `academic zahnklinik istanbul` · `baron dental clinic` (Side) · `yes smile istanbul erfahrungen`

**TR yerel (düşük hacim ama sıfır maliyetli fırsat):**
`istanbul dis hastanesi` · `diş kaplama çeşitleri` · `diş köprü fiyatları`

Not: Bu veri gerçek tıklama/maliyet gösteriyor ama **dönüşüm hep 0** olduğu için "hangi kelime satış getiriyor" sorusuna cevap vermiyor — sadece "hangi kelime trafik/tıklama getiriyor" sorusuna cevap veriyor. Blokaj #2 çözülmeden bu ayrımı yapamayız.

---

## Sonraki adım

1. Enes: hesap bütçesini yenile.
2. Ölçüm (GA4→Ads dönüşüm aktarımı) doğrulansın — gerekirse `npm run google:gtm:fix-conversions`.
3. İkisi de tamam olunca: yeni DE/DE_TR kampanyalarına küçük bütçeyle (mevcut PAUSED reklam grupları zaten hazır) başla, 1-2 hafta canlı arama terimi raporuyla gerçek hacim/dönüşüm verisi topla — Keyword Planner API'sine artık ihtiyaç kalmıyor.
