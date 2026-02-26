# Available Attributes Reference

Complete list of rule attributes available per event type.

## Inventory Level Attributes

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

## Inventory Item Attributes

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

## Product Attributes

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

## Product Variant Attributes

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

## Product Tag Attributes

Available for events: `product-tag.updated`

**Primitive Fields:**
- `product_tag.id` - Tag ID
- `product_tag.value` - Tag value
- `product_tag.created_at` - Creation timestamp
- `product_tag.updated_at` - Update timestamp

## Product Category Attributes

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

## See Also

- [Configuration](./configuration.md)
