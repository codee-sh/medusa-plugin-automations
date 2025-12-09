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
  ActionHandler,
  ModuleOptions,
  CustomEvent,
  ALL_EVENTS,
  TRIGGER_TYPES,
} from "../types"
import {
  EmailActionHandler,
  SlackActionHandler,
} from "../actions-handlers"
import { Logger } from "@medusajs/framework/types"
import {
  InventoryEvents,
  ProductEvents,
  UserEvents,
  PricingEvents,
  NotificationEvents,
  FulfillmentEvents,
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
  PaymentEvents,
  Modules,
} from "@medusajs/framework/utils"
import { INVENTORY_LEVEL_ATTRIBUTES } from "../types/modules/inventory"

// Optional import for ShippingOptionTypeWorkflowEvents (available from v2.10.0+)
let ShippingOptionTypeWorkflowEvents: any = null
try {
  const coreFlowsModule = require("@medusajs/framework/utils")
  if (coreFlowsModule.ShippingOptionTypeWorkflowEvents) {
    ShippingOptionTypeWorkflowEvents = coreFlowsModule.ShippingOptionTypeWorkflowEvents
  }
} catch (e) {
  // Event not available in this version
}

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
  private events_: CustomEvent[]
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
    this.init()
  }

  /**
   * Initialize action handlers from defaults and options
   */
  private init() {
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
   * Get action handlers map
   */
  private getActionHandlers(): Map<
    string,
    { handler: ActionHandler; enabled: boolean }
  > {
    return this.actionHandlers_
  }

  /**
   * Get available events for the admin panel form
   */
  getAvailableEvents() {
    return [...this.buildAvailableEvents(), ...this.events_]
  }

  buildAvailableEvents() {
    const buildEvents = (events: any) => {
      return Object.values(events).map((event: any) => {
        console.log("event", event)

        let attributes = [] as any

        if (event === 'inventory.inventory-level.updated') {
          attributes = INVENTORY_LEVEL_ATTRIBUTES
        }

        return {
          value: event,
          label: event,
          attributes: attributes,
        }
      })
    }

    const events = [
      // Service Events (automatic CRUD events)
      {
        name: Modules.INVENTORY,
        events: buildEvents(InventoryEvents),
      },
      // {
      //   name: Modules.PRICING,
      //   events: buildEvents(PricingEvents),
      // },
      // {
      //   name: Modules.FULFILLMENT,
      //   events: buildEvents(FulfillmentEvents),
      // },
      // Workflow Events (business-level events)
      {
        name: "Cart",
        events: buildEvents(CartWorkflowEvents),
      },
      {
        name: "Customer",
        events: buildEvents(CustomerWorkflowEvents),
      },
      {
        name: "Order",
        events: buildEvents(OrderWorkflowEvents),
      },
      {
        name: "Order Edit",
        events: buildEvents(OrderEditWorkflowEvents),
      },
      {
        name: "User",
        events: buildEvents(UserWorkflowEvents),
      },
      {
        name: "Auth",
        events: buildEvents(AuthWorkflowEvents),
      },
      {
        name: "Sales Channel",
        events: buildEvents(SalesChannelWorkflowEvents),
      },
      {
        name: "Product Category",
        events: buildEvents(ProductCategoryWorkflowEvents),
      },
      {
        name: "Product Collection",
        events: buildEvents(ProductCollectionWorkflowEvents),
      },
      {
        name: "Product Variant",
        events: buildEvents(ProductVariantWorkflowEvents),
      },
      {
        name: "Product",
        events: buildEvents(ProductWorkflowEvents),
      },
      {
        name: "Product Type",
        events: buildEvents(ProductTypeWorkflowEvents),
      },
      {
        name: "Product Tag",
        events: buildEvents(ProductTagWorkflowEvents),
      },
      {
        name: "Product Option",
        events: buildEvents(ProductOptionWorkflowEvents),
      },
      {
        name: "Invite",
        events: buildEvents(InviteWorkflowEvents),
      },
      {
        name: "Region",
        events: buildEvents(RegionWorkflowEvents),
      },
      {
        name: "Fulfillment",
        events: buildEvents(FulfillmentWorkflowEvents),
      },
      ...(ShippingOptionTypeWorkflowEvents
        ? [
            {
              name: "Shipping Option Type Workflows",
              events: buildEvents(ShippingOptionTypeWorkflowEvents),
            },
          ]
        : []),
      {
        name: "Payment Events",
        events: buildEvents(PaymentEvents),
      },
    ]

    return events
  }

  /**
   * Get available actions for the admin panel form
   */
  getAvailableActions() {
    const handlers = this.getActionHandlers()

    return Array.from(handlers.values()).map((handler) => ({
      value: handler.handler.id,
      label: handler.handler.label,
      description: handler.handler.description,
      configComponentKey:
        handler.handler.configComponentKey,
      templateLoaders: handler.handler.templateLoaders,
      fields: handler.handler.fields,
      enabled: handler.enabled,
    }))
  }

  /**
   * Get action handler by ID for the admin panel form
   */
  getActionHandler(
    actionId: string
  ):
    | { handler: ActionHandler; enabled: boolean }
    | undefined {
    const handlers = this.getActionHandlers()
    return handlers.get(actionId)
  }

  /**
   * Get available triggers for the admin panel form
   */
  getAvailableTriggers() {
    return [...TRIGGER_TYPES]
  }
}

export default MpnAutomationService
