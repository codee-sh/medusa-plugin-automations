/**
 * Extract fields from attributes for use in query.graph()
 * Converts "product.tags.value" -> "tags.value"
 */
export function getFieldsFromAttributes(
  attributes: Array<{ value?: string }>,
  entityPrefix: string = "product"
): string[] {
  return attributes
    .map((attr) => attr.value)
    .filter((value): value is string => !!value)
    .map((value) =>
      value.startsWith(`${entityPrefix}.`)
        ? value.slice(entityPrefix.length + 1)
        : value
    )
    .sort()
}
