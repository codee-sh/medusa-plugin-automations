import { ActionHandler } from "./action-handler"

export type CustomEvent = {
  id?: string
  value?: string
  label?: string
  field_type?: string
  group?: string
  attributes?: Array<Attribute>
  /**
   * Templates array with value and name
   * Example: [{ value: "inventory-level", name: "Inventory Level" }]
   * Allows multiple templates per event (e.g., different templates for email, slack, etc.)
   */
  templates?: Array<{ value: string; name: string }>
  /**
   * Context type determines the structure of data in context
   * Example: "inventory-level" means context has { inventory_level: {...} }
   */
  contextType?: string
}

/**
 * Custom event group structure - supports nested groups with events
 * Example:
 * {
 *   name: "POS events",
 *   events: [
 *     { value: "pos.system.healthy", label: "System Heartbeat", attributes: [...] }
 *   ]
 * }
 */
export type CustomEventGroup = {
  name: string
  events: CustomEvent[]
}

export type CustomAction = {
  value?: string
  label?: string
}

export type Attribute = {
  value?: string
  label?: string
  /**
   * Description of what this attribute represents
   * Example: "Total amount of the order including taxes and shipping"
   */
  description?: string
  /**
   * Example values for this attribute
   * Example: ["completed", "pending", "canceled"] for status fields
   */
  examples?: string[]
  /**
   * Type of the attribute value
   * - "primitive": single value (string, number, boolean)
   * - "array": array of values (e.g., tags, categories)
   * - "object": nested object
   */
  type?: "primitive" | "array" | "object"
  /**
   * Whether this attribute represents a relation
   */
  isRelation?: boolean
  /**
   * Type of relation (e.g., "tags", "categories", "variants")
   */
  relationType?: string
}

export interface FieldConfig {
  name: string
  key: string
  label: string
  description?: string
  type:
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "checkbox"
    | "date"
    | "chip-input"
    | "email"
    | "password"
    | "file"
  placeholder?: string
  required?: boolean
  defaultValue?: any
  options?: Array<{ groupName: string; options: Array<{ value: string; label: string }> }>
  min?: number
  max?: number
  step?: number
}

export type ModuleOptions = {
  automations?: {
    enabled?: boolean
    /**
     * Extend automations functionality
     * Example:
     * extend: {
     *   events: [
     *     {
     *       name: "POS events",
     *       events: [
     *         {
     *           value: "pos.system.healthy",
     *           label: "System Heartbeat",
     *           attributes: [
     *             { value: "system.device.id", label: "Device ID" }
     *           ]
     *         }
     *       ]
     *     }
     *   ],
     *   actions: [
     *     {
     *       id: "slack",
     *       templates: [
     *         {
     *           name: "custom-template",
     *           path: require.resolve("@plugin/templates/slack/custom-template")
     *         }
     *       ]
     *     }
     *   ]
     * }
     */
    extend?: {
      /**
       * Custom events organized in groups
       */
      events?: CustomEventGroup[]
      /**
       * Extend or register action handlers
       * Can register custom handlers and/or add templates to existing handlers
       */
      actions?: Array<{
        id: string
        /**
         * Custom action handler instance (optional)
         * If provided, registers a new custom handler
         */
        handler?: ActionHandler
        /**
         * Custom templates for this action handler (optional)
         * Can extend existing handler or newly registered handler
         */
        templates?: Array<{
          name: string
          path: string
        }>
      }>
    }
    actionsEnabled?: {
      slack?: boolean
      email?: boolean
    }
    /**
     * Extend existing action handlers with custom templates
     * Templates can be provided as functions or as import paths (similar to initializeTemplates)
     * Example:
     * extendHandlers: [
     *   {
     *     id: "slack",
     *     templates: {
     *       // Direct function
     *       "custom-template": async (params) => ({ text: "...", blocks: [...] }),
     *       // Or import path (will be dynamically imported)
     *       "another-template": "../../templates/slack/custom/custom-template"
     *     }
     *   },
     *   {
     *     id: "email",
     *     templates: {
     *       "custom-email": async (params) => ({ html: "...", text: "...", subject: "..." })
     *     }
     *   }
     * ]
     */
    extendHandlers?: Array<{
      id: string
      templates?: Record<string, any | string> // Function or import path string
    }>
  }
}

export enum TriggerType {
  EVENT = "event",
  SCHEDULE = "schedule",
  MANUAL = "manual",
}

export enum OperatorType {
  EQUAL = "eq",
  NOT_EQUAL = "ne",
  IN = "in",
  NOT_IN = "nin",
  GREATER_THAN = "gt",
  LESS_THAN = "lt",
  GREATER_THAN_OR_EQUAL = "gte",
  LESS_THAN_OR_EQUAL = "lte",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  EMPTY = "empty",
  NOT_EMPTY = "not_empty",
}

export const OPERATOR_TYPES = [
  {
    value: OperatorType.EQUAL,
    label: "Equal",
  },
  {
    value: OperatorType.NOT_EQUAL,
    label: "Not Equal",
  },
  {
    value: OperatorType.IN,
    label: "In",
  },
  {
    value: OperatorType.NOT_IN,
    label: "Not In",
  },
  {
    value: OperatorType.GREATER_THAN,
    label: "Greater Than",
  },
  {
    value: OperatorType.LESS_THAN,
    label: "Less Than",
  },
  {
    value: OperatorType.GREATER_THAN_OR_EQUAL,
    label: "Greater Than or Equal",
  },
  {
    value: OperatorType.LESS_THAN_OR_EQUAL,
    label: "Less Than or Equal",
  },
  {
    value: OperatorType.CONTAINS,
    label: "Contains",
  },
  {
    value: OperatorType.NOT_CONTAINS,
    label: "Not Contains",
  },
  {
    value: OperatorType.EMPTY,
    label: "Empty",
  },
  {
    value: OperatorType.NOT_EMPTY,
    label: "Not Empty",
  },
]

export const TRIGGER_TYPES = [
  {
    value: TriggerType.EVENT,
    label: "Event",
  },
  {
    value: TriggerType.SCHEDULE,
    label: "Schedule",
  },
  {
    value: TriggerType.MANUAL,
    label: "Manual",
  },
]
