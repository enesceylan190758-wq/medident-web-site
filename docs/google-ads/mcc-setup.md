# Senin MCC — Enes

| Alan | Değer |
|------|--------|
| MCC | **444-863-7998** · görünen ad **Enes Ceylan ads** |
| Durum | Kurulum tamam (Yönetici; “kurulum devam ediyor” kalktı) |
| Mail | enes.ceylan190758@gmail.com |
| Ayarlar | TR · GMT+3 · TRY · başkalarının hesaplarını yönet |
| Klinik | MediDent / İstanbul Dent **567-007-8321** (henüz bağlı değil — Doğan onay + hesap bağla) |

## Bağlama (şimdi)

1. [ads.google.com](https://ads.google.com) → **enes.ceylan190758** ile giriş → MCC `444-863-7998` seç.  
2. **Hesaplar** → **+** → mevcut hesabı bağla → `567-007-8321`.  
3. Enkahealth / İstanbul Dent admin tarafında **link onayla** (gerekirse).  
4. Repo:

```env
GOOGLE_ADS_LOGIN_CUSTOMER_ID=4448637998
GOOGLE_ADS_CUSTOMER_ID=5670078321
```

```bash
npm run google:auth   # Enes Gmail ile consent
npm run google:status
```

## Attribution + CRM + offline

→ `docs/google-ads/attribution-crm-offline-plan.md`
