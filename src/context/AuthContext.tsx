import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authToken, getApiErrorMessage } from "../lib/api";
import { logout, verifySession } from "../lib/auth";

type AuthContextValue = { status: "checking" | "signedOut" | "signedIn"; error: string; signIn: () => void; signOut: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthContextValue["status"]>("checking");
  const [error, setError] = useState("");
  const signIn = useCallback(() => { setError(""); setStatus("signedIn"); }, []);
  const signOut = useCallback(() => { logout(); setStatus("signedOut"); }, []);

  useEffect(() => {
    const controller = new AbortController();
    const unauthorized = () => { setError("Your session has expired. Please sign in again."); setStatus("signedOut"); };
    window.addEventListener("email-studio:unauthorized", unauthorized);
    if (!authToken.get()) setStatus("signedOut");
    else verifySession(controller.signal).then(() => { if (!controller.signal.aborted) setStatus("signedIn"); }).catch((e: unknown) => {
      if (controller.signal.aborted) return;
      logout(); setError(getApiErrorMessage(e, "Your session has expired. Please sign in again.")); setStatus("signedOut");
    });
    return () => { controller.abort(); window.removeEventListener("email-studio:unauthorized", unauthorized); };
  }, []);
  const value = useMemo(() => ({ status, error, signIn, signOut }), [status, error, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used within AuthProvider"); return value; }
