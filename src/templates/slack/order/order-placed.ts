import { SlackTemplateOptions, SlackBlock } from "../types"
import { renderOrderBase } from "./base-order"

export interface RenderOrderPlacedParams {
  context: any
  contextType?: string | null
  options?: SlackTemplateOptions
}

export function renderOrderPlaced({
  context,
  contextType,
  options = {},
}: RenderOrderPlacedParams): {
  text: string
  blocks: SlackBlock[]
} {
  return renderOrderBase({
    context,
    contextType,
    options,
    eventType: "placed",
  })
}

