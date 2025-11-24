import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules, ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { renderTemplate } from "@codee-sh/medusa-plugin-notification/templates/emails"
import { TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails/types"
import { formatDate, getFormattedAddress, getLocaleAmount, getTotalCaptured } from "@codee-sh/medusa-plugin-notification/utils"
import { getPluginOptions } from "@codee-sh/medusa-plugin-notification/utils/plugins"
  
export default async function paymentCapturedHandler({
  event: { data: { id, trigger_type } },
  container,
}: SubscriberArgs<{ id: string, trigger_type: string }>) {
  const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification")

  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const triggerType = trigger_type || 'system'
  
  console.log("id", id);

  if (!id) {
    throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Payment ID is required")
  }

  const { data: [payment] } = await query.graph({
    entity: "payment",
    fields: [
      "*",
    ],
    filters: {
      id: id,
    },
  })

  if (!payment) {
    return
  }

  console.log("payment", payment);
  console.log("trigger_type", trigger_type);

  // const shippingAddressText = getFormattedAddress({ address: order.shipping_address }).join("<br/>");
  // const billingAddressText = getFormattedAddress({ address: order.billing_address }).join("<br/>");
  // const templateData = {
  //   sales_channel: {
  //     name: order?.sales_channel?.name,
  //     description: order?.sales_channel?.description,
  //   },
  //   orderNumber: `#${order.display_id}`,
  //   customerName: order.email,
  //   customerEmail: order.email,
  //   orderDate: formatDate({ date: order.created_at, includeTime: true, localeCode: "pl" }),
  //   totalAmount: order.items.reduce((acc, item) => acc + (item.variant?.prices?.[0]?.amount || 0) * item.quantity, 0),
  //   currency: order.currency_code,
  //   items: order.items.map((item) => ({
  //     thumbnail: item.thumbnail,
  //     title: item.title,
  //     quantity: item.quantity,
  //     price: getLocaleAmount(item.unit_price, order.currency_code),
  //   })),
  //   shippingAddress: shippingAddressText,
  //   billingAddress: billingAddressText,
  //   summary: {
  //     total: getLocaleAmount(order.summary.original_order_total, order.currency_code),
  //     paid_total: getLocaleAmount(getTotalCaptured(order.payment_collections || []), order.currency_code),
  //     tax_total: getLocaleAmount(order.tax_total, order.currency_code),
  //     discount_total: getLocaleAmount(order.discount_total, order.currency_code),
  //     currency_code: order.currency_code,
  //   }
  // };
  
  // const templateName = TEMPLATES_NAMES.ORDER_PLACED

  // const { html, text, subject } = await renderTemplate(
  //   templateName,
  //   templateData,
  //   { 
  //     locale: "pl",
  //     customTranslations: pluginOptions?.customTranslations?.[templateName]
  //   }
  // )

  // const result = await notificationModuleService.createNotifications({
  //   to: order.email,
  //   channel: "email",
  //   template: templateName,
  //   trigger_type: triggerType,
  //   resource_id: id,
  //   resource_type: "order",
  //   data: templateData,
  //   content: {
  //     subject: subject,
  //     html,
  //     text,
  //   },
  // })
}

export const config: SubscriberConfig = {
  event: "payment.captured",
}
