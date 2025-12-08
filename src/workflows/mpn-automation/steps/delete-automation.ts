import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MpnAutomationService from "../../../modules/mpn-automation/services/service"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"

type DeleteAutomationStepInput = {
  id: string
}

export const deleteAutomationStep = createStep(
  "delete-automation",
  async (
    { id }: DeleteAutomationStepInput,
    { container }
  ) => {
    const mpnAutomationService: MpnAutomationService =
      container.resolve(MPN_AUTOMATION_MODULE)

    // Delete the trigger (cascade delete will handle related rules, states, and actions)
    await mpnAutomationService.deleteMpnAutomationTriggers([
      id,
    ])

    return new StepResponse(
      { id, deleted: true },
      { id, deleted: true }
    )
  }
)
