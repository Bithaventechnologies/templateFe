import { api } from "./api";

export interface EmailTemplateDefinition {
  id?: string;
  templateId?: string;
  slug?: string;
  name?: string;
}

export interface TemplateDefinitionsResponse {
  success: boolean;
  data: EmailTemplateDefinition[];
}

export interface EmailValues {
  name?: string;
  headline?: string;
  message?: string;
  code?: string;
  detail?: string;
  btnText?: string;
  btnLink?: string;
}

export interface PreviewResponse {
  success: boolean;
  data: { subject: string; html: string };
}

export interface SendResponse {
  success: boolean;
  message: string;
  data: { id: string };
}

export async function getEmailTemplates(signal?: AbortSignal): Promise<EmailTemplateDefinition[]> {
  const { data } = await api.get<TemplateDefinitionsResponse>("/emails/templates", { signal });
  return data.data;
}

export async function previewEmail(
  templateId: string,
  subject: string,
  values: EmailValues,
  signal?: AbortSignal,
): Promise<PreviewResponse["data"]> {
  const { data } = await api.post<PreviewResponse>("/emails/preview", { templateId, subject, values }, { signal });
  return data.data;
}

export async function sendEmail(
  to: string,
  templateId: string,
  subject: string,
  values: EmailValues,
): Promise<SendResponse> {
  const { data } = await api.post<SendResponse>("/emails/send", { to, templateId, subject, values });
  return data;
}
