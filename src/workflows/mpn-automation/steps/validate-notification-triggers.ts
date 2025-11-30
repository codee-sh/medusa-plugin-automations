import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { areRulesValidForContext, NotificationRule, NotificationAction } from "../utils/evaluate-rules"

export interface ValidateNotificationTriggersStepInput {
  triggers: Array<{
    id: string
    trigger_id: string
    name: string
    description: string | null
    trigger_type: "event" | "schedule" | "manual"
    event_name: string | null
    interval_minutes: number | null
    last_run_at: Date | null
    active: boolean
    channels: Record<string, boolean> | null
    metadata: Record<string, any> | null
    rules: NotificationRule[]
    actions: NotificationAction[]
  }>
  context: Record<string, any>
}

export interface ValidateNotificationTriggersStepOutput {
  results: Array<{
    passed: boolean
    is_valid: boolean
    trigger_id: string
    trigger_name: string
    rules_count: number
    actions: NotificationAction[]
    rules: NotificationRule[]
  }>
}

export const validateNotificationTriggersStepId = "validate-notification-triggers"

/**
 * This step validates multiple notification triggers against context data.
 * 
 * @example
 * const data = validateNotificationTriggersStep({
 *   triggers: [ ... ],
 *   context: { ... }
 * })
 */
export const validateNotificationTriggersStep = createStep(
  validateNotificationTriggersStepId,
  async (
    input: ValidateNotificationTriggersStepInput,
    { container }
  ): Promise<StepResponse<ValidateNotificationTriggersStepOutput>> => {
    const { triggers, context } = input

    const results = triggers.map((trigger) => {
      // Check if all rules are satisfied
      const is_valid = areRulesValidForContext(trigger.rules || [], context)
      console.log("trigger:", trigger);
      console.log("context:", context);

      return {
        passed: is_valid,
        is_valid,
        trigger_id: trigger.trigger_id,
        trigger_name: trigger.name,
        rules_count: trigger.rules?.length || 0,
        actions: trigger.actions || [],
        rules: trigger.rules || [],
      }
    })

    return new StepResponse({
      results,
    })
  }
)

