import { SlackTemplateRenderer, SlackTemplateData, SlackTemplateOptions, SlackBlock, SLACK_TEMPLATES_NAMES } from './types'
import { renderInventoryLevel } from './inventory-level'

/**
 * Template registry mapping template names to their renderers
 */
const templateRegistry: Record<string, SlackTemplateRenderer> = {
  [SLACK_TEMPLATES_NAMES.INVENTORY_LEVEL]: renderInventoryLevel
}

export function renderSlackTemplate(
  templateName: string,
  data: SlackTemplateData,
  options: SlackTemplateOptions = {}
): { text: string; blocks: SlackBlock[] } {
  const renderer = templateRegistry[templateName]
  
  if (!renderer) {
    throw new Error(`Slack template "${templateName}" not found. Available: ${Object.keys(templateRegistry).join(', ')}`)
  }

  const result = renderer(data, options)
  
  // Obsługa async/sync
  if (result instanceof Promise) {
    throw new Error('Async templates not supported yet. Use sync renderer.')
  }
  
  return result
}

export function registerSlackTemplate(
  name: string,
  renderer: SlackTemplateRenderer
): void {
  templateRegistry[name] = renderer
}