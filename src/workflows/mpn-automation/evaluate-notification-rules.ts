import { createWorkflow, WorkflowData, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { evaluateNotificationRulesStep } from "./steps/evaluate-notification-rules"
import { NotificationTrigger } from "../../modules/mpn-automation/interfaces"

export interface EvaluateNotificationRulesWorkflowInput {
  trigger: NotificationTrigger
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

