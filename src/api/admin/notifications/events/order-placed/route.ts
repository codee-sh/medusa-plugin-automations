import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest<{ orderId?: string, type?: 'preview' | 'system' | 'admin' }>,
  res: MedusaResponse
) {
  const eventModuleService = req.scope.resolve(Modules.EVENT_BUS)
  
  const orderId = req.body?.orderId
  const type = req.body?.type

  await eventModuleService.emit({
    name: "order.placed",
    data: {
      id: orderId,
      type: type,
    },
  })

  res.status(200).json({
    success: true,
    message: `Event order.placed was emitted for the order: ${orderId}`,
    orderId,
  })
}

