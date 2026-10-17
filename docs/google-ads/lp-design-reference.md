# MediDent — Ads LP görsel referans

Jono playbook’taki “Dribbble’dan referans al → LP kur” adımı. **Tasarım dili ilham**; metin/vaat kopyalama değil.

## Referans shot

- **Odentrics — Dental Clinic** (Sans Design)  
  https://dribbble.com/shots/25873352-Odentrics-Dental-Clinic  
  Yerel ekran: Cursor assets / kullanıcı Downloads (isteğe bağlı)

## Bundan alınacaklar (Ads LP)

| Öğe | Neden |
|-----|--------|
| Full-bleed hero + net H1 | Arama dili üstte |
| Tek güçlü CTA (Book → Foto / WhatsApp) | Dönüşüm |
| Bol boşluk, sakin tipografi | Güven |
| Gerçek gülüş / klinik fotoğraf düzlemi | “Dolu” sayfa |
| Hizmet kartları (implant, cleaning…) | Tema eşleşmesi |

## Bundan alınmayacaklar (yasak / marka)

| Öğe | Neden |
|-----|--------|
| “Save 80% / 40%” membership kartları | `banned-terms` + HWG; MediDent % vaat etmiyor |
| “Affordable / Join Membership” dil | İndirim/kampanya reklamı |
| Mor/teal generic AI klonu | Mevcut MediDent cream/burgundy dilini koru |
| Tüm siteyi Odentrics’e çevirmek | Ads LP iskeleti; global rebrand değil |

## Bizim stack’te nasıl

Next.js yok. Referans → `src/templates/pages.mjs` + mevcut CSS değişkenleri:

1. H1 = kelime (`data-ads-h1` veya sabit i18n)
2. Hero CTA = Foto-Einschätzung / WhatsApp
3. Form + `tel:` + gclid/UTM gizli alan (`tracking.js`)
4. Görseller: gerçek klinik, stok “mucize gülüş + %80” yok

## Agent prompt (Task 4 eki)

> Also use `@docs/google-ads/lp-design-reference.md` (Odentrics Dribbble) for layout inspiration only. Do not copy discount/membership copy. Keep MediDent brand tokens and banned-terms rules.
