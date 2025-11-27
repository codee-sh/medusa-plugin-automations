import { createWorkflow, WorkflowData, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { getNotificationTriggersByEventStep } from "./steps/get-notification-triggers-by-event"
import { validateNotificationTriggersStep } from "./steps/validate-notification-triggers"

export interface ValidateNotificationTriggersByEventWorkflowInput {
  event_name: string
  context: Record<string, any>
}

export interface ValidateNotificationTriggersByEventWorkflowOutput {
  results: Array<{
    passed: boolean
    is_valid: boolean
    trigger_id: string
    trigger_name: string
    rules_count: number
  }>
  triggers_found: number
  has_triggers: boolean
}

export const validateNotificationTriggersByEventWorkflowId = "validate-notification-triggers-by-event"

/**
 * This workflow retrieves notification triggers for an event and validates them against context data.
 * 
 * @example
 * const { result } = await validateNotificationTriggersByEventWorkflow(container).run({
 *   input: {
 *     event_name: "inventory.inventory-level.updated",
 *     context: {
 *       inventory_level: { ... }
 *     }
 *   }
 * })
 */
export const validateNotificationTriggersByEventWorkflow = createWorkflow(
  validateNotificationTriggersByEventWorkflowId,
  (input: WorkflowData<ValidateNotificationTriggersByEventWorkflowInput>) => {
    // Retrieve triggers for the event
    const triggersResult = getNotificationTriggersByEventStep({
      event_name: input.event_name,
    })

    console.log("triggersResult:", triggersResult);

    // Extract triggers from step result using transform
    const triggers = transform({ triggersResult }, (data) => {
      return (data?.triggersResult as any)?.triggers || [];
    })

    // Validate all triggers against context
    const validationResult = validateNotificationTriggersStep({
      triggers: triggers,
      context: input.context,
    })

    // Add metadata about triggers found
    const finalResult = transform({ triggersResult, validationResult }, (data) => {
      const triggersFound = data.triggersResult.triggers.length
      
      return {
        ...data.validationResult,
        triggers_found: triggersFound,
        has_triggers: triggersFound > 0,
      }
    })

    return new WorkflowResponse(finalResult)
  }
)

