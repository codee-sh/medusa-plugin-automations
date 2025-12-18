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
- `mpn_automation_rule_value` - Stores rule values (uses JSONB to support strings, numbers, arrays, and null)
- `mpn_automation_state` - Stores automation state
- `npm_automation_action` - Stores automation actions

**Note**: The `mpn_automation_rule_value.value` column uses JSONB to support various data types (strings, numbers, arrays, null), enabling complex rule conditions with array operations and relation-based attributes.

## Built-in Subscribers

The plugin includes built-in subscribers that listen to Medusa events and evaluate automation rules. These subscribers are registered automatically when the plugin is loaded.

### Available Subscribers

#### `inventory.inventory-level.updated`

Evaluates automations when inventory levels are updated.

- **Event**: `inventory.inventory-level.updated`
- **Context**: Provides `inventory_level` data with related `inventory_item` and `stock_locations`
- **Available Attributes**: See [Available Attributes Reference](#available-attributes-reference) section

#### `inventory.inventory-item.updated`

Evaluates automations when inventory items are updated.

- **Event**: `inventory.inventory-item.updated`
- **Context**: Provides `inventory_item` data
- **Available Attributes**: See [Available Attributes Reference](#available-attributes-reference) section

#### `inventory.inventory-reservation-item.updated` (in progress)

Evaluates automations when inventory reservations are updated.

- **Event**: `inventory.inventory-reservation-item.updated`
- **Context**: Provides reservation data

#### `product.updated`

Evaluates automations when products are updated.

- **Event**: `product.updated`
- **Context**: Provides `product` data with relations (tags, categories, variants, type, collection)
- **Available Attributes**: See [Available Attributes Reference](#available-attributes-reference) section

#### `product-variant.updated`

Evaluates automations when product variants are updated.

- **Event**: `product-variant.updated`
- **Context**: Provides `product_variant` data
- **Available Attributes**: See [Available Attributes Reference](#available-attributes-reference) section

#### `product-tag.updated`

Evaluates automations when product tags are updated.

- **Event**: `product-tag.updated`
- **Context**: Provides `product_tag` data
- **Available Attributes**: See [Available Attributes Reference](#available-attributes-reference) section

#### `product-category.updated`

Evaluates automations when product categories are updated.

- **Event**: `product-category.updated`
- **Context**: Provides `product_category` data
- **Available Attributes**: See [Available Attributes Reference](#available-attributes-reference) section

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

You can create custom action handlers to extend automation capabilities:

```typescript
import { ActionHandler } from "@codee-sh/medusa-plugin-automations/modules/mpn-automation/types/action-handler"

class CustomActionHandler implements ActionHandler {
  id = "custom-action"
  label = "Custom Action"
  description = "Performs a custom action"

  async executeAction({ action, context, container }) {
    // Your custom logic here
    return {
      success: true,
      message: "Custom action executed"
    }
  }
}

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-automations",
      options: {
        automations: {
          actionHandlers: [
            new CustomActionHandler()
          ],
          actionsEnabled: {
            "custom-action": true
          }
        }
      }
    }
  ]
})
```

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

## Rule Operators

The plugin supports various operators for rule conditions:

### Basic Operators
- `equals` (`eq`) - Exact match
- `not equals` (`ne`) - Not equal
- `greater than` (`gt`) - Numeric comparison
- `less than` (`lt`) - Numeric comparison
- `greater than or equal` (`gte`) - Numeric comparison
- `less than or equal` (`lte`) - Numeric comparison

### Array Operators
- `in` - Check if value exists in array (e.g., `product.tags.id IN [tag-1, tag-2]`)
- `not in` - Check if value does not exist in array
- `contains` - Check if array contains value (partial match)
- `not contains` - Check if array does not contain value

### Null Checks
- `empty` - Check if value is null or empty
- `not empty` - Check if value is not null or empty

## Rule Values

Rule values support multiple data types stored as JSONB:

- **Strings**: `"Electronics"`
- **Numbers**: `10`, `100.5`
- **Arrays**: `["tag-1", "tag-2"]` or `[1, 2, 3]`
- **Null**: `null` (for empty checks)

When using array operators (`in`, `not in`, `contains`, `not contains`), provide array values. For basic operators, provide single values.

## Available Attributes Reference

This section provides a comprehensive list of available attributes for each event type. These attributes can be used in rule conditions.

### Inventory Level Attributes

Available for events: `inventory.inventory-level.created`, `inventory.inventory-level.updated`, `inventory.inventory-level.deleted`

**Primitive Fields:**
- `inventory_level.available_quantity` - Available quantity
- `inventory_level.reserved_quantity` - Reserved quantity
- `inventory_level.stocked_quantity` - Stocked quantity
- `inventory_level.location_id` - Location ID
- `inventory_level.inventory_item_id` - Inventory item ID
- `inventory_level.created_at` - Creation timestamp
- `inventory_level.updated_at` - Update timestamp

**Relation-Based Attributes:**
- `inventory_level.inventory_item.*` - All inventory item fields (object)
- `inventory_level.stock_locations.id` - Stock location IDs (array)
- `inventory_level.stock_locations.name` - Stock location names (array)
- `inventory_level.stock_locations.address` - Stock location addresses (array)
- `inventory_level.stock_locations.metadata` - Stock location metadata (array)

### Inventory Item Attributes

Available for events: `inventory.inventory-item.created`, `inventory.inventory-item.updated`, `inventory.inventory-item.deleted`

**Primitive Fields:**
- `inventory_item.sku` - SKU code
- `inventory_item.origin_country` - Origin country
- `inventory_item.hs_code` - HS code
- `inventory_item.mid_code` - MID code
- `inventory_item.material` - Material
- `inventory_item.weight` - Weight
- `inventory_item.length` - Length
- `inventory_item.height` - Height
- `inventory_item.width` - Width
- `inventory_item.metadata` - Metadata (object)
- `inventory_item.created_at` - Creation timestamp
- `inventory_item.updated_at` - Update timestamp

### Product Attributes

Available for events: `product.updated`

**Primitive Fields:**
- `product.id` - Product ID
- `product.title` - Product title
- `product.description` - Product description
- `product.subtitle` - Product subtitle
- `product.handle` - Product handle
- `product.is_giftcard` - Is gift card
- `product.status` - Product status
- `product.thumbnail` - Thumbnail URL
- `product.hs_code` - HS code
- `product.origin_country` - Origin country
- `product.mid_code` - MID code
- `product.material` - Material
- `product.weight` - Weight
- `product.length` - Length
- `product.height` - Height
- `product.width` - Width
- `product.metadata` - Metadata (object)
- `product.created_at` - Creation timestamp
- `product.updated_at` - Update timestamp
- `product.deleted_at` - Deletion timestamp

**Relation-Based Attributes (Arrays):**
- `product.tags.id` - Product tag IDs (array)
- `product.tags.value` - Product tag values (array)
- `product.categories.id` - Category IDs (array)
- `product.categories.name` - Category names (array)
- `product.categories.handle` - Category handles (array)
- `product.variants.*` - Product variants (array of objects)
- `product.type.*` - Product type (object)
- `product.collection.*` - Product collection (object)

### Product Variant Attributes

Available for events: `product-variant.updated`

**Primitive Fields:**
- `product_variant.id` - Variant ID
- `product_variant.title` - Variant title
- `product_variant.sku` - SKU code
- `product_variant.barcode` - Barcode
- `product_variant.ean` - EAN code
- `product_variant.upc` - UPC code
- `product_variant.allow_backorder` - Allow backorder
- `product_variant.manage_inventory` - Manage inventory
- `product_variant.hs_code` - HS code
- `product_variant.origin_country` - Origin country
- `product_variant.mid_code` - MID code
- `product_variant.material` - Material
- `product_variant.weight` - Weight
- `product_variant.length` - Length
- `product_variant.height` - Height
- `product_variant.width` - Width
- `product_variant.metadata` - Metadata (object)
- `product_variant.variant_rank` - Variant rank
- `product_variant.product_id` - Product ID
- `product_variant.created_at` - Creation timestamp
- `product_variant.updated_at` - Update timestamp

### Product Tag Attributes

Available for events: `product-tag.updated`

**Primitive Fields:**
- `product_tag.id` - Tag ID
- `product_tag.value` - Tag value
- `product_tag.created_at` - Creation timestamp
- `product_tag.updated_at` - Update timestamp

### Product Category Attributes

Available for events: `product-category.updated`

**Primitive Fields:**
- `product_category.id` - Category ID
- `product_category.name` - Category name
- `product_category.description` - Category description
- `product_category.handle` - Category handle
- `product_category.is_active` - Is active
- `product_category.is_internal` - Is internal
- `product_category.rank` - Category rank
- `product_category.parent_category_id` - Parent category ID
- `product_category.created_at` - Creation timestamp
- `product_category.updated_at` - Update timestamp

