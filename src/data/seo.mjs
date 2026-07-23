// Cross-language SEO helpers: hreflang maps, service FAQs, localized NAP strings.
import { site, langPrefix, htmlLang } from "./site.mjs";

/** Localized clinic hours for contact UI + schema description. */
export const hoursLocalized = {
  tr: "Pazartesi – Cumartesi: 09:00 – 18:00",
  en: "Monday – Saturday: 09:00 – 18:00",
  de: "Montag – Samstag: 09:00 – 18:00",
};

/** Blog topic groups → slugs per language (only emit hreflang when all present). */
export const blogTopicGroups = [
  {
    id: "zirconia",
    tr: "zirkonyum-porselen-kaplama-estetik-dayaniklilik",
    en: "zirconia-crowns-turkey-cost-process-2026",
    de: "zirkonkronen-tuerkei-kosten-ablauf-2026",
  },
  {
    id: "bonding",
    tr: "bonding-tedavisi-agrisiz-estetik-gulus",
    en: "dental-bonding-vs-veneers-istanbul",
    de: "bonding-vs-veneers-istanbul",
  },
  {
    id: "tourism",
    tr: "dis-tedavisi-icin-istanbula-gelmek",
    en: "dental-tourism-istanbul-from-germany-uk",
    de: "zahntourismus-istanbul-aus-deutschland",
  },
  {
    id: "sedation",
    tr: "sedasyonlu-dis-tedavisi-korkulara-son",
    en: "sedation-dentistry-istanbul-anxious-patients",
    de: "sedierung-zahnbehandlung-istanbul",
  },
  {
    id: "implants-same-day",
    tr: "1-gunde-implant-hizli-kalici-cozum",
    en: "same-day-dental-implants-istanbul",
    de: "sofortimplantate-istanbul-1-tag",
  },
  {
    id: "smile-design",
    tr: "hollywoodlywood-smile-nedir-kimlere-uygun",
    en: "digital-smile-design-laminate-veneers-istanbul",
    de: "digitales-laecheln-design-veneers-istanbul",
  },
  {
    id: "extraction",
    tr: "profesyonel-dis-cekimi-agrisiz-guvenli",
    en: "safe-tooth-extraction-istanbul",
    de: "zahnentfernung-istanbul-schmerzarm",
  },
  {
    id: "kids",
    tr: null, // filled by expand pack if present
    en: "pediatric-dentistry-istanbul-family-travel",
    de: "kinderzahnheilkunde-istanbul",
  },
  {
    id: "root-canal",
    tr: "kanal-tedavisi-sonrasi-nelere-dikkat",
    en: "microscopic-root-canal-istanbul",
    de: "wurzelbehandlung-mikroskop-istanbul",
  },
  {
    id: "perio",
    tr: null,
    en: "gum-health-periodontology-istanbul",
    de: "zahnfleischgesundheit-parodontologie-istanbul",
  },
  {
    id: "all-on-4",
    tr: "all-on-4-mi-all-on-6-mi",
    en: "all-on-4-dental-implants-istanbul-cost",
    de: "all-on-4-zahnimplantate-istanbul-kosten",
  },
  {
    id: "invisalign",
    tr: "seffaf-plak-tedavisi-sureci",
    en: "invisalign-clear-aligners-istanbul",
    de: "invisalign-aligner-istanbul",
  },
  {
    id: "whitening",
    tr: "klinik-dis-beyazlatma-evde-kitlere-karsi",
    en: "professional-teeth-whitening-istanbul",
    de: "professionelle-zahnaufhellung-istanbul",
  },
  {
    id: "hollywoodlywood",
    tr: "hollywoodlywood-smile-nedir-kimlere-uygun",
    en: "hollywoodlywood-smile-turkey-package",
    de: "hollywoodlywood-smile-tuerkei-paket",
  },
  {
    id: "lamina-vs-zirconia",
    tr: "porselen-lamina-mi-zirkonyum-mu",
    en: "veneers-vs-zirconia-crowns-istanbul",
    de: "veneers-vs-zirkonkronen-istanbul",
  },
];

