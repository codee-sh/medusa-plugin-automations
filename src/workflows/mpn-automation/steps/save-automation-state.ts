import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MpnAutomationService from "../../../modules/mpn-automation/services/service"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"

type SaveAutomationStateStepInput = {
  triggers: any
  targetKey?: string | null
  metadata?: Record<string, any> | null
}

export const saveAutomationStateStep = createStep(
  "save-automation-state",
  async (
    { triggers, targetKey }: SaveAutomationStateStepInput,
    { container }
  ) => {
    const mpnAutomationService: MpnAutomationService =
      container.resolve(MPN_AUTOMATION_MODULE)

    const dateNow = new Date()

    if (!triggers || triggers.length === 0) {
      return new StepResponse([], [])
    }

    const savedStates = await Promise.all(
      triggers.map(async (trigger: any) => {
        const existingStates =
          await mpnAutomationService.listMpnAutomationStates(
            {
              trigger_id: trigger.trigger.id,
              target_key: targetKey,
            }
          )

        // Update existing state
        if (existingStates.length > 0) {
          const map = existingStates.map((state: any) => {
            return {
              id: state.id,
              last_triggered_at: dateNow,
            }
          })

          const updatedStates =
            await mpnAutomationService.updateMpnAutomationStates(
              map
            )

          return updatedStates
        } else {
          const data = {
            trigger_id: trigger.trigger.id,
            target_key: targetKey || null,
            last_triggered_at: dateNow,
          }

          const newStates =
            await mpnAutomationService.createMpnAutomationStates(
              [data]
            )

          return newStates
        }
      })
    )

    return new StepResponse(savedStates, savedStates)
  }
)
