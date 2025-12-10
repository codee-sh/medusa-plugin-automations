import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { sendSlackWorkflow } from "../notifications/send-slack"
import { NotificationAction } from "../../modules/mpn-automation/types/interfaces"

export interface SendSlackActionWorkflowInput {
  action: NotificationAction
  context: Record<string, any>
  eventName?: string
  contextType?: string | null
}

export interface SendSlackActionWorkflowOutput {
  success: boolean
  notificationId?: string
  error?: string
}

export const sendSlackActionWorkflowId = "send-slack-action"

/**
 * Workflow wrapper for automation system that sends an email notification.
 *
 * This is a convenience wrapper around the universal sendEmailWorkflow,
 * specifically designed for use with automation actions.
 *
 * It extracts configuration from action.config and context, then calls
 * the universal sendEmailWorkflow.
 *
 * Configuration is stored in action.config:
 * - templateName: Required - Name of the email template
 * - to: Required - Recipient email address
 * - locale: Optional - Locale for translations (default: "pl")
 * - customTemplate: Optional - Path to custom template function
 * - subject: Optional - Custom subject (otherwise uses template default)
 * - template: Optional - Template identifier for notification (defaults to templateName)
 *
 * @example
 * ```typescript
 * const { result } = await sendEmailActionWorkflow(container).run({
 *   input: {
 *     action: {
 *       id: "action_123",
 *       action_type: "email",
 *       config: {
 *         templateName: "inventory-level",
 *         to: "admin@example.com",
 *         locale: "pl"
 *       }
 *     },
 *     context: {
 *       inventory_level: {
 *         id: "il_123",
 *         stocked_quantity: 5
 *       }
 *     }
 *   }
 * })
 * ```
 */
export const sendSlackActionWorkflow = createWorkflow(
  sendSlackActionWorkflowId,
  (input: WorkflowData<SendSlackActionWorkflowInput>) => {
    // Transform automation action format for sendSlackWorkflow
    const settings = transform(
      { action: input.action, eventName: input.eventName, contextType: input.contextType },
      (data) => {
        const actionConfig = data?.action?.config || {}
        const eventName = data?.eventName

        return {
          template: actionConfig?.template,
          resourceId: data?.action?.id,
          resourceType: eventName,
          channel: actionConfig?.channel,
          triggerType: "mpn",
          backendUrl: actionConfig?.backendUrl,
        }
      }
    )

    const result = sendSlackWorkflow.runAsStep({
      input: {
        settings: settings,
        context: input.context,
        eventName: input.eventName,
        contextType: input.contextType,
      },
    })

    return new WorkflowResponse(result)
  }
)
