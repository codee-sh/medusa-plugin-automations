import { createWorkflow, WorkflowData, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { getNotificationTriggersByEventStep } from "./steps/get-notification-triggers-by-event"
import { validateNotificationTriggersStep } from "./steps/validate-notification-triggers"
import { TriggerType } from "../../utils/types"

export interface ValidateNotificationTriggersByEventWorkflowInput {
  event_name: string
  event_type: TriggerType
  context: Record<string, any>
}

export interface ValidateNotificationTriggersByEventWorkflowOutput {
  results: Array<{
    passed: boolean
    is_valid: boolean
    trigger_id: string
    trigger_name: string
    rules_count: number
    trigger?: any  // Full trigger object for nested workflows
    actions?: any[]  // Actions array for nested workflows
  }>
  triggers_found: number
  actions_found: any
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
 *     event_type: TriggerType.EVENT,
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
      event_type: input.event_type,
    })

    // Extract triggers from step result using transform
    const triggers = transform({ triggersResult }, (data) => {
      return (data?.triggersResult as any)?.triggers || [];
    })

    // Validate all triggers against context
    const validationResult = validateNotificationTriggersStep({
      triggers: triggers,
      context: input.context,
    })

    // Add metadata about triggers found and include full trigger/actions data
    const finalResult = transform({ triggersResult, validationResult }, (data) => {
      const triggersFound = data.triggersResult.triggers.length
      const validationResults = data.validationResult.results || []

      // Map validation results to include full trigger and actions data
      const results = validationResults.map((result: any) => ({
        passed: result.is_valid,
        is_valid: result.is_valid,
        trigger_id: result.trigger.id || result.trigger.trigger_id || "",
        trigger_name: result.trigger.name,
        rules_count: result.rules?.length || 0,
        trigger: result.trigger,  // Include full trigger for nested workflows
        actions: result.actions,  // Include actions for nested workflows
      }))

      return {
        results,
        triggers_found: triggersFound,
        has_triggers: triggersFound > 0,
      }
    })

    return new WorkflowResponse(finalResult)
  }
)

