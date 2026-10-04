// Prerenderizado: genera un HTML completo para cada URL pública (contenido,
// título, descripción, canonical, hreflang y JSON-LD), además del 404, el
// sitemap y robots.txt. React después "hidrata" ese HTML en el navegador.
//
// Se ejecuta al final de `npm run build`. BASE_PATH = "/" (producción) o "/test/"
// (copia de pruebas). Los datos (vídeos, portada, servicios y casos) se leen de
// la API en el momento de construir.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const DIST = path.join(ROOT, process.env.OUT_DIR || "dist");
const BASE = process.env.BASE_PATH || "/";
const API = "https://api.polmorera.es";

const server = await import(pathToFileURL(path.join(ROOT, "dist-ssr", "entry-server.js")).href);
const { render, buildHead, pageVideos, mediaAbs, ogText, ogImageSource, ogSlug, PATHS, LOCALES, NOINDEX_PAGES, LEGAL_PATHS, SITE_URL } = server;
const { renderOgImage } = await import(pathToFileURL(path.join(ROOT, "scripts", "og-images.mjs")).href);

// ── Datos de la API (si falla algo, la página se genera igualmente) ─────────
async function get(endpoint, fallback) {
  try {
    const res = await fetch(API + endpoint, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } catch (e) {
    console.warn(`  ! ${endpoint}: ${e.message} (se usa el valor por defecto)`);
    return fallback;
  }
}
const data = {
  videos: await get("/api/videos", []),
  hero: await get("/api/hero", {}),
  services: await get("/api/services", {}),
  cases: await get("/api/cases", []),
};
if (!Object.keys(data.hero).length) delete data.hero;

// ── Vídeos: fecha de subida y duración (para el VideoObject) ────────────────
// La fecha es el Last-Modified del archivo en media.polmorera.es. La duración se
// lee de la caja "mvhd" del mp4 (los vídeos llevan el índice al principio), con
// una petición de los primeros 512 KB: no se descarga el vídeo entero.
const videoMetaCache = new Map();
function mvhdDuration(buf) {
  const i = buf.indexOf("mvhd");
  if (i < 4) return null;
  const v = buf[i + 4];
  const ts = v === 1 ? buf.readUInt32BE(i + 4 + 4 + 16) : buf.readUInt32BE(i + 4 + 4 + 8);
  const dur = v === 1 ? Number(buf.readBigUInt64BE(i + 4 + 4 + 20)) : buf.readUInt32BE(i + 4 + 4 + 12);
  if (!ts || !dur) return null;
  return `PT${Math.max(1, Math.round(dur / ts))}S`;
}
async function videoMeta(file) {
  if (videoMetaCache.has(file)) return videoMetaCache.get(file);
  const url = mediaAbs(file);
  const meta = {};
  try {
    const head = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15000) });
    const lm = head.headers.get("last-modified");
    if (head.ok && lm) meta.uploadDate = new Date(lm).toISOString();
    const part = await fetch(url, { headers: { Range: "bytes=0-524287" }, signal: AbortSignal.timeout(20000) });
    if (part.ok) meta.duration = mvhdDuration(Buffer.from(await part.arrayBuffer())) ?? undefined;
  } catch (e) {
    console.warn(`  ! vídeo ${file}: ${e.message}`);
  }
  videoMetaCache.set(file, meta);
  return meta;
}
async function videosFor(key, lang) {
  const list = pageVideos(key, lang, data);
  const out = [];
  for (const v of list) {
    const m = await videoMeta(v.file);
    out.push({ name: v.name, description: v.description, thumbnailUrl: v.poster ? mediaAbs(v.poster) : "", contentUrl: mediaAbs(v.file), ...m });
  }
  return out;
}

// ── Plantilla ────────────────────────────────────────────────────────────────
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const baseNoSlash = BASE.replace(/\/$/, "");

function page({ head, lang, appHtml, withData = true }) {
  // Si React no pudo pintar la página (error en el render), mejor parar el build que publicarla vacía
  if (appHtml.includes("<template data-msg=")) throw new Error("Error al prerenderizar: " + (appHtml.match(/data-msg="([^"]*)"/)?.[1] ?? "?"));
  let html = template
    .replace(/<!--app-head-->[\s\S]*?<!--\/app-head-->/, head)
    .replace('<html lang="es">', `<html lang="${lang}">`)
    .replace("<!--app-html-->", appHtml)
    .replace(
      "<!--app-data-->",
      withData ? `<script>window.__PM_DATA__=${JSON.stringify(data).replace(/</g, "\\u003c")}</script>` : "",
    );
  // Iconos y manifest con la base (/ o /test/)
  html = html.replace(/href="\/(favicon\.ico|favicon\.svg|apple-touch-icon\.png|site\.webmanifest)"/g, `href="${baseNoSlash}/$1"`);
  return html;
}

function write(urlPath, html) {
  const rel = urlPath.replace(/^\//, "");
  const file = rel.endsWith(".html") ? path.join(DIST, rel) : path.join(DIST, rel, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const loc = (p) => baseNoSlash + p; // ruta completa para el router (con la base)
let count = 0;

// ── Páginas por idioma ──────────────────────────────────────────────────────
for (const key of Object.keys(PATHS)) {
  for (const lang of LOCALES) {
    const url = PATHS[key][lang];
    const head = buildHead({ kind: "page", key, lang, videos: await videosFor(key, lang) });
    write(url, page({ head: head.html, lang, appHtml: render(loc(url), lang, data) }));
    count++;
  }
}

// ── Imágenes para compartir (1200×630) de cada página y cada idioma ─────────
{
  let n = 0, maxKb = 0;
  for (const key of Object.keys(PATHS)) {
    for (const lang of LOCALES) {
      const bytes = await renderOgImage({
        text: ogText(key, lang),
        source: ogImageSource(key, data),
        outFile: path.join(DIST, "og", ogSlug(key, lang) + ".jpg"),
        distDir: DIST,
      });
      n++; maxKb = Math.max(maxKb, Math.round(bytes / 1024));
    }
  }
  console.log(`Imágenes para compartir: ${n} (la más pesada, ${maxKb} KB)`);
}

// ── Textos legales (noindex, en español) ────────────────────────────────────
for (const [doc, url] of Object.entries(LEGAL_PATHS)) {
  const head = buildHead({ kind: "legal", doc, path: url });
  write(url, page({ head: head.html, lang: "es", appHtml: render(loc(url), "es", data) }));
  count++;
}

// ── 404 ──────────────────────────────────────────────────────────────────────
{
  const head = buildHead({ kind: "404", lang: "es" });
  write("/404.html", page({ head: head.html, lang: "es", appHtml: render(loc("/__no-existe__/"), "es", data) }));
}

// ── Panel (sin prerenderizar: lo pinta el navegador) ────────────────────────
for (const url of ["/login/", "/admin/"]) {
  write(url, page({ head: `<title>Pol Morera · Panel</title>\n    <meta name="robots" content="noindex, nofollow" />`, lang: "es", appHtml: "", withData: false }));
}

// ── Sitemap (solo URLs indexables, en los tres idiomas) ─────────────────────
const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(PATHS)
  .filter((k) => !NOINDEX_PAGES.includes(k))
  .flatMap((k) => LOCALES.map((l) => `  <url>\n    <loc>${SITE_URL}${PATHS[k][l]}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`));
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);

// ── robots.txt ──────────────────────────────────────────────────────────────
fs.writeFileSync(
  path.join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

console.log(`Prerenderizadas ${count} páginas + 404 + panel. Sitemap con ${urls.length} URLs. Base: ${BASE}`);
