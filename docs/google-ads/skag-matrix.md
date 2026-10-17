# MediDent — SKAG / servis × pazar matrisi

**Kaynak (en güncel):** [MediDent-SKAG-Matrisi.pdf](./MediDent-SKAG-Matrisi.pdf)  
(*MediDent SKAG Matrisi (2).pdf* · 2026-09-23 · 7 sayfa). Agent önceliği bu PDF + bu markdown.

**Sistem / mimari revizyon:** [MediDent-AI-SEO-Google-Ads-System-Brief.pdf](./MediDent-AI-SEO-Google-Ads-System-Brief.pdf) + [system-brief-revision.md](./system-brief-revision.md)  
(Brief: ülke+dil kampanya, DE_TR diaspora ayrı, keyword tier, LP entity — SKAG PDF: nereye bütçe.)

## Özet (s.1)

| | |
|--|--|
| Evren | **5 tedavi × 6 pazar = 30 olası** → **19 çalıştırılacak** |
| Bütçe bandı | **6 öncelikli · ~50.000 TL/ay** |
| Ana pazarlar | **Almanya + Türkiye içi** — hasta profiline en yakın; bütçenin çoğu; sayfalar hazır |
| Test | **Hollanda · Avusturya · Belçika** — gurbetçi var, hacim doğrulanmadı; küçük bütçe → büyüt veya kapat |
| Pas / ertele | **İngiltere** — organik zaten 2. sırada; tıklama başı **233–661** bu bütçeyle imkânsız |

Smoke’ta 19 hücre birden kurma. PDF “şimdilik yap”: **1 kampanya · 2 SKAG · 6 RSA**.

---

## Servis × pazar matrisi (s.2)

Etiketler stratejik öncelik sırası — Planner hacmi girilince güncellenir.

| Tedavi \\ Pazar | Almanya (gurbetçi · ana) | Türkiye içi (yerli · düşük CPC) | Hollanda | Avusturya | Belçika | İngiltere |
|-----------------|--------------------------|----------------------------------|----------|-----------|---------|-----------|
| Diş implant | **ÖNCELİK** | **ÖNCELİK** | TEST | TEST | TEST | PAS |
| All-on-4 / All-on-6 | **ÖNCELİK**\* | **ÖNCELİK**\* | TEST | TEST | TEST | PAS |
| Zirkonyum / Hollywood Smile | **ÖNCELİK**\* | TEST | TEST | TEST | TEST | PAS |
| Diş beyazlatma | TEST | TEST | PAS | PAS | PAS | PAS |
| Kanal + kuron-köprü | TEST | **ÖNCELİK**\* | PAS | PAS | PAS | PAS |

- **Öncelik** — bütçe ayrılan  
- **Test** — küçük bütçeyle dene  
- **Pas** — bu bütçeyle uygun değil  

\* Planner’da fiyat long-tail çoğu dilde **0 sonuç** — alternatif sorgu veya native dil kelimesi gerekir (aşağıya bak).

---

## SKAG ağacı (s.3)

Üstte servis. Grup başına **tek kelime**. Altta çok reklam.

```
SEVİYE 1  KAMPANYA     = servis + pazar
          örn. Almanya · Diş Implant
               670 TL/gün · Search · Maks. Dönüşüm

SEVİYE 2  REKLAM GRUBU = tek kelime (SKAG)
          SKAG 1  "diş implant fiyat"     exact · negatif · LP eşleşmesi
          SKAG 2  "türkiye diş implantı"  exact · negatif · LP eşleşmesi

SEVİYE 3  REKLAM       = split test (RSA × 3 / SKAG)
          Varyant A / B / C — CTR hücreleri yayın + veri sonrası dolar
```

| Alan | PDF değeri | Repo notu |
|------|------------|-----------|
| Bütçe | 670 TL/gün | `create-skag-de-implant.mjs` |
| Match | Tam eşleme (exact) | Phrase smoke’ta da kullanılabilir |
| PDF LP örnekleri | `/de/dis-implanti-fiyat`, `/de/turkiye-dis-implanti` | **Bu slug’lar sitede yok** |

### Dil + gerçek Final URL

PDF `/de/…` örnekleri mesaj eşleşmesi fikrini gösterir; canlı site:

| SKAG kelime | Geo | Dil | Final URL |
|-------------|-----|-----|-----------|
| diş implant fiyat | DE | Türkçe | `/hizmetler/implantoloji-implant-tedavisi/` |
| türkiye diş implantı | DE | Türkçe | aynı |

Native Almanca Search → **Hat B** (`/de/preise/` vb.); bu gurbetçi SKAG kampanyasına karıştırma.

---

## Keyword Planner · gerçek veri (s.5)

Kaynak: Google Ads Anahtar Kelime Planlayıcı · **İstanbul Dent** · **23 Eylül 2026** · dönem Eyl 2025 – Ağu 2026.

**Kritik bulgu:** Dil değişince sonuç değişiyor — **Almanca’da implant tamamen kapalı** (“Tüm kelimeler kaldırıldı”).

