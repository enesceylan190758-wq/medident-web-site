# MediDent İstanbul — SEO/GEO Gap Notes (canlı durum)

*Son güncelleme: 2026-09-23 · Domain: https://medidentistanbul.com*  
*Plan: `docs/medident-seo-geo-ajan-plani.md` · Rakip: `docs/medident-rakip-anahtar-kelime-arastirmasi.md`*

Bu dosya **canlı site envanteri + açık gap listesidir**. Cloud ajan her koşuda önce bunu ve `src/content/geo/packs.json` / `generated-blog.json` okur; tahminle gap uydurmaz. Smoke sonrası güncelle.

---

## Katman ayrımı (karıştırma)

| Katman | Ne | Nerede | Cursor Automation |
|--------|----|--------|-------------------|
| **A** Günlük yayın + yönetici maili | İskelet üretim / deploy / SMTP özeti | VPS cron veya GitHub Actions (`weekly-content.yml` / `daily-content.yml`) | **Yerine geçme.** Mail üretme. Çift SMTP yok. |
| **B** Strateji / GEO / SEO | Araştırma → Director → orijinal içerik → uyum → PR | Bu Cursor Automation | **Senin işin.** |

---

## Smoke (2026-07-31 örnek)

| URL | HTTP |
|-----|------|
| `/geo/` | 200 |
| `/en/geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/` | 200 |
| `/en/geo/is-dental-treatment-in-turkey-safe/` | 200 |
| `/geo/turkiyede-dis-tedavisi-guvenli-mi/` | 200 |
| `/de/geo/ist-zahnbehandlung-in-der-tuerkei-sicher/` | 200 |
| `/en/geo/dental-aftercare-when-you-return-home/` | 200 |
| `/ar/`, `/ru/` | 200 (UI var; native GEO pack ≈ 0) |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | 200 |

Kaynak sayıları (repo): GEO packs **64** (tr 22 / en 23 / de 19 / ar 0 / ru 0) · blog generated **62**.

---

## Tamamlanan (plan Faz 0–2 + gap paketleri)

- Thin TR GEO şablon rewrite (Faz 0) — packs `source: seo-geo-plan-phase`
- Trust serisi: TR/EN/DE “Türkiye’de diş tedavisi güvenli mi?”
- UK: Turkey teeth dürüst GEO
- Aftercare (EN): eve dönüş sonrası takip
- Yerel: Üsküdar/Acıbadem (TR + EN)
- Malzeme/marka: zirconia vs E-max / implant brands (EN + DE)
- Otorite: accreditation verify (EN)
- Fiyat şeffaflığı: why cheaper (EN + DE)

---

## Açık gap’ler (öncelik sırası)

### P0 — pazar/dil boşlukları
1. **DE Nachsorge / Garantie-Rahmen** — UK aftercare var; DE eşdeğer “Zahnbehandlung Türkei Nachsorge” yok (garanti vaadi yasak; süreç/çerçeve anlat).
2. **UK veneers Turkey / implants Turkey cost** — güven sayfaları var; ticari long-tail rehber zayıf.
3. **AR / RU native GEO** — dil UI açık, packs.json’da ar/ru ≈ 0. Fallback EN kabul; native tercih.

### P1 — yerel TR SEO
4. İlçe + hizmet long-tail (`Üsküdar implant`, `Acıbadem zirkonyum`) — tek klinik rehberi var; hizmet×semt derinliği eksik.
5. TR’de hasta yorumu / öncesi-sonrası / garanti reklamı **yok** (yönetmelik).

### P2 — GEO/AI alıntı kalitesi
6. Tedavi bazlı yorum paketleri (implant / veneer) — yasal gating: EN/DE/AR/RU’da onamlı; TR’de kullanma.
7. Hekim imzalı E-E-A-T — blog/GEO’da isimli hekim tutarsız; `content.mjs` doktorlarıyla hizala.
8. Çeyreklik tazelik: 90+ gün eski packs’e `updatedAt` + madde güncellemesi.

### P3 — üçüncü taraf / ölçüm
9. PR bülteni + dizin (Maltepe modeli) — site dışı; ajan sadece brief/liste üretir, spam yorum yazmaz.
10. Aylık ChatGPT/Perplexity/Gemini alıntı testi + GSC manuel indeks listesi.

---

## Rotasyon (haftalık pazar)

`DE → UK → TR → AR/MENA → RU → ölçüm`  
Her koşuda **tek pazar**, max **1 güçlü GEO + 1 blog** (üst sınır 2 sayfa). Memories’te son pazar + son slug’ları oku; tekrarı reddet.

---

## Hukuki gri alan (özet checklist)

