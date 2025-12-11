import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import {
  Modules,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
// import { renderTemplate } from "@codee-sh/medusa-plugin-notification/templates/emails"
// import { TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails/types"
// import { formatDate, getFormattedAddress, getLocaleAmount, getTotalCaptured } from "@codee-sh/medusa-plugin-notification/utils"
// import { getPluginOptions } from "@codee-sh/medusa-plugin-notification/utils/plugins"

export default async function inventoryReservationItemUpdatedHandler({
  event: { data: data },
  container,
}: SubscriberArgs<any>) {
  // const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification")
  // const notificationModuleService = container.resolve(
  //   Modules.NOTIFICATION
  // )
  // const query = container.resolve(ContainerRegistrationKeys.QUERY)
  // const triggerType = trigger_type || 'system'
  console.log("inventoryReservationItemUpdatedHandler");
  console.log(data);
}

export const config: SubscriberConfig = {
  event: "inventory.reservation-item.updated",
}
