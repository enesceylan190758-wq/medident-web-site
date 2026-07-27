import { site } from "../data/site.mjs";
import { i18n } from "../data/i18n.mjs";
import { services, homeCards, packages } from "../data/content.mjs";
import { img } from "../data/images.mjs";
import { hoursLocalized } from "../data/seo.mjs";
import { L, uiBits } from "../data/locale.mjs";
import { icons } from "./icons.mjs";
import { url, waHref, orgSchema, faqSchema, breadcrumbSchema, asset } from "./layout.mjs";
import { trustStrip, doctorStrip, mapEmbedBlock } from "./partials.mjs";
import { responsiveImg } from "./media.mjs";

const src = (file) => asset(`/assets/img/${file}`);

function igPermalinkToEmbed(url = "") {
  const m = String(url).match(/instagram\.com\/(reel|p|tv)\/([^/?#]+)/i);
  if (!m) return "";
  return `https://www.instagram.com/${m[1]}/${m[2]}/embed`;
}

function clinicVideoSection(lang) {
  const cover = src(img.about || "about-portrait.jpg");
  const videoId = site.youtubeIntroId || "";
  const channel = site.social.youtube;
  const igProfile = site.social.instagram;
  const watchHref = videoId ? `https://www.youtube.com/watch?v=${videoId}` : channel;
  const facadeAttrs = videoId
    ? `data-yt-facade data-yt-id="${videoId}"`
    : `href="${channel}" target="_blank" rel="noopener"`;
  const tag = videoId ? "button" : "a";

  const configured = Array.isArray(site.instagramFeed) ? site.instagramFeed.filter((x) => x?.url) : [];
  const fallbackCovers = (img.marquee || []).slice(0, 4);
  const igItems =
    configured.length > 0
      ? configured.slice(0, 6).map((item, i) => ({
          url: item.url,
          embed: igPermalinkToEmbed(item.url),
          cover: src(item.cover || fallbackCovers[i % fallbackCovers.length] || "portrait-a.jpg"),
        }))
      : fallbackCovers.map((f) => ({
          url: igProfile,
          embed: "",
          cover: src(f),
        }));

  const igCards = igItems
    .map(
      (item) => {
        const embedAttr = item.embed ? ` data-ig-embed="${item.embed}"` : "";
        return `<a class="ig-card" href="${item.url}" target="_blank" rel="noopener"${embedAttr}>
      <img src="${item.cover}" alt="${site.brand} Instagram" loading="lazy" width="320" height="400">
      <span class="ig-card-shade" aria-hidden="true"></span>
      <span class="ig-card-badge">${icons.instagram}<span>${L(uiBits.openInstagram, lang)}</span></span>
    </a>`;
      }
    )
    .join("");

  return `<section class="section section-clinic-video" id="klinik-video">
    <div class="container">
      <div class="clinic-video-head" data-reveal>
        <div class="eyebrow">${L(uiBits.clinicVideoEyebrow, lang)}</div>
        <h2 style="margin:0 0 12px;">${L(uiBits.clinicVideoTitle, lang)}</h2>
        <p class="lead" style="margin:0;">${L(uiBits.clinicVideoLead, lang)}</p>
      </div>
      <div class="clinic-video-grid" data-reveal>
        <${tag} class="yt-facade" ${facadeAttrs} aria-label="${L(uiBits.watchVideo, lang)}">
          <img src="${cover}" alt="${site.brand} — ${L(uiBits.clinicVideoEyebrow, lang)}" width="960" height="540" loading="lazy">
          <span class="yt-facade-play" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
          <span class="yt-facade-label">${L(uiBits.watchVideo, lang)}</span>
        </${tag}>
        <div class="clinic-photo-strip">
          ${(img.marquee || []).slice(0, 4).map((f) => `<img src="${src(f)}" alt="${site.brand}" loading="lazy" width="280" height="200">`).join("")}
          <a class="btn btn-ghost" href="${watchHref}" target="_blank" rel="noopener">${L(uiBits.openYoutube, lang)} ${icons.arrowSm}</a>
        </div>
      </div>

      <div class="ig-feed" data-reveal>
        <div class="ig-feed-head">
          <div>
            <div class="eyebrow">${L(uiBits.instagramEyebrow, lang)}</div>
            <h3 style="margin:0 0 8px;font-size:clamp(22px,3vw,30px);">${L(uiBits.instagramTitle, lang)}</h3>
          </div>
          <a class="btn btn-ghost" href="${igProfile}" target="_blank" rel="noopener">${icons.instagram} @medidentistanbul</a>
        </div>
        <div class="ig-grid">${igCards}</div>
      </div>
    </div>
  </section>`;
}

export function homePage(lang) {
  const t = i18n[lang];
  const h = t.home;
  const svcUrl = (slug) => url(lang, "hizmetler/" + slug + "/");

  const stat = (s) => {
    let initial = s.dec ? Number(s.to).toFixed(s.dec) : String(Math.round(s.to));
    if (s.sep) initial = initial.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (s.suffix) initial += s.suffix;
    return `<div><div class="stat-num"><span data-to="${s.to}" ${s.dec ? `data-dec="${s.dec}"` : ""} ${s.sep ? 'data-sep="1"' : ""} ${s.suffix ? `data-suffix="${s.suffix}"` : ""}>${initial}</span>${s.suffix ? "" : '<span>+</span>'}</div><div class="stat-label">${s.label}</div></div>`;
  };

  const serviceCard = (c, i) => {
    const title = L(c.titles, lang);
    const href = svcUrl(c.service);
    const featured = !!c.featured;
    return `<a href="${href}" class="svc-tile ${featured ? "is-featured" : ""}" data-reveal style="--d:${(i % 6) * 60}ms">
      ${responsiveImg(c.image || "portrait-a.jpg", { alt: `${title} — ${site.brand}`, loading: "lazy" })}
      <span class="svc-tile-shade" aria-hidden="true"></span>
      <span class="svc-tile-body">
        <span class="svc-tile-kicker">${t.servicesEyebrow}</span>
        <h3>${title}</h3>
        <p>${L(c.short, lang)}</p>
        <span class="svc-tile-cta">${t.detail} ${icons.arrowSm}</span>
      </span>
    </a>`;
  };

  const pkg = (p) => {
    const featured = p.featured;
    const fromPrice = p.fromPrice ? L(p.fromPrice, lang) : "";
    const priceHtml = fromPrice
      ? `<div style="font-size:12.5px;color:${featured ? "#C9BEAC" : "var(--muted-2)"};margin-bottom:4px;">${L(uiBits.fromPriceLabel, lang)}</div>
        <div style="font-family:var(--font-serif);font-weight:700;font-size:26px;color:${featured ? "#fff" : "var(--ink)"};margin-bottom:18px;">${fromPrice}</div>`
      : `<div style="font-size:12.5px;color:${featured ? "#C9BEAC" : "var(--muted-2)"};margin-bottom:4px;">${L(uiBits.allInclusive, lang)}</div>
        <div style="font-family:var(--font-serif);font-weight:700;font-size:26px;color:${featured ? "#fff" : "var(--ink)"};margin-bottom:18px;">${t.customPrice}</div>`;
    return `<div class="pkg ${featured ? "featured" : ""}" data-reveal>
      ${featured ? `<span class="pkg-badge">${t.popular}</span>` : ""}
      <h3>${L(p.titles, lang)}</h3>
      <p style="font-size:14px;color:${featured ? "#C9BEAC" : "var(--muted-2)"};margin:0 0 22px;">${L(p.leads, lang)}</p>
      <ul class="pkg-list">${(p.items[lang] || p.items.en || p.items.tr || [])
        .map((it) => `<li style="color:${featured ? "#F4EEE4" : "var(--ink-soft)"}">${icons.check()} <span>${it}</span></li>`)
        .join("")}</ul>
      <div style="margin-top:auto;">
        ${priceHtml}
        <a href="${url(lang, "iletisim/")}" class="btn ${featured ? "btn-gold" : "btn-outline-red"} btn-block">${t.getQuote}</a>
      </div>
    </div>`;
  };

  const review = (r) =>
    `<div class="review" data-reveal>
      <div class="stars">★★★★★</div>
      <p style="font-size:15px;line-height:1.62;color:#F4EEE4;margin:14px 0 20px;">“${r.text}”</p>
      <div style="display:flex;align-items:center;gap:12px;">
        <div class="avatar">${r.initials}</div>
        <div style="line-height:1.25;"><div style="font-weight:700;font-size:14.5px;color:#fff;">${r.name}</div><div style="font-size:12.5px;color:#A89D8B;">${r.place}</div></div>
      </div>
    </div>`;

  const faqItem = (f) =>
    `<div class="faq-item" data-faq-item>
      <button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">${miniMinus}</span><span class="plus">${miniPlus}</span></span></button>
      <div class="faq-a"><p style="margin:0;">${f.a}</p></div>
    </div>`;

  const galleryImgs = img.marquee.map((f) => src(f));

  const body = `
  <section class="hero">
    <div class="hero-glow"></div>
    <div class="hero-inner">
      <div class="grid-2">
        <div>
          <div class="eyebrow">${h.eyebrow}</div>
          <h1>${h.h1}</h1>
          <p class="lead">${h.lead}</p>
          <div style="display:flex;flex-wrap:wrap;gap:14px;margin-bottom:26px;">
            <a href="${url(lang, "iletisim/")}" class="btn btn-primary">${h.ctaPrimary} ${icons.arrow()}</a>
            <a href="${url(lang, "galeri/")}" class="btn btn-ghost">${h.ctaSecondary}</a>
          </div>
          <div class="rating-row rating-row-lg">
            <a class="rating-pill" href="${site.googleMapsUrl || site.mapsUrl}" target="_blank" rel="noopener" aria-label="Google ${L(uiBits.googleReviewsCta, lang)}">
              <span class="stars">★★★★★</span>
              <span><strong style="color:var(--ink);">${site.rating.value}/5</strong> · Google · ${site.rating.count}+ ${L(uiBits.googleReviews, lang)}</span>
            </a>
            <span class="hide-sm"><strong style="color:var(--ink);">50+</strong> ${L(uiBits.countriesWord, lang)}</span>
          </div>
        </div>
        <div class="hero-media" data-reveal>
          <div class="hero-frame">
            <img src="${src(img.hero)}" alt="${site.brand} — ${h.eyebrow}" width="640" height="800">
          </div>
          <div class="float-card top-left">
            <div style="width:38px;height:38px;border-radius:10px;background:var(--cream-2);display:flex;align-items:center;justify-content:center;color:var(--gold);"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 6 20.4l1.4-6.8L2.3 9l6.9-.7z"></path></svg></div>
            <div style="line-height:1.15;"><div style="font-weight:800;font-size:15px;color:var(--ink);">4.9 / 5.0</div><div style="font-size:11.5px;color:var(--muted-2);">Google</div></div>
          </div>
          <button class="float-card bottom-right" data-lightbox-src="${src(img.heroBa)}" aria-label="${t.before} / ${t.after}">
            <span style="border-radius:11px;overflow:hidden;aspect-ratio:3.6/1;background:var(--sand);display:block;"><img src="${src(img.heroBa)}" alt="${t.before} & ${t.after}" style="width:100%;height:100%;object-fit:cover;object-position:center top;"></span>
            <span style="padding:9px 6px 4px;display:flex;align-items:center;gap:7px;"><span class="dot"></span><span style="font-size:12.5px;font-weight:700;color:var(--ink);">${L(uiBits.realSmile, lang)}</span></span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="stats" data-stats>
    <div class="stats-grid">${t.stats.map(stat).join("")}</div>
  </section>

  ${trustStrip(lang)}

  <section class="section section-services" id="hizmetler">
    <div class="container">
      <div class="svc-head" data-reveal>
        <div>
          <div class="eyebrow">${t.servicesEyebrow}</div>
          <h2 style="margin:0;">${t.servicesTitle}</h2>
        </div>
        <p>${t.servicesLead}</p>
      </div>
      <div class="svc-mosaic svc-mosaic--home">${homeCards.map(serviceCard).join("")}</div>
      <div class="svc-foot" data-reveal>
        <a href="${url(lang, "hizmetler/")}" class="btn btn-ghost">${t.allServices} ${icons.arrowSm}</a>
      </div>
    </div>
  </section>

  ${doctorStrip(lang)}

  <section class="section section-alt" id="sonuclar">
    <div class="container">
      <div class="grid-2" style="grid-template-columns:.92fr 1.08fr;">
        <div>
          <div class="eyebrow" data-reveal>${t.resultsEyebrow}</div>
          <h2 data-reveal>${t.resultsTitle}</h2>
          <p class="lead" data-reveal>${t.resultsLead}</p>
          <a href="${url(lang, "iletisim/")}" class="btn btn-primary" data-reveal>${h.ctaPrimary} ${icons.arrow()}</a>
        </div>
        <div data-reveal>
          <div class="ba" data-ba>
            <img src="${src(img.after)}" alt="${t.after}">
            <img class="ba-before" src="${src(img.before)}" alt="${t.before}">
            <span class="ba-label before">${t.before}</span>
            <span class="ba-label after">${t.after}</span>
            <div class="ba-handle"><div class="ba-knob"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 8L6 12l3.5 4M14.5 8l3.5 4-3.5 4"></path></svg></div></div>
          </div>
          <p style="text-align:center;font-size:13px;color:var(--muted-2);margin:16px 0 0;">${t.drag}</p>
        </div>
      </div>
      <div style="height:clamp(48px,6vw,72px);"></div>
      <div class="case-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,228px),1fr));gap:18px;">
        ${img.cases
          .map((c) => {
            const label = c.label[lang] || c.label.tr;
            const href = src(c.file);
            return `<button data-reveal data-lightbox-src="${href}" class="case-card">
          <img src="${href}" alt="${label} — ${site.brand}">
          <div class="shade"></div>
          <span class="case-badge">${t.before} &amp; ${t.after}</span>
          <span class="case-title">${label}</span>
        </button>`;
          })
          .join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container" style="text-align:center;margin-bottom:clamp(30px,4vw,46px);">
      <div class="eyebrow center" data-reveal>${t.patientsEyebrow}</div>
      <h2 data-reveal style="margin:0;">${t.patientsTitle}</h2>
    </div>
    <div class="marquee-wrap">
      <div class="marquee">
        ${galleryImgs.concat(galleryImgs).map((href) => `<button data-lightbox-src="${href}"><img src="${href}" alt="${site.brand}" loading="lazy"></button>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid-2" style="grid-template-columns:1fr 1.06fr;">
        <div data-reveal style="position:relative;">
          <div style="border-radius:26px;overflow:hidden;aspect-ratio:5/6;box-shadow:var(--shadow-lg);background:var(--sand);"><img src="${src(img.why)}" alt="${site.brand}" style="width:100%;height:100%;object-fit:cover;"></div>
        </div>
        <div>
          <div class="eyebrow" data-reveal>${t.whyEyebrow}</div>
          <h2 data-reveal>${t.whyTitle}</h2>
          <p class="lead" data-reveal>${t.whyLead}</p>
          <div data-reveal style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:26px 28px;">
            ${t.whyItems
              .map(
                (w) => `<div><div class="icon-box" style="width:46px;height:46px;">${icons.check({ w: 22 })}</div><h4 style="font-size:17px;font-weight:800;margin:0 0 6px;color:var(--ink);">${w.t}</h4><p style="font-size:14px;line-height:1.55;color:var(--muted-2);margin:0;">${w.d}</p></div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt" id="surec">
    <div class="container" style="max-width:1120px;">
      <div style="text-align:center;max-width:640px;margin:0 auto clamp(44px,5vw,64px);">
        <div class="eyebrow center" data-reveal>${t.processEyebrow}</div>
        <h2 data-reveal style="margin:0 0 14px;">${t.processTitle}</h2>
        <p data-reveal style="font-size:16px;line-height:1.62;color:var(--muted);margin:0;">${t.processLead}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:20px;">
        ${t.process
          .map(
            (p) => `<div class="step" data-reveal><div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;"><span class="step-n">${p.n}</span><span style="flex:1;height:1px;background:linear-gradient(90deg,var(--gold),transparent);"></span></div><h4 style="font-size:16.5px;font-weight:800;margin:0 0 7px;color:var(--ink);">${p.t}</h4><p style="font-size:13.8px;line-height:1.56;color:var(--muted-2);margin:0;">${p.d}</p></div>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section" id="paketler">
    <div class="container">
      <div style="text-align:center;max-width:640px;margin:0 auto clamp(42px,5vw,60px);">
        <div class="eyebrow center" data-reveal>${t.packagesEyebrow}</div>
        <h2 data-reveal style="margin:0 0 14px;">${t.packagesTitle}</h2>
        <p data-reveal style="font-size:16px;line-height:1.62;color:var(--muted);margin:0;">${t.packagesLead}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:22px;align-items:stretch;">${packages.map(pkg).join("")}</div>
    </div>
  </section>

  <section class="section section-dark" id="yorumlar">
    <div class="container">
      <div style="text-align:center;max-width:620px;margin:0 auto clamp(42px,5vw,58px);">
        <div class="eyebrow center" data-reveal>${t.reviewsEyebrow}</div>
        <h2 data-reveal style="margin:0 0 14px;">${t.reviewsTitle}</h2>
        <p data-reveal style="font-size:16px;line-height:1.6;color:#C9BEAC;margin:0;">${t.reviewsLead}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,272px),1fr));gap:20px;">${t.reviews.map(review).join("")}</div>
    </div>
  </section>

  ${clinicVideoSection(lang)}

  <section class="section" id="hakkimizda">
    <div class="container">
      <div class="grid-2" style="grid-template-columns:1.05fr .95fr;">
        <div>
          <div class="eyebrow" data-reveal>${t.aboutEyebrow}</div>
          <h2 data-reveal>${t.aboutTitle}</h2>
          <p data-reveal style="font-size:16.5px;line-height:1.66;color:var(--muted);margin:0 0 16px;max-width:520px;">${t.aboutP1}</p>
          <p data-reveal style="font-size:16.5px;line-height:1.66;color:var(--muted);margin:0 0 28px;max-width:520px;">${t.aboutP2}</p>
          <a href="${url(lang, "hakkimizda/")}" class="btn btn-ghost" data-reveal>${t.nav.about} ${icons.arrowSm}</a>
        </div>
        <div data-reveal style="position:relative;">
          <div style="border-radius:24px;overflow:hidden;aspect-ratio:4/5;box-shadow:var(--shadow-lg);background:var(--sand);"><img src="${src(img.about)}" alt="${site.brand}" style="width:100%;height:100%;object-fit:cover;"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt" id="sss">
    <div class="container" style="max-width:900px;">
      <div style="text-align:center;max-width:620px;margin:0 auto clamp(38px,4vw,52px);">
        <div class="eyebrow center" data-reveal>${t.faqEyebrow}</div>
        <h2 data-reveal style="margin:0;">${t.faqTitle}</h2>
      </div>
      <div class="faq" data-reveal>${t.faqs.map(faqItem).join("")}</div>
    </div>
  </section>

  ${contactSection(lang)}
  `;

  const jsonld = [
    orgSchema(lang),
    faqSchema(t.faqs),
    breadcrumbSchema([{ name: site.brand, url: site.domain + url(lang, "") }]),
  ];

  return {
    body,
    title: `${site.brand} — ${L(uiBits.homeTitle, lang)}`,
    description: h.lead,
    jsonld,
    image: site.domain + src(img.hero),
  };
}

const miniMinus = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"></path></svg>`;
const miniPlus = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg>`;

// Reusable contact section (also used on /iletisim/)
export function contactSection(lang, { heading = true, showMap = true } = {}) {
  const t = i18n[lang];
  const treatments = services.filter((s) => s.home).map((s) => L(s.titles, lang));
  return `<section class="section contact-band" id="iletisim">
    <div class="container">
      <div class="grid-2" style="grid-template-columns:1fr 1.05fr;">
        <div>
          <div class="eyebrow" data-reveal>${t.contactEyebrow}</div>
          ${heading ? `<h2 data-reveal>${t.contactTitle}</h2>` : ""}
          <p data-reveal style="font-size:16.5px;line-height:1.64;color:#C9BEAC;margin:0 0 34px;max-width:460px;">${t.contactLead}</p>
          <div class="contact-links" data-reveal>
            <a href="${waHref()}" target="_blank" rel="noopener"><span class="contact-ico">${icons.wa}</span><span><span style="display:block;font-size:12.5px;color:#A89D8B;">${t.waLabel}</span><span style="font-weight:700;font-size:16px;">${site.whatsapp}</span></span></a>
            <a href="tel:${site.phoneRaw}"><span class="contact-ico">${icons.phone}</span><span><span style="display:block;font-size:12.5px;color:#A89D8B;">${t.phoneLabel}</span><span style="font-weight:700;font-size:16px;">${site.phone}</span></span></a>
            <a href="mailto:${site.email}"><span class="contact-ico">${icons.mail}</span><span><span style="display:block;font-size:12.5px;color:#A89D8B;">${t.emailLabel}</span><span style="font-weight:700;font-size:16px;">${site.email}</span></span></a>
            <div class="row"><span class="contact-ico">${icons.pin}</span><span><span style="display:block;font-size:12.5px;color:#A89D8B;">${t.addressLabel}</span><span style="font-weight:700;font-size:16px;">${site.address}</span></span></div>
            <div class="row"><span class="contact-ico">${icons.clock}</span><span><span style="display:block;font-size:12.5px;color:#A89D8B;">${t.hoursLabel}</span><span style="font-weight:700;font-size:16px;">${hoursLocalized[lang] || site.hours}</span></span></div>
          </div>
          ${showMap ? mapEmbedBlock(lang, { title: L(uiBits.mapTitle, lang) }) : ""}
        </div>
        <div data-reveal>
          <div class="form-card">
            <form class="form-main" data-lead-form>
              <h3>${t.formTitle}</h3>
              <p style="font-size:14px;color:var(--muted-2);margin:0 0 24px;">${t.formLead}</p>
              <div class="form-stack">
                <div class="form-grid">
                  <label><span class="lbl">${t.formName}</span><input type="text" name="name" required placeholder="${t.formName}"></label>
                  <label><span class="lbl">${t.formPhone}</span><input type="tel" name="phone" required placeholder="+90 ..."></label>
                </div>
                <label><span class="lbl">${t.formEmail}</span><input type="email" name="email" required placeholder="ornek@eposta.com"></label>
                <label><span class="lbl">${t.formTreatment}</span><select name="treatment">${treatments.map((x) => `<option>${x}</option>`).join("")}<option>${L(uiBits.notSure, lang)}</option></select></label>
                <label><span class="lbl">${t.formMessage} <span style="color:#9AA;font-weight:500;">${t.formOptional}</span></span><textarea name="message" rows="3"></textarea></label>
                <button type="submit" class="btn btn-primary btn-block" style="padding:16px;">${t.formSubmit}</button>
                <p style="font-size:11.5px;color:var(--muted-2);text-align:center;margin:2px 0 0;line-height:1.5;">${t.formKvkk}</p>
              </div>
            </form>
            <div class="form-success">
              <div style="width:74px;height:74px;border-radius:50%;background:var(--cream-2);display:flex;align-items:center;justify-content:center;margin:0 auto 22px;color:var(--gold);">${icons.check({ w: 38 })}</div>
              <h3 style="font-size:30px;">${t.formThanks}</h3>
              <p style="font-size:15.5px;line-height:1.6;color:var(--muted-2);margin:0 auto 26px;max-width:360px;">${t.formThanksLead}</p>
              <a href="${waHref()}" class="btn btn-block" style="background:#25D366;color:#fff;" target="_blank" rel="noopener">${icons.wa} ${t.formWa}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}
