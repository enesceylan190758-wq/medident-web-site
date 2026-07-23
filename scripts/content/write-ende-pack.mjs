#!/usr/bin/env node
/**
 * EN + DE topic pack (Omer Istanbul–style dental tourism tone).
 * Focus: zirconia, bonding, smile design, health tourism from DE/UK/EU.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONTENT = path.join(ROOT, "src/content");
const TODAY = new Date().toISOString().slice(0, 10);
const CLINIC = {
  en: "MediDent Istanbul (Üsküdar Acıbadem)",
  de: "MediDent Istanbul (Üsküdar Acıbadem)",
};

/** Shared cover map (same visuals as TR pack). */
const IMG = {
  zirconia: "blog/blog-01-zirkonyum.jpg",
  bonding: "blog/blog-02-bonding.jpg",
  sedation: "blog/blog-03-sedasyon.jpg",
  implant: "blog/blog-04-implant.jpg",
  extraction: "blog/blog-05-cekimi.jpg",
  smile: "blog/blog-06-gulush.jpg",
  kids: "blog/blog-07-pedodonti.jpg",
  canal: "blog/blog-08-kanal.jpg",
  perio: "blog/blog-09-periodontoloji.jpg",
  clinic: "blog/blog-10-klinik.jpg",
};

function pack(lang, t) {
  const c = CLINIC[lang];
  const contact = lang === "de" ? "/de/iletisim/" : "/en/iletisim/";
  const services = lang === "de" ? "/de/hizmetler/" : "/en/hizmetler/";
  const blogHome = lang === "de" ? "/de/blog/" : "/en/blog/";
  const geoHome = lang === "de" ? "/de/geo/" : "/en/geo/";

  const sectionsHtml = t.sections
    .map((s) => `<h2>${s.h2}</h2>${s.body.map((p) => `<p>${p}</p>`).join("")}`)
    .join("");
  const faqHtml = `<h2>${lang === "de" ? "Häufig gestellte Fragen" : "Frequently asked questions"}</h2>${t.faq
    .map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`)
    .join("")}`;
  const cta =
    lang === "de"
      ? `<p><strong>Nächster Schritt:</strong> Kostenlose Online-Beratung — <a href="${contact}">Kontaktformular</a> oder WhatsApp. ${c} erstellt Ihren individuellen Plan (Transfer & Hotel auf Wunsch).</p>`
      : `<p><strong>Next step:</strong> Free online consultation — <a href="${contact}">contact form</a> or WhatsApp. ${c} prepares your personal plan (airport transfer & hotel on request).</p>`;

  const intro = t.intro.map((p) => `<p>${p}</p>`).join("");
  const html = intro + sectionsHtml + faqHtml + cta;
  const excerpt = (t.intro[0] || "").slice(0, 155).replace(/\s+\S*$/, "") + "…";

  const blog = {
    lang,
    slug: t.slug,
    service: t.service,
    title: t.title,
    excerpt,
    metaDescription: t.meta.slice(0, 155),
    html,
    coverImage: t.image,
    wordCount: html.split(/\s+/).length,
    faq: t.faq,
    source: "ende-tourism-pack",
    publishedAt: TODAY,
    tag: t.tag,
  };

  const geo = {
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
      { href: services, label: lang === "de" ? "Leistungen" : "Services" },
      { href: `${blogHome}${t.slug}/`, label: lang === "de" ? "Blog-Ratgeber" : "Blog guide" },
      { href: geoHome, label: "GEO" },
      { href: contact, label: lang === "de" ? "Kontakt" : "Contact" },
    ],
    publishedAt: TODAY,
    source: "ende-tourism-pack",
  };

  return { blog, geo };
}

/** ---------- ENGLISH ---------- */
const EN = [
  {
    slug: "zirconia-crowns-turkey-cost-process-2026",
    geoSlug: "what-are-zirconia-crowns",
    tag: "Zirconia",
    image: IMG.zirconia,
    service: "estetik-dis-hekimligi",
    bucket: "kategori",
    title: "Zirconia crowns in Turkey 2026: cost factors, CAD/CAM process & natural aesthetics",
    meta: "Zirconia crowns in Istanbul: how CAD/CAM works, what affects price, and why EU patients choose MediDent Istanbul.",
    question: "What are zirconia crowns and why get them in Istanbul?",
    direct:
      "Zirconia crowns are metal-free restorations milled with CAD/CAM for strength and natural translucency. At MediDent Istanbul (Üsküdar Acıbadem), international patients typically complete planning, prep and fitting within a short stay — with transparent pricing after scan and exam.",
    intro: [
      "Zirconia crowns restore damaged or heavily filled teeth with a strong, metal-free shell that reflects light like natural enamel. For patients from the UK, Germany and the wider EU, Istanbul has become a preferred destination: premium labs, experienced cosmetic teams, and treatment timelines that fit a short trip.",
      "This guide explains how zirconia is produced, what drives cost (without fake “from €X” promises), and how MediDent Istanbul plans cases for dental tourism patients.",
    ],
    sections: [
      {
        h2: "How zirconia crowns are made (CAD/CAM)",
        body: [
          "After local anaesthesia, the tooth is minimally prepared. A digital scan (or impression) is sent to the lab. CAD/CAM mills a precise zirconia framework; ceramic layering and characterisation create colour and translucency. Temporary crowns protect aesthetics while you wait.",
          "Computer-guided milling reduces human error. The finished crown should fit tightly, protect the tooth from bacteria, and look natural in every light — especially important for smile-line cases.",
        ],
      },
      {
        h2: "What affects zirconia crown prices in Turkey?",
        body: [
          "Price depends on material brand and origin, number of teeth, need for fillings/root canals first, tooth position (front vs molar), dentist and technician experience, and whether you choose monolithic or layered zirconia.",
          "At MediDent Istanbul we share a clear plan after examination and imaging — not a generic online quote. That is how serious clinics (the ones dental tourists actually recommend) work.",
        ],
      },
      {
        h2: "Travel timeline for international patients",
        body: [
          "Many full-arch or multi-tooth cases fit into 4–7 days with digital workflow; simpler cases can be faster. We can coordinate airport transfer, hotel suggestions near Üsküdar/Acıbadem, and English/German-speaking coordination.",
          "You leave with fitted restorations and a written aftercare plan. Follow-up can continue via photos/WhatsApp when you are back home.",
        ],
      },
    ],
    faq: [
      {
        q: "Are zirconia crowns painful?",
        a: "Preparation is done under local anaesthesia. Mild sensitivity afterwards is normal and managed with your dentist’s protocol.",
      },
      {
        q: "Zirconia or porcelain veneers — which is better?",
        a: "Veneers suit mainly front-tooth aesthetics with less reduction. Crowns protect structurally compromised teeth. Choice depends on bite, tooth condition and smile goals.",
      },
      {
        q: "How long do zirconia crowns last?",
        a: "With good hygiene and check-ups, many last 10+ years. Grinding, trauma or poor care shortens lifespan — night guards may be advised.",
      },
      {
        q: "Can I fly from Germany or the UK for treatment?",
        a: "Yes. We compress the calendar where clinically safe and help with transfer and stay. Send photos/X-rays for a free preliminary plan.",
      },
    ],
    bullets: [
      "Metal-free CAD/CAM zirconia with natural translucency.",
      "Price after exam — material, tooth count and lab quality matter.",
      "Short-stay protocol for EU dental tourism patients.",
      "Aftercare and remote follow-up from MediDent Istanbul.",
    ],
  },
  {
    slug: "dental-bonding-vs-veneers-istanbul",
    geoSlug: "what-is-dental-bonding",
    tag: "Bonding",
    image: IMG.bonding,
    service: "estetik-dis-hekimligi",
    bucket: "karsilastirma",
    title: "Dental bonding vs porcelain veneers in Istanbul: which is right for you?",
    meta: "Bonding vs veneers explained for dental tourists — same-day composite vs long-lasting porcelain at MediDent Istanbul.",
    question: "What is dental bonding and how does it compare to veneers?",
    direct:
      "Dental bonding shapes tooth-coloured composite resin in one visit to fix chips, gaps and minor colour issues — usually with little or no enamel removal. Porcelain veneers are lab-made shells for more lasting, full smile makeovers. MediDent Istanbul helps you choose based on smile goals, budget and travel time.",
    intro: [
      "Bonding (composite veneers / direct bonding) is the fastest way to refine a smile: chips, small gaps, uneven edges and mild discoloration can often be corrected in a single appointment — ideal if you are visiting Istanbul for a short stay.",
      "Porcelain or e.max veneers need preparation and lab time but stay colour-stable longer. Clinics that win international patients (think transparent plans, digital smile preview, honest indications) explain both options clearly — that is our approach at MediDent Istanbul.",
    ],
    sections: [
      {
        h2: "When bonding is the smarter choice",
        body: [
          "Single-tooth repairs, small aesthetic tweaks, younger patients, or anyone who wants reversible/minimal prep. Results are immediate; polishing and minor touch-ups are straightforward.",
          "Composite is more stain-prone than ceramic over years — coffee, tea and smoking habits matter. Maintenance visits keep the finish glossy.",
        ],
      },
      {
        h2: "When veneers or zirconia win",
        body: [
          "Full smile redesign, heavy staining, larger shape changes, or patients who want decade-long colour stability. Digital smile design shows your “after” before we start.",
          "Travel tip: veneer/zirconia cases need enough days for try-in and cementation. Bonding can be same-day — perfect as a first trip option.",
        ],
      },
      {
        h2: "Dental tourism tip for UK & EU patients",
        body: [
          "Send clear smile photos and any X-rays before you book flights. We map bonding vs veneers vs crowns so you do not overtreat. Packages can include coordinator support, transfer and hotel guidance near the clinic.",
        ],
      },
    ],
    faq: [
      {
        q: "Is bonding painful?",
        a: "Usually little to no anaesthesia is needed for small cases. Larger reshaping may use local anaesthetic.",
      },
      {
        q: "How long does bonding last?",
        a: "Typically several years with good care; chips can be repaired. Porcelain lasts longer but costs more and needs prep.",
      },
      {
        q: "Can bonding be done in one day in Istanbul?",
        a: "Yes — that is one of its biggest advantages for short-stay dental tourists.",
      },
      {
        q: "Bonding or Hollywood Smile zirconia?",
        a: "Hollywood Smile packages often use veneers/zirconia for a full arch transformation. Bonding suits subtler, faster changes.",
      },
    ],
    bullets: [
      "Same-day composite bonding for chips, gaps and edges.",
      "Porcelain veneers for lasting full-smile redesigns.",
      "Honest indication — we do not upsell crowns when bonding is enough.",
      "Photo-based free plan before you travel.",
    ],
  },
  {
    slug: "dental-tourism-istanbul-from-germany-uk",
    geoSlug: "dental-tourism-istanbul-germany-uk",
    tag: "Tourism",
    image: IMG.clinic,
    service: null,
    bucket: "marka",
    title: "Dental tourism in Istanbul from Germany & the UK: how MediDent plans your trip",
    meta: "Dental holiday Istanbul: zirconia, bonding, implants — transfers, hotels, English/German support at MediDent Üsküdar Acıbadem.",
    question: "How does dental tourism in Istanbul work for German and UK patients?",
    direct:
      "Dental tourism in Istanbul combines treatment (zirconia, bonding, implants, smile design) with a short city stay. MediDent Istanbul coordinates online consultation, airport transfer, hotel options and a compressed clinical calendar so patients from Germany and the UK can finish safely and return home with aftercare instructions.",
    intro: [
      "Patients from Germany, Austria, Switzerland and the UK increasingly choose Istanbul for cosmetic and implant dentistry: competitive fees versus Western Europe, modern CAD/CAM labs, and clinics experienced with international workflows.",
      "The difference between a stressful trip and a smooth one is coordination. Below is how MediDent Istanbul structures health-tourism cases — inspired by what top Istanbul clinics do well: clear plans, no surprise upsells, and human support in English and German.",
    ],
    sections: [
      {
        h2: "Step-by-step patient journey",
        body: [
          "1) WhatsApp/email photos + medical history → free preliminary plan. 2) Flights booked once dates fit clinically. 3) Airport pickup and hotel near Üsküdar/Acıbadem. 4) Exam, 3D imaging, final quote. 5) Treatment days. 6) Written aftercare + remote follow-up.",
          "Popular combinations: zirconia smile design, bonding refresh, All-on-4/6 implants, sedation for anxious patients.",
        ],
      },
      {
        h2: "Why Üsküdar Acıbadem?",
        body: [
          "Our clinic sits in a modern medical district with easy Asian-side access, sterile protocols and digital dentistry. You are not treated as a “package tourist” — each case is indication-led.",
        ],
      },
      {
        h2: "Savings vs quality — the honest frame",
        body: [
          "Turkey can cost significantly less than DE/UK private fees, but the smartest patients compare material brands, hygiene, warranty terms and who actually does the dentistry — not only the headline price. We put those details in writing before cementation.",
        ],
      },
    ],
    faq: [
      {
        q: "Do you speak German and English?",
        a: "Yes — coordination and clinical communication are available in English and German for international patients.",
      },
      {
        q: "How many days should I stay?",
        a: "Bonding: often 1–2 days. Veneers/zirconia: commonly 4–7 days. Implants: depends on grafting and loading protocol.",
      },
      {
        q: "Is airport transfer included?",
        a: "Transfer and hotel coordination can be packaged on request with your treatment plan.",
      },
      {
        q: "What if I need a follow-up at home?",
        a: "We share documentation for your local dentist and stay reachable via WhatsApp for photos and questions.",
      },
    ],
    bullets: [
      "Free photo-based plan before you book flights.",
      "Transfer + hotel coordination near the clinic.",
      "EN/DE patient support for EU travellers.",
      "Indication-led zirconia, bonding and implant plans.",
    ],
  },
  {
    slug: "sedation-dentistry-istanbul-anxious-patients",
    geoSlug: "sedation-dentistry-istanbul",
    tag: "Sedation",
    image: IMG.sedation,
    service: "genel-anestezi-ve-sedasyon",
    bucket: "kategori",
    title: "Sedation dentistry in Istanbul: calm treatment for anxious international patients",
    meta: "IV sedation and calm dentistry for dental phobia — monitored care at MediDent Istanbul for tourists.",
    question: "What is sedation dentistry in Istanbul?",
    direct:
      "Sedation dentistry uses monitored IV sedation or related techniques so anxious patients can complete implants, extractions or smile makeovers comfortably. At MediDent Istanbul, vitals are tracked throughout; international patients can combine sedation with a short dental-tourism stay.",
    intro: [
      "Dental fear should not block a healthy smile. Sedation lets you rest while the team works — with pulse oximetry, IV access and continuous monitoring.",
    ],
    sections: [
      {
        h2: "Who is a candidate?",
        body: [
          "Patients with strong dental anxiety, long surgical appointments, or strong gag reflex. Medical history review is mandatory before any sedation.",
        ],
      },
      {
        h2: "Tourism logistics",
        body: [
          "Plan a responsible adult escort after deeper sedation, avoid driving, and rest at your hotel. We schedule denser treatment under one calm session when safe.",
        ],
      },
    ],
    faq: [
      { q: "Is sedation safe?", a: "With proper screening and monitoring, modern sedation protocols are routinely used worldwide." },
      { q: "Will I be fully unconscious?", a: "Conscious sedation keeps you responsive but deeply relaxed; general anaesthesia is reserved for selected cases." },
      { q: "Can tourists request sedation?", a: "Yes — tell us early so we plan anaesthesiology support and recovery time." },
      { q: "Cost factors?", a: "Type of sedation, duration and combined procedures determine the fee — quoted after assessment." },
    ],
    bullets: [
      "Monitored IV sedation for dental phobia.",
      "Ideal for long implant or full-mouth sessions.",
      "Recovery plan for hotel stay after treatment.",
      "Available for EN/DE-speaking dental tourists.",
    ],
  },
  {
    slug: "same-day-dental-implants-istanbul",
    geoSlug: "same-day-implants-istanbul",
    tag: "Implants",
    image: IMG.implant,
    service: "implantoloji-implant-tedavisi",
    bucket: "kategori",
    title: "Same-day dental implants in Istanbul: immediate temporary teeth",
    meta: "Immediate loading implants in Istanbul — when same-day temporary crowns are possible at MediDent.",
    question: "What are same-day dental implants?",
    direct:
      "Same-day implants place a titanium implant and, when primary stability allows, a temporary crown or bridge in one visit. Final zirconia or porcelain is fitted after healing. MediDent Istanbul evaluates bone with 3D imaging before promising immediate loading.",
    intro: [
      "Immediate loading is powerful for dental tourists who want to leave Istanbul with teeth — not a gap. It is not automatic: bone quality and stability decide.",
    ],
    sections: [
      {
        h2: "Clinical criteria",
        body: [
          "Adequate bone, controlled bite forces, no active infection. All-on-4/6 concepts may use immediate fixed provisionals for full-arch cases.",
        ],
      },
      {
        h2: "Aftercare for travellers",
        body: [
          "Soft diet, hygiene protocol, and scheduled remote checks. Final prosthetic stage may need a second short visit depending on the plan.",
        ],
      },
    ],
    faq: [
      { q: "Is same-day always possible?", a: "No — only when stability and biology allow. We never force immediate loading." },
      { q: "Pain level?", a: "Local anaesthesia ± sedation; post-op discomfort is managed with medication." },
      { q: "Brands used?", a: "We discuss implant systems and warranty documentation before surgery." },
      { q: "All-on-4 for tourists?", a: "Often suitable with a structured stay; ask for a photo/CT-based preview plan." },
    ],
    bullets: [
      "3D planning before promising immediate teeth.",
      "Temporary aesthetics on the surgery day when safe.",
      "Final zirconia after osseointegration.",
      "Tourist-friendly calendar and aftercare.",
    ],
  },
  {
    slug: "digital-smile-design-laminate-veneers-istanbul",
    geoSlug: "digital-smile-design-istanbul",
    tag: "Smile design",
    image: IMG.smile,
    service: "estetik-dis-hekimligi",
    bucket: "kategori",
    title: "Digital smile design & laminate veneers in Istanbul",
    meta: "DSD + laminate veneers: see your new smile before treatment at MediDent Istanbul.",
    question: "What is digital smile design with laminate veneers?",
    direct:
      "Digital smile design analyses facial proportions and previews your veneers on screen before any irreversible prep. Laminate veneers are thin porcelain shells for colour, shape and symmetry — a core Hollywood Smile service for international patients at MediDent Istanbul.",
    intro: [
      "Seeing the “after” before you commit is what serious cosmetic clinics offer. We combine DSD mock-ups, shade guides and trial smiles so UK/EU patients travel with confidence.",
    ],
    sections: [
      {
        h2: "From screen to cementation",
        body: [
          "Photos and scans → design → mock-up → prep → lab veneers → try-in → bond. Zirconia may be chosen instead when strength is critical.",
        ],
      },
      {
        h2: "Stay length",
        body: [
          "Most veneer journeys need several clinical days in Istanbul. We align the schedule with your flights.",
        ],
      },
    ],
    faq: [
      { q: "Are veneers reversible?", a: "Porcelain veneers usually need enamel reduction and are considered irreversible." },
      { q: "E-max or zirconia?", a: "E-max/lithium disilicate for high translucency fronts; zirconia when more strength is needed." },
      { q: "Staining?", a: "Porcelain resists stains far better than composite bonding." },
      { q: "Can I approve the design first?", a: "Yes — digital preview and in-mouth mock-up when indicated." },
    ],
    bullets: [
      "On-screen smile preview before prep.",
      "Laminate veneers for natural Hollywood Smile results.",
      "Flight-synced treatment calendar.",
      "Shade matching with clinical guides.",
    ],
  },
  {
    slug: "safe-tooth-extraction-istanbul",
    geoSlug: "tooth-extraction-istanbul",
    tag: "Surgery",
    image: IMG.extraction,
    service: "agiz-dis-ve-cene-cerrahisi",
    bucket: "problem",
    title: "Safe tooth extraction in Istanbul: pain-controlled surgical care",
    meta: "Atraumatic extractions teeth, digital X-rays and calm protocols at MediDent Istanbul.",
    question: "How does professional tooth extraction work in Istanbul?",
    direct:
      "Professional extraction uses anaesthesia, sterile technique and digital imaging. The tooth is removed atraumatically when possible; gauze and medication guide healing. At MediDent Istanbul, anxious tourists may combine extraction with sedation and implant planning in one trip.",
    intro: [
      "Extractions should feel controlled — not traumatic. We focus on gentle technique, clear aftercare and optional immediate implant discussion.",
    ],
    sections: [
      {
        h2: "Aftercare for travellers",
        body: [
          "Bite on gauze, avoid smoking/straws, soft foods, and contact us if bleeding persists. We provide written instructions in English or German.",
        ],
      },
    ],
    faq: [
      { q: "Will it hurt?", a: "You should be numb during the procedure; mild soreness afterwards is expected." },
      { q: "Wisdom teeth?", a: "Impacted wisdom teeth may need surgical extraction with 3D planning." },
      { q: "Extract and implant same trip?", a: "Sometimes — depending on infection and bone. Assessed case by case." },
      { q: "Stitches?", a: "Dissolvable or removable sutures depending on the site." },
    ],
    bullets: [
      "Anaesthesia-first, sterile surgical protocol.",
      "Digital X-ray guidance.",
      "EN/DE aftercare sheets for tourists.",
      "Optional link to implant replacement.",
    ],
  },
  {
    slug: "pediatric-dentistry-istanbul-family-travel",
    geoSlug: "pediatric-dentistry-istanbul",
    tag: "Kids",
    image: IMG.kids,
    service: "pedodonti-cocuk-dis-hekimligi",
    bucket: "kategori",
    title: "Pediatric dentistry in Istanbul: gentle first visits for families",
    meta: "Child-friendly dentistry at MediDent Istanbul — play-based exams for travelling families.",
    question: "What is pediatric dentistry like at MediDent Istanbul?",
    direct:
      "Pediatric dentistry focuses on fear-free first exams, prevention and age-appropriate treatment. MediDent Istanbul uses play models and a calm environment — useful for expat and travelling families in Istanbul.",
    intro: [
      "A positive first visit shapes a lifetime of dental health. We keep tools colourful, explanations simple and parents involved.",
    ],
    sections: [
      {
        h2: "Services for children",
        body: [
          "Check-ups, fluoride, sealants, fillings and guidance on habits. Complex cases are planned gently with parents.",
        ],
      },
    ],
    faq: [
      { q: "From what age?", a: "Often around the eruption of the first teeth or by age one — ask us for guidance." },
      { q: "Languages?", a: "We communicate with parents in English/German as needed." },
      { q: "Sedation for kids?", a: "Only when indicated and with strict safety protocols." },
      { q: "Emergency while travelling?", a: "Contact us for urgent advice and appointments when available." },
    ],
    bullets: [
      "Play-based fear reduction.",
      "Prevention-first philosophy.",
      "Parent communication in EN/DE.",
      "Family-friendly clinic environment.",
    ],
  },
  {
    slug: "microscopic-root-canal-istanbul",
    geoSlug: "root-canal-microscope-istanbul",
    tag: "Endodontics",
    image: IMG.canal,
    service: "endodonti-kanal-tedavileri",
    bucket: "kategori",
    title: "Microscopic root canal treatment in Istanbul: save the tooth",
    meta: "Microscope-assisted endodontics to save natural teeth — MediDent Istanbul.",
    question: "What is microscope-assisted root canal treatment?",
    direct:
      "Microscope-assisted root canal treatment cleans and seals canals under magnification to save a tooth that might otherwise be extracted. MediDent Istanbul uses this precision approach for locals and dental tourists who want to keep their natural tooth.",
    intro: [
      "Saving a tooth beats rushing to extraction when the canal anatomy can be cleaned predictably. Magnification improves accuracy.",
    ],
    sections: [
      {
        h2: "Tourism note",
        body: [
          "Single-visit or two-visit protocols depend on infection. Crowns (often zirconia) may follow to protect the tooth — plan stay length accordingly.",
        ],
      },
    ],
    faq: [
      { q: "Is a root canal painful?", a: "With anaesthesia, the goal is a comfortable appointment; tenderness afterwards can occur." },
      { q: "Why a microscope?", a: "Better visualisation of canals, cracks and missed anatomy." },
      { q: "Do I need a crown after?", a: "Often yes for back teeth — we advise case by case." },
      { q: "Alternative?", a: "Extraction and implant — discussed if the tooth is unrestorable." },
    ],
    bullets: [
      "Magnified canal cleaning and sealing.",
      "Tooth-first philosophy when predictable.",
      "Crown protection planning for travellers.",
      "Clear EN/DE explanations.",
    ],
  },
  {
    slug: "gum-health-periodontology-istanbul",
    geoSlug: "gum-health-periodontology-istanbul",
    tag: "Periodontology",
    image: IMG.perio,
    service: "periodontoloji-diseti-hastaliklari",
    bucket: "problem",
    title: "Gum health & periodontology in Istanbul: the foundation of every smile",
    meta: "Healthy gums before zirconia or implants — periodontal care at MediDent Istanbul.",
    question: "Why is gum health essential before cosmetic dentistry?",
    direct:
      "Healthy pink gums are the foundation for zirconia, veneers and implants. Bleeding or recession needs periodontal care first. MediDent Istanbul stabilises gums before aesthetic or implant work — critical for lasting dental-tourism results.",
    intro: [
      "A Hollywood Smile on inflamed gums fails. We treat the foundation first: cleaning, hygiene coaching and periodontal therapy when needed.",
    ],
    sections: [
      {
        h2: "Home care that protects your investment",
        body: [
          "Interdental brushes, correct brushing, and recall visits keep veneers and implants looking new after you fly home.",
        ],
      },
    ],
    faq: [
      { q: "Bleeding gums — normal?", a: "No — usually a sign of inflammation that should be assessed." },
      { q: "Before implants?", a: "Active gum disease should be controlled first." },
      { q: "How many visits?", a: "From a single hygiene session to a multi-visit perio plan." },
      { q: "Tourists welcome?", a: "Yes — we can front-load hygiene before cosmetic days." },
    ],
    bullets: [
      "Gums first, cosmetics second.",
      "Interdental hygiene coaching.",
      "Protects zirconia and implant investments.",
      "Fits into tourism calendars.",
    ],
  },
];

/** ---------- GERMAN ---------- */
const DE = [
  {
    slug: "zirkonkronen-tuerkei-kosten-ablauf-2026",
    geoSlug: "was-sind-zirkonkronen",
    tag: "Zirkon",
    image: IMG.zirconia,
    service: "estetik-dis-hekimligi",
    bucket: "kategori",
    title: "Zirkonkronen in der Türkei 2026: Kostenfaktoren, CAD/CAM & natürliche Ästhetik",
    meta: "Zirkonkronen in Istanbul: CAD/CAM-Ablauf, Preisfaktoren und Zahntourismus bei MediDent Istanbul.",
    question: "Was sind Zirkonkronen und warum Istanbul?",
    direct:
      "Zirkonkronen sind metallfreie Restaurationen aus hochfestem Zirkonoxid, digital gefräst (CAD/CAM) und natürlich lichtdurchlässig. Bei MediDent Istanbul (Üsküdar Acıbadem) erhalten Patienten aus Deutschland und der EU nach Untersuchung und Scan einen klaren Plan — oft in einem kurzen Aufenthalt.",
    intro: [
      "Zirkonkronen ersetzen stark zerstörte oder gefüllte Zähne durch eine stabile, metallfreie Krone mit zahnähnlicher Transluzenz. Für Patientinnen und Patienten aus Deutschland, Österreich und der Schweiz ist Istanbul ein etabliertes Ziel: moderne Labore, erfahrene Teams und Behandlungsfenster, die zu einer Kurzurlaubsreise passen.",
      "Dieser Ratgeber erklärt Herstellung, Preisfaktoren (ohne unseriöse Dumping-Versprechen) und den Ablauf für Zahntouristen — im Stil der Kliniken, die international wirklich empfohlen werden.",
    ],
    sections: [
      {
        h2: "So entstehen Zirkonkronen (CAD/CAM)",
        body: [
          "Unter örtlicher Betäubung wird der Zahn minimal beschliffen. Der digitale Scan geht ins Labor: CAD/CAM fräst das Gerüst, Keramikschichtung und Charakterisierung erzeugen Farbe und Natürlichkeit. Provisorien schützen Ästhetik und Funktion in der Zwischenzeit.",
          "Digitale Fertigung reduziert Passungenauigkeiten. Die fertige Krone soll dicht abschließen, Bakterien fernhalten und im Licht natürlich wirken — besonders in der Smile-Linie.",
        ],
      },
      {
        h2: "Was beeinflusst die Preise für Zirkon in der Türkei?",
        body: [
          "Materialmarke und Herkunft, Anzahl der Zähne, vorherige Füllungen/Wurzelbehandlungen, Zahnposition, Erfahrung von Zahnarzt und Techniker sowie monolithisches vs. geschichtetes Zirkon.",
          "Bei MediDent Istanbul gibt es den verbindlichen Plan nach Befund und Bildgebung — nicht als anonyme Online-Pauschale. Genau so arbeiten seriöse Istanbuler Kliniken für internationale Patienten.",
        ],
      },
      {
        h2: "Reiseablauf für Patienten aus Deutschland",
        body: [
          "Viele Fälle lassen sich digital in 4–7 Tagen strukturieren; einfachere Situationen gehen schneller. Auf Wunsch organisieren wir Transfer vom Flughafen und Hotelnahe Unterkunft in Üsküdar/Acıbadem — mit deutschsprachiger Koordination.",
          "Sie reisen mit fertigen Restaurationen und schriftlicher Nachsorge ab. Follow-up per Foto/WhatsApp ist möglich.",
        ],
      },
    ],
    faq: [
      {
        q: "Sind Zirkonkronen schmerzhaft?",
        a: "Die Präparation erfolgt unter Anästhesie. Leichte Empfindlichkeit danach ist normal und wird begleitet.",
      },
      {
        q: "Zirkon oder Porzellan-Veneers?",
        a: "Veneers eignen sich vor allem für Frontzahnästhetik mit weniger Substanzabtrag. Kronen schützen strukturell geschwächte Zähne.",
      },
      {
        q: "Wie lange halten Zirkonkronen?",
        a: "Mit guter Hygiene oft 10+ Jahre. Knirschen, Trauma oder mangelnde Pflege verkürzen die Lebensdauer.",
      },
      {
        q: "Kann ich aus Deutschland anreisen?",
        a: "Ja. Wir verdichten den Kalender, soweit medizinisch sicher, und helfen bei Transfer und Aufenthalt. Fotos/Röntgen für einen kostenlosen Vorabplan senden.",
      },
    ],
    bullets: [
      "Metallfreies CAD/CAM-Zirkon mit natürlicher Transluzenz.",
      "Preis nach Befund — Material, Zahnzahl und Laborqualität zählen.",
      "Kurzurlaub-Protokoll für DE/AT/CH-Patienten.",
      "Nachsorge und Remote-Follow-up.",
    ],
  },
  {
    slug: "bonding-vs-veneers-istanbul",
    geoSlug: "was-ist-zahn-bonding",
    tag: "Bonding",
    image: IMG.bonding,
    service: "estetik-dis-hekimligi",
    bucket: "karsilastirma",
    title: "Bonding vs. Veneers in Istanbul: welche Lösung passt zu Ihnen?",
    meta: "Composite-Bonding vs. Keramikveneers für Zahntouristen — ehrliche Indikation bei MediDent Istanbul.",
    question: "Was ist Zahn-Bonding und wie unterscheidet es sich von Veneers?",
    direct:
      "Bonding formt zahnfarbenes Komposit oft in einer Sitzung — ideal für Absplitterungen, Lücken und kleine Formkorrekturen, meist ohne starkes Beschleifen. Keramikveneers sind laborgefertigte Schalen für langanhaltende Smile-Designs. MediDent Istanbul wählt die Indikation nach Ziel, Budget und Aufenthaltsdauer.",
    intro: [
      "Bonding (Composite Veneers / direktes Bonding) ist der schnellste Weg zu einem frischeren Lächeln — perfekt für einen kurzen Istanbul-Aufenthalt.",
      "Keramik- oder E-max-Veneers brauchen Laborzeit, bleiben aber farbstabiler. Gute Kliniken erklären beide Wege transparent — genau das tun wir.",
    ],
    sections: [
      {
        h2: "Wann Bonding die klügere Wahl ist",
        body: [
          "Einzelzahn-Korrekturen, dezente Ästhetik, Wunsch nach Minimalinvasivität und Sofortergebnis. Politur und kleine Reparaturen sind unkompliziert.",
          "Komposit kann über Jahre eher verfärben — Kaffee, Tee, Rauchen beachten.",
        ],
      },
      {
        h2: "Wann Veneers oder Zirkon besser sind",
        body: [
          "Komplettes Smile Design, starke Verfärbungen, größere Formänderungen, Wunsch nach jahrelanger Farbstabilität. Digitales Smile Design zeigt das „Danach“ vorab.",
          "Reisetipp: Veneers/Zirkon brauchen genug Behandlungstage. Bonding kann oft am selben Tag fertig sein.",
        ],
      },
      {
        h2: "Tipp für Patienten aus DE/AT/CH",
        body: [
          "Vor dem Flug klare Fotos senden. Wir prüfen Bonding vs. Veneers vs. Kronen — ohne Übertherapie. Pakete mit Koordination, Transfer und Hotelhinweisen sind möglich.",
        ],
      },
    ],
    faq: [
      { q: "Tut Bonding weh?", a: "Bei kleinen Fällen oft ohne Betäubung; größere Formungen ggf. mit Lokalanästhesie." },
      { q: "Haltbarkeit?", a: "Mehrere Jahre mit guter Pflege; Keramik hält in der Regel länger." },
      { q: "Geht Bonding an einem Tag?", a: "Ja — ein großer Vorteil für Kurzurlaub-Patienten." },
      { q: "Bonding oder Hollywood Smile mit Zirkon?", a: "Hollywood-Smile-Pakete nutzen oft Veneers/Zirkon für die ganze Front. Bonding ist subtiler und schneller." },
    ],
    bullets: [
      "Same-Day-Bonding für Chips, Lücken und Kanten.",
      "Keramikveneers für dauerhafte Smile-Designs.",
      "Ehrliche Indikation — kein Upselling.",
      "Kostenloser Foto-Plan vor der Reise.",
    ],
  },
  {
    slug: "zahntourismus-istanbul-aus-deutschland",
    geoSlug: "zahntourismus-istanbul-deutschland",
    tag: "Zahntourismus",
    image: IMG.clinic,
    service: null,
    bucket: "marka",
    title: "Zahntourismus Istanbul aus Deutschland: so plant MediDent Ihre Reise",
    meta: "Zahnbehandlung Istanbul für DE/AT/CH: Zirkon, Bonding, Implantate — Transfer, Hotel, deutsche Betreuung.",
    question: "Wie funktioniert Zahntourismus in Istanbul für Patienten aus Deutschland?",
    direct:
      "Zahntourismus in Istanbul verbindet Behandlung (Zirkon, Bonding, Implantate, Smile Design) mit einem Kurzurlaub. MediDent Istanbul koordiniert Online-Beratung, Flughafentransfer, Hoteloptionen und einen verdichteten Behandlungsplan — mit deutscher Betreuung und klarer Nachsorge.",
    intro: [
      "Immer mehr Patientinnen und Patienten aus Deutschland, Österreich und der Schweiz wählen Istanbul für ästhetische Zahnmedizin und Implantate: spürbar günstiger als viele EU-Privatpraxen, moderne CAD/CAM-Labore, internationale Abläufe.",
      "Der Unterschied zwischen Stress und Souveränität ist Organisation. So strukturieren wir Fälle — angelehnt an das, was führende Istanbuler Kliniken richtig machen: klare Pläne, keine Überraschungs-Upsells, menschliche Begleitung.",
    ],
    sections: [
      {
        h2: "Ablauf Schritt für Schritt",
        body: [
          "1) Fotos + Anamnese per WhatsApp → kostenloser Vorabplan. 2) Flüge nach klinischem Zeitfenster. 3) Transfer & Hotel nahe Üsküdar/Acıbadem. 4) Befund, 3D, finales Angebot. 5) Behandlungstage. 6) Schriftliche Nachsorge + Remote-Follow-up.",
          "Beliebte Kombinationen: Zirkon-Smile-Design, Bonding-Refresh, All-on-4/6, Sedierung bei Angst.",
        ],
      },
      {
        h2: "Warum Üsküdar Acıbadem?",
        body: [
          "Moderne medizinische Lage, sterile Protokolle, digitale Zahnmedizin. Sie werden indikationsbezogen behandelt — nicht als anonymes „Paket“.",
        ],
      },
      {
        h2: "Sparen vs. Qualität — ehrlich erklärt",
        body: [
          "Die Türkei kann deutlich unter DE-Privatpreisen liegen. Kluge Patienten vergleichen Materialmarken, Hygiene, Garantie und wer wirklich behandelt — nicht nur den Werbepreis. Wir schreiben das vor dem Einsetzen fest.",
        ],
      },
    ],
    faq: [
      { q: "Sprechen Sie Deutsch?", a: "Ja — Koordination und Aufklärung sind für internationale Patienten auf Deutsch möglich." },
      { q: "Wie viele Tage Aufenthalt?", a: "Bonding: oft 1–2 Tage. Veneers/Zirkon: häufig 4–7 Tage. Implantate: je nach Aufbau und Belastung." },
      { q: "Transfer vom Flughafen?", a: "Transfer und Hotelkoordination können auf Wunsch mit dem Plan gebucht werden." },
      { q: "Nachsorge in Deutschland?", a: "Dokumentation für Ihren Zahnarzt vor Ort; wir bleiben per WhatsApp erreichbar." },
    ],
    bullets: [
      "Kostenloser Foto-Plan vor dem Flug.",
      "Transfer + Hotelnahe Unterkunft.",
      "Deutsche Patientenbetreuung.",
      "Indikationsgeleitete Zirkon-/Bonding-/Implantatpläne.",
    ],
  },
  {
    slug: "sedierung-zahnbehandlung-istanbul",
    geoSlug: "sedierung-zahnbehandlung-istanbul",
    tag: "Sedierung",
    image: IMG.sedation,
    service: "genel-anestezi-ve-sedasyon",
    bucket: "kategori",
    title: "Sedierung in Istanbul: entspannte Zahnbehandlung trotz Angst",
    meta: "IV-Sedierung und Angstpatienten-Betreuung bei MediDent Istanbul — auch für Zahntouristen.",
    question: "Was ist eine sedierte Zahnbehandlung in Istanbul?",
    direct:
      "Bei der Sedierung werden Angst und Anspannung medikamentös gesenkt, während Vitalparameter überwacht werden. MediDent Istanbul bietet ruhige Behandlungen für Impantate, Extraktionen oder Smile-Design — auch im Rahmen eines kurzen Istanbul-Aufenthalts.",
    intro: [
      "Zahnarztangst darf kein Dauerzustand bleiben. Mit überwachter Sedierung ruhen Sie, während das Team arbeitet.",
    ],
    sections: [
      {
        h2: "Für wen geeignet?",
        body: [
          "Starke Angst, lange Eingriffe, Würgereiz. Vorher ist eine medizinische Freigabe nötig.",
        ],
      },
      {
        h2: "Hinweise für Reisende",
        body: [
          "Begleitperson nach tieferer Sedierung einplanen, nicht selbst fahren, im Hotel ausruhen. Wo sinnvoll bündeln wir Behandlungsschritte.",
        ],
      },
    ],
    faq: [
      { q: "Ist Sedierung sicher?", a: "Mit Screening und Monitoring sind moderne Protokolle etabliert." },
      { q: "Bin ich bewusstlos?", a: "Bei Bewusstseinssedierung bleiben Sie ansprechbar, aber tief entspannt." },
      { q: "Für Touristen möglich?", a: "Ja — früh anmelden, damit Anästhesie und Erholung geplant werden." },
      { q: "Kosten?", a: "Art, Dauer und kombinierte Eingriffe bestimmen den Preis — nach Einschätzung." },
    ],
    bullets: [
      "Überwachte IV-Sedierung bei Angst.",
      "Ideal für lange Implantat- oder Full-Mouth-Sitzungen.",
      "Erholungsplan für den Hotelaufenthalt.",
      "Deutsche Aufklärung möglich.",
    ],
  },
  {
    slug: "sofortimplantate-istanbul-1-tag",
    geoSlug: "sofortimplantate-istanbul",
    tag: "Implantate",
    image: IMG.implant,
    service: "implantoloji-implant-tedavisi",
    bucket: "kategori",
    title: "Sofortimplantate in Istanbul: provisorische Zähne am selben Tag",
    meta: "Immediate Loading in Istanbul — wann Sofortversorgung möglich ist (MediDent).",
    question: "Was sind Sofortimplantate (Zähne am selben Tag)?",
    direct:
      "Sofortimplantate setzen bei ausreichender Primärstabilität ein Implantat und ein Provisorium in einer Sitzung. Die endgültige Zirkon- oder Keramikversorgung folgt nach Einheilung. MediDent Istanbul prüft den Knochen per 3D, bevor Immediate Loading zugesagt wird.",
    intro: [
      "Immediate Loading ist für Zahntouristen attraktiv — aber nur, wenn Biologie und Stabilität es erlauben.",
    ],
    sections: [
      {
        h2: "Klinische Kriterien",
        body: [
          "Ausreichend Knochen, kontrollierte Belastung, keine aktive Infektion. All-on-4/6 kann mit festsitzenden Provisorien arbeiten.",
        ],
      },
      {
        h2: "Nachsorge für Reisende",
        body: [
          "Weiche Kost, Hygieneprotokoll, Remote-Kontrollen. Die definitive Versorgung kann einen zweiten Kurzaufenthalt brauchen.",
        ],
      },
    ],
    faq: [
      { q: "Immer möglich?", a: "Nein — nur bei geeigneter Stabilität." },
      { q: "Schmerzen?", a: "Lokalanästhesie ± Sedierung; postoperative Beschwerden werden medikamentös begleitet." },
      { q: "Welche Marken?", a: "Systeme und Garantiedokumente besprechen wir vor dem Eingriff." },
      { q: "All-on-4 für DE-Patienten?", a: "Häufig mit strukturiertem Aufenthalt — Vorabplan per Foto/CT." },
    ],
    bullets: [
      "3D-Planung vor Sofortversprechen.",
      "Provisorische Ästhetik am OP-Tag wenn sicher.",
      "Definitives Zirkon nach Osseointegration.",
      "Touristenfreundlicher Kalender.",
    ],
  },
  {
    slug: "digitales-laecheln-design-veneers-istanbul",
    geoSlug: "digitales-laecheln-design-istanbul",
    tag: "Smile Design",
    image: IMG.smile,
    service: "estetik-dis-hekimligi",
    bucket: "kategori",
    title: "Digitales Lächeln-Design & Laminat-Veneers in Istanbul",
    meta: "DSD + Laminat-Veneers: neues Lächeln vorab sehen — MediDent Istanbul.",
    question: "Was ist digitales Lächeln-Design mit Laminat-Veneers?",
    direct:
      "Digitales Smile Design analysiert Gesichtsproportionen und zeigt Veneers am Bildschirm, bevor irreversibel beschliffen wird. Laminat-Veneers sind dünne Keramikschalen für Farbe, Form und Symmetrie — Kernleistung für internationale Patienten bei MediDent Istanbul.",
    intro: [
      "Das „Danach“ vor dem Commitment zu sehen ist Standard guter Cosmetik-Kliniken. Mock-ups und Farbnahmen geben Sicherheit vor der Anreise.",
    ],
    sections: [
      {
        h2: "Vom Screen zur Befestigung",
        body: [
          "Fotos/Scans → Design → Mock-up → Präparation → Labor → Einprobe → Kleben. Zirkon statt Veneer, wenn mehr Festigkeit nötig ist.",
        ],
      },
      {
        h2: "Aufenthaltsdauer",
        body: [
          "Die meisten Veneer-Fälle brauchen mehrere Behandlungstage. Wir synchronisieren mit Ihren Flügen.",
        ],
      },
    ],
    faq: [
      { q: "Sind Veneers reversibel?", a: "Meist nicht — Schmelzreduktion ist üblich." },
      { q: "E-max oder Zirkon?", a: "E-max für maximale Transluzenz vorne; Zirkon bei höherer Belastung." },
      { q: "Verfärbung?", a: "Keramik ist deutlich farbstabiler als Komposit-Bonding." },
      { q: "Design vorher freigeben?", a: "Ja — digital und ggf. Mock-up im Mund." },
    ],
    bullets: [
      "Bildschirm-Preview vor der Präparation.",
      "Laminat-Veneers für natürliches Hollywood Smile.",
      "Flugsynchroner Kalender.",
      "Professionelle Farbnahme.",
    ],
  },
  {
    slug: "zahnentfernung-istanbul-schmerzarm",
    geoSlug: "zahnentfernung-istanbul",
    tag: "Chirurgie",
    image: IMG.extraction,
    service: "agiz-dis-ve-cene-cerrahisi",
    bucket: "problem",
    title: "Zahnentfernung in Istanbul: kontrolliert und so atraumatisch wie möglich",
    meta: "Schonende Extraktion, digitale Röntgenkontrolle und Nachsorge auf Deutsch — MediDent.",
    question: "Wie läuft eine professionelle Zahnentfernung in Istanbul ab?",
    direct:
      "Professionelle Extraktion erfolgt unter Anästhesie, steril und bildgebungsgeführt. Der Zahn wird möglichst atraumatisch entfernt; Gaze und Medikamente steuern die Heilung. Bei MediDent Istanbul können ängstliche Touristen Sedierung und Implantatplanung kombinieren.",
    intro: [
      "Extraktion soll kontrolliert wirken — nicht traumatisch. Sanfte Technik, klare Nachsorge, optional Implantatersatz.",
    ],
    sections: [
      {
        h2: "Nachsorge für Reisende",
        body: [
          "Auf Gaze beißen, nicht rauchen/mit Strohhalm trinken, weiche Kost. Bei anhaltender Blutung melden. Anweisungen auf Deutsch/Englisch.",
        ],
      },
    ],
    faq: [
      { q: "Tut es weh?", a: "Währenddessen sollten Sie betäubt sein; danach leichte Beschwerden möglich." },
      { q: "Weisheitszähne?", a: "Retiniert ggf. chirurgisch mit 3D-Planung." },
      { q: "Extraktion und Implantat in einer Reise?", a: "Manchmal — abhängig von Infektion und Knochen." },
      { q: "Nähte?", a: "Je nach Situation resorbierbar oder zu entfernen." },
    ],
    bullets: [
      "Anästhesie-first, steriles Protokoll.",
      "Digitale Röntgenführung.",
      "DE/EN-Nachsorgeblätter.",
      "Optionaler Übergang zum Implantat.",
    ],
  },
  {
    slug: "kinderzahnheilkunde-istanbul",
    geoSlug: "kinderzahnheilkunde-istanbul",
    tag: "Kinder",
    image: IMG.kids,
    service: "pedodonti-cocuk-dis-hekimligi",
    bucket: "kategori",
    title: "Kinderzahnheilkunde in Istanbul: angstfreie Erstuntersuchung",
    meta: "Spielerische Kinderzahnmedizin bei MediDent Istanbul — für Familien und Expats.",
    question: "Wie läuft die Kinderzahnheilkunde bei MediDent Istanbul?",
    direct:
      "Kinderzahnheilkunde setzt auf angstfreie Erstuntersuchungen, Prävention und altersgerechte Behandlung. MediDent Istanbul arbeitet mit Spielmodellen und ruhiger Atmosphäre — ideal für Familien und Expats in Istanbul.",
    intro: [
      "Ein positiver Erstbesuch prägt das ganze Leben. Bunte Hilfsmittel, einfache Sprache, Eltern einbezogen.",
    ],
    sections: [
      {
        h2: "Leistungen",
        body: [
          "Kontrollen, Fluorid, Fissurenversiegelung, Füllungen, Beratung zu Gewohnheiten. Komplexe Fälle behutsam mit den Eltern geplant.",
        ],
      },
    ],
    faq: [
      { q: "Ab welchem Alter?", a: "Oft mit Durchbruch der ersten Zähne bzw. im ersten Lebensjahr — wir beraten Sie." },
      { q: "Deutsch?", a: "Aufklärung der Eltern auf Deutsch/Englisch möglich." },
      { q: "Sedierung bei Kindern?", a: "Nur bei Indikation und strengen Sicherheitsregeln." },
      { q: "Notfall auf Reisen?", a: "Kontaktieren Sie uns für dringende Termine nach Verfügbarkeit." },
    ],
    bullets: [
      "Spielbasierte Angstreduktion.",
      "Prävention zuerst.",
      "Elternkommunikation DE/EN.",
      "Familienfreundliche Atmosphäre.",
    ],
  },
  {
    slug: "wurzelbehandlung-mikroskop-istanbul",
    geoSlug: "wurzelbehandlung-mikroskop-istanbul",
    tag: "Endodontie",
    image: IMG.canal,
    service: "endodonti-kanal-tedavileri",
    bucket: "kategori",
    title: "Wurzelbehandlung unter dem Mikroskop in Istanbul: den Zahn retten",
    meta: "Mikroskopische Endodontie zum Zahnerhalt — MediDent Istanbul.",
    question: "Was ist eine mikroskopgestützte Wurzelbehandlung?",
    direct:
      "Die mikroskopgestützte Wurzelbehandlung reinigt und füllt Kanäle unter Vergrößerung, um den Zahn zu erhalten. MediDent Istanbul nutzt diesen Präzisionsansatz für lokale und internationale Patienten.",
    intro: [
      "Zahnerhalt schlägt übereilte Extraktion, wenn die Anatomie vorhersagbar aufbereitet werden kann.",
    ],
    sections: [
      {
        h2: "Hinweis für Touristen",
        body: [
          "Ein- oder zweizeitig je nach Infektion. Danach oft Krone (häufig Zirkon) — Aufenthaltsdauer entsprechend planen.",
        ],
      },
    ],
    faq: [
      { q: "Schmerzhaft?", a: "Ziel ist eine schmerzfreie Sitzung unter Anästhesie; danach leichte Empfindlichkeit möglich." },
      { q: "Warum Mikroskop?", a: "Bessere Sicht auf Kanäle, Risse und versteckte Anatomie." },
      { q: "Krone danach?", a: "Bei Seitenzähnen oft ja — individuell." },
      { q: "Alternative?", a: "Extraktion und Implantat, wenn der Zahn nicht erhaltungswürdig ist." },
    ],
    bullets: [
      "Vergrößerte Kanalaufbereitung.",
      "Zahnerhalt wenn vorhersagbar.",
      "Kronenplanung für Reisende.",
      "Klare DE/EN-Aufklärung.",
    ],
  },
  {
    slug: "zahnfleischgesundheit-parodontologie-istanbul",
    geoSlug: "zahnfleischgesundheit-istanbul",
    tag: "Parodontologie",
    image: IMG.perio,
    service: "periodontoloji-diseti-hastaliklari",
    bucket: "problem",
    title: "Zahnfleischgesundheit in Istanbul: das Fundament jeder ästhetischen Behandlung",
    meta: "Gesundes Zahnfleisch vor Zirkon oder Implantaten — Parodontologie bei MediDent.",
    question: "Warum ist gesundes Zahnfleisch vor der Ästhetik so wichtig?",
    direct:
      "Gesundes, rosa Zahnfleisch ist die Basis für Zirkon, Veneers und Implantate. Blutung oder Rückgang brauchen zuerst Parodontaltherapie. MediDent Istanbul stabilisiert das Zahnfleisch vor ästhetischen Eingriffen — entscheidend für nachhaltige Zahntourismus-Ergebnisse.",
    intro: [
      "Ein Hollywood Smile auf entzündetem Zahnfleisch hält nicht. Fundament zuerst: Reinigung, Mundhygiene-Training, Parodontaltherapie.",
    ],
    sections: [
      {
        h2: "Zuhause nach der Reise",
        body: [
          "Interdentalbürsten, richtige Putztechnik und Recall-Termine schützen Veneers und Implantate nach der Rückkehr nach Deutschland.",
        ],
      },
    ],
    faq: [
      { q: "Zahnfleischbluten normal?", a: "Nein — meist Entzündung, abklären lassen." },
      { q: "Vor Implantaten?", a: "Aktive Parodontitis zuerst kontrollieren." },
      { q: "Wie viele Termine?", a: "Von einer Professionellen Zahnreinigung bis zu einem Mehrtermin-Plan." },
      { q: "Für Touristen?", a: "Ja — Hygiene kann vor den Ästhetiktagen priorisiert werden." },
    ],
    bullets: [
      "Zahnfleisch zuerst, Ästhetik danach.",
      "Interdental-Hygiene-Coaching.",
      "Schützt Zirkon- und Implantat-Investitionen.",
      "Passt in Tourismus-Kalender.",
    ],
  },
];

function main() {
  const blogs = [];
  const geos = [];
  for (const t of EN) {
    const { blog, geo } = pack("en", t);
    blogs.push(blog);
    geos.push(geo);
  }
  for (const t of DE) {
    const { blog, geo } = pack("de", t);
    blogs.push(blog);
    geos.push(geo);
  }

  const blogPath = path.join(CONTENT, "generated-blog.json");
  const geoPath = path.join(CONTENT, "geo", "packs.json");
  const existingBlog = JSON.parse(fs.readFileSync(blogPath, "utf8"));
  const existingGeo = JSON.parse(fs.readFileSync(geoPath, "utf8"));

  const blogSlugs = new Set(blogs.map((b) => `${b.lang}:${b.slug}`));
  const geoSlugs = new Set(geos.map((g) => `${g.lang}:${g.slug}`));

  const mergedBlog = [
    ...existingBlog.filter((b) => !blogSlugs.has(`${b.lang}:${b.slug}`)),
    ...blogs,
  ];
  const mergedGeo = [
    ...existingGeo.filter((g) => !geoSlugs.has(`${g.lang}:${g.slug}`)),
    ...geos,
  ];

  fs.writeFileSync(blogPath, JSON.stringify(mergedBlog, null, 2) + "\n");
  fs.writeFileSync(geoPath, JSON.stringify(mergedGeo, null, 2) + "\n");

  console.log(`EN/DE blogs +${blogs.length} (total ${mergedBlog.length})`);
  console.log(`EN/DE geo   +${geos.length} (total ${mergedGeo.length})`);
  blogs.forEach((b) => console.log(`  [${b.lang}] ${b.slug}`));
}

main();
