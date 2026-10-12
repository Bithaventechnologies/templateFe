export interface EmailData {
  to: string;
  name: string;
  subject: string;
  headline: string;
  message: string;
  code: string;
  detail: string;
  btnText: string;
  btnLink: string;
  business: string;
  sender: string;
}

export type ExtraField = "code" | "detail" | "btn";

export interface Template {
  id: string;
  icon: string;
  label: string;
  desc: string;
  tint: string;
  /** Pre-filled values shown when the template is selected */
  defaults: Partial<EmailData>;
  /** Extra inputs this template needs */
  fields: ExtraField[];
  codeLabel?: string;
  detailLabel?: string;
  /** Returns the full email as an HTML string */
  build: (d: EmailData) => string;
}
