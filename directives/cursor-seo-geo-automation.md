# MediDent — Cursor Automation (haftalık SEO/GEO)

Bu dosya **Cursor Automations** paneline yapıştırılacak prompt + kurulum adımlarını içerir.
Araştırma planı: `docs/medident-seo-geo-ajan-plani.md` · rakip notları: `docs/medident-rakip-anahtar-kelime-arastirmasi.md`.

## Neden haftalık (günlük değil)?

Günlük şablon üretim thin content üretti (`/geo/` tekrarları). Plan: **kalite > miktar**.
Otomatik **yayın yok** — çıktı her zaman **PR / draft**; insan veya Director onayı sonrası merge + deploy.

## Cursor’da kurulum (2 dk)

1. [cursor.com/automations](https://cursor.com/automations) → **New automation**
2. **Repo:** `enesceylan190758-wq/medident-web-site` · branch base: `main`
3. **Schedule:** her Pazartesi 09:00 Europe/Istanbul (veya `0 6 * * 1` UTC)
4. **Model:** güçlü / thinking önerilir (araştırma + yazım)
5. Prompt alanına aşağıdaki **MASTER PROMPT** bloğunu yapıştır
6. Tools: repo write, web search, PR create açık olsun
7. Kaydet → Enable

---

## MASTER PROMPT (yapıştır)

```
Sen MediDent İstanbul (https://medidentistanbul.com) için haftalık SEO/GEO operasyon ajanısın.
Repo: enesceylan190758-wq/medident-web-site. Base: main.

## Bağlam (mutlaka oku)
- docs/medident-seo-geo-ajan-plani.md
- docs/medident-rakip-anahtar-kelime-arastirmasi.md
- directives/weekly_blog_geo.md
- src/data/site.mjs (diller: tr, en, de, ar, ru)
- Mevcut /geo/ ve /blog/ sayfalarını tekrarla

## Bu haftanın görevi (sırayla)
1) ARAŞTIRMA (web araması zorunlu; tahmin yasak)
   - Bu hafta tek pazar seç (rotasyon): DE → UK → TR → AR/MENA → RU
   - 5 gerçek arama öbeği + PAA/forum soruları + ilk 5 rakip (neden sıralıyorlar)
   - MediDent’te hangi sayfa var / yok (gap listesi)

2) BRIEF (1 sayfa)
   - Hedef URL slug + dil(ler)
   - Birincil soru + ilk 2 cümlede cevap taslağı
   - FAQ 4–6 madde
   - Yasak ifadeler kontrolü (garanti/kesin sonuç; TR’de hasta yorumu/öncesi-sonrası reklam)

3) İÇERİK (orijinal; kopya/parafras yasak)
   - Tercihen 1 güçlü GEO veya 1 blog rehberi (max 2 sayfa/hafta)
   - GEO: answer-first, ≥180 kelime, soruya özgü (şablon cümle YASAK:
     “diş hekimliğinde tanıya bağlı planlanan bir tedavi/uygulamadır…”)
   - Blog: H2’li rehber + görünür SSS
   - FAQPage JSON-LD uyumlu alanlar
   - İç link: ilgili /hizmetler/, /geo/, /iletisim/

4) DIRECTOR QC (kendine uygula; docs §7)
   Reddet ve düzelt eğer:
   - Mevcut /geo/ ile %30+ kalıp benzerliği
   - Cevap ilk 2 cümlede yok
   - Garanti/kesin sonuç veya dil/pazar belirsiz hasta yorumu reklamı
   - Kaynaksız tıbbi abartı
   - Rakip yapı birebir kopya

5) TESLİMAT
   - Branch: cursor/weekly-seo-YYYY-MM-DD-5c2b
   - İçeriği packs/generated-blog veya uygun src/content altına yaz
   - SITE_DOMAIN=https://medidentistanbul.com SITE_BASE= node build.mjs çalıştır (smoke)
   - Draft PR aç; gövdeye: pazar, slug’lar, QC checklist, deploy ETME
   - Canlıya alma / gh-pages push YASAK — merge insan onayıyla

## Diller
- UI: TR / EN / DE / AR / RU mevcut
- Bu hafta içerik dili = seçilen pazar (AR/RU için EN fallback kabul; mümkünse native)
- Hreflang gruplarını bozma

## Bitirince
Kısa özet: pazar, üretilen URL’ler, gap’ler, sonraki hafta önerisi.
```

---

## Rotasyon takvimi (öneri)

| Hafta | Pazar | Odak örnek |
|------|--------|------------|
| 1 | UK | Turkey teeth / safety / aftercare |
| 2 | DE | Implantate Türkei Kosten / Sicherheit |
| 3 | TR | Üsküdar/Acıbadem yerel + hizmet |
| 4 | AR/MENA | implant / veneers Dubai–Riyadh aramaları |
| 5 | RU | импланты Турция / Стамбул |
| 6 | Ölçüm | GSC + ChatGPT/Perplexity alıntı testi (Faz 5) |

## Tamamlanan plan fazları (otomatik tekrarlama)

Faz 0 thin GEO rewrite, Faz 2 trust, Turkey teeth, semt/malzeme/otorite sayfaları yapıldı.
Otomasyon **Faz 3+**’e odaklansın: tedavi bazlı yorum paketleri (yasal dikkat), PR/dizin, aylık ölçüm, yeni gap’ler.
