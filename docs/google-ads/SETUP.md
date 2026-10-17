# MediDent — Google Ads API bağlantısı

Bu repo zaten Ads API’ye bağlı. Plumber/Toronto şablonundaki ayrı `credentials.json` klasörüne gerek yok.

## Hesap

| Alan | Değer |
|------|--------|
| Ads müşteri | `5670078321` (İstanbul Dent) — conversion tracking **AW-346086325** |
| Dönüşümler | `whatsapp_click`, `phone_click`, `generate_lead` (GA4 → Ads, primary) |
| GTM | `GTM-NTDLLHF` — remarketing + Google etiketi AW-346086325 |
| Remarketing | `docs/google-ads/remarketing.md` |

## Ortam

1. `.env.example` → `.env` kopyala.
2. Cloud Console’da OAuth **Masaüstü** istemcisi: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
3. Ads API (Cloud proje) açık olsun. Developer token Eyl 2026 sonrası zorunlu değil.
4. Bağlan:

```bash
npm run google:auth
npm run google:status
```

`GOOGLE_REFRESH_TOKEN` auth sonrası yazılır. MCC üzerinden gidiyorsan `GOOGLE_ADS_LOGIN_CUSTOMER_ID` doldur.

## Komutlar

| Script | Ne yapar |
|--------|----------|
| `npm run google:auth` | OAuth + refresh token |
| `npm run google:status` | Ads / GA4 / GSC / GTM özeti |
| `npm run google:ads:hat-bc` | Hat B DE + Hat C FR smoke (varsayılan PAUSED; `--enable` ile aç) |

## Agent kuralları

- Yeni kampanya/reklam **önce PAUSED**; kullanıcı onayı olmadan ENABLE etme.
- `main`’e yazma; branch + PR.
- `npm run deploy:domain` / `scripts/deploy-pages.mjs` çalıştırma.
- Reklam ve LP metninde `scripts/seo/lib/banned-terms.json` yasakları geçerli (garanti, schmerzfrei, %70, billigste, vb.).
- Hat A (TR Meta gurbetçi) ile Hat B/C (DE/FR native Search) karıştırma.
