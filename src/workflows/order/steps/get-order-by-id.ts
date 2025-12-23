import type { OrderTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { ORDER_QUERY_FIELDS } from "../../../modules/mpn-automation/types/modules/order"
import { getFieldsFromAttributes } from "../../../utils"

export interface GetOrderByIdStepInput {
  order_id: string
}

export interface GetOrderByIdStepOutput {
  order: OrderTypes.OrderDTO
}

export const getOrderByIdStepId = "get-order-by-id"

/**
 * This step retrieves an order by its ID with related items, customer, addresses, and payment collections.
 *
 * @example
 * const data = getOrderByIdStep({
 *   order_id: "order_123"
 * })
 */
export const getOrderByIdStep = createStep(
  getOrderByIdStepId,
  async (
    input: GetOrderByIdStepInput,
    { container }
  ): Promise<StepResponse<GetOrderByIdStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    if (!input.order_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Order ID is required"
      )
    }

    // Generate fields from ORDER_QUERY_FIELDS which includes technical relations needed for totals calculation
    const fields = getFieldsFromAttributes(
      ORDER_QUERY_FIELDS.map((field) => ({ value: field })),
      "order"
    )

    const { data: orders } = await query.graph({
      entity: "order",
      fields: fields,
      filters: {
        id: {
          $in: [input.order_id],
        },
      },
    })

    if (!orders || orders.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with ID ${input.order_id} not found`
      )
    }

    return new StepResponse({
      order: orders[0],
    })
  }
)

