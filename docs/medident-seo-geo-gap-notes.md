# MediDent İstanbul — SEO/GEO Gap Notes (canlı durum)

*Son güncelleme: 2026-09-18 · Domain: https://medidentistanbul.com*  
*Plan: `docs/medident-seo-geo-ajan-plani.md` · Rakip: `docs/medident-rakip-anahtar-kelime-arastirmasi.md`*

Bu dosya **canlı site envanteri + açık gap listesidir**. Cloud ajan her koşuda önce bunu ve `src/content/geo/packs.json` / `generated-blog.json` okur; tahminle gap uydurmaz. Smoke sonrası güncelle.

---

## Katman ayrımı (karıştırma)

| Katman | Ne | Nerede | Cursor Automation |
|--------|----|--------|-------------------|
| **A** Günlük yayın + yönetici maili | İskelet üretim / deploy / SMTP özeti | VPS cron veya GitHub Actions (`weekly-content.yml` / `daily-content.yml`) | **Yerine geçme.** Mail üretme. Çift SMTP yok. |
| **B** Strateji / GEO / SEO | Araştırma → Director → orijinal içerik → uyum → PR | Bu Cursor Automation | **Senin işin.** |

---

## Smoke (2026-07-31 örnek)

| URL | HTTP |
|-----|------|
| `/geo/` | 200 |
| `/en/geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/` | 200 |
| `/en/geo/is-dental-treatment-in-turkey-safe/` | 200 |
| `/geo/turkiyede-dis-tedavisi-guvenli-mi/` | 200 |
| `/de/geo/ist-zahnbehandlung-in-der-tuerkei-sicher/` | 200 |
| `/en/geo/dental-aftercare-when-you-return-home/` | 200 |
| `/ar/`, `/ru/` | 200 (UI var; native GEO pack ≈ 0) |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | 200 |

Kaynak sayıları (repo): GEO packs **64** (tr 22 / en 23 / de 19 / ar 0 / ru 0) · blog generated **52**.

---

## Tamamlanan (plan Faz 0–2 + gap paketleri)

- Thin TR GEO şablon rewrite (Faz 0) — packs `source: seo-geo-plan-phase`
- Trust serisi: TR/EN/DE “Türkiye’de diş tedavisi güvenli mi?”
- UK: Turkey teeth dürüst GEO
- Aftercare (EN): eve dönüş sonrası takip
- Yerel: Üsküdar/Acıbadem (TR + EN)
- Malzeme/marka: zirconia vs E-max / implant brands (EN + DE)
- Otorite: accreditation verify (EN)
- Fiyat şeffaflığı: why cheaper (EN + DE)

---

## Açık gap’ler (öncelik sırası)

### P0 — pazar/dil boşlukları
1. **DE Nachsorge / Garantie-Rahmen** — UK aftercare var; DE eşdeğer “Zahnbehandlung Türkei Nachsorge” yok (garanti vaadi yasak; süreç/çerçeve anlat).
2. **UK veneers Turkey / implants Turkey cost** — güven sayfaları var; ticari long-tail rehber zayıf.
3. **AR / RU native GEO** — dil UI açık, packs.json’da ar/ru ≈ 0. Fallback EN kabul; native tercih.

### P1 — yerel TR SEO
4. İlçe + hizmet long-tail (`Üsküdar implant`, `Acıbadem zirkonyum`) — tek klinik rehberi var; hizmet×semt derinliği eksik.
5. TR’de hasta yorumu / öncesi-sonrası / garanti reklamı **yok** (yönetmelik).

### P2 — GEO/AI alıntı kalitesi
6. Tedavi bazlı yorum paketleri (implant / veneer) — yasal gating: EN/DE/AR/RU’da onamlı; TR’de kullanma.
7. Hekim imzalı E-E-A-T — blog/GEO’da isimli hekim tutarsız; `content.mjs` doktorlarıyla hizala.
8. Çeyreklik tazelik: 90+ gün eski packs’e `updatedAt` + madde güncellemesi.

