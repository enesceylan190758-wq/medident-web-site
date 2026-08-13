# MediDent İstanbul — 30 Günlük Organik Hasta Planı (SEO + GEO)

*Kapsam: yalnızca organik. Reklam / Meta Ads kapsam dışı.*
*Bağlam: `docs/medident-seo-geo-gap-notes.md` · Director kuralı: `.cursor/rules/medident-content-director.mdc`*

---

## 0. Repo denetiminden çıkan somut durum (2026-08-13)

| Bulgu | Kanıt | Etki |
|-------|-------|------|
| GEO pack dağılımı 67: tr 25 / en 23 / de 19 / **ar 0 / ru 0** | `src/content/geo/packs.json` | AR/RU sayfaları UI kabuğu; alıntılanacak içerik yok |
| Sitemap'teki 302 URL'nin **tamamı aynı `lastmod`** (build tarihi) | `dist/sitemap.xml` | Her deploy "302 sayfa değişti" der; tazelik sinyali değersizleşir |
| `waHref()` her yerde **parametresiz** çağrılıyor | `src/templates/{layout,home,pages}.mjs` | WhatsApp lead'i hangi sayfadan geldi — ölçülemiyor |
| GA4 yalnız pageview; dönüşüm event'i yok | `layout.mjs:53` | Organik lead sayısı GA4'te görünmüyor |
| TR anasayfa + `/yorumlar` içinde `AggregateRating` | `dist/index.html`, `dist/yorumlar/index.html` | TR tanıtım yönetmeliği riski |
| GEO sayfalarında hreflang yalnız tr/en/de | `dist/en/geo/.../index.html` | Doğru davranış; AR/RU native pack gelene kadar korunmalı |

---

## 1. Organik hasta niş pazardan gelir mi?

Evet — ama hacimden değil niyetten gelir: "Zahnimplantate Türkei Kosten", "dental implants Turkey cost", "Üsküdar implant" gibi long-tail sorgular düşük aramalı fakat karar anına yakındır ve answer-first GEO sayfaları hem klasik sonuçta hem AI özetlerinde alıntılanmaya uygundur. Bugünkü engel içerik miktarı değil, lead atfının olmaması: hangi sayfanın WhatsApp getirdiği ölçülemediği için hangi içeriğin çalıştığı bilinmiyor.

---

## 2. Önümüzdeki 30 gün (hafta hafta, sadece SEO/GEO)

### Hafta 1 — Ölçüm ve teknik temel
1. `waHref()`'e kaynak taşıyan prefill metni ekle: dil + sayfa yolu (ör. `DE · /de/geo/zahnimplantate-tuerkei-kosten`).
2. GTM'de tüm `wa.me` tıklamaları için `whatsapp_click` event → GA4; parametreler `page_path`, `lang`, `page_type` (geo/blog/service).
3. GA4'te `whatsapp_click` ve form gönderimini **key event** olarak işaretle; "Landing page × dil × key event" keşif raporunu kur.
4. Sitemap `lastmod`'unu packs/blog JSON'daki gerçek `updatedAt` alanına bağla (şu an hepsi build tarihi).
5. TR locale'den `AggregateRating`/`Review` schema'sını ve yorum bloklarını kaldır; EN/DE'de onamlı olanları bırak.
6. GSC'de sitemap'i yeniden gönder; `/de/geo/` ve `/en/geo/` için "indexed / crawled-not-indexed" envanterini gap-notes'a yaz.

### Hafta 2 — DE (P0, en yüksek getiri)
1. **DE ticari:** "Zahnimplantate Türkei Kosten" — fiyatı belirleyen değişkenler, pakete dahil olan/olmayan, garanti vaadi yerine yazılı süreç çerçevesi.
2. **DE P0 gap:** "Nachsorge nach Zahnbehandlung in der Türkei" — uzaktan takip, Almanya'da tamamlayıcı bakım, komplikasyon protokolü.
3. "Zirkonkronen Türkei" sayfasını cost + Nachsorge + "ist es sicher" üçlüsüne iç linkle bağlayarak DE hub'ı kapat.
4. Her DE GEO sayfasına isimli hekim + rol + inceleme tarihi (`content.mjs` hekimleriyle hizalı) ve `reviewedBy` schema alanı.
5. "Erfahrungen" niyetini yorum kullanmadan karşıla: "Was Patienten fragen — Ablauf, Risiken, Grenzen" (süreç kanıtı, sosyal kanıt değil).
6. `llms.txt` ve `/de/geo/` index'ini güncelle; yeni URL'leri GSC'de tek tek gönder.

