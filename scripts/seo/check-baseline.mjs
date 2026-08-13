#!/usr/bin/env node
/**
 * Deploy kapisi: RED sayisi baseline'i asarsa fail.
 * Eski borcu kilitlemez; yeni borcun sessizce artmasini engeller.
 *
 *   node scripts/seo/check-baseline.mjs --report lint-deploy.json
 *   Baseline: .seo-baseline.json  →  { "red": 451 }
 *
 * Borc dustukce baseline.red degerini dusurun (asla yukseltmeyin).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const argv = process.argv.slice(2);
const val = (f, d) => {
  const i = argv.indexOf(f);
  return i > -1 && argv[i + 1] ? argv[i + 1] : d;
};

const reportPath = path.resolve(ROOT, val("--report", "lint-deploy.json"));
const baselinePath = path.resolve(ROOT, val("--baseline", ".seo-baseline.json"));

if (!fs.existsSync(baselinePath)) {
  console.error(`Baseline yok: ${baselinePath}`);
  process.exit(1);
}
if (!fs.existsSync(reportPath)) {
  console.error(`Rapor yok: ${reportPath} (once lint --report-only --json ... calistir)`);
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const cap = Number(baseline.red);
const red = Number(report.red);

console.log(`Baseline RED tavan: ${cap}`);
console.log(`Simdi RED:          ${red}  (${report.scanned} sayfa)`);

if (red > cap) {
  console.error(`\nFAIL: RED ${red} > baseline ${cap}. Yeni borc birikmis — merge/deploy durdu.`);
  console.error("Duzeltin veya (sadece gercekten dustuyse) .seo-baseline.json red degerini dusurun.\n");
  process.exit(1);
}

if (red < cap) {
  console.log(`\nNot: RED baseline altinda (${red} < ${cap}). Baseline'i ${red}'e dusurmeyi dusunun.`);
}

console.log("\nOK — baseline asilmadi.\n");
