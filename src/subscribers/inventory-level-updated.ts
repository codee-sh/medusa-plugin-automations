import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { getInventoryLevelByIdWorkflow } from "../workflows/inventory/get-inventory-level-by-id"
import { runAutomationWorkflow } from "../workflows/mpn-automation/run-automation"
import { TriggerType } from "../utils/types"

const eventName = "inventory.inventory-level.updated"

/**
 * Subscriber that runs the automation workflow for the inventory level updated event.
 *
 * This subscriber is triggered when an inventory level is updated.
 * It runs the automation workflow.
 *
 * @param event - The event data containing the inventory level ID.
 * @param container - The container instance.
 */
export default async function inventoryLevelUpdatedHandler({
  event: {
    data: { id },
  },
  container,
}: SubscriberArgs<{ id: string }>) {
  // Retrieve inventory level with related inventory item
  const {
    result: { inventory_level },
  } = await getInventoryLevelByIdWorkflow(container).run({
    input: {
      inventory_level_id: id,
    },
  })

  const contextData = {
    inventory_level: inventory_level,
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
      triggerKey: `inventory_level-${id}`,
      context: contextData,
    },
  })
}

export const config: SubscriberConfig = {
  event: eventName,
}
