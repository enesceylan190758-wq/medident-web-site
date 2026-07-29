/**
 * Topic-specific GEO answers — each slug has unique direct_answer, bullets, FAQ.
 * Used by generate.mjs and rewrite-geo-tr.mjs. Director QC rejects template fallbacks.
 */

export const BANNED_PHRASES = [
  "diş hekimliğinde tanıya bağlı planlanan bir tedavi/uygulamadır",
  "genellikle altta yatan diş, diş eti veya alışkanlık kaynaklıdır",
  "Önce neden / endikasyon netleştirilir (muayene + görüntüleme).",
  "klinik Acıbadem'deki klinik implant",
];

const CLINIC = "MediDent İstanbul (Üsküdar Acıbadem)";

/** @type {Record<string, {direct_answer: string, bullets: string[], faq: {q:string,a:string}[], coverImage?: string, author?: string}>} */
export const GEO_ANSWERS_TR = {
  "dis-implant-nedir": {
    coverImage: "blog/blog-04-implant.jpg",
    author: "Dt. Levent Emir Güneysu",
    direct_answer:
      "Diş implantı, eksik diş kökünün yerine çene kemiğine yerleştirilen titanyum veya zirkonyum bir vidadır; üzerine sabit kron veya köprü protezi takılarak doğal dişe en yakın çözüm sağlanır.",
    bullets: [
      "3D tomografi ile kemik hacmi ve sinüs konumu ölçülür; greft ihtiyacı planlanır.",
      "Lokal anestezi veya sedasyon altında implant yerleştirilir; iyileşme 6–12 hafta sürebilir.",
      "Osseointegrasyon (kemik kaynaşması) sonrası dijital ölçü ile zirkonyum veya porselen kron takılır.",
      "İyi ağız hijyeni ve 6 aylık kontroller implant ömrünü belirler.",
    ],
    faq: [
      { q: "İmplant ağrılı mı?", a: "İşlem lokal anestezi ile konforlu yapılır; sonrasında 2–3 gün hafif hassasiyet normaldir." },
      { q: "Kimler implant yaptıramaz?", a: "Kontrolsüz diyabet, aktif kemoterapi veya yetersiz kemik (greftsiz) vakalarda önce alternatifler değerlendirilir." },
      { q: "İstanbul'da implant ne kadar sürer?", a: "Tek dişte genelde 2–3 randevu; All-on-4 protokolünde aynı gün geçici diş mümkün olabilir." },
      { q: "Üsküdar'da implant tedavisi var mı?", a: `${CLINIC} implant cerrahisi, dijital planlama ve protez üretimini aynı klinikte sunar.` },
    ],
  },
  "hollywood-smile-nedir": {
    coverImage: "blog/blog-06-gulush.jpg",
    author: "Dr. Faruk Oğutlu",
    direct_answer:
      "Hollywood Smile, dijital gülüş tasarımı (DSD) ile yüz oranlarına uygun renk, form ve diş eti hattının planlandığı kapsamlı estetik diş rehabilitasyonudur; genelde lamina veneer, zirkonyum veya bonding kombinasyonu kullanılır.",
    bullets: [
      "Fotoğraf ve intraoral tarama ile mock-up hazırlanır; hasta onayından sonra işleme geçilir.",
      "Minimal aşındırma ile porselen lamina veya tam kaplama zirkonyum seçenekleri vaka bazında belirlenir.",
      "Sağlık turizmi hastalarında tedavi 5–10 günlük planla yoğunlaştırılabilir.",
      "Geçici dişlerle estetik korunur; kalıcı veneer/kaplama laboratuvar aşamasında üretilir.",
    ],
    faq: [
      { q: "Hollywood Smile kaç dişi kapsar?", a: "Genelde gülüş hattındaki 8–10 üst ön diş; vakaya göre alt dişler de dahil edilir." },
      { q: "Doğal görünür mü?", a: "DSD ile ton ve translüsens seçimi yapılır; 'çok beyaz' sonuç istenmiyorsa shade birlikte belirlenir." },
      { q: "Turkey teeth ile farkı nedir?", a: "Etik planlama sağlıklı dişe gereksiz kron yerine lamina veya bonding önerir; agresif aşındırma yapılmaz." },
      { q: "Üsküdar'da Hollywood Smile yapılır mı?", a: `Evet. ${CLINIC} dijital gülüş tasarımı ve veneer/kaplama üretimini koordine eder.` },
    ],
  },
  "hollywoodlywood-smile-nedir": null,
  "zirkonyum-kaplama-nedir": {
    coverImage: "blog/blog-01-zirkonyum.jpg",
    author: "Dr. Faruk Oğutlu",
    direct_answer:
      "Zirkonyum kaplama, yüksek dayanımlı zirkonya seramikten üretilen, metal içermeyen tam diş kronudur; estetik ve fonksiyon için ön ve arka dişlerde güvenle kullanılır.",
    bullets: [
      "CAD/CAM ile dijital ölçüden birebir üretilir; diş eti uyumu ve renk stabilitesi yüksektir.",
      "Metal alerjisi olan hastalarda tercih edilir; MR çekiminde sorun çıkarmaz.",
      "Köprü protezlerde ve implant üstü kronlarda dayanım avantajı sağlar.",
      "Ömür genelde 10–15+ yıl; kırılma riski porselene göre daha düşüktür.",
    ],
    faq: [
      { q: "Zirkonyum mu porselen mi?", a: "Ön dişte translüsens için porselen-fused; arka diş ve köprüde monolitik zirkonyum sık tercih edilir." },
      { q: "Diş aşındırılır mı?", a: "Tam kaplama için evet, minimal miktarda; lamina kadar az değildir." },
      { q: "Almanya'ya göre neden Türkiye?", a: "Aynı malzeme ve CAD/CAM teknolojisi, daha düşük klinik maliyeti — muayene sonrası şeffaf plan sunulur." },
      { q: "Üsküdar'da zirkonyum kaplama", a: `${CLINIC} dijital ölçü ve yerel laboratuvar koordinasyonu ile 3–7 günde tamamlanabilir.` },
    ],
  },
  "porselen-lamina-nedir": {
    coverImage: "blog/blog-06-gulush.jpg",
    author: "Dr. Faruk Oğutlu",
    direct_answer:
      "Porselen lamina (veneer), ön diş yüzeyine yapıştırılan ince seramik kabuktur; renk, şekil ve küçük hizalanma sorunlarını minimum diş aşındırmasıyla düzeltir.",
    bullets: [
      "Genelde 0,3–0,7 mm aşındırma yeterlidir; bonding'e göre daha kalıcıdır.",
      "Leke tutmaz, doğal ışık geçirgenliği yüksektir.",
      "Kırık diş, aralık kapatma ve renk düzeltmede idealdir.",
      "Kompozit bonding'e göre laboratuvar aşaması gerektirir (2–3 randevu).",
    ],
    faq: [
      { q: "Lamina mı bonding mi?", a: "Tek seans ve düşük maliyet için bonding; uzun ömür ve renk stabilitesi için lamina." },
      { q: "Kaç yıl dayanır?", a: "İyi bakımla 10–15 yıl; gece plağı ve sert gıdadan kaçınma önerilir." },
      { q: "Tersine çevrilebilir mi?", a: "Minimal prep laminalarda sınırlı; aşındırma yapıldıysa geri dönüş zordur — planlama kritiktir." },
      { q: "İstanbul'da lamina süresi", a: "Dijital akışla 5–7 gün; geçici veneer ile estetik korunur." },
    ],
  },
  "all-on-4-nedir": {
    coverImage: "blog/blog-04-implant.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "All-on-4, tek çenede dört strategik açıyla yerleştirilen implant üzerine aynı gün sabit geçici protez takılan tam çene rehabilitasyon protokolüdür; dişsiz veya neredeyse dişsiz hastalarda uygulanır.",
    bullets: [
      "Ön bölgede düz, arka bölgede eğik implantlar kemik hacminden maksimum fayda sağlar.",
      "Uygun vakada cerrahi günü geçici sabit diş verilir; iyileşme sonrası kalıcı zirkonyum köprü yapılır.",
      "Greft ihtiyacını azaltabilir; ancak her hasta adayı değildir.",
      "All-on-6, ek implant ile daha yüksek çiğneme kuvveti gereken vakalarda tercih edilir.",
    ],
    faq: [
      { q: "All-on-4 ile All-on-6 farkı", a: "All-on-6'da iki ek implant daha fazla destek sağlar; kemik kalitesi düşükse tercih edilir." },
      { q: "Aynı gün diş mümkün mü?", a: "Primer stabilite sağlanırsa evet; aksi halde iyileşme sonrası protez planlanır." },
      { q: "Ne kadar sürer?", a: "Cerrahi + geçici protez 1 gün; kalıcı protez 3–6 ay sonra." },
      { q: "Üsküdar'da All-on-4", a: `${CLINIC} 3D planlama ve cerrahi ekibiyle tam çene vakalarını değerlendirir.` },
    ],
  },
  "dis-eksikligi-ne-yapilmali": {
    coverImage: "blog/blog-04-implant.jpg",
  author: "Dt. Levent Emir Güneysu",
    direct_answer:
      "Eksik diş için en uygun çözüm; komşu diş sağlığı, kemik hacmi, yaş ve bütçeye göre implant (tek diş veya köprü), sabit köprü protez veya çıkarılabilir protez arasından seçilir — tek doğru cevap muayene ile belirlenir.",
    bullets: [
      "Tek eksik dişte komşu dişler sağlamsa implant genelde en koruyucu seçenektir.",
      "Birden fazla eksikte implant destekli köprü veya All-on-4/6 değerlendirilir.",
      "Kemik yetersizse greft veya sinüs lifting önce yapılır.",
      "Eksik diş uzun süre bırakılırsa komşu dişler kayar ve kemik erir — erken planlama önemlidir.",
    ],
    faq: [
      { q: "İmplant her zaman şart mı?", a: "Hayır; hareketli protez veya köprü de seçenek; implant uzun vadede kemik korur." },
      { q: "Eksik diş kemik erimesi yapar mı?", a: "Evet, çiğneme kuvveti olmayan bölgede kemik yılda %25'e kadar incelir." },
      { q: "Yurt dışından implant için süre", a: "Bazı vakalarda 2 ziyaret; All-on-4'te tek seyahat mümkün olabilir." },
      { q: "Üsküdar'da eksik diş tedavisi", a: `${CLINIC} panoramik ve 3D görüntüleme ile seçenekleri karşılaştırmalı anlatır.` },
    ],
  },
  "dis-sararmasi-neden-olur": {
    coverImage: "blog/blog-02-bonding.jpg",
    author: "Dr. Faruk Oğutlu",
    direct_answer:
      "Dişler sararır çünkü mine yüzeyindeki gözeneklere çay, kahve, sigara ve renkli gıdalar pigment biriktirir; ayrıca yaşlanma, antibiyotik kullanımı ve yetersiz fırçalama da renk koyulaştırır — klinik beyazlatma bu pigmentleri kontrollü şekilde açar.",
    bullets: [
      "Dış lekeler (ekstrinsik): kahve, çay, kırmızı şarap, sigara — profesyonel temizlik + beyazlatma etkilidir.",
      "İç lekeler (intrinsik): florozis, tetrasiklin, travma — daha uzun beyazlatma veya kaplama gerekebilir.",
      "Klinik beyazlatmada %25–40 hidrojen peroksit jel, diş eti bariyeri ile uygulanır.",
      "Ev kitleri daha düşük konsantrasyonlu; sonuç daha yavaş ve sınırlıdır.",
    ],
    faq: [
      { q: "Beyazlatma dişe zarar verir mi?", a: "Hekim kontrolünde geçici hassasiyet olabilir; mine yapısı kalıcı hasar görmez." },
      { q: "Sonuç ne kadar kalır?", a: "6 ay–2 yıl; sigara ve renkli içecekler süreyi kısaltır." },
      { q: "Kaplama öncesi beyazlatma", a: "Evet — önce beyazlatma, 2 hafta sonra veneer rengi buna göre seçilir." },
      { q: "Üsküdar'da diş beyazlatma", a: `${CLINIC} tek seans klinik beyazlatma ve ev bakım önerisi sunar.` },
    ],
  },
  "dis-korkusu-nasil-asilir": {
    coverImage: "blog/blog-03-sedasyon.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "Diş hekimi korkusu, geçmiş travmatik deneyim veya kontrol kaybı hissiyle oluşur; sedasyon (bilinçli sedasyon veya genel anestezi), adım adım açıklama, kısa randevular ve güven ilişkisi ile üstesinden gelinir.",
    bullets: [
      "İlk randevuda sadece tanışma ve muayene — işlem yapılmadan güven inşa edilir.",
      "IV sedasyon veya nefes gazı (mevcutsa) ile hasta rahatlar, işlem hatırlanmaz.",
      "Genel anestezi uzun veya cerrahi işlemlerde tercih edilir.",
      "Sedasyon öncesi sağlık değerlendirmesi ve açlık kuralları uygulanır.",
    ],
    faq: [
      { q: "Sedasyon güvenli mi?", a: "Monitörizasyon ve uygun hasta seçimiyle evet; kardiyovasküler riskler önceden değerlendirilir." },
      { q: "Çocuklarda korku", a: "Pedodonti odasında oyun, anlatım ve bazen sedasyon kullanılır." },
      { q: "Yurt dışından sedasyonlu tedavi", a: "Seyahat tarihine göre anestezi planı önceden koordine edilir." },
      { q: "Üsküdar'da sedasyon", a: `${CLINIC} kaygılı hastalar için sedasyon ve genel anestezi seçenekleri sunar.` },
    ],
  },
  "agiz-kokusu-nedenleri": {
    author: "Dr. Alperen Demiral",
    direct_answer:
      "Ağız kokusu (halitoz) en sık dil üzerindeki bakteri tabakası, diş eti hastalığı, çürük dişler ve kuru ağızdan kaynaklanır; nadiren mide, sinüs veya sistemik hastalıklar da neden olabilir.",
    bullets: [
      "Dil sırtı temizliği (dil kazıyıcı) kokunun %80'ini azaltabilir.",
      "Periodontal tedavi ve profesyonel diş taşı temizliği bakteri yükünü düşürür.",
      "Kronik sinüzit ve reflü kokuya katkı yapabilir — gerekirse yönlendirme yapılır.",
      "Bol su, düzenli diş ipi ve 6 aylık kontrol önleyicidir.",
    ],
    faq: [
      { q: "Ağız spreyi yeterli mi?", a: "Geçici maskeler; asıl neden tedavi edilmeden kalıcı çözüm olmaz." },
      { q: "Diş eti hastalığı kokuya neden olur mu?", a: "Evet — kanayan diş eti altındaki bakteri uçucu sülfür üretir." },
      { q: "Ne zaman doktora?", a: "2 haftalık hijyene rağmen devam eden koku için muayene önerilir." },
      { q: "Üsküdar'da halitoz tedavisi", a: `${CLINIC} periodontal değerlendirme ve profesyonel temizlik sunar.` },
    ],
  },
  "diseti-kanamasi-ne-anlama-gelir": {
    coverImage: "blog/blog-09-periodontoloji.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "Diş eti kanaması, genelde gingivit veya periodontit (diş eti iltihabı) belirtisidir; fırçalarken veya diş ipi kullanırken kanama, diş etinde şişlik ve kızarıklıkla birlikte görülür ve tedavi edilmezse kemik kaybına yol açabilir.",
    bullets: [
      "Erken evre gingivit profesyonel temizlik ve ev bakımıyla geri döndürülebilir.",
      "Periodontit'te diş eti cepleri derinleşir; küretaj veya cerrahi gerekebilir.",
      "Estetik işlem (veneer, implant) öncesi diş eti sağlığı stabilize edilmelidir.",
      "Hamilelik, diyabet ve sigara kanamayı artırır.",
    ],
    faq: [
      { q: "Kanama normal mi?", a: "Hayır — sağlıklı diş eti kanamaz; ihmal edilirse diş kaybı riski artar." },
      { q: "Implant öncesi diş eti tedavisi", a: "Evet — enfekte diş eti implant başarısızlığına neden olabilir." },
      { q: "Evde ne yapmalı?", a: "Yumuşak fırça, diş ipi, antiseptik gargara (hekim önerisiyle)." },
      { q: "Üsküdar'da periodontoloji", a: `${CLINIC} diş eti hastalığı tedavisi ve implant öncesi hazırlık yapar.` },
    ],
  },
  "bonding-tedavisi-nedir": {
    coverImage: "blog/blog-02-bonding.jpg",
    author: "Dr. Faruk Oğutlu",
    direct_answer:
      "Bonding (kompozit lamine), diş renginde reçine malzemenin diş yüzeyine şekillendirilip ışıkla sertleştirilmesidir; kırık, aralık ve renk düzeltmede genelde tek seansta, minimal aşındırmayla uygulanır.",
    bullets: [
      "Anestezi çoğu vakada gerekmez; işlem 30–60 dakika sürer.",
      "UK'de diş başı £200–£500 iken İstanbul'da £60–£150 aralığı yaygındır (2026 pazar verisi).",
      "5–7 yıl dayanır; sigara ve renkli gıda leke yapabilir.",
      "Büyük estetik değişimlerde porselen lamina daha kalıcıdır.",
    ],
    faq: [
      { q: "Bonding mi veneer mi?", a: "Küçük düzeltme için bonding; tam gülüş tasarımı için veneer." },
      { q: "Türkiye'de bonding güvenli mi?", a: "Klinik seçimi kritik — CE onaylı materyal ve yazılı plan isteyin." },
      { q: "Kaç gün İstanbul'da kalmalı?", a: "Bonding için 1–2 gün yeterli; gülüş tasarımı paketlerinde 5–7 gün." },
      { q: "Üsküdar'da bonding", a: `${CLINIC} aynı gün bonding ve dijital gülüş önizlemesi sunar.` },
    ],
  },
  "sedasyonlu-dis-tedavisi-nedir": {
    coverImage: "blog/blog-03-sedasyon.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "Sedasyonlu diş tedavisi, kaygılı veya uzun işlemlerde damar yolu veya inhalasyon yoluyla verilen sedatif ilaçlarla hastanın rahatlatıldığı, ancak nefes ve reflekslerin korunduğu bir yaklaşımdır.",
    bullets: [
      "Bilinçli sedasyon: hasta uykulu ama uyarılabilir; çoğu işlem bu seviyede yapılır.",
      "Genel anestezi: tam bilinç kaybı; karmaşık cerrahi veya çoklu işlemlerde.",
      "Kalp atımı, oksijen saturasyonu ve tansiyon sürekli izlenir.",
      "İşlem sonrası 24 saat araç kullanılmamalıdır.",
    ],
    faq: [
      { q: "Kimler sedasyon alamaz?", a: "Kontrolsüz kalp hastalığı, gebelik (bazı ilaçlar) ve ağır KOAH'ta risk değerlendirmesi gerekir." },
      { q: "Çocuklarda sedasyon", a: "Pedodontik işlemlerde kısa süreli sedasyon güvenle uygulanabilir." },
      { q: "Yurt dışı hasta", a: "Tıbbi öykü formu önceden doldurulur; anestezi ekibi planı onaylar." },
      { q: "Üsküdar'da sedasyonlu tedavi", a: `${CLINIC} implant, çekim ve gülüş tasarımında sedasyon koordine eder.` },
    ],
  },
  "zirkonyum-porselen-kaplama-nedir": {
    coverImage: "blog/blog-01-zirkonyum.jpg",
    author: "Dr. Faruk Oğutlu",
    direct_answer:
      "Zirkonyum-porselen kaplama, yüksek dayanımlı zirkonyum altyapı üzerine ışık geçirgen porselen tabakanın yapıştırıldığı hibrit kron sistemidir; hem estetik hem dayanım gerektiren ön ve arka dişlerde kullanılır.",
    bullets: [
      "Zirkonyum iskelet kırılmaya karşı direnç sağlar; porselen tabaka doğal diş translüsensini verir.",
      "Tam porselen veya monolitik zirkonyuma göre ön dişte daha doğal görünüm.",
      "CAD/CAM ile dijital üretim; diş eti çizgisinde estetik avantaj.",
      "Metal alerjisi olanlarda güvenle tercih edilir.",
    ],
    faq: [
      { q: "Monolitik zirkonyumdan farkı", a: "Porselen kaplı zirkonyum ön bölgede daha doğal; monolitik arka dişte daha dayanıklı." },
      { q: "Ömür ne kadar?", a: "İyi bakımla 12–15+ yıl; kırılma riski düşüktür." },
      { q: "Fiyat faktörleri", a: "Diş sayısı, laboratuvar kalitesi ve greft ihtiyacı belirler." },
      { q: "Üsküdar'da uygulama", a: `${CLINIC} dijital ölçü ve yerel lab koordinasyonu sunar.` },
    ],
  },
  "1-gunde-implant-nedir": {
    coverImage: "blog/blog-04-implant.jpg",
    author: "Dt. Levent Emir Güneysu",
    direct_answer:
      "Aynı gün implant (immediate loading), implant yerleştirildiği gün geçici kron veya protez takılmasıdır; yalnızca yeterli primer stabilite ve uygun kemik kalitesi olan vakalarda güvenle uygulanır.",
    bullets: [
      "3D planlama ile implant açısı ve derinliği önceden belirlenir.",
      "Cerrahi sonrası geçici diş estetik ve fonksiyon sağlar; kalıcı protez 3–6 ay sonra.",
      "All-on-4 protokolü aynı gün sabit tam çene protezi için en bilinen örnektir.",
      "Sigara, diyabet ve yetersiz hijyen başarı oranını düşürür.",
    ],
    faq: [
      { q: "Herkes aynı gün diş alabilir mi?", a: "Hayır — kemik yoğunluğu ve enfeksiyon yokluğu şarttır." },
      { q: "Geçici diş ne kadar kalır?", a: "İyileşme süresince; sonra kalıcı zirkonyum/porselen takılır." },
      { q: "Seyahat planı", a: "Sağlık turizmi hastalarında 5–7 günlük takip randevuları planlanır." },
      { q: "Üsküdar'da immediate loading", a: `${CLINIC} uygun vakalarda aynı gün geçici protez sunar.` },
    ],
  },
  "profesyonel-dis-cekimi-nasil-yapilir": {
    coverImage: "blog/blog-05-cekimi.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "Profesyonel diş çekimi, lokal anestezi altında dişin atraumatik (kemik ve komşu dokuya zarar vermeden) çıkarılmasıdır; komplike vakalarda cerrahi çekim veya sedasyon kullanılır.",
    bullets: [
      "Panoramik veya 3D görüntü ile kök ve sinir yakınlığı değerlendirilir.",
      "Çekim sonrası gazlı bez ve soğuk kompres kanamayı kontrol eder.",
      "İmplant planı varsa çekim soketi korunarak greft yapılabilir.",
      "Antibiyotik ve ağrı kesici hekim önerisiyle kullanılır.",
    ],
    faq: [
      { q: "Çekim ağrılı mı?", a: "Anestezi altında ağrı hissedilmez; sonrası 2–3 gün hafif ağrı normaldir." },
      { q: "Yirmi yaş dişi", a: "Gömülü dişlerde cerrahi çekim ve bazen sedasyon gerekir." },
      { q: "Ne zaman implant?", a: "Aynı seansta veya 2–3 ay kemik iyileşmesi sonrası planlanır." },
      { q: "Üsküdar'da çekim", a: `${CLINIC} basit ve cerrahi çekim, sedasyon seçenekleriyle hizmet verir.` },
    ],
  },
  "gulush-tasarimi-lamine-veneer-nedir": {
    coverImage: "blog/blog-06-gulush.jpg",
    author: "Dr. Faruk Oğutlu",
    direct_answer:
      "Gülüş tasarımı lamine veneer, dijital mock-up ile planlanan ince porselen kaplamaların ön dişlere yapıştırılmasıyla renk, form ve simetriyi düzelten estetik tedavidir; genelde 6–10 dişi kapsar ve 5–7 günlük planla tamamlanır.",
    bullets: [
      "DSD yazılımı ile yüz, dudak ve diş oranları analiz edilir.",
      "Minimal prep (0,3–0,5 mm) ile doğal diş dokusu korunur.",
      "Geçici veneer ile sonuç önceden test edilir.",
      "E-max veya feldspathic porselen malzeme seçenekleri vardır.",
    ],
    faq: [
      { q: "Kaç veneer gerekir?", a: "Gülüş hattında 6–10 diş; alt dişler isteğe bağlı." },
      { q: "Bonding'den farkı", a: "Veneer laboratuvar üretimi, daha uzun ömür ve leke direnci." },
      { q: "İstanbul'da süre", a: "5–7 gün (ölçü, üretim, prova, yapıştırma)." },
      { q: "Üsküdar'da gülüş tasarımı", a: `${CLINIC} DSD ve veneer uygulamasını koordine eder.` },
    ],
  },
  "cocuk-dis-hekimligi-ilk-muayene": {
    coverImage: "blog/blog-07-pedodonti.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "Çocuğun ilk diş hekimi muayenesi, süt dişlerinin çıkmasından itibaren (yaklaşık 1 yaş) veya en geç ilk doğum gününde yapılmalıdır; amaç korkusuz tanışma, florür uygulaması ve ebeveyn eğitimidir.",
    bullets: [
      "İlk randevuda genelde tedavi değil, oyun ve tanışma odaklıdır.",
      "Süt dişi çürükleri kalıcı dişlere zarar verebilir — erken kontrol önemlidir.",
      "Fissür örtücü ve florür jel koruyucu uygulamalardır.",
      "Sedasyon çok kaygılı çocuklarda veya uzun işlemlerde değerlendirilir.",
    ],
    faq: [
      { q: "Çocuk kaç yaşında dişçiye gitmeli?", a: "İlk diş çıktıktan sonra 6 ay içinde veya 1 yaşında." },
      { q: "Korku nasıl önlenir?", a: "Olumlu dil, ödül sistemi ve kısa randevular." },
      { q: "Süt dişi çekilir mi?", a: "Gerekirse evet — yer tutucu ile kalıcı diş yeri korunur." },
      { q: "Üsküdar'da pedodonti", a: `${CLINIC} çocuk dostu muayene ortamı sunar.` },
    ],
  },
  "kanal-tedavisi-mikroskop-ile": {
    coverImage: "blog/blog-08-kanal.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "Mikroskop destekli kanal tedavisi, diş içi kanalların operasyon mikroskobu altında büyütülerek temizlenip doldurulmasıdır; standart tedaviye göre kırık alet ve kaçan kanal riski azalır.",
    bullets: [
      "20–25x büyütme ile ek kanallar ve çatlaklar görülür.",
      "Enfekte pulpa ve bakteri tam temizlenir; diş çekimi önlenir.",
      "Genelde 1–2 seans; acil ağrıda ilk seansta rahatlama sağlanır.",
      "Tedavi sonrası kron önerilir — kırılgan diş korunur.",
    ],
    faq: [
      { q: "Kanal tedavisi ağrılı mı?", a: "Anestezi ile ağrısız; öncesi ağrı enfeksiyondan kaynaklanır." },
      { q: "Mikroskop şart mı?", a: "Karmaşık kanallarda başarı oranını belirgin artırır." },
      { q: "Ne kadar sürer?", a: "Tek köklü diş 45–60 dk; molarda 90+ dk." },
      { q: "Üsküdar'da kanal tedavisi", a: `${CLINIC} mikroskop ve dijital röntgen ile kanal tedavisi yapar.` },
    ],
  },
  "periodontoloji-dis-eti-sagligi": {
    coverImage: "blog/blog-09-periodontoloji.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "Periodontoloji, diş eti ve çevre dokuların hastalıklarının (gingivit, periodontit) teşhis ve tedavisiyle ilgilenir; sağlıklı diş eti implant, veneer ve genel ağız sağlığının temelidir.",
    bullets: [
      "Erken gingivit profesyonel temizlikle geri döner.",
      "Periodontit'te derin temizlik (küretaj) veya flap cerrahisi gerekir.",
      "Estetik tedavi öncesi diş eti konturü ve pembe estetik planlanır.",
      "Sigara bırakma periodontit tedavisinin başarısını ikiye katlar.",
    ],
    faq: [
      { q: "Diş eti çekilmesi tedavi edilir mi?", a: "Greft ve yumuşak doku cerrahisi ile kısmen düzeltilebilir." },
      { q: "Implant öncesi şart mı?", a: "Aktif periodontit implant başarısızlığı riskini artırır — önce tedavi." },
      { q: "Kontrol sıklığı", a: "Periodontit sonrası 3–4 ayda bir profesyonel temizlik." },
      { q: "Üsküdar'da periodontoloji", a: `${CLINIC} diş eti hastalığı tedavisi ve implant öncesi hazırlık sunar.` },
    ],
  },
  "medident-istanbul-klinik-deneyimi": {
    coverImage: "blog/blog-10-klinik.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "MediDent İstanbul, Üsküdar Acıbadem'de implant, estetik diş hekimliği, sedasyon ve sağlık turizmi koordinasyonunu tek çatı altında sunan çok dilli bir diş kliniğidir; 1.200+ Google değerlendirmesi ve isimli uzman hekim kadrosuyla hizmet verir.",
    bullets: [
      "Adres: Acıbadem Cd. 195F, Üsküdar — metro ve sağlık kampüsüne yakın.",
      "TR / EN / DE iletişim; WhatsApp ve ücretsiz online konsültasyon.",
      "Dijital tomografi, CAD/CAM ve sterilizasyon protokolleri mevcuttur.",
      "Transfer, otel ve sıkıştırılmış tedavi takvimi sağlık turizmi paketinde.",
    ],
    faq: [
      { q: "Nasıl randevu alınır?", a: "Web sitesi iletişim formu, telefon veya WhatsApp (+90 549 119 08 19)." },
      { q: "Hangi tedaviler yapılıyor?", a: "İmplant, zirkonyum, veneer, bonding, beyazlatma, sedasyon, ortodonti." },
      { q: "Yurt dışından hasta kabul?", a: "Evet — Almanya, İngiltere ve 50+ ülkeden hasta tedavi edilmektedir." },
      { q: "Çalışma saatleri", a: "Pazartesi–Cumartesi 09:00–18:00." },
    ],
  },
  "turkiyede-dis-tedavisi-guvenli-mi": {
    coverImage: "blog/blog-10-klinik.jpg",
    author: "Dr. Alperen Demiral",
    direct_answer:
      "Türkiye'de diş tedavisi güvenlidir — ancak güvenlik ülkeye değil, seçtiğiniz kliniğe bağlıdır; Sağlık Bakanlığı kayıtlı, isimli hekim, şeffaf malzeme markası ve yazılı tedavi planı sunan klinikler uluslararası standartlarda hizmet verir.",
    bullets: [
      "Klinik Sağlık Turizmi Yetki Belgesi ve TDB kayıtlı hekimleri doğrulayın.",
      "3D tomografi ve sterilizasyon protokollerini sorun; 'çok ucuz' tekliflerde malzeme kalitesi şüpheli olabilir.",
      "Sağlıklı dişe gereksiz kron (Turkey teeth riski) yerine lamina/bonding isteyin.",
      "Yazılı plan, implant markası ve sonrası kontrol protokolü almadan kapora ödemeyin.",
    ],
    faq: [
      { q: "Turkey teeth nedir?", a: "Aşırı beyaz, agresif aşındırılmış kron sonucu; etik klinikler bunu önlemek için DSD kullanır." },
      { q: "MediDent güvenilir mi?", a: `${CLINIC} — 1.200+ Google yorumu, isimli uzman hekimler, Üsküdar Acıbadem fiziksel adres.` },
      { q: "Komplikasyon olursa?", a: "Tedavi öncesi UK/DE diş hekiminize planı gösterin; sonrası kontrol randevusu ayarlayın." },
      { q: "Hangi sertifikalar önemli?", a: "Sağlık Turizmi yetkisi, ISO hijyen, hekim diploma şeffaflığı — JCI hastane değil klinik bazında aranır." },
    ],
  },
};

