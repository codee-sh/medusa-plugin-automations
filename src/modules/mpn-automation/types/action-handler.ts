import { AutomationTrigger } from "./interfaces"
import { FieldConfig } from "./types"

/**
 * Template renderer function type - can be sync or async
 */
export type TemplateRenderer = (params: {
  context: any
  contextType?: string | null
  options?: any
}) => any | Promise<any>

/**
 * Action handler interface - implement this to create custom actions
 */
export interface ActionHandler {
  /**
   * Unique identifier for the action (e.g., "email", "sms", "custom_email")
   */
  id: string

  /**
   * Label displayed in UI
   */
  label: string

  /**
   * Optional description of the action
   */
  description?: string

  /**
   * Fields for the action configuration
   */
  fields?: FieldConfig[]

  /**
   * Function that executes the action
   */
  executeAction: (params: {
    trigger: AutomationTrigger
    action: Record<string, any>
    context: any
    container: any
    eventName: string
    contextType?: string | null
  }) => Promise<{
    success: boolean
    message?: string
    data?: any
  }>

  /**
   * Optional path to config component for dynamic import
   */
  configComponentKey?: string

  /**
   * Optional template loaders for dynamic import
   */
  templateLoaders?: Record<string, any>

  /**
   * Register a template for this action handler
   * @param name - Template name
   * @param renderer - Template renderer function
   */
  registerTemplate?: (name: string, renderer: TemplateRenderer) => void

  /**
   * Get template renderer by name
   * @param name - Template name
   * @returns Template renderer or undefined
   */
  getTemplate?: (name: string) => TemplateRenderer | undefined

  /**
   * Render template (wrapper method)
   * @param params - Template rendering parameters
   * @returns Rendered template result
   */
  renderTemplate?: (params: {
    templateName: string
    context: any
    contextType?: string | null
    options?: any
  }) => Promise<any> | any
}
