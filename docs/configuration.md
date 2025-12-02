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
        ruleAttributes: [
          // Custom rule attributes (optional)
        ]
      }
    }
  ]
})
```

## Configuration Options

### `ruleAttributes`

Add custom rule attributes to extend the available conditions for automation rules.

**Type**: `Array<RuleAttribute>`

**Example**:

```typescript
import type { RuleAttribute } from "@codee-sh/medusa-plugin-automations/modules/mpn-automation/rules/types"

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-automations",
      options: {
        ruleAttributes: [
          {
            id: "custom_product_price",
            value: "product.price",
            label: "Product Price",
            description: "The price of the product",
            field_type: "number",
            group: "product",
          },
          {
            id: "custom_order_total",
            value: "order.total",
            label: "Order Total",
            description: "The total amount of the order",
            field_type: "number",
            group: "order",
          }
        ]
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
- **Available Rule Attributes**: All `inventory_level.*` and `inventory_item.*` attributes

#### `inventory.inventory-item.updated`

Evaluates automations when inventory items are updated.

- **Event**: `inventory.inventory-item.updated`
- **Context**: Provides `inventory_item` data
- **Available Rule Attributes**: All `inventory_item.*` attributes

#### `inventory.inventory-reservation-item.updated`

Evaluates automations when inventory reservations are updated.

- **Event**: `inventory.inventory-reservation-item.updated`
- **Context**: Provides reservation data
- **Available Rule Attributes**: Reservation-related attributes

#### `order.placed`

Evaluates automations when orders are placed.

- **Event**: `order.placed`
- **Context**: Provides order data
- **Available Rule Attributes**: Order-related attributes (when implemented)

#### `order.completed`

Evaluates automations when orders are completed.

- **Event**: `order.completed`
- **Context**: Provides order data
- **Available Rule Attributes**: Order-related attributes (when implemented)

#### `payment.captured`

Evaluates automations when payments are captured.

- **Event**: `payment.captured`
- **Context**: Provides payment data
- **Available Rule Attributes**: Payment-related attributes (when implemented)

### How Subscribers Work

1. **Event Detection**: Subscribers listen to Medusa events
2. **Data Fetching**: When an event is triggered, the subscriber fetches relevant data
3. **Trigger Evaluation**: The subscriber retrieves all active triggers for the event
4. **Rule Evaluation**: For each trigger, rules are evaluated against the event context
5. **Action Execution**: If all rules pass, actions are executed (e.g., send notifications)

### Creating Custom Subscribers

You can create custom subscribers that integrate with the automation system:

```typescript
import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { validateNotificationTriggersByEventWorkflow } from "@codee-sh/medusa-plugin-automations/workflows/mpn-automation/validate-notification-triggers-by-event"

export default async function customEventHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const { result: validationResult } = await validateNotificationTriggersByEventWorkflow(container).run({
    input: {
      event_name: "custom.event.name",
      context: {
        // Your custom context data
        customData: data,
      },
    }
  })

  // Process validation results
  for (const result of validationResult.results) {
    if (result.passed) {
      // Execute actions for triggers that passed
      console.log(`Trigger ${result.trigger_name} passed validation`)
    }
  }
}

export const config: SubscriberConfig = {
  event: "custom.event.name",
}
```

## Rule Attributes

Rule attributes define what data can be used in automation conditions. The plugin includes built-in attributes for inventory management.

### Built-in Rule Attributes

#### Inventory Level Attributes

- `inventory_level.id` - Inventory level ID
- `inventory_level.location_id` - Location ID
- `inventory_level.stocked_quantity` - Stocked quantity
- `inventory_level.reserved_quantity` - Reserved quantity
- `inventory_level.available_quantity` - Available quantity
- `inventory_level.incoming_quantity` - Incoming quantity

#### Inventory Item Attributes

- `inventory_item.id` - Inventory item ID
- `inventory_item.sku` - SKU
- `inventory_item.title` - Item title
- `inventory_item.origin_country` - Origin country
- `inventory_item.weight` - Weight
- `inventory_item.length`, `inventory_item.height`, `inventory_item.width` - Dimensions
- `inventory_item.requires_shipping` - Requires shipping flag
- And more...

### Extending Rule Attributes

Add custom rule attributes via plugin options:

```typescript
import type { RuleAttribute } from "@codee-sh/medusa-plugin-automations/modules/mpn-automation/rules/types"

const customAttributes: RuleAttribute[] = [
  {
    id: "product_price",
    value: "product.price",
    label: "Product Price",
    description: "The price of the product",
    field_type: "number",
    group: "product",
  }
]

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-automations",
      options: {
        ruleAttributes: customAttributes
      }
    }
  ]
})
```

## Workflows

The plugin exports workflows for managing automations:

### `editAutomationWorkflow`

Creates or updates an automation.

```typescript
import { editAutomationWorkflow } from "@codee-sh/medusa-plugin-automations/workflows/mpn-automation/edit-automation"

const { result } = await editAutomationWorkflow(container).run({
  input: {
    id: "automation_id",
    items: [
      {
        id: "rule_id",
        name: "Rule Name"
      }
    ]
  }
})
```

## Complete Configuration Example

```typescript
import type { RuleAttribute } from "@codee-sh/medusa-plugin-automations/modules/mpn-automation/rules/types"

const customRuleAttributes: RuleAttribute[] = [
  {
    id: "order_total",
    value: "order.total",
    label: "Order Total",
    description: "The total amount of the order",
    field_type: "number",
    group: "order",
  }
]

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-automations",
      options: {
        ruleAttributes: customRuleAttributes
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

