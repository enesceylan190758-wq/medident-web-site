// Sitede zaten kullanılan Google kimlikleri (src/data/site.mjs). Gizli değil.
export const KNOWN = {
  adsCustomerId: "5670078321", // İstanbul Dent. Conversion tracking ID = AW-346086325.
  ga4MeasurementId: "G-WP6XMC87YB",
  gtmPublicId: "GTM-NTDLLHF",
  siteHost: "medidentistanbul.com",
  youtubeChannelId: "UC6p0LW7fys7WSpEJQwMfl1g",
  adsApiVersion: "v25",
};

// Tek onay ekranı. Hepsi klinik hesabının kendi verisi; salt okunur olanlar okunur.
export const SCOPES = [
  "https://www.googleapis.com/auth/adwords",
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/tagmanager.edit.containers",
  "https://www.googleapis.com/auth/tagmanager.publish",
  "https://www.googleapis.com/auth/business.manage",
  "https://www.googleapis.com/auth/youtube.readonly",
];

export const API_SETUP = [
  ["Google Ads API", "https://console.cloud.google.com/apis/library/googleads.googleapis.com"],
  ["Google Analytics Admin API", "https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com"],
  ["Google Analytics Data API", "https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com"],
  ["Search Console API", "https://console.cloud.google.com/apis/library/searchconsole.googleapis.com"],
  ["Tag Manager API", "https://console.cloud.google.com/apis/library/tagmanager.googleapis.com"],
  ["Business Profile Account Management", "https://console.cloud.google.com/apis/library/mybusinessaccountmanagement.googleapis.com"],
  ["Business Profile Business Information", "https://console.cloud.google.com/apis/library/mybusinessbusinessinformation.googleapis.com"],
  ["YouTube Data API v3", "https://console.cloud.google.com/apis/library/youtube.googleapis.com"],
];
