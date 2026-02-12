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

  // Get eventName from query params if provided
  const eventName = req.query.eventName as
    | string
    | undefined

  const getActionHandlers =
    automationService.getActionHandlers()

  const getActionHandlersMapped = await Promise.all(
    Array.from(getActionHandlers.entries()).map(
      async ([key, value]) => {
        {
          const action = value.handler
          const enabled = value.enabled
          let data = {}
  
          if ((action as any)?.fetchData) {
            data = await (action as any)?.fetchData({
              container: req.scope,
              eventName: eventName,
            })
          }
  
          return {
            ...data,
            enabled: enabled,
          }
        }
      }
    )
  )

  res.json({
    actions: getActionHandlersMapped,
  })
}
