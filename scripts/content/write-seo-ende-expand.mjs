#!/usr/bin/env node
/**
 * Expand EN/DE SEO content toward TR parity:
 * All-on-4, Invisalign, whitening, Hollywood Smile, veneers vs zirconia, implant definition GEO.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONTENT = path.join(ROOT, "src/content");
const TODAY = new Date().toISOString().slice(0, 10);
const IMG = {
  zirconia: "blog/blog-01-zirkonyum.jpg",
  bonding: "blog/blog-02-bonding.jpg",
  smile: "blog/blog-06-gulush.jpg",
  implant: "blog/blog-04-implant.jpg",
  sedation: "blog/blog-03-sedasyon.jpg",
};

function make(lang, t) {
  const contact = lang === "de" ? "/de/iletisim/" : "/en/iletisim/";
  const faqTitle = lang === "de" ? "Häufig gestellte Fragen" : "Frequently asked questions";
  const sectionsHtml = t.sections
    .map((s) => `<h2>${s.h2}</h2>${s.body.map((p) => `<p>${p}</p>`).join("")}`)
    .join("");
  const faqHtml = `<h2>${faqTitle}</h2>${t.faq.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join("")}`;
  const cta =
    lang === "de"
      ? `<p><strong>Nächster Schritt:</strong> Kostenlose Online-Beratung — <a href="${contact}">Kontakt</a> oder WhatsApp.</p>`
      : `<p><strong>Next step:</strong> Free online consultation — <a href="${contact}">contact</a> or WhatsApp.</p>`;
  const intro = t.intro.map((p) => `<p>${p}</p>`).join("");
  const html = intro + sectionsHtml + faqHtml + cta;
  return {
    blog: {
      lang,
      slug: t.slug,
      service: t.service,
      title: t.title,
      excerpt: (t.intro[0] || "").slice(0, 155).replace(/\s+\S*$/, "") + "…",
      metaDescription: t.meta.slice(0, 155),
      html,
      coverImage: t.image,
      wordCount: html.split(/\s+/).length,
      faq: t.faq,
      source: "seo-ende-expand",
      publishedAt: TODAY,
      tag: t.tag,
    },
    geo: {
      lang,
      slug: t.geoSlug,
      bucket: t.bucket,
      question: t.question,
      title: t.question.replace(/\?$/, ""),
      direct_answer: t.direct,
      coverImage: t.image,
      bullets: t.bullets,
      faq: t.faq.slice(0, 4),
      internal_links: [
        { href: contact, label: lang === "de" ? "Kontakt" : "Contact" },
        {
          href: lang === "de" ? `/de/hizmetler/${t.service}/` : `/en/hizmetler/${t.service}/`,
          label: lang === "de" ? "Leistungen" : "Services",
        },
      ],
      source: "seo-ende-expand",
      publishedAt: TODAY,
    },
  };
}

const EN = [
  {
    slug: "all-on-4-dental-implants-istanbul-cost",
    geoSlug: "what-is-all-on-4",
    service: "implantoloji-implant-tedavisi",
    tag: "Implants",
    bucket: "kategori",
    image: IMG.implant,
    title: "All-on-4 Dental Implants in Istanbul: Cost, Timeline & Who It’s For",
    meta: "All-on-4 implants in Istanbul for UK/EU patients — typical stay, provisional teeth, transparent quotes at MediDent Istanbul.",
    question: "What is All-on-4?",
    direct:
      "All-on-4 is a full-arch implant protocol using typically four implants to support a fixed provisional bridge, often on the same day in suitable cases.",
    intro: [
      "All-on-4 is one of the most searched implant options for patients flying to Istanbul for full-mouth rehabilitation. At MediDent Istanbul (Üsküdar Acıbadem) we plan bone, bite and aesthetics digitally before you travel.",
      "This guide explains candidacy, timeline for a dental holiday, and how quotes are built — without surprise add-ons.",
    ],
    sections: [
      {
        h2: "Who is a good candidate?",
        body: [
          "Patients with failing dentition or complete edentulism who want fixed teeth may qualify after CBCT and medical review. Bone grafting needs can change the plan.",
        ],
      },
      {
        h2: "Typical Istanbul timeline",
        body: [
          "Many visitors stay 5–10 days for surgery and provisional teeth, then return later for the final bridge. Exact timing depends on healing and lab work.",
        ],
      },
      {
        h2: "Cost factors (transparent quote)",
        body: [
          "Number of implants, provisional vs final materials, extractions and sedation affect price. We share a written plan after free photo consultation.",
        ],
      },
    ],
    faq: [
      { q: "Are temporary teeth same day?", a: "In suitable All-on-4 cases, a fixed provisional can be fitted the same day after surgery." },
      { q: "Is All-on-4 cheaper in Turkey?", a: "Packages are often more competitive than UK/DE private care; quality depends on team, lab and follow-up — ask for materials in writing." },
      { q: "Do you help with hotel and transfer?", a: "Yes — MediDent Istanbul coordinates VIP transfer and hotel on request." },
    ],
    bullets: [
      "Full-arch fixed teeth on typically four implants",
      "Digital planning before travel",
      "Provisional teeth often same day when suitable",
      "Written quote after photo consult",
    ],
  },
  {
    slug: "invisalign-clear-aligners-istanbul",
    geoSlug: "what-are-clear-aligners",
    service: "seffaf-plaklar-invisalign",
    tag: "Invisalign",
    bucket: "kategori",
    image: IMG.smile,
    title: "Invisalign & Clear Aligners in Istanbul for International Patients",
    meta: "Start Invisalign or clear aligners in Istanbul — digital scans, discreet orthodontics, remote follow-ups for travellers.",
    question: "What are clear aligners?",
    direct:
      "Clear aligners are nearly invisible removable trays that gradually move teeth according to a digital orthodontic plan.",
    intro: [
      "Clear aligners (including Invisalign-style systems) are popular with patients who want discreet orthodontics during or after a dental trip to Istanbul.",
      "We start with scans and a 3D plan so you know duration and attachment needs before you commit.",
    ],
    sections: [
      {
        h2: "Travel-friendly workflow",
        body: [
          "After initial fitting, many mild–moderate cases continue with remote check-ins. Complex bites may need more in-clinic visits.",
        ],
      },
      {
        h2: "Aligners vs braces",
        body: [
          "Aligners favour aesthetics and hygiene; braces may still be better for some complex movements. We recommend honestly after diagnostics.",
        ],
      },
    ],
    faq: [
      { q: "How long do aligners take?", a: "Often 6–18 months for mild–moderate cases; your digital plan sets the estimate." },
      { q: "Can I fly home between sets?", a: "Usually yes for suitable cases with remote monitoring." },
    ],
    bullets: [
      "Nearly invisible trays",
      "Digital 3D treatment plan",
      "Often remote follow-ups after start",
      "Ideal for discreet adult orthodontics",
    ],
  },
  {
    slug: "professional-teeth-whitening-istanbul",
    geoSlug: "professional-teeth-whitening",
    service: "dis-beyazlatma",
    tag: "Whitening",
    bucket: "kategori",
    image: IMG.smile,
    title: "Professional Teeth Whitening in Istanbul — Safe In-Clinic Results",
    meta: "In-clinic teeth whitening in Istanbul for dental tourists — predictable shade change, often same week as veneers or cleaning.",
    question: "How does professional teeth whitening work?",
    direct:
      "Professional whitening uses dentist-supervised bleaching gels at controlled strength for faster, more predictable shade change than home kits.",
    intro: [
      "Whitening is a frequent add-on on dental holidays. Done properly it is comfortable and pairs well with hygiene or cosmetic plans.",
    ],
    sections: [
      {
        h2: "Clinic vs home kits",
        body: [
          "Clinic gels and isolation reduce uneven results and protect gums. Sensitivity is managed with protocols and aftercare.",
        ],
      },
    ],
    faq: [
      { q: "How long does it take?", a: "Often a single visit of about one hour; touch-ups may be advised." },
      { q: "Before veneers?", a: "Sometimes whitening is sequenced before or after veneers depending on the shade goal." },
    ],
    bullets: [
      "Dentist-supervised bleaching",
      "Faster than home kits",
      "Fits dental-holiday schedules",
      "Aftercare for lasting shade",
    ],
  },
  {
    slug: "hollywoodlywood-smile-turkey-package",
    geoSlug: "hollywoodlywood-smile-package-istanbul",
    service: "estetik-dis-hekimligi",
    tag: "Smile design",
    bucket: "kategori",
    image: IMG.smile,
    title: "Hollywood Smile Packages in Turkey: What’s Included in Istanbul",
    meta: "Hollywood Smile package Istanbul — veneers or zirconia, digital design, hotel & transfer options at MediDent Istanbul.",
    question: "What is a Hollywood Smile package in Istanbul?",
    direct:
      "A Hollywood Smile package typically combines digital smile design with veneers or zirconia crowns, often bundled with transfer and hotel for international patients.",
    intro: [
      "“Hollywood Smile” is a marketing term for a bright, harmonious smile makeover. Quality depends on planning, gum health and material choice — not just whiteness.",
    ],
    sections: [
      {
        h2: "Typical package building blocks",
        body: [
          "Consultation & photos, digital mock-up, temporary smile, final ceramics, plus optional hotel/transfer. Duration is often 5–10 days.",
        ],
      },
    ],
    faq: [
      { q: "Veneers or crowns?", a: "Veneers for minimal prep; crowns when strength or existing large restorations require it." },
      { q: "Can Germans/UK patients communicate easily?", a: "MediDent Istanbul offers EN/DE support for international patients." },
    ],
    bullets: [
      "Digital smile design first",
      "Veneers or zirconia options",
      "Often 5–10 day stay",
      "Optional hotel & transfer",
    ],
  },
  {
    slug: "veneers-vs-zirconia-crowns-istanbul",
    geoSlug: "what-are-porcelain-veneers",
    service: "estetik-dis-hekimligi",
    tag: "Veneers",
    bucket: "karsilastirma",
    image: IMG.zirconia,
    title: "Veneers vs Zirconia Crowns in Istanbul — Which Should You Choose?",
    meta: "Compare porcelain veneers and zirconia crowns in Istanbul — prep, strength, aesthetics and dental tourism timing.",
    question: "What are porcelain veneers?",
    direct:
      "Porcelain veneers are thin ceramic shells bonded to the front of teeth to improve colour, shape and alignment with relatively conservative preparation.",
    intro: [
      "Choosing between veneers and zirconia crowns is the most common aesthetic decision for patients visiting Istanbul for smile design.",
    ],
    sections: [
      {
        h2: "When veneers win",
        body: [
          "Healthy teeth needing shape/colour change with minimal reduction. Best when bite forces are moderate.",
        ],
      },
      {
        h2: "When zirconia wins",
        body: [
          "Broken teeth, bridges, heavy bite or night grinding often favour full-coverage zirconia for strength.",
        ],
      },
    ],
    faq: [
      { q: "Which looks more natural?", a: "Both can look natural with modern ceramics; layering and gum line design matter more than the label." },
      { q: "Can I decide after mock-up?", a: "Yes — digital and temporary try-ins help you choose before finals." },
    ],
    bullets: [
      "Veneers = conservative prep",
      "Zirconia = high strength",
      "Mock-up before finals",
      "Common dental-tourism choice",
    ],
  },
  {
    slug: "dental-implants-explained-istanbul",
    geoSlug: "what-is-a-dental-implant",
    service: "oral-implantoloji",
    tag: "Implants",
    bucket: "kategori",
    image: IMG.implant,
    title: "What Is a Dental Implant? Istanbul Guide for First-Time Patients",
    meta: "Dental implant basics for travellers to Istanbul — titanium root, healing time, crown stage and tourism tips.",
    question: "What is a dental implant?",
    direct:
      "A dental implant is a titanium (or similar) root placed in the jawbone that supports a crown, bridge or denture after osseointegration.",
    intro: [
      "If you are comparing implant quotes from Turkey, start with the clinical definition — not only the price per implant.",
    ],
    sections: [
      {
        h2: "Three stages",
        body: [
          "Placement, healing (osseointegration), then prosthetic crown/bridge. Some protocols allow immediate provisional teeth.",
        ],
      },
    ],
    faq: [
      { q: "Is it surgery?", a: "Yes — minor oral surgery under local anaesthetic or sedation." },
      { q: "How long before final crown?", a: "Often a few months; immediate protocols differ by case." },
    ],
    bullets: [
      "Titanium root in bone",
      "Supports crown or bridge",
      "Healing then prosthesis",
      "Plan before you fly",
    ],
  },
];

const DE = [
  {
    slug: "all-on-4-zahnimplantate-istanbul-kosten",
    geoSlug: "was-ist-all-on-4",
    service: "implantoloji-implant-tedavisi",
    tag: "Implantate",
    bucket: "kategori",
    image: IMG.implant,
    title: "All-on-4 Zahnimplantate in Istanbul: Kosten, Ablauf & Reiseplanung",
    meta: "All-on-4 in Istanbul für Patienten aus DE/AT/CH — Aufenthaltsdauer, Provisorium, transparente Angebote bei MediDent Istanbul.",
    question: "Was ist All-on-4?",
    direct:
      "All-on-4 ist ein Konzept für den zahnlosen Kiefer: meist vier Implantate tragen eine festsitzende provisorische Brücke, oft am Operationstag bei geeigneten Fällen.",
    intro: [
      "All-on-4 ist eine der häufigsten Suchanfragen deutscher Patienten für Zahntourismus in Istanbul. Bei MediDent Istanbul (Üsküdar) planen wir Knochen, Biss und Ästhetik digital vor der Reise.",
    ],
    sections: [
      {
        h2: "Für wen geeignet?",
        body: [
          "Bei stark geschädigtem Gebiss oder Zahnlosigkeit nach CBCT und medizinischer Prüfung. Knochenaufbau kann den Plan ändern.",
        ],
      },
      {
        h2: "Typischer Aufenthalt",
        body: [
          "Häufig 5–10 Tage für OP und Provisorium; die definitive Versorgung oft in einem zweiten Besuch.",
        ],
      },
    ],
    faq: [
      { q: "Zähne am selben Tag?", a: "Bei geeigneten Fällen ist ein festsitzendes Provisorium am OP-Tag möglich." },
      { q: "Günstiger als in Deutschland?", a: "Pakete sind oft wettbewerbsfähiger — Qualität hängt von Team, Labor und Nachsorge ab." },
    ],
    bullets: [
      "Festsitzende Vollbögen auf meist vier Implantaten",
      "Digitale Planung vor der Reise",
      "Provisorium oft am selben Tag",
      "Schriftliches Angebot nach Foto-Beratung",
    ],
  },
  {
    slug: "invisalign-aligner-istanbul",
    geoSlug: "was-sind-aligner",
    service: "seffaf-plaklar-invisalign",
    tag: "Invisalign",
    bucket: "kategori",
    image: IMG.smile,
    title: "Invisalign & Aligner in Istanbul für internationale Patienten",
    meta: "Aligner-Start in Istanbul — digitale Scans, dezente Zahnkorrektur, Fernkontrollen für Reisende.",
    question: "Was sind Aligner?",
    direct:
      "Aligner sind nahezu unsichtbare, herausnehmbare Schienen, die Zähne schrittweise nach einem digitalen kieferorthopädischen Plan bewegen.",
    intro: [
      "Transparente Aligner sind bei Erwachsenen beliebt, die eine dezente Korrektur mit einer Istanbul-Reise verbinden möchten.",
    ],
    sections: [
      {
        h2: "Reise-Workflow",
        body: [
          "Nach Scan und Eingliederung sind bei vielen leichten bis mittleren Fällen Fernkontrollen möglich.",
        ],
      },
    ],
    faq: [
      { q: "Wie lange dauert es?", a: "Oft 6–18 Monate; die digitale Planung gibt die Schätzung." },
      { q: "Zwischen den Sets nach Hause fliegen?", a: "Bei geeigneten Fällen meist ja." },
    ],
    bullets: [
      "Nahezu unsichtbar",
      "3D-Plan vorab",
      "Oft Fernkontrollen",
      "Geeignet für Erwachsene",
    ],
  },
  {
    slug: "professionelle-zahnaufhellung-istanbul",
    geoSlug: "professionelle-zahnaufhellung",
    service: "dis-beyazlatma",
    tag: "Aufhellung",
    bucket: "kategori",
    image: IMG.smile,
    title: "Professionelle Zahnaufhellung in Istanbul — sichere Praxis-Ergebnisse",
    meta: "Zahnaufhellung in der Praxis in Istanbul — planbare Aufhellung, oft in derselben Reisewoche wie Veneers.",
    question: "Wie funktioniert professionelle Zahnaufhellung?",
    direct:
      "Professionelle Aufhellung nutzt zahnärztlich überwachte Bleaching-Gele mit kontrollierter Stärke für schnellere, planbarere Ergebnisse als Heimkits.",
    intro: [
      "Aufhellung ist ein häufiges Extra beim Zahntourismus — bei korrekter Durchführung komfortabel und kombinierbar mit Prophylaxe oder Ästhetik.",
    ],
    sections: [
      {
        h2: "Praxis vs. Heimkit",
        body: [
          "Kontrollierte Gele und Isolation schützen das Zahnfleisch und vermeiden ungleichmäßige Ergebnisse.",
        ],
      },
    ],
    faq: [
      { q: "Wie lange dauert der Termin?", a: "Oft etwa eine Stunde; Auffrischungen können folgen." },
    ],
    bullets: [
      "Überwachtes Bleaching",
      "Schneller als Heimkits",
      "Passt in Reisepläne",
      "Nachsorge für stabile Farbe",
    ],
  },
  {
    slug: "hollywood-smile-tuerkei-paket",
    geoSlug: "hollywoodlywood-smile-paket-istanbul",
    service: "estetik-dis-hekimligi",
    tag: "Smile Design",
    bucket: "kategori",
    image: IMG.smile,
    title: "Hollywood-Smile-Pakete in der Türkei: Was ist in Istanbul enthalten?",
    meta: "Hollywood Smile Paket Istanbul — Veneers oder Zirkon, digitales Design, Hotel & Transfer bei MediDent Istanbul.",
    question: "Was ist ein Hollywood-Smile-Paket in Istanbul?",
    direct:
      "Ein Hollywood-Smile-Paket kombiniert meist digitales Smile Design mit Veneers oder Zirkonkronen und oft Transfer/Hotel für internationale Patienten.",
    intro: [
      "„Hollywood Smile“ meint ein helles, harmonisches Lächeln. Qualität hängt von Planung, Zahnfleisch und Material ab — nicht nur von Weiße.",
    ],
    sections: [
      {
        h2: "Typische Bausteine",
        body: [
          "Beratung & Fotos, digitales Mock-up, Provisorium, keramische Endversorgung, optional Hotel/Transfer. Dauer oft 5–10 Tage.",
        ],
      },
    ],
    faq: [
      { q: "Veneers oder Kronen?", a: "Veneers bei minimaler Präparation; Kronen bei hoher Belastung oder großen Restaurationen." },
    ],
    bullets: [
      "Zuerst digitales Smile Design",
      "Veneers oder Zirkon",
      "Oft 5–10 Tage Aufenthalt",
      "Optional Hotel & Transfer",
    ],
  },
  {
    slug: "veneers-vs-zirkonkronen-istanbul",
    geoSlug: "was-sind-porzellan-veneers",
    service: "estetik-dis-hekimligi",
    tag: "Veneers",
    bucket: "karsilastirma",
    image: IMG.zirconia,
    title: "Veneers vs. Zirkonkronen in Istanbul — Was passt zu Ihnen?",
    meta: "Vergleich Porzellan-Veneers und Zirkonkronen in Istanbul — Präparation, Stabilität, Ästhetik und Reiseplanung.",
    question: "Was sind Porzellan-Veneers?",
    direct:
      "Porzellan-Veneers sind dünne Keramikschalen, die auf die Zahnvorderseite geklebt werden, um Farbe, Form und Stellung konservativ zu verbessern.",
    intro: [
      "Die Wahl zwischen Veneers und Zirkonkronen ist die häufigste Ästhetik-Entscheidung für Patienten im Zahntourismus.",
    ],
    sections: [
      {
        h2: "Wann Veneers?",
        body: [
          "Gesunde Zähne mit Form-/Farbwunsch und moderater Belastung.",
        ],
      },
      {
        h2: "Wann Zirkon?",
        body: [
          "Bei frakturierten Zähnen, Brücken oder starkem Biss/Knirschen oft Vollkronen aus Zirkon.",
        ],
      },
    ],
    faq: [
      { q: "Was wirkt natürlicher?", a: "Beides kann natürlich wirken — Schichttechnik und Zahnfleischlinie sind entscheidend." },
    ],
    bullets: [
      "Veneers = wenig Substanzabtrag",
      "Zirkon = hohe Festigkeit",
      "Mock-up vor Finalisierung",
      "Häufige Zahntourismus-Frage",
    ],
  },
  {
    slug: "zahnimplantat-erklaert-istanbul",
    geoSlug: "was-ist-ein-zahnimplantat",
    service: "oral-implantoloji",
    tag: "Implantate",
    bucket: "kategori",
    image: IMG.implant,
    title: "Was ist ein Zahnimplantat? Istanbul-Ratgeber für Einsteiger",
    meta: "Zahnimplantat Basics für Reisende nach Istanbul — Titanwurzel, Einheilung, Krone und Tourismus-Tipps.",
    question: "Was ist ein Zahnimplantat?",
    direct:
      "Ein Zahnimplantat ist eine Titanwurzel (oder ähnliches Material) im Kieferknochen, die nach Einheilung Krone, Brücke oder Prothese trägt.",
    intro: [
      "Bevor Sie Angebote aus der Türkei vergleichen, klären Sie die klinische Definition — nicht nur den Preis pro Implantat.",
    ],
    sections: [
      {
        h2: "Drei Phasen",
        body: [
          "Insertion, Einheilung (Osseointegration), dann prothetische Versorgung. Manche Protokolle erlauben sofortige Provisorien.",
        ],
      },
    ],
    faq: [
      { q: "Ist das ein Eingriff?", a: "Ja — kleiner oralchirurgischer Eingriff unter lokaler Betäubung oder Sedierung." },
    ],
    bullets: [
      "Titanwurzel im Knochen",
      "Trägt Krone oder Brücke",
      "Einheilung dann Prothetik",
      "Planung vor dem Flug",
    ],
  },
];

function mergeUnique(existing, incoming, key = "slug") {
  const seen = new Set(existing.map((x) => `${x.lang}:${x[key]}`));
  const out = [...existing];
  for (const item of incoming) {
    const k = `${item.lang}:${item[key]}`;
    if (!seen.has(k)) {
      out.push(item);
      seen.add(k);
    }
  }
  return out;
}

function main() {
  const blogPath = path.join(CONTENT, "generated-blog.json");
  const geoPath = path.join(CONTENT, "geo/packs.json");
  const blogs = JSON.parse(fs.readFileSync(blogPath, "utf8"));
  const geos = JSON.parse(fs.readFileSync(geoPath, "utf8"));

  const newBlogs = [];
  const newGeos = [];
  for (const t of EN) {
    const { blog, geo } = make("en", t);
    newBlogs.push(blog);
    newGeos.push(geo);
  }
  for (const t of DE) {
    const { blog, geo } = make("de", t);
    newBlogs.push(blog);
    newGeos.push(geo);
  }

  const blogs2 = mergeUnique(blogs, newBlogs);
  const geos2 = mergeUnique(geos, newGeos);
  fs.writeFileSync(blogPath, JSON.stringify(blogs2, null, 2) + "\n");
  fs.writeFileSync(geoPath, JSON.stringify(geos2, null, 2) + "\n");

  const count = (arr) =>
    ["tr", "en", "de"].map((l) => `${l}:${arr.filter((x) => x.lang === l).length}`).join(" ");
  console.log("Blog", count(blogs2));
  console.log("GEO ", count(geos2));
  console.log(`Added blogs=${newBlogs.length} geos=${newGeos.length}`);
}

main();
