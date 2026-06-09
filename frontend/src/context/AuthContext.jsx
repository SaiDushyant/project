import { createContext, useContext, useEffect, useRef, useState } from "react";
import supabase from "../lib/supabase";

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const onLoginRef = useRef(null);

  const fetchRole = async (userId, userEmail) => {
    if (!userId) { setRole(null); return; }

    // Fast path: email in VITE_ADMIN_EMAILS
    if (ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(userEmail?.toLowerCase())) {
      setRole("admin");
      return;
    }

    // DB path: graceful fallback if table doesn't exist
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      setRole(data?.role || "user");
    } catch {
      setRole("user");
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      await fetchRole(u?.id ?? null, u?.email ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      fetchRole(newUser?.id ?? null, newUser?.email ?? null);
      if (event === "SIGNED_IN" && newUser && onLoginRef.current) {
        onLoginRef.current(newUser);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password });

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

  const signOut = () => supabase.auth.signOut();

  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

  const updatePassword = (newPassword) =>
    supabase.auth.updateUser({ password: newPassword });

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, loading, signUp, signIn, signInWithGoogle, signOut, onLoginRef, getToken, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
