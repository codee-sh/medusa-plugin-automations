import { SlackTemplateOptions, SlackBlock } from "../types"
import { renderOrderBase } from "./base-order"

export interface RenderOrderCanceledParams {
  context: any
  contextType?: string | null
  options?: SlackTemplateOptions
}

export function renderOrderCanceled({
  context,
  contextType,
  options = {},
}: RenderOrderCanceledParams): {
  text: string
  blocks: SlackBlock[]
} {
  return renderOrderBase({
    context,
    contextType,
    options,
    eventType: "canceled",
  })
}

