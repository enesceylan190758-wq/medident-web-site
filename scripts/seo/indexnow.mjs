#!/usr/bin/env node
/**
 * Deploy sonrasi IndexNow ping (Bing + Yandex). Google IndexNow kullanmaz;
 * Google icin sitemap lastmod yeterli.
 *
 * Gerekli: INDEXNOW_KEY secret + dist/<key>.txt dosyasi (build sirasinda yazilir).
 * Anahtar yoksa sessizce atlar — deploy'u bloklamaz.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const KEY = process.env.INDEXNOW_KEY;
const HOST = process.env.INDEXNOW_HOST || "medidentistanbul.com";
if (!KEY) {
  console.log("INDEXNOW_KEY yok — atlandi.");
  process.exit(0);
}

const sitemapPath = path.join(ROOT, "dist/sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  console.log("dist/sitemap.xml yok — atlandi.");
  process.exit(0);
}

// Anahtar dosyasini yayina koy (IndexNow dogrulamasi icin zorunlu)
fs.writeFileSync(path.join(ROOT, "dist", `${KEY}.txt`), KEY);

const xml = fs.readFileSync(sitemapPath, "utf8");
const all = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1]);

// Son 7 gunde lastmod'u degisenler; yoksa tamami (ilk kurulumda)
const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const cutoff = Date.now() - 7 * 86400000;
let urls = blocks
  .map((b) => ({
    loc: b.match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1],
    mod: b.match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/)?.[1],
  }))
  .filter((u) => u.loc && (!u.mod || new Date(u.mod).getTime() >= cutoff))
  .map((u) => u.loc);

if (!urls.length) urls = all;
urls = urls.slice(0, 10000);

const payload = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls };

for (const endpoint of ["https://api.indexnow.org/indexnow", "https://yandex.com/indexnow"]) {
  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    console.log(`${endpoint} -> ${r.status} (${urls.length} URL)`);
  } catch (e) {
    console.log(`${endpoint} -> hata: ${e.message}`);
  }
}
