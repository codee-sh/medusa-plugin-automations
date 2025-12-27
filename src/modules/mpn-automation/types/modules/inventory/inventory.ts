export const INVENTORY_ITEM_ATTRIBUTES = [
  {
    value: "inventory_item.stocked_quantity",
    label: "Stocked Quantity",
    description: "Total quantity of items in stock",
    examples: ["0", "10", "100", "500"],
  },
  {
    value: "inventory_item.reserved_quantity",
    label: "Reserved Quantity",
    description: "Quantity of items currently reserved (e.g., in carts or pending orders)",
    examples: ["0", "5", "20", "50"],
  },
  {
    value: "inventory_item.available_quantity",
    label: "Available Quantity",
    description: "Quantity available for sale (stocked - reserved)",
    examples: ["0", "5", "50", "200"],
  },
  {
    value: "inventory_item.incoming_quantity",
    label: "Incoming Quantity",
    description: "Quantity of items expected to arrive (e.g., from suppliers)",
    examples: ["0", "10", "100", "500"],
  },
  {
    value: "inventory_item.location_id",
    label: "Location ID",
    description: "Unique identifier of the inventory location",
    examples: ["loc_01ABC123"],
  },
]

export const INVENTORY_LEVEL_ATTRIBUTES = [
  {
    value: "inventory_level.id",
    label: "ID",
    description: "Unique identifier of the inventory level",
    examples: ["ilev_01ABC123", "ilev_01XYZ789"],
  },
  {
    value: "inventory_level.inventory_item_id",
    label: "Inventory Item ID",
    description: "Unique identifier of the inventory item",
    examples: ["iitem_01ABC123"],
  },
  {
    value: "inventory_level.stocked_quantity",
    label: "Stocked Quantity",
    description: "Total quantity of items in stock at this location",
    examples: ["0", "10", "100", "500"],
  },
  {
    value: "inventory_level.reserved_quantity",
    label: "Reserved Quantity",
    description: "Quantity of items currently reserved at this location",
    examples: ["0", "5", "20", "50"],
  },
  {
    value: "inventory_level.available_quantity",
    label: "Available Quantity",
    description: "Quantity available for sale at this location (stocked - reserved)",
    examples: ["0", "5", "50", "200"],
  },
  {
    value: "inventory_level.incoming_quantity",
    label: "Incoming Quantity",
    description: "Quantity of items expected to arrive at this location",
    examples: ["0", "10", "100", "500"],
  },
  {
    value: "inventory_level.location_id",
    label: "Location ID",
    description: "Unique identifier of the stock location",
    examples: ["loc_01ABC123"],
  },
  {
    value: "inventory_level.stock_locations.id",
    label: "Stock Location ID",
    description: "Unique identifier of the stock location. This is an array - operator 'eq' checks if ANY value matches",
    examples: ["loc_01ABC123"],
    type: "array",
    isRelation: true,
    relationType: "stock_locations",
  },
  {
    value: "inventory_level.stock_locations.name",
    label: "Stock Location Name",
    description: "Name of the stock location. This is an array - operator 'eq' checks if ANY value matches",
    examples: ["Main Warehouse", "Store A", "Distribution Center"],
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
