import express from "express";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import fss from "node:fs";
import path from "node:path";

const execFileP = promisify(execFile);

// ── Config ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
const MEDIA_DIR = process.env.MEDIA_DIR || "/data/media";
const THUMB_DIR = path.join(MEDIA_DIR, "thumbs");
const CATALOG_PATH = process.env.CATALOG_PATH || "/data/catalog.json";
const HERO_PATH = process.env.HERO_PATH || "/data/hero.json";
const HERO_SLOT_KEYS = ["1", "2", "3", "4", "5", "6", "7"];
// Vídeos de "Qué produzco": junto a hero.json en /data
const SERVICES_PATH = process.env.SERVICES_PATH || path.join(path.dirname(HERO_PATH), "services.json");
// Cuántos vídeos lleva cada servicio
const SERVICE_SLOTS = { ads: 1, organic: 1, corporate: 3 };
// Casos de éxito / KPIs: junto a hero.json en /data; sus archivos en /data/media/cases
const CASES_PATH = process.env.CASES_PATH || path.join(path.dirname(HERO_PATH), "cases.json");
const CASES_MEDIA_DIR = path.join(process.env.MEDIA_DIR || "/data/media", "cases");
const MEDIA_BASE = process.env.MEDIA_BASE || "https://media.polmorera.es";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "polmorera13";
const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO = process.env.CONTACT_DESTINATION_EMAIL || "hello@polmorera.es";
const CONTACT_FROM = process.env.CONTACT_FROM || "Portfolio <noreply@polmorera.es>";

const CATEGORY_LABEL = {
  ads: "Paid media",
  organic: "Orgánico",
  corporate: "Corporativo",
  street: "Street content",
  hero: "Hero",
};
const VALID_CATEGORIES = ["ads", "organic", "corporate", "street"];

// ── App ─────────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "/tmp/uploads",
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
});

// ── Catalog helpers ───────────────────────────────────────────────────────────
async function readCatalog() {
  try {
    const raw = await fs.readFile(CATALOG_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
async function writeCatalog(list) {
  await fs.writeFile(CATALOG_PATH, JSON.stringify(list, null, 2), "utf8");
}

async function readHero() {
  try {
    return JSON.parse(await fs.readFile(HERO_PATH, "utf8"));
  } catch {
    return {};
  }
}
async function writeHero(cfg) {
  await fs.writeFile(HERO_PATH, JSON.stringify(cfg, null, 2), "utf8");
}

async function readServices() {
  try {
    return JSON.parse(await fs.readFile(SERVICES_PATH, "utf8"));
  } catch {
    return {};
  }
}
async function writeServices(cfg) {
  await fs.writeFile(SERVICES_PATH, JSON.stringify(cfg, null, 2), "utf8");
}

async function readCases() {
  try {
    const list = JSON.parse(await fs.readFile(CASES_PATH, "utf8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
async function writeCases(list) {
  await fs.writeFile(CASES_PATH, JSON.stringify(list, null, 2), "utf8");
}

// ── Saneado de un caso (solo campos conocidos, textos acotados) ───────────────
const str = (v, max = 600) => (typeof v === "string" ? v.slice(0, max) : "");
const tri = (v, max = 600) => ({ es: str(v?.es, max), en: str(v?.en, max), ca: str(v?.ca, max) });
const mediaPath = (v) => {
  const p = str(v, 200);
  // Solo rutas dentro del servidor de vídeos (sin ../ ni URLs externas)
  return /^[a-z0-9][a-z0-9._/-]*$/i.test(p) && !p.includes("..") ? p : "";
};
function normalizeCase(input, existing = {}) {
  const c = input || {};
  return {
    id: existing.id || crypto.randomUUID(),
    published: c.published === undefined ? existing.published ?? false : !!c.published,
    brandName: str(c.brandName, 80),
    brandLogo: mediaPath(c.brandLogo) || (str(c.brandLogo, 200).startsWith("/logos/") ? str(c.brandLogo, 200) : ""),
    platform: str(c.platform, 60),
    campaignType: tri(c.campaignType, 80),
    industry: tri(c.industry, 80),
    title: tri(c.title, 160),
    description: tri(c.description, 700),
    quote: tri(c.quote, 300),
    quoteAuthor: str(c.quoteAuthor, 80),
    insight: tri(c.insight, 700),
    disclaimer: tri(c.disclaimer, 400),
    kpis: (Array.isArray(c.kpis) ? c.kpis : []).slice(0, 8).map((k) => ({
      value: str(k?.value, 30),
      label: tri(k?.label, 80),
      context: tri(k?.context, 160),
      highlight: !!k?.highlight,
    })),
    chart: {
      title: tri(c.chart?.title, 120),
      bars: (Array.isArray(c.chart?.bars) ? c.chart.bars : []).slice(0, 8).map((b) => ({
        label: tri(b?.label, 80),
        value: Number.isFinite(Number(b?.value)) ? Number(b.value) : 0,
        display: str(b?.display, 40),
      })),
    },
    videos: (Array.isArray(c.videos) ? c.videos : []).slice(0, 8).map((v) => ({
      file: mediaPath(v?.file),
      poster: mediaPath(v?.poster),
      name: str(v?.name, 80),
      label: tri(v?.label, 60),
      aspect: v?.aspect === "16:9" ? "16:9" : "9:16",
    })),
    evidence: (Array.isArray(c.evidence) ? c.evidence : []).slice(0, 8).map((e) => ({
      image: mediaPath(e?.image),
      alt: tri(e?.alt, 160),
      description: tri(e?.description, 300),
      visible: e?.visible === undefined ? true : !!e.visible,
    })),
  };
}

function slugify(name) {
  const base = name.replace(/\.[^.]+$/, "");
  return (
    base
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60)
      .replace(/-$/, "") || "video"
  );
}

async function probeAspect(filePath) {
  try {
    const { stdout } = await execFileP("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "csv=s=x:p=0",
      filePath,
    ]);
    const [w, h] = stdout.trim().split("x").map(Number);
    if (w && h) return w > h ? "16:9" : "9:16";
  } catch {}
  return "9:16";
}

async function makeThumb(filePath, thumbPath) {
  await fs.mkdir(THUMB_DIR, { recursive: true });
  await execFileP("ffmpeg", [
    "-y", "-ss", "0.2", "-i", filePath,
    "-vframes", "1", "-vf", "scale=-2:720", "-q:v", "4",
    thumbPath,
  ]);
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "no_token" });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "bad_token" });
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/login", (req, res) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "invalid" });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "30d" });
  res.json({ token });
});

