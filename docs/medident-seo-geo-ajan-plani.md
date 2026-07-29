# MediDent İstanbul — SEO/GEO Ön Araştırma & Ajan Operasyon Planı
*Hazırlanma tarihi: 29 Temmuz 2026*

---

## 0) Özet

Cursor'a verdiğin "3 ajan + yönetici" mantığı **yön olarak doğru** — 2026'da ajans seviyesindeki sağlık turizmi ekipleri gerçekten böyle çalışıyor. Ama üç kritik açık var, ve biri **şu anda sitende zaten gerçekleşmiş durumda**. Aşağıda önce kanıtı, sonra pazar araştırmasını, sonra düzeltilmiş mimariyi bulacaksın.

---

## 1) Sitende bulduğum kritik sorun (kanıt)

`medidentistanbul.com/geo/` sayfasını inceledim. Burada n8n ile otomatik üretilmiş ~24 adet "X nedir" sayfası var — GEO mantığı doğru ama üretim kalitesiz. Birden fazla sayfa **birebir aynı şablon cümleyle** başlıyor:

- "Zirkonyum kaplama nedir" → "...diş hekimliğinde tanıya bağlı planlanan bir tedavi/uygulamadır. Endikasyon, görüntüleme ve ağız içi muayene ile belirlenir..."
- "Hollywood Smile nedir" → **aynı cümle, kelimesi kelimesine**
- "Porselen lamina nedir" → **aynı cümle, kelimesi kelimesine**
- "Diş hekimi korkusu nasıl aşılır" → "...genellikle altta yatan diş, diş eti veya alışkanlık kaynaklıdır..." (bu cümle diş korkusuyla **alakasız** — şablon yanlış konuya yapıştırılmış)
- "Ağız kokusu neden olur" ve "Diş eti kanaması ne anlama gelir" → yine aynı şablon

**Neden önemli:** Bu, tam olarak "ajanlar gitsin, içerik üretsin, kontrolsüz yayınlansın" senaryosunun sonucu. İki ayrı zarar veriyor:
1. **Google tarafında:** Tekrarlanan/şablon metin "ince içerik" (thin content) sinyali verir; toplu düşük kaliteli üretim tüm alan adının güvenilirliğini düşürebilir.
2. **GEO tarafında:** Yapay zeka motorları soruyu gerçekten cevaplamayan, başka sayfayla neredeyse birebir aynı metni **alıntılamaz** — yani bu sayfalar hem Google'da hem AI cevaplarında görünmüyor, tam tersine risk taşıyor.

**Acil eylem:** Bu 24 sayfanın her biri, o spesifik soruya özel, en az 150-200 kelimelik, farklı cevaplarla yeniden yazılmalı. Miktar değil, her sayfanın gerçekten kendine özgü olması önemli.

---

## 2) Cursor'daki "3 ajan" planının 3 somut açığı

1. **Halüsinasyon riski** — Cursor'daki bir kod ajanı canlı arama/SERP verisine bağlı değilse, "Almanya'dan hangi kelime yazılıyor" sorusuna gerçek veri yerine akla yatkın ama uydurma bir cevap üretir. Bunu ancak gerçek bir veri kaynağı çözer: Ahrefs/Semrush/DataForSEO/SerpAPI gibi bir API, Google Search Console'un kendi verisi, ya da web araması yapabilen bir model (ben, Perplexity vb.).
2. **"Kopyalayıp gelsinler"** — Rakip içeriğini kopyalamak hem telif riski hem Google'ın tekrar-içerik cezası riski taşır; kopya metin ayrıca AI motorları tarafından da alıntılanmaz. Doğrusu: rakibin **kalıbını** (hangi soruyu, hangi sırayla, hangi kanıtla cevapladığını) çıkarıp, aynı boşluğu **daha iyi orijinal içerikle** doldurmak.
3. **"Yönetici ajan" tanımsız** — Hangi kritere göre onaylayacak belirtilmemiş. Aşağıda (§6) bunu somutlaştırdım: tıbbi doğruluk, yasal uygunluk, tekrar-içerik kontrolü, schema/format kontrolü.

