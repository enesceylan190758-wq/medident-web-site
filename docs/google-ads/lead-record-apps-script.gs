/**
 * MediDent İstanbul — Lead/WhatsApp Kayıt Uç Noktası (Google Apps Script Web App)
 *
 * KURULUM (Enes, ~5 dakika):
 * 1. sheets.google.com → yeni boş bir Sheet aç, adını "MediDent Leads" yap.
 * 2. Üst menü: Uzantılar (Extensions) → Apps Script.
 * 3. Açılan editördeki tüm örnek kodu sil, bu dosyanın TAMAMINI yapıştır.
 * 4. Sağ üstte "Deploy" (Dağıt) → "New deployment" (Yeni dağıtım).
 * 5. Dişli ikonundan tip seç: "Web app".
 * 6. "Execute as": Me (kendi hesabın).
 *    "Who has access": Anyone (herkes) — form/WhatsApp tıklamaları giriş
 *    yapmamış ziyaretçilerden geldiği için bu ayar zorunlu, veriye kimse
 *    OKUYAMAZ, sadece bu script YAZABİLİR.
 * 7. "Deploy" → çıkan "Web app URL"yi kopyala (https://script.google.com/macros/s/XXXX/exec).
 * 8. Bu URL'i bana ver — src/data/site.mjs içindeki site.leadRecord.endpoint
 *    alanına yazıp deploy edeceğim.
 * 9. Kod değişirse (bu dosyayı güncellersem): Deploy → Manage deployments →
 *    kalem ikonu → Version: New version → Deploy. URL AYNI KALIR.
 */

const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "timestamp", "source_type", "ref_code",
        "name", "phone", "email", "treatment", "message",
        "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
        "gclid", "landing_page", "page_url", "lang",
      ]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      data.source_type || "",
      data.ref_code || "",
      data.name || "",
      data.phone || "",
      data.email || "",
      data.treatment || "",
      data.message || "",
      (data.attribution && data.attribution.utm_source) || "",
      (data.attribution && data.attribution.utm_medium) || "",
      (data.attribution && data.attribution.utm_campaign) || "",
      (data.attribution && data.attribution.utm_content) || "",
      (data.attribution && data.attribution.utm_term) || "",
      (data.attribution && data.attribution.gclid) || "",
      data.landing_page || "",
      data.page_url || "",
      data.lang || "",
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    // Hata olsa bile sessiz 200 dön — istemci tarafı zaten yanıtı beklemiyor
    // (sendBeacon/no-cors), tarayıcıda konsola gürültü yapmasın.
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(
      ContentService.MimeType.JSON
    );
  }
}
