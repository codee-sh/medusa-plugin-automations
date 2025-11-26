import { createWorkflow, WorkflowData, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { getInventoryLevelByIdStep } from "./steps/get-inventory-level-by-id"

export interface GetInventoryLevelByIdWorkflowInput {
  inventory_level_id: string
}

export const getInventoryLevelByIdWorkflowId = "get-inventory-level-by-id"

/**
 * This workflow retrieves an inventory level by its ID with related inventory item.
 * 
 * @example
 * const { result } = await getInventoryLevelByIdWorkflow(container).run({
 *   input: {
 *     inventory_level_id: "ilev_123"
 *   }
 * })
 */
export const getInventoryLevelByIdWorkflow = createWorkflow(
  getInventoryLevelByIdWorkflowId,
  (input: WorkflowData<GetInventoryLevelByIdWorkflowInput>) => {
    const inventoryLevel = getInventoryLevelByIdStep({
      inventory_level_id: input.inventory_level_id,
    })

    return new WorkflowResponse(inventoryLevel)
  }
)

