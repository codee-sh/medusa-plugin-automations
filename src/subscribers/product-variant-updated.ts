import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { getProductVariantByIdWorkflow } from "../workflows/product-variant/get-product-variant-by-id"
import { runAutomationWorkflow } from "../workflows/mpn-automation/run-automation"
import { TriggerType } from "../utils/types"

const eventName = "product-variant.updated"

/**
 * Subscriber that runs the automation workflow for the product variant updated event.
 *
 * This subscriber is triggered when a product variant is updated.
 * It runs the automation workflow.
 *
 * @param event - The event data containing the product variant ID.
 * @param container - The container instance.
 */
export default async function productVariantUpdatedHandler({
  event: {
    data: { id },
  },
  container,
}: SubscriberArgs<{ id: string }>) {
  // Retrieve product variant with related product
  const {
    result: { product_variant },
  } = await getProductVariantByIdWorkflow(container).run({
    input: {
      product_variant_id: id,
    },
  })

  const contextData = {
    product_variant: product_variant,
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
      triggerKey: `product_variant-${id}`,
      context: contextData,
      contextType: "product-variant",
    },
  })
}

export const config: SubscriberConfig = {
  event: eventName,
}
