#!/usr/bin/env node
/**
 * Faz 0 + Faz 2 + Gap #2 — apply SEO/GEO plan content updates.
 * Unique answers only; no template reuse; no auto-publish (caller deploys).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PACKS = path.join(ROOT, "src/content/geo/packs.json");
const CLINIC = "MediDent İstanbul (Üsküdar Acıbadem)";
const TODAY = new Date().toISOString().slice(0, 10);

/** Unique TR rewrites for thin template packs (Faz 0) */
const TR_REWRITES = {
  "dis-implant-nedir": {
    question: "Diş implantı nedir?",
    title: "Diş implantı nedir",
    coverImage: "blog/blog-04-implant.jpg",
    direct_answer:
      "Diş implantı, eksik dişin kökünün yerine çene kemiğine yerleştirilen titanyum (veya benzeri) bir vidadır; üzerine sabit kron veya köprü takılarak doğal dişe en yakın fonksiyon ve estetik sağlanır.",
    bullets: [
      "3D tomografi ile kemik hacmi, sinüs ve sinir hatları ölçülür; greft ihtiyacı önceden planlanır.",
      "Lokal anestezi veya sedasyon altında yerleştirilir; iyileşme (osseointegrasyon) genelde 6–12 hafta sürer.",
      "Kaynaşma sonrası dijital ölçü ile zirkonyum veya porselen kron üretilir.",
      "İyi ağız hijyeni ve 6 aylık kontroller implant ömrünü belirler.",
    ],
    faq: [
      { q: "İmplant ağrılı mı?", a: "İşlem lokal anestezi ile konforlu yapılır; sonrasında 2–3 gün hafif hassasiyet normaldir." },
      { q: "Kimler implant yaptıramaz?", a: "Kontrolsüz diyabet, aktif enfeksiyon veya yetersiz kemik (greftsiz) vakalarda önce alternatifler değerlendirilir." },
      { q: "Ne kadar sürer?", a: "Tek dişte genelde 2–3 randevu; All-on-4 protokolünde aynı gün geçici diş mümkün olabilir." },
      { q: "Üsküdar'da implant var mı?", a: `${CLINIC} implant cerrahisi, dijital planlama ve protez üretimini aynı klinikte sunar.` },
    ],
  },
  "hollywoodlywood-smile-nedir": {
    question: "Hollywood Smile nedir?",
    title: "Hollywood Smile nedir",
    coverImage: "blog/blog-06-gulush.jpg",
    direct_answer:
      "Hollywood Smile, dijital gülüş tasarımıyla yüz oranlarına uygun renk, form ve diş eti hattının planlandığı kapsamlı estetik rehabilitasyondur; genelde lamina veneer, zirkonyum veya bonding kombinasyonu kullanılır.",
    bullets: [
      "Fotoğraf ve intraoral tarama ile mock-up hazırlanır; hasta onayından sonra işleme geçilir.",
      "Minimal aşındırma ile porselen lamina veya tam kaplama zirkonyum, vaka bazında seçilir.",
      "Sağlık turizmi hastalarında tedavi 5–10 günlük planla yoğunlaştırılabilir.",
      "Geçici dişlerle estetik korunur; kalıcı kaplama laboratuvarda üretilir.",
    ],
    faq: [
      { q: "Kaç dişi kapsar?", a: "Genelde gülüş hattındaki 8–10 üst ön diş; vakaya göre alt dişler de dahil edilir." },
      { q: "Doğal görünür mü?", a: "Dijital shade seçimiyle ton ve translüsens birlikte belirlenir; aşırı beyaz sonuç zorunlu değildir." },
      { q: "Turkey teeth ile farkı nedir?", a: "Etik planlama sağlıklı dişe gereksiz kron yerine lamina veya bonding önerir; agresif aşındırma yapılmaz." },
      { q: "Üsküdar'da Hollywood Smile yapılır mı?", a: `Evet. ${CLINIC} dijital gülüş tasarımı ve veneer/kaplama sürecini koordine eder.` },
    ],
  },
  "zirkonyum-kaplama-nedir": {
    question: "Zirkonyum kaplama nedir?",
    title: "Zirkonyum kaplama nedir",
    coverImage: "blog/blog-01-zirkonyum.jpg",
    direct_answer:
      "Zirkonyum kaplama, yüksek dayanımlı zirkonya seramikten üretilen metal içermeyen tam diş kronudur; ön ve arka dişlerde estetik ve fonksiyon için tercih edilir.",
    bullets: [
      "CAD/CAM ile dijital ölçüden üretilir; renk stabilitesi ve diş eti uyumu yüksektir.",
      "Metal alerjisi olan hastalarda tercih edilir; MR çekiminde sorun çıkarmaz.",
      "Köprü protezlerde ve implant üstü kronlarda dayanım avantajı sağlar.",
      "İyi bakımla 10–15+ yıl kullanılabilir.",
    ],
    faq: [
      { q: "Zirkonyum mu porselen mi?", a: "Ön dişte translüsens için porselen kaplı zirkonyum; arka diş ve köprüde monolitik zirkonyum sık tercih edilir." },
      { q: "Diş aşındırılır mı?", a: "Tam kaplama için minimal aşındırma gerekir; lamina kadar az değildir." },
      { q: "Almanya'ya göre neden Türkiye?", a: "Aynı CAD/CAM ve malzeme kalitesi, daha düşük klinik maliyeti — net plan muayene sonrası verilir." },
      { q: "Üsküdar'da zirkonyum", a: `${CLINIC} dijital ölçü ve laboratuvar koordinasyonu ile 3–7 günde tamamlanabilir.` },
    ],
  },
  "porselen-lamina-nedir": {
    question: "Porselen lamina nedir?",
    title: "Porselen lamina nedir",
    coverImage: "blog/blog-06-gulush.jpg",
    direct_answer:
      "Porselen lamina (veneer), ön diş yüzeyine yapıştırılan ince seramik kabuktur; renk, şekil ve küçük hizalanma sorunlarını minimum diş aşındırmasıyla düzeltir.",
    bullets: [
      "Genelde 0,3–0,7 mm aşındırma yeterlidir; bonding'e göre daha kalıcıdır.",
      "Leke tutmaz; doğal ışık geçirgenliği yüksektir.",
      "Kırık diş, aralık kapatma ve renk düzeltmede idealdir.",
      "Laboratuvar aşaması nedeniyle genelde 2–3 randevu gerekir.",
    ],
    faq: [
      { q: "Lamina mı bonding mi?", a: "Tek seans ve düşük maliyet için bonding; uzun ömür ve renk stabilitesi için lamina." },
      { q: "Kaç yıl dayanır?", a: "İyi bakımla 10–15 yıl; gece plağı ve sert gıdadan kaçınma önerilir." },
      { q: "Geri alınabilir mi?", a: "Minimal prep vakalarda sınırlı; aşındırma yapıldıysa geri dönüş zordur — planlama kritiktir." },
      { q: "İstanbul'da süre", a: "Dijital akışla 5–7 gün; geçici veneer ile estetik korunur." },
    ],
  },
  "all-on-4-nedir": {
    question: "All-on-4 tedavisi nedir?",
    title: "All-on-4 tedavisi nedir",
    coverImage: "blog/blog-04-implant.jpg",
    direct_answer:
      "All-on-4, tek çenede dört strategik açıyla yerleştirilen implant üzerine aynı gün sabit geçici protez takılan tam çene rehabilitasyon protokolüdür; dişsiz veya neredeyse dişsiz hastalarda uygulanır.",
    bullets: [
      "Ön bölgede düz, arka bölgede eğik implantlar mevcut kemikten maksimum fayda sağlar.",
      "Uygun vakada cerrahi günü geçici sabit diş verilir; iyileşme sonrası kalıcı zirkonyum köprü yapılır.",
      "Greft ihtiyacını azaltabilir; her hasta adayı değildir.",
      "All-on-6, ek implant ile daha yüksek çiğneme kuvveti gereken vakalarda tercih edilir.",
    ],
    faq: [
      { q: "All-on-4 ile All-on-6 farkı", a: "All-on-6'da iki ek implant daha fazla destek sağlar; kemik kalitesi düşükse tercih edilir." },
      { q: "Aynı gün diş mümkün mü?", a: "Primer stabilite sağlanırsa evet; aksi halde iyileşme sonrası protez planlanır." },
      { q: "Ne kadar sürer?", a: "Cerrahi + geçici protez 1 gün; kalıcı protez 3–6 ay sonra." },
      { q: "Üsküdar'da All-on-4", a: `${CLINIC} 3D planlama ile tam çene vakalarını değerlendirir.` },
    ],
  },
  "dis-eksikligi-ne-yapilmali": {
    question: "Eksik diş için en iyi çözüm nedir?",
    title: "Eksik diş için en iyi çözüm nedir",
    coverImage: "blog/blog-04-implant.jpg",
    direct_answer:
      "Eksik diş için en uygun çözüm; komşu diş sağlığı, kemik hacmi, yaş ve bütçeye göre implant, sabit köprü veya çıkarılabilir protez arasından seçilir — tek doğru cevap muayene ile belirlenir.",
    bullets: [
      "Tek eksik dişte komşu dişler sağlamsa implant genelde en koruyucu seçenektir.",
      "Birden fazla eksikte implant destekli köprü veya All-on-4/6 değerlendirilir.",
      "Kemik yetersizse greft veya sinüs lifting önce yapılır.",
      "Eksik diş uzun süre bırakılırsa komşu dişler kayar ve kemik erir.",
    ],
    faq: [
      { q: "İmplant her zaman şart mı?", a: "Hayır; köprü veya hareketli protez de seçenek olabilir. İmplant uzun vadede kemik korur." },
      { q: "Kemik erimesi olur mu?", a: "Evet — çiğneme kuvveti olmayan bölgede kemik zamanla incelir." },
      { q: "Yurt dışından süre", a: "Bazı vakalarda 2 ziyaret; All-on-4'te tek seyahat mümkün olabilir." },
      { q: "Üsküdar'da eksik diş tedavisi", a: `${CLINIC} panoramik ve 3D görüntüleme ile seçenekleri karşılaştırmalı anlatır.` },
    ],
  },
  "dis-sararmasi-neden-olur": {
    question: "Dişler neden sararır ve nasıl beyazlatılır?",
    title: "Dişler neden sararır ve nasıl beyazlatılır",
    coverImage: "blog/blog-02-bonding.jpg",
    direct_answer:
      "Dişler sararır çünkü mine gözeneklerine çay, kahve, sigara ve renkli gıdalar pigment biriktirir; yaşlanma ve bazı ilaçlar da rengi koyulaştırır — klinik beyazlatma bu pigmentleri kontrollü şekilde açar.",
    bullets: [
      "Dış lekeler (kahve, çay, sigara): profesyonel temizlik + klinik beyazlatma etkilidir.",
      "İç lekeler (florozis, tetrasiklin, travma): daha uzun beyazlatma veya kaplama gerekebilir.",
      "Klinik beyazlatmada hekim gözetiminde yüksek konsantrasyonlu jel kullanılır.",
      "Ev kitleri daha yavaş ve sınırlı sonuç verir.",
    ],
    faq: [
      { q: "Beyazlatma zarar verir mi?", a: "Hekim kontrolünde geçici hassasiyet olabilir; mine yapısı kalıcı hasar görmez." },
      { q: "Sonuç ne kadar kalır?", a: "6 ay–2 yıl; sigara ve renkli içecekler süreyi kısaltır." },
      { q: "Kaplama öncesi beyazlatma", a: "Evet — önce beyazlatma, 2 hafta sonra veneer rengi buna göre seçilir." },
      { q: "Üsküdar'da diş beyazlatma", a: `${CLINIC} tek seans klinik beyazlatma ve ev bakım önerisi sunar.` },
    ],
  },
  "dis-korkusu-nasil-asilir": {
    question: "Diş hekimi korkusu nasıl aşılır?",
    title: "Diş hekimi korkusu nasıl aşılır",
    coverImage: "blog/blog-03-sedasyon.jpg",
    direct_answer:
      "Diş hekimi korkusu geçmiş travma veya kontrol kaybı hissiyle oluşur; sedasyon, adım adım açıklama, kısa randevular ve güven ilişkisiyle üstesinden gelinir.",
    bullets: [
      "İlk randevuda sadece tanışma ve muayene — işlem yapılmadan güven inşa edilir.",
      "IV sedasyon ile hasta rahatlar; çoğu işlem bu seviyede tamamlanır.",
      "Genel anestezi uzun veya cerrahi işlemlerde tercih edilir.",
      "Sedasyon öncesi sağlık değerlendirmesi ve açlık kuralları uygulanır.",
    ],
    faq: [
      { q: "Sedasyon güvenli mi?", a: "Monitörizasyon ve uygun hasta seçimiyle evet; kardiyovasküler riskler önceden değerlendirilir." },
      { q: "Çocuklarda korku", a: "Pedodonti odasında oyun, anlatım ve gerekirse sedasyon kullanılır." },
      { q: "Yurt dışından sedasyon", a: "Tıbbi öykü formu önceden doldurulur; anestezi planı seyahat tarihine göre yapılır." },
      { q: "Üsküdar'da sedasyon", a: `${CLINIC} kaygılı hastalar için sedasyon ve genel anestezi seçenekleri sunar.` },
    ],
  },
  "agiz-kokusu-nedenleri": {
    question: "Ağız kokusu neden olur?",
    title: "Ağız kokusu neden olur",
    coverImage: "blog/blog-09-periodontoloji.jpg",
    direct_answer:
      "Ağız kokusu (halitoz) en sık dil üzerindeki bakteri tabakası, diş eti hastalığı, çürük dişler ve kuru ağızdan kaynaklanır; nadiren mide, sinüs veya sistemik hastalıklar da neden olabilir.",
    bullets: [
      "Dil sırtı temizliği (dil kazıyıcı) kokunun büyük kısmını azaltabilir.",
      "Periodontal tedavi ve profesyonel diş taşı temizliği bakteri yükünü düşürür.",
      "Kronik sinüzit ve reflü katkı yapabilir — gerekirse yönlendirme yapılır.",
      "Bol su, diş ipi ve 6 aylık kontrol önleyicidir.",
    ],
    faq: [
      { q: "Ağız spreyi yeterli mi?", a: "Geçici maskeler; asıl neden tedavi edilmeden kalıcı çözüm olmaz." },
      { q: "Diş eti hastalığı kokuya neden olur mu?", a: "Evet — kanayan diş eti altındaki bakteri uçucu sülfür üretir." },
      { q: "Ne zaman doktora?", a: "2 haftalık hijyene rağmen devam eden koku için muayene önerilir." },
      { q: "Üsküdar'da tedavi", a: `${CLINIC} periodontal değerlendirme ve profesyonel temizlik sunar.` },
    ],
  },
  "diseti-kanamasi-ne-anlama-gelir": {
    question: "Diş eti kanaması ne anlama gelir?",
    title: "Diş eti kanaması ne anlama gelir",
    coverImage: "blog/blog-09-periodontoloji.jpg",
    direct_answer:
      "Diş eti kanaması genelde gingivit veya periodontit (diş eti iltihabı) belirtisidir; fırçalarken kanama, şişlik ve kızarıklıkla birlikte görülür ve tedavi edilmezse kemik kaybına yol açabilir.",
    bullets: [
      "Erken gingivit profesyonel temizlik ve ev bakımıyla geri döndürülebilir.",
      "Periodontit'te diş eti cepleri derinleşir; küretaj veya cerrahi gerekebilir.",
      "Estetik işlem (veneer, implant) öncesi diş eti sağlığı stabilize edilmelidir.",
      "Hamilelik, diyabet ve sigara kanamayı artırır.",
    ],
    faq: [
      { q: "Kanama normal mi?", a: "Hayır — sağlıklı diş eti kanamaz; ihmal edilirse diş kaybı riski artırır." },
      { q: "Implant öncesi diş eti tedavisi", a: "Evet — enfekte diş eti implant başarısızlığına neden olabilir." },
      { q: "Evde ne yapmalı?", a: "Yumuşak fırça, diş ipi, hekim önerisiyle antiseptik gargara." },
      { q: "Üsküdar'da periodontoloji", a: `${CLINIC} diş eti hastalığı tedavisi ve implant öncesi hazırlık yapar.` },
    ],
  },
};

