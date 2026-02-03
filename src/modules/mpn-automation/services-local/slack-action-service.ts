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
    
    this.initializeTemplates()

    this.events = events || []
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

  async fetchData(params: {
    container: any
    eventName: string
  }): Promise<any> {
    this.templates = this.getTemplatesForEvent({
      eventName: params.eventName,
      events: this.events,
    })

    const templates = this.templates

    const newFields = this.fields.map((field) => {
      if (
        field.key === "templateName" &&
        field.type === "select"
      ) {
        return {
          ...field,
          options:
            templates.length > 0
              ? templates.map((template: any) => ({
                value: template.value,
                name: template.name,
              }))
              : field.options || [],
          defaultValue:
            templates.length > 0
              ? templates[0]?.value
              : field.defaultValue,
        }
      }
      return field
    })

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
