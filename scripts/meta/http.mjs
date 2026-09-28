import { KNOWN } from "./config.mjs";

export function metaAccessToken() {
  return (
    process.env.META_ACCESS_TOKEN ||
    process.env.FB_ACCESS_TOKEN ||
    process.env.META_SYSTEM_USER_TOKEN ||
    ""
  ).trim();
}

export function metaAdAccountId() {
  const raw = (process.env.META_AD_ACCOUNT_ID || process.env.FB_AD_ACCOUNT_ID || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/^act_/i, "").replace(/\D/g, "");
  return digits ? `act_${digits}` : "";
}

function redact(s) {
  return String(s || "").replace(/access_token=[^&\s]+/gi, "access_token=REDACTED");
}

export function metaErrorExact(json, status) {
  const err = json?.error;
  if (err) {
    try {
      return redact(JSON.stringify(err));
    } catch {
      /* fall through */
    }
  }
  if (status) return `HTTP ${status}`;
  return "bilinmeyen Meta API hatası";
}

export async function graphFetch(token, path, params = {}) {
  const version = KNOWN.graphVersion;
  const url = new URL(`https://graph.facebook.com/${version}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "") continue;
    url.searchParams.set(k, typeof v === "object" ? JSON.stringify(v) : String(v));
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: redact(text).slice(0, 500) };
  }
  return { ok: res.ok, status: res.status, json };
}

export async function graphGetAll(token, path, params = {}) {
  const rows = [];
  let nextPath = path;
  let nextParams = { ...params };
  for (let i = 0; i < 20; i++) {
    const res = await graphFetch(token, nextPath, nextParams);
    if (!res.ok) throw new Error(metaErrorExact(res.json, res.status));
    const data = res.json?.data;
    if (Array.isArray(data)) rows.push(...data);
    const next = res.json?.paging?.next;
    if (!next) break;
    const u = new URL(next);
    nextPath = u.pathname.replace(new RegExp(`^/${KNOWN.graphVersion}`), "") || path;
    nextParams = Object.fromEntries(u.searchParams.entries());
    delete nextParams.access_token;
  }
  return rows;
}
