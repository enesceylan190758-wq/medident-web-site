// Digital business card profiles (QR destinations hosted on this site).
export const vcards = [
  {
    slug: "enesceylan",
    name: "Enes CEYLAN",
    givenName: "Enes",
    familyName: "CEYLAN",
    org: "MediDent İstanbul",
    title: "MediDent İstanbul",
    phone: "+90 (549) 119 08 19",
    phoneRaw: "+905491190819",
    whatsappRaw: "905491190819",
    email: "enes@medidentistanbul.com",
    addressLines: [
      "Caddebostan Mah. İskele Sk. No: 16 - 18B",
      "Kadıköy / İSTANBUL",
    ],
    addressFull: "Caddebostan Mah. İskele Sk. No: 16 - 18B, Kadıköy / İstanbul",
    // Maps search for the Caddebostan / Kadıköy address on the printed card
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Caddebostan%20Mah.%20%C4%B0skele%20Sk.%20No%3A%2016-18B%20Kad%C4%B1k%C3%B6y%20%C4%B0stanbul",
    website: "https://medidentistanbul.com/",
    social: {
      instagram: "https://www.instagram.com/medidentistanbul/",
    },
    // Printed card QR currently points here (qr-code-generator.com — account disabled)
    legacyQrUrl: "https://qrco.de/bcOVp0",
  },
];

export function vcardBySlug(slug) {
  return vcards.find((v) => v.slug === slug);
}

/** RFC 6350 vCard 3.0 body for "Save contact". */
export function buildVcf(card) {
  const adr = card.addressFull.replace(/,/g, "\\,");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${card.familyName};${card.givenName};;;`,
    `FN:${card.name}`,
    `ORG:${card.org}`,
    `TITLE:${card.title}`,
    `TEL;TYPE=CELL,VOICE:${card.phoneRaw}`,
    `EMAIL;TYPE=INTERNET:${card.email}`,
    `ADR;TYPE=WORK:;;${adr};;;;`,
    `URL:${card.website}`,
    "END:VCARD",
    "",
  ].join("\r\n");
}
