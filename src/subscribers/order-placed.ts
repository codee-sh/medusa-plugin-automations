import {
    SubscriberArgs,
    type SubscriberConfig,
  } from "@medusajs/medusa"
  import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
  import { renderTemplate } from "@codee_team/medusa-plugin-notification/templates/emails"
  import { formatDate, getFormattedAddress, getLocaleAmount, getStylizedAmount, getTotalCaptured } from "@codee_team/medusa-plugin-notification/utils"
  
  export default async function orderPlacedHandler({
    event: { data: { id, trigger_type } },
    container,
    pluginOptions,
  }: SubscriberArgs<{ id: string, trigger_type: string }>) {
    const notificationModuleService = container.resolve(
      Modules.NOTIFICATION
    )
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const triggerType = trigger_type || 'system'

    const { data: [order] } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "email",
        "created_at",
        "payment_collections.*",
        "items.*",
        "items.variant.*",
        "items.variant.product.*",
        "currency_code",
        "display_id",
        "shipping_address.*",
        "billing_address.*",
        "summary.*",
        "tax_total",
        "discount_total",
      ],
      filters: {
        id: id,
      },
    })

    if (!order) {
      return
    }

    const shippingAddressText = getFormattedAddress({ address: order.shipping_address }).join("<br/>");
    const billingAddressText = getFormattedAddress({ address: order.billing_address }).join("<br/>");
    const templateData = {
      subject: `#${order.display_id} - Order Placed`,
      orderNumber: `#${order.display_id}`,
      customerName: order.email,
      customerEmail: order.email,
      orderDate: formatDate({ date: order.created_at, includeTime: true, localeCode: "pl" }),
      totalAmount: order.items.reduce((acc, item) => acc + (item.variant?.prices?.[0]?.amount || 0) * item.quantity, 0),
      currency: order.currency_code,
      items: order.items.map((item) => ({
        thumbnail: item.thumbnail,
        title: item.title,
        quantity: item.quantity,
        price: getLocaleAmount(item.unit_price, order.currency_code),
      })),
      shippingAddress: shippingAddressText,
      billingAddress: billingAddressText,
      summary: {
        total: getLocaleAmount(order.summary.original_order_total, order.currency_code),
        paid_total: getLocaleAmount(getTotalCaptured(order.payment_collections || []), order.currency_code),
        tax_total: getLocaleAmount(order.tax_total, order.currency_code),
        discount_total: getLocaleAmount(order.discount_total, order.currency_code),
        currency_code: order.currency_code,
      }
    };
    
    const template = "order-placed"

    const { html, text } = renderTemplate(template, templateData, { locale: "pl" })
  
    const result = await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template,
      trigger_type: triggerType,
      resource_id: id,
      resource_type: "order",
      data: {
        subject: templateData.subject,
        html,
        text
      },
    })
  }
  
  export const config: SubscriberConfig = {
    event: "order.placed",
  }
