# MediDent İstanbul — SEO/GEO Ajan Operasyon Mimarisi

5 aşamalı hat; otomatik yayın **yok** — Director QC geçmeden deploy edilmez.

```
Araştırma → Director (brief) → İçerik ajanları → Uyum/QC → Yayınla & izle
     ↑___________________________________________________|
                    (aylık döngü — GSC/GA4/AI test)
```

## Aşama 1 — Araştırma katmanı (3 pazar ajanı)

**Görev:** Gerçek SERP verisi; tahmin/halısinasyon yasak.

| Ajan | Pazar | Veri kaynağı | Çıktı dosyası |
|------|-------|--------------|---------------|
| `research-de` | Almanya | "[tedavi] Türkei Kosten" SERP | `src/content/research/market-keywords.json` → `markets.de` |
| `research-uk` | İngiltere | bonding/zirconia Turkey, Turkey teeth | `markets.uk` |
| `research-tr` | İstanbul yerel | Üsküdar + ilçe + hizmet | `markets.tr_local` |

**Prompt şablonu (DE örnek):**
```
Görev: Almanya pazarı "[tedavi] Türkei" gerçek arama davranışı.
Zorunlu: Yalnızca web arama/SERP — tahmin üretme.
Çıktı: 10 kelime öbeği, ilk 5 rakip + neden sıralıyor, 5 PAA sorusu, MediDent boşlukları.
```

Mevcut ön araştırma: `src/content/research/market-keywords.json` (29 Temmuz 2026).

### API gereksinimleri (sizden gerekebilir)

| Araç | Ne için | Durum |
|------|---------|-------|
| Google Search Console | Gerçek sorgu/tıklama | `site.tracking.gscVerify` mevcut — GA4 ID eksik |
| Ahrefs / Semrush / DataForSEO | Hacim + SERP | **Token gerekir** — şu an web araması ile ön veri |
| SerpAPI | Otomatik PAA çekme | Opsiyonel |

## Aşama 2 — Director (yönetici ajan)

**Görev:** Brief onayı, sıralama, yayın öncesi red/onay.

Kriterler (`scripts/content/director-qc.mjs`):
1. %30+ şablon/cümle benzerliği → RED
2. İlk 2 cümlede cevap yok → RED
3. Yasak şablon ifadeler → RED
4. TR'de garanti/"en iyi" iddiası → RED
5. Kelime < 120 (GEO) / < 300 (blog) → RED

```bash
npm run content:qc          # tüm geo + blog kontrol
```

## Aşama 3 — İçerik ajanları

| Kanal | URL | Üretici | Kural |
|-------|-----|---------|-------|
| GEO TR | `/geo/:slug/` | `geo-answers.mjs` + `rewrite-geo-tr.mjs` | Konuya özel, kopya yok |
| Blog TR | `/blog/:slug/` | `generate.mjs` | Şablon blog uyarı verir |
| EN/DE turizm | `/en/geo/`, `/de/geo/` | `write-ende-pack.mjs` | Fiyat tablosu + güven |

**ÖNEMLİ:** Rakip içeriği kopyalanmaz — yapı (fiyat tablosu, checklist, DSD) analiz edilir, orijinal metin yazılır.

## Aşama 4 — Uyum & kalite

- Tıbbi: `author` alanı hekim adı (`geo-answers.mjs`)
- Yasal: Kasım 2025 yönetmelik — TR kök vs `/en/` `/de/` ayrımı (avukata sorun)
- Teknik: FAQPage JSON-LD (build'de otomatik)

## Aşama 5 — Yayınla & izle

```bash
npm run content:pipeline    # rewrite → QC → build
npm run deploy:domain       # gh-pages / Turhost
```

**Aylık AI testi (manuel):**
- EN: "best dental clinic Istanbul bonding"
- DE: "Zirkonkronen Türkei sicher"
- TR: "Üsküdar implant kliniği"

## Uygulama fazları

| Faz | İş | Komut | Durum |
|-----|-----|-------|-------|
| 0 | TR GEO şablon düzeltme | `npm run content:rewrite-geo` | Bu PR |
| 1 | Pazar keyword haritası | `market-keywords.json` güncelle | Ön veri hazır |
| 2 | Güven serisi TR/EN/DE | `turkiyede-dis-tedavisi-guvenli-mi` | Bu PR (TR) |
| 3 | Tedavi bazlı yorumlar | Manuel / onaylı | Bekliyor |
| 4 | PR + dizin (Maltepe modeli) | Dış operasyon | Bekliyor |
| 5 | Aylık döngü | GitHub Actions + QC | Bu PR |

## GitHub Actions

`.github/workflows/daily-content.yml` — generate sonrası **Director QC** zorunlu.

## Rakip analizi özeti (kopyalama değil — kalıp)

**UK lider (Maltepe):** Londra ofisi, ISO, Turkey teeth dürüst rehber, PR.  
**DE liderler:** Qunomedical, Dent360 — fiyat tablosu DE vs TR.  
**AI görünürlük:** İlk cümle cevap, FAQ schema, 500+ yorum, isimli hekim, NAP tutarlılığı.

MediDent avantajları: 1.200+ Google yorumu, Üsküdar Acıbadem adresi, isimli hekimler, EN/DE destek.
