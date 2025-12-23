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
  {
    value: "inventory_level.stock_locations.id",
    label: "Stock Location ID",
    type: "array",
    isRelation: true,
    relationType: "stock_locations",
  },
  {
    value: "inventory_level.stock_locations.name",
    label: "Stock Location Name",
    type: "array",
    isRelation: true,
    relationType: "stock_locations",
  },
]

// Fields for use in query.graph() - includes technical relations with *
// These fields are needed for correct data retrieval including all relation data
// INVENTORY_LEVEL_QUERY_FIELDS contains all fields from INVENTORY_LEVEL_ATTRIBUTES plus technical relations
export const INVENTORY_LEVEL_QUERY_FIELDS = [
  // Basic fields from INVENTORY_LEVEL_ATTRIBUTES
  ...INVENTORY_LEVEL_ATTRIBUTES.map((attr) => attr.value),
  
  // Technical relations required for complete data retrieval
  // These fields are not available in UI rules, but are needed for correct data retrieval
  "inventory_level.stock_locations.*",
]
