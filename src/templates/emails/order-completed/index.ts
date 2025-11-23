import { OrderCompletedTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { renderHTML, renderText } from "./template";

/**
 * Generates HTML email for order completed notification
 * 
 * @param data - Order data (includes subject)
 * @param options - Optional theme and locale configuration
 * @returns HTML string ready to send
 */
export async function getOrderCompletedHtml(
  data: OrderCompletedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await renderHTML(data, options);
}

export async function getOrderCompletedText(
  data: OrderCompletedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await renderText(data, options);
}

