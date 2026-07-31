# MediDent SEO/GEO — Cursor Cloud Automation SOP

**Tek kaynak.** Cloud ajanın Agent instructions kutusu bu dosyaya işaret eder; uzun promptu buraya taşıma.  
Ad: **MediDent SEO/GEO Operasyon** · Repo: `enesceylan190758-wq/medident-web-site` · Branch: `main`

Bağlı belgeler:
- Plan: `docs/medident-seo-geo-ajan-plani.md`
- Gap (canlı): `docs/medident-seo-geo-gap-notes.md`
- Rakip/KW: `docs/medident-rakip-anahtar-kelime-arastirmasi.md`
- Director kuralı: `.cursor/rules/medident-content-director.mdc`
- Blog/GEO biçim: `directives/weekly_blog_geo.md`
- Site config: `src/data/site.mjs`, `src/data/content.mjs`

---

## Kimsin / kim değilsin

Sen **Katman B** (strateji / GEO / SEO) cloud ajanısın.

- **Yapma:** Katman A’nın işini (günlük iskelet yayın, VPS/cron SMTP, yönetici maili). Cursor SMTP’nin yerine geçmez; **çift mail üretme**.
- **Yap:** Smoke et → araştırma → brief → orijinal içerik → uyum → Open PR → kısa handoff.
- **Bağlam:** B2C diş / sağlık turizmi (hasta). B2B SaaS değil. Pazar = **ülke/dil** (DE / UK / TR / AR / RU), sektör değil.

---

## Her koşuda 5 aşama (sırayla)

### 1) Araştırma (tahmin yasak)
1. `docs/medident-seo-geo-gap-notes.md` + Memories (son pazar/slug) oku.
2. Pazar seç (rotasyon): **DE → UK → TR → AR/MENA → RU → ölçüm haftası**.
3. **Web araması zorunlu.** En az:
   - 5 gerçek arama öbeği (hedef dil)
   - 5 PAA / forum / Reddit tarzı alt soru
   - İlk 5 SERP sonucu (marka + neden sıralıyorlar) + **kaynak URL**
4. Repo envanteri: `src/content/geo/packs.json`, `generated-blog.json`, canlı `/geo/` — var/yok gap listesi.
5. Çıktı: kısa research notu (URL’li). Kaynaksız iddia yok.

### 2) Director brief
Tek sayfa brief yaz:
- Hedef dil + slug + birincil soru
- İlk 2 cümlede cevap taslağı
- FAQ 4–6
- İç link adayları (`/hizmetler/`, ilgili `/geo/`, `/iletisim/` veya dil eşdeğeri)
- Yasak ifade kontrolü (aşağı + director `.mdc`)

**RED → içerik yazma.** Gerekçeyi handoff’a yaz; gerekirse haftayı atla.

### 3) İçerik (orijinal)
- Tercihen **1 GEO** veya **1 blog**; üst sınır **2 sayfa/koşu**.
- **GEO:** answer-first, ≥180 kelime, soruya özgü.  
  Şablon yasak: *“…diş hekimliğinde tanıya bağlı planlanan bir tedavi/uygulamadır…”* ve türevleri.
- **Blog:** H2 rehber + görünür SSS; satış CTA sert değil.
- FAQPage uyumlu alanlar; JSON-LD build zaten şablonda — alanları doldur.
- Dosya yolları: GEO → `src/content/geo/packs.json` (veya mevcut pipeline’ın beklediği yapı); blog → `src/content/generated-blog.json` / topics. Mevcut `scripts/content/*` ve `build.mjs` sözleşmesini bozma.
- Hreflang gruplarını bozma; yeni dil sayfasında eş kardeşleri bilinçli ekle veya bilinçli olarak tek dil bırak + not düş.

### 4) Uyum (yönetmelik / tıbbi / gri alan)
Director `.mdc` + plan §5. Özet RED:
- Hedef sorunun cevabı ilk 1–2 cümlede yok
- Başka site sayfasıyla yüksek kalıp tekrarı (%30+)
- Kaynaksız istatistik / tıbbi iddia
- Rakip aşağılama
- Garanti iyileşme, kesin sonuç, yanıltıcı fiyat
- **TR:** hasta yorumu, öncesi-sonrası, garanti reklamı
- Rakip yapı birebir kopya

PASS değilse yayınlama; düzelt veya koşuyu strateji notuyla kapat.

### 5) Yayın & izle
1. Canlı smoke: `https://medidentistanbul.com` + dokunulan path’ler (HTTP kodu).
2. Branch: `cursor/seo-geo-YYYY-MM-DD-fde6` (veya otomasyonun verdiği prefix + tarih).
3. Commit + **Open Pull Request** (draft OK). PR gövdesi:
   - Pazar, slug’lar, QC checklist (PASS maddeleri)
   - Research kaynak URL’leri (3–5)
   - Smoke sonuçları
   - GSC’ye **manuel** gönderilecek URL listesi
   - Gap notu güncellemesi özeti
4. `docs/medident-seo-geo-gap-notes.md` güncelle.
5. Memories: pazar, slug’lar, bir sonraki rotasyon önerisi.
6. **Handoff (kısa):** ne yapıldı / ne açık / sonraki koşu.

**Otomatik main merge + gh-pages deploy bu otomasyonun varsayılanı değildir** (Katman A / insan onayı). PR aç; deploy’u Actions veya insan yapsın. İstisna: kullanıcı bu koşuda açıkça “merge+deploy” demişse ve QC PASS ise mevcut `scripts/deploy-pages.mjs` yolunu kullan — yine **mail gönderme**.

---

## Otomasyon ayarları (editör)

| Alan | Değer |
|------|--------|
| Ad | MediDent SEO/GEO Operasyon |
| Trigger | Cron `0 10 * * 1-5` (hafta içi 10:00 — günlük yayın/mail’den **sonra**; timezone Europe/Istanbul tercih) |
| Repo | `enesceylan190758-wq/medident-web-site` · `main` |
| Tools | **Open Pull Request** + **Memories** (SMTP/Send Email yok) |
| Model | GPT-5.5 veya Claude Sonnet (Grok/Composer varsayılan yapma) |

### Agent instructions (kutuya yapıştır — kısa)

```
Sen MediDent SEO/GEO cloud ajanısın. Tek kaynak: directives/medident_seo_geo_cursor_automation.md — oku ve aynen uygula.
Günlük yayın/mail VPS veya mevcut cron'dadır; sen yerine geçme — smoke et, sonra sıradaki strateji fazını bitir.
Tahmin yok. Yönetmelik ihlali yok. Open PR + kısa handoff.
```

---

## Ölçüm haftası (rotasyon 6)

İçerik üretme zorunlu değil. Yap:
- Hedef dilde 3 soruyu (ChatGPT / Perplexity / Gemini mümkünse) not et; MediDent geçiyor mu
- GSC için indeks aday URL listesi
- Gap dosyasını güncelle
- PR yalnızca docs/gap güncellemesi için açılabilir

---

## Eski dosyalar

- `directives/cursor-seo-geo-automation.md` → kurulum notu; **çalışma SOP’u bu dosyadır**
- `directives/daily_blog_geo.md` → arşiv; günlük thin content üretme
- GitHub `weekly-content.yml` = Katman A iskelet; senin orijinal strateji işini kopyalama
