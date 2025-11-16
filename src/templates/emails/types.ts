import { Theme } from "../shared/components";
import { Locale } from "../shared/i18n";

export interface TemplateOptionsType {
  theme?: Theme;
  locale?: Locale;  
  customTranslations?: Record<string, Record<string, any>>;
}
