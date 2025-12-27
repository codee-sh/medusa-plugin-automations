import { OrderStatus, PaymentCollectionStatus } from "@medusajs/framework/utils"

/**
 * Helper to get all possible OrderStatus values
 */
export const ORDER_STATUS_VALUES = Object.values(OrderStatus) as string[]

/**
 * Helper to get all possible PaymentCollectionStatus values
 */
export const PAYMENT_COLLECTION_STATUS_VALUES = Object.values(
  PaymentCollectionStatus
) as string[]

/**
 * FulfillmentStatus is a union type, not an enum, so we define values manually
 * Based on: @medusajs/framework/types - FulfillmentStatus
 * import { FulfillmentStatus } from "@medusajs/framework/types"
 */
export const FULFILLMENT_STATUS_VALUES: string[] = [
  "not_fulfilled",
  "partially_fulfilled",
  "fulfilled",
  "partially_shipped",
  "shipped",
  "partially_delivered",
  "delivered",
  "canceled",
]

