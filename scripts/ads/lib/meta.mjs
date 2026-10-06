/**
 * Meta Marketing API (Graph API) — sadece OKUMA.
 *
 * Tek token (System User "medident-ads") ile o kullaniciya atanmis TUM reklam
 * hesaplari okunur; is ortagi olarak paylasilan musteri hesaplari da ayni yoldan
 * gelir. Her kayit account_id tasir, filtreleme hesap bazinda yapilir.
 * Yazma (durdurma, butce degistirme) bu dosyada YOK — v2'de onay kapisiyla gelecek.
 *
 * Kimlik dogrulama:
 *  - Claude Code bulut ortami: jeton ortamin "API credentials" bolumunde; proxy
 *    graph.facebook.com isteklerine Authorization header'ini kendisi ekler.
 *    META_ACCESS_TOKEN tanimli DEGIL, kod jetonu hic gormez.
 *  - Baska bir sunucu (cron/VPS): META_ACCESS_TOKEN verilirse Bearer header
 *    olarak gonderilir. Jeton hicbir zaman URL'ye (query string) konmaz, boylece
 *    loglara ve paging.next linklerine sizmaz.
 * Bu modul yalnizca sunucu tarafinda calisir; tarayiciya asla import edilmez.
 */

const VERSION = process.env.META_API_VERSION || "v23.0";
const BASE = `https://graph.facebook.com/${VERSION}`;

function headers() {
  const t = process.env.META_ACCESS_TOKEN;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function get(url, attempt = 1) {
  const res = await fetch(url, { headers: headers() });
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
  const hint = err.message
    ? ""
    : " — Meta'dan JSON gelmedi; bulut ortaminda NODE_USE_ENV_PROXY=1 ile calistir (npm run ads:check)";
  throw new Error(`Meta API ${res.status}: ${err.message || "bilinmeyen hata"} (code ${err.code ?? "-"})${hint}`);
}

/** path + params -> sayfalanmis tum `data` kayitlari */
async function getAll(path, params = {}) {
  const qs = new URLSearchParams(params);
  let url = `${BASE}/${path}?${qs}`;
  const out = [];
  while (url) {
    const page = await get(url);
    out.push(...(page.data || []));
    url = page.paging?.next || null;
  }
  return out;
}

/** "123" ya da "act_123" -> "act_123" */
export const actId = (id) => (String(id).startsWith("act_") ? String(id) : `act_${id}`);

/** Kimlik kontrolu: jeton hangi kullaniciya ait, hangi izinler verilmis */
export async function whoami() {
  const me = await get(`${BASE}/me?fields=id,name`);
  const perms = await getAll("me/permissions");
  return {
    ...me,
    permissions: perms.filter((p) => p.status === "granted").map((p) => p.permission),
  };
}

// account_status: 1 aktif, 2 devre disi, 3 odenmemis, 7 risk incelemesi, 9 grace, 100/101 kapanis
const ACCOUNT_FIELDS = "id,account_id,name,currency,account_status,disable_reason,timezone_name";

/**
 * System User'a atanmis tum hesaplar. META_AD_ACCOUNT_IDS (virgullu) verilirse
 * yalnizca o hesaplar dondurulur (izin listesi, yeni paylasilan hesap otomatik dahil olmaz).
 */
export async function listAdAccounts() {
  const all = (await getAll("me/adaccounts", { fields: ACCOUNT_FIELDS, limit: "200" })).map(
    (a) => ({ ...a, name: a.name?.trim() })
  );
  const allow = (process.env.META_AD_ACCOUNT_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(actId);
  return allow.length ? all.filter((a) => allow.includes(a.id)) : all;
}

const INSIGHT_FIELDS = [
  "account_id",
  "account_name",
  "account_currency",
  "date_start",
  "campaign_id",
  "campaign_name",
  "objective",
  "optimization_goal",
  "adset_id",
  "adset_name",
  "ad_id",
  "ad_name",
  "spend",
  "impressions",
  "frequency",
  "clicks",
  "inline_link_clicks",
  "actions",
].join(",");

/** Reklam bazinda, gun gun insights (since/until: YYYY-MM-DD, hesap saat dilimi) */
export function adInsights(accountId, since, until) {
  return getAll(`${actId(accountId)}/insights`, {
    level: "ad",
    time_increment: "1",
    time_range: JSON.stringify({ since, until }),
    fields: INSIGHT_FIELDS,
    // harcamasiz satirlari Meta tarafinda ele; buyuk sayfalar (500) proxy'de 30 sn'yi asip 502 veriyor
    filtering: JSON.stringify([{ field: "spend", operator: "GREATER_THAN", value: 0 }]),
    limit: "100",
  });
}

/** Butceler (daily_budget/lifetime_budget) hesap para biriminin alt biriminde gelir: kurus */
export function adSets(accountId) {
  return getAll(`${actId(accountId)}/adsets`, {
    fields: "id,account_id,name,campaign_id,effective_status,daily_budget,lifetime_budget,learning_stage_info",
    limit: "200",
  });
}

export function ads(accountId) {
  return getAll(`${actId(accountId)}/ads`, {
    fields: "id,account_id,name,adset_id,effective_status,created_time",
    limit: "500",
  });
}
