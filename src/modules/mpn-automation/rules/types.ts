/**
 * Rule attribute definition
 */
export interface RuleAttribute {
  /**
   * Unique identifier for the attribute
   */
  id: string
  /**
   * Value used in rules (e.g., "inventory_level.stocked_quantity")
   */
  value: string
  /**
   * Display label for the attribute
   */
  label: string
  /**
   * Optional description
   */
  description?: string
  /**
   * Field type for UI rendering
   */
  field_type?: "text" | "number" | "select" | "multiselect" | "boolean"
  /**
   * Optional group/category for grouping attributes
   */
  group?: string
  /**
   * Optional entity key for the attribute
   */
  entity_key?: (data: any) => string
}

