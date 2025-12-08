import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";
import { MedusaError } from "@medusajs/utils";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  NotificationAction,
  NotificationTrigger,
} from "../../../modules/mpn-automation/types/interfaces";
import MpnAutomationService from "../../../modules/mpn-automation/services/service";
import { saveAutomationStateWorkflow } from "../save-automation-state";

export interface RunAutomationActionsStepInput {
  validatedTriggers: Array<{
    isValid: boolean;
    trigger: NotificationTrigger;
    actions: NotificationAction[];
  }>;
  context: Record<string, any>;
}

export interface RunAutomationActionsStepOutput {
  triggersExecuted: any;
}

export const runAutomationActionsStepId = "run-automation-actions";

/**
 * This step runs automation actions for all validated triggers by emitting events for each action type.
 *
 * @example
 * const data = runAutomationActionsStep({
 *   validated: [
 *     {
 *       isValid: true,
 *       trigger: { id: "trigger_123", name: "Low Stock Alert" },
 *       actions: [{ actionType: "email", ... }]
 *     }
 *   ],
 *   context: { inventory_level: { ... } }
 * })
 */
export const runAutomationActionsStep = createStep(
  runAutomationActionsStepId,
  async (
    input: RunAutomationActionsStepInput,
    { container }
  ): Promise<StepResponse<RunAutomationActionsStepOutput>> => {
    const mpnAutomationService =
      container.resolve<MpnAutomationService>("mpnAutomation");
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    const { validatedTriggers, context } = input;

    if (!validatedTriggers || validatedTriggers.length === 0) {
      return new StepResponse({
        results: [],
        triggersCount: 0,
        totalActionsExecuted: 0,
      });
    }

    const getActionExecutionResults = await Promise.all(
      validatedTriggers.map(async (validatedTrigger) => {
        const isValid = validatedTrigger.isValid
        const trigger = validatedTrigger.trigger
        const actions = validatedTrigger.trigger.actions || []

        if (!isValid || !actions || actions.length === 0) {
          return {
            trigger,
            isValid,
            actionsExecuted: 0,
            actions: [],
          };
        }

        const executedActions = await Promise.all(
          actions.map(async (action) => {
            try {
              if (!action.action_type) {
                throw new MedusaError(
                  MedusaError.Types.INVALID_DATA,
                  "Action type is required"
                );
              }

              const actionHandler = mpnAutomationService.getActionHandler(
                action.action_type
              );

              const getHandler = actionHandler?.handler;
              const isEnabled = actionHandler?.enabled;

              if (!getHandler) {
                throw new MedusaError(
                  MedusaError.Types.NOT_FOUND,
                  `Action handler for "${action.action_type}" not found`
                );
              }

              if (!isEnabled) {
                throw new MedusaError(
                  MedusaError.Types.NOT_FOUND,
                  `Action handler for "${action.action_type}" is disabled`
                );
              }

              return await getHandler.executeAction({
                container,
                trigger,
                action,
                context,
                eventName: `mpn.automation.action.${action.action_type}.executed`,
              });
            } catch (error) {
              logger.info(error.message);

              return error;
            }
          })
        );

        return {
          trigger,
          executedActions: executedActions
        };
      })
    );

    return new StepResponse({
      triggersExecuted: getActionExecutionResults
    });
  }
);
