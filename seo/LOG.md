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


### İş kalemi 2-rev — Duplicate yönü tersine (hizmette gövde + blog 301)

**Durum:** bitti  
**Süre:** ~25 dk  
**PR:** #32

**Karar**
- Önceki çözüm (blogda gövde, hizmette şablon) yanlıştı: link gücü hizmette, içerik blogdaydı.
- Yeni: 7 ticari hizmetin primary mirror blog’u üretilmiyor → 301 hizmet sayfasına.
- Özgün blog’lara (all-on-4, bonding-vs-veneers, hollywood-smile, …) dokunulmadı.

**301 listesi (20 URL)**
- TR 6, EN 7, DE 7 (TR’de konservatif için mirror yok). FR/AR/RU blog yok.

**Doğrulama**
- Build 320 sayfa, hatasız.
- DE 7 hizmet kelime: 902/746/736/673/680/661/608 — main ile birebir (Δ0).
- <300 kelime: 39/90 (önceki ters çözümde 50; kalan çoğunluk AR/RU şablon).
- DE core benzerlik ≥%70: 1/105 (önce 105/105). DE7 kendi arası: 0/21.
- Mirror blog dist’te yok, sitemap’te yok, kırık iç link 0, 301 zinciri 0.
- Do-not-touch blog’lar duruyor.

**Kalan risk**
- Primary mirror olan ama 7’nin dışında kalan generated blog’lar (pedodonti, endodonti, oral-implantoloji vb.) hâlâ hizmetle %100 örtüşebilir — sonraki tur.


### İş kalemi — PR #32 merge + madde 10 turkey teeth genişletme

**Durum:** bitti (PR açılacak)  
**Süre:** ~40 dk  
**Branch:** `seo/turkey-teeth-expand`

**Ne yaptım**
- PR #32 `main`'e merge edildi (Enes onayı).
- GEO şablonuna opsiyonel `sections[]` + `metaDescription` eklendi (`geoPackPage`).
- Lint body/similarity GEO `sections` metnini de sayıyor.
- EN pack `turkey-teeth-what-they-are-and-how-to-avoid-problems` ~500→~2400 kelime; ses: 2. şahıs, answer-first, dürüst klinik modeli; `updatedAt: 2026-09-10`.
- `reviewer` boş bırakıldı — hekim onayı insan işi.

**Doğrulama**
- Build 320 sayfa. Article prose ~2419 kelime. Meta 128 karakter.
- Pack için lint bulgusu yok (site genelinde eski RED’ler duruyor).

**Sonraki**
- Madde 11 türev URL’ler — #10 indexlenmeden açma.
- Kırmızı kuyruk: hollywoodlywood, oral-implantoloji, DE homepage title.


### İş kalemi — Kırmızı kuyruk 4+5+7 (Enes onayı)

**Durum:** bitti  
**Branch:** `seo/red-queue-approved`

**Ne yaptım**
- #4: `hollywoodlywood` → `hollywood` (EN/DE GEO, EN/TR blog); 301’ler; hreflang güncel; GEO smile-design TR → `gulush-tasarimi-lamine-veneer-nedir`.
- #5: `oral-implantoloji` service kaldırıldı; All-on-4 kartı + calc + blog service + packs link → `implantoloji-implant-tedavisi`; 6 dil 301 + legacy `/oral-implantoloji/` + `dis-hekimi-istanbul`.
- #7: DE title `Zahnarzt Istanbul — …`; DE-only metaDescription; H1/lead aynı.

**Doğrulama**
- Build 314 sayfa (−6 oral dil). Typo URL dist’te yok. Oral hizmet dist’te yok. Dist iç link oral=0.
- DE title/meta “Zahnarzt Istanbul”; H1 hâlâ “Ihr Traum-lächeln…”.

