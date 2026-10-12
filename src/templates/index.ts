import type { Template } from "../types";
import { br, button, esc, footer, row, shell, sign } from "../lib/html";

export const templates: Template[] = [
  {
    id: "business",
    icon: "💼",
    label: "Business",
    desc: "Formal and clean",
    tint: "#dbe4f0",
    fields: ["btn"],
    defaults: {
      subject: "Following up on our conversation",
      headline: "Following up",
      message:
        "Thank you for taking the time to speak with us. I wanted to follow up and share the next steps we discussed.\n\nPlease let me know a time that suits you for a short call this week.",
    },
    build: (d) =>
      shell(
        "#e9edf2",
        row("background:#1f3a5f;padding:22px 32px;color:#ffffff;font-size:17px;font-weight:bold;letter-spacing:.3px;", esc(d.business || "Your Business")) +
          row("padding:34px 32px 8px;color:#1f3a5f;font-size:24px;font-weight:bold;", esc(d.headline)) +
          row(
            "padding:8px 32px 32px;color:#444;font-size:15px;line-height:24px;",
            `Dear ${esc(d.name || "there")},<br><br>${br(d.message)}${button(d, "#1f3a5f")}${sign(d)}`
          ) +
          footer(d)
      ),
  },
  {
    id: "welcome",
    icon: "👋",
    label: "Welcome",
    desc: "Greet new people",
    tint: "#d7f0e3",
    fields: ["btn"],
    defaults: {
      subject: "Welcome aboard!",
      headline: "Welcome, we're glad you're here",
      message:
        "Your account is ready and everything is set up for you.\n\nIf you need a hand getting started, just reply to this email and we'll help.",
      btnText: "Get started",
    },
    build: (d) =>
      shell(
        "#e4f4ec",
        row(
          "background:#1d9a6c;padding:44px 32px;text-align:center;color:#ffffff;",
          `<div style="font-size:44px;line-height:48px;">👋</div><div style="font-size:26px;font-weight:bold;margin-top:12px;line-height:32px;">${esc(d.headline)}</div>`
        ) +
          row(
            "padding:32px;color:#3d4a44;font-size:15px;line-height:24px;",
            `Hi ${esc(d.name || "there")},<br><br>${br(d.message)}<div style="text-align:center;">${button(d, "#1d9a6c")}</div>${sign(d)}`
          ) +
          footer(d)
      ),
  },
  {
    id: "congrats",
    icon: "🎉",
    label: "Congratulations",
    desc: "Celebrate a win",
    tint: "#f6e6c3",
    fields: [],
    defaults: {
      subject: "Congratulations!",
      headline: "Congratulations!",
      message:
        "We heard your great news and wanted to celebrate with you. Your hard work and dedication have truly paid off.\n\nWishing you continued success ahead.",
    },
    build: (d) =>
      shell(
        "#f3ecf9",
        row(
          "background:#6b3fa0;padding:40px 32px;text-align:center;",
          `<div style="font-size:50px;line-height:54px;">🎉</div><div style="color:#ffd76a;font-size:32px;font-weight:bold;font-family:Georgia,serif;margin-top:10px;">${esc(d.headline)}</div>`
        ) +
          row(
            "padding:34px 40px;text-align:center;color:#4a3a5c;font-size:16px;line-height:26px;font-family:Georgia,serif;",
            `<div style="font-size:18px;font-weight:bold;margin-bottom:14px;">Dear ${esc(d.name || "friend")},</div>${br(d.message)}` +
              `<div style="margin-top:26px;border-top:2px solid #ffd76a;padding-top:18px;font-size:15px;">With warm wishes,<br><b>${esc(d.sender || "Your name")}</b><br>${esc(d.business)}</div>`
          ) +
          footer(d)
      ),
  },
  {
    id: "promo",
    icon: "🏷️",
    label: "Promotional",
    desc: "Offers and discounts",
    tint: "#fbd9d2",
    fields: ["code", "btn"],
    codeLabel: "Promo code",
    defaults: {
      subject: "A special offer just for you",
      headline: "20% off, this week only",
      message:
        "As one of our valued customers, you get early access to our biggest sale of the season.\n\nUse the code below at checkout before the offer ends.",
      btnText: "Shop the sale",
      code: "SAVE20",
    },
    build: (d) =>
      shell(
        "#fdeae6",
        row(
          "background:#e4472b;padding:36px 32px;text-align:center;color:#ffffff;",
          `<div style="font-size:13px;font-weight:bold;letter-spacing:2px;">LIMITED TIME</div><div style="font-size:32px;font-weight:bold;line-height:38px;margin-top:8px;">${esc(d.headline)}</div>`
        ) +
          row(
            "padding:32px;color:#40302d;font-size:15px;line-height:24px;text-align:center;",
            `Hi ${esc(d.name || "there")},<br><br>${br(d.message)}` +
              (d.code
                ? `<div style="margin:24px auto 0;display:inline-block;border:2px dashed #e4472b;border-radius:8px;padding:12px 28px;font-size:24px;font-weight:bold;letter-spacing:4px;color:#e4472b;">${esc(d.code)}</div>`
                : "") +
              `<div>${button(d, "#e4472b")}</div>` +
              `<p style="margin:22px 0 0;font-size:14px;color:#7a6560;">${esc(d.sender)}${d.business ? ", " + esc(d.business) : ""}</p>`
          ) +
          footer(d)
      ),
  },
  {
    id: "announce",
    icon: "📣",
    label: "Announcement",
    desc: "News and updates",
    tint: "#d9e2fb",
    fields: ["detail", "btn"],
    detailLabel: "Date or key detail",
    defaults: {
      subject: "An important update from us",
      headline: "We have news to share",
      message:
        "We're excited to announce a change that will make things better for you.\n\nHere is what's new and what it means for you. Reach out any time if you have questions.",
      btnText: "Read more",
      detail: "Effective: 1 November",
    },
    build: (d) =>
      shell(
        "#e6ebf7",
        row("background:#16213e;padding:20px 32px;color:#8fb0ff;font-size:13px;font-weight:bold;letter-spacing:2px;", "ANNOUNCEMENT") +
          row("background:#16213e;padding:0 32px 34px;color:#ffffff;font-size:28px;font-weight:bold;line-height:34px;", esc(d.headline)) +
          (d.detail ? row("background:#2f5bea;padding:12px 32px;color:#ffffff;font-size:14px;font-weight:bold;", esc(d.detail)) : "") +
          row(
            "padding:30px 32px;color:#3a4152;font-size:15px;line-height:24px;",
            `Hello ${esc(d.name || "there")},<br><br>${br(d.message)}${button(d, "#2f5bea")}${sign(d)}`
          ) +
          footer(d)
      ),
  },
  {
    id: "thanks",
    icon: "💛",
    label: "Thank you",
    desc: "Show appreciation",
    tint: "#fde7c9",
    fields: [],
    defaults: {
      subject: "Thank you",
      headline: "Thank you so much",
      message:
        "We truly appreciate your support. Customers like you are the reason we do what we do.\n\nIt was a pleasure working with you, and we hope to see you again soon.",
    },
    build: (d) =>
      shell(
        "#fdf3e6",
        row("padding:40px 32px 6px;text-align:center;", `<div style="font-size:42px;line-height:46px;">💛</div>`) +
          row("padding:6px 32px 8px;text-align:center;color:#b25e09;font-size:28px;font-weight:bold;font-family:Georgia,serif;", esc(d.headline)) +
          row(
            "padding:12px 40px 34px;text-align:center;color:#5a4636;font-size:16px;line-height:26px;font-family:Georgia,serif;",
            `Dear ${esc(d.name || "friend")},<br><br>${br(d.message)}` +
              `<div style="margin-top:24px;font-size:15px;">Gratefully,<br><b>${esc(d.sender || "Your name")}</b><br>${esc(d.business)}</div>`
          ) +
          footer(d)
      ),
  },
];
