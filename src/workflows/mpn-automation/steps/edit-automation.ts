import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MpnAutomationService from "../../../modules/mpn-automation/services/service"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"
import { NotificationTrigger } from "../../../modules/mpn-automation/types/interfaces"

type EditAutomationStepInput = {
  items: NotificationTrigger[]
}

export const editAutomationStep = createStep(
  "edit-automation",
  async (
    { items }: EditAutomationStepInput,
    { container }
  ) => {
    const mpnAutomationService: MpnAutomationService =
      container.resolve(MPN_AUTOMATION_MODULE)

    const automation =
      await mpnAutomationService.updateMpnAutomationTriggers(
        items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          trigger_type: item.trigger_type,
          event_name: item.event_name,
          interval_minutes: item.interval_minutes,
          active: item.active,
          channels: item.channels,
        }))
      )

    return new StepResponse(automation, automation)
  }
)
