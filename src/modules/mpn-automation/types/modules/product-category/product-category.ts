export const PRODUCT_CATEGORY_ATTRIBUTES = [
  {
    value: "product_category.id",
    label: "ID",
  },
  {
    value: "product_category.name",
    label: "Name",
  },
  {
    value: "product_category.description",
    label: "Description",
  },
  {
    value: "product_category.handle",
    label: "Handle",
  },
  {
    value: "product_category.is_active",
    label: "Is Active",
  },
  {
    value: "product_category.is_internal",
    label: "Is Internal",
  },
  {
    value: "product_category.rank",
    label: "Rank",
  },
  {
    value: "product_category.parent_category_id",
    label: "Parent Category ID",
  },
  {
    value: "product_category.created_at",
    label: "Created At",
  },
  {
    value: "product_category.updated_at",
    label: "Updated At",
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
