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

## Yapılacaklar (bilgi gelince güncelleyin)

- `src/data/site.mjs` → `estesof.endpoint`: Estesof form API adresi
- `src/data/site.mjs` → `tracking.ga4`: yeni GA4 kimliği (G-XXXX)
- Gerçek hasta/klinik fotoğrafları: `src/assets/images/` içindekileri değiştirin

Güncelleme sonrası `npm run build` çalıştırıp `dist/`'i tekrar yükleyin.
