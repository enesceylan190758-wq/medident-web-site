# MediDent İstanbul — Yayın Rehberi

## Hızlı önizleme (domain sonra)

Turhost FTP buradan yüklenemediği için site **`gh-pages`** dalına yayınlandı.

### 1) GitHub Pages’i aç (tek seferlik — sizin tıklamanız lazım)

1. Aç: https://github.com/enesceylan190758-wq/medident-web-site/settings/pages  
2. **Build and deployment → Source**: Deploy from a branch  
3. Branch: **`gh-pages`** / folder: **`/` (root)** → **Save**

Birkaç dakika sonra site:

**https://enesceylan190758-wq.github.io/medident-web-site/**

Yeniden yayınlamak için:

```bash
npm run deploy:pages
```

### Domain sonra

1. Aynı Pages ekranında **Custom domain** → `medidentistanbul.com`  
2. DNS’i GitHub’ın verdiği A/CNAME kayıtlarına yönlendir  
3. Üretim (kök path) için: `npm run build` → Turhost’a `dist/` veya `medident-dist.zip` yükle

---

## Turhost (üretim domain)

Bu rehber, `dist/` klasöründeki yeni statik siteyi **medidentistanbul.com** adresine alır ve eski WordPress sitesini güvenli şekilde yedekler.

## Ön koşul

Yerelde site üretilmiş olmalı:

```bash
npm install
npm run build
```

Çıktı: `dist/` (yaklaşık 110 sayfa, TR + EN + DE, sitemap, robots, .htaccess).

---

## Adım 1 — Eski WordPress’i yedekle (veri kaybı olmasın)

Turhost panel: https://panel.turhost.com/panel/login

### 1a) Dosya yedeği (cPanel File Manager veya FTP)

1. cPanel → **Dosya Yöneticisi** (File Manager)
2. `public_html` klasörüne gir
3. Tüm WordPress dosyalarını seç → **Sıkıştır (Compress)** → `wordpress-yedek-2026-07-23.zip`
4. Zip’i bilgisayarına indir **veya** `public_html` içinde `wordpress-eski/` adlı klasöre taşı:

```
public_html/
  wordpress-eski/     ← eski WP buraya (wp-admin, wp-content, wp-includes, index.php vb.)
  (yeni site dosyaları köke gelecek)
```

### 1b) Veritabanı yedeği (önerilir)

1. cPanel → **phpMyAdmin**
2. WordPress veritabanını seç → **Dışa Aktar (Export)** → SQL indir
3. İstersen cPanel → **Yedekler (Backups)** ile tam yedek al

> Eski siteyi silme; önce zip + DB yedeği al.

---

## Adım 2 — Yeni siteyi yükle

### Yöntem A — File Manager (en kolay)

1. `public_html` içinde **eski WordPress dosyalarını** `wordpress-eski/` klasörüne taşı (veya silme, taşı)
2. Bilgisayarda `dist/` içindeki **tüm dosyaları** seç (assets, blog, hizmetler, index.html, .htaccess, sitemap.xml, robots.txt, en/, de/ …)
3. Zip’le → Turhost File Manager’da `public_html` köküne yükle → **Extract (Çıkart)**

Sonuç kök yapısı:

```
public_html/
  index.html          ← yeni anasayfa
  .htaccess           ← SEO redirect + HTTPS
  sitemap.xml
  robots.txt
  assets/
  hizmetler/
  blog/
  en/
  de/
  wordpress-eski/     ← eski WP (isteğe bağlı, erişimi kapatılabilir)
```

### Yöntem B — FTP (FileZilla)

Turhost panel → **FTP Hesapları** → bilgileri al:

| Alan | Değer |
|------|--------|
| Sunucu | genelde `ftp.medidentistanbul.com` veya panelde yazan host |
| Kullanıcı | cPanel kullanıcı adın |
| Port | 21 (FTPS varsa 990) |
| Hedef | `/public_html/` |

1. Eski WP’yi `public_html/wordpress-eski/` altına taşı
2. `dist/` **içeriğini** (klasörün kendisini değil) `public_html/` köküne yükle