---

## 3) Pazar araştırması — gerçek bulgular

### 3.1 Almanya

Baskın kalıp: **"[tedavi] + Türkei + Kosten/Preis"** → "Zahnimplantate Türkei Kosten", "Zahnersatz Türkei", "Veneers Türkei", "Zirkonkronen Türkei". İçeriklerin merkezinde neredeyse hep Almanya-Türkiye fiyat tablosu var. Güçlü rakipler: Qunomedical (aracı/marketplace modeli, çok dilli), Heva Clinic, Adalya Dental Clinic, 2te-Zahnarztmeinung (karşılaştırma portalı — ikinci görüş konsepti).

### 3.2 İngiltere (UK)

Baskın kalıp: **"[treatment] Turkey cost"**, "veneers Turkey", "dental implants Turkey", "all-on-4 Turkey" + kültürel bir slang: **"Turkey teeth"**. Bu terim hem meraklı hem şüpheci aramaları aynı anda kapsıyor (fiyat + güvenlik + pişmanlık hikâyeleri bir arada).

**Net lider: Maltepe Dental Clinic.** Yaptıkları: Londra'da fiziksel danışma ofisi, ISO 9001/13485/10002 sertifikaları, PR bültenleriyle (PressAdvantage tarzı) düzenli haber dağıtımı, "Turkey teeth" konusunda seviye bazlı (prep-level skala) uzun ve dürüst bir güven makalesi. Diğer güçlü isimler: Soho Dent, Longevita, Smile Center Turkey, Clinichunter, Mednfly, Sevil Smile Studio.

### 3.3 İstanbul / Türkiye — karışık pazar

İstanbul'da iki farklı hasta profili aynı anda var: **yerel Türk hasta** (lokasyon + fiyat + hızlı randevu odaklı) ve **sağlık turizmi hastası** (implant, zirkonyum, Hollywood Smile, fiyat avantajı arayan yabancı). Bu iki profil farklı sayfa ve farklı anahtar kelime ister — aynı sayfada karıştırmak ikisini de zayıflatır. Yerel SEO'nun omurgası **"ilçe + hizmet"** kombinasyonu (ör. "Üsküdar implant fiyatı", "Acıbadem diş beyazlatma") — MediDent'in Üsküdar/Acıbadem'deki fiziksel adresi burada gerçek bir avantaj, şu an kullanılmıyor.

### 3.4 En değerli ortak tema: güven itirazı

Üç pazarda da tek bir soru diğerlerinin önüne geçiyor: **"Türkiye'de diş tedavisi güvenli mi / is it safe / ist es sicher"**. Kazanan formül ortak: (a) resmi belgeler (Sağlık Turizmi Yetki Belgeli kuruluşlar için gerekli yetkiler, ISO, JCI), (b) hekim diploma/kimlik şeffaflığı, (c) "kliniğe hangi soruları sormalı" checklist'i, (d) başarısız vaka hikâyelerini inkâr etmeden dürüstçe ele alma ("evet bazı klinikler kötü iş çıkarıyor, işte nasıl ayırt edilir"). Bu, MediDent'in zaten sahip olduğu materyalle (1.200+ Google yorumu, isimli hekimler, VIP süreç, garanti belgesi) doldurabilecek en büyük boşluk — ama şu an sitende bu konuya dair tek bir sayfa yok.

---

## 4) GEO (yapay zekada görünürlük) — 2026'da gerçekten işe yarayanlar

