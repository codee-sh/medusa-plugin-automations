import { createWorkflow, WorkflowData, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { validateAutomationTriggersByEventWorkflow } from "./validate-automation-triggers-by-event"
import { runAutomationActionsStep } from "./steps/run-automation-actions"
import { TriggerType } from "../../utils/types"
import { logStep } from "../../workflows/steps/log-step"

export interface RunAutomationWorkflowInput {
  eventName: string
  eventType: TriggerType 
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
    // Step 1: Retrieve and validate triggers for the event
    const validationResult = validateAutomationTriggersByEventWorkflow.runAsStep({
      input: {
        eventName: input.eventName,
        eventType: input.eventType,
        context: input.context,
      },
    })

    // Run actions for all validated triggers
    const actionRunningResult = runAutomationActionsStep({
      validated: validationResult.validated,
      context: input.context,
    })

    // Combine all results
    const finalResult = transform({ validationResult, actionRunningResult }, (data) => {
      const validatedResults = data.validationResult.validated || []
      const actionRunningResults = data.actionRunningResult.results || []
      
      // Map action running results back to validation results
      const actionsExecuted = validatedResults.map((action: any, index: number) => {
        const actionRunningResult = actionRunningResults[index]
        
        return {
          triggerId: action.trigger.id || action.trigger.trigger_id,
          isValid: action.isValid,
          actionsExecuted: actionRunningResult?.actionsExecuted || 0,
          actions: actionRunningResult?.actions || [],
        }
      })

      const triggersExecuted = actionsExecuted.filter((r: any) => r.isValid && r.actionsExecuted > 0).length

      return {
        triggersFound: data.validationResult.triggers.length || 0,
        triggersValidated: validatedResults.length,
        triggersExecuted: triggersExecuted,
        totalActionsExecuted: data.actionRunningResult.totalActionsExecuted || 0,
        actionsExecuted: actionsExecuted,
      }
    })

    logStep(finalResult)

    return new WorkflowResponse(finalResult)
  }
)

