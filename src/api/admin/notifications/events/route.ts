import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, MedusaError } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest<{ name: string, data?: any }>,
  res: MedusaResponse
) {
  const eventModuleService = req.scope.resolve(Modules.EVENT_BUS)
  
  const name = req.body?.name
  const data = req.body?.data

  await eventModuleService.emit({
    name: name,
    data: data,
  })

  console.log('Event emitted:', name, data)

  res.status(200).json({
    success: true,
    message: `Event ${name} was emitted`,
    name,
    data,
  })
}

