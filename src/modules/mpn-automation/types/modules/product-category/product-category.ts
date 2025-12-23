export const PRODUCT_CATEGORY_ATTRIBUTES = [
  {
    value: "product_category.id",
    label: "ID",
    description: "Unique identifier of the product category",
    examples: ["cat_01ABC123", "cat_01XYZ789"],
  },
  {
    value: "product_category.name",
    label: "Name",
    description: "Name of the product category",
    examples: ["Clothing", "Electronics", "Home & Garden", "Sports & Outdoors"],
  },
  {
    value: "product_category.description",
    label: "Description",
    description: "Description of the product category",
    examples: ["All clothing items", "Electronic devices and accessories"],
  },
  {
    value: "product_category.handle",
    label: "Handle",
    description: "URL-friendly identifier for the category (used in category URLs)",
    examples: ["clothing", "electronics", "home-garden"],
  },
  {
    value: "product_category.is_active",
    label: "Is Active",
    description: "Whether the category is currently active",
    examples: ["true", "false"],
  },
  {
    value: "product_category.is_internal",
    label: "Is Internal",
    description: "Whether the category is for internal use only (not visible to customers)",
    examples: ["true", "false"],
  },
  {
    value: "product_category.rank",
    label: "Rank",
    description: "Display order/rank of the category",
    examples: ["0", "1", "2", "10"],
  },
  {
    value: "product_category.parent_category_id",
    label: "Parent Category ID",
    description: "Unique identifier of the parent category (null for top-level categories)",
    examples: ["cat_01ABC123", null],
  },
  {
    value: "product_category.created_at",
    label: "Created At",
    description: "Date and time when the category was created (ISO 8601 format)",
    examples: ["2024-01-15T10:30:00Z", "2024-12-25T00:00:00Z"],
  },
  {
    value: "product_category.updated_at",
    label: "Updated At",
    description: "Date and time when the category was last updated (ISO 8601 format)",
    examples: ["2024-01-15T10:30:00Z", "2024-12-25T00:00:00Z"],
  },
]

// Fields for use in query.graph() - includes technical relations with *
// These fields are needed for correct data retrieval including all relation data
// PRODUCT_CATEGORY_QUERY_FIELDS contains all fields from PRODUCT_CATEGORY_ATTRIBUTES plus technical relations
export const PRODUCT_CATEGORY_QUERY_FIELDS = [
  // Basic fields from PRODUCT_CATEGORY_ATTRIBUTES
  ...PRODUCT_CATEGORY_ATTRIBUTES.map((attr) => attr.value),
  
  // Technical relations required for complete data retrieval (if any)
  // These fields are not available in UI rules, but are needed for correct data retrieval
]
