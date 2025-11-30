import {
    SubscriberArgs,
    type SubscriberConfig,
  } from "@medusajs/medusa"
  import { Modules, ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
  import { getPluginOptions } from "@codee-sh/medusa-plugin-notification/utils/plugins"
  import { renderTemplate } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"
  import { TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/emails/types"

  export default async function mpnAutomationActionEmailExecutedHandler({
    event: { data: data },
    container,
  }: SubscriberArgs<any>) {
    const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification-emails")
  
    const notificationModuleService = container.resolve(
      Modules.NOTIFICATION
    )
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const triggerType = 'system'

    console.log("mpnAutomationActionEmailExecutedHandler");
    console.log(data);

    const { action, context } = data
    const { inventory_level } = context
  
    // const templateName = TEMPLATES_NAMES.INVENTORY_LEVEL_UPDATED

    // const templateData = {
    //   inventory_level: {
    //     id: inventory_level.id,
    //     location_id: inventory_level.location_id,
    //     stocked_quantity: inventory_level.stocked_quantity,
    //     reserved_quantity: inventory_level.reserved_quantity,
    //     available_quantity: inventory_level.available_quantity,
    //   },
    //   location: {
    //     id: inventory_level.location_id,
    //     name: 'Test Location',
    //   },
    //   inventory_item: {
    //     id: inventory_level.inventory_item?.id,
    //     title: inventory_level.inventory_item?.title,
    //     sku: inventory_level.inventory_item?.sku,
    //     origin_country: inventory_level.inventory_item?.origin_country,
    //   },
    // }

    // const { html, text, subject } = await renderTemplate(
    //   templateName,
    //   templateData,
    //   { 
    //     locale: "pl",
    //     customTranslations: pluginOptions?.customTranslations?.[templateName]
    //   }
    // )

    // const notificationResult = await notificationModuleService.createNotifications({
    //   to: 'chris@iamcodee.co',
    //   channel: "email",
    //   template: "inventory-level-updated",
    //   trigger_type: triggerType,
    //   resource_id: 'action_id',
    //   resource_type: "mpn.automation.action.email",
    //   data: context,
    //   content: {
    //     subject: 'Low stock alert',
    //     html: 'Low stock alert',
    //     text: 'Low stock alert',
    //   },
    // })    
  }
  
  export const config: SubscriberConfig = {
    event: "mpn.automation.action.email.executed",
  }
  