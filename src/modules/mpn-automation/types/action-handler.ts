import { NotificationTrigger } from "./interfaces"
import { FieldConfig } from "./types"
import { FieldPath, FieldValues } from "react-hook-form"

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
    trigger: NotificationTrigger
    action: Record<string, any>
    context: any
    container: any
    eventName: string
  }) => Promise<{
    success: boolean
    message?: string
    data?: any
  }>

  /**
   * Helper method to add templateName field to fields array
   * Call this in constructor or fields initialization if you need template selection
   *
   * @param options - Template options array (will be populated dynamically by service if eventName is provided)
   * @param defaultValue - Default template value
   * @returns FieldConfig for template
   */
  addTemplateNameField: () => FieldConfig

  /**
   * Optional path to config component for dynamic import
   */
  configComponentKey?: string

  /**
   * Optional template loaders for dynamic import
   */
  templateLoaders?: Record<string, any>
}
