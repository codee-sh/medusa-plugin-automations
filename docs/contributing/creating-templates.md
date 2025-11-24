# Creating Custom Templates

This guide explains how to create new email templates for the plugin. If you just want to use existing templates, see [Templates Documentation](../templates.md).

## Overview

Templates are built using [React Email](https://react.email) components and use i18next for translations. Each template consists of:

- React Email component for rendering HTML
- Translation files (JSON format)
- TypeScript types for template data
- Registration in the template registry

## Template Structure

Create a new folder in `src/templates/emails/your-template-name/` with the following structure:

```
your-template-name/
  ├── template.tsx          # React Email template component
  ├── index.ts              # Template rendering functions
  ├── translations/         # Translation files
  │   ├── pl.json
  │   ├── en.json
  │   └── index.ts
  └── types.ts              # TypeScript types
```

## Step-by-Step Guide

### 1. Create Translation Files

Start by creating translation files in JSON format:

**translations/pl.json**:
```json
{
  "general": {
    "headerTitle": "Tytuł emaila z {{variable}}",
    "headerDescription": "Opis emaila",
    "labels": {
      "field1": "Etykieta pola 1",
      "field2": "Etykieta pola 2"
    },
    "footer": "Stopka emaila"
  }
}
```

**translations/en.json**:
```json
{
  "general": {
    "headerTitle": "Email title with {{variable}}",
    "headerDescription": "Email description",
    "labels": {
      "field1": "Field 1 label",
      "field2": "Field 2 label"
    },
    "footer": "Email footer"
  }
}
```

**translations/index.ts**:
```typescript
import pl from "./pl.json";
import en from "./en.json";

export const translations = {
  pl,
  en,
};
```

### 2. Define TypeScript Types

**types.ts**:
```typescript
export interface YourTemplateDataType {
  variable: string;
  field1: string;
  field2: string;
  // ... other fields
}
```

### 3. Create React Email Template

**template.tsx**:
```typescript
import React from "react";
import { Html, Tailwind, Head, Text, Body, Container, pixelBasedPreset, Section, Row, Column, Heading, Hr } from "@react-email/components";
import { render, pretty, toPlainText } from "@react-email/render";
import { YourTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { escapeHtml } from "../../shared/utils";

export function renderHTMLReact(
  data: YourTemplateDataType,
  options: TemplateOptionsType
): React.ReactNode {
  const theme = options.theme || {};
  const i18n = options.i18n;
  
  if (!i18n) {
    throw new Error("i18n is required in options. It should be provided by renderTemplate.");
  }

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: theme
        }}
      >
        <Body className="mx-auto my-auto px-4 font-arial font-normal text-base bg-ui-bg text-ui-text">         
          <Container>
            <Section>
              <Heading className="text-xl text-center font-bold mb-4">
                {i18n.t('headerTitle', data)}
              </Heading>
              <Text className="text-center mb-4">
                {i18n.t('headerDescription', data)}
              </Text>
            </Section>

            <Hr className="my-4 border-ui-border" />

            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.field1', data)}</Column>
                <Column className="text-right">{escapeHtml(data.field1)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            <Section>
              <Text className="text-sm text-ui-text text-center">
                {i18n.t('footer', data)}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function renderHTML(
  data: YourTemplateDataType,
  options: TemplateOptionsType
): Promise<string> {
  return await pretty(await render(renderHTMLReact(data, options)));
}

export async function renderText(
  data: YourTemplateDataType,
  options: TemplateOptionsType
): Promise<string> {
  const html = await render(renderHTMLReact(data, options));
  return toPlainText(html);
}
```

### 4. Create Template Index

**index.ts**:
```typescript
import { YourTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { renderHTML, renderText } from "./template";

export async function getYourTemplateHtml(
  data: YourTemplateDataType,
  options: TemplateOptionsType
): Promise<string> {
  return await renderHTML(data, options);
}

export async function getYourTemplateText(
  data: YourTemplateDataType,
  options: TemplateOptionsType
): Promise<string> {
  return await renderText(data, options);
}
```

### 5. Register Template

Add your template to `src/templates/emails/index.ts`:

```typescript
import { getYourTemplateHtml, getYourTemplateText } from "./your-template-name/index";
import { translations as yourTemplateTranslations } from "./your-template-name/translations";

// Add to TEMPLATES_NAMES
export const TEMPLATES_NAMES = {
  // ... existing templates
  YOUR_TEMPLATE: "your-template-name",
} as const;

// Add to templateTranslationsRegistry
const templateTranslationsRegistry: Record<TemplateName, Record<string, any>> = {
  // ... existing templates
  [TEMPLATES_NAMES.YOUR_TEMPLATE]: yourTemplateTranslations,
};

// Add to templateRegistry
const templateRegistry: Record<TemplateName, TemplateRenderer> = {
  // ... existing templates
  [TEMPLATES_NAMES.YOUR_TEMPLATE]: {
    getHtml: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getYourTemplateHtml(data, options as any);
    },
    getText: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getYourTemplateText(data, options as any);
    },
  },
};
```

## Template Structure Details

### React Email Components Used

Templates utilize the following React Email components:
- `Html`, `Head`, `Body` - Email structure
- `Container`, `Section`, `Row`, `Column` - Layout components
- `Text`, `Heading`, `Button`, `Hr` - Content components
- `Tailwind` - Styling with Tailwind CSS

### Translation System

- Translations use i18next with `{{variable}}` interpolation syntax
- The `general` wrapper in JSON files is automatically flattened
- Access translations using `i18n.t('key', data)` where `data` provides values for interpolation
- Translations are automatically applied based on the `locale` option

### Styling

- Use Tailwind CSS classes with email-safe presets
- The `pixelBasedPreset` ensures compatibility with email clients
- Theme customization is supported through the `theme` option

## Best Practices

1. **Use escapeHtml**: Always escape user-provided data using `escapeHtml()` utility
2. **Follow existing patterns**: Look at `order-placed` or `contact-form` templates for reference
3. **Test both locales**: Ensure translations work for all supported locales
4. **Validate data**: Add type checking for template data
5. **Keep it simple**: Email clients have limited CSS support, keep designs simple

## See Also

- [React Email Documentation](https://react.email/docs)
- [Existing Templates](../templates/) - Reference implementations
- [Translations Documentation](../translations.md) - Translation system details

