import { ComponentType } from "react"
import { NotificationTrigger, NotificationAction } from "../interfaces"
import { FieldConfig } from "../types"
/**
 * Extension point constant for registering actions in the container
 */
export const AUTOMATION_ACTION_EXTENSION_POINT = "automation.actions"

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

import { Control, FieldPath, FieldValues } from "react-hook-form"

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
 * Props for action display component
 */
export interface ActionDisplayComponentProps {
  action: NotificationAction
  config: Record<string, any>
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
  execute: (
    params: ActionExecuteParams
  ) => Promise<ActionExecuteResult>

  /**
   * Optional React component for configuring the action in forms
   */
  configComponent?: ComponentType<ActionConfigComponentProps>

  /**
   * Optional path to config component for dynamic import
   */
  configComponentPath?: string

  /**
   * Optional React component for displaying the action in lists/details
   */
  displayComponent?: ComponentType<ActionDisplayComponentProps>

  /**
   * Optional template loaders for dynamic import
   */
  templateLoaders?: Record<string, any>

  /**
   * Optional validation function for action configuration
   * Returns true if valid, or error message string if invalid
   */
  validateConfig?: (
    config: Record<string, any>
  ) => boolean | string

  /**
   * Metadata (icon, category, color, etc.)
   */
  metadata?: {
    icon?: string
    category?: string
    color?: string
    replace?: boolean // If true, replaces existing action with same id
  }
}

/**
 * Registration entry for action handlers in container
 */
export interface ActionHandlerRegistration {
  id: string
  handler: ActionHandler
  replace?: boolean
}

