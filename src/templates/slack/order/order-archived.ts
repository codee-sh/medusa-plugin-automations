import { SlackTemplateOptions, SlackBlock } from "../types"
import { renderOrderBase } from "./base-order"

export interface RenderOrderArchivedParams {
  context: any
  contextType?: string | null
  options?: SlackTemplateOptions
}

export function renderOrderArchived({
  context,
  contextType,
  options = {},
}: RenderOrderArchivedParams): {
  text: string
  blocks: SlackBlock[]
} {
  return renderOrderBase({
    context,
    contextType,
    options,
    eventType: "archived",
  })
}

