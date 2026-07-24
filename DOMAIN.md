# Domain / HTTPS notları

## Şu an (Turhost canlı)

Apex (`medidentistanbul.com`) hâlâ Turhost IP’sinde (`94.199.205.197`) ve Let’s Encrypt ile **HTTPS çalışıyor**.

Eksik görseller için `public_html/.htaccess` içinde CDN yedek kuralı var:
yerelde dosya yoksa → `cdn.jsdelivr.net` (`gh-pages`).

### “Güvenli değil” uyarısı (www)

`www` CNAME → GitHub iken GitHub henüz domain sertifikası veremiyor (`*.github.io` sertifikası).
Tarayıcı **www** için kilit uyarısı gösterir.

**Geçici çözüm (önerilen, apex Turhost’tayken):** Zone Editor’da `www` kaydını GitHub CNAME’den çıkarıp Turhost’a alın:

| Tip | İsim | Değer |
|-----|------|--------|
| A | www | 94.199.205.197 |

Sonra adresi şöyle açın: **https://medidentistanbul.com/** (www’siz).

## GitHub Pages’e tam geçiş (isteğe bağlı)

Apex A kayıtları gerçekten şu IP’lere dönünce GitHub HTTPS açılır:

| Tip | İsim | Değer |
|-----|------|--------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | enesceylan190758-wq.github.io |

`dig medidentistanbul.com A` çıktısı Turhost IP’si değil, yukarıdaki GitHub IP’leri olmalı.
Pages → Custom domain → **Check again** → Enforce HTTPS.

```bash
npm run deploy:domain
```

Site: **https://medidentistanbul.com/**
