import {
  SlackTemplateOptions,
  SlackBlock,
} from "../types"
import { translations } from "./translations"
import {
  createTranslator,
  mergeTranslations,
} from "../../../utils"

export interface RenderInventoryLevelParams {
  context: any
  contextType?: string | null
  options?: SlackTemplateOptions
}

export function renderInventoryLevel({
  context,
  contextType,
  options = {},
}: RenderInventoryLevelParams): { text: string; blocks: SlackBlock[] } {
  const backendUrl = options?.backendUrl || ""
  const locale = options?.locale || "pl"
  const inventoryLevel = context?.inventory_level

  // Merge custom translations if provided
  const mergedTranslations = mergeTranslations(
    translations,
    options.customTranslations
  )

  // Create translator function
  const t = createTranslator(locale, mergedTranslations)

  const blocksSections: SlackBlock[] = []

  if (inventoryLevel?.inventory_item?.title) {
    blocksSections.push({
      type: "header",
      text: {
        type: "plain_text",
        text: t("header.title", {
          inventoryItemTitle:
            inventoryLevel?.inventory_item?.title ||
            "unknown",
        }),
        emoji: true,
      },
    })
  }

  if (inventoryLevel?.stock_locations?.length > 0) {
    blocksSections.push({
      type: "section",
      fields: inventoryLevel?.stock_locations?.map(
        (stockLocation) => ({
          type: "mrkdwn",
          text: `*${t("labels.location")}*\n${
            stockLocation.name
          }`,
        })
      ),
    })
  }

  if (inventoryLevel?.stocked_quantity) {
    blocksSections.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*${t("labels.quantity")}*\n${
            inventoryLevel?.stocked_quantity
          }`,
        },
      ],
    })
  }
  if (inventoryLevel?.reserved_quantity) {
    blocksSections.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*${t("labels.reservedQuantity")}*\n${
            inventoryLevel?.reserved_quantity
          }`,
        },
      ],
    })
  }

  if (inventoryLevel?.incoming_quantity) {
    blocksSections.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*${t("labels.incomingQuantity")}*\n${
            inventoryLevel?.incoming_quantity
          }`,
        },
      ],
    })
  }

  const blocks: SlackBlock[] =
    blocksSections.length > 0 ? blocksSections : []

  if (inventoryLevel?.inventory_item_id) {
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: t("actions.openInPanel"),
          },
          url: `${backendUrl}/app/inventory/${inventoryLevel.inventory_item_id}`,
          style: "primary",
        },
      ],
    })
  }

  blocks.push({ type: "divider" })

  return {
    text: t("headerTitle", {
      inventoryLevelId: inventoryLevel?.id || "unknown",
    }),
    blocks,
  }
}
