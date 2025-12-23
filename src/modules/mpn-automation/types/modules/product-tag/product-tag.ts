export const PRODUCT_TAG_ATTRIBUTES = [
  {
    value: "product_tag.id",
    label: "ID",
    description: "Unique identifier of the product tag",
    examples: ["tag_01ABC123", "tag_01XYZ789"],
  },
  {
    value: "product_tag.value",
    label: "Value",
    description: "Value/name of the product tag",
    examples: ["summer", "sale", "new", "bestseller", "limited-edition"],
  },
  {
    value: "product_tag.created_at",
    label: "Created At",
    description: "Date and time when the tag was created (ISO 8601 format)",
    examples: ["2024-01-15T10:30:00Z", "2024-12-25T00:00:00Z"],
  },
  {
    value: "product_tag.updated_at",
    label: "Updated At",
    description: "Date and time when the tag was last updated (ISO 8601 format)",
    examples: ["2024-01-15T10:30:00Z", "2024-12-25T00:00:00Z"],
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
