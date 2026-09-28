# Hızlı başlangıç — refresh token + Project settings

Ayrıntılı arka plan için `SETUP.md` ve `mcc-setup.md`. Bu dosya sadece iki şeye
odaklanır: token'ı üretmek ve nereye gireceğini bulmak.

## 1) Refresh token'ı üret (kendi bilgisayarında, 5 adım)

Bu adım bir tarayıcı açar ve senin onayını ister — bu yüzden bulutta değil,
kendi bilgisayarında (veya Remote Control ile "kendi bilgisayarımda çalıştır"
diyerek) yapılmalı.

1. Bu dalı/`main`'i çek, repo kökünde `.env` dosyası oluştur.
2. `.env` içine şu iki satırı yaz (Cloud Console → API'ler ve Hizmetler →
   Kimlik Bilgileri → OAuth istemci kimliği → **Masaüstü uygulaması**'ndan alınır):
   ```env
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_ADS_LOGIN_CUSTOMER_ID=4448637998
   ```
3. `npm install` (ilk seferde, bağımlılıkları indirir).
4. `npm run google:auth` çalıştır — açılan tarayıcıda **enes.ceylan190758@gmail.com**
   ile giriş yap ve izin ver.
5. Onaydan sonra `GOOGLE_REFRESH_TOKEN=...` satırı otomatik olarak `.env`'e
   yazılır — bu değeri kopyala, aşağıdaki tabloya gireceksin.

Doğrulama (opsiyonel): `npm run google:status`.

## 2) Project settings → Environment'a gireceğin değişkenler

| Değişken adı | Değer | Zorunlu |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Adım 1.2'deki İstemci Kimliği | Evet |
| `GOOGLE_CLIENT_SECRET` | Adım 1.2'deki İstemci Gizli Anahtarı | Evet |
| `GOOGLE_REFRESH_TOKEN` | Adım 1.5 sonunda üretilen değer | Evet |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | `4448637998` (MCC — tire olmadan) | Evet |
| `GOOGLE_ADS_CUSTOMER_ID` | `5670078321` (kod zaten bunu varsayılan alıyor) | Hayır |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | — | Hayır (Eylül 2026'dan sonra Ads API için şart değil) |

## 3) Rapor çekme

Bu beş değişken girildikten sonra, yeni bir oturumda:

```bash
npm run google:ads:report
```

Son 7 ve son 30 günün kampanya bazında harcama / gösterim / tıklama / dönüşüm /
lead başı maliyet tablosunu konsola basar ve
`docs/google-ads/reports/son-7-gun.csv` + `son-30-gun.csv` olarak kaydeder
(bu klasör `.gitignore`'da — repoya commit edilmez).
