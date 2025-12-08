import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { z } from "zod"
import {
  editAutomationWorkflow,
  CreateAutomationWorkflowInput,
  EditAutomationWorkflowInput,
  createAutomationWorkflow,
  deleteAutomationWorkflow,
  DeleteAutomationWorkflowInput,
} from "../../../../workflows/mpn-automation"

export const PostAutomationSchema = z.object({
  id: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
    })
  ),
})

type PostAutomationSchema = z.infer<
  typeof PostAutomationSchema
>

export async function POST(
  req: MedusaStoreRequest<PostAutomationSchema>,
  res: MedusaResponse
) {
  if (req.body?.id) {
    const { result: automation } =
      await editAutomationWorkflow(req.scope).run({
        input: req.body as EditAutomationWorkflowInput,
      })

    res.json({
      automation: automation,
    })
  } else {
    const { result: automation } =
      await createAutomationWorkflow(req.scope).run({
        input: req.body as CreateAutomationWorkflowInput,
      })

    res.json({
      automation: automation,
    })
  }
}

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(
    ContainerRegistrationKeys.QUERY
  )
  const { id } = req.query
  const filters: any = {}

  if (id) {
    filters.id = {
      $eq: id,
    }
  }

  const {
    data: triggers,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "mpn_automation_trigger",
    filters: filters,
    ...req.queryConfig,
  })

  res.json({
    triggers: triggers,
    count: count || 0,
    limit: take || 15,
    offset: skip || 0,
  })
}

export const DeleteAutomationSchema = z.object({
  id: z.string(),
})

type DeleteAutomationSchema = z.infer<
  typeof DeleteAutomationSchema
>

export async function DELETE(
  req: MedusaStoreRequest<DeleteAutomationSchema>,
  res: MedusaResponse
) {
  const { result } = await deleteAutomationWorkflow(
    req.scope
  ).run({
    input: {
      id: req.body.id as string,
    } as DeleteAutomationWorkflowInput,
  })

  res.json({
    result: result,
  })
}
