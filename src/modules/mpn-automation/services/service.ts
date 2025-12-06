import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
import {
  MpnAutomationTrigger,
  MpnAutomationState,
  MpnAutomationRule,
  MpnAutomationRuleValue,
  MpnAutomationAction,
} from "../models"
import {
  ActionHandler,
  ActionExecuteParams,
  ModuleOptions,
  CustomEvent,
  ALL_EVENTS,
  TRIGGER_TYPES,
} from "../types"
import {
  EmailActionHandler
} from "../actions-handlers"

class MpnAutomationService extends MedusaService({
  MpnAutomationTrigger,
  MpnAutomationState,
  MpnAutomationRule,
  MpnAutomationRuleValue,
  MpnAutomationAction,
}) {
  private options_: ModuleOptions
  private events_: CustomEvent[]
  private actionHandlers_: Map<string, ActionHandler> = new Map()

  constructor(container: any, options?: ModuleOptions) {
    super(...arguments)

    this.options_ = options || {}
    this.events_ = this.options_.automations?.customEvents || []

    // Initialize default action handlers
    this.initializeActionHandlers()
  }

  /**
   * Initialize action handlers from defaults and options
   */
  private initializeActionHandlers() {
    // 1. Register default actions
    const defaultActions: ActionHandler[] = [
      new EmailActionHandler()
    ]

    defaultActions.forEach((action) => {
      this.actionHandlers_.set(action.id, action)
    })

    // 2. Register custom actions from options (can override defaults)
    const customHandlers = this.options_.automations?.actionHandlers || []
    customHandlers.forEach((action) => {
      // If replace is true or action doesn't exist, set it
      if (action.metadata?.replace || !this.actionHandlers_.has(action.id)) {
        this.actionHandlers_.set(action.id, action)
      }
    })
  }

  /**
   * Get action handlers map
   */
  private getActionHandlers(): Map<string, ActionHandler> {
    return this.actionHandlers_
  }

  getAvailableEvents() {
    return [...ALL_EVENTS, ...this.events_]
  }

  getAvailableActions() {
    // Return actions from actionHandlers_ map
    const handlers = this.getActionHandlers()
    return Array.from(handlers.values()).map((handler) => ({
      identifier: handler.identifier,
      value: handler.id,
      label: handler.label,
      description: handler.description,
      configComponentPath: handler.configComponentPath,
      templateLoaders: handler.templateLoaders,
      fields: handler.fields,
    }))
  }

  /**
   * Get action handler by ID
   */
  getActionHandler(actionId: string): ActionHandler | undefined {
    const handlers = this.getActionHandlers()
    return handlers.get(actionId)
  }

  /**
   * Execute an action
   */
  async executeAction(
    actionId: string,
    config: Record<string, any>,
    context: {
      trigger: any
      eventData?: any
      [key: string]: any
    }
  ) {
    const handlers = this.getActionHandlers()
    const handler = handlers.get(actionId)

    if (!handler) {
      throw new Error(`Action handler for "${actionId}" not found`)
    }

    // Validate configuration if handler has validateConfig
    if (handler.validateConfig) {
      const validation = handler.validateConfig(config)
      if (validation !== true) {
        throw new Error(
          typeof validation === "string"
            ? validation
            : "Invalid action configuration"
        )
      }
    }

    return handler.execute({
      config,
      context: context as ActionExecuteParams["context"],
    })
  }

  getAvailableTriggers() {
    return [...TRIGGER_TYPES]
  }
}

export default MpnAutomationService;
