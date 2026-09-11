# MediDent — haftalık içerik otomasyonu kuralları

**Durum (2026-09-11):** Schedule **kapalı**. Sadece `workflow_dispatch` ile elle tetiklenebilir.  
Yeniden haftalık açmak için bu dosyadaki maddelerin **tamamı** sağlanmış olmalı.

Kaynak workflow: `.github/workflows/weekly-content.yml`  
Üretici: `scripts/content/generate.mjs`  
Kapı: `scripts/seo/lint-content.mjs` (`--new-only` CI’da)

---

## Yeniden açmadan önce zorunlu kurallar

### 1. Aynı slug merge edilmeden yeniden üretilmeyecek

- `queue-state.json` yalnızca main’deki `used*` listesine bakmasın.
- Açık PR branch’lerindeki (`content/*`) `generated-blog.json` / `geo/packs.json` slug’ları da “kullanılmış” sayılsın.
- **Uygulama:** `generate.mjs` içinde kod — `gh pr list` veya `git ls-remote` + açık `content/*` branch’lerinden slug topla; `usedBlog`/`usedGeo` ile birleştir. PR açmadan önce “bu haftanın slug’ları zaten açık PR’da” ise exit 0 (commit yok).

### 2. Şablon / iskelet gövde yasak — her sayfa özgün

- Ortak H2 kalıbı + “Bu sorunun net cevabı kişiye özel…” tipi dolgu **yasak**.
- Her blogda konuya özel en az bir bölüm (risk, süre, alternatif).
- **Uygulama:** `generate.mjs` iskeletini daralt veya üretimi sadece konu listesi + boş iskelet bırakıp insan/Cursor ile doldur. Lint’te duplicate/near-duplicate (`jaccard`) zaten RED/WARN — eşikleri düşürme.

### 3. `direct_answer` minimum kelime

- Hedef: **en az 25** (mevcut kapı), önerilen otomasyon tabanı: **60+** kelime (alıntılanabilir, somut).
- Üst sınır mevcut kapı: 60 — **çelişki notu:** kapı 25–60 iken “60+” için ya kapı `GEO_ANSWER_MAX` yükseltilir (ör. 90) ya da otomasyon 45–60 bandını zorunlu kılar.
- **Karar (bu dosya):** Otomasyon **45–60 kelime** üretsin (kapı ile uyumlu). İleride “60+” istenirse önce `lint-content.mjs` `GEO_ANSWER_MAX` güncellenir.
- **Uygulama:** `generate.mjs` `buildGeo` — kelime sayısı kontrolü; yetersizse üretme / fail. Lint zaten RED verir.

### 4. Ticari niyetli sorgu → yeni URL yok

- Fiyat, implant, şeffaf plak, Hollywood, turkey teeth vb. ticari sorguda **yeni blog/GEO açma**.
- Mevcut `/hizmetler/…` veya hub GEO’ya internal link.
- **Uygulama:** `blog-topics.json` / `geo-topics.json` içinde `commercial: true` veya yasaklı slug/keyword listesi; `generate.mjs` bunları atlar. PR checklist: “ticari mi?” kutusu.

### 5. Yeni sayfa + hreflang aynı PR’da

- Çok dilli veya hreflang grubuna girecek sayfa için `src/data/seo.mjs` (`blogTopicGroups` / `geoTopicGroups`) **aynı PR’da** güncellenir.
- **Uygulama:** PR checklist zorunlu. İsteğe bağlı: generate sonrası “yeni slug var, seo.mjs’de yok” diye workflow fail (script).

### 6. TR-only üretim politikası

- **Karar:** Haftalık otomasyon **TR-only sayfa üretmez.**  
  Ya TR+EN (veya TR+EN+DE) birlikte üretilir ve hreflang yazılır, ya hiç üretilmez.
- Gerekçe: tek dil orphan + DACH odaklı stratejiyle uyumsuz; TR şablon birikimi yaşandı.
- **Uygulama:** `generate.mjs` varsayılan `langs: ["en"]` veya `["en","de"]`; TR ancak `workflow_dispatch` input ile ve çok dilli paket zorunluysa.

### 7. PR açılmadan yamyamlık kontrolü

- Yeni slug’ın başlık/soru/anahtar kelimesi mevcut hizmet + GEO + blog ile overlap ediyorsa üretme.
- **Uygulama:** `generate.mjs` veya ayrı `scripts/seo/cannibal-check.mjs` — mevcut envanterle kelime örtüşmesi / slug ailesi; eşik aşımında skip + log. Workflow: cannibal fail → PR açma.

### 8. Lint RED ise PR açılmasın

- Bugün: generate sonrası lint `continue-on-error: true`, yine de PR açılıyor.
- **Uygulama:** workflow’da `node scripts/seo/lint-content.mjs --new-only` **başarısızsa exit 1**; “Branch + Draft PR” adımı çalışmasın. (Yumusak rapor ayrı artifact olabilir.)

---

## Kod vs checklist özeti

| Kural | Kod (`generate` / workflow / lint) | PR checklist |
|-------|-------------------------------------|--------------|
| Açık PR slug’larını say | `generate.mjs` | — |
| Şablon yasak / özgünlük | generate + lint duplicate | Hekim okuma |
| direct_answer 45–60 | generate + lint | — |
| Ticari → link, yeni URL yok | topics flag + generate skip | “Ticari mi?” |
| hreflang aynı PR | opsiyonel CI assert | **Zorunlu** |
| TR-only yok | generate lang policy | — |
| Yamyamlık | cannibal script | Spot check |
| Lint RED → no PR | workflow hard fail | — |
| reviewer / reviewedAt | lint RED | `seo:approve` |

---

## Schedule’ı geri açma prosedürü

1. Bu dosyadaki kod maddeleri merge edilmiş olsun.  
2. En az bir elle `workflow_dispatch` denemesi: lint PASS, duplicate yok, hreflang dolu.  
3. `.github/workflows/weekly-content.yml` içine `schedule: cron: "0 6 * * 1"` geri ekle.  
4. `seo/PLAN.md` / LOG’a not düş.
