import type {
  IInventoryService,
  InventoryTypes,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"

export interface GetInventoryLevelByIdStepInput {
  inventory_level_id: string
}

export interface GetInventoryLevelByIdStepOutput {
  inventory_level: InventoryTypes.InventoryLevelDTO & {
    inventory_item?: InventoryTypes.InventoryItemDTO
  }
}

export const getInventoryLevelByIdStepId =
  "get-inventory-level-by-id"

/**
 * This step retrieves an inventory level by its ID with related inventory item.
 *
 * @example
 * const data = getInventoryLevelByIdStep({
 *   inventory_level_id: "ilev_123"
 * })
 */
export const getInventoryLevelByIdStep = createStep(
  getInventoryLevelByIdStepId,
  async (
    input: GetInventoryLevelByIdStepInput,
    { container }
  ): Promise<
    StepResponse<GetInventoryLevelByIdStepOutput>
  > => {
    const inventoryService: IInventoryService =
      container.resolve(Modules.INVENTORY)

    // Retrieve inventory level with inventory_item relation
    const inventoryLevel =
      await inventoryService.retrieveInventoryLevel(
        input.inventory_level_id,
        {
          relations: ["inventory_item"],
        }
      )

    return new StepResponse({
      inventory_level: inventoryLevel,
    })
  }
)
