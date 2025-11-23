import { MedusaStoreRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { resource_id, resource_type } = req.query
  const filters: any = {}

  if (resource_id) {
    filters.resource_id = {
      $eq: resource_id,
    }
  }

  if (resource_type) {
    filters.resource_type = {
      $eq: resource_type,
    }
  }
  
  const { data: notifications, metadata: { count, take, skip } = {} } = await query.graph({
    entity: "notification",
    filters: filters,
    ...req.queryConfig
  })

  res.json({
    notifications: notifications,
    count: count || 0,
    limit: take || 15,
    offset: skip || 0,
  })
}

