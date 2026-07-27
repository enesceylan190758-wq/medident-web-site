// Responsive image helper: JPEG + optional WebP in dist/assets/img.
import { asset } from "./layout.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const IMG_SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "../assets/images");

export function imgUrl(file = "") {
  return asset(`/assets/img/${file}`);
}

export function hasWebp(file = "") {
  if (!/\.jpe?g$/i.test(file)) return false;
  const webp = file.replace(/\.jpe?g$/i, ".webp");
  return fs.existsSync(path.join(IMG_SRC, webp));
}

/** Hero and above-fold: eager load. Others: lazy + WebP when available. */
export function responsiveImg(file, { alt = "", width, height, loading = "lazy", class: cls = "", sizes } = {}) {
  const jpg = imgUrl(file);
  const webpFile = file.replace(/\.jpe?g$/i, ".webp");
  const webp = hasWebp(file) ? imgUrl(webpFile) : "";
  const attrs = [
    width ? `width="${width}"` : "",
    height ? `height="${height}"` : "",
    `loading="${loading}"`,
    `alt="${String(alt).replace(/"/g, "&quot;")}"`,
    cls ? `class="${cls}"` : "",
    sizes ? `sizes="${sizes}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  if (webp) {
    return `<picture>
      <source srcset="${webp}" type="image/webp">
      <img src="${jpg}" ${attrs}>
    </picture>`;
  }
  return `<img src="${jpg}" ${attrs}>`;
}
