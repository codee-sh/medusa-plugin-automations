import { NotificationTrigger } from "./interfaces"
import { FieldConfig } from "./types"
import { FieldPath, FieldValues } from "react-hook-form"

/**
 * Props for action configuration component
 */
export interface ActionConfigComponentProps<TFieldValues extends FieldValues = FieldValues> {
  form: any
  name: FieldPath<TFieldValues>
  errors?: Record<string, string>
  fields?: any
}

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
  executeAction: (
    params: {
      trigger: NotificationTrigger;
      action: Record<string, any>
      context: any
      container: any
      eventName: string
    }
  ) => Promise<{
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
}