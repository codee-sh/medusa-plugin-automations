import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { validateTriggersByEventWorkflow } from "./validate-triggers-by-event"
import { validateTriggerThrottleStep } from "./steps/validate-trigger-throttle"
import { runAutomationActionsStep } from "./steps/run-automation-actions"
import { saveAutomationStateWorkflow } from "./save-automation-state"
import { TriggerType } from "../../utils/types"
import { logStep } from "../../workflows/steps/log-step"

export interface RunAutomationWorkflowInput {
  /**
   * Event name to match triggers (e.g. "order.placed")
   */
  eventName: string
  /**
   * Type of trigger: "event", "schedule", or "manual"
   */
  eventType: TriggerType
  /**
   * Unique key for throttle tracking (e.g. order_id)
   */
  triggerKey: string
  /**
   * Event payload data for rules evaluation and actions
   */
  context: Record<string, any>
  /**
   * Optional context type identifier
   */
  contextType?: string | null
}

export interface RunAutomationWorkflowOutput {
  /**
   * All active triggers found for this event
   */
  triggers: any[]
  /**
   * Triggers that passed rules validation
   */
  triggersValidated: any[]
  /**
   * Triggers blocked by throttle (interval_seconds not passed)
   */
  triggersThrottled: any[]
  /**
   * Triggers that passed rules AND throttle check
   */
  triggersPassedThrottle: any[]
  /**
   * Triggers with actions executed
   */
  triggersExecuted: any[]
  /**
   * States saved for throttle tracking
   */
  statesSaved: any[]

  triggersCount: number
  triggersValidatedCount: number
  triggersThrottledCount: number
  triggersPassedThrottleCount: number
  triggersExecutedCount: number
  statesSavedCount: number
}

export const runAutomationWorkflowId = "run-automation"

/**
 * Main workflow that executes automation scenarios for a given event.
 *
 * This workflow:
 * 1. Retrieves all active triggers for the event
 * 2. Validates triggers against rules (conditions)
 * 3. Checks throttle limits (interval_seconds)
 * 4. Executes actions for triggers that passed validation and throttle
 * 5. Saves automation trigger state for throttle tracking
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
    /**
     * Step 1: Retrieve and validate triggers by the event (rules validation)
     */
    const getValidationResult =
      validateTriggersByEventWorkflow.runAsStep({
        input: {
          eventName: input.eventName,
          eventType: input.eventType,
          context: input.context,
        },
      })

    /**
     * Step 2: Check throttle limits for validated triggers
     */
    const getTriggerThrottleResult = validateTriggerThrottleStep({
      validatedTriggers:
        getValidationResult.triggersValidated,
      targetKey: input.triggerKey,
    })

    /**
     * Step 3: Transform throttle results to format expected by runAutomationActionsStep
     */
    const triggersAfterThrottle = transform(
      { getTriggerThrottleResult },
      (data) => {
        const results = data.getTriggerThrottleResult || []
        // Filter to only non-throttled, valid triggers
        return results
          .filter((r: any) => r.isValid && !r.isThrottled)
          .map((r: any) => ({
            isValid: r.isValid,
            trigger: r.trigger,
            actions: r.trigger.actions || [],
          }))
      }
    )

    /**
     * Step 4: Run actions for triggers that passed throttle check
     */
    const getActionRunningResult = runAutomationActionsStep(
      {
        validatedTriggers: triggersAfterThrottle,
        context: input.context,
        contextType: input.contextType,
      }
    )

    /**
     * Step 5: Save automation state
     */
    const getSaveAutomationStateResult =
      saveAutomationStateWorkflow.runAsStep({
        input: {
          triggers: getActionRunningResult.triggersExecuted,
          targetKey: input.triggerKey,
        },
      })

    /**
     * Combine all results
     */
    const finalResult = transform(
      {
        getValidationResult,
        getTriggerThrottleResult,
        getActionRunningResult,
        getSaveAutomationStateResult,
      },
      (data) => {
        const triggers =
          data.getValidationResult.triggers || []
        const triggersValidated =
          data.getValidationResult.triggersValidated || []
        const throttleResults = data.getTriggerThrottleResult || []
        const triggersThrottled = throttleResults.filter(
          (r: any) => r.isThrottled
        )
        const triggersPassedThrottle =
          throttleResults.filter(
            (r: any) => !r.isThrottled && r.isValid
          )
        const triggersExecuted =
          data.getActionRunningResult.triggersExecuted || []
        const statesSaved =
          data.getSaveAutomationStateResult.statesSaved ||
          []

        return {
          triggers,
          triggersValidated,
          triggersThrottled,
          triggersPassedThrottle,
          triggersExecuted,
          statesSaved,
          triggersCount: triggers.length || 0,
          triggersValidatedCount:
            triggersValidated.length || 0,
          triggersThrottledCount:
            triggersThrottled.length || 0,
          triggersPassedThrottleCount:
            triggersPassedThrottle.length || 0,
          triggersExecutedCount:
            triggersExecuted.length || 0,
          statesSavedCount: statesSaved.length || 0,
        }
      }
    )

    /**
     * Log the final result
     */
    logStep(finalResult)

    return new WorkflowResponse(finalResult)
  }
)
