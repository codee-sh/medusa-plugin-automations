import { OrderCreatedTranslations } from "./types";
import { Locale } from "../../../shared/i18n";
import { pl } from "./pl";
import { en } from "./en";

export const translations: Record<Locale, OrderCreatedTranslations> = {
  pl,
  en,
};

export { type OrderCreatedTranslations } from "./types";
export { type Locale } from "../../../shared/i18n";
export { pl, en };

