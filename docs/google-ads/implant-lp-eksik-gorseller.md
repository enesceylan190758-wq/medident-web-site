# /dis-implant-fiyat/ — eksik görseller (Enes sağlayacak)

Sayfada bu görseller için kesikli çerçeveli **placeholder** duruyor (`data-placeholder` attribute'lu).
Gerçek dosyalar gelince `src/templates/implant-lp.mjs` içindeki ilgili `ph(...)` çağrısı `pic(...)` ile değiştirilir.
Yayına çıkmadan önce placeholder'ları gizlemek için: `LP_PLACEHOLDERS=0 npm run build`.

**Kural:** yalnızca kliniğin kendi, hasta onaylı arşivi. Stok / başka klinik / yapay zekâ üretimi görsel gerçekmiş gibi konmaz.

| # | Bölüm | Görsel | Boyut / format | Not |
|---|-------|--------|----------------|-----|
| 1 | 004 Markalar | Straumann implant modeli yakın çekim (vida + abutment + kron) | min 1600×1200, JPG/WebP | nötr / beyaz zemin |
| 2 | 004 Markalar | Osstem implant modeli yakın çekim | min 1600×1200 | aynı çekim stili |
| 3 | 004 Markalar | Neodent implant modeli yakın çekim | min 1600×1200 | aynı çekim stili |
| 4 | 005 Sonuçlar | ~~İmplant öncesi/sonrası~~ — **KISMEN DOLDU** (2025-09-25: yüzsüz ağız yakın çekimi eklendi). Yüzlü çiftler onay bekliyor | | |
| 5 | 005 Sonuçlar | ~~Implant röntgen~~ — **DOLDU** (slider + 2 röntgen) | | |
| 6 | 006 Klinik | Karşılama / resepsiyon | min 1600×1067 | gerçek klinik |
| 7 | 006 Klinik | Muayene / cerrahi odası | min 1600×1067 | gerçek klinik |
| 8 | 006 Klinik | Dijital tarama / 3D planlama alanı | min 1600×1067 | gerçek klinik |
| 9 | 007 Hekimler | Dr. Ahmet Çelik portre | min 800×1000 | `content.mjs` → `doctors[].image` |
| 10 | 007 Hekimler | Dr. Elif Kara portre | min 800×1000 | " |
| 11 | 007 Hekimler | Dr. Can Yıldız portre | min 800×1000 | " |
| 12 | 007 Hekimler | Dr. Aslı Yılmaz portre | min 800×1000 | " |
| 13 | Hero / Sonuçlar | İmplant tedavisi görmüş hastaların bitiş (sonuç) gülüş fotoğrafları | min 1600×1067 | şimdiki hero genel gülüş portresi |

## Repoda bulunan ama KULLANILMAYAN görseller (neden)

- `jun-8-3.jpg` — `content.mjs`'de implant hizmetine bağlı, ama aslında **porselen kaplama önce/sonrası**. Implant görseli değil.
- `blog/blog-04-implant.jpg`, `blog/blog-10-klinik.jpg` — yapay zekâ üretimi/illüstratif görünüyor (kurgusal kişiler, klinik render'ı). Gerçek klinik/hasta gibi sunulmaz. İstenirse "temsili görsel" etiketiyle kullanılabilir — karar Enes'in.

## Şu an sayfada kullanılan gerçek arşiv görselleri

`portrait-a`, `about-portrait`, `nov-8-4`, `oct-1-3`, `may-4-2`, `aug-17-1/3` (öncesi/sonrası kaydırıcı). Bunlar **implant vakası değil, gülüş dönüşümü** örnekleri; sayfada "hasta gülüşleri" başlığı ve açıklayıcı not ile sunuluyor. Bu görsellerin de **hasta onaylı klinik arşivi** olduğunu Enes'in teyit etmesi gerekiyor.

## Çizimler (SVG, kodda)

İmplant anatomisi (kron/abutment/vida), 4 aşamalı tedavi kesiti ve çene ikonları `implant-lp.mjs` içinde SVG/CSS olarak çizildi; ek dosya gerekmez.

## 2025-09-25 — Drive arşivinden eklenenler

- `implant-agiz-oncesi-sonrasi` (tam çene, yüzsüz), `implant-xray-tam-ark`, `implant-xray-oncesi-sonrasi`, `xray-oncesi`/`xray-sonrasi` (panoramik slider)
- `video/implant-asamalar|implant-tek|implant-all-on-4.mp4` (720p, sessiz, MediDent logolu animasyonlar, poster'lı)
- Hâlâ placeholder: #1–3 marka model yakın çekimleri, #6–8 klinik fotoğrafları (arşivde yok)
