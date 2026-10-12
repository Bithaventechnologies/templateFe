import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { EmailData, Template } from "./types";
import { templates } from "./templates";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { copyText } from "./lib/send";
import TemplateList from "./components/TemplateList";
import EmailForm from "./components/EmailForm";
import Preview from "./components/Preview";
import { inputClass } from "./components/Field";
import { authToken, getApiErrorMessage } from "./lib/api";
import { login, logout, verifySession } from "./lib/auth";
import { getEmailTemplates, previewEmail, sendEmail, type EmailTemplateDefinition, type EmailValues } from "./lib/emails";

type FormState = Omit<EmailData, "business" | "sender">;
const blank: FormState = { to: "", name: "", subject: "", headline: "", message: "", code: "", detail: "", btnText: "", btnLink: "" };

function formFor(template: Template, keep?: FormState): FormState {
  return { ...blank, ...template.defaults, to: keep?.to ?? "", name: keep?.name ?? "" };
}

function templateIdOf(definition: EmailTemplateDefinition): string | undefined {
  return definition.id ?? definition.templateId ?? definition.slug;
}

function emailValues(values: FormState, template: Template): EmailValues {
  return {
    name: values.name,
    headline: values.headline,
    message: values.message,
    ...(template.fields.includes("code") ? { code: values.code } : {}),
    ...(template.fields.includes("detail") ? { detail: values.detail } : {}),
    ...(template.fields.includes("btn") ? { btnText: values.btnText, btnLink: values.btnLink } : {}),
  };
}

