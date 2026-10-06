/**
 * Meta Marketing API (Graph API) — sadece OKUMA.
 *
 * Tek token (System User) ile o kullaniciya atanmis TUM reklam hesaplari okunur.
 * Yazma (durdurma, butce degistirme) bu dosyada YOK — v2'de onay kapisiyla gelecek.
 */

const VERSION = process.env.META_API_VERSION || "v23.0";
const BASE = `https://graph.facebook.com/${VERSION}`;

function token() {
  const t = process.env.META_ACCESS_TOKEN;
  if (!t) throw new Error("META_ACCESS_TOKEN tanimli degil.");
  return t;
}

async function get(url, attempt = 1) {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (res.ok) return body;

  const err = body.error || {};
  // 4/17/32/613: rate limit; 1/2: gecici hata -> bekle, tekrar dene
  const retryable = [1, 2, 4, 17, 32, 613].includes(err.code) || res.status >= 500;
  if (retryable && attempt < 4) {
    await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt));
    return get(url, attempt + 1);
  }
  // Token'i asla loglama: mesajda sadece Meta'nin hata metni var
  throw new Error(`Meta API ${res.status}: ${err.message || "bilinmeyen hata"} (code ${err.code ?? "-"})`);
}

/** path + params -> sayfalanmis tum `data` kayitlari */
async function getAll(path, params = {}) {
  const qs = new URLSearchParams({ ...params, access_token: token() });
  let url = `${BASE}/${path}?${qs}`;
  const out = [];
  while (url) {
    const page = await get(url);
    out.push(...(page.data || []));
    url = page.paging?.next || null;
  }
  return out;
}

export async function listAdAccounts() {
  const ids = (process.env.META_AD_ACCOUNT_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const fields = "id,name,currency,account_status,timezone_name";
  if (ids.length) {
    const qs = new URLSearchParams({ fields, access_token: token() });
    return Promise.all(
      ids.map((id) => get(`${BASE}/${id.startsWith("act_") ? id : `act_${id}`}?${qs}`))
    );
  }
  return getAll("me/adaccounts", { fields, limit: "200" });
}

const INSIGHT_FIELDS = [
  "date_start",
  "campaign_id",
  "campaign_name",
  "adset_id",
  "adset_name",
  "ad_id",
  "ad_name",
  "spend",
  "impressions",
  "reach",
  "frequency",
  "clicks",
  "inline_link_clicks",
  "actions",
].join(",");

/** Reklam bazinda, gun gun insights (since/until: YYYY-MM-DD, hesap saat dilimi) */
export function adInsights(accountId, since, until) {
  return getAll(`${accountId}/insights`, {
    level: "ad",
    time_increment: "1",
    time_range: JSON.stringify({ since, until }),
    fields: INSIGHT_FIELDS,
    limit: "500",
  });
}

export function adSets(accountId) {
  return getAll(`${accountId}/adsets`, {
    fields: "id,name,campaign_id,effective_status,daily_budget,lifetime_budget,learning_stage_info",
    limit: "200",
  });
}

export function ads(accountId) {
  return getAll(`${accountId}/ads`, {
    fields: "id,name,adset_id,effective_status,created_time",
    limit: "500",
  });
}
