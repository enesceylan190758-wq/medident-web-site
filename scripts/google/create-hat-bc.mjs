#!/usr/bin/env node
/**
 * Hat B (DE) + Hat C (FR) Search smoke — İstanbul Dent hesabı.
 *
 * Bütçe varsayımı: 50.000 TRY toplam (~45 gün)
 *   DE: 780 TRY/gün  (~35.000 TRY)
 *   FR: 170 TRY/gün  (~7.500 TRY)
 *   Rezerv: 7.500 TRY (Meta/ölçek — burada harcanmaz)
 *
 * Kampanyalar PAUSED oluşturulur. --enable ile açılır.
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

/** @returns {{ text: string, match: string }[]} */
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

const ENABLE = process.argv.includes("--enable");
const DRY = process.argv.includes("--dry");
const cid = adsCustomerId();
const v = KNOWN.adsApiVersion;
const status = ENABLE ? "ENABLED" : "PAUSED";

const TRY = (n) => String(Math.round(n * 1_000_000));

const DE_BUDGET_TRY = 780;
const FR_BUDGET_TRY = 170;

const DE_URL = "https://medidentistanbul.com/de/preise/";
const FR_URL = "https://medidentistanbul.com/fr/prix-implants-dentaires-turquie/";

function lenOk(label, text, max) {
  const n = [...text].length;
  if (n > max) throw new Error(`${label} ${n}>${max}: ${text}`);
  return text;
}

const deHeadlines = [
  "Zähne in Istanbul planen",
  "Kostenlose Foto-Einschätzung",
  "Transparente Preise online",
  "Nachsorge per WhatsApp",
  "2. Termin eingeplant",
  "Zahnklinik Istanbul",
  "Plan vor dem Flug",
  "MediDent Istanbul",
  "Hotel & Transfer möglich",
  "Schriftlicher Behandlungsplan",
  "DE WhatsApp Beratung",
  "Ohne versteckte Kosten",
  "Preisliste online ansehen",
  "Zertifizierte Marken",
  "Istanbul Zahnbehandlung",
].map((t) => ({ text: lenOk("H", t, 30) }));

const deDescriptions = [
  "Kostenlose Foto-Einschätzung vor dem Flug. Transparente Preise online einsehen.",
  "Plan zuerst, 2. Termin eingeplant. Nachsorge per WhatsApp. Hotel und Transfer ab 8 Zähnen.",
].map((t) => ({ text: lenOk("D", t, 90) }));

const frHeadlines = [
  "Soins dentaires à Istanbul",
  "Devis photo gratuit",
  "Prix transparents en ligne",
  "Réponse sous 24h",
  "Plan avant le voyage",
  "Clinique dentaire Istanbul",
  "Suivi par WhatsApp",
  "MediDent Istanbul",
  "Hotel & transfert possibles",
  "Plan de traitement écrit",
  "Sans frais caches",
  "Consultation en francais",
  "Prix en ligne",
  "Marques certifiees",
  "Voyage organise",
].map((t) => ({ text: lenOk("H", t, 30) }));

const frDescriptions = [
  "Devis photo gratuit, reponse sous 24h. Prix transparents en ligne.",
  "Plan d'abord, voyage ensuite. Suivi WhatsApp. Hotel et transfert des 8 dents.",
].map((t) => ({ text: lenOk("D", t, 90) }));

const deGroups = [
  {
    name: "B1 Colloquial",
    keywords: [
      { text: "Zähne machen lassen Türkei", match: "PHRASE" },
      { text: "Zähne machen Türkei Kosten", match: "PHRASE" },
      { text: "Zähne machen lassen Türkei Kosten", match: "EXACT" },
      { text: "Zähne Türkei Preise", match: "PHRASE" },
    ],
  },
  {
    name: "B2 High Ticket",
    keywords: [
      { text: "All on 4 Türkei Kosten", match: "PHRASE" },
      { text: "All-on-4 Türkei", match: "PHRASE" },
      { text: "Zahnimplantate Türkei", match: "PHRASE" },
      { text: "Zahnimplantat Türkei Kosten", match: "PHRASE" },
      { text: "Vollgebiss Türkei", match: "PHRASE" },
    ],
  },
  {
    name: "B3 Trust",
    keywords: [
      { text: "Zahnbehandlung Türkei Erfahrungen", match: "PHRASE" },
      { text: "Zahnklinik Istanbul Erfahrungen", match: "PHRASE" },
      { text: "Zähne machen Türkei Nachsorge", match: "PHRASE" },
    ],
  },
];

