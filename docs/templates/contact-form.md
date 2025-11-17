# Contact Form Template

Email template for contact form submissions.

## Template Name

- Constant: `TEMPLATES_NAMES.CONTACT_FORM`
- String: `"contact-form"`

## Required Data

```typescript
{
  name: string
  email: string
  subject?: string
  message: string
}
```

## Example Usage

### Basic Usage

```typescript
import { renderTemplate, TEMPLATES_NAMES } from "@codee_team/medusa-plugin-notification/templates/emails"

const { html, text } = renderTemplate(
  TEMPLATES_NAMES.CONTACT_FORM,
  {
    name: "John Doe",
    email: "john@example.com",
    subject: "Question about products",
    message: "I have a question about..."
  },
  {
    locale: "en"
  }
)
```

### With Custom Translations

```typescript
const { html, text } = renderTemplate(
  TEMPLATES_NAMES.CONTACT_FORM,
  {
    name: "John Doe",
    email: "john@example.com",
    message: "I have a question..."
  },
  {
    locale: "pl",
    customTranslations: {
      pl: {
        subject: "Nowa wiadomość kontaktowa"
      }
    }
  }
)
```

### With Notification Module

```typescript
import { renderTemplate, TEMPLATES_NAMES } from "@codee_team/medusa-plugin-notification/templates/emails"
import { Modules } from "@medusajs/framework/utils"

const notificationModuleService = container.resolve(Modules.NOTIFICATION)

const { html, text } = renderTemplate(
  TEMPLATES_NAMES.CONTACT_FORM,
  {
    name: "John Doe",
    email: "john@example.com",
    message: "I have a question..."
  },
  { locale: "en" }
)

await notificationModuleService.createNotifications({
  to: "support@example.com",
  channel: "email",
  content: {
    subject: "New Contact Form Submission",
    html,
    text
  }
})
```

## Template Fields

The template displays the following information:

- Contact name
- Contact email address
- Optional subject
- Message content

## Translations

See [Translations Documentation](../translations.md) for available translation keys and how to customize them.

