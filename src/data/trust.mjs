// Trust / authority badges for homepage strip + schema hasCredential.
// Add real assets under src/assets/images/trust/ then uncomment entries.
// Section is hidden automatically when badges is empty.

export const trustBadges = [
  // {
  //   id: "health-tourism",
  //   image: "trust/health-tourism.png",
  //   alt: {
  //     tr: "Sağlık Turizmi Yetki Belgesi",
  //     en: "Health Tourism Authorization",
  //     de: "Gesundheitstourismus-Zulassung",
  //     ar: "ترخيص السياحة العلاجية",
  //     ru: "Лицензия на медицинский туризм",
  //   },
  //   credential: "T.C. Sağlık Bakanlığı Sağlık Turizmi Yetki Belgesi",
  // },
];

export function hasTrustBadges() {
  return Array.isArray(trustBadges) && trustBadges.length > 0;
}
