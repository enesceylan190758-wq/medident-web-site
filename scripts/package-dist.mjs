// Creates medident-dist.zip from dist/ for easy Turhost File Manager upload.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "..", "dist");
const out = path.join(__dirname, "..", "medident-dist.zip");

if (!fs.existsSync(dist)) {
  console.error("dist/ not found — run: npm run build");
  process.exit(1);
}

if (fs.existsSync(out)) fs.unlinkSync(out);
execSync(`cd "${dist}" && zip -r "${out}" . -x "*.DS_Store"`, { stdio: "inherit" });
const size = (fs.statSync(out).size / 1024 / 1024).toFixed(1);
console.log(`\nReady: ${out} (${size} MB)`);
console.log("Upload to Turhost public_html → Extract. See DEPLOY.md");
