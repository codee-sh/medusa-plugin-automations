import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { getProductByIdWorkflow } from "../workflows/product/get-product-by-id"
import { runAutomationWorkflow } from "../workflows/mpn-automation/run-automation"
import { TriggerType } from "../utils/types"

const eventName = "product.updated"

/**
 * Subscriber that runs the automation workflow for the product updated event.
 *
 * This subscriber is triggered when a product is updated.
 * It runs the automation workflow.
 *
 * @param event - The event data containing the product ID.
 * @param container - The container instance.
 */
export default async function productUpdatedHandler({
  event: {
    data: { id },
  },
  container,
}: SubscriberArgs<{ id: string }>) {
  // Retrieve product with related product
  const {
    result: { product },
  } = await getProductByIdWorkflow(container).run({
    input: {
      product_id: id,
    },
  })

  const contextData = {
    product: product,
  }

  // Run automation workflow - this will:
  // 1. Retrieve triggers for the event
  // 2. Validate triggers against context
  // 3. Execute actions for validated triggers
  const { result } = await runAutomationWorkflow(
    container
  ).run({
    input: {
      eventName: eventName,
      eventType: TriggerType.EVENT,
      triggerKey: `product-${id}`,
      context: contextData,
      contextType: "product",
    },
  })
}

export const config: SubscriberConfig = {
  event: eventName,
}
