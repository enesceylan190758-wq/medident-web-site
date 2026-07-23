import { site } from "../data/site.mjs";
import { i18n } from "../data/i18n.mjs";
import { services, homeCards, packages } from "../data/content.mjs";
import { icons } from "./icons.mjs";
import { url, waHref, orgSchema, faqSchema, breadcrumbSchema } from "./layout.mjs";

export function homePage(lang) {
  const t = i18n[lang];
  const h = t.home;
  const svcUrl = (slug) => url(lang, "hizmetler/" + slug + "/");

  const stat = (s) =>
    `<div><div class="stat-num"><span data-to="${s.to}" ${s.dec ? `data-dec="${s.dec}"` : ""} ${s.sep ? 'data-sep="1"' : ""} ${s.suffix ? `data-suffix="${s.suffix}"` : ""}>0</span>${s.suffix ? "" : '<span>+</span>'}</div><div class="stat-label">${s.label}</div></div>`;

  const serviceCard = (c) => {
    const title = c.titles[lang];
    const href = svcUrl(c.service);
    return `<a href="${href}" class="card" data-reveal style="display:block;color:inherit;">
      <div class="icon-box">${icons[c.icon] || icons.smile}</div>
      <h3>${title}</h3>
      <p style="font-size:14.5px;line-height:1.6;color:var(--muted-2);margin:0;">${c.short[lang]}</p>
      <span class="link-more">${t.detail} ${icons.arrowSm}</span>
    </a>`;
  };

  const pkg = (p) => {
    const featured = p.featured;
    return `<div class="pkg ${featured ? "featured" : ""}" data-reveal>
      ${featured ? `<span class="pkg-badge">${t.popular}</span>` : ""}
      <h3>${p.titles[lang]}</h3>
      <p style="font-size:14px;color:${featured ? "#C9BEAC" : "var(--muted-2)"};margin:0 0 22px;">${p.leads[lang]}</p>
      <ul class="pkg-list">${p.items[lang]
        .map((it) => `<li style="color:${featured ? "#F4EEE4" : "var(--ink-soft)"}">${icons.check()} <span>${it}</span></li>`)
        .join("")}</ul>
      <div style="margin-top:auto;">
        <div style="font-size:12.5px;color:${featured ? "#C9BEAC" : "var(--muted-2)"};margin-bottom:4px;">${lang === "tr" ? "Şeffaf, her şey dâhil" : lang === "de" ? "Transparent, all-inclusive" : "Transparent, all-inclusive"}</div>
        <div style="font-family:var(--font-serif);font-weight:700;font-size:26px;color:${featured ? "#fff" : "var(--ink)"};margin-bottom:18px;">${t.customPrice}</div>
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

  const galleryImgs = Array.from({ length: 8 }, (_, i) => `/assets/img/gallery-${i + 1}.jpg`);

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
          <div class="rating-row">
            <span style="display:flex;align-items:center;gap:10px;"><span class="stars">★★★★★</span><span><strong style="color:var(--ink);">${site.rating.value}/5</strong> · ${h.rating.split("·")[1] || ""}</span></span>
            <span class="hide-sm"><strong style="color:var(--ink);">50+</strong> ${lang === "tr" ? "ülkeden mutlu hasta" : lang === "de" ? "Länder" : "countries"}</span>
          </div>
        </div>
        <div class="hero-media" data-reveal>
          <div class="hero-frame">
            <img src="/assets/img/portrait-a.jpg" alt="${site.brand} — ${h.eyebrow}" width="640" height="800">
          </div>
          <div class="float-card top-left">
            <div style="width:38px;height:38px;border-radius:10px;background:var(--cream-2);display:flex;align-items:center;justify-content:center;color:var(--gold);"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 6 20.4l1.4-6.8L2.3 9l6.9-.7z"></path></svg></div>
            <div style="line-height:1.15;"><div style="font-weight:800;font-size:15px;color:var(--ink);">4.9 / 5.0</div><div style="font-size:11.5px;color:var(--muted-2);">Google</div></div>
          </div>
          <button class="float-card bottom-right" data-lightbox-src="/assets/img/hero-beforeafter.png" aria-label="${t.before} / ${t.after}">
            <span style="border-radius:11px;overflow:hidden;aspect-ratio:3.6/1;background:var(--sand);display:block;"><img src="/assets/img/hero-beforeafter.png" alt="${t.before} & ${t.after}" style="width:100%;height:100%;object-fit:cover;object-position:center top;"></span>
            <span style="padding:9px 6px 4px;display:flex;align-items:center;gap:7px;"><span class="dot"></span><span style="font-size:12.5px;font-weight:700;color:var(--ink);">${lang === "tr" ? "Gerçek MediDent gülüşü" : lang === "de" ? "Echtes MediDent-Lächeln" : "Real MediDent smile"}</span></span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="stats" data-stats>
    <div class="stats-grid">${t.stats.map(stat).join("")}</div>
  </section>

  <section class="section" id="hizmetler">
    <div class="container">
      <div class="grid-2" data-reveal style="align-items:end;margin-bottom:clamp(38px,4vw,58px);gap:32px;">
        <div><div class="eyebrow">${t.servicesEyebrow}</div><h2 style="margin:0;">${t.servicesTitle}</h2></div>
        <p style="font-size:16px;line-height:1.62;color:var(--muted);margin:0 0 6px;">${t.servicesLead}</p>
      </div>
      <div class="grid-auto">${homeCards.map(serviceCard).join("")}</div>
      <div style="text-align:center;margin-top:36px;"><a href="${url(lang, "hizmetler/")}" class="btn btn-ghost">${t.allServices} ${icons.arrowSm}</a></div>
    </div>
  </section>

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
            <img src="/assets/img/after.jpg" alt="${t.after}">
            <img class="ba-before" src="/assets/img/before.jpg" alt="${t.before}">
            <span class="ba-label before">${t.before}</span>
            <span class="ba-label after">${t.after}</span>
            <div class="ba-handle"><div class="ba-knob"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 8L6 12l3.5 4M14.5 8l3.5 4-3.5 4"></path></svg></div></div>
          </div>
          <p style="text-align:center;font-size:13px;color:var(--muted-2);margin:16px 0 0;">${t.drag}</p>
        </div>
      </div>
      <div style="height:clamp(48px,6vw,72px);"></div>
      <div class="case-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(228px,1fr));gap:18px;">
        ${[["gallery-1", "Hollywood Smile"], ["gallery-3", "Porselen Lamina"], ["gallery-5", "Zirkonyum"], ["gallery-7", lang === "tr" ? "Gülüş Tasarımı" : "Smile Design"]]
          .map(
            ([img, label]) => `<button data-reveal data-lightbox-src="/assets/img/${img}.jpg" class="case-card">
          <img src="/assets/img/${img}.jpg" alt="${label} — ${site.brand}">
          <div class="shade"></div>
          <span class="case-badge">${t.before} &amp; ${t.after}</span>
          <span class="case-title">${label}</span>
        </button>`
          )
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
        ${galleryImgs.concat(galleryImgs).map((src) => `<button data-lightbox-src="${src}"><img src="${src}" alt="${site.brand}" loading="lazy"></button>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid-2" style="grid-template-columns:1fr 1.06fr;">
        <div data-reveal style="position:relative;">
          <div style="border-radius:26px;overflow:hidden;aspect-ratio:5/6;box-shadow:var(--shadow-lg);background:var(--sand);"><img src="/assets/img/about-portrait.jpg" alt="${site.brand}" style="width:100%;height:100%;object-fit:cover;"></div>
        </div>
        <div>
          <div class="eyebrow" data-reveal>${t.whyEyebrow}</div>
          <h2 data-reveal>${t.whyTitle}</h2>
          <p class="lead" data-reveal>${t.whyLead}</p>
          <div data-reveal style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:26px 28px;">
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
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:20px;">
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
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;align-items:stretch;">${packages.map(pkg).join("")}</div>
    </div>
  </section>

  <section class="section section-dark" id="yorumlar">
    <div class="container">
      <div style="text-align:center;max-width:620px;margin:0 auto clamp(42px,5vw,58px);">
        <div class="eyebrow center" data-reveal>${t.reviewsEyebrow}</div>
        <h2 data-reveal style="margin:0 0 14px;">${t.reviewsTitle}</h2>
        <p data-reveal style="font-size:16px;line-height:1.6;color:#C9BEAC;margin:0;">${t.reviewsLead}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(272px,1fr));gap:20px;">${t.reviews.map(review).join("")}</div>
    </div>
  </section>

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
          <div style="border-radius:24px;overflow:hidden;aspect-ratio:4/5;box-shadow:var(--shadow-lg);background:var(--sand);"><img src="/assets/img/clinic-1.jpg" alt="${site.brand}" style="width:100%;height:100%;object-fit:cover;"></div>
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
    title: `${site.brand} — ${lang === "tr" ? "Gülüş Tasarımı & Estetik Diş Hekimliği" : lang === "de" ? "Smile Design & Ästhetische Zahnmedizin" : "Smile Design & Aesthetic Dentistry"}`,
    description: h.lead,
    jsonld,
    image: site.domain + "/assets/img/portrait-a.jpg",
  };
}

const miniMinus = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"></path></svg>`;
const miniPlus = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg>`;

// Reusable contact section (also used on /iletisim/)
export function contactSection(lang, { heading = true } = {}) {
  const t = i18n[lang];
  const treatments = services.filter((s) => s.home).map((s) => s.titles[lang]);
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
            <a href="${site.mapsUrl}" target="_blank" rel="noopener"><span class="contact-ico">${icons.pin}</span><span><span style="display:block;font-size:12.5px;color:#A89D8B;">${t.addressLabel}</span><span style="font-weight:700;font-size:16px;">${site.address}</span></span></a>
            <div class="row"><span class="contact-ico">${icons.clock}</span><span><span style="display:block;font-size:12.5px;color:#A89D8B;">${t.hoursLabel}</span><span style="font-weight:700;font-size:16px;">${site.hours}</span></span></div>
          </div>
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
                <label><span class="lbl">${t.formTreatment}</span><select name="treatment">${treatments.map((x) => `<option>${x}</option>`).join("")}<option>${lang === "tr" ? "Henüz emin değilim" : lang === "de" ? "Noch unsicher" : "Not sure yet"}</option></select></label>
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
