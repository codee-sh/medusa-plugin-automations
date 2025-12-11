export const SLACK_TEMPLATES_NAMES = {
  INVENTORY_LEVEL: "inventory-level",
} as const;

export type SlackBlock = {
  type: string
  [key: string]: any
}

export type SlackTemplateData = any

export interface SlackTemplateOptions {
  backendUrl?: string
  locale?: string
  customTranslations?: Record<string, Record<string, any>>
  [key: string]: any
}

export interface SlackTemplateRendererParams {
  context: SlackTemplateData
  contextType?: string | null
  options?: SlackTemplateOptions
}

export type SlackTemplateRenderer = (
  params: SlackTemplateRendererParams
) =>
  | Promise<{ text: string; blocks: SlackBlock[] }>
  | { text: string; blocks: SlackBlock[] }
