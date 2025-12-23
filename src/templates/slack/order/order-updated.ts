import { SlackTemplateOptions, SlackBlock } from "../types"
import { renderOrderBase } from './base-order'

export interface RenderOrderUpdatedParams {
  context: any
  contextType?: string | null
  options?: SlackTemplateOptions
}

export function renderOrderUpdated({
  context,
  contextType,
  options = {},
}: RenderOrderUpdatedParams): {
  text: string
  blocks: SlackBlock[]
} {
  return renderOrderBase({
    context,
    contextType,
    options,
    eventType: "updated",
  })
}

