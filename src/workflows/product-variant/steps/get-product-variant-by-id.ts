import type { ProductTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"

export interface GetProductVariantByIdStepInput {
  product_variant_id: string
}

export interface GetProductVariantByIdStepOutput {
  product_variant: ProductTypes.ProductVariantDTO & {
    product?: ProductTypes.ProductDTO
  }
}

export const getProductVariantByIdStepId =
  "get-product-variant-by-id"

/**
 * This step retrieves a product variant by its ID with related product.
 *
 * @example
 * const data = getProductVariantByIdStep({
 *   product_variant_id: "variant_123"
 * })
 */
export const getProductVariantByIdStep = createStep(
  getProductVariantByIdStepId,
  async (
    input: GetProductVariantByIdStepInput,
    { container }
  ): Promise<
    StepResponse<GetProductVariantByIdStepOutput>
  > => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    if (!input.product_variant_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Product variant ID is required"
      )
    }

    const { data: productVariants } = await query.graph({
      entity: "product_variant",
      fields: [
        "id",
        "title",
        "sku",
        "barcode",
        "ean",
        "upc",
        "inventory_quantity",
        "allow_backorder",
        "manage_inventory",
        "weight",
        "length",
        "height",
        "width",
        "origin_country",
        "mid_code",
        "hs_code",
        "material",
        "metadata",
        "product.id",
        "product.title",
        "product.description",
        "product.handle",
        "product.is_giftcard",
        "product.status",
        "product.images",
        "product.metadata",
      ],
      filters: {
        id: {
          $in: [input.product_variant_id],
        },
      },
    })

    if (!productVariants || productVariants.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product variant with ID ${input.product_variant_id} not found`
      )
    }

    return new StepResponse({
      product_variant: productVariants[0],
    })
  }
)
