import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";
import {
  NotificationAction,
  NotificationTrigger,
} from "../../../modules/mpn-automation/types/interfaces";
import MpnAutomationService from "../../../modules/mpn-automation/services/service";
import { MedusaError } from "@medusajs/utils";

export interface RunAutomationActionsStepInput {
  validated: Array<{
    isValid: boolean;
    trigger: NotificationTrigger;
    actions: NotificationAction[];
  }>;
  context: Record<string, any>;
}

export interface RunAutomationActionsStepOutput {
  results: Array<{
    triggerId?: string;
    isValid: boolean;
    actionsExecuted: number;
    actions: Array<{
      actionId?: string;
      actionType?: string | null;
      success: boolean;
    }>;
  }>;
  triggersCount: number;
  totalActionsExecuted: number;
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

    const { validated, context } = input;

    if (!validated || validated.length === 0) {
      return new StepResponse({
        results: [],
        triggersCount: 0,
        totalActionsExecuted: 0,
      });
    }

    const results = await Promise.all(
      validated.map(async (result) => {
        if (!result.isValid || !result.actions || result.actions.length === 0) {
          return {
            triggerId: result.trigger.id || result.trigger.trigger_id,
            isValid: result.isValid,
            actionsExecuted: 0,
            actions: [],
          };
        }

        const executedActions = await Promise.all(
          result.actions.map(async (action) => {
            if (!action.action_type) {
              throw new MedusaError(MedusaError.Types.INVALID_DATA, "Action type is required");
            }

            const actionHandler = mpnAutomationService.getActionHandler(action.action_type);

            if (!actionHandler) {
              throw new MedusaError(MedusaError.Types.NOT_FOUND, `Action handler for "${action.action_type}" not found`);
            }

            return await actionHandler.executeAction({
              action,
              context,
              result,
              container,
              eventName: `mpn.automation.action.${action.action_type}.executed`,
              triggerId: result.trigger.id || result.trigger.trigger_id || "",
            });
          })
        );

        return {
          triggerId: result.trigger.id || result.trigger.trigger_id,
          isValid: result.isValid,
          actions: executedActions,
          actionsExecuted: executedActions.filter((a) => a.success).length,
        };
      })
    );

    const totalActionsExecuted = results.reduce(
      (sum, r) => sum + r.actionsExecuted,
      0
    );

    return new StepResponse({
      results,
      triggersCount: validated.length,
      totalActionsExecuted,
    });
  }
);
