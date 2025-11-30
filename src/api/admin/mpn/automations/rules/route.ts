import { MedusaStoreRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { editAutomationRulesWorkflow } from "../../../../../workflows/mpn-automation"

export const PostAutomationRulesSchema = z.object({
  trigger_id: z.string(),
  rules: z.array(z.object({
    id: z.string().optional(),
    attribute: z.string().optional(),
    operator: z.string().optional(),
    description: z.string().nullable().optional(),
    metadata: z.record(z.any()).nullable().optional(),
    rule_values: z.array(z.object({
      id: z.string().optional(),
      value: z.string().nullable().optional(),
      metadata: z.record(z.any()).nullable().optional(),
    })).optional(),
  })),
});

type PostAutomationRulesSchema = z.infer<typeof PostAutomationRulesSchema>;

export async function POST(
  req: MedusaStoreRequest<PostAutomationRulesSchema>,
  res: MedusaResponse
) {
  if (req.body?.trigger_id) {
    const { result } = await editAutomationRulesWorkflow(
      req.scope
    ).run({
      input: req.body as any
    });

    res.json({
      rules: result.rules,
    });
  } else {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "trigger_id is required"
    );
  }
}

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id, trigger_id } = req.query
  const filters: any = {}

  if (id) {
    filters.id = {
      $eq: id,
    }
  }
  
  if (trigger_id) {
    filters.trigger_id = {
      $eq: trigger_id,
    }
  }

  const { data: rules, metadata: { count, take, skip } = {} } = await query.graph({
    entity: "mpn_automation_rule",
    filters: filters,
    ...req.queryConfig
  })

  res.json({
    rules: rules,
    count: count || 0,
    limit: take || 15,
    offset: skip || 0,
  })
}


// export const DeleteAutomationSchema = z.object({
//   id: z.string(),
// });

// type DeleteAutomationSchema = z.infer<typeof DeleteAutomationSchema>;

// export async function DELETE(
//   req: MedusaStoreRequest<DeleteAutomationSchema>,
//   res: MedusaResponse
// ) {
//   // const { result: automation } = await deleteAutomationWorkflow(
//   //   req.scope
//   // ).run({
//   //   input: {
//   //     id: req.body.id as string
//   //   },
//   // });

//   // res.json({
//   //   automation: automation,
//   // });
// }

