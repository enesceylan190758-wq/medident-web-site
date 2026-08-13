## Ne degisti


## Zorunlu onaylar (hepsi isaretlenmeden merge etme)

- [ ] **Content gate PASS** (RED = 0)
- [ ] **Hekim tibbi onayi** — rakam / sure / endikasyon / iyilesme iddialari dogru
      Onaylayan hekim: `Dr. ...`
- [ ] **TR yasal kontrol** — garanti/kesin sonuc, fiyat-indirim-kampanya, hasta yorumu,
      oncesi-sonrasi, ustunluk ("en iyi") ifadesi YOK
- [ ] `author`, `reviewer`, `reviewedAt` alanlari dolu
- [ ] AR/RU icerik varsa `nativeReviewed: true`
- [ ] Yeni URL acilmadi (refresh PR ise ayni URL guncellendi)

## Kannibalizasyon
Bu PR'daki her soru tek bir URL'de mi yasiyor? [ ] Evet

## Not
Deploy otomatiktir (`deploy.yml`, main merge sonrasi). Elle `npm run deploy:domain` CALISTIRMA.
