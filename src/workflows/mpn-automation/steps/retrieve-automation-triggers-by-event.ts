import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"
import type MpnAutomationService from "../../../modules/mpn-automation/services/service"
import {
  AutomationTrigger,
  TriggerType,
} from "../../../modules/mpn-automation/types/interfaces"

export interface GetAutomationTriggersByEventStepInput {
  eventName: string
  eventType: TriggerType
}

export const getAutomationTriggersByEventStepId =
  "get-automation-triggers-by-event"

/**
 * This step retrieves notification triggers (scenarios) by event name.
 *
 * @example
 * const data = getAutomationTriggersByEventStep({
 *   eventName: "inventory.inventory-level.updated",
 *   eventType: TriggerType.EVENT
 * })
 */
export const getAutomationTriggersByEventStep = createStep(
  getAutomationTriggersByEventStepId,
  async (
    input: GetAutomationTriggersByEventStepInput,
    { container }
  ): Promise<StepResponse<AutomationTrigger[]>> => {
    const automationService =
      container.resolve<MpnAutomationService>(
        MPN_AUTOMATION_MODULE
      )

    // Retrieve triggers for the given event that are active and have the specified type
    const triggers =
      await automationService.listMpnAutomationTriggers(
        {
          event_name: input.eventName,
          trigger_type: input.eventType,
          active: true,
        },
        {
          relations: [
            "rules",
            "rules.rule_values",
            "actions",
          ],
        }
      )

    const triggersData = triggers.map((trigger) => ({
      id: trigger.id,
      name: trigger.name,
      description: trigger.description,
      trigger_type: trigger.trigger_type as TriggerType,
      event_name: trigger.event_name,
      interval_minutes: trigger.interval_minutes,
      active: trigger.active,
      channels: trigger.channels as Record<
        string,
        boolean
      > | null,
      metadata: trigger.metadata as Record<
        string,
        any
      > | null,
      rules: (trigger.rules || []).map((rule) => ({
        id: rule.id,
        attribute: rule.attribute,
        operator: rule.operator,
        description: rule.description,
        metadata: rule.metadata as Record<
          string,
          any
        > | null,
        rule_values: (rule.rule_values || []).map(
          (value) => ({
            id: value.id,
            value: value.value,
            metadata: value.metadata as Record<
              string,
              any
            > | null,
          })
        ),
      })),
      actions: (trigger.actions || []).map((action) => ({
        id: action.id,
        action_type: action.action_type,
        config: action.config,
      })),
    }))

    return new StepResponse(triggersData, triggersData)
  }
)
