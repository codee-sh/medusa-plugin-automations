import { Locale } from "./types";

/**
 * Get translations for a specific locale
 * Defaults to Polish if locale is not found
 * 
 * @param translations - Record of translations by locale
 * @param locale - Target locale
 * @returns Translations for the specified locale
 */
export function getTranslations<T>(
  translations: Record<Locale, T>,
  locale: Locale = "pl"
): T {
  return translations[locale] || translations.pl;
}

