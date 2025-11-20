import { ContactFormTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { renderHTML, renderText } from "./template";

/**
 * Generates HTML email for contact form notification
 * 
 * @param data - Contact form data (includes subject)
 * @param options - Optional theme and locale configuration
 * @returns HTML string ready to send
 */
export async function getContactFormHtml(
  data: ContactFormTemplateDataType, 
  options: TemplateOptionsType
): Promise<any> {
  return await renderHTML(data, options);
}

export async function getContactFormText(
  data: ContactFormTemplateDataType, 
  options: TemplateOptionsType
): Promise<any> {
  return await renderText(data, options);
}
