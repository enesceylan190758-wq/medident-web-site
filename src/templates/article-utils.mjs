// Normalize article HTML + assign default covers for blog/service pages.
import { serviceImages } from "../data/content.mjs";

/** Turn legacy <p><strong>Heading</strong></p> into <h2> and drop duplicate title. */
export function formatArticleHtml(html = "", title = "") {
  if (!html) return "";
  let out = html
    .replace(/<p>\s*<strong>\s*([^<]{3,120}?)\s*<\/strong>\s*<\/p>/gi, "<h2>$1</h2>")
    .replace(/<p>\s*<b>\s*([^<]{3,120}?)\s*<\/b>\s*<\/p>/gi, "<h2>$1</h2>")
    .replace(/\s+style="[^"]*"/gi, "")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();

  if (title) {
    const esc = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`^<p>\\s*${esc}\\s*</p>`, "i"), "").trim();
    out = out.replace(new RegExp(`^<h2>\\s*${esc}\\s*</h2>`, "i"), "").trim();
  }
  return out;
}

export function articleCover(article) {
  if (article?.coverImage) return article.coverImage;
  if (article?.service && serviceImages[article.service]) return serviceImages[article.service];
  return "services/klinik.jpg";
}

export const blogCopy = {
  tr: {
    eyebrow: "MediDent Rehberi",
    trust: ["Ücretsiz foto analiz", "24 saat içinde teklif", "VIP paket seçenekleri", "Üsküdar Acıbadem"],
    midTitle: "Bu tedavi sizin için uygun mu?",
    midLead: "Diş fotoğraflarınızı WhatsApp’tan gönderin; hekim ekibimiz ücretsiz ön değerlendirme ve şeffaf fiyat planı hazırlasın.",
    midCta: "Ücretsiz Değerlendirme İste",
    midWa: "WhatsApp’tan Yaz",
    benefitsTitle: "Neden MediDent İstanbul?",
    benefits: [
      "Şeffaf, her şey dâhil paket fiyatı — sürpriz yok",
      "Dijital planlama + steril modern klinik",
      "Otel, VIP transfer ve tercüman koordinasyonu",
      "Yazılı garanti ve tedavi sonrası online takip",
    ],
    relatedTitle: "İlgili tedavi",
    endTitle: "Bir sonraki adım: ücretsiz konsültasyon",
    endLead: "Formu doldurun veya WhatsApp’tan yazın. 24 saat içinde kişiye özel planınızı iletelim.",
    readMins: (n) => `${n} dk okuma`,
    faqTitle: "Sık sorulanlar",
    indexCta: "Tedaviye başla",
  },
  en: {
    eyebrow: "MediDent Guide",
    trust: ["Free photo review", "Quote within 24h", "VIP package options", "Üsküdar Acıbadem"],
    midTitle: "Is this treatment right for you?",
    midLead: "Send a few photos on WhatsApp — our clinical team prepares a free pre-assessment and transparent plan.",
    midCta: "Request free assessment",
    midWa: "Message on WhatsApp",
    benefitsTitle: "Why MediDent Istanbul?",
    benefits: [
      "Transparent all-inclusive packages — no surprises",
      "Digital planning + sterile modern clinic",
      "Hotel, VIP transfer and interpreter coordination",
      "Written warranty and remote aftercare",
    ],
    relatedTitle: "Related treatment",
    endTitle: "Next step: free consultation",
    endLead: "Fill the form or WhatsApp us. We’ll send your personalised plan within 24 hours.",
    readMins: (n) => `${n} min read`,
    faqTitle: "FAQ",
    indexCta: "Start treatment",
  },
  de: {
    eyebrow: "MediDent Ratgeber",
    trust: ["Kostenlose Foto-Analyse", "Angebot in 24 Std.", "VIP-Paketoptionen", "Üsküdar Acıbadem"],
    midTitle: "Ist diese Behandlung für Sie geeignet?",
    midLead: "Senden Sie Fotos per WhatsApp — unser Team erstellt eine kostenlose Vorabeinschätzung und einen klaren Plan.",
    midCta: "Kostenlose Einschätzung",
    midWa: "Per WhatsApp schreiben",
    benefitsTitle: "Warum MediDent Istanbul?",
    benefits: [
      "Transparente All-inclusive-Pakete — ohne Überraschungen",
      "Digitale Planung + sterile moderne Klinik",
      "Hotel, VIP-Transfer und Dolmetscher",
      "Schriftliche Garantie und Online-Nachsorge",
    ],
    relatedTitle: "Zugehörige Behandlung",
    endTitle: "Nächster Schritt: kostenlose Beratung",
    endLead: "Formular ausfüllen oder WhatsApp — innerhalb von 24 Stunden Ihren Plan erhalten.",
    readMins: (n) => `${n} Min. Lesezeit`,
    faqTitle: "Häufige Fragen",
    indexCta: "Behandlung starten",
  },
};

