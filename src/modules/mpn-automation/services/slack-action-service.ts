import { BaseActionService } from "./base-action-service"
import { SlackTemplateRenderer, SlackBlock } from "../../../templates/slack/types"
import { renderInventoryLevel } from "../../../templates/slack/inventory-level"
import { renderProductVariant } from "../../../templates/slack/product-variant/product-variant"
import { renderProduct } from "../../../templates/slack/product/product"

export class SlackActionService extends BaseActionService {
  id = "slack"
  label = "Slack"

  constructor() {
    super()
    this.initializeTemplates()
  }

  fields = [
    // Add templateName field - options will be populated dynamically by service based on eventName
    this.addTemplateNameField()
  ]

  /**
   * Initialize default Slack templates
   */
  protected initializeTemplates(): void {
    // Register default templates
    this.registerTemplate("inventory-level", renderInventoryLevel as any)
    this.registerTemplate("product-variant", renderProductVariant as any)
    this.registerTemplate("product", renderProduct as any)
  }

  /**
   * Render Slack template
   * @param params - Template rendering parameters
   * @returns Rendered Slack template with text and blocks
   */
  async renderTemplate(params: {
    templateName: string
    context: any
    contextType?: string | null
    options?: any
  }): Promise<{ text: string; blocks: SlackBlock[] }> {
    const renderer = this.getTemplate(params.templateName) as SlackTemplateRenderer | undefined

    if (!renderer) {
      throw new Error(
        `Slack template "${params.templateName}" not found. Available templates: ${Array.from(this.templates_.keys()).join(", ")}`
      )
    }

    const result = renderer({
      context: params.context,
      contextType: params.contextType,
      options: params.options || {},
    })

    // Handle both sync and async renderers
    return result instanceof Promise ? await result : result
  }
}
