
export const INVENTORY_ITEM_ATTRIBUTES = [
  {
    value: "inventory_item.stocked_quantity",
    label: "Stocked Quantity",
  },
  {
    value: "inventory_item.reserved_quantity",
    label: "Reserved Quantity",
  },
  {
    value: "inventory_item.available_quantity",
    label: "Available Quantity",
  },
  {
    value: "inventory_item.incoming_quantity",
    label: "Incoming Quantity",
  },
  {
    value: "inventory_item.location_id",
    label: "Location ID",
  },
]

export const INVENTORY_LEVEL_ATTRIBUTES = [
  {
    value: "inventory_level.id",
    label: "ID",
  },
  {
    value: "inventory_level.inventory_item_id",
    label: "Inventory Item ID",
  },
  {
    value: "inventory_level.stocked_quantity",
    label: "Stocked Quantity",
  },
  {
    value: "inventory_level.reserved_quantity",
    label: "Reserved Quantity",
  },
  {
    value: "inventory_level.available_quantity",
    label: "Available Quantity",
  },
  {
    value: "inventory_level.incoming_quantity",
    label: "Incoming Quantity",
  },
  {
    value: "inventory_level.location_id",
    label: "Location ID",
  },
]

export const EVENT_INVENTORY_TYPES = [
  {
    value: "inventory.inventory-level.created",
    label: "Inventory Level Created",
    attributes: INVENTORY_LEVEL_ATTRIBUTES,
  },
  {
    value: "inventory.inventory-level.updated",
    label: "Inventory Level Updated",
    attributes: INVENTORY_LEVEL_ATTRIBUTES,
  },
  {
    value: "inventory.inventory-level.deleted",
    label: "Inventory Level Deleted",
    attributes: INVENTORY_LEVEL_ATTRIBUTES,
  },
]
