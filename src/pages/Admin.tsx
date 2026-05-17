import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAllVideos } from "../hooks/useVideos";
import VideoUpload from "../components/admin/VideoUpload";
import VideoList from "../components/admin/VideoList";
import { useLanguage } from "../hooks/useLanguage";
import type { Video } from "../types/video";

const BLUE = "oklch(58% 0.14 240)";
const OFFWHITE = "oklch(96% 0.005 240)";
const STEEL = "oklch(70% 0.07 230)";
const LANGS = ["es", "en", "ca"] as const;

export default function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { currentLang, setLanguage } = useLanguage();
  const { videos, loading, refetch } = useAllVideos();

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  function handleUploaded(video: Video) {
    refetch();
    void video;
  }

  function handleUpdated(updated: Video) {
    refetch();
    void updated;
  }

  function handleDeleted(id: string) {
    refetch();
    void id;
  }

  return (
    <div
      className="min-h-screen bg-navy"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          borderBottom: "1px solid oklch(58% 0.14 240 / 0.15)",
          background: "oklch(11% 0.02 240 / 0.95)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <h1 style={{ fontWeight: 600, fontSize: "1.375rem", color: OFFWHITE }}>
          Gestor de vídeos
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Language switcher */}
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                style={{
                  padding: "0.3rem 0.625rem",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: currentLang === l ? BLUE : "oklch(58% 0.14 240 / 0.2)",
                  background: currentLang === l ? "oklch(58% 0.14 240 / 0.15)" : "transparent",
                  color: currentLang === l ? OFFWHITE : STEEL,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 150ms",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 0.875rem",
              borderRadius: "8px",
              border: "1px solid oklch(58% 0.14 240 / 0.2)",
              background: "transparent",
              color: STEEL,
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = BLUE;
              (e.currentTarget as HTMLElement).style.color = OFFWHITE;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "oklch(58% 0.14 240 / 0.2)";
              (e.currentTarget as HTMLElement).style.color = STEEL;
            }}
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        <VideoUpload onUploaded={handleUploaded} />

        <h2 style={{ fontWeight: 600, fontSize: "1rem", color: OFFWHITE, marginBottom: "1.25rem" }}>
          Vídeos subidos
        </h2>

        <VideoList
          videos={videos}
          loading={loading}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      </main>
    </div>
  );
}
