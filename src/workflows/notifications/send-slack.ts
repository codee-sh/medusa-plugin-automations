import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { sendSlackStep } from "./steps/send-slack"

export interface SendSlackWorkflowInput {
  options: any
  context: any
  eventName?: string
  contextType?: string | null
}

export interface SendSlackWorkflowOutput {
  success: boolean
  notificationId?: string
  error?: string
}

export const sendNotificationSlackWorkflowId = "send-notification-slack"

/**
 * Universal workflow that sends a slack notification.
 *
 * This workflow can be used independently or as part of automation workflows.
 * It's not tied to automation system and can be used anywhere in the application.
 *
 * Configuration:
 * - templateName: Required - Name of the slack template
 *
 * @example
 * ```typescript
 * // Standalone usage
 * const { result } = await sendNotificationSlackWorkflow(container).run({
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
export const sendNotificationSlackWorkflow = createWorkflow(
  sendNotificationSlackWorkflowId,
  (input: WorkflowData<SendSlackWorkflowInput>) => {
    const result = sendSlackStep({
      eventName: input.eventName,
      context: input.context,
      contextType: input.contextType,
      options: input.options
    })

    return new WorkflowResponse(result)
  }
)
