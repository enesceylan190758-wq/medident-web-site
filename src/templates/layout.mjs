// Base layout: <head> (SEO + tracking), header, footer, floating widgets.
import { site, langPrefix, htmlLang, ogLocale } from "../data/site.mjs";
import { i18n } from "../data/i18n.mjs";
import { services } from "../data/content.mjs";
import { icons } from "./icons.mjs";

export const waHref = (text) =>
  `https://wa.me/${site.whatsappRaw}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// Prefix absolute site paths with optional preview basePath (GitHub Pages etc.).
export const asset = (p = "") => {
  const path = String(p).startsWith("/") ? p : `/${p}`;
  return `${site.basePath || ""}${path}`;
};

// Build a localized URL from a path (no language prefix baked in).
export const url = (lang, path = "") => {
  const p = path.replace(/^\/+/, "");
  const langBase = langPrefix[lang] || "";
  const full = `${site.basePath || ""}${langBase}/${p}`.replace(/\/+/g, "/");
  return full === "" || full === site.basePath ? `${site.basePath || ""}/` || "/" : full;
};

export const absUrl = (lang, path = "") => site.domain + url(lang, path);

// Head with per-page SEO + hreflang alternates + tracking.
function head({ lang, title, description, path, image, jsonld = [], ogType = "website" }) {
  const t = i18n[lang];
  const canonical = absUrl(lang, path);
  const img = image || site.domain + asset("/assets/img/portrait-a.jpg");
  const alts = site.languages
    .map((l) => `<link rel="alternate" hreflang="${htmlLang[l]}" href="${absUrl(l, path)}">`)
    .join("\n    ");
  const jsonldTags = jsonld
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n    ");
  const gtm = site.tracking.gtm
    ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.tracking.gtm}');</script>`
    : "";
  const ga4 = site.tracking.ga4
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.tracking.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.tracking.ga4}');</script>`
    : "";
  const pixel = site.tracking.metaPixel
    ? `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${site.tracking.metaPixel}');fbq('track','PageView');</script><noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${site.tracking.metaPixel}&ev=PageView&noscript=1"/></noscript>`
    : "";
  return `<!DOCTYPE html>
<html lang="${htmlLang[lang]}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <link rel="canonical" href="${canonical}">
    ${site.tracking.gscVerify ? `<meta name="google-site-verification" content="${site.tracking.gscVerify}">` : ""}
    <meta name="robots" content="index,follow,max-image-preview:large">
    ${alts}
    <link rel="alternate" hreflang="x-default" href="${absUrl(site.defaultLang, path)}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:site_name" content="${site.brand}">
    <meta property="og:locale" content="${ogLocale[lang]}">
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${img}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(title)}">
    <meta name="twitter:description" content="${escapeAttr(description)}">
    <meta name="twitter:image" content="${img}">
    <link rel="icon" href="${asset("/assets/img/favicon-32.png")}" sizes="32x32">
    <link rel="apple-touch-icon" href="${asset("/assets/img/favicon-180.png")}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Jost:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${asset("/assets/css/site.css")}">
    ${gtm}
    ${ga4}
    ${pixel}
    ${jsonldTags}
</head>`;
}

