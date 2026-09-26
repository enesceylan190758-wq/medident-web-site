#!/usr/bin/env node
/**
 * Ads, GA4, Search Console, Tag Manager, Business Profile, YouTube.
 * Eksik olanı tek satırda söyler; token basmaz.
 */
import { pathToFileURL } from "node:url";
import { loadEnv, upsertEnv } from "./env.mjs";
import { KNOWN } from "./config.mjs";
import { accessToken, adsCustomerId, classify, errorText, googleFetch } from "./http.mjs";

loadEnv();

function line(name, state, detail) {
  console.log(`${name.padEnd(22)} ${state.padEnd(8)} ${detail}`);
}

async function probeAds(token) {
  // Eyl 2026: developer token sunsetting; Cloud proje erişim seviyesi yeterli.
  // Varsa gönderilir (eski istemciler), yoksa boş header ile denenir.
  const version = KNOWN.adsApiVersion;
  const headers = {};
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN) {
    headers["developer-token"] = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  }
  const listed = await googleFetch(
    token,
    `https://googleads.googleapis.com/${version}/customers:listAccessibleCustomers`,
    { headers },
  );
  if (!listed.ok) {
    const msg = errorText(listed.json);
    if (/CLOUD_PROJECT_NOT_APPROVED|developer token|DEVELOPER_TOKEN|not approved/i.test(msg)) {
      line(
        "Google Ads",
        "EKSIK",
        "Cloud projede Ads API erişimi yok → https://console.cloud.google.com/apis/api/googleads.googleapis.com/overview",
      );
      return;
    }
    line("Google Ads", classify(listed.status, listed.json), msg);
    return;
  }
  const ids = (listed.json?.resourceNames || []).map((n) => n.split("/")[1]).filter(Boolean);
  if (!ids.length) {
    line("Google Ads", "EKSIK", "token geçerli, bu Google hesabında Ads müşterisi yok");
    return;
  }
  const login = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || "").replace(/-/g, "");
  const wanted = adsCustomerId();
  const names = [];
  for (const id of ids.slice(0, 8)) {
    const q = await googleFetch(
      token,
      `https://googleads.googleapis.com/${version}/customers/${id}/googleAds:search`,
      {
        method: "POST",
        headers: { ...headers, ...(login ? { "login-customer-id": login } : {}) },
        body: {
          query:
            "SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.manager FROM customer LIMIT 1",
        },
      },
    );
    const row = q.json?.results?.[0]?.customer;
    if (!q.ok || !row) {
      names.push(`${id} (${errorText(q.json) || "okunamadı"})`);
      continue;
    }
    const label = `${row.descriptiveName || id} · ${row.currencyCode || "?"}${row.manager ? " · MCC" : ""}`;
    names.push(String(row.id) === wanted ? `${label} ← site etiketi` : label);
    if (row.manager) {
      const kids = await googleFetch(
        token,
        `https://googleads.googleapis.com/${version}/customers/${id}/googleAds:search`,
        {
          method: "POST",
          headers: { ...headers, "login-customer-id": id },
          body: {
            query:
              "SELECT customer_client.id, customer_client.descriptive_name, customer_client.currency_code FROM customer_client WHERE customer_client.level = 1",
          },
        },
      );
      for (const k of kids.json?.results || []) {
        const c = k.customerClient;
        if (!c) continue;
        const hit = String(c.id) === wanted ? " ← site etiketi" : "";
        names.push(`  ${c.descriptiveName || c.id} (${c.id}) ${c.currencyCode || ""}${hit}`.trim());
      }
    }
  }
  const seen = names.some((n) => n.includes(wanted) || n.includes("site etiketi"));
  line("Google Ads", "TAMAM", names.join(" | "));
  if (!seen) {
    line("Google Ads", "EKSIK", `site hesabı ${wanted} bu token'da yok. GOOGLE_ADS_LOGIN_CUSTOMER_ID gerekebilir.`);
  }
}

async function probeGa4(token, found) {
  const summaries = await googleFetch(
    token,
    "https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200",
  );
  if (!summaries.ok) {
    line("GA4", classify(summaries.status, summaries.json), errorText(summaries.json));
    return;
  }
  const properties = [];
  for (const acc of summaries.json?.accountSummaries || []) {
    for (const p of acc.propertySummaries || []) properties.push(p.property);
  }
  let match = process.env.GA4_PROPERTY_ID || "";
  if (!match) {
    for (const property of properties) {
      const streams = await googleFetch(
        token,
        `https://analyticsadmin.googleapis.com/v1beta/${property}/dataStreams`,
      );
      const hit = (streams.json?.dataStreams || []).find(
        (s) => s.webStreamData?.measurementId === KNOWN.ga4MeasurementId,
      );
      if (hit) {
        match = property.replace("properties/", "");
        break;
      }
    }
  }
  if (!match) {
    line("GA4", "TAMAM", `erişim var, ${KNOWN.ga4MeasurementId} bu hesapta yok (${properties.length} mülk)`);
    return;
  }
  if (!process.env.GA4_PROPERTY_ID) found.GA4_PROPERTY_ID = match;
  const report = await googleFetch(
    token,
    `https://analyticsdata.googleapis.com/v1beta/properties/${match}:runReport`,
    {
      method: "POST",
      body: {
        dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
        metrics: [{ name: "sessions" }],
      },
    },
  );
  if (!report.ok) {
    line("GA4", classify(report.status, report.json), `mülk ${match} · ${errorText(report.json)}`);
    return;
  }
  const sessions = report.json?.rows?.[0]?.metricValues?.[0]?.value ?? "0";
  line("GA4", "TAMAM", `properties/${match} · ${KNOWN.ga4MeasurementId} · son 7 gün ${sessions} oturum`);
}