/** GEO topic groups */
export const geoTopicGroups = [
  {
    id: "zirconia",
    tr: "zirkonyum-kaplama-nedir",
    en: "what-are-zirconia-crowns",
    de: "was-sind-zirkonkronen",
  },
  {
    id: "bonding",
    tr: "bonding-tedavisi-nedir",
    en: "what-is-dental-bonding",
    de: "was-ist-zahn-bonding",
  },
  {
    id: "tourism",
    tr: null,
    en: "dental-tourism-istanbul-germany-uk",
    de: "zahntourismus-istanbul-deutschland",
  },
  {
    id: "sedation",
    tr: "sedasyonlu-dis-tedavisi-nedir",
    en: "sedation-dentistry-istanbul",
    de: "sedierung-zahnbehandlung-istanbul",
  },
  {
    id: "same-day-implants",
    tr: "1-gunde-implant-nedir",
    en: "same-day-implants-istanbul",
    de: "sofortimplantate-istanbul",
  },
  {
    id: "smile-design",
    tr: "hollywoodlywood-smile-nedir",
    en: "digital-smile-design-istanbul",
    de: "digitales-laecheln-design-istanbul",
  },
  {
    id: "extraction",
    tr: "profesyonel-dis-cekimi-nasil-yapilir",
    en: "tooth-extraction-istanbul",
    de: "zahnentfernung-istanbul",
  },
  {
    id: "kids",
    tr: null,
    en: "pediatric-dentistry-istanbul",
    de: "kinderzahnheilkunde-istanbul",
  },
  {
    id: "root-canal",
    tr: null,
    en: "root-canal-microscope-istanbul",
    de: "wurzelbehandlung-mikroskop-istanbul",
  },
  {
    id: "perio",
    tr: "diseti-kanamasi-ne-anlama-gelir",
    en: "gum-health-periodontology-istanbul",
    de: "zahnfleischgesundheit-istanbul",
  },
  {
    id: "all-on-4",
    tr: "all-on-4-nedir",
    en: "what-is-all-on-4",
    de: "was-ist-all-on-4",
  },
  {
    id: "invisalign",
    tr: null,
    en: "what-are-clear-aligners",
    de: "was-sind-aligner",
  },
  {
    id: "implant-def",
    tr: "dis-implant-nedir",
    en: "what-is-a-dental-implant",
    de: "was-ist-ein-zahnimplantat",
  },
  {
    id: "lamina",
    tr: "porselen-lamina-nedir",
    en: "what-are-porcelain-veneers",
    de: "was-sind-porzellan-veneers",
  },
];

/**
 * Resolve hreflang path map for a page.
 * Shared structural paths (services, doctors, static) → same path all langs.
 * Blog/GEO → topic group mapping when available; else only current lang.
 */
export function resolveHreflangPaths(lang, pathNoLang) {
  const p = (pathNoLang || "").replace(/^\/+|\/+$/g, "");
  const withSlash = p ? `${p}/` : "";

  // Structural pages shared across languages
  const sharedPrefixes = [
    "",
    "hizmetler",
    "doktorlar",
    "hakkimizda",
    "iletisim",
    "yorumlar",
    "galeri",
    "sss",
    "gizlilik",
    "kvkk",
    "blog",
    "geo",
  ];
  const isExactShared = sharedPrefixes.includes(p);
  const isServiceOrDoctor =
    p.startsWith("hizmetler/") || p.startsWith("doktorlar/");

  if (isExactShared || isServiceOrDoctor) {
    return Object.fromEntries(site.languages.map((l) => [l, withSlash]));
  }

  // Blog article
  if (p.startsWith("blog/") && p !== "blog") {
    const slug = p.slice("blog/".length);
    const group = blogTopicGroups.find((g) => g.tr === slug || g.en === slug || g.de === slug);
    if (group) {
      const out = {};
      for (const l of site.languages) {
        if (group[l]) out[l] = `blog/${group[l]}/`;
      }
      if (Object.keys(out).length) return out;
    }
    return { [lang]: withSlash };
  }

  // GEO pack
  if (p.startsWith("geo/") && p !== "geo") {
    const slug = p.slice("geo/".length);
    const group = geoTopicGroups.find((g) => g.tr === slug || g.en === slug || g.de === slug);
    if (group) {
      const out = {};
      for (const l of site.languages) {
        if (group[l]) out[l] = `geo/${group[l]}/`;
      }
      if (Object.keys(out).length) return out;
    }
    return { [lang]: withSlash };
  }

  return { [lang]: withSlash };
}

export function absFromPath(lang, pathNoLang) {
  const p = (pathNoLang || "").replace(/^\/+/, "");
  const base = langPrefix[lang] || "";
  const full = `${base}/${p}`.replace(/\/+/g, "/");
  return site.domain + (full.endsWith("/") || full === "" || full === base ? full || `${base}/` || "/" : full);
}

