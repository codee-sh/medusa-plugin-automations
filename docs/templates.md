# Templates Documentation

This plugin provides a flexible email template system built with [React Email](https://react.email) that generates both HTML and plain text versions of emails. Templates are created using React components from `@react-email/components` and rendered using `@react-email/render`.

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

Templates are built using [React Email](https://react.email) components, which provide:

- **React Components**: Templates use React Email components like `Html`, `Body`, `Container`, `Section`, `Text`, `Button`, etc.
- **Tailwind CSS**: Styling is done using Tailwind CSS classes with email-safe presets
- **Responsive Design**: Components are optimized for email clients
- **HTML & Plain Text**: Each template automatically generates both HTML and plain text versions

### React Email Components Used

Templates utilize the following React Email components:
- `Html`, `Head`, `Body` - Email structure
- `Container`, `Section`, `Row`, `Column` - Layout components
- `Text`, `Heading`, `Button`, `Hr` - Content components
- `Tailwind` - Styling with Tailwind CSS

Each template can customize these components based on the provided data and options.

## Creating Custom Templates

To create a custom template using React Email:

1. Create a new folder in `src/templates/emails/your-template-name/`
2. Add template files:
   - `template.tsx` - React Email template component using `@react-email/components`
   - `index.ts` - Main template rendering functions (`getHtml`, `getText`)
   - `translations/` - Translation files (JSON format)
   - `types.ts` - TypeScript types for template data

3. Register the template in `src/templates/emails/index.ts`

### Template Implementation Example

```typescript
// template.tsx
import React from "react";
import { Html, Tailwind, Head, Text, Body, Container, Section } from "@react-email/components";
import { render, pretty, toPlainText } from "@react-email/render";

export function renderHTMLReact(data: YourDataType, options: TemplateOptionsType): React.ReactNode {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body>
          <Container>
            <Section>
              <Text>{data.message}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function renderHTML(data: YourDataType, options: TemplateOptionsType): Promise<string> {
  return await pretty(await render(renderHTMLReact(data, options)));
}

export async function renderText(data: YourDataType, options: TemplateOptionsType): Promise<string> {
  const html = await render(renderHTMLReact(data, options));
  return toPlainText(html);
}
```

See existing templates (`order-placed`, `contact-form`) for complete reference implementation.

