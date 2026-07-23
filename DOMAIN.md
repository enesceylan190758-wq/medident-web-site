# Domain’e alma (GitHub Pages) — 2 dakika

FTP yok. Site `gh-pages` dalında; domain DNS’i GitHub’a çevrilecek.

## 1) GitHub Pages aç (tek tık)

https://github.com/enesceylan190758-wq/medident-web-site/settings/pages

- Source: **Deploy from a branch**
- Branch: **gh-pages** / folder **/** → **Save**
- Custom domain (varsa): `medidentistanbul.com` → Save → HTTPS bekleyin

## 2) Turhost DNS

Eski A kaydını (94.199.205.197) sil / değiştir:

| Tip | İsim | Değer |
|-----|------|--------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | enesceylan190758-wq.github.io |

DNS 5–30 dk sürebilir.

## Yayın komutu (sonraki güncellemeler)

```bash
npm run deploy:domain
```

Site: **https://medidentistanbul.com/**
