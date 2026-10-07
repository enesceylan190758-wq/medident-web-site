# Reklam takip sistemi (Meta)

Sadece sunucu tarafında çalışan, **çok hesaplı** reklam okuma ve raporlama.

## Kimlik doğrulama

- Tek jeton: Meta System User `medident-ads` (süresiz, `ads_read` + `ads_management`).
- Claude Code bulut ortamında jeton, ortamın **API credentials** bölümünde
  (`Meta Marketing API (MediDent)`, host `graph.facebook.com`, Bearer). Proxy
  `Authorization` header'ını kendisi ekler; `META_ACCESS_TOKEN` diye bir değişken yoktur ve kod jetonu görmez.
- Başka bir sunucuda (VPS/cron) `META_ACCESS_TOKEN` verilirse Bearer header olarak gönderilir.
- Jeton hiçbir zaman URL'ye, loga, repoya ya da tarayıcıya girmez.

Node'un yerleşik `fetch`'i `HTTPS_PROXY`'yi kendiliğinden okumaz. Bulut ortamında
`NODE_USE_ENV_PROXY=1` gerekir (`npm run ads:*` scriptleri bunu ayarlar).

## Hesaplar

System User'a atanan her hesap otomatik görünür. Müşteri hesapları iş ortağı
paylaşımıyla aynı System User'a atandığında ek ayar gerekmeden listeye girer.
`META_AD_ACCOUNT_IDS` (virgüllü, `act_` önekli ya da öneksiz) verilirse yalnızca o hesaplar okunur.

```
npm run ads:check   # jeton sahibi, izinler, görünen hesaplar, son 30 gün harcama
```

## Analiz kuralları (adım 3)

```
npm run ads:analyze                         # tüm hesaplar, dünden geriye 30 gün
npm run ads:analyze -- --account act_...    # tek hesap
npm run ads:analyze -- --until 2026-03-31   # geçmiş dönem
npm run ads:analyze -- --json               # dashboard/Telegram için
npm run ads:test                            # kural testleri (sentetik veri)
```

Sonuç = form (lead) + WhatsApp konuşması başlatma. Hedef CPL, her hesabın kendi 30 günlük
ortalamasıdır (sadece form/mesaj amaçlı kampanyalardan); sabit hedef için `ADS_TARGET_CPL` JSON'u.
Etkileşim/bilinirlik/trafik kampanyaları CPL kurallarına girmez.

| Kural | Ne zaman | Seviye |
|---|---|---|
| `spend_no_results` | Son 7 gün harcama ≥ 2 × hedef CPL ve 0 sonuç | yüksek |
| `high_cpl` | Son 7 gün CPL > 1,5 × hedef | orta |
| `creative_fatigue` | Frekans ≥ 3 ve link CTR önceki 7 güne göre %30+ düştü | orta |
| `spend_stopped` | Hesapta son 7 gün harcama yok, öncesinde var | orta |
| `low_ctr` | Link CTR < %0,7 (≥ 2000 gösterim) | düşük |
| `learning_limited` | Aktif reklam seti öğrenme sınırlı | düşük |
| `winner` | CPL < 0,7 × hedef ve ≥ 3 sonuç → bütçe artırma adayı | bilgi |

Kurallar yalnızca öneri üretir; hiçbir reklamı durdurmaz, bütçe değiştirmez.

## Google Ads

`lib/google.mjs`: GAQL ile sadece okuma. Bulut ortamında OAuth jetonu ve developer-token ortamın
API credentials bölümünde (`googleads.googleapis.com`), proxy ekler. Yönetici hesabın (MCC) altındaki
hesaplar `login-customer-id` ile okunur.

## Müşteri eşlemesi

Hangi reklam hesabının hangi müşteriye ait olduğu `scripts/ads/clients.json` dosyasında (gitignore'da,
örnek: `clients.example.json`). Panel ajans (admin) görünümünde müşteri listesiyle açılır; bir müşteri
seçilince yalnızca o müşterinin verisi görünür. "Kundenansicht" müşterinin kendi portalını önizler.

## Panel prototipi (adım 4)

```
npm run ads:dashboard -- --since 2026-01-01 --until 2026-05-31 --out .cache/ads-panel.html
```

`dashboard/` altında: `template.html` (iskelet), `styles.css`, `app.js` (arayüz, DE/EN/TR, EUR/CHF),
`demo.js` (kurgusal demo klinikleri). `build.mjs` gerçek veriyi sunucu tarafında çekip hepsini tek
sayfaya gömer. Demo hesaplar tamamen uydurmadır, arayüzde her yerde "Demo" etiketi taşır.
Onayla/Reddet ve onboarding şimdilik sadece arayüzdür; Meta'ya hiçbir şey gönderilmez.

## Rakip araştırması ve kampanya stüdyosu

`dashboard/studio.js` (app.js içine gömülür):
- **Wettbewerb**: Meta Reklam Kütüphanesi araması, Apify `apify/facebook-ads-scraper` üzerinden.
  Panel, görüntüleyenin claude.ai Apify bağlayıcısını kullanır (artifact `mcp` yeteneği; jeton sayfaya
  girmez). Sonuçlar artifact veritabanında (`research`) müşteri bazlı saklanır. "Claude ile analiz et"
  (`sample`) mesajları, teklifleri, boşlukları ve kampanya fikirlerini çıkarır.
