import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { sendEmailStep } from "./steps/send-email"
import type { TemplateData } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"
import { logStep } from "../steps/log-step"

export interface SendEmailWorkflowInput {
  settings: any
  templateData: TemplateData
  eventName?: string
  contextType?: string | null
}

export interface SendEmailWorkflowOutput {
  success: boolean
  notificationId?: string
  error?: string
}

export const sendEmailWorkflowId = "send-email"

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
 * const { result } = await sendEmailWorkflow(container).run({
 *   input: {
 *     settings: {
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
export const sendEmailWorkflow = createWorkflow(
  sendEmailWorkflowId,
  (input: WorkflowData<SendEmailWorkflowInput>) => {
    const result = sendEmailStep({
      settings: input.settings,
      templateData: input.templateData,
      eventName: input.eventName,
      contextType: input.contextType,
    })

    return new WorkflowResponse(result)
  }
)
