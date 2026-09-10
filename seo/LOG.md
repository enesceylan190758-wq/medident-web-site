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
