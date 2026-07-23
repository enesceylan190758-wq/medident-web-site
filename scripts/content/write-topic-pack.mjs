#!/usr/bin/env node
/**
 * Write the 10 topic blogs + GEO packs (with cover images) requested for MediDent.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONTENT = path.join(ROOT, "src/content");
const TODAY = new Date().toISOString().slice(0, 10);
const CLINIC = "MediDent İstanbul (Üsküdar Acıbadem)";

const TOPICS = [
  {
    slug: "zirkonyum-porselen-kaplama-estetik-dayaniklilik",
    geoSlug: "zirkonyum-porselen-kaplama-nedir",
    tag: "Zirkonyum",
    image: "blog/blog-01-zirkonyum.jpg",
    title: "Zirkonyum porselen kaplama: estetik ve dayanıklılık",
    angle: "Zirkonyum porselen kaplama nedir, kimlere uygundur ve doğal dişten nasıl ayırt edilemez?",
    service: "estetik-dis-hekimligi",
    bucket: "kategori",
    q: "Zirkonyum porselen kaplama nedir?",
    direct:
      "Zirkonyum porselen kaplama; yüksek dayanımlı zirkonyum alt yapı üzerine ışık geçiren porselen tabaka ile hazırlanan, doğal dişe yakın renk ve şeffaflık sunan bir restorasyondur. Estetik gülüş hattı ve arka dişlerde uzun ömür için tercih edilir.",
  },
  {
    slug: "bonding-tedavisi-agrisiz-estetik-gulus",
    geoSlug: "bonding-tedavisi-nedir",
    tag: "Bonding",
    image: "blog/blog-02-bonding.jpg",
    title: "Bonding tedavisi: ağrısız estetik gülüş tasarımı",
    angle: "Bonding ile ön dişlerdeki kırık, boşluk ve renk sorunları tek seansta nasıl düzeltilir?",
    service: "estetik-dis-hekimligi",
    bucket: "kategori",
    q: "Diş bonding tedavisi nedir?",
    direct:
      "Bonding; kompozit rezin malzemenin diş yüzeyine yapıştırılarak şekil, renk ve form düzeltmesi yapılan ağrısız bir estetik uygulamadır. Genellikle tek seansta tamamlanır; doğal diş dokusuyla sınır neredeyse görünmez.",
  },
  {
    slug: "sedasyonlu-dis-tedavisi-korkulara-son",
    geoSlug: "sedasyonlu-dis-tedavisi-nedir",
    tag: "Sedasyon",
    image: "blog/blog-03-sedasyon.jpg",
    title: "Sedasyonlu diş tedavisi: korkulara son, uyku rahatlığında tedavi",
    angle: "Sedasyon altında diş tedavisi nasıl yapılır, kimler için uygundur, güvenlik nasıl sağlanır?",
    service: "genel-anestezi-ve-sedasyon",
    bucket: "kategori",
    q: "Sedasyonlu diş tedavisi nedir?",
    direct:
      "Sedasyonlu diş tedavisi; bilinçli sedasyon veya genel anestezi ile hastanın kaygı ve ağrı algısı bastırılarak konforlu şekilde tedavi edilmesidir. IV hat, oksimetre ve vital takip ile güvenli protokol uygulanır.",
  },
  {
    slug: "1-gunde-implant-hizli-kalici-cozum",
    geoSlug: "1-gunde-implant-nedir",
    tag: "İmplant",
    image: "blog/blog-04-implant.jpg",
    title: "1 günde implant: hızlı ve kalıcı çözüm",
    angle: "Aynı gün implant ve geçici kuron ne zaman mümkündür, süreç nasıl ilerler?",
    service: "implantoloji-implant-tedavisi",
    bucket: "kategori",
    q: "1 günde implant (aynı gün diş) nedir?",
    direct:
      "1 günde implant; uygun kemik ve primer stabilite varsa implantın yerleştirilip üzerine aynı gün geçici kuron takılmasıdır. Kalıcı protez iyileşme sonrası yapılır; anında fonksiyon ve estetik sağlar.",
  },
  {
    slug: "profesyonel-dis-cekimi-agrisiz-guvenli",
    geoSlug: "profesyonel-dis-cekimi-nasil-yapilir",
    tag: "Cerrahi",
    image: "blog/blog-05-cekimi.jpg",
    title: "Profesyonel diş çekimi: ağrısız ve güvenli süreç",
    angle: "Modern diş çekimi nasıl ağrısız yapılır, çekim sonrası nelere dikkat edilmeli?",
    service: "agiz-dis-ve-cene-cerrahisi",
    bucket: "problem",
    q: "Diş çekimi ağrılı mıdır? Güvenli süreç nasıl işler?",
    direct:
      "Profesyonel diş çekimi lokal anestezi (gerekirse sedasyon) ile ağrısız planlanır. Steril protokol, dijital röntgen ve kontrollü çekim sonrası gazlı bez ve ilaç protokolü ile iyileşme yönetilir.",
  },
  {
    slug: "gulush-tasarimi-lamine-veneer-kisisel",
    geoSlug: "gulush-tasarimi-lamine-veneer-nedir",
    tag: "Lamina",
    image: "blog/blog-06-gulush.jpg",
    title: "Gülüş tasarımı ve lamine veneer: kişiselleştirilmiş estetik",
    angle: "Dijital gülüş tasarımı (DSD) ile lamine veneer planı nasıl kişiselleştirilir?",
    service: "estetik-dis-hekimligi",
    bucket: "kategori",
    q: "Gülüş tasarımı ve lamine veneer nedir?",
    direct:
      "Gülüş tasarımı; yüz oranları, dudak hattı ve diş formunun dijital analiziyle planlanır. Lamine veneer ince porselen yapraklardır; minimal aşındırma ile renk, şekil ve simetriyi kişiselleştirir.",
  },
  {
    slug: "cocuk-dis-hekimligi-korkusuz-ilk-muayene",
    geoSlug: "cocuk-dis-hekimligi-ilk-muayene",
    tag: "Pedodonti",
    image: "blog/blog-07-pedodonti.jpg",
    title: "Çocuk diş hekimliği: korkusuz ilk muayene",
    angle: "Çocuklarda ilk diş hekimi ziyareti nasıl korkusuz ve oyunla başlar?",
    service: "pedodonti-cocuk-dis-hekimligi",
    bucket: "kategori",
    q: "Çocuklarda ilk diş hekimi muayenesi nasıl olmalı?",
    direct:
      "Pedodontide ilk muayene oyun ve eğitimle başlar; fırçalama modeli, renkli aletler ve güvenli ortam çocuğun korkusunu azaltır. Erken kontrol çürük ve alışkanlık sorunlarını önler.",
  },
  {
    slug: "kanal-tedavisi-mikroskop-disi-kurtarmak",
    geoSlug: "kanal-tedavisi-mikroskop-ile",
    tag: "Endodonti",
    image: "blog/blog-08-kanal.jpg",
    title: "Kanal tedavisi (endodonti): mikroskopla dişi kurtarmak",
    angle: "Mikroskop destekli kanal tedavisi dişi nasıl kurtarır, süreç nasıl ilerler?",
    service: "endodonti-kanal-tedavileri",
    bucket: "kategori",
    q: "Mikroskop ile kanal tedavisi nedir?",
    direct:
      "Mikroskop destekli kanal tedavisi; kök kanallarının büyütülerek temizlenmesi ve doldurulmasıdır. Dişi çekmek yerine kurtarmayı hedefler; hassasiyet ve başarı oranını artırır.",
  },
  {
    slug: "periodontoloji-saglikli-dis-eti-temeli",
    geoSlug: "periodontoloji-dis-eti-sagligi",
    tag: "Periodontoloji",
    image: "blog/blog-09-periodontoloji.jpg",
    title: "Periodontoloji: sağlıklı diş eti, sağlam temel",
    angle: "Sağlıklı diş eti neden implant ve estetiğin temelidir, bakım nasıl yapılır?",
    service: "periodontoloji-diseti-hastaliklari",
    bucket: "problem",
    q: "Sağlıklı diş eti neden önemlidir?",
    direct:
      "Sağlıklı pembe diş eti; implant, kaplama ve doğal dişlerin temelidir. Kanama, şişlik veya çekilme periodontal hastalığa işaret edebilir; profesyonel temizlik ve arayüz bakımı ile korunur.",
  },
  {
    slug: "medident-istanbul-klinigi-ekip-hijyen",
    geoSlug: "medident-istanbul-klinik-deneyimi",
    tag: "Klinik",
    image: "blog/blog-10-klinik.jpg",
    title: "MediDent İstanbul kliniği: güler yüzlü ekip ve modern hijyen",
    angle: "Üsküdar Acıbadem’deki MediDent kliniğinde hasta deneyimi, hijyen ve ekip nasıl?",
    service: null,
    bucket: "marka",
    q: "MediDent İstanbul kliniği nasıl bir deneyim sunar?",
    direct:
      "MediDent İstanbul; Üsküdar Acıbadem’de modern hijyen istasyonları, güler yüzlü ekip ve dijital planlama ile hasta karşılayan bir diş kliniğidir. Konsültasyondan kontrole kadar şeffaf ve steril bir süreç sunar.",
  },
];

function blogHtml(t) {
  const sections = [
    {
      h2: `${t.tag}: bilmeniz gerekenler`,
      body: `${t.angle} ${CLINIC} kliniğinde plan; muayene, dijital görüntüleme ve beklentinize göre kişiselleştirilir. Amacımız öngörülebilir, şeffaf ve güvenli bir sonuçtur.`,
    },
    {
      h2: "Süreç nasıl ilerler?",
      body: `İlk adım konsültasyon ve gerekli görüntülemelerdir. Seçenekler avantaj–dezavantajlarıyla anlatılır; onay sonrası randevu planı çıkarılır. Tedavi gününde steril protokol ve dijital ölçü/üretim ile adımlar hızlanır.`,
    },
    {
      h2: "Kimler için uygundur?",
      body: `Genel sağlık durumu stabil, ağız hijyenine uyum sağlayabilen ve gerçekçi beklentisi olan hastalar uygun adaydır. Sistemik hastalık veya aktif enfeksiyon varsa önce hazırlık gerekebilir. Karar hekim muayenesi olmadan verilmez.`,
    },
    {
      h2: "Sonuç, bakım ve kontrol",
      body: `İyi planlanmış tedavilerde fonksiyon ve estetik birlikte hedeflenir. Ev bakımı ve periyodik kontrol kalıcılığı belirler. ${CLINIC} takip randevularıyla sonucu korumayı önerir.`,
    },
  ];
  const faq = [
    { q: `${t.tag} ne kadar sürer?`, a: "Tedavi tipine ve ön hazırlığa göre aynı gün ile birkaç hafta arasında değişir; net süre planlama sonrası söylenir." },
    { q: "Ağrı olur mu?", a: "Lokal anestezi ile işlem konforlu ilerler. Gerekirse sedasyon seçenekleri değerlendirilir." },
    { q: "Fiyatı neye göre değişir?", a: "Malzeme, diş/implant sayısı, laboratuvar ve ek prosedürler etkiler. Net rakam muayene sonrası şeffaf planla verilir." },
    { q: "Yurt dışından gelebilir miyim?", a: `Evet. ${CLINIC} sağlık turizmi hastaları için tedavi takvimini yoğunlaştırabilir.` },
  ];
  const intro = `${t.angle.replace(/\?$/, "")}? Kısa cevap: doğru endikasyon, dijital planlama ve deneyimli ekiple güvenli şekilde yönetilir. Bu rehberde süreci ${CLINIC} bakış açısıyla özetliyoruz.`;
  return {
    html: [
      `<p>${intro}</p>`,
      ...sections.map((s) => `<h2>${s.h2}</h2><p>${s.body}</p>`),
      `<h2>Sık sorulan sorular</h2>`,
      ...faq.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`),
      `<p><strong>Sonraki adım:</strong> Ücretsiz konsültasyon için <a href="/iletisim/">iletişim formunu</a> doldurun veya WhatsApp’tan yazın.</p>`,
    ].join(""),
    faq,
    excerpt: intro.slice(0, 155).replace(/\s+\S*$/, "") + "…",
    metaDescription: `${t.title} — Üsküdar Acıbadem’de MediDent İstanbul rehberi. Süreç, uygunluk ve SSS.`.slice(0, 155),
  };
}

function geoPack(t) {
  return {
    lang: "tr",
    slug: t.geoSlug,
    bucket: t.bucket,
    question: t.q,
    title: t.q.replace(/\?$/, ""),
    direct_answer: t.direct,
    coverImage: t.image,
    bullets: [
      "Önce endikasyon netleştirilir (muayene + görüntüleme).",
      "Seçenekler süre ve avantaj–dezavantaj ile anlatılır.",
      "Tedavi günü steril protokol ve dijital planlama kullanılır.",
      "Hijyen ve kontrol randevuları kalıcılığı belirler.",
    ],
    faq: [
      { q: t.q, a: t.direct },
      { q: "Ne kadar sürer?", a: "İşlem tipine göre aynı gün ile birkaç hafta arasında değişir." },
      { q: "Üsküdar’da bu hizmet var mı?", a: `${CLINIC} implant, estetik, sedasyon, pedodonti ve cerrahi dahil geniş yelpazede hizmet verir.` },
      { q: "Yurt dışından hasta kabul ediyor musunuz?", a: "Evet. Tedavi takvimi, transfer ve konaklama koordine edilebilir." },
    ],
    internal_links: [
      { href: "/hizmetler/", label: "Hizmetler" },
      { href: `/blog/${t.slug}/`, label: "Blog rehberi" },
      { href: "/geo/", label: "GEO bilgi bankası" },
      { href: "/iletisim/", label: "İletişim" },
    ],
    publishedAt: TODAY,
    source: "topic-pack-visual",
  };
}

const blogs = TOPICS.map((t) => {
  const b = blogHtml(t);
  return {
    lang: "tr",
    slug: t.slug,
    service: t.service,
    title: t.title,
    excerpt: b.excerpt,
    metaDescription: b.metaDescription,
    html: b.html,
    coverImage: t.image,
    wordCount: b.html.split(/\s+/).length,
    faq: b.faq,
    source: "topic-pack-visual",
    publishedAt: TODAY,
    tag: t.tag,
  };
});

const geos = TOPICS.map(geoPack);

const blogPath = path.join(CONTENT, "generated-blog.json");
const geoPath = path.join(CONTENT, "geo", "packs.json");
const statePath = path.join(CONTENT, "queue-state.json");

const existingBlog = JSON.parse(fs.readFileSync(blogPath, "utf8"));
const existingGeo = JSON.parse(fs.readFileSync(geoPath, "utf8"));
const state = JSON.parse(fs.readFileSync(statePath, "utf8"));

const blogSlugs = new Set(blogs.map((b) => b.slug));
const geoSlugs = new Set(geos.map((g) => g.slug));

const mergedBlog = [...existingBlog.filter((b) => !blogSlugs.has(b.slug)), ...blogs];
const mergedGeo = [...existingGeo.filter((g) => !geoSlugs.has(g.slug)), ...geos];

state.usedBlog = [...new Set([...(state.usedBlog || []), ...blogs.map((b) => b.slug)])];
state.usedGeo = [...new Set([...(state.usedGeo || []), ...geos.map((g) => g.slug)])];

fs.writeFileSync(blogPath, JSON.stringify(mergedBlog, null, 2) + "\n");
fs.writeFileSync(geoPath, JSON.stringify(mergedGeo, null, 2) + "\n");
fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");

console.log(`Wrote ${blogs.length} visual blogs + ${geos.length} GEO packs`);
blogs.forEach((b) => console.log(" blog", b.slug, "→", b.coverImage));
geos.forEach((g) => console.log(" geo ", g.slug, "→", g.coverImage));
