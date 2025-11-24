# Translations Documentation

The plugin includes a comprehensive internationalization (i18n) system built on [i18next](https://www.i18next.com/) with support for multiple locales and custom translation overrides. Translations use string interpolation with `{{variable}}` syntax for dynamic content.

## Supported Locales

- **Polish (`pl`)**: Default locale
- **English (`en`)**: Secondary locale

## Translation Structure

Translations are organized by template and locale. Each template has its own translation JSON files:

```
src/templates/emails/
  order-placed/
    translations/
      pl.json    # Polish translations
      en.json    # English translations
      index.ts   # Translation exports
```

### Translation File Format

Translation files are JSON objects with a `general` wrapper that gets automatically flattened:

```json
{
  "general": {
    "headerTitle": "#{{orderNumber}} - Zamówienie zostało złożone",
    "headerDescription": "Twoje zamówienie zostało przyjęte...",
    "labels": {
      "orderNumber": "Numer zamówienia",
      "orderDate": "Data zamówienia"
    },
    "footer": "Jeśli masz pytania..."
  }
}
```

The `general` wrapper is automatically flattened, so you can access translations directly using keys like `headerTitle` or `labels.orderNumber`.

## Using Translations

Translations are automatically applied when rendering templates:

```typescript
import { renderTemplate, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails"

// Uses Polish translations (default)
const { html, text, subject } = await renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  data,
  { locale: "pl" }
)

// Uses English translations
const { html, text, subject } = await renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  data,
  { locale: "en" }
)
```

**Note**: `renderTemplate` is an async function that uses React Email to render templates with the specified translations.

## String Interpolation

Translations use i18next's interpolation syntax with `{{variable}}` placeholders. Variables are automatically replaced with values from the template data object passed to `i18n.t()`.

### Basic Interpolation

```json
{
  "general": {
    "headerTitle": "#{{orderNumber}} - Zamówienie zostało złożone"
  }
}
```

When rendering, the `{{orderNumber}}` placeholder is replaced with the value from `data.orderNumber`:

```typescript
// In template: i18n.t('headerTitle', data)
// Where data = { orderNumber: "12345" }
// Result: "#12345 - Zamówienie zostało złożone"
```

### Nested Data Access

You can access nested properties using dot notation in the translation key, but interpolation variables come from the data object:

```json
{
  "general": {
    "labels": {
      "orderTotal": "Wartość zamówienia: {{summary.total}} {{summary.currency_code}}"
    }
  }
}
```

```typescript
// Usage: i18n.t('labels.orderTotal', data)
// Where data = { summary: { total: "100.00", currency_code: "PLN" } }
// Result: "Wartość zamówienia: 100.00 PLN"
```

## Custom Translations

You can override default translations in two ways. Custom translations use the same JSON structure as base translations.

### 1. Plugin Configuration

Override translations globally in `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification",
      options: {
        customTranslations: {
          "order-placed": {
            pl: {
              headerTitle: "#{{orderNumber}} - Twoje zamówienie",
              labels: {
                orderNumber: "Numer zamówienia",
                orderDate: "Data zamówienia"
              }
            }
          }
        }
      }
    }
  ]
})
```

### 2. Per-Template Override

Override translations when rendering a specific template:

```typescript
const { html, text, subject } = await renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  data,
  {
    locale: "pl",
    customTranslations: {
      "order-placed": {
        pl: {
          headerTitle: "#{{orderNumber}} - Custom Title",
          labels: {
            orderNumber: "Custom Order Number Label"
          }
        }
      }
    }
  }
)
```

### How Custom Translations Work

- Custom translations are **deeply merged** with base translations
- You can override individual keys without replacing entire objects
- Nested objects (like `labels`) are merged, not replaced
- Interpolation variables (`{{variable}}`) work the same way in custom translations

## Accessing Translations in Code

Translations are accessed through the `i18n` object provided to template render functions. The `i18n` object has a `t()` method that uses i18next:

```typescript
// In template component
export function renderHTMLReact(data: TemplateDataType, options: TemplateOptionsType) {
  const i18n = options.i18n;
  
  // Use i18n.t() with translation key and data for interpolation
  return (
    <Text>{i18n.t('headerTitle', data)}</Text>
  );
}
```

The `t()` method signature:
- **First parameter**: Translation key (string, supports dot notation for nested keys)
- **Second parameter**: Data object for interpolation (optional)

**Example**:
```typescript
// Simple key
i18n.t('headerTitle', data)

// Nested key
i18n.t('labels.orderNumber', data)

// With interpolation - data provides values for {{variable}} placeholders
i18n.t('headerTitle', { orderNumber: "12345" })
// Translation: "#{{orderNumber}} - Zamówienie zostało złożone"
// Result: "#12345 - Zamówienie zostało złożone"
```

## Best Practices

1. **Use interpolation for dynamic content**: Use `{{variable}}` syntax instead of string concatenation
2. **Override at plugin level**: For global changes, use plugin configuration in `medusa-config.ts`
3. **Override per-template**: For one-off changes, override when calling `renderTemplate()`
4. **Preserve structure**: When overriding nested objects, maintain the same JSON structure
5. **Test both locales**: Ensure custom translations work for all supported locales
6. **Use meaningful variable names**: Use clear variable names in `{{variable}}` placeholders that match your data structure
7. **Keep translations in JSON**: Store translations as JSON files, not TypeScript files with functions

## Adding New Locales

To add support for a new locale:

1. Create translation JSON files for each template:
   ```
   order-placed/translations/de.json
   contact-form/translations/de.json
   ```

2. Follow the same JSON structure with `general` wrapper:
   ```json
   {
     "general": {
       "headerTitle": "Translation with {{variable}}",
       "labels": {
         "orderNumber": "Order Number"
       }
     }
   }
   ```

3. Export translations in `translations/index.ts`:
   ```typescript
   import de from "./de.json";
   export const translations = { de, pl, en };
   ```

4. The locale will be automatically available when you use it:
   ```typescript
   await renderTemplate(TEMPLATES_NAMES.ORDER_PLACED, data, { locale: "de" })
   ```

