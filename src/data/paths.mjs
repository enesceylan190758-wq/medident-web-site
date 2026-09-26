/**
 * Localized structural + service URL segments.
 * Canonical service ids stay Turkish (content.mjs `slug`); DE public paths use German slugs.
 * Always pair path changes with 301s in build.mjs writeHtaccess().
 */
import { site } from "./site.mjs";

/** Structural folder names per language (default = TR legacy WP slug). */
export const STRUCT = {
  services: { default: "hizmetler", de: "leistungen" },
  doctors: { default: "doktorlar", de: "aerzte" },
  about: { default: "hakkimizda", de: "ueber-uns" },
  contact: { default: "iletisim", de: "kontakt" },
  reviews: { default: "yorumlar", de: "bewertungen" },
  gallery: { default: "galeri", de: "galerie" },
  faq: { default: "sss", de: "faq" },
  privacy: { default: "gizlilik", de: "datenschutz" },
  kvkk: { default: "kvkk" },
  blog: { default: "blog" },
  geo: { default: "geo" },
};

/** Canonical (TR) service slug → DE public slug */
export const SERVICE_SLUG_DE = {
  "implantoloji-implant-tedavisi": "implantologie-zahnimplantate",
  "estetik-dis-hekimligi": "aesthetische-zahnmedizin",
  "dis-beyazlatma": "zahnaufhellung",
  protezler: "zahnprothesen",
  "seffaf-plaklar-invisalign": "aligner-invisalign",
  "agiz-dis-ve-cene-cerrahisi": "mund-kiefer-gesichtschirurgie",
  "cene-ve-dis-cerrahisi": "zahn-kieferchirurgie",
  "cene-eklemi-rahatsizliklari": "kiefergelenkbeschwerden",
  "periodontoloji-diseti-hastaliklari": "parodontologie",
  "pedodonti-cocuk-dis-hekimligi": "kinderzahnheilkunde",
  "konservatif-dis-tedavileri": "konservierende-zahnheilkunde",
  "halitosis-agiz-kokusu": "halitosis-mundgeruch",
  "genel-anestezi-ve-sedasyon": "vollnarkose-sedierung",
  "endodonti-kanal-tedavileri": "endodontie-wurzelbehandlung",
};

const DE_TO_CANONICAL = Object.fromEntries(
  Object.entries(SERVICE_SLUG_DE).map(([canon, de]) => [de, canon])
);

export function structSeg(lang, key) {
  const m = STRUCT[key];
  if (!m) return key;
  return m[lang] || m.default;
}

export function structPath(lang, key) {
  return `${structSeg(lang, key)}/`;
}

export function serviceSlugForLang(lang, canonicalSlug) {
  if (lang === "de" && SERVICE_SLUG_DE[canonicalSlug]) return SERVICE_SLUG_DE[canonicalSlug];
  return canonicalSlug;
}

export function servicePath(lang, canonicalSlug) {
  return `${structSeg(lang, "services")}/${serviceSlugForLang(lang, canonicalSlug)}/`;
}

export function doctorsPath(lang, doctorSlug = "") {
  const base = structSeg(lang, "doctors");
  return doctorSlug ? `${base}/${doctorSlug}/` : `${base}/`;
}

/** Map any language's service path segment back to canonical TR slug. */
export function canonicalServiceSlug(localizedSlug) {
  return DE_TO_CANONICAL[localizedSlug] || localizedSlug;
}

/** All known localized forms of a structural key (for matching incoming paths). */
export function allStructSegs(key) {
  const m = STRUCT[key];
  if (!m) return [key];
  const vals = new Set([m.default]);
  for (const [k, v] of Object.entries(m)) {
    if (k !== "default" && v) vals.add(v);
  }
  return [...vals];
}

/**
 * Hreflang map for a structural index page (e.g. services listing).
 * @param {string} key STRUCT key
 */
export function hreflangStruct(key) {
  return Object.fromEntries(site.languages.map((l) => [l, structPath(l, key)]));
}

/**
 * Hreflang map for a service detail page given any language's path slug.
 */
export function hreflangService(localizedOrCanonicalSlug) {
  const canon = canonicalServiceSlug(localizedOrCanonicalSlug);
  return Object.fromEntries(site.languages.map((l) => [l, servicePath(l, canon)]));
}

/**
 * Hreflang map for a doctor page (doctor slug is shared; folder may differ).
 */
export function hreflangDoctor(doctorSlug) {
  return Object.fromEntries(site.languages.map((l) => [l, doctorsPath(l, doctorSlug)]));
}

/** Old DE structural paths that must 301 → new DE paths (path without /de/ prefix). */
export function deStructuralRedirects() {
  const pairs = [];
  for (const key of Object.keys(STRUCT)) {
    const from = STRUCT[key].default;
    const to = STRUCT[key].de || from;
    if (from !== to) {
      pairs.push({ from: `${from}/`, to: `${to}/` });
    }
  }
  return pairs;
}

/** Old DE service URLs → new DE service URLs (path without /de/ prefix). */
export function deServiceRedirects() {
  return Object.entries(SERVICE_SLUG_DE).map(([canon, deSlug]) => ({
    from: `hizmetler/${canon}/`,
    to: `leistungen/${deSlug}/`,
  }));
}
