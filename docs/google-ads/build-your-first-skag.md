# MediDent — Kampanya / ad group kurulumu (SKAG + tema)

## Tek kural

**Arama dili = reklam H1 = LP H1.**  
Bonding arayan `/de/preise/`’de kaybolmasın; implant arayan bonding sayfasına düşmesin.

## Yapı (PDF SKAG ağacı · s.3)

Kaynak: [MediDent-SKAG-Matrisi.pdf](./MediDent-SKAG-Matrisi.pdf) / [skag-matrix.md](./skag-matrix.md).

```
SEVİYE 1  Kampanya     = servis + pazar (+ dil)
          örn. Almanya · Diş Implant · 670 TL/gün · Search · Maks. Dönüşüm

SEVİYE 2  Reklam grubu = tek kelime (SKAG)  exact · negatif liste · eşleşen LP
          veya niyet teması (STAG)          Colloquial / High ticket / Trust

SEVİYE 3  RSA × 3      = split test · pin H1 = kelime
Final URL              = o temanın / kelimenin dolu LP’si
```

### Ne zaman tema (STAG)?

- Smoke / düşük hacim (şimdiki Hat B/C).
- Aynı LP’ye giden yakın sorgular (`Zähne machen… Kosten/Preise`).
- Smart Bidding’in öğrenecek dönüşüm yoğunluğu lazımsa.

### Ne zaman SKAG?

- Tek exact kelime ≥ anlamlı tıklama + iyi CPL.
- Mesajın kelimeye birebir kilitlenmesi şart (implant fiyat, bonding).
- O kelime için **ayrı dolu LP** hazır.
- Planner’da **VERİ VAR** / **DİLE BAĞLI** (TR dil + DE geo) — 0 sonuç hücrede kurma.

Matristeki “19 hücre birden SKAG” smoke’ta **yapma**. PDF: önce **1 kampanya · 2 SKAG · 6 RSA**.

## Match type

| Tip | Kullanım |
|-----|----------|
| Exact | SKAG varsayılan (PDF: tam eşleme) |
| Phrase | STAG / smoke |
| Broad | Ancak güçlü negatif listesi + dönüşüm sonrası |

## Bid / bütçe (smoke referans)

- SKAG DE gurbetçi implant: **670 TRY/gün** (PDF + script).
- Hat B DE native: ~780 TRY/gün.
- Hat C FR: ~170 TRY/gün.
- Max conversions ancak dönüşümler düzgün sayıyorsa; değilse Maximize clicks / manuel CPC ile öğren.
- Toplam band: ~**50.000 TL/ay** · 6 öncelikli hücre (Almanya + TR içi ağırlık).

## Geo

- Presence: insanlar **o ülkede** (DE only smoke).
- AT/CH sonra ayrı bütçe — ilk günde birleştirme.
- Gurbetçi TR niyeti → Hat A; Almanca native → Hat B.

## Agent checklist (yeni kampanya)

1. Hücreyi `skag-matrix.md`’den seç (ÖNCELİK / TEST / PAS).
2. Dil + LP URL doğrula (sayfa yoksa kampanya kurma).
3. PAUSED kampanya + ad group(lar) + keywords + RSA.
4. Shared negatives ekle.
5. Kullanıcıya özet + onay iste; ENABLE etme.

## Mevcut script

`scripts/google/create-hat-bc.mjs` — tema grupları (B1/B2/B3, C1/C2). Yeni hücreler için aynı deseni kopyala; tüm trafiği tek `/de/preise/`’ye yığma.