| Anahtar kelime | Almanya · dil Türkçe | Almanya · dil Almanca | Türkiye · dil Türkçe | Durum |
|----------------|----------------------|------------------------|----------------------|--------|
| diş implant fiyat / Zahnimplantat Preis | **10–100/ay** · Orta · ~46,91–173,57 | **Tüm kelimeler kaldırıldı** | **1.000–10.000/ay** · Orta · ~9,77–39,94 | **DİLE BAĞLI** → TR dil ile DE geo |
| diş beyazlatma fiyat / Zahnaufhellung Preis | 10–100/ay · Düşük · ~30–95 | 10–100/ay · Yüksek rekabet | 10.000–100.000/ay · Orta · ~9–46 | **VERİ VAR** (matris: TEST) |
| all on 4 implant fiyat | kaldırıldı | kaldırıldı | kaldırıldı | **0 SONUÇ** · kurma |
| zirkonyum diş kaplama fiyat | kaldırıldı | kaldırıldı | kaldırıldı | **0 SONUÇ** · kurma |
| kanal tedavisi fiyat | kaldırıldı | kaldırıldı | kaldırıldı | **0 SONUÇ** · kurma |

**Sonuç (PDF):** Almanya’yı **Türkçe** hedeflemek stratejiyi doğruluyor. “Diş implant fiyat” Türkçe aramada Almanya’da gerçek hacim veriyor; Almanca karşılık tamamen kaldırılıyor. Gurbetçi hedefleme (Almanca değil Türkçe) implant SKAG için pazar davranışıyla örtüşüyor. Kesin blok nedeni belirsiz; Türkçe hedeflemenin avantajı net. Beyazlatma her dilde veri veriyor.

---

## Reklam metni · RSA + pin (s.4)

Kural: **kelimeyi 1. sıraya sabitle**; gerisini Google döndürsün. SKAG başına ~15 başlık + açıklamalar; 3 kelime varyantı pin 1’de sabit kalır → mesaj eşleşmesi korunur.

### Başlık havuzu (PDF örneği — uygulamada yasaklıları çıkar)

| Tip | Örnek | Repo |
|-----|--------|------|
| SABİT 1. SIRA | Diş Implant Fiyat Türkiye | OK (kelime pin) |
| SABİT 1. SIRA | Türkiye'de Diş Implant | OK |
| SABİT 1. SIRA | Uygun Fiyatlı Diş Implant | **YASAK** (`ucuz`/`uygun fiyat` ailesi) |
| SERBEST | Ücretsiz Konsültasyon | Soft CTA OK |
| SERBEST | Almanya Standardında Klinik | Abartısız tut |
| SERBEST | 10 Yıl Garanti | **YASAK** |
| SERBEST | Havalimanı Transferi Dahil | OK (paket) |
| SERBEST | Aynı Hafta Tedavi | Süreç — abartma |
| SERBEST | 4.9 · 500+ değerlendirme | **YASAK** (hasta puanı) |

Tam RSA kuralları: [anatomy-of-a-good-ad.md](./anatomy-of-a-good-ad.md) + `scripts/seo/lib/banned-terms.json`.

---

## Attribüsyon zinciri (s.6)

Kapanış sağlayan kelime hasta ile birlikte yolculuk eder:

1. Tıklama URL: `utm_term` · `utm_campaign` · `gclid` · `utm_source=google` · `utm_medium=cpc`  
2. Form: gizli alanlar (hastaya görünmez)  
3. CRM: kaynak + kelime + kampanya + gclid kalıcı  
4. Fatura / satış → lead’e bağla  
5. SKAG bazlı ROAS = gelir ÷ kelime harcaması  

Detay + MCC: [attribution-crm-offline-plan.md](./attribution-crm-offline-plan.md).

---

## Playbook komutları (s.7)

| Komut | Ne yapar | Repo karşılığı |
|-------|----------|----------------|
| `/kampanya-kur` | Geo · dil · bütçe · Maks. Dönüşüm · **PAUSED** başlar | `build-your-first-skag.md` + `create-*.mjs` |
| `/skag-kur` | Matristen kelime başına AG · exact · slug eşleşmesi | `create-skag-de-implant.mjs` |
| `/reklam-uret` | 15 başlık + pin 1 · insan onay | `anatomy-of-a-good-ad.md` |
| `/landing-page-kur` | 1 SKAG → 1 sayfa · gizli UTM/gclid | `landing-page-checklist.md` + `tracking.js` |
| `/hesap-denetle` | Harcama · CPA · ROAS · öncelikli sorunlar | `campaigns.md` + `npm run google:status` |
| `/negatif-temizle` | Search terms · niyet · onaya sun | `universal-negative-keywords.*` |

Prompt metinleri: [prompts.md](./prompts.md).

---

## Script / canlı eşleme

```bash
npm run google:ads:skag-de-implant          # PAUSED varsayılan
npm run google:ads:skag-de-implant -- --enable   # yalnızca onay sonrası
```

| Hücre | Durum |
|-------|--------|
| DE gurbetçi implant SKAG (TR dil) | `create-skag-de-implant.mjs` · kampanya `24280485068` |
| DE native Search | Hat B |
| FR native Search | Hat C |
| TR içi implant | henüz yok (2. dalga · ÖNCELİK) |
| Beyazlatma | henüz yok (TEST · Planner VERİ VAR) |
| All-on / zirkonyum / kanal fiyat long-tail | Planner 0 · kurma |
