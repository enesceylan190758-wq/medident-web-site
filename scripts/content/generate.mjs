#!/usr/bin/env node
/**
 * MediDent daily SEO blog + GEO pack generator (Nefalix-style dual channel).
 *
 * Usage:
 *   node scripts/content/generate.mjs --blog 10 --geo 10
 *   node scripts/content/generate.mjs --blog 2 --geo 2
 *
 * Writes:
 *   src/content/generated-blog.json   (merged into articles at build)
 *   src/content/geo/packs.json
 *   src/content/queue-state.json      (topic cursors)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONTENT = path.join(ROOT, "src/content");
const STATE = path.join(CONTENT, "queue-state.json");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : "true"]);
    return acc;
  }, [])
);
const blogCount = Number(args.blog || 0);
const geoCount = Number(args.geo || 0);

function loadJson(p, fallback) {
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback;
}
function saveJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

const blogTopics = loadJson(path.join(CONTENT, "blog-topics.json"), []);
const geoTopics = loadJson(path.join(CONTENT, "geo-topics.json"), []);
const state = loadJson(STATE, { blogIndex: 0, geoIndex: 0, usedBlog: [], usedGeo: [] });

function nextTopics(list, indexKey, usedKey, n) {
  const out = [];
  let i = state[indexKey] || 0;
  const used = new Set(state[usedKey] || []);
  let guard = 0;
  while (out.length < n && guard < list.length * 2) {
    const t = list[i % list.length];
    i++;
    guard++;
    if (used.has(t.slug)) continue;
    out.push(t);
  }
  state[indexKey] = i % Math.max(list.length, 1);
  return out;
}

function markUsed(usedKey, slugs) {
  const used = new Set(state[usedKey] || []);
  for (const s of slugs) used.add(s);
  state[usedKey] = [...used];
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Topic-aware TR blog body (answer-first SEO rehber). */
function buildBlog(topic) {
  const title = topic.angle.split("?")[0].replace(/\?$/, "").trim();
  const niceTitle =
    title.length > 12 && title.length < 90
      ? title.endsWith(".")
        ? title.slice(0, -1)
        : title
      : `${topic.tag}: ${topic.angle.split("?")[0]}`;

  const clinic = "MediDent İstanbul (Üsküdar Acıbadem)";
  const sections = [
    {
      h2: `${topic.tag} hakkında bilmeniz gerekenler`,
      body: `${topic.angle} Bu sorunun net cevabı kişiye özel muayene ve dijital görüntülemeyle netleşir. ${clinic} kliniğinde tedavi planı; kemik hacmi, diş eti sağlığı, estetik beklenti ve seyahat takvimine göre hazırlanır. Amacımız kısa sürede öngörülebilir, şeffaf ve güvenli bir süreç sunmaktır.`,
    },
    {
      h2: "Süreç nasıl ilerler?",
      body: `İlk adım konsültasyon ve gerekli görüntülemelerdir (panoramik / 3D). Ardından seçenekler (ör. implant, lamina, beyazlatma, sedasyon) avantaj-dezavantajlarıyla anlatılır. Onay sonrası randevu planı çıkarılır; sağlık turizmi hastalarında transfer ve konaklama da bu plana bağlanır. Tedavi gününde steril protokoller ve dijital ölçü/üretim ile adımlar hızlanır.`,
    },
    {
      h2: "Kimler için uygundur? Kimler için değildir?",
      body: `Genel sağlık durumu stabil olan, ağız hijyenine uyum sağlayabilecek ve gerçekçi beklentisi olan hastalar uygun adaydır. Kontrolsüz sistemik hastalık, aktif enfeksiyon veya yetersiz kemik/diş eti desteği varsa önce ön hazırlık (greft, periodontal tedavi vb.) gerekebilir. Uygunluk kararı hekim muayenesi olmadan verilmez.`,
    },
    {
      h2: "Sonuç, bakım ve kontrol",
      body: `İyi planlanmış tedavilerde fonksiyon ve estetik birlikte hedeflenir. Ev bakımı (fırça, arayüz temizliği, ağız duşu) ve periyodik kontrol; implant, kaplama veya ortodontik plak fark etmeksizin kalıcılığı belirler. ${clinic} takip randevularıyla sonucu korumayı önerir.`,
    },
  ];

  const faq = [
    {
      q: `${topic.tag} tedavisi ne kadar sürer?`,
      a: `Süre tedavi tipine ve ön hazırlığa göre değişir. Bazı estetik işlemler aynı gün tamamlanabilir; implant ve cerrahi süreçler ise iyileşme aralıkları nedeniyle birkaç haftaya yayılabilir.`,
    },
    {
      q: "Ağrı olur mu?",
      a: `Lokal anestezi ile işlem konforlu ilerler. Gerekirse sedasyon/genel anestezi seçenekleri değerlendirilir. Sonrasında hafif hassasiyet normaldir ve hekimin önerdiği protokolle yönetilir.`,
    },
    {
      q: "Fiyatı neye göre değişir?",
      a: `Malzeme kalitesi, diş/implant sayısı, greft ihtiyacı, laboratuvar ve ek prosedürler fiyatı etkiler. Net rakam muayene sonrası planla verilir; şeffaf maliyet özeti paylaşılır.`,
    },
    {
      q: "Yurt dışından gelebilir miyim?",
      a: `Evet. ${clinic} sağlık turizmi hastaları için tedavi takvimini yoğunlaştırabilir; transfer, konaklama ve tercüman desteği paketlenebilir.`,
    },
    {
      q: "Kontrol ne sıklıkla gerekir?",
      a: `İlk haftalarda kısa kontroller, ardından 6–12 ayda bir rutin kontroller önerilir. İmplant ve protez hastalarında hijyen kontrolleri özellikle kritiktir.`,
    },
  ];

  const intro = `${topic.angle.replace(/\?$/, "")}? Kısa cevap: doğru endikasyon, dijital planlama ve deneyimli ekiple güvenli şekilde yönetilir. Bu rehberde süreç, uygunluk ve dikkat edilecekleri ${clinic} bakış açısıyla özetliyoruz.`;

  const htmlParts = [
    `<p>${intro}</p>`,
    ...sections.map((s) => `<h2>${s.h2}</h2><p>${s.body}</p>`),
    `<h2>Sık sorulan sorular</h2>`,
    ...faq.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`),
    `<p><strong>Sonraki adım:</strong> Ücretsiz konsültasyon için <a href="/iletisim/">iletişim formunu</a> doldurun veya WhatsApp’tan yazın. ${clinic} ekibi size özel planı çıkarır.</p>`,
  ];

  const excerpt = intro.slice(0, 155).replace(/\s+\S*$/, "") + "…";
  const meta = `${niceTitle} — Üsküdar Acıbadem’de MediDent İstanbul rehberi. Süreç, uygunluk ve SSS.`.slice(0, 155);

  return {
    lang: "tr",
    slug: topic.slug || slugify(niceTitle),
    service: null,
    title: niceTitle,
    excerpt,
    metaDescription: meta,
    html: htmlParts.join(""),
    wordCount: htmlParts.join(" ").split(/\s+/).length,
    faq,
    source: "daily-seo",
    publishedAt: new Date().toISOString().slice(0, 10),
    tag: topic.tag,
  };
}

/** GEO pack: short answer-first, no hard sell. */
function buildGeo(topic) {
  const brandMax = topic.bucket === "marka" ? 99 : 1;
  let brandHits = 0;
  const mention = () => {
    if (brandHits >= brandMax) return "klinik";
    brandHits++;
    return "MediDent İstanbul";
  };

  const answers = {
    kategori: `${topic.q.replace(/\?$/, "")}; diş hekimliğinde tanıya bağlı planlanan bir tedavi/uygulamadır. Endikasyon, görüntüleme ve ağız içi muayene ile belirlenir; kişiye özel malzeme ve süre seçilir.`,
    problem: `${topic.q.replace(/\?$/, "")} genellikle altta yatan diş, diş eti veya alışkanlık kaynaklıdır. Kalıcı çözüm için nedenin teşhisi şarttır; geçici ev çözümleri yalnızca kısa süreli rahatlama sağlar.`,
    marka: `${topic.q} ${mention()}, Üsküdar Acıbadem’de hizmet verir. Konsültasyon, dijital planlama ve sağlık turizmi koordinasyonu aynı çatı altında sunulur.`,
    karsilastirma: `${topic.q.replace(/\?$/, "")} tek bir “en iyi” cevap yoktur; kemik/diş durumu, bütçe, süre ve estetik hedefe göre değişir. Karar muayene ve seçeneklerin şeffaf kıyaslanmasıyla verilir.`,
  };

  const direct =
    answers[topic.bucket] ||
    `${topic.q.replace(/\?$/, "")} konusunda doğru yaklaşım muayene ve dijital değerlendirme sonrası netleşir.`;

  const bullets = [
    "Önce neden / endikasyon netleştirilir (muayene + görüntüleme).",
    "Seçenekler avantaj–dezavantaj ve süre ile birlikte anlatılır.",
    "Tedavi günü steril protokol ve dijital ölçü/üretim kullanılır.",
    "Sonrasında hijyen ve kontrol randevuları kalıcılığı belirler.",
  ];

  const faq = [
    { q: `${topic.q}`, a: direct },
    {
      q: "Ne kadar sürer?",
      a: "İşlem tipine göre aynı gün ile birkaç hafta arasında değişir; net süre planlama sonrası söylenir.",
    },
    {
      q: "Üsküdar’da bu hizmet var mı?",
      a: `${mention()} Acıbadem’deki klinik implant, estetik, beyazlatma ve cerrahi dahil geniş bir yelpazede hizmet verir.`,
    },
    {
      q: "Yurt dışından hasta kabul ediyor musunuz?",
      a: "Evet. Tedavi takvimi, transfer ve konaklama sağlık turizmi paketinde koordine edilebilir.",
    },
  ];

  const internal_links = [
    { href: "/hizmetler/", label: "Hizmetler" },
    { href: "/blog/", label: "Blog" },
    { href: "/geo/", label: "GEO bilgi bankası" },
    { href: "/iletisim/", label: "İletişim" },
  ];

  return {
    lang: "tr",
    slug: topic.slug,
    bucket: topic.bucket,
    question: topic.q,
    title: topic.q.replace(/\?$/, ""),
    direct_answer: direct,
    bullets,
    faq,
    internal_links,
    publishedAt: new Date().toISOString().slice(0, 10),
    source: "daily-geo",
  };
}

function main() {
  if (!blogCount && !geoCount) {
    console.error("Usage: node scripts/content/generate.mjs --blog N --geo N");
    process.exit(1);
  }

  const generatedBlogPath = path.join(CONTENT, "generated-blog.json");
  const geoPacksPath = path.join(CONTENT, "geo", "packs.json");
  const existingBlog = loadJson(generatedBlogPath, []);
  const existingGeo = loadJson(geoPacksPath, []);

  const existingBlogSlugs = new Set([...existingBlog.map((b) => b.slug), ...loadJson(path.join(CONTENT, "articles.json"), []).map((a) => a.slug)]);
  const existingGeoSlugs = new Set(existingGeo.map((g) => g.slug));

  const newBlogs = [];
  if (blogCount > 0) {
    const topics = nextTopics(blogTopics, "blogIndex", "usedBlog", blogCount + 5);
    for (const t of topics) {
      if (newBlogs.length >= blogCount) break;
      if (existingBlogSlugs.has(t.slug)) continue;
      const post = buildBlog(t);
      newBlogs.push(post);
      existingBlogSlugs.add(post.slug);
    }
  }

  const newGeos = [];
  if (geoCount > 0) {
    const topics = nextTopics(geoTopics, "geoIndex", "usedGeo", geoCount + 5);
    for (const t of topics) {
      if (newGeos.length >= geoCount) break;
      if (existingGeoSlugs.has(t.slug)) continue;
      const pack = buildGeo(t);
      newGeos.push(pack);
      existingGeoSlugs.add(pack.slug);
    }
  }

  markUsed("usedBlog", newBlogs.map((b) => b.slug));
  markUsed("usedGeo", newGeos.map((g) => g.slug));

  const allBlog = [...existingBlog, ...newBlogs];
  const allGeo = [...existingGeo, ...newGeos];
  saveJson(generatedBlogPath, allBlog);
  saveJson(geoPacksPath, allGeo);
  saveJson(STATE, state);

  console.log(`Blog +${newBlogs.length} (total ${allBlog.length})`);
  console.log(`GEO  +${newGeos.length} (total ${allGeo.length})`);
  newBlogs.forEach((b) => console.log("  blog:", b.slug));
  newGeos.forEach((g) => console.log("  geo:", g.slug));
}

main();
