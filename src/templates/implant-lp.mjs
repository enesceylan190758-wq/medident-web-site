// /dis-implant-fiyat/ — görsel ağırlıklı, tek konulu (implant) reklam landing'i.
// Tasarım dili: docs/google-ads/lp-design-reference.md (Odentrics / Dribbble)
// — büyük fotoğraflı hero, yuvarlak köşeli kartlar, 001/002 numaralı bölümler,
// pill butonlar, ✦ vurgular, büyük rakam kartları. Renkler/logo/foto/metin MediDent'in.
//
// Görsel kuralı: yalnızca repodaki GERÇEK MediDent hasta arşivi görselleri
// kullanılır. Eksik görseller `ph()` ile placeholder olarak işaretlenir
// (LP_PLACEHOLDERS=0 ile gizlenir); liste docs/google-ads/implant-lp-eksik-gorseller.md.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../data/site.mjs";
import { img } from "../data/images.mjs";
import { doctors, implantBrands } from "../data/content.mjs";
import { L } from "../data/locale.mjs";
import { asset, url, waHref, breadcrumb } from "./layout.mjs";
import { contactSection } from "./home.mjs";
import { icons } from "./icons.mjs";

const IMG_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../assets/images");
const SHOW_PH = process.env.LP_PLACEHOLDERS !== "0";
const src = (f) => asset(`/assets/img/${f}`);

/** <picture> — WebP varsa onu, yoksa JPG; alt-kırılım görseller lazy. */
function pic(file, alt, { eager = false, cls = "", sizes = "(max-width:768px) 100vw, 50vw" } = {}) {
  const base = file.replace(/\.(jpg|jpeg|png)$/i, "");
  const webpRel = fs.existsSync(path.join(IMG_DIR, "webp", `${base}.webp`))
    ? `webp/${base}.webp`
    : fs.existsSync(path.join(IMG_DIR, `${base}.webp`))
      ? `${base}.webp`
      : null;
  const load = eager ? `loading="eager" fetchpriority="high"` : `loading="lazy" decoding="async"`;
  const tag = `<img src="${src(file)}" alt="${alt}" ${load} class="${cls}">`;
  return webpRel ? `<picture><source srcset="${src(webpRel)}" type="image/webp" sizes="${sizes}">${tag}</picture>` : tag;
}

const sparkle = (cls = "") =>
  `<svg class="ilp-spark ${cls}" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.6 5.6 3.4 9.4 12 12-8.6 2.6-11.4 6.4-12 12-.6-5.6-3.4-9.4-12-12 8.6-2.6 11.4-6.4 12-12z" fill="currentColor"/></svg>`;

const toothIcon = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M7 3c-2.5 0-4 2-4 4.5 0 2 .8 3.6 1.4 5.2.6 1.7.6 3.6 1.1 5.2.4 1.3 1.1 2.6 2.3 2.6 1.6 0 1.6-4.2 3.2-4.2s1.6 4.2 3.2 4.2c1.2 0 1.9-1.3 2.3-2.6.5-1.6.5-3.5 1.1-5.2.6-1.6 1.4-3.2 1.4-5.2C21 5 19.5 3 17 3c-1.7 0-2.3.9-5 .9S8.7 3 7 3z"/></svg>`;

/** Eksik görsel placeholder'ı — gerçek fotoğraf gelince `ph()` çağrısı `pic()` ile değişir. */
function ph(title, spec, aspect = "4/3") {
  if (!SHOW_PH) return "";
  return `<div class="ilp-ph" style="aspect-ratio:${aspect};" role="img" aria-label="${title}" data-placeholder="${title}">${toothIcon}<b>${title}</b><span>${spec}</span></div>`;
}

/* ------------------------------------------------------------------ SVG'ler */

