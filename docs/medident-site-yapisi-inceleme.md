# MediDent İstanbul — Site Yapısı İnceleme Raporu

_Salt-okunur inceleme — hiçbir kaynak dosya değiştirilmedi. Tarih: 2026-09-10._

**Not:** Site, `build.mjs` ile derlenen özel bir statik site üretecidir (Node.js, framework yok). `dist/` klasörü derleme çıktısıdır; gerçek "kaynak" `src/` altındadır.

---

## 1. `/de/` altındaki sayfalar (toplam 75)

| Kategori | Dosya yolu (dist) | URL slug |
|---|---|---|
| Ana sayfa | `dist/de/index.html` | `/de/` |
| Hizmetler indeksi | `dist/de/hizmetler/index.html` | `/de/hizmetler/` |
| Hizmet (×16) | `dist/de/hizmetler/{slug}/index.html` | `/de/hizmetler/agiz-dis-ve-cene-cerrahisi/`, `cene-eklemi-rahatsizliklari/`, `cene-ve-dis-cerrahisi/`, `dis-beyazlatma/`, `endodonti-kanal-tedavileri/`, `estetik-dis-hekimligi/`, `genel-anestezi-ve-sedasyon/`, `halitosis-agiz-kokusu/`, `implantoloji-implant-tedavisi/`, `konservatif-dis-tedavileri/`, `oral-implantoloji/`, `pedodonti-cocuk-dis-hekimligi/`, `periodontoloji-diseti-hastaliklari/`, `protezler/`, `seffaf-plaklar-invisalign/` |
| Doktorlar indeksi | `dist/de/doktorlar/index.html` | `/de/doktorlar/` |
| Doktor (×4) | `dist/de/doktorlar/{slug}/index.html` | `dr-ahmet-celik/`, `dr-asli-yilmaz/`, `dr-can-yildiz/`, `dr-elif-kara/` |
| Blog indeksi | `dist/de/blog/index.html` | `/de/blog/` |
| Blog yazısı (×22) | `dist/de/blog/{slug}/index.html` | `aesthetische-zahnmedizin`, `all-on-4-zahnimplantate-istanbul-kosten`, `bonding-vs-veneers-istanbul`, `digitales-laecheln-design-veneers-istanbul`, `hollywood-smile-tuerkei-paket`, `implantatbehandlung`, `invisalign-aligner-istanbul`, `kinderzahnheilkunde-istanbul`, `mund-kiefer-gesichtschirurgie`, `professionelle-zahnaufhellung-istanbul`, `sedierung-zahnbehandlung-istanbul`, `sofortimplantate-istanbul-1-tag`, `taggleiche-behandlung`, `veneers-vs-zirkonkronen-istanbul`, `wurzelbehandlung-mikroskop-istanbul`, `zahnaufhellung`, `zahnentfernung-istanbul-schmerzarm`, `zahnfleischgesundheit-parodontologie-istanbul`, `zahnimplantat-erklaert-istanbul`, `zahnpflege-und-mundhygiene`, `zahnprothese`, `zahntourismus-istanbul-aus-deutschland`, `zirkonkronen-tuerkei-kosten-ablauf-2026` |
| GEO indeksi | `dist/de/geo/index.html` | `/de/geo/` |
| GEO paketi (×14) | `dist/de/geo/{slug}/index.html` | `digitales-laecheln-design-istanbul`, `hollywoodlywood-smile-paket-istanbul`, `ist-zahnbehandlung-in-der-tuerkei-sicher`, `kinderzahnheilkunde-istanbul`, `materialien-marken-zirkon-implantate-tuerkei`, `professionelle-zahnaufhellung`, `sedierung-zahnbehandlung-istanbul`, `sofortimplantate-istanbul`, `warum-ist-zahnbehandlung-in-der-tuerkei-guenstiger`, `was-ist-all-on-4`, `was-ist-ein-zahnimplantat`, `was-ist-zahn-bonding`, `was-sind-aligner`, `was-sind-porzellan-veneers`, `was-sind-zirkonkronen`, `wurzelbehandlung-mikroskop-istanbul`, `zahnentfernung-istanbul`, `zahnfleischgesundheit-istanbul`, `zahntourismus-istanbul-deutschland` |
| Statik | `dist/de/{gizlilik,hakkimizda,iletisim,kvkk,sss,yorumlar,galeri}/index.html` | aynı isimde |
| DE'ye özel landing | `dist/de/preise/index.html`, `dist/de/composite-bonding-tuerkei/index.html` | `/de/preise/`, `/de/composite-bonding-tuerkei/` |

## 2. `/en/` altındaki sayfalar (toplam 79)

