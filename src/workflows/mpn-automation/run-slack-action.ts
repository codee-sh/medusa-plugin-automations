import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { sendNotificationSlackWorkflow } from "../notifications/send-slack"
import { AutomationAction } from "../../modules/mpn-automation/types/interfaces"

export interface RunSlackActionWorkflowInput {
  eventName?: string
  action: AutomationAction
  context: Record<string, any>
  contextType?: string | null
}

export interface RunSlackActionWorkflowOutput {
  success: boolean
  notificationId?: string
  error?: string
}

export const runSlackActionWorkflowId = "run-slack-action"

/**
 * Workflow wrapper for automation system that runs a slack action.
 *
 * This is a convenience wrapper around the universal sendNotificationSlackWorkflow,
 * specifically designed for use with automation actions.
 *
 * It extracts configuration from action.config and context, then calls
 * the universal sendNotificationSlackWorkflow.
 *
 * Configuration is stored in action.config:
 * - template: Optional - Template identifier for notification
 * - channel: Optional - Slack channel
 * - backendUrl: Optional - Backend URL for notifications
 *
 * @example
 * ```typescript
 * const { result } = await runSlackActionWorkflow(container).run({
 *   input: {
 *     action: {
 *       id: "action_123",
 *       action_type: "slack",
 *       config: {
 *         template: "inventory-level",
 *         channel: "#notifications"
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
export const runSlackActionWorkflow = createWorkflow(
  runSlackActionWorkflowId,
  (input: WorkflowData<RunSlackActionWorkflowInput>) => {
    // Transform automation action format for sendNotificationSlackWorkflow
    const options = transform(
      {
        action: input.action,
        eventName: input.eventName,
        contextType: input.contextType,
      },
      (data) => {
        const eventName = data?.eventName
        const action = data?.action
        const actionConfig = action?.config || {}

        return {
          templateName: actionConfig?.templateName,
          resourceId: data?.action?.id,
          resourceType: eventName,
          triggerType: "mpn"
        }
      }
    )

    const result = sendNotificationSlackWorkflow.runAsStep({
      input: {
        eventName: input.eventName,
        context: input.context,
        contextType: input.contextType,
        options: options,
      },
    })

    return new WorkflowResponse(result)
  }
)
