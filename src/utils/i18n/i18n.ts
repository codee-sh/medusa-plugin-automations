/**
 * Simple i18n utility for templates
 * Provides basic translation functionality without external dependencies
 */

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
 * Flatten translations structure - extracts 'general' object properties to root level
 * This allows JSON files to have nested structure while templates use flat structure
 * 
 * @param translations - Translations object (may contain 'general' wrapper)
 * @returns Flattened translations object
 */
function flattenTranslations(translations: any): any {
  if (!isObject(translations) || !translations.general) {
    return translations;
  }

  // Extract 'general' properties to root level
  const { general, ...rest } = translations;
  return { ...general, ...rest };
}

/**
 * Get nested value from object using dot notation path
 * 
 * @param obj - Object to get value from
 * @param path - Dot notation path (e.g., "labels.inventoryLevelId")
 * @returns Value at path or undefined
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object') {
      return current[key];
    }
    return undefined;
  }, obj);
}

/**
 * Interpolate variables in text using {{variable}} syntax
 * Supports nested object paths (e.g., inventory_level.id)
 * 
 * @param text - Text with {{variable}} placeholders
 * @param data - Data object for interpolation
 * @returns Interpolated text
 */
function interpolate(text: string, data: Record<string, any> = {}): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  return text.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, key) => {
    // Support nested keys (e.g., inventory_level.id)
    const value = getNestedValue(data, key);
    return value !== undefined && value !== null ? String(value) : match;
  });
}

/**
 * Simple translation function
 * 
 * @param locale - Target locale (e.g., 'pl', 'en')
 * @param translations - Record of translations by locale
 * @param key - Translation key (supports dot notation: "labels.inventoryLevelId")
 * @param data - Data for interpolation
 * @returns Translated and interpolated text
 */
export function t(
  locale: string,
  translations: Record<string, any>,
  key: string,
  data: Record<string, any> = {}
): string {
  // Get translations for locale with fallback to 'pl'
  const localeTranslations = translations[locale] || translations['pl'] || {};
  
  // Flatten translations structure
  const flatTranslations = flattenTranslations(localeTranslations);
  
  // Get translation value (supports nested keys)
  const translation = getNestedValue(flatTranslations, key);
  
  // Use key as fallback if translation not found
  const text = translation || key;
  
  // Interpolate variables
  return interpolate(text, data);
}

/**
 * Create a translator function for a specific locale and translations
 * 
 * @param locale - Target locale
 * @param translations - Record of translations by locale
 * @returns Translator function that takes (key, data?) and returns translated string
 */
export function createTranslator(
  locale: string,
  translations: Record<string, any>
): (key: string, data?: Record<string, any>) => string {
  return (key: string, data: Record<string, any> = {}) => {
    return t(locale, translations, key, data);
  };
}

/**
 * Merge custom translations with base translations
 * Custom translations override base translations
 * 
 * @param baseTranslations - Base translations object
 * @param customTranslations - Custom translations to merge (optional)
 * @returns Merged translations object
 */
export function mergeTranslations(
  baseTranslations: Record<string, any>,
  customTranslations?: Record<string, any>
): Record<string, any> {
  if (!customTranslations || !isObject(customTranslations)) {
    return baseTranslations;
  }

  const merged: Record<string, any> = { ...baseTranslations };

  for (const [lang, custom] of Object.entries(customTranslations)) {
    if (isObject(custom)) {
      merged[lang] = {
        ...baseTranslations[lang],
        general: {
          ...(baseTranslations[lang]?.general || {}),
          ...(custom.general || custom),
        },
      };
    }
  }

  return merged;
}

