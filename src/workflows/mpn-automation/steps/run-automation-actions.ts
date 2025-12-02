import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { NotificationAction, NotificationTrigger } from "../../../modules/mpn-automation/interfaces"

export interface RunAutomationActionsStepInput {
  validated: Array<{
    isValid: boolean
    trigger: NotificationTrigger
    actions: NotificationAction[]
  }>
  context: Record<string, any>
}

export interface RunAutomationActionsStepOutput {
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
  triggersCount: number
  totalActionsExecuted: number
}

export const runAutomationActionsStepId = "run-automation-actions"

/**
 * This step runs automation actions for all validated triggers by emitting events for each action type.
 * 
 * @example
 * const data = runAutomationActionsStep({
 *   validated: [
 *     {
 *       isValid: true,
 *       trigger: { id: "trigger_123", name: "Low Stock Alert" },
 *       actions: [{ actionType: "email", ... }]
 *     }
 *   ],
 *   context: { inventory_level: { ... } }
 * })
 */
export const runAutomationActionsStep = createStep(
  runAutomationActionsStepId,
  async (
    input: RunAutomationActionsStepInput,
    { container }
  ): Promise<StepResponse<RunAutomationActionsStepOutput>> => {
    const eventBusService = container.resolve(Modules.EVENT_BUS)
    const { validated, context } = input

    if (!validated || validated.length === 0) {
      return new StepResponse({
        results: [],
        triggersCount: 0,
        totalActionsExecuted: 0,
      })
    }

    const results = await Promise.all(
      validated.map(async (result) => {
        if (!result.isValid || !result.actions || result.actions.length === 0) {
          return {
            triggerId: result.trigger.id || result.trigger.trigger_id,
            isValid: result.isValid,
            actionsExecuted: 0,
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
                  actionId: action.id,
                  actionType: actionType,
                  success: false,
                }
              }

              // Emit event based on action type
              const eventName = `mpn.automation.action.${actionType}.executed`
              
              await eventBusService.emit({
                name: eventName,
                data: {
                  eventName: eventName,
                  action: action,
                  triggerId: result.trigger.id || result.trigger.trigger_id,
                  context: context,
                },
              })

              return {
                actionId: action.id,
                actionType: actionType,
                success: true,
              }
            } catch (error) {
              console.error(`Failed to execute action ${action.id}:`, error)
              return {
                actionId: action.id,
                actionType: action.action_type,
                success: false,
              }
            }
          })
        )

        return {
          triggerId: result.trigger.id || result.trigger.trigger_id,
          isValid: result.isValid,
          actionsExecuted: executedActions.filter(a => a.success).length,
          actions: executedActions,
        }
      })
    )

    const totalActionsExecuted = results.reduce((sum, r) => sum + r.actionsExecuted, 0)

    return new StepResponse({
      results,
      triggersCount: validated.length,
      totalActionsExecuted,
    })
  }
)

