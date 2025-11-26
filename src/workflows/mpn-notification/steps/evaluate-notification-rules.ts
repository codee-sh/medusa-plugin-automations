import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { areRulesValidForContext, NotificationRule } from "../utils/evaluate-rules"

export interface EvaluateNotificationRulesStepInput {
  trigger: {
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
  }
  context: Record<string, any>
}

export interface EvaluateNotificationRulesStepOutput {
  is_valid: boolean
  trigger: EvaluateNotificationRulesStepInput["trigger"]
  context: EvaluateNotificationRulesStepInput["context"]
}

export const evaluateNotificationRulesStepId = "evaluate-notification-rules"

/**
 * This step evaluates notification rules against inventory level data.
 * 
 * @example
 * const data = evaluateNotificationRulesStep({
 *   trigger: { ... },
 *   context: { ... }
 * })
 */
export const evaluateNotificationRulesStep = createStep(
  evaluateNotificationRulesStepId,
  async (
    input: EvaluateNotificationRulesStepInput,
    { container }
  ): Promise<StepResponse<EvaluateNotificationRulesStepOutput>> => {
    const { trigger, context } = input

    // Check if all rules are satisfied
    const is_valid = areRulesValidForContext(trigger.rules || [], context)

    return new StepResponse({
      is_valid,
      trigger,
      context,
    })
  }
)

