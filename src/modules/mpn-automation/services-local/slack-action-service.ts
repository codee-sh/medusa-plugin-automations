import { BaseActionService } from "./base-action-service"
import {
  SlackBlock,
} from "../../../templates/slack/types"
import { getServicesTypesTemplatesWorkflow } from "@codee-sh/medusa-plugin-notification-emails/workflows/mpn-builder/get-services-types-templates"
import { slackServiceWorkflow } from "@codee-sh/medusa-plugin-notification-emails/workflows/mpn-builder-services/slack-service"

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
    const { result: { templates: allTemplates } } = await getServicesTypesTemplatesWorkflow(params.container).run({
      input: {
        service_id: this.id,
      },
    })

    // If service_id was provided, allTemplates will contain only one item
    const filteredTemplate = allTemplates.length > 0 ? allTemplates[0] : null
    const templatesNew = filteredTemplate ? filteredTemplate.templates : { system: [], db: [] }

    const newFieldsNew = this.fillTemplateNameFieldWithOptions(this.fields, [
      {
        groupName: "System",
        options: templatesNew.system.map((template: any) => ({
          value: template.id,
          name: template.name,
        })),
      },
      {
        groupName: "Database",
        options: templatesNew.db.map((template: any) => ({
          value: template.id,
          name: template.label,
        })),
      },
    ])

    return {
      value: this.id,
      label: this.label,
      description: this.description,
      configComponentKey: this.configComponentKey,
      fields: newFieldsNew,   
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
    container?: any
  }): Promise<{ text: string; blocks: SlackBlock[] }> {
    const {
      templateName,
      context,
      container,
    } = params

    const { result: { blocks, text } } = await slackServiceWorkflow(container).run({
      input: {
        template_id: templateName,
        data: context,
        options: params.options || {},
      },
    })

    return {
      text: text || `Notification for ${templateName}`,
      blocks: blocks,
    }
  }
}