| Kategori | Dosya yolu (dist) | URL slug |
|---|---|---|
| Ana sayfa | `dist/en/index.html` | `/en/` |
| Hizmetler indeksi + hizmet (×16) | `dist/en/hizmetler/{index,{slug}/index}.html` | **Dikkat:** hizmet slug'ları TR ile birebir aynı (`hizmetler/oral-implantoloji/` vb.) — İngilizceleştirilmemiş |
| Doktorlar indeksi + doktor (×4) | `dist/en/doktorlar/...` | TR ile aynı slug'lar |
| Blog indeksi + yazı (×23) | `dist/en/blog/{slug}/index.html` | `all-on-4-dental-implants-istanbul-cost`, `cosmetic-dentistry`, `dental-and-maxillofacial-surgery`, `dental-bonding-vs-veneers-istanbul`, `dental-care-and-hygiene`, `dental-implant-treatment`, `dental-implants-explained-istanbul`, `dental-tourism-istanbul-from-germany-uk`, `dentures`, `digital-smile-design-laminate-veneers-istanbul`, `gum-health-periodontology-istanbul`, `hollywoodlywood-smile-turkey-package`, `invisalign-clear-aligners-istanbul`, `microscopic-root-canal-istanbul`, `pediatric-dentistry-istanbul-family-travel`, `professional-teeth-whitening-istanbul`, `safe-tooth-extraction-istanbul`, `same-day-dental-implants-istanbul`, `same-day-dental-treatments`, `sedation-dentistry-istanbul-anxious-patients`, `teeth-whitening`, `veneers-vs-zirconia-crowns-istanbul`, `zirconia-crowns-turkey-cost-process-2026` |
| GEO indeksi + paket (×20) | `dist/en/geo/{slug}/index.html` | `dental-aftercare-when-you-return-home`, `dental-tourism-istanbul-germany-uk`, `digital-smile-design-istanbul`, `gum-health-periodontology-istanbul`, `hollywoodlywood-smile-package-istanbul`, `how-to-verify-dental-clinic-accreditation-turkey`, `is-dental-treatment-in-turkey-safe`, `pediatric-dentistry-istanbul`, `professional-teeth-whitening`, `root-canal-microscope-istanbul`, `same-day-implants-istanbul`, `sedation-dentistry-istanbul`, `tooth-extraction-istanbul`, `turkey-teeth-what-they-are-and-how-to-avoid-problems`, `uskudar-acibadem-dental-clinic`, `what-are-clear-aligners`, `what-are-porcelain-veneers`, `what-are-zirconia-crowns`, `what-is-a-dental-implant`, `what-is-all-on-4`, `what-is-dental-bonding`, `why-is-dental-treatment-cheaper-in-turkey`, `zirconia-vs-emax-implant-brands-turkey` |
| Statik | `dist/en/{gizlilik,hakkimizda,iletisim,kvkk,sss,yorumlar,galeri}/index.html` | aynı isimde ([DOĞRULA: `gizlilik`/`kvkk` gibi TR kelimeler EN sayfalarda URL olarak kalmış, kasıtlı mı?]) |
| EN'e özel landing | `dist/en/turkey-teeth-price/index.html`, `dist/en/composite-bonding-turkey/index.html` | |

> Kaynak: `build.mjs` — `services`/`doctors` listesi `src/data/content.mjs`, makaleler `src/content/articles.json` + `generated-blog.json`, GEO paketleri `src/content/geo/packs.json`'dan **otomatik üretiliyor**. Yani sayfa listesi kod değil, veri dosyalarıyla belirleniyor.

---

## 3. Şablon / layout dosyaları — title & meta description üretimi

- **Ana layout / `<head>`:** `src/templates/layout.mjs` — `head()` fonksiyonu (satır 29-102): `<title>`, `<meta name="description">`, canonical, OG/Twitter tag'leri, hreflang, JSON-LD hepsi burada birleştirilir.
- **Sayfa şablonları:** `src/templates/pages.mjs` (servis, doktor, blog, GEO, statik sayfalar) ve `src/templates/home.mjs` (ana sayfa + paylaşılan `contactSection`).
- Her sayfa fonksiyonu `{ body, title, description, image, jsonld }` döndürür (örn. `pages.mjs:119-123`); `title`/`description` genelde `src/data/content.mjs` veya `src/data/i18n.mjs` içindeki çok dilli metin nesnelerinden `L(obj, lang)` yardımcı fonksiyonuyla çekilir.
- `build.mjs`'deki `emit()` fonksiyonu bu döndürülen değeri `layout()`'a aktarıp `dist/.../index.html` olarak yazar.

## 4. hreflang etiketleri