/** Faz 2 — trust series TR/EN/DE */
const TRUST_PAGES = [
  {
    lang: "tr",
    slug: "turkiyede-dis-tedavisi-guvenli-mi",
    bucket: "karsilastirma",
    question: "Türkiye'de diş tedavisi güvenli mi?",
    title: "Türkiye'de diş tedavisi güvenli mi",
    coverImage: "blog/blog-10-klinik.jpg",
    direct_answer:
      "Türkiye'de diş tedavisi güvenlidir — ancak güvenlik ülkeye değil, seçtiğiniz kliniğe bağlıdır. Sağlık Bakanlığı kayıtlı, isimli hekim, şeffaf malzeme markası ve yazılı tedavi planı sunan klinikler uluslararası standartlarda hizmet verir.",
    bullets: [
      "Klinik Sağlık Turizmi Yetki Belgesi ve hekim kayıtlarını doğrulayın.",
      "3D tomografi ve sterilizasyon protokollerini sorun; aşırı düşük fiyat tekliflerinde malzeme kalitesi şüpheli olabilir.",
      "Sağlıklı dişe gereksiz kron (Turkey teeth riski) yerine lamina/bonding isteyin.",
      "Yazılı plan, implant/malzeme markası ve sonrası kontrol protokolü almadan kapora ödemeyin.",
    ],
    faq: [
      { q: "Turkey teeth nedir?", a: "Aşırı beyaz, agresif aşındırılmış kron sonucu; etik klinikler bunu önlemek için dijital gülüş tasarımı kullanır." },
      { q: "Nasıl güvenli klinik seçilir?", a: "Hekim adı, malzeme markası, yazılı plan, dijital planlama ve aftercare protokolü sorulmalı." },
      { q: "Komplikasyon olursa?", a: "Tedavi öncesi planı kendi ülkenizdeki diş hekiminize gösterin; sonrası kontrol randevusu ayarlayın." },
      { q: "MediDent nerede?", a: `${CLINIC} — isimli hekim kadrosu, WhatsApp iletişimi ve sağlık turizmi koordinasyonu.` },
    ],
    internal_links: [
      { href: "/geo/", label: "GEO bilgi bankası" },
      { href: "/hizmetler/", label: "Hizmetler" },
      { href: "/doktorlar/", label: "Doktorlar" },
      { href: "/iletisim/", label: "İletişim" },
    ],
  },
  {
    lang: "en",
    slug: "is-dental-treatment-in-turkey-safe",
    bucket: "trust",
    question: "Is dental treatment in Turkey safe?",
    title: "Is dental treatment in Turkey safe",
    coverImage: "blog/blog-10-klinik.jpg",
    direct_answer:
      "Yes — at the right clinic. Dental treatment in Turkey is safe when you choose a Ministry of Health–registered facility with named dentists, transparent material brands and a written treatment plan. The risk is a high-volume clinic model, not the country itself.",
    bullets: [
      "Verify health-tourism authorisation and the treating dentist's name before booking.",
      "Ask for digital imaging (3D/CBCT) and the exact ceramic or implant brand in writing.",
      "Reject plans that crown healthy teeth when veneers or bonding would suffice.",
      "Confirm aftercare: remote follow-up, warranty terms and home-country coordination.",
    ],
    faq: [
      { q: "Are Turkey teeth the same as all dental work in Turkey?", a: "No. \"Turkey teeth\" usually means aggressive over-preparation for cheap full crowns — not ethical veneer or bonding work." },
      { q: "How do I vet a clinic?", a: "Five checks: dentist name, material brand, written plan, digital smile design, aftercare protocol." },
      { q: "Why is it cheaper?", a: "Lower rent and staff costs — reputable clinics use the same CAD/CAM and ceramic brands as Western Europe." },
      { q: "What about MediDent Istanbul?", a: "MediDent Istanbul in Üsküdar Acıbadem provides named clinical team, digital planning, EN/DE support and remote WhatsApp follow-up." },
    ],
    internal_links: [
      { href: "/en/geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/", label: "Turkey teeth guide" },
      { href: "/en/geo/dental-aftercare-when-you-return-home/", label: "Aftercare abroad" },
      { href: "/en/hizmetler/", label: "Services" },
      { href: "/en/iletisim/", label: "Contact" },
    ],
  },
  {
    lang: "de",
    slug: "ist-zahnbehandlung-in-der-tuerkei-sicher",
    bucket: "trust",
    question: "Ist Zahnbehandlung in der Türkei sicher?",
    title: "Ist Zahnbehandlung in der Türkei sicher",
    coverImage: "blog/blog-10-klinik.jpg",
    direct_answer:
      "Ja — in der richtigen Klinik. Zahnbehandlung in der Türkei ist sicher, wenn Sie eine vom Gesundheitsministerium zugelassene Praxis mit namentlich genannten Zahnärzten, transparenten Materialmarken und schriftlichem Behandlungsplan wählen. Das Risiko liegt im Klinikmodell, nicht im Land.",
    bullets: [
      "Prüfen Sie die Gesundheits-Tourismus-Zulassung und den Namen des behandelnden Zahnarztes.",
      "Verlangen Sie 3D-Bildgebung und die exakte Keramik- oder Implantatmarke schriftlich.",
      "Lehnen Sie Pläne ab, die gesunde Zähne bekrönen, wenn Veneers oder Bonding reichen würden.",
      "Klären Sie Nachsorge: Fernkontrolle, Garantiebedingungen und Koordination in Deutschland.",
    ],
    faq: [
      { q: "Sind \"Turkey teeth\" gleichbedeutend mit Zahnmedizin in der Türkei?", a: "Nein. Der Begriff meint meist aggressive Überpräparation für günstige Vollkronen — nicht ethische Veneers oder Bonding." },
      { q: "Wie prüfe ich eine Klinik?", a: "Fünf Punkte: Zahnarztname, Materialmarke, schriftlicher Plan, digitales Smile Design, Nachsorgeprotokoll." },
      { q: "Warum ist es günstiger?", a: "Niedrigere Mieten und Personalkosten — seriöse Kliniken nutzen dieselben CAD/CAM- und Keramikmarken wie in Westeuropa." },
      { q: "Was bietet MediDent Istanbul?", a: "MediDent Istanbul in Üsküdar Acıbadem: benanntes Team, digitale Planung, DE/EN-Betreuung und WhatsApp-Nachsorge." },
    ],
    internal_links: [
      { href: "/de/hizmetler/", label: "Leistungen" },
      { href: "/de/geo/", label: "GEO" },
      { href: "/de/iletisim/", label: "Kontakt" },
      { href: "/en/geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/", label: "Turkey teeth (EN)" },
    ],
  },
];

