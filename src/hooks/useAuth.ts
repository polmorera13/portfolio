import { useState } from "react";
import { login as apiLogin, getToken, clearToken } from "../lib/api";

export function useAuth() {
  const [authed, setAuthed] = useState<boolean>(!!getToken());

  async function signIn(_username: string, password: string): Promise<string | null> {
    const ok = await apiLogin(password);
    if (ok) {
      setAuthed(true);
      return null;
    }
    return "Usuario o contraseña incorrectos.";
  }

  function signOut() {
    clearToken();
    setAuthed(false);
  }

  return { authed, loading: false, signIn, signOut };
}
