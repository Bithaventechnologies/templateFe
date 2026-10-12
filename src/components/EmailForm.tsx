import type { EmailData, Template } from "../types";
import Field, { inputClass } from "./Field";

interface Props {
  template: Template;
  data: EmailData;
  onChange: (patch: Partial<EmailData>) => void;
  onSend: () => void;
  onCopy: () => void;
  busy: boolean;
}

export default function EmailForm({ template, data, onChange, onSend, onCopy, busy }: Props) {
  const bind = (key: keyof EmailData) => ({
    id: key,
    value: data[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ [key]: e.target.value }),
  });

  return (
    <section className="border-line bg-panel p-5 lg:border-r">
      <h1 className="mb-1 text-xl font-bold tracking-tight">{template.label} email</h1>
      <p className="mb-4 text-sm text-muted">{template.desc}. Fill in the details and check the preview.</p>

      <Field label="Recipient email" htmlFor="to">
        <input {...bind("to")} type="email" placeholder="name@example.com" className={inputClass} />
      </Field>
      <Field label="Recipient name" htmlFor="name">
        <input {...bind("name")} placeholder="e.g. Amaka" className={inputClass} />
      </Field>
      <Field label="Subject" htmlFor="subject">
        <input {...bind("subject")} className={inputClass} />
      </Field>
      <Field label="Headline" htmlFor="headline">
        <input {...bind("headline")} className={inputClass} />
      </Field>
      <Field label="Message" htmlFor="message">
        <textarea {...bind("message")} className={`${inputClass} min-h-32 resize-y`} />
      </Field>

      {template.fields.includes("code") && (
        <Field label={template.codeLabel ?? "Code"} htmlFor="code">
          <input {...bind("code")} className={inputClass} />
        </Field>
      )}
      {template.fields.includes("detail") && (
        <Field label={template.detailLabel ?? "Detail"} htmlFor="detail">
          <input {...bind("detail")} className={inputClass} />
        </Field>
      )}
      {template.fields.includes("btn") && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field label="Button text" htmlFor="btnText">
            <input {...bind("btnText")} placeholder="Leave empty for no button" className={inputClass} />
          </Field>
          <Field label="Button link" htmlFor="btnLink">
            <input {...bind("btnLink")} placeholder="https://" className={inputClass} />
          </Field>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSend}
          disabled={busy}
          className="flex-1 rounded-lg border border-brand bg-brand px-4 py-2.5 font-semibold text-brand-ink hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send email"}
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg border border-line bg-panel px-4 py-2.5 font-semibold hover:brightness-95"
        >
          Copy HTML
        </button>
      </div>
    </section>
  );
}
