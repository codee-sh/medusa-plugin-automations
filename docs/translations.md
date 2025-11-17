# Translations Documentation

The plugin includes a comprehensive internationalization (i18n) system with support for multiple locales and custom translation overrides.

## Supported Locales

- **Polish (`pl`)**: Default locale
- **English (`en`)**: Secondary locale

## Translation Structure

Translations are organized by template and locale. Each template has its own translation files:

```
src/templates/emails/
  order-placed/
    locales/
      pl.ts      # Polish translations
      en.ts      # English translations
      types.ts   # TypeScript types
```

## Using Translations

Translations are automatically applied when rendering templates:

```typescript
import { renderTemplate, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails"

// Uses Polish translations (default)
const { html } = renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  data,
  { locale: "pl" }
)

// Uses English translations
const { html } = renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  data,
  { locale: "en" }
)
```

## Custom Translations

You can override default translations in two ways:

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
              // Function or string translation
              headerTitle: ({ data }) => `Twoje zamówienie #${data?.orderNumber}`,
              
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
const { html } = renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  data,
  {
    locale: "pl",
    customTranslations: {
      pl: {
        // String override
        headerTitle: "Custom Title",
        
        // Or function override with access to all template data
        headerTitle: ({ data }) => `Order #${data.orderNumber} - Custom Title`
      }
    }
  }
)
```

## Translation Functions

Some translation fields can accept either a **string** or a **function** that generates dynamic content.

### Function Translations

Function translations receive all template data and can generate dynamic content:

```typescript
{
  // Function receives an object with 'data' property containing all template data
  headerTitle: ({ data }) => `Order #${data.orderNumber} - ${data.customerName}`
}
```

**Function signature**: `(params: { data: TemplateData }) => string`

**Available data**: The function receives all template data passed to `renderTemplate()`. For example, with `order-placed` template:
- `data.orderNumber`
- `data.customerEmail`
- `data.items`
- `data.summary`
- ... all other template data fields

### String Translations

Simple string translations are also supported:

```typescript
{
  headerTitle: "Order Confirmation"
}
```

### When to Use Functions vs Strings

- **Use functions** when you need dynamic content based on template data
- **Use strings** for static translations or when using placeholder syntax

**Example - Function with full data access**:
```typescript
customTranslations: {
  "order-placed": {
    pl: {
      headerTitle: ({ data }) => {
        // Access all template data
        const itemCount = data.items?.length || 0
        const total = data.summary?.total || "0"
        return `Zamówienie #${data.orderNumber} - ${itemCount} produktów za ${total}`
      }
    }
  }
}
```

When you override a function translation, the entire function is replaced (not merged).

## Accessing Translations in Code

You can access translations directly using the `getTranslations` utility:

```typescript
import { getTranslations } from "@codee-sh/medusa-plugin-notification/templates/shared/i18n"
import { translations } from "./locales"

const t = getTranslations("pl", translations, customTranslations)

// Use translations
const title = t.headerTitle
const orderLabel = t.labels.orderNumber
```

## Best Practices

1. **Use TypeScript types**: Import and use translation types for type safety
2. **Override at plugin level**: For global changes, use plugin configuration
3. **Override per-template**: For one-off changes, override when rendering
4. **Preserve structure**: When overriding nested objects, maintain the same structure
5. **Test both locales**: Ensure custom translations work for all supported locales

## Adding New Locales

To add support for a new locale:

1. Add locale type to `src/templates/shared/i18n/types.ts`:
   ```typescript
   export type Locale = "pl" | "en" | "de" // Add "de"
   ```

2. Create translation files for each template:
   ```
   order-placed/locales/de.ts
   contact-form/locales/de.ts
   ```

3. Export translations in `locales/index.ts`

4. Update default locale handling if needed

