
import { api } from "./api";

export interface EmailTemplateDefinition {
  id?: string;
  templateId?: string;
  slug?: string;
  name?: string;
  description?: string;
  defaultSubject?: string;
  fields?: string[];
}

export interface TemplateDefinitionsResponse {
  success: boolean;
  data: EmailTemplateDefinition[];
}

export interface EmailValues {
  name?: string;
  companyName?: string;
  headline?: string;
  message?: string;
  code?: string;
  detail?: string;
  btnText?: string;
  btnLink?: string;
}

export interface PreviewResponse {
  success: boolean;
  data: {
    subject: string;
    html: string;
  };
}

export interface SendResponse {
  success: boolean;
  message: string;
  data: { id: string };
}

export async function getEmailTemplates(
  signal?: AbortSignal,
): Promise<EmailTemplateDefinition[]> {
  const { data } = await api.get<TemplateDefinitionsResponse>(
    "/emails/templates",
    { signal },
  );

  return data.data;
}

/**
 * Only send fields explicitly supported by the selected template.
 * If the backend definition doesn't provide a fields list, leave the
 * values unchanged so the backend remains the source of validation.
 */
function getSupportedValues(
  template: EmailTemplateDefinition | undefined,
  values: EmailValues,
): EmailValues {
  if (!template?.fields?.length) {
    return values;
  }

  const supported = new Set(template.fields);

  return Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) => supported.has(key) && value !== undefined,
    ),
  ) as EmailValues;
}

function getTemplateId(
  templateId: string,
  templates: EmailTemplateDefinition[],
): string {
  const template = templates.find(
    (item) =>
      item.id === templateId ||
      item.templateId === templateId ||
      item.slug === templateId,
  );

  return template?.templateId ?? template?.slug ?? templateId;
}

export async function previewEmail(
  templateId: string,
  subject: string,
  values: EmailValues,
  signal?: AbortSignal,
  templates: EmailTemplateDefinition[] = [],
): Promise<PreviewResponse["data"]> {
  const template = templates.find(
    (item) =>
      item.id === templateId ||
      item.templateId === templateId ||
      item.slug === templateId,
  );

  const payload = {
    templateId: getTemplateId(templateId, templates),
    subject,
    values: getSupportedValues(template, values),
  };

  const { data } = await api.post<PreviewResponse>(
    "/emails/preview",
    payload,
    { signal },
  );

  return data.data;
}

export async function sendEmail(
  to: string,
  templateId: string,
  subject: string,
  values: EmailValues,
  templates: EmailTemplateDefinition[] = [],
): Promise<SendResponse> {
  const template = templates.find(
    (item) =>
      item.id === templateId ||
      item.templateId === templateId ||
      item.slug === templateId,
  );

  const payload = {
    to,
    templateId: getTemplateId(templateId, templates),
    subject,
    values: getSupportedValues(template, values),
  };

  const { data } = await api.post<SendResponse>("/emails/send", payload);

  return data;
}