export default function App() {
  const [template, setTemplate] = useState<Template>(templates[0]);
  const [form, setForm] = useState<FormState>(() => formFor(templates[0]));
  const [business, setBusiness] = useLocalStorage("es_business");
  const [sender, setSender] = useLocalStorage("es_sender");
  const [toast, setToast] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useState<"checking" | "signedOut" | "signedIn">("checking");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  const [templatesError, setTemplatesError] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);
  const data: EmailData = { ...form, business, sender };
  const html = useMemo(() => template.build(data), [template, form, business, sender]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setAvailableTemplates([]);
      setPreviewHtml("");
      setAuthState("signedOut");
      setLoginError("Your session has expired. Please sign in again.");
    };
    window.addEventListener("email-studio:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("email-studio:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (!authToken.get()) {
      setAuthState("signedOut");
      return () => controller.abort();
    }
    verifySession(controller.signal)
      .then(() => setAuthState("signedIn"))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        logout();
        setAuthState("signedOut");
        setLoginError(getApiErrorMessage(error, "Your session has expired. Please sign in again."));
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (authState !== "signedIn") return;
    const controller = new AbortController();
    getEmailTemplates(controller.signal)
      .then((definitions) => {
        const ids = new Set(definitions.map(templateIdOf).filter((id): id is string => Boolean(id)));
        const matched = templates.filter((item) => ids.has(item.id));
        setAvailableTemplates(matched);
        if (matched.length) {
          const selected = matched.find((item) => item.id === template.id) ?? matched[0];
          setTemplate(selected);
          setForm((current) => formFor(selected, current));
        }
        setTemplatesError(matched.length ? "" : "No compatible email templates are available.");
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setTemplatesError(getApiErrorMessage(error, "Couldn't load email templates."));
      });
    return () => controller.abort();
  }, [authState]);

  useEffect(() => {
    if (authState !== "signedIn" || !availableTemplates.some((item) => item.id === template.id)) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setPreviewLoading(true);
      setPreviewError("");
      previewEmail(template.id, form.subject, emailValues(form, template), controller.signal)
        .then((result) => setPreviewHtml(result.html))
        .catch((error: unknown) => {
          if (!controller.signal.aborted) setPreviewError(getApiErrorMessage(error, "Couldn't render this email preview."));
        })
        .finally(() => {
          if (!controller.signal.aborted) setPreviewLoading(false);
        });
    }, 300);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [authState, availableTemplates, template, form]);

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3500);
  }

  function selectTemplate(next: Template) {
    setTemplate(next);
    setForm((previous) => formFor(next, previous));
  }

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
      setAuthState("signedIn");
    } catch (error) {
      setLoginError(getApiErrorMessage(error, "Sign in failed. Check the password and try again."));
    } finally {
      setBusy(false);
    }
  }

  async function handleSend() {
    if (busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.to.trim())) {
      showToast("Enter a valid recipient email first.");
      document.getElementById("to")?.focus();
      return;
    }
    if (!form.headline.trim() || !form.message.trim()) {
      showToast("Enter a headline and message first.");
      return;
    }
    setBusy(true);
    try {
      const result = await sendEmail(form.to.trim(), template.id, form.subject, emailValues(form, template));
      showToast(result.success ? (result.message || "Email accepted by the provider.") : (result.message || "Email could not be sent."));
    } catch (error) {
      showToast(getApiErrorMessage(error, "Email could not be sent."));
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    const ok = await copyText(previewHtml || html);
    showToast(ok ? "HTML copied. Paste it into your email tool." : "Couldn't copy. Try again.");
  }

  if (authState === "checking") return <main className="grid min-h-screen place-items-center">Checking your session…</main>;

  if (authState === "signedOut") {
    return (
      <main className="grid min-h-screen place-items-center bg-page p-5">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-xl border border-line bg-panel p-6">
          <h1 className="text-xl font-bold">Email Studio</h1>
          <p className="mt-1 text-sm text-muted">Sign in with your owner password.</p>
          <label htmlFor="owner-password" className="mb-1.5 mt-5 block text-[13px] font-semibold">Owner password</label>
          <input id="owner-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
          {loginError && <p role="alert" className="mt-3 text-sm text-red-600">{loginError}</p>}
          <button type="submit" disabled={busy} className="mt-4 w-full rounded-lg border border-brand bg-brand px-4 py-2.5 font-semibold text-brand-ink disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
      </main>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[230px_1fr] lg:grid-cols-[250px_minmax(300px,380px)_1fr]">
      <aside className="flex flex-col gap-4 border-b border-line bg-panel p-5 md:border-b-0 md:border-r">
        <div className="text-lg font-bold tracking-tight">
          Email Studio
          <small className="mt-0.5 block text-[13px] font-normal text-muted">Pick a template, fill it in, send.</small>
        </div>
        {templatesError ? <p role="alert" className="text-sm text-red-600">{templatesError}</p> : <TemplateList templates={availableTemplates} selectedId={template.id} onSelect={selectTemplate} />}
        <div className="mt-auto flex flex-col gap-2 border-t border-line pt-3.5">
          <h2 className="text-[13px] font-semibold text-muted">Your details</h2>
          <input value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="Business name" aria-label="Business name" className={inputClass} />
          <input value={sender} onChange={(event) => setSender(event.target.value)} placeholder="Your name" aria-label="Your name" className={inputClass} />
          <button type="button" onClick={() => { logout(); setAuthState("signedOut"); setAvailableTemplates([]); setPreviewHtml(""); }} className="self-start text-xs text-muted underline">Sign out</button>
        </div>
      </aside>
      <EmailForm template={template} data={data} onChange={(patch) => setForm((current) => ({ ...current, ...patch }))} onSend={handleSend} onCopy={handleCopy} busy={busy} />
      <div className="md:col-span-2 md:border-t md:border-line lg:col-span-1 lg:border-t-0">
        <Preview to={form.to} subject={form.subject} html={previewHtml} loading={previewLoading} error={previewError} />
      </div>
      <div role="status" className={`pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-ink px-4 py-2.5 text-sm text-page transition-opacity ${toast ? "opacity-100" : "opacity-0"}`}>{toast}</div>
    </div>
  );
}
