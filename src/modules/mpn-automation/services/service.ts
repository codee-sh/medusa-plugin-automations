import {
  MedusaService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  MpnAutomationTrigger,
  MpnAutomationState,
  MpnAutomationRule,
  MpnAutomationRuleValue,
  MpnAutomationAction,
} from "../models"
import {
  ModuleOptions,
  ActionHandler,
  CustomEventGroup,
  TRIGGER_TYPES,
} from "../types"
import {
  EmailActionHandler,
  SlackActionHandler,
} from "../actions-handlers"
import { Logger } from "@medusajs/framework/types"
import {
  InventoryEvents,
  CartWorkflowEvents,
  CustomerWorkflowEvents,
  OrderWorkflowEvents,
  OrderEditWorkflowEvents,
  UserWorkflowEvents,
  AuthWorkflowEvents,
  SalesChannelWorkflowEvents,
  ProductCategoryWorkflowEvents,
  ProductCollectionWorkflowEvents,
  ProductVariantWorkflowEvents,
  ProductWorkflowEvents,
  ProductTypeWorkflowEvents,
  ProductTagWorkflowEvents,
  ProductOptionWorkflowEvents,
  InviteWorkflowEvents,
  RegionWorkflowEvents,
  FulfillmentWorkflowEvents,
  PaymentEvents
} from "@medusajs/framework/utils"
import { getEventMetadata } from "../types/modules"

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
  private options_: ModuleOptions
  private logger_: Logger
  private events_: CustomEventGroup[]
  private actionsEnabled_: any
  private actionHandlers_: Map<
    string,
    { handler: ActionHandler; enabled: boolean }
  > = new Map()

  constructor(
    { logger }: InjectedDependencies,
    options?: ModuleOptions
  ) {
    super(...arguments)

    this.logger_ = logger
    this.options_ = options || {}
    this.events_ =
      this.options_.automations?.customEvents || []
    this.actionsEnabled_ = this.options_.automations
      ?.actionsEnabled || {
      slack: false,
      email: true,
    }

    // Initialize default action handlers
    this.initializeActionHandlers()
  }

  /**
   * Get available triggers for the admin panel form
   * 
   * @returns Array of triggers
   */
  getAvailableTriggers() {
    return [...TRIGGER_TYPES]
  }

  /**
   * Get action handlers map
   * 
   * @returns Map of action handlers
   */
  private getActionHandlers(): Map<
    string,
    { handler: ActionHandler; enabled: boolean }
  > {
    return this.actionHandlers_
  }

  /**
   * Build events list using central metadata registry
   * Supports both Medusa events and custom events
   * 
   * @returns Array of events
   */
  buildAvailableEvents() {
    const events = [
      // Service Events (automatic CRUD events)
      {
        name: "Inventory",
        events: this.buildEvents(InventoryEvents) || [],
      },
      {
        name: "Cart",
        events: this.buildEvents(CartWorkflowEvents),
      },
      {
        name: "Customer",
        events: this.buildEvents(CustomerWorkflowEvents),
      },
      {
        name: "Order",
        events: this.buildEvents(OrderWorkflowEvents),
      },
      {
        name: "Order Edit",
        events: this.buildEvents(OrderEditWorkflowEvents),
      },
      {
        name: "User",
        events: this.buildEvents(UserWorkflowEvents),
      },
      {
        name: "Auth",
        events: this.buildEvents(AuthWorkflowEvents),
      },
      {
        name: "Sales Channel",
        events: this.buildEvents(SalesChannelWorkflowEvents),
      },
      {
        name: "Product Category",
        events: this.buildEvents(ProductCategoryWorkflowEvents),
      },
      {
        name: "Product Collection",
        events: this.buildEvents(ProductCollectionWorkflowEvents),
      },
      {
        name: "Product Variant",
        events: this.buildEvents(ProductVariantWorkflowEvents),
      },
      {
        name: "Product",
        events: this.buildEvents(ProductWorkflowEvents),
      },
      {
        name: "Product Type",
        events: this.buildEvents(ProductTypeWorkflowEvents),
      },
      {
        name: "Product Tag",
        events: this.buildEvents(ProductTagWorkflowEvents),
      },
      {
        name: "Product Option",
        events: this.buildEvents(ProductOptionWorkflowEvents),
      },
      {
        name: "Invite",
        events: this.buildEvents(InviteWorkflowEvents),
      },
      {
        name: "Region",
        events: this.buildEvents(RegionWorkflowEvents),
      },
      {
        name: "Fulfillment",
        events: this.buildEvents(FulfillmentWorkflowEvents),
      },
      {
        name: "Payment Events",
        events: this.buildEvents(PaymentEvents) || [],
      },
    ]

    // Filter out empty groups and ensure all groups have events array
    return events
      .filter((group) => group && group.events && Array.isArray(group.events) && group.events.length > 0)
      .map((group) => ({
        name: String(group.name || ''),
        events: group.events || [],
      }))
  }

  /**
   * Get available events for the admin panel form
   * Combines Medusa events with custom events
   * 
   * @returns Array of events
   */
  getAvailableEvents() {
    const medusaEvents = this.buildAvailableEvents()
    
    if (!this.events_ || this.events_.length === 0) {
      return medusaEvents
    }

    // If there are custom events, add them to the result
    if (this.events_.length > 0) {
      return [...medusaEvents, ...this.events_]
    }

    return medusaEvents
  }

  /**
   * Get available templates for a given event name
   * Uses getAvailableEvents() to find the event and extract template
   * 
   * @param eventName - Event name to search for
   * @returns Array of template options
   */
  getTemplatesForEvent(eventName?: string): Array<{ value: string; name: string }> {
    if (!eventName) {
      return []
    }

    const allEvents = this.getAvailableEvents()
    
    // Search through all event groups
    for (const group of allEvents) {
      const event = group.events?.find((e: any) => e.value === eventName)
      if (event?.template) {
        return [event.template]
      }
    }

    return []
  }

  /**
   * Initialize action handlers from defaults and options
   * 
   * @returns void
   */
  private initializeActionHandlers() {
    const defaultActions: ActionHandler[] = [
      new EmailActionHandler(),
      new SlackActionHandler(),
    ]

    defaultActions.forEach((action) => {
      const isEnabled = this.actionsEnabled_[action.id]

      this.actionHandlers_.set(action.id, {
        handler: action,
        enabled: isEnabled,
      })

      this.logger_.info(
        `Action handler for ${action.id} registered - ${isEnabled ? "enabled" : "disabled"} in config`
      )
    })

    const customHandlers =
      this.options_.automations?.actionHandlers || []
    customHandlers.forEach((action) => {
      if (!this.actionHandlers_.has(action.id)) {
        const isEnabled = this.actionsEnabled_[action.id]
        this.actionHandlers_.set(action.id, {
          handler: action,
          enabled: isEnabled,
        })
        this.logger_.info(
          `Action handler for ${action.id} registered - ${isEnabled ? "enabled" : "disabled"} in config`
        )
      }
    })
  }

  /**
   * Get available actions for the admin panel form
   * 
   * @param eventName - Optional event name to filter templates dynamically
   * @returns Array of actions
   */
  getAvailableActions(eventName?: string) {
    const handlers = this.getActionHandlers()

    return Array.from(handlers.values()).map((handler) => {
      // Get fields, potentially with dynamic template options
      let fields = handler.handler.fields || []

      // If eventName is provided, update templateName fields dynamically
      if (eventName && fields.length > 0) {
        const templates = this.getTemplatesForEvent(eventName)
        
        fields = fields.map((field) => {
          // If this is a templateName field, update its options
          if (field.key === "templateName" && field.type === "select") {
            return {
              ...field,
              options: templates.length > 0 ? templates : field.options || [],
              defaultValue: templates.length > 0 ? templates[0]?.value : field.defaultValue,
            }
          }
          return field
        })
      }

      return {
        value: handler.handler.id,
        label: handler.handler.label,
        description: handler.handler.description,
        configComponentKey: handler.handler.configComponentKey,
        templateLoaders: handler.handler.templateLoaders,
        fields: fields,
        enabled: handler.enabled,
      }
    })
  }

  /**
   * Build events list from Medusa events
   * Supports both Medusa events and custom events
   * 
   * @param events - Medusa events object
   * @returns Array of events
   */
  private buildEvents(events: any) {
    if (!events || typeof events !== 'object') {
      return []
    }
    
    return Object.values(events)
      .filter((event: any) => event != null) // Filter out null/undefined
      .map((event: any) => {
        const eventName = String(event)
        
        // Skip invalid event names
        if (!eventName || eventName === 'undefined' || eventName === 'null') {
          return null
        }

        const metadata = getEventMetadata(eventName)
        
        return {
          value: eventName,
          label: eventName,
          attributes: metadata.attributes || event.attributes || [],
          template: metadata.template || event.template || null,
        }
      })
      .filter((event: any) => event != null) // Filter out null results
  }

  /**
   * Get action handler by ID for the admin panel form
   * 
   * @param actionId - Action ID
   * @returns Action handler
   */
  getActionHandler(
    actionId: string
  ):
    | { handler: ActionHandler; enabled: boolean }
    | undefined {
    const handlers = this.getActionHandlers()
    return handlers.get(actionId)
  }
}

export default MpnAutomationService
