
import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../lib/auth";
import { getApiErrorMessage } from "../lib/api";
import { inputClass } from "../components/Field";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password.trim()) {
      setLoginError("Enter the owner password to continue.");
      return;
    }

    setBusy(true);
    setLoginError("");

    try {
      await login(password);

      setPassword("");
      onLoginSuccess();
    } catch (error: unknown) {
      setLoginError(
        getApiErrorMessage(
          error,
          "Sign in failed. Check the password and try again."
        )
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-page p-5">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-xl border border-line bg-panel p-6"
      >
        <h1 className="text-xl font-bold">Email Studio</h1>

        <p className="mt-1 text-sm text-muted">
          Sign in with your owner password.
        </p>

        <label
          htmlFor="owner-password"
          className="mb-1.5 mt-5 block text-[13px] font-semibold"
        >
          Owner password
        </label>

        <input
          id="owner-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
          placeholder="Enter your password"
          disabled={busy}
        />

        {loginError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {loginError}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-lg border border-brand bg-brand px-4 py-2.5 font-semibold text-brand-ink disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
};

export default Login;
