# MediDent — Kampanya envanteri

Canlı ID’ler API’den doğrulanır; bu dosya agent için özet. Güncelleme: smoke sonrası.

## Hatlar

| Hat | Kitle | Kanal | LP / CTA |
|-----|-------|-------|----------|
| A | Gurbetçi TR | Meta (koru) | TR funnel · WA TR |
| B | Native DE | Google Search | `/de/preise/` · Foto-Einschätzung |
| C | Native FR | Google Search | `/fr/prix-implants-dentaires-turquie/` |

Detay strateji: `docs/medident-ads-abc-plan.md`

## Script ile kurulan smoke

- Script: `scripts/google/create-hat-bc.mjs`
- DE bütçe: ~780 TRY/gün · FR: ~170 TRY/gün
- DE gruplar: B1 Colloquial · B2 High Ticket · B3 Trust
- FR gruplar: C1 Colloquial · C2 Implant
- Negatifler: script + `universal-negative-keywords.md`

### SKAG matris smoke (PDF · en güncel)

Kaynak: [MediDent-SKAG-Matrisi.pdf](./MediDent-SKAG-Matrisi.pdf) / [skag-matrix.md](./skag-matrix.md).  
Hesap mimarisi revizyonu: [system-brief-revision.md](./system-brief-revision.md) (`DE_DE` vs `DE_TR`).

| Alan | Değer |
|------|--------|
| Kampanya | `SKAG — DE Gurbetçi Diş Implant` · id `24280485068` → hedef isim **`DE_TR_Search`** |
| Bütçe | 670 TRY/gün · Max Conversions (PDF s.3) |
| Geo / dil | Almanya presence · **Türkçe** (Planner: Almanca implant kapalı) |
| SKAG 1 | `diş implant fiyat` exact · AG `200889616536` · 3 RSA |
| SKAG 2 | `türkiye diş implantı` exact · AG `206156837971` · 3 RSA |
| Sonraki | Brief journey seed’leri (Planner süzülmüş) + Almanya-TR LP |
| LP | `/hizmetler/implantoloji-implant-tedavisi/` (hedef: Almanya’dan journey sayfası) |
| Script | `npm run google:ads:skag-de-implant` |

Durum ENABLE/PAUSED için `npm run google:status` çek — bu tablo ID’yi sabitler, durumu canlı doğrula.

Kampanya ID’leri değişebilir — `npm run google:status` veya Ads API search ile çek.

## Matris hücreleri henüz Ads’te değil

- Bonding DE → LP hazır, kampanya yok  
- Veneers DE → LP hazır, kampanya yok  
- TR “diş implant fiyat” SKAG’leri → doğru TR LP yok

## Dönüşüm

- Primary: `whatsapp_click`, `phone_click`
- AW etiket / customer ID uyumsuzluğu varsa Smart Bidding yanılır — SETUP.md notuna bak

## Audit soruları

1. Search Terms’de bonding var da hâlâ preise’ye mi gidiyor?  
2. Yasaklı iddia RSA’da var mı?  
3. Shared negatif listesi bağlı mı?  
4. LP H1 reklam H1 ile aynı dil mi?
