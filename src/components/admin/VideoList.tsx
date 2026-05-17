import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import VideoItem from "./VideoItem";
import type { Video, VideoCategory } from "../../types/video";

const OFFWHITE = "oklch(96% 0.005 240)";
const STEEL = "oklch(70% 0.07 230)";

const CATEGORY_LABELS: Record<VideoCategory, string> = {
  hero: "Hero",
  ads: "Ads",
  organic: "Orgánico",
  corporate: "Corporativo",
  street: "Street content",
};

const CATEGORY_ORDER: VideoCategory[] = ["hero", "ads", "organic", "corporate", "street"];

type Props = {
  videos: Video[];
  loading: boolean;
  onUpdated: (v: Video) => void;
  onDeleted: (id: string) => void;
};

export default function VideoList({ videos, loading, onUpdated, onDeleted }: Props) {
  const [collapsed, setCollapsed] = useState<Set<VideoCategory>>(new Set());

  function toggleCollapse(cat: VideoCategory) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: "64px",
              borderRadius: "10px",
              background: "oklch(16% 0.02 240)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    );
  }

  const grouped = CATEGORY_ORDER.reduce<Record<VideoCategory, Video[]>>(
    (acc, cat) => {
      acc[cat] = videos.filter((v) => v.category === cat);
      return acc;
    },
    { hero: [], ads: [], organic: [], corporate: [], street: [] }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {CATEGORY_ORDER.map((cat) => {
        const items = grouped[cat];
        const isCollapsed = collapsed.has(cat);

        return (
          <div key={cat}>
            <button
              onClick={() => toggleCollapse(cat)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 0 0.75rem",
                width: "100%",
                textAlign: "left",
              }}
            >
              {isCollapsed
                ? <ChevronRight size={16} color={STEEL} />
                : <ChevronDown size={16} color={STEEL} />}
              <span style={{ fontWeight: 600, fontSize: "0.9rem", color: OFFWHITE }}>
                {CATEGORY_LABELS[cat]}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: STEEL,
                  background: "oklch(58% 0.14 240 / 0.1)",
                  border: "1px solid oklch(58% 0.14 240 / 0.2)",
                  borderRadius: "999px",
                  padding: "0 0.5rem",
                  lineHeight: "1.6",
                }}
              >
                {items.length}
              </span>
            </button>

            {!isCollapsed && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {items.length === 0 ? (
                  <p style={{ fontSize: "0.825rem", color: STEEL, padding: "0.5rem 0" }}>
                    Sin vídeos en esta categoría.
                  </p>
                ) : (
                  items.map((v) => (
                    <VideoItem
                      key={v.id}
                      video={v}
                      onUpdated={onUpdated}
                      onDeleted={onDeleted}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
