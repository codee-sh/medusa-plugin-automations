import { SlackTemplateRenderer, SlackTemplateData, SlackTemplateOptions, SlackBlock, SLACK_TEMPLATES_NAMES } from './types'
import { renderInventoryLevel } from './inventory-level'

/**
 * Template registry mapping template names to their renderers
 */
const templateRegistry: Record<string, SlackTemplateRenderer> = {
  [SLACK_TEMPLATES_NAMES.INVENTORY_LEVEL]: renderInventoryLevel
}

export interface RenderSlackTemplateParams {
  templateName: string
  context: SlackTemplateData
  contextType?: string | null
  options?: SlackTemplateOptions
}

/**
 * Render a slack template
 * 
 * @param templateName - Template name
 * @param context - Context data
 * @param contextType - Context type
 * @param options - Options
 * @returns Text and blocks
 */
export function renderSlackTemplate({
  templateName,
  context,
  contextType,
  options = {},
}: RenderSlackTemplateParams): { text: string; blocks: SlackBlock[] } {
  const renderer = templateRegistry[templateName]
  
  if (!renderer) {
    throw new Error(`Slack template "${templateName}" not found. Available: ${Object.keys(templateRegistry).join(', ')}`)
  }

  const result = renderer({
    context: context,
    contextType: contextType,
    options: options,
  })
  
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