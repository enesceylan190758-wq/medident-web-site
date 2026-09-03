// Standalone digital business card (QR landing) — minimal chrome for mobile scan UX.
import { site } from "../data/site.mjs";
import { asset, absUrl } from "./layout.mjs";
import { icons } from "./icons.mjs";

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Full HTML document for a digital vCard page (no site header/footer).
 * Path: /p/{slug}/
 */
export function vcardPageHtml(card) {
  const path = `p/${card.slug}/`;
  const pageUrl = absUrl("tr", path);
  const vcfHref = asset(`/p/${card.slug}/${card.slug}.vcf`);
  const logo = asset("/assets/img/logo.png");
  const wa = `https://wa.me/${card.whatsappRaw}?text=${encodeURIComponent("Merhaba Enes, MediDent kartvizitinizden ulaşıyorum.")}`;
  const tel = `tel:${card.phoneRaw}`;
  const mail = `mailto:${card.email}`;
  const title = `${card.name} — ${card.org}`;
  const description = `${card.name} · ${card.org} · ${card.phone} · ${card.email} · ${card.addressFull}`;

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: card.name,
    jobTitle: card.title,
    email: card.email,
    telephone: card.phoneRaw,
    url: pageUrl,
    worksFor: {
      "@type": "Dentist",
      name: card.org,
      url: card.website,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Caddebostan Mah. İskele Sk. No: 16 - 18B",
      addressLocality: "Kadıköy",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    sameAs: [card.social.instagram, card.website].filter(Boolean),
  };

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${pageUrl}">
  <meta name="robots" content="index,follow">
  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="${esc(site.brand)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${site.domain}${logo}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="${asset("/assets/img/favicon-32.png")}" sizes="32x32">
  <link rel="apple-touch-icon" href="${asset("/assets/img/favicon-180.png")}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${asset("/assets/css/vcard.css")}">
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="vcard-page">
  <div class="vcard-bg" aria-hidden="true"></div>
  <main class="vcard-shell">
    <header class="vcard-brand">
      <a class="vcard-logo" href="${esc(card.website)}" aria-label="${esc(card.org)}">
        <img src="${logo}" alt="${esc(card.org)}" width="160" height="48">
      </a>
    </header>

    <section class="vcard-hero" aria-labelledby="vcard-name">
      <p class="vcard-org">${esc(card.org)}</p>
      <h1 id="vcard-name">${esc(card.name)}</h1>
      <span class="vcard-rule" aria-hidden="true"></span>
      <p class="vcard-lead">Dijital kartvizit — rehbere kaydedin veya hemen iletişime geçin.</p>
    </section>

    <div class="vcard-actions" role="group" aria-label="Hızlı iletişim">
      <a class="vcard-btn vcard-btn-primary" href="${tel}">
        <span class="vcard-ico">${icons.phone}</span>
        Ara
      </a>
      <a class="vcard-btn vcard-btn-wa" href="${wa}" target="_blank" rel="noopener">
        <span class="vcard-ico">${icons.wa}</span>
        WhatsApp
      </a>
      <a class="vcard-btn" href="${mail}">
        <span class="vcard-ico">${icons.mail}</span>
        E-posta
      </a>
      <a class="vcard-btn" href="${vcfHref}" download="${esc(card.slug)}.vcf">
        <span class="vcard-ico">${icons.care}</span>
        Rehbere kaydet
      </a>
    </div>

    <ul class="vcard-list">
      <li>
        <a href="${tel}">
          <span class="vcard-ico">${icons.phone}</span>
          <span>
            <small>Telefon</small>
            <strong>${esc(card.phone)}</strong>
          </span>
        </a>
      </li>
      <li>
        <a href="${mail}">
          <span class="vcard-ico">${icons.mail}</span>
          <span>
            <small>E-posta</small>
            <strong>${esc(card.email)}</strong>
          </span>
        </a>
      </li>
      <li>
        <a href="${esc(card.mapsUrl)}" target="_blank" rel="noopener">
          <span class="vcard-ico">${icons.pin}</span>
          <span>
            <small>Adres</small>
            <strong>${esc(card.addressLines[0])}</strong>
            <em>${esc(card.addressLines[1])}</em>
          </span>
        </a>
      </li>
    </ul>

    <footer class="vcard-foot">
      <a href="${esc(card.website)}">medidentistanbul.com</a>
      ${card.social.instagram ? `<a href="${esc(card.social.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${icons.instagram}</a>` : ""}
    </footer>
  </main>
</body>
</html>`;
}
