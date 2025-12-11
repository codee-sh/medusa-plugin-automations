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

export interface RenderProductVariantParams {
  context: SlackTemplateData
  contextType?: string | null
  options?: SlackTemplateOptions
}

export function renderProductVariant({
  context,
  contextType,
  options = {},
}: RenderProductVariantParams): { text: string; blocks: SlackBlock[] } {
  const backendUrl = options?.backendUrl || ""
  const locale = options?.locale || "pl"
  const productVariant = context?.product_variant

  console.log("productVariant", productVariant)
  console.log("contextType", contextType)

  // Merge custom translations if provided
  const mergedTranslations = mergeTranslations(
    translations,
    options.customTranslations
  )

  // Create translator function
  const t = createTranslator(locale, mergedTranslations)

  const blocksSections: SlackBlock[] = []

  if (productVariant?.title) {
    blocksSections.push({
      type: "header",
      text: {
        type: "plain_text",
        text: t("header.title", {
          productVariantTitle:
            productVariant?.title ||
            "unknown",
        }),
        emoji: true,
      },
    })
  }

  const blocks: SlackBlock[] =
    blocksSections.length > 0 ? blocksSections : []

  if (productVariant?.id && productVariant?.product?.id) {
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: t("actions.openInPanel"),
          },
          url: `${backendUrl}/app/products/${productVariant.product.id}/variants/${productVariant.id}`,
          style: "primary",
        },
      ],
    })
  }

  blocks.push({ type: "divider" })

  return {
    text: t("headerTitle", {
      productVariantId: productVariant?.id || "unknown",
    }),
    blocks,
  }
}
