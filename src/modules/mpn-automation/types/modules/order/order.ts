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
    value: "order.version",
    label: "Version",
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

  // Financial fields
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
    value: "order.discount_total",
    label: "Discount Total",
  },
  {
    value: "order.discount_tax_total",
    label: "Discount Tax Total",
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
    value: "order.item_total",
    label: "Item Total",
  },
  {
    value: "order.item_subtotal",
    label: "Item Subtotal",
  },
  {
    value: "order.item_tax_total",
    label: "Item Tax Total",
  },
  {
    value: "order.original_item_total",
    label: "Original Item Total",
  },
  {
    value: "order.original_item_subtotal",
    label: "Original Item Subtotal",
  },
  {
    value: "order.original_item_tax_total",
    label: "Original Item Tax Total",
  },
  {
    value: "order.shipping_total",
    label: "Shipping Total",
  },
  {
    value: "order.shipping_subtotal",
    label: "Shipping Subtotal",
  },
  {
    value: "order.shipping_tax_total",
    label: "Shipping Tax Total",
  },
  {
    value: "order.original_shipping_total",
    label: "Original Shipping Total",
  },
  {
    value: "order.original_shipping_subtotal",
    label: "Original Shipping Subtotal",
  },
  {
    value: "order.original_shipping_tax_total",
    label: "Original Shipping Tax Total",
  },
  {
    value: "order.credit_line_total",
    label: "Credit Line Total",
  },
  {
    value: "order.credit_line_subtotal",
    label: "Credit Line Subtotal",
  },
  {
    value: "order.credit_line_tax_total",
    label: "Credit Line Tax Total",
  },

  // Summary fields
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

  // Items (array relation)
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

  // Payment collections (array relation)
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

  // Fulfillments (array relation)
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

