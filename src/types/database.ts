export type Database = {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string;
          category: "hero" | "ads" | "organic" | "corporate" | "street";
          title: string | null;
          client: string | null;
          storage_path: string;
          thumbnail_path: string | null;
          aspect_ratio: "16:9" | "9:16";
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["videos"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["videos"]["Insert"]>;
      };
    };
  };
};
