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

## Dashboard için kurallar (adım 4)

- Veri modeli baştan hesap bazlı: insights, adset ve ad kayıtlarının hepsi `account_id` taşır.
  Para birimi hesaba göre değişebilir (`account_currency`), farklı para birimleri toplanmaz.
- Panel yalnızca kendi sunucu uç noktasından (hesap filtresi parametresiyle) veri ister;
  Graph API'ye tarayıcıdan istek atılmaz, jeton frontend'e hiçbir yoldan düşmez.
- Panelde hesap seçici (tümü / tek hesap) ilk günden var; müşteri hesabı geldiğinde kod değişmez.
- Repo herkese açık: reklam verisi commit edilmez, GitHub artifact'ine yüklenmez.
