# Hızlı başlangıç — erişim kurulumu + Project settings

Ayrıntılı arka plan için `SETUP.md` ve `mcc-setup.md`. İki yol var — **yalnızca
birini** kur:

- **A) Proxy-enjekte kimlik bilgisi (Project settings → API credentials)** —
  bulut oturumları için önerilen, aktif olarak kullanılan yol. Token hiç
  görünmez/saklanmaz; ortamın egress proxy'si Authorization başlığını
  `googleads.googleapis.com` isteklerine kendisi ekler. Aşağıda **0. bölüm**.
- **B) Klasik OAuth (refresh token, `.env`)** — kendi bilgisayarında çalıştırmak
  istediğinde. Aşağıda **1-2. bölüm**.

## 0) Yol A — proxy-enjekte kimlik bilgisi (kurulu, çalışıyor)

Project settings → API credentials'a şu şekilde eklendi:

| Alan | Değer |
|---|---|
| Ad | Google Ads API (MediDent) |
| Tip | GCP access token (Service Account Key) |
| Allowed website | `googleads.googleapis.com` |
| Scope | `https://www.googleapis.com/auth/adwords` |
| Servis hesabı | `medident-ads-reader@earnest-vent-484108-f5.iam.gserviceaccount.com` (MCC 444-863-7998'e salt okunur eklendi) |

Bu yolda `scripts/google/report.mjs`, `.env`'de `GOOGLE_REFRESH_TOKEN` yoksa
Authorization başlığı **hiç eklemez** — proxy ekler. Tek gereken:
`login-customer-id: 4448637998` başlığı (kod içinde `scripts/google/config.mjs`
→ `KNOWN.adsMccId` olarak sabit, ayrıca env değişkeni de girilebilir).
Developer token gerekmiyor (Eylül 2026 sonrası Ads API için şart değil, test
edildi — hata vermedi).

Çalıştırma (bu yolda `.env`/OAuth gerekmez, sadece bağımlılıklar kurulu olmalı):

```bash
npm install   # ilk seferde
npm run google:ads:report
```

`google:ads:report` script'i `NODE_USE_ENV_PROXY=1` ile çalışır — Node'un
yerleşik `fetch`'i bu bayrak olmadan `HTTPS_PROXY`'yi okumuyor (Node ≥ 22.21).
Başka bir `google:*` scripti (`google:auth`, `google:status`,
`google:ads:keywords` vb.) bu proxy yolunu **kullanmaz** — onlar hâlâ klasik
OAuth/`GOOGLE_REFRESH_TOKEN` bekler (aşağıdaki 1-2. bölüm).

## 1) Yol B — Refresh token'ı üret (kendi bilgisayarında, 5 adım)

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
