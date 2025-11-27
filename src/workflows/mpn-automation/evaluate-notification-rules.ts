import { createWorkflow, WorkflowData, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import type { InventoryTypes } from "@medusajs/framework/types"
import { evaluateNotificationRulesStep } from "./steps/evaluate-notification-rules"
import { NotificationRule } from "./utils/evaluate-rules"

export interface EvaluateNotificationRulesWorkflowInput {
  trigger: {
    id: string
    trigger_id: string
    name: string
    description: string | null
    trigger_type: "event" | "schedule" | "manual"
    event_name: string | null
    interval_minutes: number | null
    last_run_at: Date | null
    active: boolean
    channels: Record<string, boolean> | null
    metadata: Record<string, any> | null
    rules: NotificationRule[]
  }
  context: Record<string, any>
}

export const evaluateNotificationRulesWorkflowId = "evaluate-notification-rules"

/**
 * This workflow evaluates notification rules against inventory level data.
 * 
 * @example
 * const { result } = await evaluateNotificationRulesWorkflow(container).run({
 *   input: {
 *     trigger: { ... },
 *     context: { ... }
 *   }
 * })
 */
export const evaluateNotificationRulesWorkflow = createWorkflow(
  evaluateNotificationRulesWorkflowId,
  (input: WorkflowData<EvaluateNotificationRulesWorkflowInput>) => {
    const result = evaluateNotificationRulesStep({
      trigger: input.trigger,
      context: input.context,
    })

    return new WorkflowResponse(result)
  }
)

