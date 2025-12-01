import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { getInventoryLevelByIdWorkflow } from "../workflows/inventory/get-inventory-level-by-id"
import { executeAutomationWorkflow } from "../workflows/mpn-automation"
import { TriggerType } from "../utils/types"
  
const eventName = "inventory.inventory-level.updated"

export default async function inventoryLevelUpdatedHandler({
  event: { data: { id } },
  container,
}: SubscriberArgs<{ id: string }>) {
  // Retrieve inventory level with related inventory item
  const { result: { inventory_level } } = await getInventoryLevelByIdWorkflow(container).run({
    input: {
      inventory_level_id: id,
    }
  })

  const contextData = {
    inventory_level: inventory_level,
  }

  // Execute automation workflow - this will:
  // 1. Retrieve triggers for the event
  // 2. Validate triggers against context
  // 3. Execute actions for validated triggers
  const { result } = await executeAutomationWorkflow(container).run({
    input: {
      event_name: eventName,
      event_type: TriggerType.EVENT,
      context: contextData,
    }
  })

  console.log("Automation execution results:", {
    triggers_found: result.triggers_found,
    triggers_validated: result.triggers_validated,
    triggers_executed: result.triggers_executed,
    total_actions_executed: result.total_actions_executed,
  })

  // Log details for each trigger
  result.results.forEach((triggerResult) => {
    if (triggerResult.is_valid && triggerResult.actions_executed > 0) {
      console.log(`Trigger "${triggerResult.trigger_name}" executed ${triggerResult.actions_executed} actions`)
    }
  })
}

export const config: SubscriberConfig = {
  event: eventName,
}
