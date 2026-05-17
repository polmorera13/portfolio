import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { mapUsernameToEmail } from "../lib/auth";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signIn(username: string, password: string): Promise<string | null> {
    const email = mapUsernameToEmail(username);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? "Usuario o contraseña incorrectos." : null;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { session, loading, signIn, signOut };
}
