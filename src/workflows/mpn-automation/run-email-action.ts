import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { sendEmailWorkflow } from "../notifications/send-email"
import { AutomationAction } from "../../modules/mpn-automation/types/interfaces"

export interface RunEmailActionWorkflowInput {
  action: AutomationAction
  context: Record<string, any>
  eventName?: string
  contextType?: string | null
}

export interface RunEmailActionWorkflowOutput {
  success: boolean
  notificationId?: string
  error?: string
}

export const runEmailActionWorkflowId = "run-email-action"

/**
 * Workflow wrapper for automation system that runs an email action.
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
 * const { result } = await runEmailActionWorkflow(container).run({
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
export const runEmailActionWorkflow = createWorkflow(
  runEmailActionWorkflowId,
  (input: WorkflowData<RunEmailActionWorkflowInput>) => {
    // Transform automation action format for sendEmailWorkflow
    const settings = transform(
      { action: input.action, eventName: input.eventName, contextType: input.contextType },
      (data) => {
        const actionConfig = data?.action?.config || {}
        const eventName = data?.eventName

        return {
          templateName: actionConfig?.templateName,
          to: actionConfig?.to,
          locale: actionConfig?.locale,
          subject: actionConfig?.subject,
          customTemplate: actionConfig?.customTemplate,
          template: actionConfig?.template,
          resourceId: data?.action?.id,
          resourceType: eventName,
          triggerType: "mpn",
        }
      }
    )

    const result = sendEmailWorkflow.runAsStep({
      input: {
        settings: settings,
        templateData: input.context,
        eventName: input.eventName,
        contextType: input.contextType,
      },
    })

    return new WorkflowResponse(result)
  }
)
