import { Theme } from "../shared/components";
import { Locale } from "../shared/i18n";

export const TEMPLATES_NAMES = {
  ORDER_PLACED: "order-placed",
  CONTACT_FORM: "contact-form",
} as const;

export interface TemplateOptionsType {
  theme?: Theme;
  locale?: Locale;  
  customTranslations?: Record<string, Record<string, any>>;
}
