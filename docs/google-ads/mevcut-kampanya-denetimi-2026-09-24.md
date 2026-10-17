# Mevcut 3 Kampanyanın Tam Denetimi (Hat B / Hat C / SKAG)

*Tarih: 2026-09-24 · Kaynak: Google Ads API, doğrudan sorgu, customer 5670078321*

---

## Bulgular

### 🔴 Bilinen — hesap harcama limiti aşılmış
Zaten raporlandı (`hesap-durumu-2026-09-24.md`). Enes hallediyor.

### 🟡 SKAG (DE_TR) teklif stratejisi riskli — dönüşüm sıfırken "Maks. Dönüşüm"
- **Hat B (DE_DE) ve Hat C (FR):** `TARGET_SPEND` (Maks. Tıklama) — doğru seçim, dönüşüm verisi gerektirmiyor. Önceki notumda "üçü de Maks. Dönüşüm" demiştim, **bu yanlıştı, düzeltiyorum.**
- **SKAG (DE_TR):** `MAXIMIZE_CONVERSIONS` — dönüşüm geçmişi sıfırken bu strateji asla öğrenmeden çıkamaz. **Öneri:** dönüşüm izleme doğrulanana kadar bunu da `Maximize Clicks`'e çekin.

### 🟡 Hat B / Hat C konum hedefleme geniş — bütçe kaçağı riski
- **Hat B, Hat C:** `positiveGeoTargetType: PRESENCE_OR_INTEREST` — Almanya/Fransa'da **fiziksel olarak bulunmayan** ama o konuyla "ilgilenen" kullanıcılara da (örn. Türkiye'den "Zähne Türkei" arayan biri) gösterilebilir. Hedef kitle dışına bütçe sızdırabilir.
- **SKAG:** `PRESENCE` (doğru, sadece fiziksel olarak orada olanlar) — bu ikisi tutarsız.
- **Öneri:** Hat B ve Hat C'yi de `PRESENCE`'a çekin.

### 🟢 SKAG konum: Almanya + Avusturya (dokümante edilmemiş, muhtemelen kasıtlı)
SKAG hem `geoTargetConstants/2276` (Almanya) hem `2792` (Avusturya) hedefliyor. Hiçbir dokümanda Avusturya geçmiyor. Muhtemelen Türk gurbetçi kapsamını genişletmek için kasıtlı — sorun değil, sadece Enes'in bilmesi için not düştüm.

### 🟢 Reklam metinleri ve LP'ler sağlam
- 3 landing page de (`/de/preise/`, `/hizmetler/implantoloji-implant-tedavisi/`, `/fr/prix-implants-dentaires-turquie/`) **canlı, 200 dönüyor.**
- Tüm reklamlar `APPROVED_LIMITED` (sadece standart `HEALTH_IN_PERSONALIZED_ADS` kısıtı — sağlık dikeyinde normal, engel değil).
- Reklam metninde yasaklı ifade (garanti, en ucuz, kesin sonuç vb.) **yok.**

### 🟢 Negatif kelimeler kapsamlı
SKAG'de ~95, Hat B'de 12, Hat C'de 8 negatif kelime — iş/eğitim, ucuz/indirim, yanlış ülke (Polonya/Macaristan), rakip prosedür (saç ekimi, botoks) hepsi kapatılmış.

### ⚪ Kelime çakışması yok
Ad group'lar arası kelime tekrarı/kanibalizasyon kontrol edildi, çakışma bulunmadı — her SKAG/AG kendi tekil kelimesinde.

### ⚪ Ad group CPC bid alanı 0.01 TL görünüyor
Her ad group'ta `cpc_bid_micros: 10000` (0.01 TL) dönüyor. Kampanya seviyesinde `cpc_bid_ceiling` **boş** (tavan yok) ve keyword seviyesinde override **yok** — yani bu alan `TARGET_SPEND`/`MAXIMIZE_CONVERSIONS` stratejilerinde kullanılmıyor, muhtemelen API'nin inert varsayılan alanı. Zararsız görünüyor ama bütçe açılıp trafik gelmeye başladığında ilk günlerde teyit edilmeli.

---

## Enes'e kısa liste (denetimden)

1. Hat B / Hat C konum ayarını `PRESENCE`'a çek — onaylarsan ben yaparım (düşük riskli mutate).
2. SKAG'in teklif stratejisini `Maximize Clicks`'e çek (dönüşüm verisi gelene kadar) — onaylarsan yaparım.
3. Diğer bulgular (Avusturya hedefleme, CPC bid alanı) bilgi amaçlı, aksiyon gerekmiyor.
