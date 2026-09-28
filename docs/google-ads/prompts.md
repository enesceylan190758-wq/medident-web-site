# MediDent — Google Ads agent promptları

Sırayla çalıştır. Her adımda ilgili `@dosya`yı oku.

- Öncelik / bütçe hücreleri: `@docs/google-ads/skag-matrix.md` + `@docs/google-ads/MediDent-SKAG-Matrisi.pdf`
- Mimari / diaspora / tier: `@docs/google-ads/system-brief-revision.md` + `@docs/google-ads/MediDent-AI-SEO-Google-Ads-System-Brief.pdf`

PDF playbook: `/kampanya-kur` · `/skag-kur` · `/reklam-uret` · `/landing-page-kur` · `/hesap-denetle` · `/negatif-temizle`.  
**DE_DE ile DE_TR karıştırma.** UK Ads açma (PAS). Tier E sorgu Ads’e koyma.

---

## 0. Bağlantı

> Read `@docs/google-ads/SETUP.md` and walk me through connecting Google Ads. Customer ID is `5670078321`. Run `npm run google:status` and summarize what is live.

---

## 1. `/kampanya-kur` (PAUSED)

> Read `@docs/google-ads/build-your-first-skag.md` and `@docs/google-ads/skag-matrix.md`. Build **one** Search campaign for the priority cell I name (default: DE gurbetçi · diş implant · Türkçe dil · 670 TRY/gün). Status **PAUSED** until I approve. Geo presence + dil filtresi + Maks. Dönüşüm. Prefer themed ad groups first; SKAG only if I ask for exact single-keyword groups. Use `scripts/google/` — no second OAuth stack.

---

## 2. `/skag-kur`

> From the tedavi × pazar matrix, create **exact-match** ad groups (one keyword each) with naming that matches the LP slug. Attach shared negatives. Do not create cells marked PAS or Planner **0 SONUÇ**. Smoke max: **2 SKAG + 6 RSA** unless I expand scope.

---

## 3. `/reklam-uret` + assets

> Read `@docs/google-ads/anatomy-of-a-good-ad.md` and `@docs/google-ads/ad-assets-best-practices.md`. Create **3 RSAs** per SKAG/ad group. **PAUSED**. Pin headline 1 to the keyword. ~15 headlines + 4 descriptions when filling the asset pool. Obey `@scripts/seo/lib/banned-terms.json` — ignore PDF sample lines with garanti / uygun fiyat / 4.9 puan. Add sitelinks + callouts.

---

## 4. `/negatif-temizle`

> Read `@docs/google-ads/universal-negative-keywords.json` (source of truth) and `@docs/google-ads/universal-negative-keywords.md`. Add `lists.universal` as a **shared negative keyword list** on account `5670078321`, then attach it to the campaign. Honour each term's `match` field. Never add `do_not_add`. For Search Terms waste: intent check before adding; propose for approval first.

---

## 5. `/landing-page-kur` (mesaj eşleşmesi)

> Read `@docs/google-ads/landing-page-checklist.md` and `@docs/google-ads/lp-design-reference.md`. For keyword/theme **X**, final URL → existing MediDent page whose **H1 matches search language**. Hidden `utm_term` / `utm_campaign` / `gclid` on forms (attribution PDF s.6). No Next.js invent — `src/templates/pages.mjs` + i18n. Thin page → list missing “dolu LP” blocks before more spend. Content PR; leave `reviewer` empty.

---

## 6. `/hesap-denetle`

> Read `@docs/google-ads/campaigns.md`. Pull live status (`npm run google:status` or Ads search). Report spend, CTR, conversions (`whatsapp_click` / `phone_click`), CPA, and Search Terms waste — sorted by recoverable spend.

---

## Hızlı hücre örnekleri (matris)

| Hücre | Kelime dili | LP (mevcut / hedef) |
|-------|-------------|---------------------|
| DE · gurbetçi implant SKAG | TR | `/hizmetler/implantoloji-implant-tedavisi/` |
| DE · Preise / Zähne machen | DE | `/de/preise/` |
| DE · Bonding | DE | `/de/composite-bonding-tuerkei/` |
| DE · Veneers | DE | `/de/porzellan-veneers-istanbul/` |
| FR · Prix | FR | `/fr/prix-implants-dentaires-turquie/` |
| TR içi implant | TR | 2. dalga · ÖNCELİK · sayfa doğrula |
