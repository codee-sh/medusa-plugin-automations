# Configuration Documentation

Complete guide to configuring the `@codee-sh/medusa-plugin-notification` plugin.

## Plugin Registration

Register the plugin in your `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification",
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

The plugin includes built-in subscribers that automatically send email notifications for various Medusa events. These subscribers are registered automatically when the plugin is loaded.

### Available Subscribers

#### `order.placed`

Sends an order confirmation email when a new order is placed.

- **Event**: `order.placed`
- **Template**: `order-placed`
- **Trigger**: Automatically triggered when an order is created
- **Email sent to**: Customer email address from the order

**Template Data Includes**:
- Order number and date
- Sales channel information
- Order items with prices and quantities
- Shipping and billing addresses
- Order summary (totals, taxes, discounts)
- Order URL (if available)

#### `order.completed`

Sends an order completion notification when an order is marked as completed.

- **Event**: `order.completed`
- **Template**: `order-completed`
- **Trigger**: Automatically triggered when an order status changes to completed
- **Email sent to**: Customer email address from the order

**Template Data Includes**:
- Order number and dates (order date and completion date)
- Sales channel information
- Order items with prices and quantities
- Shipping and billing addresses
- Order summary (totals, taxes, discounts)
- Order URL (if available)

### Customizing Subscribers

To customize subscriber behavior:

1. **Override translations**: Use `customTranslations` in plugin options to customize email content (see [Translations Documentation](./translations.md))

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification",
      options: {
        customTranslations: {
          "order-placed": {
            pl: {
              headerTitle: "#{{orderNumber}} - Twoje zamówienie"
            }
          },
          "order-completed": {
            pl: {
              headerTitle: "#{{orderNumber}} - Zamówienie zrealizowane"
            }
          }
        }
      }
    }
  ]
})
```

2. **Create custom subscribers**: Create your own subscribers using template rendering functions (see [Templates Documentation](./templates.md))

### How Subscribers Work

1. **Event Detection**: Subscribers listen to Medusa events (`order.placed`, `order.completed`)
2. **Data Fetching**: When an event is triggered, the subscriber fetches relevant data (order details, customer info, etc.)
3. **Template Rendering**: The subscriber uses `renderTemplate()` to generate HTML and plain text versions using React Email
4. **Notification Sending**: The rendered email is sent via Medusa's notification module using the configured provider
5. **Translation Support**: Custom translations from plugin options are automatically applied

### Disabling Subscribers

If you need to disable a subscriber, you can create your own subscriber that handles the same event and it will take precedence, or modify the plugin's subscriber files directly.

## Complete Configuration Example

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification",
      options: {
        customTranslations: {
          "order-placed": {
            pl: {
              // Use string interpolation with {{variable}} syntax
              headerTitle: "#{{orderNumber}} - Zamówienie zostało złożone",
              labels: {
                orderNumber: "Numer zamówienia"
              }
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

**Note**: Custom translations use JSON structure with string interpolation. Variables are replaced using `{{variable}}` syntax, where `variable` matches properties in the template data object.

See [Translations Documentation](./translations.md) for more examples and details about i18next interpolation.

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

