import { ActionHandler, TemplateRenderer } from "../types"
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

  // Template registry - each service manages its own templates
  protected templates_: Map<string, TemplateRenderer> = new Map()

  /**
   * Register a template for this service
   * @param name - Template name
   * @param renderer - Template renderer function
   */
  registerTemplate(name: string, renderer: TemplateRenderer): void {
    this.templates_.set(name, renderer)
  }

  /**
   * Get template renderer by name
   * @param name - Template name
   * @returns Template renderer or undefined
   */
  getTemplate(name: string): TemplateRenderer | undefined {
    return this.templates_.get(name)
  }

  /**
   * Initialize default templates (override in subclasses)
   * Called automatically in constructor
   */
  protected initializeTemplates(): void {
    // Override in subclasses to register default templates
  }

  /**
   * Helper method to add templateName field to fields array
   * Call this in constructor or fields initialization if you need template selection
   *
   * @param options - Template options array (will be populated dynamically by service if eventName is provided)
   * @param defaultValue - Default template value
   * @returns FieldConfig for template
   */
  protected addTemplateNameField(
    options: Array<{ value: string; name: string }> = [],
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
