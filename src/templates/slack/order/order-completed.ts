import { SlackTemplateOptions, SlackBlock } from "../types"
import { renderOrderBase } from "./base-order"

export interface RenderOrderCompletedParams {
  context: any
  contextType?: string | null
  options?: SlackTemplateOptions
}

export function renderOrderCompleted({
  context,
  contextType,
  options = {},
}: RenderOrderCompletedParams): {
  text: string
  blocks: SlackBlock[]
} {
  return renderOrderBase({
    context,
    contextType,
    options,
    eventType: "completed",
  })
}

