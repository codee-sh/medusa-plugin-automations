import deepmerge from "deepmerge";

/**
 * Deep merge configuration
 * - clone: false - don't clone objects, merge into target (more performant)
 * - arrayMerge: replace - replace arrays instead of concatenating (for translations)
 * - isMergeableObject: custom function to determine what should be merged
 *   Functions and primitives (strings, numbers, etc.) should not be merged, but replaced
 */
const mergeOptions = {
  clone: false,
  arrayMerge: (destinationArray: any[], sourceArray: any[]) => sourceArray
};

/**
 * Check if value is a plain object (not array, null, etc.)
 */
function isObject(value: any): value is Record<string, any> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp)
  );
}

/**
 * Get translations for a specific locale
 * Defaults to Polish if locale is not found
 * Performs deep merge of custom translations with base translations
 * 
 * @param locale - Target locale
 * @param translations - Record of translations by locale
 * @param customTranslations - Optional custom translations to merge deeply
 * @returns Translations for the specified locale
 */
export function getTranslations<T extends Record<string, any>>(
  locale: string,
  translations: Record<string, T>,
  customTranslations?: Record<string, Partial<T> | Record<string, any>>
): T {
  const baseTranslations = translations[locale] || translations.pl;
  
  // If no custom translations or no custom translations for this locale, return base
  if (!customTranslations || !customTranslations[locale]) {
    return baseTranslations;
  }

  const customForLocale = customTranslations[locale];

  // If custom translations for locale is not an object, return base
  if (!isObject(customForLocale)) {
    return baseTranslations;
  }

  const mergedTranslations = deepmerge(baseTranslations, customForLocale as Partial<T>, mergeOptions) as T;

  return mergedTranslations;
}

