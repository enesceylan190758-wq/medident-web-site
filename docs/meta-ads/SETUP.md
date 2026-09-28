# MediDent — Meta (Facebook) Ads API bağlantısı

Hat A = gurbetçi TR, **Meta**. Site pikseli geneldir, API girişi değildir:

| Alan | Değer |
|------|--------|
| Pixel | `3052551521644159` (`src/data/site.mjs`) |
| Sayfa | https://www.facebook.com/medidentistanbul |

## Cursor environment secret

Bu Cloud Agent oturumunda token **yok**. Secret mevcut agent’a sonradan enjekte edilmez.

1. Meta Business Suite → İş ayarları → Kullanıcılar → Sistem kullanıcıları  
   Yeni sistem kullanıcısı (Adları: `medident-ads-reader`) → reklam hesabına **Reklamları görüntüle** (`ads_read`).
2. Token üret (`ads_read`).
3. Cursor Dashboard → Cloud Agents → Environment → Secrets:

| İsim | Zorunlu | Not |
|------|---------|-----|
| `META_ACCESS_TOKEN` | evet | Sistem kullanıcısı token |
| `META_AD_ACCOUNT_ID` | hesap birden fazlaysa evet | `act_123…` veya sadece rakam |

4. **Yeni bir Cloud Agent başlat** (bu oturum secret’ı görmez).
5. `npm run meta:ads:report`

Token’ı repo’ya, `.env` commit’ine, PR’a veya loga yazma. `.env` yerel deneme için `.gitignore`’da.

## Komut

```bash
npm run meta:ads:report
```

Kampanya bazında son 7 ve 30 gün: harcama, gösterim, tıklama, lead, lead başı maliyet.

Yeni kampanya oluşturma / ENABLE yok — salt okuma.
