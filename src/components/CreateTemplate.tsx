
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, getApiErrorMessage } from "../lib/api";

type TemplateField = "code" | "detail" | "btn";

interface CreateTemplatePayload {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  fields: TemplateField[];
  defaults: {
    subject: string;
    headline: string;
    message: string;
    btnText: string;
    btnLink: string;
    code: string;
    detail: string;
  };
  isActive: boolean;
}

const initialForm: CreateTemplatePayload = {
  slug: "",
  name: "",
  description: "",
  category: "general",
  icon: "✉️",
  fields: [],
  defaults: {
    subject: "",
    headline: "",
    message: "",
    btnText: "",
    btnLink: "",
    code: "",
    detail: "",
  },
  isActive: true,
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700";

const categories = [
  { value: "general", label: "General" },
  { value: "welcome", label: "Welcome" },
  { value: "business", label: "Business" },
  { value: "promotional", label: "Promotional" },
  { value: "announcement", label: "Announcement" },
  { value: "transactional", label: "Transactional" },
];

function generateSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

const CreateTemplate = () => {
  const navigate = useNavigate();

  const [form, setForm] =
    useState<CreateTemplatePayload>(initialForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (
    field: "slug" | "name" | "description" | "category" | "icon",
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateDefault = (
    field: keyof CreateTemplatePayload["defaults"],
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      defaults: {
        ...previous.defaults,
        [field]: value,
      },
    }));
  };

  const toggleTemplateField = (field: TemplateField) => {
    setForm((previous) => {
      const enabled = previous.fields.includes(field);

      return {
        ...previous,
        fields: enabled
          ? previous.fields.filter((item) => item !== field)
          : [...previous.fields, field],
      };
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const slug = generateSlug(form.slug || form.name);

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      !form.defaults.subject.trim() ||
      !form.defaults.headline.trim() ||
      !form.defaults.message.trim()
    ) {
      setError(
        "Please complete the template name, category, subject, headline, and message."
      );
      return;
    }

    if (slug.length < 2 || slug.length > 40) {
      setError(
        "The template slug must be between 2 and 40 characters."
      );
      return;
    }

    if (
      form.defaults.btnLink.trim() &&
      !/^https?:\/\/\S+$/i.test(form.defaults.btnLink.trim())
    ) {
      setError(
        "The button URL must start with http:// or https://."
      );
      return;
    }

    const fields = new Set<TemplateField>(form.fields);

    if (
      form.defaults.btnText.trim() ||
      form.defaults.btnLink.trim()
    ) {
      fields.add("btn");
    }

    const payload: CreateTemplatePayload = {
      slug,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      icon: form.icon.trim() || "✉️",
      fields: Array.from(fields),
      defaults: {
        subject: form.defaults.subject.trim(),
        headline: form.defaults.headline.trim(),
        message: form.defaults.message.trim(),
        btnText: form.defaults.btnText.trim(),
        btnLink: form.defaults.btnLink.trim(),
        code: form.defaults.code.trim(),
        detail: form.defaults.detail.trim(),
      },
      isActive: form.isActive,
    };

    setLoading(true);

    try {
      const response = await api.post("/templates", payload);

      if (response.data?.success === false) {
        throw new Error(
          response.data.message ||
            "Could not create the template."
        );
      }

      setSuccess("Template created successfully.");

      navigate("/templates", {
        state: {
          success: "Template created successfully.",
        },
      });
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          err instanceof Error
            ? err.message
            : "Could not create the template."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Email Template
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create and customize an email template for future
              campaigns.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/templates")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back to Templates
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template information */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Template Information
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className={labelClass}
                  htmlFor="template-name"
                >
                  Template Name *
                </label>

                <input
                  id="template-name"
                  className={inputClass}
                  placeholder="e.g. Welcome Email"
                  value={form.name}
                  onChange={(event) => {
                    const name = event.target.value;

                    setForm((previous) => ({
                      ...previous,
                      name,
                      slug: previous.slug
                        ? previous.slug
                        : generateSlug(name),
                    }));
                  }}
                  maxLength={60}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="template-slug"
                >
                  Template Slug *
                </label>

                <input
                  id="template-slug"
                  className={inputClass}
                  placeholder="welcome-email"
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", event.target.value)
                  }
                  maxLength={40}
                  pattern="[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*"
                  title="Use lowercase letters, numbers, and single dashes."
                  required
                  disabled={loading}
                />

                <p className="mt-1 text-xs text-gray-500">
                  Used as the template's unique URL-friendly
                  identifier. Use lowercase letters, numbers, and
                  dashes.
                </p>
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="template-description"
                >
                  Description
                </label>

                <textarea
                  id="template-description"
                  className={inputClass}
                  placeholder="Describe what this template is used for"
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  maxLength={120}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className={labelClass}
                    htmlFor="template-category"
                  >
                    Category *
                  </label>

                  <select
                    id="template-category"
                    className={inputClass}
                    value={form.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    required
                    disabled={loading}
                  >
                    {categories.map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={labelClass}
                    htmlFor="template-icon"
                  >
                    Template Icon
                  </label>

                  <input
                    id="template-icon"
                    className={inputClass}
                    placeholder="✉️"
                    value={form.icon}
                    onChange={(event) =>
                      updateField("icon", event.target.value)
                    }
                    maxLength={8}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="default-subject"
                >
                  Default Email Subject *
                </label>

                <input
                  id="default-subject"
                  className={inputClass}
                  placeholder="Welcome to {{companyName}}"
                  value={form.defaults.subject}
                  onChange={(event) =>
                    updateDefault("subject", event.target.value)
                  }
                  maxLength={200}
                  required
                  disabled={loading}
                />

                <p className="mt-1 text-xs text-gray-500">
                  Placeholders such as {"{{name}}"} and{" "}
                  {"{{companyName}}"} require backend rendering
                  support.
                </p>
              </div>

              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      isActive: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  disabled={loading}
                />
                Make this template active
              </label>
            </div>
          </section>

          {/* Email content */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Email Content
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="headline">
                  Headline *
                </label>

                <input
                  id="headline"
                  className={inputClass}
                  placeholder="Welcome, we're glad you're here"
                  value={form.defaults.headline}
                  onChange={(event) =>
                    updateDefault("headline", event.target.value)
                  }
                  maxLength={200}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="message">
                  Message *
                </label>

                <textarea
                  id="message"
                  className={inputClass}
                  placeholder="Write your email message..."
                  rows={6}
                  value={form.defaults.message}
                  onChange={(event) =>
                    updateDefault("message", event.target.value)
                  }
                  maxLength={5000}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    className={labelClass}
                    htmlFor="button-text"
                  >
                    Button Text
                  </label>

                  <input
                    id="button-text"
                    className={inputClass}
                    placeholder="Get started"
                    value={form.defaults.btnText}
                    onChange={(event) =>
                      updateDefault("btnText", event.target.value)
                    }
                    maxLength={80}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    className={labelClass}
                    htmlFor="button-url"
                  >
                    Button URL
                  </label>

                  <input
                    id="button-url"
                    type="url"
                    className={inputClass}
                    placeholder="https://example.com"
                    value={form.defaults.btnLink}
                    onChange={(event) =>
                      updateDefault("btnLink", event.target.value)
                    }
                    maxLength={500}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="code">
                    Optional Code
                  </label>

                  <input
                    id="code"
                    className={inputClass}
                    placeholder="e.g. SAVE20"
                    value={form.defaults.code}
                    onChange={(event) =>
                      updateDefault("code", event.target.value)
                    }
                    maxLength={60}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="detail">
                    Optional Detail
                  </label>

                  <input
                    id="detail"
                    className={inputClass}
                    placeholder="e.g. Offer ends Friday"
                    value={form.defaults.detail}
                    onChange={(event) =>
                      updateDefault("detail", event.target.value)
                    }
                    maxLength={200}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Optional fields */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Supported Template Fields
            </h2>

            <p className="mb-4 mt-1 text-sm text-gray-500">
              Select which optional fields this template uses.
              Button support is enabled automatically when you enter
              button text or a URL.
            </p>

            <div className="space-y-3">
              {(
                [
                  {
                    value: "code",
                    label: "Promotional or verification code",
                  },
                  {
                    value: "detail",
                    label: "Additional detail",
                  },
                  {
                    value: "btn",
                    label: "Button or call to action",
                  },
                ] as const
              ).map((field) => (
                <label
                  key={field.value}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={form.fields.includes(field.value)}
                    onChange={() =>
                      toggleTemplateField(field.value)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    disabled={
                      loading ||
                      (field.value === "btn" &&
                        Boolean(
                          form.defaults.btnText.trim() ||
                            form.defaults.btnLink.trim()
                        ))
                    }
                  />
                  {field.label}
                </label>
              ))}
            </div>
          </section>

          {/* Live preview */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Email Preview
            </h2>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <div className="border-b border-gray-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Subject
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {form.defaults.subject || "Your email subject"}
                </p>
              </div>

              <div className="p-5 sm:p-8">
                <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-100 p-6">
                    <span className="text-2xl" role="img" aria-label="Template icon">
                      {form.icon || "✉️"}
                    </span>

                    <h3 className="mt-3 text-xl font-bold text-gray-900">
                      {form.defaults.headline || "Your email headline"}
                    </h3>
                  </div>

                  <div className="p-6">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
                      {form.defaults.message ||
                        "Your email message will appear here."}
                    </p>

                    {form.defaults.code && (
                      <div className="my-5 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                        <p className="text-xs text-gray-500">
                          Your code
                        </p>
                        <p className="mt-1 font-mono text-lg font-bold tracking-widest text-gray-900">
                          {form.defaults.code}
                        </p>
                      </div>
                    )}

                    {form.defaults.detail && (
                      <p className="mt-4 text-sm text-gray-500">
                        {form.defaults.detail}
                      </p>
                    )}

                    {form.defaults.btnText && (
                      <div className="mt-6">
                        <span className="inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white">
                          {form.defaults.btnText}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-400">
                    Email preview · {form.name || "Untitled template"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3 pb-8">
            <button
              type="button"
              disabled={loading}
              onClick={resetForm}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTemplate;
