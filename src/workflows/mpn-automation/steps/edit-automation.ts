import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import MpnAutomationService from "../../../modules/mpn-automation/services/service"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"

type EditAutomationStepInput = {
  items: {
    id: string
    name: string
  }[]
}

export const editAutomationStep = createStep(
  "edit-automation",
  async ({ items }: EditAutomationStepInput, { container }) => {
    const mpnAutomationService: MpnAutomationService = container.resolve(MPN_AUTOMATION_MODULE)

    console.log("editAutomationStep", items)

    const automation = await mpnAutomationService.updateMpnAutomationTriggers(
      items.map((item) => ({
        id: item.id,
        name: item.name,
      }))
    )

    return new StepResponse(automation, automation)
  }
)
