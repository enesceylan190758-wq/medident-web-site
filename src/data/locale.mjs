/** Pick localized string from { tr, en, de, ar, ru } with safe fallback. */
export function L(obj, lang) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] ?? obj.en ?? obj.tr ?? Object.values(obj)[0] ?? "";
}

export const langBCP47 = {
  tr: "tr-TR",
  en: "en-US",
  de: "de-DE",
  ar: "ar-SA",
  ru: "ru-RU",
};

export const rtlLangs = new Set(["ar"]);

/** UI microcopy that was previously inline ternary chains. */
export const uiBits = {
  allInclusive: {
    tr: "Şeffaf, her şey dâhil",
    en: "Transparent, all-inclusive",
    de: "Transparent, all-inclusive",
    ar: "شفاف وشامل بالكامل",
    ru: "Прозрачно, всё включено",
  },
  countriesWord: {
    tr: "ülkeden mutlu hasta",
    en: "countries",
    de: "Länder",
    ar: "دولة — مرضى سعداء",
    ru: "стран — довольные пациенты",
  },
  realSmile: {
    tr: "Gerçek MediDent gülüşü",
    en: "Real MediDent smile",
    de: "Echtes MediDent-Lächeln",
    ar: "ابتسامة ميديدنتت حقيقية",
    ru: "Настоящая улыбка MediDent",
  },
  homeTitle: {
    tr: "Gülüş Tasarımı & Estetik Diş Hekimliği",
    en: "Smile Design & Aesthetic Dentistry",
    de: "Smile Design & Ästhetische Zahnmedizin",
    ar: "تصميم الابتسامة وطب الأسنان التجميلي",
    ru: "Дизайн улыбки и эстетическая стоматология",
  },
  notSure: {
    tr: "Henüz emin değilim",
    en: "Not sure yet",
    de: "Noch unsicher",
    ar: "لست متأكدًا بعد",
    ru: "Пока не уверен(а)",
  },
  googleReviews: {
    tr: "yorumları",
    en: "reviews",
    de: "Bewertungen",
    ar: "التقييمات",
    ru: "отзывы",
  },
  clinicVideoEyebrow: {
    tr: "Kliniğimizi Tanıyın",
    en: "Meet Our Clinic",
    de: "Unsere Klinik",
    ar: "تعرّف على عيادتنا",
    ru: "Познакомьтесь с клиникой",
  },
  clinicVideoTitle: {
    tr: "Üsküdar Acıbadem’de modern, steril ve şeffaf bir deneyim",
    en: "A modern, sterile and transparent experience in Üsküdar Acıbadem",
    de: "Modern, steril und transparent in Üsküdar Acıbadem",
    ar: "تجربة حديثة ومعقّمة وشفافة في اسكودار أجي بادم",
    ru: "Современный, стерильный и прозрачный опыт в Ускюдар Аджыбадем",
  },
  clinicVideoLead: {
    tr: "Klinik ortamımızı ve hasta yolculuğunu izleyin. Autoplay yok — siz istediğinizde başlatın.",
    en: "Watch our clinic and patient journey. No autoplay — start when you are ready.",
    de: "Sehen Sie Klinik und Patientenreise. Kein Autoplay — starten Sie selbst.",
    ar: "شاهدوا العيادة ورحلة المريض. بدون تشغيل تلقائي — ابدأ عندما تريد.",
    ru: "Посмотрите клинику и путь пациента. Без автозапуска — включайте сами.",
  },
  watchVideo: {
    tr: "Videoyu İzle",
    en: "Watch Video",
    de: "Video ansehen",
    ar: "شاهد الفيديو",
    ru: "Смотреть видео",
  },
  openYoutube: {
    tr: "YouTube kanalımız",
    en: "Our YouTube channel",
    de: "Unser YouTube-Kanal",
    ar: "قناتنا على يوتيوب",
    ru: "Наш канал YouTube",
  },
  mapTitle: {
    tr: "Klinik konumumuz",
    en: "Our clinic location",
    de: "Standort der Klinik",
    ar: "موقع العيادة",
    ru: "Расположение клиники",
  },
  geoTitle: {
    tr: "GEO bilgi bankası",
    en: "GEO knowledge base",
    de: "GEO Wissensbank",
    ar: "قاعدة معرفة GEO",
    ru: "База знаний GEO",
  },
  geoLead: {
    tr: "Yapay zekâ ve arama motorları için kısa, doğrulanabilir cevaplar.",
    en: "Short, verifiable answers for AI and search engines.",
    de: "Kurze, überprüfbare Antworten für KI und Suchmaschinen.",
    ar: "إجابات قصيرة وقابلة للتحقق لمحركات الذكاء والبحث.",
    ru: "Краткие проверяемые ответы для ИИ и поисковиков.",
  },
  read: {
    tr: "Oku",
    en: "Read",
    de: "Lesen",
    ar: "اقرأ",
    ru: "Читать",
  },
};