// Public: active videos for the site
app.get("/api/videos", async (_req, res) => {
  const list = await readCatalog();
  res.json(list.filter((v) => v.is_active !== false));
});

// Admin: full list (incl. inactive)
app.get("/api/admin/videos", requireAuth, async (_req, res) => {
  res.json(await readCatalog());
});

// Public: which video sits in each hero slot
app.get("/api/hero", async (_req, res) => {
  res.json(await readHero());
});

// Admin: set hero slots. Body: { slots: { "1": slug|null, ... } } (partial ok)
app.put("/api/admin/hero", requireAuth, async (req, res) => {
  const { slots } = req.body || {};
  if (!slots || typeof slots !== "object") return res.status(400).json({ error: "bad_body" });
  const catalog = await readCatalog();
  const known = new Set(catalog.map((v) => v.storage_path));
  const cfg = await readHero();
  for (const [k, slug] of Object.entries(slots)) {
    if (!HERO_SLOT_KEYS.includes(k)) return res.status(400).json({ error: "bad_slot", slot: k });
    if (slug !== null && !known.has(slug)) return res.status(400).json({ error: "unknown_video", slot: k });
    cfg[k] = slug;
  }
  await writeHero(cfg);
  res.json(cfg);
});

// Public: vídeos de cada servicio de "Qué produzco"
app.get("/api/services", async (_req, res) => {
  res.json(await readServices());
});

// Admin: vídeos de los servicios. Body: { services: { ads: [slug], organic: [slug], corporate: [slug, slug, slug] } } (parcial ok)
app.put("/api/admin/services", requireAuth, async (req, res) => {
  const { services } = req.body || {};
  if (!services || typeof services !== "object") return res.status(400).json({ error: "bad_body" });
  const catalog = await readCatalog();
  const known = new Set(catalog.map((v) => v.storage_path));
  const cfg = await readServices();
  for (const [key, list] of Object.entries(services)) {
    if (!(key in SERVICE_SLOTS)) return res.status(400).json({ error: "bad_service", service: key });
    if (!Array.isArray(list) || list.length > SERVICE_SLOTS[key]) return res.status(400).json({ error: "bad_list", service: key });
    for (const slug of list) {
      if (slug !== null && !known.has(slug)) return res.status(400).json({ error: "unknown_video", service: key });
    }
    cfg[key] = list;
  }
  await writeServices(cfg);
  res.json(cfg);
});

// ── Casos de éxito / KPIs ───────────────────────────────────────────────────
// Public: solo los publicados, en su orden
app.get("/api/cases", async (_req, res) => {
  res.json((await readCases()).filter((c) => c.published));
});

