import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MPN_AUTOMATION_MODULE } from "../../../../../modules/mpn-automation"
import MpnAutomationService from "../../../../../modules/mpn-automation/service"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const automationService = req.scope.resolve(
    MPN_AUTOMATION_MODULE
  ) as MpnAutomationService

  const triggers = automationService.getAvailableTriggers()

  res.json({
    triggers: triggers,
  })
}
