// Global site configuration: contact, tracking, social, languages.
// SITE_DOMAIN / SITE_BASE: önizleme hostu için (ör. GitHub Pages). Boş = üretim (kök domain).
const previewDomain = process.env.SITE_DOMAIN || "";
const previewBase = process.env.SITE_BASE || "";

export const site = {
  domain: previewDomain || "https://medidentistanbul.com",
  // Örn. "/medident-web-site" — GitHub Pages proje URL'si. Üretimde boş.
  basePath: previewBase.replace(/\/$/, ""),
  brand: "MediDent İstanbul",
  // Real clinic contact (Üsküdar branch as primary)
  phone: "+90 549 119 08 19",
  phoneRaw: "+905491190819",
  whatsapp: "+90 549 119 08 19",
  whatsappRaw: "905491190819",
  email: "info@medidentistanbul.com",
  address: "Acıbadem, Acıbadem Cd. 195F, 34718 Üsküdar/İstanbul",
  addressShort: "Acıbadem, Üsküdar / İstanbul",
  // Do not embed/link Maps until Acıbadem clinic pin is confirmed
  // (previous maps.app link pointed to a different branch — Kartal/Çevizli).
  mapsUrl: "",
  mapsEmbed: "",
  hours: "Pazartesi – Cumartesi: 09:00 – 18:00",
  openingHours: ["Mo-Sa 09:00-18:00"],
  geo: { lat: 40.9925, lng: 29.0435 },
  social: {
    instagram: "https://www.instagram.com/medidentistanbul/",
    facebook: "https://www.facebook.com/medidentistanbul",
    youtube: "https://www.youtube.com/channel/UC6p0LW7fys7WSpEJQwMfl1g",
  },
  // Migrated from legacy WordPress site (keeps analytics history intact)
  tracking: {
    gtm: "GTM-NTDLLHF",
    metaPixel: "3052551521644159",
    gscVerify: "D1pF9pwynq5nBW7V0fFMFIvcgZuTc49glS3A18XsOvw",
    ga4: "", // Yeni GA4 kimliği eklenince buraya yazın (ör. G-XXXXXXX)
  },
  // Estesof form integration point (plan faz 5).
  // endpoint doluysa site.js JSON POST atar; boşsa WhatsApp fallback.
  // Bağlamak için: endpoint'i yaz → npm run build → deploy.
  estesof: {
    endpoint: "", // ör. "https://panel.estesof.com/api/leads/xxxx"
    method: "POST",
  },
  rating: { value: "4.9", count: "1200" },
  languages: ["tr", "en", "de", "ar", "ru"],
  defaultLang: "tr",
  // Optional homepage intro video. Empty → facade opens YouTube channel (no autoplay embed).
  youtubeIntroId: "",
  // Instagram reels/posts for homepage. Add permalinks from @medidentistanbul.
  // cover: optional local image under assets/img; otherwise clinic photo is used.
  // Example: { url: "https://www.instagram.com/reel/XXXX/", cover: "aug-17-3.jpg" }
  instagramFeed: [],
};

// Language -> URL prefix. TR lives at root; others under /en, /de, /ar, /ru.
export const langPrefix = { tr: "", en: "/en", de: "/de", ar: "/ar", ru: "/ru" };
export const htmlLang = { tr: "tr", en: "en", de: "de", ar: "ar", ru: "ru" };
export const ogLocale = {
  tr: "tr_TR",
  en: "en_US",
  de: "de_DE",
  ar: "ar_SA",
  ru: "ru_RU",
};
