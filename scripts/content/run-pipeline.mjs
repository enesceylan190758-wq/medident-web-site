#!/usr/bin/env node
/**
 * SEO/GEO content pipeline — 5-stage agent workflow (orchestrator).
 *
 * Stages:
 *   1. Research data (market-keywords.json — refresh manually or via research agent)
 *   2. Director brief (implicit in geo-answers + topic queue)
 *   3. Content generation (generate.mjs / rewrite-geo-tr.mjs)
 *   4. Director QC (director-qc.mjs --strict)
 *   5. Build (build.mjs)
 *
 * Usage:
 *   node scripts/content/run-pipeline.mjs              # full pipeline
 *   node scripts/content/run-pipeline.mjs --geo-only   # rewrite TR geo + QC + build
 *   node scripts/content/run-pipeline.mjs --daily        # daily 2+2 + QC + build
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = new Set(process.argv.slice(2));

function run(cmd, label) {
  console.log(`\n── ${label} ──`);
  const r = spawnSync(cmd, { shell: true, cwd: ROOT, stdio: "inherit", encoding: "utf8" });
  if (r.status !== 0) {
    console.error(`FAILED: ${label}`);
    process.exit(r.status || 1);
  }
}

// Stage 1: research artifact must exist
const research = path.join(ROOT, "src/content/research/market-keywords.json");
console.log("Stage 1 — Research:", research);

if (args.has("--geo-only")) {
  run("node scripts/content/rewrite-geo-tr.mjs", "Stage 3 — Rewrite TR GEO packs");
} else if (args.has("--daily")) {
  run("node scripts/content/generate.mjs --blog 2 --geo 2", "Stage 3 — Daily blog+GEO");
} else {
  run("node scripts/content/rewrite-geo-tr.mjs", "Stage 3a — Rewrite TR GEO (Faz 0)");
}

run("node scripts/content/director-qc.mjs --strict --tr-only", "Stage 4 — Director QC (TR geo)");
run("node build.mjs", "Stage 5 — Build static site");
console.log("\n✓ Pipeline complete. Deploy dist/ or run npm run deploy:domain");
