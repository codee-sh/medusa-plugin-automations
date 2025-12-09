import { SlackTemplateData, SlackTemplateOptions, SlackBlock } from '../types'
import { translations } from './translations'
import { createTranslator, mergeTranslations } from '../../../utils'

export function renderInventoryLevel(
  data: SlackTemplateData,
  options: SlackTemplateOptions = {}
): { text: string; blocks: SlackBlock[] } {
  const backendUrl = options.backendUrl || ''
  const inventoryLevel = data?.inventory_level
  const locale = options.locale || 'pl'
  
  // Merge custom translations if provided
  const mergedTranslations = mergeTranslations(
    translations,
    options.customTranslations
  )
  
  // Create translator function
  const t = createTranslator(locale, mergedTranslations)

  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: t('headerTitle', {
          inventoryItemTitle: inventoryLevel?.inventory_item.title || 'unknown'
        }),
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*${t('labels.location')}*\n${inventoryLevel?.location_id}`
        },
        {
          type: "mrkdwn",
          text: `*${t('labels.quantity')}*\n${inventoryLevel?.stocked_quantity}`
        }
      ]
    },    
  ]

  if (inventoryLevel?.inventory_item_id) {
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: t('actions.openInPanel'),
          },
          url: `${backendUrl}/app/inventory/${inventoryLevel.inventory_item_id}`,
          style: "primary",
        },
      ],
    })
  }

  blocks.push({ type: "divider" })

  return {
    text: t('headerTitle', {
      inventoryLevelId: inventoryLevel?.id || 'unknown'
    }),
    blocks,
  }
}