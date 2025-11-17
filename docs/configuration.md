# Configuration Documentation

Complete guide to configuring the `@codee_team/medusa-plugin-notification` plugin.

## Plugin Registration

Register the plugin in your `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee_team/medusa-plugin-notification",
      options: {
        // Plugin options here
      }
    }
  ]
})
```

## Configuration Options

### `customTranslations`

Override default translations for templates. 

**Type**: `Record<string, Record<string, Record<string, any>>>`

See [Translations Documentation](./translations.md) for detailed information, examples, and best practices.

## Notification Provider Configuration

The plugin works with Medusa's notification module. You need to configure a notification provider to send emails.

The template system is compatible with any Medusa notification provider, including SendGrid, Resend, and other email providers. When using `content` instead of `template` in `createNotifications`, providers will use your custom HTML instead of their own templates.

See [Templates Documentation](./templates.md) for examples of using templates with notification providers.

## Subscribers

The plugin includes a built-in subscriber for `order.placed` events that automatically sends email notifications when orders are placed.

To customize behavior:
- Override translations via plugin options (see [Translations Documentation](./translations.md))
- Create your own subscriber using template rendering functions (see [Templates Documentation](./templates.md))

## Complete Configuration Example

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee_team/medusa-plugin-notification",
      options: {
        customTranslations: {
          "order-placed": {
            pl: {
              headerTitle: ({ data }) => `Zamówienie #${data.orderNumber} zostało złożone`
            }
          }
        }
      }
    }
  ],
  // Configure your notification provider in modules
  // See Medusa documentation for provider setup
})
```

See [Translations Documentation](./translations.md) for more examples of custom translations.

## Troubleshooting

### Translations Not Applied

- Ensure `customTranslations` structure matches: `templateName > locale > translations`
- Check that locale matches supported locales (`pl`, `en`)
- Verify that base translations are preserved when overriding

### Templates Not Rendering

- Verify template name matches `TEMPLATES_NAMES` constants
- Check that all required data fields are provided
- Ensure notification provider is properly configured

### Emails Not Sending

- Verify notification provider is properly configured
- Check that you're using `content` instead of `template` in `createNotifications`
- Ensure provider credentials and settings are correct

