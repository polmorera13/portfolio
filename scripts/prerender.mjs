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
const { render, buildHead, PATHS, LOCALES, NOINDEX_PAGES, LEGAL_PATHS, SITE_URL } = server;

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

// ── Plantilla ────────────────────────────────────────────────────────────────
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const baseNoSlash = BASE.replace(/\/$/, "");

function page({ head, lang, appHtml, withData = true }) {
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
    const head = buildHead({ kind: "page", key, lang });
    write(url, page({ head: head.html, lang, appHtml: render(loc(url), lang, data) }));
    count++;
  }
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