// Admin: todos
app.get("/api/admin/cases", requireAuth, async (_req, res) => {
  res.json(await readCases());
});

// Admin: crear (al final de la lista, oculto por defecto)
app.post("/api/admin/cases", requireAuth, async (req, res) => {
  const list = await readCases();
  const created = normalizeCase({ published: false, ...(req.body || {}) });
  list.push(created);
  await writeCases(list);
  res.json(created);
});

// Admin: reordenar. Body: { ids: [...] }
app.put("/api/admin/cases/reorder", requireAuth, async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : null;
  if (!ids) return res.status(400).json({ error: "bad_body" });
  const list = await readCases();
  const byId = new Map(list.map((c) => [c.id, c]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
  for (const c of list) if (!ids.includes(c.id)) ordered.push(c);
  await writeCases(ordered);
  res.json(ordered);
});

// Admin: guardar un caso entero
app.put("/api/admin/cases/:id", requireAuth, async (req, res) => {
  const list = await readCases();
  const i = list.findIndex((c) => c.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "not_found" });
  list[i] = normalizeCase(req.body, list[i]);
  await writeCases(list);
  res.json(list[i]);
});

// Admin: borrar
app.delete("/api/admin/cases/:id", requireAuth, async (req, res) => {
  const list = await readCases();
  const next = list.filter((c) => c.id !== req.params.id);
  if (next.length === list.length) return res.status(404).json({ error: "not_found" });
  await writeCases(next);
  res.json({ ok: true });
});

// Admin: subir un vídeo (MP4/WebM/MOV) o una imagen (JPG/PNG/WebP) para un caso.
// Devuelve { file, poster } con rutas relativas a media.polmorera.es.
app.post("/api/admin/cases/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "no_file" });
    const original = req.file.originalname || "archivo";
    const ext = (path.extname(original).toLowerCase() || "").replace(".jpeg", ".jpg");
    const isVideo = [".mp4", ".webm", ".mov"].includes(ext);
    const isImage = [".jpg", ".png", ".webp"].includes(ext);
    if (!isVideo && !isImage) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: "bad_type" });
    }
    await fs.mkdir(CASES_MEDIA_DIR, { recursive: true });
    const base = `${slugify(original)}-${Date.now().toString(36)}`;
    const name = base + (ext === ".mov" ? ".mp4" : ext);
    const dest = path.join(CASES_MEDIA_DIR, name);
    await fs.copyFile(req.file.path, dest);
    await fs.unlink(req.file.path).catch(() => {});
    let poster = null;
    let aspect = null;
    if (isVideo) {
      aspect = await probeAspect(dest);
      // Un solo fotograma, con prioridad baja: no carga el servidor
      await execFileP("nice", ["-n", "19", "ffmpeg", "-y", "-ss", "0.2", "-i", dest, "-vframes", "1", "-vf", "scale=-2:720", "-q:v", "4", path.join(CASES_MEDIA_DIR, base + ".jpg")])
        .then(() => { poster = `cases/${base}.jpg`; })
        .catch(() => {});
    }
    res.json({ file: `cases/${name}`, poster, aspect, kind: isVideo ? "video" : "image" });
  } catch (e) {
    console.error("case upload error", e);
    res.status(500).json({ error: "upload_failed" });
  }
});

// Contact form
app.post("/api/contact", async (req, res) => {
  const { name, email, message, type, website } = req.body || {};
  // type: "quote" (presupuesto, por defecto) o "proposal" (propuesta gratis con
  // 3 ideas de vídeo; "videos3" es el nombre antiguo y se sigue aceptando).
  const kind = type === "proposal" || type === "videos3" ? "proposal" : "quote";
  const site = String(website || "").trim().slice(0, 300);
  if (!name?.trim() || !email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "invalid" });
  }
  if (kind === "proposal" && !site) return res.status(400).json({ error: "website_required" });
  if (!RESEND_API_KEY) return res.status(500).json({ error: "server_misconfigured" });
  try {
    const resend = new Resend(RESEND_API_KEY);
    const tag = kind === "proposal" ? "[Propuesta gratis]" : "[Presupuesto]";
    const kindLabel = kind === "proposal" ? "Propuesta gratis con 3 ideas de vídeo" : "Un presupuesto";
    await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      reply_to: email,
      subject: `${tag} ${name.trim()}`,
      text: [
        `Qué necesita: ${kindLabel}`,
        `Nombre y empresa: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Web o Instagram: ${site || "(no indicado)"}`,
        "",
        message?.trim() || "(sin mensaje)",
      ].join("\n"),
    });
    res.json({ ok: true });
  } catch (e) {
    console.error("contact error", e);
    res.status(500).json({ error: "send_failed" });
  }
});

