# MediDent İstanbul — Haftalık Blog + GEO otomasyonu

Araştırma devamı: miktar değil kalite. Günlük spam → **haftalık üretim + otomatik yayın**.

## Blog ≠ GEO

| | Blog | GEO |
|---|------|-----|
| URL | `/blog/:slug/` | `/geo/:slug/` |
| Biçim | Uzun rehber (H2 + SSS) | Kısa answer-first + maddeler + SSS |
| Amaç | İnsan + Google | AI alıntı (ChatGPT, Perplexity, Gemini) |
| Dil | Hedef pazar (TR/EN/DE/AR/RU) | Aynı; nötr tanım, sert satış CTA yok |

## Hacim (haftalık)

| | Haftalık varsayılan | Üst sınır |
|---|------|------|
| Blog | **2–3** | 3 |
| GEO | **1** | 2 |

```bash
npm run content:weekly          # 3 blog + 1 GEO (iskelet üretici)
node scripts/content/generate.mjs --blog 2 --geo 1
npm run deploy:domain           # canlı (gh-pages)
```

**Not:** `generate.mjs` iskelet üretir. Cursor Automation (tercih) orijinal metin yazar.
Her iki yol da QC sonrası **otomatik canlıya alır** (`gh-pages` → medidentistanbul.com).

## Kalite kapısı (Director)

Yayından önce self-QC (`docs/medident-seo-geo-ajan-plani.md` §7):

1. Mevcut `/geo/` ile şablon tekrarı yok  
2. Cevap ilk 2 cümlede  
3. Garanti / kesin sonuç yok; TR yasal sınırlara dikkat  
4. FAQ + FAQPage şeması  
5. İç linkler sağlıklı  

QC fail → yayınlama; düzelt veya haftayı atla.

## GitHub Actions

| Workflow | Cron | Ne yapar |
|----------|------|----------|
| `weekly-content.yml` | Pazartesi 06:00 UTC | üret → main commit → **gh-pages deploy** |
| `daily-content.yml` | Ayın 1’i 06:00 UTC | yedek aynı akış |

Elle: Actions → Weekly content → Run workflow.

Cursor Automations: `directives/cursor-seo-geo-automation.md`.

## Başarı kriteri

- main’de içerik commit’i
- Canlı 200 + sitemap’te URL
- Answer-first / unique GEO
- `llms.txt` güncel
