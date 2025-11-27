import { MedusaStoreRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.query
  const filters: any = {}

  if (id) {
    filters.id = {
      $eq: id,
    }
  }

  const { data: triggers, metadata: { count, take, skip } = {} } = await query.graph({
    entity: "mpn_automation_trigger",
    filters: filters,
    ...req.queryConfig
  })

  res.json({
    triggers: triggers,
    count: count || 0,
    limit: take || 15,
    offset: skip || 0,
  })
}

