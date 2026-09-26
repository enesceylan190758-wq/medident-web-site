# Konum bazlı dinamik başlık (DTR) — kombinasyonlar + Ads bağlama planı

Sayfa: `https://medidentistanbul.com/dis-implant-fiyat/` · parametreler: `?h=<tedavi>&l=<konum>`
Kaynak kod: `src/data/i18n.mjs` (`implantPricePage.treatments/locations/variants`), script `pages.mjs` (`dtrScript`).
Ham parametre asla DOM'a yazılmaz; sadece sabit whitelist'ten seçim yapılır. Bilinmeyen / kötücül değer → varsayılan H1 ("Diş İmplant Fiyatı").

## 1) Kombinasyon tablosu (H1 çıktıları test edildi — 32/32 doğru)

Tedavi (`h`): `implant` → "{loc} Diş İmplantı" · `all-on-4` → "{loc} All-on-4 İmplant".
Eski anahtarlar (Ads'te canlı) aynen çalışır: `implant-fiyat`, `turkiye-implant`, `rakip-karsilastir`, `medident-istanbul`; `l` ile birlikte gelirlerse tedavi = implant sayılır.

| `l` | Ekli hâl (elle yazıldı) | Ek kuralı | Ref soneki | Geçmiş arama verisi (Ads, 2022–2026) |
|---|---|---|---|---|
| `istanbul` | İstanbul'da | ünlü uyumu (a,u → -da) | IST | **394 terim · 2.199 gösterim · 220 tık** (implantlı: 25 terim, 64 gösterim, 10 tık) |
| `turkiye` | Türkiye'de | ön ünlü → -de | TR | **43 terim · 94 gösterim · 5 tık** (implantlı: 15 terim, 38 gösterim, 3 tık) |
| `anadolu-yakasi` | Anadolu Yakası'nda | iyelik ekli → -nda | ANA | 4 terim · 5 gösterim · 1 tık |
| `uskudar` | Üsküdar'da | son ünlü a → -da | USK | 2 terim · 5 gösterim |
| `acibadem` | Acıbadem'de | son ünlü e → -de | ACI | (ayrı ölçülmedi; klinik mahallesi) |
| `kadikoy` | Kadıköy'de | ö (ön) → -de | KDK | 16 terim · 35 gösterim · 3 tık |
| `umraniye` | Ümraniye'de | ünlüyle biter → -de | UMR | 15 terim · 27 gösterim · 2 tık |
| `atasehir` | Ataşehir'de | i (ön) → -de | ATS | 10 terim · 21 gösterim · 1 tık |
| `maltepe` | Maltepe'de | e → -de | MLT | 12 terim · 17 gösterim · 1 tık |
| `pendik` | Pendik'te | **k sert ünsüz → -te** | PND | 5 terim · 8 gösterim |
| `kartal` | Kartal'da | a → -da | KRT | 4 terim · 5 gösterim |
| `sancaktepe` | Sancaktepe'de | e → -de | SNC | 2 terim · 2 gösterim |
| `sultanbeyli` | Sultanbeyli'de | i → -de | SLT | 1 terim · 2 gösterim |
| `tuzla` | Tuzla'da | a → -da | TZL | 1 terim · 1 gösterim |
| `memleket` | Memlekette | k sert ünsüz + -te | MEM | **0 — veri yok (test)** |
| `tatil` | Tatilde | l → -de | TAT | **0 — veri yok (test)** |

**Okuma:** gerçek talep verisi yalnızca **İstanbul** ve **Türkiye** için var. İlçelerde hacim çok düşük ve hiçbirinde "ilçe + implant" sorgusu anlamlı değil; `memleket`/`tatil` için hiç veri yok. Bu nedenle Ads'te önce `istanbul` + `turkiye` açılır, ilçeler hazır bekler (sayfa tarafı kurulu), Ads'e ilçe kelimesi ancak veri/Keyword Planner desteğiyle eklenir.
Not: eski kampanyaların bir kısmı Türkiye içi hedefliydi; ilçe sorguları o kitleden geliyor, SKAG'ın Almanya'daki gurbetçi kitlesini temsil etmeyebilir.

**Konum dürüstlüğü (Google "yanıltıcı temsil" politikası):** kliniğin gerçek adresi Üsküdar/Acıbadem. İlçe H1'lerinin altındaki lead metni bunu açıkça söyler ("…kliniğimiz Anadolu Yakası'nda, Üsküdar/Acıbadem'de"); "Kartal'da klinik" gibi bir iddia yok.

**Kapsam notu:** Sayfa tek konulu (implant) olduğu için zirkonyum / Hollywood Smile bu sayfada yok. O tedaviler için ayrı sayfa gerekir; `all-on-4` implant ailesinden olduğu için bu sayfada.

## 2) Ads'e bağlama planı — ayrı reklam grubu açmadan, anahtar kelime seviyesinde

Google Ads'te özel parametre (`{_x}`) şu seviyelerde tanımlanabilir; **daha spesifik olan kazanır:** anahtar kelime > reklam > reklam grubu > kampanya > hesap.

Öneri:
1. **Reklam grubu seviyesi (zaten var):** `_h` = `implant-fiyat` (SKAG 1) / `turkiye-implant` (SKAG 2). Ek: her reklam grubuna varsayılan `_l = default` (whitelist'te yok → varsayılan H1; boş `l=` oluşmasın diye).
2. **Reklam Final URL suffix'i güncellenir:** `h={_h}&l={_l}&utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}`
3. **Anahtar kelime seviyesi:** her konumlu kelimeye `ad_group_criterion.url_custom_parameters = [{key:"l", value:"istanbul"}]` (reklam grubunun `_l` varsayılanını ezer). Aynı reklam grubunda kalır; yeni reklam grubu gerekmez. Kelime bazlı `h` de ezilebilir (örn. all-on-4 kelimesi için `h=all-on-4`).
4. **Önerilen ilk dalga (veri olan konumlar):**

| Reklam grubu | Yeni kelime (PHRASE) | keyword `_l` | (gerekirse) keyword `_h` |
|---|---|---|---|
| SKAG 1 | "istanbul diş implant fiyatları" | `istanbul` | — |
| SKAG 1 | "türkiye diş implant fiyatları" | `turkiye` | — |
| SKAG 2 | "istanbul diş implantı" | `istanbul` | `implant` |
| SKAG 2 | "türkiye diş implantı" (mevcut EXACT kelimeyle çakışmaması için PHRASE + negatif kontrol) | `turkiye` | `implant` |

   İlçe / memleket / tatil kelimeleri **eklenmez** (veri yok); sayfa hazır, kelime Keyword Planner veya GSC kanıtı gelince eklenir.
5. **Doğrulama:** (a) API ile reklam suffix'i ve kelime parametreleri geri okunur; (b) örnek genişletilmiş URL elle üretilip canlı sayfada H1 kontrol edilir; (c) 7 gün sonra arama terimleri raporu + Sheet'teki `ref_code` (ör. `TR-IMP-IST`) ile hangi kombinasyonun lead getirdiği okunur.
6. **Riskler:** SKAG'ın "tek kelime" disiplini bozulur (Kalite Puanı seyrelmesi); kelime seviyesi final URL/suffix değişince ilgili kelime yeniden incelemeye girebilir; `{keyword}` UTM'de ham kelime taşır (yalnızca kayıt için, sayfada/WhatsApp'ta gösterilmez).

## 3) Ref kodu (Sheet / WhatsApp)

`tracking.js` → `REF_MAP` + `REF_LOC`: `h=implant` → `TR-IMP`, `h=all-on-4` → `TR-AO4`, konum varsa `-KRT` gibi sonek: `TR-IMP-KRT`, `TR-AO4-IST`. Eski anahtarlar (`TR-IMP1`, `TR-IMP2`, `TR-CMP`, `TR-BRAND`) değişmedi; `l` gelirse onlara da sonek eklenir.

## 4) Uygulanmadı / onay bekleyen

- Ads reklam suffix'i, `_l` varsayılanları ve yeni anahtar kelimeler **henüz uygulanmadı** (istek: "reklam URL'lerine dokunma").
