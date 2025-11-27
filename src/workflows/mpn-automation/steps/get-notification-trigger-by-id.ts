import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"
import type MpnAutomationService from "../../../modules/mpn-automation/services/service"
import { NotificationRule } from "../utils/evaluate-rules"

export interface GetNotificationTriggerByIdStepInput {
  trigger_id: string
}

export interface GetNotificationTriggerByIdStepOutput {
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
  } | null
}

export const getNotificationTriggerByIdStepId = "get-notification-trigger-by-id"

/**
 * This step retrieves a notification trigger by its trigger_id.
 * 
 * @example
 * const data = getNotificationTriggerByIdStep({
 *   trigger_id: "low-stock-alert"
 * })
 */
export const getNotificationTriggerByIdStep = createStep(
  getNotificationTriggerByIdStepId,
  async (
    input: GetNotificationTriggerByIdStepInput,
    { container }
  ): Promise<StepResponse<GetNotificationTriggerByIdStepOutput>> => {
    const automationService = container.resolve<MpnAutomationService>(
      MPN_AUTOMATION_MODULE
    )

    // Retrieve trigger by trigger_id with relations
    const triggers = await automationService.listMpnAutomationTriggers(
      {
        trigger_id: input.trigger_id,
        active: true,
      },
      {
        relations: [
          "rules",
          "rules.rule_values",
        ],
      }
    )

    const trigger = triggers[0] || null

    if (!trigger) {
      return new StepResponse({
        trigger: null,
      })
    }

    return new StepResponse({
      trigger: {
        id: trigger.id,
        trigger_id: trigger.trigger_id,
        name: trigger.name,
        description: trigger.description,
        trigger_type: trigger.trigger_type,
        event_name: trigger.event_name,
        interval_minutes: trigger.interval_minutes,
        last_run_at: trigger.last_run_at,
        active: trigger.active,
        channels: trigger.channels as Record<string, boolean> | null,
        metadata: trigger.metadata as Record<string, any> | null,
        rules: (trigger.rules || []).map((rule) => ({
          id: rule.id,
          attribute: rule.attribute,
          operator: rule.operator,
          description: rule.description,
          metadata: rule.metadata as Record<string, any> | null,
          rule_values: (rule.rule_values || []).map((value) => ({
            id: value.id,
            value: value.value,
            metadata: value.metadata as Record<string, any> | null,
          })),
        })),
      },
    })
  }
)

