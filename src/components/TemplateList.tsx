import type { Template } from "../types";

interface Props {
  templates: Template[];
  selectedId: string;
  onSelect: (t: Template) => void;
}

export default function TemplateList({ templates, selectedId, onSelect }: Props) {
  return (
    <div>
      <h2 className="mb-2 text-[13px] font-semibold text-muted">Choose a template</h2>
      <div className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
        {templates.map((t) => {
          const active = t.id === selectedId;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(t)}
              className={`flex flex-none items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-brand md:w-full ${
                active ? "border-brand bg-soft" : "border-transparent hover:bg-field"
              }`}
            >
              <span
                className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[7px] text-base"
                style={{ background: t.tint }}
              >
                {t.icon}
              </span>
              <span>
                <b className="block text-sm font-semibold">{t.label}</b>
                <span className="hidden text-xs text-muted md:block">{t.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
