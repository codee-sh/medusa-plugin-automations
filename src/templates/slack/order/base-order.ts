import { SlackTemplateOptions, SlackBlock } from "../types"
import { translations } from "./translations"
import {
  createTranslator,
  mergeTranslations,
} from "../../../utils"

export type OrderEventType = "placed" | "completed" | "updated" | "canceled" | "archived"

export interface RenderOrderBaseParams {
  context: any
  contextType?: string | null
  options?: SlackTemplateOptions
  eventType: OrderEventType
}

/**
 * Base function for rendering order Slack templates
 * Handles common logic for all order event types
 */
export function renderOrderBase({
  context,
  contextType,
  options = {},
  eventType,
}: RenderOrderBaseParams): {
  text: string
  blocks: SlackBlock[]
} {
  const backendUrl = options?.backendUrl || ""
  const locale = options?.locale || "pl"
  const order = context?.order

  // Merge custom translations if provided
  const mergedTranslations = mergeTranslations(
    translations,
    options.customTranslations
  )

  // Create translator function
  const t = createTranslator(locale, mergedTranslations)

  const blocks: SlackBlock[] = []

  if (order?.id) {
    blocks.push({
      type: "header",
      text: {
        type: "plain_text",
        text: t(`${eventType}.header.title`, {
          orderId: order?.display_id || order?.id || "unknown",
        }),
        emoji: true,
      },
    })
  }

  if (order?.id) {
    // Use "danger" style for canceled orders, "primary" for others
    const buttonStyle = eventType === "canceled" ? "danger" : "primary"

    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: t("actions.openInPanel"),
          },
          url: `${backendUrl}/app/orders/${order.id}`,
          style: buttonStyle,
        },
      ],
    })
  }

  blocks.push({ type: "divider" })

  return {
    text: t(`${eventType}.headerTitle`, {
      orderId: order?.display_id || order?.id || "unknown",
    }),
    blocks,
  }
}

