import i18next from 'i18next';

// Cache for i18next instances per namespace (template)
const i18nextInstances: Map<string, typeof i18next> = new Map();

/**
 * Check if value is a plain object (not array, null, etc.)
 * Based on Medusa's isObject implementation
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
 * Simple deep merge for objects (not arrays)
 * Arrays are replaced, not merged
 * Functions are preserved as-is
 * 
 * @param target - Target object
 * @param source - Source object to merge
 * @returns Merged object
 */
function deepMergeObjects(target: any, source: any): any {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const result = { ...target };
  
  for (const [key, value] of Object.entries(source)) {
    if (isObject(value) && isObject(result[key])) {
      // Recursively merge nested objects
      result[key] = deepMergeObjects(result[key], value);
    } else {
      // Replace or add value
      result[key] = value;
    }
  }
  
  return result;
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
 * Get or create i18next instance for a specific namespace
 * Each template gets its own i18next instance to avoid conflicts
 * 
 * @param namespace - Namespace identifier (usually template name)
 * @param baseResources - Base translation resources for all locales
 * @param customResources - Optional custom translation resources to merge
 * @returns i18next instance
 */
function getI18nextInstance(
  namespace: string, 
  baseResources: Record<string, any>,
  customResources?: Record<string, any>
): typeof i18next {
  // Build resources object for all languages
  const i18nextResources: Record<string, Record<string, any>> = {};
  for (const [lang, translations] of Object.entries(baseResources)) {
    i18nextResources[lang] = {
      [namespace]: translations || {}
    };
  }

  // Merge custom resources if provided
  if (customResources) {
    for (const [lang, translations] of Object.entries(customResources)) {
      if (translations) {
        if (!i18nextResources[lang]) {
          i18nextResources[lang] = {};
        }
        if (!i18nextResources[lang][namespace]) {
          i18nextResources[lang][namespace] = {};
        }
        i18nextResources[lang][namespace] = deepMergeObjects(
          i18nextResources[lang][namespace],
          translations
        );
      }
    }
  }

  // Check if instance exists and update it, or create new one
  if (i18nextInstances.has(namespace)) {
    const instance = i18nextInstances.get(namespace)!;
    // Update resources for all languages
    for (const [lang, resources] of Object.entries(i18nextResources)) {
      instance.addResourceBundle(lang, namespace, resources[namespace] || {}, true, true);
    }
    return instance;
  }

  // Create new i18next instance
  const instance = i18next.createInstance();
  instance.init({
    lng: 'pl',
    fallbackLng: 'pl',
    defaultNS: namespace,
    ns: [namespace],
    interpolation: {
      escapeValue: false,
      prefix: '{{',
      suffix: '}}',
    },
    resources: i18nextResources
  });

  i18nextInstances.set(namespace, instance);
  return instance;
}

/**
 * Create translation helper that uses i18next directly
 * Provides convenient t(key, data) method for accessing translations
 * 
 * @param i18n - i18next instance
 * @param namespace - Namespace for i18next (e.g., 'translation')
 * @param translations - Base translations object for fallback/defaultValue
 * @returns Translation helper object with t() method
 */
function createTranslationHelper(
  i18n: typeof i18next,
  namespace: string,
  translations: any
): { t: (key: string, data?: any) => string } {
  return {
    t: (key: string, data?: any) => {
      // Build full key with namespace
      const fullKey = `${namespace}:${key}`;
      
      // Get default value from translations object if available
      const keys = key.split('.');
      let defaultValue = translations;
      for (const k of keys) {
        if (defaultValue && typeof defaultValue === 'object') {
          defaultValue = defaultValue[k];
        } else {
          defaultValue = undefined;
          break;
        }
      }
      
      return i18n.t(fullKey, {
        ...(data || {}),
        defaultValue: typeof defaultValue === 'string' ? defaultValue : key,
        interpolation: { escapeValue: false },
        returnObjects: false
      }) as string;
    }
  };
}

/**
 * Get translations for a specific locale using i18next
 * Supports multiple languages with fallback mechanism
 * Maintains compatibility with existing code (functions, customTranslations)
 * 
 * @param locale - Target locale
 * @param translations - Record of translations by locale (from JSON imports)
 * @param customTranslations - Optional custom translations to merge deeply
 * @param namespace - Optional namespace for i18next (defaults to 'translation')
 * @returns Translations object compatible with existing code
 */
export function getTranslations<T extends Record<string, any>>(
  locale: string,
  translations: Record<string, any>,
  customTranslations?: Record<string, Partial<T> | Record<string, any>>,
  namespace: string = 'translation'
): any {
  // Flatten translations structure
  const flattenedTranslations = Object.fromEntries(
    Object.entries(translations).map(([lang, trans]) => [lang, flattenTranslations(trans)])
  );

  // Flatten custom translations if provided
  const flattenedCustomTranslations = customTranslations
    ? Object.fromEntries(
        Object.entries(customTranslations)
          .filter(([, trans]) => isObject(trans))
          .map(([lang, trans]) => [lang, flattenTranslations(trans)])
      )
    : {};

  // Get or create i18next instance with merged resources
  const i18n = getI18nextInstance(
    namespace, 
    flattenedTranslations,
    Object.keys(flattenedCustomTranslations).length > 0 ? flattenedCustomTranslations : undefined
  );
  
  i18n.changeLanguage(locale);

  // Merge base and custom translations for current locale
  const baseTranslations = flattenedTranslations[locale] || flattenedTranslations['pl'] || {};
  const customForLocale = flattenedCustomTranslations[locale];
  const mergedTranslations = customForLocale && isObject(customForLocale)
    ? deepMergeObjects(baseTranslations, customForLocale)
    : baseTranslations;
  
  // Return translation helper with direct i18next access
  return createTranslationHelper(i18n, namespace, mergedTranslations);
}

