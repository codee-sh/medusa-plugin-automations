import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { sendEmailStep } from "./steps/send-email"

export interface SendEmailWorkflowInput {
  options: any
  templateData: any
  eventName?: string
  contextType?: string | null
}

export interface SendEmailWorkflowOutput {
  success: boolean
  notificationId?: string
  error?: string
}

export const sendNotificationEmailWorkflowId = "send-notification-email"

/**
 * Universal workflow that sends an email notification.
 *
 * This workflow can be used independently or as part of automation workflows.
 * It's not tied to automation system and can be used anywhere in the application.
 *
 * Configuration:
 * - templateName: Required - Name of the email template
 * - to: Required - Recipient email address
 * - locale: Optional - Locale for translations (default: "pl")
 * - customTemplate: Optional - Path to custom template function
 * - subject: Optional - Custom subject (otherwise uses template default)
 * - template: Optional - Template identifier for notification (defaults to templateName)
 * - resourceId: Optional - Resource ID for notification tracking
 * - resourceType: Optional - Resource type for notification tracking
 *
 * @example
 * ```typescript
 * // Standalone usage
 * const { result } = await sendNotificationEmailWorkflow(container).run({
 *   input: {
 *     options: {
 *       templateName: "inventory-level",
 *       to: "admin@example.com",
 *       locale: "pl"
 *     },
 *     templateData: {
 *       inventory_level: {
 *         id: "il_123",
 *         stocked_quantity: 5
 *       }
 *     }
 *   }
 * })
 * ```
 */
export const sendNotificationEmailWorkflow = createWorkflow(
  sendNotificationEmailWorkflowId,
  (input: WorkflowData<SendEmailWorkflowInput>) => {
    const result = sendEmailStep({
      options: input.options,
      templateData: input.templateData,
      eventName: input.eventName,
      contextType: input.contextType,
    })

    return new WorkflowResponse(result)
  }
)
