# MediDent — Ads landing page checklist (“dolu LP”)

Amaç: adam yazdığını **üstte** görsün; menüde avlanmasın; sadece uzun yazı olmasın.

## Mesaj eşleşmesi

| Arama | Final URL | H1’də olmalı |
|-------|-----------|--------------|
| Zähne machen / Preise | `/de/preise/` | Preise / Zähne… dili |
| Bonding | `/de/composite-bonding-tuerkei/` | Bonding / Composite |
| Veneers | `/de/porzellan-veneers-istanbul/` | Porzellan-Veneers |
| FR prix / dents | `/fr/prix-…` | FR sorgu dili |

Yeni URL uydurma (`/de/dis-implanti-fiyat`) — ya mevcut sayfayı güçlendir ya da template + i18n ile gerçek sayfa aç (PR).

## “Dolu” bloklar (ücretli trafik)

1. **H1 = arama dili** + kısa lead  
2. **Birincil CTA** üstte: Foto-Einschätzung / WhatsApp (sticky ideal)  
3. **Tedaviye özel 3–5 adım** (gün / seans)  
4. **Gerçek görsel** (klinik / ekip / ortam — stok mucize yok)  
5. **Fiyat bandı veya hesap** o tedavide net  
6. **Nachsorge / 2. ziyaret** (DE #1 korku)  
7. **FAQ** kısa  
8. **UTM + gclid** form/WA’ya taşınabilsin (gizli alan veya CRM notu)

## Yasak (LP metni)

`scripts/seo/lib/banned-terms.json` — garanti, schmerzfrei, %70, hasta yorumu reklamı (TR), agresif öncesi-sonrası.

## Teknik (bu repo)

- Template: `src/templates/pages.mjs` (`pricesPage`, `bondingPage`, `veneersPage`, …)
- Metin: i18n pack’leri
- Build: `npm run build` — Next.js / Vercel ayrı app yok
- İçerik PR: `reviewer` boş; hekim `npm run seo:approve`

## Agent sırası

1. Kelime/tema seç  
2. LP var mı / H1 uyuyor mu?  
3. İnceyse önce blok listesi + PR (reklam bütçesini büyütme)  
4. Final URL’yi Ads’te güncelle (PAUSED test OK)
