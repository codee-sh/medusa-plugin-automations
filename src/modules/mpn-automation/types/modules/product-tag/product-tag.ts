export const PRODUCT_TAG_ATTRIBUTES = [
  {
    value: "product_tag.id",
    label: "ID",
  },
  {
    value: "product_tag.value",
    label: "Value",
  },
  {
    value: "product_tag.created_at",
    label: "Created At",
  },
  {
    value: "product_tag.updated_at",
    label: "Updated At",
  },
]

// Fields for use in query.graph() - includes technical relations with *
// These fields are needed for correct data retrieval including all relation data
// PRODUCT_TAG_QUERY_FIELDS contains all fields from PRODUCT_TAG_ATTRIBUTES plus technical relations
export const PRODUCT_TAG_QUERY_FIELDS = [
  // Basic fields from PRODUCT_TAG_ATTRIBUTES
  ...PRODUCT_TAG_ATTRIBUTES.map((attr) => attr.value),
  
  // Technical relations required for complete data retrieval (if any)
  // These fields are not available in UI rules, but are needed for correct data retrieval
]
