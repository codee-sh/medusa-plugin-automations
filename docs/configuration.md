# Configuration Documentation

How to configure `@codee-sh/medusa-plugin-automations`.

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
- `mpn_automation_rule_value` - Stores rule values (uses JSONB to support strings, numbers, arrays, and null)
- `mpn_automation_state` - Stores automation state
- `npm_automation_action` - Stores automation actions

**Note**: The `mpn_automation_rule_value.value` column uses JSONB to support various data types (strings, numbers, arrays, null), enabling complex rule conditions with array operations and relation-based attributes.

## Built-in Subscribers

The plugin includes built-in subscribers that listen to Medusa events and evaluate automation rules. These subscribers are registered automatically when the plugin is loaded.

### Available Subscribers

See [Available Subscribers](./available-subscribers.md).

### How Subscribers Work

1. **Event Detection**: Subscribers listen to Medusa events
2. **Data Fetching**: When an event is triggered, the subscriber fetches relevant data (including relations when needed)
3. **Trigger Evaluation**: The subscriber retrieves all active triggers for the event
4. **Rule Evaluation**: For each trigger, rules are evaluated against the event context:
   - Rules can check primitive fields, relations (arrays), and nested objects
   - Supports various operators including array operations (`in`, `not in`, `contains`, `not contains`) and null checks (`empty`, `not empty`)
5. **Action Execution**: If all rules pass, configured actions are executed (e.g., send notifications, execute custom logic)

## Actions

Automations can execute various types of actions when rules pass. Actions are extensible and can be customized to perform different tasks.

### Built-in Action Types

The plugin includes built-in action handlers:

- **Email** - Send email notifications
- **Slack** - Send Slack messages (see [Slack Notification Provider](#slack-notification-provider) section for details)

### Action Handlers

Action handlers define how actions are executed. Each action handler implements the `ActionHandler` interface and can be enabled or disabled via plugin configuration.

Action configuration fields for the admin form are
loaded dynamically based on the selected action type.

### Configuring Actions

Enable or disable specific actions in your `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-automations",
      options: {
        automations: {
          actionsEnabled: {
            email: true,
          },
          actionHandlers: [
            // Custom action handlers (optional)
          ]
        }
      }
    }
  ]
})
```

### Custom Action Handlers

See [Custom Action Handlers](./custom-action-handlers.md).

## Template Rendering

Email and Slack actions render templates with
`@codee-sh/medusa-plugin-notification-emails`.
Templates are grouped as `System`, `Database`,
and `External` in the admin form.

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

## Troubleshooting

### Automations Not Triggering

- Verify that subscribers are registered and listening to events
- Check that triggers are active (`active: true`)
- Ensure trigger event names match Medusa event names exactly
- Verify that rules are correctly configured

### Rules Not Evaluating

- Check that rule attributes exist in the context data
- Verify that operators and values are correct
- Ensure rule values match the expected data types:
  - For array operators (`in`, `not in`, `contains`, `not contains`): Use array values
  - For basic operators: Use single string or number values
  - For `empty`/`not empty`: No value needed
- Verify relation-based attributes are correctly formatted (e.g., `product.tags.id` for array relations)
- Check that array attributes are being compared with array operators

### Migrations Not Running

- Ensure you're running migrations after plugin installation
- Check that database connection is properly configured
- Verify that plugin is correctly registered in `medusa-config.ts`
- **Note**: If upgrading from an older version, ensure the `mpn_automation_rule_value.value` column has been migrated from `text` to `jsonb` to support array values and new operators

## Rule Values

Rule values support multiple data types stored as JSONB:

- **Strings**: `"Electronics"`
- **Numbers**: `10`, `100.5`
- **Arrays**: `["tag-1", "tag-2"]` or `[1, 2, 3]`
- **Null**: `null` (for empty checks)

When using array operators (`in`, `not in`, `contains`, `not contains`), provide array values. For basic operators, provide single values.

## See Also

- [Admin Panel](./admin.md)
- [Available Attributes Reference](./attributes.md)
- [Rule Operators](./rule-operators.md)
- [Custom Action Handlers](./custom-action-handlers.md)
- [Available Subscribers](./available-subscribers.md)
