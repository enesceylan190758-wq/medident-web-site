import { site } from "../data/site.mjs";
import { i18n } from "../data/i18n.mjs";
import { services, doctors, serviceFallback } from "../data/content.mjs";
import { img } from "../data/images.mjs";
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
import { contactSection } from "./home.mjs";

const src = (file) => asset(`/assets/img/${file}`);
const crumbHome = (lang) => ({ name: i18n[lang].breadcrumbHome, href: url(lang, ""), url: site.domain + url(lang, "") });

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
  const card = (s) => `<a href="${url(lang, "hizmetler/" + s.slug + "/")}" class="card" style="display:block;color:inherit;">
    <div class="icon-box">${icons[s.icon] || icons.smile}</div>
    <h3>${s.titles[lang]}</h3>
    <p style="font-size:14.5px;line-height:1.6;color:var(--muted-2);margin:0;">${s.short[lang]}</p>
    <span class="link-more">${t.detail} ${icons.arrowSm}</span>
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

// Single service (with article body if available)
export function servicePage(lang, service, article) {
  const t = i18n[lang];
  const title = service.titles[lang];
  const crumbs = [
    crumbHome(lang),
    { name: t.nav.services, href: url(lang, "hizmetler/") },
    { name: title, href: url(lang, "hizmetler/" + service.slug + "/") },
  ];
  const bodyHtml = article ? article.html : serviceFallback[lang](title);
  const related = services.filter((s) => s.slug !== service.slug && s.home).slice(0, 4);
  const body = `${pageHero(lang, t.servicesEyebrow, title, service.short[lang], crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container">
    <div style="display:grid;grid-template-columns:1fr;gap:40px;">
      <article class="prose">${bodyHtml}
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
          (s) => `<a href="${url(lang, "hizmetler/" + s.slug + "/")}" class="card" style="display:block;color:inherit;"><div class="icon-box">${icons[s.icon] || icons.smile}</div><h3 style="font-size:20px;">${s.titles[lang]}</h3><p style="font-size:14px;color:var(--muted-2);margin:0;">${s.short[lang]}</p></a>`
        )
        .join("")}</div>
    </div>
  </div></section>
  ${contactSection(lang)}`;
  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      name: title,
      description: service.meta[lang],
      provider: { "@id": site.domain + "/#organization" },
      url: site.domain + url(lang, "hizmetler/" + service.slug + "/"),
    },
    breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
  ];
  return { body, title: `${title} — ${site.brand}`, description: service.meta[lang], jsonld };
}

// Doctors index
export function doctorsIndexPage(lang) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.doctors, href: url(lang, "doktorlar/") }];
  const card = (d) => `<a href="${url(lang, "doktorlar/" + d.slug + "/")}" class="doctor-card" style="display:block;color:inherit;">
    <div class="photo"><img src="${asset(`/assets/img/${d.image}`)}" alt="${d.name}"></div>
    <div class="body"><h3 style="font-size:21px;margin-bottom:4px;">${d.name}</h3><p style="font-size:13.5px;color:var(--gold);font-weight:700;margin:0 0 10px;">${d.titles[lang]}</p><p style="font-size:14px;color:var(--muted-2);margin:0;">${d.bio[lang]}</p></div>
  </a>`;
  const body = `${pageHero(lang, "", t.doctorsTitle, t.doctorsLead, crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px;">${doctors.map(card).join("")}</div>
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
  const body = `${pageHero(lang, "", doctor.name, doctor.titles[lang], crumbs)}
  <section class="section" style="padding-top:clamp(40px,5vw,64px);"><div class="container">
    <div class="grid-2" style="grid-template-columns:.8fr 1.2fr;align-items:start;">
      <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/5;background:var(--sand);box-shadow:var(--shadow);"><img src="${asset(`/assets/img/${doctor.image}`)}" alt="${doctor.name}" style="width:100%;height:100%;object-fit:cover;"></div>
      <div class="prose" style="margin:0;">
        <p style="font-size:13.5px;color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:.1em;">${doctor.titles[lang]}</p>
        <p>${doctor.bio[lang]}</p>
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
      jobTitle: doctor.titles[lang],
      image: site.domain + asset("/assets/img/") + doctor.image,
      worksFor: { "@id": site.domain + "/#organization" },
      url: site.domain + url(lang, "doktorlar/" + doctor.slug + "/"),
    },
    breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
  ];
  return { body, title: `${doctor.name} — ${site.brand}`, description: `${doctor.name}, ${doctor.titles[lang]} — ${site.brand}`, jsonld };
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
      ${svc ? `<p style="margin-top:28px;"><a class="btn btn-ghost" href="${url(lang, "hizmetler/" + svc.slug + "/")}">${svc.titles[lang]} ${icons.arrowSm}</a></p>` : ""}
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
      inLanguage: lang,
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
    jsonld,
  };
}

// About
export function aboutPage(lang) {
  const t = i18n[lang];
  const crumbs = [crumbHome(lang), { name: t.nav.about, href: url(lang, "hakkimizda/") }];
  const body = `${pageHero(lang, t.aboutEyebrow, t.aboutTitle, "", crumbs)}
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container">
    <div class="grid-2" style="grid-template-columns:1.05fr .95fr;">
      <div class="prose" style="margin:0;">
        <p>${t.aboutP1}</p>
        <p>${t.aboutP2}</p>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">
          ${["Sağlık turizmi koordinasyonu", "Steril & modern klinik", "CAD/CAM laboratuvar", "Uluslararası hasta deneyimi"]
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
  ${contactSection(lang, { heading: false })}
  <section class="section" style="padding-top:0;"><div class="container">
    <div style="border-radius:20px;overflow:hidden;box-shadow:var(--shadow);aspect-ratio:16/7;background:var(--sand);">
      <iframe src="${site.mapsEmbed}" width="100%" height="100%" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="MediDent İstanbul — ${site.addressShort}"></iframe>
    </div>
  </div></section>`;
  return {
    body,
    title: `${t.nav.contact} — ${site.brand}`,
    description: t.contactLead,
    jsonld: [orgSchema(lang), breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href })))],
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
    <div style="text-align:center;margin-top:36px;"><a href="${site.mapsUrl}" class="btn btn-ghost" target="_blank" rel="noopener">Google ${lang === "tr" ? "yorumları" : "reviews"} ${icons.arrowSm}</a></div>
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
  <section class="section" style="padding-top:clamp(30px,4vw,48px);"><div class="container"><article class="prose">${copy[lang]}</article></div></section>`;
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
  const title = lang === "de" ? "GEO Wissensbank" : lang === "en" ? "GEO knowledge base" : "GEO bilgi bankası";
  const lead =
    lang === "de"
      ? "Kurze, zitierfähige Antworten für KI-Suchmaschinen und Patientenfragen."
      : lang === "en"
        ? "Short, citation-ready answers for AI search and patient questions."
        : "Yapay zekâ arama motorları ve hasta soruları için kısa, alıntılanabilir cevaplar.";
  const crumbs = [crumbHome(lang), { name: "GEO", href: url(lang, "geo/") }];
  const row = (p) => `<a href="${url(lang, "geo/" + p.slug + "/")}" class="article-row" style="color:inherit;">
    ${p.coverImage ? `<img class="article-thumb" src="${asset(`/assets/img/${p.coverImage}`)}" alt="" width="160" height="106" loading="lazy">` : ""}
    <div><h3 style="font-size:20px;margin-bottom:6px;">${p.title || p.question}</h3><p style="font-size:14.5px;color:var(--muted-2);margin:0;">${p.direct_answer.slice(0, 140)}…</p></div>
    <span class="link-more">${lang === "tr" ? "Oku" : "Read"} ${icons.arrowSm}</span>
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

/** Single GEO pack — answer-first + FAQPage */
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
  const body = `${pageHero(lang, "GEO", pack.question || pack.title, "", crumbs)}
  <section class="section" style="padding-top:clamp(24px,3vw,40px);"><div class="container" style="max-width:760px;">
    <article class="prose">
      ${cover}
      <p><strong>${pack.direct_answer}</strong></p>
      <h2>${lang === "tr" ? "Öne çıkan noktalar" : "Key points"}</h2>
      <ul>${(pack.bullets || []).map((b) => `<li>${b}</li>`).join("")}</ul>
      <h2>${lang === "tr" ? "Sık sorulan sorular" : "FAQ"}</h2>
      ${(pack.faq || []).map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join("")}
      <div style="margin-top:28px;display:flex;flex-wrap:wrap;gap:10px;">${links}</div>
    </article>
  </div></section>`;
  return {
    body,
    title: `${pack.question || pack.title} — ${site.brand}`,
    description: pack.direct_answer.slice(0, 155),
    image: ogImage,
    jsonld: [
      faqSchema(pack.faq || []),
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pack.question || pack.title,
        description: pack.direct_answer,
        image: ogImage,
        inLanguage: "tr",
        isPartOf: { "@type": "WebSite", name: site.brand, url: site.domain },
      },
      breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: site.domain + c.href }))),
    ],
  };
}