### Yöntem C — Hazır zip (repo script)

```bash
npm run package
```

`medident-dist.zip` oluşur → File Manager’da `public_html`’e yükle → Extract.

---

## Adım 3 — Eski WordPress’i pasif et

Yeni site kökte `index.html` ile açıldığında WordPress otomatik devre dışı kalır (Apache önce `index.html`’i sunar).

Ek güvenlik:

1. `wordpress-eski/` klasörüne `.htaccess` ekle:

```apache
# Eski WordPress — dış erişim kapalı
Require all denied
```

2. cPanel → **Alt Alan Adları / Addon Domains** — gereksiz WP alt dizinlerini kaldırma
3. İleride WP’ye hiç ihtiyaç yoksa: yedek aldıktan sonra `wordpress-eski/` silinebilir (DB yedeği şart)

---

## Adım 4 — DNS / SSL kontrol

1. Domain zaten Turhost’taysa ekstra DNS gerekmez
2. cPanel → **SSL/TLS** → Let’s Encrypt aktif mi kontrol et
3. Tarayıcıda test:
   - https://medidentistanbul.com/
   - https://medidentistanbul.com/hizmetler/implantoloji-implant-tedavisi/
   - https://medidentistanbul.com/en/
   - https://medidentistanbul.com/sitemap.xml

---

## Adım 5 — SEO geçişi (otomatik + manuel)

### Otomatik (dist/.htaccess)

29 adet **301 redirect** eski WordPress URL’lerini yeni yapıya yönlendirir:

| Eski | Yeni |
|------|------|
| `/oral-implantoloji/` | `/hizmetler/oral-implantoloji/` |
| `/dr-faruk-ogutlu/` | `/doktorlar/dr-faruk-ogutlu/` |
| `/musteri-yorumlari/` | `/yorumlar/` |
| `/foto-galeri/` | `/galeri/` |
| `/ss/` | `/sss/` |
| `/uykuda-dis-tedavisi/` | `/hizmetler/genel-anestezi-ve-sedasyon/` |

Tam liste: `dist/.htaccess` dosyasında.

### Manuel (Google Search Console)

1. https://search.google.com/search-console — mülk zaten doğrulanmış (meta tag yeni sitede taşındı)
2. **Site Haritaları** → `https://medidentistanbul.com/sitemap.xml` gönder
3. Birkaç gün içinde eski URL’ler yeni sayfalara geçer

### Takip kodları (yeni sitede hazır)

- GTM: `GTM-NTDLLHF`
- Meta Pixel: `3052551521644159`
- GSC doğrulama meta tag

GA4 kimliği gelince `src/data/site.mjs` → `tracking.ga4` doldur → `npm run build` → tekrar yükle.

---

## Adım 6 — Estesof form bağlantısı

Estesof API/embed kodu gelince:

1. `src/data/site.mjs` içinde:

```js
estesof: {
  endpoint: "https://...",  // Estesof endpoint
  method: "POST",
},
```

2. `npm run build` → `dist/` tekrar yükle

Endpoint boşken formlar **WhatsApp’a yönlendirilir** (çalışır durumda).

---

## Sorun giderme

| Sorun | Çözüm |
|-------|--------|
| Anasayfa hâlâ eski WP | `public_html/index.php` silinmiş/taşınmış mı? Kökte `index.html` olmalı |
| CSS/JS yüklenmiyor | `assets/` klasörü kökte mi? Yollar `/assets/...` |
| 404 hizmet sayfaları | Klasör yapısı: `hizmetler/slug/index.html` |
| Redirect döngüsü | `.htaccess`’te HTTPS/www kuralları — Turhost destek |
| EN/DE açılmıyor | `public_html/en/` ve `public_html/de/` yüklendi mi |

---

## Güncelleme (içerik değişince)

```bash
npm run build
# dist/ içeriğini tekrar public_html'e yükle (üzerine yaz)
```

Eski WordPress’e geri dönmek gerekirse: `wordpress-eski/` içeriğini tekrar köke taşı (yedekten).
