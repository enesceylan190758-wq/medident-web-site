import { JWT, OAuth2Client } from "google-auth-library";
import { KNOWN } from "./config.mjs";

const ADWORDS_SCOPE = "https://www.googleapis.com/auth/adwords";

export function oauthClient() {
  const id = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!id || !secret) return null;
  return new OAuth2Client(id, secret, "http://127.0.0.1");
}

export async function accessToken() {
  const client = oauthClient();
  const refresh = process.env.GOOGLE_REFRESH_TOKEN;
  if (!client || !refresh) return null;
  client.setCredentials({ refresh_token: refresh });
  const { token } = await client.getAccessToken();
  return token || null;
}

/** Parse GOOGLE_ADS_SA_JSON in memory only. Never log or write the payload. */
export function loadServiceAccount() {
  const raw = process.env.GOOGLE_ADS_SA_JSON;
  if (raw == null || !String(raw).trim()) return null;
  const trimmed = String(raw).trim();
  const candidates = [trimmed];
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed[1] !== "{")
  ) {
    candidates.push(trimmed.slice(1, -1));
  }
  if (!trimmed.startsWith("{") && !trimmed.startsWith("'") && !trimmed.startsWith('"')) {
    try {
      candidates.push(Buffer.from(trimmed, "base64").toString("utf8"));
    } catch {
      /* ignore */
    }
  }
  for (const c of candidates) {
    try {
      const obj = JSON.parse(c);
      if (obj && typeof obj === "object" && obj.private_key && obj.client_email) return obj;
    } catch {
      /* try next */
    }
  }
  throw new Error("GOOGLE_ADS_SA_JSON geçerli bir servis hesabı JSON'u değil");
}

/** JWT access token for Ads REST. Key stays in memory. */
export async function serviceAccountAccessToken() {
  const sa = loadServiceAccount();
  if (!sa) return null;
  const client = new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: [ADWORDS_SCOPE],
  });
  const got = await client.getAccessToken();
  const token = typeof got === "string" ? got : got?.token;
  return token || null;
}

/** SA JSON (cloud secret) → OAuth refresh token → none (proxy). */
export async function adsAccessToken() {
  if (process.env.GOOGLE_ADS_SA_JSON) {
    const token = await serviceAccountAccessToken();
    if (!token) throw new Error("GOOGLE_ADS_SA_JSON ile access token alınamadı");
    return token;
  }
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    const token = await accessToken();
    if (!token) throw new Error("GOOGLE_REFRESH_TOKEN geçersiz — npm run google:auth ile yeniden üret.");
    return token;
  }
  return null;
}

export function adsLoginCustomerId() {
  return (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || KNOWN.adsMccId || "").replace(/-/g, "");
}

export async function googleFetch(token, url, { method = "GET", body, headers = {} } = {}) {
  // token null/undefined: ortamın egress proxy'si (Project settings → API
  // credentials) Authorization başlığını kendisi ekliyorsa OAuth atlanabilir.
  const res = await fetch(url, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json, text };
}

export function adsCustomerId() {
  return (process.env.GOOGLE_ADS_CUSTOMER_ID || KNOWN.adsCustomerId).replace(/-/g, "");
}

export function errorText(json) {
  const msg = json?.error?.message || json?.error?.status || json?.raw || "";
  return String(msg).replace(/\s+/g, " ").slice(0, 180);
}

/** Full Ads error body for operators — never includes the service-account key. */
export function adsErrorExact(res) {
  const json = res?.json;
  if (json?.error) {
    try {
      return JSON.stringify(json.error);
    } catch {
      /* fall through */
    }
  }
  if (typeof res?.text === "string" && res.text.trim()) return res.text.trim();
  if (res?.status) return `HTTP ${res.status}`;
  return "bilinmeyen Ads API hatası";
}

export function flattenSearchStream(json) {
  if (!json) return [];
  if (Array.isArray(json)) return json.flatMap((batch) => batch?.results || []);
  if (Array.isArray(json.results)) return json.results;
  return [];
}

export function classify(status, json) {
  const msg = errorText(json);
  if (/has not been used|is disabled|accessNotConfigured|SERVICE_DISABLED|API has not been used/i.test(msg)) {
    return "KAPALI";
  }
  if (status === 403 && /insufficient authentication scopes|ACCESS_TOKEN_SCOPE|insufficientPermissions/i.test(msg)) {
    return "KAPSAM";
  }
  return "HATA";
}
