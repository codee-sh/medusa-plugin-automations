# @codee-sh/medusa-plugin-notification

A comprehensive notification plugin for Medusa v2 that provides a flexible email template system with internationalization support, custom translations, and seamless integration with Medusa's notification module.

## Features

- **Email Templates**: Pre-built, customizable email templates built with [React Email](https://react.email) for common use cases
- **React Email Integration**: Templates are built using React Email components, providing modern, responsive email design
- **Internationalization**: Built-in support for multiple locales (Polish, English)
- **Customizable**: Override translations and customize templates without modifying core files
- **Integration**: Integrates with Medusa's notification module
- **Admin Panel**: Preview and test templates directly from Medusa Admin
- **Type-Safe**: Full TypeScript support with exported types
- **HTML & Plain Text**: Automatically generates both HTML and plain text versions of emails

## Compatibility

- **Medusa Version**: `>= 2.8.8`
- **Node Version**: `>= 20`

## Installation

```bash
npm install @codee-sh/medusa-plugin-notification
# or
yarn add @codee-sh/medusa-plugin-notification
```

## Quick Start

### 1. Register the Plugin

Add to your `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    "@codee-sh/medusa-plugin-notification"
  ]
})
```

### 2. Configure Notification Provider

Set up a notification provider - see [Configuration Documentation](./docs/configuration.md) for details.

### 3. Use Templates

The plugin includes a built-in subscriber for `order.placed` events. You can also use templates in your code:

```typescript
import { renderTemplate, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails"

const { html, text, subject } = await renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  templateData,
  { locale: "pl" }
)
```

**Note**: `renderTemplate` is an async function that returns both HTML and plain text versions of the email, generated using React Email.

See [Templates Documentation](./docs/templates.md) for detailed usage examples.

## Available Templates

- **[Order Placed](./docs/templates/order-placed.md)** (`order-placed`) - Order confirmation email template
- **[Contact Form](./docs/templates/contact-form.md)** (`contact-form`) - Contact form submission email template

See [Templates Documentation](./docs/templates.md) for general template information.

## Admin Panel

Access the template preview in Medusa Admin at `/app/notifications/render`. See [Admin Panel Documentation](./docs/admin.md) for details.

## Documentation

- [Templates](./docs/templates.md) - Detailed template documentation
- [Translations](./docs/translations.md) - Internationalization and custom translations
- [Configuration](./docs/configuration.md) - Plugin configuration options
- [Admin Panel](./docs/admin.md) - Admin interface usage

## Exports

The plugin exports the following:

- `@codee-sh/medusa-plugin-notification/templates/emails` - Template rendering functions
- `@codee-sh/medusa-plugin-notification/templates/emails/types` - Template types and constants
- `@codee-sh/medusa-plugin-notification/utils` - Utility functions

## License

MIT

## Author

Codee Team - [https://codee.dev](https://codee.dev)
