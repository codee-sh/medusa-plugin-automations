export const PRODUCT_TYPE_ATTRIBUTES = [
  {
    value: "product_type.id",
    label: "ID",
  },
  {
    value: "product_type.value",
    label: "Value",
  },
  {
    value: "product_type.created_at",
    label: "Created At",
  },
  {
    value: "product_type.updated_at",
    label: "Updated At",
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
