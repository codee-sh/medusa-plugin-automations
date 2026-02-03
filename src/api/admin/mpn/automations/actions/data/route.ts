import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { z } from "zod"
import { editAutomationActionsWorkflow } from "../../../../../../workflows/mpn-automation"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(
    ContainerRegistrationKeys.QUERY
  )

  // const mpnAutomationService =
  //   req.scope.resolve<any>("mpnAutomation")

  // const emailHandler = mpnAutomationService.getActionHandler("email")
  // const dynamicData = await emailHandler.handler.fetchData({
  //   container: req.scope
  // })

  res.json({
    dynamicData: [],
  })
}
