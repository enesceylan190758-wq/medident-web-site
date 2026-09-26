# Ads revizyon — System Brief × SKAG Matrisi

**Kaynaklar (ikisi birden):**
- [MediDent-AI-SEO-Google-Ads-System-Brief.pdf](./MediDent-AI-SEO-Google-Ads-System-Brief.pdf) — ChatGPT brief · 23 Eyl 2026 (AI Search + SEO + Ads sistem)
- [MediDent-SKAG-Matrisi.pdf](./MediDent-SKAG-Matrisi.pdf) — tedavi × pazar önceliği + Planner gerçeği

Bu dosya **reklam işini nasıl revize ettiğimizi** sabitler. Brief “nasıl düşün”; SKAG PDF “nereye para”.

---

## 1) Brief’in Ads’e söylediği (özet)

| İlke | Brief | Bizde şimdi | Revizyon |
|------|-------|-------------|----------|
| Ülke + dil birlikte | Kampanya = `UK_EN` / `DE_DE` / `FR_FR` / `NL_NL` + ayrı **DE_TR diaspora** | Hat B DE_DE · Hat C FR · SKAG DE_TR | **Korunur**; isimlendirme brief’e yaklaşır |
| Tedavi grupları | Brand · Implants · All-on · Veneers/Crowns | Hat B tema (Colloquial/High/Trust) · SKAG 2 kelime | **STAG tedavi** birincil; SKAG yalnız kazanan kelime |
| Keyword → ad → LP | Aynı niyet | Kısmen (preise karışması riski) | Sert kural kalır; LP boşluğu kapatılır |
| Tier A/B | Primary Search | Smoke’ta A/B karışık | **Tier A/B paid**; Tier E (recovery, nasıl yapılır) = SEO, Ads’e sokma |
| Brand ayrı | Brand kampanyası | Yok | 2. dalga — bulaşmayı önlemek için |
| Ölçüm | Form + WA + call → GCLID → CRM → offline | Kod yazıldı, deploy/CRM eksik | Öncelik: deploy + CRM + offline |
| Compliance | TR sağlık turizmi reg + Google health | Yasaklı terimler var | Yayın + RSA checklist’e reg satırı |
| UK Ads | Brief seed verir | SKAG: **PAS** (CPC 233–661) | Ads **erteli**; SEO/AI entity **yap** |
| Thin “gurbetçi” blog | Yasak | Yok | Ayrı **Almanya hasta** sayfası (DE + TR dil) |

---

## 2) Hedef hesap mimarisi (revize)

```
Hat A          Meta · TR gurbetçi                    (koru — Ads değil)

DE_DE_Search   Almanya · Almanca                     (= Hat B genişletilmiş)
  · Brand
  · Zahnimplantate          → /de/… implant/preise eşleşmesi
  · All-on / Zahnersatz
  · Veneers / Kronen
  · Bonding (LP hazırsa)

DE_TR_Search   Almanya · Türkçe diaspora             (= mevcut SKAG kampanyası)
  · Journey / implant fiyat  → TR LP (ideal: Almanya’dan TR tedavi sayfası)
  · All-on / zirkonyum       → yalnızca Planner VERİ sonrası

FR_FR_Search   Fransa · Fransızca                    (= Hat C)
  · Brand · Implants · All-on · Facettes

NL_NL_Search   (TEST · küçük bütçe)                  SKAG matrisi TEST
AT / BE        (TEST · DE veya FR diline göre)       SKAG matrisi TEST
UK_EN_Search   (PAS Ads · SEO önce)                  Brief seed = SEO/intent, Ads sonra
TR_TR_Search   Türkiye içi implant                   SKAG ÖNCELİK · 2. dalga
```

**SKAG matrisi bütçe bandı (~50k TL · 6 öncelik)** değişmez. Brief’in UK/US/AU seed’leri = **SEO intent kütüphanesi**, otomatik Ads açma değil.

---

## 3) DE_TR diaspora — kelime revizyonu

Mevcut smoke yalnız:
- `diş implant fiyat`
- `türkiye diş implantı`

Brief seed’leri (Planner’da **Almanya + Türkçe** doğrula; 0 hacim / kaldırıldıysa kurma):

| Küme | Örnek seed |
|------|------------|
| Journey | Almanya'dan Türkiye'de diş yaptırmak · Almanya'dan implant yaptırmak |
| Fiyat | Almanya Türkiye diş implant fiyatları · Almanya implant fiyatı Türkiye |
| Destinasyon | Almanya'dan İstanbul diş kliniği · Almanya diş tedavisi Türkiye |
| Tedavi | Almanya'dan All-on-4 Türkiye · Almanya'dan zirkonyum Türkiye |

**Match:** exact/phrase önce. Broad yok.  
**Negatif:** iş/kariyer/eğitim + Search Terms haftalık.  
**“ucuz / cheap”:** Brief — her zaman negatif değil; bizde RSA’da **uygun fiyatlı/ucuz yazma**, negatif kararı Search Terms kalitesine bırak.

