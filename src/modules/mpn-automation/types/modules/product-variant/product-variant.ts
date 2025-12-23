export const PRODUCT_VARIANT_ATTRIBUTES = [
  {
    value: "product_variant.id",
    label: "ID",
  },
  {
    value: "product_variant.title",
    label: "Title",
  },
  {
    value: "product_variant.sku",
    label: "SKU",
  },
  {
    value: "product_variant.barcode",
    label: "Barcode",
  },
  {
    value: "product_variant.ean",
    label: "EAN",
  },
  {
    value: "product_variant.upc",
    label: "UPC",
  },
  {
    value: "product_variant.allow_backorder",
    label: "Allow Backorder",
  },
  {
    value: "product_variant.manage_inventory",
    label: "Manage Inventory",
  },
  {
    value: "product_variant.hs_code",
    label: "HS Code",
  },
  {
    value: "product_variant.origin_country",
    label: "Origin Country",
  },
  {
    value: "product_variant.mid_code",
    label: "MID Code",
  },
  {
    value: "product_variant.material",
    label: "Material",
  },
  {
    value: "product_variant.weight",
    label: "Weight",
  },
  {
    value: "product_variant.length",
    label: "Length",
  },
  {
    value: "product_variant.height",
    label: "Height",
  },
  {
    value: "product_variant.width",
    label: "Width",
  },
  // {
  //   value: "product_variant.metadata",
  //   label: "Metadata",
  // },
  {
    value: "product_variant.variant_rank",
    label: "Variant Rank",
  },
  {
    value: "product_variant.product_id",
    label: "Product ID",
  },
  {
    value: "product_variant.created_at",
    label: "Created At",
  },
  {
    value: "product_variant.updated_at",
    label: "Updated At",
  },
]

// Fields for use in query.graph() - includes technical relations with *
// These fields are needed for correct data retrieval including all relation data
// PRODUCT_VARIANT_QUERY_FIELDS contains all fields from PRODUCT_VARIANT_ATTRIBUTES plus technical relations
export const PRODUCT_VARIANT_QUERY_FIELDS = [
  // Basic fields from PRODUCT_VARIANT_ATTRIBUTES
  ...PRODUCT_VARIANT_ATTRIBUTES.map((attr) => attr.value),
  
  // Technical relations required for complete data retrieval (if any)
  // These fields are not available in UI rules, but are needed for correct data retrieval
]
