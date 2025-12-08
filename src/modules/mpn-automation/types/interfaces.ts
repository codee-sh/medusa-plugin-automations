import { TriggerType } from "./types"

export interface NotificationRuleValue {
  id?: string
  value: string | null
  metadata: Record<string, any> | null
}

export interface NotificationRule {
  id?: string
  attribute: string
  operator: string
  description: string | null
  metadata: Record<string, any> | null
  rule_values: NotificationRuleValue[]
}

export interface NotificationAction {
  id?: string
  action_type?: string | null
  config?: Record<string, any> | null
}

export interface NotificationTrigger {
  id?: string
  trigger_id?: string
  name: string
  description: string | null
  trigger_type: TriggerType
  event_name: string | null
  interval_minutes: number | null
  active: boolean
  channels: Record<string, boolean> | null
  metadata: Record<string, any> | null
  rules?: NotificationRule[]
  actions?: NotificationAction[]
}
