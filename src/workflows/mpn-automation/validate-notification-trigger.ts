import { createWorkflow, WorkflowData, WorkflowResponse, transform, when } from "@medusajs/framework/workflows-sdk"
import { getNotificationTriggerByIdStep } from "./steps/get-notification-trigger-by-id"
import { evaluateNotificationRulesStep } from "./steps/evaluate-notification-rules"

export interface ValidateNotificationTriggerWorkflowInput {
  trigger_id: string
  context: Record<string, any>
}

export interface ValidateNotificationTriggerWorkflowOutput {
  passed: boolean
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
    rules: Array<{
      id: string
      attribute: string
      operator: string
      description: string | null
      metadata: Record<string, any> | null
      rule_values: Array<{
        id: string
        value: string | null
        metadata: Record<string, any> | null
      }>
    }>
  } | null
  is_valid: boolean
}

export const validateNotificationTriggerWorkflowId = "validate-notification-trigger"

/**
 * This workflow validates a notification trigger against context data.
 * It retrieves the trigger by trigger_id and evaluates its rules.
 * 
 * @example
 * const { result } = await validateNotificationTriggerWorkflow(container).run({
 *   input: {
 *     trigger_id: "low-stock-alert",
 *     context: {
 *       inventory_level: { ... }
 *     }
 *   }
 * })
 */
export const validateNotificationTriggerWorkflow = createWorkflow(
  validateNotificationTriggerWorkflowId,
  (input: WorkflowData<ValidateNotificationTriggerWorkflowInput>) => {
    // Retrieve trigger by trigger_id
    const triggerResult = getNotificationTriggerByIdStep({
      trigger_id: input.trigger_id,
    })

    // Evaluate rules only if trigger exists
    const evaluationResult = when(
      "evaluate-rules-if-trigger-exists",
      { triggerResult },
      ({ triggerResult }) => triggerResult.trigger !== null
    ).then(() => {
      return evaluateNotificationRulesStep({
        trigger: triggerResult.trigger!,
        context: input.context,
      })
    })

    // Prepare final result
    const result = transform({ triggerResult, evaluationResult }, (data) => {
      // If trigger doesn't exist, return failed result
      if (!data.triggerResult.trigger) {
        return {
          passed: false,
          trigger: null,
          is_valid: false,
        }
      }

      // If evaluation was skipped (trigger doesn't exist or is inactive), return failed
      // evaluationResult will be undefined if when condition was false
      if (!data.evaluationResult || !data.evaluationResult.is_valid) {
        return {
          passed: false,
          trigger: data.triggerResult.trigger,
          is_valid: false,
        }
      }

      // Return evaluation result
      return {
        passed: data.evaluationResult.is_valid,
        trigger: data.triggerResult.trigger,
        is_valid: data.evaluationResult.is_valid,
      }
    })

    return new WorkflowResponse(result)
  }
)

