export const PRODUCT_ATTRIBUTES = [
  {
    value: "product.id",
    label: "ID",
  },
  {
    value: "product.title",
    label: "Title",
  },
  {
    value: "product.handle",
    label: "Handle",
  },
  {
    value: "product.subtitle",
    label: "Subtitle",
  },
  {
    value: "product.description",
    label: "Description",
  },
  {
    value: "product.is_giftcard",
    label: "Is Giftcard",
  },
  {
    value: "product.status",
    label: "Status",
  },
  {
    value: "product.sku",
    label: "SKU",
  },
  {
    value: "product.barcode",
    label: "Barcode",
  },
  {
    value: "product.ean",
    label: "EAN",
  },
  {
    value: "product.upc",
    label: "UPC",
  },
  {
    value: "product.thumbnail",
    label: "Thumbnail",
  },
  {
    value: "product.hs_code",
    label: "HS Code",
  },
  {
    value: "product.origin_country",
    label: "Origin Country",
  },
  {
    value: "product.mid_code",
    label: "MID Code",
  },
  {
    value: "product.material",
    label: "Material",
  },
  {
    value: "product.weight",
    label: "Weight",
  },
  {
    value: "product.length",
    label: "Length",
  },
  {
    value: "product.height",
    label: "Height",
  },
  {
    value: "product.width",
    label: "Width",
  },
  {
    value: "product.created_at",
    label: "Created At",
  },
  {
    value: "product.updated_at",
    label: "Updated At",
  },
  {
    value: "product.deleted_at",
    label: "Deleted At",
  },
  {
    value: "product.tags.id",
    label: "Tag ID",
    type: "array",
    isRelation: true,
    relationType: "tags",
  },
  {
    value: "product.tags.value",
    label: "Tag Value",
    type: "array",
    isRelation: true,
    relationType: "tags",
  },
  {
    value: "product.categories.id",
    label: "Category ID",
    type: "array",
    isRelation: true,
    relationType: "categories",
  },
  {
    value: "product.categories.name",
    label: "Category Name",
    type: "array",
    isRelation: true,
    relationType: "categories",
  },
  {
    value: "product.categories.handle",
    label: "Category Handle",
    type: "array",
    isRelation: true,
    relationType: "categories",
  },
  {
    value: "product.variants.id",
    label: "Variant ID",
    type: "array",
    isRelation: true,
    relationType: "variants",
  },
  {
    value: "product.variants.sku",
    label: "Variant SKU",
    type: "array",
    isRelation: true,
    relationType: "variants",
  },
  {
    value: "product.variants.title",
    label: "Variant Title",
    type: "array",
    isRelation: true,
    relationType: "variants",
  },
  {
    value: "product.type.id",
    label: "Type ID",
    type: "object",
    isRelation: true,
    relationType: "type",
  },
  {
    value: "product.type.value",
    label: "Type Value",
    type: "object",
    isRelation: true,
    relationType: "type",
  },
  {
    value: "product.collection.id",
    label: "Collection ID",
    type: "object",
    isRelation: true,
    relationType: "collection",
  },
  {
    value: "product.collection.title",
    label: "Collection Title",
    type: "object",
    isRelation: true,
    relationType: "collection",
  },
  {
    value: "product.collection.handle",
    label: "Collection Handle",
    type: "object",
    isRelation: true,
    relationType: "collection",
  },
]

// Fields for use in query.graph() - includes technical relations with *
// These fields are needed for correct data retrieval including all relation data
// PRODUCT_QUERY_FIELDS contains all fields from PRODUCT_ATTRIBUTES plus technical relations
export const PRODUCT_QUERY_FIELDS = [
  // Basic fields from PRODUCT_ATTRIBUTES
  ...PRODUCT_ATTRIBUTES.map((attr) => attr.value),
  
  // Technical relations required for complete data retrieval
  // These fields are not available in UI rules, but are needed for correct data retrieval
  "product.tags.*",
  "product.categories.*",
  "product.variants.*",
  "product.type.*",
  "product.collection.*",
]
