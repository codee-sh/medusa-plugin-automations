import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"
import type MpnAutomationService from "../../../modules/mpn-automation/services/service"

export interface GetNotificationTriggersByEventStepInput {
  event_name: string
}

export interface GetNotificationTriggersByEventStepOutput {
  triggers: Array<{
    id: string
    name: string
    description: string | null
    trigger_type: "event" | "schedule" | "manual"
    event_name: string | null
    interval_minutes: number | null
    last_run_at: Date | null
    active: boolean
    channels: Record<string, boolean> | null
    metadata: Record<string, any> | null
    rules: Array<{
      id: string
      attribute: string
      operator: string
      description: string | null
      metadata: Record<string, any> | null
      rule_values: Array<{
        id: string
        value: string | null
        metadata: Record<string, any> | null
      }>
    }>
  }>
}

export const getNotificationTriggersByEventStepId = "get-notification-triggers-by-event"

/**
 * This step retrieves notification triggers (scenarios) by event name.
 * 
 * @example
 * const data = getNotificationTriggersByEventStep({
 *   event_name: "inventory.inventory-level.updated"
 * })
 */
export const getNotificationTriggersByEventStep = createStep(
  getNotificationTriggersByEventStepId,
  async (
    input: GetNotificationTriggersByEventStepInput,
    { container }
  ): Promise<StepResponse<GetNotificationTriggersByEventStepOutput>> => {
    // Use the main module service
    const automationService = container.resolve<MpnAutomationService>(
      MPN_AUTOMATION_MODULE
    )

    // Retrieve triggers for the given event that are active and have type "event"
    const triggers = await automationService.listMpnAutomationTriggers(
      {
        event_name: input.event_name,
        trigger_type: "event",
        active: true,
      },
      {
        relations: [
          "rules",
          "rules.rule_values",
        ],
      }
    )

    return new StepResponse({
      triggers: triggers.map((trigger) => ({
        id: trigger.id,
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
      })),
    })
  }
)

