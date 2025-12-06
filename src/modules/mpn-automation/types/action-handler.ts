import { ComponentType } from "react"
import { NotificationTrigger, NotificationAction } from "./interfaces"
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
 * Parameters passed to action execution
 */
export interface ActionExecuteParams {
  config: Record<string, any>
  context: {
    trigger: NotificationTrigger
    eventData?: any
    [key: string]: any
  }
}

/**
 * Result returned from action execution
 */
export interface ActionExecuteResult {
  success: boolean
  message?: string
  data?: any
}

/**
 * Action handler interface - implement this to create custom actions
 */
export interface ActionHandler {
  identifier: string
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
      action: Record<string, any>
      context: any
      result: any
      container: any
      eventName: string
      triggerId: string
    }
  ) => Promise<ActionExecuteResult>

  /**
   * Optional path to config component for dynamic import
   */
  configComponentKey?: string

  /**
   * Optional template loaders for dynamic import
   */
  templateLoaders?: Record<string, any>
}