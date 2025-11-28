# Medusa plugin notification

A comprehensive notification automation plugin for Medusa v2 that provides a flexible rule-based notification system with triggers, conditions, and actions. Create automated notifications based on events, schedules, or manual triggers with customizable rules.

## Features

- **Automation Triggers**: Create notification automations triggered by events, schedules, or manual actions
- **Rule-Based Conditions**: Define complex conditions using rule attributes (e.g., inventory levels, order status)
- **Event Subscribers**: Built-in subscribers for common Medusa events (inventory updates, order events, payment events)
- **Admin Panel**: Manage automations directly from Medusa Admin
- **Flexible Rules**: Support for multiple rule types and operators (equals, greater than, less than, contains, etc.)
- **Type-Safe**: Full TypeScript support with exported types and workflows
- **Extensible**: Add custom rule attributes and extend functionality via plugin options

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

### 2. Run Migrations

The plugin includes database migrations for automation models. Run migrations to set up the required tables:

```bash
medusa migrations run
```

### 3. Access Admin Panel

Navigate to **Notifications > Automations** in your Medusa Admin dashboard, or directly access:

```
/app/notifications/automations
```

## How It Works

### Automation Triggers

Automations are triggered by:
- **Events**: Medusa events (e.g., `inventory.inventory-level.updated`, `order.placed`)
- **Schedule**: Time-based triggers with configurable intervals
- **Manual**: Triggered manually from the admin panel

### Rules and Conditions

Each automation can have multiple rules that define when notifications should be sent:

- **Rule Attributes**: Available attributes for conditions (e.g., `inventory_level.available_quantity`, `inventory_item.sku`)
- **Operators**: Comparison operators (equals, greater than, less than, contains, in, etc.)
- **Rule Values**: Values to compare against

See [Configuration Documentation](./docs/configuration.md) for details on built-in subscribers, available rule attributes, and extending functionality.

## Admin Panel

Access the automations management interface in Medusa Admin at `/app/notifications/automations`. See [Admin Panel Documentation](./docs/admin.md) for details.

## Documentation

- [Configuration](./docs/configuration.md) - Plugin configuration options and extending functionality
- [Admin Panel](./docs/admin.md) - Admin interface usage and automation management

## Exports

The plugin exports the following:

- `@codee-sh/medusa-plugin-notification/workflows` - Workflow functions for automation management
- `@codee-sh/medusa-plugin-notification/modules/mpn-automation` - Automation module service
- `@codee-sh/medusa-plugin-notification/utils` - Utility functions

## Related Plugins

For email templates and rendering functionality, see [@codee-sh/medusa-plugin-notification-emails](https://github.com/codee-sh/medusa-plugin-notification-emails).

## License

MIT

## Author

Codee Team - [https://codee.dev](https://codee.dev)