async function probeSearchConsole(token, found) {
  const res = await googleFetch(token, "https://searchconsole.googleapis.com/webmasters/v3/sites");
  if (!res.ok) {
    line("Search Console", classify(res.status, res.json), errorText(res.json));
    return;
  }
  const sites = res.json?.siteEntry || [];
  const host = KNOWN.siteHost;
  const hit =
    sites.find((s) => s.siteUrl === `sc-domain:${host}`) ||
    sites.find((s) => (s.siteUrl || "").includes(host));
  if (!hit) {
    line("Search Console", "TAMAM", `erişim var, ${host} bu hesapta yok (${sites.length} mülk)`);
    return;
  }
  if (!process.env.GSC_SITE_URL) found.GSC_SITE_URL = hit.siteUrl;
  line("Search Console", "TAMAM", `${hit.siteUrl} · ${hit.permissionLevel}`);
}

async function probeTagManager(token, found) {
  const accounts = await googleFetch(token, "https://tagmanager.googleapis.com/tagmanager/v2/accounts");
  if (!accounts.ok) {
    line("Tag Manager", classify(accounts.status, accounts.json), errorText(accounts.json));
    return;
  }
  const list = accounts.json?.account || [];
  for (const account of list) {
    const containers = await googleFetch(
      token,
      `https://tagmanager.googleapis.com/tagmanager/v2/${account.path}/containers`,
    );
    const hit = (containers.json?.container || []).find((c) => c.publicId === KNOWN.gtmPublicId);
    if (hit) {
      const accountId = account.accountId || account.path?.split("/")[1];
      if (!process.env.GTM_ACCOUNT_ID && accountId) found.GTM_ACCOUNT_ID = accountId;
      line("Tag Manager", "TAMAM", `${hit.publicId} · ${hit.name} · hesap ${accountId}`);
      return;
    }
  }
  line("Tag Manager", "TAMAM", `erişim var, ${KNOWN.gtmPublicId} bu hesapta yok (${list.length} hesap)`);
}

async function probeBusinessProfile(token) {
  const res = await googleFetch(token, "https://mybusinessaccountmanagement.googleapis.com/v1/accounts");
  if (!res.ok) {
    line("Business Profile", classify(res.status, res.json), errorText(res.json));
    return;
  }
  const accounts = res.json?.accounts || [];
  if (!accounts.length) {
    line("Business Profile", "TAMAM", "yetki var, bağlı işletme hesabı yok");
    return;
  }
  const bits = [];
  for (const account of accounts.slice(0, 3)) {
    const locs = await googleFetch(
      token,
      `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=title,storefrontAddress&pageSize=10`,
    );
    const titles = (locs.json?.locations || []).map((l) => l.title).filter(Boolean);
    bits.push(
      titles.length
        ? titles.join(", ")
        : `${account.accountName || account.name}${locs.ok ? "" : ` (${errorText(locs.json)})`}`,
    );
  }
  line("Business Profile", "TAMAM", bits.join(" | "));
}

async function probeYouTube(token) {
  const res = await googleFetch(
    token,
    "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
  );
  if (!res.ok) {
    line("YouTube", classify(res.status, res.json), errorText(res.json));
    return;
  }
  const ch = res.json?.items?.[0];
  if (!ch) {
    line("YouTube", "TAMAM", "yetki var, bu hesabın kanalı yok");
    return;
  }
  const same = ch.id === KNOWN.youtubeChannelId ? " · site kanalı" : "";
  line("YouTube", "TAMAM", `${ch.snippet?.title || ch.id} (${ch.id})${same}`);
}

export async function runStatus() {
  console.log("Google araçları — medidentistanbul.com\n");
  const token = await accessToken().catch((e) => {
    line("OAuth", "HATA", e.message || String(e));
    return null;
  });
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    line("OAuth", "EKSIK", "npm run google:auth");
    return;
  }
  if (!token) {
    line("OAuth", "HATA", "refresh token geçersiz. npm run google:auth");
    return;
  }
  line("OAuth", "TAMAM", "refresh token çalışıyor");
  const found = {};
  await Promise.all([
    probeAds(token),
    probeGa4(token, found),
    probeSearchConsole(token, found),
    probeTagManager(token, found),
    probeBusinessProfile(token),
    probeYouTube(token),
  ]);
  if (Object.keys(found).length) upsertEnv(found);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runStatus().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
}
