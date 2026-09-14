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

