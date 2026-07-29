/**
 * Rich implant service articles + GEO packs (TR/EN/DE).
 * Run: node scripts/content/write-implant-pack.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const ARTICLES = path.join(ROOT, "src/content/articles.json");
const GEO = path.join(ROOT, "src/content/geo/packs.json");
const GEN = path.join(ROOT, "src/content/generated-blog.json");

const today = new Date().toISOString().slice(0, 10);

const oralArticles = [
  {
    lang: "tr",
    slug: "oral-implantoloji-istanbul-rehberi",
    service: "oral-implantoloji",
    title: "Oral İmplantoloji İstanbul: Kalıcı Diş Çözümü",
    excerpt:
      "İstanbul Üsküdar’da oral implantoloji: tek diş, All-on-4/6, greft ve aynı gün seçenekleri. Ücretsiz foto analiz, şeffaf paket ve VIP koordinasyon.",
    metaDescription:
      "Oral implantoloji İstanbul — MediDent Üsküdar Acıbadem. All-on-4, tek diş implant, greft. Ücretsiz ön değerlendirme ve şeffaf fiyat.",
    coverImage: "services/implant.jpg",
    publishedAt: today,
    faq: [
      {
        q: "Oral implantoloji nedir?",
        a: "Eksik dişlerin yerine çene kemiğine yerleştirilen titanyum implantlar ve üzerlerine sabitlenen protezlerle doğal köke en yakın kalıcı çözümdür.",
      },
      {
        q: "İstanbul’da implant fiyatı nasıl belirlenir?",
        a: "Kemik hacmi, implant sayısı, marka, greft/sinüs ihtiyacı ve protez tipi belirler. Foto analiz sonrası yazılı, şeffaf teklif iletiriz; gizli maliyet istemeyiz.",
      },
      {
        q: "All-on-4 aynı gün diş mümkün mü?",
        a: "Uygun vakalarda aynı gün geçici sabit dişler planlanabilir. Kesin uygunluk 3D görüntüleme ve muayene ile netleşir.",
      },
      {
        q: "Yurt dışından nasıl gelirim?",
        a: "Uçuş tarihinize göre tedavi takvimi, otel ve VIP transfer MediDent hasta koordinasyonuyla ayarlanır. İngilizce/Almanca destek mevcuttur.",
      },
    ],
    html: `<p><strong>Eksik diş</strong> yalnızca estetik değil; çiğneme, konuşma ve komşu dişlerin kaymasını da etkiler. MediDent İstanbul (Üsküdar Acıbadem) oral implantoloji ile tek dişten tam çene restorasyonuna kadar dijital planlı, steril ve şeffaf fiyatlı bir süreç sunar.</p>
<p>İlk adım: diş/çene fotoğraflarınızı WhatsApp’tan gönderin. 24 saat içinde ön değerlendirme, olası protokoller (tek implant, köprü destekli, All-on-4/6) ve <strong>yazılı paket teklifi</strong> hazırlanır.</p>
<ul>
<li>3D / dijital planlama ve steril cerrahi protokol</li>
<li>Tek diş, çoklu implant ve All-on-4 / All-on-6</li>
<li>Gerektiğinde kemik grefti ve sinüs lifting değerlendirmesi</li>
<li>Otel, VIP transfer, tercüman ve yazılı garanti seçenekleri</li>
</ul>
<h2>Kimler için uygun?</h2>
<p>Genel sağlığı uygun, yeterli kemik hacmi olan veya greft ile desteklenebilen erişkin hastalar adaydır. Kontrolsüz sistemik hastalık, aktif enfeksiyon veya ağır sigara kullanımı planı değiştirebilir; bunu muayenede netleştiririz.</p>
<h2>Süreç nasıl ilerler?</h2>
<p><strong>1)</strong> Online foto/analiz → <strong>2)</strong> Klinik muayene + görüntüleme → <strong>3)</strong> Cerrahi implant yerleştirme → <strong>4)</strong> Osseointegrasyon (vakaya göre) → <strong>5)</strong> Sabit protez/kron. Uygun vakalarda immediate loading ile aynı gün geçici diş mümkün olabilir.</p>
<h2>All-on-4 ve All-on-6</h2>
<p>Tam dişsizlikte dört veya altı implant üzerine sabit protez: daha az cerrahi ziyaret, hızlı fonksiyon dönüşü. All-on-6 genellikle daha yüksek stabilite; All-on-4 seçilmiş anatomilerde avantajlıdır. Seçim kemik ve ısırma kuvvetine göre yapılır.</p>
<h2>İstanbul’da neden MediDent?</h2>
<p>Üsküdar Acıbadem lokasyonu, uluslararası hasta deneyimi, şeffaf paket fiyatı ve tedavi sonrası online takip. Amacımız “ucuz vaat” değil; öngörülebilir, güvenli ve belgelenmiş sonuç.</p>
<p><strong>Şimdi başlayın:</strong> Fotoğraflarınızı gönderin — implant mı, All-on-4 mü, greft gerekir mi? Net cevap ve fiyat planı alırsınız.</p>`,
  },
  {
    lang: "en",
    slug: "oral-implantology-istanbul-guide",
    service: "oral-implantoloji",
    title: "Oral Implantology in Istanbul: Lasting Teeth",
    excerpt:
      "Dental implants in Istanbul (Üsküdar): single tooth, All-on-4/6, grafting and same-day options. Free photo review, transparent packages, VIP coordination.",
    metaDescription:
      "Oral implantology Istanbul — MediDent Üsküdar. All-on-4, single implants, bone graft. Free pre-assessment and clear pricing for UK/EU patients.",
    coverImage: "services/implant.jpg",
    publishedAt: today,
    faq: [
      {
        q: "What is oral implantology?",
        a: "Titanium implants placed in the jaw act as artificial roots; fixed teeth on top restore function and aesthetics long-term.",
      },
      {
        q: "How much do dental implants cost in Istanbul?",
        a: "Price depends on bone, number of implants, brand, grafting and the prosthesis. After a free photo review we send a written, itemised quote.",
      },
      {
        q: "Is All-on-4 same-day possible?",
        a: "In suitable cases temporary fixed teeth can be planned the same day. 3D imaging confirms suitability.",
      },
      {
        q: "Can I travel from the UK/EU?",
        a: "Yes. We schedule around flights with hotel, VIP transfer and English/German support via our patient team.",
      },
    ],
    html: `<p><strong>Missing teeth</strong> affect chewing, speech and neighbouring teeth — not only smile aesthetics. At MediDent Istanbul (Üsküdar Acıbadem) oral implantology covers single implants through full-arch All-on-4/6 with digital planning and transparent packages.</p>
<p>Start with photos on WhatsApp. Within 24 hours you receive a free pre-assessment, protocol options and a <strong>written package quote</strong>.</p>
<ul>
<li>3D / digital planning and sterile surgery protocols</li>
<li>Single, multiple and All-on-4 / All-on-6 restorations</li>
<li>Bone graft and sinus lift assessment when needed</li>
<li>Hotel, VIP transfer, interpreter and written warranty options</li>
</ul>
<h2>Who is a candidate?</h2>
<p>Adults in good general health with adequate bone — or bone that can be grafted. Uncontrolled systemic disease or active infection may change the plan; we clarify this at assessment.</p>
<h2>How the process works</h2>
<p><strong>1)</strong> Photo review → <strong>2)</strong> Clinic exam + imaging → <strong>3)</strong> Implant surgery → <strong>4)</strong> Healing / osseointegration → <strong>5)</strong> Final prosthesis. Suitable cases may receive same-day temporary teeth (immediate loading).</p>
<h2>All-on-4 vs All-on-6</h2>
<p>Full-arch fixed teeth on four or six implants. All-on-6 often adds stability; All-on-4 suits selected anatomies. Choice follows bone volume and bite forces.</p>
<h2>Why Istanbul with MediDent?</h2>
<p>Experienced team, Üsküdar Acıbadem location, clear all-inclusive options and remote aftercare — predictable care, not empty “cheap implant” promises.</p>
<p><strong>Ready?</strong> Send photos — we’ll say implant vs All-on-4 and whether grafting is needed, with a clear price plan.</p>`,
  },
  {
    lang: "de",
    slug: "orale-implantologie-istanbul-leitfaden",
    service: "oral-implantoloji",
    title: "Orale Implantologie Istanbul: Dauerhafte Zähne",
    excerpt:
      "Zahnimplantate in Istanbul (Üsküdar): Einzelzahn, All-on-4/6, Knochenaufbau und Same-Day-Optionen. Kostenlose Foto-Analyse, transparente Pakete, VIP-Koordination.",
    metaDescription:
      "Orale Implantologie Istanbul — MediDent Üsküdar. All-on-4, Einzelimplantate, Knochenaufbau. Kostenlose Vorabeinschätzung für Patienten aus DE/AT/CH.",
    coverImage: "services/implant.jpg",
    publishedAt: today,
    faq: [
      {
        q: "Was ist orale Implantologie?",
        a: "Titanimplantate im Kiefer dienen als künstliche Wurzeln; festsitzender Zahnersatz stellt Funktion und Ästhetik dauerhaft wieder her.",
      },
      {
        q: "Was kosten Zahnimplantate in Istanbul?",
        a: "Abhängig von Knochen, Implantatzahl, Marke, Aufbau und Zahnersatz. Nach kostenloser Foto-Prüfung erhalten Sie ein schriftliches, transparentes Angebot.",
      },
      {
        q: "Ist All-on-4 am selben Tag möglich?",
        a: "Bei Eignung können provisorische feste Zähne am selben Tag geplant werden. 3D-Bildgebung bestätigt die Eignung.",
      },
      {
        q: "Anreise aus DE/AT/CH?",
        a: "Ja. Planung um Flüge, Hotel, VIP-Transfer und deutschsprachige Betreuung über unser Patiententeam.",
      },
    ],
    html: `<p><strong>Fehlende Zähne</strong> betreffen Kauen, Sprache und Nachbarzähne — nicht nur die Ästhetik. Bei MediDent Istanbul (Üsküdar Acıbadem) umfasst die orale Implantologie Einzelimplantate bis All-on-4/6 mit digitaler Planung und klaren Paketen.</p>
<p>Start mit Fotos per WhatsApp. Innerhalb von 24 Stunden: kostenlose Vorabeinschätzung, Protokolloptionen und <strong>schriftliches Paketangebot</strong>.</p>
<ul>
<li>3D-/digitale Planung und sterile OP-Protokolle</li>
<li>Einzel-, Mehrfach- und All-on-4-/All-on-6-Versorgung</li>
<li>Knochenaufbau und Sinuslift bei Bedarf</li>
<li>Hotel, VIP-Transfer, Dolmetscher und schriftliche Garantie</li>
</ul>
<h2>Für wen geeignet?</h2>
<p>Erwachsene mit guter Allgemeingesundheit und ausreichendem Knochen — oder aufbaubarem Knochen. Unkontrollierte Systemerkrankungen können den Plan ändern; das klären wir in der Einschätzung.</p>
<h2>Ablauf</h2>
<p><strong>1)</strong> Foto-Check → <strong>2)</strong> Klinik + Bildgebung → <strong>3)</strong> Implantat-OP → <strong>4)</strong> Einheilung → <strong>5)</strong> Finaler Zahnersatz. Geeignete Fälle können same-day Provisorien erhalten.</p>
<h2>All-on-4 vs All-on-6</h2>
<p>Feste Zähne auf vier oder sechs Implantaten. All-on-6 oft stabiler; All-on-4 bei passender Anatomie vorteilhaft. Entscheidung nach Knochen und Bisskraft.</p>
<h2>Warum MediDent Istanbul?</h2>
<p>Erfahrenes Team, Lage Üsküdar Acıbadem, transparente All-inclusive-Optionen und Online-Nachsorge — planbare Versorgung statt leerer Billigversprechen.</p>
<p><strong>Starten?</strong> Fotos senden — Implantat oder All-on-4, Aufbau nötig? Klare Antwort inkl. Preisplan.</p>`,
  },
];

function enrichImplantTherapy(html, lang) {
  const extras = {
    tr: `<h2>İstanbul’da implant turizmi: ne beklemelisiniz?</h2>
<p>Kısa ziyaretlerde süreç; online planlama, cerrahi günü ve protez aşaması olarak takvimlenir. Paketlerde klinik tedavi yanında otel ve VIP transfer talep edilebilir. Fiyat; implant adedi, greft ve protez tipine göre değişir — teklifte kalem kalem görürsünüz.</p>
<h2>İmplant mı, köprü mü?</h2>
<p>Köprü komşu dişlerin küçültülmesini gerektirebilir. İmplant komşu dişlere dokunmadan eksik dişi bağımsız restore eder. Uzun vadede kemik hacminin korunmasına da katkı sağlar. Karar muayene ve bütçe ile birlikte verilir.</p>
<p><strong>Ücretsiz adım:</strong> Fotoğraflarınızı gönderin; MediDent İstanbul 24 saat içinde uygunluk ve şeffaf fiyat özeti iletsin.</p>`,
    en: `<h2>Dental implant tourism in Istanbul</h2>
<p>For short trips we schedule online planning, surgery day and prosthetic stages. Packages can include hotel and VIP transfer. Cost varies by implant count, grafting and prosthesis — your quote is itemised.</p>
<h2>Implant or bridge?</h2>
<p>A bridge often needs neighbouring teeth prepared. An implant restores the gap independently and helps preserve bone. Choice depends on clinical findings and budget.</p>
<p><strong>Free next step:</strong> Send photos — MediDent Istanbul replies within 24 hours with suitability and a clear price outline.</p>`,
    de: `<h2>Zahntourismus Implantate in Istanbul</h2>
<p>Für kurze Aufenthalte planen wir Online-Check, OP-Tag und Prothetik. Pakete können Hotel und VIP-Transfer umfassen. Kosten je nach Anzahl, Aufbau und Zahnersatz — Angebot mit Positionen.</p>
<h2>Implantat oder Brücke?</h2>
<p>Brücken erfordern oft das Beschleifen von Nachbarzähnen. Implantate schließen die Lücke unabhängig und stützen den Knochen. Entscheidung nach Befund und Budget.</p>
<p><strong>Nächster Schritt kostenlos:</strong> Fotos senden — MediDent Istanbul meldet sich in 24 Stunden mit Eignung und klarem Preisrahmen.</p>`,
  };
  if (/İstanbul’da implant turizmi|Dental implant tourism|Zahntourismus Implantate/i.test(html)) return html;
  return html + (extras[lang] || extras.en);
}

function geoPack({ lang, slug, bucket, question, title, direct_answer, bullets, faq, links }) {
  const prefix = lang === "tr" ? "" : `/${lang}`;
  return {
    lang,
    slug,
    bucket: bucket || "implant",
    question,
    title,
    direct_answer,
    bullets,
    faq,
    internal_links: links || [
      { href: `${prefix}/hizmetler/oral-implantoloji/`, label: lang === "de" ? "Orale Implantologie" : lang === "en" ? "Oral implantology" : "Oral implantoloji" },
      { href: `${prefix}/hizmetler/implantoloji-implant-tedavisi/`, label: lang === "de" ? "Implantatbehandlung" : lang === "en" ? "Implant treatment" : "İmplant tedavisi" },
      { href: `${prefix}/iletisim/`, label: lang === "de" ? "Kontakt" : lang === "en" ? "Contact" : "İletişim" },
      { href: `${prefix}/geo/`, label: "GEO" },
    ],
    coverImage: "services/implant.jpg",
    publishedAt: today,
    source: "implant-pack",
  };
}

const geoPacks = [
  // --- definitions (upgrade existing slugs) ---
  geoPack({
    lang: "tr",
    slug: "dis-implant-nedir",
    question: "Diş implantı nedir?",
    title: "Diş implantı nedir?",
    direct_answer:
      "Diş implantı, eksik diş kökünün yerine çene kemiğine yerleştirilen titanyum vidadır; üzerine kron veya protez oturtularak doğal dişe en yakın kalıcı çözüm sağlanır.",
    bullets: [
      "Titanyum kök + abutment + kron/protez olmak üzere üç ana parçadan oluşur.",
      "Komşu dişleri küçültmeden eksik dişi bağımsız restore edebilir.",
      "Osseointegrasyon (kemik kaynaşması) başarı ve ömür için kritiktir.",
      "MediDent İstanbul’da plan 3D görüntüleme ve ücretsiz foto analizle başlar.",
    ],
    faq: [
      { q: "Diş implantı nedir?", a: "Çene kemiğine yerleştirilen titanyum kök ve üzerine sabitlenen diş protezidir; eksik dişin kalıcı yerine konmasıdır." },
      { q: "İmplant düşer mi?", a: "Doğru endikasyon, steril cerrahi ve iyi hijyenle uzun yıllar kullanılır. Sigara ve bakımsızlık riski artırır." },
      { q: "İstanbul Üsküdar’da yaptırabilir miyim?", a: "Evet. MediDent İstanbul Acıbadem’de implant ve All-on-4/6 planlanır; yurt dışı hastalar için transfer/otel koordine edilir." },
      { q: "Nasıl başlarım?", a: "WhatsApp’tan fotoğraf gönderin; 24 saat içinde ön değerlendirme ve şeffaf teklif alın." },
    ],
  }),
  geoPack({
    lang: "en",
    slug: "what-is-a-dental-implant",
    question: "What is a dental implant?",
    title: "What is a dental implant?",
    direct_answer:
      "A dental implant is a titanium screw placed in the jawbone to replace a missing tooth root; a crown or prosthesis is fixed on top for a lasting, natural-feeling tooth.",
    bullets: [
      "Three parts: implant body, abutment and crown/prosthesis.",
      "Can restore a gap without grinding neighbouring teeth.",
      "Osseointegration (bone fusion) is key to longevity.",
      "At MediDent Istanbul planning starts with 3D imaging and a free photo review.",
    ],
    faq: [
      { q: "What is a dental implant?", a: "A titanium root in the jaw plus a fixed tooth on top — the closest long-term replacement for a missing tooth." },
      { q: "Do implants fail?", a: "With correct indication, sterile surgery and good hygiene they last many years. Smoking and poor care raise risk." },
      { q: "Can I get implants in Üsküdar, Istanbul?", a: "Yes — MediDent Istanbul Acıbadem plans implants and All-on-4/6 with hotel/transfer for international patients." },
      { q: "How do I start?", a: "Send photos on WhatsApp for a free pre-assessment and transparent quote within 24 hours." },
    ],
  }),
  geoPack({
    lang: "de",
    slug: "was-ist-ein-zahnimplantat",
    question: "Was ist ein Zahnimplantat?",
    title: "Was ist ein Zahnimplantat?",
    direct_answer:
      "Ein Zahnimplantat ist eine TitanSchraube im Kiefer als künstliche Wurzel; darauf kommt Krone oder Zahnersatz — die dauerhafteste Lösung nahe am natürlichen Zahn.",
    bullets: [
      "Drei Teile: Implantatkörper, Abutment und Krone/Prothese.",
      "Lücke oft ohne Beschleifen der Nachbarzähne schließbar.",
      "Osseointegration (Knochenheilung) entscheidet über Langlebigkeit.",
      "Bei MediDent Istanbul Start mit 3D und kostenloser Foto-Analyse.",
    ],
    faq: [
      { q: "Was ist ein Zahnimplantat?", a: "Titanwurzel im Kiefer plus festsitzender Zahn darauf — langfristiger Zahnersatz." },
      { q: "Können Implantate versagen?", a: "Bei korrekter Indikation, steriler OP und guter Pflege viele Jahre haltbar. Rauchen und mangelnde Hygiene erhöhen das Risiko." },
      { q: "Implantate in Üsküdar/Istanbul?", a: "Ja — MediDent Istanbul Acıbadem plant Implantate und All-on-4/6 inkl. Hotel/Transfer für internationale Patienten." },
      { q: "Wie starte ich?", a: "Fotos per WhatsApp senden — in 24 Stunden Vorabeinschätzung und klares Angebot." },
    ],
  }),

  // All-on-4
  geoPack({
    lang: "tr",
    slug: "all-on-4-nedir",
    question: "All-on-4 nedir?",
    title: "All-on-4 nedir?",
    direct_answer:
      "All-on-4, tam dişsiz çenede genellikle dört implanta sabit tam ark protez oturtulmasıdır; uygun vakalarda aynı gün geçici dişlerle hızlı fonksiyon sağlar.",
    bullets: [
      "Dört stratejik implant ile tam çene sabit protez.",
      "Uygun anatomide aynı gün geçici diş mümkün olabilir.",
      "All-on-6 daha fazla implantla ek stabilite sunabilir.",
      "MediDent’te seçim 3D kemik analiziyle yapılır.",
    ],
    faq: [
      { q: "All-on-4 nedir?", a: "Tam dişsizlikte dört implant üzerine sabit protez protokolüdür." },
      { q: "All-on-4 mü All-on-6 mı?", a: "Kemik hacmi ve ısırma kuvvetine göre; All-on-6 çoğu vakada ek dayanım sağlar." },
      { q: "Kaç günde biter?", a: "Cerrahi + geçici aynı gün/kısa ziyaret; kalıcı protez iyileşmeye göre planlanır." },
      { q: "İstanbul’da paket var mı?", a: "Evet — klinik + opsiyonel otel/transfer. Foto analizle yazılı teklif." },
    ],
  }),
  geoPack({
    lang: "en",
    slug: "what-is-all-on-4",
    question: "What is All-on-4?",
    title: "What is All-on-4?",
    direct_answer:
      "All-on-4 places a full-arch fixed prosthesis on typically four implants; suitable cases may receive temporary teeth the same day.",
    bullets: [
      "Four strategically angled implants support a full arch.",
      "Same-day temporaries possible when bone and bite allow.",
      "All-on-6 can add stability with two extra implants.",
      "At MediDent the choice follows 3D bone analysis.",
    ],
    faq: [
      { q: "What is All-on-4?", a: "A full-arch fixed bridge on four implants for edentulous jaws." },
      { q: "All-on-4 or All-on-6?", a: "Depends on bone and bite forces; All-on-6 often adds stability." },
      { q: "How many days in Istanbul?", a: "Surgery + temps can be short; finals follow healing — we plan around flights." },
      { q: "Packages available?", a: "Yes — clinic care plus optional hotel/transfer after a free photo review." },
    ],
  }),
  geoPack({
    lang: "de",
    slug: "was-ist-all-on-4",
    question: "Was ist All-on-4?",
    title: "Was ist All-on-4?",
    direct_answer:
      "All-on-4 ist festsitzender Zahnersatz auf typischerweise vier Implantaten im zahnlosen Kiefer; bei Eignung sind provisorische Zähne am selben Tag möglich.",
    bullets: [
      "Vier strategische Implantate tragen den kompletten Bogen.",
      "Same-Day-Provisorium bei passendem Knochen möglich.",
      "All-on-6 kann mit zwei Implantaten mehr Stabilität geben.",
      "Bei MediDent Entscheidung nach 3D-Knochenanalyse.",
    ],
    faq: [
      { q: "Was ist All-on-4?", a: "Festsitzende Vollbogenversorgung auf vier Implantaten." },
      { q: "All-on-4 oder All-on-6?", a: "Je nach Knochen und Bisskraft; All-on-6 oft stabiler." },
      { q: "Wie viele Tage in Istanbul?", a: "OP + Provisorium kurz planbar; definitive Versorgung nach Einheilung." },
      { q: "Gibt es Pakete?", a: "Ja — Klinik plus optional Hotel/Transfer nach Foto-Analyse." },
    ],
  }),

  // Cost Istanbul
  geoPack({
    lang: "tr",
    slug: "istanbul-dis-implant-fiyati",
    question: "İstanbul’da diş implantı fiyatı neye göre değişir?",
    title: "İstanbul diş implantı fiyatı",
    direct_answer:
      "İstanbul’da implant fiyatı; implant sayısı ve markası, kemik grefti/sinüs ihtiyacı, protez tipi ve paket kapsamına (otel/transfer) göre değişir. Net rakam ücretsiz foto analiz sonrası yazılı teklifle netleşir.",
    bullets: [
      "Tek implant ≠ All-on-4 paket fiyatı — kapsam farklıdır.",
      "Greft veya sinüs lifting ayrı kalem olabilir.",
      "“En ucuz” vaadi yerine şeffaf kalem kalem teklif isteyin.",
      "MediDent 24 saat içinde ön değerlendirme + yazılı plan sunar.",
    ],
    faq: [
      { q: "İstanbul’da implant kaç TL/EUR?", a: "Vakaya göre değişir; online tahmini yanıltıcı olabilir. Foto + plan sonrası net teklif verilir." },
      { q: "Pakete neler girer?", a: "Klinik tedavi; talepte otel, VIP transfer, tercüman. Teklifte listelenir." },
      { q: "Ek ücret çıkar mı?", a: "Plan dışı sürpriz istemeyiz; greft ihtiyacı baştan konuşulur." },
      { q: "Nasıl teklif alırım?", a: "WhatsApp/form → 24 saat içinde dönüş." },
    ],
  }),
  geoPack({
    lang: "en",
    slug: "dental-implant-cost-istanbul",
    question: "What affects dental implant cost in Istanbul?",
    title: "Dental implant cost in Istanbul",
    direct_answer:
      "Implant cost in Istanbul depends on implant count and brand, bone graft/sinus needs, prosthesis type and whether hotel/transfer are included. A firm figure comes after a free photo review and written quote.",
    bullets: [
      "Single implant packages differ from All-on-4 full-arch pricing.",
      "Grafting or sinus lift may be separate line items.",
      "Prefer itemised quotes over “cheapest in Turkey” claims.",
      "MediDent sends a pre-assessment and written plan within 24 hours.",
    ],
    faq: [
      { q: "How much do implants cost in Istanbul?", a: "Case-dependent; online averages mislead. Photos + plan produce a real quote." },
      { q: "What’s in the package?", a: "Clinical care; optional hotel, VIP transfer, interpreter — listed in the quote." },
      { q: "Hidden fees?", a: "We aim for no surprises; grafting needs are discussed upfront." },
      { q: "How do I get a quote?", a: "WhatsApp/form — reply within 24 hours." },
    ],
  }),
  geoPack({
    lang: "de",
    slug: "zahnimplantat-kosten-istanbul",
    question: "Wovon hängen Zahnimplantat-Kosten in Istanbul ab?",
    title: "Zahnimplantat Kosten Istanbul",
    direct_answer:
      "Die Kosten hängen von Implantatzahl und -marke, Knochenaufbau/Sinuslift, Zahnersatz und Paketumfang (Hotel/Transfer) ab. Der feste Betrag folgt nach kostenloser Foto-Prüfung und schriftlichem Angebot.",
    bullets: [
      "Einzelimplantat ≠ All-on-4-Paketpreis.",
      "Aufbau/Sinuslift können Extra-Positionen sein.",
      "Lieber transparentes Angebot als „billigste Türkei“-Werbung.",
      "MediDent: Vorabeinschätzung + schriftlicher Plan in 24 Std.",
    ],
    faq: [
      { q: "Was kosten Implantate in Istanbul?", a: "Fallabhängig; Online-Durchschnitte täuschen. Fotos + Plan ergeben das echte Angebot." },
      { q: "Was ist im Paket?", a: "Klinik; optional Hotel, VIP-Transfer, Dolmetscher — im Angebot gelistet." },
      { q: "Versteckte Kosten?", a: "Wir wollen keine Überraschungen; Aufbaubedarf wird vorab besprochen." },
      { q: "Wie Angebot holen?", a: "WhatsApp/Formular — Antwort in 24 Stunden." },
    ],
  }),

  // Implant vs bridge
  geoPack({
    lang: "tr",
    slug: "implant-mi-kopru-mu",
    question: "İmplant mı köprü mü?",
    title: "İmplant mı köprü mü?",
    direct_answer:
      "İmplant eksik dişi komşulara dokunmadan restore eder ve kemiği destekler; köprü ise çoğu zaman yan dişlerin küçültülmesini gerektirir. Seçim kemik, bütçe ve komşu diş durumuna göre yapılır.",
    bullets: [
      "İmplant: bağımsız restorasyon, kemik korunmasına katkı.",
      "Köprü: daha hızlı/uygun olabilir ama sağlıklı dişler aşındırılabilir.",
      "Uzun vadede hijyen ve bakım planı her iki seçenekte kritiktir.",
      "MediDent’te avantaj–dezavantaj foto analiz sonrası anlatılır.",
    ],
    faq: [
      { q: "Hangisi daha iyi?", a: "Tek cevap yok; klinik bulgu ve beklentiye göre. Birçok vakada implant uzun vadede avantajlıdır." },
      { q: "Köprü daha ucuz mu?", a: "Başlangıç maliyeti düşük olabilir; ileride değişiklik/yenileme gerekebilir." },
      { q: "İmplant herkese olur mu?", a: "Yeterli kemik veya greft ile çoğu erişkine; sağlık öyküsü değerlendirilir." },
      { q: "Ne yapmalıyım?", a: "Foto gönderin — size özel karşılaştırma ve teklif çıkaralım." },
    ],
  }),
  geoPack({
    lang: "en",
    slug: "dental-implant-vs-bridge",
    question: "Dental implant vs bridge — which is better?",
    title: "Dental implant vs bridge",
    direct_answer:
      "An implant restores a missing tooth without grinding neighbours and helps preserve bone; a bridge often needs adjacent teeth prepared. Choice depends on bone, budget and neighbouring teeth.",
    bullets: [
      "Implant: independent restoration, bone support benefit.",
      "Bridge: sometimes faster/cheaper upfront but may alter healthy teeth.",
      "Long-term hygiene matters for both.",
      "MediDent explains pros/cons after a free photo review.",
    ],
    faq: [
      { q: "Which is better?", a: "No universal answer — clinical findings decide. Many cases favour implants long-term." },
      { q: "Is a bridge cheaper?", a: "Often lower upfront; may need replacement later." },
      { q: "Can everyone get implants?", a: "Most adults with adequate or graftable bone after health review." },
      { q: "What should I do?", a: "Send photos for a personalised comparison and quote." },
    ],
  }),
  geoPack({
    lang: "de",
    slug: "implantat-oder-bruecke",
    question: "Implantat oder Brücke — was ist besser?",
    title: "Implantat oder Brücke",
    direct_answer:
      "Ein Implantat schließt die Lücke ohne Beschleifen der Nachbarn und stützt den Knochen; eine Brücke erfordert oft das Präparieren benachbarter Zähne. Entscheidung nach Knochen, Budget und Nachbarzähnen.",
    bullets: [
      "Implantat: unabhängige Versorgung, Knochenerhalt.",
      "Brücke: oft günstiger/schneller, kann aber gesunde Zähne belasten.",
      "Langfristige Hygiene ist bei beiden entscheidend.",
      "MediDent erklärt Vor-/Nachteile nach Foto-Analyse.",
    ],
    faq: [
      { q: "Was ist besser?", a: "Keine Pauschalantwort — Befund entscheidet. Viele Fälle langfristig für Implantate." },
      { q: "Ist die Brücke günstiger?", a: "Oft niedrigere Einstiegskosten; später ggf. Erneuerung." },
      { q: "Jeder für Implantate geeignet?", a: "Die meisten Erwachsenen mit ausreichendem/aufbaubarem Knochen." },
      { q: "Was tun?", a: "Fotos senden — individueller Vergleich und Angebot." },
    ],
  }),

  // Bone graft / sinus
  geoPack({
    lang: "tr",
    slug: "kemik-grefti-ve-sinus-lifting",
    question: "Kemik grefti ve sinüs lifting nedir?",
    title: "Kemik grefti ve sinüs lifting",
    direct_answer:
      "Kemik grefti, implant için yetersiz çene kemiğini güçlendirir; sinüs lifting üst çenede sinüs tabanını yükselterek implant yüksekliği kazandırır. İhtiyaç 3D tomografi ile anlaşılır.",
    bullets: [
      "Yetersiz kemik = greft veya alternatif protokol (ör. kısa/açılı implant, All-on-4).",
      "Sinüs lifting özellikle üst azı bölgesinde gündeme gelir.",
      "Bazı greftler implantla aynı seansta, bazıları ayrı aşamada yapılır.",
      "MediDent’te greft ihtiyacı teklifte peşinen belirtilir.",
    ],
    faq: [
      { q: "Greft şart mı?", a: "Hayır — yalnızca kemik yetersizse. Tomografi karar verir." },
      { q: "Ağrılı mı?", a: "Lokal anestezi/sedasyon ile konforlu yönetilir; şişlik olabilir." },
      { q: "Süre uzar mı?", a: "Ayrı greft aşaması iyileşme ekleyebilir; aynı seansta da mümkün olabilir." },
      { q: "Fiyata etkisi?", a: "Ayrı kalem olabilir; yazılı teklifte görünür." },
    ],
  }),
  geoPack({
    lang: "en",
    slug: "bone-graft-sinus-lift-istanbul",
    question: "What are bone graft and sinus lift for implants?",
    title: "Bone graft & sinus lift in Istanbul",
    direct_answer:
      "A bone graft builds jawbone for stable implants; a sinus lift raises the sinus floor in the upper jaw to create implant height. Need is confirmed with 3D CBCT.",
    bullets: [
      "Low bone may mean grafting or alternatives (short/angled implants, All-on-4).",
      "Sinus lifts are common in the upper molar area.",
      "Some grafts are same-session; others staged.",
      "MediDent lists graft needs transparently in your quote.",
    ],
    faq: [
      { q: "Is grafting always required?", a: "No — only if bone is insufficient on CBCT." },
      { q: "Does it hurt?", a: "Done under local anaesthetic/sedation; swelling is possible." },
      { q: "Does it delay treatment?", a: "Staged grafts add healing time; some are simultaneous." },
      { q: "Cost impact?", a: "May be a separate line — shown in the written quote." },
    ],
  }),
  geoPack({
    lang: "de",
    slug: "knochenaufbau-sinuslift-istanbul",
    question: "Was sind Knochenaufbau und Sinuslift?",
    title: "Knochenaufbau & Sinuslift Istanbul",
    direct_answer:
      "Knochenaufbau verstärkt den Kiefer für stabile Implantate; der Sinuslift hebt den Kieferhöhlenboden im Oberkiefer an, um Implantathöhe zu gewinnen. Bedarf zeigt die 3D-Aufnahme.",
    bullets: [
      "Wenig Knochen: Aufbau oder Alternativen (kurze/gewinkelte Implantate, All-on-4).",
      "Sinuslift häufig im oberen Molarenbereich.",
      "Aufbau teils in derselben Sitzung, teils zweizeitig.",
      "MediDent weist Aufbaubedarf im Angebot aus.",
    ],
    faq: [
      { q: "Immer Aufbau nötig?", a: "Nein — nur bei unzureichendem Knochen laut CBCT." },
      { q: "Tut es weh?", a: "Unter lokaler Betäubung/Sedierung; Schwellung möglich." },
      { q: "Verzögert es?", a: "Zweiteilig ja; manchmal simultan möglich." },
      { q: "Kosten?", a: "Oft Extra-Position — im schriftlichen Angebot sichtbar." },
    ],
  }),

  // Üsküdar / clinic GEO
  geoPack({
    lang: "tr",
    slug: "uskudar-acibadem-dis-implant",
    question: "Üsküdar Acıbadem’de diş implantı nerede yaptırılır?",
    title: "Üsküdar Acıbadem diş implantı",
    direct_answer:
      "MediDent İstanbul, Üsküdar Acıbadem’de oral implantoloji ve All-on-4/6 sunar; havalimanı erişimi kolaydır, uluslararası hastalar için otel ve VIP transfer koordine edilir.",
    bullets: [
      "Adres: Acıbadem Cd. 195F, Üsküdar / İstanbul.",
      "Tek diş, çoklu implant ve tam çene protokollerı.",
      "Ücretsiz foto analiz + şeffaf paket teklifi.",
      "EN/DE hasta koordinasyonu mevcuttur.",
    ],
    faq: [
      { q: "Konum nedir?", a: "Acıbadem, Acıbadem Cd. 195F, 34718 Üsküdar/İstanbul." },
      { q: "Randevu nasıl?", a: "WhatsApp veya web formu — 24 saat içinde dönüş." },
      { q: "Yurt dışı hasta?", a: "Evet; transfer ve konaklama planlanır." },
      { q: "Hangi implantlar?", a: "Vakaya göre tek/çoklu/All-on-4/6 — muayene sonrası netleşir." },
    ],
  }),
  geoPack({
    lang: "en",
    slug: "dental-implants-uskudar-acibadem",
    question: "Where to get dental implants in Üsküdar Acıbadem?",
    title: "Dental implants Üsküdar Acıbadem",
    direct_answer:
      "MediDent Istanbul in Üsküdar Acıbadem offers oral implantology and All-on-4/6 with easy airport access plus optional hotel and VIP transfer for international patients.",
    bullets: [
      "Clinic: Acıbadem Cd. 195F, Üsküdar / Istanbul.",
      "Single, multiple and full-arch implant protocols.",
      "Free photo review and transparent package quotes.",
      "English/German patient coordination available.",
    ],
    faq: [
      { q: "Address?", a: "Acıbadem, Acıbadem Cd. 195F, 34718 Üsküdar/Istanbul." },
      { q: "How to book?", a: "WhatsApp or web form — reply within 24 hours." },
      { q: "International patients?", a: "Yes — transfer and hotel can be arranged." },
      { q: "Which treatments?", a: "Single/multiple/All-on-4/6 after clinical assessment." },
    ],
  }),
  geoPack({
    lang: "de",
    slug: "zahnimplantate-uskudar-acibadem",
    question: "Zahnimplantate in Üsküdar Acıbadem — wo?",
    title: "Zahnimplantate Üsküdar Acıbadem",
    direct_answer:
      "MediDent Istanbul in Üsküdar Acıbadem bietet orale Implantologie und All-on-4/6 mit guter Flughafenanbindung sowie optional Hotel und VIP-Transfer für internationale Patienten.",
    bullets: [
      "Adresse: Acıbadem Cd. 195F, Üsküdar / Istanbul.",
      "Einzel-, Mehrfach- und Vollbogen-Protokolle.",
      "Kostenlose Foto-Analyse und transparente Pakete.",
      "Deutschsprachige Patientenkoordination möglich.",
    ],
    faq: [
      { q: "Adresse?", a: "Acıbadem, Acıbadem Cd. 195F, 34718 Üsküdar/Istanbul." },
      { q: "Termin?", a: "WhatsApp oder Formular — Antwort in 24 Stunden." },
      { q: "Aus DE/AT/CH?", a: "Ja — Transfer und Hotel planbar." },
      { q: "Welche Behandlungen?", a: "Einzel/Mehrfach/All-on-4/6 nach Einschätzung." },
    ],
  }),

  // Same-day upgrades (keep slugs)
  geoPack({
    lang: "tr",
    slug: "1-gunde-implant-nedir",
    question: "1 günde implant nedir?",
    title: "1 günde implant nedir?",
    direct_answer:
      "1 günde implant (immediate loading), uygun vakalarda implantın yerleştirildiği gün geçici dişlerin de takılabilmesidir; herkese uygulanmaz, kemik ve ısırma kuvveti uygun olmalıdır.",
    bullets: [
      "Aynı gün geçici sabit diş = sosyal hayata hızlı dönüş.",
      "Kalıcı protez çoğu zaman iyileşme sonrası planlanır.",
      "Uygun değilse klasik aşamalı protokol daha güvenlidir.",
      "MediDent uygunluğu 3D ve muayene ile netleştirir.",
    ],
    faq: [
      { q: "Herkese olur mu?", a: "Hayır — yalnızca uygun kemik ve oklüzyonda." },
      { q: "Kalıcı diş aynı gün mü?", a: "Genelde geçici; kalıcı iyileşmeye bağlıdır." },
      { q: "Riskli mi?", a: "Doğru endikasyonda güvenlidir; zoraki uygulama riski artırır." },
      { q: "Nasıl öğrenirim?", a: "Foto + tomografi planı ile net cevap." },
    ],
  }),
  geoPack({
    lang: "en",
    slug: "same-day-implants-istanbul",
    question: "What are same-day dental implants in Istanbul?",
    title: "Same-day dental implants Istanbul",
    direct_answer:
      "Same-day (immediate loading) implants can receive temporary teeth on the placement day in suitable cases; not everyone qualifies — bone and bite must allow it.",
    bullets: [
      "Same-day temps = faster social confidence.",
      "Finals usually after healing.",
      "If unsuitable, staged protocols are safer.",
      "MediDent confirms suitability with 3D and exam.",
    ],
    faq: [
      { q: "For everyone?", a: "No — only with adequate bone and occlusion." },
      { q: "Finals same day?", a: "Usually temporaries; finals after healing." },
      { q: "Risky?", a: "Safe with correct indication; forcing it raises risk." },
      { q: "How to know?", a: "Photos + planned CBCT give a clear answer." },
    ],
  }),
  geoPack({
    lang: "de",
    slug: "sofortimplantate-istanbul",
    question: "Was sind Sofortimplantate in Istanbul?",
    title: "Sofortimplantate Istanbul",
    direct_answer:
      "Sofortbelastung bedeutet: bei Eignung können am OP-Tag Provisorien gesetzt werden; nicht für jeden geeignet — Knochen und Biss müssen passen.",
    bullets: [
      "Same-Day-Provisorium = schnellere soziale Sicherheit.",
      "Definitive Zähne meist nach Einheilung.",
      "Ohne Eignung ist zweizeitig sicherer.",
      "MediDent klärt Eignung mit 3D und Untersuchung.",
    ],
    faq: [
      { q: "Für jeden?", a: "Nein — nur bei ausreichendem Knochen und passender Okklusion." },
      { q: "Endgültige Zähne sofort?", a: "Meist Provisorium; Definitiv nach Heilung." },
      { q: "Risiko?", a: "Bei korrekter Indikation sicher; erzwingen erhöht Risiko." },
      { q: "Wie wissen?", a: "Fotos + geplante CBCT geben klare Antwort." },
    ],
  }),
];

function upsertBySlugLang(list, items) {
  const map = new Map(list.map((x) => [`${x.lang}::${x.slug}`, x]));
  for (const it of items) map.set(`${it.lang}::${it.slug}`, it);
  return [...map.values()];
}

function main() {
  const articles = JSON.parse(fs.readFileSync(ARTICLES, "utf8"));
  // Remove old oral if any, then add
  let nextArticles = articles.filter((a) => a.service !== "oral-implantoloji" || !a.slug.includes("oral-implant"));
  // also drop any previous oral guide slugs
  nextArticles = nextArticles.filter(
    (a) =>
      ![
        "oral-implantoloji-istanbul-rehberi",
        "oral-implantology-istanbul-guide",
        "orale-implantologie-istanbul-leitfaden",
      ].includes(a.slug)
  );
  nextArticles = [...oralArticles, ...nextArticles];

  for (const a of nextArticles) {
    if (a.service === "implantoloji-implant-tedavisi" && a.html) {
      a.html = enrichImplantTherapy(a.html, a.lang);
      if (!a.coverImage) a.coverImage = "services/implant.jpg";
    }
  }

  fs.writeFileSync(ARTICLES, JSON.stringify(nextArticles, null, 2));
  console.log("articles:", nextArticles.length, "oral:", nextArticles.filter((a) => a.service === "oral-implantoloji").length);

  // Unbind thin generated blogs from oral-implantoloji so base articles win cleanly
  if (fs.existsSync(GEN)) {
    const gen = JSON.parse(fs.readFileSync(GEN, "utf8"));
    let changed = 0;
    for (const g of gen) {
      if (g.service === "oral-implantoloji") {
        g.service = null;
        changed++;
      }
    }
    fs.writeFileSync(GEN, JSON.stringify(gen, null, 2));
    console.log("cleared oral service on generated blogs:", changed);
  }

  const geo = JSON.parse(fs.readFileSync(GEO, "utf8"));
  const merged = upsertBySlugLang(geo, geoPacks);
  fs.writeFileSync(GEO, JSON.stringify(merged, null, 2));
  console.log("geo packs:", merged.length, "implant-pack:", merged.filter((g) => g.source === "implant-pack").length);
}

main();
