import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { sendSlackWorkflow } from "../notifications/send-slack"
import { NotificationAction } from "../../modules/mpn-automation/types/interfaces"

export interface RunSlackActionWorkflowInput {
  action: NotificationAction
  context: Record<string, any>
  eventName?: string
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
 * This is a convenience wrapper around the universal sendSlackWorkflow,
 * specifically designed for use with automation actions.
 *
 * It extracts configuration from action.config and context, then calls
 * the universal sendSlackWorkflow.
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
