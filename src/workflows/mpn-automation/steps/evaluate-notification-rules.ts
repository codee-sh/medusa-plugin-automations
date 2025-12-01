import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { areRulesValidForContext } from "../../../utils/evaluate-rules"
import { NotificationTrigger } from '../../../modules/mpn-automation/interfaces'

export interface EvaluateNotificationRulesStepInput {
  trigger: NotificationTrigger
  context: Record<string, any>
}

export interface EvaluateNotificationRulesStepOutput {
  is_valid: boolean
  trigger: NotificationTrigger
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

