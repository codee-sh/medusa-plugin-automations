import { TemplateOptions } from "../shared/i18n";
import { getContactFormHtml, getContactFormText } from "./contact-form";
import { getOrderCreatedHtml, getOrderCreatedText } from "./order-placed";
import { TEMPLATES_NAMES } from "./types";

/**
 * Available templates
 */
export type TemplateName = (typeof TEMPLATES_NAMES)[keyof typeof TEMPLATES_NAMES];

/**
 * Template data type
 */
export type TemplateData = any

/**
 * Template registry mapping template names to their renderers
 */
const templateRegistry: Record<TemplateName, TemplateRenderer> = {
  [TEMPLATES_NAMES.CONTACT_FORM]: {
    getHtml: getContactFormHtml,
    getText: getContactFormText,
  },
  [TEMPLATES_NAMES.ORDER_PLACED]: {
    getHtml: getOrderCreatedHtml,
    getText: getOrderCreatedText,
  },
};

/**
 * Template renderer interface
 */
export interface TemplateRenderer {
  getHtml: (data: any, options?: TemplateOptions) => string;
  getText: (data: any, options?: TemplateOptions) => string;
}

/**
 * Get template renderer by template name
 * 
 * @param templateName - Name of the template
 * @returns Template renderer with getHtml and getText methods
 * @throws Error if template name is not found
 */
export function getTemplate(templateName: any): TemplateRenderer {
  const template = templateRegistry[templateName];
  
  if (!template) {
    throw new Error(
      `Template "${templateName}" not found. Available templates: ${Object.keys(templateRegistry).join(", ")}`
    );
  }
  
  return template;
}

/**
 * Generate HTML and text for a template
 * 
 * @param templateName - Name of the template
 * @param data - Template data
 * @param options - Optional theme and locale configuration
 * @returns Object with html and text properties
 */
export function renderTemplate(
  templateName: TemplateName,
  data: TemplateData,
  options?: TemplateOptions
): { html: string; text: string } {
  const template = getTemplate(templateName);
  
  return {
    html: template.getHtml(data, options),
    text: template.getText(data, options),
  };
}
