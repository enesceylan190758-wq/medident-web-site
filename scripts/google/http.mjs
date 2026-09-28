import { OAuth2Client } from "google-auth-library";
import { KNOWN } from "./config.mjs";

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

export async function googleFetch(token, url, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
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
    json = { raw: text.slice(0, 240) };
  }
  return { ok: res.ok, status: res.status, json };
}

export function adsCustomerId() {
  return (process.env.GOOGLE_ADS_CUSTOMER_ID || KNOWN.adsCustomerId).replace(/-/g, "");
}

export function errorText(json) {
  const msg = json?.error?.message || json?.error?.status || json?.raw || "";
  return String(msg).replace(/\s+/g, " ").slice(0, 180);
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
