// Sitede zaten kullanılan genel kimlikler (src/data/site.mjs). Gizli değil.
export const KNOWN = {
  pixelId: "3052551521644159",
  pageUrl: "https://www.facebook.com/medidentistanbul",
  graphVersion: "v21.0",
};

export const LEAD_ACTION_TYPES = new Set([
  "lead",
  "onsite_conversion.lead_grouped",
  "offsite_conversion.fb_pixel_lead",
  "offsite_conversion.fb_pixel_complete_registration",
  "leadgen_grouped",
]);
