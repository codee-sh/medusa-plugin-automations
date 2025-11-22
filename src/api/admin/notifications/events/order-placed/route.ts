import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, MedusaError } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest<{ order_id?: string, trigger_type?: 'preview' | 'system' | 'admin' }>,
  res: MedusaResponse
) {
  const eventModuleService = req.scope.resolve(Modules.EVENT_BUS)
  
  const order_id = req.body?.order_id
  const trigger_type = req.body?.trigger_type

  if (!order_id || !trigger_type) {
    throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Order ID and trigger type are required")
  }

  await eventModuleService.emit({
    name: "order.placed",
    data: {
      id: order_id,
      trigger_type: trigger_type,
    },
  })

  res.status(200).json({
    success: true,
    message: `Event order.placed was emitted for the order: ${order_id}, trigger_type: ${trigger_type}`,
    order_id,
    trigger_type,
  })
}

