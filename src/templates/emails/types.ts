export const TEMPLATES_NAMES = {
  INVENTORY_LEVEL_UPDATED: "inventory-level-updated",
  ORDER_PLACED: "order-placed",
  ORDER_COMPLETED: "order-completed",
  CONTACT_FORM: "contact-form",
} as const;

export interface TemplateRenderOptionsType {
  theme?: any;
  locale?: any;  
  customTranslations?: Record<string, Record<string, any>>;
  i18n?: any; // Pre-processed translations object from renderTemplate
}

export interface TemplateOptionsType {
  theme?: any;
  locale?: any;  
  customTranslations?: Record<string, Record<string, any>>;
  i18n?: any; // Pre-processed translations object from renderTemplate
}