- **TR içerik:** hasta yorumu, öncesi-sonrası, garanti/kesin sonuç, yanıltıcı fiyat → **RED**.
- **Yabancı dil (sağlık turizmi):** abartılı tıbbi iddia, kaynaksız istatistik, “garanti iyileşme”, rakip aşağılama → **RED**.
- Yazılı süreç/aftercare/garanti **belgesi çerçevesi** anlatılabilir; sonuç vaadi verilemez.
- Detay: plan §5 · Director kuralı: `.cursor/rules/medident-content-director.mdc`

---

## Ajan güncelleme protokolü

Her başarılı koşu sonunda bu dosyaya ekle:
- Tarih, pazar, üretilen slug’lar, canlı smoke kodları
- Kapanan / yeni açılan gap (1–3 satır)
- GSC’ye manuel gönderilecek URL listesi

---

## Koşu 2026-09-18 (günlük blog otomasyonu)

- Pazar: **DE** (EN 16 / DE 16 blog — eşitlikte rotasyon DE)
- Üretilen: `/de/blog/sinuslift-kosten-tuerkei-istanbul/` (fiyat/paket niyeti; somut EUR yok)
- Canlı smoke: yok (PR taslak, merge/deploy yok)
- Kapanan gap: DE “Sinuslift / Knochenaufbau Kosten” blog yoktu
- Açık kalan P0: DE Nachsorge çerçevesi; AR/RU native GEO
- GSC (merge sonrası): `https://medidentistanbul.com/de/blog/sinuslift-kosten-tuerkei-istanbul/`
- İnsan onayı: `reviewer` / `reviewedAt` boş — `npm run seo:approve -- --slugs sinuslift-kosten-tuerkei-istanbul --by "Dr. …"`

---

## VERI-DESTEKLI KONU BACKLOG'U (2026-09-18, GSC + Keyword Planner)

**Yeni çalışma modeli:** Bundan sonra Cursor Automation konu SEÇMEZ. Aşağıdaki backlog tablosundan sıradaki "bekliyor" satırını kullanır, durumu "uretildi" olarak işaretler, yeni satır eklemez. Backlog bittiğinde otomasyon PR açmadan durur ve run-log'a "backlog boş, insan araştırması gerekiyor" yazar. Backlog'u sadece Enes + Claude gerçek veriyle (GSC / Keyword Planner) günceller.

Kaynak notları: açık PR #54 (`docs: GSC + Keyword Planner backlog guncellemesi`) — TR Planner'da "zirkon kaplama fiyat" en yüksek hacimli grup; "dis implant fiyat" ikinci. DE kısa kuyruk (kosten/preis + türkei) Planner eşiğinin altında; GSC'de Almanya tıklaması uzun/doğal sorgulardan geliyor. UK "turkey teeth" site-genel sıralama değil.

