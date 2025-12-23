// Attributes available in rules (without technical relations with *)
// These attributes are displayed in the UI for creating conditions in automations
export const ORDER_ATTRIBUTES = [
  // Basic fields
  {
    value: "order.id",
    label: "ID",
  },
  {
    value: "order.display_id",
    label: "Display ID",
  },
  {
    value: "order.custom_display_id",
    label: "Custom Display ID",
  },
  {
    value: "order.status",
    label: "Status",
  },
  {
    value: "order.locale",
    label: "Locale",
  },
  {
    value: "order.email",
    label: "Email",
  },
  {
    value: "order.currency_code",
    label: "Currency Code",
  },
  {
    value: "order.region_id",
    label: "Region ID",
  },
  {
    value: "order.created_at",
    label: "Created At",
  },
  {
    value: "order.updated_at",
    label: "Updated At",
  },
  // Totals
  {
    value: "order.total",
    label: "Total",
  },
  {
    value: "order.subtotal",
    label: "Subtotal",
  },
  {
    value: "order.tax_total",
    label: "Tax Total",
  },
  {
    value: "order.original_total",
    label: "Original Total",
  },
  {
    value: "order.original_subtotal",
    label: "Original Subtotal",
  },
  {
    value: "order.original_tax_total",
    label: "Original Tax Total",
  },
  {
    value: "order.discount_total",
    label: "Discount Total",
  },
  {
    value: "order.discount_tax_total",
    label: "Discount Tax Total",
  },
  // Shipping (specific fields, not *)
  {
    value: "order.shipping_methods.amount",
    label: "Shipping Methods Amount",
  },
  {
    value: "order.shipping_methods.subtotal",
    label: "Shipping Methods Subtotal",
  },
  {
    value: "order.shipping_methods.tax_total",
    label: "Shipping Methods Tax Total",
  },
  {
    value: "order.shipping_methods.original_total",
    label: "Shipping Methods Original Total",
  },
  {
    value: "order.shipping_methods.original_subtotal",
    label: "Shipping Methods Original Subtotal",
  },
  {
    value: "order.shipping_methods.original_tax_total",
    label: "Shipping Methods Original Tax Total",
  },
  {
    value: "order.shipping_methods.discount_total",
    label: "Shipping Methods Discount Total",
  },
  {
    value: "order.shipping_methods.discount_subtotal",
    label: "Shipping Methods Discount Subtotal",
  },
  {
    value: "order.shipping_methods.discount_tax_total",
    label: "Shipping Methods Discount Tax Total",
  },
  // Summary (specific fields)
  {
    value: "order.summary.total",
    label: "Summary Total",
  },
  {
    value: "order.summary.subtotal",
    label: "Summary Subtotal",
  },
  {
    value: "order.summary.tax_total",
    label: "Summary Tax Total",
  },
  {
    value: "order.summary.discount_total",
    label: "Summary Discount Total",
  },
  {
    value: "order.summary.original_order_total",
    label: "Summary Original Order Total",
  },
  {
    value: "order.summary.current_order_total",
    label: "Summary Current Order Total",
  },
  {
    value: "order.summary.paid_total",
    label: "Summary Paid Total",
  },
  {
    value: "order.summary.refunded_total",
    label: "Summary Refunded Total",
  },
  {
    value: "order.summary.accounting_total",
    label: "Summary Accounting Total",
  },
  {
    value: "order.summary.credit_line_total",
    label: "Summary Credit Line Total",
  },
  {
    value: "order.summary.transaction_total",
    label: "Summary Transaction Total",
  },
  {
    value: "order.summary.pending_difference",
    label: "Summary Pending Difference",
  },
  // Customer relation
  {
    value: "order.customer.id",
    label: "Customer ID",
    isRelation: true,
    relationType: "customer",
  },
  {
    value: "order.customer.email",
    label: "Customer Email",
    isRelation: true,
    relationType: "customer",
  },
  {
    value: "order.customer.first_name",
    label: "Customer First Name",
    isRelation: true,
    relationType: "customer",
  },
  {
    value: "order.customer.last_name",
    label: "Customer Last Name",
    isRelation: true,
    relationType: "customer",
  },
  // Sales channel relation
  {
    value: "order.sales_channel.id",
    label: "Sales Channel ID",
    isRelation: true,
    relationType: "sales_channel",
  },
  {
    value: "order.sales_channel.name",
    label: "Sales Channel Name",
    isRelation: true,
    relationType: "sales_channel",
  },
  // Shipping address
  {
    value: "order.shipping_address.first_name",
    label: "Shipping First Name",
    isRelation: true,
    relationType: "shipping_address",
  },
  {
    value: "order.shipping_address.last_name",
    label: "Shipping Last Name",
    isRelation: true,
    relationType: "shipping_address",
  },
  {
    value: "order.shipping_address.address_1",
    label: "Shipping Address 1",
    isRelation: true,
    relationType: "shipping_address",
  },
  {
    value: "order.shipping_address.city",
    label: "Shipping City",
    isRelation: true,
    relationType: "shipping_address",
  },
  {
    value: "order.shipping_address.country_code",
    label: "Shipping Country Code",
    isRelation: true,
    relationType: "shipping_address",
  },
  {
    value: "order.shipping_address.postal_code",
    label: "Shipping Postal Code",
    isRelation: true,
    relationType: "shipping_address",
  },
  // Billing address
  {
    value: "order.billing_address.first_name",
    label: "Billing First Name",
    isRelation: true,
    relationType: "billing_address",
  },
  {
    value: "order.billing_address.last_name",
    label: "Billing Last Name",
    isRelation: true,
    relationType: "billing_address",
  },
  {
    value: "order.billing_address.address_1",
    label: "Billing Address 1",
    isRelation: true,
    relationType: "billing_address",
  },
  {
    value: "order.billing_address.city",
    label: "Billing City",
    isRelation: true,
    relationType: "billing_address",
  },
  {
    value: "order.billing_address.country_code",
    label: "Billing Country Code",
    isRelation: true,
    relationType: "billing_address",
  },
  {
    value: "order.billing_address.postal_code",
    label: "Billing Postal Code",
    isRelation: true,
    relationType: "billing_address",
  },
  // Items (specific fields, not *)
  {
    value: "order.items.id",
    label: "Item ID",
    type: "array",
    isRelation: true,
    relationType: "items",
  },
  {
    value: "order.items.quantity",
    label: "Item Quantity",
    type: "array",
    isRelation: true,
    relationType: "items",
  },
  {
    value: "order.items.title",
    label: "Item Title",
    type: "array",
    isRelation: true,
    relationType: "items",
  },
  {
    value: "order.items.unit_price",
    label: "Item Unit Price",
    type: "array",
    isRelation: true,
    relationType: "items",
  },
  {
    value: "order.items.variant.id",
    label: "Item Variant ID",
    type: "array",
    isRelation: true,
    relationType: "items",
  },
  {
    value: "order.items.variant.sku",
    label: "Item Variant SKU",
    type: "array",
    isRelation: true,
    relationType: "items",
  },
  {
    value: "order.items.product.id",
    label: "Item Product ID",
    type: "array",
    isRelation: true,
    relationType: "items",
  },
  {
    value: "order.items.product.title",
    label: "Item Product Title",
    type: "array",
    isRelation: true,
    relationType: "items",
  },
  // Payment collections
  {
    value: "order.payment_collections.id",
    label: "Payment Collection ID",
    type: "array",
    isRelation: true,
    relationType: "payment_collections",
  },
  {
    value: "order.payment_collections.status",
    label: "Payment Collection Status",
    type: "array",
    isRelation: true,
    relationType: "payment_collections",
  },
  {
    value: "order.payment_collections.amount",
    label: "Payment Collection Amount",
    type: "array",
    isRelation: true,
    relationType: "payment_collections",
  },
  // Fulfillments
  {
    value: "order.fulfillments.id",
    label: "Fulfillment ID",
    type: "array",
    isRelation: true,
    relationType: "fulfillments",
  },
  {
    value: "order.fulfillments.status",
    label: "Fulfillment Status",
    type: "array",
    isRelation: true,
    relationType: "fulfillments",
  },
]

// Fields for use in query.graph() - includes technical relations with *
// These fields are required for correct totals calculation by OrderModuleService
// ORDER_QUERY_FIELDS contains all fields from ORDER_ATTRIBUTES plus technical relations
export const ORDER_QUERY_FIELDS = [
  // Basic fields from ORDER_ATTRIBUTES
  ...ORDER_ATTRIBUTES.map((attr) => attr.value),
  
  // Technical relations required for totals calculation
  // These fields are not available in UI rules, but are needed for correct data retrieval
  "order.items.*",
  "order.items.tax_lines.*",
  "order.items.adjustments.*",
  "order.shipping_methods.*",
  "order.shipping_methods.tax_lines.*",
  "order.shipping_methods.adjustments.*",
  "order.credit_lines.*",
  "order.summary.*",
]