Planner gerçeği (SKAG PDF): `Zahnimplantat Preis` Almanca’da kapalı; `diş implant fiyat` TR dil + DE geo **açık** → DE_TR kampanyası doğrulanmış.

---

## 4) Landing page boşlukları (Ads blocker)

| Kampanya / grup | Brief hedef | Şimdi | Aksiyon |
|-----------------|-------------|-------|---------|
| DE_TR implant | `/tr/almanya-dan-turkiye-de-dis-tedavisi/` (veya eşdeğer) | Genel implant LP | **Yeni TR “Almanya’dan” sayfası** — remote plan, gün sayısı, transfer, dönüş sonrası iletişim (garanti vaadi yok) |
| DE_DE implant | Almanya hasta yolu + Nachsorge | `/de/preise/` | Nachsorge / 2. ziyaret güçlendir; gerekirse `/patients/germany/` |
| FR / NL | Ülke sinyali | FR prix var · NL zayıf | NL TEST öncesi sayfa |
| All-on / Veneers | Tedavi spesifik | Kısmi | Ads açmadan önce dolu LP |

Thin gurbetçi blog **açma**. Entity + journey sayfası.

---

## 5) Keyword tier → Ads kararı

| Tier | Intent | Ads | SEO / AI |
|------|--------|-----|----------|
| A | implants turkey cost, zahnimplantate türkei kosten, implant fiyat | **Primary Search** | Answer-first fiyat/süreç |
| B | all-on-4, veneers price | Primary (LP varsa) | Tedavi hub |
| C | dental clinic istanbul | Secondary / düşük bütçe | Klinik entity |
| D | best clinic, reviews | Küçük test veya SEO | Trust / case |
| E | how long, recovery | **Ads’e koyma** | GEO / aftercare |

110 ChatGPT prompt = **regresyon / intent cluster**, 110 URL değil (zaten SEO kapısı ile uyumlu).

---

## 6) Ölçüm (brief §12) — Ads revizyon sırası

1. Deploy: `tracking.js` gclid/UTM hidden + form POST  
2. CRM: alanları sakla (`utm_term`, `utm_campaign`, `gclid`, `hat`)  
3. Offline: satılan lead → Google (Enhanced Conversions / offline)  
4. SKAG ROAS ancak bundan sonra kelime bazında anlamlı  

Detay: [attribution-crm-offline-plan.md](./attribution-crm-offline-plan.md).

---

## 7) Compliance (brief §14) — RSA / LP checklist

- Google healthcare / personalized advertising  
- TR uluslararası sağlık turizmi kuralları (12 Kas 2025 reg — avukat/operasyon onayı)  
- Repo: `banned-terms.json` (garanti, puan, ucuz, mucize…)  
- Brief’teki örnek “hasta yorumları” niyeti SEO’da **gerçek onaylı vaka** ile; Ads’te uydurma yorum/puan yok  
- Foto’dan teşhis yok (AI prompt’larda da)

---

## 8) 30 gün — Ads dilimi (brief §16 kısaltma)

| Hafta | Ads | Bağımlılık |
|-------|-----|------------|
| 1 | DE_DE + DE_TR + FR yapıyı brief isimlendirmesine çek; Search Terms + negatif | Dönüşüm primary doğru |
| 1–2 | DE_TR LP (Almanya’dan) içerik PR | Hekim `reviewer` |
| 2 | Journey seed’leri Planner’dan süz → phrase grupları ekle (PAUSED) | LP canlı |
| 3 | TR içi implant ÖNCELİK smoke | CPC düşük |
| 3–4 | NL/AT/BE TEST mikro bütçe veya kapat | Veri |
| Sürekli | Haftalık Search Terms · kazananı SEO intent’e geri besle | — |
| Ertele | UK/US/AU/SE Ads | Organik/AI + CPC |

---

## 9) Cursor / agent kuralları (Ads)

1. Brief PDF + bu md + `skag-matrix.md` oku.  
2. Yeni ülke Ads’i matriste **PAS/TEST** ise sesizce açma.  
3. Tier E / 110 prompt → Ads URL üretme.  
4. DE_DE ile DE_TR’yi **aynı kampanyaya karıştırma**.  
5. Yeni varlık **PAUSED**; ENABLE kullanıcı onayı.  
6. Deploy / `main` yok.

---

## 10) Sonraki uygulama adımları (onay sonrası kod)

1. `create-skag-de-implant.mjs` → journey seed AG’leri (Planner filtreli) + kampanya adı `DE_TR_Search`  
2. Hat B script → `DE_DE_Search` tedavi grupları (Brand sonra)  
3. Negatif JSON: brief NHS / wholesale / dental software (UK listesi ayrı `hat_uk` hazırlığı)  
4. İçerik PR: Almanya’dan TR tedavi LP  
5. Measurement deploy  

*Bu md onaylandıktan sonra script/LP işine geçilir — şimdilik doküman revizyonu.*
