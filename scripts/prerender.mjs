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
const { render, buildHead, pageVideos, mediaAbs, ogText, ogImageSource, ogSlug, PATHS, LOCALES, NOINDEX_PAGES, SITE_URL } = server;
await server.preloadAll(); // todas las páginas cargadas antes de prerenderizar
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
// Miniaturas que tienen versiones de 320 y 480 px (ver src/lib/thumbs.ts)
try {
  const r = await fetch("https://media.polmorera.es/variants.json", { signal: AbortSignal.timeout(15000) });
  if (r.ok) data.variants = await r.json();
} catch (e) {
  console.warn(`  ! variants.json: ${e.message} (miniaturas sin versiones)`);
}

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
    const thumbnailUrl = v.poster ? mediaAbs(v.poster) : "";
    // Póster que pinta la página (480 px en los verticales): es el que se precarga
    out.push({ name: v.name, description: v.description, thumbnailUrl, posterUrl: server.posterUrl(thumbnailUrl, v.vertical, data) || thumbnailUrl, contentUrl: mediaAbs(v.file), ...m });
  }
  return out;
}

// ── JavaScript de cada página (modulepreload) ──────────────────────────────
// Con el manifest de Vite: el archivo de la página, el de su idioma y lo que importan.
const manifestPath = path.join(DIST, ".vite", "manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const mainEntry = Object.values(manifest).find((m) => m.isEntry);
const PAGE_SRC = {
  home: "src/pages/HomePage.tsx", "svc-ads": "src/pages/ServicePage.tsx", "svc-social": "src/pages/ServicePage.tsx",
  "svc-corporate": "src/pages/ServicePage.tsx", "ugc-male": "src/pages/UgcMalePage.tsx", cases: "src/pages/CasesIndexPage.tsx", "case-masterd": "src/pages/CasePage.tsx",
  "case-dogfy": "src/pages/CasePage.tsx", "case-reactiva": "src/pages/CasePage.tsx", "case-agency": "src/pages/CasePage.tsx",
  about: "src/pages/AboutPage.tsx", thanks: "src/pages/ThanksPage.tsx", privacy: "src/pages/Legal.tsx", legal: "src/pages/Legal.tsx", landing: "src/pages/LandingPage.tsx", notfound: "src/pages/NotFoundPage.tsx",
};
function chunkFiles(key, seen = new Set()) {
  const m = manifest[key];
  if (!m || seen.has(key)) return seen;
  seen.add(key);
  for (const imp of m.imports || []) chunkFiles(imp, seen);
  return seen;
}
function modulePreloads(pageKey, lang) {
  const keys = new Set([...chunkFiles(PAGE_SRC[pageKey] || ""), ...chunkFiles(`src/locales/${lang}.json`)]);
  const files = [...keys].map((k) => manifest[k].file).filter((f) => f && f !== mainEntry?.file);
  return files.map((f) => `<link rel="modulepreload" crossorigin href="${baseNoSlash}/${f}" />`).join("\n    ");
}

// ── Plantilla ────────────────────────────────────────────────────────────────
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const baseNoSlash = BASE.replace(/\/$/, "");

// Fuentes del primer pantallazo (Poppins latin 300/400/600/700): se piden a la vez que el CSS
const FONT_PRELOADS = fs.readdirSync(path.join(DIST, "assets"))
  .filter((f) => /^poppins-latin-(300|400|600|700)-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${baseNoSlash}/assets/${f}" />`)
  .join("\n    ");

function page({ head, lang, appHtml, withData = true, preload = "" }) {
  head = head + "\n    " + FONT_PRELOADS;
  if (preload) head = head + "\n    " + preload;
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
  // JavaScript después del primer pintado (solo en páginas prerenderizadas; el panel, vacío, lo carga
  // ya): el HTML prerenderizado trae todo el contenido, así
  // que primero se pinta (texto, fondo del hero) y justo después se piden el código de la web y el
  // de la página (antes competían con la primera pintura en conexiones lentas).
  const entry = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>\s*/);
  if (entry && appHtml.trim()) {
    const mods = [...html.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)"\s*\/?>\s*/g)];
    for (const m of mods) html = html.replace(m[0], "");
    html = html.replace(entry[0], "");
    const loader = `<script>(function(){var d=0,m=${JSON.stringify(mods.map((m) => m[1]))};function go(){if(d)return;d=1;m.forEach(function(h){var l=document.createElement("link");l.rel="modulepreload";l.crossOrigin="";l.href=h;document.head.appendChild(l)});var s=document.createElement("script");s.type="module";s.crossOrigin="";s.src=${JSON.stringify(entry[1])};document.head.appendChild(s)}try{if((PerformanceObserver.supportedEntryTypes||[]).indexOf("paint")<0)throw 0;var po=new PerformanceObserver(function(l){if(l.getEntriesByName("first-contentful-paint").length){po.disconnect();setTimeout(go,0)}});po.observe({type:"paint",buffered:true})}catch(e){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,1500)})()</script>`;
    html = html.replace("</body>", loader + "\n  </body>");
  }
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
    write(url, page({ head: head.html, lang, appHtml: render(loc(url), lang, data), preload: modulePreloads(key, lang) }));
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

// ── 404 ──────────────────────────────────────────────────────────────────────
{
  const head = buildHead({ kind: "404", lang: "es" });
  write("/404.html", page({ head: head.html, lang: "es", appHtml: render(loc("/__no-existe__/"), "es", data), preload: modulePreloads("notfound", "es") }));
}

// ── Panel (sin prerenderizar: lo pinta el navegador) ────────────────────────
for (const url of ["/login/", "/admin/"]) {
  write(url, page({ head: `<title>Pol Morera · Panel</title>\n    <meta name="robots" content="noindex, nofollow" />`, lang: "es", appHtml: "", withData: false }));
}

// ── Sitemap (solo URLs indexables, en los tres idiomas) ─────────────────────
const urls = Object.keys(PATHS)
  .filter((k) => !NOINDEX_PAGES.includes(k))
  .flatMap((k) => LOCALES.map((l) => `  <url>\n    <loc>${SITE_URL}${PATHS[k][l]}</loc>\n  </url>`));
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);

// ── robots.txt ──────────────────────────────────────────────────────────────
fs.writeFileSync(
  path.join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

fs.rmSync(path.join(DIST, ".vite"), { recursive: true, force: true });
console.log(`Prerenderizadas ${count} páginas + 404 + panel. Sitemap con ${urls.length} URLs. Base: ${BASE}`);
