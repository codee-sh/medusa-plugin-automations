import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { NotificationAction } from "../../../modules/mpn-automation/interfaces"

export interface ExecuteAutomationActionsStepInput {
  validationResults: Array<{
    is_valid: boolean
    trigger: {
      id?: string
      trigger_id?: string
      name: string
    }
    actions: NotificationAction[]
  }>
  context: Record<string, any>
}

export interface ExecuteAutomationActionsStepOutput {
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
  total_triggers: number
  total_actions_executed: number
}

export const executeAutomationActionsStepId = "execute-automation-actions"

/**
 * This step executes automation actions for all validated triggers by emitting events for each action type.
 * 
 * @example
 * const data = executeAutomationActionsStep({
 *   validationResults: [
 *     {
 *       is_valid: true,
 *       trigger: { id: "trigger_123", name: "Low Stock Alert" },
 *       actions: [{ action_type: "email", ... }]
 *     }
 *   ],
 *   context: { inventory_level: { ... } }
 * })
 */
export const executeAutomationActionsStep = createStep(
  executeAutomationActionsStepId,
  async (
    input: ExecuteAutomationActionsStepInput,
    { container }
  ): Promise<StepResponse<ExecuteAutomationActionsStepOutput>> => {
    const eventBusService = container.resolve(Modules.EVENT_BUS)
    const { validationResults, context } = input

    if (!validationResults || validationResults.length === 0) {
      return new StepResponse({
        results: [],
        total_triggers: 0,
        total_actions_executed: 0,
      })
    }

    const results = await Promise.all(
      validationResults.map(async (result) => {
        if (!result.is_valid || !result.actions || result.actions.length === 0) {
          return {
            trigger_id: result.trigger.id || result.trigger.trigger_id,
            trigger_name: result.trigger.name,
            is_valid: result.is_valid,
            actions_executed: 0,
            actions: [],
          }
        }

        const executedActions = await Promise.all(
          result.actions.map(async (action) => {
            try {
              const actionType = action.action_type

              if (!actionType) {
                console.warn(`Action ${action.id} has no action_type, skipping`)
                return {
                  action_id: action.id,
                  action_type: actionType,
                  success: false,
                }
              }

              // Emit event based on action type
              const eventName = `mpn.automation.action.${actionType}.executed`
              
              await eventBusService.emit({
                name: eventName,
                data: {
                  action: action,
                  trigger_id: result.trigger.id || result.trigger.trigger_id,
                  trigger_name: result.trigger.name,
                  context: context,
                },
              })

              return {
                action_id: action.id,
                action_type: actionType,
                success: true,
              }
            } catch (error) {
              console.error(`Failed to execute action ${action.id}:`, error)
              return {
                action_id: action.id,
                action_type: action.action_type,
                success: false,
              }
            }
          })
        )

        return {
          trigger_id: result.trigger.id || result.trigger.trigger_id,
          trigger_name: result.trigger.name,
          is_valid: result.is_valid,
          actions_executed: executedActions.filter(a => a.success).length,
          actions: executedActions,
        }
      })
    )

    const totalActionsExecuted = results.reduce((sum, r) => sum + r.actions_executed, 0)

    return new StepResponse({
      results,
      total_triggers: validationResults.length,
      total_actions_executed: totalActionsExecuted,
    })
  }
)

