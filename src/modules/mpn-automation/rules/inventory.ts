import type { RuleAttribute } from "./types"

/**
 * Inventory level rule attributes
 */
export const inventoryLevelAttributes: RuleAttribute[] = [
  {
    id: "inventory_level_id",
    value: "inventory_level.id",
    label: "inventory_level ID",
    description: "The unique identifier of the inventory level",
    field_type: "text",
    group: "inventory_level",
  },
  {
    id: "inventory_level_location_id",
    value: "inventory_level.location_id",
    label: "Location ID",
    description: "The ID of the stock location",
    field_type: "text",
    group: "inventory_level",
  },
  {
    id: "inventory_level_stocked_quantity",
    value: "inventory_level.stocked_quantity",
    label: "Stocked Quantity",
    description: "The total stocked quantity in the location",
    field_type: "number",
    group: "inventory_level",
  },
  {
    id: "inventory_level_reserved_quantity",
    value: "inventory_level.reserved_quantity",
    label: "Reserved Quantity",
    description: "The quantity reserved for orders",
    field_type: "number",
    group: "inventory_level",
  },
  {
    id: "inventory_level_available_quantity",
    value: "inventory_level.available_quantity",
    label: "Available Quantity",
    description: "The available quantity (stocked - reserved)",
    field_type: "number",
    group: "inventory_level",
  },
  {
    id: "inventory_level_incoming_quantity",
    value: "inventory_level.incoming_quantity",
    label: "Incoming Quantity",
    description: "The quantity expected to arrive",
    field_type: "number",
    group: "inventory_level",
  },
]

/**
 * Inventory item rule attributes
 */
export const inventoryItemAttributes: RuleAttribute[] = [
  {
    id: "inventory_item_id",
    value: "inventory_item.id",
    label: "inventory_item ID",
    description: "The unique identifier of the inventory item",
    field_type: "text",
    group: "inventory_item",
  },
  {
    id: "inventory_item_sku",
    value: "inventory_item.sku",
    label: "SKU",
    description: "The stock keeping unit (SKU) of the inventory item",
    field_type: "text",
    group: "inventory_item",
  },
  {
    id: "inventory_item_title",
    value: "inventory_item.title",
    label: "Title",
    description: "The title of the inventory item",
    field_type: "text",
    group: "inventory_item",
  },
  {
    id: "inventory_item_origin_country",
    value: "inventory_item.origin_country",
    label: "Origin Country",
    description: "The origin country code of the inventory item",
    field_type: "text",
    group: "inventory_item",
  },
  {
    id: "inventory_item_hs_code",
    value: "inventory_item.hs_code",
    label: "HS Code",
    description: "The Harmonized System code",
    field_type: "text",
    group: "inventory_item",
  },
  {
    id: "inventory_item_mid_code",
    value: "inventory_item.mid_code",
    label: "MID Code",
    description: "The manufacturer identification code",
    field_type: "text",
    group: "inventory_item",
  },
  {
    id: "inventory_item_material",
    value: "inventory_item.material",
    label: "Material",
    description: "The material of the inventory item",
    field_type: "text",
    group: "inventory_item",
  },
  {
    id: "inventory_item_weight",
    value: "inventory_item.weight",
    label: "Weight",
    description: "The weight of the inventory item",
    field_type: "number",
    group: "inventory_item",
  },
  {
    id: "inventory_item_length",
    value: "inventory_item.length",
    label: "Length",
    description: "The length of the inventory item",
    field_type: "number",
    group: "inventory_item",
  },
  {
    id: "inventory_item_height",
    value: "inventory_item.height",
    label: "Height",
    description: "The height of the inventory item",
    field_type: "number",
    group: "inventory_item",
  },
  {
    id: "inventory_item_width",
    value: "inventory_item.width",
    label: "Width",
    description: "The width of the inventory item",
    field_type: "number",
    group: "inventory_item",
  },
  {
    id: "inventory_item_requires_shipping",
    value: "inventory_item.requires_shipping",
    label: "Requires Shipping",
    description: "Whether the inventory item requires shipping",
    field_type: "boolean",
    group: "inventory_item",
  },
]

/**
 * All inventory-related rule attributes
 */
export const inventoryAttributes: RuleAttribute[] = [
  ...inventoryLevelAttributes,
  ...inventoryItemAttributes,
]