const frGroups = [
  {
    name: "C1 Colloquial",
    keywords: [
      { text: "refaire ses dents en turquie", match: "PHRASE" },
      { text: "dents en turquie prix", match: "PHRASE" },
      { text: "soins dentaires turquie", match: "PHRASE" },
    ],
  },
  {
    name: "C2 Implant",
    keywords: [
      { text: "implant dentaire turquie prix", match: "PHRASE" },
      { text: "all on 4 turquie", match: "PHRASE" },
      { text: "implants dentaires istanbul", match: "PHRASE" },
    ],
  },
];

const deNegatives = loadNegatives("universal", "hat_b_de");
const frNegatives = loadNegatives("universal", "hat_c_fr");

async function mutate(token, operations) {
  const body = { mutateOperations: operations, partialFailure: true };
  if (DRY) {
    console.log(JSON.stringify(body, null, 2).slice(0, 2000));
    return { ok: true, json: { dry: true } };
  }
  return googleFetch(token, `https://googleads.googleapis.com/${v}/customers/${cid}/googleAds:mutate`, {
    method: "POST",
    headers: {},
    body,
  });
}

function campaignOps({ tempBudget, tempCampaign, name, amountTry, geoId, langId, url, groups, headlines, descriptions, negatives }) {
  const ops = [];
  ops.push({
    campaignBudgetOperation: {
      create: {
        resourceName: `customers/${cid}/campaignBudgets/${tempBudget}`,
        name: `${name} Budget`,
        amountMicros: TRY(amountTry),
        deliveryMethod: "STANDARD",
        explicitlyShared: false,
      },
    },
  });
  ops.push({
    campaignOperation: {
      create: {
        resourceName: `customers/${cid}/campaigns/${tempCampaign}`,
        name,
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
          positiveGeoTargetType: "PRESENCE_OR_INTEREST",
          negativeGeoTargetType: "PRESENCE",
        },
        targetSpend: {},
        // Maximize Clicks — smoke için dönüşüm azken doğru
      },
    },
  });
  ops.push({
    campaignCriterionOperation: {
      create: {
        campaign: `customers/${cid}/campaigns/${tempCampaign}`,
        language: { languageConstant: `languageConstants/${langId}` },
      },
    },
  });
  ops.push({
    campaignCriterionOperation: {
      create: {
        campaign: `customers/${cid}/campaigns/${tempCampaign}`,
        location: { geoTargetConstant: `geoTargetConstants/${geoId}` },
      },
    },
  });
  for (const neg of negatives) {
    const text = typeof neg === "string" ? neg : neg.text;
    const matchType = typeof neg === "string" ? "BROAD" : neg.match || "BROAD";
    ops.push({
      campaignCriterionOperation: {
        create: {
          campaign: `customers/${cid}/campaigns/${tempCampaign}`,
          negative: true,
          keyword: { text, matchType },
        },
      },
    });
  }

  let tempAg = tempCampaign - 10;
  for (const g of groups) {
    const agId = tempAg--;
    ops.push({
      adGroupOperation: {
        create: {
          resourceName: `customers/${cid}/adGroups/${agId}`,
          name: g.name,
          campaign: `customers/${cid}/campaigns/${tempCampaign}`,
          status: "ENABLED",
          type: "SEARCH_STANDARD",
        },
      },
    });
    for (const kw of g.keywords) {
      ops.push({
        adGroupCriterionOperation: {
          create: {
            adGroup: `customers/${cid}/adGroups/${agId}`,
            status: "ENABLED",
            keyword: { text: kw.text, matchType: kw.match },
          },
          exemptPolicyViolationKeys: [
            { policyName: "HEALTH_IN_PERSONALIZED_ADS", violatingText: kw.text },
          ],
        },
      });
    }
    ops.push({
      adGroupAdOperation: {
        create: {
          adGroup: `customers/${cid}/adGroups/${agId}`,
          status: "ENABLED",
          ad: {
            finalUrls: [url],
            responsiveSearchAd: {
              headlines,
              descriptions,
              path1: url.includes("/de/") ? "preise" : "prix",
              path2: "istanbul",
            },
          },
        },
      },
    });
  }
  return ops;
}

