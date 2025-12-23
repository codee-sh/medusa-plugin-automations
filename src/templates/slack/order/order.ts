import { SlackTemplateOptions, SlackBlock } from "../types"
import { translations } from "./translations"
import {
  createTranslator,
  mergeTranslations,
} from "../../../utils"

export interface RenderOrderParams {
  context: any
  contextType?: string | null
  options?: SlackTemplateOptions
}

export function renderOrder({
  context,
  contextType,
  options = {},
}: RenderOrderParams): {
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

  const blocksSections: SlackBlock[] = []

  if (order?.id) {
    blocksSections.push({
      type: "header",
      text: {
        type: "plain_text",
        text: t("header.title", {
          orderId: order?.id || "unknown",
        }),
        emoji: true,
      },
    })
  }

  const blocks: SlackBlock[] =
    blocksSections.length > 0 ? blocksSections : []

  if (order?.id) {
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
          style: "primary",
        },
      ],
    })
  }

  blocks.push({ type: "divider" })

  return {
    text: t("headerTitle", {
      orderId: order?.id || "unknown",
    }),
    blocks,
  }
}
