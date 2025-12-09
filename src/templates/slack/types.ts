export const SLACK_TEMPLATES_NAMES = {
  INVENTORY_LEVEL: "inventory-level",
} as const;

export type SlackBlock = {
  type: string
  [key: string]: any
}

export type SlackTemplateData = any // Elastyczny typ dla różnych struktur danych

export interface SlackTemplateOptions {
  backendUrl?: string
  locale?: string
  customTranslations?: Record<string, Record<string, any>>
  [key: string]: any
}

export type SlackTemplateRenderer = (
  data: SlackTemplateData,
  options: SlackTemplateOptions
) =>
  | Promise<{ text: string; blocks: SlackBlock[] }>
  | { text: string; blocks: SlackBlock[] }
