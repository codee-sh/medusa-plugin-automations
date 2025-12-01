import { createWorkflow, WorkflowData, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { getAutomationTriggersByEventStep } from "./steps/retrieve-automation-triggers-by-event"
import { validateAutomationTriggersStep } from "./steps/validate-automation-triggers"
import { TriggerType } from "../../utils/types"
import { NotificationTrigger, NotificationAction } from "../../modules/mpn-automation/interfaces"

export interface ValidateAutomationTriggersByEventWorkflowInput {
  eventName: string
  eventType: TriggerType
  context: Record<string, any>
}

export interface ValidateAutomationTriggersByEventWorkflowOutput {
  validated: Array<{
    isValid: boolean
    trigger: NotificationTrigger
    actions: NotificationAction[]
  }>
  triggersCount: number
}

export const validateAutomationTriggersByEventWorkflowId = "validate-automation-triggers-by-event"

/**
 * This workflow retrieves notification triggers for an event and validates them against context data.
 * 
 * @example
 * const { result } = await validateAutomationTriggersByEventWorkflow(container).run({
 *   input: {
 *     eventName: "inventory.inventory-level.updated",
 *     eventType: TriggerType.EVENT,
 *     context: {
 *       inventory_level: { ... }
 *     }
 *   }
 * })
 */
export const validateAutomationTriggersByEventWorkflow = createWorkflow(
  validateAutomationTriggersByEventWorkflowId,
  (input: WorkflowData<ValidateAutomationTriggersByEventWorkflowInput>) => {
    // Retrieve triggers for the event
    const triggers = getAutomationTriggersByEventStep({
      eventName: input.eventName,
      eventType: input.eventType,
    })

    // Validate all triggers against context
    const validated = validateAutomationTriggersStep({
      triggers: triggers || [],
      context: input.context,
    })

    return new WorkflowResponse({
      validated: validated,
      triggers: triggers,
    })
  }
)

