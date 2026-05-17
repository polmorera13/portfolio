import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const BLUE = "oklch(58% 0.14 240)";
const OFFWHITE = "oklch(96% 0.005 240)";
const STEEL = "oklch(70% 0.07 230)";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrorMsg(null);
    const err = await signIn(username, password);
    if (err) {
      setErrorMsg(err);
      setPending(false);
    } else {
      navigate("/admin", { replace: true });
    }
  }

  return (
    <div
      className="min-h-screen bg-navy flex items-center justify-center px-4"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2.5rem",
          border: "1px solid oklch(58% 0.14 240 / 0.2)",
          borderRadius: "12px",
          background: "oklch(13% 0.02 240 / 0.9)",
        }}
      >
        {/* Logo area */}
        <div className="flex justify-center mb-8">
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              background: "oklch(58% 0.14 240 / 0.15)",
              border: "1px solid oklch(58% 0.14 240 / 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 17l10 5 10-5" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 12l10 5 10-5" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1
          style={{
            fontWeight: 600,
            fontSize: "1.25rem",
            color: OFFWHITE,
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          Acceso restringido
        </h1>
        <p
          style={{
            fontWeight: 400,
            fontSize: "0.875rem",
            color: STEEL,
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Panel de administración
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: STEEL,
                marginBottom: "0.5rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid oklch(58% 0.14 240 / 0.25)",
                background: "oklch(16% 0.02 240)",
                color: OFFWHITE,
                fontSize: "0.9375rem",
                fontFamily: "Poppins, sans-serif",
                outline: "none",
                transition: "border-color 160ms",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(58% 0.14 240 / 0.25)"; }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: STEEL,
                marginBottom: "0.5rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid oklch(58% 0.14 240 / 0.25)",
                background: "oklch(16% 0.02 240)",
                color: OFFWHITE,
                fontSize: "0.9375rem",
                fontFamily: "Poppins, sans-serif",
                outline: "none",
                transition: "border-color 160ms",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(58% 0.14 240 / 0.25)"; }}
            />
          </div>

          {/* Error */}
          {errorMsg && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "oklch(65% 0.18 25)",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {errorMsg}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            style={{
              width: "100%",
              padding: "0.875rem",
              borderRadius: "8px",
              border: "none",
              background: pending ? "oklch(58% 0.14 240 / 0.5)" : BLUE,
              color: OFFWHITE,
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: pending ? "not-allowed" : "pointer",
              transition: "background 160ms, transform 160ms",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => { if (!pending) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
          >
            {pending ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: OFFWHITE,
                    display: "inline-block",
                    animation: "spin 0.6s linear infinite",
                  }}
                />
                Entrando…
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
