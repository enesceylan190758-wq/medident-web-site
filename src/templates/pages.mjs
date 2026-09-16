import { site } from "../data/site.mjs";
import { i18n } from "../data/i18n.mjs";
import { services, doctors, serviceFallback, priceCalc, packages } from "../data/content.mjs";
import { img } from "../data/images.mjs";
import { serviceFaqs } from "../data/seo.mjs";
import { L, langBCP47, uiBits } from "../data/locale.mjs";
import { icons } from "./icons.mjs";
import {
  url,
  waHref,
  breadcrumb,
  breadcrumbSchema,
  orgSchema,
  faqSchema,
  asset,
} from "./layout.mjs";
import { contactSection, priceCalcSection, brandsSection, xraySection } from "./home.mjs";

const src = (file) => asset(`/assets/img/${file}`);
const crumbHome = (lang) => ({ name: i18n[lang].breadcrumbHome, href: url(lang, ""), url: site.domain + url(lang, "") });

const faqHeading = { tr: "Sık sorulan sorular", en: "Frequently asked questions", de: "Häufig gestellte Fragen", ar: "الأسئلة الشائعة", ru: "Частые вопросы" };
const keyPointsHeading = { tr: "Öne çıkan noktalar", en: "Key points", de: "Wichtige Punkte", ar: "أبرز النقاط", ru: "Ключевые моменты" };
const reviewedByLabel = {
  tr: "Tıbbi inceleme",
  en: "Medically reviewed by",
  de: "Medizinisch geprüft von",
  fr: "Relu par",
  ar: "مراجعة طبية",
  ru: "Медицинская проверка",
};

/** Clinic-confirmed reviewing doctor for commercial DE/EN landings (filled 2026-09-11). */
const reviewingDoctor = doctors.find((d) => d.slug === "dr-ahmet-celik");

/** Visible "medically reviewed by …" block with confirmed doctor name + title. */
function reviewedByBlock(lang) {
  if (!reviewingDoctor) return "";
  const title = (reviewingDoctor.titles && (reviewingDoctor.titles[lang] || reviewingDoctor.titles.en)) || "";
  const href = url(lang, "doktorlar/" + reviewingDoctor.slug + "/");
  const label = reviewedByLabel[lang] || reviewedByLabel.en;
  return `<p style="font-size:13.5px;color:var(--muted-2);margin:0 0 24px;">
    ${label}: <a href="${href}" style="color:var(--ink-soft);font-weight:700;text-decoration:underline;">${reviewingDoctor.name}</a>${title ? ` <span style="font-weight:500;">· ${title}</span>` : ""}
  </p>`;
}


/** Shared UI chrome for rich commercial landings (DE/EN). */
function landingUi(lang) {
  const t = i18n[lang] || i18n.en;
  return (
    t.landingUi || {
      resultsEyebrow: "Results",
      resultsTitle: "Real patient outcomes",
      resultsLead: "Drag to compare before and after, then browse more cases.",
      galleryTitle: "More real cases",
      compareTitle: "Cost comparison",
      compareHome: "At home (private)",
      compareHere: "MediDent Istanbul",
      tripTitle: "Your trip at a glance",
      inclusionsTitle: "What’s included",
      doctorTitle: "Clinical review",
      ctaTitle: "Free photo assessment",
      ctaLead: "Send photos or an X-ray on WhatsApp — get a written plan before you book flights.",
      ctaWa: "WhatsApp assessment",
      ctaForm: "Contact form",
      dragHint: "Drag to compare",
    }
  );
}

function landingCtaBand(lang) {
  const ui = landingUi(lang);
  const wa = waHref(
    lang === "de"
      ? "Hallo, ich möchte eine kostenlose Foto-/Röntgen-Einschätzung."
      : "Hello, I’d like a free photo / X-ray assessment."
  );
  return `<section class="section" style="padding-top:8px;padding-bottom:8px;"><div class="container" style="max-width:960px;">
    <div data-reveal style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px;padding:22px 24px;border-radius:20px;background:linear-gradient(135deg,var(--ink),#3a2f24);color:#fff;">
      <div style="flex:1;min-width:220px;">
        <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;opacity:.72;font-weight:700;margin:0 0 6px;">${ui.ctaTitle}</div>
        <p style="margin:0;font-size:15.5px;line-height:1.5;opacity:.92;">${ui.ctaLead}</p>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        <a href="${wa}" target="_blank" rel="noopener" class="btn" style="background:#25D366;color:#fff;">${icons.wa || ""} ${ui.ctaWa}</a>
        <a href="${url(lang, "iletisim/")}" class="btn btn-ghost" style="border-color:rgba(255,255,255,.35);color:#fff;">${ui.ctaForm}</a>
      </div>
    </div>
  </div></section>`;
}

function landingBaSection(lang) {
  const t = i18n[lang];
  const ui = landingUi(lang);
  return `<section class="section section-alt"><div class="container">
    <div class="grid-2" style="grid-template-columns:.92fr 1.08fr;gap:clamp(28px,4vw,48px);align-items:center;">
      <div>
        <div class="eyebrow" data-reveal>${ui.resultsEyebrow}</div>
        <h2 data-reveal style="margin:0 0 12px;">${ui.resultsTitle}</h2>
        <p class="lead" data-reveal style="margin:0 0 18px;">${ui.resultsLead}</p>
      </div>
      <div data-reveal>
        <div class="ba" data-ba>
          <img src="${src(img.after)}" alt="${t.after}">
          <img class="ba-before" src="${src(img.before)}" alt="${t.before}">
          <span class="ba-label before">${t.before}</span>
          <span class="ba-label after">${t.after}</span>
          <div class="ba-handle"><div class="ba-knob"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 8L6 12l3.5 4M14.5 8l3.5 4-3.5 4"></path></svg></div></div>
        </div>
        <p style="text-align:center;font-size:13px;color:var(--muted-2);margin:14px 0 0;">${ui.dragHint || t.drag}</p>
      </div>
    </div>
  </div></section>`;
}

function landingCasesStrip(lang, preferredFiles = []) {
  const ui = landingUi(lang);
  const t = i18n[lang];
  const preferred = preferredFiles
    .map((f) => (img.cases || []).find((c) => c.file === f))
    .filter(Boolean);
  const rest = (img.cases || []).filter((c) => !preferred.some((p) => p.file === c.file));
  const list = [...preferred, ...rest].slice(0, 4);
  if (!list.length) return "";
  const cards = list
    .map((c) => {
      const label = (c.label && (c.label[lang] || c.label.en || c.label.tr)) || "";
      const href = src(c.file);
      return `<button data-reveal data-lightbox-src="${href}" class="case-card">
        <img src="${href}" alt="${label} — ${site.brand}" loading="lazy">
        <div class="shade"></div>
        <span class="case-badge">${t.before} &amp; ${t.after}</span>
        <span class="case-title">${label}</span>
      </button>`;
    })
    .join("");
  return `<section class="section" style="padding-top:0;"><div class="container">
    <h2 data-reveal style="font-size:22px;margin:0 0 18px;">${ui.galleryTitle}</h2>
    <div class="case-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">${cards}</div>
  </div></section>`;
}

function landingCompareTable(lang, rows = []) {
  if (!rows.length) return "";
  const ui = landingUi(lang);
  const body = rows
    .map(
      (r, i) => `<tr style="${i % 2 ? "background:var(--cream);" : ""}border-top:1px solid rgba(43,35,24,.08);">
      <td style="padding:14px 16px;color:var(--ink-soft);font-weight:600;">${r.item}</td>
      <td style="padding:14px 16px;color:var(--muted);">${r.home}</td>
      <td style="padding:14px 16px;font-weight:700;color:var(--ink);">${r.here}</td>
    </tr>`
    )
    .join("");
  return `<section class="section section-alt"><div class="container" style="max-width:900px;">
    <h2 data-reveal style="font-size:22px;margin:0 0 16px;">${ui.compareTitle}</h2>
    <div data-reveal style="overflow-x:auto;border-radius:16px;border:1px solid rgba(43,35,24,.1);">
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <thead><tr style="background:var(--cream-2);">
          <th style="text-align:left;padding:14px 16px;"></th>
          <th style="text-align:left;padding:14px 16px;">${ui.compareHome}</th>
          <th style="text-align:left;padding:14px 16px;">${ui.compareHere}</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  </div></section>`;
}

function landingTripTimeline(lang, stages = []) {
  if (!stages.length) return "";
  const ui = landingUi(lang);
  const cards = stages
    .map(
      (s, i) => `<div class="step" data-reveal style="padding:22px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <span class="step-n">${i + 1}</span>
        <span style="flex:1;height:1px;background:linear-gradient(90deg,var(--gold),transparent);"></span>
      </div>
      <h3 style="font-size:17px;margin:0 0 6px;">${s.t}</h3>
      <p style="font-size:14px;line-height:1.55;color:var(--muted);margin:0 0 8px;">${s.d}</p>
      ${s.meta ? `<div style="font-size:13px;font-weight:700;color:var(--burgundy);">${s.meta}</div>` : ""}
    </div>`
    )
    .join("");
  return `<section class="section"><div class="container" style="max-width:960px;">
    <h2 data-reveal style="font-size:22px;margin:0 0 18px;">${ui.tripTitle}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">${cards}</div>
  </div></section>`;
}

function landingInclusions(lang, items = []) {
  if (!items.length) return "";
  const ui = landingUi(lang);
  const list = items
    .map(
      (x) => `<li style="display:flex;gap:10px;align-items:flex-start;margin:0 0 10px;">
      <span style="flex:0 0 22px;height:22px;border-radius:50%;background:rgba(37,99,80,.12);color:var(--burgundy);display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;">✓</span>
      <span style="font-size:15px;line-height:1.5;color:var(--ink-soft);">${x}</span>
    </li>`
    )
    .join("");
  return `<div data-reveal class="pkg" style="padding:22px 24px;margin:0 0 28px;">
    <h3 style="margin:0 0 14px;font-size:18px;">${ui.inclusionsTitle}</h3>
    <ul class="pkg-list" style="list-style:none;padding:0;margin:0;">${list}</ul>
  </div>`;
}

function landingDoctorCard(lang) {
  if (!reviewingDoctor) return "";
  const ui = landingUi(lang);
  const title = (reviewingDoctor.titles && (reviewingDoctor.titles[lang] || reviewingDoctor.titles.en)) || "";
  const href = url(lang, "doktorlar/" + reviewingDoctor.slug + "/");
  const bio = (reviewingDoctor.bio && (reviewingDoctor.bio[lang] || reviewingDoctor.bio.en)) || "";
  return `<div data-reveal class="doctor-card" style="display:flex;gap:16px;align-items:flex-start;padding:18px 20px;margin:0 0 28px;border-radius:18px;border:1px solid rgba(43,35,24,.1);background:var(--cream);">
    <div style="flex:0 0 56px;height:56px;border-radius:50%;background:var(--burgundy);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;">AC</div>
    <div>
      <div style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted-2);font-weight:700;margin:0 0 4px;">${ui.doctorTitle}</div>
      <a href="${href}" style="font-weight:800;color:var(--ink);text-decoration:none;font-size:16px;">${reviewingDoctor.name}</a>
      <div style="font-size:13.5px;color:var(--muted);margin:4px 0 8px;">${title}</div>
      <p style="margin:0;font-size:14px;line-height:1.55;color:var(--muted-2);">${bio}</p>
    </div>
  </div>`;
}


/** Article schema for a commercial landing page — Organization author + confirmed reviewing doctor. */
function landingArticleSchema({ lang, pageUrl, headline, description, image, publishedAt, updatedAt }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    inLanguage: langBCP47[lang] || "en-US",
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: { "@id": site.domain + "/#organization" },
    publisher: { "@id": site.domain + "/#organization" },
    mainEntityOfPage: pageUrl,
    url: pageUrl,
  };
  if (reviewingDoctor) {
    const title = (reviewingDoctor.titles && (reviewingDoctor.titles[lang] || reviewingDoctor.titles.en)) || "";
    schema.reviewedBy = {
      "@type": "Person",
      name: reviewingDoctor.name,
      ...(title ? { jobTitle: title } : {}),
      url: site.domain + url(lang, "doktorlar/" + reviewingDoctor.slug + "/"),
    };
  }
  return schema;
}

/** Real, topic-labelled case photo (src/data/images.mjs `img.cases`) — never a stock/unrelated image. */
function caseImageBlock(file, alt) {
  return `<figure style="margin:0 0 28px;"><img src="${src(file)}" alt="${alt}" width="960" height="640" loading="lazy" style="width:100%;height:auto;border-radius:16px;display:block;"></figure>`;
}

const geoConversionCopy = {
  en: {
    eyebrow: "Real MediDent Istanbul prices",
    items: [
      { amount: "€400", label: "per dental implant" },
      { amount: "€1,600", label: "8 zirconia crowns" },
      { amount: "€3,200", label: "Hollywood Smile, 16 teeth" },
    ],
    waLabel: "Send photos on WhatsApp",
    waMessage: "Hello, I'd like a free photo assessment and price quote.",
    priceListLabel: "See the full price list",
    priceListHref: "turkey-teeth-price/",
  },
  de: {
    eyebrow: "Reale MediDent Istanbul Preise",
    items: [
      { amount: "400 €", label: "pro Zahnimplantat" },
      { amount: "1.600 €", label: "8 Zirkonkronen" },
      { amount: "3.200 €", label: "Hollywood Smile, 16 Zähne" },
    ],
    waLabel: "Fotos per WhatsApp senden",
    waMessage: "Hallo, ich möchte eine kostenlose Foto-Einschätzung und ein Preisangebot.",
    priceListLabel: "Zur vollständigen Preisliste",
    priceListHref: "preise/",
  },
};

/** Above-the-fold price glance + WhatsApp CTA for a high-traffic, low-conversion GEO page.
 * Real numbers only, pulled from the same priceCalc figures used sitewide — never invented. */
function geoConversionBand(lang) {
  const c = geoConversionCopy[lang] || geoConversionCopy.en;
  const wa = waHref(c.waMessage);
  const stats = c.items
    .map(
      (it) => `<div><div style="font-size:21px;font-weight:800;color:var(--ink);">${it.amount}</div><div style="font-size:13px;color:var(--muted-2);">${it.label}</div></div>`
    )
    .join("");
  return `<div style="margin:22px 0 34px;padding:22px 24px;border-radius:18px;background:var(--cream-2);border:1px solid rgba(43,35,24,.08);">
    <div style="font-size:12.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--gold-ink);margin:0 0 14px;">${c.eyebrow}</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:14px;margin:0 0 20px;">${stats}</div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;">
      <a href="${wa}" class="btn" style="background:#25D366;color:#fff;" target="_blank" rel="noopener">${icons.wa} ${c.waLabel}</a>
      <a href="${url(lang, c.priceListHref)}" class="btn btn-ghost">${c.priceListLabel}</a>
    </div>
  </div>`;
}

function pageHero(lang, eyebrow, title, lead, crumbs) {
  return `<section class="page-hero"><div class="container">
    ${breadcrumb(lang, crumbs)}
    ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}
    <h1 style="font-size:clamp(34px,5vw,60px);margin:0 0 14px;">${title}</h1>
    ${lead ? `<p class="lead" style="max-width:680px;">${lead}</p>` : ""}
  </div></section>`;
}

