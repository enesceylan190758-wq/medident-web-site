#!/usr/bin/env node
/**
 * Rewrite TR GEO packs from topic-specific geo-answers database.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GEO_ANSWERS_TR, buildGeoPackFromTopic } from "./geo-answers.mjs";
import { reviewGeoPack } from "./director-qc.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PACKS = path.join(ROOT, "src/content/geo/packs.json");
const TOPICS = path.join(ROOT, "src/content/geo-topics.json");

const topics = JSON.parse(fs.readFileSync(TOPICS, "utf8"));
const packs = JSON.parse(fs.readFileSync(PACKS, "utf8"));
const topicBySlug = Object.fromEntries(topics.map((t) => [t.slug, t]));
const enDePacks = packs.filter((p) => p.lang !== "tr");

const rewritten = [];
const usedSlugs = new Set();

function addPack(topic) {
  const built = buildGeoPackFromTopic(topic);
  if (!built || usedSlugs.has(built.slug)) return;
  const qc = reviewGeoPack(built, rewritten);
  if (!qc.ok) console.warn(`WARN ${built.slug}:`, qc.issues.join("; "));
  rewritten.push(built);
  usedSlugs.add(built.slug);
}

// 1) All curated answers (primary source)
for (const slug of Object.keys(GEO_ANSWERS_TR)) {
  if (!GEO_ANSWERS_TR[slug] || slug === "hollywoodlywood-smile-nedir") continue;
  const topic = topicBySlug[slug] || {
    slug,
    bucket: "kategori",
    q: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + "?",
  };
  addPack(topic);
}

// 2) Extra topics from queue that have answers under different slugs
const aliasTopics = [
  { bucket: "kategori", slug: "zirkonyum-porselen-kaplama-nedir", q: "Zirkonyum porselen kaplama nedir?" },
  { bucket: "kategori", slug: "bonding-tedavisi-nedir", q: "Bonding tedavisi nedir?" },
  { bucket: "kategori", slug: "sedasyonlu-dis-tedavisi-nedir", q: "Sedasyonlu diş tedavisi nedir?" },
  { bucket: "kategori", slug: "1-gunde-implant-nedir", q: "1 günde implant nedir?" },
  { bucket: "kategori", slug: "profesyonel-dis-cekimi-nasil-yapilir", q: "Profesyonel diş çekimi nasıl yapılır?" },
  { bucket: "kategori", slug: "gulush-tasarimi-lamine-veneer-nedir", q: "Gülüş tasarımı lamine veneer nedir?" },
  { bucket: "kategori", slug: "cocuk-dis-hekimligi-ilk-muayene", q: "Çocuk diş hekimliği ilk muayene nasıl olmalı?" },
  { bucket: "kategori", slug: "kanal-tedavisi-mikroskop-ile", q: "Mikroskop ile kanal tedavisi nedir?" },
  { bucket: "kategori", slug: "periodontoloji-dis-eti-sagligi", q: "Periodontoloji ve diş eti sağlığı nedir?" },
  { bucket: "marka", slug: "medident-istanbul-klinik-deneyimi", q: "MediDent İstanbul klinik deneyimi nasıl?" },
];
for (const t of aliasTopics) addPack(t);

const all = [...rewritten, ...enDePacks];
fs.writeFileSync(PACKS, JSON.stringify(all, null, 2) + "\n");
console.log(`Rewrote ${rewritten.length} TR GEO packs. Total: ${all.length}`);