function escapeAttr(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function topbar(lang) {
  const t = i18n[lang].topbar;
  return `<div class="topbar"><div class="topbar-inner">
    <span>${t.a}</span>
    <span class="dot hide-sm"></span>
    <span class="hide-sm">${t.b}</span>
    <span class="dot hide-sm"></span>
    <a href="${waHref()}" target="_blank" rel="noopener">${t.c}</a>
  </div></div>`;
}

function langSwitch(lang, path) {
  return `<div class="lang-switch">${site.languages
    .map((l) => `<a href="${url(l, path)}" class="${l === lang ? "is-active" : ""}" hreflang="${htmlLang[l]}">${l.toUpperCase()}</a>`)
    .join("")}</div>`;
}

function navLinks(lang) {
  const n = i18n[lang].nav;
  return [
    [n.services, url(lang, "hizmetler/")],
    [n.doctors, url(lang, "doktorlar/")],
    [n.about, url(lang, "hakkimizda/")],
    [n.gallery, url(lang, "galeri/")],
    [n.blog, url(lang, "blog/")],
    [n.contact, url(lang, "iletisim/")],
  ];
}

function header(lang, path) {
  const n = i18n[lang].nav;
  const links = navLinks(lang);
  return `${topbar(lang)}
  <header class="site-header">
    <div class="header-inner">
      <a href="${url(lang, "")}" class="logo" aria-label="${site.brand}"><img src="${asset("/assets/img/logo.png")}" alt="${site.brand}" width="150" height="44"></a>
      <nav class="nav">
        ${links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("\n        ")}
      </nav>
      <div style="display:flex;align-items:center;gap:12px;">
        ${langSwitch(lang, path)}
        <a href="${url(lang, "iletisim/")}" class="btn btn-primary header-cta" style="padding:12px 20px;font-size:14px;">${n.cta}</a>
        <button data-burger class="burger" aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2318" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"></path></svg>
        </button>
      </div>
    </div>
  </header>
  <div class="mobile-nav" data-mobile-nav>
    <div class="mobile-panel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;">
        <img src="${asset("/assets/img/logo.png")}" alt="${site.brand}" style="height:34px;width:auto;">
        <button data-close-nav aria-label="Close" style="width:40px;height:40px;border-radius:10px;border:1px solid rgba(43,35,24,.14);display:flex;align-items:center;justify-content:center;background:#fff;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B2318" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
      </div>
      ${links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("\n      ")}
      <a href="${url(lang, "iletisim/")}" class="btn btn-primary" style="margin-top:20px;">${n.cta}</a>
      <a href="${waHref()}" class="btn btn-ghost" style="margin-top:10px;" target="_blank" rel="noopener">WhatsApp</a>
      <div style="margin-top:18px;">${langSwitch(lang, path)}</div>
    </div>
  </div>`;
}

function footer(lang) {
  const t = i18n[lang];
  const homeServices = services.filter((s) => s.home).slice(0, 6);
  return `<footer class="site-footer">
    <div class="footer-grid">
      <div>
        <span class="footer-logo"><img src="${asset("/assets/img/logo.png")}" alt="${site.brand}"></span>
        <p style="font-size:14px;line-height:1.6;color:#8A7F6D;margin:0 0 18px;max-width:280px;">${t.footerTag}</p>
        <div class="socials">
          <a href="${waHref()}" aria-label="WhatsApp" target="_blank" rel="noopener">${icons.wa.replace('width="24" height="24"', 'width="19" height="19"')}</a>
          <a href="${site.social.instagram}" aria-label="Instagram" target="_blank" rel="noopener">${icons.instagram}</a>
          <a href="${site.social.facebook}" aria-label="Facebook" target="_blank" rel="noopener">${icons.facebook}</a>
          <a href="${site.social.youtube}" aria-label="YouTube" target="_blank" rel="noopener">${icons.youtube}</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">${t.footerServices}</div>
        <div class="footer-links">
          ${homeServices.map((s) => `<a href="${url(lang, "hizmetler/" + s.slug + "/")}">${s.titles[lang]}</a>`).join("\n          ")}
        </div>
      </div>
      <div>
        <div class="footer-col-title">${t.footerCorp}</div>
        <div class="footer-links">
          <a href="${url(lang, "hakkimizda/")}">${t.nav.about}</a>
          <a href="${url(lang, "doktorlar/")}">${t.nav.doctors}</a>
          <a href="${url(lang, "yorumlar/")}">${t.nav.reviews}</a>
          <a href="${url(lang, "galeri/")}">${t.nav.gallery}</a>
          <a href="${url(lang, "blog/")}">${t.nav.blog}</a>
          <a href="${url(lang, "geo/")}">GEO</a>
          <a href="${url(lang, "sss/")}">${t.nav.faq}</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">${t.footerContact}</div>
        <div class="footer-links">
          <a href="${waHref()}" target="_blank" rel="noopener">WhatsApp: ${site.whatsapp}</a>
          <a href="tel:${site.phoneRaw}">${site.phone}</a>
          <a href="mailto:${site.email}">${site.email}</a>
          <a href="${site.mapsUrl}" target="_blank" rel="noopener">${site.address}</a>
          <span style="font-size:14px;color:#a89d8b;">${site.hours}</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${site.brand}. ${t.rights}</span>
      <div style="display:flex;gap:22px;">
        <a href="${url(lang, "gizlilik/")}">${t.privacy}</a>
        <a href="${url(lang, "kvkk/")}">${t.kvkk}</a>
      </div>
    </div>
  </footer>`;
}

function floating(lang) {
  return `<a href="${waHref()}" class="wa-float" aria-label="WhatsApp" target="_blank" rel="noopener">${icons.wa.replace('width="24" height="24"', 'width="30" height="30"')}</a>
  <button class="to-top" aria-label="Yukarı">${icons.arrow({ w: 20 })}</button>
  <div class="lightbox" data-lightbox><button class="lightbox-close" data-lightbox-close aria-label="Kapat"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button><img src="" alt=""></div>`;
}

// Full page wrapper.
export function layout(opts, bodyHtml) {
  const { lang, path } = opts;
  const formCfg = {
    endpoint: site.estesof.endpoint,
    method: site.estesof.method,
    whatsapp: site.whatsappRaw,
  };
  const gtmNo = site.tracking.gtm
    ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${site.tracking.gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
    : "";
  return `${head(opts)}
<body>
  ${gtmNo}
  ${header(lang, path)}
  <main>
${bodyHtml}
  </main>
  ${footer(lang)}
  ${floating(lang)}
  <script>window.__MD_FORM__=${JSON.stringify(formCfg)};</script>
  <script src="${asset("/assets/js/site.js")}" defer></script>
</body>
</html>`;
}

// Shared JSON-LD builders
export function orgSchema(lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": site.domain + "/#organization",
    name: site.brand,
    url: site.domain + "/",
    image: site.domain + asset("/assets/img/portrait-a.jpg"),
    logo: site.domain + asset("/assets/img/logo.png"),
    telephone: site.phone,
    email: site.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Acıbadem Cd. 195F",
      addressLocality: "Üsküdar",
      addressRegion: "İstanbul",
      postalCode: "34718",
      addressCountry: "TR",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    openingHours: site.openingHours,
    sameAs: [site.social.instagram, site.social.facebook, site.social.youtube],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumb(lang, items) {
  return `<nav class="breadcrumb" aria-label="breadcrumb">${items
    .map((it, i) =>
      i === items.length - 1
        ? `<span>${it.name}</span>`
        : `<a href="${it.href}">${it.name}</a> <span>›</span>`
    )
    .join(" ")}</nav>`;
}
