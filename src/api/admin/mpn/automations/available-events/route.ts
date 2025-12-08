import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { MPN_AUTOMATION_MODULE } from "../../../../../modules/mpn-automation"
import { MpnAutomationService } from "../../../../../modules/mpn-automation/services"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(
    ContainerRegistrationKeys.QUERY
  )
  const automationService = req.scope.resolve(
    MPN_AUTOMATION_MODULE
  ) as MpnAutomationService

  const events = automationService.getAvailableEvents()

  res.json({
    events: events,
  })
}
