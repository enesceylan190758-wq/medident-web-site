// Downloads real images from the live WordPress site into src/assets/images/.
// Run once; images are then committed and served statically.
import fs from "node:fs";
import path from "node:path";

const BASE = "https://medidentistanbul.com/wp-content/uploads";
const OUT = path.resolve("src/assets/images");
fs.mkdirSync(OUT, { recursive: true });

// Maps a stable local filename -> live source URL.
const FILES = {
  "logo.png": `${BASE}/2021/07/MediDent-disi-1024x316.png`,
  "logo-mark.png": `${BASE}/2021/07/cropped-MediDent_pdf.png`,
  "favicon-32.png": `${BASE}/2021/08/cropped-favicon-32x32.png`,
  "favicon-192.png": `${BASE}/2021/08/cropped-favicon-192x192.png`,
  "favicon-180.png": `${BASE}/2021/08/cropped-favicon-180x180.png`,
  // Doctors
  "dr-faruk-ogutlu.jpg": `${BASE}/2022/07/Dr.-Faruk-Ogutlu-540x650.jpg`,
  "dr-alperen-demiral.jpg": `${BASE}/2022/07/Dr.-Alperen-Demiral-540x650.jpg`,
  "dt-levent-emir-guneysu.jpg": `${BASE}/2022/07/Dt.-Levent-Emir-Guneysu-540x650.jpg`,
  // Hero / about portraits + gallery (real clinic/patient photos)
  "portrait-a.jpg": `${BASE}/2022/04/Medident-17-1024x1024.jpeg`,
  "about-portrait.jpg": `${BASE}/2022/04/Medident-19-1024x1024.jpeg`,
  "hero-beforeafter.png": `${BASE}/2022/01/WhatsApp-Image-2022-01-12-at-22.20.17-1024x510.jpeg`,
  "before.jpg": `${BASE}/2022/01/WhatsApp-Image-2022-01-11-at-18.54.52-1024x682.jpeg`,
  "after.jpg": `${BASE}/2022/01/WhatsApp-Image-2022-01-11-at-18.54.53-1024x682.jpeg`,
  "gallery-1.jpg": `${BASE}/2022/04/Medident-1-1024x1024.jpg`,
  "gallery-2.jpg": `${BASE}/2022/04/Medident-3-1024x1024.jpg`,
  "gallery-3.jpg": `${BASE}/2022/04/Medident-5-1024x1024.jpg`,
  "gallery-4.jpg": `${BASE}/2022/04/Medident-7-1024x1024.jpg`,
  "gallery-5.jpg": `${BASE}/2022/04/Medident-9-1024x1024.jpg`,
  "gallery-6.jpg": `${BASE}/2022/04/Medident-11-1024x1024.jpg`,
  "gallery-7.jpg": `${BASE}/2022/04/Medident-20-1024x1024.jpeg`,
  "gallery-8.jpg": `${BASE}/2022/04/Medident-21-1024x1024.jpeg`,
  "gallery-9.jpg": `${BASE}/2022/04/Medident-22-1024x1024.jpeg`,
  "gallery-10.jpg": `${BASE}/2022/04/Medident-23-1024x1024.jpeg`,
  "gallery-11.jpg": `${BASE}/2022/04/Medident-25-1024x1024.jpeg`,
  "gallery-12.jpg": `${BASE}/2022/04/Medident-27-1024x1024.jpeg`,
  "clinic-1.jpg": `${BASE}/2022/01/WhatsApp-Image-2022-01-12-at-22.20.18-1024x682.jpeg`,
  "clinic-2.jpg": `${BASE}/2022/01/WhatsApp-Image-2022-01-12-at-22.20.16-2-1024x691.jpeg`,
};

async function download(name, url) {
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`FAIL ${res.status} ${name} <- ${url}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log(`OK ${name} (${(buf.length / 1024).toFixed(0)} KB)`);
  return true;
}

const entries = Object.entries(FILES);
let ok = 0;
for (const [name, url] of entries) {
  try {
    if (await download(name, url)) ok++;
  } catch (e) {
    console.warn(`ERR ${name}: ${e.message}`);
  }
}
console.log(`\nDownloaded ${ok}/${entries.length} images -> ${OUT}`);