- Üretim mantığı: `src/data/seo.mjs` → `resolveHreflangPaths(lang, pathNoLang)` (satır 243-309).
- Kapsanan diller: `tr, en, de, fr, ar, ru` (`src/data/site.mjs:48`), `langPrefix`: tr kök (`/`), diğerleri `/en`, `/de`, `/fr`, `/ar`, `/ru`.
- Statik sayfalar (hizmetler, doktorlar, ana sayfa, iletişim vb.) tüm diller için **aynı path**'i varsayar.
- Blog ve GEO sayfaları için **manuel eşleştirme tabloları** var: `blogTopicGroups` ve `geoTopicGroups` (`seo.mjs:15-236`) — her biri `{id, tr, en, de}` slug üçlüsü. Eşleşme yoksa (`null`) o dil hreflang'den düşer.
- ⚠️ Bu tablolar **elle bakımlı** — yeni blog/GEO sayfası eklenince slug'lar buraya elle girilmezse hreflang o sayfa için eksik kalır (sadece kendi diline döner, satır 291/305).
- Çıktı: `layout.mjs`'deki `head()` içinde `<link rel="alternate" hreflang="...">` + `x-default` olarak basılıyor; ayrıca `sitemap.xml`'e de `xhtml:link` olarak yazılıyor (`build.mjs:161-175`).

## 5. sitemap.xml — otomatik üretiliyor

- Elle yazılmıyor. `build.mjs` → `writeSitemap()` (`build.mjs:155-186`) her `build` komutunda `dist/sitemap.xml`'i sıfırdan üretir.
- Her sayfa `emit()` çağrıldığında `pages[]` dizisine eklenir, sitemap bu diziden türetilir; `sitemapPriority()`/`sitemapChangefreq()` (`seo.mjs:441-459`) path pattern'ine göre öncelik/sıklık atar.
- `robots.txt`, `llms.txt` ve `404.html` de aynı `build()` akışında otomatik üretiliyor (`build.mjs:188-207`, `295-344`).

## 6. 301 yönlendirme mekanizması

- **Tek mekanizma: `.htaccess`** (Apache/cPanel — Turhost barındırma). Elle değil, `build.mjs` → `writeHtaccess()` (`build.mjs:209-279`) tarafından otomatik üretiliyor.
  - Eski WordPress URL'lerinden yeni yapıya `services`/`doctors` listesinden döngüyle üretilen 301'ler (`build.mjs:211-215`).
  - Ayrıca elle eklenmiş sabit 301 satırları var (`/musteri-yorumlari/`, `/randevu/`, `/dis-hekimi-istanbul/` vb., `build.mjs:252-262`).
  - HTTPS zorlama, www kaldırma, "pretty URL" (`/path` → `/path/`) kuralları da burada.
  - Eksik görsel/sayfalar için `router.php` üzerinden CDN (jsDelivr/gh-pages) fallback var (`src/assets/php/router.php`).
- **`vercel.json`, `netlify.toml`, `_redirects`, nginx conf yok** — proje bunları kullanmıyor, tek barındırma hedefi Apache/cPanel gibi görünüyor.
- ⚠️ Yeni bir URL değişikliği yapılırsa, 301 kuralı **elle** `build.mjs`'nin `writeHtaccess()` fonksiyonuna eklenmeli — otomatik "eski slug → yeni slug" mekanizması yok, sadece "WordPress-öncesi → mevcut yapı" için var.

## 7. JSON-LD şema blokları

| Sayfa | @type | Kaynak |
|---|---|---|
| Tüm sayfalar (breadcrumb üreten her yerde) | `BreadcrumbList` | `layout.mjs:322-333` |
| Hakkımızda, İletişim, Yorumlar, Fiyat/Bonding landing | `Dentist` (org şeması, `@id`: `#organization`) | `layout.mjs:277-320` — `orgSchema()` |
| Hizmet detay sayfaları | `MedicalProcedure` (+ FAQ varsa `FAQPage`) | `pages.mjs:105-118` |
| Doktor sayfaları | `Physician` | `pages.mjs:192` civarı |
| Blog yazıları | `Article` (+ varsa `FAQPage`) | `pages.mjs:259-270` |
| SSS sayfası | `FAQPage` | `pages.mjs:518` |
| Fiyat/Bonding landing (DE/EN/FR) | `Dentist` + `FAQPage` + `BreadcrumbList` | `pages.mjs:397-462` |
| GEO paket sayfaları | `FAQPage` + `WebPage`(`isPartOf: WebSite`) + `BreadcrumbList` | `pages.mjs:616-627` |

## 8. Ortak bileşenler

Ayrı component dosyaları yok — hepsi fonksiyon olarak tanımlı:

