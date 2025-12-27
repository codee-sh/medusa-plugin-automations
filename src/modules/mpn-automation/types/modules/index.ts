import {
  INVENTORY_LEVEL_ATTRIBUTES,
  INVENTORY_ITEM_ATTRIBUTES,
} from "./inventory"
import { PRODUCT_ATTRIBUTES } from "./product"
import { PRODUCT_VARIANT_ATTRIBUTES } from "./product-variant"
import { PRODUCT_TAG_ATTRIBUTES } from "./product-tag"
import { PRODUCT_TYPE_ATTRIBUTES } from "./product-type"
import { PRODUCT_CATEGORY_ATTRIBUTES } from "./product-category"
import { ORDER_ATTRIBUTES } from "./order"
import { Attribute } from "../types"

/**
 * Metadata for an event - contains attributes for rules and templates
 */
export type EventMetadata = {
  eventName: string
  /**
   * Description of when this event is triggered
   * Example: "Triggered when a customer completes checkout and an order is created"
   */
  description?: string
  /**
   * Example scenarios when this event would fire
   * Example: ["Customer completes payment", "Order is confirmed"]
   */
  examples?: string[]
  attributes: Array<Attribute>
  templates: Array<{ value: string; name: string }>
}

/**
 * Get metadata for an event (attributes and template names)
 * Templates must be explicitly set in EVENT_METADATA_REGISTRY or in custom events
 */
export function getEventMetadata(
  eventName: string
): Partial<EventMetadata> {
  return EVENT_METADATA_REGISTRY[eventName] || {}
}

/**
 * Central registry mapping event names to their metadata
 * This allows us to:
 * - Define attributes for rules
 * - Map events to template names (multiple templates per event)
 * - Support both Medusa events and custom events
 */
