import { ActionHandler } from "../types"
import { FieldConfig } from "../types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Base action service class
 *
 * @param id - Action ID (default: "base")
 * @param label - Action label (default: "Base")
 * @param description - Action description (default: "")
 * @param configComponentKey - Action config component key (default: "BaseConfigComponent")
 * @param fields - Action fields (default: [])
 */
export class BaseActionService implements ActionHandler {
  id = "base"
  label = "Base"
  description = ""

  configComponentKey = "BaseConfigComponent"

  // Fields for the action configuration rendered in the admin panel then saved in the action config
  fields: FieldConfig[] = []

  /**
   * Helper method to add templateName field to fields array
   * Call this in constructor or fields initialization if you need template selection
   *
   * @param options - Template options array (will be populated dynamically by service if eventName is provided)
   * @param defaultValue - Default template value
   * @returns FieldConfig for template
   */
  protected addTemplateNameField(
    options: Array<any> = [],
    defaultValue?: string
  ): FieldConfig {
    return {
      name: "templateName",
      key: "templateName",
      label: "Template Name",
      type: "select" as const,
      required: true,
      options: options,
      defaultValue: defaultValue,
    }
  }

  /**
   * Fill template name field with options
   * @param field - Field config
   * @param templates - Templates array
   * @returns Field config with options filled
   */
  protected fillTemplateNameFieldWithOptions(
    fields: FieldConfig[],
    templates: Array<any> = []
  ): FieldConfig[] {
    return fields.map((field: FieldConfig) => {
      if (
        field.key === "templateName" &&
        field.type === "select"
      ) {
        return {
          ...field,
          options:
            templates.length > 0
              ? templates
              : field.options || [],
          defaultValue:
            templates.length > 0
              ? templates[0]?.value
              : field.defaultValue,
        }
      }
      return field
    })
  }

  /**
   * Get available templates for a given event name
   * Uses getAvailableEvents() to find the event and extract template
   *
   * @param eventName - Event name to search for
   * @returns Array of template options
   */
  getTemplatesForEvent({
    eventName,
    events,
  }: {
    eventName?: string
    events?: any
  }): Array<{ value: string; name: string }> {
    if (!eventName) {
      return []
    }

    const allEvents = events || []

    // Search through all event groups
    for (const group of allEvents) {
      const event = group.events?.find(
        (e: any) => e.value === eventName
      )
      if (event?.templates && event.templates.length > 0) {
        return event.templates
      }
    }

    return []
  }

  /**
   * Function that executes the action in the workflow actions
   *
   * @param trigger - Trigger object
   * @param action - Action object
   * @param context - Context object
   * @param container - Container object
   * @param eventName - Event name
   * @param contextType - Context type determining structure of data in context
   * @returns object with actionId, actionType and success status
   */
  async executeAction({
    trigger,
    action,
    context,
    container,
    eventName,
    contextType,
  }: {
    trigger: any
    action: Record<string, any>
    context: any
    container: any
    eventName: string
    contextType?: string | null
  }) {
    const eventBusService = container.resolve(
      Modules.EVENT_BUS
    )

    await eventBusService.emit({
      name: eventName,
      data: {
        eventName: eventName,
        action: action,
        trigger: trigger.id,
        context: context,
        contextType: contextType,
      },
    })

    return {
      actionId: action.id,
      actionType: action.action_type,
      success: true,
    }
  }
}