### Hafta 3 — UK/EN ticari long-tail
1. **EN:** "Dental implants Turkey cost — what actually changes the price".
2. **EN:** "Veneers Turkey: porcelain vs composite, who is a candidate, what can go wrong" (mevcut Turkey teeth sayfasıyla karşılıklı link).
3. **EN:** "How many days do you need in Istanbul" — implant ve veneer takvimi; seyahat planlama niyeti karar anına en yakın olanıdır.
4. Mevcut EN güven sayfalarını (safe / accreditation / why cheaper) yeni ticari sayfalara bağla; her sayfada tek net sonraki adım: ücretsiz foto konsültasyon.
5. EN GEO'larda `MedicalWebPage` + `FAQPage` + `dateModified` alanlarını doldur; cevabı ilk cümlede tut.
6. Onamlı tedavi bazlı yorumları yalnızca EN/DE'de yayınla: tedavi tipi + tarih + kısaltılmış isim. TR'de yayınlama.

### Hafta 4 — TR yerel, AR/RU kararı, ölçüm döngüsü
1. **TR:** "Üsküdar implant" ve "Acıbadem zirkonyum" ilçe×hizmet sayfaları — ulaşım, muayene akışı, fiyatı belirleyen faktörler; yorum/öncesi-sonrası/garanti yok.
2. Google Business Profile ile NAP tutarlılığı; `Dentist`/`LocalBusiness` schema'da adres, çalışma saatleri, koordinat, `sameAs`.
3. AR/RU: makine çevirisi yerine 5 native pack (güvenlik, maliyet, süreç, takip bakımı, klinik konumu). Hazır olana kadar thin `/ar/` `/ru/` sayfalarını `noindex` yap.
4. 90+ gün eski packs'i gerçek içerik güncellemesiyle tazele (yeni FAQ veya madde) ve `updatedAt` yaz — yalnız tarih değiştirme yasak.
5. Aylık AI alıntı testi: ChatGPT / Perplexity / Gemini'de 15 hedef soru (DE 5, EN 5, TR 5); alıntılanan domainleri tablo olarak gap-notes'a işle.
6. GSC son 28 günde ortalama pozisyonu 8–20 olan sorguları çıkar; bunları yeni sayfa açmadan mevcut sayfaya H2/FAQ olarak ekle.

---

## 3. En çok lead getirecek 5 sayfa (öncelik sırası)

| # | Sayfa / konu | Dil | Neden |
|---|--------------|-----|-------|
| 1 | Zahnimplantate Türkei **Kosten** — fiyatı ne belirler | DE | En yüksek bilet, en yüksek niyet; DE pazarında karar sorusu fiyat şeffaflığı |
| 2 | **Nachsorge** nach Zahnbehandlung in der Türkei | DE | P0 gap; DE hastasının 1 numaralı itirazı "ya sonra sorun çıkarsa" |
| 3 | Dental implants **Turkey cost** — what changes the price | EN/UK | Mevcut güven sayfaları var, ticari long-tail yok; dönüşüm kapısı |
| 4 | **Veneers Turkey** — porcelain vs composite, aday kim, ne ters gider | EN/UK | Turkey teeth trafiğini dürüst çerçeveyle lead'e çevirir |
| 5 | **Üsküdar implant / Acıbadem zirkonyum** | TR | Hacim düşük, dönüşüm en yüksek; harita + organik birlikte çalışır |

---

## 4. Ölçüm

**GSC (haftalık)**
- Sayfa filtresi `/de/geo/` + ülke Almanya: gösterim, tıklama, ortalama pozisyon.
- Pozisyon 8–20 sorgu listesi → mevcut sayfayı güncelleme kuyruğu.
- Sorgu segmenti: `Kosten|Preis|cost|price|fiyat` → ticari niyet CTR'ı.
- Sayfa indeksleme: gönderilen vs indekslenen; "Crawled — currently not indexed" GEO listesi.
- Yeni URL'nin ilk gösterim tarihi = indeksleme gecikmesi göstergesi.

**GA4 (haftalık)**
- Key event `whatsapp_click`: landing page × dil kırılımı — lead'i getiren sayfa budur.
- Organic search kanalında landing page başına dönüşüm oranı (oturum değil, key event).
- Kaynak/aracı raporunda `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com` — AI alıntısının tek doğrudan proxy'si.
- GEO sayfalarında etkileşimli oturum oranı ve ortalama etkileşim süresi: 180 kelimelik thin pack'leri yakalar.

---

## 5. Yapılmaması gereken 3 hata

1. **TR'de yorum, öncesi-sonrası ve puan yayınlamak.** Şu anda TR anasayfa ve `/yorumlar` içinde `AggregateRating` schema'sı var; yönetmelik açısından risklidir ve organik kazanç sağlamaz. Sosyal kanıtı yalnızca EN/DE'de, onamlı ve tedavi bazlı tut.
2. **Şablonla hacim üretmek ve sahte tazelik.** 67 pack zaten kalıp tekrarı riski taşıyor; her build'de tüm `lastmod`'ları güncellemek bunun üzerine sinyal kirliliği ekler. Yeni sayfa yerine mevcut sayfayı derinleştirmek çoğu hafta daha yüksek getirir.
3. **AR/RU'yu makine çevirisiyle toplu açmak.** Native pack olmadan dizine giren AR/RU sayfaları thin/duplicate sinyali verir ve EN sayfalarının otoritesini seyreltir. Önce 5 gerçek pack, o zamana kadar `noindex`.
