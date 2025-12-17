import type { ProductTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"

export interface GetProductByIdStepInput {
  product_id: string
}

export interface GetProductByIdStepOutput {
  product: ProductTypes.ProductDTO & {
    variants?: ProductTypes.ProductVariantDTO[]
    images?: ProductTypes.ProductImageDTO[]
    tags?: ProductTypes.ProductTagDTO[]
    categories?: ProductTypes.ProductCategoryDTO[]
  }
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

    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "subtitle",
        "description",
        "handle",
        "is_giftcard",
        "status",
        "thumbnail",
        "weight",
        "length",
        "height",
        "width",
        "origin_country",
        "hs_code",
        "mid_code",
        "material",
        "metadata",
        "created_at",
        "updated_at",
        "deleted_at",
        // Relations - Tags
        "tags.id",
        "tags.value",
        // Relations - Categories
        "categories.id",
        "categories.name",
        "categories.handle",
        // Relations - Variants
        "variants.id",
        "variants.sku",
        "variants.title",
        // Relations - Type
        "type.id",
        "type.value",
        // Relations - Collection
        "collection.id",
        "collection.title",
        "collection.handle",
      ],
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
