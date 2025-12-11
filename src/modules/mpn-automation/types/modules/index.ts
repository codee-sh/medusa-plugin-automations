import {
  INVENTORY_LEVEL_ATTRIBUTES,
  INVENTORY_ITEM_ATTRIBUTES,
} from "./inventory"
import { Attribute } from "../types"

/**
 * Metadata for an event - contains attributes for rules and templates
 */
export type EventMetadata = {
  eventName: string
  attributes: Array<Attribute>
  templates: Array<{ value: string; name: string }>
}

/**
 * Get metadata for an event (attributes and template names)
 * Templates must be explicitly set in EVENT_METADATA_REGISTRY or in custom events
 */
export function getEventMetadata(
  eventName: string
): Partial<EventMetadata> {
  return EVENT_METADATA_REGISTRY[eventName] || {}
}

/**
 * Central registry mapping event names to their metadata
 * This allows us to:
 * - Define attributes for rules
 * - Map events to template names (multiple templates per event)
 * - Support both Medusa events and custom events
 */
const EVENT_METADATA_REGISTRY: Record<
  string,
  any
> = {
  // Inventory Events
  "inventory.inventory-level.created": {
    attributes: INVENTORY_LEVEL_ATTRIBUTES,
    templates: [
      {
        value: "inventory-level",
        name: "Inventory Level",
      },
    ],
  },
  "inventory.inventory-level.updated": {
    attributes: INVENTORY_LEVEL_ATTRIBUTES,
    templates: [
      {
        value: "inventory-level",
        name: "Inventory Level",
      },
    ],
  },
  "inventory.inventory-level.deleted": {
    attributes: INVENTORY_LEVEL_ATTRIBUTES,
    templates: [
      {
        value: "inventory-level",
        name: "Inventory Level",
      },
    ],
  },
  "inventory.inventory-item.created": {
    attributes: INVENTORY_ITEM_ATTRIBUTES,
    templates: [
      {
        value: "inventory-item",
        name: "Inventory Item",
      },
    ],
  },
  "inventory.inventory-item.updated": {
    attributes: INVENTORY_ITEM_ATTRIBUTES,
    templates: [
      {
        value: "inventory-item",
        name: "Inventory Item",
      },
    ],
  },
  "inventory.inventory-item.deleted": {
    attributes: INVENTORY_ITEM_ATTRIBUTES,
    templates: [
      {
        value: "inventory-item",
        name: "Inventory Item",
      },
    ],
  },
}
