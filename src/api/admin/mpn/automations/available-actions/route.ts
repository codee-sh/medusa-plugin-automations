import { MedusaStoreRequest, MedusaResponse } from "@medusajs/framework/http"
import { MPN_AUTOMATION_MODULE } from "../../../../../modules/mpn-automation"
import { MpnAutomationService } from "../../../../../modules/mpn-automation/services"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const automationService = req.scope.resolve(MPN_AUTOMATION_MODULE) as MpnAutomationService

  const actions = automationService.getAvailableActions()

  res.json({
    actions: actions,
  })
}