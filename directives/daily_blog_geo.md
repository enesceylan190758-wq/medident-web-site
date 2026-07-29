# MediDent İstanbul — Günlük Blog (SEO) Otomasyonu → **artık haftalık**

Bu dosya eski günlük Nefalix modelini belgeler. **Güncel akış haftalıktır.**

→ `directives/weekly_blog_geo.md`  
→ Cursor Automations: `directives/cursor-seo-geo-automation.md`  
→ Araştırma planı: `docs/medident-seo-geo-ajan-plani.md`

## Neden değişti?

Günlük 2+2 üretim `/geo/` altında tekrarlayan thin content üretti. Plan: kalite > miktar; yayın öncesi Director QC; **otomatik canlıya alma yok**.

## Komutlar (güncel)

```bash
npm run content:weekly          # 3 blog + 1 GEO iskelet
npm run content:daily           # yedek (2+2) — tercih etme
```

GitHub Actions:
- `.github/workflows/weekly-content.yml` — Pazartesi, **draft PR**
- `.github/workflows/daily-content.yml` — ayda bir yedek, **draft PR**