/** Gap #2 — aftercare EN */
const AFTERCARE = {
  lang: "en",
  slug: "dental-aftercare-when-you-return-home",
  bucket: "trust",
  question: "What happens if I need dental aftercare after returning home?",
  title: "Dental aftercare when you return home from Turkey",
  coverImage: "blog/blog-10-klinik.jpg",
  direct_answer:
    "Before you fly for treatment, confirm a written aftercare protocol: remote check-ins, warranty terms, and how the Istanbul clinic coordinates with a dentist in your home country if something needs attention after you return.",
  bullets: [
    "UK and German patients' top worry is \"who fixes a problem once I'm home\" — address it before booking, not after.",
    "A solid clinic shares a WhatsApp or email follow-up channel, photo/check-in schedule for the first weeks, and clear warranty exclusions.",
    "Take your written plan to a home-country dentist for a second opinion before you travel.",
    "At MediDent Istanbul, post-treatment patients receive scheduled remote follow-ups; emergency questions go through the same clinical coordination channel used during the trip.",
  ],
  faq: [
    { q: "Does MediDent have a UK office?", a: "MediDent coordinates remotely from Üsküdar Acıbadem with English support. Local UK partners are arranged case by case when needed — ask during consultation." },
    { q: "What should be in writing?", a: "Material brands, treatment steps, temporary vs final timeline, warranty length, and what costs are covered if a remake is needed." },
    { q: "When should I see a dentist at home?", a: "Routine hygiene as advised; sooner if pain, swelling, bite change or crown mobility appears. Send photos to the clinic first for triage." },
    { q: "Is a warranty the same as a guarantee of result?", a: "No. A warranty covers defined technical failures under stated conditions. Aesthetic \"perfect forever\" promises are not ethical — ask what is and is not covered." },
  ],
  internal_links: [
    { href: "/en/geo/is-dental-treatment-in-turkey-safe/", label: "Is Turkey dental treatment safe?" },
    { href: "/en/geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/", label: "Turkey teeth guide" },
    { href: "/en/iletisim/", label: "Contact" },
    { href: "/en/hizmetler/", label: "Services" },
  ],
};

