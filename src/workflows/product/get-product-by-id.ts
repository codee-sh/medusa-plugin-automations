import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getProductByIdStep } from "./steps/get-product-by-id"

export interface GetProductByIdWorkflowInput {
  product_id: string
}

export const getProductByIdWorkflowId = "get-product-by-id"

/**
 * This workflow retrieves a product by its ID with related variants, images, tags, and categories.
 *
 * @example
 * const { result } = await getProductByIdWorkflow(container).run({
 *   input: {
 *     product_id: "prod_123"
 *   }
 * })
 */
export const getProductByIdWorkflow = createWorkflow(
  getProductByIdWorkflowId,
  (input: WorkflowData<GetProductByIdWorkflowInput>) => {
    const product = getProductByIdStep({
      product_id: input.product_id,
    })

    return new WorkflowResponse(product)
  }
)
