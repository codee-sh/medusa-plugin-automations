import { createWorkflow, WorkflowData, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { validateNotificationTriggersByEventWorkflow } from "./validate-notification-triggers-by-event"
import { executeAutomationActionsStep } from "./steps/execute-automation-actions"
import { TriggerType } from "../../utils/types"

export interface ExecuteAutomationWorkflowInput {
  event_name: string
  event_type: TriggerType 
  context: Record<string, any>
}

export interface ExecuteAutomationWorkflowOutput {
  triggers_found: number
  triggers_validated: number
  triggers_executed: number
  total_actions_executed: number
  results: Array<{
    trigger_id?: string
    trigger_name: string
    is_valid: boolean
    actions_executed: number
    actions: Array<{
      action_id?: string
      action_type?: string | null
      success: boolean
    }>
  }>
}

export const executeAutomationWorkflowId = "execute-automation"

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
 * const { result } = await executeAutomationWorkflow(container).run({
 *   input: {
 *     event_name: "inventory.inventory-level.updated",
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
 * console.log(`Executed ${result.triggers_executed} triggers with ${result.total_actions_executed} actions`)
 * ```
 */
export const executeAutomationWorkflow = createWorkflow(
  executeAutomationWorkflowId,
  (input: WorkflowData<ExecuteAutomationWorkflowInput>) => {
    // Step 1: Retrieve and validate triggers for the event (using nested workflow)
    const validationResult = validateNotificationTriggersByEventWorkflow.runAsStep({
      input: {
        event_name: input.event_name,
        event_type: input.event_type,
        context: input.context,
      },
    })

    // Step 2: Execute actions for all validated triggers
    const executionData = transform({ validationResult }, (data) => {
      // Extract validation results and prepare for action execution
      const results = data.validationResult.results || []
      
      // Map to format expected by executeAutomationActionsStep
      return results.map((result: any) => ({
        is_valid: result.is_valid,
        trigger: result.trigger || {
          id: result.trigger_id,
          trigger_id: result.trigger_id,
          name: result.trigger_name,
        },
        actions: result.actions || [],
      }))
    })

    // Execute actions
    const actionExecutionResult = executeAutomationActionsStep({
      validationResults: executionData,
      context: input.context,
    })

    // Combine all results
    const finalResult = transform({ validationResult, actionExecutionResult }, (data) => {
      const validatedResults = data.validationResult.results || []
      const executionResults = data.actionExecutionResult.results || []
      
      // Map execution results back to validation results
      const results = validatedResults.map((result: any, index: number) => {
        const executionResult = executionResults[index]
        
        return {
          trigger_id: result.trigger_id,
          trigger_name: result.trigger_name,
          is_valid: result.is_valid,
          actions_executed: executionResult?.actions_executed || 0,
          actions: executionResult?.actions || [],
        }
      })

      const triggersExecuted = results.filter((r: any) => r.is_valid && r.actions_executed > 0).length

      return {
        triggers_found: data.validationResult.triggers_found || 0,
        triggers_validated: validatedResults.length,
        triggers_executed: triggersExecuted,
        total_actions_executed: data.actionExecutionResult.total_actions_executed || 0,
        results: results,
      }
    })

    return new WorkflowResponse(finalResult)
  }
)

