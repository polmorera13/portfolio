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

// Contact form
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "invalid" });
  }
  if (!RESEND_API_KEY) return res.status(500).json({ error: "server_misconfigured" });
  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      reply_to: email,
      subject: `Nuevo contacto: ${name}`,
      text: `De: ${name} <${email}>\n\n${message?.trim() || "(sin mensaje)"}`,
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
