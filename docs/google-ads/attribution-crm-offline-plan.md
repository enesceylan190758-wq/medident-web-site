# Plan — MCC + CRM reklam kaynağı + Google offline dönüşüm

*Eklenme: 2026-09-23 · Enes notu: plana yaz*  
*Görsel akış (Klaus örneği): [MediDent-SKAG-Matrisi.pdf](./MediDent-SKAG-Matrisi.pdf) s.6 — tıklama → gizli UTM/gclid → CRM → fatura → kelime ROAS.*

## 0) Yönetici hesabı (senin)

| Alan | Değer |
|------|--------|
| MCC | **444-863-7998** |
| Mail | enes.ceylan190758@gmail.com |
| Klinik Ads | 567-007-8321 (İstanbul Dent / MediDent) |

**Sonraki teknik adımlar**

1. MCC `444-863-7998` ile oturum → MediDent `567-007-8321` hesap bağlama / onay.  
2. `.env`: `GOOGLE_ADS_LOGIN_CUSTOMER_ID=4448637998`  
3. `npm run google:auth` → **enes.ceylan190758** ile onay (MCC + alt hesaplar).  
4. Bildirimler bu Gmail’e.

Diğer klinikler (eş/dost) aynı MCC altına bağlanır; fatura her hesabın kendi.

---

## 1) Reklam → form → CRM (hangi müşteri / hangi tıklama)

**Amaç:** Lead CRM’e düşerken şunlar dolu gelsin:

| Alan | Kaynak |
|------|--------|
| `client` / klinik | `medident` (multi-tenant’ta hesap kodu) |
| `gclid` | URL / cookie |
| `utm_source/medium/campaign/content/term` | URL |
| `kw` | Ads final URL `?kw=` |
| `campaign_id` / `adgroup_id` / `creative` | ValueTrack (opsiyonel) |
| `landing_page` | `location.href` |
| `hat` | `Google DE` / `Google FR` / `Google TR SKAG` / `Meta` |

**Akış**

```
Google Ads tıklama (+ gclid)
  → LP (tracking.js: sessionStorage + form hidden)
  → Form POST → Estesof / CRM endpoint
       body: { name, phone, email, treatment, …attribution }
  → CRM kaydı: kaynak = Google + kampanya + gclid
```

**Kod durumu**

- `tracking.js`: gclid/UTM/kw → hidden alanlar (yazıldı, deploy bekliyor).  
- `site.js`: Estesof POST var; attribution alanlarını body’ye açık eklemek + WA fallback’e kaynak satırı.  
- `site.estesof.endpoint`: henüz boş — CRM URL gelince doldurulacak.

**Ads final URL şablonu (örnek)**

```
https://medidentistanbul.com/hizmetler/implantoloji-implant-tedavisi/
  ?utm_source=google&utm_medium=cpc
  &utm_campaign={campaignid}&utm_content={adgroupid}&utm_term={keyword}
  &gclid={gclid}
  &kw=Diş%20Implant%20Fiyat%20Türkiye
```

(`{gclid}` otomatik; kampanya/keyword ValueTrack.)

---

## 2) Satın alan / almayan → Google’a geri (offline conversion)

**Amaç:** Smart Bidding tıklama değil **gerçek hasta** optimize etsin.

| CRM durumu | Google’a ne |
|------------|-------------|
| Satış / tedavi başladı | Offline conversion: `purchase` veya `qualified_lead` + `gclid` + değer (TRY) |
| Teklif verildi, gelmedi | İsteğe bağlı: ayrı conversion veya hiç yükleme (negatif sinyal yok — sadece pozitif yükle) |
| Spam / yanlış numara | Yükleme |

**Akış**

```
CRM: lead.gclid + status=sold + revenue
  → scripts/google/upload-offline-conversions.mjs (plan)
  → Ads Offline Conversion Import (gclid)
  → Max Conversions / tROAS öğrenir
```

**Önkoşul**

- Form/WA’da `gclid` kaydı (adım 1).  
- Ads’te offline conversion action (Enhanced conversions for leads veya klasik GCLID upload).  
- CRM’den günlük/haftalık export veya webhook.

**“Almayan”:** Google’a “negatif conversion” yok; pratik = sadece satılanları yükle + remarketing listesine “lead ama satılmadı” (CRM segment → Customer Match / liste). Remarketing listeleri zaten açıldı (`docs/google-ads/remarketing.md`).

---

## 3) Uygulama sırası (backlog)

| # | İş | Durum |
|---|-----|--------|
| A | MCC 444-863-7998 bağla + auth Enes Gmail | Bekliyor (sen onay) |
| B | Form attribution → CRM body + WA metni | Kısmen (hidden var) |
| C | `estesof.endpoint` / CRM URL | Bekliyor (URL lazım) |
| D | Ads final URL ValueTrack | Bekliyor |
| E | Offline conversion action + upload script | Plan |
| F | CRM sold → Google upload otomasyonu | Plan |

---

## 4) Multi-klinik (eş/dost)

Aynı MCC altında her klinik:

- Ayrı Ads customer ID  
- Ayrı `client` kodu CRM’de  
- Ortak form şablonu + `client=klinik_x`  
- Offline upload `LOGIN_CUSTOMER_ID` = MCC, `CUSTOMER_ID` = o klinik  

Tek panel: senin MCC + senin CRM.
