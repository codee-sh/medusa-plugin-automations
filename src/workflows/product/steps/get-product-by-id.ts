import type { ProductTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { PRODUCT_ATTRIBUTES } from "../../../modules/mpn-automation/types/modules/product"
import { getFieldsFromAttributes } from "../../../utils"

export interface GetProductByIdStepInput {
  product_id: string
}

export interface GetProductByIdStepOutput {
  product: ProductTypes.ProductDTO
}

export const getProductByIdStepId = "get-product-by-id"

/**
 * This step retrieves a product by its ID with related variants, images, tags, and categories.
 *
 * @example
 * const data = getProductByIdStep({
 *   product_id: "prod_123"
 * })
 */
export const getProductByIdStep = createStep(
  getProductByIdStepId,
  async (
    input: GetProductByIdStepInput,
    { container }
  ): Promise<StepResponse<GetProductByIdStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    if (!input.product_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Product ID is required"
      )
    }

    // Generate fields from PRODUCT_ATTRIBUTES to keep them in sync
    const fields = getFieldsFromAttributes(
      PRODUCT_ATTRIBUTES,
      "product"
    )

    const { data: products } = await query.graph({
      entity: "product",
      fields,
      filters: {
        id: {
          $in: [input.product_id],
        },
      },
    })

    if (!products || products.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with ID ${input.product_id} not found`
      )
    }

    return new StepResponse({
      product: products[0],
    })
  }
)
