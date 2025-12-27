import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { getOrderByIdWorkflow } from "../workflows/order/get-order-by-id"
import { runAutomationWorkflow } from "../workflows/mpn-automation/run-automation"
import { TriggerType } from "../utils/types"

const eventName = "order.updated"

export default async function orderUpdatedHandler({
  event: {
    data: { id },
  },
  container,
}: SubscriberArgs<any>) {
  // Retrieve inventory level with related inventory item
  const {
    result: { order },
  } = await getOrderByIdWorkflow(container).run({
    input: {
      order_id: id,
    },
  })

  const contextData = {
    order: order,
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
      triggerKey: `order-${id}`,
      context: contextData,
      contextType: "order",
    },
  })  
}

export const config: SubscriberConfig = {
  event: eventName,
}