- **Header / mobil menü / dil değiştirici:** `src/templates/layout.mjs` → `header()`, `navLinks()`, `langSwitch()` (satır 108-183)
- **Footer:** `src/templates/layout.mjs` → `footer()` (satır 185-236)
- **Yüzen WhatsApp/yukarı-çık butonu:** `src/templates/layout.mjs` → `floating()` (satır 238-242)
- **CTA + iletişim formu bloğu (tüm sayfalarda tekrar eden):** `src/templates/home.mjs:523` → `contactSection()`
- **Form gönderim mantığı (JS):** `src/assets/js/site.js` — `window.__MD_FORM__` config'ini okuyup Estesof endpoint'ine gönderiyor (satır ~271, ~304)
- **Şablon verisi (metin/slug/i18n):** `src/data/content.mjs` (hizmetler/doktorlar), `src/data/i18n.mjs` + `i18n-ar-ru.mjs` (çeviri sözlükleri), `src/data/site.mjs` (marka/iletişim/tracking sabitleri)

---

## Riskler — URL değişikliği yapılırsa nelerin kırılabileceği

1. **hreflang tabloları elle bakımlı** (`seo.mjs`): Bir blog/GEO slug'ı değiştirilirse `blogTopicGroups`/`geoTopicGroups`'taki karşılık güncellenmezse o dilin hreflang bağlantısı sessizce kopar — arama motoru yanlış/eksik dil eşleşmesi görür, hata vermez.
2. **301 zinciri elle güncellenmeli**: `writeHtaccess()`'te yeni slug için otomatik eski→yeni yönlendirme üretilmiyor; slug değişince eski URL'e giden trafik/backlink değeri 404'e düşer, mevcut `Redirect 301` satırlarına elle eklenmezse.
3. **Servis/doktor slug'ları TR/EN/DE arasında paylaşılıyor** (`resolveHreflangPaths`'te "sharedPrefixes" mantığı — `hizmetler/`, `doktorlar/` tüm dillerde aynı path bekliyor). Sadece bir dilde slug değiştirilirse hreflang eşleşmesi ve `langSwitch()`'teki dil değiştirici linkleri kırılır (satır `layout.mjs:119-136`).
4. **Sitemap otomatik ama "son build" anlık görüntüsü**: `build` her çalıştığında sitemap'i sıfırdan yazıyor; slug değişse bile eski URL sitemap'ten hemen düşer — ama arama motoru indeksinde eski URL kalmaya devam eder, 301 yoksa "soft 404" / kayıp trafik riski.
5. **JSON-LD içindeki `url` alanları** (`MedicalProcedure.url`, breadcrumb `item` URL'leri, `Dentist.url`) sayfa path'inden türetiliyor — slug değişince şema otomatik güncellenir ama **eski şemayı arama motorunun cache'lediği** dönemde tutarsızlık olabilir; ayrıca `orgSchema()`'daki `@id: site.domain + "/#organization"` sabit — bundan etkilenmez.
6. **`router.php` / jsDelivr CDN fallback** (`build.mjs:234-246`): Eksik dosyalar CDN'e (`gh-pages` branch) yönlendiriliyor — slug değişimi bu CDN kopyasıyla senkron değilse kırık görsel/sayfa riski.
7. **EN sayfalarda hizmet/doktor/legal slug'ları hâlâ Türkçe** (`hizmetler/`, `gizlilik/`, `kvkk/` vb.) — bu bir "hata" değil mevcut kasıtlı tasarım gibi duruyor, ama SEO planında "URL'leri İngilizceleştirelim" denirse bu, `sharedPrefixes` mantığını ve tüm dillerdeki iç linkleri (header/footer/breadcrumb/ilgili-hizmetler linkleri) etkileyecek geniş çaplı bir değişiklik olur — [DOĞRULA: bu kasıtlı bir SEO/marka kararı mı, yoksa çeviri eksikliği mi?]
8. **`llms.txt` içinde sabit kodlanmış (hardcoded) URL'ler var** (`build.mjs:313-320`) — `services`/`blog`/`geo` linkleri değişkenle üretiliyor ama örnek "Implants"/"Cosmetic" satırları slug'ı elle yazılmış (`oral-implantoloji`, `estetik-dis-hekimligi`); bu slug'lar değişirse elle güncellenmezse kırık link kalır.
9. **`.github/workflows/deploy.yml`** [DOĞRULA: incelemedim] — deploy akışı ayrıca kontrol edilmeli; `deploy:domain` script'i "tek yerden yapılır" diye kilitli görünüyor, slug değişikliği deploy sırasında cache/CDN ile çakışabilir.
