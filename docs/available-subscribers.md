# Available Subscribers

List of built-in subscribers and the events they handle.

## `inventory.inventory-level.updated`

Evaluates automations when inventory levels are updated.

- **Event**: `inventory.inventory-level.updated`
- **Context**: Provides `inventory_level` data with related `inventory_item` and `stock_locations`
- **Available Attributes**: See [Available Attributes Reference](./attributes.md)

## `inventory.inventory-item.updated`

Evaluates automations when inventory items are updated.

- **Event**: `inventory.inventory-item.updated`
- **Context**: Provides `inventory_item` data
- **Available Attributes**: See [Available Attributes Reference](./attributes.md)

## `inventory.reservation-item.updated`

Evaluates automations when inventory reservations are updated.

- **Event**: `inventory.reservation-item.updated`
- **Context**: Provides reservation data

## `product.updated`

Evaluates automations when products are updated.

- **Event**: `product.updated`
- **Context**: Provides `product` data with relations (tags, categories, variants, type, collection)
- **Available Attributes**: See [Available Attributes Reference](./attributes.md)

## `product-variant.updated`

Evaluates automations when product variants are updated.

- **Event**: `product-variant.updated`
- **Context**: Provides `product_variant` data
- **Available Attributes**: See [Available Attributes Reference](./attributes.md)

## `product-tag.updated`

Evaluates automations when product tags are updated.

- **Event**: `product-tag.updated`
- **Context**: Provides `product_tag` data
- **Available Attributes**: See [Available Attributes Reference](./attributes.md)

## `product-category.updated`

Evaluates automations when product categories are updated.

- **Event**: `product-category.updated`
- **Context**: Provides `product_category` data
- **Available Attributes**: See [Available Attributes Reference](./attributes.md)

## See Also

- [Configuration](./configuration.md)