// Admin: upload a new video
app.post("/api/admin/videos", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const { category, brand } = req.body || {};
    if (!req.file) return res.status(400).json({ error: "no_file" });
    if (!VALID_CATEGORIES.includes(category)) return res.status(400).json({ error: "bad_category" });

    const original = req.file.originalname || "video.mp4";
    let slug = slugify(original) + ".mp4";

    const list = await readCatalog();
    // ensure unique slug
    let i = 2;
    while (list.some((v) => v.storage_path === slug)) {
      slug = slugify(original) + "-" + i++ + ".mp4";
    }

    const destPath = path.join(MEDIA_DIR, slug);
    await fs.copyFile(req.file.path, destPath);
    await fs.unlink(req.file.path).catch(() => {});

    const aspect = await probeAspect(destPath);
    const thumbName = slug.replace(/\.mp4$/, ".jpg");
    await makeThumb(destPath, path.join(THUMB_DIR, thumbName)).catch(() => {});

    const maxOrder = list
      .filter((v) => v.category === category)
      .reduce((m, v) => Math.max(m, v.display_order ?? 0), -1);

    const entry = {
      id: slug,
      category,
      title: (brand || "").trim() || "Vídeo",
      client: CATEGORY_LABEL[category],
      storage_path: slug,
      thumbnail_path: `thumbs/${thumbName}`,
      aspect_ratio: aspect,
      display_order: maxOrder + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      slot: null,
      media_type: "video",
    };
    list.push(entry);
    await writeCatalog(list);
    res.json(entry);
  } catch (e) {
    console.error("upload error", e);
    res.status(500).json({ error: "upload_failed" });
  }
});

// Admin: edit a video (category / brand / active / order)
app.patch("/api/admin/videos/:id", requireAuth, async (req, res) => {
  const list = await readCatalog();
  const idx = list.findIndex((v) => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "not_found" });
  const v = list[idx];
  const { category, brand, is_active, display_order } = req.body || {};
  if (category !== undefined) {
    if (!VALID_CATEGORIES.includes(category)) return res.status(400).json({ error: "bad_category" });
    v.category = category;
    v.client = CATEGORY_LABEL[category];
  }
  if (brand !== undefined) v.title = String(brand);
  if (is_active !== undefined) v.is_active = !!is_active;
  if (display_order !== undefined) v.display_order = Number(display_order);
  list[idx] = v;
  await writeCatalog(list);
  res.json(v);
});

// Admin: reorder within a category
app.put("/api/admin/videos/reorder", requireAuth, async (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids)) return res.status(400).json({ error: "bad_body" });
  const list = await readCatalog();
  ids.forEach((id, order) => {
    const v = list.find((x) => x.id === id);
    if (v) v.display_order = order;
  });
  await writeCatalog(list);
  res.json({ ok: true });
});

// Admin: delete a video (entry + files)
app.delete("/api/admin/videos/:id", requireAuth, async (req, res) => {
  const list = await readCatalog();
  const v = list.find((x) => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: "not_found" });
  const next = list.filter((x) => x.id !== req.params.id);
  await writeCatalog(next);
  // free any hero slot that pointed to this video
  const hero = await readHero();
  let heroChanged = false;
  for (const k of Object.keys(hero)) {
    if (hero[k] === v.storage_path) { hero[k] = null; heroChanged = true; }
  }
  if (heroChanged) await writeHero(hero);
  // quitarlo también de los vídeos de servicios
  const svc = await readServices();
  let svcChanged = false;
  for (const k of Object.keys(svc)) {
    if (Array.isArray(svc[k]) && svc[k].includes(v.storage_path)) {
      svc[k] = svc[k].map((s) => (s === v.storage_path ? null : s));
      svcChanged = true;
    }
  }
  if (svcChanged) await writeServices(svc);
  // best-effort file cleanup
  if (v.storage_path) {
    await fs.unlink(path.join(MEDIA_DIR, v.storage_path)).catch(() => {});
  }
  if (v.thumbnail_path) {
    await fs.unlink(path.join(MEDIA_DIR, v.thumbnail_path)).catch(() => {});
  }
  res.json({ ok: true });
});

// Ensure dirs exist on boot
fss.mkdirSync(MEDIA_DIR, { recursive: true });
fss.mkdirSync(THUMB_DIR, { recursive: true });

app.listen(PORT, () => console.log(`API on :${PORT}`));
