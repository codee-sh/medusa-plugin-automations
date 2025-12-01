export type CustomEvent = {
  id?: string
  value?: string
  label?: string
  field_type?: string
  group?: string
}

export type CustomAction = {
  value?: string
  label?: string
}

export type Attribute = {
  value?: string
  label?: string
}

export type ModuleOptions = {
  automations?: {
    enabled?: boolean
    customEvents?: CustomEvent[]
    customActions?: CustomAction[]
  }
}

export enum TriggerType {
  EVENT = "event",
  SCHEDULE = "schedule",
  MANUAL = "manual"
}

export enum ChannelType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  IN_APP = "in_app",
  SLACK = "slack",
  ADMIN = "admin"
}

export enum ActionType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  IN_APP = "in_app",
  SLACK = "slack",
  ADMIN = "admin"
}

export enum OperatorType {
  EQUAL = "eq",
  NOT_EQUAL = "neq",
  GREATER_THAN = "gt",
  LESS_THAN = "lt",
  GREATER_THAN_OR_EQUAL = "gte",
  LESS_THAN_OR_EQUAL = "lte",
}

export const OPERATOR_TYPES = [
  {
    value: OperatorType.EQUAL,
    label: "Equal"
  },
  {
    value: OperatorType.NOT_EQUAL,
    label: "Not Equal"
  },
  {
    value: OperatorType.GREATER_THAN,
    label: "Greater Than"
  },
  {
    value: OperatorType.LESS_THAN,
    label: "Less Than"
  },
  {
    value: OperatorType.GREATER_THAN_OR_EQUAL,
    label: "Greater Than or Equal"
  },
  {
    value: OperatorType.LESS_THAN_OR_EQUAL,
    label: "Less Than or Equal"
  },
]

export const TRIGGER_TYPES = [
  {
    value: TriggerType.EVENT,
    label: "Event"
  },
  {
    value: TriggerType.SCHEDULE,
    label: "Schedule"
  },
  {
    value: TriggerType.MANUAL,
    label: "Manual"
  }
]

export const ACTION_TYPES = [
  {
    value: ActionType.EMAIL,
    label: "Email"
  },
  {
    value: ActionType.SMS,
    label: "SMS"
  },
  {
    value: ActionType.PUSH,
    label: "Push"
  },
  {
    value: ActionType.IN_APP,
    label: "In App"
  },
  {
    value: ActionType.SLACK,
    label: "Slack"
  },
  {
    value: ActionType.ADMIN,
    label: "Admin"
  },
]

export const INVENTORY_ITEM_ATTRIBUTES = [
  {
    value: "inventory_item.stocked_quantity",
    label: "Stocked Quantity"
  },
  {
    value: "inventory_item.reserved_quantity",
    label: "Reserved Quantity"
  },
  {
    value: "inventory_item.available_quantity",
    label: "Available Quantity"
  },
  {
    value: "inventory_item.incoming_quantity",
    label: "Incoming Quantity"
  },
  {
    value: "inventory_item.location_id",
    label: "Location ID"
  },
]

export const INVENTORY_LEVEL_ATTRIBUTES = [
  {
    value: "inventory_level.stocked_quantity",
    label: "Stocked Quantity"
  },
  {
    value: "inventory_level.reserved_quantity",
    label: "Reserved Quantity"
  },
  {
    value: "inventory_level.available_quantity",
    label: "Available Quantity"
  },
  {
    value: "inventory_level.incoming_quantity",
    label: "Incoming Quantity"
  },
  {
    value: "inventory_level.location_id",
    label: "Location ID"
  },
]

export const EVENT_INVENTORY_TYPES = [
  {
    value: "inventory.inventory-level.created",
    label: "Inventory Level Created",
    attributes: INVENTORY_LEVEL_ATTRIBUTES
  },
  {
    value: "inventory.inventory-level.updated",
    label: "Inventory Level Updated",
    attributes: INVENTORY_LEVEL_ATTRIBUTES
  },
  {
    value: "inventory.inventory-level.deleted",
    label: "Inventory Level Deleted",
    attributes: INVENTORY_LEVEL_ATTRIBUTES
  }
]

export const EVENT_CUSTOMER_TYPES = [
  {
    value: "customer.created",
    label: "Customer Created"
  },
  {
    value: "customer.updated",
    label: "Customer Updated"
  }
]

export const EVENT_ORDER_TYPES = [
  {
    value: "order.placed",
    label: "Order Placed"
  },
  {
    value: "order.completed",
    label: "Order Completed"
  },
  {
    value: "order.shipped",
    label: "Order Shipped"
  }
]

export const ALL_EVENTS = [
  {
    name: "Inventory",
    events: [
      ...EVENT_INVENTORY_TYPES,
    ]
  },
  {
    name: "Customer",
    events: [
      ...EVENT_CUSTOMER_TYPES,
    ]
  },
  {
    name: "Order",
    events: [
      ...EVENT_ORDER_TYPES,
    ]
  }
]
