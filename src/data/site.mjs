// Global site configuration: contact, tracking, social, languages.
export const site = {
  domain: "https://medidentistanbul.com",
  brand: "MediDent İstanbul",
  // Real clinic contact (Üsküdar branch as primary)
  phone: "+90 549 119 08 19",
  phoneRaw: "+905491190819",
  whatsapp: "+90 549 119 08 19",
  whatsappRaw: "905491190819",
  email: "info@medidentistanbul.com",
  address: "Acıbadem, Acıbadem Cd. 195F, 34718 Üsküdar/İstanbul",
  addressShort: "Acıbadem, Üsküdar / İstanbul",
  mapsUrl: "https://maps.app.goo.gl/LyzPE3yP7NGqZxSY6",
  mapsEmbed:
    "https://www.google.com/maps?q=Medident%20İstanbul%20Acıbadem%20Cd%20195F%20Üsküdar&output=embed",
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
  // Estesof form integration point. Endpoint gelince doldurun; boşsa form
  // gönderimi WhatsApp'a yönlendirilir (aşağıdaki app.js mantığı).
  estesof: {
    endpoint: "", // ör. "https://panel.estesof.com/api/leads/xxxx"
    method: "POST",
  },
  rating: { value: "4.9", count: "1200" },
  languages: ["tr", "en", "de"],
  defaultLang: "tr",
};

// Language -> URL prefix. TR lives at root, EN/DE under /en, /de.
export const langPrefix = { tr: "", en: "/en", de: "/de" };
export const htmlLang = { tr: "tr", en: "en", de: "de" };
export const ogLocale = { tr: "tr_TR", en: "en_US", de: "de_DE" };
