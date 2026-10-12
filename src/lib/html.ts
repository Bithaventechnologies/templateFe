import type { EmailData } from "../types";

/** Escape user input so it is safe inside HTML */
export function esc(s: string | undefined): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[c];
  });
}

/** Escape and keep line breaks */
export function br(s: string): string {
  return esc(s).replace(/\n/g, "<br>");
}

/** Outer email wrapper. Email clients need tables and inline styles. */
export function shell(bg: string, inner: string): string {
  return (
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>` +
    `<body style="margin:0;padding:0;background:${bg};font-family:Arial,Helvetica,sans-serif;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:24px 12px;"><tr><td align="center">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;">` +
    inner +
    `</table></td></tr></table></body></html>`
  );
}

export function row(style: string, content: string): string {
  return `<tr><td style="${style}">${content}</td></tr>`;
}

export function button(d: EmailData, color: string): string {
  if (!d.btnText) return "";
  const href = d.btnLink ? esc(d.btnLink) : "#";
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px;"><tr><td style="background:${color};border-radius:6px;">` +
    `<a href="${href}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">${esc(d.btnText)}</a></td></tr></table>`
  );
}

export function footer(d: EmailData): string {
  return row(
    "padding:18px 32px;background:#f5f6f8;color:#8a93a0;font-size:12px;line-height:18px;text-align:center;",
    `${esc(d.business || "Your Business")}<br>You received this email because you are connected with us.`
  );
}

export function sign(d: EmailData): string {
  return (
    `<p style="margin:26px 0 0;color:#444;font-size:15px;line-height:22px;">Best regards,<br>` +
    `<b>${esc(d.sender || "Your name")}</b><br>${esc(d.business)}</p>`
  );
}