/** İmplant anatomisi — açılmış (exploded) görünüm: kron / abutment / titanyum vida. */
function anatomySvg() {
  const threads = Array.from({ length: 8 }, (_, i) => {
    const y = 268 + i * 15;
    return `<path d="M124 ${y} q36 8 72 0" stroke="#8b929c" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }).join("");
  return `<svg viewBox="0 0 400 470" class="ilp-anat" role="img" aria-label="Diş implantının parçaları: kron, abutment ve titanyum vida">
  <defs>
    <linearGradient id="gCrown" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ece5d8"/></linearGradient>
    <linearGradient id="gTi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9c0c9"/><stop offset=".5" stop-color="#e8ecf0"/><stop offset="1" stop-color="#a5adb8"/></linearGradient>
    <linearGradient id="gAb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b98f43"/><stop offset=".5" stop-color="#e2c27f"/><stop offset="1" stop-color="#a97f36"/></linearGradient>
  </defs>
  <g class="ilp-anat-part" style="--d:0s">
    <path d="M112 30c0-22 176-22 176 0l8 84c2 26-30 40-96 40s-98-14-96-40z" fill="url(#gCrown)" stroke="#2B2318" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M150 52c14-8 46-8 60 0" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".9"/>
    <text x="330" y="88" class="ilp-anat-l">Kron</text><path d="M296 84h28" class="ilp-anat-ln"/>
  </g>
  <g class="ilp-anat-part" style="--d:.15s">
    <path d="M156 178h88l10 62h-108z" fill="url(#gAb)" stroke="#2B2318" stroke-width="2.4" stroke-linejoin="round"/>
    <rect x="164" y="186" width="14" height="46" rx="6" fill="#fff" opacity=".28"/>
    <text x="330" y="214" class="ilp-anat-l">Abutment</text><path d="M262 210h62" class="ilp-anat-ln"/>
  </g>
  <g class="ilp-anat-part" style="--d:.3s">
    <path d="M118 262h164v96l-26 84h-112l-26-84z" fill="url(#gTi)" stroke="#2B2318" stroke-width="2.4" stroke-linejoin="round"/>
    ${threads}
    <rect x="186" y="246" width="28" height="18" rx="4" fill="#5a616b"/>
    <text x="330" y="360" class="ilp-anat-l">Titanyum</text><text x="330" y="380" class="ilp-anat-l">vida</text><path d="M288 366h36" class="ilp-anat-ln"/>
  </g>
  <path d="M200 156v14M200 244v12" stroke="#C6A15B" stroke-width="2.4" stroke-dasharray="3 6" stroke-linecap="round"/>
</svg>`;
}

/** Tedavi sahnesi (kesit) — n: 1 çekim, 2 yerleştirme, 3 iyileşme, 4 kron. */
function sceneSvg(n) {
  const neighbor = (x) => `<path d="M${x} 62c0-16 46-16 46 0l4 40c0 8-14 12-27 12s-27-4-27-12z" fill="#fff" stroke="#2B2318" stroke-width="2" stroke-linejoin="round"/>`;
  const screw = `<g class="sc-screw"><path d="M128 128h44v66l-12 34h-20l-12-34z" fill="url(#sTi)" stroke="#2B2318" stroke-width="2" stroke-linejoin="round"/>${[140, 152, 164, 176, 188, 200].map((y) => `<path d="M130 ${y} q20 6 40 0" stroke="#7f8791" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  const crown = `<g class="sc-crown"><path d="M124 46c0-16 52-16 52 0l4 38c0 12-20 18-30 18s-30-6-30-18z" fill="#fff" stroke="#2B2318" stroke-width="2.2" stroke-linejoin="round"/><path d="M138 100h24l4 28h-32z" fill="#d9b568" stroke="#2B2318" stroke-width="2" stroke-linejoin="round"/></g>`;
  const tooth = `<g class="sc-tooth"><path d="M118 44c0-18 64-18 64 0l4 44c0 10-8 14-18 14l-4 60c-1 12-8 24-14 24s-13-12-14-24l-4-60c-10 0-18-4-18-14z" fill="#fff" stroke="#2B2318" stroke-width="2.2" stroke-linejoin="round"/></g>`;
  const socket = `<path d="M124 118h52l-4 66c-1 10-8 20-22 20s-21-10-22-20z" fill="#5b3f36" opacity="${n === 1 ? ".75" : ".9"}"/>`;
  const ring = `<circle class="sc-ring" cx="150" cy="176" r="42" fill="none" stroke="#C6A15B" stroke-width="3" stroke-dasharray="6 8"/>`;
  return `<svg viewBox="0 0 300 260" class="ilp-scene sc-${n}" role="img" aria-label="Tedavi aşaması ${n}">
  <defs>
    <linearGradient id="sBone${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe2cb"/><stop offset="1" stop-color="#d9c5a0"/></linearGradient>
    <linearGradient id="sTi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9c0c9"/><stop offset=".5" stop-color="#eef1f4"/><stop offset="1" stop-color="#a5adb8"/></linearGradient>
  </defs>
  <rect x="10" y="112" width="280" height="140" rx="22" fill="url(#sBone${n})"/>
  ${Array.from({ length: 16 }, (_, i) => `<circle cx="${28 + ((i * 47) % 244)}" cy="${138 + ((i * 29) % 100)}" r="${2 + (i % 3)}" fill="#c9b184" opacity=".55"/>`).join("")}
  ${neighbor(34)}${neighbor(220)}
  ${n === 4 ? "" : ""}
  ${n === 1 ? tooth : ""}
  ${n >= 1 && n <= 2 ? socket : ""}
  ${n === 2 || n === 3 || n === 4 ? screw : ""}
  ${n === 3 ? ring : ""}
  ${n === 4 ? crown : ""}
  <path class="sc-gum" d="M10 112c30 8 60-6 90-2 30 4 70 4 100 0 30-4 60 10 90 2v14c-30 8-60-6-90-2-30 4-70 4-100 0-30-4-60 10-90 2z" fill="#e8a5a0" stroke="#c97e79" stroke-width="1.6"/>
  ${n === 3 ? `<path class="sc-cover" d="M112 104c14-8 62-8 76 0v22c-14 8-62 8-76 0z" fill="#e8a5a0" stroke="#c97e79" stroke-width="1.6"/>` : ""}
</svg>`;
}

const jawIcon = (kind) => {
  const teeth = (xs, missing = []) =>
    xs.map((x, i) => (missing.includes(i) ? `<circle cx="${x + 12}" cy="34" r="4" fill="#C6A15B"/>` : `<rect x="${x}" y="18" width="24" height="34" rx="9" fill="#fff" stroke="#2B2318" stroke-width="2"/>`)).join("");
  const xs = [8, 36, 64, 92, 120, 148, 176];
  const body = kind === "single" ? teeth(xs, [3]) : kind === "multi" ? teeth(xs, [2, 3, 4]) : teeth(xs, [0, 1, 2, 3, 4, 5, 6]);
  return `<svg viewBox="0 0 208 70" class="ilp-jaw" aria-hidden="true"><path d="M2 14c30-10 74-12 102-12s72 2 102 12v8c-30-8-74-8-102-8S32 14 2 22z" fill="#e8a5a0"/>${body}</svg>`;
};

const stepIcon = {
  camera: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
  plan: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/></svg>`,
  plane: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 14l20-8-6 14-4-5z"/><path d="M12 15l-1 5"/></svg>`,
  hotel: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20V8l9-5 9 5v12"/><path d="M9 20v-6h6v6"/></svg>`,
  check: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/></svg>`,
};

/* -------------------------------------------------------------------- CSS */

const CSS = `
.ilp{--ilp-r:28px;--ilp-dark:#231b12;overflow-x:clip}
.ilp h1,.ilp h2,.ilp h3{font-family:var(--font-serif)}
.ilp h2{font-size:clamp(30px,4.4vw,52px);line-height:1.04;letter-spacing:-.01em;margin:0 0 14px;color:var(--ink)}
.ilp h2 em,.ilp h1 em{font-style:italic;color:var(--red-deep)}
.ilp-wrap{max-width:1200px;margin:0 auto;padding:0 24px}
.ilp-sec{padding:clamp(56px,8vw,104px) 0}
.ilp-num{display:inline-flex;align-items:center;gap:10px;font-size:12.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted-2);margin:0 0 16px}
.ilp-num::before{content:"";width:34px;height:1px;background:var(--gold)}
.ilp-lead{font-size:clamp(15.5px,1.6vw,18px);line-height:1.6;color:var(--muted);max-width:560px;margin:0 0 26px}
.ilp-spark{color:var(--gold)}
.ilp-btn{display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:16px 28px;font-weight:700;font-size:15.5px;text-decoration:none;transition:transform .2s,box-shadow .2s;border:1.5px solid transparent;cursor:pointer;line-height:1}
.ilp-btn:hover{transform:translateY(-2px)}
.ilp-btn-dark{background:var(--ilp-dark);color:#fff;box-shadow:0 18px 30px -18px rgba(28,21,13,.7)}
.ilp-btn-light{background:#fff;color:var(--ink);border-color:rgba(43,35,24,.16)}
.ilp-btn-wa{background:#25D366;color:#fff}
.ilp-btn svg{flex:none}
/* hero */
.ilp-hero{position:relative;padding:clamp(20px,3vw,36px) 0 clamp(40px,6vw,72px);background:radial-gradient(1200px 500px at 85% -10%,#f3e6cf 0,transparent 60%),var(--cream)}
.ilp-hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(28px,5vw,64px);align-items:center}
.ilp-pill{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(43,35,24,.12);border-radius:999px;padding:8px 16px;font-size:12.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);margin:0 0 20px}
.ilp-pill i{width:7px;height:7px;border-radius:50%;background:var(--red)}
.ilp-hero h1{font-size:clamp(42px,6.4vw,88px);line-height:.98;letter-spacing:-.02em;margin:0 0 18px;color:var(--ink)}
.ilp-cta-row{display:flex;flex-wrap:wrap;gap:12px;margin:0 0 30px}
.ilp-mini{display:flex;flex-wrap:wrap;gap:10px 28px}
.ilp-mini div{display:flex;flex-direction:column}
.ilp-mini strong{font-family:var(--font-serif);font-size:30px;line-height:1;color:var(--ink)}
.ilp-mini span{font-size:12.5px;color:var(--muted-2);margin-top:4px}
.ilp-hero-media{position:relative}
.ilp-hero-photo{border-radius:var(--ilp-r);overflow:hidden;aspect-ratio:4/5;background:var(--sand);box-shadow:var(--shadow-lg)}
.ilp-hero-photo img,.ilp-hero-photo picture{width:100%;height:100%;object-fit:cover;display:block}
.ilp-chip{position:absolute;background:#fff;border-radius:18px;padding:12px 16px;box-shadow:0 20px 40px -22px rgba(43,35,24,.55);display:flex;align-items:center;gap:10px;font-size:13px;color:var(--ink-soft)}
.ilp-chip strong{font-family:var(--font-serif);font-size:24px;color:var(--ink);line-height:1}
.ilp-chip.a{left:-22px;bottom:34px}
.ilp-chip.b{right:-14px;top:34px;background:var(--ilp-dark);color:#f3e9d8}
.ilp-chip.b strong{color:#fff}
.ilp-hero-media .ilp-spark{position:absolute}
/* stat cards */
.ilp-cards3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:clamp(28px,4vw,48px)}
.ilp-stat{border-radius:var(--ilp-r);padding:clamp(22px,3vw,34px);position:relative;background:#eef3ea;color:var(--ink)}
.ilp-stat.dark{background:var(--ilp-dark);color:#f3e9d8}
.ilp-stat.gold{background:#f3e6cf}
.ilp-stat b{display:block;font-family:var(--font-serif);font-size:clamp(46px,6vw,84px);line-height:.95;letter-spacing:-.02em}
.ilp-stat span{display:block;margin-top:12px;font-size:14.5px;line-height:1.45;max-width:230px;opacity:.85}
.ilp-stat .ilp-spark{position:absolute;top:22px;right:22px}
/* anatomy */
.ilp-two{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,72px);align-items:center}
.ilp-anat-card{border-radius:var(--ilp-r);background:linear-gradient(160deg,#f6efe2,#ebe0cc);padding:clamp(18px,3vw,36px);position:relative}
.ilp-anat{width:100%;height:auto;display:block}
.ilp-anat-l{font:700 15px var(--font-sans);fill:#2B2318}
.ilp-anat-ln{stroke:#2B2318;stroke-width:1.6;fill:none}
.ilp-anat-part{transform-box:fill-box;transform-origin:center;opacity:0;transform:translateY(-14px);transition:opacity .7s ease var(--d),transform .8s cubic-bezier(.2,.7,.2,1) var(--d)}
.ilp-anat-card.is-in .ilp-anat-part{opacity:1;transform:none}
.ilp-feat{display:flex;gap:16px;align-items:flex-start;padding:18px 0;border-top:1px solid rgba(43,35,24,.1)}
.ilp-feat:first-of-type{border-top:0}
.ilp-ico{flex:none;width:52px;height:52px;border-radius:50%;background:#fff;border:1px solid rgba(43,35,24,.1);display:flex;align-items:center;justify-content:center;color:var(--red-deep)}
.ilp-feat h3{font-size:22px;margin:0 0 4px}
.ilp-feat p{margin:0;font-size:15px;line-height:1.5;color:var(--muted)}
/* options */
.ilp-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.ilp-opt{border-radius:var(--ilp-r);background:#fff;border:1px solid rgba(43,35,24,.08);padding:clamp(20px,2.4vw,30px);display:flex;flex-direction:column;box-shadow:0 26px 50px -40px rgba(43,35,24,.5)}
.ilp-opt.feat{background:var(--ilp-dark);color:#f3e9d8}
.ilp-jaw{width:100%;max-width:260px;height:auto;margin:0 0 20px}
.ilp-q{display:inline-block;align-self:flex-start;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:6px 12px;border-radius:99px;background:rgba(198,161,91,.18);color:#7a5c1e;margin-bottom:16px}.ilp-opt.feat .ilp-q{background:rgba(255,255,255,.14);color:#f3e9d8}
.ilp-opt h3{font-size:26px;margin:0 0 6px}
.ilp-opt p{margin:0 0 18px;font-size:14.5px;line-height:1.5;color:var(--muted)}
.ilp-opt.feat p{color:#cbbfa9}
.ilp-opt.feat h3,.ilp-opt.feat .ilp-price{color:#fff}
.ilp-final h2,.ilp-stat.dark b{color:#fff}
.ilp-price{margin-top:auto;font-family:var(--font-serif);font-size:30px;line-height:1.1}
.ilp-price small{display:block;font:500 13px var(--font-sans);color:var(--muted-2);margin-top:4px}
.ilp-opt.feat .ilp-price small{color:#b8ac95}
/* steps */
.ilp-cap{font-size:13px;color:var(--muted);margin:8px 0 0}.ilp-fig{margin:0}.ilp-fig img{width:100%;height:auto;display:block;border-radius:var(--ilp-r)}.ilp-fig figcaption,.ilp-vid figcaption{font-size:13px;color:var(--muted);margin-top:8px}
.ilp-xr{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:20px}
.ilp-vids{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:16px}.ilp-vid-main .ilp-vid video{aspect-ratio:16/9;box-shadow:0 30px 60px -36px rgba(43,35,24,.55)}.ilp-vid-main figcaption{font-size:15px!important;font-weight:600;color:var(--ilp-dark)!important}
.ilp-vid{margin:0}.ilp-vid video{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:var(--ilp-r);background:#f3ede0;display:block}
.ilp-hero-photo{aspect-ratio:4/5.5}
.ilp-hero .ilp-hf{position:absolute;left:14px;right:14px;bottom:14px;z-index:3;display:block;padding:16px 16px 12px;border-radius:22px;background:rgba(255,255,255,.75);-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3);border:1px solid rgba(255,255,255,.65);box-shadow:0 24px 60px -18px rgba(43,35,24,.5)}
.ilp-hf form{display:grid;gap:9px}.ilp-hf-t{font-family:var(--font-serif);font-size:22px;line-height:1.1;color:var(--ink)}
.ilp-hf input,.ilp-hf select{width:100%;box-sizing:border-box;padding:12px 13px;border-radius:12px;border:1px solid rgba(43,35,24,.16);background:rgba(255,255,255,.92);font:inherit;font-size:15px;color:var(--ink)}
.ilp-hf-ph{display:grid;grid-template-columns:104px 1fr;gap:8px}
.ilp-hf .ilp-btn{width:100%;justify-content:center;border:0;cursor:pointer}.ilp-hf small{font-size:11px;line-height:1.4;color:var(--muted);text-align:center}
.ilp-hf .form-success{padding:10px 4px}.ilp-hf .form-success h3{font-size:24px;margin:0 0 6px}.ilp-hf .form-success p{margin:0;font-size:14px}
.ilp-hf.form-card.is-sent .form-main{display:none}
.ilp-sticky{display:none;--ilp-dark:#231b12;--ilp-r:22px}
.ilp-story h2{margin:0 0 26px}.ilp-story-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:clamp(20px,4vw,56px);align-items:start}
.ilp-story-stick{position:sticky;top:92px}
.ilp-story-meta{display:flex;align-items:center;gap:14px;margin-bottom:12px}.ilp-story-meta b{font-size:14px;letter-spacing:.06em;color:var(--ilp-dark);min-width:34px}
.ilp-story-bar{flex:1;height:4px;border-radius:4px;background:rgba(43,35,24,.12);overflow:hidden}.ilp-story-bar i{display:block;height:100%;width:0;background:var(--gold,#b8935a);transform-origin:left}
.ilp-story-frame{position:relative;aspect-ratio:2/1;border-radius:var(--ilp-r);overflow:hidden;background:#111;box-shadow:var(--shadow-lg)}
.ilp-sc{position:absolute;inset:0;margin:0;opacity:0;transition:opacity .45s ease}.ilp-sc.on{opacity:1}
.ilp-sc .sc-b,.ilp-sc .sc-a{position:absolute;inset:0}.ilp-sc picture,.ilp-sc img{width:100%;height:100%;object-fit:cover;display:block}
.ilp-sc .sc-a{clip-path:inset(0 0 0 100%);will-change:clip-path}
.ilp-sc .ba-label{position:absolute}
.ilp-sst{min-height:105vh;display:flex;flex-direction:column;justify-content:center;padding:20px 0}
.ilp-sst-n{font-size:13px;font-weight:700;letter-spacing:.08em;color:var(--gold,#b8935a);margin-bottom:8px}
.ilp-sst h3{font-size:clamp(26px,3vw,36px);margin:0 0 12px}.ilp-sst ul{margin:0;padding:0;list-style:none;display:grid;gap:6px;font-size:16px;color:var(--muted)}.ilp-sst li b{color:var(--ink)}
.ilp-sst-cta{min-height:70vh;align-items:flex-start}.ilp-sst-cta .ilp-btn{border:0;cursor:pointer}
.ilp-steps.sm{grid-template-columns:repeat(4,1fr);gap:14px}.ilp-steps.sm .ilp-step h3{font-size:19px}.ilp-steps.sm .ilp-step-body{padding:14px 16px 18px}.ilp-steps.sm .ilp-step p{font-size:13.5px}.ilp-steps.sm .ilp-step-n{width:28px;height:28px;font-size:12px}
@media (prefers-reduced-motion:reduce){
  .ilp-story-stick{position:static}.ilp-story-grid{grid-template-columns:1fr}.ilp-story-meta{display:none}.ilp-story-frame{display:none}
  .ilp-sst{min-height:auto;padding:24px 0}.ilp-sst .ilp-sc{position:static;opacity:1;display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
  .ilp-sst .ilp-sc>div{position:relative;aspect-ratio:2/1;border-radius:14px;overflow:hidden}.ilp-sst .ilp-sc .sc-a{clip-path:none}.ilp-sst .ilp-sc .ba-label{display:none}
}

.ilp-steps{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;position:relative}
.ilp-step{border-radius:var(--ilp-r);background:#fff;border:1px solid rgba(43,35,24,.08);overflow:hidden;box-shadow:0 26px 50px -40px rgba(43,35,24,.5)}
.ilp-step-vis{background:linear-gradient(180deg,#faf3e6,#f1e6d1);padding:14px 14px 0}
.ilp-scene{width:100%;height:auto;display:block}
.ilp-step-body{padding:20px 24px 26px}
.ilp-step-n{display:inline-flex;width:34px;height:34px;border-radius:50%;background:var(--ilp-dark);color:#fff;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-bottom:10px}
.ilp-step h3{font-size:26px;margin:0 0 6px}
.ilp-step p{margin:0;font-size:15px;line-height:1.55;color:var(--muted)}
.sc-tooth{transition:transform 1.4s cubic-bezier(.3,.7,.2,1) .2s,opacity 1.2s ease .5s}
.sc-screw{transform:translateY(-120px);transition:transform 1.6s cubic-bezier(.3,.7,.2,1) .2s}
.sc-3 .sc-screw,.sc-4 .sc-screw{transform:none}
.sc-crown{transform:translateY(-110px);opacity:.0;transition:transform 1.5s cubic-bezier(.3,.7,.2,1) .3s,opacity .6s ease .3s}
.sc-cover{transform:translateY(-30px);opacity:0;transition:transform 1.2s ease .3s,opacity .8s ease .3s}
.sc-ring{opacity:0;transform-origin:150px 176px;transition:opacity 1s ease .8s}
.is-in .sc-2 .sc-screw,.ilp-step.is-in .sc-2 .sc-screw{transform:none}
.ilp-step.is-in .sc-1 .sc-tooth{transform:translateY(-95px);opacity:0}
.ilp-step.is-in .sc-3 .sc-cover{transform:none;opacity:1}
.ilp-step.is-in .sc-3 .sc-ring{opacity:1;animation:ilpSpin 14s linear infinite}
.ilp-step.is-in .sc-4 .sc-crown{transform:none;opacity:1}
@keyframes ilpSpin{to{transform:rotate(360deg)}}
/* brands */
.ilp-brands{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.ilp-brand{border-radius:var(--ilp-r);background:#fff;border:1px solid rgba(43,35,24,.08);padding:22px;display:flex;flex-direction:column;gap:16px}
.ilp-logo{height:64px;display:flex;align-items:center;padding:0 6px}
.ilp-logo.dark{background:var(--ilp-dark);border-radius:14px;padding:0 18px;width:fit-content}
.ilp-logo img{max-height:44px;max-width:170px;object-fit:contain}
.ilp-brand p{margin:0;font-size:14.5px;line-height:1.55;color:var(--muted)}
/* placeholders */
.ilp-ph{border:2px dashed rgba(198,161,91,.7);border-radius:20px;background:repeating-linear-gradient(135deg,#fbf6ea,#fbf6ea 14px,#f6eedb 14px,#f6eedb 28px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6px;padding:16px;color:var(--gold-ink)}
.ilp-ph b{font-size:14px}
.ilp-ph span{font-size:12px;opacity:.75}
/* results + gallery */
.ilp-ba-wrap{border-radius:var(--ilp-r);overflow:hidden;box-shadow:var(--shadow-lg)}
.ilp-gal{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:18px}
.ilp-gal>*{border-radius:22px;overflow:hidden;aspect-ratio:4/5;background:var(--sand)}
.ilp-gal img,.ilp-gal picture{width:100%;height:100%;object-fit:cover;display:block}
.ilp-note{font-size:13px;color:var(--muted-2);margin:14px 0 0}
/* clinic */
.ilp-map{border-radius:var(--ilp-r);overflow:hidden;box-shadow:var(--shadow-lg);aspect-ratio:16/6;background:var(--sand)}.ilp-map iframe{width:100%;height:100%;border:0;display:block}
.ilp-addr{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:22px;font-size:15px;color:var(--ink-soft)}
/* doctors */
.ilp-docs{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.ilp-doc{text-align:center;color:inherit;text-decoration:none}
.ilp-av{width:min(132px,60%);aspect-ratio:1;border-radius:50%;margin:0 auto 12px;background:linear-gradient(135deg,var(--gold),var(--red-deep));display:flex;align-items:center;justify-content:center;font:700 34px var(--font-serif);color:#fff;overflow:hidden}
.ilp-av img{width:100%;height:100%;object-fit:cover}
.ilp-doc b{display:block;font-size:15.5px}
.ilp-doc span{font-size:12.5px;color:var(--gold);font-weight:700}
/* reviews */
.ilp-rev{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ilp-rv{border-radius:24px;background:#fff;border:1px solid rgba(43,35,24,.08);padding:22px}
.ilp-rv .st{color:var(--gold);letter-spacing:2px}
.ilp-rv p{font-size:15px;line-height:1.55;margin:10px 0 14px;color:var(--ink-soft)}
.ilp-rv small{color:var(--muted-2)}
/* price + faq + cta */
.ilp-tbl{border-radius:22px;overflow:hidden;border:1px solid rgba(43,35,24,.1);background:#fff}
.ilp-tbl div{display:flex;justify-content:space-between;gap:16px;padding:15px 20px;border-top:1px solid rgba(43,35,24,.07);font-size:15.5px}
.ilp-tbl div:first-child{border-top:0}
.ilp-tbl div b{white-space:nowrap}
.ilp-final{border-radius:36px;background:var(--ilp-dark);color:#f3e9d8;padding:clamp(34px,6vw,72px);text-align:center;position:relative;overflow:hidden}
.ilp-final h2{color:#fff;max-width:760px;margin:0 auto 14px}
.ilp-final h2 em{color:#e7c47a}
.ilp-final p{max-width:520px;margin:0 auto 26px;color:#cbbfa9}
.ilp-final .ilp-cta-row{justify-content:center;margin:0}
.ilp-final .ilp-spark{position:absolute;color:#e7c47a;opacity:.8}
.ilp-band{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;background:#fff;border:1px solid rgba(43,35,24,.1);border-radius:26px;padding:20px 26px;margin-top:clamp(24px,3vw,40px)}
.ilp-band b{font-family:var(--font-serif);font-size:24px}
.ilp [data-io]{opacity:0;transform:translateY(22px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.ilp [data-io].is-in{opacity:1;transform:none}
@media (max-width:900px){
  .ilp-hero-grid,.ilp-two{grid-template-columns:1fr}

  .ilp-hero-photo{aspect-ratio:16/11}
  .ilp-hero .ilp-hf{position:relative;left:auto;right:auto;bottom:auto;margin:-40px 12px 0}
  .ilp-story-grid{grid-template-columns:1fr}.ilp-story-stick{top:64px;z-index:5;background:var(--cream);padding:8px 0 6px}
  .ilp-story-frame{aspect-ratio:16/9}.ilp-sst{min-height:75vh}.ilp-sst-cta{min-height:55vh}
  .ilp-steps.sm{grid-template-columns:repeat(2,1fr)}
  .ilp-sticky{display:block;position:fixed;left:0;right:0;bottom:0;z-index:80;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(250,246,239,.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 -10px 30px -18px rgba(43,35,24,.5);transform:translateY(115%);transition:transform .25s ease}
  .ilp-sticky.on{transform:none}.ilp-sticky .ilp-btn{width:100%;justify-content:center;border:0;cursor:pointer}
  body.ilp-has-sticky .wa-float{bottom:86px}
  .ilp-chip.a{left:12px}.ilp-chip.b{right:12px}
  .ilp-cards3,.ilp-opts,.ilp-brands,.ilp-rev{grid-template-columns:1fr}
  .ilp-steps{grid-template-columns:1fr}
  .ilp-xr,.ilp-vids{grid-template-columns:1fr}
  .ilp-gal{grid-template-columns:repeat(2,1fr)}
  .ilp-map{aspect-ratio:4/3}
  .ilp-docs{grid-template-columns:repeat(2,1fr)}
  .ilp-btn{width:100%;justify-content:center}
  .ilp-cta-row{flex-direction:column}
}
@media (prefers-reduced-motion:reduce){
  .ilp *{transition:none!important;animation:none!important}
  .ilp [data-io],.ilp-anat-part{opacity:1!important;transform:none!important}
  .sc-screw,.sc-crown,.sc-cover,.sc-ring{transform:none!important;opacity:1!important}
}
`;

const JS = `<script>(function(){
  var els=document.querySelectorAll('.ilp [data-io],.ilp-step,.ilp-anat-card');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}})},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){io.observe(e)});
  var vs=document.querySelectorAll('.ilp-vid video');
  if('IntersectionObserver' in window&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var vo=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}})},{threshold:.4});
    vs.forEach(function(v){vo.observe(v)});
  }else{vs.forEach(function(v){v.controls=true;});}
  /* --- Gerçek sonuçlar: scroll-driven (rAF + passive scroll) --- */
  var story=document.querySelector('[data-story]');
  if(story){
    var sc=[].slice.call(story.querySelectorAll('.ilp-sc')), ss=[].slice.call(story.querySelectorAll('.ilp-sst')), N=sc.length;
    var cnt=story.querySelector('[data-story-count]'), bar=story.querySelector('[data-story-bar]');
    var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(rm){ sc.forEach(function(f,i){ if(ss[i]) ss[i].insertBefore(f,ss[i].firstChild); f.classList.add('on'); }); }
    else{
      var ticking=false, cur=-1;
      var clamp=function(x){return x<0?0:x>1?1:x};
      var upd=function(){
        ticking=false;
        var mid=window.innerHeight*(window.innerWidth<=900?.62:.5), idx=0, lp=0;
        for(var i=0;i<ss.length;i++){var r=ss[i].getBoundingClientRect(); if(r.top<=mid){idx=i; lp=clamp((mid-r.top)/r.height);}}
        var ci=Math.min(idx,N-1), rev=idx>=N?1:clamp((lp-.2)/.5);
        if(ci!==cur){ sc.forEach(function(f,i){f.classList.toggle('on',i===ci)}); cur=ci; if(cnt) cnt.textContent=(ci+1)+'/'+N; }
        sc[ci].querySelector('.sc-a').style.clipPath='inset(0 0 0 '+((1-rev)*100).toFixed(1)+'%)';
        if(bar) bar.style.width=(clamp((Math.min(idx,N-1)+(idx>=N?1:lp))/N)*100).toFixed(1)+'%';
      };
      var onS=function(){ if(!ticking){ticking=true; requestAnimationFrame(upd);} };
      window.addEventListener('scroll',onS,{passive:true}); window.addEventListener('resize',onS); upd();
    }
    var sb=story.querySelector('[data-story-cta]'); if(sb) sb.addEventListener('click',function(){ var h=document.getElementById('hero-form'); if(h) h.scrollIntoView({behavior:rm?'auto':'smooth',block:'center'}); });
  }
  /* --- Mobil sabit "Ücretsiz Plan Al" butonu --- */
  var stk=document.querySelector('[data-ilp-sticky]'), hfEl=document.getElementById('hero-form'), ctEl=document.getElementById('iletisim');
  if(stk&&hfEl){
    var vis={h:false,c:false}, rm2=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var set=function(){var on=!(vis.h||vis.c); stk.classList.toggle('on',on); document.body.classList.toggle('ilp-has-sticky',on);};
    if('IntersectionObserver' in window){
      var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.target===hfEl)vis.h=e.isIntersecting; else vis.c=e.isIntersecting;}); set();},{threshold:.15});
      so.observe(hfEl); if(ctEl) so.observe(ctEl);
    } else { stk.classList.add('on'); }
    stk.querySelector('button').addEventListener('click',function(){ hfEl.scrollIntoView({behavior:rm2?'auto':'smooth',block:'center'}); setTimeout(function(){var n=hfEl.querySelector('input[name=name]'); if(n&&n.focus) n.focus({preventScroll:true});},500); });
  }
})();</script>`;

/* ------------------------------------------------------------------ sayfa */

export function implantLandingBody({ lang, t, p, crumbs, wa }) {
  const lp = p.lp;
  const io = (extra = "") => `data-io ${extra}`;
  const contact = url(lang, "iletisim/");
  const initials = (n) => n.replace(/^(Dr\.|Dt\.)\s*/gi, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const stats = t.stats || [];
  const statVal = (i) => {
    const s = stats[i];
    if (!s) return "";
    return s.dec ? s.to.toFixed(s.dec) + (s.suffix || "") : (s.sep ? Math.round(s.to).toLocaleString("tr-TR") : Math.round(s.to)) + "+";
  };

  const hf = lp.hf;
  const ccs = [["+90","TR"],["+49","DE"],["+43","AT"],["+41","CH"],["+33","FR"],["+31","NL"],["+32","BE"],["+44","UK"],["+7","RU"]];
  const heroForm = `<div class="ilp-hf form-card" id="hero-form">
        <form class="form-main" data-lead-form data-hero-form novalidate>
          <b class="ilp-hf-t">${hf.title}</b>
          <input type="text" name="name" required autocomplete="name" placeholder="${hf.name}" aria-label="${hf.name}">
          <div class="ilp-hf-ph">
            <select name="cc" aria-label="Ülke kodu">${ccs.map(([c, n], i) => `<option value="${c}"${i === 0 ? " selected" : ""}>${c} ${n}</option>`).join("")}</select>
            <input type="tel" name="phone" required inputmode="tel" autocomplete="tel-national" placeholder="${hf.phone}" aria-label="${hf.phone}">
          </div>
          <select name="treatment" aria-label="${hf.treat}"><option value="">${hf.treat}</option>${hf.treats.map((x, i) => `<option value="tedavi-${i + 1}">${x}</option>`).join("")}</select>
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
          <button type="submit" class="ilp-btn ilp-btn-dark">${hf.submit}</button>
          <small>${hf.note}</small>
        </form>
        <div class="form-success"><h3>${hf.thanks}</h3><p>${hf.thanksLead}</p></div>
      </div>`;
  const hero = `<section class="ilp-hero"><div class="ilp-wrap">
    ${breadcrumb(lang, crumbs)}
    <div class="ilp-hero-grid" style="margin-top:14px;">
      <div>
        <div class="ilp-pill"><i></i>${p.eyebrow}</div>
        <h1 data-dtr-h1>${p.h1}</h1>
        <p class="ilp-lead" data-dtr-lead>${p.lead}</p>
        <div class="ilp-cta-row">
          <a data-dtr-cta href="${wa}" target="_blank" rel="noopener" class="ilp-btn ilp-btn-dark">${icons.wa} ${p.ctaPrimary}</a>
          <a href="${contact}" class="ilp-btn ilp-btn-light">${p.ctaSecondary}</a>
        </div>
        <div class="ilp-mini">
          <div><strong>${statVal(0)}</strong><span>${stats[0]?.label || ""}</span></div>
          <div><strong>${statVal(1)}</strong><span>${stats[1]?.label || ""}</span></div>
          <div><strong>${statVal(3)}</strong><span>${stats[3]?.label || ""}</span></div>
        </div>
      </div>
      <div class="ilp-hero-media">
        <div class="ilp-hero-photo">${pic("portrait-a.jpg", "MediDent İstanbul hastası — gülüş", { eager: true, sizes: "(max-width:900px) 100vw, 46vw" })}</div>
        ${heroForm}
        <div class="ilp-chip a"><strong>${lp.fromPrice}</strong><span>${lp.fromPriceLabel}</span></div>
        <div class="ilp-chip b"><strong>4.9</strong><span>Google<br>puanı</span></div>
        ${sparkle("").replace("<svg", '<svg style="top:-10px;left:18%"')}
      </div>
    </div>
    <div class="ilp-cards3">
      <div class="ilp-stat gold" ${io()}>${sparkle()}<b>${lp.fromPrice}</b><span>${lp.fromPriceLabel}</span></div>
      <div class="ilp-stat dark" ${io('style="transition-delay:.08s"')}>${sparkle()}<b>${statVal(1)}</b><span>${stats[1]?.label || ""}</span></div>
      <div class="ilp-stat" ${io('style="transition-delay:.16s"')}>${sparkle()}<b>${statVal(0)}</b><span>${stats[0]?.label || ""}</span></div>
    </div>
  </div></section>`;

  const vidTag = (n, c) => `<figure class="ilp-vid"><video muted loop playsinline preload="none" poster="${src("video/"+n+"-poster.webp")}" aria-label="${c}"><source src="${src("video/"+n+".mp4")}" type="video/mp4"></video><figcaption>${c}</figcaption></figure>`;
  const showcase = `<section class="ilp-sec" style="padding-top:clamp(28px,4vw,52px);padding-bottom:0;"><div class="ilp-wrap">
    <div ${io()} class="ilp-vid-main">${vidTag("implant-asamalar","İmplant tedavisi nasıl yapılır? — 4 aşamalı animasyon")}</div>
    <div class="ilp-vids" ${io()}>${vidTag("implant-tek","Tek diş implant")}${vidTag("implant-all-on-4","All-on-4")}</div>
  </div></section>`;

  const st = lp.story;
  const storyCases = st.cases.filter((c) => c.files.every((fl) => fs.existsSync(path.join(IMG_DIR, fl))));
  const story = `<section class="ilp-sec ilp-story" id="gercek-sonuclar" data-story style="padding-top:clamp(28px,4vw,56px);"><div class="ilp-wrap">
    <div class="ilp-num">${st.tag}</div><h2>${st.h2}</h2>
    <div class="ilp-story-grid">
      <div class="ilp-story-stick">
        <div class="ilp-story-meta"><b data-story-count>1/${storyCases.length}</b><div class="ilp-story-bar"><i data-story-bar></i></div></div>
        <div class="ilp-story-frame">
          ${storyCases.map((c, i) => `<figure class="ilp-sc${i === 0 ? " on" : ""}" data-sc="${i}"><div class="sc-b">${pic(c.files[0], c.alt + " — " + st.before, { sizes: "(max-width:900px) 100vw, 60vw" })}</div><div class="sc-a">${pic(c.files[1], c.alt + " — " + st.after, { sizes: "(max-width:900px) 100vw, 60vw" })}</div><span class="ba-label before">${st.before}</span><span class="ba-label after">${st.after}</span></figure>`).join("")}
        </div>
      </div>
      <div class="ilp-story-steps">
        ${storyCases.map((c, i) => `<article class="ilp-sst" data-ss="${i}"><span class="ilp-sst-n">${i + 1}/${storyCases.length}</span><h3>${c.t}</h3><ul><li><b>Tedavi:</b> ${c.treatment}</li>${c.duration ? `<li><b>Süre:</b> ${c.duration}</li>` : ""}${c.country ? `<li><b>Hasta ülkesi:</b> ${c.country}</li>` : ""}</ul></article>`).join("")}
        <article class="ilp-sst ilp-sst-cta" data-ss="${storyCases.length}"><h3>${st.ctaTitle}</h3><button type="button" class="ilp-btn ilp-btn-dark" data-story-cta>${st.ctaBtn}</button></article>
      </div>
    </div>
  </div></section>`;
  const sticky = `<div class="ilp-sticky" data-ilp-sticky><button type="button" class="ilp-btn ilp-btn-dark">${hf.sticky}</button></div>`;
  const anatomy = `<section class="ilp-sec" style="padding-top:clamp(40px,6vw,72px);"><div class="ilp-wrap ilp-two">
    <div class="ilp-anat-card" ${io()}>${anatomySvg()}</div>
    <div ${io()}>
      <div class="ilp-num">${lp.s1.num} — ${lp.s1.tag}</div>
      <h2>${lp.s1.h2}</h2>
      <p class="ilp-lead">${lp.s1.lead}</p>
      ${lp.s1.parts.map((f, i) => `<div class="ilp-feat"><div class="ilp-ico">${[stepIcon.check, stepIcon.plan, stepIcon.hotel][i]}</div><div><h3>${f.t}</h3><p>${f.d}</p></div></div>`).join("")}
    </div>
  </div></section>`;

  const options = `<section class="ilp-sec" style="background:#fff;"><div class="ilp-wrap">
    <div ${io()} style="max-width:640px;margin-bottom:34px;"><div class="ilp-num">${lp.s2.num} — ${lp.s2.tag}</div><h2>${lp.s2.h2}</h2></div>
    <div class="ilp-opts">
      ${lp.s2.items
        .map(
          (o, i) => `<div class="ilp-opt ${i === 1 ? "feat" : ""}" ${io(`style="transition-delay:${i * 0.08}s"`)}>
        <span class="ilp-q">${o.q}</span>
        ${jawIcon(o.kind)}
        <h3>${o.t}</h3><p>${o.d}</p>
        <div class="ilp-price">${o.price}<small>${o.note}</small></div>
      </div>`
        )
        .join("")}
    </div>
    <div class="ilp-band" ${io()}><b>${lp.bandTitle}</b><a data-dtr-cta href="${wa}" target="_blank" rel="noopener" class="ilp-btn ilp-btn-dark">${icons.wa} ${p.ctaPrimary}</a></div>
  </div></section>`;

  const steps = `<section class="ilp-sec"><div class="ilp-wrap">
    <div ${io()} style="max-width:680px;margin-bottom:34px;"><div class="ilp-num">${lp.s3.num} — ${lp.s3.tag}</div><h2>${lp.s3.h2}</h2><p class="ilp-lead">${lp.s3.lead}</p></div>
    <div class="ilp-steps sm">
      ${lp.s3.items.map((s, i) => `<article class="ilp-step" style="transition-delay:${(i % 2) * 0.1}s"><div class="ilp-step-vis">${sceneSvg(i + 1)}</div><div class="ilp-step-body"><span class="ilp-step-n">${i + 1}</span><h3>${s.t}</h3><p>${s.d}</p></div></article>`).join("")}
    </div>

  </div></section>`;

  const coreBrands = implantBrands.filter((b) => ["straumann", "osstem", "neodent"].includes(b.key));
  const brands = `<section class="ilp-sec" style="background:#fff;"><div class="ilp-wrap">
    <div ${io()} style="max-width:680px;margin-bottom:34px;"><div class="ilp-num">${lp.s4.num} — ${lp.s4.tag}</div><h2>${lp.s4.h2}</h2><p class="ilp-lead">${lp.s4.lead}</p></div>
    <div class="ilp-brands">
      ${coreBrands
        .map(
          (b, i) => `<div class="ilp-brand" ${io(`style="transition-delay:${i * 0.08}s"`)}>
        <div class="ilp-logo ${b.logoDark ? "dark" : ""}"><img src="${src("brands/" + b.logo)}" alt="${L(b.titles, lang)}" loading="lazy" decoding="async"></div>
        <p>${L(b.desc, lang)}</p>
      </div>`
        )
        .join("")}
    </div>
  </div></section>`;

  const smileFiles = [
    ["about-portrait.jpg", "MediDent İstanbul hastası — gülüş"],
    ["nov-8-4.jpg", "MediDent İstanbul hastası — gülüş"],
    ["oct-1-3.jpg", "MediDent İstanbul hastası — gülüş"],
    ["may-4-2.jpg", "MediDent İstanbul hastası — gülüş"],
  ];
  const results = `<section class="ilp-sec"><div class="ilp-wrap">
    <div ${io()} style="max-width:680px;margin-bottom:34px;"><div class="ilp-num">${lp.s5.num} — ${lp.s5.tag}</div><h2>${lp.s5.h2}</h2></div>
    <div class="ilp-two" style="align-items:start;">
      <div ${io()} class="ilp-ba-wrap"><div class="ba" data-ba>
        ${pic("aug-17-3.jpg", t.after)}
        <img class="ba-before" src="${src("aug-17-1.jpg")}" alt="${t.before}" loading="lazy" decoding="async">
        <span class="ba-label before">${t.before}</span><span class="ba-label after">${t.after}</span>
        <div class="ba-handle"><div class="ba-knob"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 8L6 12l3.5 4M14.5 8l3.5 4-3.5 4"></path></svg></div></div>
      </div></div>
      <div ${io()} style="display:grid;gap:14px;">
        <div class="ilp-ba-wrap"><div class="ba" data-ba style="aspect-ratio:2/1;">
          ${pic("vaka-tam-agiz-sonrasi.jpg", "Tam çene implant — sonrası")}
          <img class="ba-before" src="${src("vaka-tam-agiz-oncesi.jpg")}" alt="Tam çene implant — öncesi" loading="lazy" decoding="async">
          <span class="ba-label before">${t.before}</span><span class="ba-label after">${t.after}</span>
          <div class="ba-handle"><div class="ba-knob"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 8L6 12l3.5 4M14.5 8l3.5 4-3.5 4"></path></svg></div></div>
        </div><p class="ilp-cap">Tam çene implant — öncesi / sonrası</p></div>
        <div class="ilp-ba-wrap"><div class="ba" data-ba style="aspect-ratio:1600/860;">
          ${pic("xray-sonrasi.jpg", "Panoramik röntgen — implant sonrası")}
          <img class="ba-before" src="${src("xray-oncesi.jpg")}" alt="Panoramik röntgen — implant öncesi" loading="lazy" decoding="async">
          <span class="ba-label before">${t.before}</span><span class="ba-label after">${t.after}</span>
          <div class="ba-handle"><div class="ba-knob"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 8L6 12l3.5 4M14.5 8l3.5 4-3.5 4"></path></svg></div></div>
        </div></div>
      </div>
    </div>
    <div class="ilp-xr" ${io()}>
      <figure class="ilp-fig">${pic("implant-xray-tam-ark.jpg", "Panoramik röntgen — implant üstü sabit protez", { sizes: "(max-width:900px) 100vw, 50vw" })}<figcaption>Röntgen — implant üstü sabit protez</figcaption></figure>
      <figure class="ilp-fig">${pic("implant-xray-oncesi-sonrasi.jpg", "Panoramik röntgen — implant öncesi ve sonrası", { sizes: "(max-width:900px) 100vw, 50vw" })}<figcaption>Röntgen — öncesi / sonrası</figcaption></figure>
    </div>
    <div class="ilp-gal">${smileFiles.map(([f, a]) => `<div ${io()}>${pic(f, a, { sizes: "(max-width:900px) 50vw, 25vw" })}</div>`).join("")}</div>
    <div class="ilp-band" ${io()}><b>${lp.bandTitle2}</b><a href="${wa}" target="_blank" rel="noopener" class="ilp-btn ilp-btn-dark">${icons.wa} ${p.ctaPrimary}</a></div>
  </div></section>`;

  const clinic = `<section class="ilp-sec" style="background:#fff;"><div class="ilp-wrap">
    <div ${io()} style="max-width:680px;margin-bottom:30px;"><div class="ilp-num">${lp.s6.num} — ${lp.s6.tag}</div><h2>${lp.s6.h2}</h2></div>
    <div class="ilp-map" ${io()}><iframe title="MediDent İstanbul — harita" src="${site.mapsEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
    <div class="ilp-addr" ${io()}><span>📍 ${site.address}</span><a class="ilp-btn ilp-btn-light" style="padding:12px 20px;" href="${site.mapsUrl}" target="_blank" rel="noopener">${lp.s6.map}</a></div>
  </div></section>`;

  const docCard = (d) => `<a class="ilp-doc" href="${url(lang, "doktorlar/" + d.slug + "/")}" ${io()}><div class="ilp-av">${d.image ? `<img src="${src(d.image)}" alt="${d.name}" loading="lazy">` : initials(d.name)}</div><b>${d.name}</b><span>${L(d.titles, lang)}</span></a>`;
  const docs = `<section class="ilp-sec"><div class="ilp-wrap">
    <div ${io()} style="max-width:680px;margin-bottom:30px;"><div class="ilp-num">${lp.s7.num} — ${lp.s7.tag}</div><h2>${lp.s7.h2}</h2></div>
    <div class="ilp-docs">${doctors.map(docCard).join("")}</div>
  </div></section>`;

  // Doğrulanmış Google yorumu verisi yok: yorum/puan uydurulmaz, yalnızca Google sayfasına link.
  const revs = `<section class="ilp-sec" style="background:#fff;"><div class="ilp-wrap">
    <div ${io()} style="max-width:680px;margin-bottom:22px;"><div class="ilp-num">${lp.s8.num} — ${lp.s8.tag}</div><h2>${lp.s8.h2}</h2></div>
    <div class="ilp-band" ${io()}><b>${lp.s8.linkText}</b><a href="${site.mapsUrl}" target="_blank" rel="noopener" class="ilp-btn ilp-btn-dark">${lp.s8.linkBtn}</a></div>
  </div></section>`;

  const price = `<section class="ilp-sec"><div class="ilp-wrap" style="max-width:860px;">
    <div ${io()}><div class="ilp-num">${lp.s9.num} — ${lp.s9.tag}</div><h2>${lp.s9.h2}</h2></div>
    <div class="ilp-tbl" ${io()}>${p.priceTable.map((r) => `<div><span>${r.label}</span><b>${r.price}</b></div>`).join("")}</div>
    <p class="ilp-note">${p.priceNote}</p>
    <div style="margin-top:30px;" ${io()}>${p.faqs.map((f) => `<div class="faq-item" data-faq-item><button class="faq-q" data-faq-toggle><span>${f.q}</span><span class="faq-icon"><span class="minus">−</span><span class="plus">+</span></span></button><div class="faq-a"><p style="margin:0;">${f.a}</p></div></div>`).join("")}</div>
  </div></section>`;

  const final = `<section class="ilp-sec" style="padding-top:0;"><div class="ilp-wrap"><div class="ilp-final" ${io()}>
    ${sparkle("").replace("<svg", '<svg style="top:26px;left:8%"')}${sparkle("").replace("<svg", '<svg style="bottom:30px;right:10%"')}
    <h2>${lp.final.h2}</h2><p>${lp.final.lead}</p>
    <div class="ilp-cta-row"><a data-dtr-cta href="${wa}" target="_blank" rel="noopener" class="ilp-btn ilp-btn-wa">${icons.wa} ${p.ctaPrimary}</a><a href="${contact}" class="ilp-btn ilp-btn-light">${p.ctaSecondary}</a></div>
  </div></div></section>`;

  return `<style>${CSS}</style><div class="ilp">${hero}${story}${showcase}${anatomy}${options}${brands}${results}${clinic}${docs}${revs}${steps}${price}${final}</div>${contactSection(lang)}${sticky}${JS}`;
}
