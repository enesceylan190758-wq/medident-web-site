#!/usr/bin/env node
/**
 * Matris smoke — Almanya · Diş Implant (gurbetçi TR kelime)
 * Kaynak: docs/google-ads/MediDent-SKAG-Matrisi.pdf (2) · Planner 23 Eyl 2026
 *
 * 1 kampanya · 2 SKAG · 6 RSA (PAUSED)
 * Bütçe: 670 TRY/gün
 *
 * PDF'teki yasaklı iddialar (garanti, uygun fiyat, 4.9/500+) çıkarıldı.
 * Sahte /de/dis-implanti-fiyat yok — gerçek TR implant LP kullanılıyor.
 *
 *   node scripts/google/create-skag-de-implant.mjs
 *   node scripts/google/create-skag-de-implant.mjs --dry
 *   node scripts/google/create-skag-de-implant.mjs --enable   # sadece onay sonrası
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./env.mjs";
import { KNOWN } from "./config.mjs";
import { accessToken, adsCustomerId, googleFetch, errorText } from "./http.mjs";

loadEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEG_PATH = path.join(__dirname, "../../docs/google-ads/universal-negative-keywords.json");

const ENABLE = process.argv.includes("--enable");
const DRY = process.argv.includes("--dry");
const cid = adsCustomerId();
const v = KNOWN.adsApiVersion;
const status = ENABLE ? "ENABLED" : "PAUSED";

const TRY = (n) => String(Math.round(n * 1_000_000));
const BUDGET_TRY = 670;
const LP = "https://medidentistanbul.com/hizmetler/implantoloji-implant-tedavisi/";

function lenOk(label, text, max) {
  const n = [...text].length;
  if (n > max) throw new Error(`${label} ${n}>${max}: ${text}`);
  return text;
}

function loadNegatives(...listKeys) {
  const raw = JSON.parse(fs.readFileSync(NEG_PATH, "utf8"));
  const seen = new Set();
  const out = [];
  for (const key of listKeys) {
    const list = raw.lists?.[key];
    if (!list?.terms) continue;
    for (const t of list.terms) {
      const k = `${t.match || "BROAD"}::${t.text.toLowerCase()}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ text: t.text, match: t.match || "BROAD" });
    }
  }
  return out;
}

const sharedHeadlines = [
  "Ücretsiz Foto Değerlendirme",
  "Yazılı Tedavi Planı",
  "WhatsApp ile İletişim",
  "Straumann ve Osstem",
  "İstanbul Diş Kliniği",
  "Şeffaf Fiyat Bilgisi",
  "2. Kontrol Planlanır",
  "Transfer Seçeneği Var",
  "MediDent İstanbul",
  "Plan Önce Tedavi Sonra",
  "Online Ön Görüşme",
  "Marka İmplant Seçenekleri",
].map((t) => ({ text: lenOk("H", t, 30) }));

const descriptions = [
  "Foto ile ön değerlendirme. Yazılı plan sonrası randevu. WhatsApp ile yazın.",
  "İstanbul klinik. Şeffaf fiyat bilgisi. 2. kontrol sürecine dahil edilir.",
].map((t) => ({ text: lenOk("D", t, 90) }));

/** PDF: 2 SKAG · exact · pin H1 = kelime dili */
const skags = [
  {
    name: "SKAG 1 — diş implant fiyat",
    keyword: { text: "diş implant fiyat", match: "EXACT" },
    path1: "implant",
    path2: "fiyat",
    variants: [
      {
        pin: "Diş Implant Fiyat Türkiye",
        nameSuffix: "A",
      },
      {
        pin: "Diş Implant Fiyat Bilgisi",
        nameSuffix: "B",
      },
      {
        pin: "İmplant Fiyat Türkiye",
        nameSuffix: "C",
      },
    ],
  },
  {
    name: "SKAG 2 — türkiye diş implantı",
    keyword: { text: "türkiye diş implantı", match: "EXACT" },
    path1: "turkiye",
    path2: "implant",
    variants: [
      {
        pin: "Türkiye'de Diş Implant",
        nameSuffix: "A",
      },
      {
        pin: "Türkiye Diş Implantı",
        nameSuffix: "B",
      },
      {
        pin: "Diş Implantı Türkiye",
        nameSuffix: "C",
      },
    ],
  },
];

async function mutate(token, operations) {
  const body = { mutateOperations: operations, partialFailure: true };
  if (DRY) {
    console.log(JSON.stringify(body, null, 2).slice(0, 3500));
    return { ok: true, json: { dry: true, mutateOperationResponses: [] } };
  }
  return googleFetch(token, `https://googleads.googleapis.com/${v}/customers/${cid}/googleAds:mutate`, {
    method: "POST",
    headers: {},
    body,
  });
}

