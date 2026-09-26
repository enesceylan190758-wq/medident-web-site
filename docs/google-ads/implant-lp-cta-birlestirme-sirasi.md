# İmplant LP CTA düzeltmesi — PR birleştirme sırası

**Sorun:** `main`'deki canlı `/dis-implant-fiyat/` sayfasında CTA butonları ters bağlıydı
("Ücretsiz Foto Değerlendirme Al" WhatsApp yerine `/iletisim/`'e, "WhatsApp'tan Yaz" ise tam
tersine gidiyordu) ve "form" CTA'sı ziyaretçiyi sayfadan çıkarıp `/iletisim/`'e götürüyordu.

**Bu PR'da yapılan:** #71'in düzeltmesi (`hotfix/implant-cta`, main üzerine) bu dala
cherry-pick edildi: iki seçenekli CTA ("Ücretsiz Değerlendirme İste" → wa.me,
"Form Bırak, Biz Arayalım" → sayfa içi `#iletisim` formuna yumuşak kaydırma,
`data-scroll-form` + `site.js` listener). Aynı `landingCtaBand()` bileşeni `/de/preise/` ve
`/fr/prix-implants-dentaires-turquie/` sayfalarına da eklendi (EN `turkey-teeth-price/`
kapsam dışı bırakıldı, talep sadece DE/FR içindi).

## Açık PR'lar arasındaki ilişki

- **#71** `hotfix/implant-cta` (main üzerine, acil) — bu düzeltmenin kaynağı. Küçük, test
  edilmiş, merge onayı bekliyor.
- **#70** `cursor/ad-lp-conversion-ab45` (main üzerine, draft) — **aynı fonksiyonları**
  (`landingCtaBand`, `implantPricePage`) çok daha kapsamlı biçimde değiştiriyor (yorum/BA/sayaç
  kaldırma, yasal risk azaltma). CTA yönlendirmesini bağımsız olarak zaten doğru şekilde
  (`#iletisim`) kurmuş durumda. Hekim onayı + TR yasal kontrol checkbox'ları **işaretlenmemiş**.
- **#65** `feat/implant-lp-visual` (main üzerine) — sayfayı tamamen yeni bir şablonla
  (`src/templates/implant-lp.mjs`) değiştiriyor. Bu yeni şablonda CTA yapısı **zaten doğru**
  (`ctaPrimary`/`ctaSecondary` + `data-scroll-form`, aynı i18n metinleri #71 ile birebir aynı) —
  ayrı bir CTA düzeltmesine ihtiyacı yok.
- **#66** `feat/implant-lp-konum-dtr` — **#65 üzerine** yığılı (konum bazlı başlık).

## Önerilen sıra (çakışmayı önlemek için)

1. **Önce #71'i merge et** (küçük, test edilmiş, acil). Canlı sayfa hemen düzelir.
2. **#70'i güncel `main`'e rebase et**, CTA kısmındaki çakışmayı #70'in daha kapsamlı
   versiyonunu koruyarak çöz (iki taraf da aynı sonuca — `#iletisim` — varıyor, çakışma
   mekanik). Hekim + yasal onay checkbox'ları işaretlenmeden **merge etme**.
3. **#65'i en son merge et** — CTA açısından ek risk yok, ama görsel onayı (placeholder
   görseller, hasta arşiv fotoğrafı onayı) hâlâ bekliyor. #65 merge olunca sayfa `implant-lp.mjs`
   şablonuna geçeceği için #70/#71'deki `pages.mjs` değişiklikleri bu sayfa için anlamını
   yitirir (ama `landingCtaBand` diğer sayfalarda — `/de/preise/`, `/fr/...`,
   `implantsCostPage` — hâlâ kullanılıyor, o yüzden #71'in `pages.mjs` düzeltmesi kaybolmamalı).
4. **#66'yı #65'in retarget edilmiş haliyle en son merge et.**

**Neden bu sıra:** #65/#70 aynı anda main'e girerse `implantPricePage`/`landingCtaBand`
üzerinde çakışma kaçınılmaz; CTA düzeltmesi (#71) küçük ve acil olduğu için önce girip
"kaybolma" riskini ortadan kaldırıyor. #70 ve #65, ikisi de kendi onay sürecini (yasal/hekim,
görsel) tamamlamadan merge edilmemeli.
