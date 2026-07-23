import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authed } = useAuth();

  if (!authed) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