| # | Dil | Konu | Durum | Slug / not |
|---|-----|------|-------|------------|
| 1 | TR | Zirkon kaplama fiyatları 2026 nelere bağlıdır. Fiyat aralığı değil; malzeme, diş sayısı, klinik değerlendirme. Gerçek TL/USD yok. | **uretildi** (2026-09-19, PR #55) | `zirkon-kaplama-fiyatlari-2026` |
| 2 | TR | Diş implant fiyatı neden klinikten kliniğe değişir. Marka ve kemik grefti ihtiyacı gibi değişkenler; fiyat uydurma yok. | **uretildi** (2026-09-20, PR #56) | `dis-implant-fiyati-neden-klinikten-klinige-degisir` |
| 3 | DE | Sinuslift Kosten Türkei | uretildi (2026-09-18, PR #52) | `sinuslift-kosten-tuerkei-istanbul` |
| 4 | DE | Zahnimplantat Türkei: süreç, bakım ve fiyatı gerçekten ne etkiler. DE Nachsorge P0 gap'ini de kapatır. | **uretildi** (2026-09-21) | `zahnimplantat-tuerkei-ablauf-nachsorge` |
| 5 | TR | Lamina diş kaplama nedir, kime uygundur. TR aramasında veneer yerine lamina/kaplama. | **uretildi** (2026-09-22) | `lamina-dis-kaplama-nedir-kime-uygundur` |
| 6 | EN | All-on-4 in Turkey, the procedure explained. TR değil; TR'de ölçülebilir hacim yok. | **uretildi** (2026-09-23) | `all-on-4-in-turkey-procedure-explained` |
| 7 | GEO TR+EN+DE | Türkiye'de diş tedavisi fiyatları neden daha ucuz — şeffaflık ve güven çerçevesi. Garanti/kesin sonuç yok. | bekliyor | |

Yeni satır eklemeden önce: GSC'de o ay gerçek sorgu/tıklama var mı, Keyword Planner'da TR için hacim var mı, DE/EN için en azından GSC sorgu kanıtı var mı. Otomasyon bu listeyi değiştiremez, sadece durum alanını günceller.

---

## Koşu 2026-09-19 (günlük blog otomasyonu)

- Pazar: **TR** — backlog #1 (bekliyor sırasının en üstü); konu tahmin edilmedi
- Üretilen: `/blog/zirkon-kaplama-fiyatlari-2026/` (fiyat faktörleri; somut TL/USD/EUR yok) — PR #55 taslak
- Canlı smoke: yok (PR taslak, merge/deploy yok)
- İnsan onayı: `reviewer` / `reviewedAt` boş — `npm run seo:approve -- --slugs zirkon-kaplama-fiyatlari-2026 --by "Dr. …"`

---

## Koşu 2026-09-20 (günlük blog otomasyonu)

- Pazar: **TR** — backlog #2 (bekliyor sırasının en üstü); konu tahmin edilmedi
- Üretilen: `/blog/dis-implant-fiyati-neden-klinikten-klinige-degisir/` (klinikler arası sapma: marka + kemik grefti; somut TL/USD/EUR yok) — PR #56 taslak
- Canlı smoke: yok (PR taslak, merge/deploy yok)
- Kapanan gap: TR “dis implant fiyat” (Planner ikinci hacim) — klinik-klinik değişkenler; tanım `/geo/dis-implant-nedir/` ayrı duruyor
- Açık kalan: backlog #4 DE Nachsorge/implant süreç, #5–7
- GSC (merge sonrası): `https://medidentistanbul.com/blog/dis-implant-fiyati-neden-klinikten-klinige-degisir/`
- İnsan onayı: `reviewer` / `reviewedAt` boş — `npm run seo:approve -- --slugs dis-implant-fiyati-neden-klinikten-klinige-degisir --by "Dr. …"`

---

## Koşu 2026-09-21 (günlük blog otomasyonu)

- Pazar: **DE** — backlog #4 (bekliyor sırasının en üstü); konu tahmin edilmedi
- Üretilen: `/de/blog/zahnimplantat-tuerkei-ablauf-nachsorge/` (Ablauf + Nachsorge + Preisfaktoren; somut EUR yok)
- Canlı smoke: yok (PR taslak, merge/deploy yok)
- Kapanan gap: DE Nachsorge / Zahnimplantat Türkei süreç-bakım-fiyat etkenleri (P0 blog katmanı). Tanım `/de/geo/was-ist-ein-zahnimplantat/` ve Kosten-Landing ayrı duruyor
- Açık kalan: backlog #5–7; AR/RU native GEO
- GSC (merge sonrası): `https://medidentistanbul.com/de/blog/zahnimplantat-tuerkei-ablauf-nachsorge/`
- İnsan onayı: `reviewer` / `reviewedAt` boş — `npm run seo:approve -- --slugs zahnimplantat-tuerkei-ablauf-nachsorge --by "Dr. …"`

---

## Koşu 2026-09-22 (günlük blog otomasyonu)

- Pazar: **TR** — backlog #5 (bekliyor sırasının en üstü); konu tahmin edilmedi
- Üretilen: `/blog/lamina-dis-kaplama-nedir-kime-uygundur/` (tanım + adaylık; veneer yerine lamina/kaplama; somut TL/USD/EUR yok)
- Canlı smoke: yok (PR taslak, merge/deploy yok)
- Kapanan gap: TR “lamina diş kaplama nedir / kime uygundur” (Planner: veneer yerine lamina). Kısa tanım `/geo/porselen-lamina-nedir/` ayrı duruyor
- Açık kalan: backlog #6–7; AR/RU native GEO
- GSC (merge sonrası): `https://medidentistanbul.com/blog/lamina-dis-kaplama-nedir-kime-uygundur/`
- İnsan onayı: `reviewer` / `reviewedAt` boş — `npm run seo:approve -- --slugs lamina-dis-kaplama-nedir-kime-uygundur --by "Dr. …"`

---

## Koşu 2026-09-23 (günlük blog otomasyonu)

- Pazar: **EN** — backlog #6 (bekliyor sırasının en üstü); konu tahmin edilmedi
- Üretilen: `/en/blog/all-on-4-in-turkey-procedure-explained/` (prosedür adımları; somut USD/EUR/GBP yok)
- Canlı smoke: yok (PR taslak, merge/deploy yok)
- Kapanan gap: EN “All-on-4 in Turkey, the procedure explained”. Kısa tanım `/en/geo/what-is-all-on-4/` ve maliyet özeti `/en/blog/all-on-4-dental-implants-istanbul-cost/` ayrı duruyor
- Açık kalan: backlog #7 (GEO TR+EN+DE fiyat şeffaflığı); AR/RU native GEO
- GSC (merge sonrası): `https://medidentistanbul.com/en/blog/all-on-4-in-turkey-procedure-explained/`
- İnsan onayı: `reviewer` / `reviewedAt` boş — `npm run seo:approve -- --slugs all-on-4-in-turkey-procedure-explained --by "Dr. …"`
