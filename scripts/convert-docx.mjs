// Converts the MAKALELER docx files into structured article content.
// Output: src/content/articles.json
import mammoth from "mammoth";
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = process.env.MAKALELER_DIR || "/tmp/makaleler/MAKALELER/Web Site Makaleleri";
const OUT = path.resolve("src/content/articles.json");

// Maps a source docx (by language + filename without ext) to a stable slug + the
// service page it belongs to. Slugs for TR match the legacy WordPress URLs where possible.
const MAP = {
  tr: {
    "İmplant tedavisi": { slug: "implant-tedavisi", service: "implantoloji-implant-tedavisi", title: "İmplant Tedavisi" },
    "Bir günde diş tedavisi": { slug: "bir-gunde-dis-tedavisi", service: "genel-anestezi-ve-sedasyon", title: "Bir Günde Diş Tedavisi" },
    "Diş beyazlatma": { slug: "dis-beyazlatma-rehberi", service: "dis-beyazlatma", title: "Diş Beyazlatma" },
    "Estetik Diş Tedavileri": { slug: "estetik-dis-tedavileri", service: "estetik-dis-hekimligi", title: "Estetik Diş Tedavileri" },
    "Diş protezleri": { slug: "dis-protezleri", service: "protezler", title: "Diş Protezleri" },
    "Çene ve Diş cerrahisi": { slug: "cene-ve-dis-cerrahisi-rehberi", service: "cene-ve-dis-cerrahisi", title: "Çene ve Diş Cerrahisi" },
  },
  en: {
    "Dental Implant Treatment": { slug: "dental-implant-treatment", service: "implantoloji-implant-tedavisi", title: "Dental Implant Treatment" },
    "Same Day Dental Treatments": { slug: "same-day-dental-treatments", service: "genel-anestezi-ve-sedasyon", title: "Same Day Dental Treatments" },
    "Teeth Whitening": { slug: "teeth-whitening", service: "dis-beyazlatma", title: "Teeth Whitening" },
    "Cosmetic Dentistry": { slug: "cosmetic-dentistry", service: "estetik-dis-hekimligi", title: "Cosmetic Dentistry" },
    "Dentures": { slug: "dentures", service: "protezler", title: "Dentures" },
    "Dental and Maxillofacial Surgery": { slug: "dental-and-maxillofacial-surgery", service: "cene-ve-dis-cerrahisi", title: "Dental and Maxillofacial Surgery" },
    "Dental Care and Hygiene": { slug: "dental-care-and-hygiene", service: "konservatif-dis-tedavileri", title: "Dental Care and Hygiene" },
  },
  de: {
    "Implantatbehandlung": { slug: "implantatbehandlung", service: "implantoloji-implant-tedavisi", title: "Implantatbehandlung" },
    "Taggleiche Behandlung": { slug: "taggleiche-behandlung", service: "genel-anestezi-ve-sedasyon", title: "Taggleiche Behandlung" },
    "Zahnaufhellung": { slug: "zahnaufhellung", service: "dis-beyazlatma", title: "Zahnaufhellung" },
    "Ästhetische Zahnmedizin": { slug: "aesthetische-zahnmedizin", service: "estetik-dis-hekimligi", title: "Ästhetische Zahnmedizin" },
    "Zahnprothese": { slug: "zahnprothese", service: "protezler", title: "Zahnprothese" },
    "Mund-, Kiefer- und Gesichtschirurgie": { slug: "mund-kiefer-gesichtschirurgie", service: "cene-ve-dis-cerrahisi", title: "Mund-, Kiefer- und Gesichtschirurgie" },
    "Zahnpflege und Mundhygiene": { slug: "zahnpflege-und-mundhygiene", service: "konservatif-dis-tedavileri", title: "Zahnpflege und Mundhygiene" },
  },
};

const LANG_DIRS = {
  tr: "Türkçe ",
  en: "İngilizce/İngilizce Yazılar",
  de: "Almanca Yazılar",
};

function cleanHtml(html) {
  return html
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/\s+style="[^"]*"/g, "")
    .replace(/<a\s+id="[^"]*">\s*<\/a>/g, "")
    .replace(/\u00a0/g, " ")
    .trim();
}

// First heading text or first sentence -> excerpt
function excerpt(text, n = 160) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return t.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

async function run() {
  const articles = [];
  for (const [lang, dir] of Object.entries(LANG_DIRS)) {
    const abs = path.join(SRC_DIR, dir);
    if (!fs.existsSync(abs)) {
      console.warn("MISSING dir:", abs);
      continue;
    }
    const files = fs.readdirSync(abs).filter((f) => f.endsWith(".docx") && !f.startsWith("._"));
    for (const file of files) {
      const base = file.replace(/\.docx$/i, "");
      const meta = MAP[lang]?.[base];
      if (!meta) {
        console.warn(`No mapping for [${lang}] ${base} — skipped`);
        continue;
      }
      const { value: rawHtml } = await mammoth.convertToHtml({ path: path.join(abs, file) });
      const { value: rawText } = await mammoth.extractRawText({ path: path.join(abs, file) });
      const html = cleanHtml(rawHtml);
      articles.push({
        lang,
        slug: meta.slug,
        service: meta.service,
        title: meta.title,
        excerpt: excerpt(rawText.replace(new RegExp("^\\s*" + meta.title, "i"), "")),
        html,
        wordCount: rawText.split(/\s+/).filter(Boolean).length,
      });
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(articles, null, 2));
  console.log(`Wrote ${articles.length} articles -> ${OUT}`);
  for (const a of articles) console.log(`  [${a.lang}] ${a.slug} (${a.wordCount}w) -> service:${a.service}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
