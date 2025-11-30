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

export const CHANNEL_TYPES = [
  {
    value: ChannelType.EMAIL,
    label: "Email"
  },
  {
    value: ChannelType.SLACK,
    label: "Slack"
  },
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

export const EVENT_INVENTORY_TYPES = [
  {
    value: "inventory.inventory-level.created",
    label: "Inventory Level Created"
  },
  {
    value: "inventory.inventory-level.updated",
    label: "Inventory Level Updated"
  },
  {
    value: "inventory.inventory-level.deleted",
    label: "Inventory Level Deleted"
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
