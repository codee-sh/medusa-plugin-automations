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
  private actionHandlers_: Map<string, ActionHandler> = new Map();

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
    this.initializeActionHandlers();
  }

  /**
   * Initialize action handlers from defaults and options
   */
  private initializeActionHandlers() {
    const defaultActions: ActionHandler[] = [new EmailActionHandler(), new SlackActionHandler() ];

    defaultActions.forEach((action) => {
      const isEnabled = this.actionsEnabled_[action.id];

      this.actionHandlers_.set(action.id, action);
      
      this.logger_.info(`Action handler for ${action.id} registered - ${isEnabled ? "enabled" : "disabled"} in config`);
    });

    const customHandlers = this.options_.automations?.actionHandlers || [];
    customHandlers.forEach((action) => {
      // If replace is true or action doesn't exist, set it
      if (!this.actionHandlers_.has(action.id)) {
        const isEnabled = this.actionsEnabled_[action.id];
        this.actionHandlers_.set(action.id, action);
        this.logger_.info(`Action handler for ${action.id} registered - ${isEnabled ? "enabled" : "disabled"} in config`);
      }
    });
  }

  /**
   * Get action handlers map
   */
  private getActionHandlers(): Map<string, ActionHandler> {
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
      value: handler.id,
      label: handler.label,
      description: handler.description,
      configComponentKey: handler.configComponentKey,
      templateLoaders: handler.templateLoaders,
      fields: handler.fields,
      enabled: this.actionsEnabled_[handler.id],
    }));
  }

  /**
   * Get action handler by ID for the admin panel form
   */
  getActionHandler(actionId: string): ActionHandler | undefined {
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
