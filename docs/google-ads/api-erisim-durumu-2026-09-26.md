# Google Ads API erişimi — 2026-09-26 durum notu

## Sonuç: bu (bulut) oturumda canlı API erişimi YOK

İstenen tablo (aktif reklam grubu × kampanya/reklam grubu/anahtar kelime/eşleme/nihai
URL/son 7 gün gösterim/tıklama/ort. TBM/top impression rate/absolute top rate/search
lost IS rank) **üretilemedi** — veri uydurulmadı, aşağıda nedeni ve açığa çıkarma yolu var.

## Neden erişim yok

`scripts/google/` (bkz. `wip/ads-docs-scripts` dalı) altındaki araçlar OAuth "Desktop app"
akışıyla çalışıyor:

1. `.env` içine `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` yazılır (bu repoda yok —
   `.env` `.gitignore`'da, hiç commit edilmemiş; sadece `FTP_*` alanlarını içeren
   `.env.example` var).
2. `npm run google:auth` bir tarayıcı açar, **kliniğin Google hesabıyla** interaktif
   onay ister, `http://127.0.0.1:8787/oauth/callback`'e döner ve `GOOGLE_REFRESH_TOKEN`'ı
   `.env`'e yazar.

Bu akış özünde tek seferlik ve **insan + tarayıcı + Enes'in kendi makinesi** gerektiriyor;
bulut oturumunda (bu container'da) ne `.env` ne de daha önce alınmış bir refresh token
var — container her seferinde repodan temiz klonlanıyor ve `.env` hiç commit edilmiyor.

Kontrol edildi: ortam değişkenlerinde `GOOGLE_*` yok, dosya sisteminde `.env` veya
token cache dosyası yok.

## Önemli — 2 gün önceki son bilinen durum (taze değil, doğrulanmalı)

`docs/google-ads/hesap-durumu-2026-09-24.md` (aynı `wip/ads-docs-scripts` dalında,
önceki oturumun kendi makinesinde gerçek API erişimiyle ürettiği bir rapor) şunu
kaydetmiş:

> Hesap harcama limiti aşılmış (onaylı limit ~31.021 TL, harcanan ~31.350 TL) →
> **hesaptaki her kampanya SUSPENDED** (kampanya kendi durumu ENABLED/PAUSED olsa bile,
> hesap seviyesinde tıkanmış).

Bu **2026-09-24** tarihli, yani 2 gün önce. Eğer hâlâ geçerliyse, istenen "son 7 gün"
metrikleri (gösterim/tıklama/TBM/top impression rate/absolute top rate) zaten sıfıra
yakın çıkar — çünkü kampanyalar hiç yayınlanmıyor olabilir. Bunu API'siz doğrulayamadım;
Enes'in Ads arayüzünden (Araçlar → Faturalandırma → Hesap bütçeleri) bir bakması gerekiyor.

## Açığa çıkarmak için (Enes'in kendi makinesinde)

1. `wip/ads-docs-scripts` dalını çek (veya bu iş bittiğinde main'e alınmışsa oradan).
2. `docs/google-ads/SETUP.md` ve `scripts/google/auth.mjs` başındaki talimatı izle:
   Google Cloud Console'da bir OAuth "Desktop app" istemcisi oluştur, `GOOGLE_CLIENT_ID`/
   `GOOGLE_CLIENT_SECRET`'ı `.env`'e yaz, `npm run google:auth` çalıştır (tarayıcıda
   kliniğin hesabıyla onayla).
3. Sonrasında `scripts/google/status.mjs` (ve varsa reklam grubu/anahtar kelime
   performans sorgusu) çalıştırılabilir; istenen tabloyu o zaman gerçek veriyle
   üretebilirim — ya bu oturuma `.env` içeriğini (sadece `GOOGLE_REFRESH_TOKEN` +
   `GOOGLE_CLIENT_ID`/`SECRET`, başka hiçbir şey) güvenli bir şekilde aktararak, ya da
   Enes kendi makinesinde çalıştırıp çıktıyı paylaşarak.

**Güvenlik notu:** bu değerleri sohbete yapıştırmak yerine, bu bulut ortamının env
değişkeni/secret mekanizmasıyla (varsa) aktarmak daha güvenli olur.
