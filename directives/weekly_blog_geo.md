# MediDent İstanbul — Haftalık Blog + GEO otomasyonu

Araştırma devamı: miktar değil kalite. Günlük spam → **haftalık draft PR**.

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
```

**Not:** `generate.mjs` iskelet üretir. Cursor Automation (tercih edilen yol) orijinal metin yazar.
İskelet çıktısı da **doğrudan canlıya gitmez** — haftalık workflow draft PR açar.

## Kalite kapısı (Director)

Yayından önce (`docs/medident-seo-geo-ajan-plani.md` §7):

1. Mevcut `/geo/` ile şablon tekrarı yok  
2. Cevap ilk 2 cümlede  
3. Garanti / kesin sonuç yok; TR yasal sınırlara dikkat  
4. FAQ + FAQPage şeması  
5. İç linkler sağlıklı  

## GitHub Actions

| Workflow | Cron | Ne yapar |
|----------|------|----------|
| `weekly-content.yml` | Pazartesi 06:00 UTC | içerik üret → **draft PR** (deploy yok) |
| `daily-content.yml` | Ayın 1’i 06:00 UTC | yedek / elle tetik |

Elle: Actions → Weekly content → Run workflow.

Cursor Automations kurulum: `directives/cursor-seo-geo-automation.md`.

## Başarı kriteri

- Draft PR açıldı; merge sonrası deploy ayrı adım
- Public 200 + sitemap’te URL
- Answer-first / unique GEO
- `llms.txt` güncel (build sonrası)
