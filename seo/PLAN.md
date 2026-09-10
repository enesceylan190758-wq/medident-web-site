# MediDent SEO — yaşayan plan

Son güncelleme: 2026-09-10 (oturum: Auto)  
PR: (açılacak — `seo/turkey-teeth-expand`)

Hedef: DACH ticari sorgular + turkey teeth kümesi. SEO 3 ayda lead değil, 12 ayda anlamlı.

## Aktif sıra

| # | Madde | Durum | Not |
|---|--------|--------|-----|
| 1 | Duplicate doğrulama (canonical, 6 dil, sitemap, robots, iç link) | **bitti** | Hüküm: KRİTİK idi — self-canonical + çift URL |
| 2 | Duplicate'i build.mjs kaynağında çöz | **bitti (yön tersine)** | Gövde HİZMETTE; mirror blog → 301 |
| 3 | hreflang boşlukları + ölü mapping | **bitti** | DE orphan 11→0 |
| 4 | hollywoodlywood slug hatası + 301 | **ONAY BEKLİYOR** | Canlı URL/301 kırmızı |
| 5 | oral-implantoloji → implantoloji birleştirme | **ONAY BEKLİYOR** | Sayfa kaldırma/301 kırmızı |
| 6 | Alt sorgu title/meta (all-on-4, sofortimplantate, bonding…) | **bitti** | DE blog + preise + bonding |
| 7 | Ana sayfa title/meta'ya Zahnarzt Istanbul | **ONAY BEKLİYOR** | Ana sayfa title kırmızı |
| 8 | Porzellan-Veneers sayfası (yeni) | **bitti** | `/de/porzellan-veneers-istanbul/` |
| 9 | GEO şablonuna Article + E-E-A-T | **bitti** | Article schema + byline; reviewer yoksa eklenmiyor |
| 10 | turkey teeth genişlet (~500→~2400) | **bitti (PR)** | GEO `sections` + metaDescription; reviewer hâlâ boş |
| 11 | Türev: turkey-teeth-meaning / -risks / -vs-veneers | bekliyor | Kannibalizasyon dikkat — önce #10 indexle |
| 12 | İngilizce yamyamlık denetimi | **bitti** (araştırma) | Blog çiftleri temiz; oral↔implant hizmet hâlâ yakın |

## Madde 1 — bulgular (özet)

- 36 çift / 72 URL (TR10 EN13 DE13). Her sayfa self-canonical, sitemap’te ikisi de, robots Allow.
- İç link hizmet tarafında.

## ONAY BEKLİYOR (kırmızı)

### 4 — hollywoodlywood slug + 301
- Canlı hatalı: `/de/geo/hollywoodlywood-…`, `/en/geo/hollywoodlywood-…`, EN blog `hollywoodlywood-smile-turkey-package`.
- DE blog dosyası doğru: `hollywood-smile-tuerkei-paket` (hreflang düzeltildi).
- **Öneri:** Typo slug’ları `hollywood-…` yap + eski URL’lere 301. Onaysız uygulama yok.

### 5 — oral-implantoloji birleştirme
- Hizmet sayfaları artık ikisi de kısa fallback — benzerlik sürüyor (~0.68 EN).
- **Öneri:** `oral-implantoloji` → `implantoloji-implant-tedavisi` 301; content.mjs’den kaldırma senin onayınla.

### 7 — Ana sayfa "Zahnarzt Istanbul"
- **Öneri:** Sadece DE `/de/` title/meta; H1/markaya dokunma.

## Oturumda eklenenler

### 2b — Hizmet sayfaları ince / benzer gövde
7 ticari hizmet DE/EN/TR’de uzun gövdeye döndü (mirror blog 301).  
Kalan ince sayfalar: AR/RU tamamı + birkaç TR/DE fallback (çene eklemi, ağız kokusu, oral-implantoloji).  
Hâlâ %100 mirror olabilecek generated primary’ler (pedodonti vb.) — sonraki turda aynı 301 kalıbı.

### 12 — EN yamyamlık (bulgular)
- EN blog çiftleri jaccard ≥0.55: **0** (temiz).
- turkey teeth = GEO pack (`/en/geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/`), blog değil.
- oral-implantoloji vs implantoloji hizmet: hâlâ yakın (fallback) → madde 5 ile çözülür.

## Erteleme

- DE/EN hizmet slug migration → ~3. ay (sharedPrefixes).
- Ads ayrı konuşulmalı; SEO kısa vadeli hasta kolu değil.
