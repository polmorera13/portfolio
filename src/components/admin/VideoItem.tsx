import { useState, useEffect, useRef, type DragEvent, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { Trash2, GripVertical } from "lucide-react";
import { Eye, PencilSimple, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, getPublicUrl } from "../../lib/supabase";
import VideoPlayer from "../VideoPlayer";
import type { Video, VideoCategory, AspectRatio } from "../../types/video";

const BLUE = "oklch(58% 0.14 240)";
const OFFWHITE = "oklch(96% 0.005 240)";
const STEEL = "oklch(70% 0.07 230)";
const RED = "oklch(65% 0.18 25)";

const CATEGORY_LABELS: Record<VideoCategory, string> = {
  hero: "Hero",
  ads: "Ads",
  organic: "Orgánico",
  corporate: "Corporativo",
  street: "Street content",
};

const CATEGORY_ASPECT: Record<VideoCategory, AspectRatio> = {
  hero: "9:16",
  ads: "9:16",
  organic: "9:16",
  street: "9:16",
  corporate: "16:9",
};

const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_SIZE = 100 * 1024 * 1024;

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

async function extractThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const vid = document.createElement("video");
    const url = URL.createObjectURL(file);
    vid.src = url;
    vid.muted = true;
    vid.playsInline = true;
    vid.currentTime = 0.5;
    vid.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); resolve(null); return; }
      ctx.drawImage(vid, 0, 0);
      canvas.toBlob((blob) => { URL.revokeObjectURL(url); resolve(blob); }, "image/jpeg", 0.85);
    });
    vid.addEventListener("error", () => { URL.revokeObjectURL(url); resolve(null); });
    vid.load();
  });
}

// ── Lock / unlock body scroll ────────────────────────────────────────────────
function lockScroll() { document.body.style.overflow = "hidden"; }
function unlockScroll() { document.body.style.overflow = ""; }

// ── Shared field / label styles ──────────────────────────────────────────────
const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  borderRadius: "8px",
  border: "1px solid oklch(58% 0.14 240 / 0.2)",
  background: "oklch(16% 0.02 240)",
  color: OFFWHITE,
  fontSize: "0.9rem",
  fontFamily: "Poppins, sans-serif",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 150ms",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: STEEL,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  marginBottom: "0.4rem",
};

// ── Icon button ──────────────────────────────────────────────────────────────
function IconBtn({
  onClick,
  ariaLabel,
  hoverColor = BLUE,
  children,
}: {
  onClick: () => void;
  ariaLabel: string;
  hoverColor?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: STEEL,
        padding: "0.25rem",
        display: "flex",
        alignItems: "center",
        transition: "color 160ms, transform 100ms",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = hoverColor; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = STEEL; }}
      onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.92)"; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
    >
      {children}
    </button>
  );
}

// ── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const { t } = useTranslation();
  const ar = video.aspect_ratio ?? CATEGORY_ASPECT[video.category];
  const src = getPublicUrl(video.storage_path);
  const poster = video.thumbnail_path ? getPublicUrl(video.thumbnail_path) : null;

  useEffect(() => {
    lockScroll();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { unlockScroll(); window.removeEventListener("keydown", handler); };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="preview-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          background: "oklch(12% 0.025 240 / 0.85)",
          padding: "1rem",
        }}
      >
        <motion.div
          key="preview-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            maxWidth: ar === "9:16" ? "min(360px, 80vw)" : "min(800px, 80vw)",
            width: "100%",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {/* Caption */}
          {(video.title || video.client) && (
            <div style={{ paddingLeft: "0.25rem" }}>
              {video.title && (
                <p style={{ fontWeight: 500, fontSize: "0.9375rem", color: OFFWHITE, fontFamily: "Poppins, sans-serif" }}>
                  {video.title}
                </p>
              )}
              {video.client && (
                <p style={{ fontSize: "0.8125rem", color: STEEL, fontFamily: "Poppins, sans-serif", marginTop: "0.15rem" }}>
                  {video.client}
                </p>
              )}
            </div>
          )}

          {/* Video */}
          <div style={{ position: "relative" }}>
            <VideoPlayer
              src={src}
              poster={poster}
              aspectRatio={ar}
              title={video.title}
              client={video.client}
              loop
              autoPlay
              style={{
                border: "1px solid oklch(58% 0.14 240 / 0.2)",
                borderRadius: "12px",
                maxHeight: "calc(85vh - 80px)",
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label={t("admin.cancel")}
              style={{
                position: "absolute",
                top: "-2.5rem",
                right: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: OFFWHITE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.25rem",
                transition: "transform 120ms",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
            >
              <X size={24} weight="bold" color={OFFWHITE} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({
  video,
  onClose,
  onSaved,
}: {
  video: Video;
  onClose: () => void;
  onSaved: (v: Video) => void;
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(video.title ?? "");
  const [client, setClient] = useState(video.client ?? "");
  const [category, setCategory] = useState<VideoCategory>(video.category);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const effectiveAspect: AspectRatio =
    category === "hero" ? video.aspect_ratio : CATEGORY_ASPECT[category];

  const isDirty =
    sanitize(title) !== (video.title ?? "") ||
    sanitize(client) !== (video.client ?? "") ||
    category !== video.category ||
    newFile !== null;

  useEffect(() => {
    lockScroll();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { unlockScroll(); window.removeEventListener("keydown", handler); };
  }, [onClose]);

  function handleFileDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) validateAndSetFile(f);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) validateAndSetFile(f);
  }

  function validateAndSetFile(f: File) {
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError(t("admin.err_format"));
      return;
    }
    if (f.size > MAX_SIZE) {
      setFileError(t("admin.err_size"));
      return;
    }
    setFileError(null);
    setNewFile(f);
  }

  async function handleSave() {
    if (!isDirty) return;
    setSaving(true);
    setSaveError(null);

    let newStoragePath = video.storage_path;
    let newThumbnailPath = video.thumbnail_path;

    try {
      // ── File replacement ────────────────────────────────────────────────────
      if (newFile) {
        const ext = newFile.name.split(".").pop() ?? "mp4";
        const uploadPath = `videos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("videos")
          .upload(uploadPath, newFile, { contentType: newFile.type, upsert: false });

        if (uploadErr) throw new Error(uploadErr.message);

        // Thumbnail
        const thumbBlob = await extractThumbnail(newFile);
        let uploadedThumb: string | null = null;
        if (thumbBlob) {
          const thumbPath = `thumbnails/${Date.now()}.jpg`;
          const { error: thumbErr } = await supabase.storage
            .from("videos")
            .upload(thumbPath, thumbBlob, { contentType: "image/jpeg", upsert: false });
          if (!thumbErr) uploadedThumb = thumbPath;
        }

        newStoragePath = uploadPath;
        newThumbnailPath = uploadedThumb;
      }

      // ── Hero deactivation ───────────────────────────────────────────────────
      if (category === "hero" && (video.category !== "hero" || !video.is_active)) {
        await supabase
          .from("videos")
          .update({ is_active: false })
          .eq("category", "hero")
          .eq("is_active", true)
          .neq("id", video.id);
      }

      // ── DB update ───────────────────────────────────────────────────────────
      const { data, error: updateErr } = await supabase
        .from("videos")
        .update({
          title: sanitize(title) || null,
          client: sanitize(client) || null,
          category,
          aspect_ratio: effectiveAspect,
          storage_path: newStoragePath,
          thumbnail_path: newThumbnailPath,
        })
        .eq("id", video.id)
        .select()
        .single();

      if (updateErr) {
        // Rollback: delete the newly uploaded file to avoid orphan
        if (newFile && newStoragePath !== video.storage_path) {
          await supabase.storage.from("videos").remove([newStoragePath]);
          if (newThumbnailPath && newThumbnailPath !== video.thumbnail_path) {
            await supabase.storage.from("videos").remove([newThumbnailPath]);
          }
        }
        throw new Error(updateErr.message);
      }

      // ── Delete old files ────────────────────────────────────────────────────
      if (newFile && newStoragePath !== video.storage_path) {
        await supabase.storage.from("videos").remove([video.storage_path]);
        if (video.thumbnail_path && newThumbnailPath !== video.thumbnail_path) {
          await supabase.storage.from("videos").remove([video.thumbnail_path]);
        }
      }

      onSaved(data as Video);
      onClose();
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="edit-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          background: "oklch(12% 0.025 240 / 0.85)",
          padding: "1rem",
        }}
      >
        <motion.div
          key="edit-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "480px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "oklch(13% 0.02 240)",
            border: "1px solid oklch(58% 0.14 240 / 0.2)",
            borderRadius: "12px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontWeight: 600, fontSize: "1.0625rem", color: OFFWHITE, fontFamily: "Poppins, sans-serif", margin: 0 }}>
              {t("admin.edit_title")}
            </h2>
            <button
              onClick={onClose}
              aria-label={t("admin.cancel")}
              style={{ background: "none", border: "none", cursor: "pointer", color: STEEL, display: "flex", padding: "0.25rem", transition: "transform 120ms" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
            >
              <X size={20} weight="bold" color={STEEL} />
            </button>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>{t("admin.field_title")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={fieldStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(58% 0.14 240 / 0.2)"; }}
            />
          </div>

          {/* Client */}
          <div>
            <label style={labelStyle}>{t("admin.field_client")}</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              style={fieldStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(58% 0.14 240 / 0.2)"; }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>{t("admin.field_category")}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VideoCategory)}
              style={{ ...fieldStyle, appearance: "none" as const }}
              onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(58% 0.14 240 / 0.2)"; }}
            >
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            {category !== video.category && (
              <p style={{ fontSize: "0.78rem", color: STEEL, marginTop: "0.3rem" }}>
                {t("admin.field_ratio")}: {effectiveAspect}
              </p>
            )}
          </div>

          {/* Replace file */}
          <div>
            <label style={labelStyle}>{t("admin.field_replace_file")}</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleFileDrop}
              style={{
                border: `2px dashed ${dragging ? BLUE : "oklch(58% 0.14 240 / 0.25)"}`,
                borderRadius: "8px",
                padding: "1.25rem 1rem",
                textAlign: "center",
                cursor: "pointer",
                background: dragging ? "oklch(58% 0.14 240 / 0.06)" : "transparent",
                transition: "all 180ms",
              }}
            >
              {newFile ? (
                <p style={{ color: OFFWHITE, fontSize: "0.875rem", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                  {newFile.name}
                </p>
              ) : (
                <p style={{ color: STEEL, fontSize: "0.85rem", fontFamily: "Poppins, sans-serif" }}>
                  {t("admin.field_replace_hint")}
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                style={{ display: "none" }}
                onChange={handleFileInput}
              />
            </div>
            {fileError && (
              <p style={{ fontSize: "0.8rem", color: RED, marginTop: "0.3rem" }}>{fileError}</p>
            )}
          </div>

          {saveError && (
            <p style={{ fontSize: "0.85rem", color: RED }}>{saveError}</p>
          )}

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.625rem", marginTop: "0.5rem" }}>
            <button
              onClick={onClose}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "8px",
                border: "1px solid oklch(58% 0.14 240 / 0.2)",
                background: "transparent",
                color: STEEL,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "border-color 150ms",
              }}
            >
              {t("admin.cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                background: !isDirty || saving ? "oklch(58% 0.14 240 / 0.3)" : BLUE,
                color: OFFWHITE,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: !isDirty || saving ? "not-allowed" : "pointer",
                transition: "background 150ms",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {saving ? t("admin.saving") : t("admin.save_changes")}
              {saving && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, transparent 0%, oklch(80% 0.1 240 / 0.15) 50%, transparent 100%)",
                    animation: "shimmer 1.2s ease-in-out infinite",
                  }}
                />
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ── VideoItem ────────────────────────────────────────────────────────────────
type Props = {
  video: Video;
  onUpdated: (v: Video) => void;
  onDeleted: (id: string) => void;
};

export default function VideoItem({ video, onUpdated, onDeleted }: Props) {
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const thumbUrl = video.thumbnail_path ? getPublicUrl(video.thumbnail_path) : null;
  const label = video.title ?? video.client ?? video.storage_path.split("/").pop() ?? "Sin título";

  async function toggleActive() {
    setToggling(true);
    const next = !video.is_active;

    if (next && video.category === "hero") {
      await supabase
        .from("videos")
        .update({ is_active: false })
        .eq("category", "hero")
        .eq("is_active", true)
        .neq("id", video.id);
    }

    const { data, error } = await supabase
      .from("videos")
      .update({ is_active: next })
      .eq("id", video.id)
      .select()
      .single();

    if (!error && data) onUpdated(data as Video);
    setToggling(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await supabase.storage.from("videos").remove([video.storage_path]);
    if (video.thumbnail_path) {
      await supabase.storage.from("videos").remove([video.thumbnail_path]);
    }
    await supabase.from("videos").delete().eq("id", video.id);
    onDeleted(video.id);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.875rem",
          padding: "0.75rem 1rem",
          borderRadius: "10px",
          border: "1px solid oklch(58% 0.14 240 / 0.12)",
          background: "oklch(14% 0.02 240)",
          opacity: video.is_active ? 1 : 0.5,
          transition: "opacity 200ms",
        }}
      >
        {/* Drag handle */}
        <GripVertical size={16} color={STEEL} style={{ flexShrink: 0, cursor: "grab" }} />

        {/* Thumbnail */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "6px",
            background: "oklch(20% 0.03 240)",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={label}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke={STEEL} strokeWidth="1.5" />
              <path d="M9.5 8.5l5 3.5-5 3.5V8.5z" fill={STEEL} />
            </svg>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: OFFWHITE,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </p>
          <p style={{ fontSize: "0.75rem", color: STEEL, marginTop: "0.15rem" }}>
            {video.client && `${video.client} · `}
            <span
              style={{
                display: "inline-block",
                background: "oklch(58% 0.14 240 / 0.15)",
                border: "1px solid oklch(58% 0.14 240 / 0.3)",
                borderRadius: "4px",
                padding: "0 0.35rem",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: BLUE,
              }}
            >
              {video.aspect_ratio}
            </span>
          </p>
        </div>

        {/* Action icons: eye → pencil → trash */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {/* Eye — preview */}
          <IconBtn onClick={() => setShowPreview(true)} ariaLabel={t("admin.preview")}>
            <Eye size={18} />
          </IconBtn>

          {/* Pencil — edit */}
          <IconBtn onClick={() => setShowEdit(true)} ariaLabel={t("admin.edit")}>
            <PencilSimple size={18} />
          </IconBtn>

          {/* Active toggle (eye/eye-off from lucide) */}
          <button
            onClick={toggleActive}
            disabled={toggling}
            title={video.is_active ? "Desactivar" : "Activar"}
            style={{
              background: "none",
              border: "none",
              cursor: toggling ? "wait" : "pointer",
              color: video.is_active ? BLUE : STEEL,
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              transition: "color 160ms",
              flexShrink: 0,
            }}
          >
            {/* Simple toggle icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {video.is_active ? (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              )}
            </svg>
          </button>

          {/* Trash — delete */}
          {confirmDelete ? (
            <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: "0.3rem 0.625rem",
                  borderRadius: "6px",
                  border: "1px solid oklch(65% 0.18 25 / 0.5)",
                  background: "oklch(65% 0.18 25 / 0.15)",
                  color: "oklch(75% 0.16 25)",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: deleting ? "wait" : "pointer",
                }}
              >
                {deleting ? "…" : t("admin.delete")}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: "0.3rem 0.625rem",
                  borderRadius: "6px",
                  border: "1px solid oklch(58% 0.14 240 / 0.2)",
                  background: "transparent",
                  color: STEEL,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                {t("admin.cancel")}
              </button>
            </div>
          ) : (
            <IconBtn
              onClick={() => setConfirmDelete(true)}
              ariaLabel={t("admin.delete")}
              hoverColor={RED}
            >
              <Trash2 size={18} />
            </IconBtn>
          )}
        </div>
      </div>

      {showPreview && (
        <PreviewModal video={video} onClose={() => setShowPreview(false)} />
      )}
      {showEdit && (
        <EditModal
          video={video}
          onClose={() => setShowEdit(false)}
          onSaved={(v) => { onUpdated(v); }}
        />
      )}

      <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    </>
  );
}
