/**
 * Google Ads API — sadece OKUMA (GAQL search).
 *
 * Kimlik dogrulama meta.mjs ile ayni mantik:
 *  - Claude Code bulut ortami: OAuth jetonu ve developer-token ortamin API credentials
 *    bolumunde; proxy googleads.googleapis.com isteklerine kendisi ekler.
 *  - Baska sunucu: GOOGLE_ADS_ACCESS_TOKEN + GOOGLE_ADS_DEVELOPER_TOKEN verilirse header olarak gider.
 * Yonetici (MCC) altindaki hesaplar icin login-customer-id gonderilir.
 * Bu modul yalnizca sunucu tarafinda calisir; tarayiciya asla import edilmez.
 */

const VERSION = process.env.GOOGLE_ADS_API_VERSION || "v22";
const BASE = `https://googleads.googleapis.com/${VERSION}`;

function headers(loginCustomerId) {
  const h = { "Content-Type": "application/json" };
  if (process.env.GOOGLE_ADS_ACCESS_TOKEN) h.Authorization = `Bearer ${process.env.GOOGLE_ADS_ACCESS_TOKEN}`;
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN) h["developer-token"] = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (loginCustomerId) h["login-customer-id"] = String(loginCustomerId).replace(/-/g, "");
  return h;
}

async function call(path, body, loginCustomerId, attempt = 1) {
  const res = await fetch(`${BASE}/${path}`, {
    method: body ? "POST" : "GET",
    headers: headers(loginCustomerId),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = {};
  try { json = JSON.parse(text); } catch {}
  if (res.ok) return json;
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt));
    return call(path, body, loginCustomerId, attempt + 1);
  }
  const msg = json.error?.message || (text.startsWith("<") ? "JSON olmayan yanit (API surumu ya da proxy)" : text.slice(0, 200));
  throw new Error(`Google Ads API ${res.status}: ${msg}`);
}

/** Jetonun eristigi kok hesaplar (genelde MCC) */
export async function accessibleCustomers() {
  const r = await call("customers:listAccessibleCustomers");
  return (r.resourceNames || []).map((n) => n.split("/")[1]);
}

/** GAQL sorgusu, tum sayfalar */
export async function search(customerId, query, loginCustomerId) {
  const out = [];
  let pageToken;
  do {
    const r = await call(`customers/${customerId}/googleAds:search`, { query, ...(pageToken ? { pageToken } : {}) }, loginCustomerId);
    out.push(...(r.results || []));
    pageToken = r.nextPageToken;
  } while (pageToken);
  return out;
}

/** MCC altindaki reklam hesaplari (yonetici olmayanlar) */
export async function clientAccounts(managerId) {
  const rows = await search(
    managerId,
    "SELECT customer_client.id, customer_client.descriptive_name, customer_client.currency_code, customer_client.manager, customer_client.status FROM customer_client",
    managerId
  );
  return rows
    .map((r) => r.customerClient)
    .filter((c) => !c.manager)
    .map((c) => ({ id: c.id, name: c.descriptiveName, currency: c.currencyCode, status: c.status }));
}

const micros = (v) => Math.round(Number(v || 0) / 1e4) / 100;

/** Kampanya x gun metrikleri */
export async function campaignDaily(customerId, since, until, loginCustomerId) {
  const rows = await search(
    customerId,
    `SELECT segments.date, campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type,
            metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions,
            metrics.search_budget_lost_impression_share
     FROM campaign WHERE segments.date BETWEEN '${since}' AND '${until}' AND metrics.impressions > 0`,
    loginCustomerId
  );
  return rows.map((r) => ({
    date: r.segments.date,
    campaign_id: r.campaign.id,
    campaign_name: r.campaign.name,
    status: r.campaign.status,
    type: r.campaign.advertisingChannelType,
    cost: micros(r.metrics.costMicros),
    impressions: Number(r.metrics.impressions || 0),
    clicks: Number(r.metrics.clicks || 0),
    conversions: Number(r.metrics.conversions || 0),
    lostBudget: r.metrics.searchBudgetLostImpressionShare != null ? Number(r.metrics.searchBudgetLostImpressionShare) : null,
  }));
}

/** En cok harcayan arama terimleri */
export async function searchTerms(customerId, since, until, loginCustomerId, limit = 30) {
  const rows = await search(
    customerId,
    `SELECT search_term_view.search_term, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions
     FROM search_term_view WHERE segments.date BETWEEN '${since}' AND '${until}'
     ORDER BY metrics.cost_micros DESC LIMIT ${limit}`,
    loginCustomerId
  );
  return rows.map((r) => ({
    term: r.searchTermView.searchTerm,
    cost: micros(r.metrics.costMicros),
    clicks: Number(r.metrics.clicks || 0),
    impressions: Number(r.metrics.impressions || 0),
    conversions: Number(r.metrics.conversions || 0),
  }));
}
