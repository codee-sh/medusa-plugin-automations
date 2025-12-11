import type {
  InventoryTypes,
  StockLocationTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
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
    stock_locations?: StockLocationTypes.StockLocationDTO[]
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
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    if (!input.inventory_level_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Inventory level ID is required"
      )
    }

    const { data: inventoryLevels } = await query.graph({
      entity: "inventory_level",
      fields: [
        "id",
        "inventory_item.*",
        "stocked_quantity",
        "reserved_quantity",
        "incoming_quantity",
        "available_quantity",
        "location_id",
        "stock_locations.id",
        "stock_locations.name",
        "stock_locations.address",
        "stock_locations.metadata",
      ],
      filters: {
        id: {
          $in: [input.inventory_level_id],
        },
      },
    })

    return new StepResponse({
      inventory_level: inventoryLevels[0],
    })
  }
)
