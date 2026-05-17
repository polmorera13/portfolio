export type VideoCategory = "hero" | "ads" | "organic" | "corporate" | "street";
export type AspectRatio = "16:9" | "9:16";
export type MediaType = "video" | "image";

export type Video = {
  id: string;
  category: VideoCategory;
  title: string | null;
  client: string | null;
  storage_path: string;
  thumbnail_path: string | null;
  aspect_ratio: AspectRatio;
  display_order: number;
  is_active: boolean;
  created_at: string;
  slot: number | null;
  media_type: MediaType;
};
