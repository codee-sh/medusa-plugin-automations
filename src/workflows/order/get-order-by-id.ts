import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getOrderByIdStep } from "./steps/get-order-by-id"

export interface GetOrderByIdWorkflowInput {
  order_id: string
}

export const getOrderByIdWorkflowId = "get-order-by-id"

/**
 * This workflow retrieves an order by its ID with related items, customer, addresses, and payment collections.
 *
 * @example
 * const { result } = await getOrderByIdWorkflow(container).run({
 *   input: {
 *     order_id: "order_123"
 *   }
 * })
 */
export const getOrderByIdWorkflow = createWorkflow(
  getOrderByIdWorkflowId,
  (input: WorkflowData<GetOrderByIdWorkflowInput>) => {
    const order = getOrderByIdStep({
      order_id: input.order_id,
    })

    return new WorkflowResponse(order)
  }
)

