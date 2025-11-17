# Templates Documentation

This plugin provides a flexible email template system that generates both HTML and plain text versions of emails.

## Available Templates

- **[Order Placed](./templates/order-placed.md)** (`order-placed`) - Order confirmation email template
- **[Contact Form](./templates/contact-form.md)** (`contact-form`) - Contact form submission email template

Each template has its own documentation with detailed examples and usage instructions.

## Template Options

When rendering templates, you can pass the following options:

```typescript
interface TemplateOptions {
  theme?: Theme           // Email theme (default: "default")
  locale?: Locale         // Locale for translations (default: "pl")
  customTranslations?: Record<string, Record<string, any>>
}
```

### Theme

The plugin supports customizable themes. Currently available:
- `default` - Standard email theme

### Locale

Supported locales:
- `pl` - Polish (default)
- `en` - English

## Template Structure

Templates are built using reusable components:

- **Header Section**: Email header with title and description
- **Text Section**: Standard text content
- **Rich Text Section**: Formatted text with HTML support
- **Button Section**: Call-to-action buttons
- **Divider Section**: Visual separators
- **Footer Section**: Email footer

Each template can customize these components based on the provided data and options.

## Creating Custom Templates

To create a custom template:

1. Create a new folder in `src/templates/emails/your-template-name/`
2. Add template files:
   - `index.ts` - Main template rendering functions
   - `locales/` - Translation files
   - `types.ts` - TypeScript types

3. Register the template in `src/templates/emails/index.ts`

See existing templates for reference implementation.

