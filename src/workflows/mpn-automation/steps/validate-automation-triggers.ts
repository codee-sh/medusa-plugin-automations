import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { validateRulesForContext } from "../../../utils/validate-rules"
import { NotificationTrigger } from '../../../modules/mpn-automation/interfaces'

export interface ValidateAutomationTriggersStepInput {
  triggers: NotificationTrigger[]
  context: Record<string, any>
}

export const validateAutomationTriggersStepId = "validate-automation-triggers"

/**
 * This step validates multiple automation triggers against context data.
 * 
 * @example
 * const data = validateAutomationTriggersStep({
 *   triggers: [ ... ],
 *   context: { ... }
 * })
 */
export const validateAutomationTriggersStep = createStep(
  validateAutomationTriggersStepId,
  async (
    input: ValidateAutomationTriggersStepInput
  ): Promise<StepResponse<any>> => {
    const { triggers, context } = input

    const validated = triggers.map((trigger) => {
      // Validate rules for context
      const isValid = validateRulesForContext(trigger.rules || [], context)

      return {
        isValid,
        trigger,
        actions: trigger.actions,
      }
    }).filter((action: any) => action.isValid)

    return new StepResponse(validated, validated)
  }
)