- **Schema işaretleme** (FAQPage, MedicalOrganization/Dentist, Review/AggregateRating) — şeması olan sitelerin AI motorları tarafından alıntılanma olasılığı belirgin şekilde daha yüksek.
- **Cevabı ilk cümlede ver, sonra detaylandır** — RAG sistemleri sayfayı değil, paragraf/parça (chunk) bazında değerlendiriyor.
- **İsimli, diplomalı hekim yazarlığı** (E-E-A-T) — jenerik/imzasız metinden çok daha güvenilir sayılıyor. MediDent'in doktor sayfaları zaten var, ama blog/GEO içerikleri bir hekime imzalanmamış.
- **Yorumlar hem SEO hem GEO'yu besliyor** — AI motorları yorumlardaki dili doğrudan cevaba çekiyor. 1.200+ Google yorumun var ama sitede sadece 4 örnek gösteriliyor; tedavi bazlı, tematik olarak çok daha fazlası yapılandırılmalı (ör. "implant hastaları ne diyor", "veneer hastaları ne diyor").
- **Üçüncü taraf bahisler** (basın bültenleri, dizin siteleri, forumlar) AI motorlarının "bu marka gerçek mi" sinyali. Maltepe'nin PR bülteni stratejisi tam bunun için.
- **Tazelik önemli** — birkaç aydan eski sayfalar AI cevaplarından düşüyor; çeyreklik güncelleme döngüsü gerekiyor.

---

## 5) Yasal uyarı — bir avukata sorulması gereken nokta

*(Ben avukat değilim, bu bir hukuki tavsiye değil — sadece dikkatini çekmek istediğim bir bulgu.)*

Kasım 2025'te yürürlüğe giren **"Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik"** iki kitleyi net ayırıyor:

- **Türkçe içerik** → yurt içi kullanıcıya yönelik sayılıyor → hasta yorumu, öncesi-sonrası görsel, garanti/sonuç vaadiyle reklam yasak.
- **Yurt dışına yönelik** (yabancı dilde, Sağlık Turizmi Yetki Belgeli kuruluşlar için) → yazılı hasta onamıyla öncesi-sonrası kullanılabilir, ama garanti/sonuç vaadi ifadeleri yine yasak kategoride.

`medidentistanbul.com` kök alan adının (TR sürüm) hem "50+ ülkeden hasta" sağlık turizmi çerçevesini hem yabancı hasta yorumlarını hem de "garanti belgesi" ifadesini bir arada taşıdığını gördüm. İçerik üretimine hız kesmeden başlamadan önce bir sağlık hukuku danışmanına şunu sormanı öneririm: TR kök alan adı mı, yoksa yalnızca `/en/`, `/de/` gibi alt yollar mı sağlık turizmi çerçevesini taşımalı. Bu netleşirse ajanların üreteceği içerik baştan riske girmez.

---

## 6) Düzeltilmiş ajan mimarisi

Sohbette gösterdiğim 5 aşamalı hat şöyle işliyor:

| # | Aşama | Görevi | Kritik kural |
|---|---|---|---|
| 1 | **Araştırma katmanı** | Gerçek arama hacmi, PAA soruları, rakip içerik boşluğu (market bazlı: DE / UK / TR) | Gerçek veri kaynağı olmadan **çalışmaz** — bu ajan asla kendi başına "tahmin" üretmemeli |
| 2 | **Yönetici ajan (director)** | Araştırmayı content brief'e çevirir; hangi sayfa, hangi soru, hangi kanıt, hangi hekim imzası | Onay kriterleri yazılı olmalı (bkz. §7 prompt) |
| 3 | **İçerik ajanları** | Brief'ten orijinal metin üretir | Kopyalama yok; her sayfa kendine özgü, şablon tekrarı yasak |
| 4 | **Uyum & kalite kontrolü** | Yasal (yönetmelik), tıbbi doğruluk, tekrar-içerik taraması, schema/format kontrolü | Yayından **önce** son kapı — otomatik yayına geçiş yok |
| 5 | **Yayınla & izle** | GSC/GA4 takibi + aylık "ChatGPT/Perplexity'ye soru sor, çıkıyor muyum" testi | Sonuçlar aşama 1'e geri besleniyor (aylık döngü) |

---

## 7) Cursor'a yapıştırılabilir — Yönetici Ajan (Director) master promptu