### P3 — üçüncü taraf / ölçüm
9. PR bülteni + dizin (Maltepe modeli) — site dışı; ajan sadece brief/liste üretir, spam yorum yazmaz.
10. Aylık ChatGPT/Perplexity/Gemini alıntı testi + GSC manuel indeks listesi.

---

## Rotasyon (haftalık pazar)

`DE → UK → TR → AR/MENA → RU → ölçüm`  
Her koşuda **tek pazar**, max **1 güçlü GEO + 1 blog** (üst sınır 2 sayfa). Memories’te son pazar + son slug’ları oku; tekrarı reddet.

---

## Hukuki gri alan (özet checklist)

- **TR içerik:** hasta yorumu, öncesi-sonrası, garanti/kesin sonuç, yanıltıcı fiyat → **RED**.
- **Yabancı dil (sağlık turizmi):** abartılı tıbbi iddia, kaynaksız istatistik, “garanti iyileşme”, rakip aşağılama → **RED**.
- Yazılı süreç/aftercare/garanti **belgesi çerçevesi** anlatılabilir; sonuç vaadi verilemez.
- Detay: plan §5 · Director kuralı: `.cursor/rules/medident-content-director.mdc`

---

## Ajan güncelleme protokolü

Her başarılı koşu sonunda bu dosyaya ekle:
- Tarih, pazar, üretilen slug’lar, canlı smoke kodları
- Kapanan / yeni açılan gap (1–3 satır)
- GSC’ye manuel gönderilecek URL listesi

---

## Koşu 2026-09-18 (günlük blog otomasyonu)

- Pazar: **DE** (EN 16 / DE 16 blog — eşitlikte rotasyon DE)
- Üretilen: `/de/blog/sinuslift-kosten-tuerkei-istanbul/` (fiyat/paket niyeti; somut EUR yok)
- Canlı smoke: yok (PR taslak, merge/deploy yok)
- Kapanan gap: DE “Sinuslift / Knochenaufbau Kosten” blog yoktu
- Açık kalan P0: DE Nachsorge çerçevesi; AR/RU native GEO
- GSC (merge sonrası): `https://medidentistanbul.com/de/blog/sinuslift-kosten-tuerkei-istanbul/`
- İnsan onayı: `reviewer` / `reviewedAt` boş — `npm run seo:approve -- --slugs sinuslift-kosten-tuerkei-istanbul --by "Dr. …"`



---

## VERI-DESTEKLI KONU BACKLOG'U (2026-09-18, GSC + Keyword Planner)

**Yeni calisma modeli:** Bundan sonra Cursor Automation konu SECMEZ. Asagidaki backlog tablosundan siradaki "bekliyor" satirini kullanir, durumu "uretildi" olarak isaretler, yeni satir eklemez. Backlog bittiginde otomasyon PR acmadan durur ve run-log'a "backlog bos, insan arastirmasi gerekiyor" yazar. Backlog'u sadece Enes + Claude gercek veriyle (GSC / Keyword Planner) gunceller.

### GSC bulgulari (son 3 ay, dogrulanmis hesap /u/1/)

Trafik agirlikli olarak yerli TR (yuzde 68 tiklama), 2. sira Almanya. UK "turkey teeth" varsayimi abartili: UK genelinde tum sorgular ortalama pozisyonu 32.4, tek bir sorguda iyi siralamak site-genel siralama degil.

Acil teknik-SEO bulgusu (icerik degil, ayri is): dr-alperen-demiral, dr-faruk-ogutlu, dt-levent-emir-guneysu sayfalari canli sitede 404 ama Google'da hala indeksli, son 3 ayda toplam yaklasik 26 tiklama sizdiriyor. 301 yonlendirme (doktorlar sayfasina) gerekiyor, bu blog otomasyonunun isi degil, ayri ticket.

En buyuk CTR firsati: turkey-teeth-what-they-are-and-how-to-avoid-problems (en/geo) tek basina toplam gosterimin yaklasik yuzde 41'ini aliyor (29.251 gosterim), ortalama pozisyon iyi (9.1) ama CTR sadece yuzde 0.12. Title/meta description yeniden yazilmali, ayri ticket.

