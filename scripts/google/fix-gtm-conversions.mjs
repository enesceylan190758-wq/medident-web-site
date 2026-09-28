#!/usr/bin/env node
/**
 * GTM-NTDLLHF düzeltmesi (yazma scope gerekir):
 *   npm run google:auth   # tagmanager.edit.containers + publish
 *   npm run google:gtm:fix-conversions
 *
 * - CE tetikleyicileri: whatsapp_click / phone_click / generate_lead
 * - GA4 etiketlerine ekle
 * - Dc Form WM + 2025 Form (AW-346086325 + gonderildi URL) PAUSE
 * - Workspace version publish
 */
import { loadEnv } from "./env.mjs";
import { accessToken } from "./http.mjs";

loadEnv();

const ACC = "6006282282";
const CONTAINER = "61262461";
const WS = "10";
const base = `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${ACC}/containers/${CONTAINER}/workspaces/${WS}`;

async function gtm(token, method, path, body) {
  const r = await fetch(base + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = j?.error?.message || JSON.stringify(j).slice(0, 400);
    throw new Error(`${method} ${path}: ${r.status} ${msg}`);
  }
  return j;
}

async function ensureCeTrigger(token, name, eventName) {
  const list = await gtm(token, "GET", "/triggers");
  const existing = (list.trigger || []).find((t) => t.name === name);
  if (existing) {
    console.log("OK trigger", name, existing.triggerId);
    return existing;
  }
  const created = await gtm(token, "POST", "/triggers", {
    name,
    type: "customEvent",
    customEventFilter: [
      {
        type: "equals",
        parameter: [
          { type: "template", key: "arg0", value: "{{_event}}" },
          { type: "template", key: "arg1", value: eventName },
        ],
      },
    ],
  });
  console.log("+ trigger", name, created.triggerId);
  return created;
}

async function addTriggersToTag(token, tagId, extraIds) {
  const tag = await gtm(token, "GET", `/tags/${tagId}`);
  const set = new Set((tag.firingTriggerId || []).map(String));
  for (const id of extraIds) set.add(String(id));
  const next = [...set];
  const same =
    next.length === (tag.firingTriggerId || []).length &&
    next.every((id) => (tag.firingTriggerId || []).map(String).includes(id));
  if (same) {
    console.log("OK tag", tag.name);
    return;
  }
  tag.firingTriggerId = next;
  await gtm(token, "PUT", `/tags/${tagId}`, tag);
  console.log("~ tag", tag.name, "→", next.join(","));
}

async function pauseTag(token, tagId) {
  const tag = await gtm(token, "GET", `/tags/${tagId}`);
  if (tag.paused) {
    console.log("OK paused", tag.name);
    return;
  }
  tag.paused = true;
  await gtm(token, "PUT", `/tags/${tagId}`, tag);
  console.log("⏸ paused", tag.name);
}

async function main() {
  const token = await accessToken();
  if (!token) throw new Error("OAuth yok — npm run google:auth");

  const ceWa = await ensureCeTrigger(token, "CE - whatsapp_click", "whatsapp_click");
  const cePhone = await ensureCeTrigger(token, "CE - phone_click", "phone_click");
  const ceLead = await ensureCeTrigger(token, "CE - generate_lead", "generate_lead");

  await addTriggersToTag(token, 16, [ceWa.triggerId]);
  await addTriggersToTag(token, 17, [cePhone.triggerId]);
  await addTriggersToTag(token, 18, [ceLead.triggerId]);

  await pauseTag(token, 10); // Dc Form WM
  await pauseTag(token, 11); // 2025 Form

  const version = await gtm(token, "POST", "/versions", {
    name: `Fix CE conversions ${new Date().toISOString().slice(0, 10)}`,
    notes:
      "Custom Event triggers for tracking.js dataLayer; pause AW-346086325 form tags (wrong account + /gonderildi).",
  });
  const vid = version.containerVersion?.containerVersionId;
  console.log("version", vid);

  const pub = await fetch(
    `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${ACC}/containers/${CONTAINER}/versions/${vid}:publish`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }
  );
  const pubJ = await pub.json().catch(() => ({}));
  if (!pub.ok) throw new Error(`publish ${pub.status} ${JSON.stringify(pubJ).slice(0, 500)}`);
  console.log("PUBLISHED", pubJ.containerVersion?.containerVersionId, pubJ.containerVersion?.name);
}

main().catch((e) => {
  console.error(e.message || e);
  if (String(e.message || e).includes("403") || String(e.message || e).includes("insufficient")) {
    console.error("\nYeniden auth gerekli:\n  npm run google:auth\nSonra tekrar: npm run google:gtm:fix-conversions");
  }
  process.exit(1);
});
