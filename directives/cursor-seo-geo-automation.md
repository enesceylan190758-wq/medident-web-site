# MediDent — Cursor Automation kurulum notu (eski giriş)

> **Çalışma SOP’u taşındı:** [`directives/medident_seo_geo_cursor_automation.md`](./medident_seo_geo_cursor_automation.md)  
> Cloud Agent instructions yalnızca o dosyaya işaret eder. Bu dosya kurulum / tarihçe içindir.

## Mimari

| Katman | İş | Sahip |
|--------|----|--------|
| A | Günlük/haftalık iskelet yayın + yönetici maili | VPS/cron veya GitHub Actions — **Cursor SMTP değil** |
| B | Strateji / GEO / SEO (araştırma → director → içerik → PR) | Cursor Automation: **MediDent SEO/GEO Operasyon** |

## Editör ayarları

- **Ad:** MediDent SEO/GEO Operasyon  
- **Cron:** `0 10 * * 1-5` (Europe/Istanbul) — yayın mailinden sonra  
- **Repo:** `enesceylan190758-wq/medident-web-site` @ `main`  
- **Tools:** Open Pull Request + Memories (mail yok)  
- **Model:** GPT-5.5 veya Claude Sonnet  

### Agent instructions

```
Sen MediDent SEO/GEO cloud ajanısın. Tek kaynak: directives/medident_seo_geo_cursor_automation.md — oku ve aynen uygula.
Günlük yayın/mail VPS veya mevcut cron'dadır; sen yerine geçme — smoke et, sonra sıradaki strateji fazını bitir.
Tahmin yok. Yönetmelik ihlali yok. Open PR + kısa handoff.
```

Taslak JSON: `.cursor/automations/medident-seo-geo-operasyon.json`

## Eski MASTER PROMPT

Uzun haftalık prompt kaldırıldı; tekrar etme. Plan + gap + director kuralı SOP içinde bağlandı.
