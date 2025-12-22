import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { validateRulesForContext } from "../../../utils/validate-rules"
import { AutomationTrigger } from "../../../modules/mpn-automation/types/interfaces"

export interface ValidateTriggersRulesStepInput {
  triggers: AutomationTrigger[]
  context: Record<string, any>
}

export const validateTriggersRulesStepId =
  "validate-triggers-rules"

/**
 * This step validates multiple automation triggers against context data.
 *
 * @example
 * const data = validateTriggersRulesStep({
 *   triggers: [ ... ],
 *   context: { ... }
 * })
 */
export const validateTriggersRulesStep = createStep(
  validateTriggersRulesStepId,
  async (
    input: ValidateTriggersRulesStepInput
  ): Promise<StepResponse<any>> => {
    const { triggers, context } = input

    const validated = triggers
      .map((trigger) => {
        // Validate rules for context
        const rules = trigger.rules || []
        const isValid = validateRulesForContext(
          rules,
          context
        )

        return {
          trigger,
          isValid,
        }
      })
      .filter((trigger: any) => trigger.isValid)

    return new StepResponse(validated, validated)
  }
)