function packFrom(data) {
  return {
    lang: data.lang || "tr",
    slug: data.slug,
    bucket: data.bucket || "kategori",
    question: data.question,
    title: data.title || data.question.replace(/\?$/, ""),
    direct_answer: data.direct_answer,
    coverImage: data.coverImage,
    author: "MediDent Istanbul Clinical Team",
    bullets: data.bullets,
    faq: data.faq,
    internal_links: data.internal_links || [
      { href: data.lang === "en" ? "/en/hizmetler/" : data.lang === "de" ? "/de/hizmetler/" : "/hizmetler/", label: data.lang === "de" ? "Leistungen" : data.lang === "en" ? "Services" : "Hizmetler" },
      { href: data.lang === "en" ? "/en/geo/" : data.lang === "de" ? "/de/geo/" : "/geo/", label: "GEO" },
      { href: data.lang === "en" ? "/en/iletisim/" : data.lang === "de" ? "/de/iletisim/" : "/iletisim/", label: data.lang === "de" ? "Kontakt" : data.lang === "en" ? "Contact" : "İletişim" },
    ],
    publishedAt: TODAY,
    source: "seo-geo-plan-phase",
  };
}

function main() {
  const packs = JSON.parse(fs.readFileSync(PACKS, "utf8"));
  let rewritten = 0;
  let added = 0;

  // Faz 0: rewrite thin TR packs in place
  for (const p of packs) {
    if (p.lang !== "tr") continue;
    // also rewrite typo slug if present
    const key = p.slug === "hollywoodlywood-smile-nedir" ? "hollywoodlywood-smile-nedir" : p.slug;
    const rewrite = TR_REWRITES[key] || (p.slug === "hollywoodlywood-smile-nedir" ? TR_REWRITES["hollywoodlywood-smile-nedir"] : null);
    if (!rewrite) continue;
    Object.assign(p, packFrom({ ...rewrite, lang: "tr", slug: p.slug === "hollywoodlywood-smile-nedir" ? "hollywood-smile-nedir" : p.slug, bucket: p.bucket }));
    rewritten++;
  }

  // Remove leftover typo if both exist
  const hasSmile = packs.some((p) => p.lang === "tr" && p.slug === "hollywood-smile-nedir");
  const filtered = packs.filter((p) => !(hasSmile && p.lang === "tr" && p.slug === "hollywoodlywood-smile-nedir"));

  const existing = new Set(filtered.map((p) => `${p.lang}:${p.slug}`));
  const toAdd = [...TRUST_PAGES, AFTERCARE].map(packFrom);
  for (const n of toAdd) {
    if (existing.has(`${n.lang}:${n.slug}`)) continue;
    filtered.push(n);
    added++;
  }

  fs.writeFileSync(PACKS, JSON.stringify(filtered, null, 2) + "\n");
  console.log(`Rewrote ${rewritten} thin TR packs; added ${added} new pages; total ${filtered.length}`);
}

main();
