# MediDent İstanbul — Günlük Blog (SEO) Otomasyonu

Nefalix modelinin diş kliniği uyarlaması.

## Blog ≠ GEO

| | Blog | GEO |
|---|------|-----|
| URL | `/blog/:slug/` | `/geo/:slug/` |
| Biçim | Uzun rehber (H2 + SSS) | Kısa answer-first + maddeler + SSS |
| Amaç | İnsan okur, Google sıralar | AI motoru alıntılar (ChatGPT, Perplexity, Gemini) |
| Dil | TR (+ EN/DE özet veya tam çeviri) | TR (nötr tanım; satış CTA yok) |

## Hacim

| | Bugün (ilk kurulum) | Sonraki günler |
|---|------|------|
| Blog | **10** | **2** |
| GEO | **10** | **2** |

```bash
# Bugünkü paket (veya manuel)
npm run content:today

# Günlük (2 blog + 2 geo)
npm run content:daily

# Özel adet
node scripts/content/generate.mjs --blog 2 --geo 2
```

## Başarı kriteri

- Public crawlable sayfa (200)
- Answer-first intro / direct_answer
- Görünür FAQ + `FAQPage` JSON-LD
- `sitemap.xml` + `blog` + `geo` URL’leri
- `llms.txt` güncel

Cursor / VPS cron ile `npm run content:daily && npm run build` (deploy adımı ayrı).

GitHub Actions: `.github/workflows/daily-content.yml`
- Her gün 06:00 UTC (`content:daily` → build → `gh-pages`)
- Elle tetikleme: Actions → Daily content → Run workflow
- Turhost FTP senkronu için repo Secrets: `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`
  (veya cPanel’e `medident-dist.zip` yükleyin — `npm run package`)

