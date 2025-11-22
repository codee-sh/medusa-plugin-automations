import { TemplateOptionsType } from "./types";
import { getContactFormHtml, getContactFormText } from "./contact-form/index";
import { getOrderCreatedHtml, getOrderCreatedText } from "./order-placed/index";
import { TEMPLATES_NAMES } from "./types";

/**
 * Template names constants
 */
export { TEMPLATES_NAMES };

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
    getHtml: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getContactFormHtml(data, options as any);
    },
    getText: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getContactFormText(data, options as any);
    },
  },
  [TEMPLATES_NAMES.ORDER_PLACED]: {
    getHtml: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getOrderCreatedHtml(data, options as any);
    },
    getText: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getOrderCreatedText(data, options as any);
    },
  },
};

/**
 * Template renderer interface
 */
export interface TemplateRenderer {
  getHtml: (data: any, options?: TemplateOptionsType) => Promise<string>;
  getText: (data: any, options?: TemplateOptionsType) => Promise<string>;
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
export async function renderTemplate(
  templateName: TemplateName,
  data: TemplateData,
  options?: TemplateOptionsType
): Promise<{ html: any; text: any }> {
  const template = getTemplate(templateName);

  return {
    html: await template.getHtml(data, options),
    text: await template.getText(data, options),
  };
}
