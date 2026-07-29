# MediDent İstanbul — Günlük Blog (SEO) Otomasyonu → **artık haftalık + auto-deploy**

Bu dosya eski günlük Nefalix modelini belgeler. **Güncel akış haftalıktır ve canlıya alır.**

→ `directives/weekly_blog_geo.md`  
→ Cursor Automations: `directives/cursor-seo-geo-automation.md`  
→ Araştırma planı: `docs/medident-seo-geo-ajan-plani.md`

## Neden değişti?

Günlük 2+2 üretim `/geo/` altında tekrarlayan thin content üretti. Plan: kalite > miktar; Director QC; **QC geçince otomatik yayın**.

## Komutlar (güncel)

```bash
npm run content:weekly          # 3 blog + 1 GEO iskelet
npm run deploy:domain           # canlı
npm run content:daily           # yedek (2+2) — tercih etme
```

GitHub Actions:
- `.github/workflows/weekly-content.yml` — Pazartesi, main + gh-pages
- `.github/workflows/daily-content.yml` — ayda bir yedek, main + gh-pages
