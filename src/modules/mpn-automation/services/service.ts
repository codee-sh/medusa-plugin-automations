import {
  MedusaService,
  MedusaError
} from "@medusajs/framework/utils";
import {
  MpnAutomationTrigger,
  MpnAutomationState,
  MpnAutomationRule,
  MpnAutomationRuleValue,
  MpnAutomationAction,
} from "../models";
import {
  ActionHandler,
  ModuleOptions,
  CustomEvent,
  ALL_EVENTS,
  TRIGGER_TYPES,
} from "../types";
import { EmailActionHandler, SlackActionHandler } from "../actions-handlers";
import { Logger } from "@medusajs/framework/types"

type InjectedDependencies = {
  logger: Logger
}

class MpnAutomationService extends MedusaService({
  MpnAutomationTrigger,
  MpnAutomationState,
  MpnAutomationRule,
  MpnAutomationRuleValue,
  MpnAutomationAction,
}) {
  private options_: ModuleOptions;
  private logger_: Logger;
  private events_: CustomEvent[];
  private actionsEnabled_: any;
  private actionHandlers_: Map<string, { handler: ActionHandler, enabled: boolean }> = new Map();

  constructor({ logger }: InjectedDependencies, options?: ModuleOptions) {
    super(...arguments);

    this.logger_ = logger;  
    this.options_ = options || {};
    this.events_ = this.options_.automations?.customEvents || [];
    this.actionsEnabled_ = this.options_.automations?.actionsEnabled || {
      slack: false,
      email: true,
    };
    
    // Initialize default action handlers
    this.init();
  }

  /**
   * Initialize action handlers from defaults and options
   */
  private init() {
    const defaultActions: ActionHandler[] = [new EmailActionHandler(), new SlackActionHandler() ];

    defaultActions.forEach((action) => {
      const isEnabled = this.actionsEnabled_[action.id];

      this.actionHandlers_.set(action.id, {
        handler: action,
        enabled: isEnabled,
      });

      this.logger_.info(`Action handler for ${action.id} registered - ${isEnabled ? "enabled" : "disabled"} in config`);
    });

    const customHandlers = this.options_.automations?.actionHandlers || [];
    customHandlers.forEach((action) => {
      if (!this.actionHandlers_.has(action.id)) {
        const isEnabled = this.actionsEnabled_[action.id];
        this.actionHandlers_.set(action.id, {
          handler: action,
          enabled: isEnabled,
        });
        this.logger_.info(`Action handler for ${action.id} registered - ${isEnabled ? "enabled" : "disabled"} in config`);
      }
    });
  }

  /**
   * Get action handlers map
   */
  private getActionHandlers(): Map<string, { handler: ActionHandler, enabled: boolean }> {
    return this.actionHandlers_;
  }

  /**
   * Get available events for the admin panel form
   */
  getAvailableEvents() {
    return [...ALL_EVENTS, ...this.events_];
  }

  /**
   * Get available actions for the admin panel form
   */
  getAvailableActions() {
    const handlers = this.getActionHandlers();

    return Array.from(handlers.values()).map((handler) => ({
      value: handler.handler.id,
      label: handler.handler.label,
      description: handler.handler.description,
      configComponentKey: handler.handler.configComponentKey,
      templateLoaders: handler.handler.templateLoaders,
      fields: handler.handler.fields,
      enabled: handler.enabled,
    }));
  }

  /**
   * Get action handler by ID for the admin panel form
   */
  getActionHandler(actionId: string): { handler: ActionHandler, enabled: boolean } | undefined {
    const handlers = this.getActionHandlers();
    return handlers.get(actionId);
  }

  /**
   * Get available triggers for the admin panel form
   */
  getAvailableTriggers() {
    return [...TRIGGER_TYPES];
  }
}

export default MpnAutomationService;
