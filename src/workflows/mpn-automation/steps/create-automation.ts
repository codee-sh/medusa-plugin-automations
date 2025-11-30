import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import MpnAutomationService from "../../../modules/mpn-automation/services/service"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"

type CreateAutomationStepInput = {
  items: {
    name: string
    description: string
    trigger_type: "event" | "schedule" | "manual"
    event_name: string
    interval_minutes: number
    active: boolean
    channels: Record<string, boolean>
  }[]
}

export const createAutomationStep = createStep(
  "create-automation",
  async ({ items }: CreateAutomationStepInput, { container }) => {
    const mpnAutomationService: MpnAutomationService = container.resolve(MPN_AUTOMATION_MODULE)

    console.log("createAutomationStep", items)

    const automation = await mpnAutomationService.createMpnAutomationTriggers(
      items.map((item) => ({
        name: item.name,
        description: item.description,
        trigger_type: item.trigger_type,
        event_name: item.event_name,
        interval_minutes: item.interval_minutes,
        active: item.active,
        channels: item.channels
      }))
    )

    return new StepResponse(automation, automation)
  }
)

