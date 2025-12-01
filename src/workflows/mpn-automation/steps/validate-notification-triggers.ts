import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { areRulesValidForContext } from "../../../utils/evaluate-rules"
import { NotificationRule, NotificationAction, NotificationTrigger } from '../../../modules/mpn-automation/interfaces'

export interface ValidateNotificationTriggersStepInput {
  triggers: NotificationTrigger[]
  context: Record<string, any>
}

export interface ValidateNotificationTriggersStepOutput {
  results: Array<{
    is_valid: boolean
    trigger: NotificationTrigger
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

      return {
        is_valid,
        trigger: trigger,
        actions: trigger.actions || [],
        rules: trigger.rules || [],
      }
    })

    return new StepResponse({
      results,
    })
  }
)

