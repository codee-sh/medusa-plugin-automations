# Templates Documentation

This plugin provides a flexible email template system built with [React Email](https://react.email) that generates both HTML and plain text versions of emails. This guide explains how to use existing templates in your code and create custom subscribers.

## Available Templates

- **[Order Placed](./templates/order-placed.md)** (`order-placed`) - Order confirmation email template
- **Order Completed** (`order-completed`) - Order completion notification email template
- **[Contact Form](./templates/contact-form.md)** (`contact-form`) - Contact form submission email template

Each template has its own documentation with detailed examples and usage instructions.

## Using Templates

### Basic Usage

The `renderTemplate` function is the main way to generate email content from templates:

```typescript
import { renderTemplate, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails"

const { html, text, subject } = await renderTemplate(
  TEMPLATES_NAMES.CONTACT_FORM,
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "123456789",
    message: "I have a question about your products"
  },
  {
    locale: "en"
  }
)
```

**Returns**:
- `html` - HTML version of the email (string)
- `text` - Plain text version of the email (string)
- `subject` - Email subject line (string, generated from translations)

### Template Options

When rendering templates, you can pass the following options:

```typescript
interface TemplateRenderOptionsType {
  theme?: Theme           // Email theme (default: "default")
  locale?: string         // Locale for translations (default: "pl")
  customTranslations?: Record<string, Record<string, any>>
}
```

**Supported locales**: `pl` (Polish, default), `en` (English)

## Creating Custom Subscribers

You can create your own subscribers that use the plugin's templates. This is useful when you want to send emails for custom events or with custom logic.

### Example: Custom Event Subscriber

```typescript
import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { renderTemplate, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails"

export default async function customEventHandler({
  event: { data },
  container,
}: SubscriberArgs<{ userId: string, message: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  // Use contact form template for custom notifications
  const { html, text, subject } = await renderTemplate(
    TEMPLATES_NAMES.CONTACT_FORM,
    {
      name: "System Notification",
      email: "system@example.com",
      message: data.message,
    },
    { locale: "en" }
  )

  await notificationModuleService.createNotifications({
    to: "admin@example.com",
    channel: "email",
    content: {
      subject,
      html,
      text,
    },
  })
}

export const config: SubscriberConfig = {
  event: "custom.event.name",
}
```

## Using Templates in API Routes

You can also use templates directly in API routes or workflows:

```typescript
import { renderTemplate, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { html, text, subject } = await renderTemplate(
    TEMPLATES_NAMES.CONTACT_FORM,
    {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    },
    { locale: req.body.locale || "pl" }
  )

  // Send email or return rendered content
  res.json({ html, text, subject })
}
```

## Custom Translations

You can override translations when calling `renderTemplate` in any context - subscribers, API routes, workflows, or anywhere else. Translations can be provided in two ways:

### Per-Call Custom Translations

Override translations directly when calling `renderTemplate`:

```typescript
const { html, text, subject } = await renderTemplate(
  TEMPLATES_NAMES.CONTACT_FORM,
  {
    name: "John Doe",
    email: "john@example.com",
    message: "Hello"
  },
  {
    locale: "pl",
    // Override translations for this specific call
    customTranslations: {
      "contact-form": {
        pl: {
          headerTitle: "Nowa wiadomość od {{name}}",
          labels: {
            name: "Imię i nazwisko"
          }
        }
      }
    }
  }
)
```

### Global Custom Translations from Plugin Options

Use translations configured globally in `medusa-config.ts`:

```typescript
import { getPluginOptions } from "@codee-sh/medusa-plugin-notification/utils/plugins"

const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification")

const { html, text, subject } = await renderTemplate(
  TEMPLATES_NAMES.CONTACT_FORM,
  {
    name: "John Doe",
    email: "john@example.com",
    message: "Hello"
  },
  {
    locale: "pl",
    // Use global translations from plugin configuration
    customTranslations: pluginOptions?.customTranslations?.[TEMPLATES_NAMES.CONTACT_FORM]
  }
)
```

### Combining Both Approaches

You can also combine global translations with per-call overrides. Per-call translations will merge with global ones:

```typescript
const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification")

const { html, text, subject } = await renderTemplate(
  TEMPLATES_NAMES.CONTACT_FORM,
  {
    name: "John Doe",
    email: "john@example.com",
    message: "Hello"
  },
  {
    locale: "pl",
    customTranslations: {
      "contact-form": {
        pl: {
          // This will override the global translation for headerTitle
          headerTitle: "Specjalna wiadomość od {{name}}",
          // Other translations from plugin options will still be used
        }
      }
    }
  }
)
```

**Note**: Custom translations use the same JSON structure as base translations. Variables are interpolated using `{{variable}}` syntax. See [Translations Documentation](./translations.md) for more details.

## Best Practices

1. **Use existing templates**: Check available templates before creating custom ones
2. **Follow data structure**: Ensure template data matches the expected structure (see template-specific docs)
3. **Handle errors**: Always check if data exists before rendering
4. **Use translations**: Leverage the i18next system for multi-language support
5. **Test rendering**: Test templates with sample data before deploying

## Creating New Templates

If you need to create a completely new template (not just use existing ones), see [Creating Custom Templates](./contributing/creating-templates.md) for a detailed guide.

## See Also

- [Template-specific Documentation](./templates/) - Detailed docs for each template
- [Translations Documentation](./translations.md) - How translations work
- [Configuration Documentation](./configuration.md) - Plugin configuration
- [Creating Custom Templates](./contributing/creating-templates.md) - Guide for creating new templates

