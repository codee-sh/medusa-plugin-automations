import { BaseActionService } from "./base-action-service"
import { slackService } from "@codee-sh/medusa-plugin-notification-emails/templates/slack"
import { transformContext } from "@codee-sh/medusa-plugin-notification-emails/utils"

export class SlackActionService extends BaseActionService {
  id = "slack"
  label = "Slack"
  enabled = true
  templates: Array<{ value: string; name: string }> = []
  events: Array<{ value: string; name: string }> = []
  
  constructor({ events }: { events?: any }) {
    super()

    this.events = events || []
  }

  fields = [
    // Add templateName field - options will be populated dynamically by service based on eventName
    this.addTemplateNameField(),
  ]

  async fetchData(params: {
    container: any
    eventName: string
  }): Promise<any> {
    const templates = this.getTemplatesForEvent({
      eventName: params.eventName,
      events: this.events,
    })

    const newFields = this.fillTemplateNameFieldWithOptions(this.fields, templates.map((template: any) => ({
      value: template.value,
      name: template.name,
    })))

    return {
      value: this.id,
      label: this.label,
      description: this.description,
      configComponentKey: this.configComponentKey,
      fields: newFields,   
      templates: this.templates,
      enabled: this.enabled,
    }
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
