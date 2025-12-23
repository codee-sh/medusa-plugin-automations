export const PRODUCT_TYPE_ATTRIBUTES = [
  {
    value: "product_type.id",
    label: "ID",
    description: "Unique identifier of the product type",
    examples: ["ptyp_01ABC123", "ptyp_01XYZ789"],
  },
  {
    value: "product_type.value",
    label: "Value",
    description: "Value/name of the product type",
    examples: ["Clothing", "Electronics", "Accessories", "Home & Garden", "Books"],
  },
  {
    value: "product_type.created_at",
    label: "Created At",
    description: "Date and time when the product type was created (ISO 8601 format)",
    examples: ["2024-01-15T10:30:00Z", "2024-12-25T00:00:00Z"],
  },
  {
    value: "product_type.updated_at",
    label: "Updated At",
    description: "Date and time when the product type was last updated (ISO 8601 format)",
    examples: ["2024-01-15T10:30:00Z", "2024-12-25T00:00:00Z"],
  },
]

// Fields for use in query.graph() - includes technical relations with *
// These fields are needed for correct data retrieval including all relation data
// PRODUCT_TYPE_QUERY_FIELDS contains all fields from PRODUCT_TYPE_ATTRIBUTES plus technical relations
export const PRODUCT_TYPE_QUERY_FIELDS = [
  // Basic fields from PRODUCT_TYPE_ATTRIBUTES
  ...PRODUCT_TYPE_ATTRIBUTES.map((attr) => attr.value),
  
  // Technical relations required for complete data retrieval (if any)
  // These fields are not available in UI rules, but are needed for correct data retrieval
]
