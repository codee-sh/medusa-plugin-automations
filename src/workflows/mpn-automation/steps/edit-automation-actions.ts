import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import MpnAutomationService from "../../../modules/mpn-automation/services/service"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"
import { NotificationAction } from '../../../modules/mpn-automation/interfaces'

type EditAutomationActionsStepInput = {
  trigger_id: string
  actions: NotificationAction[]
}

export const editAutomationActionsStep = createStep(
  "edit-automation-actions",
  async ({ trigger_id, actions }: EditAutomationActionsStepInput, { container }) => {
    const mpnAutomationService: MpnAutomationService = container.resolve(MPN_AUTOMATION_MODULE)

    // Get existing actions for this trigger
    const existingActions = await mpnAutomationService.listMpnAutomationActions(
      {
        trigger_id: trigger_id,
      }
    )

    const existingActionIds = existingActions.map((action: any) => action.id)
    const incomingActionIds = actions.filter((action) => action.id).map((action) => action.id)

    // Find actions to delete (existing but not in new data)
    const actionsToDelete = existingActionIds.filter(
      (id: string) => !incomingActionIds.includes(id)
    )

    // Delete actions that are no longer in the data
    if (actionsToDelete.length > 0) {
      await mpnAutomationService.deleteMpnAutomationActions(actionsToDelete)
    }

    // Update or create actions
    const updatedActions = await Promise.all(
      actions.map(async (action) => {
        if (action?.id) {
          // Check if action exists
          const existingAction = existingActions.find((a: any) => a.id === action.id)
          if (!existingAction) {
            throw new Error(`Action with id ${action.id} does not exist`)
          }

          // Update existing action
          const updatedAction = await mpnAutomationService.updateMpnAutomationActions([
            {
              id: action.id,
              action_type: action.action_type,
              config: action.config,
            },
          ])

          return updatedAction[0]
        } else {
          // Create new action
          const actionData = {
            trigger_id: trigger_id,
            action_type: action.action_type,
            config: action.config,
          }
          const newAction = await mpnAutomationService.createMpnAutomationActions([actionData])

          return newAction[0]
        }
      })
    )

    return new StepResponse(updatedActions, updatedActions)
  }
)

