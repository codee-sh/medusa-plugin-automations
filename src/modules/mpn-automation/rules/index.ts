import type { RuleAttribute } from "./types"
import { inventoryAttributes } from "./inventory"

/**
 * Get all default rule attributes
 * 
 * @param pluginOptions - Optional plugin options that may contain custom attributes
 * @returns Array of rule attributes
 * 
 * @example
 * // Get all attributes
 * const attributes = getRuleAttributes()
 * 
 * // Get attributes with plugin options (for future use)
 * const attributes = getRuleAttributes(pluginOptions)
 */
export function getRuleAttributes(
  pluginOptions?: Record<string, any>
): RuleAttribute[] {
  // Start with default attributes from all sets
  let attributes: RuleAttribute[] = [
    ...inventoryAttributes,
    // Add more attribute sets here as they are created
    // ...orderAttributes,
    // ...productAttributes,
  ]

  // Merge custom attributes from plugin configuration if provided
  // This allows extending attributes via plugin options in the future
  if (pluginOptions?.ruleAttributes && Array.isArray(pluginOptions.ruleAttributes)) {
    attributes = [...attributes, ...pluginOptions.ruleAttributes]
  }

  return attributes
}

/**
 * Get rule attributes formatted for select dropdowns
 * 
 * @param pluginOptions - Optional plugin options
 * @returns Array of attributes formatted as { value, label, group } objects
 * 
 * @example
 * const options = getRuleAttributesForSelect()
 * // Returns: [{ value: "inventory_level.stocked_quantity", label: "Stocked Quantity", group: "Inventory Level" }, ...]
 */
export function getRuleAttributesForSelect(
  pluginOptions?: Record<string, any>
): Array<{ value: string; label: string; group?: string }> {
  return getRuleAttributes(pluginOptions).map((attr) => ({
    value: attr.value,
    label: attr.label,
    group: attr.group,
  }))
}

/**
 * Get rule attributes grouped by category
 * 
 * @param pluginOptions - Optional plugin options
 * @returns Object with attributes grouped by their group property
 */
export function getRuleAttributesGrouped(
  pluginOptions?: Record<string, any>
): Record<string, RuleAttribute[]> {
  const attributes = getRuleAttributes(pluginOptions)
  const grouped: Record<string, RuleAttribute[]> = {}

  for (const attr of attributes) {
    const group = attr.group || "Other"
    if (!grouped[group]) {
      grouped[group] = []
    }
    grouped[group].push(attr)
  }

  return grouped
}

/**
 * Find a rule attribute by its value
 * 
 * @param value - The attribute value (e.g., "inventory_level.stocked_quantity")
 * @param pluginOptions - Optional plugin options
 * @returns The attribute definition or undefined if not found
 */
export function getRuleAttributeByValue(
  value: string,
  pluginOptions?: Record<string, any>
): RuleAttribute | undefined {
  const attributes = getRuleAttributes(pluginOptions)
  return attributes.find((attr) => attr.value === value)
}

// Export types
export type { RuleAttribute } from "./types"

// Export attribute sets for direct access if needed
export { inventoryAttributes, inventoryLevelAttributes, inventoryItemAttributes } from "./inventory"

