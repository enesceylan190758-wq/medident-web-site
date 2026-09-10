# MediDent SEO — yaşayan plan

Son güncelleme: 2026-09-10 (oturum: Auto)  
PR: https://github.com/enesceylan190758-wq/medident-web-site/pull/34 (red queue)

Hedef: DACH ticari sorgular + turkey teeth kümesi. SEO 3 ayda lead değil, 12 ayda anlamlı.

## Aktif sıra

| # | Madde | Durum | Not |
|---|--------|--------|-----|
| 1 | Duplicate doğrulama (canonical, 6 dil, sitemap, robots, iç link) | **bitti** | Hüküm: KRİTİK idi — self-canonical + çift URL |
| 2 | Duplicate'i build.mjs kaynağında çöz | **bitti (yön tersine)** | Gövde HİZMETTE; mirror blog → 301 |
| 3 | hreflang boşlukları + ölü mapping | **bitti** | DE orphan 11→0 |
| 4 | hollywoodlywood slug hatası + 301 | **bitti** | EN/DE GEO + EN/TR blog rename; 301’ler |
| 5 | oral-implantoloji → implantoloji birleştirme | **bitti** | Service kaldırıldı; 6 dil 301 |
| 6 | Alt sorgu title/meta (all-on-4, sofortimplantate, bonding…) | **bitti** | DE blog + preise + bonding |
| 7 | Ana sayfa title/meta'ya Zahnarzt Istanbul | **bitti** | Sadece DE title+meta; H1 aynı |
| 8 | Porzellan-Veneers sayfası (yeni) | **bitti** | `/de/porzellan-veneers-istanbul/` |
| 9 | GEO şablonuna Article + E-E-A-T | **bitti** | Article schema + byline; reviewer yoksa eklenmiyor |
| 10 | turkey teeth genişlet (~500→~2400) | **bitti** | PR #33 merge |
| 11 | Türev: turkey-teeth-meaning / -risks / -vs-veneers | bekliyor | Kannibalizasyon dikkat — önce #10 indexle |
| 12 | İngilizce yamyamlık denetimi | **bitti** (araştırma) | Blog çiftleri temiz; oral↔implant çözüldü (#5) |

## Madde 1 — bulgular (özet)

- 36 çift / 72 URL (TR10 EN13 DE13). Her sayfa self-canonical, sitemap’te ikisi de, robots Allow.
- İç link hizmet tarafında.

## ONAY BEKLİYOR (kırmızı)

_(boş — 4/5/7 Enes onayıyla uygulandı)_

## Oturumda eklenenler

### 2b — Hizmet sayfaları ince / benzer gövde
7 ticari hizmet DE/EN/TR’de uzun gövdeye döndü (mirror blog 301).  
Kalan ince sayfalar: AR/RU tamamı + birkaç TR/DE fallback (çene eklemi, ağız kokusu).  
Hâlâ %100 mirror olabilecek generated primary’ler (pedodonti vb.) — sonraki turda aynı 301 kalıbı.

### 12 — EN yamyamlık (bulgular)
- EN blog çiftleri jaccard ≥0.55: **0** (temiz).
- turkey teeth = GEO pack (`/en/geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/`), blog değil.
- oral-implantoloji vs implantoloji: **çözüldü** (#5 merge + 301).

## Erteleme

- DE/EN hizmet slug migration → ~3. ay (sharedPrefixes).
- Ads ayrı konuşulmalı; SEO kısa vadeli hasta kolu değil.
