# MediDent SEO — iş günlüğü

## 2026-09-10 — Oturum başlangıcı (~13:08)

Rol: SEO stratejisti + teknik yürütücü (önceki Claude oturumundan devir).
Protokol: ~1 saat kesintisiz; yeşil bölgede onay beklemeden; kırmızı kuyruğa.

---

### İş kalemi 1 — Duplicate doğrulama

**Durum:** bitti  
**Süre:** önceki oturum + bu oturumda teyit (~15 dk toplam bağlam)

**Ne yaptım**
- `build.mjs`, `layout.mjs`, dist HTML, canlı URL tarandı.
- 6 dilde `service` alanlı makaleler sayıldı; gerçek çiftler (aynı article iki URL) çıkarıldı.
- Sitemap + robots.txt + meta robots + iç link sayımı.

**Ne buldum**
- Hüküm: **KRİTİK**. Self-canonical + indexable + sitemap'te çift URL.
- 36 çift / 72 URL (TR10 EN13 DE13). FR/AR/RU etkilenmiyor (blog yok).
- İç link hizmet tarafında.

**Doğrulama**
- Canlı curl: her iki DE URL self-canonical, index,follow.
- Kod: `canonical = absUrl(lang, path)` — istisna yok.

**PR:** yok (sadece araştırma; dosya değişmedi). Bulgular `seo/PLAN.md` madde 1.

---

### İş kalemi 2 — Duplicate kaynağında kes

**Durum:** bitti  
**Süre:** ~20 dk  
**PR:** açılıyor (bu commit)

**Ne yaptım**
- `build.mjs`: hizmet sayfasına article enjekte edilmiyor; related blog deep link geçiliyor.
- `pages.mjs` `servicePage`: gövde = `serviceFallback`, FAQ = `serviceFaqs` only; blog'a "Weiterlesen" linki.
- Blog URL'lerine dokunulmadı (301 yok).

**Ne doğruladım**
- `npm run build` → 339 sayfa, hatasız.
- 36/36 eski çift: article.html sadece blog'da; hizmette yok.
- 36/36 hizmet sayfasında blog deep link var.
- FR/AR/RU hizmet sayfaları ayakta, self-canonical, index,follow.
- Sitemap'te her iki URL hâlâ var (bilinçli — silme/301 kırmızı).

**Risk / takip**
- Hizmet sayfaları artık kısa fallback metin paylaşıyor (başlık değişiyor). İnce içerik riski var ama birebir uzun duplike'den çok daha iyi. İleride hizmete özel kısa gövde yazılabilir (yeni madde adayı).

### İş kalemi 3 — hreflang + ölü mapping

**Durum:** bitti  
**Süre:** ~15 dk  
**PR:** #32 (aynı branch)

**Ne yaptım**
- `blogTopicGroups`: 8 klasik TR/EN/DE eşlemesi eklendi; hollywood DE slug düzeltildi; smile-design TR çakışması giderildi.
- `geoTopicGroups`: whitening + hollywoodlywood (mevcut typo slug) eklendi.

**Doğrulama**
- Build 339 OK. DE orphan hreflang: **11 → 0**. Slug çakışması 0.
- Dist HTML: DE hollywood blog hreflang TR/EN/DE doğru.

---

### İş kalemi 6 — DE title/meta yeniden konumlandırma

**Durum:** bitti  
**Süre:** ~12 dk  
**PR:** #32

**Ne yaptım**
- `articles.json` (DE): implantatbehandlung, taggleiche-behandlung, aesthetische-zahnmedizin, zahnprothese, zahnaufhellung — title + metaDescription.
- `generated-blog.json` (DE): sofortimplantate, all-on-4, bonding-vs-veneers.
- `i18n.mjs` DE: `/de/preise/` ve `/de/composite-bonding-tuerkei/` H1/lead.

**Doğrulama**
- Build OK; dist title/H1/meta spot-check geçti.
- Ana sayfaya dokunulmadı. Fiyat rakamları mevcut metinden (yeni iddia yok).


### İş kalemi 9 — GEO Article + E-E-A-T şablonu

**Durum:** bitti  
**Süre:** ~10 dk  
**PR:** #32

**Ne yaptım**
- `geoPackPage`: WebPage → Article schema; og:type=article; published_time; görünür byline (author/tarih); reviewer sadece alanda varsa.

**Doğrulama**
- Build 339→ sonra 340. turkey-teeth GEO: Article + byline + published_time OK. AR/RU geo index ayakta.

---

### İş kalemi 12 — EN yamyamlık denetimi (araştırma)

**Durum:** bitti (rapor)  
**Süre:** ~5 dk

**Bulgular**
- EN blog-blog yüksek benzerlik çifti yok.
- oral vs implant hizmet sayfaları hâlâ yakın (ortak fallback) — madde 5 / 2b.
- turkey teeth GEO’da; kelime genişletme madde 10.

---

### İş kalemi 8 — Porzellan-Veneers landing (DE)

**Durum:** bitti  
**Süre:** ~15 dk  
**PR:** #32

**Ne yaptım**
- Yeni URL: `/de/porzellan-veneers-istanbul/` (sharedPrefixes dışı).
- `veneersPage` + DE i18n; build emit; seo.mjs hreflang (DE-only).
- İç link: GEO tanım, bonding landing, bonding-vs-veneers blog.
- Fiyat: mevcut bonding sayfasındaki “ab 200 €” ile uyumlu; yeni rakam uydurulmadı.

**Doğrulama**
- Build 340 sayfa. Canonical self. Sitemap’te var. 3 iç link hedefi mevcut. Yasaklı DE terim yok.