const EVENT_METADATA_REGISTRY: Record<string, any> = {
  // Inventory Events
  "inventory.inventory-level.created": {
    description: "Triggered when a new inventory level is created for a location",
    examples: [
      "New stock location is added",
      "Inventory item is assigned to a location",
      "Initial stock is recorded"
    ],
    attributes: INVENTORY_LEVEL_ATTRIBUTES,
    templates: [
      {
        value: "inventory-level",
        name: "Inventory Level",
      },
    ],
  },
  "inventory.inventory-level.updated": {
    description: "Triggered when inventory level changes (stock quantity, reserved quantity, etc.)",
    examples: [
      "Stock quantity is updated",
      "Items are reserved or released",
      "Inventory adjustments are made"
    ],
    attributes: INVENTORY_LEVEL_ATTRIBUTES,
    templates: [
      {
        value: "inventory-level",
        name: "Inventory Level",
      },
    ],
  },
  "inventory.inventory-level.deleted": {
    description: "Triggered when an inventory level is deleted from a location",
    examples: [
      "Stock location is removed",
      "Inventory item is unassigned from a location",
      "Inventory level record is deleted"
    ],
    attributes: INVENTORY_LEVEL_ATTRIBUTES,
    templates: [
      {
        value: "inventory-level",
        name: "Inventory Level",
      },
    ],
  },
  "inventory.inventory-item.created": {
    description: "Triggered when a new inventory item is created",
    examples: [
      "New product variant is added to inventory",
      "Inventory item is registered in the system",
      "Stock tracking begins for a new item"
    ],
    attributes: INVENTORY_ITEM_ATTRIBUTES,
    templates: [
      {
        value: "inventory-item",
        name: "Inventory Item",
      },
    ],
  },
  "inventory.inventory-item.updated": {
    description: "Triggered when inventory item data is modified (quantities, location, etc.)",
    examples: [
      "Stock quantity changes",
      "Reserved quantity is updated",
      "Available quantity changes",
      "Incoming quantity is adjusted"
    ],
    attributes: INVENTORY_ITEM_ATTRIBUTES,
    templates: [
      {
        value: "inventory-item",
        name: "Inventory Item",
      },
    ],
  },
  "inventory.inventory-item.deleted": {
    description: "Triggered when an inventory item is deleted",
    examples: [
      "Product variant is removed from inventory",
      "Inventory item is discontinued",
      "Stock tracking is stopped for an item"
    ],
    attributes: INVENTORY_ITEM_ATTRIBUTES,
    templates: [
      {
        value: "inventory-item",
        name: "Inventory Item",
      },
    ],
  },
  "product.updated": {
    description: "Triggered when product data is modified (title, description, status, etc.)",
    examples: [
      "Product title or description changes",
      "Product status is updated",
      "Product metadata is modified"
    ],
    attributes: PRODUCT_ATTRIBUTES,
    templates: [
      {
        value: "product",
        name: "Product",
      },
    ],
  },
  "product-variant.updated": {
    description: "Triggered when product variant data is modified (SKU, price, inventory settings, etc.)",
    examples: [
      "Variant SKU is updated",
      "Variant price changes",
      "Inventory management settings change",
      "Variant attributes are modified"
    ],
    attributes: PRODUCT_VARIANT_ATTRIBUTES,
    templates: [
      {
        value: "product-variant",
        name: "Product Variant",
      },
    ],
  },
  "product-tag.updated": {
    description: "Triggered when a product tag is modified",
    examples: [
      "Tag name/value is changed",
      "Tag is renamed",
      "Tag metadata is updated"
    ],
    attributes: PRODUCT_TAG_ATTRIBUTES,
    templates: [
      {
        value: "product-tag",
        name: "Product Tag",
      },
    ],
  },
  "product-type.updated": {
    description: "Triggered when a product type is modified",
    examples: [
      "Product type name/value is changed",
      "Product type is renamed",
      "Product type metadata is updated"
    ],
    attributes: PRODUCT_TYPE_ATTRIBUTES,
    templates: [
      {
        value: "product-type",
        name: "Product Type",
      },
    ],
  },
  "product-category.updated": {
    description: "Triggered when a product category is modified (name, description, parent, etc.)",
    examples: [
      "Category name or description changes",
      "Category parent is changed",
      "Category status (active/inactive) is updated",
      "Category rank/order is modified"
    ],
    attributes: PRODUCT_CATEGORY_ATTRIBUTES,
    templates: [
      {
        value: "product-category",
        name: "Product Category",
      },
    ],
  },
  "order.updated": {
    description: "Triggered when any order data is modified (status, totals, items, etc.)",
    examples: [
      "Order status changes",
      "Order totals are recalculated",
      "Items are added or removed",
      "Payment collection status changes"
    ],
    attributes: ORDER_ATTRIBUTES,
    templates: [
      {
        value: "order-updated",
        name: "Order updated",
      },
    ],
  },
  "order.placed": {
    description: "Triggered when a customer completes checkout and an order is created",
    examples: [
      "Customer completes payment",
      "Order is confirmed",
      "Order enters the system"
    ],
    attributes: ORDER_ATTRIBUTES,
    templates: [
      {
        value: "order-placed",
        name: "Order placed",
      },
    ],
  },
  "order.canceled": {
    description: "Triggered when an order is canceled",
    examples: [
      "Customer cancels their order",
      "Merchant cancels an order",
      "Order is canceled due to payment failure",
      "Order cancellation is processed"
    ],
    attributes: ORDER_ATTRIBUTES,
    templates: [
      {
        value: "order-canceled",
        name: "Order canceled",
      },
    ],
  },
  "order.completed": {
    description: "Triggered when an order is marked as completed",
    examples: [
      "All items are fulfilled",
      "Order is finalized",
      "Order processing is finished"
    ],
    attributes: ORDER_ATTRIBUTES,
    templates: [
      {
        value: "order-completed",
        name: "Order completed",
      },
    ],
  },
  "order.archived": {
    description: "Triggered when an order is archived",
    examples: [
      "Order is moved to archive",
      "Completed order is archived",
      "Old order is archived for record keeping"
    ],
    attributes: ORDER_ATTRIBUTES,
    templates: [
      {
        value: "order-archived",
        name: "Order archived",
      },
    ],
  },
}
