import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import MpnAutomationService from "../../../modules/mpn-automation/service"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"
import { AutomationTrigger } from "../../../modules/mpn-automation/types/interfaces"

export interface ValidateTriggerThrottleStepInput {
  validatedTriggers: Array<{
    isValid: boolean
    trigger: AutomationTrigger
  }>
  targetKey: string | null
}

export interface ValidateTriggerThrottleResult {
  trigger: AutomationTrigger
  isValid: boolean
  isThrottled: boolean
  throttleReason?: string
  nextAvailableAt?: Date
}

export const validateTriggerThrottleStepId = "validate-trigger-throttle"

/**
 * This step checks throttle limits for validated triggers.
 * Filters out triggers that are throttled based on interval_seconds and MpnAutomationState.
 *
 * For event triggers with interval_seconds set:
 * - Checks last_triggered_at from MpnAutomationState
 * - Skips trigger if not enough time has passed since last execution
 *
 * @example
 * const data = validateTriggerThrottleStep({
 *   validatedTriggers: [...],
 *   targetKey: "order_123"
 * })
 */
export const validateTriggerThrottleStep = createStep(
  validateTriggerThrottleStepId,
  async (
    input: ValidateTriggerThrottleStepInput,
    { container }
  ): Promise<StepResponse<ValidateTriggerThrottleResult[]>> => {
    const { validatedTriggers, targetKey } = input

    const mpnAutomationService: MpnAutomationService =
      container.resolve(MPN_AUTOMATION_MODULE)
    const logger = container.resolve(
      ContainerRegistrationKeys.LOGGER
    )

    if (
      !validatedTriggers ||
      validatedTriggers.length === 0
    ) {
      return new StepResponse([], [])
    }

    const results: ValidateTriggerThrottleResult[] = []

    for (const validated of validatedTriggers) {
      const trigger = validated.trigger

      // Only check throttle for event triggers with interval_seconds set
      if (
        trigger.trigger_type !== "event" ||
        !trigger.interval_seconds ||
        trigger.interval_seconds <= 0
      ) {
        // No throttle configured - pass through
        results.push({
          trigger,
          isValid: validated.isValid,
          isThrottled: false,
        })
        continue
      }

      // Check state for this trigger + target
      const states =
        await mpnAutomationService.listMpnAutomationStates({
          trigger_id: trigger.id,
          target_key: targetKey,
        })

      const state = states?.[0]

      if (state?.last_triggered_at) {
        const lastTriggeredAt = new Date(
          state.last_triggered_at
        )
        const now = new Date()
        const secondsSinceLast =
          (now.getTime() - lastTriggeredAt.getTime()) / 1000

        if (secondsSinceLast < trigger.interval_seconds) {
          // Throttled - not enough time has passed
          const nextAvailableAt = new Date(
            lastTriggeredAt.getTime() +
              trigger.interval_seconds * 1000
          )

          results.push({
            trigger,
            isValid: false,
            isThrottled: true,
            throttleReason: `Throttled: last triggered ${Math.round(secondsSinceLast)}s ago, minimum interval is ${trigger.interval_seconds}s`,
            nextAvailableAt,
          })
          continue
        }
      }

      // Not throttled - pass through
      results.push({
        trigger,
        isValid: validated.isValid,
        isThrottled: false,
      })
    }

    return new StepResponse(results, results)
  }
)
