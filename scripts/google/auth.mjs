#!/usr/bin/env node
/**
 * Tek seferlik Google onayı. Ads, GA4, Search Console, Tag Manager,
 * Business Profile ve YouTube aynı refresh token'a yazılır.
 *
 * Önce .env içine GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET.
 * OAuth istemcisi türü: Masaüstü. Yönlendirme: http://127.0.0.1:8787/oauth/callback
 */
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { OAuth2Client } from "google-auth-library";
import { loadEnv, upsertEnv } from "./env.mjs";
import { API_SETUP, SCOPES } from "./config.mjs";
import { runStatus } from "./status.mjs";

const PORT = 8787;
const REDIRECT = `http://127.0.0.1:${PORT}/oauth/callback`;

loadEnv();

function printSetup() {
  console.log("Google erişimi için iki değer eksik.\n");
  console.log("1. https://console.cloud.google.com/apis/credentials");
  console.log("   OAuth istemci kimliği → Masaüstü uygulaması.");
  console.log(`   Yetkili yönlendirme URI'si: ${REDIRECT}`);
  console.log("2. Bu iki satırı .env dosyasına yaz:");
  console.log("   GOOGLE_CLIENT_ID=");
  console.log("   GOOGLE_CLIENT_SECRET=");
  console.log("\nAynı projede şu API'ler açık olmalı:");
  for (const [name, url] of API_SETUP) console.log(`   ${name}\n   ${url}`);
  console.log("\nAds: Eyl 2026 sonrası developer token şart değil.");
  console.log("Cloud proje erişimi: https://console.cloud.google.com/google/ads-apis/overview");
  console.log("Eski yol (MCC API Merkezi) artık gerekmez.\n");
  console.log("Sonra: npm run google:auth");
}

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  printSetup();
  process.exit(1);
}

const oauth = new OAuth2Client(clientId, clientSecret, REDIRECT);
const state = Math.random().toString(36).slice(2);
const authUrl = oauth.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
  state,
});

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", REDIRECT);
  if (url.pathname !== "/oauth/callback") {
    res.writeHead(404);
    res.end();
    return;
  }
  const code = url.searchParams.get("code");
  const gotState = url.searchParams.get("state");
  const err = url.searchParams.get("error");
  if (err || !code || gotState !== state) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Onay tamamlanmadı. Terminale dön.");
    console.error(err || "state uyuşmadı veya kod yok");
    server.close();
    process.exit(1);
  }
  try {
    const { tokens } = await oauth.getToken(code);
    if (!tokens.refresh_token) {
      throw new Error("Google refresh token vermedi. Onay ekranında hesabın erişimini kaldırıp tekrar dene.");
    }
    upsertEnv({ GOOGLE_REFRESH_TOKEN: tokens.refresh_token });
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<p>MediDent Google erişimi kaydedildi. Bu sekmeyi kapatabilirsin.</p>");
    console.log("Refresh token .env dosyasına yazıldı.\n");
    server.close();
    await runStatus();
    process.exit(0);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Token alınamadı. Terminale bak.");
    console.error(e.message || e);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Tarayıcı açılıyor. Google 'doğrulanmamış uygulama' derse Gelişmiş → devam.");
  console.log("Bu, projenin sahibi olan klinik Google hesabı içindir.\n");
  console.log(authUrl + "\n");
  if (!process.env.GOOGLE_AUTH_NO_OPEN) execFile("open", [authUrl], () => {});
});

setTimeout(() => {
  console.error("3 dakika içinde onay gelmedi.");
  server.close();
  process.exit(1);
}, 600000).unref();
