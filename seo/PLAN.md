# MediDent SEO — yaşayan plan

Son güncelleme: 2026-09-10 (oturum: Auto)

Hedef: DACH ticari sorgular + turkey teeth kümesi. SEO 3 ayda lead değil, 12 ayda anlamlı.

## Aktif sıra

| # | Madde | Durum | Not |
|---|--------|--------|-----|
| 1 | Duplicate doğrulama (canonical, 6 dil, sitemap, robots, iç link) | **bitti** | Hüküm: KRİTİK — her URL kendini canonical gösteriyor |
| 2 | Duplicate'i build.mjs kaynağında çöz | **bitti** | PR #32 — article.html sadece blogda |
| 3 | hreflang boşlukları + ölü mapping | **bitti** | DE orphan 11→0; PR #32 |
| 4 | hollywoodlywood slug hatası + 301 | **ONAY BEKLİYOR** | Canlı URL/301 kırmızı bölge |
| 5 | oral-implantoloji → implantoloji birleştirme | **ONAY BEKLİYOR** | Sayfa kaldırma/301 kırmızı |
| 6 | Alt sorgu title/meta (all-on-4, sofortimplantate, bonding…) | **bitti** | DE blog + preise + bonding landing |
| 7 | Ana sayfa title/meta'ya Zahnarzt Istanbul | **ONAY BEKLİYOR** | Ana sayfa title kırmızı |
| 8 | Porzellan-Veneers sayfası (yeni) | bekliyor | Dile özel slug, sharedPrefixes dışı |
| 9 | GEO şablonuna Article + E-E-A-T | bekliyor | |
| 10 | turkey teeth genişlet (669→2500) | bekliyor | |
| 11 | Türev: turkey-teeth-meaning / -risks / -vs-veneers | bekliyor | Kannibalizasyon dikkat |
| 12 | İngilizce yamyamlık denetimi | bekliyor | |

## Madde 1 — bulgular (2026-09-10)

- Kaynak: `build.mjs` aynı `article` nesnesini `servicePage` + `articlePage`'e veriyor.
- Canonical: `layout.mjs` → `absUrl(lang, path)` — her sayfa kendini gösterir. Cross-canonical yok.
- Meta robots: tümünde `index,follow`. robots.txt: `Allow: /`.
- Sitemap: 36/36 çiftin her iki URL'si de listeleniyor.
- Gerçek duplike çift (aynı article.html iki URL'de): **TR 10 · EN 13 · DE 13 · FR/AR/RU 0** = **36 çift / 72 URL**.
- Canlı teyit: `/de/blog/implantatbehandlung/` ve `/de/hizmetler/implantoloji-implant-tedavisi/` ikisi de self-canonical.
- İç link: 36/36'da **hizmet** tarafı baskın (nav/footer/home). Blog 2–5 sayfadan link alıyor.

## ONAY BEKLİYOR (kırmızı)

### 4 — hollywoodlywood slug + 301
- Canlı hatalı URL'ler: `/de/geo/hollywoodlywood-smile-paket-istanbul/`, `/en/geo/hollywoodlywood-smile-package-istanbul/`, EN blog `hollywoodlywood-smile-turkey-package`.
- DE blog dosyası doğru: `hollywood-smile-tuerkei-paket` (hreflang tablosu yanlış yazıyor).
- **Öneri:** Slug'ları `hollywood-…` yap + eski URL'lere 301. Enes onaylamadan uygulama yok.

### 5 — oral-implantoloji birleştirme
- `/hizmetler/oral-implantoloji/` ile `/hizmetler/implantoloji-implant-tedavisi/` yüksek örtüşme.
- **Öneri:** oral-implantoloji → implantoloji-implant-tedavisi 301; content.mjs'den kaldırma Enes onayıyla. Bu oturumda dokunulmadı.

### 7 — Ana sayfa "Zahnarzt Istanbul"
- **Öneri:** Sadece DE `/de/` title/meta'ya ekle; H1/marka mesajına dokunma. Onay sonrası.

## Erteleme (bilinçli)

- DE/EN hizmet slug migration (sharedPrefixes/hreflang kırılma riski) → ~3. ay.
- Google Ads → SEO geliri kısa vadede getirmez; hasta için reklam ayrı konuşulmalı.

## Oturumda eklenenler

### 2b — Hizmet sayfaları ince içerik (yeni, düşük öncelik)
Duplicate kesilince hizmet sayfaları ortak `serviceFallback` şablonuna düştü (sadece başlık değişiyor). Birebir uzun duplike'den iyi; yine de dil/hizmete özel 150–250 kelimelik kısa gövde ileride yazılmalı. **Bekliyor** — içerik işi, teknik değil.

### 3 — hreflang (bulgular)
- DE 75 sayfadan 11'i hreflang ağının dışındaydı (sadece self).
- Ölü mapping: `blogTopicGroups` hollywood `de: hollywoodlywood-…` ama dosya `hollywood-…`.
- Ek sessiz bug: `smile-design` grubunun TR slug'ı hollywood grubuyla çakışıyordu → TR hollywood sayfası yanlış EN/DE'ye bağlanıyordu.
