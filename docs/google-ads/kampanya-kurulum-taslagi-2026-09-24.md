# Kampanya Kurulum Taslağı — DE / EN / FR

*Tarih: 2026-09-24 · Durum: TASLAK, hiçbir şey oluşturulmadı. Onay sonrası API'den PAUSED olarak kurulur.*
*Kaynak: gerçek geçmiş arama terimleri (`hesap-durumu-2026-09-24.md`) + `docs/medident-ads-abc-plan.md` + canlı SERP araştırması.*

**Ön koşul:** Bu taslak, hesap bütçesi yenilenip dönüşüm izleme (`donusum-baglama-plani.md`) doğrulanmadan **yayına alınmamalı**. PAUSED oluşturmak bütçe/izleme sorunundan bağımsız, şimdi yapılabilir.

**Teklif stratejisi önerisi:** Üç kampanya da şu an "Maximize Conversions" — ama sıfır dönüşüm geçmişiyle bu stratejide asla öğrenme aşamasından çıkamaz (nitekim `BIDDING_STRATEGY_LEARNING`'de takılı kaldılar). **Dönüşüm izleme doğrulanana kadar `Maximize Clicks` (manuel üst sınırla) öneriyorum**, veri birikince `Maximize Conversions`'a geçilir.

---

## 1) DE_DE — Almanca (native) — mevcut "Hat B" kampanyasına ek ad group'lar

Mevcut: `Hat B — DE Search Dental Tourism`, 780 TL/gün, LP `/de/preise/`. Reklam metni zaten iyi (Foto-Einschätzung, Nachsorge, WhatsApp) — değiştirmiyorum, sadece yeni ad group'lar ekliyorum.

### AG — Implantate (mevcut kelimeler korunur + gerçek veriden eklenenler)
`"zahnimplantate preisliste"` · `"zahnimplantate preise"` · `"was kosten komplett neue zähne"` · `"zahnimplantat türkei kosten"` · `"implantate istanbul"` · `"kompletter zahnersatz kosten"`

### AG — All-on-4 / Zahnersatz (YENİ)
`"all on 4 türkei"` · `"all on 4 türkei kosten"` · `"vollmund implantate türkei"` · `"zahnersatz türkei"` · `"zahnersatz türkei preise"` · `"feste dritte zähne kosten"`
→ LP: `/de/preise/` (ya da `/de/hizmetler/implantoloji-implant-tedavisi/` yönlendirmesi — sizde hangisi daha dolu ise)

### AG — Zirkon / Bleaching (YENİ, gerçek veriden — tıklama kanıtlı)
`"zähne bleichen kosten türkei"` · `"zahnkrone kosten türkei"` · `"veneers kosten türkei"` · `"zirkonkronen türkei"` · `"hollywood smile türkei"`
→ LP: `/de/composite-bonding-tuerkei/` veya ilgili hizmet sayfası

### AG — Istanbul lokal (YENİ — GSC'de en yüksek gösterim alan kalıp)
`"zahnarzt istanbul"` · `"istanbul zahnarzt"` · `"zähne machen lassen istanbul"` · `"zahnarzt istanbul deutsch"`
→ LP: `/de/` (ana sayfa) — bu grup marka/lokal niyet, fiyat sayfası değil

**Ad copy (yeni gruplar için, mevcut Hat B üslubunda, uyumlu):**
- H: `All-on-4 in Istanbul` / `Vollmund-Versorgung Preise` / `Festsitzende Zähne, 1 Reise` / `Kostenlose Foto-Einschätzung` / `Schriftlicher Plan vor Anreise` / `Nachsorge per WhatsApp`
- D: `Feste Zähne in wenigen Tagen. Kostenlose Foto-Einschätzung, transparente Preise, schriftlicher Plan vor dem Flug.`

---

## 2) DE_TR — Almanya'daki Türkler — mevcut "SKAG" kampanyasına ek

Mevcut: 670 TL/gün, `diş implant fiyat` + `türkiye diş implantı`, LP implant sayfası.

### Yeni SKAG'ler
`[all on 4 türkiye]` · `[zirkonyum diş fiyatları]` · `[hollywood smile fiyat]` · `[istanbul diş kliniği]`
→ implant dışındakiler kendi hizmet sayfasına gitmeli (zirkonyum → `/hizmetler/...zirkon...`, hollywood smile → varsa ilgili sayfa, yoksa ana sayfa)

Ad copy mevcut SKAG üslubuyla aynı kalıpta (Ücretsiz Foto Değerlendirme / Yazılı Tedavi Planı / WhatsApp) — değiştirilmiyor, sadece kelime+başlık birebir eşlenir.

---

## 3) DE_EN — Almanya'da İngilizce arayanlar (YENİ KAMPANYA)

GSC'de Almanya'dan **"turkey teeth" tek başına 1029 gösterim** almış, hiç hedeflenmiyor. Ayrı, küçük bütçeli bir kampanya öneriyorum.

- **Kampanya adı:** `DE_EN Search — Turkey Teeth`
- **Dil:** İngilizce · **Konum:** Almanya
- **Bütçe:** 150 TL/gün (test)
- **LP:** `/en/turkey-teeth-price/` (zaten var, tam bu niyet için yazılmış)

### AG — Turkey teeth (dikkatli, itibar riskli terim)
`"turkey teeth"` · `"turkey teeth cost"` · `"dental implants turkey cost"` · `"dental clinic istanbul"` · `"all on 4 istanbul"`

⚠️ `"turkey teeth gone wrong"`, `"turkey teeth fails"` gibi negatif çağrışımlı varyantları **negatif kelime** olarak eklemek gerek (aşağıda) — trafiği çeker ama dönüşüm getirmez, itibar açısından da reklamın yanına çıkması istenmez.

**Ad copy:**
- H: `Dental Care in Istanbul` / `Free Photo Assessment` / `Transparent Pricing Online` / `Written Treatment Plan` / `Aftercare via WhatsApp` / `MediDent Istanbul`
- D: `Free photo assessment before you fly. Transparent pricing, written plan, WhatsApp aftercare support.`

---

## 4) FR — mevcut "Hat C" korunur, değişiklik önerilmiyor

170 TL/gün, LP `/fr/prix-implants-dentaires-turquie/`, ad copy zaten uyumlu (Devis photo gratuit, Plan avant le voyage). Geçmiş kampanya verisinde FR'ye ait gerçek tıklama verisi yok (hiç çalışmamış), bu yüzden değişiklik önerisi mevcut araştırmaya (`medident-ads-abc-plan.md`) dayanıyor, değiştirmiyorum.

---

## 5) Negatif kelimeler — mevcut listeye ek

Mevcut: `universal` (100) + `hat_b_de` (10) + `hat_c_fr` (7) zaten var ve script'ler bunu okuyor (`universal-negative-keywords.json`).

**Eklenmesi önerilenler (yeni `hat_de_en` listesi + `hat_b_de`/`hat_tr` ekleri):**
- İtibar riski: `turkey teeth gone wrong`, `turkey teeth fails`, `turkey teeth horror`, `turkey teeth disaster`
- İş/eğitim: `job`, `jobs`, `ausbildung`, `stelle`, `gehalt`, `iş ilanı`, `maaş`
- Ücretsiz/ucuz arayan: `kostenlos zahnarzt`, `bedava diş`, `ücretsiz tedavi`
- Yanlış konum: `polen`, `ungarn`, `antalya`, `izmir`, `alanya` (zaten `hat_b_de`'de polen/ungarn var, antalya/izmir eklenmeli)
- Almanya içi arama: `zahnarzt in der nähe`, `notdienst`, `berlin`, `köln`
- Rakip marka bilgisi arayan ama satın alma niyeti düşük: `erfahrungen`, `bewertung` (fiyat/implant kelimeleriyle birlikte geçmiyorsa serbest bırakılabilir — geniş negatif önerilmiyor, sadece izlenmesi öneriliyor)

---

## Özet tablo

| Kampanya | Dil | Bütçe/gün | Durum | LP |
|---|---|---|---|---|
| Hat B — DE_DE (+3 yeni AG) | DE | 780 TL (mevcut) | PAUSED önerilir, AG'ler eklensin | `/de/preise/` + ilgililer |
| SKAG — DE_TR (+4 yeni SKAG) | TR | 670 TL (mevcut) | PAUSED önerilir | implant/hizmet sayfaları |
| DE_EN — Turkey Teeth (YENİ) | EN | 150 TL (yeni) | Oluşturulacak, PAUSED | `/en/turkey-teeth-price/` |
| Hat C — FR | FR | 170 TL (mevcut) | değişiklik yok | `/fr/prix-implants-dentaires-turquie/` |

---

## Enes'e kısa madde listesi

1. Bu taslağı gözden geçir, LP eşleşmelerini onayla (özellikle "Zirkon/Bleaching" ve "Istanbul lokal" gruplarının hangi sayfaya gideceği — şu an tahmin ettim, kesin sayfa sizde netse söyleyin).
2. Onaylarsan: yeni ad group'ları (Hat B'ye 3, SKAG'e 4 kelime) ve yeni DE_EN kampanyasını **PAUSED** olarak API'den kurarım — para harcanmaz, bütçe/izleme sorunu çözülene kadar yayına alınmaz.
3. Negatif kelime eklerini onayla, JSON dosyasına işlerim.
4. Bütçe + dönüşüm izleme (`donusum-baglama-plani.md`) tamamlanınca hep birlikte ENABLE ederiz.
