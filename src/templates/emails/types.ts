export const TEMPLATES_NAMES = {
  ORDER_PLACED: "order-placed",
  ORDER_COMPLETED: "order-completed",
  CONTACT_FORM: "contact-form",
} as const;

export interface TemplateOptionsType {
  theme?: any;
  locale?: any;  
  customTranslations?: Record<string, Record<string, any>>;
}
