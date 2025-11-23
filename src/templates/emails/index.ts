import { TemplateOptionsType, TemplateRenderOptionsType } from "./types";
import { getContactFormHtml, getContactFormText } from "./contact-form/index";
import { getOrderCreatedHtml, getOrderCreatedText } from "./order-placed/index";
import { getOrderCompletedHtml, getOrderCompletedText } from "./order-completed/index";
import { TEMPLATES_NAMES } from "./types";
import { getTranslations } from "../shared/i18n";
import { translations as contactFormTranslations } from "./contact-form/translations";
import { translations as orderPlacedTranslations } from "./order-placed/translations";
import { translations as orderCompletedTranslations } from "./order-completed/translations";

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
 * Template translations registry mapping template names to their translations
 */
const templateTranslationsRegistry: Record<TemplateName, Record<string, any>> = {
  [TEMPLATES_NAMES.CONTACT_FORM]: contactFormTranslations,
  [TEMPLATES_NAMES.ORDER_PLACED]: orderPlacedTranslations,
  [TEMPLATES_NAMES.ORDER_COMPLETED]: orderCompletedTranslations,
};

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
  [TEMPLATES_NAMES.ORDER_COMPLETED]: {
    getHtml: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getOrderCompletedHtml(data, options as any);
    },
    getText: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getOrderCompletedText(data, options as any);
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
 * @returns Object with html, text, and subject properties
 */
export async function renderTemplate(
  templateName: TemplateName,
  data: TemplateData,
  options?: TemplateRenderOptionsType
): Promise<{ html: any; text: any; subject: string }> {
  const template = getTemplate(templateName);
  const locale = options?.locale || "pl";
  
  // Get translations for this template
  const translations = templateTranslationsRegistry[templateName];
  if (!translations) {
    throw new Error(`Translations not found for template: ${templateName}`);
  }
  
  // Process translations once in renderTemplate
  const customTranslations = options?.customTranslations?.[templateName];
  const i18n = getTranslations(
    locale,
    translations,
    customTranslations ? { [locale]: customTranslations } : undefined,
    templateName
  );
  
  // Get subject from translations
  const subject = i18n.t("headerTitle", data);

  // Pass processed i18n in options to render functions
  const renderOptions: TemplateOptionsType = {
    ...options,
    i18n,
  };

  return {
    html: await template.getHtml(data, renderOptions),
    text: await template.getText(data, renderOptions),
    subject,
  };
}
