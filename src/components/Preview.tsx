import { useState } from "react";

interface Props {
  to: string;
  subject: string;
  html: string;
  loading: boolean;
  error: string;
}

export default function Preview({ to, subject, html, loading, error }: Props) {
  const [mobile, setMobile] = useState(false);

  const seg = (active: boolean) =>
    `px-3 py-1.5 text-[13px] ${active ? "bg-soft font-semibold text-ink" : "text-muted"}`;

  return (
    <section className="flex min-w-0 flex-col gap-2.5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h2 className="text-[13px] font-semibold text-muted">Preview</h2>
        <div className="inline-flex overflow-hidden rounded-lg border border-line bg-panel" role="group" aria-label="Preview size">
          <button type="button" aria-pressed={!mobile} className={seg(!mobile)} onClick={() => setMobile(false)}>
            Desktop
          </button>
          <button type="button" aria-pressed={mobile} className={seg(mobile)} onClick={() => setMobile(true)}>
            Mobile
          </button>
        </div>
      </div>

      <div className="rounded-[10px] border border-line bg-panel px-3.5 py-3 text-[13px]">
        <div className="flex gap-2 py-0.5">
          <span className="w-14 flex-none text-muted">To</span>
          <b className="break-all font-medium">{to || "recipient@example.com"}</b>
        </div>
        <div className="flex gap-2 py-0.5">
          <span className="w-14 flex-none text-muted">Subject</span>
          <b className="break-words font-medium">{subject || "(no subject)"}</b>
        </div>
      </div>

      <div className="flex min-h-[520px] flex-1 justify-center rounded-[10px] border border-line bg-panel p-3.5">
        {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : loading || !html ? <p className="text-sm text-muted">{loading ? "Loading preview…" : "Preview will appear here."}</p> : (
        <iframe
          title="Email preview"
          srcDoc={html}
          sandbox=""
          className={`min-h-[560px] h-full w-full rounded-md border-0 bg-white transition-[max-width] duration-200 ${
            mobile ? "max-w-[375px]" : "max-w-[640px]"
          }`}
        />
        )}
      </div>
    </section>
  );
}
