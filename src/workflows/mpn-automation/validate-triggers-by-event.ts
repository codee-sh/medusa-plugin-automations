import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { getAutomationTriggersByEventStep } from "./steps/retrieve-automation-triggers-by-event"
import { validateTriggersRulesStep } from "./steps/validate-triggers-rules"
import { TriggerType } from "../../utils/types"
import {
  AutomationTrigger,
  AutomationAction,
} from "../../modules/mpn-automation/types/interfaces"

export interface ValidateTriggersByEventWorkflowInput {
  eventName: string
  eventType: TriggerType
  context: Record<string, any>
}

export interface ValidateTriggersByEventWorkflowOutput {
  validated: Array<{
    isValid: boolean
    trigger: AutomationTrigger
    actions: AutomationAction[]
  }>
  triggersCount: number
}

export const validateTriggersByEventWorkflowId =
  "validate-triggers-by-event"

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
export const validateTriggersByEventWorkflow =
  createWorkflow(
    validateTriggersByEventWorkflowId,
    (
      input: WorkflowData<ValidateTriggersByEventWorkflowInput>
    ) => {
      // Retrieve triggers for the event
      const getTriggers = getAutomationTriggersByEventStep({
        eventName: input.eventName,
        eventType: input.eventType,
      })

      // Validate all triggers against context
      const getValidatedTriggers =
        validateTriggersRulesStep({
          triggers: getTriggers || [],
          context: input.context,
        })

      return new WorkflowResponse({
        triggers: getTriggers,
        triggersValidated: getValidatedTriggers,
      })
    }
  )