/** FAQ sets for service money pages (TR/EN/DE). */
export const serviceFaqs = {
  "oral-implantoloji": {
    tr: [
      { q: "Oral implantoloji nedir?", a: "Eksik dişlerin yerine çene kemiğine yerleştirilen titanyum kökler (implantlar) ve üzerlerine sabitlenen protezlerle doğal dişe en yakın çözümün planlanmasıdır." },
      { q: "İmplant tedavisi ne kadar sürer?", a: "Tek diş implantlarında genellikle birkaç ay (kemik kaynaşması dahil); All-on-4 gibi protokollerle uygun vakalarda aynı gün geçici dişler mümkün olabilir." },
      { q: "İstanbul’da implant turizmi güvenli mi?", a: "Deneyimli cerrahi ekip, steril klinik ve dijital planlama ile güvenli yürütülür. MediDent İstanbul Üsküdar’da transfer ve konaklama koordinasyonu sunar." },
    ],
    en: [
      { q: "What is oral implantology?", a: "It is the placement of titanium roots (implants) into the jawbone and fixed teeth on top — the closest long-term solution to natural teeth." },
      { q: "How long does dental implant treatment take in Istanbul?", a: "Single implants usually take a few months including osseointegration. With All-on-4 protocols, temporary teeth can be possible the same day in suitable cases." },
      { q: "Is dental implant tourism in Turkey safe?", a: "With an experienced surgical team, sterile clinic and digital planning it is safe. MediDent Istanbul in Üsküdar also coordinates transfer and hotel stays." },
      { q: "How much do dental implants cost in Istanbul?", a: "Costs depend on bone condition, number of implants and prosthetic type. After a free photo consult we share a transparent written plan." },
    ],
    de: [
      { q: "Was ist orale Implantologie?", a: "Titanwurzeln (Implantate) werden in den Kiefer gesetzt und mit festem Zahnersatz versorgt – die dauerhafteste Lösung nahe am natürlichen Zahn." },
      { q: "Wie lange dauert eine Implantatbehandlung in Istanbul?", a: "Einzelimplantate brauchen meist einige Monate inkl. Einheilung. Mit All-on-4 sind bei geeigneten Fällen provisorische Zähne am selben Tag möglich." },
      { q: "Ist Zahntourismus für Implantate in der Türkei sicher?", a: "Mit erfahrenem OP-Team, steriler Klinik und digitaler Planung ja. MediDent Istanbul in Üsküdar organisiert Transfer und Hotel." },
      { q: "Was kosten Zahnimplantate in Istanbul?", a: "Abhängig von Knochen, Implantatzahl und Zahnersatz. Nach kostenloser Foto-Beratung erhalten Sie einen transparenten Plan." },
    ],
  },
  "implantoloji-implant-tedavisi": {
    tr: [
      { q: "İmplant kimlere uygulanır?", a: "Genel sağlığı uygun, yeterli kemik hacmi olan veya greft ile desteklenebilen erişkin hastalara uygulanır." },
      { q: "İmplant ağrılı mı?", a: "İşlem lokal anestezi veya sedasyon altında yapılır; çoğu hasta işlem sonrası hafif bir rahatsızlık tarif eder." },
      { q: "Ömür boyu kalır mı?", a: "İyi ağız bakımı ve düzenli kontrollerle implantlar uzun yıllar kullanılabilir; garanti ve bakım planı vaka bazında anlatılır." },
    ],
    en: [
      { q: "Who can get dental implants?", a: "Adults in good general health with adequate bone — or bone that can be grafted — are candidates after clinical assessment." },
      { q: "Do implants hurt?", a: "Treatment is done under local anaesthetic or sedation; most patients report only mild discomfort afterwards." },
      { q: "How long do implants last?", a: "With good hygiene and check-ups, implants can last many years. Warranty and maintenance are explained case by case." },
      { q: "Why choose Istanbul for implants?", a: "Experienced teams, modern labs and competitive packages including hotel/transfer make Istanbul a leading dental tourism hub." },
    ],
    de: [
      { q: "Für wen sind Zahnimplantate geeignet?", a: "Für Erwachsene mit guter Allgemeingesundheit und ausreichendem Knochen – oder aufbaubarem Knochen – nach klinischer Prüfung." },
      { q: "Tun Implantate weh?", a: "Eingriffe erfolgen unter lokaler Betäubung oder Sedierung; danach ist meist nur leichte Beschwerde zu erwarten." },
      { q: "Wie lange halten Implantate?", a: "Bei guter Pflege und Kontrollen viele Jahre. Garantie und Prophylaxe werden individuell erklärt." },
      { q: "Warum Implantate in Istanbul?", a: "Erfahrene Teams, moderne Labore und Pakete inkl. Hotel/Transfer machen Istanbul zu einem Top-Ziel für Zahntourismus." },
    ],
  },
  "estetik-dis-hekimligi": {
    tr: [
      { q: "Gülüş tasarımı nedir?", a: "Yüz hatları, diş eti ve diş oranlarına göre dijital planlamayla yapılan kişiye özel estetik planıdır." },
      { q: "Hollywood Smile kaç günde biter?", a: "Vakaya göre 5–10 gün içinde geçici/kalıcı aşamalarla tamamlanabilir; uçuş tarihlerinize göre planlanır." },
      { q: "Lamina mı zirkonyum mu?", a: "Minimal aşındırma isteniyorsa lamina; yüksek dayanım ve köprü ihtiyacında zirkonyum sık tercih edilir." },
    ],
    en: [
      { q: "What is smile design?", a: "A personalised aesthetic plan using digital mock-ups based on your face, gums and tooth proportions." },
      { q: "How long does a Hollywood Smile take in Istanbul?", a: "Often 5–10 days including temps and finals, scheduled around your flights." },
      { q: "Veneers or zirconia crowns?", a: "Veneers for minimal prep; zirconia when strength or bridges are needed." },
      { q: "Is cosmetic dentistry in Turkey good for UK/DE patients?", a: "Yes — English/German support, hotel packages and experienced aesthetic teams are common at clinics like MediDent Istanbul." },
    ],
    de: [
      { q: "Was ist Smile Design?", a: "Ein individueller Ästhetikplan mit digitalem Mock-up anhand von Gesicht, Zahnfleisch und Zahnproportionen." },
      { q: "Wie lange dauert Hollywood Smile in Istanbul?", a: "Oft 5–10 Tage inkl. Provisorium und Endversorgung – abgestimmt auf Ihre Flüge." },
      { q: "Veneers oder Zirkonkronen?", a: "Veneers bei minimaler Präparation; Zirkon bei hoher Belastung oder Brücken." },
      { q: "Lohnt sich ästhetische Zahnmedizin in der Türkei?", a: "Ja – DE/EN-Betreuung, Hotelpakete und erfahrene Ästhetik-Teams sind bei Kliniken wie MediDent Istanbul üblich." },
    ],
  },
  "dis-beyazlatma": {
    tr: [
      { q: "Klinik beyazlatma ev kitlerinden farkı nedir?", a: "Daha kontrollü jel konsantrasyonu ve hekim gözetimiyle daha hızlı, öngörülebilir sonuç verir." },
      { q: "Sonuç ne kadar kalıcı?", a: "Beslenme ve sigara alışkanlığına göre değişir; periyodik dokunuşlarla korunur." },
    ],
    en: [
      { q: "Clinic whitening vs home kits?", a: "Higher controlled gel strength under dentist supervision gives faster, more predictable results." },
      { q: "How long do results last?", a: "Depends on diet and smoking; touch-ups keep the shade stable." },
      { q: "Can I whiten during a dental holiday?", a: "Yes — often combined with cleaning or veneers in the same visit plan." },
    ],
    de: [
      { q: "Praxis-Aufhellung vs. Heimkits?", a: "Kontrollierte Gelstärke unter Zahnarztaufsicht bringt schnellere, planbarere Ergebnisse." },
      { q: "Wie lange hält das Ergebnis?", a: "Abhängig von Ernährung und Rauchen; Auffrischungen halten den Ton stabil." },
      { q: "Aufhellung während Zahntourismus?", a: "Ja – oft kombiniert mit Reinigung oder Veneers im selben Aufenthalt." },
    ],
  },
  "seffaf-plaklar-invisalign": {
    tr: [
      { q: "Şeffaf plak tedavisi ne kadar sürer?", a: "Hafif-orta vakalarda genelde 6–18 ay; dijital plan sonrası net süre verilir." },
      { q: "Invisalign mı muadil mi?", a: "Klinik uygun sistemleri değerlendirir; sonuç planlama ve uyum kalitesine bağlıdır." },
    ],
    en: [
      { q: "How long do clear aligners take?", a: "Mild–moderate cases often 6–18 months; exact timing follows digital planning." },
      { q: "Invisalign or alternatives?", a: "We assess suitable systems; outcomes depend on planning quality and compliance." },
      { q: "Can tourists start aligners in Istanbul?", a: "Yes — remote follow-ups are often possible after initial scans and fitting." },
    ],
    de: [
      { q: "Wie lange dauern Aligner?", a: "Leichte bis mittlere Fälle oft 6–18 Monate; genaue Dauer nach digitaler Planung." },
      { q: "Invisalign oder Alternativen?", a: "Wir prüfen passende Systeme; Ergebnis hängt von Planung und Mitarbeit ab." },
      { q: "Aligner-Start für Reisende in Istanbul?", a: "Ja – nach Scan und Eingliederung sind Fernkontrollen oft möglich." },
    ],
  },
  "genel-anestezi-ve-sedasyon": {
    tr: [
      { q: "Uykuda diş tedavisi güvenli mi?", a: "Uygun hasta seçimi ve monitörizasyonla sedasyon/anestezi güvenli uygulanır; ön değerlendirme şarttır." },
      { q: "Kimler sedasyon adayıdır?", a: "Aşırı kaygı, öğürme refleksi veya uzun cerrahi gerektiren hastalarda sık tercih edilir." },
    ],
    en: [
      { q: "Is sedation dentistry safe?", a: "With proper patient selection and monitoring, yes. A medical assessment is required first." },
      { q: "Who needs sedation?", a: "Patients with dental anxiety, gag reflex or long surgical procedures." },
      { q: "Can international patients request sedation in Istanbul?", a: "Yes — tell us in advance so anaesthesia planning fits your travel dates." },
    ],
    de: [
      { q: "Ist Sedierung sicher?", a: "Bei geeigneter Patientenselektion und Monitoring ja. Vorherige medizinische Abklärung ist Pflicht." },
      { q: "Wer braucht Sedierung?", a: "Bei starker Angst, Würgereiz oder langen Eingriffen." },
      { q: "Sedierung für internationale Patienten?", a: "Ja – bitte vorab angeben, damit die Planung zu Ihren Reisedaten passt." },
    ],
  },
  "protezler": {
    tr: [
      { q: "Sabit ve hareketli protez farkı nedir?", a: "Sabit protezler implant veya dişe yapışır; hareketliler çıkarılıp takılır. İhtiyaç ve kemiğe göre seçilir." },
    ],
    en: [
      { q: "Fixed vs removable dentures?", a: "Fixed restorations stay on implants/teeth; removable ones come out. Choice depends on bone and needs." },
      { q: "Can I get full mouth rehabilitation on a dental trip?", a: "Often yes — staged temps then finals within a planned stay, or two visits." },
    ],
    de: [
      { q: "Festsitzend vs. herausnehmbar?", a: "Festsitzender Zahnersatz bleibt auf Implantaten/Zähnen; herausnehmbarer wird ein- und ausgesetzt." },
      { q: "Komplette Sanierung in einer Reise?", a: "Oft möglich – mit Provisorium und Endversorgung in einem Aufenthalt oder zwei Terminen." },
    ],
  },
};

/** Sitemap priority heuristic */
export function sitemapPriority(lang, pathNoLang) {
  const p = (pathNoLang || "").replace(/^\/+|\/+$/g, "");
  if (p === "") return lang === "tr" ? "1.0" : "0.95";
  if (p === "hizmetler" || p.startsWith("hizmetler/")) return "0.9";
  if (p === "iletisim") return "0.85";
  if (p.startsWith("blog/") && p !== "blog") return "0.8";
  if (p.startsWith("geo/") && p !== "geo") return "0.75";
  if (p === "blog" || p === "geo") return "0.7";
  if (p.startsWith("doktorlar")) return "0.7";
  return "0.6";
}

export function sitemapChangefreq(pathNoLang) {
  const p = (pathNoLang || "").replace(/^\/+|\/+$/g, "");
  if (p === "" || p === "blog" || p === "geo") return "daily";
  if (p.startsWith("blog/") || p.startsWith("geo/")) return "weekly";
  if (p.startsWith("hizmetler")) return "weekly";
  return "monthly";
}

export { htmlLang };