```
Sen MediDent İstanbul için SEO/GEO içerik operasyonunun yönetici (director) ajanısın.
Görevin içerik üretmek değil, üretilen her parçayı yayına çıkmadan önce denetlemek.

GİRDİ: Bir araştırma ajanından gelen content brief + bir içerik ajanından gelen taslak metin.

REDDET ve düzelt iste, eğer:
1. Taslak, sitedeki başka bir sayfayla (özellikle /geo/ altındaki sayfalarla) %30'dan fazla
   cümle/kalıp benzerliği taşıyorsa.
2. Taslak, hedef sorunun cevabını ilk 2 cümlede vermiyorsa (GEO için parça-bazlı okunabilirlik şart).
3. Taslak hasta yorumu, öncesi-sonrası görsel veya "garanti/kesin sonuç" ifadesi içeriyorsa VE
   hangi dil/pazar için yazıldığı (TR yurt içi mi, yurt dışı hedefli mi) net değilse.
4. Taslakta tıbbi bir iddia, kaynak veya hekim onayı olmadan yazılmışsa.
5. Taslak rakip bir siteden görünür şekilde parafraze edilmiş (yapı, örnek, sıralama birebir kopya).

ONAYLA, eğer:
- Cevap ilk cümlede net, sonrası kanıt/detay.
- FAQ/Schema formatına uygun (soru = H2/H3, cevap = ilk paragraf).
- Hedef pazar (DE/UK/TR) ve dil doğru, o pazarın gerçek arama kalıbına uygun.
- Sitedeki diğer sayfalarla anlamlı şekilde farklı.

ÇIKTI: Onay / Red + gerekçe + (red ise) hangi maddenin düzeltilmesi gerektiği.
Kararını her zaman kısa bir gerekçe ile ver, sessizce onaylama veya reddetme.
```

---

## 8) Araştırmacı ajan promptu (örnek — DE pazarı için)

```
Görev: Almanya pazarı için "[tedavi] Türkei" temalı gerçek arama davranışını araştır.
Zorunlu: Yalnızca gerçek web arama/SERP verisine dayan, tahmin üretme.
Çıktı formatı:
- En çok aranan 10 kelime öbeği (Almanca)
- Bu kelimelerde şu an kim sıralanıyor (ilk 5 sonuç, marka adı + neden sıralandığı)
- Bu kelimeler etrafında sorulan 5 alt soru (People Also Ask / forum / Reddit)
- MediDent'in bu konuda şu an hangi sayfası var, hangisi eksik
```
(UK ve İstanbul/TR pazarları için aynı şablonu dil ve kelime kalıbını değiştirerek kopyala.)

---

## 9) Uygulama fazları

- **Faz 0 (bu hafta):** `/geo/` altındaki 24 şablon sayfayı gerçek, birbirinden farklı cevaplarla yeniden yaz. Bu, en hızlı ve en riskli açığı kapatıyor.
- **Faz 1:** Gerçek anahtar kelime + PAA haritasını market bazlı çıkar (DE / UK / TR ayrı ayrı) — gerçek arama aracı olan bir kaynakla (Search Console verisi, Ahrefs/Semrush ya da web araması yapabilen bir oturum).
- **Faz 2:** "Türkiye'de diş tedavisi güvenli mi" temalı, hekim imzalı, dürüst bir güven içerik serisi + FAQ schema (§3.4'teki boşluk).
- **Faz 3:** 1.200+ yorumu tedavi bazlı temalara ayır (implant, veneer, Hollywood Smile), sitede ve video testimonial olarak kullan (yasal onay şartına dikkat — §5).
- **Faz 4:** PR bülteni + dizin/forum varlığı (Maltepe modeli).
- **Faz 5:** Aylık ölçüm ve iterasyon — sabit döngü.

---

## 10) Takip metrikleri

- Google Search Console: market bazlı sorgu/tıklama/pozisyon.
- GA4: dil bazlı trafik ve form dönüşümü.
- Aylık manuel test: ChatGPT/Perplexity/Gemini'ye hedef pazarın dilinde "en iyi diş kliniği İstanbul / best dental clinic Istanbul / beste Zahnklinik Istanbul" sor, MediDent çıkıyor mu kontrol et.
- Yorum sayısı ve PR/backlink sayısı artışı.