- **Kampagnen-Studio**: 5 adımlı sihirbaz (hedef, kitle, bütçe + tahmin, reklam metni + Claude
  varyantları + HWG/UWG kontrolü, özet). Taslaklar ve onay durumu `campaigns` koleksiyonunda; müşteri
  görünümünde "Freigeben / Änderung anfragen". Reklam hesabına yazma henüz yok (sonraki adım).

## KI-Assistent

`dashboard/chat.js` (app.js içine gömülür): müşteri bazlı sohbet. Claude (`sample`) yalnızca seçili
müşterinin verisini sayfa fonksiyonları (tools) üzerinden okur: dönem kennzahlen, günlük seyir,
kampanyalar, aksiyon planı, arama terimleri, sosyal gönderiler, rakip araştırmaları. Sohbet geçmişi
tarayıcıda, müşteri başına saklanır. Kampanyalarda değişiklik yapmaz.

## Dashboard için kurallar

- Veri modeli baştan hesap bazlı: insights, adset ve ad kayıtlarının hepsi `account_id` taşır.
  Para birimi hesaba göre değişebilir (`account_currency`), farklı para birimleri toplanmaz.
- Panel yalnızca kendi sunucu uç noktasından (hesap filtresi parametresiyle) veri ister;
  Graph API'ye tarayıcıdan istek atılmaz, jeton frontend'e hiçbir yoldan düşmez.
- Panelde hesap seçici (tümü / tek hesap) ilk günden var; müşteri hesabı geldiğinde kod değişmez.
- Repo herkese açık: reklam verisi commit edilmez, GitHub artifact'ine yüklenmez.

## Hitap ve mobil

Ürün adı **Nefalix Ads**. Her müşteri ekranında sağ altta "KI fragen" baloncuğu aynı asistanı küçük pencerede açar.
Panelin sesi `dashboard/VOICE.md`'de: Almanca „Sie“, Türkçe „siz“; önce sayı, sonra anlamı, sonra adım;
müşterinin dili (Anfrage / talep), ünlem ve emoji yok. KI-Assistent de aynı kurallarla cevap verir.
Mobilde (≤ 700 px) Übersicht üstte tek kart gösterir: talep sayısı + değişim, talep başı maliyet,
reklam bütçesi ve tek cümlelik yorum. Alt sekme çubuğu: Start / Plan / Assistent / Berichte / Mehr.

## Talepler nereden geliyor

Übersicht'te "Woher kommen Ihre Anfragen?" kartı: önce tek cümle (en çok talep getiren ve en ucuz kanal,
talep getirmeyen harcama), sonra iki renkli çubuk (taleplerdeki pay / bütçedeki pay) ve kanal satırları.
Facebook/Instagram ayrımı Meta'nın `publisher_platform` kırılımından gelir (`platformInsights`, kampanya-gün);
toplamlar reklam bazlı veriyle aynı kalsın diye Meta toplamı bu paylara göre bölünür.
Önceden çekilmiş veriyle: `--platform-json plat.json`.

## Produktion (Higgsfield)

`dashboard/produce.js` (studio.js'ten sonra gömülür): Kampagnen-Studio sihirbazının 5. adımı.
Akış: Recherche → Kampagne → **Produktion** → Freigabe (sayfanın üstünde adım şeridi olarak görünür).

- **Eigenes Material:** herkese açık link (`media_import_url`) ya da dosya (`media_upload` + tarayıcıdan PUT +
  `media_confirm`; tarayıcı yüklemesi engellenirse link yoluna yönlendirir). Foto KI ile hareketlendirilebilir
  (`start_image`) ya da KI görseli için örnek olarak kullanılabilir.
- **Mit KI erstellen:** brief'i müşteri yazar ya da "Brief von KI schreiben" (Claude, kampanya + reklam metni +
  rakip araştırması). Brief İngilizce model komutuna çevrilir; her komuta sağlık reklamı kuralları eklenir
  (metin/logo yok, öncesi/sonrası yok, tanınabilir hasta/doktor yok).
- Yerleşim → oran: Feed 4:5 (görsel) / 1:1 veya 3:4 (video), Story/Reels 9:16, Kare 1:1, Yatay 16:9.
- Modeller: video Hızlı = `kling3_0` (5 sn ≈ 7,5 kredi), Premium = `seedance_2_5` (5 sn ≈ 35 kredi);
  görsel = `gpt_image_2_5` (medium). "Kosten prüfen" `get_cost` ile kredi harcamadan fiyat gösterir.
- İş takibi `jobs_wait`; sonuç URL'si kampanya kaydına (`campaigns.creative`) yazılır, önizlemede ve
  Kundenansicht'te oynar. Görüntülenemezse link gösterilir.
- Bağlayıcı: claude.ai → Connectors → `Higgsfield` (`https://mcp.higgsfield.ai/mcp`). Krediler Higgsfield
  hesabından düşer. Bağlı olmayan görüntüleyici (ör. klinik) üretim düğmelerini kapalı görür; üretimi ajans yapar.