/** Resolve answer: supports hollywood typo alias */
export function getGeoAnswer(slug) {
  if (GEO_ANSWERS_TR[slug]) return GEO_ANSWERS_TR[slug];
  if (slug === "hollywoodlywood-smile-nedir") return GEO_ANSWERS_TR["hollywood-smile-nedir"];
  return null;
}

export function buildGeoPackFromTopic(topic) {
  const ans = getGeoAnswer(topic.slug);
  if (!ans) return null;

  const direct = ans.direct_answer;
  const bullets = ans.bullets || [];
  const faq = ans.faq || [];
  const brandHits = { n: 0 };
  const mention = () => {
    if (brandHits.n >= 1) return "klinik";
    brandHits.n++;
    return "MediDent İstanbul";
  };

  const defaultFaq = faq.length
    ? faq
    : [
        { q: topic.q, a: direct },
        { q: "Ne kadar sürer?", a: "İşlem tipine göre aynı gün ile birkaç hafta arasında değişir." },
        { q: "Üsküdar'da bu hizmet var mı?", a: `${mention()} Acıbadem'de hizmet verir.` },
        { q: "Yurt dışından hasta kabul ediyor musunuz?", a: "Evet. Transfer ve konaklama koordine edilebilir." },
      ];

  return {
    lang: "tr",
    slug: topic.slug === "hollywoodlywood-smile-nedir" ? "hollywood-smile-nedir" : topic.slug,
    bucket: topic.bucket,
    question: topic.q,
    title: topic.q.replace(/\?$/, ""),
    direct_answer: direct,
    coverImage: ans.coverImage,
    author: ans.author,
    bullets,
    faq: defaultFaq,
    internal_links: [
      { href: "/hizmetler/", label: "Hizmetler" },
      { href: "/blog/", label: "Blog" },
      { href: "/geo/", label: "GEO bilgi bankası" },
      { href: "/iletisim/", label: "İletişim" },
    ],
    publishedAt: new Date().toISOString().slice(0, 10),
    source: "geo-answers-v2",
  };
}