### TR pazar keyword planner verisi (Turkiye, TR dili, Eylul 2025 - Agustos 2026)

zirkon kaplama fiyat: 10.000-100.000 aylik arama, en yuksek hacimli grup, oncelik bir numara.
dis implant fiyat: 1.000-10.000 aylik arama, oncelik iki numara.
hollywood smile fiyat: 100-1.000 aylik arama, orta hacim.
veneer dis fiyat: 10-100 aylik arama, dusuk; TR pazarinda veneer yerine lamina veya kaplama kelimesi araniyor.
all on 4 implant fiyat: olcumlenebilir veri yok; ingilizce odunc terim TR'de yerli aranmiyor, bu konu TR sayfasi yerine EN veya DE hedeflemeli.
implant istanbul fiyat ve dis beyazlatma istanbul: Planner bunlari ana terimlerle ayni kumeye birlestirdi, ayri hacim olcumu yok.

### DE pazar keyword planner verisi (Almanya, Almanca)

zahnaufhellung türkei: 10-100 aylik arama.
zahnimplantat kosten türkei, hollywood smile türkei preis, zirkonkronen kosten, veneers preise türkei, all on 4 türkei kosten: hepsi icin olcumlenebilir veri yok, Planner tarafindan kullanilamaz isaretlendi.

Capraz dogrulama: hesapta 14 Eylul 2026 tarihli, ayni terimleri iceren eski bir kayitli plan da butun metriklerde veri yok gosteriyor. Yani bu bir olcum hatasi degil: DE pazarinda tedavi artı kosten veya preis artı türkei seklindeki kisa anahtar kelime hacmi Google Ads'in olcebildigi esigin altinda. Ama GSC'de Almanya'dan gercek tiklama ve gosterim var, demek ki gercek aramalar Planner'in yakalayamadigi daha uzun ve dogal sorgular seklinde geliyor. Bu da GEO stratejisini dogruluyor: kisa kuyruk PPC hacmiyle degil, gercek GSC sorgu metniyle ve dogal soru kaliplariyla icerik uretilmeli.

### Oncelikli konu backlogu, otomasyon buradan sirayla secer

Backlog 1, durum bekliyor, TR: Zirkon kaplama fiyatlari 2026 nelere baglidir. Fiyat araligi degil, fiyati etkileyen faktorler anlatilacak: malzeme, dis sayisi, klinik degerlendirmesi. Gercek TL veya USD rakam uydurma yok.

Backlog 2, durum bekliyor, TR: Dis implant fiyati neden klinikten klinige degisir. Implant marka ve kemik grefti ihtiyaci gibi degiskenler anlatilacak, fiyat uydurma yok.

Backlog 3, durum uretildi, DE: Sinuslift Kosten Türkei, slug de/blog/sinuslift-kosten-tuerkei-istanbul, 2026-09-18 tarihinde PR 52 ile canliya alindi.

Backlog 4, durum bekliyor, DE: Zahnimplantat Türkei, surec, bakim ve fiyati gercekten ne etkiler. Fiyat rakami degil surec anlatilacak, DE Nachsorge P0 gap'ini de kapatir.

Backlog 5, durum bekliyor, TR: Lamina dis kaplama nedir, kime uygundur. Ingilizce veneer yerine yerli terim lamina veya kaplama ile basliklandirilacak, arama davranisiyla uyumlu.

Backlog 6, durum bekliyor, EN: All-on-4 in Turkey, the procedure explained. TR degil EN veya DE hedeflenecek, cunku TR'de olcumsuz.

Backlog 7, durum bekliyor, GEO blok TR artı EN artı DE: Turkiye'de dis tedavisi fiyatlari neden daha ucuz, seffaflik ve guven cercevesi. Garanti veya kesin sonuc iddiasi yok.

Yeni satir eklemeden once mutlaka kontrol edilecekler: GSC'de o ay gercek sorgu ve tiklama var mi, Keyword Planner'da TR icin hacim var mi, DE veya EN icin en azindan GSC sorgu kaniti var mi. Otomasyon bu listeyi degistiremez, sadece durum alanini gunceller.
