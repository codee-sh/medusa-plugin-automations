import { MedusaService, MedusaContext } from "@medusajs/framework/utils";
import { MpnAutomationTrigger, MpnAutomationState, MpnAutomationRule, MpnAutomationRuleValue } from "../models";
import { ALL_EVENTS, ACTION_TYPES, TRIGGER_TYPES, ModuleOptions, CustomEvent, CustomAction } from "../types";

class MpnAutomationService extends MedusaService({
  MpnAutomationTrigger,
  MpnAutomationState,
  MpnAutomationRule,
  MpnAutomationRuleValue
  }) {
  private options_: ModuleOptions
  private events_: CustomEvent[]
  private actions_: CustomAction[]

  constructor({}, options?: ModuleOptions) {
    super(...arguments)

    this.options_ = options || {}
    this.events_ = this.options_.automations?.customEvents || []
    this.actions_ = this.options_.automations?.customActions || []
  }

  getAvailableEvents() {
    return [
      ...ALL_EVENTS,
      ...this.events_
    ]
  }

  getAvailableActions() {
    return [
      ...ACTION_TYPES,
      ...this.actions_
    ]
  }

  getAvailableTriggers() {
    return [
      ...TRIGGER_TYPES
    ]
  }
}

export default MpnAutomationService;