async function enableConversions(token) {
  const ids = [
    "7743684701", // whatsapp_click
    "7743685625", // phone_click
    "7743892017", // generate_lead
  ];
  const ops = ids.map((id) => ({
    conversionActionOperation: {
      update: {
        resourceName: `customers/${cid}/conversionActions/${id}`,
        status: "ENABLED",
      },
      updateMask: "status",
    },
  }));
  const res = await mutate(token, ops);
  if (!res.ok) {
    console.log("conversion enable:", errorText(res.json));
    console.log(JSON.stringify(res.json).slice(0, 500));
  } else {
    console.log("Dönüşümler açıldı: whatsapp_click, phone_click, generate_lead");
  }
}

async function main() {
  const token = await accessToken();
  if (!token) throw new Error("OAuth yok — npm run google:auth");

  console.log(`Hesap ${cid} · durum ${status} · DE ${DE_BUDGET_TRY} TRY/gün · FR ${FR_BUDGET_TRY} TRY/gün\n`);

  await enableConversions(token);

  // Temp IDs must be unique negative numbers within one mutate request
  const ops = [
    ...campaignOps({
      tempBudget: -1,
      tempCampaign: -2,
      name: "Hat B — DE Search Dental Tourism",
      amountTry: DE_BUDGET_TRY,
      geoId: 2276, // Germany
      langId: 1001, // German
      url: DE_URL,
      groups: deGroups,
      headlines: deHeadlines,
      descriptions: deDescriptions,
      negatives: deNegatives,
    }),
    ...campaignOps({
      tempBudget: -101,
      tempCampaign: -102,
      name: "Hat C — FR Search Dental Tourism",
      amountTry: FR_BUDGET_TRY,
      geoId: 2250, // France
      langId: 1002, // French
      url: FR_URL,
      groups: frGroups,
      headlines: frHeadlines,
      descriptions: frDescriptions,
      negatives: frNegatives,
    }),
  ];

  console.log(`${ops.length} mutate işlemi…`);
  const res = await mutate(token, ops);
  if (!res.ok) {
    console.error("HATA:", errorText(res.json));
    console.error(JSON.stringify(res.json, null, 2).slice(0, 4000));
    process.exit(1);
  }

  const results = res.json?.mutateOperationResponses || [];
  console.log(`\nTamam — ${results.length} kaynak oluşturuldu (${status}).`);
  for (const r of results) {
    const name =
      r.campaignResult?.resourceName ||
      r.campaignBudgetResult?.resourceName ||
      r.adGroupResult?.resourceName ||
      r.adGroupAdResult?.resourceName ||
      r.adGroupCriterionResult?.resourceName ||
      r.campaignCriterionResult?.resourceName ||
      r.conversionActionResult?.resourceName;
    if (name && (name.includes("/campaigns/") || name.includes("/campaignBudgets/"))) {
      console.log(" ", name);
    }
  }

  if (!ENABLE) {
    console.log("\nYayında değil (PAUSED). Açmak için:");
    console.log("  node scripts/google/create-hat-bc.mjs --enable");
    console.log("veya Google Ads arayüzünden kampanyaları Enabled yap.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
