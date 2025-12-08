import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { sendSlackStep } from "./steps/send-slack"

export interface SendSlackWorkflowInput {
  settings: any
  context: any
  eventName?: string
}

export interface SendSlackWorkflowOutput {
  success: boolean
  notificationId?: string
  error?: string
}

export const sendSlackWorkflowId = "send-slack"

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
 * const { result } = await sendSlackWorkflow(container).run({
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
export const sendSlackWorkflow = createWorkflow(
  sendSlackWorkflowId,
  (input: WorkflowData<SendSlackWorkflowInput>) => {
    const result = sendSlackStep({
      settings: input.settings,
      context: input.context,
      eventName: input.eventName,
    })

    return new WorkflowResponse(result)
  }
)
