import {
  SlackTemplateData,
  SlackTemplateOptions,
  SlackBlock,
} from "../types"
import { translations } from "./translations"
import {
  createTranslator,
  mergeTranslations,
} from "../../../utils"

export interface RenderProductParams {
  context: SlackTemplateData
  contextType?: string | null
  options?: SlackTemplateOptions
}

export function renderProduct({
  context,
  contextType,
  options = {},
}: RenderProductParams): { text: string; blocks: SlackBlock[] } {
  const backendUrl = options?.backendUrl || ""
  const locale = options?.locale || "pl"
  const product = context?.product

  console.log("product", product)
  console.log("contextType", contextType)

  // Merge custom translations if provided
  const mergedTranslations = mergeTranslations(
    translations,
    options.customTranslations
  )

  // Create translator function
  const t = createTranslator(locale, mergedTranslations)

  const blocksSections: SlackBlock[] = []

  if (product?.title) {
    blocksSections.push({
      type: "header",
      text: {
        type: "plain_text",
        text: t("header.title", {
          productTitle:
            product?.title ||
            "unknown",
        }),
        emoji: true,
      },
    })
  }

  const blocks: SlackBlock[] =
    blocksSections.length > 0 ? blocksSections : []

  if (product?.id) {
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: t("actions.openInPanel"),
          },
          url: `${backendUrl}/app/products/${product.id}`,
          style: "primary",
        },
      ],
    })
  }

  blocks.push({ type: "divider" })

  return {
    text: t("headerTitle", {
      productId: product?.id || "unknown",
    }),
    blocks,
  }
}
