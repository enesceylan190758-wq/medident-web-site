# MediDent — Universal negative keywords

**Kaynak dosya (script + agent):** [`universal-negative-keywords.json`](./universal-negative-keywords.json)

Bu md özet; kelime eklerken JSON’u güncelle.

## Kullanım

1. Shared negative list oluştur (hesap `5670078321`).
2. `lists.universal` → tüm Search kampanyaları.
3. `hat_b_de` / `hat_c_fr` → ilgili kampanyaya ek veya shared’e merge.
4. Match: JSON’daki `match` (`BROAD` | `PHRASE` | `EXACT`). Belirtilmemişse BROAD.

## Yapıştırma (Ads UI / Editor)

JSON’dan düz liste:

```bash
node -e "
const j=require('./universal-negative-keywords.json');
for (const [name, list] of Object.entries(j.lists)) {
  console.log('### '+name);
  for (const t of list.terms) {
    const m = t.match==='PHRASE' ? '\"'+t.text+'\"' : t.match==='EXACT' ? '['+t.text+']' : t.text;
    console.log(m);
  }
}
"
```

(Çalıştırma dizini: `docs/google-ads/`)

## Sakın ekleme

`do_not_add`: `kostenlos`, `gratuit`, `ücretsiz`, `free` — Foto-Einschätzung / devis photo sorgularını keser.

## Smoke sonrası

Search Terms’ten gelenleri JSON’a ekle; haftalık.

## Agent

`create-hat-bc.mjs` kampanya negatiflerini bu JSON’dan okur. Shared list API ile ayrı attach edilebilir.
