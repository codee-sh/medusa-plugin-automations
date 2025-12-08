import { createWorkflow, WorkflowData, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { validateAutomationTriggersByEventWorkflow } from "./validate-automation-triggers-by-event"
import { runAutomationActionsStep } from "./steps/run-automation-actions"
import { saveAutomationStateWorkflow } from "./save-automation-state"
import { TriggerType } from "../../utils/types"
import { logStep } from "../../workflows/steps/log-step"

export interface RunAutomationWorkflowInput {
  eventName: string
  eventType: TriggerType
  triggerKey: string
  context: Record<string, any>
}

export interface RunAutomationWorkflowOutput {
  triggersFound: number
  triggersValidated: number
  triggersExecuted: number
  totalActionsExecuted: number
  results: Array<{
    triggerId?: string
    isValid: boolean
    actionsExecuted: number
    actions: Array<{
      actionId?: string
      actionType?: string | null
      success: boolean
    }>
  }>
}

export const runAutomationWorkflowId = "run-automation"

/**
 * Main workflow that executes automation scenarios for a given event.
 * 
 * This workflow:
 * 1. Retrieves all active triggers for the event
 * 2. Validates triggers against the provided context
 * 3. Executes actions for triggers that passed validation
 * 
 * @example
 * ```typescript
 * const { result } = await runAutomationWorkflow(container).run({
 *   input: {
 *     eventName: "inventory.inventory-level.updated",
 *     context: {
 *       inventory_level: {
 *         stocked_quantity: 5,
 *         inventory_item: {
 *           stocked_quantity: 5
 *         }
 *       }
 *     }
 *   }
 * })
 * 
 * console.log(`Executed ${result.triggersExecuted} triggers with ${result.totalActionsExecuted} actions`)
 * ```
 */
export const runAutomationWorkflow = createWorkflow(
  runAutomationWorkflowId,
  (input: WorkflowData<RunAutomationWorkflowInput>) => {
    // Step 1: Retrieve and validate triggers by the event
    const getValidationResult = validateAutomationTriggersByEventWorkflow.runAsStep({
      input: {
        eventName: input.eventName,
        eventType: input.eventType,
        context: input.context,
      },
    })

    // Step 2: Run actions for all validated triggers
    const getActionRunningResult = runAutomationActionsStep({
      validatedTriggers: getValidationResult.triggersValidated,
      context: input.context
    })

    // Step 3: Save automation state
    const getSaveAutomationStateResult = saveAutomationStateWorkflow.runAsStep({
      input: {
        triggers: getActionRunningResult.triggersExecuted,
        targetKey: input.triggerKey
      }
    })

    // Combine all results
    const finalResult = transform({ getValidationResult, getActionRunningResult, getSaveAutomationStateResult }, (data) => {
      const triggers = data.getValidationResult.triggers || []
      const triggersValidated = data.getValidationResult.triggersValidated || []
      const triggersExecuted = data.getActionRunningResult.triggersExecuted || []
      const statesSaved = data.getSaveAutomationStateResult.statesSaved || []
      
      return {
        triggers,
        triggersValidated,
        triggersExecuted,
        statesSaved,
        triggersCount: triggers.length || 0,
        triggersValidatedCount: triggersValidated.length || 0,
        triggersExecutedCount: triggersExecuted.length || 0,
        statesSavedCount: statesSaved.length || 0,
      }
    })

    logStep(finalResult)

    return new WorkflowResponse(finalResult)
  }
)

