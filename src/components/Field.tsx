import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-line bg-field px-3 py-2 text-ink placeholder:text-muted/70 focus:outline-2 focus:outline-brand";

interface Props {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

export default function Field({ label, htmlFor, children }: Props) {
  return (
    <div className="mt-3">
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}
