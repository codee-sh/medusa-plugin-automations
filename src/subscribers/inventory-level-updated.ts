import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { getInventoryLevelByIdWorkflow } from "../workflows/inventory/get-inventory-level-by-id"
import { validateNotificationTriggersByEventWorkflow } from "../workflows/mpn-automation/validate-notification-triggers-by-event"
  
const eventName = "inventory.inventory-level.updated"

export default async function inventoryLevelUpdatedHandler({
  event: { data: { id } },
  container,
}: SubscriberArgs<{ id: string }>) {
  const eventBusService = container.resolve(Modules.EVENT_BUS)

  // Retrieve inventory level with related inventory item
  const { result: { inventory_level } } = await getInventoryLevelByIdWorkflow(container).run({
    input: {
      inventory_level_id: id,
    }
  })

  const contextData = {
    inventory_level: inventory_level,
  }

  // Retrieve and validate all notification triggers for this event
  const { result: validationResult } = await validateNotificationTriggersByEventWorkflow(container).run({
    input: {
      event_name: eventName,
      context: contextData,
    }
  })

  console.log("Validation results:", {
    triggers_found: validationResult.triggers_found,
    has_triggers: validationResult.has_triggers,
    results: JSON.stringify(validationResult.results, null, 2),
  })

  // If no triggers found, exit early
  if (!validationResult.has_triggers) {
    console.log(`No active triggers found for event: ${eventName}`)
    return
  }

  // // Process results for each trigger
  for (const result of validationResult.results) {
    console.log(`Trigger ${result.trigger_name} (${result.trigger_id}):`, {
      passed: result.passed,
      is_valid: result.is_valid,
      rules_count: result.rules_count,
    })

    // If validation passed, emit action event
    if (result.passed) {
      result.actions.forEach((action: any) => {
        if (action.action_type === "email") { 
          eventBusService.emit({
            name: "mpn.automation.action.email.executed",
            data: {
              action: action,
              context: contextData,
            },
          })
        } else if (action.action_type === "sms") {
          eventBusService.emit({
            name: "mpn.automation.action.sms.executed",
            data: {
              action: action,
              context: contextData,
            },
          })
        } else if (action.action_type === "push") {
          eventBusService.emit({
            name: "mpn.automation.action.push.executed",
            data: {
              action: action,
              context: contextData,
            },
          })
        } else if (action.action_type === "in_app") {
          eventBusService.emit({
            name: "mpn.automation.action.in_app.executed",
            data: {
              action: action,
              context: contextData,
            },
          })
        }
      }) 
    }
  }
}

export const config: SubscriberConfig = {
  event: eventName,
}
