# MediDent İstanbul — Web Sitesi

Çok dilli (TR / EN / DE), çok sayfalı, SEO/GEO uyumlu **statik** web sitesi.
Mevcut tasarım korunarak; Google, Bing ve AI botlarının (ChatGPT, Perplexity vb.)
ham HTML'den okuyabileceği, çok sayfalı bir yapıya dönüştürülmüştür.

## Yapı

```
build.mjs              → statik site üreticisi (dist/ üretir)
src/
  data/                → içerik & yapılandırma
    site.mjs           → iletişim, takip kodları, Estesof, GA4 (BURAYI GÜNCELLEYİN)
    i18n.mjs           → TR/EN/DE arayüz metinleri
    content.mjs        → hizmetler, doktorlar, paketler
    content/articles.json → makalelerden üretilen içerik (docx → HTML)
  templates/           → layout, home, sayfa şablonları
  assets/              → css, js, images
scripts/
  convert-docx.mjs     → MAKALELER (docx) → articles.json
  fetch-images.mjs     → görselleri canlı siteden indirir
  serve.mjs            → yerel önizleme sunucusu
dist/                  → YAYINA YÜKLENECEK statik çıktı
```

## Komutlar

```bash
npm install
npm run articles   # docx makaleleri JSON'a çevir (bir kez / güncellemede)
npm run build      # dist/ üret
npm run serve      # http://localhost:8080 önizleme
npm run dev        # build + serve
```

## Yayına Alma

`dist/` klasörünün **içeriği** Turhost `public_html`'e yüklenir.
Adım adım rehber: [DEPLOY.md](DEPLOY.md)

Hızlı yol: `npm run package` → `medident-dist.zip` → cPanel File Manager’da `public_html` köküne yükle → Extract.

```bash
npm run package          # zip oluştur
npm run deploy:domain    # gh-pages (DNS GitHub’a dönünce)
npm run content:daily    # 2 blog + 2 GEO
```

Günlük otomasyon: `.github/workflows/daily-content.yml` (schedule + workflow_dispatch).

## Estesof form

`src/data/site.mjs` → `estesof.endpoint` doldurulunca iletişim formu JSON POST eder.
Boşken WhatsApp fallback çalışır (`src/assets/js/site.js`).

## SEO / GEO

- `sitemap.xml`, `robots.txt`, `llms.txt`, `.htaccess` (HTTPS + eski WP 301)
- JSON-LD: Dentist, FAQPage, Article, BreadcrumbList
- GTM / Meta Pixel / GSC verify taşındı; GA4 kimliği `site.tracking.ga4` alanına eklenir
- Blog: `/blog/…` · GEO: `/geo/…` · diller: TR kök, EN `/en`, DE `/de` + hreflang

## Yapılacaklar (bilgi gelince güncelleyin)

- `src/data/site.mjs` → `estesof.endpoint`: Estesof form API adresi
- `src/data/site.mjs` → `tracking.ga4`: yeni GA4 kimliği (G-XXXX)
- Gerçek hasta/klinik fotoğrafları: `src/assets/images/` içindekileri değiştirin

Güncelleme sonrası `npm run build` çalıştırıp `dist/`'i tekrar yükleyin.
