import { TriggerType } from "./types"

export interface AutomationRuleValue {
  id?: string
  value: string | null
  metadata: Record<string, any> | null
}

export interface AutomationRule {
  id?: string
  attribute: string
  operator: string
  description: string | null
  metadata: Record<string, any> | null
  rule_values: AutomationRuleValue[]
}

export interface AutomationAction {
  id?: string
  action_type?: string | null
  config?: Record<string, any> | null
}

export interface AutomationTrigger {
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
  rules?: AutomationRule[]
  actions?: AutomationAction[]
}