/** Default sales FAQs when article has none */
export function defaultArticleFaqs(lang, title) {
  const map = {
    tr: [
      { q: `${title} ne kadar sürer?`, a: "Kişiye özel planlama ile netleşir. Birçok estetik ve aynı gün protokol 1–7 gün; implantlarda kemik durumuna göre aşamalı planlanır. Ücretsiz foto analiz sonrası süre ve fiyatı yazılı iletiriz." },
      { q: "Fiyata neler dâhil?", a: "Paketlerimizde klinik tedavi, gerekli kontroller ve talep halinde otel + VIP transfer + tercüman yer alabilir. Gizli maliyet istemeyiz; teklifte kalem kalem görürsünüz." },
      { q: "Yurt dışından gelebilir miyim?", a: "Evet. Uçuş tarihinize göre tedavi takvimi, karşılama ve konaklama MediDent İstanbul hasta koordinasyon ekibiyle planlanır." },
      { q: "Nasıl başlarım?", a: "WhatsApp veya formdan adınızı, telefonunuzu ve diş fotoğraflarınızı paylaşın. 24 saat içinde ön değerlendirme ve teklif için dönüş yapalım." },
    ],
    en: [
      { q: `How long does “${title}” take?`, a: "It depends on your case. Many aesthetic / same-day protocols take 1–7 days; implants are staged by bone condition. After a free photo review we send a written timeline and quote." },
      { q: "What’s included in the price?", a: "Packages can include clinical care, checks, and optional hotel + VIP transfer + interpreter. We aim for transparent line items — no surprise fees." },
      { q: "Can I travel from abroad?", a: "Yes. We plan your treatment around flight dates with airport pickup and hotel coordination via our patient team." },
      { q: "How do I start?", a: "Share your name, phone and dental photos via WhatsApp or the form. We’ll reply within 24 hours with a pre-assessment." },
    ],
    de: [
      { q: `Wie lange dauert „${title}“?`, a: "Individuell. Viele Ästhetik-/Same-Day-Protokolle: 1–7 Tage; Implantate je nach Knochenlage. Nach kostenloser Foto-Prüfung erhalten Sie Zeitplan und Angebot schriftlich." },
      { q: "Was ist im Preis enthalten?", a: "Pakete können Behandlung, Kontrollen sowie optional Hotel + VIP-Transfer + Dolmetscher umfassen. Transparente Positionen — keine Überraschungskosten." },
      { q: "Kann ich aus dem Ausland kommen?", a: "Ja. Wir planen um Ihre Flüge, inkl. Abholung und Hotel über unser Patiententeam." },
      { q: "Wie starte ich?", a: "Name, Telefon und Zahnfotos per WhatsApp oder Formular senden. Innerhalb von 24 Stunden Vorabeinschätzung." },
    ],
  };
  return map[lang] || map.en;
}

export function readingMinutes(html = "") {
  const text = String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(3, Math.round(words / 180));
}
