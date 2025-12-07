# Configuration Documentation

Complete guide to configuring the `@codee-sh/medusa-plugin-automations` plugin.

## Plugin Registration

Register the plugin in your `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-automations",
      options: {
        // Plugin options here
      }
    }
  ]
})
```

## Database Migrations

The plugin includes database migrations for automation models. After installing the plugin, run migrations:

```bash
medusa migrations run
```

This will create the following tables:
- `mpn_automation_trigger` - Stores automation triggers
- `mpn_automation_rule` - Stores automation rules
- `mpn_automation_rule_value` - Stores rule values
- `mpn_automation_state` - Stores automation state
- `npm_automation_action` - Stores automation actions

## Built-in Subscribers

The plugin includes built-in subscribers that listen to Medusa events and evaluate automation rules. These subscribers are registered automatically when the plugin is loaded.

### Available Subscribers

#### `inventory.inventory-level.updated`

Evaluates automations when inventory levels are updated.

- **Event**: `inventory.inventory-level.updated`
- **Context**: Provides `inventory_level` data with related `inventory_item`

#### `inventory.inventory-item.updated`

Evaluates automations when inventory items are updated.

- **Event**: `inventory.inventory-item.updated`
- **Context**: Provides `inventory_item` data

#### `inventory.inventory-reservation-item.updated` (in progress)

Evaluates automations when inventory reservations are updated.

- **Event**: `inventory.inventory-reservation-item.updated`
- **Context**: Provides reservation data

#### `order.placed` (in progress)

Evaluates automations when orders are placed.

- **Event**: `order.placed`
- **Context**: Provides order data

#### `order.completed` (in progress)

Evaluates automations when orders are completed.

- **Event**: `order.completed`
- **Context**: Provides order data

#### `payment.captured` (in progress)

Evaluates automations when payments are captured.

- **Event**: `payment.captured`
- **Context**: Provides payment data

### How Subscribers Work

1. **Event Detection**: Subscribers listen to Medusa events
2. **Data Fetching**: When an event is triggered, the subscriber fetches relevant data
3. **Trigger Evaluation**: The subscriber retrieves all active triggers for the event
4. **Rule Evaluation**: For each trigger, rules are evaluated against the event context
5. **Action Execution**: If all rules pass, actions are executed (e.g., send notifications)

## Slack Notification Provider

The plugin includes a Slack notification provider with Block Kit support for rich, interactive notifications.

### Registering the Slack Provider

Add the Slack provider to your `medusa-config.ts` in the `modules` section:

```typescript
import { Modules } from '@medusajs/utils'

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-automations",
      options: {
        // Plugin options
      }
    }
  ],
  modules: [
    {
      key: Modules.NOTIFICATION,
      resolve: "@medusajs/notification",
      options: {
        providers: [
          {
            resolve: '@codee-sh/medusa-plugin-automations/providers/slack',
            id: 'mpn-slack',
            options: {
              channels: ["slack"],
              webhook_url: process.env.SLACK_WEBHOOK_URL,
              admin_url: process.env.ADMIN_URL,
            }
          }
        ]
      }
    }
  ]
})
```

### Slack Provider Options

- `webhook_url` (required) - Slack webhook URL for sending notifications
- `admin_url` (required) - Base URL for admin panel links in notifications
- `channels` - Array of supported channels (should include "slack")

### Slack Block Kit Support

The Slack provider supports Block Kit formatting, allowing you to create rich notifications with:

- **Headers** - Prominent header blocks with emoji support
- **Action Buttons** - Interactive buttons that link to admin panel pages
- **Dividers** - Visual separators between sections
- **Sections** - Text sections with markdown formatting

### Notification Templates

The Slack provider uses a template-based system. Templates are defined per notification type and can include:

- Custom text content
- Block Kit blocks for rich formatting
- Dynamic data from the automation context
- Interactive elements (buttons, links)

Currently supported templates:
- `inventory-level` - Notifications for inventory level updates

### Template Customization

Templates are handled by the `getNotificationBlocks` and `getNotificationText` methods in the Slack provider service. You can extend the provider to add custom templates or modify existing ones.

## Complete Configuration Example

```typescript
import { Modules } from '@medusajs/utils'

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-automations",
      options: {
        // Plugin options
      }
    }
  ],
  modules: [
    {
      key: Modules.NOTIFICATION,
      resolve: "@medusajs/notification",
      options: {
        providers: [
          {
            resolve: '@codee-sh/medusa-plugin-automations/providers/slack',
            id: 'mpn-slack',
            options: {
              channels: ["slack"],
              webhook_url: process.env.SLACK_WEBHOOK_URL,
              admin_url: process.env.ADMIN_URL,
            }
          }
        ]
      }
    }
  ]
})
```

## Troubleshooting

### Automations Not Triggering

- Verify that subscribers are registered and listening to events
- Check that triggers are active (`active: true`)
- Ensure trigger event names match Medusa event names exactly
- Verify that rules are correctly configured

### Rules Not Evaluating

- Check that rule attributes exist in the context data
- Verify that operators and values are correct
- Ensure rule values match the expected data types

### Migrations Not Running

- Ensure you're running migrations after plugin installation
- Check that database connection is properly configured
- Verify that plugin is correctly registered in `medusa-config.ts`

