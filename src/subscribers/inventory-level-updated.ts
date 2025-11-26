import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules, ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
// import { renderTemplate } from "@codee-sh/medusa-plugin-notification/templates/emails"
// import { TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails/types"
// import { formatDate, getFormattedAddress, getLocaleAmount, getTotalCaptured } from "@codee-sh/medusa-plugin-notification/utils"
import { getPluginOptions } from "@codee-sh/medusa-plugin-notification/utils/plugins"
import { getInventoryLevelByIdWorkflow } from "../workflows/inventory/get-inventory-level-by-id"
import { validateNotificationTriggersByEventWorkflow } from "../workflows/mpn-notification/validate-notification-triggers-by-event"
  
const eventName = "inventory.inventory-level.updated"

export default async function inventoryLevelUpdatedHandler({
  event: { data: { id } },
  container,
}: SubscriberArgs<{ id: string }>) {
  // const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification")

  // const notificationModuleService = container.resolve(
  //   Modules.NOTIFICATION
  // )
  // const query = container.resolve(ContainerRegistrationKeys.QUERY)
  // const triggerType = trigger_type || 'system'

  console.log("inventoryLevelUpdatedHandler");
  console.log("inventory_level_id:", id);

  // Retrieve inventory level with related inventory item
  const { result: inventoryLevelResult } = await getInventoryLevelByIdWorkflow(container).run({
    input: {
      inventory_level_id: id,
    }
  })

  const inventoryLevel = inventoryLevelResult.inventory_level

  // Retrieve and validate all notification triggers for this event
  const { result: validationResult } = await validateNotificationTriggersByEventWorkflow(container).run({
    input: {
      event_name: eventName,
      context: {
        inventory_level: inventoryLevel,
      },
    }
  })

  console.log("Validation results:", {
    triggers_found: validationResult.triggers_found,
    has_triggers: validationResult.has_triggers,
    results: validationResult.results,
  })

  // If no triggers found, exit early
  if (!validationResult.has_triggers) {
    console.log(`No active triggers found for event: ${eventName}`)
    return
  }

  // Process results for each trigger
  for (const result of validationResult.results) {
    console.log(`Trigger ${result.trigger_name} (${result.trigger_id}):`, {
      passed: result.passed,
      is_valid: result.is_valid,
      rules_count: result.rules_count,
    })

    // If validation passed, perform action here (e.g. send notification)
    if (result.passed) {
      console.log(`Trigger ${result.trigger_name} passed validation - ready to send notification`)
      // TODO: Send notification
    }
  }
}

export const config: SubscriberConfig = {
  event: eventName,
}