// Services index
export function servicesIndexPage(lang) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.services, href: url(lang, "hizmetler/") }];
  const card = (s) => `<a href="${url(lang, "hizmetler/" + s.slug + "/")}" class="card service-card" style="display:block;color:inherit;padding:0;overflow:hidden;">
    ${s.image ? `<div class="service-card-media" style="aspect-ratio:16/10;overflow:hidden;background:var(--sand);"><img src="${asset(`/assets/img/${s.image}`)}" alt="${L(s.titles, lang)}" width="640" height="400" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;"></div>` : `<div class="icon-box" style="margin:22px 22px 0;">${icons[s.icon] || icons.smile}</div>`}
    <div style="padding:18px 22px 22px;">
      <h3 style="margin:0 0 8px;">${L(s.titles, lang)}</h3>
      <p style="font-size:14.5px;line-height:1.6;color:var(--muted-2);margin:0;">${L(s.short, lang)}</p>
      <span class="link-more">${t.detail} ${icons.arrowSm}</span>
    </div>
  </a>`;
  const body = `${pageHero(lang, t.servicesEyebrow, t.nav.services, t.servicesLead, crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container">
    <div class="grid-auto">${services.map(card).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;
  return {
    body,
    title: `${t.nav.services} — ${site.brand}`,
    description: t.servicesLead,
    jsonld: [breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

// Single service (article body when this service's primary mirror article exists).
export function servicePage(lang, service, article = null) {
  const t = i18n[lang];
  const title = L(service.titles, lang);
  const crumbs = [
    crumbHome(lang),
    { name: t.nav.services, href: url(lang, "hizmetler/") },
    { name: title, href: url(lang, "hizmetler/" + service.slug + "/") },
  ];
  const bodyHtml = article ? article.html : (serviceFallback[lang] || serviceFallback.en)(title);
  const faqs =
    (article && article.faq && article.faq.length ? article.faq : null) ||
    serviceFaqs[service.slug]?.[lang] ||
    [];
  const faqBlock =
    faqs.length > 0
      ? `<h2>${faqHeading[lang] || faqHeading.en}</h2>${faqs.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join("")}`
      : "";
  const related = services.filter((s) => s.slug !== service.slug && s.home).slice(0, 4);
  const heroImg = service.image
    ? `<figure style="margin:0 0 28px;border-radius:18px;overflow:hidden;aspect-ratio:16/9;background:var(--sand);"><img src="${asset(`/assets/img/${service.image}`)}" alt="${title}" width="1200" height="675" style="width:100%;height:100%;object-fit:cover;display:block;" loading="eager"></figure>`
    : "";
  const body = `${pageHero(lang, t.servicesEyebrow, title, L(service.short, lang), crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container" style="max-width:860px;">
    ${heroImg}
    <div style="display:grid;grid-template-columns:1fr;gap:40px;">
      <article class="prose">${bodyHtml}
        ${faqBlock}
        <div style="margin-top:32px;display:flex;flex-wrap:wrap;gap:12px;">
          <a href="${url(lang, "iletisim/")}" class="btn btn-primary">${t.bookNow} ${icons.arrow()}</a>
          <a href="${waHref()}" class="btn btn-ghost" target="_blank" rel="noopener">${icons.wa} WhatsApp</a>
        </div>
      </article>
    </div>
    <div style="margin-top:56px;">
      <h2 style="font-size:26px;margin-bottom:22px;">${t.relatedServices}</h2>
      <div class="grid-auto">${related
        .map(
          (s) => `<a href="${url(lang, "hizmetler/" + s.slug + "/")}" class="card service-card" style="display:block;color:inherit;padding:0;overflow:hidden;">${
            s.image
              ? `<div style="aspect-ratio:16/10;overflow:hidden;background:var(--sand);"><img src="${asset(`/assets/img/${s.image}`)}" alt="${L(s.titles, lang)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`
              : `<div class="icon-box" style="margin:18px 18px 0;">${icons[s.icon] || icons.smile}</div>`
          }<div style="padding:16px 18px 18px;"><h3 style="font-size:20px;margin:0 0 6px;">${L(s.titles, lang)}</h3><p style="font-size:14px;color:var(--muted-2);margin:0;">${L(s.short, lang)}</p></div></a>`
        )
        .join("")}</div>
    </div>
  </div></section>
  ${contactSection(lang)}`;
  const ogImage = service.image ? site.domain + asset(`/assets/img/${service.image}`) : undefined;
  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      name: title,
      description: L(service.meta, lang),
      image: ogImage,
      provider: { "@id": site.domain + "/#organization" },
      url: site.domain + url(lang, "hizmetler/" + service.slug + "/"),
      inLanguage: langBCP47[lang] || "en-US",
    },
    breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
  ];
  if (faqs.length) jsonld.push(faqSchema(faqs));
  const pageTitle =
    lang === "en" || lang === "de" || lang === "fr"
      ? `${title} in Istanbul — ${site.brand}`
      : `${title} — ${site.brand}`;
  return { body, title: pageTitle, description: L(service.meta, lang), image: ogImage, jsonld };
}

// Doctors index
export function doctorsIndexPage(lang) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.doctors, href: url(lang, "doktorlar/") }];
  const initials = (name) => name.replace(/^(Dr\.|Dt\.)\s*/gi, "").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const avatarOrImg = (d) => d.image
    ? `<img src="${asset(`/assets/img/${d.image}`)}" alt="${d.name}">`
    : `<div style="width:100%;aspect-ratio:1;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--burgundy));display:flex;align-items:center;justify-content:center;font-family:var(--font-serif);font-size:36px;font-weight:700;color:#fff;">${initials(d.name)}</div>`;
  const card = (d) => `<a href="${url(lang, "doktorlar/" + d.slug + "/")}" class="doctor-card" style="display:block;color:inherit;">
    <div class="photo">${avatarOrImg(d)}</div>
    <div class="body"><h3 style="font-size:21px;margin-bottom:4px;">${d.name}</h3><p style="font-size:13.5px;color:var(--gold);font-weight:700;margin:0 0 10px;">${L(d.titles, lang)}</p><p style="font-size:14px;color:var(--muted-2);margin:0;">${L(d.bio, lang)}</p></div>
  </a>`;
  const body = `${pageHero(lang, "", t.doctorsTitle, t.doctorsLead, crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container">
    ${doctors.length
      ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px;">${doctors.map(card).join("")}</div>`
      : `<div class="prose" style="text-align:center;padding:40px 0;"><p style="font-size:17px;color:var(--muted-2);">${
          lang === "tr" ? "Hekim kadromuz güncellenmektedir. Detaylı bilgi için lütfen iletişime geçin."
          : lang === "de" ? "Unser Ärzteteam wird aktualisiert. Bitte kontaktieren Sie uns für weitere Informationen."
          : lang === "fr" ? "Notre équipe médicale est en cours de mise à jour. Veuillez nous contacter pour plus d'informations."
          : lang === "ar" ? "يتم تحديث فريق الأطباء لدينا. يرجى التواصل معنا لمزيد من المعلومات."
          : lang === "ru" ? "Состав врачей обновляется. Свяжитесь с нами для подробностей."
          : "Our medical team is being updated. Please contact us for details."
        }</p><a href="${url(lang, "iletisim/")}" class="btn btn-primary" style="margin-top:16px;">${
          lang === "tr" ? "İletişim" : lang === "de" ? "Kontakt" : lang === "fr" ? "Contact" : lang === "ar" ? "تواصل" : lang === "ru" ? "Связаться" : "Contact us"
        }</a></div>`
    }
  </div></section>
  ${contactSection(lang)}`;
  return {
    body,
    title: `${t.doctorsTitle} — ${site.brand}`,
    description: t.doctorsLead,
    jsonld: [breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

export function doctorPage(lang, doctor) {
  const t = i18n[lang];
  const crumbs = [
    crumbHome(lang),
    { name: t.nav.doctors, href: url(lang, "doktorlar/") },
    { name: doctor.name, href: url(lang, "doktorlar/" + doctor.slug + "/") },
  ];
  const body = `${pageHero(lang, "", doctor.name, L(doctor.titles, lang), crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container">
    <div class="grid-2" style="grid-template-columns:.8fr 1.2fr;align-items:start;">
      <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/5;background:var(--sand);box-shadow:var(--shadow);">${
        doctor.image
          ? `<img src="${asset(`/assets/img/${doctor.image}`)}" alt="${doctor.name}" style="width:100%;height:100%;object-fit:cover;">`
          : `<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--gold),var(--burgundy));display:flex;align-items:center;justify-content:center;font-family:var(--font-serif);font-size:72px;font-weight:700;color:#fff;">${doctor.name.replace(/^(Dr\.|Dt\.)\s*/gi,"").split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>`
      }</div>
      <div class="prose" style="margin:0;">
        <p style="font-size:13.5px;color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:.1em;">${L(doctor.titles, lang)}</p>
        <p>${L(doctor.bio, lang)}</p>
        <div style="margin-top:24px;display:flex;flex-wrap:wrap;gap:12px;">
          <a href="${url(lang, "iletisim/")}" class="btn btn-primary">${t.bookNow} ${icons.arrow()}</a>
          <a href="${waHref()}" class="btn btn-ghost" target="_blank" rel="noopener">${icons.wa} WhatsApp</a>
        </div>
      </div>
    </div>
  </div></section>
  ${contactSection(lang)}`;
  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "Physician",
      name: doctor.name,
      jobTitle: L(doctor.titles, lang),
      image: site.domain + asset("/assets/img/") + doctor.image,
      worksFor: { "@id": site.domain + "/#organization" },
      url: site.domain + url(lang, "doktorlar/" + doctor.slug + "/"),
    },
    breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
  ];
  return { body, title: `${doctor.name} — ${site.brand}`, description: `${doctor.name}, ${L(doctor.titles, lang)} — ${site.brand}`, jsonld };
}

// Blog index
export function blogIndexPage(lang, articles) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.blog, href: url(lang, "blog/") }];
  const row = (a) => `<a href="${url(lang, "blog/" + a.slug + "/")}" class="article-row" style="color:inherit;">
    ${a.coverImage ? `<img class="article-thumb" src="${asset(`/assets/img/${a.coverImage}`)}" alt="" width="160" height="106" loading="lazy">` : ""}
    <div><h3 style="font-size:20px;margin-bottom:6px;">${a.title}</h3><p style="font-size:14.5px;color:var(--muted-2);margin:0;">${a.excerpt}</p></div>
    <span class="link-more">${t.readMore} ${icons.arrowSm}</span>
  </a>`;
  const body = `${pageHero(lang, "", t.blogTitle, t.blogLead, crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container" style="max-width:920px;">
    <div class="article-list">${articles.map(row).join("") || `<p>${t.blogLead}</p>`}</div>
  </div></section>
  ${contactSection(lang)}`;
  return {
    body,
    title: `${t.blogTitle} — ${site.brand}`,
    description: t.blogLead,
    jsonld: [breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

export function articlePage(lang, article, relatedServiceSlug) {
  const t = i18n[lang];
  const crumbs = [
    crumbHome(lang),
    { name: t.nav.blog, href: url(lang, "blog/") },
    { name: article.title, href: url(lang, "blog/" + article.slug + "/") },
  ];
  const svc = services.find((s) => s.slug === relatedServiceSlug);
  const cover = article.coverImage
    ? `<figure class="article-cover" style="margin:0 0 28px;"><img src="${asset(`/assets/img/${article.coverImage}`)}" alt="${article.title}" width="1536" height="1024" style="width:100%;height:auto;border-radius:18px;display:block;" loading="eager"></figure>`
    : "";
  // Avoid duplicate cover if HTML already embeds one
  let html = article.html || "";
  if (article.coverImage && html.includes(article.coverImage)) {
    /* keep embedded cover from generator */
  } else if (cover) {
    html = cover + html;
  }
  const body = `${pageHero(lang, t.nav.blog, article.title, "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">${html}
      ${svc ? `<p style="margin-top:28px;"><a class="btn btn-ghost" href="${url(lang, "hizmetler/" + svc.slug + "/")}">${L(svc.titles, lang)} ${icons.arrowSm}</a></p>` : ""}
      <div style="margin-top:24px;display:flex;flex-wrap:wrap;gap:12px;">
        <a href="${url(lang, "iletisim/")}" class="btn btn-primary">${t.bookNow} ${icons.arrow()}</a>
        <a href="${waHref()}" class="btn btn-ghost" target="_blank" rel="noopener">${icons.wa} WhatsApp</a>
      </div>
    </article>
  </div></section>
  ${contactSection(lang)}`;
  const ogImage = article.coverImage ? site.domain + asset(`/assets/img/${article.coverImage}`) : undefined;
  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      inLanguage: langBCP47[lang] || "en-US",
      datePublished: article.publishedAt || undefined,
      image: ogImage,
      author: { "@id": site.domain + "/#organization" },
      publisher: { "@id": site.domain + "/#organization" },
      mainEntityOfPage: site.domain + url(lang, "blog/" + article.slug + "/"),
    },
    ...(article.faq?.length ? [faqSchema(article.faq)] : []),
    breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
  ];
  return {
    body,
    title: `${article.title} — ${site.brand}`,
    description: article.metaDescription || article.excerpt,
    image: ogImage,
    ogType: "article",
    publishedTime: article.publishedAt || undefined,
    jsonld,
  };
}

// About
export function aboutPage(lang) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.about, href: url(lang, "hakkimizda/") }];
  const badges = {
    tr: ["Sağlık turizmi koordinasyonu", "Steril & modern klinik", "CAD/CAM laboratuvar", "Uluslararası hasta deneyimi"],
    en: ["Health tourism coordination", "Sterile modern clinic", "CAD/CAM laboratory", "International patient experience"],
    de: ["Koordination für Zahntourismus", "Sterile moderne Klinik", "CAD/CAM-Labor", "Internationale Patientenerfahrung"],
  };
  const body = `${pageHero(lang, t.aboutEyebrow, t.aboutTitle, "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container">
    <div class="grid-2" style="grid-template-columns:1.05fr .95fr;">
      <div class="prose" style="margin:0;">
        <p>${t.aboutP1}</p>
        <p>${t.aboutP2}</p>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">
          ${(badges[lang] || badges.en)
            .map((x) => `<span style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;background:var(--cream-2);color:var(--gold);font-weight:700;font-size:13.5px;">${x}</span>`)
            .join("")}
        </div>
      </div>
      <div style="border-radius:24px;overflow:hidden;aspect-ratio:4/5;background:var(--sand);box-shadow:var(--shadow-lg);"><img src="${src(img.about)}" alt="${site.brand}" style="width:100%;height:100%;object-fit:cover;"></div>
    </div>
  </div></section>
  ${contactSection(lang)}`;
  return {
    body,
    title: `${t.nav.about} — ${site.brand}`,
    description: t.aboutP1,
    jsonld: [orgSchema(lang), breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

// Contact page (form + map)
export function contactPage(lang) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.contact, href: url(lang, "iletisim/") }];
  const body = `${pageHero(lang, t.contactEyebrow, t.contactTitle, t.contactLead, crumbs)}
  <section class="section" style="padding-top:0;padding-bottom:0;"><div class="container" data-quote-summary style="display:none;"></div></section>
  ${contactSection(lang, { heading: false })}
  <section class="section" style="padding-top:0;"><div class="container">
    <div style="border-radius:20px;overflow:hidden;box-shadow:var(--shadow);aspect-ratio:16/7;background:var(--sand);">
      <iframe src="${site.mapsEmbed}" width="100%" height="100%" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${site.brand}"></iframe>
    </div>
  </div></section>`;
  return {
    body,
    title: `${t.nav.contact} — ${site.brand}`,
    description: t.contactLead,
    jsonld: [orgSchema(lang), breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

// Prices / cost landing page — DE ("preise/") + EN ("turkey-teeth-price/") only.
// Keyword targeting comes from Google Trends research: DE has no single strong
// "price" long-tail (uses the already-confirmed zahnimplantate/zahnklinik/zahnersatz
// terms instead), EN is built around "turkey teeth price" — by far the strongest
// price-intent term found (~3x "turkey dental prices").
export function pricesPage(lang) {
  const t = i18n[lang];
  const p = t.pricesPage;
  const slug = lang === "de" ? "preise/" : lang === "fr" ? "prix-implants-dentaires-turquie/" : "turkey-teeth-price/";
  const crumbs = [crumbHome(lang), { name: p.eyebrow, href: url(lang, slug) }];

  const priceCell = (item) => {
    if (item.priceOnRequest) return t.calc.onRequest;
    const opt = item.options[0];
    const amount = `€${opt.price.toLocaleString("de-DE")}`;
    return item.options.length > 1 ? `${L(uiBits.fromPriceLabel, lang)} ${amount}` : amount;
  };

  const table = `<div style="overflow-x:auto;border-radius:16px;border:1px solid rgba(43,35,24,.1);">
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <thead><tr style="background:var(--cream-2);">
        <th style="text-align:left;padding:14px 18px;font-weight:700;color:var(--ink);">${p.tableTreatment}</th>
        <th style="text-align:right;padding:14px 18px;font-weight:700;color:var(--ink);">${p.tablePrice}</th>
      </tr></thead>
      <tbody>
        ${priceCalc
          .map(
            (item, i) => `<tr style="${i % 2 ? "background:var(--cream);" : ""}border-top:1px solid rgba(43,35,24,.08);">
          <td style="padding:14px 18px;color:var(--ink-soft);">${
            item.key === "bonding"
              ? `<a href="${url(lang, lang === "de" ? "composite-bonding-tuerkei/" : lang === "fr" ? "composite-bonding-turquie/" : "composite-bonding-turkey/")}" style="color:var(--ink-soft);text-decoration:underline;">${L(item.titles, lang)}</a>`
              : L(item.titles, lang)
          }</td>
          <td style="padding:14px 18px;text-align:right;font-weight:700;color:var(--ink);">${priceCell(item)}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>`;

  const faqItem = (f) => `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(lang, p.eyebrow, p.h1, p.lead, crumbs)}
  <section class="section" style="padding-top:0;"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${p.tableTitle}</h2>
    ${table}
  </div></section>
  ${priceCalcSection(lang)}
  ${xraySection(lang)}
  ${brandsSection(lang)}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${p.faqTitle}</h2>
    <div class="faq" data-reveal>${p.faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: `${p.h1} — ${site.brand}`,
    description: p.lead,
    jsonld: [
      orgSchema(lang),
      faqSchema(p.faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
    ],
  };
}

// Composite bonding landing page — DE ("composite-bonding-tuerkei/") + EN
// ("composite-bonding-turkey/") only. Structure mirrors what ranks for
// competitors (intro, bonding-vs-veneers comparison, price, FAQ) kept to our
// site's usual length — no need to match their 3–4k word pages.
export function bondingPage(lang) {
  const t = i18n[lang];
  const p = t.bondingPage;
  const slug = lang === "de" ? "composite-bonding-tuerkei/" : lang === "fr" ? "composite-bonding-turquie/" : "composite-bonding-turkey/";
  const crumbs = [crumbHome(lang), { name: p.eyebrow, href: url(lang, slug) }];

  const compareTable = `<div style="overflow-x:auto;border-radius:16px;border:1px solid rgba(43,35,24,.1);">
    <table style="width:100%;border-collapse:collapse;font-size:14.5px;">
      <thead><tr style="background:var(--cream-2);">
        <th style="text-align:left;padding:14px 16px;"></th>
        <th style="text-align:left;padding:14px 16px;font-weight:700;color:var(--ink);">${p.compareHeadBonding}</th>
        <th style="text-align:left;padding:14px 16px;font-weight:700;color:var(--ink);">${p.compareHeadVeneer}</th>
      </tr></thead>
      <tbody>
        ${p.compareRows
          .map(
            (r, i) => `<tr style="${i % 2 ? "background:var(--cream);" : ""}border-top:1px solid rgba(43,35,24,.08);">
          <td style="padding:12px 16px;font-weight:700;color:var(--ink-soft);">${r.label}</td>
          <td style="padding:12px 16px;color:var(--muted-2);">${r.bonding}</td>
          <td style="padding:12px 16px;color:var(--muted-2);">${r.veneer}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>`;

  const faqItem = (f) => `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(lang, p.eyebrow, p.h1, p.lead, crumbs)}
  <section class="section" style="padding-top:0;"><div class="container" style="max-width:820px;">
    <h2 style="font-size:22px;margin:0 0 14px;">${p.introTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0 0 36px;">${p.introText}</p>
    <h2 style="font-size:22px;margin:0 0 20px;">${p.compareTitle}</h2>
    ${compareTable}
    <p style="font-size:13px;color:var(--muted-2);margin:16px 0 0;">${p.priceNote}</p>
  </div></section>
  ${priceCalcSection(lang)}
  ${xraySection(lang)}
  ${brandsSection(lang)}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${p.faqTitle}</h2>
    <div class="faq" data-reveal>${p.faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: `${p.h1} — ${site.brand}`,
    description: p.lead,
    jsonld: [
      orgSchema(lang),
      faqSchema(p.faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
    ],
  };
}

/** Dental implants cost landing — DE (`zahnimplantate-tuerkei-kosten/`) + EN (`dental-implants-turkey-cost/`). */
export function implantsCostPage(lang) {
  const t = i18n[lang];
  const p = t.implantsCostPage;
  if (!p) {
    throw new Error(`implantsCostPage copy missing for lang=${lang}`);
  }
  const slug = lang === "de" ? "zahnimplantate-tuerkei-kosten/" : "dental-implants-turkey-cost/";
  const crumbs = [crumbHome(lang), { name: p.eyebrow, href: url(lang, slug) }];
  const implantItem = priceCalc.find((i) => i.key === "implant");
  const unitLabel = (qty) =>
    lang === "de" ? (qty > 1 ? "Implantate" : "Implantat") : qty > 1 ? "implants" : "implant";
  const priceTable = implantItem
    ? `<div style="overflow-x:auto;border-radius:16px;border:1px solid rgba(43,35,24,.1);">
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <thead><tr style="background:var(--cream-2);">
        <th style="text-align:left;padding:14px 18px;font-weight:700;color:var(--ink);">${t.pricesPage.tableTreatment}</th>
        <th style="text-align:right;padding:14px 18px;font-weight:700;color:var(--ink);">${t.pricesPage.tablePrice}</th>
      </tr></thead>
      <tbody>
        ${implantItem.options
          .map(
            (opt, i) => `<tr style="${i % 2 ? "background:var(--cream);" : ""}border-top:1px solid rgba(43,35,24,.08);">
          <td style="padding:14px 18px;color:var(--ink-soft);">${opt.qty} ${unitLabel(opt.qty)}</td>
          <td style="padding:14px 18px;text-align:right;font-weight:700;color:var(--ink);">€${opt.price.toLocaleString("de-DE")}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>`
    : "";

  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const steps = (p.steps || [])
    .map(
      (s, i) => `<div style="display:flex;gap:14px;margin:0 0 16px;">
      <div style="flex:0 0 28px;height:28px;border-radius:50%;background:var(--burgundy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">${i + 1}</div>
      <div><div style="font-weight:700;margin:0 0 4px;">${s.t}</div><p style="margin:0;color:var(--muted);font-size:15px;line-height:1.55;">${s.d}</p></div>
    </div>`
    )
    .join("");

  const safetyList = (p.safetyItems || []).map((s) => `<li style="margin:0 0 8px;">${s}</li>`).join("");

  const geoSlugs =
    lang === "de"
      ? {
          def: "was-ist-ein-zahnimplantat",
          materials: "materialien-marken-zirkon-implantate-tuerkei",
          safety: "ist-zahnbehandlung-in-der-tuerkei-sicher",
          whyCheaper: "warum-ist-zahnbehandlung-in-der-tuerkei-guenstiger",
        }
      : {
          def: "what-is-a-dental-implant",
          materials: "zirconia-vs-emax-implant-brands-turkey",
          safety: "is-dental-treatment-in-turkey-safe",
          whyCheaper: "why-is-dental-treatment-cheaper-in-turkey",
        };
  const priceListSlug = lang === "de" ? "preise/" : "turkey-teeth-price/";
  const links = [
    { href: url(lang, "geo/" + geoSlugs.def + "/"), label: p.geoLinkLabel },
    { href: url(lang, "geo/" + geoSlugs.materials + "/"), label: p.materialsLinkLabel },
    { href: url(lang, "geo/" + geoSlugs.safety + "/"), label: p.safetyLinkLabel },
    { href: url(lang, "geo/" + geoSlugs.whyCheaper + "/"), label: p.whyCheaperLinkLabel },
    { href: url(lang, priceListSlug), label: p.priceListLinkLabel },
  ]
    .map((l) => `<a href="${l.href}" class="btn btn-ghost" style="padding:10px 16px;">${l.label}</a>`)
    .join("");

  const publishedAt = "2026-09-11";
  const updatedAt = "2026-09-11";
  const pageUrl = site.domain + url(lang, slug);

  const body = `${pageHero(lang, p.eyebrow, p.h1, p.lead, crumbs)}
  ${landingCtaBand(lang)}
  <section class="section" style="padding-top:0;"><div class="container" style="max-width:820px;">
    ${landingDoctorCard(lang)}
    <h2 style="font-size:22px;margin:0 0 14px;">${p.introTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0 0 28px;">${p.introText}</p>
    <h2 style="font-size:24px;margin:0 0 20px;">${p.tableTitle}</h2>
    ${priceTable}
    <p style="font-size:13px;color:var(--muted-2);margin:16px 0 0;">${p.priceNote}</p>
  </div></section>
  ${landingBaSection(lang)}
  ${landingCasesStrip(lang, ["aug-17-2.jpg", "sep-27-3.jpg", "jun-8-3.jpg"])}
  ${landingCompareTable(lang, p.compareRows || [])}
  ${landingTripTimeline(lang, p.tripStages || [])}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:22px;margin:0 0 18px;">${p.stepsTitle}</h2>
    ${steps}
  </div></section>
  <section class="section"><div class="container" style="max-width:820px;">
    <h2 style="font-size:22px;margin:0 0 14px;">${p.safetyTitle}</h2>
    <ul style="font-size:15.5px;line-height:1.7;color:var(--muted);padding-left:20px;margin:0 0 28px;">${safetyList}</ul>
    <h2 style="font-size:22px;margin:0 0 14px;">${p.aftercareTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0;">${p.aftercareText}</p>
    <div style="margin-top:28px;display:flex;flex-wrap:wrap;gap:10px;">${links}</div>
  </div></section>
  ${priceCalcSection(lang)}
  ${xraySection(lang)}
  ${brandsSection(lang)}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${p.faqTitle}</h2>
    <div class="faq" data-reveal>${p.faqs.map(faqItem).join("")}</div>
  </div></section>
  ${landingCtaBand(lang)}
  ${contactSection(lang)}`;

  return {
    body,
    title: `${p.h1} — ${site.brand}`,
    description: p.lead,
    publishedTime: publishedAt,
    modifiedTime: updatedAt,
    jsonld: [
      orgSchema(lang),
      faqSchema(p.faqs),
      landingArticleSchema({
        lang,
        pageUrl,
        headline: p.h1,
        description: p.lead,
        publishedAt,
        updatedAt,
      }),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
    ],
  };
}

/** Veneers commercial landing — DE (`porzellan-veneers-istanbul/`) + EN (`veneers-turkey/`). */
export function veneersPage(lang) {
  const t = i18n[lang];
  const p = t.veneersPage;
  if (!p) {
    throw new Error(`veneersPage copy missing for lang=${lang}`);
  }
  const slug = lang === "de" ? "porzellan-veneers-istanbul/" : "veneers-turkey/";
  const crumbs = [crumbHome(lang), { name: p.eyebrow, href: url(lang, slug) }];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;
  const steps = (p.steps || [])
    .map(
      (s, i) => `<div style="display:flex;gap:14px;margin:0 0 16px;">
      <div style="flex:0 0 28px;height:28px;border-radius:50%;background:var(--burgundy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">${i + 1}</div>
      <div><div style="font-weight:700;margin:0 0 4px;">${s.t}</div><p style="margin:0;color:var(--muted);font-size:15px;line-height:1.55;">${s.d}</p></div>
    </div>`
    )
    .join("");
  const prosList = (p.pros || []).map((x) => `<li style="margin:0 0 8px;">${x}</li>`).join("");
  const consList = (p.cons || []).map((x) => `<li style="margin:0 0 8px;">${x}</li>`).join("");
  const geoSlug = lang === "de" ? "was-sind-porzellan-veneers" : "what-are-porcelain-veneers";
  const bondingSlug = lang === "de" ? "composite-bonding-tuerkei" : "composite-bonding-turkey";
  const compareBlogSlug = lang === "de" ? "bonding-vs-veneers-istanbul" : "dental-bonding-vs-veneers-istanbul";
  const riskHref = url("en", "geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/");
  const publishedAt = "2026-09-11";
  const updatedAt = "2026-09-11";
  const pageUrl = site.domain + url(lang, slug);
  const caseImage = img.cases.find((c) => c.file === "sep-27-3.jpg");

  const body = `${pageHero(lang, p.eyebrow, p.h1, p.lead, crumbs)}
  ${landingCtaBand(lang)}
  <section class="section" style="padding-top:0;"><div class="container" style="max-width:820px;">
    ${landingDoctorCard(lang)}
    ${caseImage ? caseImageBlock(caseImage.file, p.caseImageAlt || L(caseImage.label, lang)) : ""}
    <h2 style="font-size:22px;margin:0 0 14px;">${p.introTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0 0 28px;">${p.introText}</p>
    ${landingInclusions(lang, p.inclusions || [])}
    <h2 style="font-size:22px;margin:0 0 18px;">${p.stepsTitle}</h2>
    ${steps}
    <p style="font-size:15px;line-height:1.62;color:var(--muted);margin:24px 0 0;">${p.travelNote}</p>
    <p style="font-size:13px;color:var(--muted-2);margin:16px 0 0;">${p.priceNote}</p>
  </div></section>
  ${landingBaSection(lang)}
  ${landingCasesStrip(lang, ["sep-27-3.jpg", "jun-8-3.jpg", "jul-27-3.jpg"])}
  ${landingCompareTable(lang, p.compareRows || [])}
  ${landingTripTimeline(lang, p.tripStages || [])}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:22px;margin:0 0 18px;">${p.prosConsTitle}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;">
      <div><ul style="font-size:15px;line-height:1.65;color:var(--muted);padding-left:20px;margin:0;">${prosList}</ul></div>
      <div><ul style="font-size:15px;line-height:1.65;color:var(--muted);padding-left:20px;margin:0;">${consList}</ul></div>
    </div>
  </div></section>
  <section class="section"><div class="container" style="max-width:820px;">
    <h2 style="font-size:22px;margin:0 0 14px;">${p.risksTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0 0 14px;">${p.risksText}</p>
    <p style="margin:0 0 28px;"><a href="${riskHref}" class="link-more">${p.riskLinkLabel} ${icons.arrowSm}</a></p>
    <h2 style="font-size:22px;margin:0 0 14px;">${p.aftercareTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0;">${p.aftercareText}</p>
    <p style="margin:20px 0 0;"><a href="${url(lang, "geo/" + geoSlug + "/")}" class="link-more">${p.geoLinkLabel} ${icons.arrowSm}</a>
    · <a href="${url(lang, bondingSlug + "/")}" class="link-more">${p.bondingLinkLabel} ${icons.arrowSm}</a>
    · <a href="${url(lang, "blog/" + compareBlogSlug + "/")}" class="link-more">${p.compareLinkLabel} ${icons.arrowSm}</a></p>
  </div></section>
  ${priceCalcSection(lang)}
  ${xraySection(lang)}
  ${brandsSection(lang)}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${p.faqTitle}</h2>
    <div class="faq" data-reveal>${p.faqs.map(faqItem).join("")}</div>
  </div></section>
  ${landingCtaBand(lang)}
  ${contactSection(lang)}`;
  return {
    body,
    title: `${p.h1} — ${site.brand}`,
    description: p.lead,
    publishedTime: publishedAt,
    modifiedTime: updatedAt,
    jsonld: [
      orgSchema(lang),
      faqSchema(p.faqs),
      landingArticleSchema({
        lang,
        pageUrl,
        headline: p.h1,
        description: p.lead,
        publishedAt,
        updatedAt,
      }),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
    ],
  };
}

/** Hollywood Smile package commercial landing — DE (`hollywood-smile-tuerkei-paket/`) + EN (`hollywood-smile-turkey-package/`). */
export function hollywoodSmilePage(lang) {
  const t = i18n[lang];
  const p = t.hollywoodPage;
  if (!p) {
    throw new Error(`hollywoodPage copy missing for lang=${lang}`);
  }
  const slug = lang === "de" ? "hollywood-smile-tuerkei-paket/" : "hollywood-smile-turkey-package/";
  const crumbs = [crumbHome(lang), { name: p.eyebrow, href: url(lang, slug) }];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;
  const steps = (p.steps || [])
    .map(
      (s, i) => `<div style="display:flex;gap:14px;margin:0 0 16px;">
      <div style="flex:0 0 28px;height:28px;border-radius:50%;background:var(--burgundy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">${i + 1}</div>
      <div><div style="font-weight:700;margin:0 0 4px;">${s.t}</div><p style="margin:0;color:var(--muted);font-size:15px;line-height:1.55;">${s.d}</p></div>
    </div>`
    )
    .join("");
  const prosList = (p.pros || []).map((x) => `<li style="margin:0 0 8px;">${x}</li>`).join("");
  const consList = (p.cons || []).map((x) => `<li style="margin:0 0 8px;">${x}</li>`).join("");

  const hollywoodPkg = packages.find((pk) => pk.key === "hollywood");
  const packageItems = hollywoodPkg ? L(hollywoodPkg.items, lang) : [];
  const packageItemsList = packageItems.map((x) => `<li style="margin:0 0 8px;">${x}</li>`).join("");

  const hollywoodPrice = priceCalc.find((i) => i.key === "hollywood");
  const unitLabel = (qty) => (lang === "de" ? "Zähne" : "teeth");
  const priceTable = hollywoodPrice
    ? `<div style="overflow-x:auto;border-radius:16px;border:1px solid rgba(43,35,24,.1);">
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <thead><tr style="background:var(--cream-2);">
        <th style="text-align:left;padding:14px 18px;font-weight:700;color:var(--ink);">${t.pricesPage.tableTreatment}</th>
        <th style="text-align:right;padding:14px 18px;font-weight:700;color:var(--ink);">${t.pricesPage.tablePrice}</th>
      </tr></thead>
      <tbody>
        ${hollywoodPrice.options
          .map(
            (opt, i) => `<tr style="${i % 2 ? "background:var(--cream);" : ""}border-top:1px solid rgba(43,35,24,.08);">
          <td style="padding:14px 18px;color:var(--ink-soft);">${opt.qty} ${unitLabel(opt.qty)}</td>
          <td style="padding:14px 18px;text-align:right;font-weight:700;color:var(--ink);">€${opt.price.toLocaleString("de-DE")}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>`
    : "";

  const geoSlug = lang === "de" ? "hollywood-smile-paket-istanbul" : "hollywood-smile-package-istanbul";
  const veneersSlug = lang === "de" ? "porzellan-veneers-istanbul" : "veneers-turkey";
  const bondingSlug = lang === "de" ? "composite-bonding-tuerkei" : "composite-bonding-turkey";
  const riskHref = url("en", "geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/");
  const publishedAt = "2026-09-11";
  const updatedAt = "2026-09-11";
  const pageUrl = site.domain + url(lang, slug);
  const caseImage = img.cases.find((c) => c.file === "jun-8-3.jpg");

  const body = `${pageHero(lang, p.eyebrow, p.h1, p.lead, crumbs)}
  ${landingCtaBand(lang)}
  <section class="section" style="padding-top:0;"><div class="container" style="max-width:820px;">
    ${landingDoctorCard(lang)}
    ${caseImage ? caseImageBlock(caseImage.file, p.caseImageAlt || L(caseImage.label, lang)) : ""}
    <h2 style="font-size:22px;margin:0 0 14px;">${p.introTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0 0 28px;">${p.introText}</p>
    ${landingInclusions(lang, p.inclusions || [])}
    <h2 style="font-size:22px;margin:0 0 14px;">${p.packageItemsTitle}</h2>
    <ul style="font-size:15.5px;line-height:1.7;color:var(--muted);padding-left:20px;margin:0 0 28px;">${packageItemsList}</ul>
    <h2 style="font-size:24px;margin:0 0 20px;">${p.tableTitle}</h2>
    ${priceTable}
  </div></section>
  ${landingBaSection(lang)}
  ${landingCasesStrip(lang, ["jun-8-3.jpg", "sep-27-3.jpg", "jul-27-3.jpg"])}
  ${landingCompareTable(lang, p.compareRows || [])}
  ${landingTripTimeline(lang, p.tripStages || [])}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:22px;margin:0 0 18px;">${p.stepsTitle}</h2>
    ${steps}
  </div></section>
  <section class="section"><div class="container" style="max-width:820px;">
    <h2 style="font-size:22px;margin:0 0 18px;">${p.prosConsTitle}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;margin:0 0 28px;">
      <div><ul style="font-size:15px;line-height:1.65;color:var(--muted);padding-left:20px;margin:0;">${prosList}</ul></div>
      <div><ul style="font-size:15px;line-height:1.65;color:var(--muted);padding-left:20px;margin:0;">${consList}</ul></div>
    </div>
    <h2 style="font-size:22px;margin:0 0 14px;">${p.risksTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0 0 14px;">${p.risksText}</p>
    <p style="margin:0 0 28px;"><a href="${riskHref}" class="link-more">${p.riskLinkLabel} ${icons.arrowSm}</a></p>
    <h2 style="font-size:22px;margin:0 0 14px;">${p.aftercareTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0;">${p.aftercareText}</p>
    <p style="margin:20px 0 0;"><a href="${url(lang, "geo/" + geoSlug + "/")}" class="link-more">${p.geoLinkLabel} ${icons.arrowSm}</a>
    · <a href="${url(lang, veneersSlug + "/")}" class="link-more">${p.veneersLinkLabel} ${icons.arrowSm}</a>
    · <a href="${url(lang, bondingSlug + "/")}" class="link-more">${p.bondingLinkLabel} ${icons.arrowSm}</a></p>
  </div></section>
  ${priceCalcSection(lang)}
  ${xraySection(lang)}
  ${brandsSection(lang)}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${p.faqTitle}</h2>
    <div class="faq" data-reveal>${p.faqs.map(faqItem).join("")}</div>
  </div></section>
  ${landingCtaBand(lang)}
  ${contactSection(lang)}`;

  return {
    body,
    title: `${p.h1} — ${site.brand}`,
    description: p.lead,
    publishedTime: publishedAt,
    modifiedTime: updatedAt,
    jsonld: [
      orgSchema(lang),
      faqSchema(p.faqs),
      landingArticleSchema({
        lang,
        pageUrl,
        headline: p.h1,
        description: p.lead,
        publishedAt,
        updatedAt,
      }),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
    ],
  };
}

/** All-on-4 commercial landing — DE (`all-on-4-zahnimplantate-tuerkei/`) + EN (`all-on-4-turkey-package/`).
 * Price is intentionally NOT taken from the `fullmouth` priceCalc package (10–12 individual
 * implants, €8,000–€9,000) — that is a different protocol and must not be relabelled All-on-4. */
export function allOn4Page(lang) {
  const t = i18n[lang];
  const p = t.allOn4Page;
  if (!p) {
    throw new Error(`allOn4Page copy missing for lang=${lang}`);
  }
  const slug = lang === "de" ? "all-on-4-zahnimplantate-tuerkei/" : "all-on-4-turkey-package/";
  const crumbs = [crumbHome(lang), { name: p.eyebrow, href: url(lang, slug) }];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;
  const steps = (p.steps || [])
    .map(
      (s, i) => `<div style="display:flex;gap:14px;margin:0 0 16px;">
      <div style="flex:0 0 28px;height:28px;border-radius:50%;background:var(--burgundy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">${i + 1}</div>
      <div><div style="font-weight:700;margin:0 0 4px;">${s.t}</div><p style="margin:0;color:var(--muted);font-size:15px;line-height:1.55;">${s.d}</p></div>
    </div>`
    )
    .join("");
  const prosList = (p.pros || []).map((x) => `<li style="margin:0 0 8px;">${x}</li>`).join("");
  const consList = (p.cons || []).map((x) => `<li style="margin:0 0 8px;">${x}</li>`).join("");

  const geoSlug = lang === "de" ? "was-ist-all-on-4" : "what-is-all-on-4";
  const priceListSlug = lang === "de" ? "preise/" : "turkey-teeth-price/";
  const implantsSlug = lang === "de" ? "zahnimplantate-tuerkei-kosten/" : "dental-implants-turkey-cost/";
  const riskHref = url("en", "geo/turkey-teeth-what-they-are-and-how-to-avoid-problems/");
  const publishedAt = "2026-09-11";
  const updatedAt = "2026-09-11";
  const pageUrl = site.domain + url(lang, slug);
  const xrayImg = i18n[lang].xray || i18n.en.xray;

  const body = `${pageHero(lang, p.eyebrow, p.h1, p.lead, crumbs)}
  ${landingCtaBand(lang)}
  <section class="section" style="padding-top:0;"><div class="container" style="max-width:820px;">
    ${landingDoctorCard(lang)}
    ${caseImageBlock("xray-example-allonx.jpg", p.caseImageAlt || xrayImg.exampleAlt)}
    <h2 style="font-size:22px;margin:0 0 14px;">${p.introTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0 0 28px;">${p.introText}</p>
    ${landingInclusions(lang, p.inclusions || [])}
    <h2 style="font-size:22px;margin:0 0 14px;">${p.priceTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0;">${p.priceText}</p>
  </div></section>
  ${landingBaSection(lang)}
  ${landingCasesStrip(lang, ["aug-17-2.jpg", "jun-8-3.jpg", "jul-27-3.jpg"])}
  ${landingCompareTable(lang, p.compareRows || [])}
  ${landingTripTimeline(lang, p.tripStages || [])}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:22px;margin:0 0 18px;">${p.stepsTitle}</h2>
    ${steps}
  </div></section>
  <section class="section"><div class="container" style="max-width:820px;">
    <h2 style="font-size:22px;margin:0 0 18px;">${p.prosConsTitle}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;margin:0 0 28px;">
      <div><ul style="font-size:15px;line-height:1.65;color:var(--muted);padding-left:20px;margin:0;">${prosList}</ul></div>
      <div><ul style="font-size:15px;line-height:1.65;color:var(--muted);padding-left:20px;margin:0;">${consList}</ul></div>
    </div>
    <h2 style="font-size:22px;margin:0 0 14px;">${p.risksTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0 0 14px;">${p.risksText}</p>
    <p style="margin:0 0 28px;"><a href="${riskHref}" class="link-more">${p.riskLinkLabel} ${icons.arrowSm}</a></p>
    <h2 style="font-size:22px;margin:0 0 14px;">${p.aftercareTitle}</h2>
    <p style="font-size:16px;line-height:1.66;color:var(--muted);margin:0;">${p.aftercareText}</p>
    <p style="margin:20px 0 0;"><a href="${url(lang, "geo/" + geoSlug + "/")}" class="link-more">${p.geoLinkLabel} ${icons.arrowSm}</a>
    · <a href="${url(lang, implantsSlug)}" class="link-more">${p.implantsLinkLabel} ${icons.arrowSm}</a>
    · <a href="${url(lang, priceListSlug)}" class="link-more">${p.priceListLinkLabel} ${icons.arrowSm}</a></p>
  </div></section>
  ${priceCalcSection(lang)}
  ${xraySection(lang)}
  ${brandsSection(lang)}
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${p.faqTitle}</h2>
    <div class="faq" data-reveal>${p.faqs.map(faqItem).join("")}</div>
  </div></section>
  ${landingCtaBand(lang)}
  ${contactSection(lang)}`;

  return {
    body,
    title: `${p.h1} — ${site.brand}`,
    description: p.lead,
    publishedTime: publishedAt,
    modifiedTime: updatedAt,
    jsonld: [
      orgSchema(lang),
      faqSchema(p.faqs),
      landingArticleSchema({
        lang,
        pageUrl,
        headline: p.h1,
        description: p.lead,
        publishedAt,
        updatedAt,
      }),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
    ],
  };
}

// Reviews
export function reviewsPage(lang) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.reviews, href: url(lang, "yorumlar/") }];
  const review = (r) => `<div class="card"><div class="stars" style="color:var(--gold);">★★★★★</div><p style="font-size:15.5px;line-height:1.62;color:var(--ink-soft);margin:14px 0 18px;">“${r.text}”</p><div style="display:flex;align-items:center;gap:12px;"><div class="avatar">${r.initials}</div><div><div style="font-weight:700;font-size:14.5px;">${r.name}</div><div style="font-size:12.5px;color:var(--muted-2);">${r.place}</div></div></div></div>`;
  const body = `${pageHero(lang, t.reviewsEyebrow, t.reviewsTitle, t.reviewsLead, crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container">
    <div class="grid-auto">${t.reviews.map(review).join("")}</div>
    <div style="text-align:center;margin-top:36px;"><a href="${site.mapsUrl}" class="btn btn-ghost" target="_blank" rel="noopener">Google ${L(uiBits.googleReviews, lang)} ${icons.arrowSm}</a></div>
  </div></section>
  ${contactSection(lang)}`;
  return {
    body,
    title: `${t.nav.reviews} — ${site.brand}`,
    description: t.reviewsLead,
    jsonld: [orgSchema(lang), breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

// Gallery
export function galleryPage(lang) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.gallery, href: url(lang, "galeri/") }];
  const imgs = img.gallery.map((f) => src(f));
  const body = `${pageHero(lang, "", t.galleryTitle, t.galleryLead, crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container">
    <div class="gallery-grid">${imgs.map((href) => `<button class="gallery-item" data-lightbox-src="${href}"><img src="${href}" alt="${site.brand}" loading="lazy"></button>`).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;
  return {
    body,
    title: `${t.galleryTitle} — ${site.brand}`,
    description: t.galleryLead,
    jsonld: [breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

// FAQ page
export function faqPage(lang) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.faq, href: url(lang, "sss/") }];
  const item = (f) => `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;
  const body = `${pageHero(lang, t.faqEyebrow, t.faqTitle, "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:900px;">
    <div class="faq">${t.faqs.map(item).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;
  return {
    body,
    title: `${t.nav.faq} — ${site.brand}`,
    description: t.faqTitle,
    jsonld: [faqSchema(t.faqs), breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

// Simple legal text page
export function legalPage(lang, kind) {
  const t = i18n[lang];
  const title = kind === "kvkk" ? t.kvkk : t.privacy;
  const slug = kind === "kvkk" ? "kvkk/" : "gizlilik/";
  const crumbs = [crumbHome(lang), { name: title, href: url(lang, slug) }];
  const copy = {
    tr: `<p>${site.brand} olarak kişisel verilerinizin gizliliğine önem veriyoruz. İletişim formu veya WhatsApp üzerinden paylaştığınız ad, telefon, e-posta ve mesaj bilgileri yalnızca size dönüş yapmak ve tedavi süreciyle ilgili bilgilendirme amacıyla kullanılır; üçüncü taraflarla pazarlama amacıyla paylaşılmaz.</p><p>6698 sayılı KVKK kapsamındaki haklarınız çerçevesinde verilerinizin silinmesini talep edebilirsiniz. Talepleriniz için <a href="mailto:${site.email}">${site.email}</a> adresinden bize ulaşabilirsiniz.</p>`,
    en: `<p>At ${site.brand} we value the privacy of your personal data. The name, phone, email and message you share via the contact form or WhatsApp are used only to respond to you and to provide information about your treatment; they are not shared with third parties for marketing.</p><p>You may request deletion of your data. Contact us at <a href="mailto:${site.email}">${site.email}</a>.</p>`,
    de: `<p>Bei ${site.brand} legen wir Wert auf den Schutz Ihrer personenbezogenen Daten. Name, Telefon, E-Mail und Nachricht, die Sie über das Kontaktformular oder WhatsApp teilen, werden nur zur Beantwortung und zur Information über Ihre Behandlung verwendet und nicht zu Marketingzwecken an Dritte weitergegeben.</p><p>Sie können die Löschung Ihrer Daten verlangen. Kontakt: <a href="mailto:${site.email}">${site.email}</a>.</p>`,
  };
  const body = `${pageHero(lang, "", title, "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container"><article class="prose">${copy[lang] || copy.en}</article></div></section>`;
  return {
    body,
    title: `${title} — ${site.brand}`,
    description: title + " — " + site.brand,
    jsonld: [breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

const miniMinus = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"></path></svg>`;
const miniPlus = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg>`;

/** GEO index — AI citation packs */
export function geoIndexPage(lang, packs) {
  const title =
    lang === "de" ? "GEO Wissensbank"
    : lang === "fr" ? "Base de connaissances GEO"
    : lang === "ar" ? "قاعدة معرفة GEO"
    : lang === "ru" ? "База знаний GEO"
    : lang === "en" ? "GEO knowledge base"
    : "GEO bilgi bankası";
  const lead =
    lang === "de"
      ? "Kurze, zitierfähige Antworten für KI-Suchmaschinen und Patientenfragen."
      : lang === "fr"
        ? "Réponses courtes et citables pour les moteurs de recherche IA et les questions des patients."
        : lang === "ar"
          ? "إجابات قصيرة جاهزة للاقتباس لمحركات البحث بالذكاء الاصطناعي وأسئلة المرضى."
          : lang === "ru"
            ? "Краткие, удобные для цитирования ответы для ИИ-поиска и вопросов пациентов."
            : lang === "en"
              ? "Short, citation-ready answers for AI search and patient questions."
              : "Yapay zekâ arama motorları ve hasta soruları için kısa, alıntılanabilir cevaplar.";
  const crumbs = [crumbHome(lang), { name: "GEO", href: url(lang, "geo/") }];
  const row = (p) => `<a href="${url(lang, "geo/" + p.slug + "/")}" class="article-row" style="color:inherit;">
    ${p.coverImage ? `<img class="article-thumb" src="${asset(`/assets/img/${p.coverImage}`)}" alt="" width="160" height="106" loading="lazy">` : ""}
    <div><h3 style="font-size:20px;margin-bottom:6px;">${p.title || p.question}</h3><p style="font-size:14.5px;color:var(--muted-2);margin:0;">${p.direct_answer.slice(0, 140)}…</p></div>
    <span class="link-more">${L(uiBits.read, lang)} ${icons.arrowSm}</span>
  </a>`;
  const body = `${pageHero(lang, "GEO", title, lead, crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container" style="max-width:920px;">
    <div class="article-list">${packs.map(row).join("")}</div>
  </div></section>`;
  return {
    body,
    title: `${title} — ${site.brand}`,
    description: lead,
    jsonld: [breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
  };
}

/** Single GEO pack — answer-first + optional long sections + Article + FAQPage */
export function geoPackPage(lang, pack) {
  const crumbs = [
    crumbHome(lang),
    { name: "GEO", href: url(lang, "geo/") },
    { name: pack.title || pack.question, href: url(lang, "geo/" + pack.slug + "/") },
  ];
  const links = (pack.internal_links || [])
    .map((l) => `<a href="${l.href}" class="btn btn-ghost" style="padding:10px 16px;">${l.label}</a>`)
    .join("");
  const cover = pack.coverImage
    ? `<figure class="article-cover" style="margin:0 0 24px;"><img src="${asset(`/assets/img/${pack.coverImage}`)}" alt="${pack.question || pack.title}" width="1536" height="1024" style="width:100%;height:auto;border-radius:18px;display:block;" loading="eager"></figure>`
    : "";
  const ogImage = pack.coverImage ? site.domain + asset(`/assets/img/${pack.coverImage}`) : undefined;
  const pageUrl = site.domain + url(lang, "geo/" + pack.slug + "/");
  const bylineBits = [];
  if (pack.author) bylineBits.push(pack.author);
  if (pack.reviewer) bylineBits.push(`${reviewedByLabel[lang] || reviewedByLabel.en}: ${pack.reviewer}`);
  if (pack.updatedAt || pack.publishedAt) bylineBits.push(pack.updatedAt || pack.publishedAt);
  const byline =
    bylineBits.length > 0
      ? `<p style="font-size:13px;color:var(--muted-2);margin:0 0 18px;">${bylineBits.join(" · ")}</p>`
      : "";
  const sectionsHtml = (pack.sections || [])
    .map((s) => {
      const paras = (s.paragraphs || []).map((p) => `<p>${p}</p>`).join("");
      return `<h2>${s.h2}</h2>${paras}`;
    })
    .join("");
  const body = `${pageHero(lang, "GEO", pack.question || pack.title, "", crumbs)}
  <section class="section" style="padding-top:clamp(24px,3vw,40px);"><div class="container" style="max-width:760px;">
    <article class="prose">
      ${cover}
      ${byline}
      <p><strong>${pack.direct_answer}</strong></p>
      ${pack.showConversionBand ? geoConversionBand(lang) : ""}
      <h2>${keyPointsHeading[lang] || keyPointsHeading.en}</h2>
      <ul>${(pack.bullets || []).map((b) => `<li>${b}</li>`).join("")}</ul>
      ${sectionsHtml}
      <h2>${faqHeading[lang] || faqHeading.en}</h2>
      ${(pack.faq || []).map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join("")}
      ${pack.showConversionBand ? geoConversionBand(lang) : ""}
      <div style="margin-top:28px;display:flex;flex-wrap:wrap;gap:10px;">${links}</div>
    </article>
  </div></section>`;
  const authorNode = pack.author
    ? { "@type": "Person", name: pack.author }
    : { "@id": site.domain + "/#organization" };
  const metaDesc =
    pack.metaDescription ||
    (pack.direct_answer ? pack.direct_answer.slice(0, 155) : pack.title || "");
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pack.question || pack.title,
    description: metaDesc,
    image: ogImage,
    inLanguage: langBCP47[lang] || "en-US",
    datePublished: pack.publishedAt || undefined,
    dateModified: pack.updatedAt || pack.publishedAt || undefined,
    author: authorNode,
    publisher: { "@id": site.domain + "/#organization" },
    mainEntityOfPage: pageUrl,
    url: pageUrl,
  };
  if (pack.reviewer) {
    articleLd.reviewedBy = { "@type": "Person", name: pack.reviewer };
  }
  return {
    body,
    title: `${pack.question || pack.title} — ${site.brand}`,
    description: metaDesc,
    image: ogImage,
    ogType: "article",
    publishedTime: pack.publishedAt || undefined,
    modifiedTime: pack.updatedAt || undefined,
    jsonld: [
      faqSchema(pack.faq || []),
      articleLd,
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
    ],
  };
}

// ---------------------------------------------------------------------------
// "Before You Book" trust cluster (EN-only). Source: content/before-you-book/.
// Reviewer byline + JSON-LD author/reviewedBy are intentionally omitted until
// a named clinician has read and approved each page — see REVIEWER BYLINE
// comments below.
// ---------------------------------------------------------------------------

const beforeYouBookCrumb = (lang) => ({
  name: "Before You Book",
  href: url(lang, "before-you-book/"),
  url: site.domain + url(lang, "before-you-book/"),
});

const reviewerBylinePlaceholder =
  "<!-- REVIEWER BYLINE: hekim onayı alındıktan sonra doldurulacak (isim, unvan, üniversite/mezuniyet yılı, \"last reviewed\" tarihi) -->";

export function beforeYouBookHubPage(lang) {
  const crumbs = [crumbHome(lang), beforeYouBookCrumb(lang)];
  const linkGroup = (heading, items) => `
    <p><strong>${heading}</strong></p>
    <ul>
      ${items.map((it) => `<li><a href="${url(lang, "before-you-book/" + it.slug + "/")}">${it.label}</a>${it.note ? ` — ${it.note}` : ""}</li>`).join("\n      ")}
    </ul>`;

  const body = `${pageHero(
    lang,
    "Before You Book",
    "Before you book dental treatment in Turkey",
    "",
    crumbs
  )}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>Most pages you will read on this subject were written by a clinic that wants your deposit. This one was too — so read it with that in mind, and then use it to check us against everybody else, including the clinic you have already been talking to.</p>
      <p>We are a dental clinic in Istanbul. We treat international patients. We also see, several times a month, people who arrive with a treatment plan from another clinic that we would not have recommended, or a quote that does not include things they will be charged for. That is the reason this section exists.</p>

      <h3>What is on these pages</h3>
      ${linkGroup("Start here if you are still deciding", [
        { slug: "is-dental-treatment-in-turkey-safe", label: "Is dental treatment in Turkey safe?", note: "what the real risk is, what it is not, and the two things that actually predict outcome." },
        { slug: "when-you-should-not-come-to-turkey", label: "When you should not come to Turkey", note: "the cases where we tell people to have treatment at home. Read this one first if you want to know whether we are being straight with you." },
      ])}
      ${linkGroup("Start here if you already have a quote", [
        { slug: "check-my-turkey-dental-quote", label: "Check my Turkey dental quote", note: "send us any clinic's quote and a dentist here will write back telling you what is missing, what is over-treatment, and what it should cost. Free, no obligation, and we will review quotes from our competitors." },
        { slug: "crowns-vs-veneers-what-you-actually-need", label: "Do you actually need crowns, or veneers, or neither?", note: "the single most common over-treatment in this industry is healthy teeth filed down for crowns." },
        { slug: "dental-treatment-abroad-second-opinion", label: "Get a second opinion on a treatment plan" },
      ])}
      ${linkGroup("Start here if you are choosing between clinics", [
        { slug: "turkey-dentist-red-flags", label: "Turkey dentist red flags: 12 things that should stop you" },
        { slug: "how-to-verify-a-turkish-dental-clinic", label: "How to verify a Turkish dental clinic yourself", note: "including how to check us, on a government database, in about four minutes." },
        { slug: "questions-to-ask-before-you-pay-a-deposit", label: "21 questions to ask before you pay a deposit", note: "printable." },
        { slug: "guarantee-and-what-happens-if-something-fails", label: "What the guarantee actually covers — and who pays to fly you back" },
      ])}
      ${linkGroup("Start here if something has already gone wrong", [
        { slug: "turkey-teeth-gone-wrong", label: "Turkey teeth gone wrong: what actually fails, and what can be fixed" },
        { slug: "aftercare-after-turkey-teeth", label: "Aftercare after Turkey teeth, and what to do if your dentist at home won't see you" },
      ])}

      <h3>The short version, if you read nothing else</h3>
      <ol>
        <li>Price is the weakest predictor of outcome. The gap between a good and a bad Istanbul clinic is far wider than the gap between Istanbul and London.</li>
        <li>Ask what is being <em>removed</em>. Anything irreversible — enamel, tooth structure, a healthy tooth — is the part you cannot undo if you change your mind.</li>
        <li>A clinic that will not put the treatment plan, the materials, the total price and the guarantee in one written document before you fly is telling you something.</li>
        <li>Plan the aftercare before you book the flight, not after.</li>
        <li>If a clinic tells you every patient is a candidate, it is a sales operation.</li>
      </ol>

      ${reviewerBylinePlaceholder}

      <blockquote>
        <p>Our clinicians are licensed and regulated in Türkiye. We are not regulated by the UK General Dental Council or any equivalent body outside Türkiye, and treatment here is governed by Turkish law.</p>
      </blockquote>
    </article>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "Before You Book Dental Treatment in Turkey | MediDent İstanbul",
    description:
      "An honest pre-booking guide from an Istanbul clinic: how to check a quote, verify a clinic, spot red flags, and decide whether you should travel at all.",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Before You Book Dental Treatment in Turkey",
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        url: site.domain + url(lang, "before-you-book/"),
      },
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookIsSafePage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "Is dental treatment in Turkey safe?", href: url(lang, "before-you-book/is-dental-treatment-in-turkey-safe/") },
  ];

  const faqs = [
    {
      q: "Is dental work in Turkey as good as in the UK or Germany?",
      a: "At a well-run clinic, the standard of materials and technique is equivalent; Turkish dental schools and specialist training are comparable. The variance between clinics within Türkiye is much larger than the variance between countries.",
    },
    {
      q: "Why is it so much cheaper?",
      a: "Labour, lab, rent and currency — not materials. If the saving is being made on materials or on diagnostic time, that is a different and worse kind of cheap. Ask which one it is.",
    },
    {
      q: "Is it safe to have all my treatment in one week?",
      a: "Some treatments, yes. Implants that need osseointegration, full-mouth rehabilitation and anything involving gum treatment first generally need two trips. A clinic that fits every case into one week is scheduling around flights, not biology.",
    },
    {
      q: "What happens if something goes wrong after I fly home?",
      a: "That depends entirely on what your clinic put in writing before you travelled — the guarantee, who pays for revision, and whether they have a documented pathway for your dentist at home. Get it in writing first.",
    },
    {
      q: "Can I check a Turkish clinic's credentials myself?",
      a: "Yes. The Ministry of Health publishes a directory of authorised international health tourism providers, and dentist registration can be verified independently. Takes a few minutes.",
    },
  ];

  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(
    lang,
    "Before You Book",
    "Is dental treatment in Turkey safe?",
    "",
    crumbs
  )}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p><strong>Short answer: the country is not the variable. The clinic is.</strong> Türkiye has dental faculties, specialists and equipment equal to anywhere in Europe, and it also has high-volume operations that will file down eight healthy teeth in an afternoon. Both are legal, both advertise on the same Instagram feed, and the price difference between them is often under £500. That is the real risk — not Turkey.</p>
      <p>So the useful question is not "is Turkey safe". It is: <strong>what does a bad outcome actually look like, and what predicts it?</strong></p>

      <h2>What actually goes wrong</h2>
      <p>In the cases we see for revision, the failures cluster into four types. Almost none of them are the dramatic things people fear.</p>
      <p><strong>1. Over-treatment.</strong> By a long way the most common. A patient wants whiter, straighter front teeth. They leave with 16 to 20 crowns, meaning healthy enamel on every one of those teeth has been permanently removed. Whitening, bonding, or aligners would have achieved the same appearance. This is irreversible. Those teeth are now dependent on crowns for life.</p>
      <p><strong>2. Biological, not cosmetic, failure.</strong> Crowns fitted over untreated gum disease or an undetected root infection. The smile looks correct in the photos taken on discharge day and fails at 6–24 months. This is a diagnostic failure, not a lab failure — and it is why a full periodontal assessment and radiographs before any preparation matter more than the brand of ceramic.</p>
      <p><strong>3. Timeline compression.</strong> Work that needs two visits three months apart compressed into one seven-day trip because the patient has one week of annual leave. Immediate-load implants are a legitimate protocol for the right bone and the right patient; used as a default so the patient can fly home with teeth, they are a gamble.</p>
      <p><strong>4. No aftercare pathway.</strong> Nothing goes wrong clinically, but the patient is 3,000 km away when a crown debonds, and no one has told them what to do. See <a href="${url(lang, "before-you-book/aftercare-after-turkey-teeth/")}">aftercare after Turkey teeth</a>.</p>

      <h2>What predicts a good outcome</h2>
      <p>Two things, and neither is price.</p>
      <p><strong>Who does the diagnosis, and when.</strong> If your treatment plan was produced from photographs you sent on WhatsApp, and it did not change after you arrived and were X-rayed, no diagnosis happened. A plan that changes slightly after in-person examination is a good sign, not a bad one. A plan quoted to the pound before anyone has looked inside your mouth is a price list, not a diagnosis.</p>
      <p><strong>Whether anything irreversible is proposed.</strong> Ask of every item on the plan: does this remove tooth structure? If yes, ask what the reversible alternative is and why it was rejected. A clinician who cannot answer that has not considered it.</p>

      <h2>Regulation — what exists and what does not</h2>
      <p>Türkiye's Ministry of Health operates an International Health Tourism Authorisation system: facilities treating international patients are required to hold a certificate, and authorised providers are listed on a public government directory you can search yourself. Individual dentists are licensed and listed via the national health authorities and the Turkish Dental Association. Implant and material brands used in Türkiye are subject to national medical device regulation.</p>
      <p>What does <strong>not</strong> exist: any regulator outside Türkiye covering your treatment. If you are a UK patient, the General Dental Council has no jurisdiction over a clinic in Istanbul, and the British Dental Association has publicly warned patients about the risks of dental tourism. That is a fair warning and you should factor it in. It does not mean treatment here is unsafe; it means your recourse if something goes wrong is governed by Turkish law and by whatever your clinic put in writing. Which is why <a href="${url(lang, "before-you-book/guarantee-and-what-happens-if-something-fails/")}">what the guarantee actually says</a> matters more here than it would at home.</p>

      <h2>How to check a specific clinic in about four minutes</h2>
      <ol>
        <li>Ask for the treating dentist's full name, dental faculty and graduation year — then find them independently, not on the clinic's own site.</li>
        <li>Search the clinic on the Ministry of Health authorised-provider directory and note whether it is listed.</li>
        <li>Ask which implant system and which ceramic, by brand and product name. Vague answers ("premium German implant") are a red flag.</li>
        <li>Ask for the written treatment plan, itemised, before paying anything.</li>
        <li>Ask what happens, and who pays, if a crown fails in month 14.</li>
      </ol>
      <p>Full method: <a href="${url(lang, "before-you-book/how-to-verify-a-turkish-dental-clinic/")}">how to verify a Turkish dental clinic</a>. The warning signs: <a href="${url(lang, "before-you-book/turkey-dentist-red-flags/")}">12 red flags</a>.</p>

      <h2>When we tell people not to come</h2>
      <p>Active untreated gum disease, uncontrolled diabetes or other unstable systemic conditions, heavy smoking with planned implants, a case that genuinely needs staged treatment over 6–12 months, or any case where the patient's real problem is dissatisfaction with an appearance that is within normal range. We have a page on this: <a href="${url(lang, "before-you-book/when-you-should-not-come-to-turkey/")}">when you should not come to Turkey</a>. We would rather you read it than book with us and regret it.</p>

      ${reviewerBylinePlaceholder}
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "Is Dental Treatment in Turkey Safe? An Istanbul Dentist Answers",
    description:
      "Straight answer from an Istanbul clinic: Turkey is not uniformly safe or unsafe — clinic selection is the variable. What actually goes wrong, and how to check.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Is dental treatment in Turkey safe?",
        description:
          "Straight answer from an Istanbul clinic: Turkey is not uniformly safe or unsafe — clinic selection is the variable. What actually goes wrong, and how to check.",
        about: { "@type": "MedicalProcedure", name: "Dental treatment abroad" },
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        mainEntityOfPage: site.domain + url(lang, "before-you-book/is-dental-treatment-in-turkey-safe/"),
      },
      faqSchema(faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookCheckQuotePage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "Check my Turkey dental quote", href: url(lang, "before-you-book/check-my-turkey-dental-quote/") },
  ];

  const faqs = [
    { q: "Is it really free?", a: "Yes. There is no charge and no obligation to book with us." },
    { q: "Will you review a quote from another Istanbul clinic?", a: "Yes — that is the main use. We also review Antalya, İzmir, Budapest and Albania quotes." },
    { q: "How long does it take?", a: "Within 48 hours on working days. Complex full-mouth cases may take longer; we will tell you if so." },
    { q: "Do you contact the other clinic?", a: "No. Nothing is shared with anyone. Your quote and images stay with the reviewing dentist." },
    {
      q: "What if you think I should not have the treatment at all?",
      a: `Then we will say that. See <a href="${url(lang, "before-you-book/when-you-should-not-come-to-turkey/")}">when you should not come to Turkey</a>.`,
    },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  // File input is visual only: the shared lead-form AJAX handler (site.js) JSON.stringifies
  // the form data, which silently drops File objects — there is no multipart upload backend
  // yet. Kept per explicit instruction; do not wire this up without a real upload endpoint.
  const form = `<div class="form-card">
    <form class="form-main" data-lead-form data-quote-check-form>
      <h3>Upload your quote</h3>
      <p style="font-size:14px;color:var(--muted-2);margin:0 0 24px;">Send us the quote you have been given and a dentist will write back within 48 hours.</p>
      <div class="form-stack">
        <div class="form-grid">
          <label><span class="lbl">Name</span><input type="text" name="name" required placeholder="Name"></label>
          <label><span class="lbl">Country</span><input type="text" name="country" required placeholder="Country"></label>
        </div>
        <label><span class="lbl">Email</span><input type="email" name="email" required placeholder="you@example.com"></label>
        <label><span class="lbl">Upload your quote / X-rays / photos</span><input type="file" name="attachments" multiple accept="image/*,.pdf"></label>
        <label><span class="lbl">Describe your situation</span><textarea name="message" rows="4" required placeholder="What clinic quoted you, what were you told, what is bothering you about the plan or price…"></textarea></label>
        <button type="submit" class="btn btn-primary btn-block" style="padding:16px;">Send for free review</button>
        <p style="font-size:11.5px;color:var(--muted-2);text-align:center;margin:2px 0 0;line-height:1.5;">Do not send your passport, ID or payment details.</p>
      </div>
    </form>
    <div class="form-success">
      <div style="width:74px;height:74px;border-radius:50%;background:var(--cream-2);display:flex;align-items:center;justify-content:center;margin:0 auto 22px;color:var(--gold);">${icons.check({ w: 38 })}</div>
      <h3 style="font-size:30px;">Thank you</h3>
      <p style="font-size:15.5px;line-height:1.6;color:var(--muted-2);margin:0 auto 26px;max-width:360px;">A dentist will review your quote and write back within 48 hours.</p>
      <a href="${waHref()}" class="btn btn-block" style="background:#25D366;color:#fff;" target="_blank" rel="noopener">${icons.wa} WhatsApp us</a>
    </div>
  </div>`;

  const body = `${pageHero(
    lang,
    "Before You Book",
    "Check my Turkey dental quote",
    "",
    crumbs
  )}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>Send us the quote you have been given — from any clinic, including ours — and a dentist at MediDent will read it and write back within 48 hours with a plain-English assessment. No cost, no obligation, and we will tell you if the quote you are holding is a good one.</p>
    </article>
  </div></section>
  <section class="section" style="padding-top:0;"><div class="container" style="max-width:560px;">${form}</div></section>
  <section class="section" style="padding-top:0;"><div class="container" style="max-width:820px;">
    <article class="prose">
      <h2>Why we do this</h2>
      <p>Because most of the quotes we see have the same three problems, and the patient has no way to know. We would rather have the conversation before you pay a deposit somewhere than after. And frankly: if reviewing our competitors' quotes honestly does not win us work, the model does not deserve to.</p>

      <h2>What we check, item by item</h2>
      <p><strong>1. Is the treatment proportionate to the problem?</strong> The commonest finding. A quote for 16–20 crowns where the presenting complaint was "my front teeth are discoloured and slightly crooked" is over-treatment. We will tell you what the conservative alternative would have been and roughly what it costs. See <a href="${url(lang, "before-you-book/crowns-vs-veneers-what-you-actually-need/")}">crowns vs veneers vs neither</a>.</p>
      <p><strong>2. Is anything irreversible, and was it justified?</strong> We flag every line item that permanently removes tooth structure or extracts a tooth that may be restorable.</p>
      <p><strong>3. Is the diagnosis missing?</strong> Gum treatment, root canals, extractions and bone grafting are the four things most often absent from a WhatsApp quote and most often added — at extra cost — once you are in the chair in Istanbul. If your quote has no periodontal assessment line, the number you have been given is provisional and you should treat it that way.</p>
      <p><strong>4. Are the materials named?</strong> Implant system by brand and line. Ceramic by brand and type (zirconia, e.max, monolithic vs layered). "Premium European implant" is not a material specification. Unnamed materials make like-for-like comparison impossible, which is usually the point.</p>
      <p><strong>5. What is not included?</strong> Typical omissions: temporary crowns, night guard, CBCT scan, sedation, the second trip's flights, hotel beyond a fixed number of nights, and revision costs. We list what is missing so you can ask them directly.</p>
      <p><strong>6. Is the timeline honest?</strong> We say whether the treatment can actually be delivered in the number of days quoted, or whether it needs a second trip that has not been mentioned.</p>
      <p><strong>7. Is the guarantee real?</strong> A guarantee that excludes the most likely failure modes, or that requires you to fly to Istanbul at your own cost to claim it, is a marketing line. We will tell you which one you have. See <a href="${url(lang, "before-you-book/guarantee-and-what-happens-if-something-fails/")}">guarantee and what happens if something fails</a>.</p>

      <h2>What you get back</h2>
      <p>A written response from a named dentist — not a sales message — containing:</p>
      <ul>
        <li>a line-by-line note on the quote you sent</li>
        <li>what we would have proposed instead, and why</li>
        <li>the questions to put back to that clinic, written out so you can copy them</li>
        <li>our own price for the treatment we think you actually need, only if you ask for it</li>
      </ul>
      <p>If your existing quote is sound, we will say so and tell you to go ahead with them. That happens more often than you would expect.</p>

      <h2>What we need from you</h2>
      <ul>
        <li>The written quote or treatment plan (photo or PDF is fine)</li>
        <li>Any X-rays or OPG you have — a panoramic radiograph makes the review far more useful</li>
        <li>Photos of your teeth: front, upper arch, lower arch, natural light</li>
        <li>One or two lines on what is actually bothering you</li>
      </ul>
      <p>Do not send us your passport, ID or payment details. We do not need them and we will not ask for them at this stage.</p>

      <h2>The honest limits of a remote review</h2>
      <p>This is a document review, not a diagnosis. Nobody — not us, not the clinic that quoted you — can diagnose from photographs. What we can do is tell you whether the reasoning on the page is sound, whether anything obvious is missing, and whether the price is inside the normal range. A definitive plan requires clinical examination and radiographs. Any clinic that tells you otherwise is the reason this page exists.</p>

      <!-- OPS NOTE: do not go live until the 48-hour SLA and the named reviewing dentist are operationally committed. This page's entire value is that the promise is kept. -->
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "Check My Turkey Dental Quote — Free Review by a Dentist",
    description:
      "Send us any Istanbul or Antalya clinic's quote. A dentist here reviews it and writes back in 48 hours: what's missing, what's over-treatment, what it should cost. Free.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Free dental quote review",
        serviceType: "Second opinion on a dental treatment quote",
        provider: { "@id": site.domain + "/#organization" },
        areaServed: ["GB", "IE", "DE", "US", "NL", "FR"],
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      },
      faqSchema(faqs.map((f) => ({ q: f.q, a: f.a.replace(/<[^>]+>/g, "") }))),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookRedFlagsPage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "Turkey dentist red flags", href: url(lang, "before-you-book/turkey-dentist-red-flags/") },
  ];

  const flags = [
    ["A fixed price before anyone has examined you", "A precise total quoted from three phone photos is a price list, not a treatment plan. Expect a range before examination and a final figure after radiographs."],
    ["The plan does not change after you arrive", "If nothing was learned from the X-rays, the X-rays were decorative."],
    ["Crowns proposed for a cosmetic complaint", `The biggest single red flag in this industry. Healthy teeth reduced for crowns because a patient wanted them whiter and straighter. Always ask what the reversible option was. <a href="${url(lang, "before-you-book/crowns-vs-veneers-what-you-actually-need/")}">More here</a>.`],
    ["Materials are not named", "\"German implant\", \"premium zirconia\". Ask for the brand, the product line, and the lot documentation you will be given on discharge."],
    ["You cannot find out who will treat you", `Not "our expert team" — a name, a registration, and a profile you can verify off their own website. <a href="${url(lang, "before-you-book/how-to-verify-a-turkish-dental-clinic/")}">How to check</a>.`],
    ["Pressure and expiring discounts", "\"This price is valid until Friday.\" Dentistry is not a flash sale. Any deadline attached to an irreversible medical decision is a sales technique."],
    ["Before-and-afters with no case detail", "Stock photography, or real cases with no treatment described, no timeline, no failures shown. A clinic with thousands of cases has some that needed revision. None of them ever show one."],
    ["No written treatment plan before the deposit", "If the document you are asked to pay against is a WhatsApp message, there is nothing to enforce later."],
    ["A guarantee with no document", `Ask for the warranty text before you pay. Read what it excludes and who pays travel. <a href="${url(lang, "before-you-book/guarantee-and-what-happens-if-something-fails/")}">What a real guarantee looks like</a>.`],
    ["Everything fits in your annual leave", "Some treatments genuinely need two trips. A clinic that has never once told a patient \"this needs a second visit\" is scheduling around flights."],
    ["No aftercare pathway", "Ask: who do I contact at 11 pm three months from now, in my time zone, and what documentation will my dentist at home receive? If there is no answer, there is no plan."],
    ["The clinic will not tell you about anyone it turned away", "Every honest clinic declines cases. If they cannot name a category of patient they refuse, they refuse none."],
  ];

  const faqs = [
    { q: "What is the single biggest warning sign?", a: "A large number of crowns proposed for a cosmetic complaint, quoted before examination." },
    { q: "Is a cheap price a red flag on its own?", a: "No. Cheap diagnosis is. Ask how long the examination appointment is and whether radiographs are included." },
    { q: "Should I avoid clinics that advertise on social media?", a: "No — but judge the clinical content, not the production quality of the reel." },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(lang, "Before You Book", "Turkey dentist red flags: 12 signs you should walk away", "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>Every clinic in Istanbul publishes a red-flags article. Almost all of them list flags their own clinic passes and omit the ones it does not. Here is the list we use, with our own answer against each one, so you can hold us to it.</p>

      ${flags.map(([h, p], i) => `<h3>${i + 1}. ${h}</h3>\n      <p>${p}</p>`).join("\n      ")}

      <h2>Flags that are not actually flags</h2>
      <p>Balance matters, so: a clinic being much cheaper than your home country is not in itself a red flag — that gap is labour, rent and currency. A clinic advertising heavily is not a red flag. A clinic having a hotel and transfer package is not a red flag. A dentist whose English is imperfect is not a red flag; a clinic that will not let you speak to the dentist at all is.</p>

      <h2>Use this on us</h2>
      <p>Number 12: cases we decline are listed on <a href="${url(lang, "before-you-book/when-you-should-not-come-to-turkey/")}">when you should not come to Turkey</a>. Numbers 1–4 and 8–9: send us a quote and we will apply all of them in writing — <a href="${url(lang, "before-you-book/check-my-turkey-dental-quote/")}">free quote review</a>.</p>
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "Turkey Dentist Red Flags: 12 Signs to Walk Away",
    description:
      "Twelve warning signs, from an Istanbul clinic — including the ones most \"red flag\" articles leave out because their own clinic would fail them.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Turkey dentist red flags: 12 signs you should walk away",
        description:
          "Twelve warning signs, from an Istanbul clinic — including the ones most \"red flag\" articles leave out because their own clinic would fail them.",
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        mainEntityOfPage: site.domain + url(lang, "before-you-book/turkey-dentist-red-flags/"),
      },
      faqSchema(faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookVerifyClinicPage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "How to verify a Turkish dental clinic", href: url(lang, "before-you-book/how-to-verify-a-turkish-dental-clinic/") },
  ];

  const steps = [
    {
      name: "Ministry of Health authorisation",
      text: `<p>Facilities in Türkiye that treat international patients are required to hold an International Health Tourism Authorisation certificate from the Ministry of Health, and authorised providers are published in a public government directory (<code>healthturkiye.gov.tr</code> → certified health service providers).</p>
      <p>Ask the clinic for its certificate number, then look the facility up in the directory yourself. A clinic that will not give you the number, or gives you a facilitator's certificate rather than the treating facility's, has answered your question.</p>`,
    },
    {
      name: "The dentist, not the brand",
      text: `<p>Clinic brands are marketing entities; the person who drills your teeth is a licensed individual. Ask for:</p>
      <ul>
        <li>full name as registered (Turkish spelling, with diacritics)</li>
        <li>dental faculty and year of graduation</li>
        <li>specialty training, if they are presented as a specialist</li>
        <li>membership of the provincial dental chamber</li>
      </ul>
      <p>Then verify off-site: the university's alumni or faculty listings, the dental chamber, PubMed or Google Scholar if they claim academic work, and LinkedIn for continuity of employment. What you are checking for is that the person exists, is qualified in the field they are presented in, and has been doing this for more than a year.</p>
      <p>A specific warning: AI-generated clinic websites in this sector have been caught publishing dentists who do not exist. If a name returns nothing anywhere except the clinic's own site and its own social accounts, treat that as disqualifying.</p>`,
    },
    {
      name: "The materials",
      text: `<p>Ask for the implant system by manufacturer and product line, and the ceramic by brand and type. Then check that the manufacturer actually distributes in Türkiye and that the product line exists. On discharge you should receive implant passport / lot labels — ask in advance whether you will.</p>
      <p>Why it matters practically: if an implant fails in five years, your dentist at home needs the system to obtain matching components. An unidentifiable implant can mean the whole restoration has to be redone rather than repaired.</p>`,
    },
    {
      name: "The premises",
      text: `<p>Ask for a live video call from the actual treatment room, unedited, before you pay. Sterilisation area, radiography equipment, the chair you will be in. Five minutes. Refusal is informative. Compare what you see with the photos on the website — a surprising number of sites use images of premises they do not occupy.</p>`,
    },
    {
      name: "Reviews, read properly",
      text: `<p>Ignore the star average. Read the one- and two-star reviews and, more importantly, read the clinic's replies to them. A clinic that responds to a complaint with a specific, factual account has a process. A clinic whose negative reviews all receive the same templated apology, or whose reviews are 400 five-stars posted in two months, does not. Look for reviews that mention a problem that was then fixed — those are the most informative reviews on any clinic page.</p>`,
    },
    {
      name: "The paperwork test",
      text: `<p>Before any deposit, ask for four documents in one email: the itemised treatment plan, the materials list, the total price with exclusions stated, and the guarantee text. A clinic that can produce all four within a day runs an organised practice. A clinic that produces none of them is asking you to pay against a conversation.</p>`,
    },
  ];

  const faqs = [
    { q: "Can I check a Turkish dentist's licence from abroad?", a: "Yes — registration is verifiable through Turkish dental chamber and health authority listings, and you can cross-check qualifications independently." },
    { q: "Is a JCI or ISO badge meaningful?", a: "ISO certificates are common and say little about clinical quality. Ministry of Health authorisation is the relevant one for international patients." },
    { q: "What if the clinic is really a facilitator agency?", a: "Then find out which facility actually treats you, and run every check above on that facility, not the agency." },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(lang, "Before You Book", "How to verify a Turkish dental clinic yourself", "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>Ten minutes of checking removes most of the risk in this decision. None of these steps require you to trust anything a clinic tells you.</p>
      ${steps.map((s, i) => `<h2>Step ${i + 1} — ${s.name}</h2>\n      ${s.text}`).join("\n      ")}
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "How to Verify a Turkish Dental Clinic (Step by Step)",
    description:
      "Check a Turkish clinic's Ministry of Health authorisation, the dentist's registration and the implant brand — independently, in under ten minutes. Including how to check us.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "How to verify a Turkish dental clinic yourself",
        description:
          "Check a Turkish clinic's Ministry of Health authorisation, the dentist's registration and the implant brand — independently, in under ten minutes.",
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        mainEntityOfPage: site.domain + url(lang, "before-you-book/how-to-verify-a-turkish-dental-clinic/"),
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to verify a Turkish dental clinic yourself",
        step: steps.map((s) => ({ "@type": "HowToStep", name: s.name, text: s.text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() })),
      },
      faqSchema(faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookSecondOpinionPage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "Dental treatment abroad: second opinion", href: url(lang, "before-you-book/dental-treatment-abroad-second-opinion/") },
  ];

  const faqs = [
    { q: "Do you charge?", a: "No." },
    { q: "Will you tell my current clinic?", a: "No. Nothing is shared." },
    { q: "Can I get a second opinion if I have already paid a deposit?", a: "Yes, and it is still worth doing. Deposits are usually much smaller than the cost of the wrong treatment." },
    {
      q: "Can you give a second opinion after treatment has been done?",
      a: `Yes — see <a href="${url(lang, "before-you-book/turkey-teeth-gone-wrong/")}">Turkey teeth gone wrong</a>.`,
    },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(lang, "Before You Book", "Getting a second opinion on dental treatment abroad", "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>A second opinion is normal in medicine and strangely rare in dentistry. It should not be. Most treatment plans in this field involve permanent removal of tooth structure, and most patients are shown exactly one plan before being asked for a deposit.</p>
      <p>We give written second opinions on any dental treatment plan, free, whether the first plan came from a Turkish clinic, a UK or German practice, or somewhere else entirely.</p>
      <p><strong><a href="${url(lang, "iletisim/")}">Request a second opinion →</a></strong> — or go straight to <a href="${url(lang, "before-you-book/check-my-turkey-dental-quote/")}">the quote check</a> if what you have is a price quote rather than a clinical plan.</p>

      <h2>When a second opinion is worth the two days it takes</h2>
      <ul>
        <li>The plan involves <strong>four or more crowns</strong> on teeth that are not broken or heavily filled</li>
        <li>Extraction of a tooth you were not told was failing</li>
        <li>Full-mouth rehabilitation, All-on-4 or All-on-6</li>
        <li>Bone grafting or sinus lift</li>
        <li>A plan that changed substantially and expensively after you arrived at a clinic</li>
        <li>Two clinics have given you plans that contradict each other</li>
        <li>You have been told you are "not a candidate" for something you wanted, and want to know if that is correct</li>
        <li>You simply do not understand what you have been quoted for — which is a good enough reason on its own</li>
      </ul>

      <h2>What a real second opinion contains</h2>
      <p>Not "this looks fine" or "come to us instead". A useful second opinion states:</p>
      <ol>
        <li><strong>The diagnosis it can and cannot confirm</strong> from the records provided.</li>
        <li><strong>Whether the proposed treatment follows from that diagnosis.</strong> This is the core of it. Most bad plans are not bad technique; they are treatment that does not follow from the findings.</li>
        <li><strong>The less invasive alternatives</strong>, and the specific reason each would or would not work in your case.</li>
        <li><strong>What is missing</strong> from the plan — untreated periodontal disease, an unaddressed root, no occlusal assessment, no discussion of the opposing arch.</li>
        <li><strong>Sequencing and realistic timeline.</strong></li>
        <li><strong>The questions to take back to the original clinic</strong>, written out.</li>
      </ol>
      <p>You can take that document straight back to your first clinic. That is a legitimate and good use of it, and it is what we expect most people to do.</p>

      <h2>What we need</h2>
      <p>Treatment plan or quote, any radiographs (a panoramic OPG or CBCT is far more useful than photographs), intraoral photos, and a short description of your symptoms and what you want to achieve. If you have records from your dentist at home, send those too — they usually contain the periodontal history that a tourism quote omits.</p>

      <h2>The limits</h2>
      <p>A remote second opinion is a review of records, not an examination. It cannot detect a cracked root, test tooth vitality, or measure pockets. What it can do is tell you whether the reasoning holds and whether something obvious is missing — which is enough to stop most of the bad decisions we see.</p>
      <p>We will also tell you when we think the original plan is right. If your dentist at home has recommended something and a tourism clinic has offered you something cheaper and more extensive, there is a reasonable chance your dentist at home was right, and we will say so.</p>
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "Second Opinion on Dental Treatment Abroad | MediDent İstanbul",
    description:
      "A written clinical second opinion on any treatment plan — from Turkey, your home dentist, or anywhere else. Reviewed by a named dentist, no obligation.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Free second opinion on a dental treatment plan",
        serviceType: "Second opinion on dental treatment",
        provider: { "@id": site.domain + "/#organization" },
        areaServed: ["GB", "IE", "DE", "US", "NL", "FR"],
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      },
      faqSchema(faqs.map((f) => ({ q: f.q, a: f.a.replace(/<[^>]+>/g, "") }))),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}


export function beforeYouBookAftercarePage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "Aftercare after Turkey teeth", href: url(lang, "before-you-book/aftercare-after-turkey-teeth/") },
  ];

  const faqs = [
    { q: "Will my NHS or German dentist see me after treatment in Turkey?", a: "Many will for maintenance and emergencies, fewer will take responsibility for the restorations themselves. Sending records in advance materially improves your chances." },
    { q: "How long do crowns from Turkey last?", a: "The same as crowns anywhere: material, bite control and gum health decide it, not the country. Night guard use and hygiene visits are the two variables you control." },
    { q: "Do I need to fly back for check-ups?", a: "Not usually. Annual radiographic review can be done locally and reviewed remotely." },
    { q: "What if a crown falls off?", a: "Keep it, do not glue it, and see any local dentist for recementation — it is a routine procedure." },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(lang, "Before You Book", "Aftercare after Turkey teeth", "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>This is the part of dental tourism that is planned last and matters most. Treatment takes a week. Aftercare takes the rest of your life, and it happens 3,000 km from the clinic that did the work.</p>
      <p>Plan it <strong>before</strong> you book the flight. Here is the whole protocol.</p>

      <h2>Before you fly home — what you must leave with</h2>
      <p>Do not board the plane without these. Getting them later is much harder.</p>
      <ul>
        <li><strong>Full written treatment record</strong>: every tooth treated, by number, and what was done to it</li>
        <li><strong>Implant passport / lot labels</strong> — brand, product line, diameter, length, position</li>
        <li><strong>Ceramic specification</strong>: material, brand, lab name</li>
        <li><strong>Post-op radiographs</strong> (digital files, not photographs of a screen)</li>
        <li><strong>Before and after clinical photographs</strong></li>
        <li><strong>The written guarantee</strong>, with its claims procedure</li>
        <li><strong>A named contact and a working phone number</strong>, plus stated response times</li>
        <li><strong>A one-page clinical summary addressed to your dentist at home</strong> — ask for this explicitly; most clinics will produce it and almost no patient asks</li>
      </ul>

      <h2>First 72 hours</h2>
      <p>Expect swelling that peaks around day two, and bruising if you had surgery. Ice on, twenty minutes at a time, for the first day; nothing hot. Sleep with your head elevated. Soft diet. No smoking — genuinely, not "as little as possible" — if implants or grafts were placed; smoking is the largest controllable risk factor for early implant failure. Take the prescribed antibiotics to completion.</p>
      <p><strong>Flying:</strong> cabin pressure is not a problem for crowns or implants, but do not fly within 24 hours of sedation or a sinus lift without your surgeon's clearance. Carry the medication and the clinical summary in hand luggage, not the hold.</p>
      <p><strong>Contact the clinic immediately if:</strong> bleeding that does not stop with 20 minutes of pressure, swelling that increases after day three, fever, numbness that persists past the expected period, or a temporary crown that comes off before you have flown.</p>

      <h2>Weeks 1–6</h2>
      <ul>
        <li><strong>Temporary crowns</strong>: avoid anything sticky or hard. If one debonds, keep it, and call the clinic before improvising — temporary cement from a pharmacy is acceptable for a few days, superglue never is.</li>
        <li><strong>Sutures</strong> typically dissolve or are removed at 7–10 days; agree before you leave whether the clinic, a local dentist, or nobody needs to do this.</li>
        <li><strong>Gum contour changes</strong> as tissue settles. Slight aesthetic differences at week one are normal and are not a reason to panic.</li>
        <li><strong>Bite check</strong>: if the bite feels high, or one tooth touches first, that is not something to live with. High occlusion causes crown fracture and joint pain. Report it immediately; it is a ten-minute adjustment that any dentist can do.</li>
      </ul>

      <h2>Months 2–12</h2>
      <ul>
        <li>Wear the <strong>night guard</strong>. If you were not given one and you have a full-arch or multi-unit ceramic restoration, ask why not. Bruxism is the commonest cause of ceramic fracture, and it is the cheapest problem in this entire field to prevent.</li>
        <li><strong>Hygiene visit at 3–6 months</strong>, locally. Restored teeth do not get less gum disease; they get more, because margins are harder to clean.</li>
        <li><strong>Interdental cleaning is mandatory</strong>, not optional, around crown margins and implants. Superfloss or interdental brushes, daily.</li>
        <li><strong>Radiographic review at 12 months</strong> for implants, locally, comparing bone levels to the post-op films you brought home.</li>
      </ul>

      <h2>What if your dentist at home will not see you?</h2>
      <p>This is common enough that you should plan for it, and it is worth understanding why it happens: a dentist at home takes on clinical and medico-legal responsibility for work they did not do, cannot inspect the preparation under the crown, and often cannot identify the implant system. It is rarely spite. It is risk.</p>
      <p>What works:</p>
      <ol>
        <li><strong>Send the records ahead of the appointment</strong>, not on the day. A dentist who has seen the implant passport and post-op radiographs is far more likely to accept you.</li>
        <li><strong>Ask for maintenance, not adoption.</strong> "I am not asking you to guarantee this work — I am asking for hygiene care and monitoring, and I understand I'll be referred if something needs redoing." That sentence changes the conversation.</li>
        <li><strong>Hygienist-led practices and independent hygienists</strong> will almost always take you for maintenance.</li>
        <li><strong>For emergencies</strong>, any dentist will treat pain and infection. Recementing a crown is routine.</li>
        <li><strong>If nobody will take you</strong>, say so to us and we will identify what care you actually need and arrange it, including remote review of local radiographs.</li>
      </ol>

      <h2>What we commit to</h2>
      <ul>
        <li>Written aftercare protocol issued to every patient on discharge, plus the summary letter for your dentist at home</li>
        <!-- OPS NOTE: pending clinic-confirmed commitment periods before these can go live —
             "A named contact reachable in your time zone for {{period}}"
             "Free remote review of any problem, with radiographs, for {{period}}" -->
        <li>Revision terms stated in advance: <a href="${url(lang, "before-you-book/guarantee-and-what-happens-if-something-fails/")}">guarantee</a></li>
      </ul>
      <p>If something has already failed: <a href="${url(lang, "before-you-book/turkey-teeth-gone-wrong/")}">Turkey teeth gone wrong</a>.</p>
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "Aftercare After Turkey Teeth: The Full Protocol",
    description:
      "What to do in the first 72 hours, the first year and every year after — plus what to do if your dentist at home refuses to see you. Written by an Istanbul clinic.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Aftercare after Turkey teeth",
        description:
          "What to do in the first 72 hours, the first year and every year after — plus what to do if your dentist at home refuses to see you.",
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        mainEntityOfPage: site.domain + url(lang, "before-you-book/aftercare-after-turkey-teeth/"),
      },
      faqSchema(faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookGoneWrongPage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "Turkey teeth gone wrong", href: url(lang, "before-you-book/turkey-teeth-gone-wrong/") },
  ];

  const faqs = [
    { q: "Can Turkey teeth be reversed?", a: "Removed enamel cannot be restored. Crowns can be replaced with better-fitting ones; the tooth underneath stays as it is." },
    { q: "How much does it cost to fix?", a: "It varies with what failed and what is underneath — it is consistently more than the original treatment. An assessment gives a real figure; a remote estimate does not." },
    { q: "Should I go back to the same clinic?", a: "If they will honour their guarantee and you still have confidence in their diagnosis, yes. Get an independent opinion first." },
    {
      q: "Is this common?",
      a: `Bad outcomes are a minority of cases and are concentrated in a recognisable type of clinic. <a href="${url(lang, "before-you-book/turkey-dentist-red-flags/")}">The red flags</a> describe that type.`,
    },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(lang, "Before You Book", "Turkey teeth gone wrong: what actually fails", "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>"Turkey teeth" became a media story because of a specific, real and avoidable pattern: healthy teeth reduced to pegs for crowns, in patients who wanted a cosmetic change. The coverage was often unfair to Turkish dentistry as a whole and entirely fair about that pattern. Both things are true.</p>
      <p>Here is what we see, ranked by how often it arrives at our clinic for revision, and what can actually be done about each.</p>

      <h2>1. Over-preparation — healthy teeth crowned unnecessarily</h2>
      <p><strong>What happened:</strong> enamel removed from sound teeth to fit crowns, usually 8–20 units, for an aesthetic complaint. Often the teeth were also devitalised (root-treated) to make them easier to prepare.</p>
      <p><strong>Can it be fixed?</strong> The crowns can be replaced with better ones. The tooth structure cannot be replaced, ever. This is why this failure is the serious one: the patient is committed to crowns for life, with a replacement cycle every 10–15 years, and each cycle removes a little more.</p>
      <p><strong>What we can do:</strong> replace poorly fitting crowns, treat the gum inflammation caused by bad margins, and manage the teeth long-term. We cannot undo it, and anyone who says they can is lying.</p>
      <p><strong>Prevention</strong> is the whole point of <a href="${url(lang, "before-you-book/crowns-vs-veneers-what-you-actually-need/")}">crowns vs veneers vs neither</a>.</p>

      <h2>2. Marginal failure and gum inflammation</h2>
      <p><strong>What happened:</strong> crown margins that do not fit the tooth, or sit too far under the gum. Result: persistent bleeding, bad odour, a dark line, and decay under the crown.</p>
      <p><strong>Can it be fixed?</strong> Usually yes. The crowns are remade with correct margins, after any decay is treated. Outcome is generally good if the underlying tooth is still sound.</p>

      <h2>3. Untreated disease under new restorations</h2>
      <p><strong>What happened:</strong> crowns or implants placed over untreated periodontal disease or an undiagnosed apical infection. Looks perfect on discharge day, fails at 6–24 months.</p>
      <p><strong>Can it be fixed?</strong> Yes, but in the right order: treat the disease first, stabilise, then re-restore. It takes months, not a week — which is precisely why it was skipped the first time. Patients often find this the hardest part to accept.</p>

      <h2>4. Implant failure or malposition</h2>
      <p><strong>What happened:</strong> implants that did not integrate, were placed in insufficient bone, or were angled so that a restoration could only be made by compromising it.</p>
      <p><strong>Can it be fixed?</strong> Failed implants are removed; the site usually needs grafting and 4–6 months of healing before a new implant. Malpositioned but integrated implants are sometimes restorable, sometimes must be removed. This is the most expensive category to correct.</p>
      <p><strong>Critical practical point:</strong> bring the implant passport. If the system is unknown, replacement components cannot be ordered and otherwise repairable cases have to be completely redone.</p>

      <h2>5. Bite and joint problems</h2>
      <p><strong>What happened:</strong> the full-mouth restoration changed the vertical dimension or the way the teeth meet. Symptoms: jaw pain, headaches, teeth that touch unevenly, ceramic that keeps chipping.</p>
      <p><strong>Can it be fixed?</strong> Often yes, with occlusal adjustment or a splint; sometimes it needs the restorations remade. Diagnosis has to come first — chipping is a symptom, not the disease.</p>

      <h2>6. Aesthetic failure</h2>
      <p><strong>What happened:</strong> teeth that are too white, too long, too uniform, or that do not match the face. Technically sound, cosmetically wrong.</p>
      <p><strong>Can it be fixed?</strong> Yes — remake the ceramics with a proper trial (mock-up worn before anything is finalised). This is the least serious category and the most distressing to live with.</p>

      <h2>What revision realistically involves</h2>
      <ul>
        <li><strong>Assessment first.</strong> Radiographs, periodontal charting, vitality testing, occlusal analysis. Anyone quoting revision without these is repeating the original mistake.</li>
        <li><strong>Usually two visits.</strong> Disease treatment and healing cannot be compressed.</li>
        <li><strong>It costs more than the original.</strong> Removing existing work, treating what is underneath and rebuilding is more work than doing it properly once.</li>
        <li><strong>Sometimes the answer is to do nothing yet.</strong> Crowns that are functional but aesthetically imperfect on recently devitalised teeth are often better monitored than immediately replaced.</li>
      </ul>
      <p>We will tell you which of these applies to you before you travel — send records to the <a href="${url(lang, "before-you-book/dental-treatment-abroad-second-opinion/")}">second opinion</a> page.</p>

      <h2>Where you stand</h2>
      <p>If the original clinic is still operating, start there: the guarantee, if there is one, is theirs to honour. Keep everything in writing. If they refuse, are unreachable, or you have lost confidence in them, get an independent assessment before spending anything further.</p>
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "Turkey Teeth Gone Wrong: What Fails and What Can Be Fixed",
    description:
      "An Istanbul clinic on what actually goes wrong with dental work in Turkey, what is repairable, what is not, and what revision realistically costs.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Turkey teeth gone wrong: what actually fails",
        description:
          "An Istanbul clinic on what actually goes wrong with dental work in Turkey, what is repairable, what is not, and what revision realistically costs.",
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        mainEntityOfPage: site.domain + url(lang, "before-you-book/turkey-teeth-gone-wrong/"),
      },
      faqSchema(faqs.map((f) => ({ q: f.q, a: f.a.replace(/<[^>]+>/g, "") }))),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookCrownsVsVeneersPage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "Crowns, veneers or neither?", href: url(lang, "before-you-book/crowns-vs-veneers-what-you-actually-need/") },
  ];

  const faqs = [
    { q: "How much tooth is removed for a crown?", a: "Substantially more than for a veneer — commonly 1.5–2 mm on all surfaces, compared with roughly 0.3–0.7 mm on the front surface for a veneer. Exact figures depend on the tooth and the material." },
    { q: "Do veneers ruin your teeth?", a: "They are irreversible but conservative. The problem the press called \"Turkey teeth\" is crowns, not veneers." },
    { q: "Do teeth need root canals before crowns?", a: "Only if the pulp is diseased or the preparation exposes it. Routine devitalisation of healthy teeth to simplify crown preparation is not justifiable." },
    { q: "Can I have crooked teeth fixed without braces?", a: "Visually, yes, with crowns — at the cost of permanent tooth reduction. Whether that trade is worth it is your decision, and you should be given it explicitly." },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(lang, "Before You Book", "Crowns, veneers, or neither?", "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>If you came to this page because a clinic quoted you 16 or 20 crowns and something felt wrong, your instinct is probably correct. Read this before you agree to anything.</p>

      <h2>The ladder — always start at the bottom</h2>
      <p>Dental treatment for appearance has a ladder, from reversible to irreversible. Good practice starts at the lowest rung that solves the problem.</p>
      <p><strong>1. Hygiene and whitening — fully reversible, removes nothing.</strong> Discoloured teeth that are otherwise sound. Professional cleaning and whitening change shade with no loss of tooth structure. Many people quoted for 20 crowns needed this.</p>
      <p><strong>2. Composite bonding — minimal or no reduction, repairable, reversible in most cases.</strong> Chips, small gaps, worn edges, mild shape corrections. Can be repaired chairside and removed later. Lasts 5–8 years and is then redone — a real limitation, but the teeth underneath stay intact.</p>
      <p><strong>3. Aligners / orthodontics — removes nothing.</strong> Crooked teeth. Takes 6–18 months, which is why tourism clinics rarely propose it: it does not fit in a week. <strong>Straightening crooked teeth with crowns instead of orthodontics is the defining over-treatment of this industry.</strong> It converts a temporary problem into a permanent dependency.</p>
      <p><strong>4. Veneers — irreversible, but conservative.</strong> Thin ceramic bonded to the front surface. Typically 0.3–0.7 mm of enamel is reduced; some cases are no-prep. Appropriate when shape and colour need changing on teeth that are structurally sound. Once done, you cannot go back.</p>
      <p><strong>5. Crowns — irreversible, significant.</strong> The tooth is reduced on all surfaces, often 1.5–2 mm, sometimes 60–70% of the visible crown. <strong>Legitimate</strong> for heavily filled teeth, root-treated teeth, fractured teeth, severe wear, or teeth that need substantial structural support. <strong>Not legitimate</strong> for a sound tooth that is simply the wrong colour or slightly rotated.</p>

      <h2>Why crowns get proposed anyway</h2>
      <p>Not always malice. Crowns are faster than orthodontics, more predictable to fit in a one-week trip, easier to deliver in volume, produce an immediately dramatic before/after photo, and pay more per unit. A model built on a seven-day trip has a structural incentive towards the treatment that fits in seven days. That is a reason to be sceptical of any plan that fits your annual leave perfectly.</p>

      <h2>The questions that settle it</h2>
      <p>Ask these of any clinic, including us, and get the answers in writing:</p>
      <ol>
        <li>"How much tooth structure will be removed from each tooth, in millimetres?"</li>
        <li>"Which of these teeth are sound, and which are already heavily filled or root-treated?"</li>
        <li>"What would you do if I refused crowns entirely — what is the best result achievable without them?"</li>
        <li>"Why is orthodontics not appropriate in my case?"</li>
        <li>"Will any teeth be root-treated, and is that because they need it or to make preparation easier?"</li>
        <li>"Can I see a mock-up or trial smile before anything irreversible is done?"</li>
      </ol>
      <p>Question 6 is the practical safeguard: a wax-up or digital design tried in your mouth, before preparation. If a clinic will not do a trial, they are asking you to approve the result after it becomes permanent.</p>

      <h2>What we actually propose, and how often</h2>
      <p>We quote whitening and bonding more often than veneers, and veneers more often than full crowns, because that is what the diagnoses require. We do place crowns — on teeth that need them. If your case needs orthodontics first, we will tell you, and it will mean a longer timeline and two trips.</p>
      <p>Send us your plan and we will tell you exactly which rung of the ladder it sits on and whether it needed to: <a href="${url(lang, "before-you-book/check-my-turkey-dental-quote/")}">free quote review</a>.</p>
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "Crowns, Veneers or Neither? What You Actually Need",
    description:
      "The most common over-treatment in dental tourism is crowns on healthy teeth. How to tell what your case needs, and what to ask before anything is filed down.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Crowns, veneers, or neither?",
        description:
          "The most common over-treatment in dental tourism is crowns on healthy teeth. How to tell what your case needs, and what to ask before anything is filed down.",
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        mainEntityOfPage: site.domain + url(lang, "before-you-book/crowns-vs-veneers-what-you-actually-need/"),
      },
      faqSchema(faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookGuaranteePage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "Guarantee and what happens if something fails", href: url(lang, "before-you-book/guarantee-and-what-happens-if-something-fails/") },
  ];

  const faqs = [
    { q: "Are Turkish dental guarantees enforceable?", a: "They are contracts under Turkish law. Their practical value depends on how specific they are and whether the clinic still exists. A written, itemised document is worth considerably more than a verbal promise." },
    { q: "Does the guarantee cover flights back?", a: "Usually not — check before you book, because this is what determines whether you can actually use it." },
    { q: "What voids a dental guarantee?", a: "Commonly trauma, smoking after implants, missed recall visits, not wearing a prescribed night guard, and poor oral hygiene." },
    { q: "What if the clinic closes?", a: "You have no remedy against a closed business. Clinic longevity is a reasonable thing to weigh." },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  // OPS NOTE: the source draft's "Our terms" table + travel/claim-process copy is marked
  // TASLAK (draft) in the delivered content and explicitly requires legal review + Enes's
  // sign-off before anything is stated as a real commitment ("Kliniğin fiilen ödemeyeceği
  // hiçbir şart burada yazmamalı"). Kept out of the live page — wrapped below — until that
  // approval happens. The surrounding educational content (how to read a guarantee, what
  // "lifetime" means) does not make any clinic-specific commitment and is safe to publish.
  const draftTermsSection = `
  <!-- OPS NOTE: DRAFT — needs legal review + Enes's approval before publishing as a real
       commitment. Source: content/before-you-book/pages/09-guarantee.md, "Our terms" table.
  <h2>Our terms</h2>
  <table>
    <thead><tr><th>Item</th><th>Period</th><th>Covered</th><th>Not covered</th></tr></thead>
    <tbody>
      <tr><td>Implant fixture</td><td>10 years</td><td>Failure to integrate or loss of the fixture: replacement fixture and the surgery to place it, at no charge</td><td>Failure caused by smoking, uncontrolled systemic disease, trauma, or missed recall visits</td></tr>
      <tr><td>Implant-supported crown or bridge</td><td>5 years</td><td>Fracture, debonding, or loss of fit not caused by trauma: remake at no charge</td><td>Trauma, bruxism where a prescribed night guard was not worn, poor hygiene</td></tr>
      <tr><td>Zirconia crown</td><td>5 years</td><td>Fracture or ceramic failure under normal function: remake at no charge</td><td>Trauma, bruxism without night guard, decay at the margin from poor hygiene</td></tr>
      <tr><td>E.max crown / veneer</td><td>3 years</td><td>Fracture or debonding under normal function: remake at no charge</td><td>Trauma, bruxism without night guard, biting non-food objects</td></tr>
      <tr><td>Composite bonding</td><td>1 year</td><td>Chipping or debonding under normal function: repair at no charge</td><td>Normal wear and staining, which are expected and are repaired as routine maintenance</td></tr>
      <tr><td>Removable prosthesis</td><td>2 years</td><td>Fracture of the base or teeth under normal function</td><td>Relines and adjustments required by normal bone resorption</td></tr>
    </tbody>
  </table>
  Conditions required: hygiene visit every 6 months (with receipt/record), night guard worn where
  prescribed, one radiographic review per year for implant cases (sent for remote review), no
  smoking for 3 months after implant surgery.
  Travel: revision treatment itself free within the periods above; flights/accommodation to
  receive it are {{onayla — öneri: revizyon için gelen hastaya konaklama ve havaalanı transferi
  klinik tarafından karşılanır; uçuş hastaya ait}}.
  Claim process: email {{aftercare e-posta adresi}} with photographs and, where relevant, a
  recent radiograph from your local dentist; response within 3 working days; remote assessment
  first; decision in writing.
  -->`;

  const body = `${pageHero(lang, "Before You Book", "The guarantee — what it covers, and who pays", "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>"Lifetime guarantee" appears on a great many Turkish clinic websites. Read the document behind the phrase and it frequently excludes the things that actually fail, or requires you to fund your own return trip to claim it. A guarantee you cannot afford to use is marketing.</p>
      <p>Here is how to read one, and what ours says.</p>

      <h2>The eight questions that expose a weak guarantee</h2>
      <p><strong>1. What exactly is covered — the ceramic, the implant fixture, or the whole restoration?</strong> Many guarantees cover only the implant fixture (which rarely fails) and not the crown on top of it (which is what actually breaks). Manufacturer implant warranties typically replace the component only, not the surgery or the restoration.</p>
      <p><strong>2. How long, per item?</strong> Implants, crowns, veneers, bridges and dentures usually carry different periods. A single "lifetime" number covering all of them is a sign nobody has read it.</p>
      <p><strong>3. Who pays for the revision treatment?</strong></p>
      <p><strong>4. Who pays for flights and accommodation to receive it?</strong> This is the question that decides whether the guarantee is usable. If the answer is "the patient", a £300 crown remake costs you £700.</p>
      <p><strong>5. What voids it?</strong> Standard and reasonable exclusions: trauma, not wearing the night guard, missing recall appointments, smoking after implant placement, poor hygiene. Unreasonable: any exclusion so broad that the clinic can always invoke it.</p>
      <p><strong>6. What evidence must you supply?</strong> Typically proof of hygiene visits and recalls. Know this before you fly home, not after — you cannot retrospectively produce a year of records.</p>
      <p><strong>7. How is a claim made, and in what timeframe must they respond?</strong></p>
      <p><strong>8. Is the treatment covered by a third-party medical malpractice insurance, and in which jurisdiction can you bring a claim?</strong> Turkish clinics operate under Turkish law. Ask, and get the answer in writing.</p>

      <h2>What "lifetime" actually means</h2>
      <p>Nothing in dentistry lasts a lifetime. Crowns and veneers have a normal service life, after which they are replaced; implants can integrate for decades but their restorations do not. A clinic promising a lifetime guarantee on ceramics is either redefining "lifetime" in the small print or has not thought about it. Be more reassured by a clinic that says "five years, here is precisely what that includes" than by one that says "forever" and hands you nothing to read.</p>
      ${draftTermsSection}
      <h2>If a clinic will not give you the document</h2>
      <p>Then the guarantee does not exist in any enforceable form. This is item 9 of <a href="${url(lang, "before-you-book/turkey-dentist-red-flags/")}">the red flags</a>, and it is one of the few that should end the conversation on its own.</p>
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "Dental Guarantee in Turkey: What It Covers and Who Pays",
    description:
      "Most Turkish dental guarantees exclude the failures most likely to happen. How to read one, what to demand in writing, and what ours actually says.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "The guarantee — what it covers, and who pays",
        description:
          "Most Turkish dental guarantees exclude the failures most likely to happen. How to read one, what to demand in writing, and what ours actually says.",
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        mainEntityOfPage: site.domain + url(lang, "before-you-book/guarantee-and-what-happens-if-something-fails/"),
      },
      faqSchema(faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookQuestionsPage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "21 questions to ask before you pay a deposit", href: url(lang, "before-you-book/questions-to-ask-before-you-pay-a-deposit/") },
  ];

  const groups = [
    {
      name: "Diagnosis",
      items: [
        "What is your diagnosis, and what did you base it on?",
        "Will you need X-rays before finalising the plan, and does the plan change if they show something different? (Expect: yes, and yes.)",
        "Which of my teeth are healthy, and which are already compromised?",
        "What is causing the problem I came to you with? (A plan that treats appearance without naming a cause is a shopping list.)",
      ],
    },
    {
      name: "The treatment itself",
      items: [
        "How much tooth structure will be removed, per tooth, in millimetres?",
        "What is the least invasive option that would give an acceptable result, and why have you not recommended it?",
        "Will any teeth be root-treated or extracted? Why?",
        "What is the alternative if I refuse crowns?",
        "Will I see a trial smile or mock-up before anything irreversible is done?",
      ],
    },
    {
      name: "People",
      items: [
        "Which dentist will treat me — full name and registration?",
        "What is their specialty and how long have they practised it?",
        "Will one dentist do all of it, or several? Who does the surgery, who does the prosthetics?",
        "Can I speak to the treating dentist directly before I book? (Refusal here is disqualifying.)",
      ],
    },
    {
      name: "Materials",
      items: [
        "Which implant system — manufacturer and product line?",
        "Which ceramic — brand, type, and which lab?",
        "Will I receive implant passports and lot documentation on discharge?",
      ],
    },
    {
      name: "Money",
      items: [
        "Please send the itemised plan with the total, and list explicitly what is not included.",
        "What are the most common additional costs that arise after arrival, and how much are they?",
        "What is the deposit, is it refundable, and under what conditions?",
      ],
    },
    {
      name: "Afterwards",
      items: [
        "Send me the guarantee document. Who pays for revision treatment, and who pays for travel to receive it?",
        "What is the aftercare protocol, who do I contact from my country, and what will my dentist at home receive?",
      ],
    },
  ];
  const questions = groups.flatMap((g) => g.items);

  const faqs = [
    { q: "What if a clinic refuses to answer some of these?", a: "Note which ones. The pattern of refusals usually maps exactly to where the weakness is." },
    { q: "Is it rude to send 21 questions?", a: "No. It is a permanent medical decision involving a few thousand pounds and an international flight." },
    { q: "Which question matters most?", a: "Number 6 — the least invasive option, and why it was rejected." },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  let counter = 0;
  const groupHtml = groups
    .map(
      (g) => `<h2>${g.name}</h2>
      <ol start="${counter + 1}">
        ${g.items.map((it) => { counter += 1; return `<li>${it}</li>`; }).join("\n        ")}
      </ol>`
    )
    .join("\n      ");

  const body = `${pageHero(lang, "Before You Book", "21 questions to ask before you pay a deposit", "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>Copy these into the chat window. Send all of them at once — how a clinic handles a long list of direct questions tells you as much as the answers do. A good clinic answers in a day. A sales operation answers the easy ones and ignores the rest.</p>
      ${groupHtml}

      <h2>How to read the answers</h2>
      <ul>
        <li><strong>Speed matters less than specificity.</strong> "Straumann BLX, 4.1 × 10 mm" is an answer. "Premium Swiss implant" is not.</li>
        <li><strong>A clinic that says "we'll confirm after the X-rays"</strong> is being careful, not evasive. That is a good sign.</li>
        <li><strong>Any question ignored twice</strong> has been answered.</li>
        <li><strong>Discomfort at question 6 or 8</strong> is the most informative reaction on this list. A clinician confident in their plan explains why the conservative option falls short. A salesperson gets defensive.</li>
      </ul>

      <h2>Ask us</h2>
      <p>We will answer all 21 in writing before you pay anything. So should anyone else. <a href="${url(lang, "before-you-book/check-my-turkey-dental-quote/")}">Send them with your quote →</a></p>
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "21 Questions to Ask Before You Pay a Dental Deposit in Turkey",
    description:
      "A printable list of the questions that separate a clinic from a sales operation — with the answers you should expect. Ask us the same ones.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "21 questions to ask before you pay a deposit",
        description:
          "A printable list of the questions that separate a clinic from a sales operation — with the answers you should expect. Ask us the same ones.",
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        mainEntityOfPage: site.domain + url(lang, "before-you-book/questions-to-ask-before-you-pay-a-deposit/"),
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "21 questions to ask before you pay a dental deposit in Turkey",
        step: questions.map((q) => ({ "@type": "HowToStep", text: q })),
      },
      faqSchema(faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}

export function beforeYouBookWhenNotToComePage(lang) {
  const crumbs = [
    crumbHome(lang),
    beforeYouBookCrumb(lang),
    { name: "When you should not come to Turkey", href: url(lang, "before-you-book/when-you-should-not-come-to-turkey/") },
  ];

  const faqs = [
    { q: "Do you turn patients away?", a: "Yes — the categories above." },
    { q: "Can I come later if I fix the problem?", a: "In most cases yes. Treated gum disease, controlled diabetes and stopping smoking all change the answer." },
    { q: "Is dental tourism worth it for one crown?", a: "Generally no, once travel is counted." },
  ];
  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`;

  const body = `${pageHero(lang, "Before You Book", "When you should not come to Turkey for dental treatment", "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container" style="max-width:820px;">
    <article class="prose">
      <p>We run a dental clinic in Istanbul and we are about to spend a page telling you not to come. Not as a technique — these are the cases where travelling produces worse outcomes than treatment at home, and we decline them.</p>

      <h2>1. You have active gum disease that has not been treated</h2>
      <p>Restorations placed on an unstable periodontal foundation fail, regardless of how good the ceramics are. Periodontal treatment takes months of staged care and re-evaluation. That is not a trip; it is a relationship with a local clinician. Treat it at home. Come afterwards, if you still want to.</p>

      <h2>2. Your case genuinely needs 6–12 months of staged treatment</h2>
      <p>Orthodontics before restoration. Grafting that needs healing before implants. Full-mouth rehabilitation with progressive changes to the bite. These can be done with two or three trips, but if your budget or leave allows only one, you will be offered a compressed version — and the compressed version is how bad outcomes happen.</p>

      <h2>3. You have an unstable medical condition</h2>
      <p>Uncontrolled diabetes, recent cardiac events, bisphosphonate or antiresorptive therapy, immunosuppression, active cancer treatment, or any condition requiring close medical supervision. Surgery abroad puts distance between you and the physician who manages you. Some of these are absolute contraindications for implants; all of them need your own doctor's involvement, not a phone call from another country.</p>

      <h2>4. You smoke heavily and want implants</h2>
      <p>Smoking substantially raises early implant failure and peri-implantitis risk. If you are not going to stop around the surgical period, spend the money on something that does not depend on bone healing. We would rather say this now than remove a failed implant later.</p>

      <h2>5. Your real problem is not your teeth</h2>
      <p>Some patients arrive with teeth within normal aesthetic range and a conviction that something is deeply wrong with them. Irreversible cosmetic dentistry does not resolve that, and repeated treatment tends to make it worse. If you have had several cosmetic procedures and none has felt right, please do not have another one until you have talked it through with someone who is not selling you anything.</p>

      <h2>6. You cannot arrange aftercare at home</h2>
      <p>If you have no dentist, cannot get one, and cannot travel back, you are acquiring restorations you cannot maintain. Sort the maintenance first — <a href="${url(lang, "before-you-book/aftercare-after-turkey-teeth/")}">the aftercare page</a> explains what is needed and how to arrange it.</p>

      <h2>7. You cannot afford the revision</h2>
      <p>Budget for your case going imperfectly. Revision, a second trip, an unexpected root canal. If the quoted price is the absolute maximum you can spend and there is nothing behind it, the financial risk is higher than the clinical one.</p>

      <h2>8. You are being rushed — by a clinic or by yourself</h2>
      <p>A discount expiring on Friday, a flight already booked, a wedding in six weeks. Permanent decisions made against a deadline are the ones people regret. The price will be approximately the same next quarter.</p>

      <h2>9. Your treatment is straightforward and cheap at home</h2>
      <p>A single crown, one filling, a scale and polish. Once you add flights and hotel, there is no saving and you have introduced distance into your aftercare for no reason. Dental tourism makes sense for multi-unit and complex work. For small treatment, it does not.</p>

      <h2>If none of these apply to you</h2>
      <p>Then Turkey is a reasonable option and the question becomes which clinic, not which country. Start with <a href="${url(lang, "before-you-book/turkey-dentist-red-flags/")}">the red flags</a>, <a href="${url(lang, "before-you-book/how-to-verify-a-turkish-dental-clinic/")}">how to verify a clinic</a>, and send us whatever quote you are holding — <a href="${url(lang, "before-you-book/check-my-turkey-dental-quote/")}">we will review it free</a>.</p>

      <h2>And if one of these does apply</h2>
      <p>Tell us anyway. We will say so plainly and, where we can, tell you what to ask for at home. We would rather lose the booking than take it.</p>
    </article>
  </div></section>
  <section class="section section-alt"><div class="container" style="max-width:820px;">
    <h2 style="font-size:24px;margin:0 0 20px;">${faqHeading[lang] || faqHeading.en}</h2>
    <div class="faq" data-reveal>${faqs.map(faqItem).join("")}</div>
  </div></section>
  ${contactSection(lang)}`;

  return {
    body,
    title: "When You Should NOT Come to Turkey for Dental Treatment",
    description:
      "An Istanbul clinic's list of the cases we decline or advise to treat at home. If you are on this list, have the treatment where you live.",
    ogType: "article",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "When you should not come to Turkey for dental treatment",
        description:
          "An Istanbul clinic's list of the cases we decline or advise to treat at home. If you are on this list, have the treatment where you live.",
        inLanguage: langBCP47[lang] || "en-US",
        publisher: { "@id": site.domain + "/#organization" },
        mainEntityOfPage: site.domain + url(lang, "before-you-book/when-you-should-not-come-to-turkey/"),
      },
      faqSchema(faqs),
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.url || site.domain + c.href }))),
    ],
  };
}
