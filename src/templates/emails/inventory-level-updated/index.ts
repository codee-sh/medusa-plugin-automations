import { InventoryLevelUpdatedTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { renderHTML, renderText } from "./template";

/**
 * Generates HTML email for order created notificat
 * 
 * @param data - Order data (includes subject)
 * @param options - Optional theme and locale configuration
 * @returns HTML string ready to send
 */
export async function getInventoryLevelUpdatedHtml(
  data: InventoryLevelUpdatedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await renderHTML(data, options);
}

export async function getInventoryLevelUpdatedText(
  data: InventoryLevelUpdatedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await renderText(data, options);
}
