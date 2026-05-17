import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";
import { supabase, getPublicUrl } from "../../lib/supabase";
import type { Video, VideoCategory, AspectRatio } from "../../types/video";

const BLUE = "oklch(58% 0.14 240)";
const OFFWHITE = "oklch(96% 0.005 240)";
const STEEL = "oklch(70% 0.07 230)";

const CATEGORY_LABELS: Record<VideoCategory, string> = {
  hero: "Hero (imagen)",
  ads: "Ads",
  organic: "Orgánico",
  corporate: "Corporativo",
  street: "Street content",
};

const CATEGORY_ASPECT: Partial<Record<VideoCategory, AspectRatio>> = {
  ads: "9:16",
  organic: "9:16",
  street: "9:16",
  corporate: "16:9",
};

const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_VIDEO = 100 * 1024 * 1024;
const MAX_IMAGE = 5 * 1024 * 1024;

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

async function extractThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 0.5;
    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); resolve(null); return; }
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => { URL.revokeObjectURL(url); resolve(blob); }, "image/jpeg", 0.85);
    });
    video.addEventListener("error", () => { URL.revokeObjectURL(url); resolve(null); });
    video.load();
  });
}

type Props = { onUploaded: (video: Video) => void };

export default function VideoUpload({ onUploaded }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState<VideoCategory>("ads");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [heroSlot, setHeroSlot] = useState<number>(1);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isHero = category === "hero";
  const effectiveAspect: AspectRatio = isHero ? "9:16" : (CATEGORY_ASPECT[category] ?? "16:9");
  const acceptAttr = isHero
    ? "image/jpeg,image/png,image/webp"
    : "video/mp4,video/quicktime,video/webm";

  function validateFile(f: File): string | null {
    if (isHero) {
      if (!IMAGE_TYPES.includes(f.type)) return "Formato no permitido. Usa JPG, PNG o WebP.";
      if (f.size > MAX_IMAGE) return "La imagen supera el límite de 5MB.";
    } else {
      if (!VIDEO_TYPES.includes(f.type)) return "Formato no permitido. Usa MP4, MOV o WebM.";
      if (f.size > MAX_VIDEO) return "El archivo supera el límite de 100MB.";
    }
    return null;
  }

  function handleFileChosen(f: File) {
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError(null);
    setFile(f);
    setSuccess(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileChosen(f);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFileChosen(f);
  }

  function handleCategoryChange(cat: VideoCategory) {
    setCategory(cat);
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!file) return;
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      if (isHero) {
        // ── Hero image upload ─────────────────────────────────────────────
        const ext = file.name.split(".").pop() ?? "jpg";
        const storagePath = `hero/${Date.now()}_slot${heroSlot}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("videos")
          .upload(storagePath, file, { contentType: file.type, upsert: false });
        if (uploadErr) throw new Error(uploadErr.message);
        setProgress(70);

        // Deactivate existing hero image at same slot
        await supabase
          .from("videos")
          .update({ is_active: false })
          .eq("category", "hero")
          .eq("slot", heroSlot)
          .eq("media_type", "image");

        setProgress(85);

        const { data, error: insertErr } = await supabase
          .from("videos")
          .insert({
            category: "hero",
            title: sanitize(title) || null,
            client: sanitize(client) || null,
            storage_path: storagePath,
            thumbnail_path: null,
            aspect_ratio: "9:16",
            display_order: heroSlot,
            is_active: true,
            slot: heroSlot,
            media_type: "image",
          })
          .select()
          .single();

        if (insertErr) throw new Error(insertErr.message);
        setProgress(100);
        onUploaded(data as Video);
      } else {
        // ── Video upload ──────────────────────────────────────────────────
        const ext = file.name.split(".").pop() ?? "mp4";
        const storagePath = `videos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("videos")
          .upload(storagePath, file, { contentType: file.type, upsert: false });
        if (uploadErr) throw new Error(uploadErr.message);
        setProgress(70);

        let thumbnailPath: string | null = null;
        const thumbBlob = await extractThumbnail(file);
        if (thumbBlob) {
          const thumbPath = `thumbnails/${Date.now()}.jpg`;
          const { error: thumbErr } = await supabase.storage
            .from("videos")
            .upload(thumbPath, thumbBlob, { contentType: "image/jpeg", upsert: false });
          if (!thumbErr) thumbnailPath = thumbPath;
        }
        setProgress(85);

        const { data, error: insertErr } = await supabase
          .from("videos")
          .insert({
            category,
            title: sanitize(title) || null,
            client: sanitize(client) || null,
            storage_path: storagePath,
            thumbnail_path: thumbnailPath,
            aspect_ratio: effectiveAspect,
            display_order: 0,
            is_active: true,
            slot: null,
            media_type: "video",
          })
          .select()
          .single();

        if (insertErr) throw new Error(insertErr.message);
        setProgress(100);
        onUploaded(data as Video);
      }

      setSuccess(true);
      setFile(null);
      setTitle("");
      setClient("");
      setCategory("ads");
      setAspectRatio("16:9");
      setHeroSlot(1);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

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
    textTransform: "uppercase",
    marginBottom: "0.4rem",
  };

  return (
    <div
      style={{
        background: "oklch(13% 0.02 240 / 0.8)",
        border: "1px solid oklch(58% 0.14 240 / 0.15)",
        borderRadius: "12px",
        padding: "1.75rem",
        marginBottom: "2rem",
      }}
    >
      <h2 style={{ fontWeight: 600, fontSize: "1rem", color: OFFWHITE, marginBottom: "1.25rem" }}>
        {isHero ? "Subir imagen hero" : "Subir vídeo"}
      </h2>

      {/* Category (first, since it changes accept type) */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle}>Categoría</label>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value as VideoCategory)}
          style={{ ...fieldStyle, appearance: "none" as const }}
          onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(58% 0.14 240 / 0.2)"; }}
        >
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Hero-specific: slot selector */}
      {isHero && (
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Posición (slot 1–7)</label>
          <select
            value={heroSlot}
            onChange={(e) => setHeroSlot(Number(e.target.value))}
            style={{ ...fieldStyle, appearance: "none" as const }}
            onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(58% 0.14 240 / 0.2)"; }}
          >
            {[1,2,3,4,5,6,7].map((n) => (
              <option key={n} value={n}>Posición {n}</option>
            ))}
          </select>
          <p style={{ fontSize: "0.75rem", color: STEEL, marginTop: "0.3rem" }}>
            Dimensión recomendada: 1080 × 1350 px (4:5)
          </p>
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? BLUE : "oklch(58% 0.14 240 / 0.3)"}`,
          borderRadius: "10px",
          padding: "2rem 1rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "oklch(58% 0.14 240 / 0.06)" : "transparent",
          transition: "all 180ms",
          marginBottom: "1.25rem",
        }}
      >
        <UploadCloud size={32} color={BLUE} style={{ margin: "0 auto 0.75rem" }} />
        {file ? (
          <p style={{ color: OFFWHITE, fontSize: "0.9rem", fontWeight: 600 }}>{file.name}</p>
        ) : (
          <>
            <p style={{ color: OFFWHITE, fontSize: "0.9rem", fontWeight: 600 }}>
              {isHero ? "Arrastra una imagen aquí" : "Arrastra un vídeo aquí"}
            </p>
            <p style={{ color: STEEL, fontSize: "0.8rem", marginTop: "0.25rem" }}>
              {isHero ? "JPG · PNG · WebP — máx. 5MB" : "MP4 · MOV · WebM — máx. 100MB"}
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          style={{ display: "none" }}
          onChange={onInputChange}
        />
      </div>

      {/* Title + client */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={labelStyle}>Título (opcional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isHero ? "Ej. Foto campaña verano" : "Ej. Reel Revolut 2025"}
            style={fieldStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(58% 0.14 240 / 0.2)"; }}
          />
        </div>
        <div>
          <label style={labelStyle}>Cliente (opcional)</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Ej. Revolut"
            style={fieldStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(58% 0.14 240 / 0.2)"; }}
          />
        </div>
      </div>

      {/* Aspect ratio (only for non-hero videos) */}
      {!isHero && (
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Proporción</label>
          {category !== "hero" ? (
            <div
              style={{
                padding: "0.625rem 0.875rem",
                borderRadius: "8px",
                border: "1px solid oklch(58% 0.14 240 / 0.1)",
                background: "oklch(14% 0.02 240)",
                color: STEEL,
                fontSize: "0.9rem",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {effectiveAspect} <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>(fijo)</span>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["16:9", "9:16"] as AspectRatio[]).map((ar) => (
                <button
                  key={ar}
                  type="button"
                  onClick={() => setAspectRatio(ar)}
                  style={{
                    flex: 1,
                    padding: "0.625rem",
                    borderRadius: "8px",
                    border: `1px solid ${aspectRatio === ar ? BLUE : "oklch(58% 0.14 240 / 0.2)"}`,
                    background: aspectRatio === ar ? "oklch(58% 0.14 240 / 0.15)" : "oklch(16% 0.02 240)",
                    color: aspectRatio === ar ? OFFWHITE : STEEL,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 150ms",
                  }}
                >
                  {ar}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress */}
      {uploading && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ height: "4px", background: "oklch(58% 0.14 240 / 0.15)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: BLUE, borderRadius: "2px", transition: "width 300ms ease" }} />
          </div>
          <p style={{ fontSize: "0.8rem", color: STEEL, marginTop: "0.35rem" }}>Subiendo… {progress}%</p>
        </div>
      )}

      {error && (
        <p style={{ fontSize: "0.85rem", color: "oklch(65% 0.18 25)", marginBottom: "1rem" }}>{error}</p>
      )}

      {success && (
        <p style={{ fontSize: "0.85rem", color: "oklch(70% 0.16 145)", marginBottom: "1rem" }}>
          {isHero ? "Imagen subida correctamente." : "Vídeo subido correctamente."}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || uploading}
        style={{
          padding: "0.75rem 2rem",
          borderRadius: "8px",
          border: "none",
          background: !file || uploading ? "oklch(58% 0.14 240 / 0.3)" : BLUE,
          color: OFFWHITE,
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "0.9375rem",
          cursor: !file || uploading ? "not-allowed" : "pointer",
          transition: "all 160ms",
        }}
        onMouseEnter={(e) => { if (file && !uploading) e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
      >
        {uploading ? "Subiendo…" : isHero ? "Subir imagen" : "Subir vídeo"}
      </button>
    </div>
  );
}
