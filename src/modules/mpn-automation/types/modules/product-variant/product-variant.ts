export const PRODUCT_VARIANT_ATTRIBUTES = [
  {
    value: "product_variant.id",
    label: "ID",
    description: "Unique identifier of the product variant",
    examples: ["variant_01ABC123", "variant_01XYZ789"],
  },
  {
    value: "product_variant.title",
    label: "Title",
    description: "Title/name of the product variant (e.g., size and color combination)",
    examples: ["Small / Blue", "Medium / Red", "Large / Black"],
  },
  {
    value: "product_variant.sku",
    label: "SKU",
    description: "SKU (Stock Keeping Unit) of the product variant",
    examples: ["TSHIRT-SM-BLUE", "JEANS-32-BLACK", "SNEAKERS-42-WHITE"],
  },
  {
    value: "product_variant.barcode",
    label: "Barcode",
    description: "Barcode identifier for the product variant",
    examples: ["1234567890123", "9876543210987"],
  },
  {
    value: "product_variant.ean",
    label: "EAN",
    description: "European Article Number (EAN) barcode",
    examples: ["1234567890123", "9876543210987"],
  },
  {
    value: "product_variant.upc",
    label: "UPC",
    description: "Universal Product Code (UPC) barcode",
    examples: ["123456789012", "987654321098"],
  },
  {
    value: "product_variant.allow_backorder",
    label: "Allow Backorder",
    description: "Whether backorders are allowed for this variant",
    examples: ["true", "false"],
  },
  {
    value: "product_variant.manage_inventory",
    label: "Manage Inventory",
    description: "Whether inventory is managed for this variant",
    examples: ["true", "false"],
  },
  {
    value: "product_variant.hs_code",
    label: "HS Code",
    description: "Harmonized System (HS) code for customs classification",
    examples: ["6109.10.00", "6403.99.00"],
  },
  {
    value: "product_variant.origin_country",
    label: "Origin Country",
    description: "ISO 3166-1 alpha-2 country code where the variant originates",
    examples: ["PL", "US", "CN", "DE"],
  },
  {
    value: "product_variant.mid_code",
    label: "MID Code",
    description: "Manufacturer Identification (MID) code",
    examples: ["MID123456"],
  },
  {
    value: "product_variant.material",
    label: "Material",
    description: "Material composition of the product variant",
    examples: ["Cotton", "Polyester", "Leather", "Metal"],
  },
  {
    value: "product_variant.weight",
    label: "Weight",
    description: "Weight of the product variant in grams",
    examples: ["100", "500", "1000", "2500"],
  },
  {
    value: "product_variant.length",
    label: "Length",
    description: "Length of the product variant in centimeters",
    examples: ["10", "20", "30", "50"],
  },
  {
    value: "product_variant.height",
    label: "Height",
    description: "Height of the product variant in centimeters",
    examples: ["5", "10", "15", "25"],
  },
  {
    value: "product_variant.width",
    label: "Width",
    description: "Width of the product variant in centimeters",
    examples: ["10", "20", "30", "40"],
  },
  // {
  //   value: "product_variant.metadata",
  //   label: "Metadata",
  // },
  {
    value: "product_variant.variant_rank",
    label: "Variant Rank",
    description: "Display order/rank of the variant",
    examples: ["0", "1", "2", "10"],
  },
  {
    value: "product_variant.product_id",
    label: "Product ID",
    description: "Unique identifier of the parent product",
    examples: ["prod_01ABC123"],
  },
  {
    value: "product_variant.created_at",
    label: "Created At",
    description: "Date and time when the variant was created (ISO 8601 format)",
    examples: ["2024-01-15T10:30:00Z", "2024-12-25T00:00:00Z"],
  },
  {
    value: "product_variant.updated_at",
    label: "Updated At",
    description: "Date and time when the variant was last updated (ISO 8601 format)",
    examples: ["2024-01-15T10:30:00Z", "2024-12-25T00:00:00Z"],
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
