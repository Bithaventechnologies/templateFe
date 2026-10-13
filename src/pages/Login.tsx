import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { inputClass } from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../lib/api";
import { login } from "../lib/auth";
export default function Login() {
  const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const { signIn, error: sessionError } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (busy) return; if (!password.trim()) { setError("Enter the owner password to continue."); return; } setBusy(true); setError(""); try { await login(password); setPassword(""); signIn(); const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname; navigate(from && from !== "/login" ? from : "/dashboard", { replace: true }); } catch (err) { setError(getApiErrorMessage(err, "Sign in failed. Check the password and try again.")); } finally { setBusy(false); } }
  return <main className="grid min-h-screen place-items-center bg-page p-5"><form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-line bg-panel p-6"><h1 className="text-xl font-bold">Email Studio</h1><p className="mt-1 text-sm text-muted">Sign in with your owner password.</p><label htmlFor="owner-password" className="mb-1.5 mt-5 block text-[13px] font-semibold">Owner password</label><input id="owner-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className={inputClass} disabled={busy} />{(error || sessionError) && <p role="alert" className="mt-3 text-sm text-red-600">{error || sessionError}</p>}<button type="submit" disabled={busy} className="mt-4 w-full rounded-lg border border-brand bg-brand px-4 py-2.5 font-semibold text-brand-ink disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button></form></main>;
}
