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
import { validateNotificationTriggersByEventWorkflow } from "../workflows/mpn-automation/validate-notification-triggers-by-event"
import { getRuleAttributes } from "../modules/mpn-automation/rules"
import { inventoryLevelAttributes } from "../modules/mpn-automation/rules/inventory"
  
const eventName = "inventory.inventory-level.updated"

export default async function inventoryLevelUpdatedHandler({
  event: { data: { id } },
  container,
}: SubscriberArgs<{ id: string }>) {
  const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification")

  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const triggerType = 'system'

  console.log("inventoryLevelUpdatedHandler");

  // Retrieve inventory level with related inventory item
  const { result: { inventory_level } } = await getInventoryLevelByIdWorkflow(container).run({
    input: {
      inventory_level_id: id,
    }
  })
  console.log("inventory_level:", inventory_level);

  // Retrieve and validate all notification triggers for this event
  const { result: validationResult } = await validateNotificationTriggersByEventWorkflow(container).run({
    input: {
      event_name: eventName,
      context: {
        inventory_level: inventory_level,
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

  // // Process results for each trigger
  // for (const result of validationResult.results) {
  //   console.log(`Trigger ${result.trigger_name} (${result.trigger_id}):`, {
  //     passed: result.passed,
  //     is_valid: result.is_valid,
  //     rules_count: result.rules_count,
  //   })

  //   // If validation passed, perform action here (e.g. send notification)
  //   if (result.passed) {
  //     console.log(`Trigger ${result.trigger_name} passed validation - ready to send notification`)
  //     // TODO: Send notification

  //     // const templateName = TEMPLATES_NAMES.INVENTORY_LEVEL_UPDATED

  //     // const templateData = {
  //     //   inventory_level: {
  //     //     id: inventory_level.id,
  //     //     location_id: inventory_level.location_id,
  //     //     stocked_quantity: inventory_level.stocked_quantity,
  //     //     reserved_quantity: inventory_level.reserved_quantity,
  //     //     available_quantity: inventory_level.available_quantity,
  //     //   },
  //     //   location: {
  //     //     id: inventory_level.location_id,
  //     //     name: 'Test Location',
  //     //   },
  //     //   inventory_item: {
  //     //     id: inventory_level.inventory_item?.id,
  //     //     title: inventory_level.inventory_item?.title,
  //     //     sku: inventory_level.inventory_item?.sku,
  //     //     origin_country: inventory_level.inventory_item?.origin_country,
  //     //   },
  //     // }

  //     // const { html, text, subject } = await renderTemplate(
  //     //   templateName,
  //     //   templateData,
  //     //   { 
  //     //     locale: "pl",
  //     //     customTranslations: pluginOptions?.customTranslations?.[templateName]
  //     //   }
  //     // )

  //     // const notificationResult = await notificationModuleService.createNotifications({
  //     //   to: 'chris@iamcodee.co',
  //     //   channel: "email",
  //     //   template: templateName,
  //     //   trigger_type: triggerType,
  //     //   resource_id: id,
  //     //   resource_type: "inventory_level",
  //     //   data: templateData,
  //     //   content: {
  //     //     subject: subject,
  //     //     html,
  //     //     text,
  //     //   },
  //     // })

  //     // console.log("Notification sent:", notificationResult);     
  //   }
  // }
}

export const config: SubscriberConfig = {
  event: eventName,
}
