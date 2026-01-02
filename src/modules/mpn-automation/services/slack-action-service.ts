import { BaseActionService } from "./base-action-service"
import { slackService } from "@codee-sh/medusa-plugin-notification-emails/templates/slack"
import { transformContext } from "@codee-sh/medusa-plugin-notification-emails/utils"

export class SlackActionService extends BaseActionService {
  id = "slack"
  label = "Slack"

  constructor() {
    super()
    this.initializeTemplates()
  }

  fields = [
    // Add templateName field - options will be populated dynamically by service based on eventName
    this.addTemplateNameField(),
  ]

  /**
   * Initialize default Slack templates
   * Slack engine already has all prebuild templates registered
   * This method can be used to register custom templates if needed
   */
  protected initializeTemplates(): void {
    // Slack engine already has all prebuild templates registered
    // You can register custom templates here if needed:
    // slackEngine.registerTemplate("custom-template", {
    //   ...slackEngine.getBaseTemplate(),
    //   getConfig: () => ({ blocks: [...], translations: {...} })
    // })
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
  }): Promise<{ text: string; blocks: any[] }> {

    const transformedContext = transformContext(params.contextType, params.context)

    const { blocks } = await slackService.render({
      templateName: params.templateName,
      data: {
        ...transformedContext,
        backend_url: params.options?.backendUrl,
      },
      options: params.options
    })

    // For Slack, the 'text' field is a fallback for notifications that don't support blocks.
    // We can derive it from the first header block or a generic message.
    const fallbackText =
      blocks.find((b) => b.type === "header" && b.text?.text)?.text?.text ||
      `Notification for ${params.templateName}`

    return {
      text: fallbackText,
      blocks: blocks,
    }
  }
}
