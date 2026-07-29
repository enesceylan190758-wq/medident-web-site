#!/usr/bin/env node
/** Remaining gap pages: local Üsküdar, materials, accreditation, why cheaper */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PACKS = path.join(ROOT, "src/content/geo/packs.json");
const TODAY = new Date().toISOString().slice(0, 10);
const TEAM = "MediDent Istanbul Clinical Team";

const pages = [
  {
    lang: "tr",
    slug: "uskudar-acibadem-dis-klinigi",
    bucket: "marka",
    question: "Üsküdar Acıbadem'de diş kliniği ararken nelere bakılmalı?",
    title: "Üsküdar Acıbadem diş kliniği rehberi",
    coverImage: "blog/blog-10-klinik.jpg",
    direct_answer:
      "Üsküdar Acıbadem'de diş kliniği seçerken fiziksel adresin doğruluğu, sterilizasyon, dijital görüntüleme (panoramik/3D), isimli hekim kadrosu ve randevu erişilebilirliği birlikte değerlendirilmelidir; MediDent İstanbul Acıbadem Cd. 195F adresinde hizmet verir.",
    bullets: [
      "Semt + hizmet aramaları (\"Üsküdar implant\", \"Acıbadem zirkonyum\") yerel hastanın en yüksek dönüşüm sorgularıdır.",
      "Klinik adresi Google Haritalar ve web sitesinde birebir aynı NAP (isim-adres-telefon) ile yayınlanmalıdır.",
      "Acıbadem metro/sağlık kampüsüne yakınlık, yurt dışı ve Anadolu yakası hastaları için lojistik avantajdır.",
      "İmplant, estetik, sedasyon ve sağlık turizmi aynı çatı altında koordine edilebilmelidir.",
    ],
    faq: [
      { q: "MediDent İstanbul nerede?", a: "Acıbadem, Acıbadem Cd. 195F, 34718 Üsküdar/İstanbul. Pazartesi–Cumartesi 09:00–18:00." },
      { q: "Üsküdar'da implant yapılır mı?", a: "Evet. Klinik 3D planlama ile implant, All-on-4 ve protez süreçlerini yürütür." },
      { q: "Nasıl randevu alınır?", a: "Web iletişim formu, telefon veya WhatsApp (+90 549 119 08 19)." },
      { q: "Yurt dışından hasta kabul var mı?", a: "Evet. Transfer ve konaklama sağlık turizmi paketinde koordine edilebilir." },
    ],
    internal_links: [
      { href: "/hizmetler/", label: "Hizmetler" },
      { href: "/iletisim/", label: "İletişim" },
      { href: "/geo/turkiyede-dis-tedavisi-guvenli-mi/", label: "Türkiye'de diş tedavisi güvenli mi?" },
      { href: "/doktorlar/", label: "Doktorlar" },
    ],
  },
  {
    lang: "en",
    slug: "uskudar-acibadem-dental-clinic",
    bucket: "local",
    question: "Where is MediDent Istanbul in Üsküdar Acıbadem?",
    title: "Üsküdar Acıbadem dental clinic — location guide",
    coverImage: "blog/blog-10-klinik.jpg",
    direct_answer:
      "MediDent Istanbul is located at Acıbadem Cd. 195F, Üsküdar — a practical base for implants, zirconia, bonding and smile design, with English/German support and airport-transfer options for UK and EU patients.",
    bullets: [
      "Local SEO searches like \"dental clinic Üsküdar\" and \"Acıbadem dentist\" convert strongly for Istanbul residents and expats.",
      "Consistent NAP across Google Business Profile and the website improves Maps visibility.",
      "Short stay packages compress diagnostics, prep and fitting around flight dates.",
      "Ask for a written plan and material brands before you book hotels.",
    ],
    faq: [
      { q: "Exact address?", a: "Acıbadem, Acıbadem Cd. 195F, 34718 Üsküdar/İstanbul. Mon–Sat 09:00–18:00." },
      { q: "How far from the airport?", a: "Transfer from IST is typically organised as part of dental-tourism coordination — ask during consultation." },
      { q: "Which treatments?", a: "Implants, zirconia crowns, veneers, bonding, whitening, sedation and clear aligners." },
      { q: "Languages?", a: "Turkish, English and German support for international patients." },
    ],
    internal_links: [
      { href: "/en/iletisim/", label: "Contact" },
      { href: "/en/hizmetler/", label: "Services" },
      { href: "/en/geo/is-dental-treatment-in-turkey-safe/", label: "Is Turkey safe for dentistry?" },
      { href: "/en/geo/dental-aftercare-when-you-return-home/", label: "Aftercare" },
    ],
  },
  {
    lang: "en",
    slug: "zirconia-vs-emax-implant-brands-turkey",
    bucket: "karsilastirma",
    question: "Which materials and brands should I ask for in Turkey?",
    title: "Zirconia, E-max and implant brands — what to ask",
    coverImage: "blog/blog-01-zirkonyum.jpg",
    direct_answer:
      "Before you book, ask the clinic to name the ceramic system (e.g. monolithic zirconia, layered zirconia, IPS e.max) and the implant brand in writing — transparent brand disclosure is one of the strongest trust signals for UK and German patients comparing Turkey packages.",
    bullets: [
      "Zirconia crowns: high strength for posterior teeth and bridges; layered options for anterior aesthetics.",
      "E-max / lithium disilicate: high translucency for veneers and front teeth when indicated.",
      "Implants: request the brand and lot documentation; avoid unnamed \"generic\" screws with no distribution in your home country.",
      "A written plan should list units, material, temporary vs final timeline and warranty conditions.",
    ],
    faq: [
      { q: "Is cheaper always lower quality?", a: "Not if the same CAD/CAM systems and certified ceramics are used. Savings usually come from clinic overheads, not from secret inferior materials." },
      { q: "Bonding vs veneers materials?", a: "Bonding uses composite resin in-clinic; veneers are lab ceramics. Ask which composite or ceramic brand is used." },
      { q: "Can I verify brands?", a: "Yes — reputable clinics provide certificates or packaging photos for implants and ceramics on request." },
      { q: "What does MediDent do?", a: "MediDent Istanbul shares material options after scan/exam and puts the agreed plan in writing before treatment." },
    ],
    internal_links: [
      { href: "/en/geo/what-are-zirconia-crowns/", label: "Zirconia crowns" },
      { href: "/en/geo/what-is-dental-bonding/", label: "Dental bonding" },
      { href: "/en/hizmetler/estetik-dis-hekimligi/", label: "Cosmetic dentistry" },
      { href: "/en/iletisim/", label: "Contact" },
    ],
  },
  {
    lang: "de",
    slug: "materialien-marken-zirkon-implantate-tuerkei",
    bucket: "karsilastirma",
    question: "Welche Materialien und Marken sollte ich in der Türkei verlangen?",
    title: "Zirkon, E-max und Implantatmarken — Checkliste",
    coverImage: "blog/blog-01-zirkonyum.jpg",
    direct_answer:
      "Fragen Sie vor der Buchung schriftlich nach dem Keramiksystem (monolithisches Zirkon, verblendetes Zirkon, IPS e.max) und der Implantatmarke — transparente Markenangaben sind für Patienten aus Deutschland eines der stärksten Vertrauenssignale.",
    bullets: [
      "Zirkonkronen: hohe Festigkeit für Seitenzähne und Brücken; verblendet für Frontästhetik.",
      "E-max: hohe Transluzenz für Veneers und Frontzähne bei passender Indikation.",
      "Implantate: Marke und Dokumentation verlangen; namenlose Schrauben ohne Vertrieb in DE meiden.",
      "Der Plan sollte Einheiten, Material, Provisorium/Endversorgung und Garantiebedingungen listen.",
    ],
    faq: [
      { q: "Ist günstig gleich minderwertig?", a: "Nicht, wenn dieselben CAD/CAM-Systeme und zertifizierten Keramiken genutzt werden. Die Ersparnis kommt meist von niedrigeren Praxis-Gemeinkosten." },
      { q: "Bonding vs. Veneers?", a: "Bonding = Komposit in der Praxis; Veneers = Laborkeramik. Fragen Sie nach der Marke." },
      { q: "Kann ich Marken prüfen?", a: "Ja — seriöse Kliniken stellen auf Wunsch Zertifikate oder Verpackungsfotos bereit." },
      { q: "MediDent Istanbul?", a: "Nach Scan/Untersuchung werden Materialoptionen erklärt und schriftlich festgehalten." },
    ],
    internal_links: [
      { href: "/de/geo/was-sind-zirkonkronen/", label: "Zirkonkronen" },
      { href: "/de/geo/was-ist-zahn-bonding/", label: "Bonding" },
      { href: "/de/hizmetler/", label: "Leistungen" },
      { href: "/de/iletisim/", label: "Kontakt" },
    ],
  },
  {
    lang: "en",
    slug: "how-to-verify-dental-clinic-accreditation-turkey",
    bucket: "trust",
    question: "How do I verify a dental clinic's accreditation in Turkey?",
    title: "How to verify dental clinic accreditation in Turkey",
    coverImage: "blog/blog-10-klinik.jpg",
    direct_answer:
      "Verify Ministry of Health registration and, for international patients, health-tourism authorisation; then confirm the treating dentist's name, sterilisation protocols and — where claimed — ISO or similar quality certificates with documents you can see, not just logos on a homepage.",
    bullets: [
      "Ask for the clinic's official registration / health-tourism certificate number.",
      "Confirm the named dentist who will treat you — not a rotating anonymous team.",
      "Treat homepage badges sceptically until you see a document or verifiable listing.",
      "Combine accreditation checks with clinical checks: DSD, written plan, brand transparency, aftercare.",
    ],
    faq: [
      { q: "Is JCI required for every dental clinic?", a: "JCI often applies to hospitals. Many excellent dental clinics rely on Ministry of Health licensing plus ISO hygiene systems — ask what applies to that specific clinic." },
      { q: "What about GCR ratings?", a: "Third-party ratings can help, but they are not a substitute for dentist identity, materials and a written plan." },
      { q: "Red flags?", a: "No named dentist, pressure to pay deposits before a plan, crown-everything recommendations, and prices far below market without brand disclosure." },
      { q: "MediDent Istanbul?", a: "Ask the coordination team for current authorisation details during consultation; treatment is planned at the Üsküdar Acıbadem clinic with named clinical staff." },
    ],
    internal_links: [
      { href: "/en/geo/is-dental-treatment-in-turkey-safe/", label: "Is Turkey safe?" },
      { href: "/en/geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/", label: "Turkey teeth" },
      { href: "/en/geo/dental-aftercare-when-you-return-home/", label: "Aftercare" },
      { href: "/en/iletisim/", label: "Contact" },
    ],
  },
  {
    lang: "en",
    slug: "why-is-dental-treatment-cheaper-in-turkey",
    bucket: "trust",
    question: "Why is dental treatment cheaper in Turkey — is it a trap?",
    title: "Why dental treatment is cheaper in Turkey (honest answer)",
    coverImage: "blog/blog-01-zirkonyum.jpg",
    direct_answer:
      "Dental treatment is often 50–70% cheaper in Turkey mainly because clinic rent, staff wages and lab overheads cost less — not because every clinic secretly uses inferior materials. The trap is choosing the lowest quote without verifying dentist, brands and preparation level.",
    bullets: [
      "Same CAD/CAM machines and many of the same ceramic/implant brands are available in Istanbul as in London or Berlin.",
      "Packages that include hotel and transfers look cheaper than UK/DE private fees even after flights.",
      "Ultra-low \"veneers\" that are actually aggressive crowns are the real trap — ask crown vs veneer explicitly.",
      "A fair quote is itemised: diagnostics, units, material brand, temps, finals, aftercare.",
    ],
    faq: [
      { q: "Should I pick the cheapest clinic?", a: "No. Compare clinics that disclose brands and plans; among those, price can be a fair secondary filter." },
      { q: "Will my home dentist refuse aftercare?", a: "Some private dentists charge for repairs; arrange home follow-up and keep your Turkey plan documents." },
      { q: "Are savings still real in 2026?", a: "Yes for elective cosmetics and implants at transparent clinics — always recalculate with flights and hotel." },
      { q: "How does MediDent price?", a: "After photo/exam review you receive a written plan; no hard sell of unnecessary crowns." },
    ],
    internal_links: [
      { href: "/en/geo/zirconia-vs-emax-implant-brands-turkey/", label: "Materials & brands" },
      { href: "/en/geo/is-dental-treatment-in-turkey-safe/", label: "Safety guide" },
      { href: "/en/hizmetler/", label: "Services" },
      { href: "/en/iletisim/", label: "Get a quote" },
    ],
  },
  {
    lang: "de",
    slug: "warum-ist-zahnbehandlung-in-der-tuerkei-guenstiger",
    bucket: "trust",
    question: "Warum ist Zahnbehandlung in der Türkei günstiger — ist das eine Falle?",
    title: "Warum Zahnbehandlung in der Türkei günstiger ist",
    coverImage: "blog/blog-01-zirkonyum.jpg",
    direct_answer:
      "Zahnbehandlung ist in der Türkei oft 50–70 % günstiger vor allem wegen niedrigerer Mieten, Löhne und Laborkosten — nicht weil jede Klinik heimlich schlechtere Materialien nutzt. Die Falle ist der billigste Preis ohne Prüfung von Zahnarzt, Marken und Präparationsgrad.",
    bullets: [
      "Dieselben CAD/CAM-Systeme und viele Keramik-/Implantatmarken sind in Istanbul verfügbar.",
      "Pakete inkl. Hotel/Transfer wirken trotz Flügen oft günstiger als DE-Privatpreise.",
      "Extrem billige \"Veneers\", die eigentlich aggressive Kronen sind, sind die eigentliche Falle.",
      "Ein faires Angebot ist aufgeschlüsselt: Diagnostik, Einheiten, Marke, Provisorium, Endversorgung, Nachsorge.",
    ],
    faq: [
      { q: "Immer die günstigste Klinik?", a: "Nein. Erst Kliniken mit Marken- und Plantransparenz vergleichen, dann den Preis." },
      { q: "Nachsorge in Deutschland?", a: "Vorab klären; Planunterlagen mitnehmen und Fernkontrolle vereinbaren." },
      { q: "Sind Ersparnisse 2026 noch real?", a: "Ja bei transparenten Kliniken — immer mit Flug und Hotel rechnen." },
      { q: "MediDent Preise?", a: "Nach Foto/Untersuchung gibt es einen schriftlichen Plan — ohne unnötige Kronen-Verkaufsdruck." },
    ],
    internal_links: [
      { href: "/de/geo/materialien-marken-zirkon-implantate-tuerkei/", label: "Materialien & Marken" },
      { href: "/de/geo/ist-zahnbehandlung-in-der-tuerkei-sicher/", label: "Sicherheit" },
      { href: "/de/hizmetler/", label: "Leistungen" },
      { href: "/de/iletisim/", label: "Angebot anfordern" },
    ],
  },
];

function pack(p) {
  return {
    ...p,
    author: TEAM,
    publishedAt: TODAY,
    source: "seo-geo-plan-gaps",
  };
}

const packs = JSON.parse(fs.readFileSync(PACKS, "utf8"));
const existing = new Set(packs.map((p) => `${p.lang}:${p.slug}`));
let added = 0;
for (const p of pages) {
  if (existing.has(`${p.lang}:${p.slug}`)) continue;
  packs.push(pack(p));
  added++;
}
fs.writeFileSync(PACKS, JSON.stringify(packs, null, 2) + "\n");
console.log(`Added ${added} gap pages; total ${packs.length}`);