function buildOps() {
  const negatives = loadNegatives("universal");
  const ops = [];
  const tempBudget = -1;
  const tempCampaign = -2;

  ops.push({
    campaignBudgetOperation: {
      create: {
        resourceName: `customers/${cid}/campaignBudgets/${tempBudget}`,
        name: "SKAG DE Gurbetçi Diş Implant Budget",
        amountMicros: TRY(BUDGET_TRY),
        deliveryMethod: "STANDARD",
        explicitlyShared: false,
      },
    },
  });

  ops.push({
    campaignOperation: {
      create: {
        resourceName: `customers/${cid}/campaigns/${tempCampaign}`,
        name: "SKAG — DE Gurbetçi Diş Implant",
        status,
        advertisingChannelType: "SEARCH",
        campaignBudget: `customers/${cid}/campaignBudgets/${tempBudget}`,
        containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
        networkSettings: {
          targetGoogleSearch: true,
          targetSearchNetwork: false,
          targetContentNetwork: false,
          targetPartnerSearchNetwork: false,
        },
        geoTargetTypeSetting: {
          positiveGeoTargetType: "PRESENCE",
          negativeGeoTargetType: "PRESENCE",
        },
        // PDF: Maks. Dönüşüm — whatsapp_click / phone_click açık olmalı
        maximizeConversions: {},
      },
    },
  });

  // TR dil (gurbetçi) + DE geo
  ops.push({
    campaignCriterionOperation: {
      create: {
        campaign: `customers/${cid}/campaigns/${tempCampaign}`,
        language: { languageConstant: "languageConstants/1037" },
      },
    },
  });
  ops.push({
    campaignCriterionOperation: {
      create: {
        campaign: `customers/${cid}/campaigns/${tempCampaign}`,
        location: { geoTargetConstant: "geoTargetConstants/2276" },
      },
    },
  });

  for (const neg of negatives) {
    ops.push({
      campaignCriterionOperation: {
        create: {
          campaign: `customers/${cid}/campaigns/${tempCampaign}`,
          negative: true,
          keyword: { text: neg.text, matchType: neg.match },
        },
      },
    });
  }

  let tempAg = -20;

  for (const skag of skags) {
    const agId = tempAg--;
    ops.push({
      adGroupOperation: {
        create: {
          resourceName: `customers/${cid}/adGroups/${agId}`,
          name: skag.name,
          campaign: `customers/${cid}/campaigns/${tempCampaign}`,
          status: "ENABLED",
          type: "SEARCH_STANDARD",
        },
      },
    });

    ops.push({
      adGroupCriterionOperation: {
        create: {
          adGroup: `customers/${cid}/adGroups/${agId}`,
          status: "ENABLED",
          keyword: { text: skag.keyword.text, matchType: skag.keyword.match },
        },
        exemptPolicyViolationKeys: [
          { policyName: "HEALTH_IN_PERSONALIZED_ADS", violatingText: skag.keyword.text },
        ],
      },
    });

    for (const variant of skag.variants) {
      const pin = lenOk("pin", variant.pin, 30);
      const headlines = [{ text: pin, pinnedField: "HEADLINE_1" }, ...sharedHeadlines].slice(0, 15);
      ops.push({
        adGroupAdOperation: {
          create: {
            adGroup: `customers/${cid}/adGroups/${agId}`,
            status: "PAUSED",
            ad: {
              finalUrls: [LP],
              responsiveSearchAd: {
                headlines,
                descriptions,
                path1: skag.path1,
                path2: skag.path2,
              },
            },
          },
        },
      });
    }
  }

  return ops;
}

async function main() {
  const token = await accessToken();
  if (!token) throw new Error("OAuth yok — npm run google:auth");

  // Aynı isimde kampanya varsa tekrar kurma
  if (!DRY) {
    const q = `SELECT campaign.id, campaign.name, campaign.status FROM campaign WHERE campaign.name = 'SKAG — DE Gurbetçi Diş Implant' AND campaign.status != 'REMOVED'`;
    const check = await googleFetch(token, `https://googleads.googleapis.com/${v}/customers/${cid}/googleAds:searchStream`, {
      method: "POST",
      body: { query: q },
    });
    const existing = (check.json || []).flatMap((b) => b.results || []);
    if (existing.length) {
      console.error("Kampanya zaten var — tekrar kurmadım:");
      for (const r of existing) console.error(`  ${r.campaign.id} · ${r.campaign.status}`);
      process.exit(1);
    }
  }

  const ops = buildOps();
  console.log(`Hesap ${cid} · ${status} · ${BUDGET_TRY} TRY/gün · ${ops.length} işlem`);
  console.log(`LP: ${LP}`);
  console.log(`SKAG: ${skags.map((s) => s.keyword.text).join(" | ")}\n`);

  const res = await mutate(token, ops);
  if (!res.ok) {
    console.error("HATA:", errorText(res.json));
    console.error(JSON.stringify(res.json, null, 2).slice(0, 5000));
    process.exit(1);
  }

  if (res.json?.partialFailureError) {
    console.error("Kısmi hata:", JSON.stringify(res.json.partialFailureError, null, 2).slice(0, 3000));
  }

  const results = res.json?.mutateOperationResponses || [];
  console.log(`Tamam — ${results.length} kaynak (${status}).`);
  for (const r of results) {
    const name =
      r.campaignResult?.resourceName ||
      r.campaignBudgetResult?.resourceName ||
      r.adGroupResult?.resourceName ||
      r.adGroupAdResult?.resourceName ||
      r.adGroupCriterionResult?.resourceName ||
      r.campaignCriterionResult?.resourceName;
    if (name && (name.includes("/campaigns/") || name.includes("/adGroups/"))) console.log(" ", name);
  }

  if (!ENABLE) {
    console.log("\nKampanya PAUSED. Açmak için onay sonrası: npm run google:ads:skag-de-implant -- --enable");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
