import { site } from "../data/site.mjs";
import { doctors } from "../data/content.mjs";
import { trustBadges, hasTrustBadges } from "../data/trust.mjs";
import { i18n } from "../data/i18n.mjs";
import { L, uiBits } from "../data/locale.mjs";
import { icons } from "./icons.mjs";
import { url, asset } from "./layout.mjs";

const imgSrc = (file) => asset(`/assets/img/${file}`);

/** Authority / certification row — hidden when no badges configured. */
export function trustStrip(lang) {
  if (!hasTrustBadges()) return "";
  const items = trustBadges
    .map(
      (b) => `<li class="trust-badge">
      <img src="${imgSrc(b.image)}" alt="${L(b.alt, lang)}" width="120" height="48" loading="lazy">
      <span class="trust-badge-label">${L(b.alt, lang)}</span>
    </li>`
    )
    .join("");
  return `<section class="trust-strip" aria-label="${L(uiBits.trustAria, lang)}">
    <div class="container">
      <ul class="trust-strip-list">${items}</ul>
    </div>
  </section>`;
}

/** Homepage doctor spotlight (first four). */
export function doctorStrip(lang) {
  const t = i18n[lang];
  const featured = doctors.slice(0, 4);
  const card = (d) =>
    `<a href="${url(lang, `doktorlar/${d.slug}/`)}" class="doctor-card" data-reveal>
      <span class="doctor-card-media"><img src="${imgSrc(d.image)}" alt="${d.name}" loading="lazy" width="320" height="400"></span>
      <span class="doctor-card-body">
        <span class="doctor-card-name">${d.name}</span>
        <span class="doctor-card-title">${L(d.titles, lang)}</span>
      </span>
    </a>`;
  return `<section class="section section-doctors" id="hekimler">
    <div class="container">
      <div class="doctor-strip-head" data-reveal>
        <div>
          <div class="eyebrow">${t.homeDoctorsEyebrow || t.doctorsTitle}</div>
          <h2 style="margin:0 0 10px;">${t.homeDoctorsTitle || t.doctorsTitle}</h2>
          <p class="lead" style="margin:0;">${t.homeDoctorsLead || t.doctorsLead}</p>
        </div>
        <a class="btn btn-ghost hide-sm" href="${url(lang, "doktorlar/")}">${t.allDoctorsCta || t.nav.doctors} ${icons.arrowSm}</a>
      </div>
      <div class="doctor-grid">${featured.map(card).join("")}</div>
      <div class="doctor-strip-foot" data-reveal>
        <a class="btn btn-ghost" href="${url(lang, "doktorlar/")}">${t.allDoctorsCta || t.nav.doctors} ${icons.arrowSm}</a>
      </div>
    </div>
  </section>`;
}

/** Google Maps embed block — only when mapsEmbed URL is set. */
export function mapEmbedBlock(lang, { title } = {}) {
  if (!site.mapsEmbed) return "";
  const heading = title || L(uiBits.mapTitle, lang);
  const mapsLink = site.mapsUrl || site.googleMapsUrl || "";
  const link = mapsLink
    ? `<a class="btn btn-ghost btn-sm" href="${mapsLink}" target="_blank" rel="noopener">${L(uiBits.openInMaps, lang)} ${icons.arrowSm}</a>`
    : "";
  return `<div class="map-embed" data-reveal>
    <div class="map-embed-head">
      <h3 style="margin:0;font-size:clamp(18px,2.5vw,22px);">${heading}</h3>
      ${link}
    </div>
    <iframe src="${site.mapsEmbed}" title="${heading}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
  </div>`;
}
