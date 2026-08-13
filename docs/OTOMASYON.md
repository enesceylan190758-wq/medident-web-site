# MediDent SEO/GEO otomasyonu — iki katman tek hat

## Neden degisti

Onceki kurulumda `weekly-content.yml` ve `daily-content.yml` sunu yapiyordu:

```
generate.mjs -> git push origin main -> deploy gh-pages     (kapi yok, review yok)
```

Olculen sonuc (127 sayfa, `npm run seo:report`):

| Bulgu | Adet |
| --- | --- |
| `reviewer` / `reviewedAt` bos | 127 / 127 |
| `author` bos | 105 |
| Ayni dilde %75+ benzer (sablon govde) | 28 |
| Thin (blog < 250 kelime) | 42 |
| Yasak ifade (agrisiz / schmerzfrei / cheapest / en iyi / billigste) | 9 |
| `direct_answer` 25-60 kelime araligi disinda | 19 |

En yuksek benzerlik **%93** — `hollywood-smile-nedir` ile `emax-kaplama-avantajlari` arasinda.
Konular alakasiz, govde ayni. Bu, Google'in **scaled content abuse** tanimina giren profil
ve haftalik olarak otomatik canliya cikiyordu.

## Yeni mimari

```
                 Katman A (GitHub Actions)          Katman B (Cursor Automation)
                 Pzt 06:00 UTC                      Sali 10:00 TRT
                 uretim, deterministik              duzeltme + strateji
                        |                                   |
                        +--------------> PR <---------------+
                                          |
                            content-lint.yml (RED kapisi)
                                          |
                          hekim onayi + TR yasal onay (insan)
                                          |
                                   merge -> main
                                          |
                            deploy.yml (TEK deploy kaynagi)
                                          |
                              gh-pages -> IndexNow ping
                                          |
                            refresh.yml (Cuma) -> Issue
```

**Iki katmanin tek arayuzu PR.** Baska temas noktasi yok.

| | Katman A (Actions) | Katman B (Cursor) |
| --- | --- | --- |
| Ne yapar | Iskelet uretir, PR acar | RED duzeltir, refresh yapar, strateji ilerletir |
| main'e yazar mi | Hayir | Hayir |
| Deploy eder mi | Hayir | Hayir |
| Cakisma | B, A'nin actigi PR'a commit eder — yeni PR acmaz |

## Cift deploy nasil onlendi

1. Icerik workflow'larindan deploy adimi **kaldirildi**.
2. `daily-content.yml` **silindi** (ayrica ayin 1'i Pazartesi'ye denk geldiginde weekly ile
   ayni anda gh-pages'e yaziyordu — race condition).
3. `deploy.yml` tek kaynak, `concurrency: gh-pages-deploy`, `cancel-in-progress: false`.
4. `npm run deploy:domain` **bloklandi** (exit 1). Acil durum: `deploy:domain:emergency`.
5. **Deploy oncesi lint `--report-only`:** eski korpus RED'leri (simdi ~460) canli
   deploy'u kilitlemez. Sert kapi yalnizca PR'daki **yeni** sayfalar icin
   (`content-lint.yml` → `--new-only`).

## RED kriterleri (merge bloklanir)

`scripts/seo/lint-content.mjs` — Cursor tarafinda ayni kurallar `.cursor/rules/medident-seo-gate.mdc`.

| Kural | Esik |
| --- | --- |
| `banned-term` | `scripts/seo/lib/banned-terms.json` (TR en kati) |
| `duplicate` | ayni dil trigram Jaccard >= 0.75 (0.60 WARN) |
| `answer-length` | GEO `direct_answer` 25-60 kelime |
| `answer-mismatch` | cevap sorunun anahtar kelimelerini tasimiyor |
| `lead-too-long` | blog ilk paragraf > 60 kelime |
| `thin` | blog < 250 kelime; GEO < 3 bullet veya < 2 FAQ |
| `no-author` / `no-reviewer` / `no-reviewed-at` | bos olamaz |
| `unsourced-claim` | fiyat/yuzde/sure var, `source` yok |
| `cannibalization` | ayni sorgu ikinci URL'de |
| `no-native-review` | AR/RU'da `nativeReviewed !== true` |
| `volume-cap` | PR basina dil basina > 8 yeni sayfa |
| `no-internal-link` | ic link yok (> 8 ise WARN) |

WARN bloklamaz: `stale`, `near-duplicate`, `too-many-links`.

## Kurulum (bir kez)

1. **Branch protection** — `main`:
   - Require a pull request before merging (1 approval)
   - Require status checks: **`Content gate / gate`**
   - Do not allow bypassing
2. **Actions izinleri** — Settings > Actions > General:
   - Workflow permissions: Read and write
   - "Allow GitHub Actions to create and approve pull requests": **ON**
3. **Secrets** (opsiyonel): `INDEXNOW_KEY`
4. **Label'lar**: `content`, `automated`, `seo`, `refresh`
5. **Cursor Automation**: `.cursor/automations/medident-seo-geo-operasyon.json` artik
   `enabled: true` ve Sali 10:00'a alindi (A ile cakismaz).

## Gunluk kullanim

```bash
npm run seo:report      # tum korpus envanteri (bloklamaz)
npm run seo:lint:new    # PR kapisinin yaptigi denetim
npm run seo:decay       # guncelleme adaylari
npm run build           # sablon smoke
```

## Ilk borc kapatma sirasi

Mevcut 460 RED'in hepsini bir anda kapatmaya calisma. Sira:

1. **9 yasak ifade** — yasal risk, en hizli is (1 saat).
2. **127 `reviewer` + `reviewedAt`** — hekim atamasi; toplu script ile doldurulabilir,
   ama hekimin gercekten okumasi gereken sayfalari isaretle.
3. **28 duplicate** — sablon govdeleri. Cogunu **birlestir**, hepsini yeniden yazma.
   Silme; 301 ile birlestir.
4. **42 thin** — dolgu ile degil, konuya ozel bilgi ile buyut. Buyutulemeyecekse birlestir.
5. **19 answer-length + 3 answer-mismatch** — GEO alintilanabilirligi, en yuksek getirili is.
