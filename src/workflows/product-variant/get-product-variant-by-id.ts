import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getProductVariantByIdStep } from "./steps/get-product-variant-by-id"

export interface GetProductVariantByIdWorkflowInput {
  product_variant_id: string
}

export const getProductVariantByIdWorkflowId =
  "get-product-variant-by-id"

/**
 * This workflow retrieves a product variant by its ID with related product.
 *
 * @example
 * const { result } = await getProductVariantByIdWorkflow(container).run({
 *   input: {
 *     product_variant_id: "variant_123"
 *   }
 * })
 */
export const getProductVariantByIdWorkflow = createWorkflow(
  getProductVariantByIdWorkflowId,
  (
    input: WorkflowData<GetProductVariantByIdWorkflowInput>
  ) => {
    const productVariant = getProductVariantByIdStep({
      product_variant_id: input.product_variant_id,
    })

    return new WorkflowResponse(productVariant)
  }
)
