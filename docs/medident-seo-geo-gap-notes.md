# MediDent İstanbul — SEO/GEO Gap Notes (canlı durum)

*Son güncelleme: 2026-07-31 · Domain: https://medidentistanbul.com*  
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

Kaynak sayıları (repo): GEO packs **64** (tr 22 / en 23 / de 19 / ar 0 / ru 0) · blog generated **52**.

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
